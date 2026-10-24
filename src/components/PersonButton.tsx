import {
  memo,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from 'react';
import { audio, usePlayback } from '../audio/playback';
import type { Person } from '../config/types';
import { playPressEffects, reducedMotion, RELEASE_MS, showClone } from './effects';
import { Equalizer, SoundWaves } from './PersonEffects';

/**
 * How far the copied artwork reaches past the tappable area, in % of the
 * region. The bottom grows when the arcade button sticks out below it.
 */
const BLEED = 5;
/** Width of the soft edge, in % of the region. */
const FEATHER = 8;

const NOTICE_TEXT = {
  missing: 'הקול בדרך… 🎙️',
  error: 'אופס! הקול לא נטען',
} as const;

interface Props {
  person: Person;
  index: number;
  imageUrl: string;
}

/** Position + art alignment for one person, all as CSS custom properties. */
function personStyle({ region: r, button: b, head: h, waves: w, color }: Person, index: number, imageUrl: string) {
  // The clone box = region + bleed on every side, in % of the image.
  const bottom = Math.max(BLEED, b.cy + b.ry - 100 + FEATHER + 2);
  const boxH = 100 + BLEED + bottom; // in % of region height
  const boxW = 100 + 2 * BLEED; // in % of region width
  const X = r.x - (r.w * BLEED) / 100;
  const Y = r.y - (r.h * BLEED) / 100;
  const W = (r.w * boxW) / 100;
  const H = (r.h * boxH) / 100;
  return {
    left: `${r.x}%`,
    top: `${r.y}%`,
    width: `${r.w}%`,
    height: `${r.h}%`,
    '--c': color,
    '--i': index,
    '--bleed': `${BLEED}%`,
    '--bleed-bottom': `${bottom}%`,
    '--fx': `${(FEATHER / boxW) * 100}%`,
    '--ft': `${(FEATHER / boxH) * 100}%`,
    '--fb': `${((boxH - FEATHER) / boxH) * 100}%`,
    '--art': `url("${imageUrl}")`,
    '--art-size': `${(100 * 100) / W}% ${(100 * 100) / H}%`,
    '--art-pos': `${(X / (100 - W)) * 100}% ${(Y / (100 - H)) * 100}%`,
    '--bx': `${b.cx}%`,
    '--by': `${b.cy}%`,
    '--brx': `${b.rx}%`,
    '--bry': `${b.ry}%`,
    '--b-bottom': `${b.cy + b.ry}%`,
    '--hx': `${h.cx}%`,
    '--hy': `${h.cy}%`,
    '--hr': `${h.r}%`,
    '--wlx': `${w.lx}%`,
    '--wly': `${w.ly}%`,
    '--wrx': `${w.rx}%`,
    '--wry': `${w.ry}%`,
    '--wsize': `${w.size}%`,
  } as CSSProperties;
}

/** While playing, feed live loudness into CSS vars on the person element. */
function useAudioLevels(ref: RefObject<HTMLElement | null>, playing: boolean) {
  useEffect(() => {
    const el = ref.current;
    if (!el || !playing) return;
    const levels = new Float32Array(5);
    const smooth = new Float32Array(5);
    const names = ['--lvl', '--b1', '--b2', '--b3', '--b4'];
    let raf = 0;
    const tick = () => {
      audio.readLevels(levels);
      for (let i = 0; i < 5; i++) {
        smooth[i] += (levels[i] - smooth[i]) * 0.45;
        el.style.setProperty(names[i], smooth[i].toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reducedMotion?.matches) raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      names.forEach((n) => el.style.removeProperty(n));
    };
  }, [ref, playing]);
}

export const PersonButton = memo(function PersonButton({ person, index, imageUrl }: Props) {
  const phase = usePlayback((s) => (s.activeId === person.id ? s.phase : 'idle'));
  const active = phase === 'loading' || phase === 'playing';
  const notice = phase === 'missing' || phase === 'error' ? NOTICE_TEXT[phase] : null;

  const rootRef = useRef<HTMLButtonElement>(null);
  const squashRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLSpanElement>(null);
  const burstRef = useRef<HTMLSpanElement>(null);
  const lastPointerDown = useRef(-Infinity);

  useAudioLevels(rootRef, phase === 'playing');

  // Keep the animated copy visible until the spring-back has finished.
  useEffect(() => {
    if (!active && rootRef.current?.dataset.live !== undefined) {
      showClone(rootRef.current, RELEASE_MS + 60);
    }
  }, [active]);

  const press = () => {
    audio.play(person.id);
    playPressEffects({
      root: rootRef.current!,
      squash: squashRef.current!,
      flash: flashRef.current!,
      burst: burstRef.current!,
    });
  };

  // React on finger-down (not on release) so the press feels instant.
  const handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return;
    lastPointerDown.current = performance.now();
    press();
  };

  // Keyboard (Enter/Space) and assistive tech arrive as a click without a pointer-down.
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    if (performance.now() - lastPointerDown.current < 800) return;
    press();
  };

  return (
    <button
      ref={rootRef}
      type="button"
      className={`person${active ? ' is-active' : ''}${phase === 'playing' ? ' is-playing' : ''}`}
      style={personStyle(person, index, imageUrl)}
      aria-label={person.name}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onContextMenu={(e) => e.preventDefault()}
    >
      {active && (
        <span className="person__ripples" aria-hidden="true">
          <span />
          <span />
        </span>
      )}
      <span className="person__body" aria-hidden="true">
        <span className="person__squash" ref={squashRef}>
          <span className="person__talk">
            <span className="person__clone person__art" />
            <span className="person__flash person__art" ref={flashRef} />
            <span className="person__ring" />
          </span>
        </span>
        {active && <SoundWaves />}
      </span>
      <span className="person__burst" ref={burstRef} aria-hidden="true" />
      {active && <Equalizer />}
      {notice && (
        <span className="person__bubble" aria-hidden="true">
          {notice}
        </span>
      )}
      <span className="person__placeholder" aria-hidden="true">
        {person.id}
      </span>
    </button>
  );
});
