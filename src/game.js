import { mulberry32 } from "./rng.js";
import { QUESTION_TYPES, buildCandidatePool, makeQuestion } from "./quiz.js";

const DEFAULT_SESSION_LENGTH = 30;

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
    this.totalQuestions = DEFAULT_SESSION_LENGTH;
    this._rand = null;
  }

  start({ availableIsos, totalQuestions = DEFAULT_SESSION_LENGTH } = {}) {
    this._reset();
    this.totalQuestions = totalQuestions;
    const seed = (Math.random() * 1e9) | 0;
    this._rand = mulberry32(seed);
    this.queue = buildCandidatePool(this._rand, availableIsos, totalQuestions);
    this._distractorPool = availableIsos ? [...availableIsos] : [...this.queue];
    this.running = true;
    this._emit("start", { totalQuestions });
    this._nextQuestion();
  }

  _nextQuestion() {
    if (this.queueIndex >= this.queue.length) {
      this._end();
      return;
    }
    const targetIso = this.queue[this.queueIndex];
    this.currentQ = makeQuestion(targetIso, this._rand, this._distractorPool);
    this.queueIndex++;
    this.awaitingContinue = false;
    this._emit("question", {
      question: this.currentQ,
      index: this.queueIndex,        // 1-based, freshly incremented
      total: this.queue.length,
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
    if (this.currentQ.type !== QUESTION_TYPES.CAPITAL_OF) return null;
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
      this.discovered.add(target);
    } else {
      this.wrongCount += 1;
    }
    this.awaitingContinue = true;
    const payload = {
      result: correct ? "correct" : "wrong",
      targetIso: target,
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
      total: this.queue.length,
      discovered: [...this.discovered],
      early: !!meta.early,
    });
  }
}

function scoreFor(type) {
  if (type === QUESTION_TYPES.LOCATE)     return 10;
  if (type === QUESTION_TYPES.COUNTRY_OF) return 15;
  if (type === QUESTION_TYPES.CAPITAL_OF) return 8;
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
