import type { PaletteName } from '../stickers/fun'

export type StickerId =
  | 'loomVault'
  | 'signalRadar'
  | 'kiroSpecPad'
  | 'safetyLock'
  | 'voiceTuner'
  | 'crewBot'

export type StickerMeta = {
  id: StickerId
  title: string
  motionLabel: string
  role: string
  modulePath: string
}

export const STICKER_SHOWCASE: ReadonlyArray<StickerMeta> = [
  {
    id: 'loomVault',
    title: 'SQLite FTS5 Vault',
    motionLabel: 'hop + tossLag cards',
    role: 'Local 868B SQLite WAL storage reading filtered community threads in under 15ms.',
    modulePath: 'internal/store/sqlite.go',
  },
  {
    id: 'signalRadar',
    title: 'Signal Radar Board',
    motionLabel: 'jolt + slide inbox',
    role: 'Ingests owned channels, local Chromium desktop caches, and DOM snapshots without user tokens.',
    modulePath: 'internal/ingest/wiretap.go',
  },
  {
    id: 'kiroSpecPad',
    title: 'Kiro Spec Compiler',
    motionLabel: 'sway + erase trim',
    role: 'Turns clustered community questions into structured requirements, design docs, and daily tasks.',
    modulePath: '.kiro/specs/design.md',
  },
  {
    id: 'safetyLock',
    title: 'ConfirmLive Governor',
    motionLabel: 'clasp + shackle lock',
    role: 'Isolates personal DMs by schema and blocks every outbound action unless human approval is set.',
    modulePath: 'src/mcp/governor.ts',
  },
  {
    id: 'voiceTuner',
    title: 'VoiceGate Anti Slop',
    motionLabel: 'bob + 3 fader slide',
    role: 'Rejects AI filler phrases, banned dash punctuation, and high verbatim source overlap.',
    modulePath: 'src/voice/voiceGate.ts',
  },
  {
    id: 'crewBot',
    title: '4 Agent Kiro Crew',
    motionLabel: 'wobble + look clip',
    role: 'Coordinates collector, synthesizer, composer, and safety specialists behind repo hook gates.',
    modulePath: '.kiro/hooks/hooks.json',
  },
]

export const PALETTE_LABELS: ReadonlyArray<{ id: PaletteName | 'cobalt'; label: string; dotA: string; dotB: string }> = [
  { id: 'riso', label: 'Riso', dotA: '#ff58a8', dotB: '#15b9a6' },
  { id: 'cobalt', label: 'Cobalt', dotA: '#3565f5', dotB: '#0f172a' },
  { id: 'matcha', label: 'Matcha', dotA: '#6cc46f', dotB: '#1f6b55' },
  { id: 'sunset', label: 'Sunset', dotA: '#ff7a3d', dotB: '#6b2d91' },
  { id: 'candy', label: 'Candy', dotA: '#b49bff', dotB: '#6a5cff' },
  { id: 'aqua', label: 'Aqua', dotA: '#22c3d3', dotB: '#0f5f73' },
]

export type ModalityId = 'discord' | 'wiretap' | 'dom' | 'kiroIde' | 'kiroCli' | 'kiroCrew'

export const MODALITIES: ReadonlyArray<{ id: ModalityId; label: string; summary: string; defaultCluster: string }> = [
  {
    id: 'discord',
    label: 'Discord Forum',
    summary: 'Owned community channels sync incremental threads into FTS5 while @me DMs remain isolated by schema.',
    defaultCluster: 'handoff',
  },
  {
    id: 'wiretap',
    label: 'Desktop Wiretap',
    summary: 'Read only os.OpenRoot scanner indexes passive Chromium caches locally with zero API traffic.',
    defaultCluster: 'blast',
  },
  {
    id: 'dom',
    label: 'Browser Snapshot',
    summary: 'Structured accessibility DOM adapters capture public forum threads without reading LocalStorage tokens.',
    defaultCluster: 'mcp',
  },
  {
    id: 'kiroIde',
    label: 'Kiro IDE',
    summary: 'Interactive studio traces each cluster straight into /.kiro/specs/ requirements and verification criteria.',
    defaultCluster: 'handoff',
  },
  {
    id: 'kiroCli',
    label: 'Kiro CLI 3.2',
    summary: 'Single stdio JSON envelope exports topic clusters cleanly for external ACP editors and CI hooks.',
    defaultCluster: 'mcp',
  },
  {
    id: 'kiroCrew',
    label: 'Kiro Crew',
    summary: 'Four role isolated specialists keep blast radius capped and assert disk changes before finishing.',
    defaultCluster: 'blast',
  },
]

