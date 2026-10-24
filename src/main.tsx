import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/rubik/hebrew-500.css';
import '@fontsource/rubik/latin-500.css';
import '@fontsource/rubik/hebrew-800.css';
import '@fontsource/rubik/latin-800.css';
import './styles/base.css';
import './styles/stage.css';
import './styles/person.css';
import { audio } from './audio/playback';
import App from './App';

// Browsers only allow audio after a user gesture – unlock on the first one.
for (const type of ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown']) {
  document.addEventListener(type, audio.unlock, { capture: true, passive: true });
}
// Don't keep talking from a background tab.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) audio.stop();
});
// Download + decode all clips once the page is up, so taps are instant.
if (document.readyState === 'complete') audio.preloadAll();
else addEventListener('load', () => audio.preloadAll(), { once: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
