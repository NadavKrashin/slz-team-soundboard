# החד״ס רועש מדי – Team Soundboard

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

It is already included and every tap area is measured to match it. The app reads the image size by itself. If the file is ever missing, the
board shows simple colored placeholder buttons.

> Tip: for faster loading on phones, keep the file under ~600 KB (for example, export it
> as a JPG at quality 80, about 1200 px wide). If you replace the image with one of a different size (currently 1086 × 1448), also update
> `width`/`height` in `src/config/layout.ts`. This only prevents a jump while the image loads.

## 2. Add the recordings

Each person has a folder in **`sounds/`** at the top of the project. Put as many
recordings in it as you like:

```
sounds/
  person-01-הודי/
    hello.mp3
    laugh.mp3
    goal.m4a
  person-02-יניב/
    …
  person-12-גוש/
```

- **Any file names work.** Each tap plays a random clip from that person's folder.
  Every clip plays once before any repeats, and the same clip never plays twice in a row.
- MP3 works everywhere and is the safest choice. M4A/AAC, WAV and OGG also work.
- To add, remove or replace a clip, add or delete files in the folder. No code
  changes are needed. The next deploy picks them up.
- A single file named after the person, like `sounds/person-03.mp3`, also counts.
- A person with no recordings shows a friendly **"הקול בדרך… 🎙️"** (coming soon)
  bubble when tapped.

On GitHub, open a person's folder and use **Add file → Upload files**.

The folder numbers follow the board: left → right, top → bottom (1–3 on the top row,
10–12 on the bottom row). The name after the number is only there to help you; the
app goes by the number.

## 3. Names and colors

Everything else about the people lives in **`src/config/people.ts`**:

```ts
{ id: 1, name: 'הודי', color: '#FF7A00', row: 0, column: 0, … },
```

| Field    | What it does                                                        |
| -------- | ------------------------------------------------------------------- |
| `name`   | The person's name (read out by screen readers).                     |
| `color`  | Color of their arcade button. Used for the glow and waves.          |
| `row`, `column` | Their spot in the 3 × 4 grid (0-based).                      |

The `id` connects a person to their recordings folder: `id: 1` → `sounds/person-01-הודי/`.

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
    id: 5, name: '…', color: '#27AE60', row: 1, column: 1,
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
| `sounds/person-XX/`                 | Each person's recordings.                                                      |
| `src/config/people.ts`              | Names, colors and positions.                                                   |
| `src/config/sounds.ts`              | Finds the recordings in `sounds/` when the site is built.                      |
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

**Audio.** Each person's next clip is downloaded and decoded in the background
before it's needed, so a tap starts playback within milliseconds. Only one clip plays
at a time. Tapping someone else stops the current clip. Tapping the same person again
stops it and plays their next clip.
Nothing plays until the first tap, as browsers require. On iOS 17+ sounds play even
when the phone's silent switch is on.

**Accessibility.** Every person is a real `<button>` named after the person, so Tab
plus Enter/Space works with a keyboard and there is a visible focus ring. Screen
readers hear who is playing. `prefers-reduced-motion` turns off the bouncing and
keeps the glow. On Android, a tap gives a short vibration. iOS doesn't support the
Vibration API, and everything else still works there.
