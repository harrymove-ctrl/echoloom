# EchoLoom

**Local first Discord & Community Signal Vault, Voice Gated Content Studio, and `stdio` MCP Server built for personal daily Discord workflows and Kiroween 2026.**

1. **Live Landing Page & Interactive Workbench**: [`https://harrymove-ctrl.github.io/echoloom/`](https://harrymove-ctrl.github.io/echoloom/) (`./public`)
2. **Primary Kiroween Category**: `Frankenstein`
3. **Targeted Bonuses**: `Best Kiro Crew App`, `Best Demo`, `Social Blitz Prize`, `Bonus Blog Prize`, `Best Startup Project`
4. **Architecture Ancestors**:
   1. `openclaw/discrawl`: Hardened pure Go SQLite FTS5 indexing, OS Keychain & `O_NOFOLLOW` ACL checks, `@me` DM isolation, and zero network `wiretap` cache reads.
   2. `jackwener/discord-cli`: Terminal analytics commands (`today`, `recent`, `search`, `top`, `timeline`) and deterministic `{ ok, schema_version, data | error }` output contracts (user token extractor intentionally omitted).
   3. `jackwener/OpenCLI` & Chrome DevTools MCP: Read only browser tab DOM snapshot ingestion for non owned community channels without scraping auth tokens.
   4. `matthewdonsemail-lab/log` (ListeningKit): `< 15 ms` local read layer, hot reloading `stdio` MCP server, `voiceGate` anti AI slop filter, and `confirmLive` dry run outbound safety governor.
   5. `oblien/mindwire`: Multi agent harness orchestration and sandbox isolation patterns.

## 1. Documentation & Planning Suite

| Document | Role | Location |
| :--- | :--- | :--- |
| **Product Vision & PRD Index** | Master requirements, locked decisions (`D1` to `D7`), KPIs, and scope boundaries | [`docs/requirements/README.md`](./docs/requirements/README.md) |
| **PRD 1: Safe Multi Source Ingestion** | Official Bot sync/tail, passive `wiretap` cache reader, browser DOM snapshot adapter, SSRF allowlist | [`docs/requirements/prd-01-safe-multi-source-ingestion.md`](./docs/requirements/prd-01-safe-multi-source-ingestion.md) |
| **PRD 2: Local Knowledge & Signal Engine** | SQLite WAL + FTS5 schema, `discord-cli` analytics UX, external PII anonymizer, topic clustering | [`docs/requirements/prd-02-local-knowledge-and-signal-engine.md`](./docs/requirements/prd-02-local-knowledge-and-signal-engine.md) |
| **PRD 3: VoiceGate, MCP & Ops Console** | Owner voice profile, AI artifact blocker, `echoloom-mcp`, `confirmLive` governor, web console | [`docs/requirements/prd-03-voice-gated-content-studio-and-mcp.md`](./docs/requirements/prd-03-voice-gated-content-studio-and-mcp.md) |
| **PRD 4: Kiroween, Kiro Crew & PBT** | Kiro IDE/CLI/Web/Crew architecture, 5 generative PBT suites, `< 3:00` video & Devpost gates | [`docs/requirements/prd-04-kiroween-spec-hooks-pbt-and-daily-ship.md`](./docs/requirements/prd-04-kiroween-spec-hooks-pbt-and-daily-ship.md) |
| **Epics, 28 Issues & 20 Day Schedule** | Full backlog (`EPIC-01` to `EPIC-08`, `ISS-01` to `ISS-28`) & daily build plan (`Nov 15` to `Dec 4`) | [`docs/epics/EPICS_AND_DAILY_ROADMAP.md`](./docs/epics/EPICS_AND_DAILY_ROADMAP.md) |
| **Non Owned Channel Playbook** | Practical macOS setup for crawling Discord channels you do not administer without ToS bans | [`docs/NON_OWNED_CHANNEL_GUIDE.md`](./docs/NON_OWNED_CHANNEL_GUIDE.md) |
| **Mandatory Kiro Root Artifacts** | Committed Kiro specs, steering documents, and automated quality/PBT hooks | [`./.kiro/`](./.kiro/) |

## 2. Quick Verification & GitHub Epics Sync

1. Preview planned GitHub labels, 4 milestones, 8 epics, and 28 issues without touching GitHub:

```bash
node scripts/sync-github-epics.mjs --dry-run
```

2. Verify `/.kiro` is never ignored by Git:

```bash
git check-ignore -v .kiro .kiro/specs/requirements.md || echo "PASS: .kiro tracked"
```

3. Push to a new GitHub repository under `harrymove-ctrl` and create all epics and issues once ready:

```bash
node scripts/sync-github-epics.mjs --repo harrymove-ctrl/echoloom --create-repo --public --push
```