export type SignalCluster = {
  id: string
  badge: string
  title: string
  channelMeta: string
  authorHandle: string
  timestamp: string
  latencyMs: number
  sourceTier: string
  specPath: string
  digestHash: string
  questionBody: string
  specSummary: string
  requirements: ReadonlyArray<string>
  cliCommand: string
  draftReply: string
  voiceScore: string
  overlapWords: number
  invariantTag: string
}

export const SIGNAL_CLUSTERS: ReadonlyArray<SignalCluster> = [
  {
    id: 'handoff',
    badge: 'Context Loss',
    title: 'Cross agent session handoff continuity',
    channelMeta: 'Community Forum · Architecture',
    authorHandle: '@cloud_builder',
    timestamp: '2m ago',
    latencyMs: 6.4,
    sourceTier: 'desktop_wiretap',
    specPath: '.kiro/specs/handoff-ledger.md',
    digestHash: '0x8832b9f823ea644bda30ec870052303a76b0f12cae85d672fe769247c7e4158f',
    questionBody:
      'Teams prototype with one coding agent on a remote VM and lose tool state when resuming work inside Kiro IDE locally.',
    specSummary:
      'Store portable thread evidence and acceptance assertions inside /.kiro/specs/ so any IDE, CLI, or Crew agent picks up full context immediately.',
    requirements: [
      'REQ-01: Index anonymized question clusters with FTS5 and deterministic IDs.',
      'REQ-02: Emit replayable acceptance criteria under /.kiro/specs/ before coding.',
      'REQ-03: Block personal @me DM tables across default query and MCP paths.',
    ],
    cliCommand: 'echoloom signals --cluster session-handoff --json',
    draftReply:
      'Publish the problem cluster as a portable /.kiro/specs/ checkpoint paired with a local stdio MCP server so switching from cloud VM to local IDE preserves every invariant.',
    voiceScore: 'PASS · 0 banned marks',
    overlapWords: 3,
    invariantTag: 'INV-02 + INV-05',
  },
  {
    id: 'blast',
    badge: 'Blast Radius',
    title: 'Autonomous CI repair diff guardrails',
    channelMeta: 'Community Forum · CI/CD Automation',
    authorHandle: '@infra_runner',
    timestamp: '18m ago',
    latencyMs: 8.1,
    sourceTier: 'browser_snapshot',
    specPath: '.kiro/specs/blast-governor.md',
    digestHash: '0x49c1a7d02be8f4e119a60c38712dd9b044f5c7a22819b041c3a8d6f9e1027b4e',
    questionBody:
      'Sixty repair runs hit 83.3% unattended when editing up to 81 lines versus 90.0% pass rate when constrained to 5 line hunks.',
    specSummary:
      'Enforce explicit dry run diff previews, lease locks, and confirmLive approval gates before any automated repair writes outward.',
    requirements: [
      'INV-04: Never execute live outbound calls unless confirmLive and approvedBy are set.',
      'HOOK-02: Verify modified files exist on disk before an agent claims completion.',
      'PBT-1000: Fuzz flag permutations across CLI and MCP dry run boundaries.',
    ],
    cliCommand: 'echoloom compile --cluster blast-radius --dry-run',
    draftReply:
      'Cap each autonomous pass to verified hunk boundaries behind a mandatory confirmLive preview and run disk existence hooks so broad unplanned edits cannot ship silently.',
    voiceScore: 'PASS · 0 banned marks',
    overlapWords: 4,
    invariantTag: 'INV-04',
  },
  {
    id: 'mcp',
    badge: 'MCP Wiring',
    title: 'Project local stdio MCP and hot reload',
    channelMeta: 'Community Forum · Tooling',
    authorHandle: '@mcp_tinkerer',
    timestamp: '1h ago',
    latencyMs: 5.9,
    sourceTier: 'owned_bot_api',
    specPath: '.kiro/specs/mcp-stdio-bridge.md',
    digestHash: '0xc7f03e1249ab907d52e81b66c3a14f902d746e8851bc3a2947f80612d39c881a',
    questionBody:
      'Global MCP config edits require frequent restarts, and subagents miss updated project tools unless bound locally over stdio.',
    specSummary:
      'Expose hot reloading echoloom-mcp over project stdio with strict HTTPS CDN allowlists and zero restart schema discovery.',
    requirements: [
      'INV-01: Allow attachment fetches only over HTTPS port 443 Discord CDN hosts.',
      'MCP-01: Expose echoloom_search, echoloom_compile, and echoloom_publish over stdio.',
      'INV-03: Gate generated drafts through voiceGate before preview rendering.',
    ],
    cliCommand: 'echoloom mcp --project-root . --stdio',
    draftReply:
      'Bind a workspace local stdio server in .kiro/settings/mcp.json with hot reload watching built tools so every Kiro Crew specialist sees schema updates right away.',
    voiceScore: 'PASS · 0 banned marks',
    overlapWords: 2,
    invariantTag: 'INV-01 + INV-03',
  },
]

