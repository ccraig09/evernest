---
name: prisma-schema-update
description: Updates the Prisma schema and ensures database synchronization. Use when modifying the database schema or `schema.prisma`.
---

# Prisma Schema Update Skill

This skill guides the process of modifying the Prisma schema and applying changes.

## When to use this skill

- When the user asks to add a model, field, or relationship.
- When `prisma/schema.prisma` needs modification.
- When you need to sync the database with schema changes.

## How to use it

1.  **Modify Schema**:
    - Edit `prisma/schema.prisma` to reflect the desired changes.
    - Ensure relation fields are correctly defined on both sides of the relationship if necessary.
    - Use meaningful names and appropriate types.

2.  **Generate Client**:
    - After saving the schema, always run:
      ```bash
      npx prisma generate
      ```
    - This updates the Prisma Client types to match your new schema.

3.  **Migration (Development)**:
    - If working locally or in a dev environment where you can alter the DB:
      ```bash
      npx prisma migrate dev --name <descriptive-name>
      ```
    - Replace `<descriptive-name>` with a short, kebab-case description of the change (e.g., `add-user-model`).

4.  **Verification**:
    - Check that the migration file was created in `prisma/migrations`.
    - Verify that `node_modules/.prisma/client` has been updated (implicitly handled by the generate command).
