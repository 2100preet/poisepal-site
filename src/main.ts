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

// Pilot form: client-side validation. TODO(pilot-form): not connected to any backend yet.
const form = document.querySelector<HTMLFormElement>('[data-pilot-form]');
if (form) {
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const rules: Array<[string, (v: string) => string]> = [
    ['f-name', (v) => (v.trim().length < 2 ? 'Please enter your name.' : '')],
    ['f-email', (v) => (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? 'Please enter a valid work email.' : '')],
    ['f-company', (v) => (v.trim().length < 2 ? 'Please enter your company.' : '')],
    ['f-size', (v) => (!v ? 'Please choose a team size.' : '')],
  ];
  const validate = (id: string, check: (v: string) => string) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement;
    const err = document.getElementById(`${id}-err`)!;
    const msg = check(el.value);
    err.textContent = msg;
    if (msg) { el.setAttribute('aria-invalid', 'true'); el.setAttribute('aria-describedby', `${id}-err`); }
    else { el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby'); }
    return !msg;
  };
  rules.forEach(([id, check]) => {
    document.getElementById(id)?.addEventListener('blur', () => validate(id, check));
  });
  form.addEventListener('submit', (e) => {
    const results = rules.map(([id, check]) => validate(id, check));
    const firstBad = results.indexOf(false);
    if (firstBad !== -1) {
      e.preventDefault();
      (document.getElementById(rules[firstBad][0]) as HTMLElement).focus();
      status.className = 'form-status';
      status.textContent = '';
      return;
    }
    if (form.dataset.live !== 'true') {
      // TODO(pilot-form): remove this block once a real Formspree ID or mailto address is configured.
      e.preventDefault();
      status.className = 'form-status todo';
      status.textContent = 'Thanks! Pilot sign-ups open soon. This form isn’t connected yet, so nothing was sent. Please check back shortly.';
    }
  });
}

document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));
