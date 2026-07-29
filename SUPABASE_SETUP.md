# Supabase Setup Guide

This guide will help you set up Supabase for the ngambis project.

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: ngambis (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be ready (usually 1-2 minutes)

## 2. Get API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

3. Create `.env.local` file in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Run Database Migrations

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Run migrations:
```bash
supabase db push
```

### Option B: Using SQL Editor

1. Go to **SQL Editor** in your Supabase dashboard
2. Create a new query
3. Copy and paste the contents of `supabase/migrations/00001_initial_schema.sql`
4. Click "Run"
5. Create another query
6. Copy and paste the contents of `supabase/migrations/00002_rls_policies.sql`
7. Click "Run"

## 4. Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional):
   - Go to **Authentication** → **Email Templates**
   - Customize the confirmation and recovery emails

4. Set up redirect URLs:
   - Go to **Authentication** → **URL Configuration**
   - Add these redirect URLs:
     - `http://localhost:3000/auth/callback` (for local development)
     - `https://your-domain.vercel.app/auth/callback` (for production)

## 5. Verify RLS Policies

1. Go to **Authentication** → **Policies**
2. Verify that all tables have RLS enabled
3. Check that policies exist for:
   - SELECT
   - INSERT
   - UPDATE
   - DELETE

## 6. Test the Setup

1. Start your development server:
```bash
pnpm dev
```

2. Try to:
   - Sign up with a new account
   - Sign in
   - Create a circle
   - Create a daily report

## Troubleshooting

### "relation does not exist" error
- Make sure you ran both migration files
- Check the SQL Editor for any error messages

### "permission denied" error
- Verify RLS policies are correctly set up
- Check that the user has the correct permissions

### Authentication issues
- Verify redirect URLs are configured correctly
- Check that email provider is enabled
- Clear browser cookies and try again

## Free Tier Limits

Supabase free tier includes:
- 500 MB database storage
- 1 GB file storage
- 50,000 monthly active users
- 2 GB bandwidth

Check the [Supabase pricing page](https://supabase.com/pricing) for current limits.
