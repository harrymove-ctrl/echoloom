# EchoLoom: Product Requirements & Master Vision

1. **Status**: `active`
2. **Last Updated**: `2026-11-15`
3. **Maintainer**: `harrymove-ctrl`
4. **Repository**: `https://github.com/harrymove-ctrl/echoloom`
5. **Competition Alignment**: Kiroween 2026 (`Frankenstein` primary category + `Best Kiro Crew App` + `Best Demo` + `Social Blitz Prize` + `Bonus Blog Prize`)

## 1. Product Vision & Problem Statement

Community founders, developer advocates, and solo builders run active Discord servers for their own projects while also participating in dozens of external community Discord servers for research, support signals, and industry context. Today they hit three broken workflows:

1. **Fragmented, slow Discord retrieval**: Searching weeks of threads across Discord Web takes seconds per query and misses context buried in threads and replies.
2. **Unsafe ToS violations in creator tools**: Tools like `discord-cli` and `ListeningKit`'s Discord module extract and replay personal `localStorage` user tokens, risking permanent personal Discord account bans. Meanwhile, hardened official bot tools like `discrawl` cannot help on external servers where the user lacks `Manage Server` permission, and default to `source = "both"` (mixing personal `@me` DMs into guild archives) and unvalidated `attachment_text` URL fetches.
3. **Robotic outbound drafting**: Generic LLM bots paste cliché AI phrasing, leak hidden artifacts, or fire without confirmation gates instead of turning real community pain points into authentic posts in the owner's own voice.

**Why Now (`2026-11-15`)**: Coding agents (Kiro, Claude Code, Codex, Cursor) now operate cleanly over `stdio` MCP servers and Chrome DevTools MCP (`chrome-devtools-mcp`), making it possible to combine hardened local SQLite indexing, zero selfbot browser/cache ingestion, `voiceGate` quality controls, and Kiroween's spec driven + property based testing workflow into one single developer product built across a 20 day daily shipping sprint (`Nov 15` to `Dec 4, 2026`).

## 2. Target User Segments

| Persona | Primary Job to Be Done | Critical Constraints |
| :--- | :--- | :--- |
| **1. Community Founder & Solo Builder** | Monitor external engineering/product channels passively for recurring bugs and questions, then turn insights into high value guides inside their own personal Discord server. | Zero personal Discord account ban risk; zero leaking of external members' handles or personal `@me` DMs; fast human review before any post goes live. |
| **2. AI First Engineer (MCP Power User)** | Query archived Discord discussions from terminal (`--json` / `--yaml`) or inside Kiro / Claude Code / Cursor in milliseconds with verifiable provenance. | Offline first local SQLite performance (`< 15 ms` FTS5 reads), deterministic schemas, and strict dry run defaults across every write tool. |

## 3. Normative Conformance Vocabulary & Locked Decisions

1. **Vocabulary**: **MUST** denotes mandatory conformance; **SHOULD** denotes recommended default unless documented; **MAY** denotes optional extension. Downstream design docs and implementations MUST NOT weaken any **MUST** requirement.
2. **Locked Decisions (Registered `D1` through `D7`)**:
   1. **D1 (Zero Selfbot Ban Policy)**: EchoLoom **MUST NEVER** extract, persist, or replay Discord personal user tokens (`auth_token` from browser `localStorage` or Discord LevelDB). Owned servers use official Discord Bot tokens; external servers use passive local disk `wiretap` caches or read only user driven browser tab snapshots (`OpenCLI` / `chrome-devtools-mcp`).
   2. **D2 (Explicit DM `@me` Isolation)**: Unlike `discrawl`'s default `sync.source = "both"`, EchoLoom **MUST** default to `source = "discord"` for Bot syncs and **MUST** physically tag and filter out `@me` personal DM rows by default across search, signal clustering, MCP reads, and exports unless an explicit offline personal export flag is given.
   3. **D3 (Fixed Attachment SSRF Closure)**: Attachment text or media fetches **MUST** pass strict `https://` port `443` validation against explicit Discord CDN allowlists (`cdn.discordapp.com`, `media.discordapp.net`, `images-ext-<digits>.discordapp.net`) across every redirect hop, fixing the unallowlisted `fetchAttachmentText` gap found in `discrawl`.
   4. **D4 (Structured Local CLI + Reloadable `stdio` MCP)**: CLI analytical commands **MUST** follow the deterministic `{ ok, schema_version, data | error }` JSON/YAML envelope (`discord-cli` pattern), paired with a live `stdio` MCP server (`ListeningKit` pattern).
   5. **D5 (Dry Run Default & `confirmLive` Outbound Gate)**: Every mutating CLI or MCP action **MUST** return a dry run preview + diff unless `--live --approvedBy <name>` (CLI) or `live: true, confirmLive: true` (MCP) is supplied after passing `voiceGate`.
   6. **D6 (Kiroween `Frankenstein` + `/.kiro` Gate)**: The project **MUST** stitch Go/TS/SQLite/Browser/MCP into a unified Kiroween `Frankenstein` + `Best Kiro Crew App` submission with committed root `/.kiro/{specs,hooks,steering}`, MIT `LICENSE`, Property Based Testing (PBT), and a public GitHub repo under `harrymove-ctrl`.
   7. **D7 (20 Day Daily Build & Milestone Rhythm)**: Delivery **MUST** decompose into daily atomic commits from `2026-11-15` to `2026-12-04`, keeping all automated hooks, tests, and milestone gates continuously verified.

