// SoundSynth.ts
// ─────────────────────────────────────────────────────────────────────────────
// Zero-asset Web Audio synthesizer for tactile, physical sound effects.
// Generates high-fidelity clicks, metallic clinks, wooden thuds, and bells
// dynamically in the browser, bypassing broken paths and network requests.
// ─────────────────────────────────────────────────────────────────────────────

class SoundSynthClass {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      // Safely support older browsers or environments
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    // Resume context if suspended (common browser security constraint)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Quick metallic tick / clock gear click
   */
  playTick() {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Heavy brass/iron cog clink
   */
  playClink() {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    
    // Main metal tone
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(300, now + 0.12);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.16);
    osc2.stop(now + 0.16);
  }

  /**
   * Wooden peg/block thud with a slight organic rattle
   */
  playThud() {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.18);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);

    // Subtle friction sound
    setTimeout(() => {
      const oscF = ctx.createOscillator();
      const gainF = ctx.createGain();
      oscF.type = 'triangle';
      oscF.frequency.setValueAtTime(90, now + 0.04);
      gainF.gain.setValueAtTime(0.1, now + 0.04);
      gainF.gain.linearRampToValueAtTime(0.001, now + 0.09);
      oscF.connect(gainF);
      gainF.connect(ctx.destination);
      oscF.start(now + 0.04);
      oscF.stop(now + 0.1);
    }, 40);
  }

  /**
   * Beautiful resonant completion chime bell
   */
  playBell() {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [587.33, 783.99, 880.00, 1174.66]; // D5, G5, A5, D6 chord
    const gains: GainNode[] = [];
    const oscs: OscillatorNode[] = [];

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.16, now);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    masterGain.connect(ctx.destination);

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.4 / (i + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2 + (i * 0.1));

      osc.connect(gain);
      gain.connect(masterGain);

      oscs.push(osc);
      gains.push(gain);

      osc.start(now);
      osc.stop(now + 2.0);
    });
  }

  /**
   * Bubble pop bubble pop sounds
   */
  playPop() {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Soft sliding sound
   */
  playSlide() {
    const ctx = this.initCtx();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.25);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }
}

export const SoundSynth = new SoundSynthClass();
