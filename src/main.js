import { createGlobe } from "./globe.js";
import { COLORS } from "./geo.js";
import { COUNTRIES } from "./countries.js";
import {
  Game,
  loadBestScore,
  saveBestIfHigher,
  loadAllDiscovered,
  persistDiscovered,
  resetAllDiscovered,
} from "./game.js";
import {
  t,
  getLocale,
  setLocale,
  onLocaleChange,
  countryName,
  capitalName,
  regionName,
  historyOf,
  formatNumber,
} from "./i18n.js";
import { QUESTION_TYPES, promptPrefix } from "./quiz.js";
import { FEATURES, kindEmoji } from "./features.js";
import {
  playClick, playCorrect, playWrong, playFlagPlant, playReveal,
  setSfxEnabled, isSfxEnabled,
} from "./audio.js";
import {
  playAnthemFor, stopCurrent as stopAnthem,
  setMusicEnabled, isMusicEnabled, hasAnthem,
  onAnthemState,
} from "./anthems.js";

const els = {
  loading:      document.getElementById("loading"),
  startOv:      document.getElementById("start-overlay"),
  endOv:        document.getElementById("end-overlay"),
  hud:          document.getElementById("hud"),
  hudBottom:    document.getElementById("hud-bottom"),
  bestLine:     document.getElementById("best-line"),
  promptLabel:  document.getElementById("prompt-label"),
  promptTarget: document.getElementById("prompt-target"),
  choices:      document.getElementById("choices"),
  scoreValue:   document.getElementById("score-value"),
  progIndex:    document.getElementById("progress-index"),
  btnSkip:      document.getElementById("btn-skip"),
  btnSettings:  document.getElementById("btn-settings"),

  settingsOv:   document.getElementById("settings-overlay"),
  btnSfx:       document.getElementById("btn-sfx"),
  btnMusic:     document.getElementById("btn-music"),
  btnResume:    document.getElementById("btn-resume"),
  btnRestart:   document.getElementById("btn-restart"),
  btnBackToMenu:document.getElementById("btn-back-to-menu"),
  btnResetProg: document.getElementById("btn-reset-progress"),

  infoOv:       document.getElementById("info-overlay"),
  infoFeedback: document.getElementById("info-feedback"),
  infoFlag:     document.getElementById("info-flag"),
  infoCountry:  document.getElementById("info-country"),
  infoRegion:   document.getElementById("info-region"),
  infoCapital:  document.getElementById("info-capital"),
  infoPop:      document.getElementById("info-population"),
  infoArea:     document.getElementById("info-area"),
  infoLangs:    document.getElementById("info-languages"),
  infoHistory:  document.getElementById("info-history"),
  infoAnthem:   document.getElementById("info-anthem"),
  btnContinue:  document.getElementById("btn-continue"),

  finalScore:   document.getElementById("final-score-value"),
  statCorrect:  document.getElementById("stat-correct"),
  statAsked:    document.getElementById("stat-asked"),
  statDisc:     document.getElementById("stat-discovered"),
  btnPlay:      document.getElementById("start-play"),
  btnAgain:     document.getElementById("again-play"),
};

let globe;
let game;
let currentQuestion = null;
let allDiscovered = loadAllDiscovered();

bootstrap();

async function bootstrap() {
  try {
    globe = await createGlobe(document.getElementById("globe-container"));
  } catch (err) {
    console.error(err);
    els.loading.querySelector(".loading-text").textContent =
      "Failed to load world data — check connection and refresh.";
    return;
  }

  game = new Game();
  wireGameEvents();
  wirePointerHandlers();
  wireUiButtons();
  wireLanguageSwitchers();
  wireAudioToggles();
  wireAnthemIndicator();
  applyLocaleToStaticUi();
  refreshAudioToggleUi();

  els.loading.hidden = true;
  showStartOverlay();
  startRenderLoop();

  onLocaleChange(() => {
    applyLocaleToStaticUi();
    if (currentQuestion) renderQuestion(currentQuestion);
    showBestLine();
  });
}

