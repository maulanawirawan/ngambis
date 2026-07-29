# Architecture

This document describes the architecture of ngambis.

## Overview

```
┌─────────────────┐
│   Browser       │
│   (React SPA)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js       │
│   (App Router)  │
│   - SSR/RSC     │
│   - Server      │
│     Actions     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Supabase      │
│   - PostgreSQL  │
│   - Auth        │
│   - RLS         │
│   - Realtime    │
└─────────────────┘
```

## Frontend

### Framework: Next.js 15 (App Router)

- **Server Components**: For data fetching and static content
- **Client Components**: For interactivity (drag-and-drop, timers, forms)
- **Server Actions**: For mutations
- **Route Handlers**: For API endpoints

### State Management

- **Server State**: Fetched via Server Components and Supabase
- **Client State**: React hooks (useState, useEffect)
- **URL State**: Search params for filters
- **No global state library**: Keep it simple

### Styling

- **Tailwind CSS**: Utility-first CSS
- **CSS Custom Properties**: For design tokens
- **Golden Ratio System**: 61.8% / 38.2% layout split

## Backend

### Database: Supabase PostgreSQL

- **Row Level Security**: All tables protected
- **Migrations**: SQL files in `supabase/migrations/`
- **Indexes**: Optimized for common queries
- **Triggers**: Auto-update `updated_at` timestamps

### Authentication: Supabase Auth

- **Email/Password**: Primary authentication method
- **Session Management**: Handled by Supabase SDK
- **Auto Refresh**: Sessions refreshed automatically

### API Layer

- **Server Components**: Direct database access
- **Server Actions**: For mutations
- **Route Handlers**: For webhooks and external APIs

## Data Flow

### Read Flow

```
User Request
    │
    ▼
Server Component
    │
    ▼
Supabase Client (Server)
    │
    ▼
PostgreSQL with RLS
    │
    ▼
Response to User
```

### Write Flow

```
User Action
    │
    ▼
Client Component
    │
    ▼
Server Action / Route Handler
    │
    ▼
Zod Validation
    │
    ▼
Supabase Client (Server)
    │
    ▼
PostgreSQL with RLS
    │
    ▼
Revalidate / Refresh
```

## Key Design Decisions

### 1. No ORM

**Decision**: Use Supabase client directly instead of Prisma/Drizzle

**Reasons**:
- Supabase client is already type-safe
- RLS works better with raw queries
- Less abstraction = fewer bugs
- Simpler mental model

### 2. Server Components First

**Decision**: Use Server Components for data fetching

**Reasons**:
- Better performance (less client JS)
- Automatic code splitting
- Direct database access
- SEO friendly

### 3. Optimistic Updates

**Decision**: Use optimistic updates for drag-and-drop

**Reasons**:
- Better UX (instant feedback)
- Rollback on error
- Non-intrusive error handling

### 4. Timestamp-based Timer

**Decision**: Use timestamps instead of intervals for focus timer

**Reasons**:
- Accurate even when tab sleeps
- No drift over time
- Simple to implement

### 5. Dynamic Chart Import

**Decision**: Lazy load ECharts

**Reasons**:
- Smaller initial bundle
- Charts only loaded when needed
- Better performance

## File Structure

```
ngambis/
├── app/                    # Next.js pages
│   ├── (auth)/            # Auth pages (login, signup)
│   ├── (dashboard)/       # Protected pages
│   │   ├── today/         # Today view
│   │   ├── board/         # Kanban board
│   │   ├── rhythm/        # Schedule planner
│   │   ├── archive/       # Archive & insights
│   │   ├── circle/        # Circle management
│   │   ├── focus/         # Focus timer
│   │   └── settings/      # User settings
│   └── invite/            # Invite acceptance
├── components/            # React components
│   ├── illustrations/     # Custom SVGs
│   ├── orbit-dock/        # Navigation dock
│   └── [feature]/         # Feature components
├── lib/                   # Utilities
│   ├── supabase/          # Database client
│   ├── validation/        # Zod schemas
│   └── utils/             # Helpers
├── supabase/
│   └── migrations/        # SQL migrations
├── types/                 # TypeScript types
└── tests/                 # Test files
```

## Performance Considerations

### Bundle Size

- Route-level code splitting
- Dynamic imports for heavy components
- Tree shaking with ES modules

### Database Queries

- Selective column fetching
- Pagination for large datasets
- Indexes on common query patterns
- No N+1 queries

### Caching

- Server Components cached by default
- Revalidation on mutation
- No client-side cache for private data

## Security Architecture

### Defense in Depth

1. **Client**: Input validation, no secrets
2. **Server**: Authentication, authorization
3. **Database**: Row Level Security

### Trust Boundaries

- Browser → Server: Untrusted
- Server → Database: Trusted (but still uses RLS)

## Scalability

### Current Design (Free Tier)

- Single Supabase project
- Vercel serverless functions
- No caching layer

### Future Considerations

- Read replicas for scaling
- Redis for caching
- CDN for static assets
- Background jobs for heavy processing
