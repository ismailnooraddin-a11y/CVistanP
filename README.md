# EstateFlow ERP

Production-oriented modular monolith for small and medium real-estate agencies.

## Included now
- Google, passwordless email and phone authentication through Supabase
- Mandatory first-branch onboarding with Erbil / Kurdistan Region / Iraq defaults
- Branch-scoped role model and database Row Level Security
- Dashboard
- Organization: Branches, Teams, Employees
- HR: Employees, leave balances, leave requests, employee-document registry
- Separate folders/routes for Contacts, Properties, Pipeline, Tasks, Contracts and Finance
- Responsive warm premium real-estate design

## Deploy
1. Create a Supabase project.
2. Open Supabase SQL Editor and run `supabase/migrations/001_initial_schema.sql`.
3. In Authentication, enable Google and Email. For phone login, configure a supported SMS provider.
4. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-VERCEL-DOMAIN/auth/callback`
5. Create a private Storage bucket named `employee-documents`.
6. Copy `.env.example` to `.env.local` and enter your Supabase values.
7. Upload this folder to GitHub and import/connect it in Vercel.
8. Add the same environment variables in Vercel for Development, Preview and Production.

## Environment variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL`

## Important production notes
- UI role checks are not security. Supabase RLS is the enforcement layer.
- Do not put service-role keys in the browser or GitHub.
- Phone authentication does not work until an SMS provider is configured.
- This delivery establishes the foundation and implements Organization/HR. The remaining CRM/ERP routes are prepared but intentionally not presented as completed business modules.
