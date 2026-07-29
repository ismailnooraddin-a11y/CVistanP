# EstateFlow engineering rules
- Keep a modular monolith under src/modules and route folders.
- Enforce authorization in Supabase RLS, never only in React.
- Every business table must include branch_id and appropriate RLS.
- Never hard-delete employees with business history; use status changes.
- All balance changes must eventually be transaction-ledger based and audited.
- Never expose SUPABASE_SERVICE_ROLE_KEY to client code.
