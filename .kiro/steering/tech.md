# Kiro Steering: Technical Architecture & Conventions (`EchoLoom`)

1. **Runtime Separation (`Frankenstein` Stitch)**:
   1. **Go `1.27` Core (`CGO_ENABLED=0`)**: Owns `modernc.org/sqlite` FTS5 persistence, OS Keychain/ACL credential resolution, official `Bot ` REST + Gateway ingestion, `os.OpenRoot` `wiretap`, URL allowlist enforcement, and structured analytics CLI commands.
   2. **TypeScript / Bun Runtime**: Owns the `OpenCLI` / `chrome-devtools` snapshot parser, owner `voiceGate` scorer + AI artifact detector, hot reloading `stdio` MCP server (`echoloom-mcp`), outbound governor, and Haunted Signal Loom web ops console.
2. **CLI Structured Output Contract**:
   1. Emit `{ "ok": true, "schema_version": "1", "data": ... }` or `{ "ok": false, "schema_version": "1", "error": { "code", "message", "hint" } }` cleanly on stdout when non TTY or when `--json` / `--yaml` is active.
   2. Direct all progress logs and warnings strictly to `stderr`.
3. **Local Speed & Resilience**:
   1. Read queries hit local SQLite FTS5 (`< 15 ms` p95 target) rather than hammering Discord REST endpoints.
   2. Handle HTTP `429` or `401/403` refusals by recording a redacted failure and stopping gracefully instead of retrying aggressively.
4. **Repository & Commit Hygiene**:
   1. Commit every atomic change as GitHub user `harrymove-ctrl` without AI attribution trailers.
   2. Never ignore `/.kiro`, `/.kiro/specs`, `/.kiro/hooks`, or `/.kiro/steering` in `.gitignore`.
