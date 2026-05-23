// Country metadata keyed by ISO 3166-1 numeric (3-digit, matches world-atlas-110m).
// region: africa | americas | asia | europe | oceania | middle_east
// Each row uses compact single-line form for readability.
//
// Field reference:
//   iso2   ISO 3166-1 alpha-2 (used by flagcdn for flag PNGs)
//   tier   1 = iconic, 2 = medium, 3 = harder/smaller
//   pop    population (rounded, year ~2023)
//   area   land area km²
//   langs  major / official languages (EN names)
//   name_en/name_ru   country name in each locale
//   cap_en/cap_ru     capital name in each locale

export const COUNTRIES = {
  "004": { iso2:"af", tier:3, region:"middle_east", area:652864,   pop:41100000, langs:["Pashto","Dari"],            name_en:"Afghanistan",            name_ru:"Афганистан",          cap_en:"Kabul",       cap_ru:"Кабул" },
  "008": { iso2:"al", tier:3, region:"europe",      area:28748,    pop:2800000,  langs:["Albanian"],                 name_en:"Albania",                name_ru:"Албания",             cap_en:"Tirana",      cap_ru:"Тирана" },
  "012": { iso2:"dz", tier:2, region:"africa",      area:2381741,  pop:45000000, langs:["Arabic","Berber"],          name_en:"Algeria",                name_ru:"Алжир",               cap_en:"Algiers",     cap_ru:"Алжир" },
  "024": { iso2:"ao", tier:3, region:"africa",      area:1246700,  pop:35600000, langs:["Portuguese"],               name_en:"Angola",                 name_ru:"Ангола",              cap_en:"Luanda",      cap_ru:"Луанда" },
  "032": { iso2:"ar", tier:1, region:"americas",    area:2780400,  pop:46200000, langs:["Spanish"],                  name_en:"Argentina",              name_ru:"Аргентина",           cap_en:"Buenos Aires",cap_ru:"Буэнос-Айрес" },
  "051": { iso2:"am", tier:3, region:"middle_east", area:29743,    pop:2780000,  langs:["Armenian"],                 name_en:"Armenia",                name_ru:"Армения",             cap_en:"Yerevan",     cap_ru:"Ереван" },
  "036": { iso2:"au", tier:1, region:"oceania",     area:7692024,  pop:26400000, langs:["English"],                  name_en:"Australia",              name_ru:"Австралия",           cap_en:"Canberra",    cap_ru:"Канберра" },
  "040": { iso2:"at", tier:2, region:"europe",      area:83879,    pop:9100000,  langs:["German"],                   name_en:"Austria",                name_ru:"Австрия",             cap_en:"Vienna",      cap_ru:"Вена" },
  "031": { iso2:"az", tier:3, region:"middle_east", area:86600,    pop:10100000, langs:["Azerbaijani"],              name_en:"Azerbaijan",             name_ru:"Азербайджан",         cap_en:"Baku",        cap_ru:"Баку" },
  "050": { iso2:"bd", tier:2, region:"asia",        area:148460,   pop:172000000,langs:["Bengali"],                  name_en:"Bangladesh",             name_ru:"Бангладеш",           cap_en:"Dhaka",       cap_ru:"Дакка" },
  "112": { iso2:"by", tier:3, region:"europe",      area:207600,   pop:9200000,  langs:["Belarusian","Russian"],     name_en:"Belarus",                name_ru:"Беларусь",            cap_en:"Minsk",       cap_ru:"Минск" },
  "056": { iso2:"be", tier:2, region:"europe",      area:30528,    pop:11700000, langs:["Dutch","French","German"],  name_en:"Belgium",                name_ru:"Бельгия",             cap_en:"Brussels",    cap_ru:"Брюссель" },
  "204": { iso2:"bj", tier:3, region:"africa",      area:114763,   pop:13400000, langs:["French"],                   name_en:"Benin",                  name_ru:"Бенин",               cap_en:"Porto-Novo",  cap_ru:"Порто-Ново" },
  "064": { iso2:"bt", tier:3, region:"asia",        area:38394,    pop:780000,   langs:["Dzongkha"],                 name_en:"Bhutan",                 name_ru:"Бутан",               cap_en:"Thimphu",     cap_ru:"Тхимпху" },
  "068": { iso2:"bo", tier:3, region:"americas",    area:1098581,  pop:12100000, langs:["Spanish","Quechua","Aymara"],name_en:"Bolivia",               name_ru:"Боливия",             cap_en:"Sucre",       cap_ru:"Сукре" },
  "070": { iso2:"ba", tier:3, region:"europe",      area:51197,    pop:3200000,  langs:["Bosnian","Croatian","Serbian"],name_en:"Bosnia and Herzegovina",name_ru:"Босния и Герцеговина",cap_en:"Sarajevo",    cap_ru:"Сараево" },
  "072": { iso2:"bw", tier:3, region:"africa",      area:581730,   pop:2600000,  langs:["English","Tswana"],         name_en:"Botswana",               name_ru:"Ботсвана",            cap_en:"Gaborone",    cap_ru:"Габороне" },
  "076": { iso2:"br", tier:1, region:"americas",    area:8515767,  pop:215300000,langs:["Portuguese"],               name_en:"Brazil",                 name_ru:"Бразилия",            cap_en:"Brasília",    cap_ru:"Бразилиа" },
  "100": { iso2:"bg", tier:3, region:"europe",      area:110879,   pop:6800000,  langs:["Bulgarian"],                name_en:"Bulgaria",               name_ru:"Болгария",            cap_en:"Sofia",       cap_ru:"София" },
  "854": { iso2:"bf", tier:3, region:"africa",      area:272967,   pop:22700000, langs:["French"],                   name_en:"Burkina Faso",           name_ru:"Буркина-Фасо",        cap_en:"Ouagadougou", cap_ru:"Уагадугу" },
  "108": { iso2:"bi", tier:3, region:"africa",      area:27834,    pop:13200000, langs:["Kirundi","French"],         name_en:"Burundi",                name_ru:"Бурунди",             cap_en:"Gitega",      cap_ru:"Гитега" },
  "116": { iso2:"kh", tier:2, region:"asia",        area:181035,   pop:16800000, langs:["Khmer"],                    name_en:"Cambodia",               name_ru:"Камбоджа",            cap_en:"Phnom Penh",  cap_ru:"Пномпень" },
  "120": { iso2:"cm", tier:3, region:"africa",      area:475442,   pop:27900000, langs:["French","English"],         name_en:"Cameroon",               name_ru:"Камерун",             cap_en:"Yaoundé",     cap_ru:"Яунде" },
  "124": { iso2:"ca", tier:1, region:"americas",    area:9984670,  pop:39300000, langs:["English","French"],         name_en:"Canada",                 name_ru:"Канада",              cap_en:"Ottawa",      cap_ru:"Оттава" },
  "140": { iso2:"cf", tier:3, region:"africa",      area:622984,   pop:5500000,  langs:["French","Sango"],           name_en:"Central African Republic",name_ru:"Центральноафриканская Республика",cap_en:"Bangui",cap_ru:"Банги" },
  "148": { iso2:"td", tier:3, region:"africa",      area:1284000,  pop:17700000, langs:["French","Arabic"],          name_en:"Chad",                   name_ru:"Чад",                 cap_en:"N'Djamena",   cap_ru:"Нджамена" },
  "152": { iso2:"cl", tier:2, region:"americas",    area:756102,   pop:19600000, langs:["Spanish"],                  name_en:"Chile",                  name_ru:"Чили",                cap_en:"Santiago",    cap_ru:"Сантьяго" },
  "156": { iso2:"cn", tier:1, region:"asia",        area:9596961,  pop:1412000000,langs:["Mandarin Chinese"],        name_en:"China",                  name_ru:"Китай",               cap_en:"Beijing",     cap_ru:"Пекин" },
  "170": { iso2:"co", tier:2, region:"americas",    area:1141748,  pop:52000000, langs:["Spanish"],                  name_en:"Colombia",               name_ru:"Колумбия",            cap_en:"Bogotá",      cap_ru:"Богота" },
  "178": { iso2:"cg", tier:3, region:"africa",      area:342000,   pop:5800000,  langs:["French"],                   name_en:"Republic of the Congo",  name_ru:"Республика Конго",    cap_en:"Brazzaville", cap_ru:"Браззавиль" },
  "180": { iso2:"cd", tier:3, region:"africa",      area:2344858,  pop:99000000, langs:["French"],                   name_en:"Dem. Rep. of the Congo", name_ru:"ДР Конго",            cap_en:"Kinshasa",    cap_ru:"Киншаса" },
  "188": { iso2:"cr", tier:3, region:"americas",    area:51100,    pop:5200000,  langs:["Spanish"],                  name_en:"Costa Rica",             name_ru:"Коста-Рика",          cap_en:"San José",    cap_ru:"Сан-Хосе" },
  "384": { iso2:"ci", tier:3, region:"africa",      area:322463,   pop:28100000, langs:["French"],                   name_en:"Côte d'Ivoire",          name_ru:"Кот-д'Ивуар",         cap_en:"Yamoussoukro",cap_ru:"Ямусукро" },
  "191": { iso2:"hr", tier:3, region:"europe",      area:56594,    pop:3900000,  langs:["Croatian"],                 name_en:"Croatia",                name_ru:"Хорватия",            cap_en:"Zagreb",      cap_ru:"Загреб" },
  "192": { iso2:"cu", tier:2, region:"americas",    area:109884,   pop:11200000, langs:["Spanish"],                  name_en:"Cuba",                   name_ru:"Куба",                cap_en:"Havana",      cap_ru:"Гавана" },
  "203": { iso2:"cz", tier:2, region:"europe",      area:78867,    pop:10500000, langs:["Czech"],                    name_en:"Czechia",                name_ru:"Чехия",               cap_en:"Prague",      cap_ru:"Прага" },
  "208": { iso2:"dk", tier:2, region:"europe",      area:42933,    pop:5900000,  langs:["Danish"],                   name_en:"Denmark",                name_ru:"Дания",               cap_en:"Copenhagen",  cap_ru:"Копенгаген" },
  "214": { iso2:"do", tier:3, region:"americas",    area:48671,    pop:11200000, langs:["Spanish"],                  name_en:"Dominican Republic",     name_ru:"Доминиканская Республика",cap_en:"Santo Domingo",cap_ru:"Санто-Доминго" },
  "218": { iso2:"ec", tier:3, region:"americas",    area:283561,   pop:18000000, langs:["Spanish"],                  name_en:"Ecuador",                name_ru:"Эквадор",             cap_en:"Quito",       cap_ru:"Кито" },
  "818": { iso2:"eg", tier:1, region:"middle_east", area:1001450,  pop:111000000,langs:["Arabic"],                   name_en:"Egypt",                  name_ru:"Египет",              cap_en:"Cairo",       cap_ru:"Каир" },
  "222": { iso2:"sv", tier:3, region:"americas",    area:21041,    pop:6300000,  langs:["Spanish"],                  name_en:"El Salvador",            name_ru:"Сальвадор",           cap_en:"San Salvador",cap_ru:"Сан-Сальвадор" },
  "232": { iso2:"er", tier:3, region:"africa",      area:117600,   pop:3600000,  langs:["Tigrinya","Arabic","English"],name_en:"Eritrea",              name_ru:"Эритрея",             cap_en:"Asmara",      cap_ru:"Асмэра" },
  "233": { iso2:"ee", tier:3, region:"europe",      area:45227,    pop:1330000,  langs:["Estonian"],                 name_en:"Estonia",                name_ru:"Эстония",             cap_en:"Tallinn",     cap_ru:"Таллин" },
  "231": { iso2:"et", tier:2, region:"africa",      area:1104300,  pop:123000000,langs:["Amharic"],                  name_en:"Ethiopia",               name_ru:"Эфиопия",             cap_en:"Addis Ababa", cap_ru:"Аддис-Абеба" },
  "242": { iso2:"fj", tier:3, region:"oceania",     area:18272,    pop:930000,   langs:["English","Fijian","Hindi"], name_en:"Fiji",                   name_ru:"Фиджи",               cap_en:"Suva",        cap_ru:"Сува" },
  "246": { iso2:"fi", tier:2, region:"europe",      area:338424,   pop:5600000,  langs:["Finnish","Swedish"],        name_en:"Finland",                name_ru:"Финляндия",           cap_en:"Helsinki",    cap_ru:"Хельсинки" },
  "250": { iso2:"fr", tier:1, region:"europe",      area:551695,   pop:68000000, langs:["French"],                   name_en:"France",                 name_ru:"Франция",             cap_en:"Paris",       cap_ru:"Париж" },
  "266": { iso2:"ga", tier:3, region:"africa",      area:267668,   pop:2400000,  langs:["French"],                   name_en:"Gabon",                  name_ru:"Габон",               cap_en:"Libreville",  cap_ru:"Либревиль" },
  "268": { iso2:"ge", tier:3, region:"middle_east", area:69700,    pop:3700000,  langs:["Georgian"],                 name_en:"Georgia",                name_ru:"Грузия",              cap_en:"Tbilisi",     cap_ru:"Тбилиси" },
  "276": { iso2:"de", tier:1, region:"europe",      area:357022,   pop:84000000, langs:["German"],                   name_en:"Germany",                name_ru:"Германия",            cap_en:"Berlin",      cap_ru:"Берлин" },
  "288": { iso2:"gh", tier:3, region:"africa",      area:238533,   pop:33500000, langs:["English"],                  name_en:"Ghana",                  name_ru:"Гана",                cap_en:"Accra",       cap_ru:"Аккра" },
  "300": { iso2:"gr", tier:2, region:"europe",      area:131957,   pop:10400000, langs:["Greek"],                    name_en:"Greece",                 name_ru:"Греция",              cap_en:"Athens",      cap_ru:"Афины" },
  "304": { iso2:"gl", tier:2, region:"americas",    area:2166086,  pop:56000,    langs:["Greenlandic","Danish"],     name_en:"Greenland",              name_ru:"Гренландия",          cap_en:"Nuuk",        cap_ru:"Нуук" },
  "320": { iso2:"gt", tier:3, region:"americas",    area:108889,   pop:17800000, langs:["Spanish"],                  name_en:"Guatemala",              name_ru:"Гватемала",           cap_en:"Guatemala City",cap_ru:"Гватемала" },
  "324": { iso2:"gn", tier:3, region:"africa",      area:245857,   pop:13900000, langs:["French"],                   name_en:"Guinea",                 name_ru:"Гвинея",              cap_en:"Conakry",     cap_ru:"Конакри" },
  "328": { iso2:"gy", tier:3, region:"americas",    area:214969,   pop:810000,   langs:["English"],                  name_en:"Guyana",                 name_ru:"Гайана",              cap_en:"Georgetown",  cap_ru:"Джорджтаун" },
  "332": { iso2:"ht", tier:3, region:"americas",    area:27750,    pop:11600000, langs:["French","Haitian Creole"],  name_en:"Haiti",                  name_ru:"Гаити",               cap_en:"Port-au-Prince",cap_ru:"Порт-о-Пренс" },
  "340": { iso2:"hn", tier:3, region:"americas",    area:112492,   pop:10400000, langs:["Spanish"],                  name_en:"Honduras",               name_ru:"Гондурас",            cap_en:"Tegucigalpa", cap_ru:"Тегусигальпа" },
  "348": { iso2:"hu", tier:2, region:"europe",      area:93028,    pop:9700000,  langs:["Hungarian"],                name_en:"Hungary",                name_ru:"Венгрия",             cap_en:"Budapest",    cap_ru:"Будапешт" },
  "352": { iso2:"is", tier:2, region:"europe",      area:103000,   pop:380000,   langs:["Icelandic"],                name_en:"Iceland",                name_ru:"Исландия",            cap_en:"Reykjavík",   cap_ru:"Рейкьявик" },
  "356": { iso2:"in", tier:1, region:"asia",        area:3287263,  pop:1417000000,langs:["Hindi","English"],         name_en:"India",                  name_ru:"Индия",               cap_en:"New Delhi",   cap_ru:"Нью-Дели" },
  "360": { iso2:"id", tier:2, region:"asia",        area:1904569,  pop:278000000,langs:["Indonesian"],               name_en:"Indonesia",              name_ru:"Индонезия",           cap_en:"Jakarta",     cap_ru:"Джакарта" },
  "364": { iso2:"ir", tier:2, region:"middle_east", area:1648195,  pop:88500000, langs:["Persian"],                  name_en:"Iran",                   name_ru:"Иран",                cap_en:"Tehran",      cap_ru:"Тегеран" },
  "368": { iso2:"iq", tier:2, region:"middle_east", area:438317,   pop:44500000, langs:["Arabic","Kurdish"],         name_en:"Iraq",                   name_ru:"Ирак",                cap_en:"Baghdad",     cap_ru:"Багдад" },
  "372": { iso2:"ie", tier:2, region:"europe",      area:70273,    pop:5100000,  langs:["English","Irish"],          name_en:"Ireland",                name_ru:"Ирландия",            cap_en:"Dublin",      cap_ru:"Дублин" },
  "376": { iso2:"il", tier:2, region:"middle_east", area:20770,    pop:9700000,  langs:["Hebrew","Arabic"],          name_en:"Israel",                 name_ru:"Израиль",             cap_en:"Jerusalem",   cap_ru:"Иерусалим" },
  "380": { iso2:"it", tier:1, region:"europe",      area:301340,   pop:59000000, langs:["Italian"],                  name_en:"Italy",                  name_ru:"Италия",              cap_en:"Rome",        cap_ru:"Рим" },
  "388": { iso2:"jm", tier:3, region:"americas",    area:10991,    pop:2820000,  langs:["English"],                  name_en:"Jamaica",                name_ru:"Ямайка",              cap_en:"Kingston",    cap_ru:"Кингстон" },
  "392": { iso2:"jp", tier:1, region:"asia",        area:377975,   pop:125000000,langs:["Japanese"],                 name_en:"Japan",                  name_ru:"Япония",              cap_en:"Tokyo",       cap_ru:"Токио" },
  "400": { iso2:"jo", tier:2, region:"middle_east", area:89342,    pop:11300000, langs:["Arabic"],                   name_en:"Jordan",                 name_ru:"Иордания",            cap_en:"Amman",       cap_ru:"Амман" },
  "398": { iso2:"kz", tier:2, region:"asia",        area:2724900,  pop:19600000, langs:["Kazakh","Russian"],         name_en:"Kazakhstan",             name_ru:"Казахстан",           cap_en:"Astana",      cap_ru:"Астана" },
  "404": { iso2:"ke", tier:2, region:"africa",      area:580367,   pop:54000000, langs:["Swahili","English"],        name_en:"Kenya",                  name_ru:"Кения",               cap_en:"Nairobi",     cap_ru:"Найроби" },
  "408": { iso2:"kp", tier:2, region:"asia",        area:120538,   pop:25900000, langs:["Korean"],                   name_en:"North Korea",            name_ru:"Северная Корея",      cap_en:"Pyongyang",   cap_ru:"Пхеньян" },
  "410": { iso2:"kr", tier:1, region:"asia",        area:100210,   pop:51700000, langs:["Korean"],                   name_en:"South Korea",            name_ru:"Южная Корея",         cap_en:"Seoul",       cap_ru:"Сеул" },
  "414": { iso2:"kw", tier:3, region:"middle_east", area:17818,    pop:4300000,  langs:["Arabic"],                   name_en:"Kuwait",                 name_ru:"Кувейт",              cap_en:"Kuwait City", cap_ru:"Эль-Кувейт" },
  "417": { iso2:"kg", tier:3, region:"asia",        area:199951,   pop:6800000,  langs:["Kyrgyz","Russian"],         name_en:"Kyrgyzstan",             name_ru:"Киргизия",            cap_en:"Bishkek",     cap_ru:"Бишкек" },
  "418": { iso2:"la", tier:3, region:"asia",        area:236800,   pop:7500000,  langs:["Lao"],                      name_en:"Laos",                   name_ru:"Лаос",                cap_en:"Vientiane",   cap_ru:"Вьентьян" },
  "428": { iso2:"lv", tier:3, region:"europe",      area:64589,    pop:1830000,  langs:["Latvian"],                  name_en:"Latvia",                 name_ru:"Латвия",              cap_en:"Riga",        cap_ru:"Рига" },
  "422": { iso2:"lb", tier:3, region:"middle_east", area:10452,    pop:5500000,  langs:["Arabic"],                   name_en:"Lebanon",                name_ru:"Ливан",               cap_en:"Beirut",      cap_ru:"Бейрут" },
  "426": { iso2:"ls", tier:3, region:"africa",      area:30355,    pop:2300000,  langs:["Sesotho","English"],        name_en:"Lesotho",                name_ru:"Лесото",              cap_en:"Maseru",      cap_ru:"Масеру" },
  "430": { iso2:"lr", tier:3, region:"africa",      area:111369,   pop:5300000,  langs:["English"],                  name_en:"Liberia",                name_ru:"Либерия",             cap_en:"Monrovia",    cap_ru:"Монровия" },
  "434": { iso2:"ly", tier:2, region:"africa",      area:1759540,  pop:6800000,  langs:["Arabic"],                   name_en:"Libya",                  name_ru:"Ливия",               cap_en:"Tripoli",     cap_ru:"Триполи" },
  "440": { iso2:"lt", tier:3, region:"europe",      area:65300,    pop:2860000,  langs:["Lithuanian"],               name_en:"Lithuania",              name_ru:"Литва",               cap_en:"Vilnius",     cap_ru:"Вильнюс" },
  "807": { iso2:"mk", tier:3, region:"europe",      area:25713,    pop:1830000,  langs:["Macedonian"],               name_en:"North Macedonia",        name_ru:"Северная Македония",  cap_en:"Skopje",      cap_ru:"Скопье" },
  "450": { iso2:"mg", tier:2, region:"africa",      area:587041,   pop:29600000, langs:["Malagasy","French"],        name_en:"Madagascar",             name_ru:"Мадагаскар",          cap_en:"Antananarivo",cap_ru:"Антананариву" },
  "454": { iso2:"mw", tier:3, region:"africa",      area:118484,   pop:20400000, langs:["English","Chichewa"],       name_en:"Malawi",                 name_ru:"Малави",              cap_en:"Lilongwe",    cap_ru:"Лилонгве" },
  "458": { iso2:"my", tier:2, region:"asia",        area:330803,   pop:33900000, langs:["Malay"],                    name_en:"Malaysia",               name_ru:"Малайзия",            cap_en:"Kuala Lumpur",cap_ru:"Куала-Лумпур" },
  "466": { iso2:"ml", tier:3, region:"africa",      area:1240192,  pop:22600000, langs:["French","Bambara"],         name_en:"Mali",                   name_ru:"Мали",                cap_en:"Bamako",      cap_ru:"Бамако" },
  "478": { iso2:"mr", tier:3, region:"africa",      area:1030700,  pop:4900000,  langs:["Arabic"],                   name_en:"Mauritania",             name_ru:"Мавритания",          cap_en:"Nouakchott",  cap_ru:"Нуакшот" },
  "484": { iso2:"mx", tier:1, region:"americas",    area:1964375,  pop:128000000,langs:["Spanish"],                  name_en:"Mexico",                 name_ru:"Мексика",             cap_en:"Mexico City", cap_ru:"Мехико" },
  "498": { iso2:"md", tier:3, region:"europe",      area:33846,    pop:2570000,  langs:["Romanian"],                 name_en:"Moldova",                name_ru:"Молдова",             cap_en:"Chișinău",    cap_ru:"Кишинёв" },
  "496": { iso2:"mn", tier:2, region:"asia",        area:1564110,  pop:3400000,  langs:["Mongolian"],                name_en:"Mongolia",               name_ru:"Монголия",            cap_en:"Ulaanbaatar", cap_ru:"Улан-Батор" },
  "499": { iso2:"me", tier:3, region:"europe",      area:13812,    pop:620000,   langs:["Montenegrin"],              name_en:"Montenegro",             name_ru:"Черногория",          cap_en:"Podgorica",   cap_ru:"Подгорица" },
  "504": { iso2:"ma", tier:2, region:"africa",      area:446550,   pop:37500000, langs:["Arabic","Berber"],          name_en:"Morocco",                name_ru:"Марокко",             cap_en:"Rabat",       cap_ru:"Рабат" },
  "508": { iso2:"mz", tier:3, region:"africa",      area:801590,   pop:33000000, langs:["Portuguese"],               name_en:"Mozambique",             name_ru:"Мозамбик",            cap_en:"Maputo",      cap_ru:"Мапуту" },
  "104": { iso2:"mm", tier:2, region:"asia",        area:676578,   pop:54000000, langs:["Burmese"],                  name_en:"Myanmar",                name_ru:"Мьянма",              cap_en:"Naypyidaw",   cap_ru:"Нейпьидо" },
  "516": { iso2:"na", tier:3, region:"africa",      area:825615,   pop:2540000,  langs:["English"],                  name_en:"Namibia",                name_ru:"Намибия",             cap_en:"Windhoek",    cap_ru:"Виндхук" },
  "524": { iso2:"np", tier:3, region:"asia",        area:147181,   pop:30500000, langs:["Nepali"],                   name_en:"Nepal",                  name_ru:"Непал",               cap_en:"Kathmandu",   cap_ru:"Катманду" },
  "528": { iso2:"nl", tier:2, region:"europe",      area:41850,    pop:17700000, langs:["Dutch"],                    name_en:"Netherlands",            name_ru:"Нидерланды",          cap_en:"Amsterdam",   cap_ru:"Амстердам" },
  "540": { iso2:"nc", tier:3, region:"oceania",     area:18575,    pop:290000,   langs:["French"],                   name_en:"New Caledonia",          name_ru:"Новая Каледония",     cap_en:"Nouméa",      cap_ru:"Нумеа" },
  "554": { iso2:"nz", tier:2, region:"oceania",     area:268021,   pop:5100000,  langs:["English","Māori"],          name_en:"New Zealand",            name_ru:"Новая Зеландия",      cap_en:"Wellington",  cap_ru:"Веллингтон" },
  "558": { iso2:"ni", tier:3, region:"americas",    area:130373,   pop:6900000,  langs:["Spanish"],                  name_en:"Nicaragua",              name_ru:"Никарагуа",           cap_en:"Managua",     cap_ru:"Манагуа" },
  "562": { iso2:"ne", tier:3, region:"africa",      area:1267000,  pop:26200000, langs:["French"],                   name_en:"Niger",                  name_ru:"Нигер",               cap_en:"Niamey",      cap_ru:"Ниамей" },
  "566": { iso2:"ng", tier:2, region:"africa",      area:923768,   pop:218500000,langs:["English"],                  name_en:"Nigeria",                name_ru:"Нигерия",             cap_en:"Abuja",       cap_ru:"Абуджа" },
  "578": { iso2:"no", tier:2, region:"europe",      area:323802,   pop:5500000,  langs:["Norwegian"],                name_en:"Norway",                 name_ru:"Норвегия",            cap_en:"Oslo",        cap_ru:"Осло" },
  "512": { iso2:"om", tier:3, region:"middle_east", area:309500,   pop:4600000,  langs:["Arabic"],                   name_en:"Oman",                   name_ru:"Оман",                cap_en:"Muscat",      cap_ru:"Маскат" },
  "586": { iso2:"pk", tier:2, region:"asia",        area:881913,   pop:235000000,langs:["Urdu","English"],           name_en:"Pakistan",               name_ru:"Пакистан",            cap_en:"Islamabad",   cap_ru:"Исламабад" },
  "591": { iso2:"pa", tier:3, region:"americas",    area:75417,    pop:4400000,  langs:["Spanish"],                  name_en:"Panama",                 name_ru:"Панама",              cap_en:"Panama City", cap_ru:"Панама" },
  "598": { iso2:"pg", tier:3, region:"oceania",     area:462840,   pop:10000000, langs:["English","Tok Pisin"],      name_en:"Papua New Guinea",       name_ru:"Папуа-Новая Гвинея",  cap_en:"Port Moresby",cap_ru:"Порт-Морсби" },
  "600": { iso2:"py", tier:3, region:"americas",    area:406752,   pop:6800000,  langs:["Spanish","Guaraní"],        name_en:"Paraguay",               name_ru:"Парагвай",            cap_en:"Asunción",    cap_ru:"Асунсьон" },
  "604": { iso2:"pe", tier:2, region:"americas",    area:1285216,  pop:34000000, langs:["Spanish","Quechua"],        name_en:"Peru",                   name_ru:"Перу",                cap_en:"Lima",        cap_ru:"Лима" },
  "608": { iso2:"ph", tier:2, region:"asia",        area:300000,   pop:115000000,langs:["Filipino","English"],       name_en:"Philippines",            name_ru:"Филиппины",           cap_en:"Manila",      cap_ru:"Манила" },
  "616": { iso2:"pl", tier:2, region:"europe",      area:312696,   pop:38000000, langs:["Polish"],                   name_en:"Poland",                 name_ru:"Польша",              cap_en:"Warsaw",      cap_ru:"Варшава" },
  "620": { iso2:"pt", tier:2, region:"europe",      area:92090,    pop:10300000, langs:["Portuguese"],               name_en:"Portugal",               name_ru:"Португалия",          cap_en:"Lisbon",      cap_ru:"Лиссабон" },
  "634": { iso2:"qa", tier:3, region:"middle_east", area:11586,    pop:2900000,  langs:["Arabic"],                   name_en:"Qatar",                  name_ru:"Катар",               cap_en:"Doha",        cap_ru:"Доха" },
  "642": { iso2:"ro", tier:2, region:"europe",      area:238397,   pop:19000000, langs:["Romanian"],                 name_en:"Romania",                name_ru:"Румыния",             cap_en:"Bucharest",   cap_ru:"Бухарест" },
  "643": { iso2:"ru", tier:1, region:"europe",      area:17098242, pop:144000000,langs:["Russian"],                  name_en:"Russia",                 name_ru:"Россия",              cap_en:"Moscow",      cap_ru:"Москва" },
  "646": { iso2:"rw", tier:3, region:"africa",      area:26338,    pop:13800000, langs:["Kinyarwanda","French","English"],name_en:"Rwanda",            name_ru:"Руанда",              cap_en:"Kigali",      cap_ru:"Кигали" },
  "682": { iso2:"sa", tier:1, region:"middle_east", area:2149690,  pop:36400000, langs:["Arabic"],                   name_en:"Saudi Arabia",           name_ru:"Саудовская Аравия",   cap_en:"Riyadh",      cap_ru:"Эр-Рияд" },
  "686": { iso2:"sn", tier:3, region:"africa",      area:196722,   pop:17300000, langs:["French"],                   name_en:"Senegal",                name_ru:"Сенегал",             cap_en:"Dakar",       cap_ru:"Дакар" },
  "688": { iso2:"rs", tier:3, region:"europe",      area:88361,    pop:6700000,  langs:["Serbian"],                  name_en:"Serbia",                 name_ru:"Сербия",              cap_en:"Belgrade",    cap_ru:"Белград" },
  "694": { iso2:"sl", tier:3, region:"africa",      area:71740,    pop:8600000,  langs:["English"],                  name_en:"Sierra Leone",           name_ru:"Сьерра-Леоне",        cap_en:"Freetown",    cap_ru:"Фритаун" },
  "703": { iso2:"sk", tier:3, region:"europe",      area:49035,    pop:5450000,  langs:["Slovak"],                   name_en:"Slovakia",               name_ru:"Словакия",            cap_en:"Bratislava",  cap_ru:"Братислава" },
  "705": { iso2:"si", tier:3, region:"europe",      area:20273,    pop:2110000,  langs:["Slovene"],                  name_en:"Slovenia",               name_ru:"Словения",            cap_en:"Ljubljana",   cap_ru:"Любляна" },
  "090": { iso2:"sb", tier:3, region:"oceania",     area:28896,    pop:740000,   langs:["English"],                  name_en:"Solomon Islands",        name_ru:"Соломоновы Острова",  cap_en:"Honiara",     cap_ru:"Хониара" },
  "706": { iso2:"so", tier:3, region:"africa",      area:637657,   pop:17600000, langs:["Somali","Arabic"],          name_en:"Somalia",                name_ru:"Сомали",              cap_en:"Mogadishu",   cap_ru:"Могадишо" },
  "710": { iso2:"za", tier:1, region:"africa",      area:1221037,  pop:60400000, langs:["Zulu","Xhosa","Afrikaans","English"],name_en:"South Africa",name_ru:"ЮАР",                 cap_en:"Pretoria",    cap_ru:"Претория" },
  "728": { iso2:"ss", tier:3, region:"africa",      area:644329,   pop:11000000, langs:["English"],                  name_en:"South Sudan",            name_ru:"Южный Судан",         cap_en:"Juba",        cap_ru:"Джуба" },
  "724": { iso2:"es", tier:1, region:"europe",      area:505992,   pop:48000000, langs:["Spanish"],                  name_en:"Spain",                  name_ru:"Испания",             cap_en:"Madrid",      cap_ru:"Мадрид" },
  "144": { iso2:"lk", tier:3, region:"asia",        area:65610,    pop:22200000, langs:["Sinhala","Tamil"],          name_en:"Sri Lanka",              name_ru:"Шри-Ланка",           cap_en:"Colombo",     cap_ru:"Коломбо" },
  "729": { iso2:"sd", tier:2, region:"africa",      area:1861484,  pop:46900000, langs:["Arabic","English"],         name_en:"Sudan",                  name_ru:"Судан",               cap_en:"Khartoum",    cap_ru:"Хартум" },
  "740": { iso2:"sr", tier:3, region:"americas",    area:163820,   pop:610000,   langs:["Dutch"],                    name_en:"Suriname",               name_ru:"Суринам",             cap_en:"Paramaribo",  cap_ru:"Парамарибо" },
  "748": { iso2:"sz", tier:3, region:"africa",      area:17364,    pop:1200000,  langs:["English","Swazi"],          name_en:"Eswatini",               name_ru:"Эсватини",            cap_en:"Mbabane",     cap_ru:"Мбабане" },
  "752": { iso2:"se", tier:2, region:"europe",      area:450295,   pop:10500000, langs:["Swedish"],                  name_en:"Sweden",                 name_ru:"Швеция",              cap_en:"Stockholm",   cap_ru:"Стокгольм" },
  "756": { iso2:"ch", tier:2, region:"europe",      area:41277,    pop:8800000,  langs:["German","French","Italian"],name_en:"Switzerland",            name_ru:"Швейцария",           cap_en:"Bern",        cap_ru:"Берн" },
  "760": { iso2:"sy", tier:2, region:"middle_east", area:185180,   pop:22100000, langs:["Arabic"],                   name_en:"Syria",                  name_ru:"Сирия",               cap_en:"Damascus",    cap_ru:"Дамаск" },
  "158": { iso2:"tw", tier:2, region:"asia",        area:36193,    pop:23900000, langs:["Mandarin Chinese"],         name_en:"Taiwan",                 name_ru:"Тайвань",             cap_en:"Taipei",      cap_ru:"Тайбэй" },
  "762": { iso2:"tj", tier:3, region:"asia",        area:143100,   pop:10000000, langs:["Tajik"],                    name_en:"Tajikistan",             name_ru:"Таджикистан",         cap_en:"Dushanbe",    cap_ru:"Душанбе" },
  "834": { iso2:"tz", tier:2, region:"africa",      area:945087,   pop:65500000, langs:["Swahili","English"],        name_en:"Tanzania",               name_ru:"Танзания",            cap_en:"Dodoma",      cap_ru:"Додома" },
  "764": { iso2:"th", tier:2, region:"asia",        area:513120,   pop:71700000, langs:["Thai"],                     name_en:"Thailand",               name_ru:"Таиланд",             cap_en:"Bangkok",     cap_ru:"Бангкок" },
  "626": { iso2:"tl", tier:3, region:"asia",        area:14874,    pop:1340000,  langs:["Tetum","Portuguese"],       name_en:"Timor-Leste",            name_ru:"Восточный Тимор",     cap_en:"Dili",        cap_ru:"Дили" },
  "768": { iso2:"tg", tier:3, region:"africa",      area:56785,    pop:8800000,  langs:["French"],                   name_en:"Togo",                   name_ru:"Того",                cap_en:"Lomé",        cap_ru:"Ломе" },
  "780": { iso2:"tt", tier:3, region:"americas",    area:5130,     pop:1530000,  langs:["English"],                  name_en:"Trinidad and Tobago",    name_ru:"Тринидад и Тобаго",   cap_en:"Port of Spain",cap_ru:"Порт-оф-Спейн" },
  "788": { iso2:"tn", tier:3, region:"africa",      area:163610,   pop:12400000, langs:["Arabic"],                   name_en:"Tunisia",                name_ru:"Тунис",               cap_en:"Tunis",       cap_ru:"Тунис" },
  "792": { iso2:"tr", tier:1, region:"middle_east", area:783562,   pop:85300000, langs:["Turkish"],                  name_en:"Turkey",                 name_ru:"Турция",              cap_en:"Ankara",      cap_ru:"Анкара" },
  "795": { iso2:"tm", tier:3, region:"asia",        area:488100,   pop:6400000,  langs:["Turkmen"],                  name_en:"Turkmenistan",           name_ru:"Туркменистан",        cap_en:"Ashgabat",    cap_ru:"Ашхабад" },
  "800": { iso2:"ug", tier:3, region:"africa",      area:241038,   pop:47200000, langs:["English","Swahili"],        name_en:"Uganda",                 name_ru:"Уганда",              cap_en:"Kampala",     cap_ru:"Кампала" },
  "804": { iso2:"ua", tier:2, region:"europe",      area:603550,   pop:36700000, langs:["Ukrainian"],                name_en:"Ukraine",                name_ru:"Украина",             cap_en:"Kyiv",        cap_ru:"Киев" },
  "784": { iso2:"ae", tier:2, region:"middle_east", area:83600,    pop:9400000,  langs:["Arabic"],                   name_en:"United Arab Emirates",   name_ru:"ОАЭ",                 cap_en:"Abu Dhabi",   cap_ru:"Абу-Даби" },
  "826": { iso2:"gb", tier:1, region:"europe",      area:243610,   pop:67300000, langs:["English"],                  name_en:"United Kingdom",         name_ru:"Великобритания",      cap_en:"London",      cap_ru:"Лондон" },
  "840": { iso2:"us", tier:1, region:"americas",    area:9833517,  pop:333000000,langs:["English"],                  name_en:"United States",          name_ru:"США",                 cap_en:"Washington, D.C.",cap_ru:"Вашингтон" },
  "858": { iso2:"uy", tier:3, region:"americas",    area:181034,   pop:3400000,  langs:["Spanish"],                  name_en:"Uruguay",                name_ru:"Уругвай",             cap_en:"Montevideo",  cap_ru:"Монтевидео" },
  "860": { iso2:"uz", tier:3, region:"asia",        area:447400,   pop:35600000, langs:["Uzbek"],                    name_en:"Uzbekistan",             name_ru:"Узбекистан",          cap_en:"Tashkent",    cap_ru:"Ташкент" },
  "548": { iso2:"vu", tier:3, region:"oceania",     area:12189,    pop:330000,   langs:["Bislama","English","French"],name_en:"Vanuatu",               name_ru:"Вануату",             cap_en:"Port Vila",   cap_ru:"Порт-Вила" },
  "862": { iso2:"ve", tier:2, region:"americas",    area:916445,   pop:28300000, langs:["Spanish"],                  name_en:"Venezuela",              name_ru:"Венесуэла",           cap_en:"Caracas",     cap_ru:"Каракас" },
  "704": { iso2:"vn", tier:2, region:"asia",        area:331212,   pop:98200000, langs:["Vietnamese"],               name_en:"Vietnam",                name_ru:"Вьетнам",             cap_en:"Hanoi",       cap_ru:"Ханой" },
  "732": { iso2:"eh", tier:3, region:"africa",      area:266000,   pop:570000,   langs:["Arabic"],                   name_en:"Western Sahara",         name_ru:"Западная Сахара",     cap_en:"El Aaiún",    cap_ru:"Эль-Аюн" },
  "887": { iso2:"ye", tier:2, region:"middle_east", area:527968,   pop:33700000, langs:["Arabic"],                   name_en:"Yemen",                  name_ru:"Йемен",               cap_en:"Sana'a",      cap_ru:"Сана" },
  "894": { iso2:"zm", tier:3, region:"africa",      area:752618,   pop:20000000, langs:["English"],                  name_en:"Zambia",                 name_ru:"Замбия",              cap_en:"Lusaka",      cap_ru:"Лусака" },
  "716": { iso2:"zw", tier:3, region:"africa",      area:390757,   pop:16300000, langs:["English","Shona","Ndebele"],name_en:"Zimbabwe",               name_ru:"Зимбабве",            cap_en:"Harare",      cap_ru:"Хараре" },
};

