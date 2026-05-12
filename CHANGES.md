# Changes — Frontend fix pass

This release rewrites five files; `vercel.json`, `assets/logo.png`, and `README.md`
are unchanged.

## Files changed

| File | Summary |
|------|---------|
| `app.js` | Header HTML rebuilt with valid markup. Per-patient clinical data added (admission source, allergies, problems, care team) for all 10 patients. New `makeVitalSeries()` helper generates plausible 6-hour vital trajectories. Dead code removed; session id persisted; clock interval no longer leaks. |
| `styles.css` | Consolidated into a single, coherent stylesheet (no more silent "projector mode" overrides). `--text-muted` darkened to `#5b6878` for WCAG AA. Warning color changed to amber `#b45309` so it stops fighting the brand orange. Logo frames removed on header and login card. Critical row tint bumped and given an inset left border. Vital alarm/warn states now signal with colored left border + glyph, not color alone. Lab high/low values get arrow glyphs. Focus rings, skip-link utility, responsive breakpoints at 1100 px and 760 px added. |
| `index.html` | Inline styles moved to classes. Better logo alt text. `role="note"` on the research warning. `autocomplete="current-password"` on password field. |
| `dashboard.html` | Sort dropdown actually sorts (risk, bed, LOS, name). Filter dropdown actually filters (critical, watch, all). "Last refresh" label ticks every second; table re-renders every 30 s. Table rows are keyboard-navigable. `<th scope="col">`, skip-to-content link, `<main>` landmark, `sr-only` heading scaffolding. Empty-state row when filter matches zero. |
| `patient.html` | Proper `<h1>` (sr-only). Breadcrumb is a real `<nav aria-label="Breadcrumb">` with a real `<a href>`. Admission, allergies, problems, care team, labs, and meds are now per-patient. Vital trajectories use the new generator (fixes the p10 glitch). Tab buttons get proper ARIA. **Pathway diagram restructured** — arrow labels now live in their own band BELOW the boxes so they no longer collide with box content; correlated-only signals are clearly separated from the causal chain with an explicit header. **Trajectory chart restructured** — two stacked panels (small multiples) replace the unscaled dual-line plot, each with its own Y-axis ticks, gridlines, unit label, and a "now" value badge; a shared marker line and shared X-axis tie them together. |

## Deploy

```bash
git add app.js styles.css index.html dashboard.html patient.html CHANGES.md
git commit -m "Restructure CPE pathway diagram and trajectory chart; frontend fixes"
git push origin main
```

Vercel will redeploy automatically (~30 s).
