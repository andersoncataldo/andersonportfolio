const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const metaTheme = $('#meta-theme-color');
const applyThemeColor = () => { metaTheme.setAttribute('content', getComputedStyle(document.body).getPropertyValue('--bg').trim()); };

const getPreferredTheme = () => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const setTheme = (mode) => {
  document.body.classList.toggle('dark', mode === 'dark');
  $('#theme-toggle').setAttribute('aria-pressed', String(mode === 'dark'));
  localStorage.setItem('theme', mode);
  applyThemeColor();
};

// Init theme
setTheme(getPreferredTheme());
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
});

// Toggle theme
$('#theme-toggle').addEventListener('click', () => {
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(next);
});

// Menu mobile
const links = $('#nav-links');
const toggleBtn = $('#menu-toggle');
toggleBtn.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggleBtn.setAttribute('aria-expanded', String(open));
});
$$('#nav-links a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));

try { document.documentElement.style.scrollBehavior = 'smooth'; } catch {}
const sections = ['inicio','sobre','habilidades','projetos','experiencia','contato'].map(id => document.getElementById(id));
const navAnchors = new Map($$('#nav-links a').map(a => [a.getAttribute('href').slice(1), a]));
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.id;
    if (entry.isIntersecting) {
      $$('#nav-links a').forEach(a => a.classList.remove('active'));
      navAnchors.get(id)?.classList.add('active');
      history.replaceState(null, '', `#${id}`);
    }
  });
}, { rootMargin: `-40% 0px -55% 0px`, threshold: [0, 1] });
sections.forEach(s => io.observe(s));

// Formulário sem backend -> mailto
  note.style.color = 'inherit';

// Ano dinâmico
$('#year').textContent = new Date().getFullYear();