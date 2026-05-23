// Procedural UI sound effects using the Web Audio API.
// No external audio assets — everything is synthesized live from oscillators
// and gain envelopes. The AudioContext is lazily created on the first user
// gesture (browsers block auto-created contexts otherwise).

let ctx = null;
let masterGain = null;
let enabled = true;

try {
  enabled = (localStorage.getItem("geoAtlas.sfx") ?? "1") !== "0";
} catch {}

export function setSfxEnabled(on) {
  enabled = !!on;
  try { localStorage.setItem("geoAtlas.sfx", on ? "1" : "0"); } catch {}
}
export function isSfxEnabled() { return enabled; }

function ensureCtx() {
  if (ctx) return ctx;
  const Ctor = window.AudioContext || window.webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  masterGain = ctx.createGain();
  masterGain.gain.value = 0.35;
  masterGain.connect(ctx.destination);
  return ctx;
}

// One-time unlock on the very first user gesture — fixes Safari/iOS auto-play.
function unlock() {
  const c = ensureCtx();
  if (c && c.state === "suspended") c.resume();
  window.removeEventListener("pointerdown", unlock);
  window.removeEventListener("keydown", unlock);
}
window.addEventListener("pointerdown", unlock, { once: true });
window.addEventListener("keydown",     unlock, { once: true });

function tone({ freq = 440, type = "sine", duration = 0.15, gain = 0.3, attack = 0.005, release = 0.08, detune = 0, freqEnd = null }) {
  if (!enabled) return;
  const c = ensureCtx();
  if (!c) return;
  const now = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (freqEnd != null) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), now + duration);
  osc.detune.value = detune;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(gain, now + attack);
  g.gain.linearRampToValueAtTime(gain * 0.7, now + duration - release);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

// A short bright pop for button clicks
export function playClick() {
  tone({ freq: 720, freqEnd: 540, type: "triangle", duration: 0.07, gain: 0.18 });
}

// Pleasant ascending chord — answer correct
export function playCorrect() {
  tone({ freq: 660, type: "triangle", duration: 0.18, gain: 0.22 });
  setTimeout(() => tone({ freq: 880, type: "triangle", duration: 0.20, gain: 0.22 }), 80);
  setTimeout(() => tone({ freq: 1320, type: "sine",   duration: 0.30, gain: 0.18 }), 160);
}

// Descending dissonant pair — answer wrong
export function playWrong() {
  tone({ freq: 300, type: "sawtooth", duration: 0.20, gain: 0.16 });
  setTimeout(() => tone({ freq: 210, type: "sawtooth", duration: 0.28, gain: 0.16 }), 100);
}

// Soft swoosh as a flag plants
export function playFlagPlant() {
  tone({ freq: 200, freqEnd: 600, type: "sine", duration: 0.22, gain: 0.18 });
  setTimeout(() => tone({ freq: 900, type: "sine", duration: 0.12, gain: 0.14 }), 120);
}

// Gentle blip — skipping a question or revealing
export function playReveal() {
  tone({ freq: 520, type: "triangle", duration: 0.16, gain: 0.18 });
  setTimeout(() => tone({ freq: 392, type: "triangle", duration: 0.18, gain: 0.16 }), 110);
}
