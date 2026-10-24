import { usePlayback } from '../audio/playback';

export function Header() {
  const playing = usePlayback((s) => s.phase === 'playing');
  return (
    <header className={`header${playing ? ' header--playing' : ''}`}>
      <span className="header__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <h1 className="header__title">הסאונדבורד</h1>
      <span className="header__bars" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </header>
  );
}
