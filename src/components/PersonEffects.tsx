/** Decorative layers shown while a person is talking. */
import type { CSSProperties } from 'react';

/** Comic-style "((  ))" sound waves on both sides of the face. */
export function SoundWaves() {
  const arcs = [
    'M58 -20 Q70 0 58 20',
    'M74 -32 Q92 0 74 32',
    'M90 -44 Q114 0 90 44',
  ];
  return (
    <svg className="waves" viewBox="-120 -50 240 100" aria-hidden="true">
      {[1, -1].map((side) => (
        <g key={side} transform={`scale(${side} 1)`}>
          {arcs.map((d, i) => (
            <g key={d} className="waves__arc" style={{ animationDelay: `${i * 120}ms` }}>
              <path d={d} className="waves__outline" />
              <path d={d} className="waves__line" />
            </g>
          ))}
        </g>
      ))}
    </svg>
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
