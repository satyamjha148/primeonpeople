/* ─── BFCACHE RELOAD ──────────────────────────────────────── */
// Tailwind CDN injects styles at runtime; bfcache restores can leave the
// page unstyled. Force a fresh load when the browser restores from bfcache.
window.addEventListener('pageshow', (event) => {
  if (event.persisted || (performance.getEntriesByType('navigation')[0]?.type === 'back_forward')) {
    window.location.reload();
  }
});

/* ─── NAVBAR SCROLL EFFECT ────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

/* ─── MOBILE MENU ─────────────────────────────────────────── */
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

mobileBtn?.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

/* ─── COUNTER ANIMATION ───────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2200;
  const startTime = performance.now();

  // Ease-out function
  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutExpo(progress);
    const value = Math.round(eased * target);

    el.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toLocaleString();
    }
  }

  requestAnimationFrame(update);
}

/* ─── INTERSECTION OBSERVER FOR REVEALS & COUNTERS ───────── */
const revealElements = document.querySelectorAll('.reveal');
const counterElements = document.querySelectorAll('.counter');
const counter2Elements = document.querySelectorAll('.counter2');

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
};

// Reveal observer
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.style.animationDelay || '0s';
      const delayMs = parseFloat(delay) * 1000;

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delayMs);

      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

revealElements.forEach(el => revealObserver.observe(el));

// Hero counters (always start)
function startHeroCounters() {
  counterElements.forEach(el => {
    const delay = 1000;
    setTimeout(() => animateCounter(el), delay);
  });
}

// Section counters (trigger on scroll)
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

counter2Elements.forEach(el => counterObserver.observe(el));

// Start hero counters after page load
window.addEventListener('load', startHeroCounters);

/* ─── TESTIMONIAL SLIDER ──────────────────────────────────── */
const track = document.getElementById('testimonials-track');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

let current = 0;
const total = document.querySelectorAll('.testimonial-slide').length;
let autoplayInterval;

function goToSlide(index) {
  current = (index + total) % total;
  track.style.transform = `translateX(-${current * 100}%)`;

  dots.forEach((dot, i) => {
    if (i === current) {
      dot.classList.remove('bg-gray-300');
      dot.classList.add('bg-navy-900', 'w-6');
    } else {
      dot.classList.remove('bg-navy-900', 'w-6');
      dot.classList.add('bg-gray-300');
    }
  });
}

nextBtn?.addEventListener('click', () => {
  goToSlide(current + 1);
  resetAutoplay();
});

prevBtn?.addEventListener('click', () => {
  goToSlide(current - 1);
  resetAutoplay();
});

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    goToSlide(parseInt(dot.dataset.index, 10));
    resetAutoplay();
  });
});

// Autoplay
function startAutoplay() {
  autoplayInterval = setInterval(() => goToSlide(current + 1), 5000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

startAutoplay();

// Touch/swipe support
let touchStartX = 0;

track?.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

track?.addEventListener('touchend', (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    diff > 0 ? goToSlide(current + 1) : goToSlide(current - 1);
    resetAutoplay();
  }
});

/* ─── SMOOTH ACTIVE NAV LINK ──────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => sectionObserver.observe(s));

/* ─── PARALLAX SUBTLE ─────────────────────────────────────── */
const heroBg = document.querySelector('.hero-bg');

window.addEventListener('scroll', () => {
  if (heroBg && window.innerWidth > 768) {
    const scrolled = window.scrollY;
    heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
  }
}, { passive: true });

/* ─── CURSOR GLOW ─────────────────────────────────────────── */
// Lightweight glow dot that follows cursor on hero
const heroSection = document.getElementById('hero');
const cursorGlow = document.createElement('div');
cursorGlow.style.cssText = `
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(201,168,76,0.06), transparent 70%);
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s ease;
  z-index: 1;
  opacity: 0;
`;
document.body.appendChild(cursorGlow);

heroSection?.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top = e.clientY + 'px';
  cursorGlow.style.opacity = '1';
});

heroSection?.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

/* ─── PAGE TRANSITION ─────────────────────────────────────── */
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.3s ease';
      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  }
});

// Fade in on load
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.5s ease';
  document.body.style.opacity = '1';
});
/* ─── 3D CARD TILT (mouse tracking) ──────────────────────── */
document.querySelectorAll('.card-hover, .why-card, .process-step, .service-card, .trust-stat-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const tiltX = dy * -7;
    const tiltY = dx * 7;

    card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-10px) scale(1.015)`;
    card.style.transition = 'transform 0.08s ease';

    // Inner glow spotlight
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201,168,76,0.06) 0%, transparent 70%), ${getComputedStyle(card).background}`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    card.style.background = '';
  });
});

/* ─── MAGNETIC BUTTON EFFECT ──────────────────────────────── */
document.querySelectorAll('a[class*="rounded-full"], button[class*="rounded-full"]').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const pull = 0.22;
    btn.style.transform = `translate(${x * pull}px, ${y * pull}px)`;
    btn.style.transition = 'transform 0.15s ease';
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
  });
});

