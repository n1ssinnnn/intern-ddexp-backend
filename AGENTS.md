# Repository Guidelines

## Project Structure

This repository is a Bun workspace with the API application in `app/` and shared backend packages in `packages/`. The Elysia entry point and HTTP wiring are in `app/src/`; routers and request schemas are in `app/src/routers/` and `app/src/requests/`. Shared business logic is under `packages/services/`, persistence access under `packages/repositories/`, domain types under `packages/domains/`, and database schema/configuration under `packages/db/`. Drizzle migrations and snapshots are kept in `packages/db/drizzle/`.

## Build, Test, and Development

- `bun install` installs workspace dependencies.
- `bun run dev` starts the app in watch mode with root `.env` loaded.
- `bun run --filter app dev` starts the app watcher directly, without the root env-file wrapper.
- `bun run generate --name <migration_name>` generates a Drizzle migration using the root script.
- `bun run db:studio` opens Drizzle Studio (requires database configuration).

There is no build script or configured test suite yet. `app` currently has a placeholder `test` script that exits with an error; do not treat it as a passing test command. No formatter or linter is configured, so follow nearby code style and run focused checks when available.

## Coding Style and Naming

Use TypeScript with ES module imports. Follow existing formatting: two-space indentation, semicolons, and single-quoted strings where consistent with adjacent files. Use kebab-case filenames (for example, `user-service.ts`), descriptive camelCase for variables/functions, and PascalCase for types/classes. Keep route handling in routers, business rules in services, and database operations in repositories.

## Testing Guidelines

No testing framework or coverage threshold is established. For behavior changes, add focused tests when a framework is introduced; until then, describe manual verification steps in the pull request and check affected routes and database flows.

## Commits and Pull Requests

Recent history uses short feature/fix prefixes (for example, `feat : create and edit`, `fix : update response`) and merge commits for pull requests. Use a concise imperative subject with a consistent prefix, such as `feat: add user lookup`. Pull requests should explain the change, note configuration or migration impacts, link any related issue, and include request/response examples for API changes. Call out checks that were run or explain why they could not be run.

## Configuration and Database Changes

Keep secrets and local connection settings in `.env`; never commit credentials. Update Drizzle schema in `packages/db/schema.ts` and include generated migrations under `packages/db/drizzle/` when changing persisted data. Review generated SQL before submitting it.
