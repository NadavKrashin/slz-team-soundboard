/** Decorative layers shown while a person is talking. */
import type { CSSProperties } from 'react';

const ARCS = ['M-18 -12 Q-10 0 -18 12', 'M-4 -19 Q8 0 -4 19', 'M10 -26 Q26 0 10 26'];

/**
 * Animated "))" marks drawn right on top of the artwork's own sound-wave
 * marks, so the printed waves appear to pulse while the person talks.
 */
export function SoundWaves() {
  return (
    <>
      {(['left', 'right'] as const).map((side) => (
        <svg key={side} className={`waves waves--${side}`} viewBox="-30 -32 60 64" aria-hidden="true">
          {ARCS.map((d, i) => (
            <g key={d} className="waves__arc" style={{ animationDelay: `${i * 120}ms` }}>
              <path d={d} className="waves__outline" />
              <path d={d} className="waves__line" />
            </g>
          ))}
        </svg>
      ))}
    </>
  );
}

/** Small audio-reactive equalizer. Bar heights come from CSS vars --b1…--b4. */
export function Equalizer() {
  return (
    <span className="eq" aria-hidden="true">
      <span className="eq__bar" style={{ '--v': 'var(--b1)' } as CSSProperties} />
      <span className="eq__bar" style={{ '--v': 'var(--b2)' } as CSSProperties} />
      <span className="eq__bar" style={{ '--v': 'var(--b3)' } as CSSProperties} />
      <span className="eq__bar" style={{ '--v': 'var(--b4)' } as CSSProperties} />
    </span>
  );
}
