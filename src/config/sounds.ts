/**
 * Finds every recording in the top-level `sounds/` folder at build time.
 *
 * A file belongs to a person when its folder or file name contains
 * `person-<number>`, e.g.:
 *   sounds/person-01/hello.mp3
 *   sounds/person-01/laugh.m4a
 *   sounds/person-7-goal.mp3
 * Add, remove or rename files and the next build picks them up – no code changes.
 */
const files = import.meta.glob('/sounds/**/*.{mp3,MP3,m4a,M4A,aac,wav,ogg,opus,webm}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

export function soundsFor(id: number): string[] {
  const owner = new RegExp(`person-0*${id}(?!\\d)`, 'i');
  return Object.keys(files)
    .filter((path) => owner.test(path))
    .sort()
    .map((path) => files[path]);
}
