class CozyAudioEngine {
  private ctx: AudioContext | null = null;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Cozy wood-pop sound
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.06);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn("Audio feedback issue:", e);
    }
  }

  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Magical cascading sweet chime sweep
      const notes = [587.33, 659.25, 783.99, 880.00, 1174.66]; // D5, E5, G5, A5, D6
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.07;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        
        gain.gain.setValueAtTime(0.06, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.28);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(time);
        osc.stop(time + 0.3);
      });
    } catch (e) {
      console.warn("Audio feedback issue:", e);
    }
  }

  playCoins() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Double metallic clink
      [1200, 1600].forEach((freq, idx) => {
        const time = now + idx * 0.06;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, time + 0.1);
        
        gain.gain.setValueAtTime(0.04, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
        
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(time);
        osc.stop(time + 0.15);
      });
    } catch (e) {
      console.warn("Audio feedback issue:", e);
    }
  }

  startMusic() {
    if (this.isMusicPlaying) return;
    this.isMusicPlaying = true;
    try {
      this.initCtx();
      const playMelody = () => {
        if (!this.isMusicPlaying || !this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Pentatonic lofi ambient chord loops
        const progressions = [
          [261.63, 329.63, 392.00, 523.25], // C Major
          [349.23, 440.00, 523.25, 659.25], // F Major 7
          [220.00, 329.63, 440.00, 523.25], // A Minor 7
          [293.66, 392.00, 493.88, 587.33]  // G Major
        ];
        
        const chord = progressions[Math.floor(Math.random() * progressions.length)];
        
        chord.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.2);
          
          // Slow attack and decay swell
          gain.gain.setValueAtTime(0.0, now + idx * 0.2);
          gain.gain.linearRampToValueAtTime(0.015, now + idx * 0.2 + 1.8);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.2 + 4.5);
          
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          
          osc.start(now + idx * 0.2);
          osc.stop(now + idx * 0.2 + 5.0);
        });
      };
      
      playMelody();
      this.musicInterval = setInterval(playMelody, 6500);
    } catch (e) {
      console.warn("Audio jukebox issue:", e);
    }
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
  
  getIsMusicPlaying() {
    return this.isMusicPlaying;
  }

  private playWav(path: string) {
    try {
      this.initCtx();
      const audio = new Audio(path);
      audio.volume = 0.35;
      audio.play().catch(e => console.warn("Audio playback blocked:", e));
    } catch (e) {
      console.warn("Audio playback issue:", e);
    }
  }

  playBirdSound() {
    this.playWav('/sounds/birds.wav');
  }

  playTheatreClapAndAha() {
    this.playWav('/sounds/theatre.wav');
  }

  playRailwayStationSound() {
    this.playWav('/sounds/railway.wav');
  }

  playTradeEconomySound() {
    this.playWav('/sounds/trade.wav');
  }

  playGossipCornerSound() {
    this.playWav('/sounds/gossip.wav');
  }
}

export const cozyAudio = new CozyAudioEngine();
