// The header is persisted across page transitions, so its state is kept in sync here.

function setMenu(open: boolean) {
  const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-mobile-menu]');
  if (!toggle || !menu) return;
  toggle.setAttribute('aria-expanded', String(open));
  toggle.querySelector('.sr-only')!.textContent = open ? 'Close menu' : 'Open menu';
  toggle.querySelector('[data-icon-open]')?.toggleAttribute('hidden', open);
  toggle.querySelector('[data-icon-close]')?.toggleAttribute('hidden', !open);
  menu.toggleAttribute('data-open', open);
  menu.inert = !open;
}

function markCurrent() {
  const path = location.pathname;
  document.querySelectorAll<HTMLAnchorElement>('[data-nav-link]').forEach((link) => {
    const href = link.getAttribute('href')!;
    const current = href === path || (href !== '/' && path.startsWith(href));
    if (current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

// Bind once — the header element survives navigation.
document.addEventListener('click', (event) => {
  const toggle = (event.target as Element).closest('[data-menu-toggle]');
  if (toggle) setMenu(toggle.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', () => setMenu(false));

document.addEventListener('astro:after-swap', () => setMenu(false));
document.addEventListener('astro:page-load', markCurrent);
