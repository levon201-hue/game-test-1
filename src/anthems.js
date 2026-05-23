// Country anthem playback.
//
// Strategy:
//   1. RESOLVED_URLS — a seed map of Wikimedia Commons URLs for ~45 popular
//      countries. Each URL was resolved by querying the Commons API for the
//      anthem's well-known filename and verifying the imageinfo URL returned.
//   2. For any country without a seed URL, the player searches the Wikimedia
//      Commons API at runtime ("<anthem name>" or "<country> national
//      anthem") and picks the first audio file in the results. Misleading
//      hits (sub-regional anthems, foreign-language covers) are filtered out
//      by keyword. Successful resolves cache to localStorage so subsequent
//      views are instant.
//   3. Failures are silent — info card still works without audio.
//
// All URLs point to recordings hosted on Wikimedia Commons. No audio data
// is embedded in this codebase; only URL strings.

import { COUNTRIES } from "./countries.js";

// ISO 3166-1 numeric (3-digit) → Wikimedia upload URL.
// Each URL was verified via the Commons API on resolution.
const RESOLVED_URLS = {
  "008": "https://upload.wikimedia.org/wikipedia/commons/f/fe/Himni_i_Flamurit_%281918%29.ogg",                                                                       // Albania
  "032": "https://upload.wikimedia.org/wikipedia/commons/6/61/19_HIMNO_NACIONAL_ARGENTINO.ogg",                                                                       // Argentina
  "036": "https://upload.wikimedia.org/wikipedia/commons/0/06/U.S._Navy_Band%2C_Advance_Australia_Fair_%28abridged%29.oga",                                           // Australia
  "040": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Land_der_Berge_Land_am_Strome_instrumental.ogg",                                                        // Austria
  "056": "https://upload.wikimedia.org/wikipedia/commons/a/a6/La_Braban%C3%A7onne_NL.oga",                                                                            // Belgium
  "076": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Hino_Nacional_Brasileiro_instrumental.ogg",                                                             // Brazil
  "100": "https://upload.wikimedia.org/wikipedia/commons/4/4f/Mila_Rodino_instrumental.ogg",                                                                          // Bulgaria
  "124": "https://upload.wikimedia.org/wikipedia/commons/9/9e/O_Canada.ogg",                                                                                          // Canada
  "152": "https://upload.wikimedia.org/wikipedia/commons/b/b5/Himno_Nacional_de_Chile.ogg",                                                                           // Chile
  "156": "https://upload.wikimedia.org/wikipedia/commons/1/13/March_of_the_Volunteers_%28Pathe_Records_-_1935%29.ogg",                                                // China
  "191": "https://upload.wikimedia.org/wikipedia/commons/d/df/Lijepa_nasa_domovino_instrumental.ogg",                                                                 // Croatia
  "192": "https://upload.wikimedia.org/wikipedia/commons/7/70/La_Bayamesa.ogv",                                                                                       // Cuba
  "203": "https://upload.wikimedia.org/wikipedia/commons/d/de/Kde_domov_muj.ogg",                                                                                     // Czechia
  "208": "https://upload.wikimedia.org/wikipedia/commons/c/cd/Der_er_et_yndigt_land%2C_Hans_Ernst_Kr%C3%B8yer%2C_Erik_Damskier%2C_2009-09-30.ogg",                    // Denmark
  "233": "https://upload.wikimedia.org/wikipedia/commons/9/98/Mu_isamaa%2C_mu_%C3%B5nn_ja_r%C3%B5%C3%B5m_%28first_vocal_recording%29.ogg",                            // Estonia
  "246": "https://upload.wikimedia.org/wikipedia/commons/3/32/Maamme_%28second_recording%29.oga",                                                                     // Finland
  "250": "https://upload.wikimedia.org/wikipedia/commons/3/30/La_Marseillaise.ogg",                                                                                   // France
  "276": "https://upload.wikimedia.org/wikipedia/commons/6/66/Deutschlandlied_%28old_recording%29.oga",                                                               // Germany
  "300": "https://upload.wikimedia.org/wikipedia/commons/f/f7/Hymn_to_Liberty_%28old_official_instrumental%29.oga",                                                   // Greece
  "352": "https://upload.wikimedia.org/wikipedia/commons/2/20/Lofs%C3%B6ngur_%28first_recording%29.ogg",                                                              // Iceland
  "356": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Jana_Gana_Mana.ogg",                                                                                    // India
  "364": "https://upload.wikimedia.org/wikipedia/commons/a/a3/National_Anthem_of_Iran_1925_-1979_%28Vocal%29.ogg",                                                    // Iran
  "372": "https://upload.wikimedia.org/wikipedia/commons/2/27/Ireland_National_Anthem_%28Amhr%C3%A1n_na_bhFiann%29_1960s.ogg",                                        // Ireland
  "376": "https://upload.wikimedia.org/wikipedia/commons/2/26/Hatikvah_instrumental.ogg",                                                                             // Israel
  "380": "https://upload.wikimedia.org/wikipedia/commons/2/26/Canto_degli_Italiani_%281961_recording%29.ogg",                                                         // Italy
  "392": "https://upload.wikimedia.org/wikipedia/commons/8/88/Kimigayo_vocal_1930.ogg",                                                                               // Japan
  "410": "https://upload.wikimedia.org/wikipedia/commons/4/40/National_anthem_of_South_Korea_performed_in_October_2011_at_the_White_House.oga",                       // South Korea
  "428": "https://upload.wikimedia.org/wikipedia/commons/d/d1/NBS_%C5%A0t%C4%81ba_or%C4%B7estris_-_Dievs%2C_sv%C4%93t%C4%AB_Latviju%21.ogg",                          // Latvia
  "440": "https://upload.wikimedia.org/wikipedia/commons/a/ab/Tauti%C5%A1ka_giesme_instrumental.oga",                                                                 // Lithuania
  "484": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Canta_del_Himno_Nacional_Mexicano_%28Estrofa_I%29.ogg",                                                 // Mexico
  "528": "https://upload.wikimedia.org/wikipedia/commons/2/2e/United_States_Navy_Band_-_Het_Wilhelmus.ogg",                                                           // Netherlands
  "554": "https://upload.wikimedia.org/wikipedia/commons/d/d6/God_Defend_New_Zealand_instrumental.ogg",                                                               // New Zealand
  "578": "https://upload.wikimedia.org/wikipedia/commons/4/40/Ja%2C_vi_elsker_dette_landet.ogg",                                                                      // Norway
  "608": "https://upload.wikimedia.org/wikipedia/commons/5/59/Philippine_National_Anthem%2C_the_Lupang_Hinirang%2C_Himno_Nacional_Filipino_Unknown_Artist.ogg",       // Philippines
  "616": "https://upload.wikimedia.org/wikipedia/commons/9/90/Mazurek_D%C4%85browskiego%2C_Anthem_of_Poland.oga",                                                     // Poland
  "620": "https://upload.wikimedia.org/wikipedia/commons/5/58/A_Portuguesa.ogg",                                                                                      // Portugal
  "642": "https://upload.wikimedia.org/wikipedia/commons/c/cd/De%C8%99teapt%C4%83-te%2C_rom%C3%A2ne%21_%28Victor_Military_Band%29.ogg",                               // Romania
  "643": "https://upload.wikimedia.org/wikipedia/commons/e/ea/National_Anthem_of_Russian_Federation.ogg",                                                             // Russia
  "682": "https://upload.wikimedia.org/wikipedia/commons/f/f0/Aash_Al_Maleek_instrumental.ogg",                                                                       // Saudi Arabia
  "688": "https://upload.wikimedia.org/wikipedia/commons/5/50/Boze_pravde%2C_1918.ogg",                                                                               // Serbia
  "703": "https://upload.wikimedia.org/wikipedia/commons/c/c7/Nad_Tatrou_sa_bl%C3%BDska_Tanpa_Nyanyian.ogg",                                                          // Slovakia
  "705": "https://upload.wikimedia.org/wikipedia/commons/d/de/Zdravljica.ogg",                                                                                        // Slovenia
  "710": "https://upload.wikimedia.org/wikipedia/commons/9/90/%22Nkosi_Sikelel%27_iAfrika%22_performed_at_the_White_House_in_1994.oga",                               // South Africa
  "724": "https://upload.wikimedia.org/wikipedia/commons/7/7f/Marcha_Real_recorded_in_year_1963.oga",                                                                 // Spain
  "752": "https://upload.wikimedia.org/wikipedia/commons/a/a2/Du_gamla%2C_du_fria.ogg",                                                                               // Sweden
  "756": "https://upload.wikimedia.org/wikipedia/commons/0/00/Swiss_Psalm.ogg",                                                                                       // Switzerland
  "764": "https://upload.wikimedia.org/wikipedia/commons/f/f3/Thai_National_Anthem_-_US_Navy_Band.ogg",                                                               // Thailand
  "792": "https://upload.wikimedia.org/wikipedia/commons/0/06/%C4%B0stikl%C3%A2l_Mar%C5%9F%C4%B1-2013_%28version_1%29.ogg",                                           // Turkey
  "804": "https://upload.wikimedia.org/wikipedia/commons/8/8b/Mykhailo_Zazuliak_%E2%80%94_Shche_ne_vmerla_Ukraina.oga",                                               // Ukraine
  "818": "https://upload.wikimedia.org/wikipedia/commons/f/f2/Bilady%2C_Bilady%2C_Bilady.ogg",                                                                        // Egypt
  "826": "https://upload.wikimedia.org/wikipedia/commons/a/a6/God_Save_the_King_%281927%29.ogg",                                                                      // United Kingdom
  "840": "https://upload.wikimedia.org/wikipedia/commons/2/25/%22The_Star-Spangled_Banner%22_performed_by_the_United_States_Navy_Band.mp3",                           // United States
  "862": "https://upload.wikimedia.org/wikipedia/commons/f/f0/United_States_Navy_Band_-_Gloria_al_Bravo_Pueblo.ogg",                                                  // Venezuela
  "704": "https://upload.wikimedia.org/wikipedia/commons/c/c0/Vietnamese_Ti%E1%BA%BFn_Qu%C3%A2n_Ca.ogg",                                                              // Vietnam
};

