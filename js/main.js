const WHATSAPP_NUMBER = '9647501457000';

const SERVICES = [
  'Smile Design',
  'Cosmetic Dentistry',
  'Dental Implants',
  'Orthodontics',
  'Endodontics',
  'Restorative Dentistry',
  'Teeth Whitening',
  'Emergency Care'
];

const DOCTORS = [
  {
    'name': 'Dr. Karzan Sami',
    'image': 'images/doctors/karzan_sami.webp',
    'page': 'doctors/dr-karzan-sami/',
    'specialty': 'Orthodontics and Cosmetic Dentistry',
    'credentials': 'BDS, MSc Orthodontics',
    'categories': [
      'orthodontics',
      'cosmetic'
    ],
    'tags': [
      'Orthodontics',
      'Cosmetic'
    ]
  },
  {
    'name': 'Dr. Saeed Tutmayi',
    'image': 'images/doctors/saeed_tutmayi.webp',
    'page': 'doctors/dr-saeed-tutmayi/',
    'specialty': 'Oral-Maxillofacial and Implant Surgeon',
    'credentials': 'Assistant Professor, Hawler Medical University',
    'categories': [
      'implants'
    ],
    'tags': [
      'Implants',
      'Surgery'
    ]
  },
  {
    'name': 'Dr. Rawand Ahmed',
    'image': 'images/doctors/rawand_ahmed.webp',
    'page': 'doctors/dr-rawand-ahmed/',
    'specialty': 'Orthodontics',
    'credentials': 'BDS, MSc Orthodontics',
    'categories': [
      'orthodontics'
    ],
    'tags': [
      'Orthodontics'
    ]
  },
  {
    'name': 'Dr. Khidher Mustafa',
    'image': 'images/doctors/khidher_mustafa.webp',
    'page': 'doctors/dr-khidher-mustafa/',
    'specialty': 'Endodontist; Microscopic Endodontics',
    'credentials': 'Co-Founder, International Speaker',
    'categories': [
      'endodontics'
    ],
    'tags': [
      'Endodontics',
      'Microscope'
    ]
  },
  {
    'name': 'Dr. Zardasht N. Bradosty',
    'image': 'images/doctors/zardasht_bradosty.webp',
    'page': 'doctors/dr-zardasht-bradosty/',
    'specialty': 'Esthetic and Restorative Dentistry',
    'credentials': 'BDS, PG Dip, MSc, PhD; CEO Dental Blueprint Empire',
    'categories': [
      'cosmetic',
      'restorative'
    ],
    'tags': [
      'Restorative',
      'Esthetic'
    ]
  },
  {
    'name': 'Dr. Wrya Khoshnaw',
    'image': 'images/doctors/wrya_khoshnaw.webp',
    'page': 'doctors/dr-wrya-khoshnaw/',
    'specialty': 'Cosmetic Dentist',
    'credentials': '',
    'categories': [
      'cosmetic'
    ],
    'tags': [
      'Cosmetic'
    ]
  },
  {
    'name': 'Dr. Mustafa Al-Qassab',
    'image': 'images/doctors/mustafa_alqassab.webp',
    'page': 'doctors/dr-mustafa-al-qassab/',
    'specialty': 'Endodontics and Restorative Dentistry',
    'credentials': '',
    'categories': [
      'endodontics',
      'restorative'
    ],
    'tags': [
      'Endodontics',
      'Restorative'
    ]
  },
  {
    'name': 'Dr. Banaz Kalhury',
    'image': 'images/doctors/banaz_kalhury.webp',
    'page': 'doctors/dr-banaz-kalhury/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Bashdar Omar',
    'image': 'images/doctors/bashdar_omar.webp',
    'page': 'doctors/dr-bashdar-omar/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Nyaz Asaad Tutmayi',
    'image': 'images/doctors/nyaz_tutmayi.webp',
    'page': 'doctors/dr-nyaz-asaad-tutmayi/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Shler Omar',
    'image': 'images/doctors/shler_omar.webp',
    'page': 'doctors/dr-shler-omar/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Sherwan Kareem',
    'image': 'images/doctors/sherwan_kareem.webp',
    'page': 'doctors/dr-sherwan-kareem/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Znar Abdulmajeed',
    'image': 'images/doctors/znar_abdulmajeed.webp',
    'page': 'doctors/dr-znar-abdulmajeed/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Yad Sirwan',
    'image': 'images/doctors/yad_sirwan.webp',
    'page': 'doctors/dr-yad-sirwan/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Dashnee Bahram',
    'image': 'images/doctors/dashnee_bahram.webp',
    'page': 'doctors/dr-dashnee-bahram/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  },
  {
    'name': 'Dr. Huda Y. Latif',
    'image': 'images/doctors/huda_latif.webp',
    'page': 'doctors/dr-huda-y-latif/',
    'specialty': 'Clinical Dentistry Team',
    'credentials': '',
    'categories': [
      'general'
    ],
    'tags': [
      'Clinical team'
    ]
  }
];

document.addEventListener('DOMContentLoaded', () => {
  populateBookingSelects();
  initHeader();
  initMobileMenu();
  initSmoothAnchors();
  initScrollProgress();
  initScrollReveal();
  initCounters();
  initDoctors();
  initDoctorFilters();
  initBookingDrawer();
  initBookingForms();
  initFaq();
  initCardGlow();
  initMagneticButtons();
  initCopyPhone();
});

function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const update = () => {
    header.classList.toggle('scrolled', window.scrollY > 24);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  const openMenu = () => {
    nav.classList.add('is-open');
    nav.setAttribute('aria-hidden', 'false');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    document.body.classList.add('menu-open');
    const firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus({ preventScroll: true });
  };

  const closeMenu = ({ returnFocus = false } = {}) => {
    nav.classList.remove('is-open');
    nav.setAttribute('aria-hidden', 'true');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    if (returnFocus) toggle.focus({ preventScroll: true });
  };

  const sync = () => {
    if (window.matchMedia('(max-width: 900px)').matches) {
      if (!nav.classList.contains('is-open')) nav.setAttribute('aria-hidden', 'true');
    } else {
      nav.classList.remove('is-open');
      nav.setAttribute('aria-hidden', 'false');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }
  };

  toggle.addEventListener('click', () => {
    nav.classList.contains('is-open') ? closeMenu({ returnFocus: true }) : openMenu();
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) closeMenu({ returnFocus: true });
  });

  document.addEventListener('click', event => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });

  sync();
  window.addEventListener('resize', sync);
}