// ---------- Locale & static UI ----------

function applyLocaleToStaticUi() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  const loc = getLocale();
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === loc);
  });
  document.documentElement.lang = loc;
}

function wireLanguageSwitchers() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      playClick();
      setLocale(btn.dataset.lang);
    });
  });
}

function wireAudioToggles() {
  if (els.btnSfx) {
    els.btnSfx.addEventListener("click", () => {
      setSfxEnabled(!isSfxEnabled());
      refreshAudioToggleUi();
      if (isSfxEnabled()) playClick();
    });
  }
  if (els.btnMusic) {
    els.btnMusic.addEventListener("click", () => {
      setMusicEnabled(!isMusicEnabled());
      refreshAudioToggleUi();
      playClick();
    });
  }
}

function wireAnthemIndicator() {
  onAnthemState((state, iso) => {
    if (!els.infoAnthem) return;
    if (state === "playing") {
      els.infoAnthem.hidden = false;
      els.infoAnthem.classList.remove("loading");
      els.infoAnthem.textContent = "♪ " + (getLocale() === "ru" ? "Гимн играет" : "Anthem playing");
    } else if (state === "loading") {
      els.infoAnthem.hidden = false;
      els.infoAnthem.classList.add("loading");
      els.infoAnthem.textContent = "♪ " + (getLocale() === "ru" ? "Загрузка гимна…" : "Loading anthem…");
    } else {
      els.infoAnthem.hidden = true;
      els.infoAnthem.classList.remove("loading");
    }
  });
}

function refreshAudioToggleUi() {
  if (els.btnSfx) {
    els.btnSfx.classList.toggle("off", !isSfxEnabled());
    els.btnSfx.title = isSfxEnabled() ? "Sound on" : "Sound off";
  }
  if (els.btnMusic) {
    els.btnMusic.classList.toggle("off", !isMusicEnabled());
    els.btnMusic.title = isMusicEnabled() ? "Music on" : "Music off";
  }
}

// ---------- Overlays ----------

function showBestLine() {
  const best = loadBestScore();
  els.bestLine.textContent = best > 0
    ? `${t("score_label")}: ${formatNumber(best)}  ·  ${t("discovered")}: ${allDiscovered.size}`
    : `${t("discovered")}: ${allDiscovered.size}`;
}

function showStartOverlay() {
  showBestLine();
  els.startOv.hidden = false;
  els.endOv.hidden = true;
  els.hud.hidden = true;
  els.infoOv.hidden = true;
  els.settingsOv.hidden = true;
  stopAnthem();
}

function openSettings() {
  refreshAudioToggleUi();
  els.settingsOv.hidden = false;
}
function closeSettings() {
  els.settingsOv.hidden = true;
}

function startRound() {
  els.startOv.hidden = true;
  els.endOv.hidden = true;
  els.infoOv.hidden = true;
  els.hud.hidden = false;
  els.hudBottom.classList.remove("hidden");
  setTimeout(() => els.hudBottom.classList.add("hidden"), 4500);
  els.scoreValue.textContent = "0";

  globe.clearFlags();
  for (const iso of allDiscovered) globe.plantFlag(iso);

  const available = Array.from(globe.byIso.keys());
  game.start({ availableIsos: available });
}

// ---------- Game events ----------

function wireGameEvents() {
  game.on("start", () => {
    els.progIndex.textContent = "1";
  });

  game.on("question", ({ question, index }) => {
    currentQuestion = question;
    els.progIndex.textContent = String(index);
    renderQuestion(question);
  });

  game.on("resolved", (payload) => { onResolved(payload); });

  game.on("end", (summary) => {
    saveBestIfHigher(summary.score);
    els.finalScore.textContent = formatNumber(summary.score);
    els.statCorrect.textContent = formatNumber(summary.correct);
    els.statAsked.textContent = formatNumber(summary.asked);
    els.statDisc.textContent = formatNumber(allDiscovered.size);
    els.hud.hidden = true;
    els.infoOv.hidden = true;
    stopAnthem();
    els.endOv.hidden = false;
  });
}

