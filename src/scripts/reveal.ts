// Gentle scroll-in fades for [data-reveal] elements. Re-initialised on every page load
// (including after a view transition), and skipped entirely for reduced-motion users.

let observer: IntersectionObserver | undefined;

function initReveal() {
  observer?.disconnect();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const elements = [...document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-revealed)')];
  const fold = window.innerHeight * 0.92;

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.replace('is-pending', 'is-revealed');
        observer?.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  for (const el of elements) {
    // Content already on screen is left alone — the page arrival animation handles it.
    if (el.getBoundingClientRect().top < fold) continue;
    el.classList.add('is-pending');
    observer.observe(el);
  }
}

document.addEventListener('astro:page-load', initReveal);
