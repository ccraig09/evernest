---
name: git-atomic-commit
description: Encourages frequent, atomic commits with Conventional Commits messages. Use when you have completed a logical unit of work, even if the overall task is unfinished.
---

# Git Atomic Commit

This skill promotes a "commit often" philosophy using atomic units of work and Conventional Commits.

## When to use this skill

- **Logical Unit Complete**: You've finished a function, fixed a bug, or added a file.
- **Passing Tests**: The code compiles and tests (relevant to the change) pass.
- **Before Switching**: You need to switch context to another file or task.
- **Safety**: You've done significantly difficult work and don't want to lose it.

## How to use it

1.  **Update Changelog**:
    - Before committing, use the `changelog-management` skill to record the changes and rationale in the living `changelog.md` document.

2.  **Stage Changes**:
    - Stage _only_ the files related to the specific change.
    - `git add path/to/file` (Avoid `git add .` unless you are sure all changes belong together).

3.  **Commit Message Format**:
    - Follow **Conventional Commits**: `<type>: <description>`
    - **Types**:
      - `feat`: A new feature
      - `fix`: A bug fix
      - `docs`: Documentation only changes
      - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
      - `refactor`: A code change that neither fixes a bug nor adds a feature
      - `perf`: A code change that improves performance
      - `test`: Adding missing tests or correcting existing tests
      - `chore`: Changes to the build process or auxiliary tools and libraries (e.g., generator skills)

4.  **Execute Commit**:
    - ```bash
      git commit -m "type: description"
      ```

## Examples

- `feat: add user authentication endpoint`
- `fix: resolve database connection timeout`
- `chore: add prisma-schema-update agent skill`
- `docs: update README with setup instructions`
