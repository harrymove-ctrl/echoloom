#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const EPICS_JSON_PATH = path.join(PROJECT_ROOT, 'docs', 'epics', 'github-epics.json');
const EXPECTED_LOGIN = 'harrymove-ctrl';

function parseArgs(argv) {
  const opts = {
    dryRun: false,
    createRepo: false,
    visibility: 'public',
    repo: '',
    push: false,
    updateExisting: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--create-repo') opts.createRepo = true;
    else if (arg === '--public') opts.visibility = 'public';
    else if (arg === '--private') opts.visibility = 'private';
    else if (arg === '--push') opts.push = true;
    else if (arg === '--update-existing') opts.updateExisting = true;
    else if (arg === '--repo' && argv[i + 1]) {
      opts.repo = argv[i + 1].trim();
      i += 1;
    } else if (arg === '--help' || arg === '-h') {
      console.log(
        [
          'Usage: node scripts/sync-github-epics.mjs [options]',
          '',
          'Options:',
          '  --dry-run             Validate epics JSON and print planned GitHub operations without API calls',
          '  --repo <owner/name>   Target GitHub repository (for example: harrymove-ctrl/echoloom)',
          '  --create-repo         Create the GitHub repository under harrymove-ctrl if it does not exist',
          '  --public | --private  Repository visibility when --create-repo is passed (default: public)',
          '  --push                Commit/push local main branch before creating milestones and issues',
          '  --update-existing     Patch existing milestone descriptions and issue bodies/titles in place',
        ].join('\n')
      );
      process.exit(0);
    }
  }
  return opts;
}

function loadSpec() {
  if (!fs.existsSync(EPICS_JSON_PATH)) {
    throw new Error(`Missing epics spec file: ${EPICS_JSON_PATH}`);
  }
  const spec = JSON.parse(fs.readFileSync(EPICS_JSON_PATH, 'utf8'));
  if (!Array.isArray(spec.milestones) || !Array.isArray(spec.epics)) {
    throw new Error('github-epics.json must contain milestones and epics arrays');
  }
  return spec;
}

function validateSpec(spec) {
  const milestoneMap = new Map(spec.milestones.map((m) => [m.id, m]));
  let totalIssues = 0;
  for (const epic of spec.epics) {
    if (!milestoneMap.has(epic.milestone)) {
      throw new Error(`Epic ${epic.id} references unknown milestone ${epic.milestone}`);
    }
    if (!Array.isArray(epic.issues) || epic.issues.length === 0) {
      throw new Error(`Epic ${epic.id} must define at least one child issue`);
    }
    totalIssues += epic.issues.length;
  }
  return {
    labels: spec.labels.length,
    milestones: spec.milestones.length,
    epics: spec.epics.length,
    issues: totalIssues,
  };
}

