/* =====================================================================
   ICU CDS — shared front-end logic
   No backend; data lives here.
   ===================================================================== */

const SYSTEM = {
  hospitalName: "Krajská nemocnice T. Bati",
  unit: "ICU — Anesteziologicko-resuscitační oddělení",
  city: "Zlín",
  buildTag: "TBU·CDS v0.4.2 (research)",
};

// Per-patient clinical data. Side-panel content is now patient-specific.
const PATIENTS = [
  {
    id: "p1", bed: "ICU-07B", mrn: "4471829",
    family: "Svobodová", given: "Marie", title: "",
    age: 68, sex: "F",
    admit: "2026-03-27", admitTime: "18:22",
    los: 2.4,
    dx: "Post-CABG day 2 · hypovolemia · sepsis (suspected)",
    risk: 0.94, trend: "up",
    hr: 112, map: 64, spo2: 93, temp: 38.4, rr: 24, uop: 18,
    admitSource: "Cardiac OR (post-CABG)",
    disposition: "Step-down (Day 4)",
    codeStatus: "Full code",
    allergies: "Penicillin (rash, documented 2019)",
    problems: "HTN, T2DM, CKD stage 2, post-CABG",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. K. Dvořáková", nurse: "Mgr. L. Šimková", pharmacist: "PharmDr. M. Beneš" },
    notes: "Vasopressor support since 04:10. Urine output declining last 4h.",
  },
  {
    id: "p2", bed: "ICU-04A", mrn: "4471734",
    family: "Novák", given: "Jan", title: "",
    age: 74, sex: "M",
    admit: "2026-03-26", admitTime: "22:05",
    los: 3.1,
    dx: "Pneumonia · septic shock · COPD exacerbation",
    risk: 0.88, trend: "up",
    hr: 118, map: 61, spo2: 89, temp: 38.9, rr: 26, uop: 22,
    admitSource: "Emergency Department",
    disposition: "Pending — sepsis course",
    codeStatus: "Full code",
    allergies: "NKDA",
    problems: "COPD GOLD III, HTN, smoker (40 pack-y)",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. K. Dvořáková", nurse: "Bc. R. Nováková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p3", bed: "ICU-09C", mrn: "4471901",
    family: "Dvořák", given: "Petr", title: "",
    age: 59, sex: "M",
    admit: "2026-03-28", admitTime: "03:40",
    los: 1.6,
    dx: "Polytrauma · rhabdomyolysis · post-op day 1",
    risk: 0.81, trend: "up",
    hr: 102, map: 70, spo2: 95, temp: 37.8, rr: 20, uop: 28,
    admitSource: "Trauma Resuscitation (MVA)",
    disposition: "Pending — renal trajectory",
    codeStatus: "Full code",
    allergies: "NKDA",
    problems: "Polytrauma, crush injury R thigh, rib fractures 4–7 L",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. T. Marek", nurse: "Mgr. L. Šimková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p4", bed: "ICU-02A", mrn: "4471502",
    family: "Černá", given: "Eva", title: "",
    age: 51, sex: "F",
    admit: "2026-03-28", admitTime: "11:15",
    los: 1.2,
    dx: "DKA · acute pancreatitis",
    risk: 0.62, trend: "up",
    hr: 96, map: 73, spo2: 96, temp: 37.4, rr: 19, uop: 38,
    admitSource: "Internal Medicine",
    disposition: "Step-down (Day 3)",
    codeStatus: "Full code",
    allergies: "Sulfa drugs",
    problems: "T1DM (since age 14), recurrent pancreatitis",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. T. Marek", nurse: "Bc. R. Nováková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p5", bed: "ICU-05B", mrn: "4471655",
    family: "Procházka", given: "Tomáš", title: "",
    age: 66, sex: "M",
    admit: "2026-03-27", admitTime: "06:32",
    los: 2.0,
    dx: "Acute on chronic heart failure · AF RVR",
    risk: 0.58, trend: "flat",
    hr: 104, map: 75, spo2: 94, temp: 36.9, rr: 18, uop: 42,
    admitSource: "Cardiology",
    disposition: "Cardiology floor",
    codeStatus: "Full code",
    allergies: "NKDA",
    problems: "HFrEF (EF 28%), AF, CKD stage 3, HTN",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. K. Dvořáková", nurse: "Mgr. L. Šimková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p6", bed: "ICU-08A", mrn: "4471832",
    family: "Kučerová", given: "Lucie", title: "",
    age: 44, sex: "F",
    admit: "2026-03-29", admitTime: "02:11",
    los: 0.6,
    dx: "Severe sepsis · UTI source · DM2",
    risk: 0.55, trend: "up",
    hr: 99, map: 71, spo2: 96, temp: 38.1, rr: 22, uop: 36,
    admitSource: "Emergency Department",
    disposition: "Pending",
    codeStatus: "Full code",
    allergies: "Codeine (nausea)",
    problems: "T2DM, recurrent UTIs, obesity (BMI 34)",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. T. Marek", nurse: "Bc. R. Nováková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p7", bed: "ICU-06C", mrn: "4471748",
    family: "Veselý", given: "Martin", title: "",
    age: 61, sex: "M",
    admit: "2026-03-26", admitTime: "14:48",
    los: 3.4,
    dx: "Post-AAA repair · stable on weaning protocol",
    risk: 0.41, trend: "down",
    hr: 86, map: 82, spo2: 97, temp: 36.7, rr: 16, uop: 55,
    admitSource: "Vascular Surgery",
    disposition: "Step-down today",
    codeStatus: "Full code",
    allergies: "NKDA",
    problems: "AAA s/p endovascular repair, HTN, hyperlipidemia",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. K. Dvořáková", nurse: "Mgr. L. Šimková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p8", bed: "ICU-03B", mrn: "4471601",
    family: "Horáková", given: "Jana", title: "",
    age: 72, sex: "F",
    admit: "2026-03-25", admitTime: "09:24",
    los: 4.1,
    dx: "Ischemic CVA · aspiration pneumonia",
    risk: 0.29, trend: "down",
    hr: 78, map: 88, spo2: 98, temp: 36.5, rr: 15, uop: 62,
    admitSource: "Stroke Unit",
    disposition: "Neuro rehab (Day 6)",
    codeStatus: "DNR (documented 2026-03-25)",
    allergies: "Aspirin (GI bleed history)",
    problems: "L MCA infarct, AF, HTN, dyslipidemia",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. K. Dvořáková", nurse: "Mgr. L. Šimková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p9", bed: "ICU-01A", mrn: "4471433",
    family: "Marek", given: "Pavel", title: "",
    age: 38, sex: "M",
    admit: "2026-03-28", admitTime: "08:50",
    los: 1.4,
    dx: "Post-thoracotomy · pneumothorax (resolved)",
    risk: 0.18, trend: "flat",
    hr: 82, map: 90, spo2: 98, temp: 36.8, rr: 14, uop: 70,
    admitSource: "Thoracic Surgery",
    disposition: "Thoracic ward tomorrow",
    codeStatus: "Full code",
    allergies: "NKDA",
    problems: "Lung adenocarcinoma — lobectomy, otherwise healthy",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. T. Marek", nurse: "Bc. R. Nováková", pharmacist: "PharmDr. M. Beneš" },
  },
  {
    id: "p10", bed: "ICU-10A", mrn: "4471890",
    family: "Pokorná", given: "Tereza", title: "",
    age: 47, sex: "F",
    admit: "2026-03-29", admitTime: "05:30",
    los: 0.3,
    dx: "Obs. after seizure · planned step-down",
    risk: 0.11, trend: "flat",
    hr: 74, map: 92, spo2: 99, temp: 36.6, rr: 13, uop: 75,
    admitSource: "Emergency Department",
    disposition: "Neurology ward today",
    codeStatus: "Full code",
    allergies: "Latex",
    problems: "Idiopathic epilepsy (controlled on levetiracetam)",
    careTeam: { attending: "Dr. P. Horák", resident: "Dr. T. Marek", nurse: "Bc. R. Nováková", pharmacist: "PharmDr. M. Beneš" },
  },
];

