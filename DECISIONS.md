# Design Decisions Log

This document records important design and architectural decisions.

## 2024-01-XX: Initial Setup

### Decision: Next.js 15 with App Router

**Context**: Need a modern React framework with SSR support.

**Decision**: Use Next.js 15 with App Router.

**Consequences**:
- Server Components for better performance
- Built-in routing and layouts
- TypeScript support out of the box

---

### Decision: Supabase for Backend

**Context**: Need a backend with auth, database, and realtime capabilities.

**Decision**: Use Supabase (PostgreSQL + Auth + RLS).

**Consequences**:
- Managed PostgreSQL with RLS
- Built-in authentication
- Realtime subscriptions available
- Free tier sufficient for MVP

---

### Decision: No ORM

**Context**: Should we use Prisma, Drizzle, or raw Supabase client?

**Decision**: Use Supabase client directly.

**Reasons**:
- Type-safe with generated types
- RLS works better with raw queries
- Less abstraction
- Simpler mental model

**Consequences**:
- Need to write SQL for complex queries
- Must maintain types manually (or use Supabase codegen)

---

### Decision: Tailwind CSS

**Context**: Need a styling solution.

**Decision**: Use Tailwind CSS.

**Reasons**:
- Utility-first for rapid development
- Consistent design system
- Small bundle with PurgeCSS
- Great TypeScript support

---

### Decision: Golden Ratio Layout

**Context**: Need a distinctive layout system.

**Decision**: Use golden ratio (61.8% / 38.2%) for main layout.

**Consequences**:
- Visually pleasing proportions
- Clear hierarchy
- Memorable design
- Responsive adjustments needed

---

### Decision: Half-Orbit Dock Navigation

**Context**: Need unique navigation that fits the "playful editorial" aesthetic.

**Decision**: Create a Half-Orbit Dock component.

**Requirements**:
- Active item centered and larger
- Adjacent items partially visible
- Drag, swipe, click, keyboard support
- Spring animations
- Screen reader accessible

**Consequences**:
- Custom component development
- Accessibility considerations
- Mobile adaptation needed

---

### Decision: Daypart Lanes for Schedule

**Context**: Need a non-generic schedule view.

**Decision**: Use daypart lanes (pagi, siang, sore, malam) instead of traditional calendar grid.

**Reasons**:
- Matches how people think about time
- Less cluttered than hourly grid
- Supports flexible scheduling
- Unique to the product

---

### Decision: Timestamp-based Focus Timer

**Context**: Focus timer must be accurate even when tab sleeps.

**Decision**: Use timestamp comparison instead of setInterval.

**Implementation**:
```typescript
const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
```

**Consequences**:
- Accurate timing
- No drift
- Simple implementation

---

### Decision: Hashed Invite Tokens

**Context**: Invite links need to be secure.

**Decision**: Store SHA-256 hash of invite tokens, never raw tokens.

**Consequences**:
- Tokens cannot be recovered from database
- Must show token to user immediately (only time it's visible)
- Secure against database leaks

---

### Decision: Optimistic Updates for Drag-and-Drop

**Context**: Board drag-and-drop should feel instant.

**Decision**: Update UI immediately, rollback on error.

**Consequences**:
- Better UX
- Need error handling
- Non-intrusive error messages

---

### Decision: Dynamic ECharts Import

**Context**: Charts should not slow down initial load.

**Decision**: Lazy load ECharts only when Insights tab is opened.

**Consequences**:
- Smaller initial bundle
- Loading state needed
- Better performance

---

### Decision: Custom SVG Illustrations

**Context**: Need brand illustrations without external dependencies.

**Decision**: Create custom SVG components.

**Illustrations**:
- Book + star (logo)
- Tilted flame streak
- Moon focus
- Report receipt
- Orbit people
- Two pencils
- Mascot "Bisi" (optional)

**Consequences**:
- Unique brand identity
- No copyright issues
- Inline React components
- Consistent stroke width

---

### Decision: Indonesian Copywriting

**Context**: Target audience is Indonesian.

**Decision**: Use Bahasa Indonesia with casual, warm tone.

**Guidelines**:
- Santai tapi serius
- Not too formal
- Not too slang
- No AI-sounding phrases

**Examples**:
- "report aja" (CTA)
- "belum ada yang ambis hari ini." (empty state)
- "aman. progresmu tercatat." (success)
- "gas dikit yuk" (nudge)

---

### Decision: Free Tier First

**Context**: Product should be accessible without payment.

**Decision**: Design for Supabase and Vercel free tiers.

**Constraints**:
- No external email service
- No paid APIs
- No AI features
- Limited storage
- Limited bandwidth

**Consequences**:
- Invite links instead of email invites
- Client-side image compression
- Lazy loading for heavy components
- Pagination for large datasets