// Override hook — populate this in app code to force-set a URL for a country.
export const COUNTRY_ANTHEM_URLS = {};

// Words that signal a sub-regional or unrelated match — skip these results.
const SUBREGION_BLACKLIST = /\b(oblast|krai|republic of|buryatia|kamchatka|tatarstan|chechnya|bashkortostan|kalmykia|chuvashia|gran colombia|tanpa nyanyian|orosz)\b/i;

// localStorage cache: iso → url (or "" for negative cache)
const CACHE_KEY = "geoAtlas.anthemUrls.v2";
const RUNTIME_CACHE = loadCache();

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}
function saveCache() {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(RUNTIME_CACHE)); } catch {}
}

let enabled = true;
try {
  enabled = (localStorage.getItem("geoAtlas.music") ?? "1") !== "0";
} catch {}

export function setMusicEnabled(on) {
  enabled = !!on;
  try { localStorage.setItem("geoAtlas.music", on ? "1" : "0"); } catch {}
  if (!on) stopCurrent();
}
export function isMusicEnabled() { return enabled; }

let currentAudio = null;
let currentIso = null;
let onStateChange = null; // (state, iso) → void;  state ∈ "loading" | "playing" | "stopped"

export function onAnthemState(fn) { onStateChange = fn; }
function emit(state, iso) { try { onStateChange?.(state, iso); } catch {} }

