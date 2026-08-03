# EstateFlow ERP — Frontend Demo v5

A frontend-first, multi-branch real-estate ERP and CRM prototype built with Next.js, React, and TypeScript.

This package is designed for realistic workflow and mobile testing before authentication, a permanent database, WhatsApp, contract approvals, and finance are connected in the backend phase.

## Included modules

- Dashboard generated from shared demo records
- Contacts with validation, duplicate checking, status controls, details, search, and filters
- Properties with ownership, photos, reservations, availability rules, details, search, filters, and Excel export
- Deals with controlled one-stage movement, reservation checks, loss reasons, and stage history
- Meetings with live dates, conflict checks, rescheduling, cancellation reasons, and mobile agenda view
- Tasks with assignment, priority, reminders, overdue detection, status changes, and editing
- Organization branches and teams
- Employees with branch/team/manager relationships, leave information, document status, and Excel export
- Company settings with company identity and logo upload
- Contract template management with protected text, editable text, selectable approved clauses, and dynamic variables
- A4 contract preview with real Word (`.docx`) and PDF (`.pdf`) export

## Branding

A Super Admin can open **Settings → Company Account** to update company details and upload a PNG, JPG, or WebP logo. The image is converted to a document-safe JPG, retains its aspect ratio, and appears on:

- the landing and login screens
- the application sidebar
- the company settings preview
- contract previews
- exported Word contracts
- exported PDF contracts

## Excel export scope

Excel export is intentionally available only in:

- **Employees** — Employees and Leave Balances sheets
- **Properties** — Properties and Reservations sheets

Each module supports filtered, all permitted, or selected-record export. Workbooks include styled headers, frozen rows, filters, readable widths, company identification, and export time.

## Contract content model

Templates contain ordered sections with one of these types:

- **Protected:** required static legal wording controlled by Super Admin
- **Editable:** transaction-specific approved text users may complete
- **Clause group:** users select one approved static clause option

Dynamic values use the format `{{variable_name}}`, for example:

```text
{{contract_number}}
{{company_name}}
{{client_name}}
{{property_reference}}
{{property_price}}
```

Known values populate from company, contact, property, and employee records. Custom variables added by an administrator appear as required fields in the contract builder.

## Shared frontend data

All modules use one shared demo data provider and browser `localStorage`. Changes remain after refresh and immediately affect linked modules and dashboard figures.

This is still frontend-only storage. Do not use it for production or confidential information.

## Run locally

Requirements:

- Node.js 20 or newer
- npm

```bash
npm install
npm run check
npm run dev
```

Open `http://localhost:3000`.

## Upload to GitHub and Vercel

1. Unzip the package.
2. Upload the **contents of the `estateflow-frontend-v5` folder** to the root of the connected GitHub repository.
3. Commit and push.
4. Vercel should detect Next.js automatically.
5. Build command: `npm run build`
6. Output settings: use the Next.js defaults.

No environment variables are required for this frontend demo.

## Reset the demo

Open **Settings → Company Account → Reset complete demo data** to remove locally created records, uploaded branding, and template edits and restore the sample data.

## Backend phase boundaries

The following are deliberately not represented as completed production capabilities:

- real sign-in, sessions, and account recovery
- server-enforced organization, branch, and role permissions
- permanent database storage and concurrency protection
- real WhatsApp messages and reminders
- permanent audit logs and approval histories
- electronic signatures
- contract approval workflow and immutable versions
- accounting, payments, commissions, tax, and finance reporting

The frontend data structures and linked workflows are prepared so these can be connected later without redesigning the entire interface.

## Validation

See `VALIDATION_REPORT.md` for the three validation and improvement cycles. See `FRONTEND_TEST_CHECKLIST.md` for the recommended user acceptance test.