export const STRESS_FIXTURE: SignalCluster = {
  id: 'stress',
  badge: 'LONGEST VALUE STRESS',
  title:
    'Deterministic cross workspace spec handoff invariant verification under maximum length channel metadata and unbroken SHA256 digest payloads',
  channelMeta: 'Stress Fixture · Maximum Realistic Payload Geometry Check · 120+ Chars',
  authorHandle: '@longest_realistic_community_contributor_handle_verification_account',
  timestamp: '0s ago',
  latencyMs: 14.8,
  sourceTier: 'multi_tier_merged_wal',
  specPath: '.kiro/specs/feat/cross-agent-session-handoff-blast-radius-governor-pbt-spec-v2.md',
  digestHash: '0x99887766554433221100ffeeddccbbaa99887766554433221100ffeeddccbbaa',
  questionBody:
    'Verifying that long unbroken technical specifications, deep spec filenames, and full 66 character hexadecimal digest strings truncate cleanly as single line pills without expanding viewport horizontal scrollWidth.',
  specSummary:
    'All containers keep overflow hidden, long paths use middle or end truncation cleanly, and 66 character hashes render as copyable monospace pills with full tooltips.',
  requirements: [
    'GEOM-01: Zero horizontal document overflow across desktop 1440px and mobile 390px.',
    'GEOM-02: Truncated pill preserves 1px border spacing and full accessible title.',
    'GEOM-03: Primary buttons remain >= 40px touch height under stress text.',
  ],
  cliCommand: 'echoloom verify --stress-longest-realistic-values --strict-geometry',
  draftReply:
    'Format long workspace identifiers and 66 character digests as single line truncated monospace pills with copy actions so mobile and narrow studio panels stay balanced.',
  voiceScore: 'PASS · 0 overflow px',
  overlapWords: 0,
  invariantTag: 'INV-01..INV-05',
}

export type InvariantCard = {
  id: string
  title: string
  contract: string
  blockedSample: string
  iterations: number
}

export const INVARIANTS: ReadonlyArray<InvariantCard> = [
  {
    id: 'INV-01',
    title: 'Attachment SSRF Guard',
    contract: 'Fetches media only from allowlisted Discord CDN hosts over HTTPS port 443 with max 3 redirects.',
    blockedSample: 'http://169.254.169.254/latest/meta-data -> BLOCKED',
    iterations: 1000,
  },
  {
    id: 'INV-02',
    title: '@me DM Quarantine',
    contract: 'Search, topic clusters, and MCP tools return zero rows whenever guild_id equals @me.',
    blockedSample: 'SELECT * WHERE guild_id = "@me" -> 0 ROWS',
    iterations: 1000,
  },
  {
    id: 'INV-03',
    title: 'VoiceGate Anti Slop',
    contract: 'Blocks hidden zero width chars, dashed punctuation, raw HTML tags, and > 12 word verbatim spans.',
    blockedSample: '14 word verbatim quote or em dash -> REJECTED',
    iterations: 1000,
  },
  {
    id: 'INV-04',
    title: 'ConfirmLive Governor',
    contract: 'Outbound transport requires live: true, confirmLive: true, and a non empty approvedBy handle.',
    blockedSample: '{ live: true, confirmLive: false } -> DRY RUN ONLY',
    iterations: 1000,
  },
  {
    id: 'INV-05',
    title: 'Cross Tier Idempotency',
    contract: 'Replaying shuffled Bot API, cache, and DOM snapshots yields identical SQLite row and FTS5 counts.',
    blockedSample: 'Permuted 3 tier replay -> EQUAL CHECKSUM',
    iterations: 1000,
  },
]
