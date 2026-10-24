/**
 * One audio controller for the whole app.
 *
 * - Uses the Web Audio API: every clip is fetched + decoded up front, so a
 *   tap starts playback within a few milliseconds (no <audio> start-up lag).
 * - Only one clip plays at a time. Every `play()` gets a token; anything that
 *   finishes loading for an older token is ignored, so rapid taps can never
 *   race each other.
 * - Exposes a tiny subscribe/getState store for React (useSyncExternalStore).
 */

export type Phase = 'idle' | 'loading' | 'playing' | 'missing' | 'error';

export interface PlaybackState {
  activeId: number | null;
  phase: Phase;
  /** Increments on every tap, so re-tapping the same person is a new event. */
  nonce: number;
}

type LoadResult = AudioBuffer | 'missing' | 'error';

const NOTICE_MS = 1800;
/** Equalizer bands as FFT bin ranges (≈170 Hz per bin) + a boost for quieter highs. */
const BANDS = [
  { from: 1, to: 3, gain: 1 },
  { from: 3, to: 7, gain: 1.15 },
  { from: 7, to: 14, gain: 1.5 },
  { from: 14, to: 30, gain: 2.2 },
];

type AudioContextCtor = typeof AudioContext;

export class AudioController {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private readonly cache = new Map<number, Promise<LoadResult>>();
  private readonly listeners = new Set<() => void>();
  private state: PlaybackState = { activeId: null, phase: 'idle', nonce: 0 };
  private token = 0;
  private noticeTimer: ReturnType<typeof setTimeout> | undefined;
  private freq: Uint8Array<ArrayBuffer> | null = null;
  private readonly sounds: ReadonlyMap<number, string | null>;

  constructor(sounds: ReadonlyMap<number, string | null>) {
    this.sounds = sounds;
    // iOS 17+: play through the silent switch, like a media app.
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) {
      try {
        session.type = 'playback';
      } catch {
        /* not supported – fine */
      }
    }
  }

  // ── store ─────────────────────────────────────────────────

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getState = () => this.state;

  private set(next: Omit<PlaybackState, 'nonce'>, bump = false) {
    this.state = { ...next, nonce: this.state.nonce + (bump ? 1 : 0) };
    this.listeners.forEach((l) => l());
  }

  // ── audio graph ───────────────────────────────────────────

  private context(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctor: AudioContextCtor | undefined =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: AudioContextCtor }).webkitAudioContext;
    if (!Ctor) return null;
    const ctx = new Ctor({ latencyHint: 'interactive' });
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.6;
    analyser.connect(ctx.destination);
    this.ctx = ctx;
    this.analyser = analyser;
    this.freq = new Uint8Array(analyser.frequencyBinCount);
    return ctx;
  }

  /**
   * Must run inside a user gesture (tap / click / key). Browsers keep audio
   * locked until then; calling this on several gesture events covers iOS
   * versions that only count touchend as a "real" gesture.
   */
  unlock = () => {
    const ctx = this.context();
    if (ctx && ctx.state !== 'running') {
      ctx.resume().catch(() => {});
      // Playing a 1-sample silent buffer is the classic iOS unlock.
      const silent = ctx.createBufferSource();
      silent.buffer = ctx.createBuffer(1, 1, 22050);
      silent.connect(ctx.destination);
      silent.start(0);
    }
  };

  // ── loading ───────────────────────────────────────────────

  private load(id: number): Promise<LoadResult> {
    const cached = this.cache.get(id);
    if (cached) return cached;
    const url = this.sounds.get(id);
    const ctx = this.context();
    let promise: Promise<LoadResult>;
    if (!url) {
      promise = Promise.resolve('missing');
    } else if (!ctx) {
      promise = Promise.resolve('error');
    } else {
      promise = fetch(url)
        .then(async (res): Promise<LoadResult> => {
          // A missing file can come back as a 404, or as the site's HTML page.
          const type = res.headers.get('content-type') ?? '';
          if (!res.ok || type.startsWith('text/')) return 'missing';
          const data = await res.arrayBuffer();
          if (data.byteLength === 0) return 'missing';
          return new Promise<LoadResult>((resolve) =>
            // Callback form: works on every Safari version.
            ctx.decodeAudioData(data, resolve, () => resolve('error')),
          );
        })
        .catch((): LoadResult => 'error');
      // Allow a retry later if it was a network/decoding hiccup.
      promise.then((r) => r === 'error' && this.cache.delete(id));
    }
    this.cache.set(id, promise);
    return promise;
  }

  /** Fetch + decode every clip in the background so taps are instant. */
  preloadAll() {
    for (const id of this.sounds.keys()) this.load(id);
  }

  // ── playback ──────────────────────────────────────────────

  play(id: number) {
    this.unlock();
    const token = ++this.token;
    this.stopSource();
    clearTimeout(this.noticeTimer);
    this.set({ activeId: id, phase: 'loading' }, true);

    this.load(id).then((result) => {
      if (token !== this.token) return; // a newer tap won
      if (result === 'missing' || result === 'error') {
        this.set({ activeId: id, phase: result });
        this.noticeTimer = setTimeout(() => {
          if (token === this.token) this.set({ activeId: null, phase: 'idle' });
        }, NOTICE_MS);
        return;
      }
      this.start(result, id, token);
    });
  }

  private start(buffer: AudioBuffer, id: number, token: number) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(this.analyser!);
    src.onended = () => {
      if (this.source !== src) return; // stopped because something else started
      this.source = null;
      if (token === this.token) this.set({ activeId: null, phase: 'idle' });
    };
    this.source = src;
    src.start();
    this.set({ activeId: id, phase: 'playing' });
  }

  private stopSource() {
    const src = this.source;
    if (!src) return;
    this.source = null;
    try {
      src.stop();
    } catch {
      /* already stopped */
    }
    src.disconnect();
  }

  stop() {
    this.token++;
    this.stopSource();
    clearTimeout(this.noticeTimer);
    this.set({ activeId: null, phase: 'idle' });
  }

  /**
   * Live loudness for audio-reactive visuals: overall level + 4 bands, 0–1.
   * Writes into `out` (length 5) to avoid allocating every frame.
   */
  readLevels(out: Float32Array) {
    const analyser = this.analyser;
    const freq = this.freq;
    if (!analyser || !freq || !this.source) {
      out.fill(0);
      return out;
    }
    analyser.getByteFrequencyData(freq);
    let total = 0;
    BANDS.forEach(({ from, to, gain }, b) => {
      let sum = 0;
      for (let i = from; i < to; i++) sum += freq[i];
      const v = Math.min(1, (sum / (to - from) / 255) * gain);
      out[b + 1] = v;
      total += v;
    });
    out[0] = Math.min(1, (total / BANDS.length) * 1.6);
    return out;
  }
}
