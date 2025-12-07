# EverNest Prototype

**Status**: Reference - Original prototype preserved alongside production code  
**Date**: 2025-12-06 23:10 PM CT  
**Production Code**: `../src/` (same repo)

## Overview

This folder contains the original Vite + React prototype for EverNest. The prototype was used to validate the core concept and user experience before building the production Next.js application. It lives alongside the production code as a reference.

## What's Here

- **apps/prototype/**: Original Vite-based React app
  - Story generation UI
  - Theme selection
  - Basic settings
  - Gemini API integration
- **flows/**: User flow diagrams and wireframes
- **notes/**: Design notes and brainstorming
- **prompts/**: AI prompt engineering experiments
- **schemas/**: Data model iterations
- **ui/**: UI component explorations

## Key Learnings

1. **Story Generation**: Gemini API works well for personalized storytelling
2. **Theme Selection**: Users want variety but not overwhelming choice (8 themes is good)
3. **Length Options**: 2-6 minute stories hit the sweet spot
4. **Faith Preferences**: Important to offer inclusive options
5. **Mobile-First**: Most users will read stories on mobile devices

## Migration to Production

The production app (`../src/`) was built from scratch using:

- Next.js 16 (App Router) instead of Vite
- Server-side rendering for better performance
- Auth.js for authentication
- Prisma + PostgreSQL for data persistence
- shadcn/ui for consistent design system

## Prototype vs Production

| Feature   | Prototype     | Production                 |
| --------- | ------------- | -------------------------- |
| Framework | Vite + React  | Next.js 16                 |
| State     | Context API   | Server Components + RSC    |
| Styling   | Basic CSS     | Tailwind CSS 4 + shadcn/ui |
| Auth      | None          | Auth.js (NextAuth v5)      |
| Database  | Local storage | PostgreSQL + Prisma        |
| AI        | Gemini API    | Gemini API (same)          |
| Testing   | None          | Jest + Testing Library     |

## Running the Prototype (Historical)

```bash
cd apps/prototype
npm install
npm run dev
```

**Note**: This prototype is preserved for reference. All active development happens in `../src/`.

## References

- Production code: `../src/`
- GitHub repo: https://github.com/ccraig09/evernest
- Initial issue: https://github.com/ccraig09/evernest/issues/1

---

_This prototype is preserved alongside the production code for reference and learning._
