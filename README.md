# HollyWoodSmile Studio — Website

A premium, luxury dental clinic website for **HollyWoodSmile Studio**, Erbil — Kurdistan Region of Iraq.

Specialist-led, WhatsApp-first, over 27 years of excellence.

---

## What's inside

```
hollywood-smile-studio/
├── index.html          # Full single-page site
├── styles.css          # All styles (dark navy + gold luxury theme)
├── script.js           # Doctor data, WhatsApp logic, interactions
└── assets/
    ├── favicon.svg
    ├── number-one.png          # Hero studio image
    ├── location-map.jpeg       # Static map for Visit section
    ├── cleaning-teeth.webm     # Inline studio video
    └── doctors/                # 16 doctor portraits (420×420 PNG)
```

No build step. No framework. No dependencies. Just open `index.html` in a browser.

---

## Deploy to GitHub Pages

1. Create a new public repo on GitHub.
2. Upload everything in this folder (or `git push` it).
3. Settings → Pages → Source: `main` branch / `/ (root)` → Save.
4. Wait ~1 minute. Your site is live at `https://<your-username>.github.io/<repo-name>/`.

Also works as-is on **Netlify**, **Vercel**, **Cloudflare Pages**, or any static host. No configuration needed.

---

## Customising

### Doctor info

All 16 doctors live in the `doctors` array at the top of `script.js`. Each entry:

```js
{
  name: 'Dr. Karzan Sami',
  degree: 'BDS · MSc Orthodontics',
  specialty: 'Orthodontics & Cosmetic Specialist',
  phone: '9647501457000',          // WhatsApp line for this doctor's group
  line: 1,                          // 1, 2, or 3
  image: 'assets/doctors/karzan-sami.png',
  instagram: 'https://...'          // omit or null if none
}
```

Add, remove, or edit freely — the grid re-renders automatically and respects the tab filter.

### WhatsApp lines

- **Line 1** · `0750 145 7000` — 4 specialists
- **Line 2** · `0750 145 8000` — 4 specialists
- **Line 3** · `0751 145 7000` — 8 specialists

The booking form picks the correct line based on the selected doctor and pre-fills a structured message:

```
Hello HollyWoodSmile Studio, I would like to book an appointment with Dr. [Name].

Name: ...
Preferred date: ...
Preferred time: ...
Message: ...
```

### Clinic details

Address, hours, Google Maps link, and social links are in `index.html` — search for `VISIT US` and the `<footer>` block.

---

## Before launch — replace placeholders

A few items are marked `XX` and should be filled in by the clinic before going public:

- **Doctor degrees / specialties** — every doctor where the real qualification is unknown currently shows `BDS · XX` and `XX Specialist`. Update in `script.js`.
- **Patient reviews** — the three review cards in the "What our patients say" section use `XX` placeholders. Replace with verified Google or social-media reviews.
- **Missing Instagram links** — only doctors with confirmed accounts have an Instagram icon; the rest can be added to `script.js`.

---

## Features

- WhatsApp-first booking — sticky floating button, 3 direct lines, doctor pre-fill
- 16-doctor specialist showcase with tab filter by contact line
- Per-doctor profile modal with degree, specialty, Instagram, contact
- Smart form that routes to the correct WhatsApp number based on selected doctor
- Native FAQ accordion (`<details>`/`<summary>` — works without JS)
- IntersectionObserver scroll reveals (respects `prefers-reduced-motion`)
- Fully responsive — mobile-first, with a slide-in drawer nav
- JSON-LD `Dentist` structured data + OG/Twitter meta for SEO
- No external runtime dependencies beyond Google Fonts (Fraunces + Manrope)

---

## Clinic info (as configured)

**HollyWoodSmile Studio**
32 Park / 100m Road, near Sarbasti
Erbil Governorate, 44001 — Kurdistan Region, Iraq

**Hours** Saturday – Thursday · 3:00 PM – 9:00 PM · Friday closed

**Google Maps** https://maps.app.goo.gl/nazrQVAYSJgSwgPX9
**Instagram** https://www.instagram.com/hollywoodsmilestudio
**Facebook** https://www.facebook.com/share/18gFaXCShr/

---

© HollyWoodSmile Studio
