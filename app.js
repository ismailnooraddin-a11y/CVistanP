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

// 10 realistic Czech ICU patients. Marie Svobodová (bed 7B) is the demo case.
const PATIENTS = [
  {
    id: "p1", bed: "ICU-07B", mrn: "4471829",
    family: "Svobodová", given: "Marie", title: "",
    age: 68, sex: "F",
    admit: "2026-03-27",
    los: 2.4,
    dx: "Post-CABG day 2 · hypovolemia · sepsis (suspected)",
    risk: 0.94, trend: "up",
    hr: 112, map: 64, spo2: 93, temp: 38.4, rr: 24, uop: 18,
    notes: "Vasopressor support since 04:10. Urine output declining last 4h.",
  },
  {
    id: "p2", bed: "ICU-04A", mrn: "4471734",
    family: "Novák", given: "Jan", title: "",
    age: 74, sex: "M",
    admit: "2026-03-26",
    los: 3.1,
    dx: "Pneumonia · septic shock · COPD exacerbation",
    risk: 0.88, trend: "up",
    hr: 118, map: 61, spo2: 89, temp: 38.9, rr: 26, uop: 22,
  },
  {
    id: "p3", bed: "ICU-09C", mrn: "4471901",
    family: "Dvořák", given: "Petr", title: "",
    age: 59, sex: "M",
    admit: "2026-03-28",
    los: 1.6,
    dx: "Polytrauma · rhabdomyolysis · post-op day 1",
    risk: 0.81, trend: "up",
    hr: 102, map: 70, spo2: 95, temp: 37.8, rr: 20, uop: 28,
  },
  {
    id: "p4", bed: "ICU-02A", mrn: "4471502",
    family: "Černá", given: "Eva", title: "",
    age: 51, sex: "F",
    admit: "2026-03-28",
    los: 1.2,
    dx: "DKA · acute pancreatitis",
    risk: 0.62, trend: "up",
    hr: 96, map: 73, spo2: 96, temp: 37.4, rr: 19, uop: 38,
  },
  {
    id: "p5", bed: "ICU-05B", mrn: "4471655",
    family: "Procházka", given: "Tomáš", title: "",
    age: 66, sex: "M",
    admit: "2026-03-27",
    los: 2.0,
    dx: "Acute on chronic heart failure · AF RVR",
    risk: 0.58, trend: "flat",
    hr: 104, map: 75, spo2: 94, temp: 36.9, rr: 18, uop: 42,
  },
  {
    id: "p6", bed: "ICU-08A", mrn: "4471832",
    family: "Kučerová", given: "Lucie", title: "",
    age: 44, sex: "F",
    admit: "2026-03-29",
    los: 0.6,
    dx: "Severe sepsis · UTI source · DM2",
    risk: 0.55, trend: "up",
    hr: 99, map: 71, spo2: 96, temp: 38.1, rr: 22, uop: 36,
  },
  {
    id: "p7", bed: "ICU-06C", mrn: "4471748",
    family: "Veselý", given: "Martin", title: "",
    age: 61, sex: "M",
    admit: "2026-03-26",
    los: 3.4,
    dx: "Post-AAA repair · stable on weaning protocol",
    risk: 0.41, trend: "down",
    hr: 86, map: 82, spo2: 97, temp: 36.7, rr: 16, uop: 55,
  },
  {
    id: "p8", bed: "ICU-03B", mrn: "4471601",
    family: "Horáková", given: "Jana", title: "",
    age: 72, sex: "F",
    admit: "2026-03-25",
    los: 4.1,
    dx: "Ischemic CVA · aspiration pneumonia",
    risk: 0.29, trend: "down",
    hr: 78, map: 88, spo2: 98, temp: 36.5, rr: 15, uop: 62,
  },
  {
    id: "p9", bed: "ICU-01A", mrn: "4471433",
    family: "Marek", given: "Pavel", title: "",
    age: 38, sex: "M",
    admit: "2026-03-28",
    los: 1.4,
    dx: "Post-thoracotomy · pneumothorax (resolved)",
    risk: 0.18, trend: "flat",
    hr: 82, map: 90, spo2: 98, temp: 36.8, rr: 14, uop: 70,
  },
  {
    id: "p10", bed: "ICU-10A", mrn: "4471890",
    family: "Pokorná", given: "Tereza", title: "",
    age: 47, sex: "F",
    admit: "2026-03-29",
    los: 0.3,
    dx: "Obs. after seizure · planned step-down",
    risk: 0.11, trend: "flat",
    hr: 74, map: 92, spo2: 99, temp: 36.6, rr: 13, uop: 75,
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
  if (t === "up")   return `<span class="trend-up">▲</span>`;
  if (t === "down") return `<span class="trend-down">▼</span>`;
  return `<span class="trend-flat">▬</span>`;
}

/* ---------- Shared chrome (header + sidebar + footer) ---------- */
function renderChrome(activePage) {
  const user = sessionStorage.getItem('icu_user') || 'demo.user';
  const initials = user
    .split(/[.\s_-]+/)
    .filter(Boolean)
    .map(s => s[0].toUpperCase())
    .slice(0, 2)
    .join('') || 'DR';

  document.getElementById('chrome-banner').innerHTML = `
    <div class="research-banner">
      <span class="dot"></span>
      RESEARCH ENVIRONMENT · All patient data is synthetic · Not for clinical use
    </div>
  `;

  document.getElementById('chrome-header').innerHTML = `
    <header class="app-header">
      <div class="brand">
        <img src="assets/logo.png" alt="TBU" />
        <div class="brand-text">
          <div class="sys">ICU Clinical Decision Support</div>
          <div class="sub">${SYSTEM.hospitalName} · Zlín</div>
        </div>
      </div>
      <div class="header-spacer"></div>
      <div class="header-right projector-header">
        <div class="item">Unit: <strong>ICU-1</strong></div>
        <div class="item clock" id="clock">--:--</div>
      </div>
        <div class="item clock" id="clock">--:--</div>
        <div class="user-chip">
          <div class="avatar">${initials}</div>
          <div class="meta">
            <div class="name">Dr. ${user}</div>
            <div class="role">Attending · ICU</div>
          </div>
        </div>
        <button class="logout" onclick="logout()">Sign out</button>
      </div>
    </header>
  `;

  document.getElementById('chrome-footer').innerHTML = `
    <footer class="app-footer">
      ${SYSTEM.buildTag}
      <span class="sep">·</span>
      Session ${Math.random().toString(36).slice(2, 10).toUpperCase()}
      <span class="sep">·</span>
      Last sync ${new Date().toTimeString().slice(0,5)}
      <span class="sep">·</span>
      © 2026 Tomas Bata University in Zlín
    </footer>
  `;

  // Sidebar removed for projector presentation mode.
  const sidebar = document.getElementById('sidebar');
  if (sidebar) sidebar.remove();

  startClock();
}

function startClock() {
  const el = document.getElementById('clock');
  if (!el) return;
  function tick() {
    const d = new Date();
    const pad = n => String(n).padStart(2,'0');
    el.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }
  tick();
  setInterval(tick, 1000);
}

function logout() {
  sessionStorage.removeItem('icu_user');
  window.location.href = 'index.html';
}

function icon(name) {
  const s = 'width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    clipboard: '<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/>',
    flask: '<path d="M9 3v6l-5 9a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-9V3"/><path d="M8 3h8"/>',
    pill: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
    alert: '<path d="m10.29 3.86-8.45 14.49A2 2 0 0 0 3.55 21h16.9a2 2 0 0 0 1.71-3.65L13.71 3.86a2 2 0 0 0-3.42 0Z"/><path d="M12 9v4"/><circle cx="12" cy="17" r="0.5"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 14 4-4 4 4 5-5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  };
  return `<svg ${s}>${paths[name] || ''}</svg>`;
}

/* Tiny sparkline generator for vitals */
function sparkline(values, color = '#8693a4', width = 70, height = 16) {
  const max = Math.max(...values), min = Math.min(...values);
  const rng = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values.map((v, i) => {
    const x = (i * step).toFixed(1);
    const y = (height - ((v - min) / rng) * (height - 2) - 1).toFixed(1);
    return `${x},${y}`;
  }).join(' ');
  return `<svg class="sparkline" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.4" stroke-linejoin="round"/>
  </svg>`;
}