function run(cmd, args, cwd = PROJECT_ROOT) {
  return execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function enforceIdentity() {
  const ghLogin = run('gh', ['api', 'user', '--jq', '.login']);
  if (ghLogin !== EXPECTED_LOGIN) {
    throw new Error(`Expected GitHub login ${EXPECTED_LOGIN}, got ${ghLogin}`);
  }
  const gitUser = run('git', ['config', 'user.name']);
  if (gitUser !== EXPECTED_LOGIN) {
    throw new Error(`Expected git config user.name ${EXPECTED_LOGIN}, got ${gitUser}`);
  }
}

function ensureRepo(repo, visibility, createRepo) {
  if (!repo || !repo.startsWith('harrymove-ctrl/')) {
    throw new Error(`Target --repo must belong to harrymove-ctrl (got "${repo || 'empty'}")`);
  }
  const check = spawnSync('gh', ['repo', 'view', repo, '--json', 'name,visibility,url'], {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
  });
  if (check.status === 0) {
    return JSON.parse(check.stdout);
  }
  if (!createRepo) {
    throw new Error(`Repository ${repo} does not exist yet. Re-run with --create-repo to create it.`);
  }
  run('gh', [
    'repo',
    'create',
    repo,
    visibility === 'private' ? '--private' : '--public',
    '--description',
    'Local first Discord signal vault, read only browser/cache collector, voice gated studio, and Kiro Crew MCP server',
  ]);
  return JSON.parse(run('gh', ['repo', 'view', repo, '--json', 'name,visibility,url']));
}

function sleepMs(ms) {
  if (ms <= 0) return;
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function ensureLabels(repo, labels) {
  const existingRaw = run('gh', ['api', `repos/${repo}/labels?per_page=100`]);
  const existing = new Set(JSON.parse(existingRaw).map((l) => l.name.toLowerCase()));
  for (const label of labels) {
    if (existing.has(label.name.toLowerCase())) continue;
    run('gh', [
      'api',
      '--method',
      'POST',
      `repos/${repo}/labels`,
      '-f',
      `name=${label.name}`,
      '-f',
      `color=${label.color}`,
      '-f',
      `description=${label.description}`,
    ]);
  }
}

function ensureMilestones(repo, milestones, updateExisting = false) {
  const existingRaw = run('gh', ['api', `repos/${repo}/milestones?state=all&per_page=100`]);
  const existing = new Map(JSON.parse(existingRaw).map((m) => [m.title, m]));
  const result = new Map();
  for (const m of milestones) {
    if (existing.has(m.title)) {
      const current = existing.get(m.title);
      if (
        updateExisting &&
        (current.description !== m.description || current.due_on !== m.dueOn)
      ) {
        run('gh', [
          'api',
          '--method',
          'PATCH',
          `repos/${repo}/milestones/${current.number}`,
          '-f',
          `title=${m.title}`,
          '-f',
          `due_on=${m.dueOn}`,
          '-f',
          `description=${m.description}`,
        ]);
        sleepMs(500);
        console.log(`Updated Milestone #${current.number}: ${m.title}`);
      }
      result.set(m.id, current.number);
      continue;
    }
    const created = JSON.parse(
      run('gh', [
        'api',
        '--method',
        'POST',
        `repos/${repo}/milestones`,
        '-f',
        `title=${m.title}`,
        '-f',
        `due_on=${m.dueOn}`,
        '-f',
        `description=${m.description}`,
      ])
    );
    result.set(m.id, created.number);
  }
  return result;
}

function listExistingIssues(repo) {
  const raw = run('gh', [
    'issue',
    'list',
    '--repo',
    repo,
    '--state',
    'all',
    '--limit',
    '200',
    '--json',
    'number,title,body,url',
  ]);
  const byTitle = new Map();
  const byTag = new Map();
  for (const issue of JSON.parse(raw)) {
    byTitle.set(issue.title, issue);
    const match = /^\[([A-Z]+-\d+)\]\s/.exec(issue.title);
    if (match) {
      byTag.set(match[1], issue);
    }
  }
  return { byTitle, byTag };
}

function updateIssue(repo, number, title, body, labels, milestoneNumber) {
  const args = [
    'api',
    '--method',
    'PATCH',
    `repos/${repo}/issues/${number}`,
    '-f',
    `title=${title}`,
    '-f',
    `body=${body}`,
    '-F',
    `milestone=${milestoneNumber}`,
  ];
  for (const label of labels) {
    args.push('-f', `labels[]=${label}`);
  }
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const res = spawnSync('gh', args, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (res.status === 0) {
      sleepMs(750);
      return JSON.parse(res.stdout.trim());
    }
    const errText = `${res.stderr || ''}\n${res.stdout || ''}`;
    const isRateLimit = /secondary rate limit|HTTP 403/i.test(errText);
    if (attempt < maxAttempts && isRateLimit) {
      console.error(`Rate limit or 403 hit updating #${number}; retrying in 15s (attempt ${attempt}/${maxAttempts})...`);
      sleepMs(15000);
      continue;
    }
    throw new Error(`Failed updating issue #${number}: ${errText.trim()}`);
  }
  throw new Error(`Exhausted attempts updating issue #${number}`);
}

function createIssue(repo, title, body, labels, milestoneNumber) {
  const args = [
    'api',
    '--method',
    'POST',
    `repos/${repo}/issues`,
    '-f',
    `title=${title}`,
    '-f',
    `body=${body}`,
    '-F',
    `milestone=${milestoneNumber}`,
  ];
  for (const label of labels) {
    args.push('-f', `labels[]=${label}`);
  }
  const maxAttempts = 4;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const res = spawnSync('gh', args, {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    if (res.status === 0) {
      sleepMs(750);
      return JSON.parse(res.stdout.trim());
    }
    const errText = `${res.stderr || ''}\n${res.stdout || ''}`;
    const isRateLimit = /secondary rate limit|HTTP 403/i.test(errText);
    if (attempt < maxAttempts && isRateLimit) {
      console.error(`Rate limit or 403 hit creating "${title}"; retrying in 15s (attempt ${attempt}/${maxAttempts})...`);
      sleepMs(15000);
      continue;
    }
    throw new Error(`Failed creating issue "${title}": ${errText.trim()}`);
  }
  throw new Error(`Exhausted attempts creating issue "${title}"`);
}

function formatChildBody(issue, epic, epicNumber) {
  const criteriaLines = issue.acceptanceCriteria.map((c, idx) => `${idx + 1}. ${c}`).join('\n');
  return [
    `Part of **${epic.id}** (#${epicNumber}) | Target Day: \`${issue.day}\` | Phase: \`${issue.milestoneLabel}\``,
    '',
    '### Problem',
    issue.problem,
    '',
    '### Desired Behavior',
    issue.desiredBehavior,
    '',
    '### Entry Points',
    issue.entryPoints.map((p, idx) => `${idx + 1}. \`${p}\``).join('\n'),
    '',
    '### Acceptance Criteria',
    criteriaLines,
    '',
    '### Verification & PBT Gate',
    issue.verification,
  ].join('\n');
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const spec = loadSpec();
  const counts = validateSpec(spec);

  if (opts.dryRun) {
    console.log(
      JSON.stringify(
        {
          mode: 'dry-run',
          defaultSuggestedRepo: spec.defaultRepo,
          counts,
          milestones: spec.milestones.map((m) => ({ id: m.id, title: m.title, dueOn: m.dueOn })),
          epics: spec.epics.map((e) => ({
            id: e.id,
            title: e.title,
            milestone: e.milestone,
            issueCount: e.issues.length,
          })),
        },
        null,
        2
      )
    );
    return;
  }

  enforceIdentity();
  const targetRepo = opts.repo || spec.defaultRepo;
  const repoInfo = ensureRepo(targetRepo, opts.visibility, opts.createRepo);

  if (opts.push) {
    const remotes = run('git', ['remote']);
    if (!remotes.split('\n').includes('origin')) {
      run('git', ['remote', 'add', 'origin', `https://github.com/${targetRepo}.git`]);
    }
    run('git', ['push', '-u', 'origin', 'main']);
  }

  ensureLabels(targetRepo, spec.labels);
  const milestoneNumbers = ensureMilestones(targetRepo, spec.milestones, opts.updateExisting);
  const { byTitle, byTag } = listExistingIssues(targetRepo);

  for (const epic of spec.epics) {
    const mNum = milestoneNumbers.get(epic.milestone);
    const epicTitle = `[${epic.id}] ${epic.title}`;
    const epicBody = [
      `### Overview`,
      epic.summary,
      '',
      `### PRDs`,
      epic.prds.map((p, idx) => `${idx + 1}. \`${p}\``).join('\n'),
    ].join('\n');
    const epicLabels = ['epic', ...epic.labels];
    let epicIssue = byTitle.get(epicTitle) || byTag.get(epic.id);
    if (!epicIssue) {
      epicIssue = createIssue(targetRepo, epicTitle, epicBody, epicLabels, mNum);
      byTitle.set(epicTitle, epicIssue);
      byTag.set(epic.id, epicIssue);
      console.log(`Created ${epicTitle} -> #${epicIssue.number}`);
    } else if (
      opts.updateExisting &&
      (epicIssue.title !== epicTitle || (epicIssue.body || '').trim() !== epicBody.trim())
    ) {
      epicIssue = updateIssue(targetRepo, epicIssue.number, epicTitle, epicBody, epicLabels, mNum);
      byTitle.set(epicTitle, epicIssue);
      byTag.set(epic.id, epicIssue);
      console.log(`Updated ${epicTitle} -> #${epicIssue.number}`);
    }

    for (const child of epic.issues) {
      const childTitle = `[${child.id}] ${child.title}`;
      const body = formatChildBody(child, epic, epicIssue.number);
      const existingChild = byTitle.get(childTitle) || byTag.get(child.id);
      if (!existingChild) {
        const created = createIssue(targetRepo, childTitle, body, child.labels, mNum);
        byTitle.set(childTitle, created);
        byTag.set(child.id, created);
        console.log(`  Created ${childTitle} -> #${created.number}`);
      } else if (
        opts.updateExisting &&
        (existingChild.title !== childTitle || (existingChild.body || '').trim() !== body.trim())
      ) {
        const updated = updateIssue(targetRepo, existingChild.number, childTitle, body, child.labels, mNum);
        byTitle.set(childTitle, updated);
        byTag.set(child.id, updated);
        console.log(`  Updated ${childTitle} -> #${updated.number}`);
      }
    }
  }

  console.log(`Completed sync to ${repoInfo.url}`);
}

main();
