# EstateFlow ERP — GitHub Frontend Only

This package is a deployable Next.js frontend for GitHub and Vercel.

## Included

- Landing and sign-in screens
- Responsive ERP shell
- Dashboard
- Organization: Branches, Teams, Employees
- HR: Employees, Leave Balances, Leave Requests, Documents
- Modular route and component structure
- Mock data only

## Not included yet

- Supabase database
- Real authentication
- Persistent data
- File uploads
- Real permissions or branch isolation

The current sign-in button enters a frontend demo. It must not be treated as production authentication.

## Deploy to GitHub and Vercel

1. Extract the ZIP.
2. Upload all extracted files to the root of your GitHub repository.
3. In Vercel, use the Next.js framework preset.
4. Leave Root Directory and Output Directory blank.
5. Deploy. No environment variables are required for this frontend-only version.

## Local run

```bash
npm install
npm run dev
```

Open http://localhost:3000