export function stopCurrent() {
  if (!currentAudio) return;
  try { currentAudio.pause(); currentAudio.src = ""; } catch {}
  currentAudio = null;
  const wasIso = currentIso;
  currentIso = null;
  emit("stopped", wasIso);
}

export function hasAnthem(iso) {
  return Boolean(getUrlSync(iso));
}

function getUrlSync(iso) {
  return COUNTRY_ANTHEM_URLS[iso] || RESOLVED_URLS[iso] || RUNTIME_CACHE[iso] || null;
}

async function searchCommons(iso) {
  const meta = COUNTRIES[iso];
  if (!meta) return null;
  const name = meta.name_en;
  const firstWord = name.split(" ")[0].toLowerCase();
  const queries = [
    `intitle:"${name}" anthem`,
    `intitle:"${firstWord}" anthem`,
    `${name} national anthem instrumental`,
    `${name} national anthem`,
  ];
  for (const q of queries) {
    const searchUrl = "https://commons.wikimedia.org/w/api.php"
      + "?action=query&list=search&srnamespace=6&srlimit=15&format=json&origin=*"
      + "&srsearch=" + encodeURIComponent(q);
    let titles = [];
    try {
      const r = await fetch(searchUrl);
      const j = await r.json();
      titles = (j.query?.search ?? []).map((x) => x.title);
    } catch (e) {
      continue;
    }
    const ranked = titles
      .filter((t) => /\.(og[ag]|mp3)$/i.test(t))
      .filter((t) => !/_score|sheet/i.test(t))
      .filter((t) => !SUBREGION_BLACKLIST.test(t));
    if (!ranked.length) continue;
    // Prefer titles matching the country first-word and "instrumental"
    ranked.sort((a, b) => {
      const score = (t) =>
        (new RegExp("\\b" + firstWord + "\\b", "i").test(t) ? 2 : 0) +
        (/instrumental/i.test(t) ? 1 : 0);
      return score(b) - score(a);
    });
    const detailUrl = "https://commons.wikimedia.org/w/api.php"
      + "?action=query&prop=imageinfo&iiprop=url&format=json&origin=*"
      + "&titles=" + encodeURIComponent(ranked[0]);
    try {
      const r = await fetch(detailUrl);
      const j = await r.json();
      const page = Object.values(j.query?.pages || {})[0];
      const url = page?.imageinfo?.[0]?.url;
      if (url) return url;
    } catch (e) {
      continue;
    }
  }
  return null;
}

