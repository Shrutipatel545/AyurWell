// main.js
// Handles: nav highlighting, mobile menu, dark-mode power toggle, demo quiz logic, small DOM niceties.

const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const powerToggleButtons = Array.from(document.querySelectorAll('#power-toggle'));
const powerKnobs = Array.from(document.querySelectorAll('#power-knob'));

// set year placeholders
document.getElementById('year')?.textContent = new Date().getFullYear();
document.getElementById('year-quiz')?.textContent = new Date().getFullYear();
document.getElementById('year-rec')?.textContent = new Date().getFullYear();

// active nav highlight based on location
function setActiveNav() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const map = {
    'index.html': 'dashboard',
    '': 'dashboard',
    'quiz.html': 'quiz',
    'recommendations.html': 'recommendations'
  };
  const active = map[current] || 'dashboard';
  navLinks.forEach(a => {
    if (a.dataset.nav === active) {
      a.classList.add('nav-active');
    } else {
      a.classList.remove('nav-active');
    }
  });
}
setActiveNav();

// mobile menu toggle
mobileBtn?.addEventListener('click', () => {
  mobileMenu?.classList.toggle('hidden');
});

// mobile nav link closes the menu on click
document.querySelectorAll('#mobile-menu .nav-link').forEach(a => {
  a.addEventListener('click', () => mobileMenu?.classList.add('hidden'));
});

// Power glow theme toggle (persisted)
const body = document.body;
const POWER_KEY = 'prk_theme_dark';

// init from localStorage
(function initTheme() {
  const preferDark = localStorage.getItem(POWER_KEY) === 'true';
  if (preferDark) {
    body.classList.add('dark', 'dark-active');
    // enable Tailwind's dark by class (Tailwind CDN uses 'media' by default; we force by adding 'dark' class)
    document.documentElement.classList.add('dark');
  } else {
    body.classList.remove('dark-active');
    document.documentElement.classList.remove('dark');
  }
  // position knob if necessary
  updateKnob();
})();

function updateKnob() {
  const active = body.classList.contains('dark-active');
  // attach transform (handled by CSS), but we ensure aria-pressed
  powerToggleButtons.forEach(btn => btn.setAttribute('aria-pressed', active ? 'true' : 'false'));
}

// toggle handler
powerToggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-active');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(POWER_KEY, isDark ? 'true' : 'false');
    updateKnob();
  });
});

// small demo: fill dashboard placeholders when running locally
if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
  // demo content placeholders (can be replaced by real data)
  document.getElementById('dash-prakriti')?.replaceWith(Object.assign(document.createElement('p'), {
    id: 'dash-prakriti',
    className: 'mt-2 text-xl font-bold text-amber-600 dark:text-amber-400',
    textContent: 'Unknown — take quiz'
  }));
}

// Demo followup button on dashboard (no backend, client only)
document.getElementById('demo-followup')?.addEventListener('click', () => {
  const s = document.getElementById('status-message');
  if (s) {
    s.textContent = 'Sample follow-up logged (demo).';
    s.classList.add('text-green-700');
    setTimeout(() => {
      s.textContent = 'All systems normal';
      s.classList.remove('text-green-700');
    }, 2000);
  }
});

// ---- QUIZ logic (client-side) ----
const form = document.getElementById('prakriti-form');
if (form) {
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const scoreMap = { low: 1, medium: 2, high: 3 };
    let vata = 0, pitta = 0, kapha = 0;
    for (const [k, v] of fd.entries()) {
      if (k.startsWith('vata')) vata += scoreMap[v] || 0;
      if (k.startsWith('pitta')) pitta += scoreMap[v] || 0;
      if (k.startsWith('kapha')) kapha += scoreMap[v] || 0;
    }

    const maxScore = Math.max(vata, pitta, kapha);
    const primary = [];
    if (vata === maxScore) primary.push('Vata');
    if (pitta === maxScore) primary.push('Pitta');
    if (kapha === maxScore) primary.push('Kapha');

    let result = 'Tridoshic';
    if (primary.length === 1) result = primary[0];
    else if (primary.length === 2) result = primary.join('-');
    else result = 'Tridoshic (Vata-Pitta-Kapha)';

    // show result
    document.getElementById('result-card')?.classList.remove('hidden');
    document.getElementById('result-text').textContent = result;
    document.getElementById('result-details').textContent = `Scores — Vata: ${vata}, Pitta: ${pitta}, Kapha: ${kapha}.`;

    // update dashboard placeholders if available in same session (local only)
    try {
      localStorage.setItem('prk_result', JSON.stringify({ result, vata, pitta, kapha, ts: Date.now() }));
    } catch (e) { /* ignore */ }
  });
}

// small AI plan generator demo (client-only placeholder)
const genBtn = document.getElementById('generate-ai');
if (genBtn) {
  genBtn.addEventListener('click', () => {
    const diet = `### Diet Guidelines\n- Favor warm, cooked foods\n- Avoid excessive spicy or oily items\n- Hydrate with warm water\n\n**Sample breakfast:** Porridge with warm spices.`;
    const schedule = `### Daily Routine\n- Wake: 6:00 AM\n- Morning: Light exercise, warm water\n- Meals: Regular schedule with light dinner\n- Night: Unwind at least 1 hour before bed`;
    document.getElementById('diet-content').innerHTML = mdToHtml(diet);
    document.getElementById('schedule-content').innerHTML = mdToHtml(schedule);
    document.getElementById('ai-notice').textContent = 'AI Plan generated (demo client-side). Replace with real AI call to save results.';
  });
}

// small markdown -> simple HTML renderer for the demo (handles # and - lists)
function mdToHtml(md) {
  // naive rendering for demo only (headings + lists + paragraphs)
  const lines = md.split('\n');
  let html = '';
  let inList = false;
  lines.forEach(line => {
    if (line.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3 class="text-lg font-semibold mt-3">${escapeHtml(line.replace('### ', ''))}</h3>`;
    } else if (line.trim().startsWith('- ')) {
      if (!inList) { html += '<ul class="mt-2 list-disc pl-5">'; inList = true; }
      html += `<li>${escapeHtml(line.trim().substring(2))}</li>`;
    } else if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false; }
    } else {
      html += `<p class="mt-2">${escapeHtml(line)}</p>`;
    }
  });
  if (inList) html += '</ul>';
  return html;
}

function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// ensure icons are rendered after DOM is ready
window.addEventListener('load', () => lucide.createIcons());
