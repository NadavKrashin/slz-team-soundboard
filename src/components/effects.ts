/**
 * Press / release effects. Everything here animates only `transform` and
 * `opacity`, which the browser can run on the GPU.
 */

export const reducedMotion =
  typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

/** How long the "spring back up" transition takes (keep in sync with CSS). */
export const RELEASE_MS = 520;

const hideTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();

/**
 * The animated copy of the character ("clone") only exists visually while
 * it's needed, so the untouched artwork is what you see at rest.
 */
export function showClone(root: HTMLElement, hideAfterMs: number) {
  root.dataset.live = '';
  clearTimeout(hideTimers.get(root));
  hideTimers.set(
    root,
    setTimeout(() => {
      if (!root.classList.contains('is-active')) delete root.dataset.live;
    }, hideAfterMs),
  );
}

export interface PressTargets {
  root: HTMLElement;
  squash: HTMLElement;
  flash: HTMLElement;
  burst: HTMLElement;
}

export function playPressEffects({ root, squash, flash, burst }: PressTargets) {
  // Subtle buzz on Android. iOS Safari has no Vibration API – that's fine.
  navigator.vibrate?.(14);
  showClone(root, 700);

  const reduce = reducedMotion?.matches;

  flash.animate([{ opacity: 0 }, { opacity: reduce ? 0.5 : 0.85, offset: 0.18 }, { opacity: 0 }], {
    duration: reduce ? 300 : 460,
    easing: 'ease-out',
  });
  if (reduce) return;

  // A squashy "boing" layered on top of the held-down position.
  squash.animate(
    [
      { transform: 'none' },
      { transform: 'translateY(3%) scale(1.04, 0.93)', offset: 0.2 },
      { transform: 'translateY(-1.5%) scale(0.98, 1.03)', offset: 0.5 },
      { transform: 'translateY(0.5%) scale(1.01, 0.99)', offset: 0.75 },
      { transform: 'none' },
    ],
    { duration: 380, easing: 'cubic-bezier(.2,.7,.3,1)' },
  );

  burst.animate(
    [
      { transform: 'translate(-50%, -50%) scale(0.9)', opacity: 1 },
      { transform: 'translate(-50%, -50%) scale(1.7)', opacity: 0 },
    ],
    { duration: 480, easing: 'cubic-bezier(.1,.6,.3,1)' },
  );
}
