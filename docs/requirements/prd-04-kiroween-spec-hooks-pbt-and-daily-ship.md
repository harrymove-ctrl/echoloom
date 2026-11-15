# PRD 4: Kiroween 2026 Architecture, Kiro Crew, PBT & Daily Ship

1. **Status**: `active`
2. **Last Updated**: `2026-11-15`
3. **Related Master Requirements**: [`./README.md`](./README.md) (`D6`, `D7`)
4. **Related Epics**: `EPIC-01`, `EPIC-07`, `EPIC-08` (`ISS-01` to `ISS-03`, `ISS-24` to `ISS-28`)

## 1. Competition Fit & Scoring Alignment

1. **Primary Track (`Frankenstein`)**: EchoLoom stitches four distinct systems into one cohesive local agent studio: Go `discrawl` hardened SQLite + `os.OpenRoot` desktop cache scanner, `OpenCLI` + Chrome DevTools browser DOM snapshot adapter, `discord-cli` `--json`/`--yaml` terminal analytics, and `ListeningKit`'s MCP `voiceGate` + `confirmLive` safety governor, dressed in a subtle spooky Signal Loom terminal and web ops theme.
2. **Bonus Targets**: `Best Kiro Crew App` (4 coordinated Kiro Crew agents), `Best Demo` (`< 3:00` YouTube film), `Social Blitz Prize` (`#KiroweenHackathon26`), `Bonus Blog Prize`, and `Best Startup Project`.
3. **Hard Disqualification Gates**: Public GitHub repository (`harrymove-ctrl`) with top level MIT `LICENSE`, non gitignored root `/.kiro/{specs,hooks,steering}` directory, live working application URL + reproducible setup instructions, `< 3:00` public YouTube video, and an 8 section Kiro technical write up.

## 2. Requirements Across All 8 Kiro Judging Criteria

### 2.1 Kiro Surfaces & Custom Agents (`Kiro Crew`)
1. **REQ-KIR-01 (Multi Surface Workflow)**: Development **MUST** exercise Kiro IDE (spec authoring & visual editing), Kiro CLI (automated test hooks & terminal queries), Kiro Web, and Kiro Crew multi agent runs, recording concrete observations per surface for the final Devpost write up.
2. **REQ-KIR-02 (Four Role Bounded Custom Agents)**: `.kiro/agents/` (documented in steering & specs) **MUST** define four non overlapping crew roles:
   1. `signal-collector`: Runs safe read only `bot_api` / `wiretap` / `browser_snapshot` ingestion.
   2. `topic-synthesizer`: Runs anonymization and clusters external pain points into structured briefs.
   3. `voice-composer`: Drafts original posts in the owner's style and verifies zero AI artifacts or plagiarism overlap.
   4. `safety-governor`: Audits permissions, SSRF rules, `@me` isolation, and dry run `confirmLive` approval before releasing writes.

### 2.2 Specs, Steering Documents & Agent Hooks (`/.kiro/`)
1. **REQ-KIR-03 (Root `/.kiro` Preservation Gate)**: `.gitignore` **MUST NEVER** match `.kiro`, `.kiro/specs`, `.kiro/hooks`, or `.kiro/steering`. An automated pre commit hook and CI check **MUST** assert `git check-ignore .kiro` exits cleanly with no match.
2. **REQ-KIR-04 (Automated Kiro Hooks)**: `.kiro/hooks/hooks.json` **MUST** configure automated workflows triggering on file save / commit:
   1. Zero dashes prose & privacy scanner (`scripts/check-prose.mjs`).
   2. Property Based Testing runner whenever storage, URL validation, or governor files change.
   3. Spec to task drift check ensuring all implemented modules map back to `.kiro/specs/tasks.md`.

### 2.3 MCP Extensions & Property Based Testing (`PBT`)
1. **REQ-KIR-05 (Live Kiro MCP Integration)**: Development **MUST** consume both Chrome DevTools MCP (`chrome-devtools-mcp`) for browser capture/visual testing and EchoLoom's own `echoloom-mcp` server inside Kiro IDE/CLI.
2. **REQ-KIR-06 (Five Mandatory Property Based Test Suites)**: EchoLoom **MUST** ship generative/fuzz Property Based Tests (`fast-check` in TypeScript and `rapid` / `testing/quick` in Go) verifying five core invariants across `>= 1,000` random inputs each:
   1. **PBT 1 (Attachment URL SSRF Invariant)**: Random schemes, IPv4/IPv6 loopback literals, credentials in URLs, port overrides, and redirect targets NEVER pass `validateDiscordCDNUrl` unless `https` port `443` targeting allowlisted Discord CDN hosts.
   2. **PBT 2 (`@me` DM Isolation Invariant)**: Random interleavings of `@me` DM messages and guild messages NEVER appear in default `search`, `signals`, `drafts`, or `mcp` read outputs.
   3. **PBT 3 (`voiceGate` AI Slop & Plagiarism Invariant)**: Generated texts containing injected zero width characters, em/en dashes, spaced hyphens, HTML fragments, or `> 12` consecutive source words ALWAYS fail `voiceGate` before `confirmLive`.
   4. **PBT 4 (Dry Run Governor Invariant)**: Arbitrary combinations of flags without valid (`live: true` AND `confirmLive: true` AND non empty `approvedBy`) NEVER invoke the Discord write transport across `1,000` fuzz runs.
   5. **PBT 5 (Ingest Idempotency Invariant)**: Replaying shuffled, duplicate, or edited event streams across `bot_api`, `desktop_wiretap`, and `browser_snapshot` produces identical `messages` row counts and deterministic FTS5 search state.

### 2.4 Daily Shipping Cadence (`Nov 15` to `Dec 4, 2026`) & Demo Delivery
1. **REQ-KIR-07 (20 Day Daily Atomic Commit Cadence)**: From `2026-11-15` through `2026-12-04`, each daily work slice **MUST** close one focused issue (`ISS-01` to `ISS-28`), run its automated tests, commit via `harrymove-ctrl`, and update GitHub milestone checklists accurately.
2. **REQ-KIR-08 (Kiro Credits & Final Gates)**: Submit the 4,000 free Kiro Credits form before `2026-12-01`, complete Playwright desktop and mobile visual and accessibility verification on `2026-12-02`, record the `< 3:00` YouTube demo film on `2026-12-03`, and submit on Devpost by `2026-12-04`.
