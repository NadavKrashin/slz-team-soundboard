/**
 * ⭐ The one file to edit for names, sounds and colors. ⭐
 *
 * - name:  shown to screen readers and in the small "coming soon" bubble.
 * - sound: a file inside `public/sounds/` (MP3, M4A, WAV, OGG…).
 *          Set to `null` while the recording isn't ready yet – tapping the
 *          person will show a friendly "coming soon" bubble.
 * - color: the color of this person's arcade button (used for the glow).
 *
 * Optional – only if the tappable area doesn't line up with the artwork
 * (open the site with `?debug` at the end of the address to see the areas):
 * - region: { x, y, w, h }   tappable rectangle, in % of the whole image.
 * - button: { cx, cy, rx, ry } the arcade button ellipse, in % of the region.
 * - head:   { cx, cy, r }      the face, in % of the region (for sound waves).
 * Anything left out is calculated automatically from the grid in `layout.ts`.
 */
import type { PersonConfig } from './types';

export const people: PersonConfig[] = [
  // ── Row 1 ────────────────────────────────────────────────
  { id: 1, name: 'דמות 1', sound: 'sounds/person-01.mp3', color: '#FF8C00', row: 0, column: 0 },
  { id: 2, name: 'דמות 2', sound: 'sounds/person-02.mp3', color: '#2F80ED', row: 0, column: 1 },
  { id: 3, name: 'דמות 3', sound: 'sounds/person-03.mp3', color: '#EB3B3B', row: 0, column: 2 },
  // ── Row 2 ────────────────────────────────────────────────
  { id: 4, name: 'דמות 4', sound: 'sounds/person-04.mp3', color: '#FFC300', row: 1, column: 0 },
  { id: 5, name: 'דמות 5', sound: 'sounds/person-05.mp3', color: '#27AE60', row: 1, column: 1 },
  { id: 6, name: 'דמות 6', sound: 'sounds/person-06.mp3', color: '#FF5FA2', row: 1, column: 2 },
  // ── Row 3 ────────────────────────────────────────────────
  { id: 7, name: 'דמות 7', sound: 'sounds/person-07.mp3', color: '#9B51E0', row: 2, column: 0 },
  { id: 8, name: 'דמות 8', sound: 'sounds/person-08.mp3', color: '#17C3D6', row: 2, column: 1 },
  { id: 9, name: 'דמות 9', sound: 'sounds/person-09.mp3', color: '#3DDC5A', row: 2, column: 2 },
  // ── Row 4 ────────────────────────────────────────────────
  { id: 10, name: 'דמות 10', sound: 'sounds/person-10.mp3', color: '#FF4040', row: 3, column: 0 },
  { id: 11, name: 'דמות 11', sound: 'sounds/person-11.mp3', color: '#FFD60A', row: 3, column: 1 },
  { id: 12, name: 'דמות 12', sound: 'sounds/person-12.mp3', color: '#A855F7', row: 3, column: 2 },
];
