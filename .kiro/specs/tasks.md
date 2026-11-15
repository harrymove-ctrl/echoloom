# Kiro Spec: EchoLoom Implementation Tasks

1. **Linked Backlog**: [`../../docs/epics/EPICS_AND_DAILY_ROADMAP.md`](../../docs/epics/EPICS_AND_DAILY_ROADMAP.md) & [`../../docs/epics/github-epics.json`](../../docs/epics/github-epics.json)
2. **Schedule**: 20 Days (`2026-11-15` through `2026-12-04`)

## 1. Execution Sequence Checklist

| Milestone | Task Group | Related Issues | Target Completion | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Foundation** | Monorepo bootstrap, `/.kiro` specs/hooks, redaction & `harrymove-ctrl` guard | `ISS-01` to `ISS-03` | `2026-11-16` | `[x] Specs & Plan Ready` |
| **Phase 2: Hardened Store** | SQLite WAL + FTS5 (`0600`), Keychain + ACL creds, escaped AST SQL guard, locks | `ISS-04` to `ISS-07` | `2026-11-18` | `[ ] Pending Code` |
| **Phase 3: Owned Bot Ingest** | Official `Bot ` client, `init`, `doctor`, `--channels` backfill, Gateway `tail`, CDN SSRF fix (`PBT 1`) | `ISS-08` to `ISS-11` | `2026-11-20` | `[ ] Pending Code` |
| **Phase 4: External Ingest** | Zero net `wiretap`, `@me` quarantine (`PBT 2`), Chrome/OpenCLI snapshot parser, dedup (`PBT 5`) | `ISS-12` to `ISS-15` | `2026-11-23` | `[ ] Pending Code` |
| **Phase 5: Analytics & Signals** | `today`/`recent`/`search`/`timeline` CLI, `SCHEMA.md` YAML/JSON, PII anonymizer, clusterer | `ISS-16` to `ISS-19` | `2026-11-26` | `[ ] Pending Code` |
| **Phase 6: VoiceGate & MCP** | Owner voice indexer, AI slop/overlap gate (`PBT 3`), `echoloom-mcp`, `confirmLive` governor (`PBT 4`) | `ISS-20` to `ISS-23` | `2026-11-29` | `[ ] Pending Code` |
| **Phase 7: Console & Credits** | `127.0.0.1` Haunted Signal Loom UI, outbound audit timeline & approval drawer, Playwright visual & a11y QA, 4,000 Kiro Credits | `ISS-24` to `ISS-26` | `2026-12-01` | `[ ] Pending Code` |
| **Phase 8: PBT & Final Ship** | Complete 5 PBT suites (`1,000+` iterations each), live URL, `< 3:00` video, Social + Blog bonuses, Devpost | `ISS-27`, `ISS-28` | `2026-12-04` | `[ ] Pending Code` |
