# CKD MealGuard 🥗💚

**AI-powered meal tracking for Chronic Kidney Disease patients**

An intelligent web application that helps CKD patients safely track their meals by analyzing photos with AI to estimate potassium, phosphorus, and protein content.

## Features

### 🔐 Authentication
- Email/password signup & login
- Supabase Auth integration
- CKD stage selection on first login
- Secure session management

### 📸 AI Meal Scanner
- Mobile camera capture or desktop file upload
- GPT-4o vision model for accurate nutrient estimation
- Real-time analysis with medical-grade animations
- Conservative nutrient estimates (safe for CKD)

### 📊 Safety Assessment
- Dynamic safety verdict based on daily limits
- Color-coded indicators (Safe, Caution, Dangerous)
- CKD stage-specific thresholds (Stages 1-5 + Dialysis)
- Daily progress rings for K/P/Protein intake

### 📜 Meal History
- Infinite scroll meal list with thumbnails
- Detailed results view per meal
- Edit/delete functionality
- Nutrient breakdown by ingredient

### 📱 Responsive Design
- Mobile-first responsive layout
- Sticky navbar + bottom navigation
- Touch-optimized UI for elderly patients
- High contrast for accessibility (WCAG AA+)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| **Backend** | Next.js API routes, Supabase (PostgreSQL) |
| **Auth** | Supabase Auth (Email/Password) |
| **Storage** | Supabase Storage (meal photos) |
| **AI** | OpenAI GPT-4o Vision |
| **SMS** | Twilio SDK (optional) |
| **Deployment** | Vercel |

---

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Create .env.local with your API keys
cp .env.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Deploy to Vercel

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

---

## Environment Variables

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (required)
OPENAI_API_KEY=sk-...

# Twilio (optional)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

---

## Project Structure

```
src/
├── app/                    # Next.js pages
│   ├── (auth)/            # Login, signup
│   ├── api/               # API routes
│   ├── scan/              # Main scanner
│   ├── history/           # Meal history
│   └── results/[mealId]/  # Meal details
├── components/            # React components
├── lib/                    # Utilities
├── hooks/                  # Custom hooks
├── types/                  # TypeScript types
└── middleware.ts           # Auth refresh
```

---

## CKD Thresholds

| Stage | Potassium | Phosphorus | Protein |
|-------|-----------|-----------|---------|
| 1–2   | 3500 mg   | 1000 mg   | 60 g    |
| 3a    | 3000 mg   | 900 mg    | 50 g    |
| 3b    | 2500 mg   | 800 mg    | 45 g    |
| 4     | 2000 mg   | 750 mg    | 40 g    |
| 5     | 1500 mg   | 700 mg    | 35 g    |
| Dialysis | 2500 mg | 1000 mg   | 70 g    |

---

## Learn More

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**Built with ❤️ for CKD patients**
