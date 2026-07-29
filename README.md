# EstateFlow ERP Frontend v2

Frontend-only Next.js project for GitHub and Vercel. No Supabase, database, real authentication, storage, WhatsApp API, or server-side persistence is included yet.

## Included routes
- `/login`
- `/dashboard`
- `/contacts`
- `/properties`
- `/deals`
- `/meetings`
- `/organization/branches`
- `/organization/teams`
- `/organization/employees`
- `/hr/employees`
- `/hr/leave-balances`
- `/hr/leave-requests`
- `/hr/documents`

## Deploy
1. Back up or commit the current repository.
2. Delete the old repository contents, but keep `.git` if working locally.
3. Upload the contents of this folder to the repository root.
4. In Vercel set Framework Preset to **Next.js**.
5. Leave Build Command, Output Directory, and Install Command on defaults.
6. Redeploy.

## Local test
```bash
npm install
npm run build
npm run dev
```

## Important production boundary
All records currently use frontend mock state and reset after refresh. Do not use this version with real customer or employee data. Supabase authentication, database schema, Row Level Security, file storage, audit logs, consent enforcement, and notification delivery must be implemented before production use.
