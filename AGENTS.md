# AI Agent Instructions (Canonical)

This file is the canonical instruction source for AI coding assistants in this repository.

## Project Overview

- Monorepo for multiple brands.
- Brand-specific code lives in apps/<brand>.
- Shared reusable logic lives in packages.
- Frontend rendering is BFF-driven (layout edges plus entities).

## Architecture Rules

- Keep brand-specific behavior in apps/<brand>.
- Move only genuinely reusable abstractions to packages.
- Keep web and native implementations separate with .web.tsx and .native.tsx.
- Follow existing map-to-props-factory patterns for shared container wiring.
- Do not change architecture or folder ownership unless explicitly requested.
- Betting business logic must live in @ppb/betslip-core; do not reimplement betting rules in brand apps or shared UI packages.

## Data Flow

- Web only: tbd-http-webserver serves first page impression HTML.
- Native apps do not use tbd-http-webserver or FPI HTML; they bootstrap natively, then request BFF data.
- App requests home view from BFF, or uses PRELOAD_CATALOG inline payload when enabled.
- BFF returns edges/cards plus related entities.
- Responses are normalized into store state.
- map-state-to-props maps state to component props.
- React re-renders on state updates.

## Tech Stack

- TypeScript, JavaScript
- React (web), React Native (native)
- Redux via @ppb/tbd-store
- Apollo GraphQL
- Jest, WebdriverIO
- Nx, ESLint, Prettier

## Common Commands

- yarn test, yarn test:web, yarn test:native
- yarn mono:lint
- yarn mono:format
- yarn generate-config-files (when http-webserver or bf-tbd-http-bff-gql are not booting)
- yarn generate-env-files (when http-webserver or bf-tbd-http-bff-gql are not booting)
- yarn compile-graphql (required after GraphQL query or schema changes)

## Non-Negotiable Constraints

- Do not use any; use explicit types.
- Do not mix web and native code in one implementation file.
- Do not encode or decode URNs in frontend code; URNs must come from BFF.
- Do not introduce unrelated refactors in task-scoped changes.

## PR and Change Expectations

- Keep changes minimal and scoped.
- Add or update tests for behavior changes.
- Preserve existing patterns in the touched package or app.
- If uncertain about ownership, prefer app-local change over shared package change.
