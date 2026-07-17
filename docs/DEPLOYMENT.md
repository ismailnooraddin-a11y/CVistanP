# Deployment Guide

## Vercel from GitHub

1. Extract the project ZIP.
2. Create a new empty GitHub repository.
3. Upload the files at the extracted project root. `package.json`, `pnpm-lock.yaml`, `app`, and `src` must be at the repository root.
4. Import the repository in Vercel.
5. Confirm:
   - Framework preset: Next.js
   - Root directory: repository root
   - Install command: `pnpm install --frozen-lockfile`
   - Build command: `pnpm build`
6. Deploy.

The commands are already declared in `vercel.json`. Vercel should not run `npm install`, which avoids the npm installer issue encountered in the earlier repository.

## Verify the deployment

Open:

```text
https://your-project.vercel.app/api/health
```

Expected response shape:

```json
{
  "status": "ok",
  "service": "estateflow-pro",
  "version": "1.0.0",
  "dataMode": "demo"
}
```

Then review:

- `/sign-in`
- `/dashboard`
- `/sales/leads`
- `/properties/inventory`
- `/communications/inbox`
- `/people/org-chart`
- `/people/leave`
- `/admin/packages`
- `/ai`

## GitHub Actions

`.github/workflows/ci.yml` runs on pushes to `main` and pull requests:

1. Frozen dependency installation
2. ESLint
3. Strict TypeScript
4. Static CSS class consistency check
5. Automated tests
6. Production build
7. Production-server route and security-header smoke test

Protect the `main` branch and require this workflow before merging changes.

## Environment modes

The repository works without secrets in demo mode.

```env
NEXT_PUBLIC_DATA_MODE=demo
```

For real customer data, create separate Vercel projects or environment configurations for development, preview/staging, and production. Never reuse production secrets in preview deployments.

## Docker

The provided Dockerfile uses a multi-stage Next.js build and installs production-only runtime dependencies in the final image.

```bash
docker compose up --build
```

Production operators should additionally configure:

- Read-only root filesystem where possible
- Runtime secret injection
- Health and readiness probes
- Container image scanning
- Log shipping
- CPU and memory limits
- Graceful shutdown

## Custom domain

Recommended domain separation:

```text
www.yourbrand.com       public marketing site
app.yourbrand.com       EstateFlow application
docs.yourbrand.com      help center
status.yourbrand.com    service status
```

## Rollback

Vercel retains prior deployments. Promote a verified previous deployment if a release fails. Database migrations must use backward-compatible expand/migrate/contract steps so application rollback remains possible.
