# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- [2026-01-20 16:56 CST] Fixed TypeScript error in `ui.test.tsx` by adding missing `fireEvent` import.
- [2026-01-20 16:50 CST] Completed escape of all remaining single quotes in `src/app/page.tsx` to resolve `react/no-unescaped-entities`.
- [2026-01-20 16:47 CST] Fixed `react/no-unescaped-entities` error in `src/app/page.tsx` (escaped "mother's").
- [2026-01-20 16:47 CST] Suppressed temporary `any` type warnings in `src/lib/db.ts` to clear CI checks.
- [2026-01-20 16:31 CST] Fixed Vercel build crash by using a fallback dummy DB connection string in `src/lib/db.ts` when `DATABASE_URL` is missing (prevents static generation failures).
- [2026-01-20 16:24 CST] Resolved Prisma 7 validation error (P1012) by removing `url` from `schema.prisma` (now handled by `prisma.config.ts`).
- [2026-01-20 16:24 CST] Fixed `PrismaConfigEnvError` during build by using `process.env` instead of strict `env()` in `prisma.config.ts`.
- [2026-01-20 16:03 CST] Resolved Vercel build error `PrismaConfigEnvError` by adding `postinstall: "prisma generate"` script.
- [2026-01-20 15:35 CST] Resolved linting errors (unused imports in `route.ts`, `ui.test.tsx`, `server-utils.test.ts`).
- [2026-01-20 15:35 CST] Fixed `any` type warnings in `debug-check/route.ts` and `db.ts`.
- [2026-01-20 15:35 CST] Corrected unescaped entities in `src/app/page.tsx`.

### Dev Notes
- **Prisma Type Workaround**: In `src/lib/db.ts`, we are temporarily casting the `PrismaNeon` and `PrismaPg` adapters to `any`. This is due to a known type mismatch between the adapter packages and the main `PrismaClient` constructor in the current v7.x release candidate. This allows the build to pass but should be monitored for future stable releases.

## [0.1.0] - 2026-01-18

### Added
- Initial project structure.
- Authentication with NextAuth.js (Prisma Adapter).
- Story Generation with Google Gemini AI.
- "Prenatal Mode" core functionality.

### Changed
- Refreshed Antigravity development flow.
- Migrated database connection to Prisma 7 + Neon Serverless (Hybrid Config).
- Optimized prompts for "Sonic/Rhythmic/Vibration" focus in womb stories.

### Fixed
- Resolved Prisma 7 "No database host" error in Vercel production.
- Fixed server-side rendering issues in Auth page.

---
_Timezone: Central Standard Time (CST)_