async function getUrlOrResolve(iso) {
  const known = getUrlSync(iso);
  if (known) return known;
  if (iso in RUNTIME_CACHE) return RUNTIME_CACHE[iso] || null;
  const resolved = await searchCommons(iso);
  RUNTIME_CACHE[iso] = resolved || "";
  saveCache();
  return resolved;
}

export function playAnthemFor(iso) {
  stopCurrent();
  if (!enabled) return;
  currentIso = iso;
  emit("loading", iso);

  const known = getUrlSync(iso);
  if (known) {
    playFromUrl(iso, known);
    return;
  }

  getUrlOrResolve(iso).then((url) => {
    if (currentIso !== iso) return;
    if (!url) { emit("stopped", iso); return; }
    playFromUrl(iso, url);
  });
}

function playFromUrl(iso, url) {
  const audio = new Audio();
  audio.src = url;
  audio.preload = "auto";
  audio.volume = 0.45;

  audio.addEventListener("error", () => {
    const name = COUNTRIES[iso]?.name_en ?? iso;
    console.warn(`Anthem failed to load for ${name} (${iso}). URL: ${url}`);
    if (RUNTIME_CACHE[iso] === url) {
      RUNTIME_CACHE[iso] = "";
      saveCache();
    }
    emit("stopped", iso);
  });
  audio.addEventListener("playing", () => emit("playing", iso));
  audio.addEventListener("ended",  () => { if (currentAudio === audio) emit("stopped", iso); });

  const p = audio.play();
  if (p && typeof p.catch === "function") {
    p.catch((err) => {
      console.warn("Anthem autoplay blocked:", err?.message ?? err);
      emit("stopped", iso);
    });
  }
  currentAudio = audio;
  currentIso = iso;
}
