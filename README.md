# EverNest

> AI-powered prenatal storytelling companion for expectant parents

EverNest generates personalized, calming bedtime stories for expectant parents to read aloud to their unborn baby. It creates a gentle bonding ritual through AI-generated stories customized with parent names, baby nicknames, and chosen themes.

## Features

- **Personalized Stories**: Stories featuring your names, your baby's nickname, and themes you choose
- **Theme Selection**: Colors & Shapes, Love & Bonding, Nature & Calm, Spiritual & Light, Rhythm & Sound, Family Legacy, Discipline & Values, or Surprise Me
- **Adjustable Length**: Quick (~2 min), Short (~2-3 min), Standard (~4 min), or Long (~5-6 min)
- **Faith Preferences**: Faith-based, Spiritual, or Non-religious tones
- **Two Parent Support**: Enter both parent names for inclusive storytelling
- **Story Library**: Save and browse your generated stories
- **Favorites**: Mark stories you love for easy access
- **Uniqueness**: Prevents duplicate stories with the same configuration

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix primitives)
- **Authentication**: Auth.js (NextAuth v5)
- **Database**: PostgreSQL via Prisma ORM
- **AI**: Google Gemini API (`@google/genai`)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon, Supabase, or local)
- Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone and install dependencies:

```bash
git clone https://github.com/ccraig09/evernest.git
cd evernest
npm install
```

2. Copy environment variables:

```bash
cp env.example .env.local
```

3. Configure `.env.local`:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/evernest?sslmode=require"

# Auth.js
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_URL="http://localhost:3000"

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"
```

4. Initialize the database:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
evernest/
├── src/                    # Production Next.js app
│   ├── app/
│   │   ├── (app)/          # Authenticated app routes
│   │   │   ├── dashboard/  # Main dashboard
│   │   │   ├── library/    # Story library
│   │   │   └── settings/   # User settings
│   │   ├── api/
│   │   │   ├── auth/       # Auth.js routes
│   │   │   └── stories/    # Story API routes
│   │   ├── auth/           # Auth pages
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── layout/         # App shell, navigation
│   │   ├── providers/      # Theme provider
│   │   └── ui/             # shadcn/ui components
│   ├── lib/
│   │   ├── auth.ts         # Auth.js config
│   │   ├── db.ts           # Prisma client
│   │   ├── gemini.ts       # Gemini AI service
│   │   ├── types.ts        # TypeScript types
│   │   └── utils.ts        # Utility functions
│   └── server/
│       ├── story-service.ts # Story business logic
│       └── utils.ts        # Server-only utilities
├── prototype/              # Original Vite prototype (reference)
│   ├── apps/prototype/     # Vite + React prototype app
│   ├── flows/              # User flow diagrams
│   ├── notes/              # Design notes
│   └── README.md           # Prototype documentation
├── prisma/
│   └── schema.prisma       # Database schema
└── docs/
    └── architecture.md     # Architecture overview
```

## API Routes

| Method | Path              | Description          |
| ------ | ----------------- | -------------------- |
| POST   | /api/stories      | Generate a new story |
| GET    | /api/stories      | List user's stories  |
| GET    | /api/stories/[id] | Get a single story   |
| PATCH  | /api/stories/[id] | Toggle favorite      |
| DELETE | /api/stories/[id] | Delete a story       |

## Scripts

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run Jest tests
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## Design System

EverNest uses a warm, calming color palette:

- **Primary**: Sage green (`#627562`) - calm, natural, nurturing
- **Background**: Warm cream (`#fdfcfa`) / Cozy dark (`#1c1a18`)
- **Typography**: DM Sans (sans) + Lora (serif for story content)
- **Borders**: Soft warm stone tones

## Development

This project follows strict TypeScript practices and includes:

- ESLint for code quality
- Jest for testing
- Prisma for type-safe database access
- shadcn/ui for consistent component design

Run tests before committing:

```bash
npm run lint
npm run test
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

_EverNest provides creative storytelling for bonding purposes only. It does not provide medical advice._
