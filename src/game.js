import { mulberry32 } from "./rng.js";
import { QUESTION_TYPES, buildCandidatePool, makeQuestion, makeFeatureQuestion } from "./quiz.js";

// Probability that any given prompt is a feature (ocean/river/lake/mountain/
// desert) question instead of a country question.
const FEATURE_QUESTION_PROBABILITY = 0.25;

// Endless mode: the queue auto-refills in chunks so the game never ends on its
// own. Players stop when they want via the Settings → Back-to-menu / End button.
const BATCH_SIZE = 30;

// Game state for the educational quiz. No timer — players progress at their pace.
// Each question has three resolved states: correct, wrong, skipped.
export class Game {
  constructor() {
    this._listeners = new Map();
    this._reset();
  }

  on(event, fn) {
    if (!this._listeners.has(event)) this._listeners.set(event, new Set());
    this._listeners.get(event).add(fn);
    return () => this._listeners.get(event)?.delete(fn);
  }
  _emit(event, payload) {
    const set = this._listeners.get(event);
    if (set) for (const fn of set) fn(payload);
  }

  _reset() {
    this.queue = [];
    this.queueIndex = 0;
    this.currentQ = null;
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.skipCount = 0;
    this.discovered = new Set(); // ISOs the player has answered correctly
    this.running = false;
    this.awaitingContinue = false;
    this._rand = null;
    this._availableIsos = null;
  }

  start({ availableIsos } = {}) {
    this._reset();
    const seed = (Math.random() * 1e9) | 0;
    this._rand = mulberry32(seed);
    this._availableIsos = availableIsos ? [...availableIsos] : null;
    this._distractorPool = this._availableIsos ? [...this._availableIsos] : [];
    this._refillQueue();
    this.running = true;
    this._emit("start", {});
    this._nextQuestion();
  }

  _refillQueue() {
    const more = buildCandidatePool(this._rand, this._availableIsos, BATCH_SIZE);
    for (const iso of more) this.queue.push(iso);
  }

  _nextQuestion() {
    // Endless: refill when we're about to run out
    if (this.queueIndex >= this.queue.length) this._refillQueue();
    const r = this._rand();
    if (r < FEATURE_QUESTION_PROBABILITY) {
      this.currentQ = makeFeatureQuestion(this._rand);
    } else {
      const targetIso = this.queue[this.queueIndex];
      this.currentQ = makeQuestion(targetIso, this._rand, this._distractorPool);
      this.queueIndex++;
    }
    this.awaitingContinue = false;
    this._emit("question", {
      question: this.currentQ,
      index: this.correctCount + this.wrongCount + this.skipCount + 1,
    });
  }

  // Called when the player clicks a country on the globe.
  guessByIso(iso) {
    if (!this.running || this.awaitingContinue || !this.currentQ || !iso) return null;
    // Only valid for LOCATE and COUNTRY_OF questions (both want a country pick)
    if (this.currentQ.type === QUESTION_TYPES.CAPITAL_OF) return null;
    return this._resolve(iso === this.currentQ.targetIso, iso);
  }

  // Called when the player picks a multiple-choice answer (index into choices).
  guessByChoice(choiceIndex) {
    if (!this.running || this.awaitingContinue || !this.currentQ) return null;
    const t = this.currentQ.type;
    if (t !== QUESTION_TYPES.CAPITAL_OF && t !== QUESTION_TYPES.FEATURE_MC) return null;
    const correct = choiceIndex === this.currentQ.correctChoiceIndex;
    return this._resolve(correct, null, choiceIndex);
  }

  skip() {
    if (!this.running || this.awaitingContinue || !this.currentQ) return null;
    this.skipCount += 1;
    this.awaitingContinue = true;
    const payload = {
      result: "skipped",
      targetIso: this.currentQ.targetIso,
      featureId: this.currentQ.featureId ?? null,
      question: this.currentQ,
    };
    this._emit("resolved", payload);
    return payload;
  }

  _resolve(correct, guessIso = null, choiceIndex = null) {
    const target = this.currentQ.targetIso;
    if (correct) {
      this.correctCount += 1;
      this.score += scoreFor(this.currentQ.type);
      if (target) this.discovered.add(target);
    } else {
      this.wrongCount += 1;
    }
    this.awaitingContinue = true;
    const payload = {
      result: correct ? "correct" : "wrong",
      targetIso: target,
      featureId: this.currentQ.featureId ?? null,
      guessIso,
      choiceIndex,
      question: this.currentQ,
      score: this.score,
      correct: this.correctCount,
      wrong: this.wrongCount,
    };
    this._emit("resolved", payload);
    return payload;
  }

  // Called by UI after the player taps "Next" on the info card.
  continueAfterReveal() {
    if (!this.running) return;
    if (!this.awaitingContinue) return;
    this._nextQuestion();
  }

  endNow() {
    if (!this.running) return;
    this._end({ early: true });
  }

  _end(meta = {}) {
    this.running = false;
    this._emit("end", {
      score: this.score,
      correct: this.correctCount,
      wrong: this.wrongCount,
      skipped: this.skipCount,
      asked: this.queueIndex,
      discovered: [...this.discovered],
      early: !!meta.early,
    });
  }
}

// Wipe persistent progress (flags planted on the globe across sessions).
export function resetAllDiscovered() {
  try { localStorage.removeItem("geoAtlas.discoveredAll"); } catch {}
  try { localStorage.removeItem("geoAtlas.best.score"); } catch {}
}

function scoreFor(type) {
  if (type === QUESTION_TYPES.LOCATE)     return 10;
  if (type === QUESTION_TYPES.COUNTRY_OF) return 15;
  if (type === QUESTION_TYPES.CAPITAL_OF) return 8;
  if (type === QUESTION_TYPES.FEATURE_MC) return 12;
  return 5;
}

const BEST_KEY = "geoAtlas.best.score";
export function loadBestScore() {
  try { return parseInt(localStorage.getItem(BEST_KEY) ?? "0", 10) || 0; } catch { return 0; }
}
export function saveBestIfHigher(score) {
  try {
    const prev = parseInt(localStorage.getItem(BEST_KEY) ?? "0", 10) || 0;
    if (score > prev) {
      localStorage.setItem(BEST_KEY, String(score));
      return score;
    }
    return prev;
  } catch { return score; }
}

// Persistent set of all countries the player has ever discovered correctly.
const DISCOVERED_KEY = "geoAtlas.discoveredAll";
export function loadAllDiscovered() {
  try {
    const raw = localStorage.getItem(DISCOVERED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
export function persistDiscovered(set) {
  try { localStorage.setItem(DISCOVERED_KEY, JSON.stringify([...set])); } catch {}
}
