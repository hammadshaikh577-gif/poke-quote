let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AudioCtor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return null;
    ctx = new AudioCtor();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.06,
  slideTo?: number
) {
  const c = getContext();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function noise(duration: number, volume: number) {
  const c = getContext();
  if (!c) return;
  const buffer = c.createBuffer(1, Math.floor(c.sampleRate * duration), c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const gain = c.createGain();
  gain.gain.value = volume;
  src.buffer = buffer;
  src.connect(gain).connect(c.destination);
  src.start();
}

export const sfx = {
  unlock: () => void getContext(),
  click: () => tone(660, 0, 0.05, "square", 0.04),
  wobble: () => tone(260, 0, 0.07, "square", 0.05, 200),
  open: () => {
    noise(0.2, 0.08);
    tone(330, 0, 0.28, "square", 0.06, 1320);
  },
  entrance: (notes: number[]) =>
    notes.forEach((n, i) => tone(n, i * 0.09, 0.13, "square", 0.06)),
  type: (pitch: number) => tone(pitch * (0.9 + Math.random() * 0.25), 0, 0.035, "square", 0.025),
  reveal: () =>
    [523.25, 659.25, 783.99, 1046.5].forEach((n, i) => tone(n, i * 0.08, 0.2, "triangle", 0.08)),
};

export type SoundName = Exclude<keyof typeof sfx, "unlock">;
