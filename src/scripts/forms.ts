// Enquiry forms (Netlify Forms). Submits in the background, then moves to /thank-you/
// with a smooth page transition. Without JavaScript the form posts normally.
import { navigate } from 'astro:transitions/client';

function initForms() {
  // Pre-select a villa from ?villa=<slug> (used by "Enquire" links on villa cards)
  const wanted = new URLSearchParams(location.search).get('villa');
  if (wanted) {
    document.querySelectorAll<HTMLSelectElement>('select[data-villa-select]').forEach((select) => {
      const option = [...select.options].find((o) => o.dataset.slug === wanted);
      if (option) select.value = option.value;
    });
  }

  document.querySelectorAll<HTMLFormElement>('form[data-enquiry-form]').forEach((form) => {
    const status = form.querySelector<HTMLElement>('[data-form-status]')!;
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      button.disabled = true;
      button.dataset.label ??= button.textContent ?? '';
      button.textContent = 'Sending…';
      status.textContent = '';

      try {
        const body = new URLSearchParams(new FormData(form) as unknown as Record<string, string>).toString();
        if (import.meta.env.DEV) {
          // Netlify only processes forms once deployed — simulate success locally.
          console.info('[enquiry] dev mode, not sent:', Object.fromEntries(new URLSearchParams(body)));
        } else {
          const res = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
          });
          if (!res.ok) throw new Error(String(res.status));
        }
        await navigate(form.getAttribute('action') || '/thank-you/');
      } catch {
        status.textContent =
          'Sorry, your enquiry could not be sent. Please try again, or contact us by email or WhatsApp.';
        button.disabled = false;
        button.textContent = button.dataset.label;
      }
    });
  });
}

document.addEventListener('astro:page-load', initForms);
