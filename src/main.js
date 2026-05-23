import { createGlobe } from "./globe.js";
import { COLORS } from "./geo.js";
import { COUNTRIES } from "./countries.js";
import {
  Game,
  loadBestScore,
  saveBestIfHigher,
  loadAllDiscovered,
  persistDiscovered,
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
  progTotal:    document.getElementById("progress-total"),
  btnSkip:      document.getElementById("btn-skip"),
  btnEnd:       document.getElementById("btn-end"),

  btnSfx:       document.getElementById("btn-sfx"),
  btnMusic:     document.getElementById("btn-music"),

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
  stopAnthem();
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
  game.on("start", ({ totalQuestions }) => {
    els.progIndex.textContent = "1";
    els.progTotal.textContent = String(totalQuestions);
  });

  game.on("question", ({ question, index, total }) => {
    currentQuestion = question;
    els.progIndex.textContent = String(index);
    els.progTotal.textContent = String(total);
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
  els.promptLabel.textContent = t(promptPrefix(question.type));
  els.promptTarget.textContent = question.type === QUESTION_TYPES.COUNTRY_OF
    ? capitalName(question.targetIso)
    : countryName(question.targetIso);

  if (question.type === QUESTION_TYPES.CAPITAL_OF) {
    els.choices.hidden = false;
    els.choices.innerHTML = "";
    question.choices.forEach((cap, idx) => {
      const btn = document.createElement("button");
      btn.textContent = cap;
      btn.dataset.idx = String(idx);
      btn.addEventListener("click", () => {
        playClick();
        game.guessByChoice(idx);
      });
      els.choices.appendChild(btn);
    });
  } else {
    els.choices.hidden = true;
    els.choices.innerHTML = "";
  }
}

function onResolved(payload) {
  const { result, targetIso, guessIso, question, score } = payload;
  if (score != null) els.scoreValue.textContent = formatNumber(score);

  if (result === "correct") {
    playCorrect();
    globe.flashCountry(targetIso, COLORS.correct, 700);
    allDiscovered.add(targetIso);
    persistDiscovered(allDiscovered);
    setTimeout(() => playFlagPlant(), 200);
    globe.plantFlag(targetIso);
  } else if (result === "wrong") {
    playWrong();
    if (guessIso && guessIso !== targetIso) globe.flashCountry(guessIso, COLORS.wrong, 700);
    globe.flashCountry(targetIso, COLORS.reveal, 1000);
  } else {
    playReveal();
    globe.flashCountry(targetIso, COLORS.reveal, 1000);
  }

  if (question.type === QUESTION_TYPES.CAPITAL_OF) {
    const correctIdx = question.correctChoiceIndex;
    [...els.choices.children].forEach((btn, idx) => {
      if (idx === correctIdx) btn.classList.add("correct");
      else if (idx === payload.choiceIndex) btn.classList.add("wrong");
      btn.disabled = true;
    });
  }

  // Auto-focus the camera on the target country so the player sees its location.
  globe.focusOnCountry(targetIso);

  setTimeout(() => showInfoCard(targetIso, result), 500);
}

function showInfoCard(iso, result) {
  const meta = COUNTRIES[iso];
  if (!meta) return;

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
  els.btnEnd.addEventListener("click", () => { playClick(); game.endNow(); });
  els.btnContinue.addEventListener("click", () => {
    playClick();
    stopAnthem();
    els.infoOv.hidden = true;
    game.continueAfterReveal();
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
