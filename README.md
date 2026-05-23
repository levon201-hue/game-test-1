# GeoGuess Atlas

A bilingual (English / Russian) educational geography quiz played on an interactive 3D globe. No timer, no game-over screen — you progress at your own pace, and after every answer the game opens a country card with a history blurb, capital, population, area, languages, the flag, and the country's national anthem.

![GeoGuess Atlas](https://flagcdn.com/w160/un.png)

---

## Features

- **Realistic 3D Earth** rendered with Three.js — actual NASA-style diffuse texture, atmospheric glow, starfield.
- **3 question types** in every session:
  - **Where is X?** — click the country on the globe.
  - **Capital of X?** — pick from 4 capital choices.
  - **Which country has capital X?** — click the country on the globe.
- **30 questions per session**, difficulty-curved from iconic to obscure.
- **Country info card** after every answer — flag, region, capital, population, area, languages, and a short history paragraph.
- **National anthems** play when the info card opens (~50 verified URLs seeded; remaining countries resolve at runtime via the Wikimedia Commons API and cache locally).
- **Procedural UI sound effects** (click / correct / wrong / flag-plant) via Web Audio — no audio asset files needed.
- **Planted flags** stay on every country you have ever correctly identified, persisted in `localStorage`.
- **Smooth camera auto-focus** to the country's location after each answer.
- **EN / RU bilingual** — UI strings, country names, capitals, and 50+ histories are localized; one click in the language toggle flips everything.
- **Offline-friendly** — once you have loaded the page and the country topology once, gameplay works without internet (anthems and flag images stream from CDNs).
- **No build step** — vanilla JS ES modules, no bundler, no framework, no `npm install`.

---

## Quick start

### 1. Start the server

The project ships with a small PowerShell static-file server that binds to all network interfaces (so you can also play from your phone on the same Wi-Fi).

From the project root in a regular PowerShell window:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .claude/server.ps1 -Port 8765
```

You'll see something like:

```
GeoGuess Atlas server is running.
Open on THIS computer:
  http://localhost:8765/
Open on another device (same Wi-Fi / LAN):
  http://192.168.0.175:8765/
```

Leave that window open while you play; closing it stops the server.

### 2. Open the game

| Device | URL |
| --- | --- |
| This computer | `http://localhost:8765/` |
| Phone / other laptop on the same Wi-Fi | the LAN URL the server printed |

### 3. Windows Firewall (first time only)

The first time a device on your LAN connects, Windows Firewall may prompt to allow `powershell.exe` for **Private networks** — click **Allow**. If no prompt appears but external devices still can't connect, run this once in an **Administrator** PowerShell:

```powershell
New-NetFirewallRule -DisplayName "GeoGuess Atlas (8765)" `
  -Direction Inbound -Protocol TCP -LocalPort 8765 -Action Allow `
  -Profile Private,Domain
```

---

## Project layout

```
Game/
├── index.html              HUD scaffolding, Three.js import map
├── style.css               Amber-on-deep-navy "atlas" theme
├── README.md               You are here
├── .claude/
│   ├── server.ps1          TcpListener static server (works on LAN, no admin)
│   └── launch.json         Claude Code preview config
└── src/
    ├── main.js             Orchestrator — wires globe ↔ game ↔ UI
    ├── globe.js            Three.js scene, Earth texture, picking, flag planting, camera focus
    ├── geo.js              TopoJSON → triangulated 3D country meshes
    ├── countries.js        ~150 countries: iso2, region, capital, pop, area, langs, name_en/ru
    ├── histories.js        50+ country history blurbs in EN + RU
    ├── i18n.js             Locale dictionary, getters, formatters
    ├── flags.js            Lazy-load flag PNGs from flagcdn.com
    ├── audio.js            Procedural Web Audio sound effects
    ├── anthems.js          Anthem player with seed URLs + runtime resolver + LS cache
    ├── quiz.js             Question-type generator + candidate-pool builder
    ├── game.js             State machine, scoring, session
    └── rng.js              Seedable mulberry32 PRNG
```

---

## Tech stack

- **Three.js** (via [unpkg.com](https://unpkg.com/) import map) — globe, raycasting, OrbitControls.
- **TopoJSON** + **earcut** (via jsDelivr) — country boundary triangulation.
- **flagcdn.com** — flag PNGs at `https://flagcdn.com/w160/{iso2}.png`.
- **Wikimedia Commons API** — anthem URL discovery at runtime.
- **threejs.org/examples/textures/planets/earth_atmos_2048.jpg** — Earth diffuse texture.
- **Vanilla JS** ES modules — no build, no framework.

---

## Configuration

### Toggling sound and music

Two icon buttons in the top-right HUD (`🔊` and `♪`) toggle UI sounds and country music. Preferences are persisted in `localStorage` (`geoAtlas.sfx`, `geoAtlas.music`).

### Adding or overriding anthem URLs

`src/anthems.js` ships with **`RESOLVED_URLS`** — ~50 pre-verified Wikimedia Commons recordings. For any country missing from that map, the player searches the Commons API at runtime and caches the result.

To **force** a specific URL for a country (overrides both the seed map and the runtime cache), set an entry on `COUNTRY_ANTHEM_URLS` in `src/anthems.js`:

```js
export const COUNTRY_ANTHEM_URLS = {
  "036": "https://upload.wikimedia.org/wikipedia/commons/.../my-preferred-au-recording.ogg",
  // ISO 3166-1 numeric code (3-digit string) → audio URL
};
```

### Clearing the runtime anthem cache

```js
localStorage.removeItem("geoAtlas.anthemUrls.v2");
```

### Switching language

Click `EN` or `RU` in the top-left or top-right of the start screen. The choice persists across sessions via `localStorage.geoAtlas.locale`.

---

## Extending the game

### Adding more countries with rich data

Open `src/countries.js`. Each row is one line:

```js
"643": { iso2:"ru", tier:1, region:"europe", area:17098242, pop:144000000,
         langs:["Russian"], name_en:"Russia", name_ru:"Россия",
         cap_en:"Moscow", cap_ru:"Москва" },
```

- **iso** key — ISO 3166-1 numeric, zero-padded to 3 digits (matches `world-atlas-110m.json`).
- **tier** — `1` iconic, `2` medium, `3` obscure. Drives the difficulty curve.
- **region** — `africa | americas | asia | europe | oceania | middle_east`.

### Adding history blurbs

Open `src/histories.js`:

```js
"643": {
  en: "Largest country in the world by area, spanning 11 time zones. ...",
  ru: "Крупнейшая страна мира по площади, охватывает 11 часовых поясов. ...",
},
```

A short 2–4 sentence paragraph in each locale. Countries without an entry fall back to `i18n.t("history_missing")`.

### Adding a third locale

Add a key under `STRINGS` in `src/i18n.js` (e.g. `de` for German) and add `name_de`, `cap_de` columns to the rows in `countries.js`. Then the existing `setLocale("de")` call will switch the UI.

---

## Persistence

All persistence uses `localStorage`. No backend, no accounts, no telemetry.

| Key | Purpose |
| --- | --- |
| `geoAtlas.locale` | `"en"` or `"ru"` |
| `geoAtlas.sfx` | `"1"` / `"0"` — sound effects on/off |
| `geoAtlas.music` | `"1"` / `"0"` — anthem playback on/off |
| `geoAtlas.best.score` | Best session score |
| `geoAtlas.discoveredAll` | JSON array of every ISO ever correctly answered (flags stay planted) |
| `geoAtlas.anthemUrls.v2` | Runtime-resolved anthem URL cache |

---

## Architecture

```
                 ┌───────────────┐
                 │   index.html  │
                 │  HUD + modals │
                 └───────┬───────┘
                         │
                ┌────────▼─────────┐
                │     main.js      │
                │  (orchestrator)  │
                └─┬──────────┬────┬┘
                  │          │    │
        ┌─────────▼┐   ┌─────▼───▼──┐   ┌─────────────┐
        │ globe.js │   │  game.js   │   │   i18n.js   │
        │ Three.js │   │  state +   │   │  locale     │
        │ scene    │◄──┤  scoring   ├──►│  strings    │
        │ picking  │   │            │   │             │
        │ flags    │   └────┬───────┘   └─────────────┘
        └────┬─────┘        │
             │         ┌────▼────┐
             │         │ quiz.js │
        ┌────▼────┐    │ questions
        │ geo.js  │    └─────────┘
        │ TopoJSON│
        │ → meshes│
        └─────────┘

        Side modules: rng.js, flags.js, audio.js, anthems.js, histories.js, countries.js
```

---

## Browser support

Tested on recent Chrome, Edge, and Firefox. Requires support for:

- ES modules + import maps
- WebGL2
- Web Audio API
- `fetch` and `localStorage`

Mobile browsers (recent iOS Safari, Android Chrome) work — touch-drag rotates the globe and tap selects countries. Some browser auto-play policies will silence the anthem on the very first question until the player has interacted; this is normal browser behaviour.

---

## Credits and attribution

- **Globe topology** — Natural Earth via [world-atlas](https://github.com/topojson/world-atlas) (CC0).
- **Flag images** — [flagcdn.com](https://flagcdn.com) (open API).
- **National anthem recordings** — [Wikimedia Commons](https://commons.wikimedia.org/), each linked URL points to a recording hosted there. The audio is streamed from Commons; no recordings are bundled in this repository. Compositions of national anthems are public-domain by age; individual recording rights vary — every URL in `RESOLVED_URLS` was resolved against the Commons API, which only catalogues files compatible with Commons' free-content licensing policies.
- **Earth diffuse texture** — from the [three.js examples](https://threejs.org/examples/) collection.
- **Three.js** — © three.js authors, MIT licence.

---

## Troubleshooting

**The page is blank.** Open browser dev-tools and check the Console for errors. The most common cause is the static server not running — see *Quick start*.

**Anthems don't play.** Browsers block auto-play until the user has interacted with the page; the first click (e.g., the **Start learning** button) unlocks the audio context. If a specific country's anthem fails, the system silently no-ops and caches a negative result for that ISO. To retry it, run `localStorage.removeItem("geoAtlas.anthemUrls.v2")` and reload.

**The phone says "site can't be reached".** You're probably blocked by Windows Firewall — see the *Firewall* section in *Quick start*. Also confirm both devices are on the same Wi-Fi (mobile data won't reach a `192.168.x.x` address).

**Countries look black at first.** The Earth diffuse texture is loading from `threejs.org`. Give it a couple of seconds the first time; subsequent loads are cached.

---

## Licence

The game source in this repository is provided as-is for learning and personal use. External assets (flags, anthems, Earth texture) belong to their respective sources and are streamed in — they are not bundled in this repository.