function riskClass(r) {
  if (r >= 0.75) return "critical";
  if (r >= 0.40) return "warning";
  return "stable";
}
function riskLabel(r) {
  if (r >= 0.75) return "CRITICAL";
  if (r >= 0.40) return "WATCH";
  return "STABLE";
}
function trendArrow(t) {
  if (t === "up")   return `<span class="trend-up" aria-label="rising">▲</span>`;
  if (t === "down") return `<span class="trend-down" aria-label="falling">▼</span>`;
  return `<span class="trend-flat" aria-label="flat">▬</span>`;
}

/* Generate a plausible 6-hour trajectory ending at the current value.
   trend === 'up'   → vital is deteriorating
   trend === 'down' → vital is improving
   higherIsWorse    → true for HR/Temp/RR, false for MAP/SpO2/UOP */
function makeVitalSeries(current, trend, higherIsWorse) {
  const direction = trend === 'up'
    ? (higherIsWorse ? -1 : +1)
    : trend === 'down'
    ? (higherIsWorse ? +1 : -1)
    : 0;
  const stepPct = trend === 'flat' ? 0.005 : 0.035;
  const series = [];
  for (let i = 6; i >= 1; i--) {
    const factor = 1 + direction * stepPct * i;
    const jitter = Math.sin(i * 1.7) * 0.006;
    const v = current * factor * (1 + jitter);
    const decimals = Math.abs(current) >= 10 ? 0 : 1;
    series.push(Number(v.toFixed(decimals)));
  }
  return series;
}

