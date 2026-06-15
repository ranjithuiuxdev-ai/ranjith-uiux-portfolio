

/* ─── MOBILE NAV ─── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const closeNav = document.getElementById('closeNav');

/* HERO MOUSE MOVEMENT */
const heroSection = document.getElementById('home');

if (heroSection) {
    function setPointer(clientX, clientY) {
        const rect = heroSection.getBoundingClientRect();
        const pointerX = clientX - rect.left;
        const pointerY = clientY - rect.top;
        const isActive = pointerX >= 0 && pointerX <= rect.width && pointerY >= 0 && pointerY <= rect.height;

        if (!isActive) return;
        const moveX = ((pointerX / rect.width) - 0.5).toFixed(3);
        const moveY = ((pointerY / rect.height) - 0.5).toFixed(3);

        heroSection.style.setProperty('--mouse-x', moveX);
        heroSection.style.setProperty('--mouse-y', moveY);
    }

    heroSection.addEventListener('pointermove', e => setPointer(e.clientX, e.clientY));
    heroSection.addEventListener('pointerleave', () => {
        heroSection.style.setProperty('--mouse-x', 0);
        heroSection.style.setProperty('--mouse-y', 0);
    });
}

function toggleMobileNav(forceOpen) {
    const shouldOpen = typeof forceOpen === 'boolean' ? forceOpen : !mobileNav.classList.contains('open');

    mobileNav.classList.toggle('open', shouldOpen);
    hamburger.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', String(shouldOpen));
}

hamburger.addEventListener('click', () => toggleMobileNav());
closeNav.addEventListener('click', () => toggleMobileNav(false));
document.querySelectorAll('.mob-l').forEach(l => l.addEventListener('click', () => toggleMobileNav(false)));

const secureWarning = document.createElement('div');
secureWarning.className = 'secure-warning';
secureWarning.setAttribute('role', 'alert');
secureWarning.textContent = 'This page is secure.';
document.body.appendChild(secureWarning);

let secureWarningTimer;

function showSecureWarning(message = 'This page is secure.') {
    secureWarning.textContent = message;
    secureWarning.classList.add('show');
    clearTimeout(secureWarningTimer);
    secureWarningTimer = setTimeout(() => secureWarning.classList.remove('show'), 5000);
}

document.addEventListener('contextmenu', e => {
    e.preventDefault();
    showSecureWarning();
});

document.addEventListener('copy', e => {
    e.preventDefault();
    showSecureWarning('Copy is restricted on this secure page.');
});

document.addEventListener('cut', e => {
    e.preventDefault();
    showSecureWarning('Copy is restricted on this secure page.');
});

const pressedKeys = new Set();

document.addEventListener('keydown', e => {
    const key = e.key.toLowerCase();
    const code = e.code.toLowerCase();
    pressedKeys.add(key);
    pressedKeys.add(code);
    const controlKey = e.ctrlKey || e.metaKey;
    const isCtrlAS = controlKey && (key === 's' || code === 'keys') && (pressedKeys.has('a') || pressedKeys.has('keya'));
    const isInspectShortcut = e.key === 'F12'
        || (controlKey && e.shiftKey && ['i', 'j', 'c', 'k'].includes(key))
        || (controlKey && e.altKey && ['i', 'j', 'c', 's'].includes(key))
        || (controlKey && ['c', 'r', 'u', 's'].includes(key))
        || isCtrlAS;

    if (isInspectShortcut) {
        e.preventDefault();
        e.stopPropagation();
        showSecureWarning();
    }
}, true);

document.addEventListener('keyup', e => {
    pressedKeys.delete(e.key.toLowerCase());
    pressedKeys.delete(e.code.toLowerCase());
});

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
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

        if (!emailPattern.test(email)) {
            alert('Please enter a valid Email Address.');
            document.getElementById('contactEmail').focus();
            return;
        }

        const fullName = [firstName, lastName].filter(Boolean).join(' ');
        const whatsappMessage = `Hello Ranjith,\n\nName: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`;
        const whatsappUrl = `https://wa.me/917418623767?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappUrl, '_blank');
    });
}

const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        backToTopBtn.classList.toggle('show', window.scrollY > 350);
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
