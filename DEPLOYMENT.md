# CKD MealGuard — Deployment Guide

## Prerequisites

1. **GitHub Account** — [github.com](https://github.com)
2. **Vercel Account** — [vercel.com](https://vercel.com)
3. **Supabase Project** — Already created (with API keys ready)
4. **OpenAI API Key** — Already obtained
5. **Twilio Account** (optional) — For SMS features

---

## Step 1: Create GitHub Repository

### Option A: Via GitHub Web UI
1. Go to [github.com/new](https://github.com/new)
2. **Repository name**: `ckd-meal-saas`
3. **Description**: "AI-powered meal tracking for CKD patients"
4. **Visibility**: Public
5. Click "Create repository"

### Option B: Via GitHub CLI (if installed)
```bash
gh repo create ckd-meal-saas --public --source=. --remote=origin --push
```

---

## Step 2: Push Code to GitHub

After creating the repo on GitHub, run:

```bash
cd "d:\ai playground\ckd meal saas"
git remote add origin https://github.com/YOUR_USERNAME/ckd-meal-saas.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

---

## Step 3: Deploy to Vercel

### Via Vercel Web UI (Recommended)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"New Project"**
3. **Import Git Repository** → Select your `ckd-meal-saas` repo
4. **Project Name**: `ckd-meal-saas`
5. **Framework**: Next.js (auto-detected)
6. Click **"Configure Project"**

### Environment Variables

In Vercel dashboard, go to **Settings → Environment Variables** and add:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-...

# Twilio (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

**⚠️ IMPORTANT**: 
- Never commit `.env.local` to git
- Use Vercel's environment variable UI, not `.env` files
- Keep `SUPABASE_SERVICE_ROLE_KEY` secret (server-only)

### Deploy

7. Click **"Deploy"**
8. Wait for build to complete (usually 2-5 minutes)
9. Once deployed, you'll get a production URL

---

## Step 4: Configure Supabase Auth

In Supabase dashboard:

1. Go to **Authentication → Settings**
2. Under **Redirect URLs**, add your Vercel domain:
   ```
   https://your-project.vercel.app
   https://your-project.vercel.app/auth/callback
   ```

---

## Step 5: Configure Supabase Storage Bucket

If not already done:

```sql
-- Create public bucket for meal photos
insert into storage.buckets (id, name, public)
values ('meal-photos', 'meal-photos', true);

-- RLS policy: users can upload to their folder
create policy "Auth users can upload"
on storage.objects for insert
with check (
  bucket_id = 'meal-photos' 
  and auth.role() = 'authenticated'
);

-- RLS policy: users can read their own photos
create policy "Auth users can read own photos"
on storage.objects for select
using (
  bucket_id = 'meal-photos' 
  and auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Step 6: Test Production

1. Visit your Vercel deployment URL
2. **Sign up** with test account
3. **Select CKD stage**
4. **Upload meal photo** and verify analysis works
5. **Check history** and detail pages
6. **Test delete** functionality

### Checklist

- [ ] Login/Signup works
- [ ] Onboarding saves CKD stage
- [ ] Camera/upload works on mobile
- [ ] AI analysis returns results
- [ ] Meal saves to history
- [ ] Results detail page loads
- [ ] No console errors
- [ ] Responsive on mobile (use DevTools)

---

## Step 7: Optional — Custom Domain

1. In Vercel dashboard → **Settings → Domains**
2. Add your custom domain (e.g., `ckdmealguard.com`)
3. Update DNS records as instructed by Vercel
4. Update Supabase Auth redirect URLs with new domain

---

## Troubleshooting

### Build Fails
- Check **Vercel build logs** for TypeScript errors
- Ensure all environment variables are set
- Verify Node.js version matches (use 18 LTS or 20)

### Auth Redirects to Login Loop
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase **Auth → Settings → Redirect URLs** includes your Vercel domain

### AI Analysis Returns 502
- Verify `OPENAI_API_KEY` is valid and has credits
- Check Vercel logs for OpenAI API errors
- Ensure image URL is publicly accessible (Supabase Storage URL)

### Photos Don't Upload
- Check Supabase Storage bucket is public
- Verify RLS policies allow authenticated users to upload
- Check browser console for CORS errors

---

## Performance Monitoring

After deployment:

1. **Vercel Analytics**: [vercel.com/dashboard → Analytics](https://vercel.com)
2. **Supabase Monitoring**: Supabase dashboard → Metrics
3. **OpenAI Usage**: [platform.openai.com/account/usage](https://platform.openai.com/account/usage)

Set spending alerts:
- OpenAI: ⚙️ Settings → Billing → Usage limits (recommend $10/month for MVP)
- Vercel: Pro plan includes generous free tier

---

## Next Steps

### Phase 2 Features (Future)
- [ ] SMS reminders (Twilio fully integrated)
- [ ] Daily meal summaries
- [ ] Export meals as PDF
- [ ] Doctor sharing link
- [ ] Mobile app (React Native)

### Security Checklist
- [ ] Enable HTTPS (Vercel auto-renews)
- [ ] Review Supabase RLS policies
- [ ] Rotate API keys if compromised
- [ ] Monitor Vercel logs for errors
- [ ] Set up email alerts for deploys

---

## Support

For issues:
1. Check Vercel build logs
2. Check Supabase logs
3. Check browser DevTools console
4. Review `.env` variables are correctly set

Deployed successfully? 🎉 You now have a production CKD meal tracking app!
