---
name: auth-troubleshoot
description: Diagnoses and resolves common authentication and database connection issues in the EverNest application.
---

# Auth Troubleshoot Skill

Use this skill when the user reports "Auth Errors", "Login Failed", or database connection issues.

## 1. Quick Check: Environment & Database

**Objective**: Verify the app is connecting to the expected database (Local vs Neon).

1.  **Check `.env` and `.env.local`**:
    - Run `view_file .env` and `view_file .env.local`.
    - _Local Dev_: `DATABASE_URL` should contain `localhost` (e.g., `postgresql://...localhost:5434...`).
    - _Production/Neon_: `DATABASE_URL` should contain `neon.tech`.
2.  **Verify `src/lib/db.ts` Logic**:
    - Ensure the `createPrismaClient` function correctly identifies local vs. remote.
    - Localhost connections MUST NOT use `PrismaNeon` adapter (it often fails with standard Docker Postgres).
    - Remote Neon connections SHOULD use `PrismaNeon` for serverless/WebSocket support.
3.  **Check `AUTH_SECRET`**:
    - Ensure `AUTH_SECRET` is set. If missing, logins will fail silently or with "Configuration" errors.

## 2. Inspect Logs

**Objective**: Find the specific error message.

1.  **Terminal Output**: If running `npm run dev`, checked the active terminal output for:
    - `[AUTH] Validation failed`
    - `DB DEBUG: Failed to initialize PrismaClient`
    - `PrismaClientInitializationError` (often means wrong URL or DB not running)
    - `ConnectError` (often means network/firewall or wrong port)
2.  **App Logs**: Check `[AUTH]` prefixed logs in the console (we added these in `src/lib/auth.ts`).

## 3. Database Connectivity Test

**Objective**: Confirm the database is actually reachable.

1.  **Docker (Local)**:
    - Run `docker ps` to ensure `evernest-db` is running.
    - If stopped: `docker start evernest-db`.
2.  **Prisma Studio**:
    - Run `npx prisma studio` to see if it can open the DB.
    - If this fails, the app will definitely fail.

## 4. Reset Strategy (The "Nuclear" Option)

If everything looks right but fails:

1.  **Clear `.next` cache**: `rm -rf .next`
2.  **Restart DB**: `docker restart evernest-db`
3.  **Re-generate Client**: `npx prisma generate`
4.  **Restart Dev Server**: `npm run dev`

## 5. Common Error Patterns

| Error                                           | Cause                                             | Fix                                                                      |
| :---------------------------------------------- | :------------------------------------------------ | :----------------------------------------------------------------------- |
| `Can't reach database server at localhost:5434` | Docker container stopped or wrong port.           | `docker start evernest-db`                                               |
| `AuthError: Configuration`                      | `AUTH_SECRET` missing or `NEXTAUTH_URL` mismatch. | Check `.env.local`.                                                      |
| `PrismaClientKnownRequestError` (P1001)         | DB Connection timeout.                            | Check network/VPN/Firewall.                                              |
| `ReferenceError: WebSocket is not defined`      | Using Neon Adapter in Node env without polyfill.  | Ensure `ws` is configured in `src/lib/db.ts` or avoid Adapter for local. |
