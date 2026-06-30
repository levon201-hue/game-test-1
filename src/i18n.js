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
    settings:        "Settings",
    resume:          "Resume",
    restart:         "Restart session",
    back_to_menu:    "Back to menu",
    reset_progress:  "Reset all progress",
    reset_confirm:   "This clears all your discovered countries and best score. Continue?",
    sfx_label:       "Sound effects",
    music_label:     "Country music",
    score_label:     "Score",
    correct_label:   "Correct",
    asked_label:     "Asked",
    discovered:      "Discovered",
    discovered_of:   "of",

    q_locate:        "Where is",
    q_capital_of:    "Capital of",
    q_country_of:    "Which country has the capital",
    q_longest_river:      "Which is the world's longest river?",
    q_largest_ocean:      "Which is the world's largest ocean?",
    q_deepest_ocean:      "Which ocean has the greatest average depth?",
    q_deepest_lake:       "Which is the world's deepest lake?",
    q_largest_lake:       "Which is the world's largest lake by area?",
    q_highest_mountain:   "Which is the highest mountain in the world?",
    q_highest_in_europe:  "Which is the highest mountain in Europe?",
    q_highest_in_africa:  "Which is the highest mountain in Africa?",
    q_largest_hot_desert: "Which is the world's largest hot desert?",
    cat_ocean:       "Ocean",
    cat_river:       "River",
    cat_lake:        "Lake",
    cat_mountain:    "Mountain",
    cat_desert:      "Desert",
    metric_length:   "Length",
    metric_area:     "Area",
    metric_depth:    "Depth",
    metric_height:   "Height",
    unit_km:         "km",
    unit_m:          "m",

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
    settings:        "Настройки",
    resume:          "Продолжить игру",
    restart:         "Начать заново",
    back_to_menu:    "В главное меню",
    reset_progress:  "Сбросить весь прогресс",
    reset_confirm:   "Это удалит все открытые страны и лучший счёт. Продолжить?",
    sfx_label:       "Звуковые эффекты",
    music_label:     "Музыка страны",
    score_label:     "Очки",
    correct_label:   "Верно",
    asked_label:     "Задано",
    discovered:      "Открыто",
    discovered_of:   "из",

    q_locate:        "Где находится",
    q_capital_of:    "Столица страны",
    q_country_of:    "Какая страна имеет столицу",
    q_longest_river:      "Какая самая длинная река в мире?",
    q_largest_ocean:      "Какой самый большой океан в мире?",
    q_deepest_ocean:      "У какого океана наибольшая средняя глубина?",
    q_deepest_lake:       "Какое самое глубокое озеро в мире?",
    q_largest_lake:       "Какое самое большое озеро по площади?",
    q_highest_mountain:   "Какая самая высокая гора в мире?",
    q_highest_in_europe:  "Какая самая высокая гора в Европе?",
    q_highest_in_africa:  "Какая самая высокая гора в Африке?",
    q_largest_hot_desert: "Какая самая большая жаркая пустыня в мире?",
    cat_ocean:       "Океан",
    cat_river:       "Река",
    cat_lake:        "Озеро",
    cat_mountain:    "Гора",
    cat_desert:      "Пустыня",
    metric_length:   "Длина",
    metric_area:     "Площадь",
    metric_depth:    "Глубина",
    metric_height:   "Высота",
    unit_km:         "км",
    unit_m:          "м",

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
