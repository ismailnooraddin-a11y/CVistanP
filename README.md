# Cvistan — Professional CV Builder

A **guest-first, mobile-friendly CV builder** web application targeting Arabic-speaking markets. Build professional CVs through a 10-step wizard with live preview, 3 templates, PDF export, DOCX cover letter, and email delivery.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Zustand, Framer Motion |
| **Backend** | Next.js API Routes (Edge/Serverless) |
| **Database** | Supabase (PostgreSQL + Auth + Storage) |
| **PDF** | jsPDF (client-side) + Puppeteer (server-side fallback) |
| **DOCX** | `docx` library (server-side) |
| **Email** | Resend API |
| **Deployment** | Vercel |
| **DNS** | Cloudflare |

## Features

- **10-step CV Builder** with real-time preview
- **3 Professional Templates**: Classic ATS, Balanced Modern, Visual Elegant
- **Bi-directional**: Full Arabic RTL support
- **PDF Download** (client-side, no server required)
- **Cover Letter DOCX** (server-side generation)
- **Interview FAQ DOCX** (15 questions with sample answers)
- **Email Delivery** via Resend
- **Guest Mode**: Build CV without account
- **Auto-save**: Drafts persist in localStorage
- **Email Verification**: Secure account creation
- **Password Reset**: Self-service recovery

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your Supabase and Resend credentials
# See Environment Variables section below

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

Create a `.env.local` file (copy from `.env.example`) with the following:

### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```
Get these from: **Supabase Dashboard → Project Settings → API**

### Resend Email (Required)
```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@cvistan.com
EMAIL_FROM_NAME=Cvistan
```
Get from: [Resend API Keys](https://resend.com/apikeys)

### Application
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Cvistan
```

---

## Database Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the database to be provisioned
3. Note your **Project ID**, **anon key**, and **service role key**

### 2. Run Database Migrations

1. Open **Supabase Dashboard → SQL Editor**
2. Copy and paste the contents of `supabase/migration.sql`
3. Click **Run** to execute

This creates:
- `guest_sessions` table
- `resumes` table with RLS policies
- All resume section tables (experience, education, skills, etc.)
- Row Level Security (RLS) policies
- Auto-update triggers for `updated_at` timestamps

### 3. Configure Authentication

In **Supabase Dashboard → Authentication → Settings**:
- Enable **Email** provider
- Enable **Email confirmations** (required for verification flow)
- Set **Site URL** to your production URL
- Set **Redirect URLs** to include both production and localhost

---

## Deployment

### Vercel (Recommended)

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /path/to/cvistan
vercel
```

#### Option B: GitHub Integration
1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables in Vercel dashboard
4. Deploy

#### Required Environment Variables in Vercel

Add these in **Vercel Dashboard → Project → Settings → Environment Variables**:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `RESEND_API_KEY` | Your Resend API key |
| `EMAIL_FROM` | `noreply@cvistan.com` (or your domain) |
| `EMAIL_FROM_NAME` | `Cvistan` |
| `NEXT_PUBLIC_APP_URL` | Your production URL (e.g., `https://cvistan.com`) |

### Domain Configuration (Cloudflare)

1. Add your domain in Vercel project settings
2. In Cloudflare, point DNS to Vercel:
   - Type: `A`
   - Name: `@`
   - Value: `76.76.21.21`
3. Add `www` CNAME pointing to `cname.vercel-dns.com`

### Supabase Production Setup

1. Enable **Point-in-Time Recovery** for backups
2. Set up **Row Level Security** (already configured in migrations)
3. Configure **Email Templates** in Supabase Auth settings for verification

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/guest-session` | Create guest session |
| GET | `/api/resume` | List user resumes |
| POST | `/api/resume` | Create new resume |
| GET | `/api/resume/[id]` | Get resume by ID |
| PUT | `/api/resume/[id]` | Update resume (all sections) |
| DELETE | `/api/resume/[id]` | Delete resume |
| POST | `/api/resume/[id]/generate` | Generate PDF (server-side) |
| POST | `/api/resume/[id]/send-email` | Send resume via email |
| POST | `/api/auth/convert-guest` | Create account from guest |

---

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is **server-side only** — never expose to client
- All API routes use `createServiceClient()` for database operations
- Authorization checks verify resume ownership before any modification
- Row Level Security (RLS) enforces data isolation at database level
- Email verification required for new accounts
- Password reset via Supabase Auth flow

---

## Production Checklist

- [ ] Supabase project configured with RLS policies
- [ ] Email verification enabled in Supabase Auth
- [ ] Resend API key configured
- [ ] Environment variables set in Vercel
- [ ] Custom domain configured
- [ ] HTTPS enforced (automatic via Vercel)
- [ ] CSP headers configured (in `next.config.js`)
- [ ] 404 page created
- [ ] Health check endpoint tested

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (serverless functions)
│   ├── auth/             # Auth pages (signin, signup)
│   ├── builder/          # CV Builder page
│   ├── dashboard/        # User dashboard
│   └── ...
├── components/
│   ├── builder/         # Builder step components
│   ├── preview/         # Resume preview
│   └── ui/              # Reusable UI components
├── contexts/            # React contexts (Auth)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (Supabase client, PDF, etc.)
├── services/            # Business logic (email, DOCX)
├── store/               # Zustand state management
├── templates/           # CV template configs and renderer
└── types/               # TypeScript definitions
```

---

## License

MIT