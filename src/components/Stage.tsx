import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { IMAGE, imageUrl, resolvedPeople } from '../config/layout';
import { DebugOverlay } from './DebugOverlay';
import { reducedMotion } from './effects';
import { PersonButton } from './PersonButton';

type ImageStatus = 'loading' | 'ready' | 'error';

const INTRO_MS = 80 * resolvedPeople.length + 700;

/** The artwork with all twelve tappable people on top of it. */
export const Stage = memo(function Stage({ onPress }: { onPress: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<ImageStatus>('loading');
  const [ratio, setRatio] = useState(IMAGE.width / IMAGE.height);
  useEffect(() => {
    document.documentElement.style.setProperty('--ar', String(IMAGE.width / IMAGE.height));
  }, []);
  const [intro, setIntro] = useState(false);
  const debug = useMemo(() => new URLSearchParams(location.search).has('debug'), []);

  const handleLoad = () => {
    const img = imgRef.current;
    if (img?.naturalWidth) {
      const r = img.naturalWidth / img.naturalHeight;
      setRatio(r);
      document.documentElement.style.setProperty('--ar', String(r));
    }
    setStatus('ready');
  };

  // The image may already be cached and complete before React attaches onLoad.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete) {
      if (img.naturalWidth) handleLoad();
      else setStatus('error');
    }
  }, []);

  // A quick "attract mode" wave across all buttons, so it's obvious they're pressable.
  useEffect(() => {
    if (status !== 'ready' || reducedMotion?.matches) return;
    setIntro(true);
    const t = setTimeout(() => setIntro(false), INTRO_MS);
    return () => clearTimeout(t);
  }, [status]);

  return (
    <div
      ref={stageRef}
      className={`stage stage--${status}${intro ? ' stage--intro' : ''}${debug ? ' stage--debug' : ''}`}
      style={{ '--ar': ratio } as CSSProperties}
      role="group"
      aria-label="לוח הסאונד – 12 כפתורים"
    >
      <img
        ref={imgRef}
        className="stage__img"
        src={imageUrl}
        width={IMAGE.width}
        height={IMAGE.height}
        alt=""
        decoding="async"
        fetchPriority="high"
        draggable={false}
        onLoad={handleLoad}
        onError={() => setStatus('error')}
      />
      {status === 'error' && (
        <p className="stage__missing">
          התמונה עוד לא כאן
          <br />
          <code dir="ltr">public/images/soundboard.jpg</code>
        </p>
      )}
      {resolvedPeople.map((person, i) => (
        <PersonButton key={person.id} person={person} index={i} imageUrl={imageUrl} onPress={onPress} />
      ))}
      {debug && <DebugOverlay stageRef={stageRef} />}
    </div>
  );
});
