---
name: git-safety-commit
description: A guardian skill that enforces safe git practices. It prevents direct commits to `main`, ensures proper branch naming, and validates the working tree state before operations.
---

# Git Safety Guardian

This skill is the "Safety Officer" for your version control. It prevents common mistakes like working on `main` or losing changes during a switch.

## When to use this skill

- **ALWAYS** before running `git commit`.
- **ALWAYS** before running `git checkout -b` (creating a new branch).
- When you are unsure of the current repository state.

## Rules & Enforcements

1.  **NO Direct Commits to Main**:
    - If `git branch --show-current` returns `main` or `master`: **ABORT**.
    - **Action**: You must instruct the user to create a new branch: `git checkout -b [type]/[description]`.

2.  **Branch Naming Convention**:
    - Branches must follow the pattern: `type/description-slug`.
    - **Valid Types**:
        - `feat`: New features.
        - `fix`: Bug fixes.
        - `chore`: Maintenance, docs, build scripts.
        - `refactor`: Code changes that neither fix a bug nor add a feature.
        - `test`: Adding missing tests.
    - **Example**: `feat/user-profile-page`, `fix/login-crash`, `chore/update-readme`.

3.  **Clean Working Tree**:
    - Before switching branches (`checkout`), always run `git status`.
    - If there are uncommitted changes, ask the user: "Stash or Commit?"

## How to use it (The Protocol)

1.  **Check Context**:
    ```bash
    git branch --show-current
    git status
    ```

2.  **Validate**:
    - IF branch == `main`: Stop. Suggest `git checkout -b ...`.
    - IF changes exist AND request is to switch: Warning.

3.  **Execute**:
    - Only proceed with the user's requested git command if the safety checks pass.

## Example Interaction

**User**: "Commit these changes."
**Agent (Internal Thought)**: *Checking branch... It is 'main'.*
**Agent Response**: "🛑 **Safety Stop**: You are currently on the `main` branch. Direct commits to `main` are restricted to ensure stability.

Please create a feature branch first. Shall I run:
`git checkout -b feat/my-new-feature`?"