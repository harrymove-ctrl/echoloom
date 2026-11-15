# PRD 3: Voice Gated Content Studio, `stdio` MCP Server & Outbound Governor

1. **Status**: `active`
2. **Last Updated**: `2026-11-15`
3. **Related Master Requirements**: [`./README.md`](./README.md) (`D4`, `D5`)
4. **Related Epics**: `EPIC-06`, `EPIC-07` (`ISS-20` to `ISS-26`)

## 1. Problem & Reference Synthesis

1. Finding insights inside community Discord channels only saves time if an operator can convert anonymized topic clusters into clear, helpful posts for their own Discord server without sounding like an automated bot or accidentally double posting.
2. `Log by ListeningKit` shows three breakthrough mechanisms that solve this problem directly inside AI editors: play based discovery (`getGuide` / `search`), pre send `voiceGate` + `watermarkReadingOf` AI artifact detection, and dry run by default mutation tools requiring explicit `confirmLive: true`.
3. `oblien/mindwire` shows clean multi agent orchestration and sandboxed execution boundaries for running drafting, gating, and web ops visualization safely.

## 2. Functional Requirements

### 2.1 Voice Profile Builder & `voiceGate` Quality Engine
1. **REQ-MOD-01 (Personal Voice Corpus Extraction)**: `echoloom voice index` **MUST** analyze only messages authored by the operator inside their own Discord server (never copying external users' text) to extract structural style signals (median sentence length, paragraph rhythm, greeting/closing habits, code snippet ratio, vocabulary preferences).
2. **REQ-MOD-02 (Deterministic AI Artifact Blocker)**: Every outbound draft **MUST** run `watermarkReadingOf(text)` before leaving preview state, rejecting (`aiArtifacts`): zero width spaces/joiners (`U+200B`, `U+200C`, `U+200D`, `U+FEFF`), em dashes (`U+2014`), en dashes (`U+2013`), spaced hyphens (` - `), HTML tags, and banned boilerplate openers.
3. **REQ-MOD-03 (Voice Alignment & Plagiarism Similarity Gate)**: `voiceGate` **MUST** score drafts against both the owner's tone profile and the external source cluster using n gram overlap checks:
   1. Reject if tone drift falls below configurable threshold (`voiceGateFailed`).
   2. Reject (`plagiarismRisk`) if consecutive word/n gram overlap against any raw external source message exceeds `12` words so external member writing is never echoed verbatim.

### 2.2 Reloadable `stdio` MCP Server (`echoloom-mcp`)
1. **REQ-MOD-04 (Play Discovery Tools)**: `echoloom-mcp` **MUST** register `get_play_guide`, `search_signals`, `get_channel_context`, `score_voice_gate`, `preview_outbound`, and `publish_approved` (over `stdio` for Kiro, Claude Code, Codex, and Cursor).
2. **REQ-MOD-05 (Strict Read/Write Tool Separation & Concurrency Locks)**: Mutating tools **MUST** carry `[LIVE_ACTION]` capability tags, default to returning structured diff previews when `live` or `confirmLive` is omitted/false, and acquire a single writer claim lock (`claim_id`) in SQLite so two agents cannot post duplicate replies to the same question (`ListeningKit` `inbox/claims` pattern).

### 2.3 Dry Run Safety Governor & Digest Workflows
1. **REQ-MOD-06 (Mandatory Governor Rules)**: Outbound Discord publishing via the official Bot API **MUST** enforce:
   1. Explicit approval metadata (`--live --approvedBy <name>` in CLI or `live: true, confirmLive: true` in MCP).
   2. Minimum `5s` cooldown between consecutive messages, capped daily publish quota per owned channel (`default 25/day`), and immediate abort on HTTP `429` or `401/403` with zero automatic retry loops.
   3. Immutable append logging into `outbound_ledger` linking each published message ID back to its source signal cluster and `voiceGate` score.
2. **REQ-MOD-07 (Scheduled Digest Briefings)**: `echoloom digest --hours 24` **MUST** compile a compact daily briefing of top unanswered external questions, suggested post drafts for the owner's channel, and moderation/activity alerts formatted for terminal output, Markdown export, or bot delivery to a private owner admin channel.

### 2.4 Haunted Signal Loom Web Ops Console
1. **REQ-MOD-08 (Local Web Console)**: EchoLoom **MAY** serve an interactive local web dashboard (`127.0.0.1` loopback bound with CSRF token protection) visualizing:
   1. Live signal clusters and source tier badges (`bot_api`, `desktop_wiretap`, `browser_snapshot`).
   2. Draft approval queue showing `voiceGate` check results and one click approve/reject triggers (disabled until human click).
   3. Outbound audit ledger timeline and approval history drawer.
