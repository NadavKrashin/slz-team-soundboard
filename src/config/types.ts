/** A rectangle in percent (0–100) of the full soundboard image. */
export interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** The arcade button ellipse, in percent of the person's region. */
export interface ButtonShape {
  /** Center, % of region width. */
  cx: number;
  /** Center, % of region height. */
  cy: number;
  /** Horizontal radius, % of region width. */
  rx: number;
  /** Vertical radius, % of region height. */
  ry: number;
}

/** The face, in percent of the person's region. */
export interface HeadShape {
  /** Center, % of region width. */
  cx: number;
  /** Center, % of region height. */
  cy: number;
  /** Radius, % of region width. */
  r: number;
}

export interface PersonConfig {
  id: number;
  name: string;
  /** Path relative to `public/`, e.g. "sounds/person-01.mp3". `null` = coming soon. */
  sound: string | null;
  color: string;
  row: number;
  column: number;
  region?: Partial<Region>;
  button?: Partial<ButtonShape>;
  head?: Partial<HeadShape>;
}

export interface Person extends PersonConfig {
  region: Region;
  button: ButtonShape;
  head: HeadShape;
  /** Fully resolved URL (respects the GitHub Pages sub-path). */
  soundUrl: string | null;
}
