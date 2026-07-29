# ngambis.

**Santai, tapi serius.**

Private accountability dan planning workspace untuk kamu dan circle-mu.

## Features

- 📊 **Daily Report** - Catat progres harian dengan topik, pembelajaran, blocker, dan next step
- 📋 **Paper Trail Board** - Kanban board dengan drag-and-drop, custom stages, dan checklist
- 🕐 **Rhythm Planner** - Jadwal dengan daypart lanes (pagi/siang/sore/malam) dan recurring items
- ⏱️ **Focus Session** - Timer fokus dengan timestamp-based accuracy
- 🤝 **Commitments** - Weekly commitments dengan auto-progress dari linked cards
- ✅ **Check-in** - Quick daily check-in (siap gas, santai dulu, agak penuh, sedang off)
- 👋 **Gentle Nudge** - Kirim dukungan singkat ke circle member
- 🔒 **Privacy Control** - Private, circle, atau selected members per item
- 📈 **Archive & Insights** - Heatmap kalender dan chart aktivitas

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Auth**: Supabase Auth
- **Charts**: Apache ECharts
- **Drag & Drop**: dnd-kit
- **Animation**: Motion for React
- **Testing**: Vitest + Playwright

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase account (free tier)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ngambis
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Fill in your Supabase credentials in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

5. Run database migrations (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

6. Start the development server:
```bash
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run TypeScript check |
| `pnpm test` | Run unit tests |
| `pnpm test:e2e` | Run E2E tests |

## Project Structure

```
ngambis/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   └── invite/            # Invite acceptance page
├── components/            # React components
│   ├── illustrations/     # Custom SVG illustrations
│   ├── orbit-dock/        # Half-Orbit Dock navigation
│   ├── board/             # Kanban board components
│   ├── rhythm/            # Schedule planner components
│   └── ...
├── lib/                   # Utility functions
│   ├── supabase/          # Supabase client setup
│   └── validation/        # Zod schemas
├── supabase/
│   └── migrations/        # SQL migrations
├── types/                 # TypeScript types
└── tests/                 # Test files
```

## Environment Variables

See [.env.example](./.env.example) for required environment variables.

## Documentation

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Database setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [SECURITY.md](./SECURITY.md) - Security model
- [PRIVACY_MODEL.md](./PRIVACY_MODEL.md) - Privacy model explanation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture decisions
- [DECISIONS.md](./DECISIONS.md) - Design decisions log

## License

Private project. All rights reserved.