function renderQuestion(question) {
  if (question.type === QUESTION_TYPES.FEATURE_MC) {
    // Feature questions (oceans / rivers / lakes / mountains / deserts)
    // are pure multiple-choice; the prompt text comes from the i18n key.
    els.promptLabel.textContent = t("language") === t("language") ? "" : ""; // intentionally blank label
    els.promptLabel.textContent = "";
    els.promptTarget.textContent = t(question.promptKey);
    renderChoices(question);
    return;
  }

  els.promptLabel.textContent = t(promptPrefix(question.type));
  els.promptTarget.textContent = question.type === QUESTION_TYPES.COUNTRY_OF
    ? capitalName(question.targetIso)
    : countryName(question.targetIso);

  if (question.type === QUESTION_TYPES.CAPITAL_OF) {
    renderChoices(question);
  } else {
    els.choices.hidden = true;
    els.choices.innerHTML = "";
  }
}

function renderChoices(question) {
  els.choices.hidden = false;
  els.choices.innerHTML = "";
  question.choices.forEach((label, idx) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.dataset.idx = String(idx);
    btn.addEventListener("click", () => {
      playClick();
      game.guessByChoice(idx);
    });
    els.choices.appendChild(btn);
  });
}

function onResolved(payload) {
  const { result, targetIso, featureId, guessIso, question, score } = payload;
  if (score != null) els.scoreValue.textContent = formatNumber(score);

  // Audio feedback (same for both country and feature questions)
  if (result === "correct")      playCorrect();
  else if (result === "wrong")   playWrong();
  else                           playReveal();

  // Decorate MC buttons (both CAPITAL_OF and FEATURE_MC use the choices grid)
  if (question.type === QUESTION_TYPES.CAPITAL_OF || question.type === QUESTION_TYPES.FEATURE_MC) {
    const correctIdx = question.correctChoiceIndex;
    [...els.choices.children].forEach((btn, idx) => {
      if (idx === correctIdx) btn.classList.add("correct");
      else if (idx === payload.choiceIndex) btn.classList.add("wrong");
      btn.disabled = true;
    });
  }

  if (question.type === QUESTION_TYPES.FEATURE_MC) {
    // No globe interaction for feature questions — show the feature card.
    setTimeout(() => showFeatureInfoCard(featureId, result), 500);
    return;
  }

  // Country path: flash, plant flag if correct, focus camera, show country card.
  if (result === "correct") {
    globe.flashCountry(targetIso, COLORS.correct, 700);
    allDiscovered.add(targetIso);
    persistDiscovered(allDiscovered);
    setTimeout(() => playFlagPlant(), 200);
    globe.plantFlag(targetIso);
  } else if (result === "wrong") {
    if (guessIso && guessIso !== targetIso) globe.flashCountry(guessIso, COLORS.wrong, 700);
    globe.flashCountry(targetIso, COLORS.reveal, 1000);
  } else {
    globe.flashCountry(targetIso, COLORS.reveal, 1000);
  }
  globe.focusOnCountry(targetIso);
  setTimeout(() => showInfoCard(targetIso, result), 500);
}