/* ---------- Shared chrome (banner + header + footer) ----------
   Sidebar removed for projector presentation mode. */
function renderChrome() {
  const user = sessionStorage.getItem('icu_user') || 'demo.user';
  const initials = user
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map(s => s[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'DR';

  // Persist session id so the footer doesn't change between pages.
  let sessionId = sessionStorage.getItem('icu_session');
  if (!sessionId) {
    sessionId = Math.random().toString(36).slice(2, 10).toUpperCase();
    sessionStorage.setItem('icu_session', sessionId);
  }

  const banner = document.getElementById('chrome-banner');
  if (banner) {
    banner.innerHTML = `
      <div class="research-banner">
        <span class="dot" aria-hidden="true"></span>
        RESEARCH ENVIRONMENT · All patient data is synthetic · Not for clinical use
      </div>
    `;
  }

  const header = document.getElementById('chrome-header');
  if (header) {
    header.innerHTML = `
      <header class="app-header">
        <div class="brand">
          <img src="assets/logo.png" alt="Tomas Bata University logo" />
          <div class="brand-text">
            <div class="sys">ICU Clinical Decision Support</div>
            <div class="sub">${SYSTEM.hospitalName} · Zlín</div>
          </div>
        </div>
        <div class="header-spacer" aria-hidden="true"></div>
        <div class="header-right projector-header">
          <div class="item">Unit: <strong>ICU-1</strong></div>
          <div class="item clock" id="clock" aria-live="off">--:--</div>
          <div class="user-chip">
            <div class="avatar" aria-hidden="true">${initials}</div>
            <div class="meta">
              <div class="name">Dr. ${user}</div>
              <div class="role">Attending · ICU</div>
            </div>
          </div>
          <button class="logout" type="button" onclick="logout()">Sign out</button>
        </div>
      </header>
    `;
  }

  const footer = document.getElementById('chrome-footer');
  if (footer) {
    footer.innerHTML = `
      <footer class="app-footer">
        ${SYSTEM.buildTag}
        <span class="sep" aria-hidden="true">·</span>
        Session ${sessionId}
        <span class="sep" aria-hidden="true">·</span>
        Last sync ${new Date().toTimeString().slice(0,5)}
        <span class="sep" aria-hidden="true">·</span>
        © 2026 Tomas Bata University in Zlín
      </footer>
    `;
  }

  startClock();
}

let _clockTimer = null;
function startClock() {
  if (_clockTimer) clearInterval(_clockTimer);
  const el = document.getElementById('clock');
  if (!el) return;
  function tick() {
    const d = new Date();
    const pad = n => String(n).padStart(2, '0');
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  tick();
  _clockTimer = setInterval(tick, 1000);
}

function logout() {
  sessionStorage.removeItem('icu_user');
  sessionStorage.removeItem('icu_session');
  window.location.href = 'index.html';
}

/* Tiny sparkline generator for vitals */
function sparkline(values, color = '#5b6878', width = 70, height = 16) {
  const max = Math.max(...values), min = Math.min(...values);
  const rng = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = (i * step).toFixed(1);
    const y = (height - ((v - min) / rng) * (height - 2) - 1).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
  return `<svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" aria-hidden="true">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;
}
