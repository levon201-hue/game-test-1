// Geographic features beyond political countries — oceans, rivers, lakes,
// mountain peaks, deserts. Each entry has a stable id (string), a category,
// EN + RU names, the metric that makes it superlative (length / area / etc.),
// the region / continent for distractor selection, and a short EN + RU fact.

export const CATEGORIES = {
  OCEAN:    "ocean",
  RIVER:    "river",
  LAKE:     "lake",
  MOUNTAIN: "mountain",
  DESERT:   "desert",
};

// Continent values match COUNTRIES.region in countries.js so we can reuse
// regionName() for display.
export const FEATURES = {
  // ====================== OCEANS ======================
  ocean_pacific: {
    kind: "ocean", area_km2: 165250000, avg_depth_m: 4280,
    name_en: "Pacific Ocean",  name_ru: "Тихий океан",
    fact_en: "The largest and deepest ocean on Earth — bigger than every continent combined. Stretches from the Arctic to the Southern Ocean and contains the Mariana Trench, the deepest point on Earth.",
    fact_ru: "Самый большой и глубокий океан на Земле — превосходит по площади все континенты вместе взятые. Простирается от Арктики до Южного океана и содержит Марианский жёлоб — глубочайшую точку планеты.",
  },
  ocean_atlantic: {
    kind: "ocean", area_km2: 106460000, avg_depth_m: 3646,
    name_en: "Atlantic Ocean", name_ru: "Атлантический океан",
    fact_en: "Second-largest ocean, separating the Americas from Europe and Africa. The S-shape was formed when Pangaea broke apart roughly 200 million years ago.",
    fact_ru: "Второй по величине океан, отделяющий обе Америки от Европы и Африки. S-образная форма образовалась при расколе Пангеи около 200 миллионов лет назад.",
  },
  ocean_indian: {
    kind: "ocean", area_km2: 70560000, avg_depth_m: 3741,
    name_en: "Indian Ocean", name_ru: "Индийский океан",
    fact_en: "Third-largest ocean, bordered by Africa, Asia, Australia, and the Southern Ocean. Warmest of the major oceans on average.",
    fact_ru: "Третий по величине океан, граничащий с Африкой, Азией, Австралией и Южным океаном. В среднем — самый тёплый из крупных океанов.",
  },
  ocean_southern: {
    kind: "ocean", area_km2: 20330000, avg_depth_m: 3270,
    name_en: "Southern Ocean", name_ru: "Южный океан",
    fact_en: "Encircles Antarctica. Officially recognised as the fifth ocean by the IHO in 2000, defined by the Antarctic Circumpolar Current.",
    fact_ru: "Окружает Антарктиду. Официально признан Международной гидрографической организацией пятым океаном в 2000 году; его границы определяются Антарктическим циркумполярным течением.",
  },
  ocean_arctic: {
    kind: "ocean", area_km2: 14060000, avg_depth_m: 1205,
    name_en: "Arctic Ocean", name_ru: "Северный Ледовитый океан",
    fact_en: "Smallest and shallowest of the oceans, mostly covered by sea ice for much of the year. Centred on the geographic North Pole.",
    fact_ru: "Самый маленький и мелкий из океанов, большая часть года покрыт морским льдом. Центрирован на географическом Северном полюсе.",
  },

  // ====================== RIVERS ======================
  river_nile: {
    kind: "river", length_km: 6650, continent: "africa",
    name_en: "Nile", name_ru: "Нил",
    fact_en: "Long considered the longest river in the world, flowing north through eleven African countries to the Mediterranean. Cradled ancient Egyptian civilization.",
    fact_ru: "Долгое время считается самой длинной рекой в мире; течёт на север через одиннадцать африканских стран к Средиземному морю. Колыбель древнеегипетской цивилизации.",
  },
  river_amazon: {
    kind: "river", length_km: 6400, continent: "americas",
    name_en: "Amazon", name_ru: "Амазонка",
    fact_en: "By volume the largest river in the world, discharging more water than the next seven biggest rivers combined. Drains most of northern South America.",
    fact_ru: "По объёму стока — крупнейшая река мира; выносит больше воды, чем следующие семь крупнейших рек вместе взятые. Дренирует большую часть Северной Южной Америки.",
  },
  river_yangtze: {
    kind: "river", length_km: 6300, continent: "asia",
    name_en: "Yangtze", name_ru: "Янцзы",
    fact_en: "Longest river in Asia and the third-longest in the world. Flows entirely within China; site of the Three Gorges Dam, the world's largest hydroelectric station.",
    fact_ru: "Самая длинная река Азии и третья по длине в мире. Целиком течёт в Китае; здесь расположена плотина «Три ущелья» — крупнейшая гидроэлектростанция мира.",
  },
  river_mississippi: {
    kind: "river", length_km: 6275, continent: "americas",
    name_en: "Mississippi", name_ru: "Миссисипи",
    fact_en: "Together with the Missouri it forms the largest drainage system in North America, emptying into the Gulf of Mexico.",
    fact_ru: "Вместе с Миссури образует крупнейшую речную систему Северной Америки, впадает в Мексиканский залив.",
  },
  river_yenisei: {
    kind: "river", length_km: 5539, continent: "asia",
    name_en: "Yenisei", name_ru: "Енисей",
    fact_en: "Greatest river system flowing into the Arctic Ocean. Runs nearly 5,500 km through Siberia from the Mongolian highlands.",
    fact_ru: "Крупнейшая речная система, впадающая в Северный Ледовитый океан. Протекает почти 5 500 км через Сибирь, начинаясь в Монгольских нагорьях.",
  },
  river_yellow: {
    kind: "river", length_km: 5464, continent: "asia",
    name_en: "Yellow River", name_ru: "Хуанхэ",
    fact_en: "Cradle of Chinese civilization. Named for its yellow silt; historically prone to catastrophic floods.",
    fact_ru: "Колыбель китайской цивилизации. Названа за жёлтый ил; исторически подвержена катастрофическим наводнениям.",
  },
  river_ob: {
    kind: "river", length_km: 5410, continent: "asia",
    name_en: "Ob–Irtysh", name_ru: "Обь",
    fact_en: "Major Siberian river draining western Siberia into the Arctic Ocean's Kara Sea.",
    fact_ru: "Крупная сибирская река, дренирующая Западную Сибирь и впадающая в Карское море Северного Ледовитого океана.",
  },
  river_congo: {
    kind: "river", length_km: 4700, continent: "africa",
    name_en: "Congo", name_ru: "Конго",
    fact_en: "Second-longest river in Africa and the deepest in the world, with depths exceeding 220 m. Crosses the Equator twice.",
    fact_ru: "Вторая по длине река Африки и самая глубокая в мире — глубины превышают 220 м. Дважды пересекает экватор.",
  },
  river_volga: {
    kind: "river", length_km: 3530, continent: "europe",
    name_en: "Volga", name_ru: "Волга",
    fact_en: "Longest river in Europe and the national river of Russia. Drains into the Caspian Sea.",
    fact_ru: "Самая длинная река Европы и национальная река России. Впадает в Каспийское море.",
  },
  river_danube: {
    kind: "river", length_km: 2860, continent: "europe",
    name_en: "Danube", name_ru: "Дунай",
    fact_en: "Second-longest river in Europe, flowing through or bordering ten countries from Germany to the Black Sea — more than any other river.",
    fact_ru: "Вторая по длине река Европы; протекает через или по границе десяти стран от Германии до Чёрного моря — больше, чем любая другая река.",
  },
  river_ganges: {
    kind: "river", length_km: 2525, continent: "asia",
    name_en: "Ganges", name_ru: "Ганг",
    fact_en: "Sacred river of Hinduism, rising in the Indian Himalayas and flowing through northern India and Bangladesh to the Bay of Bengal.",
    fact_ru: "Священная река индуизма, берущая начало в индийских Гималаях и текущая через северную Индию и Бангладеш к Бенгальскому заливу.",
  },
  river_mekong: {
    kind: "river", length_km: 4350, continent: "asia",
    name_en: "Mekong", name_ru: "Меконг",
    fact_en: "Crosses six countries from the Tibetan Plateau to the South China Sea. Supports one of the world's most productive freshwater fisheries.",
    fact_ru: "Пересекает шесть стран от Тибетского плато до Южно-Китайского моря. Поддерживает одно из самых продуктивных пресноводных рыболовств мира.",
  },

  // ====================== LAKES (and inland seas) ======================
  lake_caspian: {
    kind: "lake", area_km2: 371000, max_depth_m: 1025, continent: "asia",
    name_en: "Caspian Sea", name_ru: "Каспийское море",
    fact_en: "Largest enclosed body of water on Earth — geologically a sea but landlocked. Bordered by Russia, Kazakhstan, Turkmenistan, Iran, and Azerbaijan.",
    fact_ru: "Крупнейший в мире замкнутый водоём — геологически море, но окружённое сушей. Граничит с Россией, Казахстаном, Туркменистаном, Ираном и Азербайджаном.",
  },
  lake_superior: {
    kind: "lake", area_km2: 82100, max_depth_m: 406, continent: "americas",
    name_en: "Lake Superior", name_ru: "Озеро Верхнее",
    fact_en: "Largest of the North American Great Lakes by surface area — bigger than all the others combined. Shared by Canada and the United States.",
    fact_ru: "Крупнейшее по площади из Великих озёр Северной Америки — больше всех остальных вместе взятых. Разделено между Канадой и США.",
  },
  lake_victoria: {
    kind: "lake", area_km2: 68800, max_depth_m: 83, continent: "africa",
    name_en: "Lake Victoria", name_ru: "Озеро Виктория",
    fact_en: "Largest lake in Africa by area, source of the White Nile, and the third-largest freshwater lake in the world.",
    fact_ru: "Крупнейшее по площади озеро Африки, исток Белого Нила и третье по величине пресноводное озеро мира.",
  },
  lake_baikal: {
    kind: "lake", area_km2: 31722, max_depth_m: 1642, continent: "asia",
    name_en: "Lake Baikal", name_ru: "Байкал",
    fact_en: "Deepest lake in the world (1,642 m) and the largest by volume — holds about 23% of all liquid surface fresh water on Earth.",
    fact_ru: "Самое глубокое озеро мира (1 642 м) и крупнейшее по объёму — содержит около 23% всей жидкой пресной поверхностной воды на Земле.",
  },
  lake_tanganyika: {
    kind: "lake", area_km2: 32900, max_depth_m: 1470, continent: "africa",
    name_en: "Lake Tanganyika", name_ru: "Танганьика",
    fact_en: "Second-deepest lake in the world and the longest freshwater lake. Sits along the East African Rift between Tanzania, DRC, Burundi and Zambia.",
    fact_ru: "Второе по глубине озеро мира и самое длинное пресноводное озеро. Лежит вдоль Восточно-Африканского рифта между Танзанией, ДРК, Бурунди и Замбией.",
  },

  // ====================== MOUNTAINS ======================
  mt_everest: {
    kind: "mountain", height_m: 8849, continent: "asia",
    name_en: "Mount Everest", name_ru: "Эверест",
    fact_en: "Highest mountain on Earth above sea level (8,849 m), in the Mahalangur range of the Himalayas between Nepal and the Tibet Autonomous Region of China.",
    fact_ru: "Высочайшая гора на Земле над уровнем моря (8 849 м), в хребте Махалангур Гималаев между Непалом и Тибетским автономным районом Китая.",
  },
  mt_k2: {
    kind: "mountain", height_m: 8611, continent: "asia",
    name_en: "K2", name_ru: "К2 (Чогори)",
    fact_en: "Second-highest mountain on Earth (8,611 m), in the Karakoram range on the China–Pakistan border. Notoriously difficult to climb.",
    fact_ru: "Вторая по высоте гора Земли (8 611 м), в хребте Каракорум на границе Китая и Пакистана. Печально известна сложностью восхождения.",
  },
  mt_aconcagua: {
    kind: "mountain", height_m: 6961, continent: "americas",
    name_en: "Aconcagua", name_ru: "Аконкагуа",
    fact_en: "Highest mountain outside Asia, in the Andes of Argentina. Tallest peak in both the Western and Southern Hemispheres.",
    fact_ru: "Высочайшая гора за пределами Азии, в Андах Аргентины. Наивысшая точка Западного и Южного полушарий.",
  },
  mt_kilimanjaro: {
    kind: "mountain", height_m: 5895, continent: "africa",
    name_en: "Mount Kilimanjaro", name_ru: "Килиманджаро",
    fact_en: "Highest mountain in Africa and the tallest free-standing mountain in the world. A dormant volcano in northern Tanzania.",
    fact_ru: "Высочайшая гора Африки и самая высокая отдельно стоящая гора в мире. Спящий вулкан в северной Танзании.",
  },
  mt_denali: {
    kind: "mountain", height_m: 6190, continent: "americas",
    name_en: "Denali", name_ru: "Денали",
    fact_en: "Highest peak in North America (6,190 m), in the Alaska Range. Formerly called Mount McKinley.",
    fact_ru: "Высочайшая вершина Северной Америки (6 190 м), в Аляскинском хребте. Прежнее название — Мак-Кинли.",
  },
  mt_elbrus: {
    kind: "mountain", height_m: 5642, continent: "europe",
    name_en: "Mount Elbrus", name_ru: "Эльбрус",
    fact_en: "Highest mountain in Europe (5,642 m), a dormant volcano in the Caucasus of southern Russia.",
    fact_ru: "Высочайшая гора Европы (5 642 м), спящий вулкан на Кавказе на юге России.",
  },

  // ====================== DESERTS ======================
  desert_sahara: {
    kind: "desert", area_km2: 9200000, continent: "africa",
    name_en: "Sahara", name_ru: "Сахара",
    fact_en: "Largest hot desert in the world, covering most of North Africa across roughly 9.2 million km² — about the size of the United States.",
    fact_ru: "Крупнейшая жаркая пустыня мира, занимающая большую часть Северной Африки на площади около 9,2 млн км² — примерно равной размеру США.",
  },
  desert_antarctic: {
    kind: "desert", area_km2: 14200000, continent: "oceania",
    name_en: "Antarctic Desert", name_ru: "Антарктическая пустыня",
    fact_en: "By the meteorological definition (very low precipitation) Antarctica is the largest desert on Earth at ~14.2 million km².",
    fact_ru: "По метеорологическому определению (очень малое количество осадков) Антарктида — крупнейшая пустыня Земли площадью ~14,2 млн км².",
  },
  desert_arabian: {
    kind: "desert", area_km2: 2330000, continent: "middle_east",
    name_en: "Arabian Desert", name_ru: "Аравийская пустыня",
    fact_en: "Vast desert covering most of the Arabian Peninsula, including the Rub' al Khali — the largest contiguous sand desert in the world.",
    fact_ru: "Обширная пустыня, покрывающая большую часть Аравийского полуострова, включая Руб-эль-Хали — крупнейшую сплошную песчаную пустыню в мире.",
  },
  desert_gobi: {
    kind: "desert", area_km2: 1295000, continent: "asia",
    name_en: "Gobi Desert", name_ru: "Пустыня Гоби",
    fact_en: "Large cold desert in northern China and southern Mongolia. Known for its dinosaur fossils and the historical Silk Road routes crossing it.",
    fact_ru: "Крупная холодная пустыня в северном Китае и южной Монголии. Известна окаменелостями динозавров и историческими маршрутами Великого шёлкового пути.",
  },
};

// Convenience: group ids by kind
export function idsByKind(kind) {
  return Object.entries(FEATURES)
    .filter(([, f]) => f.kind === kind)
    .map(([id]) => id);
}

// Convenience: emoji glyph per category (used in info card subtitle)
export function kindEmoji(kind) {
  switch (kind) {
    case "ocean":    return "🌊";
    case "river":    return "🏞️";
    case "lake":     return "💧";
    case "mountain": return "⛰️";
    case "desert":   return "🏜️";
    default: return "📍";
  }
}
