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

  /** Howling wind, a low drone, and random creaks. Loops until stopAmbient(). */
  startAmbient(): void {
    if (this.ambient) return;
    const ctx = this.ctx;
    const out = ctx.createGain();
    out.gain.setValueAtTime(0, ctx.currentTime);
    out.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 3);
    out.connect(this.master);

    // Wind: brown noise through a band-pass whose frequency slowly wanders.
    const wind = ctx.createBufferSource();
    wind.buffer = this.noiseBuffer(6, true);
    wind.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 420;
    bp.Q.value = 2.5;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;
    lfo.connect(lfoGain).connect(bp.frequency);
    const windGain = ctx.createGain();
    windGain.gain.value = 1.6;
    wind.connect(bp).connect(windGain).connect(out);

    // Drone: two detuned low tones that beat against each other.
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.22;
    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 180;
    const oscs = [55, 55.7, 82.4].map((f) => {
      const o = ctx.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = f;
      o.connect(lp);
      return o;
    });
    lp.connect(droneGain).connect(out);

    wind.start();
    lfo.start();
    oscs.forEach((o) => o.start());

    let creakTimer = 0;
    const scheduleCreak = () => {
      creakTimer = window.setTimeout(() => {
        this.creak(out);
        scheduleCreak();
      }, 8000 + Math.random() * 12000);
    };
    scheduleCreak();

    this.ambient = {
      stop: () => {
        window.clearTimeout(creakTimer);
        const t = ctx.currentTime;
        out.gain.cancelScheduledValues(t);
        out.gain.setValueAtTime(out.gain.value, t);
        out.gain.linearRampToValueAtTime(0, t + 0.6);
        window.setTimeout(() => {
          [wind, lfo, ...oscs].forEach((n) => n.stop());
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
}

let instance: HalloweenAudio | null = null;

/** One shared engine; null on the server or in browsers without Web Audio. */
export function getHalloweenAudio(): HalloweenAudio | null {
  if (typeof window === "undefined" || typeof AudioContext === "undefined") return null;
  instance ??= new HalloweenAudio();
  return instance;
}
