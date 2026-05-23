// HollyWoodSmile Studio website data collected during planning.
// Missing degrees/specialties intentionally use XX placeholders until the clinic confirms them.
const doctors = [
  {
    name: 'Dr. Karzan Sami',
    degree: 'B.D.S, M.Sc Orthodontics',
    specialty: 'Orthodontics and Cosmetic Specialist',
    phone: '9647501457000',
    image: 'assets/doctors/karzan-sami.png',
    instagram: 'https://www.instagram.com/dr.karzan_sami?igsh=N2cybnZiZnk3dG9h'
  },
  {
    name: 'Dr. Saeed Tutmayi',
    degree: 'Assistant Professor',
    specialty: 'Oral-Maxillofacial & Implant Surgeon',
    phone: '9647501457000',
    image: 'assets/doctors/saeed-tutmayi.png',
    instagram: 'https://www.instagram.com/saeedtutmayi?igsh=M242dzVxN2hsaTN3'
  },
  {
    name: 'Dr. Banaz Kalhury',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647501457000',
    image: 'assets/doctors/banaz-kalhury.png',
    instagram: ''
  },
  {
    name: 'Dr. Wrya Khoshnaw',
    degree: 'BDS',
    specialty: 'Cosmetic Dentist',
    phone: '9647501457000',
    image: 'assets/doctors/wrya-khoshnaw.png',
    instagram: 'https://www.instagram.com/dr.wrya.nasradin'
  },
  {
    name: 'Dr. Rawand Ahmed',
    degree: 'BDS, MSc Orthodontics',
    specialty: 'Orthodontics',
    phone: '9647501458000',
    image: 'assets/doctors/rawand-ahmed.png',
    instagram: 'https://www.instagram.com/dr.rawandahmed?igsh=NGp0ZGNpczgzdjky'
  },
  {
    name: 'Dr. Khidher Mustafa',
    degree: 'XX',
    specialty: 'Microscopic Endodontist / Advanced Endodontic Specialist',
    phone: '9647501458000',
    image: 'assets/doctors/khidher-mustafa.png',
    instagram: 'https://www.instagram.com/dr_khidher_mustafa?igsh=MTYwNzUwcXVrOGV0cw=='
  },
  {
    name: 'Dr. Bashdar Omar',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647501458000',
    image: 'assets/doctors/bashdar-omar.png',
    instagram: ''
  },
  {
    name: 'Dr. Nyaz Asaad Tutmayi',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647501458000',
    image: 'assets/doctors/nyaz-asaad-tutmayi.png',
    instagram: ''
  },
  {
    name: 'Dr. Shler Omar',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647511457000',
    image: 'assets/doctors/shler-omar.png',
    instagram: ''
  },
  {
    name: 'Dr. Sherwan Kareem',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647511457000',
    image: 'assets/doctors/sherwan-kareem.png',
    instagram: ''
  },
  {
    name: 'Dr. Zardasht N. Bradosty',
    degree: 'BDS, PG Dip, MSc, PhD',
    specialty: 'Esthetic & Restorative Dentistry',
    phone: '9647511457000',
    image: 'assets/doctors/zardasht-bradosty.png',
    instagram: 'https://www.instagram.com/doctor.zardasht?igsh=cW1iemtvc25zaGV2'
  },
  {
    name: 'Dr. Mustafa Al-Qassab',
    degree: 'XX',
    specialty: 'Endodontics and Restorative Dentistry',
    phone: '9647511457000',
    image: 'assets/doctors/mustafa-alqassab.png',
    instagram: 'https://www.instagram.com/dr.mustafa_alqassab?igsh=ZTJkdnBiZzA5djdu'
  },
  {
    name: 'Dr. Znar Abdulmajeed',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647511457000',
    image: 'assets/doctors/znar-abdulmajeed.png',
    instagram: ''
  },
  {
    name: 'Dr. Yad Sirwan',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647511457000',
    image: 'assets/doctors/yad-sirwan.png',
    instagram: ''
  },
  {
    name: 'Dr. Dashnee Bahram',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647511457000',
    image: 'assets/doctors/dashnee-bahram.png',
    instagram: ''
  },
  {
    name: 'Dr. Huda Y. Latif',
    degree: 'XX',
    specialty: 'XX',
    phone: '9647511457000',
    image: 'assets/doctors/huda-y-latif.png',
    instagram: ''
  }
];

const mainWhatsApp = '9647501457000';
const defaultMessage = `Hello HollyWoodSmile Studio, I would like to book an appointment.\n\nName:\nPreferred date:\nPreferred time:\nMessage:`;

function buildWhatsAppUrl(phone, message) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function doctorMessage(doctorName) {
  return `Hello HollyWoodSmile Studio, I would like to book an appointment with ${doctorName}.\n\nName:\nPreferred date:\nPreferred time:\nMessage:`;
}