/* ─── PROCESS CARD ICON GROUP ROTATE ─────────────────────── */
document.querySelectorAll('.process-card .w-14.rounded-xl').forEach(icon => {
  const card = icon.closest('.process-card');
  card?.addEventListener('mouseenter', () => {
    icon.style.transform = 'rotate(-8deg) scale(1.1)';
    icon.style.transition = 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)';
  });
  card?.addEventListener('mouseleave', () => {
    icon.style.transform = '';
  });
});

/* ─── RIPPLE CLICK EFFECT ON BUTTONS ─────────────────────── */
document.querySelectorAll('a[class*="rounded-full"], button[class*="rounded-full"]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const ripple = document.createElement('span');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: rgba(255,255,255,0.25);
      border-radius: 50%;
      transform: scale(0) translate(-50%, -50%);
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      animation: rippleOut 0.55s ease-out forwards;
      pointer-events: none;
      z-index: 10;
    `;
    btn.style.position = 'relative';
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Ripple keyframe via JS (in case not in CSS)
if (!document.getElementById('ripple-style')) {
  const s = document.createElement('style');
  s.id = 'ripple-style';
  s.textContent = `@keyframes rippleOut {
    to { transform: scale(1) translate(-50%, -50%); opacity: 0; }
  }`;
  document.head.appendChild(s);
}

/* ─── FOOTER SOCIAL ICONS — STAGGERED HOVER ──────────────── */
document.querySelectorAll('footer .flex.gap-3 a').forEach((icon, i) => {
  icon.addEventListener('mouseenter', () => {
    icon.style.transitionDelay = '0s';
    icon.style.transform = 'translateY(-4px) rotate(8deg) scale(1.15)';
  });
  icon.addEventListener('mouseleave', () => {
    icon.style.transform = '';
  });
});
/* ─── FORM → EMAIL (mailto) ─────────────────────────────── */
// Shared submit handler for every contact/enquiry form on the site.
// Collects the values keyed by their visible label, then opens the user's
// default mail client pre-filled with the data, addressed to the site owner.
const SITE_CONTACT_EMAIL = 'info@primeonpeople.com';

function sendFormByEmail(form) {
  const fields = Array.from(form.querySelectorAll('input, textarea, select'))
    .filter(el => el.type !== 'submit' && el.type !== 'button' && el.type !== 'hidden');

  for (const el of fields) {
    if (el.required && !el.value.trim()) {
      el.focus();
      alert('Please fill in all required fields.');
      return false;
    }
  }

  const lines = fields.map(el => {
    const label = el.parentElement && el.parentElement.querySelector('label');
    const name = label
      ? label.textContent.replace(/\*/g, '').trim()
      : (el.name || el.placeholder || 'Field');
    return `${name}: ${(el.value || '').trim()}`;
  });

  const pageTitle = (document.title || 'Website').trim();
  const subject = `New enquiry — ${pageTitle}`;
  const body = `${lines.join('\n')}\n\n---\nSent from: ${window.location.href}`;

  window.location.href =
    `mailto:${SITE_CONTACT_EMAIL}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  return false;
}

/* ─── TERN-STYLE SCROLL REVEAL (images + cards + content) ── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .sr-hidden {
      opacity: 0.06;
      filter: blur(3px);
      transform: translateY(28px);
      transition: opacity 0.8s ease, filter 0.8s ease, transform 0.8s cubic-bezier(0.22,1,0.36,1);
      will-change: opacity, filter, transform;
    }
    .sr-hidden.sr-visible {
      opacity: 1;
      filter: blur(0px);
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  const selectors = [
    /* text */
    'section h2', 'section h3', 'section h4',
    'section > div > p', 'section > div > div > p',
    'section > div > ul', 'section > div > div > ul',
    'section span.text-gold-500', 'section span.text-gold-400',
    /* images */
    'section img',
    'section picture',
    /* grid / flex children (covers photo cards, info cards, stat cards…) */
    'section .grid > *',
    'section [class*="card"]',
    'section [class*="step"]',
    'section [class*="stat"]',
    'section [class*="banner"]',
    'section [class*="why-card"]',
    'section [class*="process"]',
    'section [class*="service"]',
    /* promise / photo tiles that use bg images */
    'section .rounded-2xl',
    'section .rounded-3xl',
    'section .rounded-xl'
  ];

  const seen = new WeakSet();

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return;
      if (el.closest('#navbar') || el.closest('header') || el.closest('footer')) return;
      if (el.classList.contains('reveal')) return;
      // Don't wrap a parent whose direct children are already targeted
      if ([...el.children].some(child => seen.has(child))) return;

      seen.add(el);

      const siblings = Array.from(el.parentElement?.children || []);
      const idx = siblings.indexOf(el);
      const delay = Math.min(idx * 0.12, 0.48);
      el.style.transitionDelay = `${delay}s`;
      el.classList.add('sr-hidden');

      const obs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('sr-visible');
        } else {
          entry.target.classList.remove('sr-visible');
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

      obs.observe(el);
    });
  });
})();