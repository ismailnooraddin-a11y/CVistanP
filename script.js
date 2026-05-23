/* ============================================================
   HollyWoodSmile Studio — production script
   - Doctor data
   - Filterable doctor grid
   - WhatsApp routing
   - Doctor profile modal
   - Appointment form
   - Reveal-on-scroll
   - Mobile nav
   - Smooth scroll, toast
   ============================================================ */

(() => {
  'use strict';

  /* ---------- Doctor data ----------
     Phones are international format without +.
     Use 'XX' for any unconfirmed degree/specialty.
  -------------------------------------- */
  const doctors = [
    /* Line 1 — 0750 145 7000 */
    {
      name: 'Dr. Karzan Sami',
      degree: 'BDS · MSc Orthodontics',
      specialty: 'Orthodontics & Cosmetic Specialist',
      phone: '9647501457000',
      line: 'Line 1',
      image: 'assets/doctors/karzan-sami.png',
      instagram: 'https://www.instagram.com/dr.karzan_sami?igsh=N2cybnZiZnk3dG9h'
    },
    {
      name: 'Dr. Saeed Tutmayi',
      degree: 'Assistant Professor',
      specialty: 'Oral-Maxillofacial & Implant Surgeon',
      phone: '9647501457000',
      line: 'Line 1',
      image: 'assets/doctors/saeed-tutmayi.png',
      instagram: 'https://www.instagram.com/saeedtutmayi?igsh=M242dzVxN2hsaTN3'
    },
    {
      name: 'Dr. Banaz Kalhury',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647501457000',
      line: 'Line 1',
      image: 'assets/doctors/banaz-kalhury.png',
      instagram: ''
    },
    {
      name: 'Dr. Wrya Khoshnaw',
      degree: 'BDS',
      specialty: 'Cosmetic Dentist',
      phone: '9647501457000',
      line: 'Line 1',
      image: 'assets/doctors/wrya-khoshnaw.png',
      instagram: ''
    },

    /* Line 2 — 0750 145 8000 */
    {
      name: 'Dr. Rawand Ahmed',
      degree: 'BDS · MSc Orthodontics',
      specialty: 'Orthodontics',
      phone: '9647501458000',
      line: 'Line 2',
      image: 'assets/doctors/rawand-ahmed.png',
      instagram: 'https://www.instagram.com/dr.rawandahmed?igsh=NGp0ZGNpczgzdjky'
    },
    {
      name: 'Dr. Khidher Mustafa',
      degree: 'XX',
      specialty: 'Microscopic Endodontist',
      phone: '9647501458000',
      line: 'Line 2',
      image: 'assets/doctors/khidher-mustafa.png',
      instagram: 'https://www.instagram.com/dr_khidher_mustafa?igsh=MTYwNzUwcXVrOGV0cw=='
    },
    {
      name: 'Dr. Bashdar Omar',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647501458000',
      line: 'Line 2',
      image: 'assets/doctors/bashdar-omar.png',
      instagram: ''
    },
    {
      name: 'Dr. Nyaz Asaad Tutmayi',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647501458000',
      line: 'Line 2',
      image: 'assets/doctors/nyaz-asaad-tutmayi.png',
      instagram: ''
    },

    /* Line 3 — 0751 145 7000 */
    {
      name: 'Dr. Shler Omar',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/shler-omar.png',
      instagram: ''
    },
    {
      name: 'Dr. Sherwan Kareem',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/sherwan-kareem.png',
      instagram: ''
    },
    {
      name: 'Dr. Zardasht N. Bradosty',
      degree: 'BDS · PG Dip · MSc · PhD',
      specialty: 'Esthetic & Restorative Dentistry',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/zardasht-bradosty.png',
      instagram: 'https://www.instagram.com/doctor.zardasht?igsh=cW1iemtvc25zaGV2'
    },
    {
      name: 'Dr. Mustafa Al-Qassab',
      degree: 'XX',
      specialty: 'Endodontics & Restorative Dentistry',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/mustafa-alqassab.png',
      instagram: 'https://www.instagram.com/dr.mustafa_alqassab?igsh=ZTJkdnBiZzA5djdu'
    },
    {
      name: 'Dr. Znar Abdulmajeed',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/znar-abdulmajeed.png',
      instagram: ''
    },
    {
      name: 'Dr. Yad Sirwan',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/yad-sirwan.png',
      instagram: ''
    },
    {
      name: 'Dr. Dashnee Bahram',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/dashnee-bahram.png',
      instagram: ''
    },
    {
      name: 'Dr. Huda Y. Latif',
      degree: 'XX',
      specialty: 'XX',
      phone: '9647511457000',
      line: 'Line 3',
      image: 'assets/doctors/huda-y-latif.png',
      instagram: ''
    }
  ];

  const MAIN_WA = '9647501457000';

  /* ---------- Helpers ---------- */
  const $  = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  const waUrl = (phone, msg) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  const defaultMessage = () =>
    `Hello HollyWoodSmile Studio, I would like to book an appointment.\n\nName:\nPreferred date:\nPreferred time:\nMessage:`;

  const doctorMessage = (doctorName) =>
    `Hello HollyWoodSmile Studio, I would like to book an appointment with ${doctorName}.\n\nName:\nPreferred date:\nPreferred time:\nMessage:`;

  const showToast = (text) => {
    const toast = $('#toast');
    toast.textContent = text;
    toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('is-visible'), 3600);
  };

  /* ---------- IG icon SVG (reused) ---------- */
  const igIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>`;
  const waIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M20.5 3.5A11 11 0 0 0 3.6 17.2L2.5 21.5l4.4-1.1a11 11 0 0 0 13.6-16.9Z"/></svg>`;
  const formIcon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5h6M9 12h6M9 19h6M5 5h.01M5 12h.01M5 19h.01"/></svg>`;

  /* ---------- Doctor rendering ---------- */
  const doctorCardHTML = (doctor, index) => {
    const ig = doctor.instagram
      ? `<a class="doc-ig-badge" href="${doctor.instagram}" target="_blank" rel="noopener" aria-label="${escapeHtml(doctor.name)} on Instagram">${igIcon}</a>`
      : '';
    const degree = doctor.degree && doctor.degree !== 'XX' ? escapeHtml(doctor.degree) : 'Specialist Doctor';
    const specialty = doctor.specialty && doctor.specialty !== 'XX' ? escapeHtml(doctor.specialty) : 'Dental Specialist';
    return `
      <article class="doctor-card" role="listitem" data-line="${doctor.phone}" style="animation-delay:${Math.min(index * 40, 320)}ms">
        <span class="doc-line-tag">${doctor.line}</span>
        <div class="doc-photo-wrap">
          <div class="doc-photo-ring" aria-hidden="true"></div>
          <div class="doc-photo">
            <img src="${doctor.image}" alt="${escapeHtml(doctor.name)}" loading="lazy" width="220" height="220" />
          </div>
        </div>
        <h3 class="doc-name">${escapeHtml(doctor.name)}</h3>
        <p class="doc-degree">${degree}</p>
        <p class="doc-specialty">${specialty}</p>
        <div class="doc-meta-row">${ig}</div>
        <div class="doc-actions">
          <a class="doc-action primary" href="${waUrl(doctor.phone, doctorMessage(doctor.name))}" target="_blank" rel="noopener" aria-label="Contact ${escapeHtml(doctor.name)} on WhatsApp">
            ${waIcon}
            <span>Contact</span>
          </a>
          <button class="doc-action ghost icon-only" type="button" data-prefill="${index}" aria-label="Use form for ${escapeHtml(doctor.name)}">
            ${formIcon}
          </button>
        </div>
        <button class="doc-action ghost" type="button" data-profile="${index}" aria-label="View ${escapeHtml(doctor.name)} profile" style="margin-top:-2px;">View profile</button>
      </article>
    `;
  };

  const renderDoctors = (filter = 'all') => {
    const grid = $('#doctorGrid');
    grid.innerHTML = doctors
      .map((d, i) => ({ d, i }))
      .filter(({ d }) => filter === 'all' || d.phone === filter)
      .map(({ d, i }) => doctorCardHTML(d, i))
      .join('');
  };

  /* ---------- Tabs ---------- */
  const initTabs = () => {
    const tabs = $$('.doctor-tabs .tab');
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        renderDoctors(tab.dataset.filter);
      });
    });
  };

  /* ---------- Prefill ---------- */
  const prefillDoctor = (index) => {
    const d = doctors[index];
    $('#selectedDoctor').value = d.name;
    $('#selectedWa').value = d.phone;
    $('#appointment').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => $('#patientName').focus(), 700);
    showToast(`${d.name} selected — fill in the form to confirm`);
  };

  const clearDoctorSelection = () => {
    $('#selectedDoctor').value = 'General appointment';
    $('#selectedWa').value = MAIN_WA;
    showToast('Selection cleared');
  };

  /* ---------- Modal ---------- */
  const openModal = (index) => {
    const d = doctors[index];
    const modal = $('#doctorModal');
    const degree = d.degree && d.degree !== 'XX' ? escapeHtml(d.degree) : '<em style="color:var(--ink-muted)">To be confirmed</em>';
    const specialty = d.specialty && d.specialty !== 'XX' ? escapeHtml(d.specialty) : '<em style="color:var(--ink-muted)">To be confirmed</em>';
    const igBlock = d.instagram
      ? `<a class="btn btn-ghost" href="${d.instagram}" target="_blank" rel="noopener">${igIcon}<span>Instagram</span></a>`
      : '';

    $('#modalContent').innerHTML = `
      <div class="modal-profile">
        <div class="modal-profile-photo">
          <img src="${d.image}" alt="${escapeHtml(d.name)}" />
        </div>
        <div>
          <p class="eyebrow"><span class="eyebrow-dot"></span>Doctor profile</p>
          <h3 id="modalTitle">${escapeHtml(d.name)}</h3>
          <div class="mp-row"><strong>Degree</strong><span>${degree}</span></div>
          <div class="mp-row"><strong>Specialty</strong><span>${specialty}</span></div>
          <div class="mp-row"><strong>WhatsApp</strong><span>+${d.phone}</span></div>
          <div class="mp-actions">
            <a class="btn btn-primary" href="${waUrl(d.phone, doctorMessage(d.name))}" target="_blank" rel="noopener">${waIcon}<span>Contact doctor</span></a>
            <button class="btn btn-ghost" type="button" data-prefill="${index}" data-modal-close>${formIcon}<span>Use form</span></button>
            ${igBlock}
          </div>
        </div>
      </div>
    `;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    const modal = $('#doctorModal');
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  /* ---------- Mobile nav ---------- */
  const initMobileNav = () => {
    const toggle = $('#menuToggle');
    const nav = $('#mobileNav');
    if (!toggle || !nav) return;

    const close = () => {
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const open = toggle.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('is-open', open);
      nav.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });

    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') close();
    });

    // close on resize up
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) close();
    });
  };

  /* ---------- Form ---------- */
  const initForm = () => {
    const form = $('#bookingForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const doctor   = $('#selectedDoctor').value || 'General appointment';
      const name     = $('#patientName').value.trim();
      const phone    = $('#patientPhone').value.trim();
      const date     = $('#preferredDate').value || 'Not selected';
      const time     = $('#preferredTime').value || 'Not selected';
      const note     = $('#patientMessage').value.trim() || 'No extra message';
      const wa       = $('#selectedWa').value || MAIN_WA;

      const notice = $('#formNotice');
      if (!name || !phone) {
        notice.textContent = 'Please enter your name and phone number.';
        notice.classList.remove('success');
        return;
      }

      const msg = `Hello HollyWoodSmile Studio, I would like to book an appointment.\n\nSelected doctor: ${doctor}\nName: ${name}\nPhone: ${phone}\nPreferred date: ${date}\nPreferred time: ${time}\nMessage: ${note}`;

      notice.classList.add('success');
      notice.textContent = 'Thank you for choosing HollyWoodSmile Studio. Opening WhatsApp so our team can confirm your appointment…';
      window.open(waUrl(wa, msg), '_blank', 'noopener');
      showToast('Request prepared — WhatsApp is opening');
    });

    $('#clearDoctor').addEventListener('click', clearDoctorSelection);

    // Set min date to today
    const dateField = $('#preferredDate');
    if (dateField) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateField.min = `${yyyy}-${mm}-${dd}`;
    }
  };

  /* ---------- Global click handler ---------- */
  const initGlobalClicks = () => {
    document.addEventListener('click', (e) => {
      // Doctor prefill
      const prefill = e.target.closest('[data-prefill]');
      if (prefill) {
        prefillDoctor(Number(prefill.dataset.prefill));
      }

      // Doctor profile
      const profile = e.target.closest('[data-profile]');
      if (profile) {
        openModal(Number(profile.dataset.profile));
        return;
      }

      // Main WhatsApp CTA
      const main = e.target.closest('[data-whatsapp="main"]');
      if (main) {
        // Allow #appointment to also scroll, but open WhatsApp too
        // If href is #appointment, prevent default WhatsApp action and just scroll
        const href = main.getAttribute('href');
        if (href === '#appointment') {
          // Soft behavior: just scroll to form
          e.preventDefault();
          $('#appointment').scrollIntoView({ behavior: 'smooth' });
          return;
        }
        e.preventDefault();
        window.open(waUrl(MAIN_WA, defaultMessage()), '_blank', 'noopener');
      }

      // Direct number lines
      const direct = e.target.closest('[data-direct-number]');
      if (direct) {
        window.open(waUrl(direct.dataset.directNumber, defaultMessage()), '_blank', 'noopener');
      }

      // Modal close triggers
      if (e.target.closest('[data-modal-close]')) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  };

  /* ---------- Reveal on scroll ---------- */
  const initReveal = () => {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  };

  /* ---------- FAB show on scroll ---------- */
  const initFab = () => {
    const fab = $('.fab-whatsapp');
    if (!fab) return;
    fab.style.opacity = '0';
    fab.style.transform = 'translateY(20px) scale(.9)';
    fab.style.transition = 'opacity .5s ease, transform .5s ease';
    const onScroll = () => {
      const show = window.scrollY > 600;
      fab.style.opacity = show ? '1' : '0';
      fab.style.transform = show ? 'translateY(0) scale(1)' : 'translateY(20px) scale(.9)';
      fab.style.pointerEvents = show ? 'auto' : 'none';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  };

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    renderDoctors();
    initTabs();
    initMobileNav();
    initForm();
    initGlobalClicks();
    initReveal();
    initFab();
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