export const REGIONS = ["africa", "americas", "asia", "europe", "oceania", "middle_east"];

// Continent-based color palette. Each region has a set of hues; each country
// picks a deterministic shade from its region's palette so the map looks like
// a real political atlas with neighbouring countries in different colours.
export const REGION_PALETTE = {
  africa:      ["#d4a05f", "#c98f4b", "#e6b673", "#b5803f", "#d9ad6e", "#c89758"],
  americas:    ["#a9c97a", "#7eb06a", "#8fb978", "#c0d893", "#9bbf72", "#aac98a"],
  asia:        ["#c89bb9", "#b187ad", "#d6a8c5", "#a78aa9", "#bfa1c2", "#c5a8c7"],
  europe:      ["#7fb6c8", "#92c1d2", "#a4cdda", "#6fa9bc", "#8ec2d6", "#9fcadd"],
  oceania:     ["#d7a48d", "#e6b69d", "#c89478", "#dfa890", "#cb8e75", "#e2b497"],
  middle_east: ["#cdaa6b", "#b69155", "#d8b87a", "#c1a062", "#bf9c60", "#d4b380"],
};

export function tierBuckets() {
  const buckets = { 1: [], 2: [], 3: [] };
  for (const [iso, meta] of Object.entries(COUNTRIES)) {
    buckets[meta.tier].push(iso);
  }
  return buckets;
}

// Pick a deterministic color from the region palette for a given country.
export function colorForCountry(iso) {
  const meta = COUNTRIES[iso];
  if (!meta) return "#888";
  const palette = REGION_PALETTE[meta.region] || REGION_PALETTE.europe;
  // simple stable hash of the iso digits
  let h = 0;
  for (const c of iso) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return palette[h % palette.length];
}
