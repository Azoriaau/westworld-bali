import type { TransitionDirectionalAnimations } from 'astro';

const crossfade = {
  duration: '400ms',
  easing: 'ease-in-out',
  fillMode: 'both',
};

/** Soft 400ms crossfade used as the site-wide page transition. */
export const softFade: TransitionDirectionalAnimations = {
  forwards: {
    old: { name: 'astroFadeOut', ...crossfade },
    new: { name: 'astroFadeIn', ...crossfade },
  },
  backwards: {
    old: { name: 'astroFadeOut', ...crossfade },
    new: { name: 'astroFadeIn', ...crossfade },
  },
};
