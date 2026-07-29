# Security Model

This document describes the security model and measures implemented in ngambis.

## Row Level Security (RLS)

All user-facing tables have Row Level Security enabled. This ensures that users can only access data they are authorized to see.

### RLS Policies

Each table has policies for:
- **SELECT**: Users can only read data they have access to
- **INSERT**: Users can only create data for themselves
- **UPDATE**: Users can only modify their own data
- **DELETE**: Users can only delete their own data

### Helper Functions

```sql
-- Check if user is a member of a circle
is_circle_member(circle_id UUID, user_id UUID)

-- Check if user is an admin of a circle
is_circle_admin(circle_id UUID, user_id UUID)

-- Check if user can view a resource based on visibility
can_view_resource(visibility, owner_id, circle_id, user_id, resource_type, resource_id)
```

## Visibility Model

Resources support three visibility levels:

1. **private**: Only the owner can view
2. **circle**: All active circle members can view
3. **selected_members**: Only specific members can view

### Default Visibility

| Resource | Default |
|----------|---------|
| Planning card | private |
| Schedule item | private |
| Focus session | private |
| Daily report | circle |
| Commitment | private |
| Check-in | user choice |

## Lock Feature

Items can be locked to prevent access even from circle admins:

- Lock state is stored in the database (`is_locked`, `locked_at`, `locked_by`)
- Private items are never visible to admins
- Lock status is enforced by RLS, not just UI

## Invite Security

Invite tokens are:
- Generated using cryptographically secure random values
- Hashed (SHA-256) before storage
- Never stored in plain text
- Time-limited (7 days expiry)
- Use-limited (max 10 uses by default)
- Revocable by admins

## Service Role Key

The service role key:
- Is only used on the server
- Is never exposed to the client
- Is never prefixed with `NEXT_PUBLIC_`
- Is never logged or included in error messages

## Authentication

- Email/password authentication via Supabase Auth
- Session management handled by Supabase SDK
- Automatic session refresh
- Secure cookie storage

## API Security

- All mutations validated with Zod schemas
- CSRF protection via Next.js
- Rate limiting on sensitive endpoints
- Input sanitization
- No `dangerouslySetInnerHTML` without sanitization

## Headers

Security headers configured in `next.config.ts`:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

## Data Protection

- No sensitive data in localStorage
- Access tokens handled by Supabase SDK
- Passwords hashed by Supabase Auth
- No secrets in client-side code

## Threat Model

### Protected Against

- Unauthorized data access via RLS
- SQL injection via parameterized queries
- XSS via input sanitization
- CSRF via Next.js built-in protection
- Session hijacking via secure cookies

### Limitations

- Supabase operators with service role key have administrative access
- Database backups may contain user data
- Email delivery depends on Supabase infrastructure

## Responsible Disclosure

If you discover a security vulnerability, please report it to:
- Email: security@example.com (replace with actual contact)
- Do not disclose publicly until fixed

## Security Checklist

- [x] RLS enabled on all tables
- [x] RLS policies for all operations
- [x] Invite tokens hashed
- [x] Service role key server-only
- [x] Input validation with Zod
- [x] Security headers configured
- [x] No secrets in client
- [x] Password requirements enforced
- [x] Session refresh automatic
- [x] Secure cookie configuration
