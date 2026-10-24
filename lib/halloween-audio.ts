/**
 * Scary sounds made live with the Web Audio API: no audio files to download
 * or license. Browsers only allow sound after the visitor clicks something,
 * so call unlock() from a click handler first.
 */
export class HalloweenAudio {
  private ctx: AudioContext;
  private master: GainNode;
  private ambient: { stop: () => void } | null = null;
  private muted = false;

  constructor() {
    this.ctx = new AudioContext();
    this.master = this.ctx.createGain();
    this.master.gain.value = 1;
    this.master.connect(this.ctx.destination);
  }

  async unlock(): Promise<void> {
    if (this.ctx.state !== "running") await this.ctx.resume().catch(() => {});
  }

  setMuted(m: boolean): void {
    this.muted = m;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.linearRampToValueAtTime(m ? 0 : 1, t + 0.25);
  }

  private noiseBuffer(seconds: number, brown = false): AudioBuffer {
    const len = Math.floor(this.ctx.sampleRate * seconds);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      } else d[i] = w;
    }
    return buf;
  }

  /** A long, dark reverb, like an empty nursery at night. */
  private reverb(seconds: number): ConvolverNode {
    const ctx = this.ctx;
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    return conv;
  }

  /** One plucked music-box tine: a bright bell tone with metallic overtones. */
  private musicBoxNote(dest: AudioNode, freq: number, t: number, detuneCents: number): void {
    const ctx = this.ctx;
    const partials: [number, number, number][] = [
      [1, 0.5, 1.6],
      [2.0, 0.12, 0.9],
      [3.01, 0.08, 0.5],
      [5.43, 0.05, 0.25],
    ];
    for (const [mult, amp, decay] of partials) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq * mult;
      o.detune.value = detuneCents;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
      o.connect(g).connect(dest);
      o.start(t);
      o.stop(t + decay + 0.05);
    }
  }

  /** A child-like "ooh" voice: soft, breathy, high, with a wobble. */
  private childVoice(dest: AudioNode, freq: number, t: number, dur: number): void {
    const ctx = this.ctx;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.12);
    g.gain.setValueAtTime(0.16, t + dur * 0.7);
    g.gain.linearRampToValueAtTime(0.0001, t + dur);
    // Two formant filters shape a sawtooth into a sung "ooh".
    const f1 = ctx.createBiquadFilter();
    f1.type = "bandpass";
    f1.frequency.value = 450;
    f1.Q.value = 6;
    const f2 = ctx.createBiquadFilter();
    f2.type = "bandpass";
    f2.frequency.value = 1100;
    f2.Q.value = 8;
    const mix = ctx.createGain();
    mix.gain.value = 1.8;
    f1.connect(mix);
    f2.connect(mix);
    mix.connect(g).connect(dest);
    const vib = ctx.createOscillator();
    vib.frequency.value = 5 + Math.random();
    const vg = ctx.createGain();
    vg.gain.value = freq * 0.012;
    vib.connect(vg);
    // Three slightly out-of-tune children singing together.
    for (const cents of [-14, 3, 17]) {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.detune.value = cents;
      vg.connect(o.frequency);
      o.connect(f1);
      o.connect(f2);
      o.start(t);
      o.stop(t + dur + 0.05);
    }
    vib.start(t);
    vib.stop(t + dur + 0.05);
  }

  /**
   * A slow, out-of-tune music box playing "Twinkle, Twinkle" in a minor key,
   * with children humming along, soft wind, and the odd creak. Loops until
   * stopAmbient().
   */
  startAmbient(): void {
    if (this.ambient) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, ctx.currentTime);
    out.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2);
    out.connect(this.master);

    const verb = this.reverb(3.5);
    const wet = ctx.createGain();
    wet.gain.value = 0.55;
    verb.connect(wet).connect(out);
    const dry = ctx.createGain();
    dry.gain.value = 0.6;
    dry.connect(out);
    const bus = ctx.createGain();
    bus.connect(dry);
    bus.connect(verb);

    // Faint wind underneath.
    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer(6, true);
    wind.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 380;
    bp.Q.value = 2;
    const windGain = ctx.createGain();
    windGain.gain.value = 0.35;
    wind.connect(bp).connect(windGain).connect(out);
    wind.start();

    // A minor: A4 = 440. Melody as [semitones from A4, beats].
    const A4 = 440;
    const N = (st: number) => A4 * Math.pow(2, st / 12);
    const phraseA: [number, number][] = [[0, 1], [0, 1], [7, 1], [7, 1], [8, 1], [8, 1], [7, 2], [5, 1], [5, 1], [3, 1], [3, 1], [2, 1], [2, 1], [0, 2]];
    const phraseB: [number, number][] = [[7, 1], [7, 1], [5, 1], [5, 1], [3, 1], [3, 1], [2, 2], [7, 1], [7, 1], [5, 1], [5, 1], [3, 1], [3, 1], [2, 2]];
    const song = [...phraseA, ...phraseB, ...phraseA];
    const beat = 0.72;

    let loop = 0;
    let timer = 0;
    const playSong = () => {
      const start = ctx.currentTime + 0.1;
      let t = start;
      // The music box winds down a little more each time round.
      const drag = 1 + Math.min(loop, 4) * 0.035;
      const withVoices = loop % 2 === 1;
      for (const [st, beats] of song) {
        const dur = beats * beat * drag;
        // An old music box: each note a little out of tune.
        this.musicBoxNote(bus, N(st), t, (Math.random() - 0.5) * 30 - loop * 4);
        // Low accompaniment on the long notes.
        if (beats === 2) this.musicBoxNote(bus, N(st - 12), t, (Math.random() - 0.5) * 20);
        if (withVoices) this.childVoice(bus, N(st), t, dur * 0.95);
        t += dur;
      }
      loop++;
      if (Math.random() < 0.7) window.setTimeout(() => this.creak(out), (t - start) * 500);
      // A pause of silence, then it starts again.
      timer = window.setTimeout(playSong, (t - start + 2.5) * 1000);
    };
    playSong();

    this.ambient = {
      stop: () => {
        window.clearTimeout(timer);
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(out.gain.value, t);
        out.gain.linearRampToValueAtTime(0, t + 0.6);
        window.setTimeout(() => {
          wind.stop();
          out.disconnect();
        }, 700);
      },
    };
  }

  stopAmbient(): void {
    this.ambient?.stop();
    this.ambient = null;
  }

  /** An old door or floorboard creaking somewhere in the dark. */
  private creak(dest: AudioNode): void {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createOscillator();
    src.type = "sawtooth";
    const base = 90 + Math.random() * 60;
    src.frequency.setValueAtTime(base, t);
    src.frequency.linearRampToValueAtTime(base * 1.6, t + 0.6);
    src.frequency.linearRampToValueAtTime(base * 0.9, t + 1.3);
    // Rapid amplitude stutter is what makes it sound like wood.
    const stutter = ctx.createOscillator();
    stutter.type = "square";
    stutter.frequency.value = 28 + Math.random() * 14;
    const stutterGain = ctx.createGain();
    stutterGain.gain.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.35, t + 0.15);
    g.gain.linearRampToValueAtTime(0, t + 1.4);
    stutter.connect(stutterGain).connect(g.gain);
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 900;
    bp.Q.value = 6;
    src.connect(bp).connect(g).connect(dest);
    src.start(t);
    stutter.start(t);
    src.stop(t + 1.5);
    stutter.stop(t + 1.5);
  }

  /** The jumpscare scream: shrieking detuned voices plus a noise blast. */
  scream(): void {
    if (this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime + 0.01;
    const end = t + 1.15;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.ratio.value = 8;
    comp.connect(this.master);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.6, t + 0.04);
    g.gain.setValueAtTime(0.6, t + 0.5);
    g.gain.exponentialRampToValueAtTime(0.001, end);
    g.connect(comp);

    const vib = ctx.createOscillator();
    vib.frequency.value = 9;
    const vibGain = ctx.createGain();
    vibGain.gain.value = 60;
    vib.connect(vibGain);

    const voices = [0, 17, -23].map((detune) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.detune.value = detune;
      o.frequency.setValueAtTime(900, t);
      o.frequency.exponentialRampToValueAtTime(1600, t + 0.25);
      o.frequency.exponentialRampToValueAtTime(700, end);
      vibGain.connect(o.frequency);
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 2200;
      f.Q.value = 1.2;
      o.connect(f).connect(g);
      return o;
    });

    const noise = ctx.createBufferSource();
    noise.buffer = this.noiseBuffer(1.2);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.5, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    noise.connect(ng).connect(comp);

    vib.start(t);
    voices.forEach((o) => o.start(t));
    noise.start(t);
    [vib, ...voices].forEach((o) => o.stop(end + 0.05));
    window.setTimeout(() => comp.disconnect(), (end - ctx.currentTime + 0.2) * 1000);
  }

  /** A deep hit, for clicking the pumpkin. */
  sting(): void {
    if (this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(38, t + 0.6);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.7, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    o.connect(g).connect(this.master);
    const n = ctx.createBufferSource();
    n.buffer = this.noiseBuffer(0.3);
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.25, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    n.connect(ng).connect(this.master);
    o.start(t);
    n.start(t);
    o.stop(t + 1.3);
  }

  /** Short noise burst through a filter; the building block for the click sounds. */
  private burst(opts: {
    seconds: number;
    type: BiquadFilterType;
    from: number;
    to: number;
    q: number;
    gain: number;
    attack?: number;
  }): void {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(opts.seconds + 0.05);
    const f = ctx.createBiquadFilter();
    f.type = opts.type;
    f.Q.value = opts.q;
    f.frequency.setValueAtTime(opts.from, t);
    f.frequency.exponentialRampToValueAtTime(opts.to, t + opts.seconds);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(opts.gain, t + (opts.attack ?? 0.01));
    g.gain.exponentialRampToValueAtTime(0.0001, t + opts.seconds);
    src.connect(f).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + opts.seconds + 0.05);
  }

  /** A ghostly moan sliding down, with breath. */
  moan(): void {
    if (this.muted) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const end = t + 1.4;
    const o = ctx.createOscillator();
    o.type = "triangle";
    o.frequency.setValueAtTime(420, t);
    o.frequency.linearRampToValueAtTime(520, t + 0.3);
    o.frequency.exponentialRampToValueAtTime(180, end);
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.5;
    const vg = ctx.createGain();
    vg.gain.value = 14;
    vib.connect(vg).connect(o.frequency);
    // Vowel-like resonance ("ooo").
    const f = ctx.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 600;
    f.Q.value = 5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, end);
    o.connect(f).connect(g).connect(this.master);
    o.start(t);
    vib.start(t);
    o.stop(end + 0.05);
    vib.stop(end + 0.05);
    this.burst({ seconds: 1.2, type: "bandpass", from: 900, to: 400, q: 2, gain: 0.12, attack: 0.3 });
  }

  /** A sharp hiss, like something in the dark noticed you. */
  hiss(): void {
    if (this.muted) return;
    this.burst({ seconds: 0.7, type: "highpass", from: 3000, to: 5000, q: 0.8, gain: 0.35, attack: 0.04 });
  }
}

let instance: HalloweenAudio | null = null;

/** One shared engine; null on the server or in browsers without Web Audio. */
export function getHalloweenAudio(): HalloweenAudio | null {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
  instance ??= new HalloweenAudio();
  return instance;
}
