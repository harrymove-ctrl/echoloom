# PRD 1: Safe Multi Source Discord & Browser Ingestion

1. **Status**: `active`
2. **Last Updated**: `2026-11-15`
3. **Related Master Requirements**: [`./README.md`](./README.md) (`D1`, `D2`, `D3`)
4. **Related Epics**: `EPIC-02`, `EPIC-03`, `EPIC-04` (`ISS-04` through `ISS-15`)

## 1. Problem & User Scenarios

1. **Owned Server Scenario**: You administer a personal or product Discord server and want continuous indexing of `#engineering-help` or `#announcements` without allowing your archival bot to read private admin channels.
2. **External Server Scenario**: You belong to an AI framework or ecosystem Discord server where you do not have `Manage Server` rights, yet want to track recurring user bugs and questions without getting your personal Discord account flagged or banned.
3. **Security Gap Scenario (`discrawl` audit remediation)**: Existing tools either default to scanning personal desktop DMs alongside guild channels (`sync.source = "both"`) or fetch unallowlisted attachment URLs via unrestricted HTTP clients.

## 2. Functional Requirements

### 2.1 Credential & File Security Boundary
1. **REQ-ING-01 (OS Keychain First)**: Bot credentials **MUST** resolve preferentially from OS Keychain (`macOS Keychain` service `echoloom`) or explicit environment variable, never stored in plaintext repo files.
2. **REQ-ING-02 (Descriptor Bound File Verification)**: When `token_source = "file"` is configured, the loader **MUST** walk path segments using symlink proof `O_NOFOLLOW` descriptor checks, require `0600` file mode, `0700` parent directory, `Nlink == 1`, and inspect macOS extended ACLs before reading.
3. **REQ-ING-03 (Strict File Modes)**: Config files, SQLite database files, and lock files **MUST** be created and maintained with `0600` file permissions and `0700` application directory permissions (`umask 077`).

### 2.2 Tier 1: Owned Channel Bot Ingestion
1. **REQ-ING-04 (Explicit `discord` Default)**: Default sync configuration **MUST** set `sync.source = "discord"` so passive local desktop scanning never runs silently alongside bot ingestion.
2. **REQ-ING-05 (Bot Prefix Enforcement)**: API clients **MUST** prepend `Bot ` authorization headers explicitly and reject tokens formatted as raw user session tokens.
3. **REQ-ING-06 (Channel & Category Scoping)**: Sync and live Gateway tail **MUST** honor `--guild`, `--channels`, `include_category_ids`, `exclude_channel_ids`, and `exclude_channel_kinds` identically during backfill and live streaming, and automatically expand forum/media channels into child threads.
4. **REQ-ING-07 (Attachment SSRF Allowlist)**: Both media caching (`--with-media`) and text attachment extraction (`--with-attachment-text`, disabled by default) **MUST** enforce `https://` port `443`, strict Discord CDN host validation (`cdn.discordapp.com`, `media.discordapp.net`, `images-ext-<digits>.discordapp.net`), `<= 3` validated redirects, IP literal rejection, and bounded response sizes (`8 KiB` text / `100 MiB` media).

### 2.3 Tier 2: Non Owned Passive Desktop `wiretap` Ingestion
1. **REQ-ING-08 (Zero Network Guarantee)**: Executing `wiretap` mode **MUST** make zero outbound network connections to Discord or third party servers.
2. **REQ-ING-09 (Traversal Resistant Root Reads)**: Local Chromium cache and LevelDB reads **MUST** open inside an `os.OpenRoot` (or equivalent `O_NOFOLLOW`) directory boundary, explicitly skip token storage keys, and discard raw cache containers after normalized record extraction.
3. **REQ-ING-10 (`@me` DM Quarantine)**: Personal DMs (`guild_id = "@me"`) **MUST** be tagged `is_private_dm = 1` on ingest (or skipped completely when `--exclude-dm` default is active) and **MUST** remain invisible to cross channel signal pipelines and MCP readers.

### 2.4 Tier 3: Non Owned Browser Snapshot Ingestion (`OpenCLI` / Chrome DevTools MCP)
1. **REQ-ING-11 (Read Only Logged In Tab Capture)**: EchoLoom **MUST** provide a structured snapshot importer accepting accessibility DOM JSON exported from `opencli browser` or `chrome-devtools` MCP `take_snapshot` for an active `discord.com/channels/<guild>/<channel>` tab.
2. **REQ-ING-12 (Auth Isolation)**: Browser snapshot ingestion **MUST NOT** inspect `window.localStorage.token`, `document.cookie`, or WebSocket identify frames; it **MUST** parse visible message author display names, timestamps, reply references, and text nodes only.
3. **REQ-ING-13 (Idempotent Provenance Tagging)**: Every ingested row **MUST** carry a stable deterministic `source_tier` (`bot_api`, `desktop_wiretap`, `browser_snapshot`) and deduplicate on `(message_id)` or content hash so switching between desktop and browser capture never duplicates messages.

## 3. Non Functional Guarantees & Verification

1. **Log Redaction Guarantee**: Stored failure records and structured errors **MUST** scrub Bearer tokens, Authorization headers, URLs, query parameters, and sensitive JSON fields before hitting disk or terminal output.
2. **Test Contracts**: Unit tests plus Property Based Tests **MUST** fuzz malformed attachment URLs, `302` open redirect chains, path traversal segments, and mixed `@me` + guild payloads to assert `0` boundary escapes.
