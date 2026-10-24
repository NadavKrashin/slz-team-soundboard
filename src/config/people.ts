/**
 * ⭐ The one file to edit for names, sounds and colors. ⭐
 *
 * - name:  shown to screen readers and in the small "coming soon" bubble.
 * - sound: a file inside `public/sounds/` (MP3, M4A, WAV, OGG…).
 *          Set to `null` while the recording isn't ready yet – tapping the
 *          person will show a friendly "coming soon" bubble.
 * - color: the color of this person's arcade button (used for the glow).
 *
 * Positions – already measured from `public/images/soundboard.jpg`.
 * Only touch these if you change the artwork (open the site with `?debug`
 * at the end of the address to see every area):
 * - region: { x, y, w, h }     tappable rectangle, in % of the whole image.
 * - button: { cx, cy, rx, ry } the arcade button (whole puck), in % of the region.
 * - head:   { cx, cy, r }      the face, in % of the region.
 * - waves:  { lx, ly, rx, ry, size } centers of the left/right sound-wave
 *           marks next to the face, in % of the region (size = % of width).
 * Anything left out is calculated automatically from the grid in `layout.ts`.
 */
import type { PersonConfig } from './types';

export const people: PersonConfig[] = [
  // ── Row 1 ────────────────────────────────────────────────
  {
    id: 1,
    name: 'דמות 1',
    sound: 'sounds/person-01.mp3',
    color: '#FF7A00',
    row: 0,
    column: 0,
    region: { x: 0.9, y: 3.1, w: 32.7, h: 24.9 },
    button: { cx: 51.8, cy: 91.9, rx: 41.1, ry: 12.2 },
    head: { cx: 62.5, cy: 33.3, r: 23.1 },
    waves: { lx: 27.6, ly: 42.5, rx: 87.9, ry: 50.0, size: 20 },
  },
  {
    id: 2,
    name: 'דמות 2',
    sound: 'sounds/person-02.mp3',
    color: '#1F6BFF',
    row: 0,
    column: 1,
    region: { x: 33.6, y: 3.1, w: 32.5, h: 24.9 },
    button: { cx: 50.4, cy: 91.4, rx: 40.5, ry: 12.8 },
    head: { cx: 51.0, cy: 44.4, r: 23.2 },
    waves: { lx: 17.8, ly: 50.8, rx: 82.2, ry: 50.8, size: 20 },
  },
  {
    id: 3,
    name: 'דמות 3',
    sound: 'sounds/person-03.mp3',
    color: '#FF2A2A',
    row: 0,
    column: 2,
    region: { x: 66.1, y: 3.1, w: 33.0, h: 24.9 },
    button: { cx: 48.7, cy: 92.1, rx: 41.2, ry: 12.1 },
    head: { cx: 43.0, cy: 37.5, r: 22.3 },
    waves: { lx: 13.1, ly: 48.1, rx: 73.2, ry: 45.8, size: 20 },
  },
  // ── Row 2 ────────────────────────────────────────────────
  {
    id: 4,
    name: 'דמות 4',
    sound: 'sounds/person-04.mp3',
    color: '#FFD000',
    row: 1,
    column: 0,
    region: { x: 0.9, y: 28.0, w: 32.7, h: 20.7 },
    button: { cx: 53.5, cy: 93.0, rx: 43.7, ry: 15.3 },
    head: { cx: 57.7, cy: 35.0, r: 23.9 },
    waves: { lx: 18.3, ly: 33.3, rx: 94.4, ry: 43.3, size: 20 },
  },
  {
    id: 5,
    name: 'דמות 5',
    sound: 'sounds/person-05.mp3',
    color: '#22D140',
    row: 1,
    column: 1,
    region: { x: 33.6, y: 28.0, w: 32.5, h: 21.4 },
    button: { cx: 49.6, cy: 89.7, rx: 43.1, ry: 15.2 },
    head: { cx: 51.0, cy: 29.0, r: 24.1 },
    waves: { lx: 15.0, ly: 35.5, rx: 79.6, ry: 42.6, size: 20 },
  },
  {
    id: 6,
    name: 'דמות 6',
    sound: 'sounds/person-06.mp3',
    color: '#FF2D95',
    row: 1,
    column: 2,
    region: { x: 66.1, y: 28.0, w: 33.0, h: 21.1 },
    button: { cx: 46.6, cy: 91.1, rx: 42.5, ry: 15.4 },
    head: { cx: 46.6, cy: 29.5, r: 22.9 },
    waves: { lx: 11.5, ly: 40.0, rx: 80.7, ry: 47.5, size: 20 },
  },
  // ── Row 3 ────────────────────────────────────────────────
  {
    id: 7,
    name: 'דמות 7',
    sound: 'sounds/person-07.mp3',
    color: '#8B3DFF',
    row: 2,
    column: 0,
    region: { x: 0.9, y: 48.7, w: 32.7, h: 22.1 },
    button: { cx: 47.6, cy: 89.8, rx: 44.8, ry: 15.5 },
    head: { cx: 54.9, cy: 32.8, r: 23.9 },
    waves: { lx: 18.3, ly: 33.4, rx: 86.8, ry: 45.9, size: 20 },
  },
  {
    id: 8,
    name: 'דמות 8',
    sound: 'sounds/person-08.mp3',
    color: '#1EA7FF',
    row: 2,
    column: 1,
    region: { x: 33.6, y: 49.4, w: 32.5, h: 21.4 },
    button: { cx: 50.7, cy: 86.8, rx: 42.8, ry: 18.1 },
    head: { cx: 51.0, cy: 33.2, r: 21.2 },
    waves: { lx: 20.4, ly: 42.6, rx: 80.5, ry: 41.9, size: 20 },
  },
  {
    id: 9,
    name: 'דמות 9',
    sound: 'sounds/person-09.mp3',
    color: '#1FCB4A',
    row: 2,
    column: 2,
    region: { x: 66.1, y: 49.0, w: 33.0, h: 22.4 },
    button: { cx: 54.2, cy: 86.6, rx: 43.6, ry: 16.5 },
    head: { cx: 45.8, cy: 33.2, r: 23.7 },
    waves: { lx: 17.9, ly: 42.2, rx: 81.6, ry: 31.4, size: 20 },
  },
  // ── Row 4 ────────────────────────────────────────────────
  {
    id: 10,
    name: 'דמות 10',
    sound: 'sounds/person-10.mp3',
    color: '#FF2233',
    row: 3,
    column: 0,
    region: { x: 0.9, y: 70.8, w: 32.7, h: 26.9 },
    button: { cx: 48.2, cy: 80.8, rx: 45.4, ry: 14.6 },
    head: { cx: 49.9, cy: 36.7, r: 23.9 },
    waves: { lx: 14.1, ly: 32.6, rx: 83.9, ry: 38.5, size: 20 },
  },
  {
    id: 11,
    name: 'דמות 11',
    sound: 'sounds/person-11.mp3',
    color: '#FFD000',
    row: 3,
    column: 1,
    region: { x: 33.6, y: 70.8, w: 32.5, h: 26.9 },
    button: { cx: 49.6, cy: 81.2, rx: 45.9, ry: 15.0 },
    head: { cx: 51.0, cy: 33.3, r: 23.2 },
    waves: { lx: 14.7, ly: 37.2, rx: 82.7, ry: 37.7, size: 20 },
  },
  {
    id: 12,
    name: 'דמות 12',
    sound: 'sounds/person-12.mp3',
    color: '#A24BFF',
    row: 3,
    column: 2,
    region: { x: 66.1, y: 71.5, w: 33.0, h: 26.2 },
    button: { cx: 50.6, cy: 80.7, rx: 44.4, ry: 15.4 },
    head: { cx: 48.0, cy: 32.9, r: 23.7 },
    waves: { lx: 12.3, ly: 35.5, rx: 86.3, ry: 35.5, size: 20 },
  },
];