function showInfoCard(iso, result) {
  const meta = COUNTRIES[iso];
  if (!meta) return;

  // If the previous card was a feature, the flag <img> was swapped for an
  // emoji <div>; put the <img> back so we can set its src below.
  restoreCountryFlagElement();
  // Re-show fact rows that may have been hidden by feature cards.
  for (const el of [els.infoCapital, els.infoPop, els.infoArea, els.infoLangs]) {
    if (el && el.parentElement) el.parentElement.style.display = "";
  }
  // Reset fact labels to the country defaults.
  const factsRoot = els.infoCapital?.parentElement?.parentElement;
  if (factsRoot) {
    const labels = factsRoot.querySelectorAll(".fact-label");
    const keys = ["card_capital", "card_population", "card_area", "card_languages"];
    labels.forEach((el, i) => { if (keys[i]) el.textContent = t(keys[i]); });
  }

  let key, kind;
  if (result === "correct")   { key = "feedback_correct"; kind = "good"; }
  else if (result === "wrong"){ key = "feedback_wrong";   kind = "bad";  }
  else                        { key = "revealed";         kind = "neutral"; }
  els.infoFeedback.textContent = t(key);
  els.infoFeedback.className = "info-feedback " + kind;

  els.infoFlag.src = `https://flagcdn.com/w160/${meta.iso2}.png`;
  els.infoFlag.alt = `${countryName(iso)} flag`;

  els.infoCountry.textContent = countryName(iso);
  els.infoRegion.textContent = regionName(meta.region);
  els.infoCapital.textContent = capitalName(iso);
  els.infoPop.textContent = `${formatNumber(meta.pop)} ${t("unit_people")}`;
  els.infoArea.textContent = `${formatNumber(meta.area)} ${t("unit_km2")}`;
  els.infoLangs.textContent = meta.langs.join(", ");
  els.infoHistory.textContent = historyOf(iso) ?? t("history_missing");

  // Hide indicator initially; the anthem-state subscriber will update it
  // when playback actually starts. Always attempt to play — the player
  // resolves URLs via the Commons API for countries without a seed URL.
  if (els.infoAnthem) els.infoAnthem.hidden = true;
  stopAnthem();
  if (isMusicEnabled()) playAnthemFor(iso);

  els.infoOv.hidden = false;
}

function showFeatureInfoCard(featureId, result) {
  const f = FEATURES[featureId];
  if (!f) return;

  let key, kind;
  if (result === "correct")    { key = "feedback_correct"; kind = "good"; }
  else if (result === "wrong") { key = "feedback_wrong";   kind = "bad";  }
  else                         { key = "revealed";         kind = "neutral"; }
  els.infoFeedback.textContent = t(key);
  els.infoFeedback.className = "info-feedback " + kind;

  // Use an emoji + transparent flag slot so the existing card layout still works
  els.infoFlag.removeAttribute("src");
  els.infoFlag.alt = "";
  els.infoFlag.style.background = "rgba(242,198,110,0.10)";
  els.infoFlag.style.display = "grid";
  els.infoFlag.style.placeItems = "center";
  els.infoFlag.style.fontSize = "32px";
  els.infoFlag.style.height = "44px";
  // Replace the <img> visual with a sibling span we render in its place
  els.infoFlag.outerHTML = `<div class="info-flag info-flag-emoji" id="info-flag">${kindEmoji(f.kind)}</div>`;
  // The above replaces the node; refresh our cached reference
  els.infoFlag = document.getElementById("info-flag");

  const loc = getLocale();
  els.infoCountry.textContent = loc === "ru" ? f.name_ru : f.name_en;
  const regionLabel = f.continent ? regionName(f.continent) : "";
  els.infoRegion.textContent = `${t("cat_" + f.kind)}${regionLabel ? "  ·  " + regionLabel : ""}`;

  // Repurpose the country facts into kind-appropriate facts
  setFactRow(els.infoCapital, els.infoCapital.previousElementSibling, primaryMetric(f), primaryMetricValue(f));
  setFactRow(els.infoPop,     els.infoPop.previousElementSibling,     secondaryMetric(f), secondaryMetricValue(f));
  setFactRow(els.infoArea,    els.infoArea.previousElementSibling,    "",                  "");   // unused
  setFactRow(els.infoLangs,   els.infoLangs.previousElementSibling,   "",                  "");   // unused

  els.infoHistory.textContent = loc === "ru" ? f.fact_ru : f.fact_en;

  if (els.infoAnthem) els.infoAnthem.hidden = true;
  stopAnthem();   // no anthems for features

  els.infoOv.hidden = false;
}

// Reset the country card image element (called when transitioning back to a
// country card after a feature card swapped the <img> for an emoji <div>).
function restoreCountryFlagElement() {
  if (els.infoFlag && els.infoFlag.classList.contains("info-flag-emoji")) {
    const replacement = document.createElement("img");
    replacement.className = "info-flag";
    replacement.id = "info-flag";
    replacement.alt = "";
    els.infoFlag.replaceWith(replacement);
    els.infoFlag = replacement;
  }
}

