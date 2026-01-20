---
name: changelog-management
description: Manages the `CHANGELOG.md` file to provide a detailed, timestamped history of project evolution. Use this to document features, fixes, and engineering decisions.
---

# Changelog Management Skill

This skill ensures that every meaningful change is documented in `CHANGELOG.md` with high precision, including timestamps and rationales.

## When to use this skill

- **Before Committing**: Update the changelog as part of your commit preparation.
- **After a Sprint/Task**: Summarize the work done.
- **Significant Architecture Changes**: When a decision is made that future-you needs to remember.

## Rules & Standards

1.  **Timezone**: Always use **Tulsa, Oklahoma time (Central Time - CST/CDT)**.
    - Format: `YYYY-MM-DD HH:mm (Timezone)`
2.  **Location**: Always edit `CHANGELOG.md` in the **project root**.
3.  **Format**: Follow [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) but with added detail.

## How to Update

1.  **Header**: If this is a new release/milestone, create a new `## [Version] - Date` header. If it's ongoing work, append to the `## [Unreleased]` section (or create it if missing).
2.  **Categories**:
    - `### Added`: New features.
    - `### Changed`: Changes in existing functionality.
    - `### Deprecated`: Soon-to-be removed features.
    - `### Removed`: Now removed features.
    - `### Fixed`: Any bug fixes.
    - `### Security`: In case of vulnerabilities.
    - `### Dev Notes`: **(Crucial)** Technical context, architectural decisions, or "gotchas" encountered.

## Example Entry

```markdown
## [Unreleased]

### Added
- [2026-01-20 14:30 CST] Implemented `PrismaAdapter` workaround for local dev to fix type mismatch.

### Fixed
- [2026-01-20 14:30 CST] Resolved linting errors in `ui.test.tsx` by removing unused React imports.

### Dev Notes
- We are currently casting the Prisma adapter to `any` in `src/lib/db.ts`. This is a temporary hack because `@prisma/adapter-pg` v7.x has a type conflict with `PrismaClient` in strict mode. We should revisit this when Prisma v7.1+ is stable.
```