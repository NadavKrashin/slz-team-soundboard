# הסאונדבורד – Team Soundboard

A mobile-first cartoon soundboard in Hebrew. Tap a character: their arcade button
sinks, glows and sends out sound waves, and their recording plays.

Built with React, Vite and TypeScript. Everything runs in the browser, so it can be
hosted for free on GitHub Pages.

---

## 1. Add the artwork

Put the soundboard image here:

```
public/images/soundboard.jpg
```

It is already included and every tap area is measured to match it. The app reads the image size by itself. Until the file is there, the
board shows simple colored placeholder buttons.

> Tip: for faster loading on phones, keep the file under ~600 KB (for example, export it
> as a JPG at quality 80, about 1200 px wide). If you replace the image with one of a different size (currently 1086 × 1448), also update
> `width`/`height` in `src/config/layout.ts`. This only prevents a jump while the image loads.

## 2. Add the recordings

Drop one audio file per person into `public/sounds/`:

```
public/sounds/
  person-01.mp3
  person-02.mp3
  …
  person-12.mp3
```

MP3 works everywhere and is the safest choice. M4A/AAC and WAV also work. If you use
other file names, update the `sound` field for that person (see below).

People without a file show a friendly **"הקול בדרך… 🎙️"** (coming soon) bubble
instead of playing anything.

## 3. Names, sounds and colors: one file

Everything about the people lives in **`src/config/people.ts`**:

```ts
{ id: 1, name: 'דמות 1', sound: 'sounds/person-01.mp3', color: '#FF8C00', row: 0, column: 0 },
```

| Field    | What it does                                                        |
| -------- | ------------------------------------------------------------------- |
| `name`   | The person's name (read out by screen readers, used in the bubble). |
| `sound`  | File inside `public/`. Use `null` while the recording isn't ready.  |
| `color`  | Color of their arcade button. Used for the glow and waves.          |
| `row`, `column` | Their spot in the 3 × 4 grid (0-based).                      |

To replace a recording, overwrite the file with a new one of the same name. No code
changes are needed.

## 4. Line up the tappable areas

Open the site with **`?debug`** at the end of the address, for example
`http://localhost:5173/?debug`. You'll see:

- a dashed box for each person's tappable area,
- a cyan ellipse for their arcade button (where the glow goes),
- a yellow circle for their face,
- magenta boxes for the sound-wave marks beside the face (these pulse while the person talks),
- the exact `x`/`y` percentage under your finger or mouse, in the bottom corner.

All positions are **percentages of the image**, so they stay aligned on every screen size.

- To move the whole grid, edit `GRID` in `src/config/layout.ts`. It holds the margins
  around the 3 × 4 grid, for example a title at the top of the artwork.
- To fix a single person, add overrides in `people.ts`:

  ```ts
  {
    id: 5, name: '…', sound: '…', color: '#27AE60', row: 1, column: 1,
    region: { x: 35, y: 27, w: 31, h: 24 },   // tappable box, % of the image
    button: { cx: 50, cy: 82, rx: 42, ry: 14 }, // arcade button, % of the box
    head:   { cx: 48, cy: 35, r: 22 },          // face, % of the box
  },
  ```

  You only need to include the values you want to change.

## 5. Run it locally

You need Node.js 20.19 or newer (22 recommended).

```bash
npm install
npm run dev        # opens on http://localhost:5173 (also reachable from your phone on the same Wi-Fi)
```

```bash
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## 6. Deploy to GitHub Pages

A workflow is already included (`.github/workflows/deploy.yml`). It builds and deploys
the site on every push to `main`.

One-time setup:

1. Push this project to a GitHub repository (branch `main`).
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push any commit, or run the workflow by hand from the **Actions** tab.

The site will be live at `https://<your-user>.github.io/<repository-name>/`.

All URLs in the build are relative (`base: './'` in `vite.config.ts`). The same build
therefore works under the repository sub-path, on a custom domain, and locally. There
is no client-side routing, so GitHub Pages needs no special 404 fallback.

---

## How it works

| File                                | Responsibility                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------ |
| `src/config/people.ts`              | Names, sounds, colors (the file you'll edit most).                             |
| `src/config/layout.ts`              | Image path/size, grid margins, default button/face shapes.                     |
| `src/audio/AudioController.ts`      | The single audio engine: preload, play, stop, live loudness.                   |
| `src/audio/playback.ts`             | Shares playback state with React.                                              |
| `src/components/PersonButton.tsx`   | One tappable person and their layers.                                          |
| `src/components/effects.ts`         | Press animation, vibration, reduced-motion handling.                           |
| `src/components/PersonEffects.tsx`  | Sound waves and the equalizer.                                                 |
| `src/components/Stage.tsx`          | The artwork plus all twelve people; the intro animation.                       |
| `src/styles/person.css`             | All press / glow / wave styling.                                               |

**Press animation on a flat image.** Each person's piece of the artwork is copied
into its own layer, aligned to the pixel, with soft edges. That layer is what sinks,
squashes and springs back. At rest it's hidden, so you always see the original,
untouched image.

**Audio.** All clips are downloaded and decoded in the background when the page
opens. A tap starts playback within milliseconds. Only one clip plays at a time.
Tapping someone else stops the current clip. Tapping the same person restarts theirs.
Nothing plays until the first tap, as browsers require. On iOS 17+ sounds play even
when the phone's silent switch is on.

**Accessibility.** Every person is a real `<button>` named after the person, so Tab
plus Enter/Space works with a keyboard and there is a visible focus ring. Screen
readers hear who is playing. `prefers-reduced-motion` turns off the bouncing and
keeps the glow. On Android, a tap gives a short vibration. iOS doesn't support the
Vibration API, and everything else still works there.
