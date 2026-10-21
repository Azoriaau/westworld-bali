// Accessible gallery lightbox built on the native <dialog> element.
// Markup: <a href="large.jpg" data-lightbox="group-name" data-caption="…"><img …></a>
// plus one <Lightbox /> component on the page. Links still open the image if JS is unavailable.

function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lightbox-dialog]');
  if (!dialog) return;

  const img = dialog.querySelector<HTMLImageElement>('[data-lightbox-image]')!;
  const caption = dialog.querySelector<HTMLElement>('[data-lightbox-caption]')!;
  const counter = dialog.querySelector<HTMLElement>('[data-lightbox-counter]')!;
  const prev = dialog.querySelector<HTMLButtonElement>('[data-lightbox-prev]')!;
  const next = dialog.querySelector<HTMLButtonElement>('[data-lightbox-next]')!;

  let items: HTMLAnchorElement[] = [];
  let index = 0;
  let opener: HTMLElement | null = null;

  const show = (i: number) => {
    index = (i + items.length) % items.length;
    const link = items[index];
    const thumb = link.querySelector('img');
    img.classList.remove('is-loaded');
    img.src = link.href;
    img.alt = thumb?.alt ?? '';
    caption.textContent = link.dataset.caption ?? thumb?.alt ?? '';
    counter.textContent = `${index + 1} / ${items.length}`;
    const single = items.length < 2;
    prev.hidden = single;
    next.hidden = single;
    // Warm the cache for the next image
    if (!single) new Image().src = items[(index + 1) % items.length].href;
  };

  img.addEventListener('load', () => img.classList.add('is-loaded'));

  document.querySelectorAll<HTMLAnchorElement>('a[data-lightbox]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const group = link.dataset.lightbox;
      items = [...document.querySelectorAll<HTMLAnchorElement>(`a[data-lightbox="${group}"]`)];
      opener = link;
      show(items.indexOf(link));
      dialog.showModal();
    });
  });

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  dialog.querySelector('[data-lightbox-close]')!.addEventListener('click', () => dialog.close());

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  // Click on the backdrop (outside the figure) closes
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // Swipe on touch screens
  let startX = 0;
  dialog.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  dialog.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50 && items.length > 1) show(index + (dx < 0 ? 1 : -1));
  });

  dialog.addEventListener('close', () => opener?.focus());
}

document.addEventListener('astro:page-load', initLightbox);
