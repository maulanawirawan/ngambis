# Deployment Guide

This guide covers deploying ngambis to Vercel with Supabase.

## Prerequisites

- GitHub account
- Vercel account
- Supabase project (see [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))

## 1. Push to GitHub

1. Create a new repository on GitHub
2. Push your code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/ngambis.git
git push -u origin main
```

## 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `pnpm build`
   - **Install Command**: `pnpm install`

## 3. Configure Environment Variables

Add these environment variables in Vercel:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_APP_URL` | Your Vercel deployment URL |

## 4. Update Supabase Redirect URLs

1. Go to your Supabase project
2. Navigate to **Authentication** → **URL Configuration**
3. Add your Vercel URL to redirect URLs:
   - `https://your-project.vercel.app/auth/callback`
   - `https://your-project.vercel.app/**`

## 5. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Visit your deployment URL

## 6. Post-Deployment Checklist

- [ ] Test sign up flow
- [ ] Test sign in flow
- [ ] Create a test circle
- [ ] Create a test report
- [ ] Test invite flow
- [ ] Test board drag-and-drop
- [ ] Test schedule creation
- [ ] Test focus session
- [ ] Verify RLS is working (try accessing another user's private data)

## Rollback

If you need to rollback:

1. Go to your Vercel project
2. Click "Deployments"
3. Find the previous working deployment
4. Click "..." → "Promote to Production"

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update Supabase redirect URLs with your custom domain

## Monitoring

- Check Vercel Analytics for performance metrics
- Monitor Supabase dashboard for database usage
- Set up Vercel alerts for failed deployments

## Troubleshooting

### Build fails
- Check the build logs in Vercel
- Verify all environment variables are set
- Run `pnpm build` locally to reproduce the error

### Authentication doesn't work
- Verify redirect URLs in Supabase
- Check that `NEXT_PUBLIC_APP_URL` is set correctly
- Clear browser cookies

### Database errors
- Check Supabase logs
- Verify RLS policies are correctly set up
- Check database connection limits
