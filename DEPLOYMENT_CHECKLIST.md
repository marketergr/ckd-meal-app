# CKD MealGuard — Deployment Checklist

## ✅ Pre-Deployment (You are here)

- [x] Git repository initialized
- [x] Code committed to main branch
- [x] README created with project overview
- [x] DEPLOYMENT.md guide written
- [x] vercel.json config created
- [x] Environment variables documented (.env.example)
- [x] Build succeeds locally (`npm run build`)

---

## 🚀 Phase 1: Create GitHub Repository

**Timeline: 5 minutes**

### Steps

1. **Go to [github.com/new](https://github.com/new)**
   - Repository name: `ckd-meal-saas`
   - Description: "AI-powered meal tracking for CKD patients"
   - Visibility: **Public** (required for Vercel free tier)
   - Do NOT initialize with README (we have one)
   - Click "Create repository"

2. **Push code from your local repo**
   ```bash
   cd "d:\ai playground\ckd meal saas"
   git remote add origin https://github.com/YOUR_USERNAME/ckd-meal-saas.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR_USERNAME` with your GitHub handle

3. **Verify on GitHub**
   - Check https://github.com/YOUR_USERNAME/ckd-meal-saas
   - Confirm all files are there (especially src/, supabase/, etc.)

---

## 🎯 Phase 2: Prepare Supabase

**Timeline: 10 minutes**

### Supabase Project Setup

1. **Create/confirm Supabase project**
   - Go to [supabase.com/dashboard](https://supabase.com/dashboard)
   - Create new project (or use existing)
   - Note your project URL and API keys

2. **Run database migration**
   - In Supabase dashboard: **SQL Editor**
   - Create new query
   - Copy/paste contents of `supabase/migrations/001_initial_schema.sql`
   - Click "Run"
   - Confirm all tables created: `profiles`, `meals`, `meal_ingredients`, `ckd_stage_thresholds`, `sms_settings`

3. **Create Storage Bucket**
   - Go to **Storage** tab
   - Click "Create new bucket"
   - Name: `meal-photos`
   - Make it **Public**
   - Click "Create bucket"

4. **Set up RLS policies for Storage**
   - In **Storage → meal-photos → Policies**
   - Create policy for INSERT:
     ```
     CREATE POLICY "Auth users can upload"
     ON storage.objects FOR INSERT
     WITH CHECK (
       bucket_id = 'meal-photos' 
       AND auth.role() = 'authenticated'
     );
     ```
   - Create policy for SELECT:
     ```
     CREATE POLICY "Public read access"
     ON storage.objects FOR SELECT
     USING ( bucket_id = 'meal-photos' );
     ```

5. **Collect API Keys**
   - Go to **Settings → API**
   - Copy: `Project URL`, `anon key`, `service_role key`
   - Save these for Step 3 (Vercel env vars)

---

## 🌐 Phase 3: Deploy to Vercel

**Timeline: 15 minutes**

### Create Vercel Project

1. **Go to [vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click **"New Project"**
3. **Import Git Repository**
   - Select your `ckd-meal-saas` repo
   - If not listed, click "Add GitHub App" to authorize
4. **Project settings:**
   - Project name: `ckd-meal-saas`
   - Framework: **Next.js** (auto-detected)
   - Root directory: `. (root)`
   - Build command: `npm run build` (auto-filled)
   - Output directory: `.next` (auto-filled)
5. Click **"Configure Project"** (or skip to next step)

### Add Environment Variables

In Vercel dashboard → Your project → **Settings → Environment Variables**

Add these variables (match your Supabase + OpenAI values):

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
OPENAI_API_KEY = sk-your-openai-key-here

# Optional (for SMS)
TWILIO_ACCOUNT_SID = (leave empty for now)
TWILIO_AUTH_TOKEN = (leave empty for now)
TWILIO_PHONE_NUMBER = (leave empty for now)
```

⚠️ **IMPORTANT:**
- `SUPABASE_SERVICE_ROLE_KEY` should be marked as **Sensitive**
- `OPENAI_API_KEY` should be marked as **Sensitive**
- These are server-only, will not be exposed to browser

### Deploy

1. Click **"Deploy"** button
2. Watch the deployment logs (usually 2-5 minutes)
3. Once complete, you'll see **"Congratulations!"** with your live URL
4. Your app is now live! 🎉

---

## 🔐 Phase 4: Configure Auth Redirects

**Timeline: 5 minutes**

### Update Supabase Auth Redirect URLs

1. **Go to Supabase dashboard → Authentication → Settings**
2. Under **Redirect URLs**, add:
   ```
   https://your-vercel-domain.vercel.app
   https://your-vercel-domain.vercel.app/auth/callback
   ```
   (Replace `your-vercel-domain` with your actual Vercel URL)

3. Click **"Save"**

### Update NEXT_PUBLIC_APP_URL in Vercel

In Vercel dashboard:
- Go to **Settings → Environment Variables**
- Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
- Redeploy (auto-triggered or manual)

---

## ✨ Phase 5: Test Production

**Timeline: 10 minutes**

### Feature Testing Checklist

- [ ] **Authentication**
  - Visit your Vercel URL
  - Click "Sign up"
  - Create test account with email + password
  - Should redirect to onboarding

- [ ] **Onboarding**
  - Select CKD Stage 3b
  - Click "Continue"
  - Should redirect to `/scan`

- [ ] **Scanner**
  - On mobile: Test camera capture
  - On desktop: Test drag-drop or file upload
  - Upload a meal photo
  - Loading animation should show

- [ ] **AI Analysis**
  - Wait for analysis to complete
  - Results modal should appear
  - Should show ingredients, nutrients, safety badge
  - No API errors in browser console

- [ ] **Save Meal**
  - Click "Save to History"
  - Should redirect to results detail page
  - Photo, ingredients, and nutrients should display

- [ ] **History**
  - Click "History" in navbar
  - Saved meal should appear in list
  - Click meal card to view details
  - Delete button should work

- [ ] **Responsive**
  - Test on mobile (375px width) - use DevTools
  - Bottom nav should be visible
  - Camera should work
  - All text should be readable

### Browser Console Check
- Open DevTools (F12)
- Check **Console** tab
- Should be **no errors** (warnings are OK)
- If errors appear, note them for debugging

---

## 🐛 Troubleshooting

### Build Failed
**Error:** "Build failed"
- Check Vercel build logs (Deployments → Failed → View logs)
- Common issues:
  - TypeScript errors: `npm run build` locally to find them
  - Missing env vars: Verify all are set in Vercel
  - Node version: Vercel uses Node 20.x by default

### Auth Loop (Redirects to login)
**Error:** Stuck on login page after signup
- Check **Supabase → Authentication → Settings**
- Verify redirect URLs include your Vercel domain
- Check browser Network tab for CORS errors

### AI Analysis Returns Error
**Error:** "502 Bad Gateway" or analysis fails
- Verify `OPENAI_API_KEY` is valid (check usage at [platform.openai.com/account/usage](https://platform.openai.com/account/usage))
- Check OpenAI account has credits
- In Supabase Storage, confirm image URL is public

### Photos Don't Upload
**Error:** Upload fails or 404 on photo
- Check Supabase Storage bucket is **Public**
- Verify RLS policies are created
- Check browser console for CORS/permission errors
- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct

---

## 📊 Post-Deployment Monitoring

### Set Spending Limits

**OpenAI:**
1. Go to [platform.openai.com/account/billing/limits](https://platform.openai.com/account/billing/limits)
2. Set **Hard limit** to $10/month
3. Receive alerts if nearing limit

**Vercel:**
1. Vercel free tier includes generous usage
2. Optional: Upgrade to Pro ($20/month) for more concurrent builds
3. Monitor usage in **Settings → Usage**

### View Logs

**Vercel Logs:**
- Dashboard → Deployments → Select latest → View logs

**Supabase Logs:**
- Dashboard → Logs (top right) → Filter by project

**OpenAI Usage:**
- [platform.openai.com/account/usage](https://platform.openai.com/account/usage)

---

## 🎉 You're Done!

Your CKD MealGuard app is now live on Vercel!

### Next Steps

1. **Test with real users** — Have CKD patients try it
2. **Collect feedback** — What features matter most?
3. **Monitor usage** — Check logs for errors
4. **Plan Phase 2** — SMS reminders, PDF exports, etc.

### Share Your App

- **URL**: https://your-vercel-domain.vercel.app
- **GitHub**: https://github.com/YOUR_USERNAME/ckd-meal-saas
- **Tell healthcare providers** about the free resource

---

## 📞 Need Help?

- **Vercel docs**: [vercel.com/docs](https://vercel.com/docs)
- **Supabase docs**: [supabase.com/docs](https://supabase.com/docs)
- **OpenAI docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
- **Next.js docs**: [nextjs.org/docs](https://nextjs.org/docs)

---

**Deployment started: 2026-06-06**
**Status**: ✅ Ready for deployment
