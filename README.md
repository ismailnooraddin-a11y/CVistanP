# EstateFlow — Organization & People

A production-structured frontend module for EstateFlow, designed for deployment through GitHub and Vercel.

## Included

- Organization overview dashboard
- Employee directory
- Interactive organization chart
- Branch management
- Leave request and approval workflow
- Team availability calendar
- Roles and permissions
- Responsive desktop/mobile layout
- Accessible forms, tables, status states, and modals

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Deploy to Vercel

1. Upload this project to the root of a GitHub repository.
2. Import the repository into Vercel.
3. Vercel detects Vite automatically.
4. Deploy.

## Important production note

This repository is a production-ready **frontend foundation**, not a complete production HR backend. Demo data is currently stored in the browser session. Before real customer use, connect it to:

- Authentication and multi-tenant user sessions
- A persistent database
- Backend authorization checks
- File/document storage
- Leave policy and balance calculations
- Audit logs and notification services
- Data privacy controls for sensitive employee fields
