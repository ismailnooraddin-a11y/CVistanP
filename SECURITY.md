# Security Policy

EstateFlow Pro is supplied as a deployable product demonstration and production architecture foundation. Do not store real customer, employee, financial, identity, or contract data until the controls in `docs/PRODUCTION-READINESS.md` are implemented and independently reviewed.

## Reporting a vulnerability

Do not open a public issue containing exploit details, credentials, personal data, or customer information. Configure a private security contact for your organization before launch and publish it in this file and in your product security page.

A useful report includes:

- affected version or commit;
- affected tenant, role, route, or integration boundary;
- reproduction steps;
- expected and actual behavior;
- impact assessment;
- logs or screenshots with secrets and personal data removed.

## Secret handling

- Never commit `.env` files, private keys, access tokens, webhooks secrets, or production database URLs.
- Store secrets in Vercel, your cloud secret manager, or an equivalent managed vault.
- Rotate any credential immediately if it enters Git history.
- Use separate credentials for development, preview/staging, and production.

## Required launch controls

Before processing live data, implement real identity, MFA for privileged accounts, server-side authorization, tenant-safe database access, audit retention, file scanning, rate limits, webhook verification, backups, restore tests, monitoring, incident response, and an independent penetration test.
