# Playbook: Safely Crawling Discord Channels You Do Not Own to Create Better Content

1. **Purpose**: Gather questions, bug patterns, feature requests, and live discussions from external Discord servers where you are a regular member (without `Manage Server` permissions to invite a bot), turn those raw signals into original tutorials, FAQs, and posts in your own voice, and avoid Discord Terms of Service bans.
2. **Hard Safety Rule**: Never extract or replay personal Discord user tokens from browser `localStorage` or Discord Desktop LevelDB (used by `discord-cli` `auth --save` and `ListeningKit` `vendor/endcord`). Automating user account tokens breaks Discord Terms of Service, risks disabling your primary Discord account, and disqualifies hackathon submissions.

## 1. Choosing the Right Capture Method

| Method | Admin Needed | Account Ban Risk | Network Traffic to Discord | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **1. Official Discord Bot API (`discrawl --source discord`)** | **Yes** (`Manage Server`) | **None** (Official API) | Standard `Bot ` REST + Gateway | Archiving and streaming your own Discord server, support forum, or partner communities where admins install your scoped read only bot. |
| **2. Passive Desktop Cache (`discrawl wiretap`)** | **No** | **Zero** (Local Disk Only) | **Zero** (Reads already cached Chromium/Discord Desktop files) | Zero risk daily archive of external servers and forum threads you already opened and scrolled in Discord Desktop. |
| **3. Logged In Browser DOM Snapshot (`OpenCLI` + `chrome-devtools-mcp`)** | **No** | **Very Low** (Human Paced Local DOM Inspection) | Only normal interactive Chrome browsing in your open tab | On demand structured capture of a specific channel thread in `discord.com/app`, plus cross platform listening on X, Reddit, and Hacker News. |
| **4. User Token Selfbot (`discord-cli auth` / `endcord`)** | **No** | **High** (Forbidden Selfbot) | Mimics Discord client headers with personal user token | **Rejected by EchoLoom**. Use `discord-cli` only for its local SQLite query UX (`today`, `recent`, `search`, `top`, `timeline`), not its user token extractor. |

## 2. Workflow A: Zero Risk Daily Capture Using `discrawl wiretap` (macOS)

Because `discrawl` defaults to `sync.source = "both"`, running `discrawl sync` normally mixes your personal `@me` DMs with guild channels. For external channels you do not own, isolate them in a separate config and SQLite database so personal DMs never enter your content pipeline.

### Step 1: Create an Isolated Config and Database (`0600` Permissions)

```zsh
mkdir -p "$HOME/Library/Application Support/discrawl-external"
chmod 700 "$HOME/Library/Application Support/discrawl-external"

cat <<'EOF' > "$HOME/Library/Application Support/discrawl-external/config.toml"
db_path = "~/Library/Application Support/discrawl-external/external-radar.db"
default_guild_id = "TARGET_EXTERNAL_GUILD_ID"
guild_ids = ["TARGET_EXTERNAL_GUILD_ID"]

[sync]
source = "wiretap"
attachment_text = false
attachment_media = false

[share]
auto_update = false

[search]
lexical = "fts5"

[search.embeddings]
enabled = false
EOF

chmod 600 "$HOME/Library/Application Support/discrawl-external/config.toml"
```

### Step 2: Populate Cache Naturally, Extract Locally, and Exclude Personal DMs

1. Enable **User Settings -> Advanced -> Developer Mode** inside Discord Desktop, right click the external server and target channel, and copy `TARGET_EXTERNAL_GUILD_ID` and `TARGET_CHANNEL_ID`.
2. Browse the target channel normally in Discord Desktop (scroll up through recent discussions so Discord Desktop writes those payloads to its local cache under `~/Library/Application Support/discord`).
3. Run `wiretap` against the isolated config:

```zsh
export DISCRAWL_NO_UPDATE_CHECK=1
export DISCRAWL_NO_AUTO_UPDATE=1

discrawl --config "$HOME/Library/Application Support/discrawl-external/config.toml" \
  wiretap --guild TARGET_EXTERNAL_GUILD_ID
```

4. Always scope SQL or CLI reads away from personal `@me` DMs when building content briefs:

```zsh
# Search a topic strictly inside the target external channel
discrawl --config "$HOME/Library/Application Support/discrawl-external/config.toml" \
  search --guild TARGET_EXTERNAL_GUILD_ID --channel TARGET_CHANNEL_ID "auth error" --json

# Run SQLite aggregation explicitly excluding personal @me DMs
discrawl --config "$HOME/Library/Application Support/discrawl-external/config.toml" \
  sql "SELECT channel_id, count(*) AS cnt FROM messages WHERE guild_id = 'TARGET_EXTERNAL_GUILD_ID' AND guild_id != '@me' GROUP BY channel_id"
```

## 3. Workflow B: Structured Browser Tab Capture via OpenCLI & Chrome DevTools MCP

When a thread is too deep in Discord Web or lives across companion sites (X, Reddit, GitHub Discussions), combine [`@jackwener/opencli`](https://github.com/jackwener/OpenCLI) with the **Chrome DevTools MCP** plugin (`chrome-devtools-mcp`) rather than writing brittle cookie scrapers.

### Step 1: Wire Both Browser Inspection Tools Locally

1. Install OpenCLI and its Chrome Web Store Browser Bridge extension (all extension traffic stays on `ws://localhost:19825` as audited in `PRIVACY.md`):

```zsh
npm install -g @jackwener/opencli
opencli doctor
```

2. Verify `chrome-devtools` MCP server configuration in Kiro IDE, Claude Code, or Cursor (`mcp_config.json`):

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["chrome-devtools-mcp@latest"]
    }
  }
}
```

### Step 2: Capture Only the Active External Channel Tab You Are Viewing

1. Open Chrome to `https://discord.com/channels/TARGET_GUILD_ID/TARGET_CHANNEL_ID` (already signed in manually by you).
2. Using `opencli browser`, bind read only inspection to your active session without touching `localStorage` tokens:

```zsh
# Discover connected Chrome profiles cleanly
opencli profile list

# Attach to your active tab session (non destructive: unbind keeps tab open)
opencli browser bind --session echoloom-capture
opencli browser state --source ax --session echoloom-capture
opencli browser get text --selector '[role="list"] [id^="chat-messages-"]' --session echoloom-capture

# Detach cleanly when finished
opencli browser unbind --session echoloom-capture
```

3. Alternatively, via `chrome-devtools` MCP inside Kiro IDE, Claude Code, or Cursor:
   1. Call `list_pages` to locate the open Discord tab `pageId`.
   2. Call `take_snapshot` with `pageId` to extract accessibility tree text directly from the rendered DOM.
   3. Feed those anonymized message snippets into EchoLoom's local vault (`echoloom ingest snapshot --source chrome --guild TARGET_GUILD_ID --channel TARGET_CHANNEL_ID`).

## 4. Workflow C: Turning External Channel Signals Into Original Content on Your Side

Crawling is only useful if it makes your own community clearer and more helpful. EchoLoom enforces a four stage pipeline so external chatter never turns into spam or plagiarism:

| Stage | Input | Processing & Guardrails | Output |
| :--- | :--- | :--- | :--- |
| **1. Ingest & Isolate** | External guild `wiretap` cache + Chrome DOM snapshots | Strip personal `@me` DMs completely; skip unallowlisted attachment downloads (`attachment_text = false`); store entries tagged `provenance = "external_read_only"`. | Normalized messages in `echoloom.db` (SQLite WAL + FTS5) |
| **2. Extract & Anonymize Signals** | Raw messages from external channels | Strip author usernames, user IDs, email addresses, tokens, and URLs before clustering. Group into `unanswered_questions`, `recurring_bugs`, `comparison_requests`, and `changelog_reactions`. | Clean topic clusters (`echoloom signals --guild TARGET --anonymize`) |
| **3. Compose in Your Own Voice (`voiceGate`)** | Top 3 topic clusters + your historical posts in your own Discord server | Draft original guides, worked examples, starter templates, and discussion prompts addressing those pain points. Run `voiceGate` + `aiArtifacts` checks against your own prior writing so drafts match your tone and contain zero AI slop punctuation or copied quotes. | Staged drafts in `drafts` queue (`status = "preview_only"`) |
| **4. Human Approval & Publish** | Approved draft + target channel in **your owned server** | Preview exact Discord formatting (`preview_outbound`), wait for explicit `--live --approvedBy harry` or `confirmLive: true`, then post through your official scoped Bot API within rate limits. | Original, verified post live inside your personal Discord channel |