function setFactRow(valueEl, labelEl, labelKey, valueText) {
  if (!valueEl) return;
  const fact = valueEl.parentElement;
  if (!labelKey) {
    fact.style.display = "none";
    return;
  }
  fact.style.display = "";
  if (labelEl && labelEl.classList.contains("fact-label")) labelEl.textContent = t(labelKey);
  valueEl.textContent = valueText;
}

function primaryMetric(f) {
  switch (f.kind) {
    case "ocean":    return "metric_area";
    case "river":    return "metric_length";
    case "lake":     return "metric_area";
    case "mountain": return "metric_height";
    case "desert":   return "metric_area";
    default: return "";
  }
}
function secondaryMetric(f) {
  switch (f.kind) {
    case "ocean":    return "metric_depth";
    case "lake":     return f.max_depth_m != null ? "metric_depth" : "";
    default: return "";
  }
}
function primaryMetricValue(f) {
  const loc = getLocale();
  switch (f.kind) {
    case "ocean":    return `${formatNumber(f.area_km2)} ${t("unit_km2")}`;
    case "river":    return `${formatNumber(f.length_km)} ${t("unit_km")}`;
    case "lake":     return `${formatNumber(f.area_km2)} ${t("unit_km2")}`;
    case "mountain": return `${formatNumber(f.height_m)} ${t("unit_m")}`;
    case "desert":   return `${formatNumber(f.area_km2)} ${t("unit_km2")}`;
    default: return "";
  }
}
function secondaryMetricValue(f) {
  switch (f.kind) {
    case "ocean":    return `${formatNumber(f.avg_depth_m)} ${t("unit_m")}`;
    case "lake":     return f.max_depth_m != null ? `${formatNumber(f.max_depth_m)} ${t("unit_m")}` : "";
    default: return "";
  }
}

// ---------- Input ----------

function wirePointerHandlers() {
  const canvas = globe.renderer.domElement;
  let downX = 0, downY = 0, downT = 0;
  canvas.addEventListener("pointerdown", (e) => {
    downX = e.clientX; downY = e.clientY; downT = performance.now();
  });
  canvas.addEventListener("pointerup", (e) => {
    if (!game.running || game.awaitingContinue) return;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) return;
    if (performance.now() - downT > 600) return;
    const iso = globe.pickIsoFromPointer(e.clientX, e.clientY);
    if (iso) game.guessByIso(iso);
  });
}

function wireUiButtons() {
  els.btnPlay.addEventListener("click", () => { playClick(); startRound(); });
  els.btnAgain.addEventListener("click", () => { playClick(); startRound(); });
  els.btnSkip.addEventListener("click", () => { playClick(); game.skip(); });
  els.btnContinue.addEventListener("click", () => {
    playClick();
    stopAnthem();
    els.infoOv.hidden = true;
    game.continueAfterReveal();
  });

  // ---- In-game settings menu ----
  els.btnSettings.addEventListener("click", () => { playClick(); openSettings(); });
  els.btnResume.addEventListener("click", () => { playClick(); closeSettings(); });
  els.btnRestart.addEventListener("click", () => {
    playClick();
    closeSettings();
    stopAnthem();
    startRound();
  });
  els.btnBackToMenu.addEventListener("click", () => {
    playClick();
    closeSettings();
    if (game.running) game.endNow();
    stopAnthem();
    showStartOverlay();
  });
  els.btnResetProg.addEventListener("click", () => {
    if (!window.confirm(t("reset_confirm"))) return;
    playClick();
    resetAllDiscovered();
    allDiscovered = new Set();
    globe.clearFlags();
    closeSettings();
    if (game.running) game.endNow();
    stopAnthem();
    showStartOverlay();
  });
}

// ---------- Render loop ----------

let lastTime;
function startRenderLoop() {
  lastTime = performance.now();
  requestAnimationFrame(loop);
}
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  globe.render();
  void dt;
}
