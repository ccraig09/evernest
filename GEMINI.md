# Gemini Code Assistant Context

This document provides context for the Gemini AI code assistant to understand the EverNest project.

## Project Overview

EverNest is a full-stack web application built with Next.js (App Router) and TypeScript. It serves as an AI-powered prenatal storytelling companion for expectant parents, generating personalized, calming bedtime stories.

The application uses a PostgreSQL database managed with Prisma ORM. Authentication is handled by Auth.js (NextAuth v5). The frontend is built with React, styled with Tailwind CSS, and uses `shadcn/ui` for UI components. The core AI functionality is powered by the Google Gemini API.

### Key Technologies

-   **Framework**: Next.js 16 (App Router)
-   **Language**: TypeScript
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: Auth.js (NextAuth v5)
-   **Styling**: Tailwind CSS 4 with `shadcn/ui`
-   **AI**: Google Gemini API (`@google/genai`)
-   **Testing**: Jest and React Testing Library

### Architecture

-   The application follows a standard Next.js App Router structure.
-   Server-side logic for interacting with the database and AI services is located in `src/lib/` and `src/server/`.
-   API routes are defined in `src/app/api/`.
-   UI components are in `src/components/ui/`, with layout components in `src/components/layout/`.
-   Database schema is defined in `prisma/schema.prisma`.

## Building and Running

### Prerequisites

-   Node.js >= 20.0.0
-   PostgreSQL database
-   A Gemini API key

### Setup and Execution

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Configure environment variables:**
    Copy `env.example` to `.env.local` and fill in the required values (`DATABASE_URL`, `AUTH_SECRET`, `GEMINI_API_KEY`).

3.  **Sync database schema:**
    ```bash
    npm run db:push
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

### Key NPM Scripts

-   `npm run dev`: Starts the Next.js development server with Turbopack.
-   `npm run build`: Creates a production build.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm run test`: Executes the Jest test suite.
-   `npm run db:push`: Pushes the Prisma schema to the database (for development).
-   `npm run db:migrate`: Creates and applies a new database migration.
-   `npm run db:studio`: Opens the Prisma Studio to view and edit data.

## Development Conventions

### Coding Style

-   The project uses TypeScript and enforces strict type-checking.
-   Code style is maintained by ESLint. Run `npm run lint` before committing changes.
-   Imports are aliased with `@/*` pointing to the `src/` directory.

### Testing

-   Tests are written with Jest and React Testing Library.
-   Test files are located in `src/__tests__/` and have a `.test.ts` or `.test.tsx` extension.
-   Run tests with `npm run test`. The `TESTING.md` file contains more details on the testing strategy.

### Database

-   Database schema changes are managed through Prisma Migrate.
-   For development, `npm run db:push` is acceptable for quick schema updates.
-   For production-like changes, use `npm run db:migrate` to create a new migration file.

### API and Server Logic

-   Business logic is separated from API route handlers. See `src/server/story-service.ts` for an example.
-   Services like the AI service (`src/lib/ai-service.ts`) are modular and can be instantiated where needed.
-   Use Zod for schema validation, as seen in `src/lib/schemas.ts`.
