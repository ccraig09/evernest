---
name: create-api-route
description: Creates a new Next.js API route using App Router conventions. Use when adding backend endpoints.
---

# Create API Route Skill

This skill standardizes the creation of API routes in the `src/app/api` directory.

## When to use this skill

- When the user asks for a new API endpoint.
- When creating backend logic for the frontend to consume.

## How to use it

1.  **Determine Path**:
    - Identify the desired URL path (e.g., `/api/users`).
    - Map this to the file system: `src/app/api/users/route.ts`.

2.  **Create File**:
    - Create the directory structure if it doesn't exist.
    - Create `route.ts`.

3.  **Standard Template**:
    - Use the following template as a starting point:

    ```typescript
    import { NextResponse } from "next/server";

    export async function GET(request: Request) {
      try {
        // Logic here
        return NextResponse.json({ message: "Success" }, { status: 200 });
      } catch (error) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }
    }

    export async function POST(request: Request) {
      try {
        const body = await request.json();
        // Logic here
        return NextResponse.json(
          { message: "Created", data: body },
          { status: 201 },
        );
      } catch (error) {
        return NextResponse.json(
          { error: "Internal Server Error" },
          { status: 500 },
        );
      }
    }
    ```

4.  **Validation**:
    - If accepting input (POST/PUT), consider using Zod for validation if available in the project.

5.  **Error Handling**:
    - Always wrap logic in `try/catch` blocks.
    - Return appropriate HTTP status codes.
