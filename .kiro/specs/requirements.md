# Kiro Spec: EchoLoom Requirements

1. **Spec Status**: `approved`
2. **Primary Category**: `Frankenstein` + `Best Kiro Crew App`
3. **Canonical PRDs**: [`../../docs/requirements/README.md`](../../docs/requirements/README.md)

## 1. System Functional Contracts

1. **Multi Tier Safe Discord Ingestion**:
   1. **Owned Servers (`bot_api`)**: Use official Discord Bot tokens resolved from macOS Keychain (`echoloom`), scoped to target `--channels` or `include_category_ids`, enforcing explicit `Bot ` HTTP headers.
   2. **Non Owned Desktop Cache (`desktop_wiretap`)**: Read cached Discord Desktop storage strictly via `os.OpenRoot` (`O_NOFOLLOW`) with zero outbound network traffic, zero user token extraction, and mandatory `@me` DM exclusion by default.
   3. **Non Owned Chrome Tabs (`browser_snapshot`)**: Parse rendered Discord Web DOM snapshots from `OpenCLI` or `chrome-devtools` MCP `take_snapshot` without touching `localStorage`, `document.cookie`, or XHR auth secrets.
2. **Local SQLite WAL + FTS5 Store & Terminal Analytics**:
   1. Append immutable message events and derived FTS5/signal tables into `0600` owner only SQLite (`< 15 ms` p95 queries).
   2. Expose `discord-cli` analytics verbs (`today`, `recent`, `search`, `stats`, `top`, `timeline`, `export`, `purge`) using the `{ ok, schema_version: "1", data | error }` envelope.
3. **External Channel Anonymization, `voiceGate` & `confirmLive` Governor**:
   1. Strip handles, Discord user IDs, emails, and URLs from external tiers before signal clustering.
   2. Reject AI slop artifacts (`aiArtifacts`), unallowlisted dashes, and `> 12` word external verbatim overlap (`plagiarismRisk`) in `voiceGate`.
   3. Block every outbound Discord mutation behind dry run preview defaults until `live: true`, `confirmLive: true`, and `approvedBy` are present.

## 2. Formal Property Based Testing (PBT) Invariants

| Invariant ID | Formal Property Statement | Reference Suite |
| :--- | :--- | :--- |
| **INV-01 (`SSRF`)** | For any URL `u`, `allowAttachmentFetch(u)` returns `true` iff `u.Scheme == "https"`, port is empty or `443`, host matches Discord CDN allowlist, zero IP literals exist, and every redirect hop (`<= 3`) satisfies **INV-01**. | `PBT 1` |
| **INV-02 (`DM Isolation`)** | For any store containing mixed `@me` DMs and guild rows, default `search`, `signals`, `drafts`, and `mcp` reads return zero rows where `guild_id == "@me"`. | `PBT 2` |
| **INV-03 (`VoiceGate`)** | For any draft `d` containing zero width chars, em/en dashes, spaced hyphens, HTML, or `> 12` consecutive words shared with external input, `checkVoiceGate(d)` returns `ok == false`. | `PBT 3` |
| **INV-04 (`Dry Run`)** | For any outbound request `r`, `dispatchOutbound(r)` invokes Discord write API iff `r.live == true && r.confirmLive == true && len(trim(r.approvedBy)) > 0`. | `PBT 4` |
| **INV-05 (`Idempotency`)** | Applying any finite permutation `P` of duplicate or multi tier ingestion events to an empty vault produces identical `messages` row counts and normalized FTS5 index entries. | `PBT 5` |
