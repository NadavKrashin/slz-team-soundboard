import { resolvedPeople } from '../config/layout';
import { usePlayback } from '../audio/playback';

const names = new Map(resolvedPeople.map((p) => [p.id, p.name]));

/** Screen-reader-only announcements (nothing visible on screen). */
export function Announcer() {
  const key = usePlayback((s) => `${s.activeId}|${s.phase}`);
  const [id, phase] = key.split('|');
  const name = names.get(Number(id)) ?? '';
  const message =
    phase === 'playing'
      ? `מתנגן: ${name}`
      : phase === 'missing'
        ? `${name}: הקול יגיע בקרוב`
        : phase === 'error'
          ? `לא הצלחנו לנגן את הקול של ${name}`
          : '';
  return (
    <p className="sr-only" aria-live="polite">
      {message}
    </p>
  );
}
