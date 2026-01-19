---
name: git-safety-commit
description: Enforces a "save point" strategy before starting significant work. Use when beginning a new task, refactoring, or experimenting.
---

# Git Safety Commit (WIP)

This skill enforces a safety-first development workflow by creating "save points" before potentially destructive or complex changes.

## When to use this skill

- **Starting a Task**: Before writing the first line of code for a new feature.
- **Refactoring**: Before changing existing, working code.
- **Experimenting**: Before trying an approach you aren't 100% sure about.
- **Context Switching**: Before switching to a different task or branch.

## How to use it

1.  **Assess State**:
    - Check `git status`. Are there uncommitted changes?

2.  **Create Save Point**:
    - **Option A (WIP Commit)**: If staying on the current branch, commit current state:
      ```bash
      git add .
      git commit -m "wip: save point before [task name]"
      ```
    - **Option B (New Branch)**: If the new task is distinct, create a fresh branch:
      ```bash
      git checkout -b feature/[task-name]
      ```

3.  **Proceed**:
    - Now that a save point exists, you can safely make changes.

4.  **Cleanup (Post-Task)**:
    - Before merging, remember to squash "wip" commits into clean, atomic commits if necessary.
