# EchoLoom: Repository Builder Rules

1. **Read Docs First**: Inspect [`README.md`](./README.md), [`docs/requirements/README.md`](./docs/requirements/README.md), and [`.kiro/specs/requirements.md`](./.kiro/specs/requirements.md) before editing source files or documentation.
2. **Never Ignore `/.kiro`**: Never add `.kiro` or any subdirectory inside `.kiro` to `.gitignore`. Keeping `/.kiro/specs`, `/.kiro/hooks`, and `/.kiro/steering` committed is a mandatory Kiroween 2026 requirement.
3. **Public Hygiene & Privacy Boundary**: Keep this public repository strictly free of personal Discord guild IDs, channel IDs, private target lists, `.env` secrets, and `.db` vaults. Keep personal operational target lists strictly outside this repository.
4. **Zero User Token & Safety Invariants**: Never extract or replay Discord `localStorage` user tokens. Use official Discord Bot tokens only for owned servers, enforce `@me` DM quarantine on external reads, and enforce `https://` port `443` Discord CDN allowlists on attachment fetches.
5. **Writing & Git Identity Gate**: Write 100% plain English with zero em dashes, en dashes, spaced hyphens, horizontal rules, or unordered dash bullets, validating Markdown via `node scripts/check-prose.mjs`. Commit and push solely under GitHub login `harrymove-ctrl` with zero AI attribution trailers.
