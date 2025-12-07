# EverNest Architecture

## Overview

EverNest is a Next.js 16 application using the App Router architecture. It provides authenticated users with AI-generated prenatal stories, storing them in a PostgreSQL database.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Landing    │  │   Auth      │  │   App (Protected)   │  │
│  │   Page      │  │   Pages     │  │  Generate/Library   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Server                           │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   App Router                             ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ ││
│  │  │ Server      │  │ Route       │  │ API Routes      │ ││
│  │  │ Components  │  │ Handlers    │  │ /api/stories/*  │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
│  ┌─────────────────────────────────────────────────────────┐│
│  │                   Services Layer                         ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐ ││
│  │  │ Auth.js     │  │ Story       │  │ Gemini          │ ││
│  │  │ (NextAuth)  │  │ Service     │  │ Service         │ ││
│  │  └─────────────┘  └─────────────┘  └─────────────────┘ ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
        ┌──────────┐   ┌──────────┐   ┌──────────┐
        │ Postgres │   │ Gemini   │   │ Session  │
        │ (Prisma) │   │ API      │   │ Store    │
        └──────────┘   └──────────┘   └──────────┘
```

## Data Flow

### Story Generation Flow

```
1. User fills form (theme, length, parent names, etc.)
           │
           ▼
2. POST /api/stories with config
           │
           ▼
3. Auth check (Auth.js session)
           │
           ▼
4. Compute config hash for uniqueness
           │
           ▼
5. Check database for existing story with same hash
           │
     ┌─────┴─────┐
     │           │
   Found       Not Found
     │           │
     ▼           ▼
6a. Return     6b. Call Gemini API
    existing       with prompt
    story          │
                   ▼
               7. Parse JSON response
                   │
                   ▼
               8. Save to database
                   │
                   ▼
               9. Return new story
```

### Authentication Flow

```
1. User visits /auth
           │
           ▼
2. Submit credentials (email/password)
           │
           ▼
3. Auth.js validates via Credentials provider
           │
           ▼
4. Create/find user in database
           │
           ▼
5. Issue JWT session token
           │
           ▼
6. Redirect to /app (protected routes)
```

## Database Schema

### Entity Relationships

```
User (1) ─────< (N) UserProfile
  │
  └────────────< (N) Story
                       │
UserProfile (1) ───────< (N) Story (optional)
```

### Key Tables

- **User**: Auth.js managed user account
- **UserProfile**: Pregnancy/baby profile with preferences
- **Story**: Generated stories with config and content

### Uniqueness Constraint

Stories are unique per user + config hash:

```sql
@@unique([userId, configHash])
```

The `configHash` is a SHA-256 hash of normalized generation config (theme, length, faith preference, parent names, baby nickname) - excluding due date to allow the same "style" of story over time.

## AI Integration

### Gemini API

- **SDK**: `@google/genai` (unified Google Gen AI SDK)
- **Model**: `gemini-2.5-flash`
- **Response Format**: Structured JSON with `title` and `content`
- **Temperature**: 0.7 (warm and creative but cohesive)

### Prompt Construction

The prompt includes:
1. Theme context (or "surprise me" instruction)
2. Word count range based on length setting
3. Faith/tone instructions
4. Parent and baby name references
5. Due date context (optional)
6. Safety guardrails (no scary content, gentle language)

## Security Considerations

1. **Authentication**: JWT-based sessions via Auth.js
2. **Authorization**: All API routes check session before processing
3. **Data Isolation**: Users can only access their own stories
4. **Input Validation**: Zod schemas validate all API inputs
5. **API Key Protection**: Gemini key server-side only via env vars

## Performance Optimizations

1. **Turbopack**: Development builds use Next.js Turbopack
2. **Server Components**: Landing and layout pages are server-rendered
3. **Client Components**: Interactive forms use 'use client' directive
4. **Database Indexes**: Indexed on userId, profileId, configHash
5. **Duplicate Detection**: Config hash prevents redundant AI calls

## Future Considerations

- **Caching**: Consider caching popular themes/lengths
- **Rate Limiting**: Add rate limits per user for story generation
- **Analytics**: Track story generation patterns
- **Audio**: Add TTS for story read-aloud feature
- **Sharing**: Allow sharing stories with family members

