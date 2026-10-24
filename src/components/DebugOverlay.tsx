import { useEffect, useState, type RefObject } from 'react';
import { resolvedPeople } from '../config/layout';

/**
 * Calibration helper – open the site with `?debug` in the address.
 * Shows every tappable area and the % position under your finger/mouse,
 * which you can copy into `src/config/people.ts` or `layout.ts`.
 */
export function DebugOverlay({ stageRef }: { stageRef: RefObject<HTMLElement | null> }) {
  const [pos, setPos] = useState<string>('הזיזו את העכבר / האצבע מעל התמונה');

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * 100;
      const y = ((e.clientY - r.top) / r.height) * 100;
      setPos(`x: ${x.toFixed(1)}%   y: ${y.toFixed(1)}%`);
    };
    stage.addEventListener('pointermove', onMove);
    stage.addEventListener('pointerdown', onMove);
    return () => {
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerdown', onMove);
    };
  }, [stageRef]);

  return (
    <>
      {resolvedPeople.map(({ id, region: r, button: b, head: h }) => (
        <div
          key={id}
          className="debug__region"
          style={{ left: `${r.x}%`, top: `${r.y}%`, width: `${r.w}%`, height: `${r.h}%` }}
        >
          <span className="debug__label">{id}</span>
          <span
            className="debug__button"
            style={{
              left: `${b.cx - b.rx}%`,
              top: `${b.cy - b.ry}%`,
              width: `${b.rx * 2}%`,
              height: `${b.ry * 2}%`,
            }}
          />
          <span
            className="debug__head"
            style={{ left: `${h.cx}%`, top: `${h.cy}%`, width: `${h.r * 2}%` }}
          />
        </div>
      ))}
      <output className="debug__readout" dir="ltr">
        {pos}
      </output>
    </>
  );
}
