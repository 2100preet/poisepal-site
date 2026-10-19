// PoisePal marketing site: small progressive enhancements. The page works without JS.

const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile navigation
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const nav = document.getElementById('primary-nav');
if (toggle && nav) {
  const setOpen = (open: boolean) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); toggle.focus(); }
  });
}

// Pricing: yearly / monthly toggle
const billingButtons = document.querySelectorAll<HTMLButtonElement>('[data-billing]');
billingButtons.forEach((btn) =>
  btn.addEventListener('click', () => {
    const period = btn.dataset.billing as 'yearly' | 'monthly';
    billingButtons.forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    document.querySelectorAll<HTMLElement>('[data-yearly][data-monthly]').forEach((el) => {
      const v = el.dataset[period];
      if (v) el.textContent = v;
    });
  }),
);

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));
