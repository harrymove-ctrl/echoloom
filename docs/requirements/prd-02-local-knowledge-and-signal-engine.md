# PRD 2: Local Knowledge Vault, CLI Analytics & Signal Engine

1. **Status**: `active`
2. **Last Updated**: `2026-11-15`
3. **Related Master Requirements**: [`./README.md`](./README.md) (`D2`, `D4`)
4. **Related Epics**: `EPIC-02`, `EPIC-05` (`ISS-04` to `ISS-07`, `ISS-16` to `ISS-19`)

## 1. Problem & Reference Synthesis

1. Searching Discord natively forces repeated network requests, lacks cross guild local SQL analytics, and hits API rate limits (`429`) when AI agents scan chat logs repeatedly.
2. `openclaw/discrawl` proves durable pure Go SQLite FTS5 indexing and `append only` failure ledgers, while `jackwener/discord-cli` demonstrates fast terminal ergonomics (`today`, `recent`, `search`, `top`, `timeline`, `stats`) and a machine readable `SCHEMA.md` contract (`--json` and `--yaml`), and `ListeningKit` proves `< 15 ms` local read performance paired with DDIA event verification.
3. EchoLoom combines these into a local vault that answers questions in milliseconds and converts noisy external Discord discussions into anonymized, structured content opportunities.

## 2. Functional Requirements

### 2.1 Durable SQLite Storage & Query Security
1. **REQ-KNO-01 (WAL Append Log & Derived FTS5)**: The store **MUST** persist normalized events (`events`), messages (`messages`), channels (`channels`), members (`members`), signal clusters (`signal_clusters`), outbound drafts (`drafts`), and audit ledger entries (`outbound_ledger`) in SQLite WAL mode with FTS5 full text triggers (`message_fts`).
2. **REQ-KNO-02 (Rebuildable Projections)**: EchoLoom **SHOULD** expose `echoloom storage verify` and `echoloom storage rebuild` commands that reconstruct FTS5 and signal tables deterministically from immutable `events` rows (`DDIA` pattern).
3. **REQ-KNO-03 (SQL Guard Hardening)**: The read only `echoloom sql` interface **MUST** encode file paths with `net/url` (`url.PathEscape` / proper URI escaping, fixing `discrawl`'s unescaped `openReadOnlyDB` string formatting), permit only single statement `SELECT` / `WITH` / `EXPLAIN QUERY PLAN` AST queries, block `PRAGMA` mutations and `ATTACH DATABASE`, and reject queries mentioning `@me` unless explicitly unlocked.

### 2.2 `discord-cli` Structured Analytics & Agent Envelope
1. **REQ-KNO-04 (Core Terminal Command Set)**: The CLI **MUST** implement `today`, `recent`, `search <query>`, `messages`, `stats`, `top`, `timeline --by day|hour`, `export`, and `purge` scoped by `--guild` and `--channel` (supporting exact channel IDs or unambiguous channel names).
2. **REQ-KNO-05 (Structured Output Contract)**: When stdout is non TTY or when `--json` / `--yaml` is passed, every command **MUST** emit the `SCHEMA.md` envelope:
   1. Success: `{ "ok": true, "schema_version": "1", "data": ... }`
   2. Error: `{ "ok": false, "schema_version": "1", "error": { "code": "...", "message": "...", "hint": "..." } }`
3. **REQ-KNO-06 (Offline Telemetry & Update Silence)**: EchoLoom **MUST NOT** phone home to GitHub or external endpoints during normal CLI queries unless an explicit user invoked update command runs.

### 2.3 Signal Extraction & External Channel Anonymization
1. **REQ-KNO-07 (Intent Classification & Clustering)**: The signal engine (`echoloom signals`) **MUST** classify indexed messages over a bounded time window (`--hours`, `--days`) into structured categories: `unanswered_question`, `recurring_bug`, `feature_gap`, `workflow_friction`, and `high_engagement_topic`.
2. **REQ-KNO-08 (Mandatory Anonymization for External Content)**: Signals extracted from `source_tier` values `desktop_wiretap` or `browser_snapshot` **MUST** pass through an anonymizer that hashes or replaces Discord user IDs, `@mentions`, display handles, emails, IP addresses, and private URLs before clustering or sending payloads to any local/remote LLM or MCP client.
3. **REQ-KNO-09 (Local First Semantic Search Default)**: Optional vector embeddings **MUST** default to disabled (`enabled = false`); when enabled, `ollama` local inference (`localhost:11434`) **MUST** be preferred and remote embedding providers **MUST** explicitly confirm user consent and skip `@me` plus external raw PII.

## 3. Performance & Correctness Targets

1. **Query SLA**: FTS5 searches (`search`) and inbox rollups (`today`, `recent`) **MUST** return in `< 15 ms` p95 across a local corpus of `50,000` messages.
2. **Channel Disambiguation**: Ambiguous partial channel names **MUST** abort cleanly with `channel_resolution_error` listing candidate IDs rather than guessing across guilds (`discord-cli` safety improvement).
