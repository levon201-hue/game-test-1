import { COUNTRIES } from "./countries.js";
import { HISTORIES } from "./histories.js";

export const LOCALES = ["en", "ru"];

const STRINGS = {
  en: {
    title:           "GeoGuess Atlas",
    tagline:         "Learn the world — one country at a time.",
    rules1:          "· No timer · explore at your own pace",
    rules2:          "· 3 question types · history & facts after each answer",
    play:            "Start learning",
    again:           "Continue",
    end_round:       "End session",
    skip:            "Skip",
    continue:        "Next",
    language:        "Language",
    score_label:     "Score",
    correct_label:   "Correct",
    asked_label:     "Asked",
    discovered:      "Discovered",
    discovered_of:   "of",

    q_locate:        "Where is",
    q_capital_of:    "Capital of",
    q_country_of:    "Which country has the capital",

    feedback_correct:"Correct!",
    feedback_wrong:  "Not quite.",
    revealed:        "The answer is",

    card_capital:    "Capital",
    card_region:     "Region",
    card_languages:  "Languages",
    card_population: "Population",
    card_area:       "Area",
    card_history:    "History",
    history_missing: "More information coming soon.",

    session_over:    "Session summary",
    your_score:      "Your score",
    keep_going:      "Keep going",
    new_session:     "New session",

    hint_drag:       "drag to rotate · scroll to zoom",

    region: {
      africa:      "Africa",
      americas:    "Americas",
      asia:        "Asia",
      europe:      "Europe",
      oceania:     "Oceania",
      middle_east: "Middle East",
    },
    unit_km2:        "km²",
    unit_people:     "people",
  },
  ru: {
    title:           "ГеоАтлас",
    tagline:         "Изучай мир — одну страну за раз.",
    rules1:          "· Без таймера · в своём темпе",
    rules2:          "· 3 типа вопросов · история и факты после каждого ответа",
    play:            "Начать обучение",
    again:           "Продолжить",
    end_round:       "Завершить сессию",
    skip:            "Пропустить",
    continue:        "Дальше",
    language:        "Язык",
    score_label:     "Очки",
    correct_label:   "Верно",
    asked_label:     "Задано",
    discovered:      "Открыто",
    discovered_of:   "из",

    q_locate:        "Где находится",
    q_capital_of:    "Столица страны",
    q_country_of:    "Какая страна имеет столицу",

    feedback_correct:"Верно!",
    feedback_wrong:  "Не совсем.",
    revealed:        "Правильный ответ:",

    card_capital:    "Столица",
    card_region:     "Регион",
    card_languages:  "Языки",
    card_population: "Население",
    card_area:       "Площадь",
    card_history:    "История",
    history_missing: "Информация скоро появится.",

    session_over:    "Итоги сессии",
    your_score:      "Ваш счёт",
    keep_going:      "Продолжить",
    new_session:     "Новая сессия",

    hint_drag:       "тащите чтобы вращать · прокрутка для масштаба",

    region: {
      africa:      "Африка",
      americas:    "Америка",
      asia:        "Азия",
      europe:      "Европа",
      oceania:     "Океания",
      middle_east: "Ближний Восток",
    },
    unit_km2:        "км²",
    unit_people:     "чел.",
  },
};

// Language names that are shown the same in both locales for selection labels.
export const LANG_DISPLAY = {
  en: "English",
  ru: "Русский",
};

let _locale = (typeof localStorage !== "undefined" && localStorage.getItem("geoAtlas.locale")) || "en";
if (!LOCALES.includes(_locale)) _locale = "en";

const _listeners = new Set();

export function getLocale() { return _locale; }

export function setLocale(loc) {
  if (!LOCALES.includes(loc) || loc === _locale) return;
  _locale = loc;
  try { localStorage.setItem("geoAtlas.locale", loc); } catch {}
  for (const fn of _listeners) fn(loc);
}

export function onLocaleChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export function t(key) {
  const parts = key.split(".");
  let node = STRINGS[_locale];
  for (const p of parts) {
    if (node == null) return key;
    node = node[p];
  }
  return node ?? key;
}

export function countryName(iso, loc = _locale) {
  const c = COUNTRIES[iso];
  if (!c) return iso;
  return (loc === "ru" ? c.name_ru : c.name_en) ?? c.name_en;
}

export function capitalName(iso, loc = _locale) {
  const c = COUNTRIES[iso];
  if (!c) return "";
  return (loc === "ru" ? c.cap_ru : c.cap_en) ?? c.cap_en;
}

export function regionName(region, loc = _locale) {
  return STRINGS[loc]?.region?.[region] ?? region;
}

export function historyOf(iso, loc = _locale) {
  const h = HISTORIES[iso];
  if (!h) return null;
  return (loc === "ru" ? h.ru : h.en) ?? h.en;
}

const _nf = {
  en: new Intl.NumberFormat("en-US"),
  ru: new Intl.NumberFormat("ru-RU"),
};
export function formatNumber(n, loc = _locale) {
  return (_nf[loc] ?? _nf.en).format(n);
}
