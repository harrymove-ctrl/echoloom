#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', '.cache', 'dist', 'build']);

function collectMarkdownFiles() {
  const targets = [];
  for (const name of ['README.md', 'AGENTS.md']) {
    const abs = path.join(ROOT_DIR, name);
    if (fs.existsSync(abs)) targets.push(abs);
  }
  for (const dirName of ['docs', '.kiro']) {
    const startDir = path.join(ROOT_DIR, dirName);
    if (!fs.existsSync(startDir)) continue;
    const stack = [startDir];
    while (stack.length > 0) {
      const current = stack.pop();
      const entries = fs.readdirSync(current, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory()) {
          if (!SKIP_DIRS.has(entry.name)) {
            stack.push(path.join(current, entry.name));
          }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          targets.push(path.join(current, entry.name));
        }
      }
    }
  }
  targets.sort();
  return targets;
}

function stripInlineCode(line) {
  return line.replace(/`[^`]*`/g, '``');
}

function scanFile(filePath) {
  const rel = path.relative(ROOT_DIR, filePath);
  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  const issues = [];
  let inFence = false;

  for (let idx = 0; idx < lines.length; idx += 1) {
    const line = lines[idx];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const lineNo = idx + 1;
    if (/\u2014/.test(line)) {
      issues.push(`${rel}:${lineNo}: em dash found`);
    }
    if (/\u2013/.test(line)) {
      issues.push(`${rel}:${lineNo}: en dash found`);
    }
    if (/^\s*---\s*$/.test(line)) {
      issues.push(`${rel}:${lineNo}: horizontal rule found`);
    }
    if (/^\s*-\s+/.test(line)) {
      issues.push(`${rel}:${lineNo}: unordered dash bullet found`);
    }
    const proseOnly = stripInlineCode(line);
    if (/\s-\s/.test(proseOnly)) {
      issues.push(`${rel}:${lineNo}: spaced hyphen found in prose`);
    }
  }
  return issues;
}

function main() {
  const files = collectMarkdownFiles();
  const allIssues = [];
  for (const filePath of files) {
    allIssues.push(...scanFile(filePath));
  }
  if (allIssues.length > 0) {
    for (const issue of allIssues) {
      console.error(issue);
    }
    console.error(`FAILED: ${allIssues.length} prose formatting issue(s) across ${files.length} Markdown files.`);
    process.exit(1);
  }
  console.log(`PASS: ${files.length} Markdown files verified clean with zero prose violations.`);
}

main();
