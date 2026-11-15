# Kiro Steering: Product Principles (`EchoLoom`)

1. **Always Separate Owned vs. External Channels**:
   1. Owned channels use an official `Bot ` token with minimal channel level permissions (`View Channel`, `Read Message History`).
   2. External channels you do not own use passive desktop cache reads (`wiretap`) or explicit user open Chrome tab DOM snapshots (`OpenCLI` / `chrome-devtools` MCP).
2. **Respect Community Members Privacy**:
   1. Never quote external community users verbatim across servers or leak handles/user IDs into prompts or published drafts.
   2. Always synthesize original tutorials, worked fixes, and guides grounded in the owner's own voice.
3. **Human in the Loop Writes Only**:
   1. Never optimize for mass replies, cold DMs, or unapproved automation.
   2. Every outbound post defaults to a clean preview diff and requires explicit human approval (`confirmLive: true` / `--live --approvedBy`).
4. **Prose & Writing Standard**:
   1. Keep all documentation, UI copy, commit messages, and generated Discord drafts free of em dashes, en dashes, spaced hyphens, zero width characters, and AI filler phrases.
