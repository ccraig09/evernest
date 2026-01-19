---
name: changelog-management
description: Manages a living `changelog.md` document to provide the user with side-by-side visibility of all changes before they are committed. Use this to summarize work blocks and rationales.
---

# Changelog Management Skill

This skill ensures that every meaningful change is documented, visualized, and approved before it is finalized in the git history.

## When to use this skill

- **Before Committing**: Every time you prepare a `git-atomic-commit`.
- **Ongoing Work**: To summarize progress during a long task.
- **Review Request**: When you want the user to see exactly what you've done in a "side-by-side" format.

## How to use it

1.  **Maintain Brain/Changelog**:
    - Keep a file named `changelog.md` in the current conversation's brain directory.
    - Use a "Current Task" section to describe the active objective.

2.  **Visual Diffing**:
    - Use `render_diffs(file:///path/to/file)` to show precise changes.
    - For UI or multi-file changes, use `carousel` to group related diffs.

3.  **The "Why" (Rationale)**:
    - For every major change, include a "Rationale" or "Intent" section.
    - Describe _why_ you chose this implementation over others.

4.  **Workflow Integration**:
    - **Step 1**: Implement changes.
    - **Step 2**: Update `changelog.md` with diffs and rationales.
    - **Step 3**: Use `notify_user` to request review of the changelog.
    - **Step 4**: Upon approval, execute `git-atomic-commit`.

## Example Entry

```markdown
## [Task Name]

**Status**: Pending Review

### Changes

render_diffs(file:///path/to/db.ts)

### Rationale

- Migrated Prisma connection to use standard datasources because dependencies were causing circular reference errors in Vercel edge runtime.
```
