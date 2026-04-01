# Cvistan — Professional CV Builder

A guest-first, mobile-friendly CV builder web application with live preview, dynamic templates, PDF export, cover letter generation, and multi-channel delivery.

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Zustand
- **Backend**: Next.js API Routes
- **Database**: Supabase (Postgres + Auth + Storage)
- **PDF**: Puppeteer + Chromium (server-side) with print fallback
- **DOCX**: `docx` library for cover letters
- **Email**: Resend
- **Telegram**: Telegram Bot API
- **Deployment**: Vercel + Cloudflare DNS

## Quick Start (Local Dev)

```bash
npm install
cp .env.example .env.local
# Fill in your env vars
npm run dev
```

## Full Deployment Guide

See the detailed step-by-step deployment instructions below.
