# Optional Supabase/PostgreSQL foundation

`migrations/0001_core.sql` provides a broad multi-tenant schema and row-level security starting point for EstateFlow Pro.

It is not automatically connected to the demo UI. Apply it only in a dedicated development Supabase project first.

## Suggested workflow

```bash
supabase init
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Before production:

- Review all SQL with a PostgreSQL/security specialist.
- Replace broad member mutation policies with permission- and scope-specific policies or secure server-only RPC/API methods.
- Add private storage buckets and signed URL policies.
- Add migrations for your country-specific finance, contract, privacy, and employment requirements.
- Add seed scripts and API integration tests.
- Verify cross-tenant reads and writes fail at both API and database layers.

The migration intentionally prevents normal authenticated users from inserting or mutating audit events. Trusted server code should record audit events using a service role or a narrowly scoped security-definer function.
