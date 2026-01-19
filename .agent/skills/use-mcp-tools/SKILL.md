---
name: use-mcp-tools
description: Prioritizes the use of specific MCP servers (Context7, Neon, etc.) over generic knowledge. Use when searching for documentation, managing databases, or interacting with external services.
---

# Use MCP Tools

This skill mandates the prioritization of Model Context Protocol (MCP) servers for specific domains to ensure accuracy and up-to-date information.

## When to use this skill

- **Documentation**: When you need to look up syntax, libraries, or frameworks (e.g., Next.js, Prisma, deeply nested dependencies).
- **Database**: When performing ANY database operation (schema changes, queries, migrations).
- **GitHub**: When managing issues, PRs, or searching the broader GitHub ecosystem.

## How to use it

1.  **Context7 (Documentation)**:
    - **Trigger**: You need to know how to use a library (e.g., "How do I use `revalidatePath` in Next.js?").
    - **Action**: Use `mcp_context7_resolve-library-id` followed by `mcp_context7_query-docs`.
    - **Why**: Context7 provides curated, up-to-date docs that are superior to general training data.

2.  **Neon (Database)**:
    - **Trigger**: You need to check the DB schema, run a query, or optimize performance.
    - **Action**: Use `mcp_mcp-server-neon_*` tools (e.g., `describe_table_schema`, `run_sql`, `prepare_query_tuning`).
    - **Why**: Direct access to the live database state is critical for safety and correctness.

3.  **GitHub**:
    - **Trigger**: You need to find a specific file, issue, or understand the history of a repo.
    - **Action**: Use `mcp_github-mcp-server_*` tools.

## Best Practices

- **Don't Guess**: If an MCP tool exists for a domain, _use it_.
- **Context First**: Before generating code, use MCP tools to load the necessary context (e.g., read the current DB schema before writing a SQL query).
