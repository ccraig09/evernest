# Deployment Guide

This project is optimized for a serverless stack, specifically designed to be hosted on **Vercel** with a **Neon** database.

## Prerequisites
- **Vercel Account**: For hosting the Next.js application.
- **Neon Account**: For the serverless PostgreSQL database.
- **Google AI Studio Key**: For the Gemini API.

## Configuration (.env)

When deploying, ensure the following environment variables are set in your hosting provider:

```env
# Database (Neon Connection String)
DATABASE_URL="postgresql://user:password@ep-xyz.region.aws.neon.tech/evernest?sslmode=require"

# Auth (NextAuth.js)
AUTH_SECRET="generate-a-long-random-string-here"
AUTH_URL="https://your-production-url.vercel.app" # Only needed if not on Vercel automatically

# AI Provider
GEMINI_API_KEY="your-google-gemini-api-key"
```

## Hosting on Vercel

1.  **Push to GitHub/GitLab**: Ensure your code is in a remote repository.
2.  **Import Project**: Go to Vercel Dashboard -> Add New -> Project -> Import your repo.
3.  **Environment Variables**: Copy/Paste the variables from above into the Vercel project settings.
4.  **Deploy**: Vercel will automatically build and deploy.

## Hosting on Other Platforms (Docker)

If you prefer to host it yourself or on a platform like Railway/Render/DigitalOcean:

1.  **Build Container**:
    ```bash
    docker build -t evernest-app .
    ```
2.  **Run Container**:
    ```bash
    docker run -p 3000:3000 --env-file .env evernest-app
    ```
    *Note: You still need a PostgreSQL database URL (Neon, RDS, or a separate Docker container).*

## Database Migration in Production

When deploying to production, the database schema must be applied.

**Option 1: Build Command (Recommended)**
Update your build command in Vercel to:
```bash
npx prisma generate && npx prisma migrate deploy && next build
```

**Option 2: Manual**
Run from your local machine pointing to the PRODUCTION `DATABASE_URL`:
```bash
npx prisma migrate deploy
```
