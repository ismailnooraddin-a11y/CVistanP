# ICU Clinical Decision Support — TBU Research Prototype

A clickable demo built for a PhD defense at **Tomas Bata University in Zlín**.
The site walks a viewer through a realistic ICU workflow: login → 10-patient
ICU dashboard → patient detail → AI prediction → comparison between **SHAP**
(today's correlation-based explanation) and **CPE — Causal Pathway Explanations**
(the proposed approach).

> **Note on framing.** This is intentionally branded as a *research prototype*
> from TBU, not a deployed hospital product. All patient data is synthetic.
> The banner across the top of every screen says so explicitly.

---

## What's in the demo

- **`index.html`** — Login screen with TBU logo. **Accepts any username/password.**
- **`dashboard.html`** — ICU board with 10 Czech patients, 3 flagged critical
  (Svobodová 94%, Novák 88%, Dvořák 81%), realistic vitals, MRN, beds, trends.
- **`patient.html?id=p1`** — Detail view of Marie Svobodová (the 94% case):
  vitals strip, recent labs with reference ranges, active medications,
  admission info, care team. The **"Explain prediction"** button reveals an
  explanation panel with a tab toggle between **SHAP** and **CPE**.
- Clicking any patient row on the dashboard navigates to that patient's detail.

---

## Running locally (optional, before deployment)

No build step. Open any HTML file in a browser:

```bash
# from this folder:
python3 -m http.server 8080
# then visit http://localhost:8080
```

Or just double-click `index.html`.

---

## Deployment — push to GitHub, then Vercel

1. **Create the GitHub repo**

   ```bash
   git init
   git add .
   git commit -m "Initial commit — ICU CDS research prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/icu-cds.git
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to https://vercel.com/new
   - Import the GitHub repo
   - Framework preset: **Other** (this is a pure static site)
   - Root directory: leave as `/`
   - Build command: **leave empty**
   - Output directory: **leave empty**
   - Click **Deploy**

   Vercel will serve the static files directly. First deploy takes ~30 seconds.

3. **Attach your custom domain**

   In your Vercel project: **Settings → Domains → Add**.
   Paste your domain, then add the DNS records Vercel shows you at your
   registrar. Propagation usually completes in a few minutes.

---

## Demo walkthrough (suggested narration)

> *"This is what a hospital information system might look like at our hospital.
> I sign in…"* — type anything, click **Sign in**.
>
> *"This is my morning ICU board. Ten patients. Three are flagged critical by
> the AI risk model — that's where I look first."* — scroll through the rows,
> point at the red ones.
>
> *"Mrs. Svobodová, day 2 post-cardiac surgery, 94% AKI risk. I click in."*
> — click the top row.
>
> *"I can see her vitals are deteriorating — MAP is 64, urine output is 18 mL/hr.
> But the AI says 94%. Why? I click Explain prediction."* — click the button.
>
> *"This is what most explainable-AI systems show today: a SHAP plot. 18 features,
> technical names, ranked by statistical importance. Heart rate is the top
> contributor. So… do I give a beta-blocker?"*
>
> *"Now let me switch to the system I built — Causal Pathway Explanations."*
> — click the **CPE** tab.
>
> *"Same patient, same prediction. But now I see the actual upstream cause:
> BUN started climbing 7 hours ago, creatinine followed. Heart rate is
> correlated but not causal. And here are concrete actions that target the
> cause, not the symptom."*


## Projector-ready edits in this version

- Removed the left navigation panel from the dashboard and patient pages.
- Enlarged typography, cards, risk labels, vitals, tables, and buttons for visibility in a large hall.
- Simplified the top header to reduce distraction during the presentation.
- Expanded the CPE causal pathway diagram with longer arrows and fewer visual distractions.
- Added `assets/logo.png` so the GitHub/Vercel deployment works directly from this zip.

---

## File structure

```
icu-cds/
├── index.html         ← Login
├── dashboard.html     ← 10-patient ICU board
├── patient.html       ← Detail view with SHAP / CPE toggle
├── styles.css         ← Shared clinical styling
├── app.js             ← Shared logic (patient data, chrome, helpers)
├── vercel.json        ← Static hosting config
├── assets/
│   └── logo.png       ← Tomas Bata University logo
└── README.md
```

---

## Customizing before the defense

- **Patient names / data** — edit the `PATIENTS` array in `app.js`.
- **Hospital name / branding** — edit `SYSTEM` at the top of `app.js`.
- **SHAP feature list** — edit `renderShap()` in `patient.html` (the
  `features` array). The list is intentionally long and technical to mirror
  what real SHAP output looks like.
- **CPE actions / narrative** — edit `renderCpe()` in `patient.html`.

---

## A note on stability for live demo

Keep the demo open in a tab **before** the defense begins so the assets are
cached. If WiFi fails, the previously-loaded page will still work locally in
the browser. Take screenshots of every screen as a backup.

---

© 2026 — Built for the doctoral defense of Ismail Allahwerdi
Faculty of Applied Informatics, Tomas Bata University in Zlín
