import { COUNTRIES, tierBuckets } from "./countries.js";
import { capitalName, countryName, getLocale } from "./i18n.js";

export const QUESTION_TYPES = {
  LOCATE:        "locate",        // "Where is X?"  → click on globe
  CAPITAL_OF:    "capital_of",    // "Capital of X?" → multiple choice of capitals
  COUNTRY_OF:    "country_of",    // "Which country has capital X?" → click on globe
};

// Build a flat candidate pool with a soft difficulty curve:
// early questions lean tier-1, later questions mix in tier-2/3.
export function buildCandidatePool(rand, availableIsos, count = 30) {
  const allowed = availableIsos ? new Set(availableIsos) : null;
  const buckets = tierBuckets();
  for (const k of Object.keys(buckets)) {
    if (allowed) buckets[k] = buckets[k].filter((iso) => allowed.has(iso));
    shuffleInPlace(buckets[k], rand);
  }
  const cursors = { 1: 0, 2: 0, 3: 0 };
  const drawFrom = (t) => {
    const arr = buckets[t];
    if (arr.length === 0) return null;
    if (cursors[t] >= arr.length) {
      shuffleInPlace(arr, rand);
      cursors[t] = 0;
    }
    return arr[cursors[t]++];
  };
  const weights = (i, total) => {
    const f = i / total;
    if (f < 0.2)  return [1.0, 0.0, 0.0];
    if (f < 0.4)  return [0.55, 0.45, 0.0];
    if (f < 0.7)  return [0.25, 0.5, 0.25];
    return         [0.1, 0.4, 0.5];
  };
  const out = [];
  const seen = new Set();
  let safety = count * 4;
  while (out.length < count && safety-- > 0) {
    const w = weights(out.length, count);
    const r = rand();
    const t = r < w[0] ? 1 : r < w[0] + w[1] ? 2 : 3;
    const iso = drawFrom(t) ?? drawFrom(2) ?? drawFrom(1) ?? drawFrom(3);
    if (iso && !seen.has(iso)) {
      out.push(iso);
      seen.add(iso);
    }
  }
  return out;
}

// Generate a question for a given target ISO. Picks a question type randomly,
// providing choices when needed (capitals). For "click on globe" types,
// `choices` is null and the answer is the country itself.
//
// Returns:
//   { type, targetIso, promptText, choices?, correctChoiceIndex? }
export function makeQuestion(targetIso, rand, distractorPool) {
  const loc = getLocale();
  const meta = COUNTRIES[targetIso];
  if (!meta) return null;

  // Choose question type. Bias toward LOCATE (the headline gameplay).
  const r = rand();
  let type;
  if (r < 0.55)      type = QUESTION_TYPES.LOCATE;
  else if (r < 0.8)  type = QUESTION_TYPES.COUNTRY_OF;
  else               type = QUESTION_TYPES.CAPITAL_OF;

  if (type === QUESTION_TYPES.CAPITAL_OF) {
    // Multiple choice: 4 capitals, one of which is the correct one.
    const choices = pickDistractorCapitals(targetIso, rand, distractorPool, 3);
    const insertAt = Math.floor(rand() * 4);
    choices.splice(insertAt, 0, capitalName(targetIso, loc));
    return {
      type,
      targetIso,
      promptText: `${countryName(targetIso, loc)}`,
      choices,
      correctChoiceIndex: insertAt,
    };
  }

  if (type === QUESTION_TYPES.COUNTRY_OF) {
    return {
      type,
      targetIso,
      promptText: capitalName(targetIso, loc),
    };
  }

  // LOCATE (default)
  return {
    type,
    targetIso,
    promptText: countryName(targetIso, loc),
  };
}

// Returns localized question prefix for the UI (matches MakeQuestion type).
export function promptPrefix(type) {
  if (type === QUESTION_TYPES.LOCATE)     return "q_locate";
  if (type === QUESTION_TYPES.CAPITAL_OF) return "q_capital_of";
  if (type === QUESTION_TYPES.COUNTRY_OF) return "q_country_of";
  return "";
}

function pickDistractorCapitals(targetIso, rand, distractorPool, n) {
  const loc = getLocale();
  const result = [];
  const used = new Set([targetIso]);
  // Prefer distractors from the same region for plausibility
  const targetRegion = COUNTRIES[targetIso]?.region;
  const sameRegion = distractorPool.filter(
    (iso) => COUNTRIES[iso]?.region === targetRegion && iso !== targetIso,
  );
  const other = distractorPool.filter(
    (iso) => COUNTRIES[iso]?.region !== targetRegion,
  );
  shuffleInPlace(sameRegion, rand);
  shuffleInPlace(other, rand);
  const pool = [...sameRegion, ...other];
  for (const iso of pool) {
    if (result.length >= n) break;
    if (used.has(iso)) continue;
    const cap = capitalName(iso, loc);
    if (!cap || result.includes(cap)) continue;
    result.push(cap);
    used.add(iso);
  }
  // Fallback: pad with simple placeholders if pool too small
  while (result.length < n) result.push("—");
  return result;
}

function shuffleInPlace(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
