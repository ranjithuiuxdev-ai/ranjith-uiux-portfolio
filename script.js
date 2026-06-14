

/* ─── MOBILE NAV ─── */
document.getElementById('hamburger').addEventListener('click', () => document.getElementById('mobileNav').classList.add('open'));
document.getElementById('closeNav').addEventListener('click', () => document.getElementById('mobileNav').classList.remove('open'));
document.querySelectorAll('.mob-l').forEach(l => l.addEventListener('click', () => document.getElementById('mobileNav').classList.remove('open')));

/* ─── REVEAL ─── */
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => revObs.observe(el));

/* ─── COUNTER ─── */
function animCount(el) {
    const target = +el.dataset.target, suffix = el.dataset.suffix || '';
    let curr = 0;
    const step = target / 60;
    const t = setInterval(() => {
        curr = Math.min(curr + step, target);
        el.textContent = Math.floor(curr) + suffix;
        if (curr >= target) clearInterval(t);
    }, 22);
}
const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.stat-num').forEach(animCount);
            cntObs.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-row').forEach(el => cntObs.observe(el));

/* ─── EXPERIENCE SWITCHER ─── */
const experienceCards = document.querySelectorAll('.exp-panel');
const expPrev = document.getElementById('expPrev');
const expNext = document.getElementById('expNext');
let activeExperience = 0;

function showExperience(index) {
    if (!experienceCards.length) return;

    activeExperience = Math.max(0, Math.min(index, experienceCards.length - 1));

    experienceCards.forEach((card, cardIndex) => {
        const isActive = cardIndex === activeExperience;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-hidden', String(!isActive));
    });

    if (expPrev) expPrev.disabled = activeExperience === 0;
    if (expNext) expNext.disabled = activeExperience === experienceCards.length - 1;
}

if (experienceCards.length) {
    showExperience(activeExperience);
}

if (expPrev) {
    expPrev.addEventListener('click', () => showExperience(activeExperience - 1));
}

if (expNext) {
    expNext.addEventListener('click', () => showExperience(activeExperience + 1));
}


/* ─── PROJECT TABS ─── */
const projTabs = document.getElementById('projTabs');

function applyProjectFilter(cat) {
    document.querySelectorAll('.proj-card').forEach(card => {
        card.style.display = card.dataset.cat === cat ? '' : 'none';
    });
}

applyProjectFilter('desktop');

if (projTabs) {
    projTabs.addEventListener('click', e => {
        const tab = e.target.closest('.proj-tab');
        if (!tab) return;
        document.querySelectorAll('.proj-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        applyProjectFilter(tab.dataset.cat);
    });
}

/* â”€â”€â”€ WHATSAPP CONTACT FORM â”€â”€â”€ */
const sendWhatsAppBtn = document.getElementById('sendWhatsApp');

if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
        const firstName = document.getElementById('contactFirstName').value.trim();
        const lastName = document.getElementById('contactLastName').value.trim();
        const email = document.getElementById('contactEmail').value.trim();
        const message = document.getElementById('contactMessage').value.trim();

        if (!firstName || !email || !message) {
            alert('Please fill First Name, Email Address, and Message.');
            return;
        }

        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        const whatsappMessage = `Hello Ranjith,\n\nName: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`;
        const whatsappUrl = `https://wa.me/917418623767?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappUrl, '_blank');
    });
}
