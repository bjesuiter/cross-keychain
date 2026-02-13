# AGENTS

## bjesuiter-publishing

Use this flow for publishing from the fork using **manual local publishing only**.

### Why

- `npm trust github ...` requires the package to already exist on npm.
- We do not use GitHub workflow publishing for fork releases.
- Therefore: use local publish commands for all `-jb.x` releases.

### Rules

- Work in repository: `bjesuiter/cross-keychain`
- Work from branch: `release/bjesuiter`
- Use Node.js version: `20`
- Package name must be: `@bjesuiter/cross-keychain`
- Version format must be: `<upstream-major.minor.patch>-jb.<x>`
  - Example: `1.1.0-jb.0`, `1.1.0-jb.1`
  - Do **not** change upstream base version (`1.1.0` in this example)

### Release commands (local)

1. Ensure clean working tree:
   - `git status`
2. Login to npm:
   - `npm login`
3. Install and verify:
   - `npm ci`
   - `npm run ci`
4. Compute next jb version:
   - `node scripts/next-jb-version.mjs`
5. Set version without tagging/committing:
   - `npm version <computed-version> --no-git-tag-version`
6. Publish with jb tag:
   - `npm publish --access public --tag jb --provenance=false`

### Post-publish cleanup

- Revert temporary version bump:
  - `git restore package.json package-lock.json`
- Verify clean tree:
  - `git status`
