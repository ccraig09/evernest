---
name: create-agent-skill
description: Guides the creation of new agent skills. Use when you identify a reusable pattern, workflow, or standard that should be codified for future use.
---

# Create Agent Skill

This skill defines the protocol for the agent to create _new_ skills.

## When to use this skill

- **Repetition**: You find yourself doing the same complex task multiple times (e.g., "Refactoring a component," "Setting up a test suite").
- **Standardization**: The user (or you) wants to enforce a specific way of doing things (e.g., "Always use Zod for validation," "Always put API routes in `src/app/api`").
- **Documentation**: You want to capture a "Workflow" or "Best Practice" in a way that is actionable for the agent.

## How to use it

1.  **Check Previous Skills**:
    - Verify the skill doesn't already exist in `.agent/skills/`.

2.  **Define the Scope**:
    - **Name**: Choose a concise, kebab-case name (e.g., `create-react-component`).
    - **Purpose**: specific, one-sentence description.

3.  **Create Directory**:
    - Create `.agent/skills/<skill-name>/`.

4.  **Create SKILL.md**:
    - Create `.agent/skills/<skill-name>/SKILL.md` with the following template:

    ```markdown
    ---
    name: <skill-name>
    description: <Short description for the tool selector>
    ---

    # <Human Readable Name>

    ## When to use this skill

    - <Bullet point 1>
    - <Bullet point 2>

    ## How to use it

    1.  **Step 1**:
        - Details...

    2.  **Step 2**:
        - Details...
    ```

5.  **Notify User**:
    - Inform the user you've created a new skill to help with future tasks.