function initSmoothAnchors() {
  const links = document.querySelectorAll('a[href^="#"]');
  const navLinks = document.querySelectorAll('.primary-nav__link');
  const sections = [...document.querySelectorAll('main section[id]')];

  links.forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const sectionId = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${sectionId}`);
      });
    });
  }, { rootMargin: '-32% 0px -58% 0px', threshold: 0.01 });

  sections.forEach(section => observer.observe(section));
}

function initScrollProgress() {
  const progress = document.querySelector('.scroll-progress');
  if (!progress) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const percent = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${percent}%`;
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
}

function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .image-reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -70px 0px' });

  elements.forEach(element => observer.observe(element));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animate = counter => {
    const target = Number(counter.dataset.count || 0);
    const suffix = counter.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      counter.textContent = `${value.toLocaleString()}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.55 });

  counters.forEach(counter => observer.observe(counter));
}

function initDoctors() {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;
  renderDoctors('all');
}

function renderDoctors(filter) {
  const grid = document.getElementById('doctors-grid');
  if (!grid) return;

  const doctors = DOCTORS.filter(doctor => filter === 'all' || doctor.categories.includes(filter));

  grid.innerHTML = doctors.map(doctor => `
    <article class="doctor-card reveal is-visible" data-categories="${doctor.categories.join(' ')}">
      <div class="doctor-card__media">
        <img src="${doctor.image}" alt="${doctor.name}, ${doctor.specialty} at Hollywood Smile Studio Erbil" width="320" height="336" loading="lazy">
      </div>
      <div class="doctor-card__content">
        <h3>${doctor.name}</h3>
        <p class="doctor-card__specialty">${doctor.specialty}</p>
        ${doctor.credentials ? `<p class="doctor-card__credentials">${doctor.credentials}</p>` : ''}
        <div class="doctor-tags">${doctor.tags.map(tag => `<span>${tag}</span>`).join('')}</div>
        <div class="doctor-card__actions">
          <button type="button" data-open-booking data-doctor="${doctor.name}" data-service="${suggestService(doctor)}">Book with doctor</button>
          <a href="${doctor.page}">View profile</a>
        </div>
      </div>
    </article>
  `).join('');
}

function suggestService(doctor) {
  if (doctor.categories.includes('implants')) return 'Dental Implants';
  if (doctor.categories.includes('orthodontics')) return 'Orthodontics';
  if (doctor.categories.includes('endodontics')) return 'Endodontics';
  if (doctor.categories.includes('cosmetic')) return 'Cosmetic Dentistry';
  return 'Smile Design';
}

function initDoctorFilters() {
  const filters = document.querySelectorAll('.filter-btn');
  if (!filters.length) return;

  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      renderDoctors(button.dataset.filter || 'all');
    });
  });
}

function populateBookingSelects() {
  document.querySelectorAll('select[name="service"]').forEach(select => {
    const current = select.value;
    select.innerHTML = '<option value="">Choose a treatment</option>' + SERVICES.map(service => `<option>${service}</option>`).join('');
    if (current) select.value = current;
  });

  document.querySelectorAll('select[name="doctor"]').forEach(select => {
    const current = select.value;
    select.innerHTML = '<option value="">No preference</option>' + DOCTORS.map(doctor => `<option>${doctor.name}</option>`).join('');
    if (current) select.value = current;
  });
}

function initBookingDrawer() {
  const drawer = document.getElementById('booking-drawer');
  const backdrop = document.querySelector('.booking-backdrop');
  const openers = document.querySelectorAll('[data-open-booking]');
  const closers = document.querySelectorAll('[data-close-booking]');
  if (!drawer || !backdrop) return;

  let lastFocused = null;

  const open = opener => {
    lastFocused = document.activeElement;
    backdrop.hidden = false;
    requestAnimationFrame(() => {
      backdrop.classList.add('is-open');
      drawer.classList.add('is-open');
    });
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');

    const service = opener?.dataset?.service || '';
    const doctor = opener?.dataset?.doctor || '';
    const form = drawer.querySelector('form');
    if (form) {
      if (service) form.elements.service.value = service;
      if (doctor) form.elements.doctor.value = doctor;
      updateFormProgress(form);
    }

    const firstInput = drawer.querySelector('input, select, textarea, button');
    if (firstInput) firstInput.focus({ preventScroll: true });
  };

  const close = () => {
    backdrop.classList.remove('is-open');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-open');
    window.setTimeout(() => { backdrop.hidden = true; }, 320);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
  };

  openers.forEach(button => button.addEventListener('click', () => open(button)));
  closers.forEach(button => button.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });

  drawer.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...drawer.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
}

function initBookingForms() {
  const forms = document.querySelectorAll('.booking-form');
  forms.forEach(form => {
    const fields = [...form.querySelectorAll('input, select, textarea')];

    fields.forEach(field => {
      field.addEventListener('input', () => {
        clearFieldError(field);
        updateFormProgress(form);
      });
      field.addEventListener('change', () => {
        clearFieldError(field);
        updateFormProgress(form);
      });
    });

    updateFormProgress(form);

    form.addEventListener('submit', event => {
      event.preventDefault();
      const messageBox = form.querySelector('.form-message');
      const invalidField = validateForm(form);

      if (invalidField) {
        setMessage(messageBox, invalidField.dataset.error || 'Please complete the required fields.', false);
        invalidField.focus({ preventScroll: false });
        return;
      }

      const url = buildWhatsAppUrl(form);
      setMessage(messageBox, 'Opening WhatsApp with your appointment request...', true);
      window.open(url, '_blank', 'noopener');
      trackConversion('whatsapp_booking_request', form.dataset.formContext || 'unknown');
    });
  });
}

function validateForm(form) {
  const required = [...form.querySelectorAll('[required]')];
  let firstInvalid = null;

  required.forEach(field => {
    const valid = field.type === 'checkbox' ? field.checked : Boolean(String(field.value).trim());
    if (!valid) {
      showFieldError(field);
      if (!firstInvalid) firstInvalid = field;
    } else {
      clearFieldError(field);
    }
  });

  const phone = form.elements.phone;
  if (phone && phone.value.trim()) {
    const cleaned = phone.value.replace(/[\s\-()]/g, '');
    const validPhone = /^\+?[0-9]{9,15}$/.test(cleaned);
    if (!validPhone) {
      phone.dataset.error = 'Please enter a valid phone number.';
      showFieldError(phone);
      if (!firstInvalid) firstInvalid = phone;
    }
  }

  return firstInvalid;
}

function showFieldError(field) {
  field.setAttribute('aria-invalid', 'true');
}

function clearFieldError(field) {
  field.removeAttribute('aria-invalid');
  const form = field.closest('form');
  const messageBox = form?.querySelector('.form-message');
  if (messageBox) setMessage(messageBox, '', false);
}

function setMessage(element, text, success) {
  if (!element) return;
  element.textContent = text;
  element.classList.toggle('success', Boolean(success));
}

function updateFormProgress(form) {
  const bar = form.parentElement?.querySelector('.form-progress span');
  if (!bar) return;

  const fields = [...form.querySelectorAll('input, select, textarea')].filter(field => field.type !== 'hidden');
  const completed = fields.filter(field => field.type === 'checkbox' ? field.checked : Boolean(String(field.value).trim())).length;
  const progress = fields.length ? Math.round((completed / fields.length) * 100) : 0;
  bar.style.width = `${progress}%`;
}

function buildWhatsAppUrl(form) {
  const data = new FormData(form);
  const lines = [
    'Hello Hollywood Smile Studio, I would like to book an appointment.',
    '',
    `Name: ${data.get('name') || ''}`,
    `Phone: ${data.get('phone') || ''}`,
    `Service: ${data.get('service') || ''}`,
    `Preferred doctor: ${data.get('doctor') || 'No preference'}`,
    `Preferred date: ${data.get('date') || 'No preference'}`,
    `Preferred time: ${data.get('time') || 'No preference'}`,
    `Preferred language: ${data.get('language') || 'No preference'}`,
    `Message: ${data.get('message') || 'No additional message'}`
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

function initFaq() {
  document.querySelectorAll('.faq__question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq__item');
      const open = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(open));
    });
  });
}

function initCardGlow() {
  const cards = document.querySelectorAll('[data-glow-card]');
  cards.forEach(card => {
    card.addEventListener('mousemove', event => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
    });
  });
}

function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn--magnetic');
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!canHover) return;

  buttons.forEach(button => {
    button.addEventListener('mousemove', event => {
      const rect = button.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = '';
    });
  });
}

function initCopyPhone() {
  const button = document.querySelector('[data-copy-phone]');
  if (!button) return;

  button.addEventListener('click', async () => {
    const phone = button.dataset.copyPhone || '';
    try {
      await navigator.clipboard.writeText(phone);
      button.textContent = 'Copied';
      window.setTimeout(() => { button.textContent = 'Copy'; }, 1600);
      trackConversion('copy_phone', phone);
    } catch {
      button.textContent = 'Copy failed';
      window.setTimeout(() => { button.textContent = 'Copy'; }, 1600);
    }
  });
}

function trackConversion(eventName, eventLabel) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, label: eventLabel });
}