## 4. Measurable Product Success Criteria

| Metric | Target | How Measured |
| :--- | :--- | :--- |
| **FTS5 Local Search Latency** | `< 15 ms` p95 on `50,000` archived messages | Automated SQLite benchmark suite in CI |
| **User Token Network Calls** | `0` requests using non Bot Discord authorization | Static lint + network mock tests + PBT invariant |
| **Allowlist Bypass Attempts** | `0` non Discord CDN HTTP requests accepted | Property based URL & redirect fuzzer |
| **`@me` DM Leakage into Signals / MCP** | `0` `@me` messages surfaced in default queries, signals, or drafts | PBT multi tenant guild isolation suite |
| **Ungated Outbound Mutations** | `0` messages sent without passing `voiceGate` + `confirmLive` | Integration & PBT governor tests |
| **Kiroween Pre Flight Gate** | `100%` pass on `/.kiro`, `LICENSE`, PBT, `< 3:00` video, and 8 part write up | Pre submission gate check on Dec 3, 2026 |

## 5. Product Scope & Explicit Non Goals

| In Scope | Out of Scope (With Rationale) |
| :--- | :--- |
| 1. Owned Discord channel archival and live Gateway tailing via scoped Bot tokens stored in OS Keychain. | 1. Discord user token selfbot extraction or TLS fingerprint impersonation (high ban risk + ToS breach). |
| 2. Non owned external Discord channel capture via isolated `wiretap` local cache reads and `OpenCLI` / Chrome DevTools DOM snapshots. | 2. Headless CAPTCHA evasion or automated mass cold DM spam campaigns. |
| 3. Local SQLite FTS5 indexing, `today` / `recent` / `top` / `timeline` / `signals` analytics, and topic anonymization. | 3. Mandatory hosted cloud SaaS storage or closed telemetry servers (must remain local first). |
| 4. `voiceGate` historical tone matching, AI artifact watermark blocker, `stdio` MCP server, and Haunted Signal Loom web console. | 4. Voice cloning audio deepfakes as a core blocker for v1 (text content studio ships first). |

## 6. Domain Glossary

| Term | Definition |
| :--- | :--- |
| **Owned Channel** | A Discord channel in a server where the operator holds `Manage Server` permission and can invite a scoped official Bot. |
| **External Channel** | A Discord channel in a community server where the operator is a standard member without Bot invite rights. |
| **Wiretap Mode** | Zero network local extraction reading Discord Desktop's Chromium cache directory safely via traversal resistant root handles (`os.OpenRoot`). |
| **Browser Snapshot Mode** | User initiated capture reading rendered message DOM trees from an already open Chrome tab via `OpenCLI` or `chrome-devtools-mcp`. |
| **Signal Cluster** | An anonymized group of external community questions, error reports, or debates turned into an original content brief. |
| **VoiceGate** | Pre send automated check verifying stylistic similarity against the owner's prior writing while blocking hidden characters, dashed slop, and robotic phrases. |

## 7. PRD Index

| PRD | Title | Primary Reference Ancestors | File |
| :--- | :--- | :--- | :--- |
| **PRD 1** | Safe Multi Source Discord & Browser Ingestion | `openclaw/discrawl` + `jackwener/OpenCLI` | [`prd-01-safe-multi-source-ingestion.md`](./prd-01-safe-multi-source-ingestion.md) |
| **PRD 2** | Local Knowledge Vault, CLI Analytics & Signal Engine | `openclaw/discrawl` + `jackwener/discord-cli` | [`prd-02-local-knowledge-and-signal-engine.md`](./prd-02-local-knowledge-and-signal-engine.md) |
| **PRD 3** | Voice Gated Content Studio, MCP Server & Outbound Governor | `matthewdonsemail-lab/log` + `oblien/mindwire` | [`prd-03-voice-gated-content-studio-and-mcp.md`](./prd-03-voice-gated-content-studio-and-mcp.md) |
| **PRD 4** | Kiroween 2026 Architecture, Kiro Crew, PBT & Daily Ship | Kiroween Rules + `oblien/mindwire` | [`prd-04-kiroween-spec-hooks-pbt-and-daily-ship.md`](./prd-04-kiroween-spec-hooks-pbt-and-daily-ship.md) |

1. **Execution Epics & Schedule**: [`../epics/EPICS_AND_DAILY_ROADMAP.md`](../epics/EPICS_AND_DAILY_ROADMAP.md)
2. **Non Owned Channel Playbook**: [`../NON_OWNED_CHANNEL_GUIDE.md`](../NON_OWNED_CHANNEL_GUIDE.md)