function renderDoctors() {
  const grid = document.getElementById('doctorGrid');
  grid.innerHTML = doctors.map((doctor, index) => {
    const instagramLink = doctor.instagram
      ? `<a class="profile-link" href="${doctor.instagram}" target="_blank" rel="noopener">Instagram ↗</a>`
      : `<span class="profile-link" aria-disabled="true">Instagram: XX</span>`;
    return `
      <article class="doctor-card" style="transition-delay:${Math.min(index * 25, 250)}ms">
        <div class="doctor-top">
          <div class="doctor-photo"><img src="${doctor.image}" alt="${doctor.name}" loading="lazy"></div>
          <h3>${doctor.name}</h3>
          <p class="specialty">${doctor.specialty}</p>
        </div>
        <div class="doctor-hover">
          <p><strong>Degree:</strong> ${doctor.degree}</p>
          <p><strong>Specialty:</strong> ${doctor.specialty}</p>
          <p><strong>Contact:</strong> +${doctor.phone}</p>
          ${instagramLink}
          <div class="doctor-actions">
            <a href="${buildWhatsAppUrl(doctor.phone, doctorMessage(doctor.name))}" target="_blank" rel="noopener">Contact</a>
            <button type="button" data-prefill="${index}">Use Form</button>
            <button type="button" data-profile="${index}">Profile</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function prefillDoctor(index) {
  const doctor = doctors[index];
  document.getElementById('selectedDoctor').value = doctor.name;
  document.getElementById('selectedWa').value = doctor.phone;
  document.getElementById('appointment').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => document.getElementById('patientName').focus(), 650);
}

function openDoctorModal(index) {
  const doctor = doctors[index];
  const modal = document.getElementById('doctorModal');
  const profileLink = doctor.instagram
    ? `<a class="btn btn-secondary" href="${doctor.instagram}" target="_blank" rel="noopener">Open Instagram</a>`
    : `<span class="btn btn-secondary">Instagram: XX</span>`;
  document.getElementById('modalContent').innerHTML = `
    <div class="modal-profile">
      <img src="${doctor.image}" alt="${doctor.name}">
      <div>
        <p class="eyebrow">Doctor profile</p>
        <h3>${doctor.name}</h3>
        <p><strong>Degree:</strong> ${doctor.degree}</p>
        <p><strong>Specialty:</strong> ${doctor.specialty}</p>
        <p><strong>WhatsApp group:</strong> +${doctor.phone}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${buildWhatsAppUrl(doctor.phone, doctorMessage(doctor.name))}" target="_blank" rel="noopener">Contact Doctor</a>
          ${profileLink}
        </div>
      </div>
    </div>
  `;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

function initEvents() {
  document.querySelector('.menu-toggle').addEventListener('click', (event) => {
    const nav = document.querySelector('.nav');
    const expanded = event.currentTarget.getAttribute('aria-expanded') === 'true';
    event.currentTarget.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  document.addEventListener('click', (event) => {
    const prefill = event.target.closest('[data-prefill]');
    if (prefill) prefillDoctor(Number(prefill.dataset.prefill));

    const profile = event.target.closest('[data-profile]');
    if (profile) openDoctorModal(Number(profile.dataset.profile));

    const main = event.target.closest('[data-whatsapp="main"]');
    if (main) {
      event.preventDefault();
      window.open(buildWhatsAppUrl(mainWhatsApp, defaultMessage), '_blank', 'noopener');
    }

    const direct = event.target.closest('[data-direct-number]');
    if (direct) window.open(buildWhatsAppUrl(direct.dataset.directNumber, defaultMessage), '_blank', 'noopener');
  });

  document.querySelector('.modal-close').addEventListener('click', closeModal);
  document.getElementById('doctorModal').addEventListener('click', (event) => {
    if (event.target.id === 'doctorModal') closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  document.getElementById('bookingForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const doctor = document.getElementById('selectedDoctor').value || 'General appointment';
    const name = document.getElementById('patientName').value.trim();
    const phone = document.getElementById('patientPhone').value.trim();
    const date = document.getElementById('preferredDate').value || 'Not selected';
    const time = document.getElementById('preferredTime').value || 'Not selected';
    const note = document.getElementById('patientMessage').value.trim() || 'No extra message';
    const selectedWa = document.getElementById('selectedWa').value || mainWhatsApp;
    const message = `Hello HollyWoodSmile Studio, I would like to book an appointment.\n\nSelected doctor: ${doctor}\nName: ${name}\nPhone: ${phone}\nPreferred date: ${date}\nPreferred time: ${time}\nMessage: ${note}`;
    document.getElementById('formNotice').textContent = 'Thank you for choosing HollyWoodSmile Studio. We received your request and WhatsApp will open so our team can confirm your appointment.';
    window.open(buildWhatsAppUrl(selectedWa, message), '_blank', 'noopener');
  });
}

function closeModal() {
  const modal = document.getElementById('doctorModal');
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

function revealOnScroll() {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

renderDoctors();
initEvents();
revealOnScroll();
document.getElementById('year').textContent = new Date().getFullYear();
