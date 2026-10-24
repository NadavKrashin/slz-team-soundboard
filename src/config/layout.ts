/**
 * Where everyone sits on the image.
 *
 * All numbers are percentages, so the tappable areas stay glued to the
 * artwork at every screen size. Open the site with `?debug` to see them.
 */
import { people } from './people';
import type { ButtonShape, HeadShape, Person, Region } from './types';

export const IMAGE = {
  /** Relative to `public/`. */
  src: 'images/soundboard.jpg',
  /**
   * The image's pixel size. Only used to reserve space before the image
   * loads (the real size is read from the file once it arrives).
   */
  width: 1024,
  height: 1536,
};

/** The 3 × 4 grid of characters, as % margins of the image. */
export const GRID = {
  columns: 3,
  rows: 4,
  /** Empty space above the first row (e.g. a title in the artwork). */
  top: 3,
  bottom: 2,
  left: 2,
  right: 2,
};

/** Default shapes inside every grid cell, used unless a person overrides them. */
const DEFAULT_BUTTON: ButtonShape = { cx: 50, cy: 80, rx: 40, ry: 15 };
const DEFAULT_HEAD: HeadShape = { cx: 50, cy: 36, r: 24 };

const withBase = (path: string) => import.meta.env.BASE_URL + path.replace(/^\/+/, '');

/**
 * Absolute URL: it is also used inside CSS (`url()`), where a relative path
 * would resolve against the stylesheet folder instead of the page.
 */
export const imageUrl = new URL(withBase(IMAGE.src), document.baseURI).href;

function gridRegion(row: number, column: number): Region {
  const w = (100 - GRID.left - GRID.right) / GRID.columns;
  const h = (100 - GRID.top - GRID.bottom) / GRID.rows;
  return { x: GRID.left + column * w, y: GRID.top + row * h, w, h };
}

export const resolvedPeople: Person[] = people.map((p) => ({
  ...p,
  region: { ...gridRegion(p.row, p.column), ...p.region },
  button: { ...DEFAULT_BUTTON, ...p.button },
  head: { ...DEFAULT_HEAD, ...p.head },
  soundUrl: p.sound ? withBase(p.sound) : null,
}));
