# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@josempgon/vue-keycloak` is a Vue 3 wrapper library for the [Keycloak JavaScript adapter](https://www.keycloak.org/securing-apps/javascript-adapter). It provides a Vue plugin (`vueKeycloak`) and a composable (`useKeycloak`) for integrating Keycloak authentication into Vue 3 apps using the Composition API.

## Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx jest src/composable.test.ts

# Build (clean + TypeScript compile + Rollup bundle)
npm run build

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check
```

## Architecture

The library is composed of a small set of modules in `src/`:

- **`state.ts`** — Shared reactive state (using Vue's `reactive` + `shallowRef`). This is the single source of truth for all auth state (`isAuthenticated`, `isPending`, `hasFailed`, `error`, `token`, etc.). All other modules update state by calling the setter functions exported here.

- **`keycloak.ts`** — Manages the singleton `$keycloak` (keycloak-js) instance. Exports `createKeycloak`, `initKeycloak`, and `getToken`. State mutations flow through `state.ts` setters.

- **`plugin.ts`** — Vue plugin (`vueKeycloak`) that accepts either a static config object or an async factory function. Merges user-provided `initOptions` with defaults from `const.ts`, then calls `createKeycloak` + `initKeycloak`.

- **`composable.ts`** — Exports `useKeycloak()` which combines the `keycloak` shallowRef, `toRefs(state)` spread, and helper functions (`hasRoles`, `hasResourceRoles`).

- **`const.ts`** — Default `KeycloakInitOptions` (`flow: 'standard'`, `checkLoginIframe: false`, `onLoad: 'login-required'`).

- **`utils.ts`** — Small type-guard utilities (`isNil`, `isFunction`, `isString`, `isArray`).

- **`index.ts`** — Public API: re-exports `getToken`, everything from `composable.ts`, and everything from `plugin.ts`.

## Build Pipeline

TypeScript sources are first compiled to `dist-transpiled/` via `tsc`, then bundled by Rollup into `dist/` as both ESM (`index.mjs`) and CJS (`index.cjs`). TypeScript declaration files end up at `dist/types/`. `keycloak-js` and `vue` are declared as `external` in the Rollup config and as `peerDependencies`.

## Releases

Releases are **triggered manually** — run the `Release` workflow (`.github/workflows/release.yml`) from the GitHub Actions tab. It is `workflow_dispatch` only, so nothing publishes on push. It exposes a `dry_run` input that adds `--dry-run`. Version bump, changelog, Git tag, and npm publish are all derived from conventional commits by `semantic-release`. The `release.config.js` controls changelog generation and Git tagging. Use conventional commit format (`feat:`, `fix:`, `chore:`, etc.) for all commits.

Publishing uses npm **trusted publishing (OIDC)** — there is no `NPM_TOKEN` secret, which is why the job needs `id-token: write`. The workflow builds explicitly before `semantic-release` because `files` is `dist/` and there is no `prepare`/`prepublishOnly` script.

To preview a release locally, run `npm run release:dry`. This still needs `npm whoami` to succeed (`@semantic-release/npm` verifies auth even in dry-run mode), so keep a **read-only** granular access token in `~/.npmrc`. A read-only token is sufficient — dry-run never checks publish rights.

There is deliberately **no local publishing script**. `verifyConditions` only runs `npm whoami`, so it cannot tell a read-only token from a publishing one; a local real run would push the release commit and tag in `prepare` before failing at `publish`. Publish only via the workflow.
