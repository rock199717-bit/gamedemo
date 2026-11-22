// =========================
// ECONOMY SYSTEM (FULL)
// - Oro + Level/EXP con barra
// - Deseos separados (Perm / Lim)
// - Modal Gachapon con animaci\u00F3n (abrir/cerrar)
// - Banner Permanente: 4\u2605 (Verde/Rojo/Azul 4x4) y 5\u2605 (Verde/Rojo/Azul 9x9)
// - DEV buttons: +10 Perm / +10 Lim
// - Inventario b\u00E1sico (se muestra en modal)
// - No gasta tickets ni da oro/exp por tirar deseos (solo da items).
// =========================

const MAX_LEVEL = 150;
const MAX_EXP_LABEL = "MAX.";
const GACHA_BTN_TEXTURE_KEY = "ui_gachapon_btn";
const HUD_GAME_CLOCK_OFFSET_HOUR = 7;
const LIMA_TIMEZONE = "America/Lima";
const LIMA_SEASON_BY_MONTH = {
  1: "Verano", 2: "Verano", 3: "Otono",
  4: "Otono", 5: "Otono", 6: "Invierno",
  7: "Invierno", 8: "Invierno", 9: "Primavera",
  10: "Primavera", 11: "Primavera", 12: "Verano"
};
const LIMA_WEATHER_POOLS = {
  Verano: [
    { label: "Soleado", w: 32 },
    { label: "Brisa marina", w: 24 },
    { label: "Nublado parcial", w: 16 },
    { label: "Calor humedo", w: 18 },
    { label: "Bochorno", w: 10 }
  ],
  Otono: [
    { label: "Nublado", w: 30 },
    { label: "Brisa fria", w: 24 },
    { label: "Garua leve", w: 20 },
    { label: "Sol tenue", w: 16 },
    { label: "Llovizna", w: 10 }
  ],
  Invierno: [
    { label: "Cielo gris", w: 34 },
    { label: "Garua", w: 28 },
    { label: "Niebla", w: 16 },
    { label: "Frio humedo", w: 14 },
    { label: "Lluvia ligera", w: 8 },
    { label: "Lluvia intermedia", w: 5 }
  ],
  Primavera: [
    { label: "Sol con brisa", w: 30 },
    { label: "Nublado parcial", w: 22 },
    { label: "Viento costero", w: 20 },
    { label: "Garua ligera", w: 16 },
    { label: "Calor suave", w: 12 }
  ]
};
const LIMA_WEATHER_ANOMALIES = [
  "Neblina intensa",
  "Viento fuerte",
  "Lluvia atipica",
  "Lluvia fuerte",
  "Lluvia extrema",
  "Humedad extrema",
  "Calor fuera de temporada"
];
const GREEN_HOUSE_ICON_HTML = `<img src="img/green_casa1x1_normal.png" alt="Casa Decorativa" style="width:18px;height:auto;display:inline-block;vertical-align:middle;">`;
const CASANUEVA_OUTLINE_ICON_HTML = `<img src="img/casanueva_outline.png" alt="Casa Decorativa Temp" style="width:18px;height:auto;display:inline-block;vertical-align:middle;">`;
const TAMBO_2X2_ICON_HTML = `<img src="img/tambo1.png" alt="TAMBA+" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
const FOOD_FACTORY_1X1_ICON_HTML = `<img src="img/fabricacomida1.png" alt="Productora Alimentos 1x1" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
const DRINK_FACTORY_1X1_ICON_HTML = `<img src="img/fabricabebida1.png" alt="Productora Bebidas 1x1" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
const CASA_CONERA_ICON_HTML = `<img src="img/casanpc1.png" alt="Casa Conera" style="width:20px;height:20px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
const HOUSE_SOFA_ICON_HTML = "🛋️";
const HOUSE_TABLE_ICON_HTML = "🪑";
const HOUSE_BED_ICON_HTML = "🛏️";
const HOUSE_LAMP_ICON_HTML = "💡";
const makeColorSwatchIconHtml = (primary, secondary = primary, size = 18) => (
  `<span aria-hidden="true" style="display:inline-grid;place-items:center;width:${size}px;height:${size}px;border-radius:6px;background:linear-gradient(135deg, ${primary} 0%, ${primary} 48%, ${secondary} 52%, ${secondary} 100%);border:1px solid rgba(255,255,255,0.45);box-shadow:inset 0 1px 0 rgba(255,255,255,0.28),0 1px 3px rgba(0,0,0,0.28);vertical-align:middle;"></span>`
);
const makeCrystalIconHtml = (primary, secondary = primary, size = 18) => (
  `<span aria-hidden="true" style="display:inline-flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;vertical-align:middle;">`
  + `<span style="display:block;width:${Math.round(size * 0.72)}px;height:${Math.round(size * 0.72)}px;transform:rotate(45deg);background:linear-gradient(135deg, ${primary} 0%, ${secondary} 100%);border:1px solid rgba(255,255,255,0.62);border-radius:3px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.4),0 1px 4px rgba(0,0,0,0.25);"></span>`
  + `</span>`
);
const YELLOW_SWATCH_ICON_HTML = makeColorSwatchIconHtml("#facc15", "#eab308");
const ORANGE_SWATCH_ICON_HTML = makeColorSwatchIconHtml("#fb923c", "#ea580c");
const PINK_SWATCH_ICON_HTML = makeColorSwatchIconHtml("#f472b6", "#db2777");
const CRYSTAL_STAMINA_ICON_HTML = makeCrystalIconHtml("#4ade80", "#15803d");
const CRYSTAL_PRODUCCION_ICON_HTML = makeCrystalIconHtml("#fb923c", "#c2410c");
const CRYSTAL_FELICIDAD_ICON_HTML = makeCrystalIconHtml("#f472b6", "#be185d");
const CRYSTAL_INTELIGENCIA_ICON_HTML = makeCrystalIconHtml("#60a5fa", "#1d4ed8");
const CRYSTAL_FORTUNA_ICON_HTML = makeCrystalIconHtml("#fde047", "#ca8a04");
const CRYSTAL_ESTRES_ICON_HTML = makeCrystalIconHtml("#c084fc", "#7e22ce");
const SUPER_CRYSTAL_STAMINA_ICON_HTML = makeCrystalIconHtml("#86efac", "#22c55e");
const SUPER_CRYSTAL_PRODUCCION_ICON_HTML = makeCrystalIconHtml("#fdba74", "#f97316");
const SUPER_CRYSTAL_FELICIDAD_ICON_HTML = makeCrystalIconHtml("#f9a8d4", "#ec4899");
const SUPER_CRYSTAL_INTELIGENCIA_ICON_HTML = makeCrystalIconHtml("#93c5fd", "#3b82f6");
const SUPER_CRYSTAL_FORTUNA_ICON_HTML = makeCrystalIconHtml("#fde68a", "#facc15");
const SUPER_CRYSTAL_ESTRES_ICON_HTML = makeCrystalIconHtml("#d8b4fe", "#a855f7");
const YAPA_WISH_COST_PERM = 150;
const YAPA_WISH_COST_LIM = 150;
const GOLD_STORE_MAX_BUILDABLE_RARITY = 2;
const GOLD_STORE_CATEGORIES = [
  { key: "casa", label: "Casa", icon: "🏠" },
  { key: "edificios", label: "Edificios", icon: "🏢" },
  { key: "decoracion", label: "Decoracion", icon: "🪴" },
  { key: "carreteras", label: "Carreteras", icon: "🛣️" },
  { key: "fabricas", label: "Fabricas", icon: "🏭" },
  { key: "tiendas", label: "Tiendas", icon: "🏪" },
  { key: "levelup", label: "Level Up", icon: "💎" }
];
const GOLD_STORE_OFFERS = [
  // CASA
  { id: "house_conera_4", category: "casa", itemKey: "casa_conera_4", qty: 1, price: 2400 },

  // DECORACION
  { id: "decor_green_1", category: "decoracion", itemKey: "green_1", qty: 1, price: 280 },
  { id: "decor_green_temp", category: "decoracion", itemKey: "green_temp_outline_1", qty: 1, price: 320 },
  { id: "decor_yellow_1", category: "decoracion", itemKey: "yellow_1", qty: 1, price: 290 },
  { id: "decor_orange_1", category: "decoracion", itemKey: "orange_1", qty: 1, price: 290 },
  { id: "decor_pink_1", category: "decoracion", itemKey: "pink_1", qty: 1, price: 290 },
  { id: "decor_house_sofa_1", category: "decoracion", itemKey: "house_furni_sofa", qty: 1, price: 120 },
  { id: "decor_house_table_1", category: "decoracion", itemKey: "house_furni_mesa", qty: 1, price: 90 },
  { id: "decor_house_bed_1", category: "decoracion", itemKey: "house_furni_cama", qty: 1, price: 180 },

  // CARRETERAS (comparten stock road_main_2x2)
  { id: "road_pack_10", category: "carreteras", itemKey: "road_main_2x2", qty: 10, price: 250 },
  { id: "road_pack_30", category: "carreteras", itemKey: "road_main_2x2", qty: 30, price: 700 },
  { id: "road_pack_60", category: "carreteras", itemKey: "road_main_2x2", qty: 60, price: 1300 },

  // FABRICAS
  { id: "fac_food_1", category: "fabricas", itemKey: "red_1", qty: 1, price: 950 },
  { id: "fac_drink_1", category: "fabricas", itemKey: "blue_1", qty: 1, price: 950 },
  { id: "fac_snack_1", category: "fabricas", itemKey: "producer_snack_1x1", qty: 1, price: 1100 },

  // TIENDAS (TAMBA+/Minimarket)
  { id: "shop_tamba_1", category: "tiendas", itemKey: "green_2", qty: 1, price: 1450 },

  // LEVEL UP (cristales NPC)
  { id: "lvl_crystal_stamina_1", category: "levelup", itemKey: "crystal_stamina", qty: 1, price: 120 },
  { id: "lvl_crystal_stamina_5", category: "levelup", itemKey: "crystal_stamina", qty: 5, price: 560 },
  { id: "lvl_crystal_produccion_1", category: "levelup", itemKey: "crystal_produccion", qty: 1, price: 150 },
  { id: "lvl_crystal_produccion_5", category: "levelup", itemKey: "crystal_produccion", qty: 5, price: 700 },
  { id: "lvl_crystal_felicidad_1", category: "levelup", itemKey: "crystal_felicidad", qty: 1, price: 130 },
  { id: "lvl_crystal_felicidad_5", category: "levelup", itemKey: "crystal_felicidad", qty: 5, price: 610 },
  { id: "lvl_crystal_inteligencia_1", category: "levelup", itemKey: "crystal_inteligencia", qty: 1, price: 160 },
  { id: "lvl_crystal_inteligencia_5", category: "levelup", itemKey: "crystal_inteligencia", qty: 5, price: 750 },
  { id: "lvl_crystal_fortuna_1", category: "levelup", itemKey: "crystal_fortuna", qty: 1, price: 180 },
  { id: "lvl_crystal_fortuna_5", category: "levelup", itemKey: "crystal_fortuna", qty: 5, price: 850 },
  { id: "lvl_crystal_estres_1", category: "levelup", itemKey: "crystal_estres", qty: 1, price: 140 },
  { id: "lvl_crystal_estres_5", category: "levelup", itemKey: "crystal_estres", qty: 5, price: 650 },

  // EDIFICIOS (maximo 2 estrellas en tienda de oro)
  { id: "build_red_2", category: "edificios", itemKey: "red_2", qty: 1, price: 1500 },
  { id: "build_blue_2", category: "edificios", itemKey: "blue_2", qty: 1, price: 1500 },
  { id: "build_yellow_2", category: "edificios", itemKey: "yellow_2", qty: 1, price: 1500 },
  { id: "build_orange_2", category: "edificios", itemKey: "orange_2", qty: 1, price: 1500 },
  { id: "build_pink_2", category: "edificios", itemKey: "pink_2", qty: 1, price: 1500 }
  // CASA: reservado para tu próxima casa (la agregamos cuando me la pases).
];
const YAPA_FACTORY_STORE_CATEGORIES = [
  { key: "food", label: "Alimentos", icon: "🍔" },
  { key: "drink", label: "Bebidas", icon: "🥤" },
  { key: "snack", label: "Snacks", icon: "🍟" },
  { key: "premium", label: "Premium", icon: "✨" },
  { key: "upgrade", label: "Mejoras", icon: "⚙️" },
  { key: "hogar", label: "Hogar", icon: "🏠" },
  { key: "skillup", label: "Habilidades", icon: "💠" }
];
const YAPA_FACTORY_STORE_OFFERS = [
  { id: "food_1", category: "food", label: "Mejora Produccion Alimentos x1", icon: "🍔", price: 20, grants: [{ key: "upgrade_prod_food", qty: 1 }] },
  { id: "food_3", category: "food", label: "Mejora Produccion Alimentos x3", icon: "🍔", price: 55, grants: [{ key: "upgrade_prod_food", qty: 3 }] },
  { id: "food_6", category: "food", label: "Mejora Produccion Alimentos x6", icon: "🍔", price: 95, grants: [{ key: "upgrade_prod_food", qty: 6 }] },
  { id: "drink_1", category: "drink", label: "Mejora Produccion Bebidas x1", icon: "🥤", price: 25, grants: [{ key: "upgrade_prod_drink", qty: 1 }] },
  { id: "drink_3", category: "drink", label: "Mejora Produccion Bebidas x3", icon: "🥤", price: 60, grants: [{ key: "upgrade_prod_drink", qty: 3 }] },
  { id: "drink_6", category: "drink", label: "Mejora Produccion Bebidas x6", icon: "🥤", price: 105, grants: [{ key: "upgrade_prod_drink", qty: 6 }] },
  { id: "snack_1", category: "snack", label: "Mejora Produccion Snacks x1", icon: "🍟", price: 30, grants: [{ key: "upgrade_prod_snack", qty: 1 }] },
  { id: "snack_3", category: "snack", label: "Mejora Produccion Snacks x3", icon: "🍟", price: 65, grants: [{ key: "upgrade_prod_snack", qty: 3 }] },
  { id: "snack_6", category: "snack", label: "Mejora Produccion Snacks x6", icon: "🍟", price: 110, grants: [{ key: "upgrade_prod_snack", qty: 6 }] },
  { id: "pack_mix_1", category: "upgrade", label: "Pack Mejora Mixta x1", icon: "⚙️", price: 80, grants: [{ key: "upgrade_prod_food", qty: 1 }, { key: "upgrade_prod_drink", qty: 1 }, { key: "upgrade_prod_snack", qty: 1 }] },
  { id: "pack_mix_2", category: "upgrade", label: "Pack Mejora Mixta x2", icon: "⚙️", price: 140, grants: [{ key: "upgrade_prod_food", qty: 2 }, { key: "upgrade_prod_drink", qty: 2 }, { key: "upgrade_prod_snack", qty: 2 }] },
  { id: "pack_mix_3", category: "upgrade", label: "Pack Mejora Mixta x3", icon: "⚙️", price: 150, grants: [{ key: "upgrade_prod_food", qty: 3 }, { key: "upgrade_prod_drink", qty: 3 }, { key: "upgrade_prod_snack", qty: 3 }] },
  { id: "med_heat_stroke_1", category: "upgrade", label: "Medicina Golpe de Calor x1", icon: "💊", price: 25, grants: [{ key: "med_heat_stroke", qty: 1 }] },
  { id: "house_lamp_1", category: "hogar", label: "Lampara de casa x1", icon: "💡", price: 25, grants: [{ key: "house_furni_lampara", qty: 1 }] },
  { id: "skill_crystal_stamina_sup_1", category: "skillup", label: "Cristal Superior de Stamina x1", icon: "💚", price: 150, grants: [{ key: "crystal_stamina_superior", qty: 1 }] },
  { id: "skill_crystal_produccion_sup_1", category: "skillup", label: "Cristal Superior de Produccion x1", icon: "🧡", price: 150, grants: [{ key: "crystal_produccion_superior", qty: 1 }] },
  { id: "skill_crystal_felicidad_sup_1", category: "skillup", label: "Cristal Superior de Felicidad x1", icon: "🩷", price: 150, grants: [{ key: "crystal_felicidad_superior", qty: 1 }] },
  { id: "skill_crystal_inteligencia_sup_1", category: "skillup", label: "Cristal Superior de Inteligencia x1", icon: "💙", price: 150, grants: [{ key: "crystal_inteligencia_superior", qty: 1 }] },
  { id: "skill_crystal_fortuna_sup_1", category: "skillup", label: "Cristal Superior de Fortuna x1", icon: "💛", price: 1500, grants: [{ key: "crystal_fortuna_superior", qty: 1 }] },
  { id: "skill_crystal_estres_sup_1", category: "skillup", label: "Cristal Superior de Estres x1", icon: "💜", price: 100, grants: [{ key: "crystal_estres_superior", qty: 1 }] }
];

const BANNER_BUILDING_POOLS = {
  1: ["green_1", "red_1", "blue_1", "yellow_1", "orange_1", "pink_1"],
  2: ["green_2", "red_2", "blue_2", "yellow_2", "orange_2", "pink_2"],
  3: ["green_3", "red_3", "blue_3", "yellow_3", "orange_3", "pink_3"],
  4: ["green_4", "red_4", "blue_4", "yellow_4", "orange_4", "pink_4"]
};

// ===== ITEMS (lo que \u201Csale\u201D del gachapon / banner) =====
const ITEM_DEFS = {
  // ===== VERDE (1\u2605/2\u2605/3\u2605) =====
  green_1:       { key: "green_1",       name: "Casa Decorativa", icon: GREEN_HOUSE_ICON_HTML, size: 1, rarity: 1 },
  green_temp_outline_1: { key: "green_temp_outline_1", name: "Casa Decorativa Temp", icon: CASANUEVA_OUTLINE_ICON_HTML, size: 1, rarity: 1 },
  road_main_2x2:        { key: "road_main_2x2",        name: "Carretera 2x2",  icon: "\u2B1C", size: 2, rarity: 1 },
  producer_snack_1x1:   { key: "producer_snack_1x1",   name: "Productora Snacks 1x1",    icon: "\uD83D\uDFEA\u2699\uFE0F", size: 1, rarity: 1 },
  green_2:       { key: "green_2",       name: "TAMBA+",        icon: TAMBO_2X2_ICON_HTML, size: 2, rarity: 2 },
  casa_conera_4: { key: "casa_conera_4", name: "Casa Conera",   icon: CASA_CONERA_ICON_HTML, size: 4, rarity: 2, cardTag: "Casa NPC", cardSigil: "CC", cardBg1: "#4b2e12", cardBg2: "#1c0f05", cardAccent: "#f59e0b" },
  green_3:       { key: "green_3",       name: "Verde 3x3",     icon: "\uD83D\uDFE9", size: 3, rarity: 3 },
  green_4:       { key: "green_4",       name: "Verde 4x4",     icon: "\uD83D\uDFE9\u2728", size: 4, rarity: 4 },
  // ===== ROJO (1\u2605/2\u2605/3\u2605/4\u2605) =====
  red_1:         { key: "red_1",         name: "Productora Alimentos 1x1", icon: FOOD_FACTORY_1X1_ICON_HTML, size: 1, rarity: 1 },
  red_2:         { key: "red_2",         name: "Rojo 2x2",      icon: "\uD83D\uDFE5", size: 2, rarity: 2 },
  red_3:         { key: "red_3",         name: "Rojo 3x3",      icon: "\uD83D\uDFE5", size: 3, rarity: 3 },
  red_4:         { key: "red_4",         name: "Rojo 4x4",      icon: "\uD83D\uDFE5\u2728", size: 4, rarity: 4 },
  // ===== AZUL (1\u2605/2\u2605/3\u2605/4\u2605) =====
  blue_1:        { key: "blue_1",        name: "Productora Bebidas 1x1", icon: DRINK_FACTORY_1X1_ICON_HTML, size: 1, rarity: 1 },
  blue_2:        { key: "blue_2",        name: "Azul 2x2",      icon: "\uD83D\uDFE6", size: 2, rarity: 2 },
  blue_3:        { key: "blue_3",        name: "Azul 3x3",      icon: "\uD83D\uDFE6", size: 3, rarity: 3 },
  blue_4:        { key: "blue_4",        name: "Azul 4x4",      icon: "\uD83D\uDFE6\u2728", size: 4, rarity: 4 },
  // ===== AMARILLO (1\u2605/2\u2605/3\u2605/4\u2605) =====
  yellow_1:      { key: "yellow_1",      name: "Amarillo 1x1",  icon: YELLOW_SWATCH_ICON_HTML, size: 1, rarity: 1, cardBg1: "#57440a", cardBg2: "#2b2206", cardAccent: "#facc15" },
  yellow_2:      { key: "yellow_2",      name: "Amarillo 2x2",  icon: YELLOW_SWATCH_ICON_HTML, size: 2, rarity: 2, cardBg1: "#57440a", cardBg2: "#2b2206", cardAccent: "#facc15" },
  yellow_3:      { key: "yellow_3",      name: "Amarillo 3x3",  icon: YELLOW_SWATCH_ICON_HTML, size: 3, rarity: 3, cardBg1: "#57440a", cardBg2: "#2b2206", cardAccent: "#facc15" },
  yellow_4:      { key: "yellow_4",      name: "Amarillo 4x4",  icon: YELLOW_SWATCH_ICON_HTML, size: 4, rarity: 4, cardBg1: "#57440a", cardBg2: "#2b2206", cardAccent: "#facc15" },
  // ===== NARANJA (1\u2605/2\u2605/3\u2605/4\u2605) =====
  orange_1:      { key: "orange_1",      name: "Naranja 1x1",   icon: ORANGE_SWATCH_ICON_HTML, size: 1, rarity: 1, cardBg1: "#5b2508", cardBg2: "#2f1204", cardAccent: "#f97316" },
  orange_2:      { key: "orange_2",      name: "Naranja 2x2",   icon: ORANGE_SWATCH_ICON_HTML, size: 2, rarity: 2, cardBg1: "#5b2508", cardBg2: "#2f1204", cardAccent: "#f97316" },
  orange_3:      { key: "orange_3",      name: "Naranja 3x3",   icon: ORANGE_SWATCH_ICON_HTML, size: 3, rarity: 3, cardBg1: "#5b2508", cardBg2: "#2f1204", cardAccent: "#f97316" },
  orange_4:      { key: "orange_4",      name: "Naranja 4x4",   icon: ORANGE_SWATCH_ICON_HTML, size: 4, rarity: 4, cardBg1: "#5b2508", cardBg2: "#2f1204", cardAccent: "#f97316" },
  // ===== ROSA (1\u2605/2\u2605/3\u2605/4\u2605) =====
  pink_1:        { key: "pink_1",        name: "Rosa 1x1",      icon: PINK_SWATCH_ICON_HTML, size: 1, rarity: 1, cardBg1: "#5a1238", cardBg2: "#2d071c", cardAccent: "#ec4899" },
  pink_2:        { key: "pink_2",        name: "Rosa 2x2",      icon: PINK_SWATCH_ICON_HTML, size: 2, rarity: 2, cardBg1: "#5a1238", cardBg2: "#2d071c", cardAccent: "#ec4899" },
  pink_3:        { key: "pink_3",        name: "Rosa 3x3",      icon: PINK_SWATCH_ICON_HTML, size: 3, rarity: 3, cardBg1: "#5a1238", cardBg2: "#2d071c", cardAccent: "#ec4899" },
  pink_4:        { key: "pink_4",        name: "Rosa 4x4",      icon: PINK_SWATCH_ICON_HTML, size: 4, rarity: 4, cardBg1: "#5a1238", cardBg2: "#2d071c", cardAccent: "#ec4899" },

  // ===== 5\u2605 permanente =====
  perm_green_9:  {
    key: "perm_green_9",
    name: "Verde 9x9",
    icon: "\uD83D\uDFE9\u2728",
    size: 9,
    rarity: 5,
    cardTag: "Bosque Sagrado",
    cardSigil: "\uD83C\uDF3F",
    cardBg1: "#0b3b2c",
    cardBg2: "#052e1b",
    cardAccent: "#22c55e"
  },
  perm_blue_9:  {
    key: "perm_blue_9",
    name: "Azul 9x9",
    icon: "\uD83D\uDFE6\u2728",
    size: 9,
    rarity: 5,
    cardTag: "Marea Celeste",
    cardSigil: "\uD83C\uDF0A",
    cardBg1: "#0b2a4a",
    cardBg2: "#0b1222",
    cardAccent: "#38bdf8"
  },
  perm_red_9:  {
    key: "perm_red_9",
    name: "Rojo 9x9",
    icon: "\uD83D\uDFE5\u2728",
    size: 9,
    rarity: 5,
    cardTag: "Coraz\u00F3n \u00CDgneo",
    cardSigil: "\uD83D\uDD25",
    cardBg1: "#3b0a0a",
    cardBg2: "#2b0606",
    cardAccent: "#ef4444"
  },

  // ===== 5\u2605 limitado =====
  lim_gold_2:    {
    key: "lim_gold_2",
    name: "Dorado 9x9",
    icon: "\uD83D\uDFE8\u2728",
    size: 9,
    rarity: 5,
    cardTag: "Sol Dorado",
    cardSigil: "\u2600\uFE0F",
    cardBg1: "#4a2100",
    cardBg2: "#7c2d12",
    cardAccent: "#f59e0b"
  },

  // ===== NPC banner (coleccionables) =====
  npc_kotori_5: {
    key: "npc_kotori_5",
    name: "La Paloma Kotori (KotoLife 2)",
    icon: "LK",
    rarity: 5,
    buildable: false,
    profileDescription: "Streamer/Trabajadora. Puede trabajar desde casa o en empresa; su fuerte son oficina y diseno.",
    invMeta: "NPC • 5★",
    cardMeta: "NPC 5★",
    cardTag: "NPC Destacado",
    cardSigil: "LK",
    cardBg1: "#123a4a",
    cardBg2: "#071827",
    cardAccent: "#60a5fa"
  },
  npc_minuscula_5: {
    key: "npc_minuscula_5",
    name: "Minuscula (KotoLife 2)",
    icon: "MN",
    rarity: 5,
    buildable: false,
    invMeta: "NPC • 5★",
    cardMeta: "NPC 5★",
    cardTag: "NPC Destacado",
    cardSigil: "MN",
    cardBg1: "#3b1b52",
    cardBg2: "#120a22",
    cardAccent: "#c084fc"
  },
  npc_ivybunny_5: {
    key: "npc_ivybunny_5",
    name: "IvyBunny (KotoLife 2)",
    icon: "IB",
    rarity: 5,
    buildable: false,
    invMeta: "NPC • 5★",
    cardMeta: "NPC 5★",
    cardTag: "NPC Destacado",
    cardSigil: "IB",
    cardBg1: "#2f3f0d",
    cardBg2: "#0b1508",
    cardAccent: "#a3e635"
  },
  npc_kotori_4: {
    key: "npc_kotori_4",
    name: "La Paloma Kotori",
    icon: "LK",
    rarity: 4,
    buildable: false,
    profileDescription: "Streamer/Trabajadora. Puede trabajar desde casa o en empresa; su fuerte son oficina y diseno.",
    invMeta: "NPC • 4★",
    cardMeta: "NPC 4★",
    cardTag: "NPC 4★",
    cardSigil: "LK",
    cardBg1: "#1e2b5f",
    cardBg2: "#111827",
    cardAccent: "#a78bfa"
  },
  npc_minusculas_4: {
    key: "npc_minusculas_4",
    name: "Minusculas",
    icon: "MS",
    rarity: 4,
    buildable: false,
    invMeta: "NPC • 4★",
    cardMeta: "NPC 4★",
    cardTag: "NPC 4★",
    cardSigil: "MS",
    cardBg1: "#3f1d5a",
    cardBg2: "#0f172a",
    cardAccent: "#c084fc"
  },
  npc_ivybunny_4: {
    key: "npc_ivybunny_4",
    name: "IvyBunny",
    icon: "IB",
    rarity: 4,
    buildable: false,
    invMeta: "NPC • 4★",
    cardMeta: "NPC 4★",
    cardTag: "NPC 4★",
    cardSigil: "IB",
    cardBg1: "#1f3b2a",
    cardBg2: "#08110c",
    cardAccent: "#86efac"
  },
  npc_pakempc_3: {
    key: "npc_pakempc_3",
    name: "PakeMPC",
    icon: "PK",
    rarity: 3,
    buildable: false,
    invMeta: "NPC • 3★",
    cardMeta: "NPC 3★",
    cardTag: "NPC 3★",
    cardSigil: "PK",
    cardBg1: "#1f2937",
    cardBg2: "#030712",
    cardAccent: "#93c5fd"
  },
  npc_sds_3: {
    key: "npc_sds_3",
    name: "SDS",
    icon: "SDS",
    rarity: 3,
    buildable: false,
    invMeta: "NPC • 3★",
    cardMeta: "NPC 3★",
    cardTag: "NPC 3★",
    cardSigil: "SDS",
    cardBg1: "#243b53",
    cardBg2: "#0b1120",
    cardAccent: "#38bdf8"
  },
  npc_dextervt_3: {
    key: "npc_dextervt_3",
    name: "DexterVT",
    icon: "DX",
    rarity: 3,
    buildable: false,
    invMeta: "NPC • 3★",
    cardMeta: "NPC 3★",
    cardTag: "NPC 3★",
    cardSigil: "DX",
    cardBg1: "#3b2f10",
    cardBg2: "#120d04",
    cardAccent: "#facc15"
  },
  npc_kattomy_3: {
    key: "npc_kattomy_3",
    name: "Kattomy",
    icon: "KT",
    rarity: 3,
    buildable: false,
    invMeta: "NPC • 3★",
    cardMeta: "NPC 3★",
    cardTag: "NPC 3★",
    cardSigil: "KT",
    cardBg1: "#3a1d1d",
    cardBg2: "#140a0a",
    cardAccent: "#fda4af"
  },
  npc_emolientero_1: {
    key: "npc_emolientero_1",
    name: "Vendedor de emoliente",
    icon: "EM",
    rarity: 1,
    buildable: false,
    npcRole: "reward",
    invMeta: "NPC - 1★",
    cardMeta: "NPC 1★",
    cardTag: "Oficio informal",
    cardSigil: "EM",
    cardBg1: "#4a2d16",
    cardBg2: "#1f1309",
    cardAccent: "#f59e0b"
  },
  npc_lustrabotas_1: {
    key: "npc_lustrabotas_1",
    name: "Lustrabotas",
    icon: "LU",
    rarity: 1,
    buildable: false,
    npcRole: "build",
    invMeta: "NPC - 1★",
    cardMeta: "NPC 1★",
    cardTag: "Oficio informal",
    cardSigil: "LU",
    cardBg1: "#334155",
    cardBg2: "#0f172a",
    cardAccent: "#94a3b8"
  },
  npc_canillita_1: {
    key: "npc_canillita_1",
    name: "Canillita",
    icon: "CA",
    rarity: 1,
    buildable: false,
    npcRole: "reward",
    invMeta: "NPC - 1★",
    cardMeta: "NPC 1★",
    cardTag: "Oficio informal",
    cardSigil: "CA",
    cardBg1: "#1d4ed8",
    cardBg2: "#0b1736",
    cardAccent: "#60a5fa"
  },
  npc_mercado_1: {
    key: "npc_mercado_1",
    name: "Vendedora de mercado",
    icon: "VM",
    rarity: 1,
    buildable: false,
    npcRole: "prod",
    invMeta: "NPC - 1★",
    cardMeta: "NPC 1★",
    cardTag: "Oficio informal",
    cardSigil: "VM",
    cardBg1: "#5b2118",
    cardBg2: "#1f0c07",
    cardAccent: "#fb7185"
  },
  npc_panadero_2: {
    key: "npc_panadero_2",
    name: "Panadero",
    icon: "PA",
    rarity: 2,
    buildable: false,
    npcRole: "prod",
    invMeta: "NPC - 2★",
    cardMeta: "NPC 2★",
    cardTag: "Profesion formal",
    cardSigil: "PA",
    cardBg1: "#6b4f1d",
    cardBg2: "#24190a",
    cardAccent: "#fbbf24"
  },
  npc_sereno_2: {
    key: "npc_sereno_2",
    name: "Sereno municipal",
    icon: "SE",
    rarity: 2,
    buildable: false,
    npcRole: "build",
    invMeta: "NPC - 2★",
    cardMeta: "NPC 2★",
    cardTag: "Profesion formal",
    cardSigil: "SE",
    cardBg1: "#0f3b57",
    cardBg2: "#08131d",
    cardAccent: "#22d3ee"
  },
  npc_enfermera_2: {
    key: "npc_enfermera_2",
    name: "Enfermera tecnica",
    icon: "EN",
    rarity: 2,
    buildable: false,
    npcRole: "reward",
    invMeta: "NPC - 2★",
    cardMeta: "NPC 2★",
    cardTag: "Profesion formal",
    cardSigil: "EN",
    cardBg1: "#14532d",
    cardBg2: "#09180f",
    cardAccent: "#4ade80"
  },
  npc_electricista_2: {
    key: "npc_electricista_2",
    name: "Tecnico electricista",
    icon: "EL",
    rarity: 2,
    buildable: false,
    npcRole: "build",
    invMeta: "NPC - 2★",
    cardMeta: "NPC 2★",
    cardTag: "Profesion formal",
    cardSigil: "EL",
    cardBg1: "#713f12",
    cardBg2: "#221306",
    cardAccent: "#facc15"
  },
  npc_profesora_3: {
    key: "npc_profesora_3",
    name: "Profesora escolar",
    icon: "PR",
    rarity: 3,
    buildable: false,
    npcRole: "reward",
    invMeta: "NPC - 3★",
    cardMeta: "NPC 3★",
    cardTag: "Profesion formal",
    cardSigil: "PR",
    cardBg1: "#4338ca",
    cardBg2: "#15123a",
    cardAccent: "#818cf8"
  },
  npc_policia_3: {
    key: "npc_policia_3",
    name: "Policia de transito",
    icon: "PO",
    rarity: 3,
    buildable: false,
    npcRole: "build",
    invMeta: "NPC - 3★",
    cardMeta: "NPC 3★",
    cardTag: "Profesion formal",
    cardSigil: "PO",
    cardBg1: "#1e3a8a",
    cardBg2: "#0b1024",
    cardAccent: "#60a5fa"
  },
  npc_chefcriollo_3: {
    key: "npc_chefcriollo_3",
    name: "Chef criollo",
    icon: "CH",
    rarity: 3,
    buildable: false,
    npcRole: "prod",
    invMeta: "NPC - 3★",
    cardMeta: "NPC 3★",
    cardTag: "Profesion formal",
    cardSigil: "CH",
    cardBg1: "#7c2d12",
    cardBg2: "#2a1007",
    cardAccent: "#fb923c"
  },
  npc_artesana_3: {
    key: "npc_artesana_3",
    name: "Artesana textil andina",
    icon: "AR",
    rarity: 3,
    buildable: false,
    npcRole: "reward",
    invMeta: "NPC - 3★",
    cardMeta: "NPC 3★",
    cardTag: "Profesion cultural",
    cardSigil: "AR",
    cardBg1: "#6d28d9",
    cardBg2: "#240b36",
    cardAccent: "#c084fc"
  },
  crystal_stamina: {
    key: "crystal_stamina",
    name: "Cristal de Stamina",
    icon: CRYSTAL_STAMINA_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal - Stamina",
    cardMeta: "Cristal de Stamina",
    cardTag: "Level Up",
    cardSigil: "ST",
    cardBg1: "#14532d",
    cardBg2: "#052e16",
    cardAccent: "#4ade80"
  },
  crystal_produccion: {
    key: "crystal_produccion",
    name: "Cristal de Produccion",
    icon: CRYSTAL_PRODUCCION_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal - Produccion",
    cardMeta: "Cristal de Produccion",
    cardTag: "Level Up",
    cardSigil: "PD",
    cardBg1: "#7c2d12",
    cardBg2: "#431407",
    cardAccent: "#fb923c"
  },
  crystal_felicidad: {
    key: "crystal_felicidad",
    name: "Cristal de Felicidad",
    icon: CRYSTAL_FELICIDAD_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal - Felicidad",
    cardMeta: "Cristal de Felicidad",
    cardTag: "Level Up",
    cardSigil: "FE",
    cardBg1: "#831843",
    cardBg2: "#500724",
    cardAccent: "#f472b6"
  },
  crystal_inteligencia: {
    key: "crystal_inteligencia",
    name: "Cristal de Inteligencia",
    icon: CRYSTAL_INTELIGENCIA_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal - Inteligencia",
    cardMeta: "Cristal de Inteligencia",
    cardTag: "Level Up",
    cardSigil: "IN",
    cardBg1: "#1d4ed8",
    cardBg2: "#172554",
    cardAccent: "#60a5fa"
  },
  crystal_fortuna: {
    key: "crystal_fortuna",
    name: "Cristal de Fortuna",
    icon: CRYSTAL_FORTUNA_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal - Fortuna",
    cardMeta: "Cristal de Fortuna",
    cardTag: "Level Up",
    cardSigil: "FO",
    cardBg1: "#713f12",
    cardBg2: "#422006",
    cardAccent: "#fde047"
  },
  crystal_estres: {
    key: "crystal_estres",
    name: "Cristal de Estres",
    icon: CRYSTAL_ESTRES_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal - Estres",
    cardMeta: "Cristal de Estres",
    cardTag: "Level Up",
    cardSigil: "ES",
    cardBg1: "#581c87",
    cardBg2: "#2e1065",
    cardAccent: "#c084fc"
  },
  crystal_stamina_superior: {
    key: "crystal_stamina_superior",
    name: "Cristal Superior de Stamina",
    icon: SUPER_CRYSTAL_STAMINA_ICON_HTML,
    rarity: 2,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal Superior - Stamina",
    cardMeta: "Cristal Superior de Stamina",
    cardTag: "Skill Up",
    cardSigil: "ST+",
    cardBg1: "#166534",
    cardBg2: "#052e16",
    cardAccent: "#86efac"
  },
  crystal_produccion_superior: {
    key: "crystal_produccion_superior",
    name: "Cristal Superior de Produccion",
    icon: SUPER_CRYSTAL_PRODUCCION_ICON_HTML,
    rarity: 2,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal Superior - Produccion",
    cardMeta: "Cristal Superior de Produccion",
    cardTag: "Skill Up",
    cardSigil: "PD+",
    cardBg1: "#9a3412",
    cardBg2: "#431407",
    cardAccent: "#fdba74"
  },
  crystal_felicidad_superior: {
    key: "crystal_felicidad_superior",
    name: "Cristal Superior de Felicidad",
    icon: SUPER_CRYSTAL_FELICIDAD_ICON_HTML,
    rarity: 2,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal Superior - Felicidad",
    cardMeta: "Cristal Superior de Felicidad",
    cardTag: "Skill Up",
    cardSigil: "FE+",
    cardBg1: "#9d174d",
    cardBg2: "#500724",
    cardAccent: "#f9a8d4"
  },
  crystal_inteligencia_superior: {
    key: "crystal_inteligencia_superior",
    name: "Cristal Superior de Inteligencia",
    icon: SUPER_CRYSTAL_INTELIGENCIA_ICON_HTML,
    rarity: 2,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal Superior - Inteligencia",
    cardMeta: "Cristal Superior de Inteligencia",
    cardTag: "Skill Up",
    cardSigil: "IN+",
    cardBg1: "#1e40af",
    cardBg2: "#172554",
    cardAccent: "#93c5fd"
  },
  crystal_fortuna_superior: {
    key: "crystal_fortuna_superior",
    name: "Cristal Superior de Fortuna",
    icon: SUPER_CRYSTAL_FORTUNA_ICON_HTML,
    rarity: 2,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal Superior - Fortuna",
    cardMeta: "Cristal Superior de Fortuna",
    cardTag: "Skill Up",
    cardSigil: "FO+",
    cardBg1: "#854d0e",
    cardBg2: "#422006",
    cardAccent: "#fde68a"
  },
  crystal_estres_superior: {
    key: "crystal_estres_superior",
    name: "Cristal Superior de Estres",
    icon: SUPER_CRYSTAL_ESTRES_ICON_HTML,
    rarity: 2,
    buildable: false,
    itemKind: "resource",
    invMeta: "Cristal Superior - Estres",
    cardMeta: "Cristal Superior de Estres",
    cardTag: "Skill Up",
    cardSigil: "ES+",
    cardBg1: "#6b21a8",
    cardBg2: "#2e1065",
    cardAccent: "#d8b4fe"
  },
  med_heat_stroke: {
    key: "med_heat_stroke",
    name: "Medicina Golpe de Calor",
    icon: "💊",
    rarity: 1,
    buildable: false,
    itemKind: "resource",
    invMeta: "Salud - NPC",
    cardMeta: "Tratamiento rapido",
    cardTag: "Soporte NPC",
    cardSigil: "HC",
    cardBg1: "#3f1d1d",
    cardBg2: "#1f0c0c",
    cardAccent: "#f87171"
  },
  house_furni_sofa: {
    key: "house_furni_sofa",
    name: "Mueble Sofa",
    icon: HOUSE_SOFA_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "house_furniture",
    invMeta: "Mueble casa",
    cardMeta: "Decoracion interior",
    cardTag: "Hogar",
    cardSigil: "SF",
    cardBg1: "#0f3355",
    cardBg2: "#071a2a",
    cardAccent: "#38bdf8"
  },
  house_furni_mesa: {
    key: "house_furni_mesa",
    name: "Mueble Mesa",
    icon: HOUSE_TABLE_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "house_furniture",
    invMeta: "Mueble casa",
    cardMeta: "Decoracion interior",
    cardTag: "Hogar",
    cardSigil: "MS",
    cardBg1: "#4a2a0b",
    cardBg2: "#271503",
    cardAccent: "#f59e0b"
  },
  house_furni_cama: {
    key: "house_furni_cama",
    name: "Mueble Cama",
    icon: HOUSE_BED_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "house_furniture",
    invMeta: "Mueble casa",
    cardMeta: "Decoracion interior",
    cardTag: "Hogar",
    cardSigil: "CM",
    cardBg1: "#3b1a5a",
    cardBg2: "#1d0d2d",
    cardAccent: "#c084fc"
  },
  house_furni_lampara: {
    key: "house_furni_lampara",
    name: "Mueble Lampara",
    icon: HOUSE_LAMP_ICON_HTML,
    rarity: 1,
    buildable: false,
    itemKind: "house_furniture",
    invMeta: "Mueble casa",
    cardMeta: "Decoracion interior",
    cardTag: "Hogar",
    cardSigil: "LP",
    cardBg1: "#4a3b0b",
    cardBg2: "#251d05",
    cardAccent: "#facc15"
  },
};

const NPC_BANNER_POOLS = {
  1: ["npc_emolientero_1", "npc_lustrabotas_1", "npc_canillita_1", "npc_mercado_1"],
  2: ["npc_panadero_2", "npc_sereno_2", "npc_enfermera_2", "npc_electricista_2"],
  3: ["npc_profesora_3", "npc_policia_3", "npc_chefcriollo_3", "npc_artesana_3"],
  4: ["npc_kotori_4", "npc_minusculas_4", "npc_ivybunny_4"],
  5: ["npc_kotori_5", "npc_minuscula_5", "npc_ivybunny_5"]
};
const NPC_RANDOM_STAT_KEYS = ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"];
const NPC_PRIMARY_STAT_KEYS = ["produccion", "felicidad", "inteligencia"];
const NPC_SECONDARY_STAT_KEYS = ["produccion", "felicidad", "inteligencia"];
const NPC_RANDOM_STAT_LABELS = {
  stamina: "Stamina",
  produccion: "Produccion",
  felicidad: "Felicidad",
  inteligencia: "Inteligencia",
  fortuna: "Fortuna",
  estres: "Estres"
};
const NPC_RANDOM_STAT_RANGES = {
  1: { main: [18, 32], secondary: [10, 18], normal: [4, 12], stamina: [12, 22], estres: [3, 9], fortuna: [1, 4] },
  2: { main: [30, 48], secondary: [18, 30], normal: [8, 18], stamina: [20, 36], estres: [5, 12], fortuna: [2, 5] },
  3: { main: [48, 68], secondary: [28, 42], normal: [14, 28], stamina: [32, 54], estres: [7, 15], fortuna: [3, 6] },
  4: { main: [100, 100], secondary: [45, 65], normal: [20, 40], stamina: [150, 200], estres: [8, 18], fortuna: [4, 7] },
  5: { main: [100, 100], secondary: [60, 82], normal: [28, 50], stamina: [200, 250], estres: [10, 20], fortuna: [5, 8] }
};

const hashNpcSeed = (input) => {
  let hash = 2166136261;
  const text = String(input || "");
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const makeNpcSeededRng = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let n = Math.imul(t ^ (t >>> 15), t | 1);
    n ^= n + Math.imul(n ^ (n >>> 7), n | 61);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
};

const randNpcInt = (rng, min, max) => {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);
  return lo + Math.floor(rng() * (hi - lo + 1));
};

const getItemInventoryMeta = (def) => {
  if (!def) return "";
  if (typeof def.invMeta === "string" && def.invMeta.trim()) return def.invMeta;
  if (def.buildable === false) return `NPC - ${def.rarity || 1}*`;
  return `${def.size || 1}x${def.size || 1} - ${def.rarity || 1}★`;
};

const getItemCardMeta = (def) => {
  if (!def) return "";
  if (typeof def.cardMeta === "string" && def.cardMeta.trim()) return def.cardMeta;
  if (def.buildable === false) return `NPC ${def.rarity || 1}*`;
  return def.size ? `${def.size}x${def.size}` : "";
};

class EconomySystem {
  constructor(scene) {
    this.scene = scene;
    this.isWishAnimating = false;
    this.audioCtx = null;

    // ===== Valores base =====
    this.gold = 1000;
    this.yapas = 0;
    this.yapaSpentTotal = 0;
    this.yapaMovements = [];
    this.yapaWishMovements = [];
    this.yapaUsedCodes = Object.create(null);
    this.yapaShowBalance = false;
    this.yapaShowMovements = false;
    this.yapaWishViewOpen = false;
    this.yapaStoreViewOpen = false;
    this.yapaStoreCategory = "home";
    this.yapaStoreDetailOfferId = "";
    this.yapaStoreDetailQty = 1;
    this.yapaStoreCart = Object.create(null);
    this.yapaStoreLastMessage = "";
    this.yapaClockTimer = null;
    this.hudClockTimerEvent = null;
    this.hudClockLastMain = "";
    this.hudClockLastMeta = "";
    this.hudClockLastMetaColor = "";
    this.hudGameWeekdayBaseIndex = Number.NaN;
    this.hudGameWeekdayOffset = 0;
    this.hudGameWeekdayLastProgress = Number.NaN;
    this.hudGameWeekdayLastSecondOfDay = Number.NaN;
    this.hudClockPanel = null;
    this.hudClockGhostText = null;
    this.weatherDebugOverride = null;
    this.goldStoreCategory = "casa";
    this.goldStoreLastMessage = "";
    this.ghostNpcLabState = null;

    this.level = 1;
    this.exp = 0;
    this.expToNext = this.calcExpToNext();

    // Deseos separados
    this.wishesPermanent = 20;
    this.wishesLimited = 0;

    // ===== Inventario de items =====
    // { itemKey: count }
    this.inventory = {
      green_1: 5,
      green_temp_outline_1: 5,
      road_main_2x2: 120,
      green_2: 3,
      green_3: 2,
      green_4: 1,
      red_1: 3,
      blue_1: 3,
      producer_snack_1x1: 3,
      npc_kotori_5: 15
    };
    this.npcInstances = [];
    this.nextNpcInstanceId = 1;
    this._npcInstanceInventoryMigrated = false;
    this.npcInstalledProfiles = Object.create(null);

    // Compat: inventario viejo de productoras separadas -> red_1 / blue_1.
    if ((this.inventory.producer_food_1x1 || 0) > 0) {
      this.inventory.red_1 = (this.inventory.red_1 || 0) + this.inventory.producer_food_1x1;
      delete this.inventory.producer_food_1x1;
    }
    if ((this.inventory.producer_drink_1x1 || 0) > 0) {
      this.inventory.blue_1 = (this.inventory.blue_1 || 0) + this.inventory.producer_drink_1x1;
      delete this.inventory.producer_drink_1x1;
    }

    this.npcBaseStatProfiles = this.buildNpcRandomStatProfiles();
    this.applyNpcRandomStatProfilesToDefs();
    this.ensureNpcInstanceStore();
    this.ghostNpcLabState = this.createDefaultGhostNpcLabState();

    // ===== Pity / garant\u00EDas =====
    // 4\u2605: garantizado cada 10 (base 8%)
    // 5\u2605: 2% y garantizado cada 50
    this.permPity4 = 0;
    this.permPity5 = 0;

    this.limPity4 = 0;
    this.limPity5 = 0;
    this.npcPity4 = 0;
    this.npcPity5 = 0;

    // Si pierdes 50/50 en limitado, el siguiente 5\u2605 es del banner
    this.limGuaranteeFeatured = false;
    this.npcGuaranteeFeatured = false;

    // ===== UI =====
    this.createUI();
    this.refreshUI();
    this.ensureInventoryButton();
    this.ensureNpcInventoryButton();
    this.ensureRoadInventoryButton();
    this.ensureAdminButton();
    this.ensureYapaButton();

    // ===== Banner Permanente: sin barra de carga (se quit\u00F3 el ciclo) =====
  }

  // =========================
  // EXP / LEVEL
  // =========================
  calcExpToNext() {
    // Curva facil hasta Lv 30, despues sube mas rapido.
    if (this.level <= 30) {
      return Math.floor(55 * Math.pow(this.level, 1.18));
    }

    const t = this.level - 30;
    const base30 = Math.floor(55 * Math.pow(30, 1.18));
    return Math.floor(base30 + (180 * t) + (55 * Math.pow(t, 1.8)));
  }

  applyLevelRewards(levelReached) {
    // Rewards por subir nivel:
    // hasta 30: +10 perm, +5 lim, +10000 oro
    // luego: +3 perm, +3 lim, +1000 oro
    if (levelReached <= 30) {
      this.wishesPermanent += 10;
      this.wishesLimited += 5;
      this.gold += 10000;
    } else {
      this.wishesPermanent += 3;
      this.wishesLimited += 3;
      this.gold += 1000;
    }
  }

  addExp(amount) {
    if (this.level >= MAX_LEVEL) return;

    this.exp += amount;

    while (this.exp >= this.expToNext && this.level < MAX_LEVEL) {
      this.exp -= this.expToNext;
      this.level++;
      this.expToNext = this.calcExpToNext();
      this.applyLevelRewards(this.level);
    }

    this.refreshUI();
    this.updateModalCounts();
  }

  // =========================
  // INVENTARIO
  // =========================
  isNpcInventoryKey(key) {
    const itemKey = String(key || "").trim();
    return itemKey.startsWith("npc_") && ITEM_DEFS[itemKey]?.buildable === false;
  }

  cloneNpcLabSkillTree(tree = null) {
    if (!tree || typeof tree !== "object") return null;
    try {
      return JSON.parse(JSON.stringify(tree));
    } catch (_) {
      return null;
    }
  }

  createNpcInventoryInstance(key, overrides = {}) {
    const itemKey = String(key || "").trim();
    if (!this.isNpcInventoryKey(itemKey)) return null;
    const def = ITEM_DEFS[itemKey] || {};
    const rarity = Math.max(1, Math.min(5, Math.round(Number(overrides.rarity) || Number(def.rarity) || 1)));
    const baseStats = this.getNpcRandomStatsForKey(itemKey)?.stats || {
      stamina: 0,
      produccion: 0,
      felicidad: 0,
      inteligencia: 0,
      fortuna: 0,
      estres: 0
    };
    const explicitId = String(overrides.instanceId || "").trim();
    const nextId = Math.max(1, Math.round(Number(this.nextNpcInstanceId) || 1));
    if (!explicitId) {
      this.nextNpcInstanceId = nextId + 1;
    }
    return {
      instanceId: explicitId || `npcinst_${nextId}`,
      key: itemKey,
      rarity,
      level: Math.max(1, Math.round(Number(overrides.level) || 1)),
      exp: Math.max(0, Math.round(Number(overrides.exp) || 0)),
      passiveLevel: Math.max(0, Math.min(5, Math.round(Number(overrides.passiveLevel) || 0))),
      statCrystalSpent: Object.fromEntries(
        ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"].map((statKey) => [
          statKey,
          Math.max(0, Math.round(Number(overrides?.statCrystalSpent?.[statKey]) || 0))
        ])
      ),
      stats: { ...baseStats, ...(overrides.stats || {}) },
      skillTree: this.cloneNpcLabSkillTree(overrides.skillTree) || this.createGhostNpcLabSkillTree(rarity)
    };
  }

  syncNpcInventoryCountsFromInstances() {
    this.inventory = this.inventory || {};
    Object.keys(ITEM_DEFS)
      .filter((key) => this.isNpcInventoryKey(key))
      .forEach((key) => {
        this.inventory[key] = this.npcInstances.filter((entry) => entry?.key === key).length;
      });
  }

  ensureNpcInstanceStore() {
    this.inventory = this.inventory || {};
    this.npcInstances = Array.isArray(this.npcInstances) ? this.npcInstances : [];
    this.nextNpcInstanceId = Math.max(1, Math.round(Number(this.nextNpcInstanceId) || 1));
    if (!this._npcInstanceInventoryMigrated) {
      const migrated = [];
      Object.keys(this.inventory).forEach((key) => {
        if (!this.isNpcInventoryKey(key)) return;
        const count = Math.max(0, Math.round(Number(this.inventory[key]) || 0));
        for (let i = 0; i < count; i++) {
          const entry = this.createNpcInventoryInstance(key);
          if (entry) migrated.push(entry);
        }
      });
      this.npcInstances = migrated;
      this._npcInstanceInventoryMigrated = true;
    } else {
      this.npcInstances = this.npcInstances
        .filter((entry) => this.isNpcInventoryKey(entry?.key))
        .map((entry) => {
          const created = this.createNpcInventoryInstance(entry.key, entry);
          if (!created) return null;
          created.instanceId = String(entry?.instanceId || created.instanceId);
          return created;
        })
        .filter(Boolean);
      const maxSeenId = this.npcInstances.reduce((maxId, entry) => {
        const match = String(entry?.instanceId || "").match(/npcinst_(\d+)/);
        const num = match ? Number(match[1]) : 0;
        return Math.max(maxId, Number.isFinite(num) ? num : 0);
      }, 0);
      this.nextNpcInstanceId = Math.max(this.nextNpcInstanceId, maxSeenId + 1);
    }
    this.syncNpcInventoryCountsFromInstances();
  }

  getNpcInventoryInstanceById(instanceId) {
    this.ensureNpcInstanceStore();
    const id = String(instanceId || "").trim();
    return this.npcInstances.find((entry) => String(entry?.instanceId || "") === id) || null;
  }

  removeNpcInventoryInstanceById(instanceId) {
    this.ensureNpcInstanceStore();
    const id = String(instanceId || "").trim();
    const idx = this.npcInstances.findIndex((entry) => String(entry?.instanceId || "") === id);
    if (idx < 0) return false;
    this.npcInstances.splice(idx, 1);
    this.syncNpcInventoryCountsFromInstances();
    return true;
  }

  ensureNpcInstalledProfileStore() {
    if (!this.npcInstalledProfiles || typeof this.npcInstalledProfiles !== "object") {
      this.npcInstalledProfiles = Object.create(null);
    }
    return this.npcInstalledProfiles;
  }

  getNpcInstalledProfile(instanceId, npcKey) {
    const id = String(instanceId || "").trim();
    const key = String(npcKey || "").trim();
    if (!id || !this.isNpcInventoryKey(key)) return null;
    const store = this.ensureNpcInstalledProfileStore();
    const raw = store[id] && String(store[id]?.key || "") === key ? store[id] : null;
    const normalized = this.createNpcInventoryInstance(key, {
      instanceId: id,
      rarity: raw?.rarity,
      level: raw?.level,
      exp: raw?.exp,
      passiveLevel: raw?.passiveLevel,
      statCrystalSpent: raw?.statCrystalSpent,
      stats: raw?.stats,
      skillTree: this.cloneNpcLabSkillTree(raw?.skillTree)
    });
    if (!normalized) return null;
    store[id] = normalized;
    return normalized;
  }

  saveNpcInstalledProfile(instanceId, npcKey, source = null) {
    const id = String(instanceId || "").trim();
    const key = String(npcKey || "").trim();
    if (!id || !this.isNpcInventoryKey(key)) return false;
    const normalized = this.createNpcInventoryInstance(key, {
      instanceId: id,
      rarity: source?.rarity,
      level: source?.level,
      exp: source?.exp,
      passiveLevel: source?.passiveLevel,
      statCrystalSpent: source?.statCrystalSpent,
      stats: source?.stats,
      skillTree: this.cloneNpcLabSkillTree(source?.skillTree)
    });
    if (!normalized) return false;
    const store = this.ensureNpcInstalledProfileStore();
    store[id] = normalized;
    return true;
  }

  persistGhostNpcLabState(state = null) {
    const current = state && typeof state === "object" ? state : this.ghostNpcLabState;
    const instanceId = String(current?.instanceId || "").trim();
    const sourceMode = String(current?.sourceMode || "");
    if (!instanceId) return false;
    if (sourceMode === "building") {
      return this.saveNpcInstalledProfile(instanceId, String(current?.npcKey || ""), current);
    }
    if (sourceMode !== "inventory") return false;
    const entry = this.getNpcInventoryInstanceById(instanceId);
    if (!entry) return false;
    entry.level = Math.max(1, Math.round(Number(current.level) || 1));
    entry.exp = Math.max(0, Math.round(Number(current.exp) || 0));
    entry.passiveLevel = Math.max(0, Math.min(5, Math.round(Number(current.passiveLevel) || 0)));
    entry.statCrystalSpent = Object.fromEntries(
      ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"].map((statKey) => [
        statKey,
        Math.max(0, Math.round(Number(current?.statCrystalSpent?.[statKey]) || 0))
      ])
    );
    entry.stats = {
      stamina: Math.max(0, Math.round(Number(current?.stats?.stamina) || 0)),
      produccion: Math.max(0, Math.round(Number(current?.stats?.produccion) || 0)),
      felicidad: Math.max(0, Math.round(Number(current?.stats?.felicidad) || 0)),
      inteligencia: Math.max(0, Math.round(Number(current?.stats?.inteligencia) || 0)),
      fortuna: Math.max(0, Math.round(Number(current?.stats?.fortuna) || 0)),
      estres: Math.max(0, Math.round(Number(current?.stats?.estres) || 0))
    };
    entry.skillTree = this.cloneNpcLabSkillTree(current.skillTree) || entry.skillTree;
    return true;
  }

  addItem(key, n = 1) {
    this.inventory = this.inventory || {};
    const amount = Math.max(0, Math.round(Number(n) || 0));
    if (amount <= 0) return;
    if (this.isNpcInventoryKey(key)) {
      this.ensureNpcInstanceStore();
      for (let i = 0; i < amount; i++) {
        const entry = this.createNpcInventoryInstance(key);
        if (entry) this.npcInstances.push(entry);
      }
      this.syncNpcInventoryCountsFromInstances();
    } else {
      this.inventory[key] = (this.inventory[key] || 0) + amount;
    }
    this.updateModalCounts?.();
  }

  ensureAudio() {
    if (this.audioCtx) {
      if (this.audioCtx.state === "suspended") {
        this.audioCtx.resume().catch(() => {});
      }
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    this.audioCtx = new Ctx();
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume().catch(() => {});
    }
  }

  playStarSound(rarity) {
    this.ensureAudio();
    const ctx = this.audioCtx;
    if (!ctx || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const base = (rarity >= 5) ? 880 : (rarity >= 4 ? 660 : (rarity >= 3 ? 520 : (rarity >= 2 ? 440 : 360)));
    const dur = (rarity >= 5) ? 0.5 : (rarity >= 4 ? 0.35 : 0.25);
    const peak = (rarity >= 5) ? 0.18 : (rarity >= 4 ? 0.14 : 0.1);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(peak, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(base, now);
    osc1.frequency.exponentialRampToValueAtTime(base * 1.08, now + dur * 0.7);

    osc1.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + dur + 0.02);

    if (rarity >= 4) {
      const gain2 = ctx.createGain();
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.linearRampToValueAtTime(peak * 0.6, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(base * 2, now);
      osc2.frequency.exponentialRampToValueAtTime(base * 2.1, now + dur * 0.7);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now);
      osc2.stop(now + dur + 0.02);
    }

    if (rarity >= 5) {
      const chimeAt = now + 0.18;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, chimeAt);
      g.gain.linearRampToValueAtTime(peak * 0.5, chimeAt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, chimeAt + 0.25);

      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.setValueAtTime(base * 1.5, chimeAt);
      o.frequency.exponentialRampToValueAtTime(base * 1.6, chimeAt + 0.2);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(chimeAt);
      o.stop(chimeAt + 0.27);
    }
  }

  consumeItem(key, n = 1) {
    this.inventory = this.inventory || {};
    const amount = Math.max(0, Math.round(Number(n) || 0));
    if (amount <= 0) return true;
    if (this.isNpcInventoryKey(key)) {
      this.ensureNpcInstanceStore();
      const matches = this.npcInstances
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => entry?.key === key);
      if (matches.length < amount) return false;
      matches.slice(-amount).forEach(({ index }, removeIndex) => {
        this.npcInstances.splice(index - removeIndex, 1);
      });
      this.syncNpcInventoryCountsFromInstances();
    } else {
      const cur = this.inventory[key] || 0;
      if (cur < amount) return false;
      this.inventory[key] = cur - amount;
    }
    this.updateModalCounts?.();
    return true;
  }

  hasBlockingOverlayOpen() {
    const ids = [
      "gacha-modal",
      "gacha-anim-overlay",
      "inventory-modal",
      "npc-inventory-modal",
      "road-inventory-modal",
      "gold-store-modal",
      "admin-modal",
      "yapa-modal",
      "yapa-qr-modal",
      "building-modal",
      "evo-modal",
      "producer-modal",
      "npc-ghost-lab-modal",
      "npc-heat-modal"
    ];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const st = window.getComputedStyle(el);
      const rect = typeof el.getBoundingClientRect === "function" ? el.getBoundingClientRect() : null;
      const hasVisibleBox = !!rect && (rect.width > 0 || rect.height > 0);
      const hasVisibleChildren = (el.childElementCount || 0) > 0;
      if (!hasVisibleBox && !hasVisibleChildren) continue;
      if (st.display !== "none" && st.visibility !== "hidden") return true;
    }
    return false;
  }

  showUiErrorMessage(message, durationMs = 2600) {
    const text = String(message || "").trim();
    if (!text) return;
    const prev = document.getElementById("ui-error-toast");
    if (prev) prev.remove();
    const toast = document.createElement("div");
    toast.id = "ui-error-toast";
    Object.assign(toast.style, {
      position: "fixed",
      left: "50%",
      bottom: "28px",
      transform: "translateX(-50%)",
      zIndex: "1000001",
      background: "rgba(127,29,29,.96)",
      color: "#fee2e2",
      border: "1px solid rgba(254,202,202,.35)",
      borderRadius: "12px",
      padding: "10px 14px",
      font: "700 13px Arial, sans-serif",
      boxShadow: "0 12px 28px rgba(0,0,0,.28)"
    });
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, Math.max(1200, durationMs | 0));
  }

  formatCompactValue(value, threshold, suffix) {
    const n = Math.max(0, Math.round(Number(value) || 0));
    if (n < threshold) return null;
    const scaled = n / threshold;
    const decimals = scaled >= 10 ? 1 : 2;
    const txt = scaled
      .toFixed(decimals)
      .replace(/\.0+$/, "")
      .replace(/(\.\d*[1-9])0+$/, "$1");
    return `${txt}${suffix}`;
  }

  formatGoldHUD(value) {
    const compact = this.formatCompactValue(value, 1_000_000, "M");
    if (compact) return compact;
    const n = Math.max(0, Math.round(Number(value) || 0));
    return String(n);
  }

  formatWishHUD(value) {
    const compact = this.formatCompactValue(value, 1_000, "K");
    if (compact) return compact;
    const n = Math.max(0, Math.round(Number(value) || 0));
    return String(n);
  }

  formatYapaHUD(value) {
    const compactM = this.formatCompactValue(value, 1_000_000, "M");
    if (compactM) return compactM;
    const compactK = this.formatCompactValue(value, 1_000, "K");
    if (compactK) return compactK;
    const n = Math.max(0, Math.round((Number(value) || 0) * 100) / 100);
    if (Number.isInteger(n)) return String(n);
    return n.toFixed(2).replace(/\.?0+$/, "");
  }

  // =========================
  // UI
  // =========================
  ensureInventoryButton() {
    if (document.getElementById("inventoryBtn")) return;

    const btn = document.createElement("button");
    btn.id = "inventoryBtn";
    btn.className = "inv-btn";
    btn.textContent = "Inventario";
    btn.addEventListener("click", () => this.openInventoryModal());
    document.body.appendChild(btn);
  }

  ensureNpcInventoryButton() {
    if (document.getElementById("npcInventoryBtn")) return;

    const btn = document.createElement("button");
    btn.id = "npcInventoryBtn";
    btn.className = "npc-inv-btn";
    btn.textContent = "NPC";
    btn.addEventListener("click", () => this.openNpcInventoryModal());
    document.body.appendChild(btn);
  }

  ensureRoadInventoryButton() {
    if (document.getElementById("roadInventoryBtn")) return;

    const btn = document.createElement("button");
    btn.id = "roadInventoryBtn";
    btn.className = "road-inv-btn";
    btn.textContent = "Inv Carreteras";
    btn.addEventListener("click", () => this.openRoadInventoryModal());
    document.body.appendChild(btn);
  }

  ensureAdminButton() {
    if (document.getElementById("adminBtn")) return;

    const btn = document.createElement("button");
    btn.id = "adminBtn";
    btn.className = "admin-btn";
    btn.textContent = "Admin";
    btn.addEventListener("click", () => this.openAdminModal());
    document.body.appendChild(btn);
  }

  ensureYapaButton() {
    const existingYapaBtn = document.getElementById("yapaBtn");
    const existingRail = document.getElementById("yapaRail");
    if (existingYapaBtn && existingRail) {
      let existingStoreBtn = document.getElementById("goldStoreBtn");
      if (!existingStoreBtn) {
        existingStoreBtn = document.createElement("button");
        existingStoreBtn.id = "goldStoreBtn";
        existingStoreBtn.className = "store-btn";
        existingStoreBtn.setAttribute("aria-label", "Abrir Tienda Oro");
        existingStoreBtn.innerHTML = `
          <img class="store-btn-art" src="img/tienda.png" alt="Tienda">
        `;
        existingStoreBtn.addEventListener("click", () => {
          if (this.hasBlockingOverlayOpen()) return;
          this.openGoldStoreModal();
        });
      }
      const existingTimer = document.getElementById("yapaRailTimer");
      existingRail.appendChild(existingYapaBtn);
      if (existingTimer) existingRail.appendChild(existingTimer);
      existingRail.appendChild(existingStoreBtn);
      this.positionYapaRail();
      return;
    }

    const host = document.getElementById("game") || document.body;
    const rail = document.createElement("div");
    rail.id = "yapaRail";
    rail.className = "yapa-rail";

    const btn = document.createElement("button");
    btn.id = "yapaBtn";
    btn.className = "yapa-btn";
    btn.setAttribute("aria-label", "Abrir Yapa");
    btn.innerHTML = `
      <img class="yapa-btn-art" src="img/yapa.png" alt="Yapa">
    `;
    btn.addEventListener("click", () => {
      if (this.hasBlockingOverlayOpen()) return;
      this.openYapaModal();
    });

    const storeBtn = document.createElement("button");
    storeBtn.id = "goldStoreBtn";
    storeBtn.className = "store-btn";
    storeBtn.setAttribute("aria-label", "Abrir Tienda Oro");
    storeBtn.innerHTML = `
      <img class="store-btn-art" src="img/tienda.png" alt="Tienda">
    `;
    storeBtn.addEventListener("click", () => {
      if (this.hasBlockingOverlayOpen()) return;
      this.openGoldStoreModal();
    });

    const timer = document.createElement("div");
    timer.id = "yapaRailTimer";
    timer.className = "yapa-rail-timer";
    timer.textContent = "Bono: --:--";

    rail.appendChild(btn);
    rail.appendChild(timer);
    rail.appendChild(storeBtn);
    host.appendChild(rail);

    this.positionYapaRail();
    if (!this._boundYapaRailReflow) {
      this._boundYapaRailReflow = () => this.positionYapaRail();
      window.addEventListener("resize", this._boundYapaRailReflow);
      this.scene?.scale?.on?.("resize", this._boundYapaRailReflow);
    }
    setTimeout(() => this.positionYapaRail(), 0);
    this.updateYapaRailTimer();
    if (!this._yapaRailTimerInt) {
      this._yapaRailTimerInt = setInterval(() => this.updateYapaRailTimer(), 1000);
    }
  }

  positionYapaRail() {
    const rail = document.getElementById("yapaRail");
    const host = document.getElementById("game");
    const canvas = this.scene?.game?.canvas;
    if (!rail || !host || !canvas) return;

    const hostRect = host.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();

    const baseW = Number(this.scene?.game?.config?.width) || 1920;
    const scale = Math.max(0.3, canvasRect.width / baseW);

    const desiredLeft = Math.round((canvasRect.left - hostRect.left) + (14 * scale));
    const desiredTop = Math.round((canvasRect.top - hostRect.top) + (180 * scale));

    const maxLeft = Math.max(8, Math.round(host.clientWidth - rail.offsetWidth - 8));
    const maxTop = Math.max(8, Math.round(host.clientHeight - rail.offsetHeight - 8));

    rail.style.left = `${Phaser.Math.Clamp(desiredLeft, 8, maxLeft)}px`;
    rail.style.top = `${Phaser.Math.Clamp(desiredTop, 8, maxTop)}px`;
  }

  formatYapaMoney(value) {
    const n = Math.max(0, Math.round((Number(value) || 0) * 100) / 100);
    const txt = n.toFixed(2);
    return `S/.${txt}`;
  }

  formatYapaMovementTimeLabel(ts) {
    const d = new Date(Number(ts) || Date.now());
    const now = new Date();
    const sameDay =
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate();

    let timeText = d
      .toLocaleTimeString("es-PE", { hour: "numeric", minute: "2-digit", hour12: true })
      .replace(/\./g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
    timeText = timeText.replace(/\b([ap])\s*m\b/g, "$1m");

    if (sameDay) return `Hoy ${timeText}`;

    const dateText = d
      .toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })
      .replace(/\./g, "");
    return `${dateText} - ${timeText}`;
  }

  recordYapaMovement(amount, detail = "", kind = "") {
    const v = Math.round((Number(amount) || 0) * 100) / 100;
    if (Math.abs(v) < 0.0001) return;
    const now = new Date();
    const entry = {
      amount: v,
      detail: String(detail || "Usuario"),
      kind: String(kind || (v > 0 ? "in" : "out")),
      ts: now.getTime(),
      timeLabel: this.formatYapaMovementTimeLabel(now.getTime())
    };
    this.yapaMovements.unshift(entry);
    if (this.yapaMovements.length > 24) this.yapaMovements.length = 24;
    if (v < 0) this.yapaSpentTotal = Math.round((this.yapaSpentTotal + Math.abs(v)) * 100) / 100;
  }

  spendYapas(v, detail = "Usuario") {
    const amount = Math.max(0, Math.round((Number(v) || 0) * 100) / 100);
    if (amount <= 0) return false;
    if ((Number(this.yapas) || 0) + 0.0001 < amount) return false;
    this.yapas = Math.max(0, Math.round(((Number(this.yapas) || 0) - amount) * 100) / 100);
    this.recordYapaMovement(-amount, detail, "out");
    this.refreshUI();
    this.updateModalCounts();
    return true;
  }

  recordYapaWishMovement(direction = "in", label = "Deseo", qty = 1) {
    const dir = direction === "out" ? "out" : "in";
    const amount = Math.max(1, Math.round(Number(qty) || 1));
    const now = Date.now();
    this.yapaWishMovements.unshift({
      direction: dir,
      label: String(label || "Deseo"),
      qty: amount,
      ts: now,
      timeLabel: this.formatYapaMovementTimeLabel(now)
    });
    if (this.yapaWishMovements.length > 40) this.yapaWishMovements.length = 40;
  }

  buyWishWithYapa(type = "perm") {
    const isLimited = type === "lim";
    const cost = isLimited ? YAPA_WISH_COST_LIM : YAPA_WISH_COST_PERM;
    const label = isLimited ? "Deseo Limitado" : "Deseo Permanente";

    const ok = this.spendYapas(cost, "Deseos Yapa");
    if (!ok) return { ok: false, reason: "funds" };

    if (isLimited) this.addLimitedWishes(1);
    else this.addPermanentWishes(1);

    this.recordYapaWishMovement("in", label, 1);
    this.renderYapaModalData();
    return { ok: true, label, cost };
  }

  redeemYapaWishCode(rawCode = "") {
    const code = String(rawCode || "").trim().toUpperCase().replace(/\s+/g, "");
    if (!code) return { ok: false, reason: "empty" };
    if (code.length < 4) return { ok: false, reason: "short" };
    if (this.yapaUsedCodes[code]) return { ok: false, reason: "used" };

    this.yapaUsedCodes[code] = true;

    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      hash = ((hash * 31) + code.charCodeAt(i)) >>> 0;
    }
    const qty = 1 + (hash % 3);
    const isLimited = (hash % 2) === 1;

    if (isLimited) this.addLimitedWishes(qty);
    else this.addPermanentWishes(qty);

    this.recordYapaWishMovement("in", "YAPADESEO", qty);
    this.renderYapaModalData();
    return { ok: true, qty, type: isLimited ? "lim" : "perm" };
  }

  setYapaWishView(open, modal) {
    this.yapaWishViewOpen = !!open;
    if (this.yapaWishViewOpen) this.yapaStoreViewOpen = false;
    const root = modal || document.getElementById("yapa-modal");
    if (!root) return;
    root.classList.toggle("yapa-wish-open", this.yapaWishViewOpen);
    this.renderYapaStoreOverlay(root);
    this.renderYapaModalData();
  }

  setYapaStoreView(open, modal) {
    this.yapaStoreViewOpen = !!open;
    if (this.yapaStoreViewOpen) this.yapaWishViewOpen = false;
    const root = modal || document.getElementById("yapa-modal");
    if (!root) return;
    root.classList.toggle("yapa-wish-open", this.yapaWishViewOpen);
    this.ensureYapaStoreOverlay(root);
    this.renderYapaStoreOverlay(root);
    this.renderYapaModalData();
  }

  ensureYapaStoreOverlay(modal) {
    if (!modal) return null;
    const phone = modal.querySelector(".yapa-phone");
    if (!phone) return null;
    if (!phone.style.position) phone.style.position = "relative";
    let overlay = modal.querySelector("#yapaStoreSection");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "yapaStoreSection";
    overlay.style.cssText = [
      "position:absolute",
      "inset:0",
      "background:#efecf4",
      "display:none",
      "flex-direction:column",
      "z-index:40",
      "border-radius:inherit",
      "overflow:hidden"
    ].join(";");

    overlay.innerHTML = `
      <div style="background:#7c1f8a;color:#fff;padding:12px 14px;display:grid;gap:10px;">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <button id="yapaStoreBack" type="button" style="background:transparent;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1;">←</button>
          <div style="font-weight:800;font-size:20px;">Yape Tienda</div>
          <div style="font-size:20px;">🛒</div>
        </div>
        <div style="background:#fff;border-radius:12px;padding:10px 12px;color:#6b7280;">🔎 Buscar en Tienda</div>
        <div style="display:flex;justify-content:space-between;align-items:center;font-size:13px;opacity:.95;">
          <span>📍 Mejoras de fabricas de produccion</span>
          <span>✎</span>
        </div>
      </div>
      <div id="yapaStoreScroll" style="flex:1;overflow:auto;padding:10px 10px 86px;display:grid;gap:12px;"></div>
      <div style="position:absolute;left:0;right:0;bottom:0;background:#fff;border-top:1px solid #ddd6e8;padding:8px 10px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <button id="yapaStoreTabShop" type="button" style="border:none;border-radius:16px;padding:10px 12px;font-weight:700;background:#ede7f7;color:#2f1e5b;cursor:pointer;">Tienda</button>
          <button id="yapaStoreTabCat" type="button" style="border:none;border-radius:16px;padding:10px 12px;font-weight:700;background:#f5f3f9;color:#4b5563;cursor:pointer;">Categorias</button>
        </div>
      </div>
    `;

    phone.appendChild(overlay);

    overlay.querySelector("#yapaStoreBack")?.addEventListener("click", () => {
      if (this.yapaStoreDetailOfferId) {
        this.closeYapaStoreProductDetail(modal);
        return;
      }
      this.setYapaStoreView(false, modal);
    });

    overlay.querySelector("#yapaStoreTabShop")?.addEventListener("click", () => {
      this.yapaStoreCategory = "home";
      this.renderYapaStoreOverlay(modal);
    });

    overlay.querySelector("#yapaStoreTabCat")?.addEventListener("click", () => {
      this.yapaStoreCategory = "all";
      this.renderYapaStoreOverlay(modal);
    });

    overlay.addEventListener("click", (e) => {
      const catBtn = e.target.closest?.("[data-yapa-store-cat]");
      if (catBtn) {
        this.yapaStoreDetailOfferId = "";
        this.yapaStoreCategory = String(catBtn.getAttribute("data-yapa-store-cat") || "food");
        this.renderYapaStoreOverlay(modal);
        return;
      }
      const openBtn = e.target.closest?.("[data-yapa-store-open]");
      if (openBtn) {
        const offerId = String(openBtn.getAttribute("data-yapa-store-open") || "");
        if (!offerId) return;
        this.openYapaStoreProductDetail(offerId, modal);
        return;
      }
      const qtyBtn = e.target.closest?.("[data-yapa-store-qty]");
      if (qtyBtn) {
        const delta = Number(qtyBtn.getAttribute("data-yapa-store-qty") || 0);
        this.setYapaStoreDetailQty((this.yapaStoreDetailQty || 1) + delta, modal);
        return;
      }
      const addCartBtn = e.target.closest?.("[data-yapa-store-add-cart]");
      if (addCartBtn) {
        if (!this.yapaStoreDetailOfferId) return;
        this.addYapaStoreToCart(this.yapaStoreDetailOfferId, this.yapaStoreDetailQty || 1);
        this.renderYapaStoreOverlay(modal);
        this.renderYapaModalData();
        return;
      }
      const buyNowBtn = e.target.closest?.("[data-yapa-store-buy-now]");
      if (buyNowBtn) {
        if (!this.yapaStoreDetailOfferId) return;
        this.buyYapaStoreOffer(this.yapaStoreDetailOfferId, this.yapaStoreDetailQty || 1);
        this.renderYapaStoreOverlay(modal);
        this.renderYapaModalData();
        return;
      }
      const buyBtn = e.target.closest?.("[data-yapa-store-buy]");
      if (buyBtn) {
        const offerId = String(buyBtn.getAttribute("data-yapa-store-buy") || "");
        if (!offerId) return;
        this.openYapaStoreProductDetail(offerId, modal);
      }
    });

    return overlay;
  }

  getYapaStoreMaterialCount(materialKey) {
    const scene = this.scene;
    const materialCount = Math.max(0, Math.round(Number(scene?.getMaterialCount?.(materialKey)) || 0));
    const inventoryCount = Math.max(0, Math.round(Number(this.inventory?.[materialKey]) || 0));
    return Math.max(materialCount, inventoryCount);
  }

  getYapaStoreMaterialLabel(materialKey) {
    return ITEM_DEFS?.[materialKey]?.name || this.scene?.getProducerMaterialLabel?.(materialKey) || materialKey;
  }

  getYapaStoreOfferById(offerId) {
    return this.getYapaStoreOffers().find((o) => o.id === offerId) || null;
  }

  getYapaStorePriceByRarity(rarity = "common", premium = false) {
    const tableNormal = {
      common: 150,
      rare: 220,
      epic: 290,
      legendary: 350
    };
    const tablePremium = {
      common: 1500,
      rare: 2200,
      epic: 2900,
      legendary: 3500
    };
    const key = String(rarity || "common");
    return (premium ? tablePremium[key] : tableNormal[key]) || (premium ? 1500 : 150);
  }

  getYapaStoreRecipeMaterialOffers() {
    const scene = this.scene;
    if (!scene?.getProducerRecipesForType) return [];

    const groups = [
      { typeKey: "red_1", category: "food", iconFallback: "🍔" },
      { typeKey: "blue_1", category: "drink", iconFallback: "🥤" },
      { typeKey: "producer_snack_1x1", category: "snack", iconFallback: "🍟" }
    ];

    const offers = [];
    for (const g of groups) {
      const list = Array.isArray(scene.getProducerRecipesForType(g.typeKey, null))
        ? scene.getProducerRecipesForType(g.typeKey, null)
        : [];
      for (const r of list) {
        if (!r?.key) continue;
        const rarity = String(r.rarity || "common");
        const iconNormal = scene.getProducerUiIconForMaterial?.(r.key, g.typeKey) || g.iconFallback;
        const premiumKey = `${r.key}_premium`;
        const iconPremium = scene.getProducerUiIconForMaterial?.(premiumKey, g.typeKey) || "✨";

        offers.push({
          id: `mat_${r.key}`,
          category: g.category,
          kind: "material",
          rarity,
          label: r.label || r.key,
          icon: iconNormal,
          price: this.getYapaStorePriceByRarity(rarity, false),
          grants: [{ key: r.key, qty: 1 }]
        });

        offers.push({
          id: `mat_premium_${r.key}`,
          category: "premium",
          kind: "material_premium",
          rarity,
          label: `${r.label || r.key} Premium`,
          icon: iconPremium,
          price: this.getYapaStorePriceByRarity(rarity, true),
          grants: [{ key: premiumKey, qty: 1 }]
        });
      }
    }
    return offers;
  }

  getYapaStoreOffers() {
    return [...YAPA_FACTORY_STORE_OFFERS, ...this.getYapaStoreRecipeMaterialOffers()];
  }

  getYapaStoreOfferSortWeight(offer) {
    const kind = String(offer?.kind || "");
    const rarity = String(offer?.rarity || "common");
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    const kindBase =
      kind === "material" ? 0 :
      kind === "material_premium" ? 100 :
      200;
    return kindBase + (rarityOrder[rarity] ?? 0);
  }

  openYapaStoreProductDetail(offerId, modal) {
    const offer = this.getYapaStoreOfferById(offerId);
    if (!offer) {
      this.yapaStoreLastMessage = "Producto no encontrado.";
      return { ok: false, reason: "offer" };
    }
    this.yapaStoreDetailOfferId = offer.id;
    this.yapaStoreDetailQty = 1;
    this.renderYapaStoreOverlay(modal);
    return { ok: true, offer };
  }

  closeYapaStoreProductDetail(modal) {
    this.yapaStoreDetailOfferId = "";
    this.yapaStoreDetailQty = 1;
    this.renderYapaStoreOverlay(modal);
  }

  setYapaStoreDetailQty(nextQty, modal) {
    const qty = Math.max(1, Math.min(99, Math.round(Number(nextQty) || 1)));
    this.yapaStoreDetailQty = qty;
    this.renderYapaStoreOverlay(modal);
  }

  addYapaStoreToCart(offerId, qty = 1) {
    const offer = this.getYapaStoreOfferById(offerId);
    if (!offer) {
      this.yapaStoreLastMessage = "Producto no encontrado.";
      return { ok: false, reason: "offer" };
    }
    const n = Math.max(1, Math.min(99, Math.round(Number(qty) || 1)));
    this.yapaStoreCart = this.yapaStoreCart || Object.create(null);
    this.yapaStoreCart[offer.id] = Math.max(0, Math.round(Number(this.yapaStoreCart[offer.id]) || 0)) + n;
    this.yapaStoreLastMessage = `Carrito: ${offer.label} x${n} agregado.`;
    return { ok: true, offer, qty: n };
  }

  getYapaStoreCartCount() {
    const cart = this.yapaStoreCart || {};
    let total = 0;
    for (const k of Object.keys(cart)) total += Math.max(0, Math.round(Number(cart[k]) || 0));
    return total;
  }

  buyYapaStoreOffer(offerId, qty = 1) {
    const offer = this.getYapaStoreOfferById(offerId);
    if (!offer) {
      this.yapaStoreLastMessage = "Producto no encontrado.";
      return { ok: false, reason: "offer" };
    }
    const grants = Array.isArray(offer.grants) ? offer.grants : [];
    if (!grants.length) {
      this.yapaStoreLastMessage = "Producto sin contenido.";
      return { ok: false, reason: "empty" };
    }
    const scene = this.scene;

    const units = Math.max(1, Math.min(99, Math.round(Number(qty) || 1)));
    const totalPrice = Math.max(0, Math.round(Number(offer.price) || 0) * units);
    const moveLabel = "Tienda Yapa";
    const paid = this.spendYapas(totalPrice, moveLabel);
    if (!paid) {
      this.yapaStoreLastMessage = `Saldo insuficiente para ${offer.label} x${units}.`;
      return { ok: false, reason: "funds" };
    }

    let delivered = 0;
    for (const g of grants) {
      const key = String(g?.key || "");
      const grantQty = Math.max(1, Math.round(Number(g?.qty) || 1)) * units;
      if (!key) continue;
      if (Object.prototype.hasOwnProperty.call(ITEM_DEFS, key)) {
        this.addItem(key, grantQty);
      } else if (scene?.addMaterialItem) {
        scene.addMaterialItem(key, grantQty);
      } else {
        this.addItem(key, grantQty);
      }
      delivered += grantQty;
    }
    if (delivered <= 0) {
      this.addYapas(totalPrice, moveLabel, "in");
      this.yapaStoreLastMessage = "No se pudo entregar el producto.";
      return { ok: false, reason: "delivery" };
    }

    scene.updateProducerRecipeModal?.();
    scene.updateProducerEvolutionModal?.();
    scene.updateBuildingActivationModal?.();
    this.yapaStoreLastMessage = `Comprado: ${offer.label} x${units} por ${this.formatYapaMoney(totalPrice)}.`;
    return { ok: true, offer, qty: units, totalPrice };
  }

  renderYapaStoreOverlay(modal) {
    const root = modal || document.getElementById("yapa-modal");
    if (!root) return;
    const overlay = this.ensureYapaStoreOverlay(root);
    if (!overlay) return;

    overlay.style.display = this.yapaStoreViewOpen ? "flex" : "none";
    if (!this.yapaStoreViewOpen) return;

    const scroll = overlay.querySelector("#yapaStoreScroll");
    if (!scroll) return;
    const allOffers = this.getYapaStoreOffers();
    let detailOffer = this.yapaStoreDetailOfferId ? this.getYapaStoreOfferById(this.yapaStoreDetailOfferId) : null;
    if (this.yapaStoreDetailOfferId && !detailOffer) {
      this.yapaStoreDetailOfferId = "";
      this.yapaStoreDetailQty = 1;
    }

    const category = this.yapaStoreCategory || "home";
    const isHome = category === "home";
    const showCategoriesOnly = category === "all";
    const categories = YAPA_FACTORY_STORE_CATEGORIES;
    const categoryCards = categories.map((c) => `
      <button type="button" data-yapa-store-cat="${c.key}" style="
        border:none;background:#fff;border-radius:14px;padding:10px;display:grid;gap:6px;
        align-items:center;justify-items:center;cursor:pointer;box-shadow:0 1px 0 rgba(0,0,0,.05);
        min-width:86px;flex:0 0 auto;
      ">
        <div style="width:54px;height:54px;border-radius:14px;background:#f1ecfa;display:grid;place-items:center;font-size:28px;">${c.icon}</div>
        <div style="font-weight:700;color:#312e81;font-size:12px;text-align:center;line-height:1.15;">${c.label}</div>
      </button>
    `).join("");

    const rarityBadge = (offer) => {
      const map = { common: "Comun", rare: "Raro", epic: "Epico", legendary: "Legendario" };
      const label = map[String(offer?.rarity || "common")] || "Comun";
      const isPremium = String(offer?.category || "") === "premium" || String(offer?.kind || "").includes("premium");
      return `${isPremium ? "Premium • " : ""}${label}`;
    };

    const renderOfferCard = (offer) => {
      const grants = (offer.grants || []).map((g) => {
        const label = this.getYapaStoreMaterialLabel(g.key);
        const qty = Math.max(1, Math.round(Number(g.qty) || 1));
        const current = this.getYapaStoreMaterialCount(g.key);
        return `<div style="font-size:12px;color:#4b5563;">- ${label} x${qty} <span style="opacity:.7;">(tienes ${current})</span></div>`;
      }).join("");
      return `
        <div style="background:#fff;border-radius:14px;padding:10px;display:grid;grid-template-rows:auto auto auto auto;gap:8px;min-height:214px;box-shadow:0 1px 0 rgba(0,0,0,.05);">
          <div style="position:relative;height:92px;border-radius:12px;background:linear-gradient(135deg,#f5edff,#efe5fb);display:grid;place-items:center;font-size:52px;">
            <span>${offer.icon || "*"}</span>
            <span style="position:absolute;top:8px;right:8px;background:#fde68a;color:#713f12;border-radius:999px;padding:2px 8px;font-weight:800;font-size:12px;">S/${offer.price}</span>
          </div>
          <div style="font-weight:800;color:#312e81;line-height:1.15;font-size:13px;">${offer.label}</div>
          <div style="font-size:11px;color:#64748b;font-weight:700;">${rarityBadge(offer)}</div>
          <div style="display:grid;gap:2px;align-content:start;">${grants}</div>
          <button type="button" data-yapa-store-open="${offer.id}" style="border:none;border-radius:12px;padding:10px 12px;background:#20c4b7;color:#fff;font-weight:800;cursor:pointer;">Comprar</button>
        </div>
      `;
    };

    const filteredOffers = (showCategoriesOnly || isHome)
      ? []
      : allOffers
          .filter((o) => o.category === category)
          .sort((a, b) => {
            const wa = this.getYapaStoreOfferSortWeight(a);
            const wb = this.getYapaStoreOfferSortWeight(b);
            if (wa !== wb) return wa - wb;
            const pa = Number(a?.price) || 0;
            const pb = Number(b?.price) || 0;
            if (pa !== pb) return pa - pb;
            return String(a?.label || "").localeCompare(String(b?.label || ""));
          });

    if (detailOffer) {
      const qty = Math.max(1, Math.min(99, Math.round(Number(this.yapaStoreDetailQty) || 1)));
      const total = (Number(detailOffer.price) || 0) * qty;
      const grants = (detailOffer.grants || []).map((g) => {
        const key = String(g?.key || "");
        const baseQty = Math.max(1, Math.round(Number(g?.qty) || 1));
        const current = this.getYapaStoreMaterialCount(key);
        return `<div style="font-size:13px;color:#475569;">${this.getYapaStoreMaterialLabel(key)} x${baseQty * qty} <span style="opacity:.75;">(tienes ${current})</span></div>`;
      }).join("");

      scroll.innerHTML = `
        <div style="background:#fff;border-radius:18px;padding:14px;display:grid;gap:12px;">
          <div style="height:220px;border-radius:16px;background:linear-gradient(135deg,#f4e9ff,#ede9fe);display:grid;place-items:center;position:relative;">
            <div style="font-size:88px;line-height:1;">${detailOffer.icon || "📦"}</div>
            <div style="position:absolute;top:10px;right:10px;background:#fde68a;color:#713f12;border-radius:999px;padding:4px 10px;font-size:12px;font-weight:800;">${rarityBadge(detailOffer)}</div>
          </div>
          <div style="display:grid;gap:8px;background:#fbfbfe;border-radius:16px;padding:14px;">
            <div style="font-weight:900;color:#312e81;font-size:16px;">${detailOffer.label}</div>
            <div style="font-size:13px;color:#64748b;">Material para recetas / activaciones. Tambien se consigue produciendo en fabricas.</div>
            <div style="font-size:18px;font-weight:900;color:#7c1f8a;">${this.formatYapaMoney(detailOffer.price)} c/u</div>
            <div style="display:grid;gap:4px;">${grants}</div>
          </div>
          <div style="background:#fff;border-radius:16px;padding:14px;border:1px solid #ede7f7;display:grid;gap:10px;">
            <div style="font-weight:800;color:#334155;">Cantidad</div>
            <div style="display:flex;align-items:center;gap:10px;justify-content:flex-start;">
              <button type="button" data-yapa-store-qty="-1" style="width:42px;height:42px;border:none;border-radius:12px;background:#f3e8ff;color:#6d28d9;font-size:22px;font-weight:800;cursor:pointer;">-</button>
              <div style="min-width:56px;text-align:center;font-weight:900;font-size:18px;color:#312e81;">${qty}</div>
              <button type="button" data-yapa-store-qty="1" style="width:42px;height:42px;border:none;border-radius:12px;background:#f3e8ff;color:#6d28d9;font-size:22px;font-weight:800;cursor:pointer;">+</button>
              <div style="margin-left:auto;font-size:14px;color:#475569;">Total: <b>${this.formatYapaMoney(total)}</b></div>
            </div>
          </div>
          <div style="position:sticky;bottom:0;background:linear-gradient(180deg,rgba(239,236,244,0),#efecf4 18%,#efecf4 100%);padding-top:8px;">
            <div style="background:#fff;border-radius:16px;padding:10px;border:1px solid #ddd6e8;display:grid;grid-template-columns:1fr 1fr;gap:10px;">
              <button type="button" data-yapa-store-add-cart="1" style="border:2px solid #22c4b7;background:#fff;color:#14b8a6;font-weight:800;border-radius:12px;padding:12px 10px;cursor:pointer;">Añadir al carrito</button>
              <button type="button" data-yapa-store-buy-now="1" style="border:none;background:#20c4b7;color:#fff;font-weight:800;border-radius:12px;padding:12px 10px;cursor:pointer;">Comprar ahora</button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    let bodyHtml = `
      <div style="background:#efecf4;border-radius:16px;padding:10px 10px 0;display:grid;gap:10px;">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
          <div style="font-size:15px;font-weight:800;color:#2f1e5b;">Saldo Yapa: ${this.formatYapaMoney(this.yapas)}</div>
          <div style="font-size:12px;color:#6b7280;">Materiales 150-350 | Premium 1500-3500</div>
        </div>
        <div style="display:flex;gap:8px;overflow-x:auto;padding-bottom:2px;">${categoryCards}</div>
      </div>
    `;

    if (this.yapaStoreLastMessage) {
      bodyHtml += `
        <div style="background:#fff;border-radius:12px;padding:10px 12px;color:#334155;font-size:12px;">
          ${this.yapaStoreLastMessage}
        </div>
      `;
    }

    if (showCategoriesOnly) {
      bodyHtml += `
        <div style="background:#fff;border-radius:14px;padding:14px;display:grid;gap:8px;">
          <div style="font-weight:800;color:#312e81;">Categorias</div>
          <div style="font-size:13px;color:#475569;">Elige una fabrica para ver sus piezas de mejora y comprar con Yapa.</div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">
          ${categoryCards}
        </div>
      `;
    } else if (isHome) {
      const sectionHtml = categories.map((cat) => {
        const offers = allOffers
          .filter((o) => o.category === cat.key)
          .sort((a, b) => {
            const wa = this.getYapaStoreOfferSortWeight(a);
            const wb = this.getYapaStoreOfferSortWeight(b);
            if (wa !== wb) return wa - wb;
            const pa = Number(a?.price) || 0;
            const pb = Number(b?.price) || 0;
            if (pa !== pb) return pa - pb;
            return String(a?.label || "").localeCompare(String(b?.label || ""));
          });
        if (!offers.length) return "";
        return `
          <section style="display:grid;gap:8px;">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 4px;">
              <div style="font-size:16px;font-weight:900;color:#2f1e5b;">${cat.icon} ${cat.label}</div>
              <button type="button" data-yapa-store-cat="${cat.key}" style="background:none;border:none;color:#14b8a6;font-weight:800;cursor:pointer;">Ver mas</button>
            </div>
            <div style="display:grid;grid-auto-flow:column;grid-auto-columns:minmax(178px,72%);gap:10px;overflow-x:auto;padding:2px 4px 2px;">
              ${offers.slice(0, 12).map(renderOfferCard).join("")}
            </div>
          </section>
        `;
      }).join("");
      bodyHtml += `
        <div style="background:#fff;border-radius:14px;padding:12px;display:grid;gap:6px;">
          <div style="font-weight:900;color:#2f1e5b;font-size:16px;">Tienda de Mejoras</div>
          <div style="font-size:13px;color:#64748b;">Categorias en scroll horizontal y productos por secciones debajo.</div>
        </div>
        ${sectionHtml}
      `;
    } else {
      const activeCat = categories.find((c) => c.key === category) || categories[0];
      bodyHtml += `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:2px 4px;">
          <div style="font-size:16px;font-weight:900;color:#2f1e5b;">${activeCat.icon} ${activeCat.label}</div>
          <button type="button" data-yapa-store-cat="home" style="background:none;border:none;color:#14b8a6;font-weight:800;cursor:pointer;">Inicio</button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;">
          ${filteredOffers.map(renderOfferCard).join("")}
        </div>
      `;
    }

    scroll.innerHTML = bodyHtml;
  }

  openYapaModal() {
    if (document.getElementById("yapa-modal")) return;
    this.yapaShowMovements = false;
    this.yapaWishViewOpen = false;
    this.yapaStoreViewOpen = false;
    this.yapaStoreCategory = this.yapaStoreCategory || "home";
    this.yapaStoreLastMessage = "";

    const modal = document.createElement("div");
    modal.id = "yapa-modal";
    modal.className = "inv-modal";
    modal.innerHTML = `
      <div class="yapa-card yapa-phone-shell">
        <div class="yapa-phone">
          <div class="yapa-statusbar">
            <span id="yapaClock">--:--</span>
            <span id="yapaDate" class="yapa-status-date">--/--/----</span>
            <span class="yapa-net-pill">4G</span>
          </div>

          <div class="yapa-head">
            <div class="yapa-head-left">
              <span>Hola <b class="yapa-badge">Gratis</b></span>
            </div>
            <div class="yapa-head-right">
              <span class="yapa-top-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 0 1 16 0"></path><path d="M5 12v4a2 2 0 0 0 2 2h1v-6H7a2 2 0 0 0-2 2z"></path><path d="M19 12v4a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z"></path></svg></span>
              <span class="yapa-top-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5a4 4 0 0 1 4 4v2.6l1.3 1.6a1 1 0 0 1-.8 1.8H7.5a1 1 0 0 1-.8-1.8L8 11.6V9a4 4 0 0 1 4-4z"></path><path d="M10.3 16.7a1.8 1.8 0 0 0 3.4 0"></path></svg></span>
            </div>
            <button id="yapaClose" class="inv-x yapa-close">X</button>
          </div>

          <div class="yapa-scroll">
            <div class="yapa-shortcuts">
              <button class="yapa-shortcut is-main" data-yapa-note="Recargar celular">
                <span class="yapa-shortcut-icon icon-recharge"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.2" y="2.7" width="12.2" height="18.4" rx="3" fill="#9b8cff"></rect><rect x="6.5" y="4.1" width="9.6" height="12.6" rx="2.1" fill="#7c64f8"></rect><circle cx="11.3" cy="18.3" r="1.1" fill="#efe9ff"></circle><circle cx="17.2" cy="8.5" r="4.1" fill="#2dd4bf"></circle><text x="17.2" y="9.8" text-anchor="middle" font-size="3.8" font-weight="800" fill="#0f766e">S/</text></svg></span>
                <span>Recargar<br>celular</span>
              </button>
              <button class="yapa-shortcut is-main" data-yapa-note="Yapear servicios">
                <span class="yapa-shortcut-icon icon-services"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.3 4.5C6 7.3 4.7 10 4.7 12a4.6 4.6 0 0 0 9.2 0c0-2-1.3-4.7-3.6-7.5z" fill="#60a5fa"></path><circle cx="17.2" cy="13.6" r="4.1" fill="#fbbf24"></circle><ellipse cx="17.2" cy="14" rx="1.6" ry="1.8" fill="#fef3c7"></ellipse><rect x="16.8" y="10.8" width="0.8" height="2.8" rx="0.4" fill="#92400e"></rect><rect x="16.8" y="15.3" width="0.8" height="1.4" rx="0.4" fill="#92400e"></rect></svg></span>
                <span>Yapear<br>servicios</span>
              </button>
              <button class="yapa-shortcut" data-yapa-note="Creditos">
                <span class="yapa-shortcut-icon icon-credit"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.1" y="5.4" width="17.8" height="13.2" rx="2.8" fill="#c3f1df"></rect><rect x="3.1" y="7.8" width="17.8" height="2.3" fill="#8de0bc"></rect><rect x="5.4" y="11.2" width="7.8" height="4.1" rx="1.3" fill="#53c48f"></rect><text x="16.1" y="14.4" text-anchor="middle" font-size="4.4" font-weight="800" fill="#0f766e">S/</text></svg></span>
                <span>Creditos</span>
              </button>
              <button class="yapa-shortcut is-main" data-yapa-note="Aprobar compras">
                <span class="yapa-shortcut-icon icon-approve"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8.2h12v8.9a2.5 2.5 0 0 1-2.5 2.5h-7a2.5 2.5 0 0 1-2.5-2.5z" fill="#cfc3ff"></path><path d="M8.4 8.2a3.6 3.6 0 0 1 7.2 0" fill="none" stroke="#8b5cf6" stroke-width="1.4" stroke-linecap="round"></path><circle cx="17.6" cy="15.8" r="4" fill="#34d399"></circle><path d="M15.9 15.8l1.2 1.2 2.1-2.2" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg></span>
                <span>Aprobar<br>compras</span>
              </button>
              <button class="yapa-shortcut" data-yapa-note="Promos">
                <span class="yapa-shortcut-icon icon-promo"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.4l2.2 1.4 2.6-.2 1 2.4 2.1 1.5-.8 2.5.8 2.5-2.1 1.5-1 2.4-2.6-.2L12 20.6l-2.2-1.4-2.6.2-1-2.4-2.1-1.5.8-2.5-.8-2.5 2.1-1.5 1-2.4 2.6.2z" fill="#fbbf24"></path><path d="M9 15l6-6" stroke="#7c2d12" stroke-width="1.5" stroke-linecap="round"></path><circle cx="9" cy="9" r="1.1" fill="#7c2d12"></circle><circle cx="15" cy="15" r="1.1" fill="#7c2d12"></circle></svg></span>
                <span>Promos</span>
              </button>
              <button id="yapaShortcutStore" class="yapa-shortcut" data-yapa-note="Tienda">
                <span class="yapa-shortcut-icon icon-store"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.1 8.3h15.8l-1.3 3.2a2.1 2.1 0 0 1-2 1.3H7.4a2.1 2.1 0 0 1-2-1.3z" fill="#9d7bf7"></path><rect x="5.6" y="12.7" width="12.8" height="6.9" rx="1.6" fill="#ccbdfd"></rect><rect x="8" y="14.2" width="3.4" height="5.4" rx="0.8" fill="#9d7bf7"></rect><rect x="12.8" y="14.3" width="3.8" height="2.4" rx="0.8" fill="#a78bfa"></rect></svg></span>
                <span>Tienda</span>
              </button>
              <button id="yapaShortcutWishes" class="yapa-shortcut" data-yapa-note="Deseos">
                <span class="yapa-shortcut-icon icon-wishes">
                  <img class="wish-cycle wish-perm" src="img/deseoperma.png" alt="Deseo permanente">
                  <img class="wish-cycle wish-lim" src="img/deseolimi.png" alt="Deseo limitado">
                </span>
                <span>Deseos</span>
              </button>
              <button class="yapa-shortcut" data-yapa-note="Ver todo">
                <span class="yapa-shortcut-icon icon-more"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.2" fill="#e9d5ff"></circle><rect x="11" y="7.1" width="2" height="9.8" rx="1" fill="#7c3aed"></rect><rect x="7.1" y="11" width="9.8" height="2" rx="1" fill="#7c3aed"></rect></svg></span>
                <span>Ver todo</span>
              </button>
            </div>

            <div class="yapa-promo">
              <div id="yapaPromoChip" class="yapa-promo-chip"></div>
              <div id="yapaPromoTitle" class="yapa-promo-title"></div>
            </div>

            <div class="yapa-panel">
              <div class="yapa-toggle-panel">
              <button id="yapaToggleBalance" class="yapa-toggle-row" type="button">
                  <span class="yapa-toggle-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.8 12s3.2-5.3 9.2-5.3 9.2 5.3 9.2 5.3-3.2 5.3-9.2 5.3-9.2-5.3-9.2-5.3z"></path><circle cx="12" cy="12" r="2.4"></circle></svg>
                  </span>
                  <span id="yapaToggleBalanceText">Mostrar saldo</span>
                  <span id="yapaToggleBalanceValue" class="yapa-inline-balance">${this.formatYapaMoney(this.yapas)}</span>
              </button>
              <button id="yapaToggleMoves" class="yapa-toggle-row" type="button">
                  <span class="yapa-toggle-icon">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="4.5" width="14" height="15" rx="2.2"></rect><path d="M8.5 9h7M8.5 12h7M8.5 15h5"></path></svg>
                  </span>
                  <span id="yapaToggleMovesText">Ocultar movimientos</span>
                  <span id="yapaToggleMovesArrow" class="yapa-toggle-arrow">^</span>
              </button>
              </div>

              <div class="yapa-stats">
                <div class="yapa-stat">
                  <span>Total gastado</span>
                  <b id="yapaSpent">${this.formatYapaMoney(this.yapaSpentTotal)}</b>
                </div>
                <div class="yapa-stat">
                  <span>Movimientos</span>
                  <b id="yapaMovesCount">${this.yapaMovements.length}</b>
                </div>
              </div>

              <div class="yapa-list-wrap">
                <div class="yapa-list-title">Movimientos</div>
                <div id="yapaMoves" class="yapa-list"></div>
              </div>
            </div>

            <div id="yapaWishSection" class="yapa-wish-section">
              <div class="yapa-wish-head">
                <button id="yapaWishBack" class="yapa-wish-back" type="button">\u2190</button>
                <b>Yapa Deseos</b>
              </div>
              <div class="yapa-wish-balance-card">
                <div id="yapaWishBalanceValue" class="yapa-wish-balance-value">${this.formatYapaMoney(this.yapas)}</div>
                <div class="yapa-wish-balance-label">Saldo disponible</div>
              </div>
              <div class="yapa-wish-actions">
                <button id="yapaBuyLimWishBtn" class="yapa-wish-action" type="button" data-yapa-note="Cambiar Deseo Limitado">
                  Cambiar Deseo Limitado
                  <small>S/.${YAPA_WISH_COST_LIM}</small>
                </button>
                <button id="yapaBuyPermWishBtn" class="yapa-wish-action" type="button" data-yapa-note="Cambiar Deseo Permanente">
                  Cambiar Deseo Permanente
                  <small>S/.${YAPA_WISH_COST_PERM}</small>
                </button>
                <button id="yapaRedeemWishCodeBtn" class="yapa-wish-action is-code" type="button" data-yapa-note="Canjear Codigo">
                  Canjear Codigo
                </button>
              </div>
              <input id="yapaWishCodeInput" class="yapa-wish-code-input" type="text" maxlength="24" placeholder="Ingresa codigo de deseos" />
              <div id="yapaWishHint" class="yapa-wish-hint">Toca un boton para gestionar deseos.</div>
              <div class="yapa-wish-history-wrap">
                <div class="yapa-wish-history-title">Historial de Cuenta</div>
                <div id="yapaWishMoves" class="yapa-wish-history-list"></div>
              </div>
            </div>
          </div>

          <div class="yapa-bottom">
            <button id="yapaScanQrBtn" class="yapa-cta yapa-cta-outline" data-yapa-note="Escanear QR">ESCANEAR QR</button>
            <button id="yapaYaparBtn" class="yapa-cta yapa-cta-fill" data-yapa-note="YAPAR">YAPAR</button>
            <div id="yapaBonusTimer" class="yapa-bonus-timer">Bono Yapa: sin señal</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.ensureYapaStoreOverlay(modal);

    const close = () => this.closeYapaModal();
    modal.querySelector("#yapaClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    modal.querySelector("#yapaToggleBalance")?.addEventListener("click", () => {
      this.yapaShowBalance = !this.yapaShowBalance;
      this.renderYapaModalData();
    });
    modal.querySelector("#yapaToggleMoves")?.addEventListener("click", () => {
      this.yapaShowMovements = !this.yapaShowMovements;
      this.renderYapaModalData();
    });

    modal.querySelectorAll("[data-yapa-note]").forEach((btn) => {
      btn.addEventListener("click", () => {
        btn.classList.remove("shake");
        void btn.offsetWidth;
        btn.classList.add("shake");
      });
    });

    modal.querySelector("#yapaScanQrBtn")?.addEventListener("click", () => {
      this.handleYapaScanQr(modal);
    });

    modal.querySelector("#yapaShortcutWishes")?.addEventListener("click", () => {
      this.setYapaWishView(true, modal);
    });
    modal.querySelector("#yapaShortcutStore")?.addEventListener("click", () => {
      this.yapaStoreCategory = "home";
      this.setYapaStoreView(true, modal);
    });

    modal.querySelector("#yapaWishBack")?.addEventListener("click", () => {
      this.setYapaWishView(false, modal);
    });

    modal.querySelector("#yapaBuyLimWishBtn")?.addEventListener("click", () => {
      const res = this.buyWishWithYapa("lim");
      const hint = modal.querySelector("#yapaWishHint");
      if (!hint) return;
      if (!res.ok) {
        hint.textContent = "No tienes saldo suficiente para Deseo Limitado.";
        hint.classList.add("error");
        return;
      }
      hint.textContent = `Compraste 1 Deseo Limitado por ${this.formatYapaMoney(res.cost)}.`;
      hint.classList.remove("error");
    });

    modal.querySelector("#yapaBuyPermWishBtn")?.addEventListener("click", () => {
      const res = this.buyWishWithYapa("perm");
      const hint = modal.querySelector("#yapaWishHint");
      if (!hint) return;
      if (!res.ok) {
        hint.textContent = "No tienes saldo suficiente para Deseo Permanente.";
        hint.classList.add("error");
        return;
      }
      hint.textContent = `Compraste 1 Deseo Permanente por ${this.formatYapaMoney(res.cost)}.`;
      hint.classList.remove("error");
    });

    modal.querySelector("#yapaRedeemWishCodeBtn")?.addEventListener("click", () => {
      const input = modal.querySelector("#yapaWishCodeInput");
      const code = input?.value || "";
      const res = this.redeemYapaWishCode(code);
      const hint = modal.querySelector("#yapaWishHint");
      if (!hint) return;
      if (!res.ok) {
        const msg = res.reason === "used"
          ? "Ese codigo ya fue canjeado."
          : (res.reason === "short" ? "Codigo invalido (minimo 4 caracteres)." : "Ingresa un codigo valido.");
        hint.textContent = msg;
        hint.classList.add("error");
        return;
      }
      const wishLabel = res.type === "lim" ? "Deseo Limitado" : "Deseo Permanente";
      hint.textContent = `Codigo canjeado: +${res.qty} ${wishLabel} (YAPADESEO).`;
      hint.classList.remove("error");
      if (input) input.value = "";
    });

    this.renderYapaModalData();
    this.updateYapaClock(modal);
    this.updateYapaBonusStatus(modal);
    this.yapaClockTimer = setInterval(() => {
      this.updateYapaClock(modal);
      this.updateYapaBonusStatus(modal);
      this.updateYapaRailTimer();
    }, 1000);
  }

  closeYapaModal() {
    this.yapaWishViewOpen = false;
    this.yapaStoreViewOpen = false;
    if (this.yapaClockTimer) {
      clearInterval(this.yapaClockTimer);
      this.yapaClockTimer = null;
    }
    const modal = document.getElementById("yapa-modal");
    if (modal?.parentNode) modal.remove();
  }
  updateYapaClock(modal) {
    if (!modal || !modal.isConnected) return;
    const now = new Date();
    const clockEl = modal.querySelector("#yapaClock");
    const dateEl = modal.querySelector("#yapaDate");
    const locale = (navigator && navigator.language) || "es-PE";
    const timeText = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    const parts = new Intl.DateTimeFormat(locale, {
      weekday: "short",
      day: "numeric",
      month: "short"
    }).formatToParts(now);
    const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
    const wd = String(p.weekday || "").replace(/[.,]/g, "").toLowerCase();
    const dd = String(p.day || "").trim();
    const mm = String(p.month || "").replace(/[.,]/g, "").toLowerCase();
    const dateText = (wd && dd && mm)
      ? `${wd} ${dd} ${mm}`
      : new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit" }).format(now);

    if (clockEl) clockEl.textContent = timeText;
    if (dateEl) dateEl.textContent = dateText;
  }

  formatCountdownMs(ms) {
    const total = Math.max(0, Math.ceil((Number(ms) || 0) / 1000));
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  updateYapaBonusStatus(modal) {
    const root = modal || document.getElementById("yapa-modal");
    if (!root) return;
    const timerEl = root.querySelector("#yapaBonusTimer");
    if (!timerEl) return;

    const status = this.scene?.getYapaBonusStatus?.(Date.now());
    if (!status || !status.active) {
      timerEl.textContent = "Bono Yapa: sin señal";
      timerEl.classList.remove("active");
      return;
    }

    timerEl.textContent = `Bono Yapa (${status.label}): ${this.formatCountdownMs(status.remainMs)}`;
    timerEl.classList.add("active");
  }

  updateYapaRailTimer() {
    const timerEl = document.getElementById("yapaRailTimer");
    if (!timerEl) return;
    const status = this.scene?.getYapaBonusStatus?.(Date.now());
    if (this.scene?.yapaScanMode && status?.active) {
      timerEl.textContent = `Escanea: ${this.formatCountdownMs(status.remainMs)}`;
      timerEl.classList.add("active");
      return;
    }
    if (!status || !status.active) {
      timerEl.textContent = "Bono: --:--";
      timerEl.classList.remove("active");
      return;
    }
    timerEl.textContent = `Bono: ${this.formatCountdownMs(status.remainMs)}`;
    timerEl.classList.add("active");
  }

  buildFakeQrCells(size = 19) {
    const side = Math.max(11, Math.min(29, size | 0));
    const finder = (x, y) => (
      ((x < 5 && y < 5) || (x > side - 6 && y < 5) || (x < 5 && y > side - 6))
    );

    const cells = [];
    for (let y = 0; y < side; y++) {
      for (let x = 0; x < side; x++) {
        let on = Math.random() < 0.46;
        if (finder(x, y)) {
          const lx = (x % (side - 1)) % 5;
          const ly = (y % (side - 1)) % 5;
          on = (lx === 0 || ly === 0 || lx === 4 || ly === 4 || (lx >= 1 && lx <= 3 && ly >= 1 && ly <= 3));
        }
        cells.push(`<span class="yapa-qr-cell${on ? " on" : ""}"></span>`);
      }
    }
    return { side, html: cells.join("") };
  }

  openYapaQrModal(payload) {
    if (!payload) return;
    const old = document.getElementById("yapa-qr-modal");
    if (old) old.remove();

    const amount = Math.max(5, Math.min(10, Number(payload.amount) || 5));
    const qr = this.buildFakeQrCells(19);
    const ticket = `BY-${Math.floor(Math.random() * 900000 + 100000)}`;

    const modal = document.createElement("div");
    modal.id = "yapa-qr-modal";
    modal.className = "inv-modal";
    modal.innerHTML = `
      <div class="yapa-qr-card">
        <div class="yapa-qr-head">
          <b>Bono Yapa</b>
          <button id="yapaQrClose" class="inv-x">X</button>
        </div>
        <div class="yapa-qr-sub">Casa detectada: <b>${payload.label || "Casa"}</b></div>
        <div class="yapa-qr-wrap">
          <div class="yapa-qr-grid" style="--qr-size:${qr.side};">${qr.html}</div>
        </div>
        <div class="yapa-qr-code">${ticket}</div>
        <div class="yapa-qr-reward">Escaneo listo: <b>+${amount} Yapa</b></div>
        <button id="yapaQrClaim" class="yapa-qr-claim">Cobrar Bono Yapa</button>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => {
      if (modal.parentNode) modal.remove();
    };
    modal.querySelector("#yapaQrClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    modal.querySelector("#yapaQrClaim")?.addEventListener("click", () => {
      const ok = this.scene?.claimYapaBonusFromQr?.(payload.buildingId);
      if (!ok) {
        close();
        this.updateYapaBonusStatus(document.getElementById("yapa-modal"));
        this.updateYapaRailTimer();
        return;
      }
      this.addYapas(amount, "Bono Yapa", "in");
      close();
      this.updateYapaBonusStatus(document.getElementById("yapa-modal"));
      this.updateYapaRailTimer();
    });
  }

  handleYapaScanQr(modal) {
    const scene = this.scene;
    if (!scene) return;

    const status = scene.getYapaBonusStatus?.(Date.now());
    if (!status?.active) {
      this.updateYapaBonusStatus(modal);
      this.updateYapaRailTimer();
      return;
    }
    this.closeYapaModal();
    const started = scene.startYapaScanMode?.();
    if (started) {
      scene.focusCameraOnBuilding?.(status.buildingId, 760);
    }
    this.updateYapaRailTimer();
  }

  renderYapaModalData() {
    const modal = document.getElementById("yapa-modal");
    if (!modal) return;
    modal.classList.toggle("yapa-wish-open", !!this.yapaWishViewOpen);
    this.renderYapaStoreOverlay(modal);

    const balanceEl = modal.querySelector("#yapaToggleBalanceValue");
    const spentEl = modal.querySelector("#yapaSpent");
    const movesCountEl = modal.querySelector("#yapaMovesCount");
    const movesEl = modal.querySelector("#yapaMoves");
    const toggleBalTextEl = modal.querySelector("#yapaToggleBalanceText");
    const toggleMovesTextEl = modal.querySelector("#yapaToggleMovesText");
    const toggleMovesArrowEl = modal.querySelector("#yapaToggleMovesArrow");
    const listWrapEl = modal.querySelector(".yapa-list-wrap");
    const wishBalanceEl = modal.querySelector("#yapaWishBalanceValue");
    const wishMovesEl = modal.querySelector("#yapaWishMoves");

    if (balanceEl) {
      balanceEl.textContent = this.yapaShowBalance
        ? this.formatYapaMoney(this.yapas)
        : "*** ***";
    }
    if (spentEl) spentEl.textContent = this.formatYapaMoney(this.yapaSpentTotal);
    if (movesCountEl) movesCountEl.textContent = String(this.yapaMovements.length);

    if (toggleBalTextEl) {
      toggleBalTextEl.textContent = this.yapaShowBalance
        ? "Ocultar saldo"
        : "Mostrar saldo";
    }
    if (toggleMovesTextEl) {
      toggleMovesTextEl.textContent = this.yapaShowMovements
        ? "Ocultar movimientos"
        : "Mostrar movimientos";
    }
    if (toggleMovesArrowEl) {
      toggleMovesArrowEl.textContent = this.yapaShowMovements ? "^" : "v";
    }
    if (listWrapEl) {
      listWrapEl.style.display = this.yapaShowMovements ? "block" : "none";
    }
    if (wishBalanceEl) {
      wishBalanceEl.textContent = this.formatYapaMoney(this.yapas);
    }

    if (movesEl) {
      if (!this.yapaShowMovements) {
        movesEl.innerHTML = "";
      } else if (!this.yapaMovements.length) {
        movesEl.innerHTML = `<div class="yapa-move empty">Aun no hay movimientos.</div>`;
      } else {
        movesEl.innerHTML = this.yapaMovements.map((m) => {
          const out = m.amount < 0;
          const rawDetail = String(m.detail || "").replace(/^Nombre:\s*/i, "").trim();
          const detailText = /admin/i.test(rawDetail)
            ? "Admin"
            : (/usuario/i.test(rawDetail) ? "Usuario" : (rawDetail || "Usuario"));
          const val = out
            ? `- ${this.formatYapaMoney(Math.abs(m.amount))}`
            : `${this.formatYapaMoney(Math.abs(m.amount))}`;
          return `
            <div class="yapa-move ${out ? "out" : "in"}">
              <div class="yapa-move-left">
                <div class="yapa-move-detail">${detailText}</div>
                <div class="yapa-move-time">${m.timeLabel}</div>
              </div>
              <div class="yapa-move-amount">${val}</div>
            </div>
          `;
        }).join("");
      }
    }

    if (wishMovesEl) {
      if (!this.yapaWishMovements.length) {
        wishMovesEl.innerHTML = `<div class="yapa-wish-move empty">Aun no hay movimientos de deseos.</div>`;
      } else {
        wishMovesEl.innerHTML = this.yapaWishMovements.map((m) => {
          const isOut = m.direction === "out";
          const arrow = isOut ? "\u2191" : "\u2193";
          const moveType = isOut ? "out" : "in";
          const label = String(m.label || "Deseo");
          const qty = `x${Math.max(1, Number(m.qty) || 1)}`;
          return `
            <div class="yapa-wish-move ${moveType}">
              <div class="yapa-wish-move-left">
                <div class="yapa-wish-move-detail">${arrow} ${label}</div>
                <div class="yapa-wish-move-time">${m.timeLabel || ""}</div>
              </div>
              <div class="yapa-wish-move-qty">${qty}</div>
            </div>
          `;
        }).join("");
      }
    }

    this.updateYapaBonusStatus(modal);
    this.updateYapaRailTimer();
  }
  openAdminModal() {
    try {
      if (document.getElementById("admin-modal")) return;

      const modal = document.createElement("div");
      modal.id = "admin-modal";
      modal.className = "inv-modal";
      modal.innerHTML = `
        <div class="inv-card admin-card">
          <div class="inv-header">
            <div class="inv-title">Admin Items</div>
            <button id="adminClose" class="inv-x">\u2716</button>
          </div>
          <div class="admin-tools">
            <button id="adminSpendYapa100" class="admin-tool-btn admin-tool-out">Gastar 100 Yapa</button>
            <button id="adminYaparYapa100" class="admin-tool-btn admin-tool-in">YAPAR 100 Yapa</button>
            <button id="adminSpawnQrBtn" class="admin-tool-btn admin-tool-qr">Aparecer QR</button>
          </div>
          <div class="admin-weather-panel">
            <div class="admin-road-head">
              <div class="admin-road-title">Clima / Estacion (Lima)</div>
              <div class="admin-road-sub">Panel debug con estaciones, climas y eventos.</div>
            </div>
            <div id="adminWeatherPanel" class="admin-weather-body"></div>
          </div>
          <div id="adminList" class="inv-list admin-list"></div>
          <div class="admin-road-panel">
            <div class="admin-road-head">
              <div class="admin-road-title">Carreteras temporales (sin consumo)</div>
              <div class="admin-road-sub">Usa R01..R45 para guiar conexiones manualmente.</div>
            </div>
            <div id="adminRoadList" class="admin-road-list"></div>
          </div>
          <small id="adminHint" class="inv-hint">Toca un item para a\u00F1adirlo al inventario o elige una carretera temporal.</small>
        </div>
      `;

      document.body.appendChild(modal);

      const close = () => {
        if (modal.parentNode) modal.remove();
      };

      modal.querySelector("#adminClose").onclick = close;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });

      const hintEl = modal.querySelector("#adminHint");
      const setHint = (msg) => {
        if (!hintEl) return;
        hintEl.textContent = msg;
      };

      modal.querySelector("#adminSpendYapa100")?.addEventListener("click", () => {
        const ok = this.spendYapas(100, "Admin");
        if (!ok) {
          setHint("No tienes suficiente Yapa para gastar 100.");
          return;
        }
        setHint("Movimiento registrado: - S/.100");
      });

      modal.querySelector("#adminYaparYapa100")?.addEventListener("click", () => {
        this.addYapas(100, "Admin", "in");
        setHint("Movimiento registrado: S/.100");
      });

      modal.querySelector("#adminSpawnQrBtn")?.addEventListener("click", () => {
        const res = this.scene?.forceSpawnYapaBonus?.();
        if (res?.ok) {
          setHint("QR de Bono Yapa activado.");
          this.updateYapaBonusStatus(document.getElementById("yapa-modal"));
        } else if (res?.reason === "active") {
          setHint("Ya existe un Bono Yapa activo.");
        } else {
          setHint("No hay casas listas para cobrar.");
        }
      });

      this.renderAdminList(modal.querySelector("#adminList"));
      this.renderAdminWeatherPanel(modal.querySelector("#adminWeatherPanel"), setHint);
      this.renderAdminRoadPieceList(modal.querySelector("#adminRoadList"), setHint);
    } catch (err) {
      console.error("openAdminModal failed:", err);
      document.getElementById("admin-modal")?.remove();
      this.showUiErrorMessage(`No se pudo abrir Admin: ${err?.message || err}`);
    }
  }

  renderAdminWeatherPanel(panelEl, setHint = null) {
    if (!panelEl) return;
    const seasonOrder = ["Verano", "Otono", "Invierno", "Primavera"];
    const now = new Date();
    const baseSeason = this.getPeruSeasonByDate(now);
    const dbg = this.weatherDebugOverride || null;
    const activeSeason = String(dbg?.season || baseSeason);
    const activeWeather = (dbg?.kind === "pinned" && typeof dbg.weather === "string")
      ? String(dbg.weather)
      : "";

    const isSeasonActive = (season) => (
      dbg?.kind === "season_locked" && String(dbg?.season || "") === String(season)
    );
    const isWeatherActive = (season, weatherLabel) => (
      dbg?.kind === "pinned"
      && String(dbg?.season || "") === String(season)
      && String(activeWeather) === String(weatherLabel)
    );
    const isEventActive = (eventLabel) => (
      dbg?.kind === "pinned" && String(activeWeather) === `Evento: ${String(eventLabel)}`
    );

    const seasonButtons = seasonOrder.map((season) => `
      <button
        class="admin-weather-btn ${isSeasonActive(season) ? "is-active" : ""}"
        data-weather-action="season"
        data-weather-season="${season}"
      >${season}</button>
    `).join("");

    const climateGroups = seasonOrder.map((season) => {
      const pool = Array.isArray(LIMA_WEATHER_POOLS[season]) ? LIMA_WEATHER_POOLS[season] : [];
      const rows = pool.map((row) => {
        const label = String(row?.label || "Clima variable");
        return `
          <button
            class="admin-weather-btn admin-weather-btn-small ${isWeatherActive(season, label) ? "is-active" : ""}"
            data-weather-action="weather"
            data-weather-season="${season}"
            data-weather-label="${label}"
          >${label}</button>
        `;
      }).join("");
      return `
        <div class="admin-weather-group">
          <div class="admin-weather-group-title">${season}</div>
          <div class="admin-weather-grid">${rows}</div>
        </div>
      `;
    }).join("");

    const eventButtons = LIMA_WEATHER_ANOMALIES.map((labelRaw) => {
      const label = String(labelRaw || "Evento");
      return `
        <button
          class="admin-weather-btn admin-weather-btn-event ${isEventActive(label) ? "is-active" : ""}"
          data-weather-action="event"
          data-weather-label="${label}"
        >${label}</button>
      `;
    }).join("");

    panelEl.innerHTML = `
      <div class="admin-weather-tools">
        <button class="admin-weather-btn ${!dbg ? "is-active" : ""}" data-weather-action="auto">AUTO</button>
        <button class="admin-weather-btn ${dbg?.kind === "event_cycle" ? "is-active" : ""}" data-weather-action="event-random-loop">Evento random</button>
        <button class="admin-weather-btn" data-weather-action="weather-random">Clima random</button>
      </div>
      <div class="admin-weather-group">
        <div class="admin-weather-group-title">Estaciones</div>
        <div class="admin-weather-grid">${seasonButtons}</div>
      </div>
      <div class="admin-weather-group">
        <div class="admin-weather-group-title">Climas por estacion</div>
        ${climateGroups}
      </div>
      <div class="admin-weather-group">
        <div class="admin-weather-group-title">Eventos climaticos</div>
        <div class="admin-weather-grid">${eventButtons}</div>
      </div>
    `;

    panelEl.querySelectorAll("[data-weather-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = String(btn.getAttribute("data-weather-action") || "");
        const season = String(btn.getAttribute("data-weather-season") || "");
        const label = String(btn.getAttribute("data-weather-label") || "");
        let snap = null;

        if (action === "auto") {
          snap = this.setLimaWeatherDebugMode("auto");
          if (setHint) setHint(`Clima AUTO activo: ${snap.season} | ${snap.weather}`);
        } else if (action === "event-random-loop") {
          if (this.weatherDebugOverride?.kind === "event_cycle") {
            snap = this.setLimaWeatherDebugMode("auto");
            if (setHint) setHint(`Evento random OFF. AUTO: ${snap.season} | ${snap.weather}`);
          } else {
            snap = this.setLimaWeatherDebugMode("event_cycle");
            if (setHint) setHint(`Evento random ON: ${snap.season} | ${snap.weather}`);
          }
        } else if (action === "weather-random") {
          snap = this.setLimaWeatherDebugMode("random_weather");
          if (setHint) setHint(`Clima random: ${snap.season} | ${snap.weather}`);
        } else if (action === "season" && season) {
          snap = this.setLimaWeatherDebugMode("season_locked", { season });
          if (setHint) setHint(`Estacion fija: ${snap.season} | ${snap.weather}`);
        } else if (action === "weather" && season && label) {
          snap = this.setLimaWeatherDebugMode("set_weather", { season, weather: label });
          if (setHint) setHint(`Clima fijado: ${snap.season} | ${snap.weather}`);
        } else if (action === "event" && label) {
          snap = this.setLimaWeatherDebugMode("set_event", { season: activeSeason, eventLabel: label });
          if (setHint) setHint(`Evento fijado: ${snap.season} | ${snap.weather}`);
        }

        this.renderAdminWeatherPanel(panelEl, setHint);
      });
    });
  }

  renderAdminList(listEl) {
    if (!listEl) return;
    const keys = Object.keys(ITEM_DEFS);
    const rows = keys.map((k) => {
      const def = ITEM_DEFS[k];
      const c = this.inventory[k] || 0;
      const metaLine = getItemInventoryMeta(def);
      return `
        <button class="inv-row" data-admin="${k}">
          <span class="inv-left">
            <span class="inv-name">${def.icon || "\u2756"} ${def.name || k}</span>
            <span class="inv-meta">${metaLine} \u2022 en inv: ${c}</span>
          </span>
          <span class="inv-count">+1</span>
        </button>
      `;
    });

    listEl.innerHTML = rows.join("");

    listEl.querySelectorAll("[data-admin]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-admin");
        if (!key) return;
        this.addItem(key, 1);
        this.renderAdminList(listEl);
      });
    });
  }

  renderAdminRoadPieceList(listEl, setHint = null) {
    if (!listEl) return;
    const scene = this.scene;
    const activePiece = Number(scene?.getAdminForcedRoadPiece?.() || 0);
    const rows = [];

    rows.push(`
      <button class="admin-road-btn admin-road-auto ${activePiece === 0 ? "is-active" : ""}" data-road-piece="0">
        AUTO
      </button>
    `);

    for (let i = 1; i <= 45; i++) {
      const id = String(i).padStart(2, "0");
      rows.push(`
        <button class="admin-road-btn ${activePiece === i ? "is-active" : ""}" data-road-piece="${i}">
          R${id}
        </button>
      `);
    }

    listEl.innerHTML = rows.join("");
    listEl.querySelectorAll("[data-road-piece]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const piece = Number(btn.getAttribute("data-road-piece") || 0);
        if (piece > 0) {
          const applied = scene?.setAdminRoadPiecePlacement?.(piece) ?? 0;
          if (setHint) setHint(`Modo temporal activo: R${String(applied).padStart(2, "0")} (sin consumo).`);
        } else {
          scene?.clearAdminRoadPiecePlacement?.();
          scene.selectedBuildKey = "road_main_2x2";
          scene.setBuildMode?.();
          if (setHint) setHint("Modo carretera normal activo (AUTO, consume inventario).");
        }
        this.renderAdminRoadPieceList(listEl, setHint);
      });
    });
  }

  openNpcInventoryModal() {
    try {
      if (document.getElementById("npc-inventory-modal")) return;

      const modal = document.createElement("div");
      modal.id = "npc-inventory-modal";
      modal.className = "inv-modal";
      modal.innerHTML = `
        <div class="inv-card npc-inv-card">
          <div class="inv-header">
            <div class="inv-title">Almacen NPC</div>
            <button id="npcInvClose" class="inv-x">✖</button>
          </div>
          <div id="npcInvList" class="npc-inv-list"></div>
          <small class="inv-hint">Selecciona un NPC para abrir su pantalla. Si no esta en edificio usa fondo base temporal.</small>
        </div>
      `;

      document.body.appendChild(modal);

      const close = () => {
        if (modal.parentNode) modal.remove();
      };

      modal.querySelector("#npcInvClose").onclick = close;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) close();
      });

      this.renderNpcInventoryIntoContainer(modal.querySelector("#npcInvList"));
    } catch (err) {
      console.error("openNpcInventoryModal failed:", err);
      document.getElementById("npc-inventory-modal")?.remove();
      this.showUiErrorMessage(`No se pudo abrir Almacen NPC: ${err?.message || err}`);
    }
  }

  renderNpcInventoryIntoContainer(listEl) {
    if (!listEl) return;
    const entries = this.getNpcInventoryEntries();
    if (!entries.length) {
      listEl.innerHTML = `<div style="font-size:12px;color:#94a3b8;">No tienes NPC en el almacen.</div>`;
      return;
    }

    listEl.innerHTML = entries.map((entry) => {
      const stars = "★".repeat(entry.rarity);
      return `
        <button class="npc-inv-item" type="button" data-npc-open="${entry.key}" data-npc-entry="${entry.entryId}" style="--npc-card-accent:${entry.def.cardAccent || "#c084fc"};">
          <div class="npc-inv-icon" style="background:linear-gradient(180deg, ${entry.def.cardBg1 || "#312e81"} 0%, ${entry.def.cardBg2 || "#0f172a"} 100%);border-color:${entry.def.cardAccent || "#c084fc"};">
            ${entry.def.cardSigil || entry.def.icon || "NPC"}
          </div>
          <div class="npc-inv-meta">
            <div class="npc-inv-name">${entry.def.name || entry.key}</div>
            <div class="npc-inv-sub">${stars} | ${entry.locationLabel}</div>
            <div class="npc-inv-sub">Main: ${entry.mainStatLabel} ${entry.mainStatValue}</div>
          </div>
          <div class="npc-inv-open">Abrir</div>
        </button>
      `;
    }).join("");

    listEl.querySelectorAll("[data-npc-open]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const npcKey = String(btn.getAttribute("data-npc-open") || "");
        const entryId = String(btn.getAttribute("data-npc-entry") || "");
        const entry = entries.find((it) => String(it.entryId || "") === entryId);
        if (!npcKey) return;
        const ok = this.openGhostNpcLabModal({
          npcKey,
          sourceMode: "inventory",
          backgroundMode: "plain",
          contextTitle: "Almacen NPC",
          contextSubtitle: "Vista base del NPC en fondo limpio."
        });
        if (ok) {
          const modal = document.getElementById("npc-inventory-modal");
          if (modal) modal.remove();
        }
      });
    });
  }

  openInventoryModal() {
    if (document.getElementById("inventory-modal")) return;

    const modal = document.createElement("div");
    modal.id = "inventory-modal";
    modal.className = "inv-modal";
    modal.innerHTML = `
      <div class="inv-card">
        <div class="inv-header">
          <div class="inv-title">Inventario</div>
          <button id="invClose" class="inv-x">\u2716</button>
        </div>
        <div id="invList" class="inv-list"></div>
        <small class="inv-hint">Toca un item para construir.</small>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      if (modal.parentNode) modal.remove();
    };

    modal.querySelector("#invClose").onclick = close;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    this.renderInventoryIntoContainer(modal.querySelector("#invList"));
  }

  getRoadSharedCount() {
    this.inventory = this.inventory || {};
    return Math.max(0, Math.round(Number(this.inventory.road_main_2x2) || 0));
  }

  getRoadThumbPath(piece) {
    const id = String(Math.max(1, Math.min(45, Math.round(Number(piece) || 1)))).padStart(2, "0");
    return {
      png: `img/roadkoto-${id}.png`,
      jpg: `img/roadkoto-${id}.jpg`
    };
  }

  getRoadThumbImage(piece) {
    const id = Math.max(1, Math.min(45, Math.round(Number(piece) || 1)));
    if (!this._roadThumbImageCache) this._roadThumbImageCache = new Map();
    const cached = this._roadThumbImageCache.get(id);
    if (cached?.img && cached.img.complete) return Promise.resolve(cached.img);
    if (cached?.promise) return cached.promise;

    const thumb = this.getRoadThumbPath(id);
    const sources = [thumb.jpg, thumb.png];
    const promise = new Promise((resolve) => {
      const loadAt = (idx) => {
        if (idx >= sources.length) {
          resolve(null);
          return;
        }
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = () => loadAt(idx + 1);
        img.src = sources[idx];
      };
      loadAt(0);
    }).then((img) => {
      this._roadThumbImageCache.set(id, { img: img || null, promise: Promise.resolve(img || null) });
      return img;
    });

    this._roadThumbImageCache.set(id, { img: null, promise });
    return promise;
  }

  drawRoadThumbIso(canvas, piece) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.max(1, Math.min(2, Number(window.devicePixelRatio) || 1));
    const cssW = Math.max(1, Math.round(canvas.clientWidth || 124));
    const cssH = Math.max(1, Math.round(canvas.clientHeight || 124));
    const pxW = Math.max(1, Math.round(cssW * dpr));
    const pxH = Math.max(1, Math.round(cssH * dpr));
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.getRoadThumbImage(piece).then((img) => {
      if (!canvas.isConnected) return;
      const c = canvas.getContext("2d");
      if (!c) return;
      c.clearRect(0, 0, canvas.width, canvas.height);
      if (!img) return;

      const w = canvas.width;
      const h = canvas.height;
      c.save();
      c.imageSmoothingEnabled = true;
      c.imageSmoothingQuality = "high";
      c.translate(w * 0.5, h * 0.58);
      c.scale(1, 0.5);
      c.rotate(Math.PI / 4);

      const drawW = w * 0.73;
      const drawH = drawW * (img.height / Math.max(1, img.width));
      c.drawImage(img, -drawW * 0.5, -drawH * 0.5, drawW, drawH);
      c.restore();
    });
  }

  renderRoadInventoryThumbs(listEl) {
    if (!listEl) return;
    listEl.querySelectorAll("[data-road-thumb-canvas]").forEach((el) => {
      const piece = Number(el.getAttribute("data-road-thumb-canvas") || 0);
      if (piece <= 0) return;
      this.drawRoadThumbIso(el, piece);
    });
  }

  openRoadInventoryModal() {
    if (document.getElementById("road-inventory-modal")) return;

    const modal = document.createElement("div");
    modal.id = "road-inventory-modal";
    modal.className = "inv-modal";
    modal.innerHTML = `
      <div class="inv-card road-inv-card">
        <div class="inv-header">
          <div class="inv-title">Inventario Carreteras</div>
          <button id="roadInvClose" class="inv-x">✖</button>
        </div>
        <div class="road-inv-head">
          <div>Stock global: <b id="roadInvGlobalCount">x ${this.getRoadSharedCount()}</b></div>
          <small>La carretera se coloca en modo automatico.</small>
        </div>
        <div id="roadInvList" class="road-inv-list"></div>
        <small class="inv-hint">Selecciona la carretera base para construir. Las formas se resuelven solas.</small>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      if (modal.parentNode) modal.remove();
    };

    modal.querySelector("#roadInvClose").onclick = close;
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    this.renderRoadInventoryIntoContainer(modal.querySelector("#roadInvList"));
  }

  selectRoadPieceForBuild(piece) {
    if (!this.scene) return false;
    if (!Number.isFinite(Number(piece)) || Number(piece) <= 0) return false;
    if (this.getRoadSharedCount() <= 0) return false;
    if (document.getElementById("building-modal") || document.getElementById("evo-modal")) return false;

    const clamped = Math.max(1, Math.min(45, Math.round(Number(piece) || 1)));
    if (typeof this.scene.setInventoryRoadPiecePlacement === "function") {
      this.scene.setInventoryRoadPiecePlacement(clamped);
    } else {
      this.scene.setAdminRoadPiecePlacement?.(clamped);
    }
    this.scene.selectedBuildKey = "road_main_2x2";
    this.scene.setBuildMode?.();
    return true;
  }

  selectRoadAutoBuild() {
    if (!this.scene) return false;
    if (this.getRoadSharedCount() <= 0) return false;
    if (document.getElementById("building-modal") || document.getElementById("evo-modal")) return false;
    this.scene.clearAdminRoadPiecePlacement?.();
    this.scene.selectedBuildKey = "road_main_2x2";
    this.scene.setBuildMode?.();
    return true;
  }

  renderRoadInventoryIntoContainer(listEl) {
    if (!listEl) return;

    const stock = this.getRoadSharedCount();
    const disabled = stock <= 0;
    listEl.innerHTML = `
      <button class="road-inv-item ${disabled ? "is-empty" : ""}" data-road-auto-item="1" ${disabled ? "disabled" : ""}>
        <div class="road-inv-thumb-wrap">
          <canvas class="road-inv-thumb road-inv-thumb-canvas" data-road-thumb-canvas="33" aria-label="Carretera 2x2"></canvas>
        </div>
        <div class="road-inv-code">Carretera 2x2</div>
        <div class="road-inv-count">x ${stock}</div>
      </button>
    `;
    this.renderRoadInventoryThumbs(listEl);

    listEl.querySelectorAll("[data-road-auto-item]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ok = this.selectRoadAutoBuild();
        if (!ok) return;
        const modal = document.getElementById("road-inventory-modal");
        if (modal) modal.remove();
      });
    });
  }

  selectBuildItem(key) {
    if (!key || !this.scene) return;
    const def = ITEM_DEFS[key];
    if (!def || def.buildable === false) return false;
    if (document.getElementById("building-modal") || document.getElementById("evo-modal")) return;
    this.scene.clearAdminRoadPiecePlacement?.();
    this.scene.selectedBuildKey = key;
    this.scene.setBuildMode?.();
    return true;
  }

  spendGold(v, detail = "Tienda Oro") {
    const amount = Math.max(0, Math.round(Number(v) || 0));
    if (amount <= 0) return false;
    if (this.gold < amount) return false;
    this.gold -= amount;
    this.goldStoreLastMessage = `-${amount} oro | ${detail}`;
    this.refreshUI();
    this.updateModalCounts();
    return true;
  }

  getGoldStoreOffersForCategory(categoryKey) {
    const cat = String(categoryKey || "casa");
    return GOLD_STORE_OFFERS.filter((o) => o.category === cat && this.isGoldStoreOfferAllowed(o));
  }

  isGoldStoreOfferAllowed(offer) {
    if (!offer || !offer.itemKey) return false;
    const def = ITEM_DEFS[offer.itemKey];
    if (!def) return false;
    if (def.buildable === false) return true;
    const rarity = Math.max(1, Math.round(Number(def.rarity) || 1));
    return rarity <= GOLD_STORE_MAX_BUILDABLE_RARITY;
  }

  buyGoldStoreOffer(offerId) {
    const offer = GOLD_STORE_OFFERS.find((o) => o.id === offerId);
    if (!offer) return { ok: false, reason: "not-found" };
    const def = ITEM_DEFS[offer.itemKey];
    if (!def) return { ok: false, reason: "invalid-item" };
    if (!this.isGoldStoreOfferAllowed(offer)) return { ok: false, reason: "locked" };

    const total = Math.max(0, Math.round(Number(offer.price) || 0));
    if (total <= 0) return { ok: false, reason: "invalid-price" };
    const ok = this.spendGold(total, `Tienda Oro - ${def.name}`);
    if (!ok) return { ok: false, reason: "funds" };

    const qty = Math.max(1, Math.round(Number(offer.qty) || 1));
    this.addItem(offer.itemKey, qty);
    this.goldStoreLastMessage = `Comprado: ${def.name} x${qty}`;
    this.updateModalCounts();
    return { ok: true, offer, qty };
  }

  renderGoldStoreModal(modal) {
    if (!modal) return;
    const balEl = modal.querySelector("#goldStoreBalance");
    const msgEl = modal.querySelector("#goldStoreHint");
    const tabsEl = modal.querySelector("#goldStoreTabs");
    const listEl = modal.querySelector("#goldStoreList");
    if (!tabsEl || !listEl) return;

    if (balEl) balEl.textContent = `${this.formatGoldHUD(this.gold)} oro`;
    if (msgEl) msgEl.textContent = this.goldStoreLastMessage || "Compra usando oro. Selecciona categoría.";

    tabsEl.querySelectorAll("[data-gold-store-cat]").forEach((btn) => {
      const cat = String(btn.getAttribute("data-gold-store-cat") || "");
      const isActive = cat === this.goldStoreCategory;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
    });

    const offers = this.getGoldStoreOffersForCategory(this.goldStoreCategory);
    if (!offers.length) {
      const catDef = GOLD_STORE_CATEGORIES.find((c) => c.key === this.goldStoreCategory);
      listEl.innerHTML = `
        <div class="gold-store-empty">
          <div style="font-size:18px;margin-bottom:6px;">${catDef?.icon || "🏬"} ${catDef?.label || "Categoria"}</div>
          <div>Sin productos por ahora en esta sección.</div>
          <div style="opacity:.75;margin-top:6px;">Cuando me pases tu nueva casa, la agrego aquí.</div>
        </div>
      `;
      return;
    }

    listEl.innerHTML = offers.map((offer) => {
      const def = ITEM_DEFS[offer.itemKey] || { name: offer.itemKey, icon: "❓", size: 1, rarity: 1 };
      const qty = Math.max(1, Math.round(Number(offer.qty) || 1));
      const canBuy = this.gold >= offer.price;
      const meta = getItemInventoryMeta(def);
      return `
        <div class="gold-store-item">
          <div class="gold-store-item-head">
            <div class="gold-store-item-name">${def.icon} ${def.name}</div>
            <div class="gold-store-item-meta">${meta}</div>
          </div>
          <div class="gold-store-item-side">
            <div class="gold-store-price">${offer.price} oro</div>
            <div class="gold-store-qty">x${qty}</div>
            <button class="gold-store-buy-btn" data-gold-store-buy="${offer.id}" ${canBuy ? "" : "disabled"}>
              ${canBuy ? "Comprar" : "Sin oro"}
            </button>
          </div>
        </div>
      `;
    }).join("");

    listEl.querySelectorAll("[data-gold-store-buy]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = String(btn.getAttribute("data-gold-store-buy") || "");
        if (!id) return;
        const res = this.buyGoldStoreOffer(id);
        if (!res.ok) {
          this.goldStoreLastMessage = res.reason === "funds"
            ? "No tienes oro suficiente."
            : (res.reason === "locked"
              ? `La tienda de oro solo vende construcciones hasta ${GOLD_STORE_MAX_BUILDABLE_RARITY}★.`
              : "No se pudo completar la compra.");
          this.renderGoldStoreModal(modal);
          return;
        }
        this.renderGoldStoreModal(modal);
      });
    });
  }

  openGoldStoreModal() {
    if (document.getElementById("gold-store-modal")) return;

    const modal = document.createElement("div");
    modal.id = "gold-store-modal";
    modal.className = "inv-modal";

    const tabsHtml = GOLD_STORE_CATEGORIES.map((cat) => `
      <button class="gold-store-tab ${cat.key === this.goldStoreCategory ? "is-active" : ""}" data-gold-store-cat="${cat.key}" type="button">
        <span>${cat.icon}</span><span>${cat.label}</span>
      </button>
    `).join("");

    modal.innerHTML = `
      <div class="inv-card gold-store-card">
        <div class="inv-header">
          <div class="inv-title">Tienda Oro</div>
          <button id="goldStoreClose" class="inv-x">✖</button>
        </div>
        <div class="gold-store-topline">
          <div>Saldo: <b id="goldStoreBalance">${this.formatGoldHUD(this.gold)} oro</b></div>
          <div id="goldStoreHint" class="gold-store-hint">Compra usando oro. Selecciona categoría.</div>
        </div>
        <div id="goldStoreTabs" class="gold-store-tabs">${tabsHtml}</div>
        <div id="goldStoreList" class="gold-store-list"></div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      if (modal.parentNode) modal.remove();
    };
    modal.querySelector("#goldStoreClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    modal.querySelectorAll("[data-gold-store-cat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.goldStoreCategory = String(btn.getAttribute("data-gold-store-cat") || "casa");
        this.renderGoldStoreModal(modal);
      });
    });

    this.renderGoldStoreModal(modal);
  }

  buildNpcRandomStatProfiles() {
    return Object.fromEntries(
      Object.entries(ITEM_DEFS)
        .filter(([key, def]) => key.startsWith("npc_") && def?.buildable === false)
        .map(([key, def]) => [key, this.buildNpcRandomStatProfileForKey(key, def)])
    );
  }

  buildNpcRandomStatProfileForKey(key, def = {}) {
    const rarity = Math.max(1, Math.min(5, Math.round(Number(def?.rarity) || 1)));
    const ranges = NPC_RANDOM_STAT_RANGES[rarity] || NPC_RANDOM_STAT_RANGES[1];
    const rng = makeNpcSeededRng(hashNpcSeed(`${key}|${rarity}|${def?.name || ""}`));
    const primaryStatKey = NPC_PRIMARY_STAT_KEYS[randNpcInt(rng, 0, NPC_PRIMARY_STAT_KEYS.length - 1)];
    const secondaryPool = NPC_SECONDARY_STAT_KEYS.filter((statKey) => statKey !== primaryStatKey);
    const secondaryStatKey = secondaryPool[randNpcInt(rng, 0, secondaryPool.length - 1)];
    const stats = Object.fromEntries(NPC_RANDOM_STAT_KEYS.map((statKey) => [statKey, 0]));

    stats[primaryStatKey] = randNpcInt(rng, ranges.main[0], ranges.main[1]);
    stats[secondaryStatKey] = randNpcInt(rng, ranges.secondary[0], ranges.secondary[1]);

    NPC_SECONDARY_STAT_KEYS.forEach((statKey) => {
      if (statKey === primaryStatKey || statKey === secondaryStatKey) return;
      stats[statKey] = randNpcInt(rng, ranges.normal[0], ranges.normal[1]);
    });

    stats.stamina = randNpcInt(
      rng,
      Number.isFinite(Number(ranges.stamina?.[0])) ? ranges.stamina[0] : ranges.secondary[0],
      Number.isFinite(Number(ranges.stamina?.[1])) ? ranges.stamina[1] : ranges.secondary[1]
    );
    stats.estres = randNpcInt(rng, ranges.estres[0], ranges.estres[1]);
    stats.fortuna = randNpcInt(rng, ranges.fortuna[0], ranges.fortuna[1]);

    const lowestNonFortune = Math.min(
      ...Object.entries(stats)
        .filter(([statKey]) => statKey !== "fortuna")
        .map(([, value]) => Math.max(1, Math.round(Number(value) || 1)))
    );
    stats.fortuna = Math.max(1, Math.min(stats.fortuna, lowestNonFortune - 1));

    return {
      key,
      rarity,
      primaryStatKey,
      primaryStatLabel: NPC_RANDOM_STAT_LABELS[primaryStatKey] || primaryStatKey,
      primaryStatValue: stats[primaryStatKey],
      secondaryStatKey,
      stats
    };
  }

  applyNpcRandomStatProfilesToDefs() {
    Object.entries(this.npcBaseStatProfiles || {}).forEach(([key, profile]) => {
      const def = ITEM_DEFS[key];
      if (!def || !profile) return;
      def.npcBaseStats = { ...profile.stats };
      def.npcPrimaryStatKey = profile.primaryStatKey;
      def.npcPrimaryStatLabel = profile.primaryStatLabel;
      def.npcPrimaryStatValue = profile.primaryStatValue;
    });
  }

  getNpcRandomStatsForKey(key) {
    return this.npcBaseStatProfiles?.[key] || null;
  }

  getNpcRarityForKey(npcKey) {
    const key = String(npcKey || "").trim();
    const sceneValue = this.scene?.getNpcRarityForKey?.(key);
    if (Number.isFinite(Number(sceneValue))) {
      return Math.max(1, Math.min(5, Math.round(Number(sceneValue))));
    }
    const def = ITEM_DEFS[key] || null;
    return Math.max(1, Math.min(5, Math.round(Number(def?.rarity) || 1)));
  }

  getNpcRoleForKey(npcKey) {
    const key = String(npcKey || "").trim();
    const sceneValue = this.scene?.getNpcRoleForKey?.(key);
    if (typeof sceneValue === "string" && sceneValue.trim()) return sceneValue.trim();
    const def = ITEM_DEFS[key] || null;
    return String(def?.npcRole || def?.cardMeta || "NPC").trim();
  }

  getNpcPrimaryStatForKey(key) {
    const profile = this.getNpcRandomStatsForKey(key);
    if (!profile) return null;
    return {
      key: profile.primaryStatKey,
      label: profile.primaryStatLabel,
      value: profile.primaryStatValue
    };
  }

  getNpcLevelGrowthForKey(npcKey, rarityOverride = null) {
    const primary = this.getNpcPrimaryStatForKey(npcKey);
    const rarityFromOverride = Number(rarityOverride);
    const rarityFromKey = this.getNpcRarityForKey(npcKey);
    const rarity = Math.max(
      1,
      Math.min(5, Math.round(Number.isFinite(rarityFromOverride) ? rarityFromOverride : rarityFromKey))
    );
    const staminaPerLevel = rarity >= 5 ? 50 : (rarity >= 4 ? 40 : 30);
    const growth = {
      stamina: staminaPerLevel,
      produccion: 1,
      felicidad: 1,
      inteligencia: 1,
      fortuna: 0,
      estres: 0
    };
    if (
      primary?.key
      && primary.key !== "stamina"
      && Object.prototype.hasOwnProperty.call(growth, primary.key)
    ) {
      growth[primary.key] += 5;
    }
    return growth;
  }

  applyGhostNpcLabLevelGrowth(state, gainedLevels = 0) {
    const steps = Math.max(0, Math.round(Number(gainedLevels) || 0));
    if (!steps || !state || typeof state !== "object") return;
    const stats = state.stats && typeof state.stats === "object" ? state.stats : {};
    const growth = this.getNpcLevelGrowthForKey(state.npcKey, state.rarity);
    state.stats = {
      stamina: Math.max(0, Math.round(Number(stats.stamina) || 0) + (growth.stamina * steps)),
      produccion: Math.max(0, Math.round(Number(stats.produccion) || 0) + (growth.produccion * steps)),
      felicidad: Math.max(0, Math.round(Number(stats.felicidad) || 0) + (growth.felicidad * steps)),
      inteligencia: Math.max(0, Math.round(Number(stats.inteligencia) || 0) + (growth.inteligencia * steps)),
      fortuna: Math.max(0, Math.round(Number(stats.fortuna) || 0)),
      estres: Math.max(0, Math.round(Number(stats.estres) || 0))
    };
  }

  createDefaultGhostNpcLabState(overrides = {}) {
    const instanceId = String(overrides.instanceId || "").trim();
    const instance = instanceId ? this.getNpcInventoryInstanceById(instanceId) : null;
    const sourceMode = ["ghost", "inventory", "building"].includes(String(overrides.sourceMode || ""))
      ? String(overrides.sourceMode)
      : ((String(overrides.npcKey || instance?.key || "").trim() ? "inventory" : "ghost"));
    const fallbackNpcKey = String(overrides.npcKey || instance?.key || "");
    const installedProfile = (!instance && sourceMode === "building" && instanceId && fallbackNpcKey)
      ? this.getNpcInstalledProfile(instanceId, fallbackNpcKey)
      : null;
    const npcKey = String(overrides.npcKey || instance?.key || installedProfile?.key || "");
    const def = (npcKey && ITEM_DEFS[npcKey]) ? ITEM_DEFS[npcKey] : null;
    const rarity = Math.max(
      1,
      Math.min(
        5,
        Math.round(Number(overrides.rarity) || instance?.rarity || installedProfile?.rarity || def?.rarity || 5)
      )
    );
    const baseProfile = npcKey ? this.getNpcRandomStatsForKey(npcKey) : null;
    const baseStats = baseProfile?.stats || {
      stamina: 0,
      produccion: 0,
      felicidad: 0,
      inteligencia: 0,
      fortuna: 0,
      estres: 0
    };
    const backgroundMode = "plain";
    const defaultName = def?.name || "NPC Fantasma";
    return {
      instanceId,
      npcKey,
      sourceMode,
      backgroundMode,
      rarity,
      level: Math.max(
        1,
        Math.round(Number(overrides.level) || Number(instance?.level) || Number(installedProfile?.level) || 1)
      ),
      exp: Math.max(0, Math.round(Number(overrides.exp) || Number(instance?.exp) || Number(installedProfile?.exp) || 0)),
      passiveLevel: Math.max(
        0,
        Math.min(
          5,
          Math.round(
            Number(overrides.passiveLevel)
            || Number(instance?.passiveLevel)
            || Number(installedProfile?.passiveLevel)
            || 0
          )
        )
      ),
      focused: !!overrides.focused,
      focusPhase: ["roam", "locking", "focused"].includes(String(overrides.focusPhase || ""))
        ? String(overrides.focusPhase)
        : "roam",
      view: ["main", "levelup", "skilltree", "evolution"].includes(String(overrides.view || ""))
        ? String(overrides.view)
        : "main",
      evolutionSelectedFeedIds: Array.isArray(overrides.evolutionSelectedFeedIds)
        ? overrides.evolutionSelectedFeedIds.map((id) => String(id || "")).filter(Boolean).slice(0, 5)
        : [],
      handle: String(overrides.handle || (npcKey ? `@${npcKey}` : "@npc_fantasma")),
      name: String(overrides.name || defaultName),
      profileDescription: String(
        overrides.profileDescription
        || def?.profileDescription
        || "NPC con rutina dinamica de ciudad."
      ),
      skillName: String(overrides.skillName || (npcKey ? `Pasiva de ${defaultName}` : "Pasiva Espectral")),
      cardSigil: String(overrides.cardSigil || def?.cardSigil || def?.icon || "GF"),
      cardBg1: String(overrides.cardBg1 || def?.cardBg1 || "#5b21b6"),
      cardBg2: String(overrides.cardBg2 || def?.cardBg2 || "#1e293b"),
      cardAccent: String(overrides.cardAccent || def?.cardAccent || "#c084fc"),
      contextTitle: String(overrides.contextTitle || (npcKey ? "Almacen NPC" : "Laboratorio NPC Fantasma")),
      contextSubtitle: String(overrides.contextSubtitle || (npcKey
        ? "Vista base del NPC fuera de edificios. Fondo provisional."
        : "Modo prueba de UI y progresion. Dupes y cristales infinitos.")),
      cardX: Number.isFinite(Number(overrides.cardX)) ? Number(overrides.cardX) : 16,
      cardY: Number.isFinite(Number(overrides.cardY)) ? Number(overrides.cardY) : 49,
      cardDir: Number.isFinite(Number(overrides.cardDir))
        ? (Number(overrides.cardDir) >= 0 ? 1 : -1)
        : 1,
      skillTree: overrides.skillTree && typeof overrides.skillTree === "object"
        ? overrides.skillTree
        : (
          this.cloneNpcLabSkillTree(instance?.skillTree)
          || this.cloneNpcLabSkillTree(installedProfile?.skillTree)
          || this.createGhostNpcLabSkillTree(rarity)
        ),
      levelUpOwned: overrides.levelUpOwned && typeof overrides.levelUpOwned === "object"
        ? overrides.levelUpOwned
        : this.getGhostNpcLabDefaultOwnedMap({ npcKey, sourceMode, rarity }),
      levelUpSlots: Array.isArray(overrides.levelUpSlots)
        ? overrides.levelUpSlots
        : Array.from({ length: 10 }, () => null),
      statCrystalSpent: Object.fromEntries(
        ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"].map((key) => [
          key,
          Math.max(
            0,
            Math.round(
              Number(
                overrides?.statCrystalSpent?.[key]
                ?? instance?.statCrystalSpent?.[key]
                ?? installedProfile?.statCrystalSpent?.[key]
              ) || 0
            )
          )
        ])
      ),
      statCrystalDraft: Object.fromEntries(
        ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"].map((key) => [
          key,
          Math.max(0, Math.round(Number(overrides?.statCrystalDraft?.[key]) || 0))
        ])
      ),
      stats: { ...baseStats, ...(instance?.stats || {}), ...(installedProfile?.stats || {}), ...(overrides.stats || {}) }
    };
  }

  buildGhostNpcLabResetState(state = null) {
    const current = state && typeof state === "object" ? state : this.getGhostNpcLabState();
    const sourceMode = String(current?.sourceMode || "") === "ghost" ? "ghost" : String(current?.sourceMode || "inventory");
    const backgroundMode = "plain";
    const overrides = sourceMode === "ghost"
      ? {}
      : {
          instanceId: String(current?.instanceId || ""),
          npcKey: String(current?.npcKey || ""),
          sourceMode,
          backgroundMode,
          contextTitle: String(current?.contextTitle || "Almacen NPC"),
          contextSubtitle: String(current?.contextSubtitle || "Vista base del NPC en fondo limpio temporal.")
        };
    return this.createDefaultGhostNpcLabState(overrides);
  }

  getNpcInventoryEntries() {
    this.ensureNpcInstanceStore();
    this.ensureNpcInstalledProfileStore();
    const entries = [];

    this.npcInstances.forEach((instance) => {
      const key = String(instance?.key || "");
      const def = ITEM_DEFS[key];
      if (!def) return;
      const profile = this.getNpcRandomStatsForKey(key);
      const mainKey = profile?.primaryStatKey || "";
      entries.push({
        entryId: `free:${String(instance?.instanceId || key)}`,
        instanceId: String(instance?.instanceId || ""),
        key,
        def,
        count: 1,
        level: Math.max(1, Math.round(Number(instance?.level) || 1)),
        passiveLevel: Math.max(0, Math.min(5, Math.round(Number(instance?.passiveLevel) || 0))),
        rarity: Math.max(1, Math.min(5, Math.round(Number(instance?.rarity) || Number(def?.rarity) || 1))),
        installedInBuilding: false,
        locationLabel: "Libre en almacen",
        mainStatLabel: profile?.primaryStatLabel || "",
        mainStatValue: Math.max(0, Math.round(Number(instance?.stats?.[mainKey]) || Number(profile?.primaryStatValue) || 0))
      });
    });

    const installedEntries = this.scene?.getInstalledNpcEntriesForRoster?.() || [];
    installedEntries.forEach((entry, index) => {
      const key = String(entry?.key || "");
      const def = ITEM_DEFS[key];
      if (!def) return;
      const profile = this.getNpcRandomStatsForKey(key);
      const profileId = String(entry?.instanceId || `installed:${String(entry?.slotKind || "npc")}:${Math.max(0, Math.round(Number(entry?.buildingId) || 0))}:${Math.max(0, Math.round(Number(entry?.slotIndex) || 0))}`);
      const installedProfile = this.getNpcInstalledProfile(profileId, key);
      const mainKey = profile?.primaryStatKey || "";
      entries.push({
        entryId: `installed:${entry.slotKind || "npc"}:${entry.buildingId || 0}:${entry.slotIndex || 0}:${index}`,
        instanceId: profileId,
        key,
        def,
        count: 1,
        level: Math.max(1, Math.round(Number(installedProfile?.level) || 1)),
        exp: Math.max(0, Math.round(Number(installedProfile?.exp) || 0)),
        passiveLevel: Math.max(0, Math.min(5, Math.round(Number(installedProfile?.passiveLevel) || 0))),
        rarity: Math.max(1, Math.min(5, Math.round(Number(def?.rarity) || 1))),
        statCrystalSpent: { ...(installedProfile?.statCrystalSpent || {}) },
        stats: { ...(installedProfile?.stats || {}) },
        skillTree: this.cloneNpcLabSkillTree(installedProfile?.skillTree),
        installedInBuilding: true,
        buildingId: Number(entry?.buildingId || 0),
        buildingTypeKey: String(entry?.buildingTypeKey || ""),
        slotIndex: Math.max(0, Math.round(Number(entry?.slotIndex) || 0)),
        slotKind: String(entry?.slotKind || "npc"),
        locationLabel: `${String(entry?.buildingLabel || "Edificio")} · Slot ${Math.max(1, Math.round(Number(entry?.slotIndex) || 0) + 1)}`,
        mainStatLabel: profile?.primaryStatLabel || "",
        mainStatValue: Math.max(
          0,
          Math.round(
            Number(installedProfile?.stats?.[mainKey])
            || Number(profile?.primaryStatValue)
            || 0
          )
        )
      });
    });

    return entries.sort((a, b) => {
      if (a.installedInBuilding !== b.installedInBuilding) return a.installedInBuilding ? -1 : 1;
      if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
      if (b.rarity !== a.rarity) return b.rarity - a.rarity;
      const byName = String(a.def?.name || a.key).localeCompare(String(b.def?.name || b.key));
      if (byName !== 0) return byName;
      return String(a.entryId || "").localeCompare(String(b.entryId || ""));
    });
  }

  getGhostNpcLabState() {
    if (!this.ghostNpcLabState || typeof this.ghostNpcLabState !== "object") {
      this.ghostNpcLabState = this.createDefaultGhostNpcLabState();
    }
    const stats = this.ghostNpcLabState.stats || {};
    this.ghostNpcLabState.instanceId = String(this.ghostNpcLabState.instanceId || "");
    this.ghostNpcLabState.npcKey = String(this.ghostNpcLabState.npcKey || "");
    this.ghostNpcLabState.sourceMode = ["ghost", "inventory", "building"].includes(String(this.ghostNpcLabState.sourceMode || ""))
      ? String(this.ghostNpcLabState.sourceMode)
      : (this.ghostNpcLabState.npcKey ? "inventory" : "ghost");
    this.ghostNpcLabState.backgroundMode = "plain";
    this.ghostNpcLabState.rarity = Math.max(1, Math.min(5, Math.round(Number(this.ghostNpcLabState.rarity) || 5)));
    this.ghostNpcLabState.level = Math.max(1, Math.round(Number(this.ghostNpcLabState.level) || 1));
    this.ghostNpcLabState.passiveLevel = Math.max(0, Math.min(5, Math.round(Number(this.ghostNpcLabState.passiveLevel) || 0)));
    this.ghostNpcLabState.focused = !!this.ghostNpcLabState.focused;
    this.ghostNpcLabState.focusPhase = ["roam", "locking", "focused"].includes(this.ghostNpcLabState.focusPhase)
      ? this.ghostNpcLabState.focusPhase
      : (this.ghostNpcLabState.focused ? "focused" : "roam");
    this.ghostNpcLabState.view = ["main", "levelup", "skilltree", "evolution"].includes(this.ghostNpcLabState.view)
      ? this.ghostNpcLabState.view
      : "main";
    if (Array.isArray(this.ghostNpcLabState.evolutionSelectedFeedIds)) {
      this.ghostNpcLabState.evolutionSelectedFeedIds = this.ghostNpcLabState.evolutionSelectedFeedIds
        .map((id) => String(id || "").trim())
        .filter(Boolean)
        .slice(0, 5);
    } else {
      this.ghostNpcLabState.evolutionSelectedFeedIds = [];
    }
    this.ghostNpcLabState.handle = this.ghostNpcLabState.handle || "@npc_fantasma";
    this.ghostNpcLabState.name = this.ghostNpcLabState.name || "NPC Fantasma";
    this.ghostNpcLabState.profileDescription = this.ghostNpcLabState.profileDescription || "NPC con rutina dinamica de ciudad.";
    this.ghostNpcLabState.skillName = this.ghostNpcLabState.skillName || "Pasiva Espectral";
    this.ghostNpcLabState.cardSigil = this.ghostNpcLabState.cardSigil || "GF";
    this.ghostNpcLabState.cardBg1 = this.ghostNpcLabState.cardBg1 || "#5b21b6";
    this.ghostNpcLabState.cardBg2 = this.ghostNpcLabState.cardBg2 || "#1e293b";
    this.ghostNpcLabState.cardAccent = this.ghostNpcLabState.cardAccent || "#c084fc";
    this.ghostNpcLabState.contextTitle = this.ghostNpcLabState.contextTitle || "Laboratorio NPC Fantasma";
    this.ghostNpcLabState.contextSubtitle = this.ghostNpcLabState.contextSubtitle || "Modo prueba de UI y progresion. Dupes y cristales infinitos.";
    this.ghostNpcLabState.cardX = Number.isFinite(Number(this.ghostNpcLabState.cardX)) ? Number(this.ghostNpcLabState.cardX) : 16;
    this.ghostNpcLabState.cardY = Number.isFinite(Number(this.ghostNpcLabState.cardY)) ? Number(this.ghostNpcLabState.cardY) : 49;
    this.ghostNpcLabState.cardDir = Number.isFinite(Number(this.ghostNpcLabState.cardDir))
      ? (Number(this.ghostNpcLabState.cardDir) >= 0 ? 1 : -1)
      : 1;
    this.ghostNpcLabState.exp = Math.max(0, Math.round(Number(this.ghostNpcLabState.exp) || 0));
    this.ghostNpcLabState.statCrystalSpent = Object.fromEntries(
      ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"].map((statKey) => [
        statKey,
        Math.max(0, Math.round(Number(this.ghostNpcLabState?.statCrystalSpent?.[statKey]) || 0))
      ])
    );
    this.ghostNpcLabState.statCrystalDraft = Object.fromEntries(
      ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"].map((statKey) => [
        statKey,
        Math.max(0, Math.round(Number(this.ghostNpcLabState?.statCrystalDraft?.[statKey]) || 0))
      ])
    );
    const defaultOwned = this.getGhostNpcLabDefaultOwnedMap(this.ghostNpcLabState);
    const owned = this.ghostNpcLabState.levelUpOwned || {};
    this.ghostNpcLabState.levelUpOwned = Object.fromEntries(
      Object.entries(defaultOwned).map(([key, count]) => [
        key,
        Math.max(0, Math.round(
          Object.prototype.hasOwnProperty.call(owned, key)
            ? Number(owned[key])
            : count
        ))
      ])
    );
    const slots = Array.isArray(this.ghostNpcLabState.levelUpSlots) ? this.ghostNpcLabState.levelUpSlots : [];
    this.ghostNpcLabState.levelUpSlots = Array.from({ length: 10 }, (_, index) => {
      const slot = slots[index];
      if (!slot || typeof slot !== "object" || !slot.key) return null;
      return {
        entryId: String(slot.entryId || ""),
        instanceId: String(slot.instanceId || ""),
        key: String(slot.key),
        name: String(slot.name || (ITEM_DEFS[slot.key]?.name || "NPC")),
        rarity: Math.max(1, Math.min(5, Math.round(Number(slot.rarity) || 1))),
        level: Math.max(1, Math.round(Number(slot.level) || 1)),
        exp: Math.max(0, Math.round(Number(slot.exp) || 0))
      };
    });
    const rawTree = this.ghostNpcLabState.skillTree;
    this.ghostNpcLabState.skillTree = (rawTree && typeof rawTree === "object" && Array.isArray(rawTree.branches))
      ? rawTree
      : this.createGhostNpcLabSkillTree(this.ghostNpcLabState.rarity);
    const treeStatDefs = this.getGhostNpcLabTreeStatDefs();
    const treeStatKeys = Object.keys(treeStatDefs);
    const treeTemplate = this.createGhostNpcLabSkillTree(this.ghostNpcLabState.rarity);
    const coreTemplate = (treeTemplate && typeof treeTemplate.coreNode === "object") ? treeTemplate.coreNode : {
      kind: "stat",
      statKey: "stamina",
      amount: 4,
      crystalKey: "crystal_stamina_superior",
      crystalCost: 1,
      goldCost: 500,
      capGain: 0,
      level: 0,
      maxLevel: 5,
      unlocked: false
    };
    const coreRaw = (this.ghostNpcLabState.skillTree && typeof this.ghostNpcLabState.skillTree.coreNode === "object")
      ? this.ghostNpcLabState.skillTree.coreNode
      : {};
    const coreMaxLevel = Math.max(1, Math.round(Number(coreRaw?.maxLevel) || Number(coreTemplate.maxLevel) || 5));
    const coreLevelRaw = Number(coreRaw?.level);
    let coreLevel = Number.isFinite(coreLevelRaw)
      ? coreLevelRaw
      : ((!!this.ghostNpcLabState.skillTree.coreUnlocked || !!coreRaw?.unlocked) ? coreMaxLevel : 0);
    coreLevel = Math.max(0, Math.min(coreMaxLevel, Math.round(coreLevel || 0)));
    const coreUnlocked = coreLevel >= coreMaxLevel || !!this.ghostNpcLabState.skillTree.coreUnlocked || !!coreRaw?.unlocked;
    this.ghostNpcLabState.skillTree.coreNode = {
      kind: "stat",
      statKey: String(coreRaw?.statKey || coreTemplate.statKey || "stamina"),
      amount: Math.max(1, Math.round(Number(coreRaw?.amount) || Number(coreTemplate.amount) || 4)),
      crystalKey: String(coreRaw?.crystalKey || coreTemplate.crystalKey || "crystal_stamina_superior"),
      crystalCost: Math.max(1, Math.round(Number(coreRaw?.crystalCost) || Number(coreTemplate.crystalCost) || 1)),
      goldCost: Math.max(0, Math.round(Number(coreRaw?.goldCost) || Number(coreTemplate.goldCost) || 500)),
      capGain: 0,
      level: coreUnlocked ? coreMaxLevel : coreLevel,
      maxLevel: coreMaxLevel,
      unlocked: coreUnlocked
    };
    this.ghostNpcLabState.skillTree.coreUnlocked = !!coreUnlocked;
    const fallbackBranchStatKey = (branchIndex = 0) => {
      if (!treeStatKeys.length) return "stamina";
      return treeStatKeys[Math.max(0, Math.round(Number(branchIndex) || 0)) % treeStatKeys.length];
    };
    this.ghostNpcLabState.skillTree.branches = (this.ghostNpcLabState.skillTree.branches || [])
      .slice(0, 5)
      .map((branch, branchIndex) => {
        const nodes = Array.isArray(branch?.nodes) ? branch.nodes : [];
        const templateNodes = Array.isArray(treeTemplate?.branches?.[branchIndex]?.nodes)
          ? treeTemplate.branches[branchIndex].nodes
          : [];
        const maxBranches = 5;
        const maxNodes = 8;
        const nodeXFallback = [50, 32, 68, 18, 40, 60, 82, 50];
        const sourceNodes = Array.from({ length: maxNodes }, (_, nodeIndex) => (
          nodes[nodeIndex] && typeof nodes[nodeIndex] === "object"
            ? nodes[nodeIndex]
            : templateNodes[nodeIndex]
        )).filter((node) => !!node && typeof node === "object");
        const normalizedNodes = sourceNodes.slice(0, maxNodes).map((node, nodeIndex) => {
          const templateNode = templateNodes[nodeIndex] || null;
          // Regla nueva: requisitos estables por plantilla (evita bloqueos raros de arboles viejos).
          let requiresAllRaw = Array.isArray(templateNode?.requiresAll) ? templateNode.requiresAll : [];
          let requiresAnyRaw = Array.isArray(templateNode?.requiresAny) ? templateNode.requiresAny : [];
          const requiresAll = this.normalizeGhostNpcLabTreeRefs(requiresAllRaw, maxBranches, maxNodes);
          const allKeys = new Set(requiresAll.map((ref) => `${ref.branch}:${ref.node}`));
          const requiresAny = this
            .normalizeGhostNpcLabTreeRefs(requiresAnyRaw, maxBranches, maxNodes)
            .filter((ref) => !allKeys.has(`${ref.branch}:${ref.node}`));
          const kind = node?.kind === "cap" ? "cap" : "stat";
          const maxLevel = Math.max(1, Math.round(Number(node?.maxLevel) || Number(templateNode?.maxLevel) || (kind === "cap" ? 1 : 5)));
          const levelRaw = Number(node?.level);
          let level = Number.isFinite(levelRaw)
            ? levelRaw
            : (!!node?.unlocked ? maxLevel : 0);
          level = Math.max(0, Math.min(maxLevel, Math.round(level || 0)));
          const unlocked = !!node?.unlocked || level >= maxLevel;
          return {
            kind,
            statKey: String(node?.statKey || ""),
            amount: Math.max(1, Math.round(Number(node?.amount) || 1)),
            x: Number.isFinite(Number(node?.x)) ? Number(node.x) : nodeXFallback[nodeIndex],
            crystalKey: String(node?.crystalKey || ""),
            crystalCost: Math.max(1, Math.round(Number(node?.crystalCost) || 1)),
            goldCost: Math.max(0, Math.round(Number(node?.goldCost) || 0)),
            capGain: Math.max(0, Math.round(Number(node?.capGain) || 0)),
            level,
            maxLevel,
            unlocked,
            requiresAll,
            requiresAny
          };
        });

        // Regla: el nodo inicial de cada rama SIEMPRE debe ser stat.
        if (normalizedNodes.length) {
          if (normalizedNodes[0].kind !== "stat") {
            const firstStatIndex = normalizedNodes.findIndex((n) => n.kind === "stat");
            if (firstStatIndex > 0) {
              const swap = normalizedNodes[0];
              normalizedNodes[0] = normalizedNodes[firstStatIndex];
              normalizedNodes[firstStatIndex] = swap;
            } else {
              const statKey = fallbackBranchStatKey(branchIndex);
              const def = treeStatDefs[statKey] || { crystalKey: "crystal_stamina_superior" };
              normalizedNodes[0] = {
                ...normalizedNodes[0],
                kind: "stat",
                statKey,
                amount: Math.max(1, Math.round(Number(normalizedNodes[0]?.amount) || 4)),
                crystalKey: def.crystalKey,
                capGain: 0,
                level: Math.max(0, Math.round(Number(normalizedNodes[0]?.level) || 0)),
                maxLevel: Math.max(1, Math.round(Number(normalizedNodes[0]?.maxLevel) || 5))
              };
            }
          }
          // Reindex visual X after normalization/swap.
          normalizedNodes.forEach((node, nodeIndex) => {
            node.x = nodeXFallback[nodeIndex];
          });
          // Asegura que el nodo inicial SIEMPRE se pueda abrir de inmediato.
          if (normalizedNodes[0]) {
            normalizedNodes[0].requiresAll = [];
            normalizedNodes[0].requiresAny = [];
          }
        }
        return {
          y: Number.isFinite(Number(branch?.y)) ? Number(branch.y) : [14, 31, 48, 65, 82][branchIndex],
          nodes: normalizedNodes
        };
      });
    const hasUnlockedTreeNode = this.ghostNpcLabState.skillTree.branches.some((branch) =>
      Array.isArray(branch?.nodes) && branch.nodes.some((node) => !!node?.unlocked)
    );
    if (hasUnlockedTreeNode && !this.ghostNpcLabState.skillTree.coreUnlocked) {
      const coreNode = this.ghostNpcLabState.skillTree.coreNode || {};
      const coreMax = Math.max(1, Math.round(Number(coreNode.maxLevel) || 5));
      this.ghostNpcLabState.skillTree.coreNode = {
        ...coreNode,
        level: coreMax,
        maxLevel: coreMax,
        unlocked: true
      };
      this.ghostNpcLabState.skillTree.coreUnlocked = true;
    }
    this.ghostNpcLabState.stats = {
      stamina: Math.max(0, Math.round(Number(stats.stamina) || 0)),
      produccion: Math.max(0, Math.round(Number(stats.produccion) || 0)),
      felicidad: Math.max(0, Math.round(Number(stats.felicidad) || 0)),
      inteligencia: Math.max(0, Math.round(Number(stats.inteligencia) || 0)),
      fortuna: Math.max(0, Math.round(Number(stats.fortuna) || 0)),
      estres: Math.max(0, Math.round(Number(stats.estres) || 0))
    };
    return this.ghostNpcLabState;
  }

  getGhostNpcLabMaxLevel(rarity = 5) {
    const r = Math.max(1, Math.min(5, Math.round(Number(rarity) || 1)));
    if (r >= 5) return 150;
    if (r === 4) return 100;
    return 50;
  }

  getGhostNpcLabLevelExpNeed(level = 1, rarity = 5) {
    const lv = Math.max(1, Math.round(Number(level) || 1));
    const rr = Math.max(1, Math.min(5, Math.round(Number(rarity) || 1)));
    const base = rr >= 5 ? 180 : rr === 4 ? 140 : 96;
    const step = rr >= 5 ? 22 : rr === 4 ? 16 : 11;
    return Math.max(50, Math.round(base + (lv - 1) * step));
  }

  simulateGhostNpcLabExpGain(level = 1, exp = 0, gained = 0, rarity = 5, levelCap = null) {
    let nextLevel = Math.max(1, Math.round(Number(level) || 1));
    let nextExp = Math.max(0, Math.round(Number(exp) || 0));
    let pool = Math.max(0, Math.round(Number(gained) || 0));
    const hardMax = this.getGhostNpcLabMaxLevel(rarity);
    const maxLevel = Math.max(1, Math.min(hardMax, Math.round(Number(levelCap) || hardMax)));
    while (pool > 0 && nextLevel < maxLevel) {
      const need = this.getGhostNpcLabLevelExpNeed(nextLevel, rarity);
      const missing = Math.max(0, need - nextExp);
      if (pool < missing) {
        nextExp += pool;
        pool = 0;
        break;
      }
      pool -= missing;
      nextLevel += 1;
      nextExp = 0;
    }
    if (nextLevel >= maxLevel) {
      nextLevel = maxLevel;
      nextExp = 0;
    }
    return {
      level: nextLevel,
      exp: nextExp,
      maxLevel,
      hardMax
    };
  }

  getGhostNpcLabTreeStatDefs() {
    return {
      stamina: { label: "Stamina", color: "#4ade80", crystalKey: "crystal_stamina_superior" },
      produccion: { label: "Produccion", color: "#fb923c", crystalKey: "crystal_produccion_superior" },
      felicidad: { label: "Felicidad", color: "#f472b6", crystalKey: "crystal_felicidad_superior" },
      inteligencia: { label: "Inteligencia", color: "#60a5fa", crystalKey: "crystal_inteligencia_superior" },
      fortuna: { label: "Fortuna", color: "#fde047", crystalKey: "crystal_fortuna_superior" },
      estres: { label: "Estres", color: "#c084fc", crystalKey: "crystal_estres_superior" }
    };
  }

  getGhostNpcLabCrystalCap() {
    return 150;
  }

  getGhostNpcLabSpentCrystalTotal(state = null) {
    const current = state && typeof state === "object" ? state : this.getGhostNpcLabState();
    const spent = current?.statCrystalSpent || {};
    return ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"]
      .reduce((sum, statKey) => sum + Math.max(0, Math.round(Number(spent[statKey]) || 0)), 0);
  }

  getGhostNpcLabDraftCrystalTotal(state = null) {
    const current = state && typeof state === "object" ? state : this.getGhostNpcLabState();
    const draft = current?.statCrystalDraft || {};
    return ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"]
      .reduce((sum, statKey) => sum + Math.max(0, Math.round(Number(draft[statKey]) || 0)), 0);
  }

  getGhostNpcLabAvailableCrystalsForStat(state = null, statKey = "") {
    const current = state && typeof state === "object" ? state : this.getGhostNpcLabState();
    const statDefs = this.getGhostNpcLabTreeStatDefs();
    const def = statDefs[String(statKey || "").trim()];
    if (!def) return 0;
    if (String(current?.sourceMode || "") === "ghost") return Number.POSITIVE_INFINITY;
    return Math.max(0, Math.round(Number(this.inventory?.[def.crystalKey]) || 0));
  }

  canGhostNpcLabAdjustStatDraft(state = null, statKey = "", delta = 0) {
    const current = state && typeof state === "object" ? state : this.getGhostNpcLabState();
    const key = String(statKey || "").trim();
    const amount = Math.round(Number(delta) || 0);
    const draft = current?.statCrystalDraft || {};
    const currentDraft = Math.max(0, Math.round(Number(draft[key]) || 0));
    if (amount < 0) {
      return currentDraft >= Math.abs(amount);
    }
    if (amount === 0) return true;
    const projectedTotal = this.getGhostNpcLabSpentCrystalTotal(current) + this.getGhostNpcLabDraftCrystalTotal(current) + amount;
    if (projectedTotal > this.getGhostNpcLabCrystalCap()) return false;
    const available = this.getGhostNpcLabAvailableCrystalsForStat(current, key);
    if (Number.isFinite(available) && currentDraft + amount > available) return false;
    return true;
  }

  applyGhostNpcLabStatDraft(state = null) {
    const current = state && typeof state === "object" ? state : this.getGhostNpcLabState();
    const draft = current?.statCrystalDraft || {};
    const statDefs = this.getGhostNpcLabTreeStatDefs();
    const pending = ["stamina", "produccion", "felicidad", "inteligencia", "fortuna", "estres"]
      .map((statKey) => [statKey, Math.max(0, Math.round(Number(draft[statKey]) || 0))])
      .filter(([, qty]) => qty > 0);
    if (!pending.length) return { ok: false, reason: "empty" };
    const projectedTotal = this.getGhostNpcLabSpentCrystalTotal(current) + pending.reduce((sum, [, qty]) => sum + qty, 0);
    if (projectedTotal > this.getGhostNpcLabCrystalCap()) return { ok: false, reason: "cap" };
    if (String(current?.sourceMode || "") !== "ghost") {
      for (const [statKey, qty] of pending) {
        const crystalKey = statDefs[statKey]?.crystalKey;
        const available = Math.max(0, Math.round(Number(this.inventory?.[crystalKey]) || 0));
        if (available < qty) return { ok: false, reason: "funds", statKey };
      }
      for (const [statKey, qty] of pending) {
        const crystalKey = statDefs[statKey]?.crystalKey;
        this.consumeItem(crystalKey, qty);
      }
    }
    pending.forEach(([statKey, qty]) => {
      current.stats[statKey] = Math.max(0, Math.round(Number(current?.stats?.[statKey]) || 0) + qty);
      current.statCrystalSpent[statKey] = Math.max(0, Math.round(Number(current?.statCrystalSpent?.[statKey]) || 0) + qty);
      current.statCrystalDraft[statKey] = 0;
    });
    this.persistGhostNpcLabState(current);
    return { ok: true, spent: pending.reduce((sum, [, qty]) => sum + qty, 0) };
  }

  shuffleGhostNpcLabArray(list = []) {
    const arr = Array.isArray(list) ? list.slice() : [];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  getGhostNpcLabBaseReachableLevelCap(rarity = 5) {
    const rr = Math.max(1, Math.min(5, Math.round(Number(rarity) || 1)));
    if (rr >= 5) return 100;
    if (rr === 4) return 50;
    return 25;
  }

  getGhostNpcLabCapNodeGain(rarity = 5) {
    const rr = Math.max(1, Math.min(5, Math.round(Number(rarity) || 1)));
    if (rr >= 4) return 10;
    return 5;
  }

  getGhostNpcLabBranchLinkRefs(branchIndex = 0, nodeIndex = 0, totalBranches = 5) {
    const b = Math.max(0, Math.min(Math.max(0, totalBranches - 1), Math.round(Number(branchIndex) || 0)));
    const n = Math.max(0, Math.round(Number(nodeIndex) || 0));
    if (n <= 0) return [];
    const prevNode = n - 1;
    const refs = [];
    if (b > 0) refs.push({ branch: b - 1, node: prevNode });
    if (b < (Math.max(0, totalBranches - 1))) refs.push({ branch: b + 1, node: prevNode });
    return refs;
  }

  normalizeGhostNpcLabTreeRefs(refs = [], totalBranches = 5, maxNodes = 4) {
    const source = Array.isArray(refs) ? refs : [];
    const seen = new Set();
    return source
      .map((ref) => ({
        branch: Math.max(0, Math.min(Math.max(0, totalBranches - 1), Math.round(Number(ref?.branch) || 0))),
        node: Math.max(0, Math.min(Math.max(0, maxNodes - 1), Math.round(Number(ref?.node) || 0)))
      }))
      .filter((ref) => {
        if (!Number.isInteger(ref.branch) || !Number.isInteger(ref.node)) return false;
        const key = `${ref.branch}:${ref.node}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
  }

  getGhostNpcLabReachableLevelCap(state) {
    const fullMax = this.getGhostNpcLabMaxLevel(state?.rarity || 5);
    const base = this.getGhostNpcLabBaseReachableLevelCap(state?.rarity || 5);
    const gain = this.getGhostNpcLabCapNodeGain(state?.rarity || 5);
    const extra = (state?.skillTree?.branches || []).reduce((sum, branch) => {
      return sum + (branch.nodes || []).reduce((branchSum, node) => {
        return branchSum + ((node?.kind === "cap" && node?.unlocked) ? gain : 0);
      }, 0);
    }, 0);
    return Math.max(1, Math.min(fullMax, base + extra));
  }

  createGhostNpcLabSkillTree(rarity = 5) {
    const statDefs = this.getGhostNpcLabTreeStatDefs();
    const statKeys = Object.keys(statDefs);
    const branchRows = [14, 31, 48, 65, 82];
    const nodeXs = [50, 32, 68, 18, 40, 60, 82, 50];
    const capGain = this.getGhostNpcLabCapNodeGain(rarity);
    const safeStat = (index = 0) => statKeys[(Math.max(0, Math.round(Number(index) || 0))) % Math.max(1, statKeys.length)] || "stamina";
    const coreStat = safeStat(rarity);
    return {
      coreUnlocked: false,
      coreNode: {
        kind: "stat",
        statKey: coreStat,
        amount: 4,
        x: 50,
        crystalKey: statDefs[coreStat].crystalKey,
        crystalCost: 1,
        goldCost: 500,
        capGain: 0,
        level: 0,
        maxLevel: 5,
        unlocked: false,
        requiresAll: [],
        requiresAny: []
      },
      branches: branchRows.map((y, branchIndex) => {
        const a = safeStat(branchIndex + rarity);
        const b = safeStat(branchIndex + rarity + 1);
        const c = safeStat(branchIndex + rarity + 2);
        return {
          y,
          nodes: [
            {
              kind: "stat",
              statKey: a,
              amount: 4,
              x: nodeXs[0],
              crystalKey: statDefs[a].crystalKey,
              crystalCost: 1 + Math.floor(branchIndex / 2),
              goldCost: 420 + (branchIndex * 130),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [],
              requiresAny: []
            },
            {
              kind: "stat",
              statKey: b,
              amount: 4,
              x: nodeXs[1],
              crystalKey: statDefs[b].crystalKey,
              crystalCost: 1 + Math.floor(branchIndex / 2),
              goldCost: 520 + (branchIndex * 130),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [{ branch: branchIndex, node: 0 }],
              requiresAny: []
            },
            {
              kind: "stat",
              statKey: c,
              amount: 4,
              x: nodeXs[2],
              crystalKey: statDefs[c].crystalKey,
              crystalCost: 1 + Math.floor(branchIndex / 2),
              goldCost: 520 + (branchIndex * 130),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [{ branch: branchIndex, node: 0 }],
              requiresAny: []
            },
            {
              kind: "stat",
              statKey: a,
              amount: 6,
              x: nodeXs[3],
              crystalKey: statDefs[a].crystalKey,
              crystalCost: 2 + Math.floor(branchIndex / 2),
              goldCost: 680 + (branchIndex * 150),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [{ branch: branchIndex, node: 1 }],
              requiresAny: []
            },
            {
              kind: "stat",
              statKey: b,
              amount: 6,
              x: nodeXs[4],
              crystalKey: statDefs[b].crystalKey,
              crystalCost: 2 + Math.floor(branchIndex / 2),
              goldCost: 740 + (branchIndex * 150),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [{ branch: branchIndex, node: 1 }],
              requiresAny: []
            },
            {
              kind: "stat",
              statKey: c,
              amount: 6,
              x: nodeXs[5],
              crystalKey: statDefs[c].crystalKey,
              crystalCost: 2 + Math.floor(branchIndex / 2),
              goldCost: 740 + (branchIndex * 150),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [{ branch: branchIndex, node: 2 }],
              requiresAny: []
            },
            {
              kind: "stat",
              statKey: a,
              amount: 8,
              x: nodeXs[6],
              crystalKey: statDefs[a].crystalKey,
              crystalCost: 3 + Math.floor(branchIndex / 2),
              goldCost: 860 + (branchIndex * 160),
              capGain: 0,
              level: 0,
              maxLevel: 5,
              unlocked: false,
              requiresAll: [{ branch: branchIndex, node: 2 }],
              requiresAny: []
            },
            {
              kind: "cap",
              statKey: "",
              amount: 0,
              x: nodeXs[7],
              crystalKey: "all",
              crystalCost: 2 + Math.floor(branchIndex / 2),
              goldCost: 1800 + (branchIndex * 350),
              capGain,
              level: 0,
              maxLevel: 1,
              unlocked: false,
              requiresAll: [
                { branch: branchIndex, node: 3 },
                { branch: branchIndex, node: 4 },
                { branch: branchIndex, node: 5 },
                { branch: branchIndex, node: 6 }
              ],
              requiresAny: []
            }
          ]
        };
      })
    };
  }

  getGhostNpcLabDefaultOwnedMap(state = null) {
    const activeKey = String(state?.npcKey || "");
    const useInventory = !!activeKey && String(state?.sourceMode || "") !== "ghost";
    if (useInventory) {
      this.ensureNpcInstanceStore();
      const owned = Object.create(null);
      const activeInstanceId = String(state?.instanceId || "");
      this.npcInstances.forEach((entry) => {
        const key = String(entry?.key || "");
        if (!key.startsWith("npc_")) return;
        if (activeInstanceId && String(entry?.instanceId || "") === activeInstanceId) return;
        owned[key] = Math.max(0, Math.round(Number(owned[key]) || 0)) + 1;
      });
      return owned;
    }
    return {
      ghost_self_dupe: 2,
      npc_emolientero_1: 6,
      npc_lustrabotas_1: 4,
      npc_canillita_1: 3,
      npc_mercado_1: 2,
      npc_panadero_2: 3,
      npc_sereno_2: 2,
      npc_enfermera_2: 1,
      npc_electricista_2: 1,
      npc_profesora_3: 2,
      npc_policia_3: 1,
      npc_chefcriollo_3: 1,
      npc_artesana_3: 1,
      npc_kotori_4: 1,
      npc_minusculas_4: 1,
      npc_ivybunny_5: 1
    };
  }

  getGhostNpcLabFeedEntries(state) {
    if (String(state?.sourceMode || "") !== "ghost") {
      this.ensureNpcInstanceStore();
      const activeInstanceId = String(state?.instanceId || "");
      const slottedIds = new Set((state?.levelUpSlots || []).map((slot) => String(slot?.instanceId || "")).filter(Boolean));
      return this.npcInstances
        .filter((entry) => {
          const instanceId = String(entry?.instanceId || "");
          if (!instanceId) return false;
          if (activeInstanceId && instanceId === activeInstanceId) return false;
          if (slottedIds.has(instanceId)) return false;
          return true;
        })
        .map((entry) => {
          const key = String(entry?.key || "");
          const def = ITEM_DEFS[key];
          const rarity = Math.max(1, Math.min(5, Math.round(Number(entry?.rarity) || Number(def?.rarity) || 1)));
          const isSameUnit = !!state?.npcKey && key === state.npcKey;
          const baseExp = { 1: 48, 2: 96, 3: 180, 4: 320, 5: 520 }[rarity] || 36;
          const exp = Math.round(baseExp * (isSameUnit ? 1.75 : 1));
          return {
            entryId: String(entry.instanceId),
            instanceId: String(entry.instanceId),
            key,
            name: def?.name || key,
            rarity,
            level: Math.max(1, Math.round(Number(entry?.level) || 1)),
            count: 1,
            isSameUnit,
            exp
          };
        })
        .sort((a, b) => {
          const aBand = a.rarity >= 4 ? 1 : 0;
          const bBand = b.rarity >= 4 ? 1 : 0;
          if (aBand !== bBand) return aBand - bBand;
          if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
          if (a.rarity !== b.rarity) return a.rarity - b.rarity;
          return a.name.localeCompare(b.name);
        });
    }
    const owned = state?.levelUpOwned || {};
    const activeNpcKey = String(state?.npcKey || "");
    return Object.entries(owned)
      .flatMap(([key, count]) => {
        const isSameUnit = key === "ghost_self_dupe" || (!!activeNpcKey && key === activeNpcKey);
        const def = isSameUnit ? null : ITEM_DEFS[key];
        if (!isSameUnit && !def) return [];
        const rarity = isSameUnit
          ? Math.max(1, Math.min(5, Math.round(Number(this.getNpcRarityForKey(activeNpcKey || key)) || Number(state?.rarity) || 3)))
          : Math.max(1, Math.min(5, Math.round(Number(def.rarity) || 1)));
        const baseExp = { 1: 48, 2: 96, 3: 180, 4: 320, 5: 520 }[rarity] || 36;
        const exp = Math.round(baseExp * (isSameUnit ? 1.75 : 1));
        const npcProfile = this.getNpcRandomStatsForKey(activeNpcKey && key === activeNpcKey ? activeNpcKey : key);
        const copies = Math.max(0, Math.round(Number(count) || 0));
        if (copies <= 0) return [];
        return Array.from({ length: copies }, (_, index) => ({
          entryId: `${key}:${index}`,
          key,
          name: isSameUnit ? (state?.name || "NPC Fantasma") : (def.name || key),
          rarity,
          count: 1,
          isSameUnit,
          exp,
          mainStatKey: npcProfile?.primaryStatKey || "",
          mainStatLabel: npcProfile?.primaryStatLabel || "",
          mainStatValue: npcProfile?.primaryStatValue || 0
        }));
      })
      .filter((entry) => entry && entry.count > 0)
      .sort((a, b) => {
        const aBand = a.rarity >= 4 ? 1 : 0;
        const bBand = b.rarity >= 4 ? 1 : 0;
        if (aBand !== bBand) return aBand - bBand;
        if (a.rarity !== b.rarity) return a.rarity - b.rarity;
        return a.name.localeCompare(b.name);
      });
  }

  closeGhostNpcLabModal() {
    const modal = document.getElementById("npc-ghost-lab-modal");
    if (modal?._ghostMoveTimer) {
      clearInterval(modal._ghostMoveTimer);
      modal._ghostMoveTimer = null;
    }
    if (modal?._ghostFocusTimer) {
      clearTimeout(modal._ghostFocusTimer);
      modal._ghostFocusTimer = null;
    }
    if (modal?._ghostResumeTimer) {
      clearTimeout(modal._ghostResumeTimer);
      modal._ghostResumeTimer = null;
    }
    if (modal) modal.remove();
  }

  moveGhostNpcLabCard(modal) {
    if (!modal?.isConnected) return;
    const state = this.getGhostNpcLabState();
    if (state.focusPhase !== "roam") return;
    const minX = 8;
    const maxX = 92;
    state.cardDir = state.cardDir >= 0 ? 1 : -1;
    state.cardX = state.cardDir > 0 ? maxX : minX;
    state.cardY = 49;
    state.cardDir *= -1;
    this.setGhostNpcLabMoverTarget(modal, "roam");
  }

  setGhostNpcLabMoverTarget(modal, mode = "roam", instant = false) {
    if (!modal?.isConnected) return;
    const state = this.getGhostNpcLabState();
    const stage = modal.querySelector(".ghost-lab-stage");
    const mover = modal.querySelector("#ghostNpcMover");
    if (!stage || !mover) return;
    const stageRect = stage.getBoundingClientRect();
    const moverRect = mover.getBoundingClientRect();
    const stageW = Math.max(1, stageRect.width || stage.clientWidth || 1);
    const stageH = Math.max(1, stageRect.height || stage.clientHeight || 1);
    const moverW = Math.max(176, moverRect.width || mover.offsetWidth || 176);
    const moverH = Math.max(176, moverRect.height || mover.offsetHeight || 176);
    const padX = Math.max(18, moverW * 0.52);
    const padY = Math.max(18, moverH * 0.52);
    const minX = padX;
    const maxX = Math.max(minX, stageW - padX);
    const minY = padY;
    const maxY = Math.max(minY, stageH - padY);
    let targetX = minX + ((Math.max(8, Math.min(92, state.cardX)) - 8) / 84) * (maxX - minX);
    let targetY = minY + 0.46 * (maxY - minY);
    if (mode === "focused") {
      targetX = minX + 0.2 * (maxX - minX);
      targetY = minY + 0.42 * (maxY - minY);
    }
    if (instant) {
      const prevTransition = mover.style.transition;
      mover.style.transition = "none";
      mover.style.left = `${Math.round(targetX)}px`;
      mover.style.top = `${Math.round(targetY)}px`;
      mover.getBoundingClientRect();
      mover.style.transition = prevTransition;
      return;
    }
    mover.style.left = `${Math.round(targetX)}px`;
    mover.style.top = `${Math.round(targetY)}px`;
  }

  syncGhostNpcLabPhase(modal) {
    if (!modal?.isConnected) return;
    const state = this.getGhostNpcLabState();
    const win = modal.querySelector(".ghost-npc-lab-window");
    const tip = modal.querySelector(".ghost-lab-focus-tip");
    const backBtn = modal.querySelector("#ghostNpcLabBack");
    if (win) {
      win.classList.toggle("is-locking", state.focusPhase === "locking");
      win.classList.toggle("is-focused", state.focusPhase === "focused");
      win.classList.toggle("is-levelup", state.view === "levelup");
      win.classList.toggle("is-skilltree", state.view === "skilltree");
    }
    if (tip) {
      tip.textContent = state.focusPhase === "focused"
        ? "Vista enfocada"
        : "Haz click para abrir la UI del NPC";
    }
    if (backBtn) {
      backBtn.textContent = state.focused ? "Volver" : "Centrar";
    }
    const targetMode = state.focusPhase === "focused" ? "focused" : "roam";
    requestAnimationFrame(() => this.setGhostNpcLabMoverTarget(modal, targetMode));
  }

  renderGhostNpcLabModal(modal) {
    if (!modal) return;
    const state = this.getGhostNpcLabState();
    const hardMaxLevel = this.getGhostNpcLabMaxLevel(state.rarity);
    const reachableCap = this.getGhostNpcLabReachableLevelCap(state);
    state.level = Math.max(1, Math.min(reachableCap, state.level));
    const currentNeed = this.getGhostNpcLabLevelExpNeed(state.level, state.rarity);
    const isLevelCapped = state.level >= reachableCap && reachableCap < hardMaxLevel;
    state.exp = isLevelCapped ? 0 : Math.max(0, Math.min(currentNeed, state.exp));

    const stars = "★".repeat(Math.max(1, state.rarity));
    const treeStatDefs = this.getGhostNpcLabTreeStatDefs();
    const statDefs = [
      { key: "stamina", label: "Stamina", color: "#4ade80" },
      { key: "produccion", label: "Produccion", color: "#fb923c" },
      { key: "felicidad", label: "Felicidad", color: "#f472b6" },
      { key: "inteligencia", label: "Inteligencia", color: "#60a5fa" },
      { key: "fortuna", label: "Fortuna", color: "#fde047" },
      { key: "estres", label: "Estres", color: "#c084fc" }
    ];
    const focusClass = state.focusPhase === "focused" ? " is-focused" : state.focusPhase === "locking" ? " is-locking" : "";
    const levelUpClass = state.view === "levelup" ? " is-levelup" : "";
    const skillTreeClass = state.view === "skilltree" ? " is-skilltree" : "";
    const feedEntries = this.getGhostNpcLabFeedEntries(state);
    const selectedFeedExp = state.levelUpSlots.reduce((sum, slot) => sum + (slot?.exp || 0), 0);
    const hasPreview = selectedFeedExp > 0;
    const preview = hasPreview
      ? this.simulateGhostNpcLabExpGain(state.level, state.exp, selectedFeedExp, state.rarity, reachableCap)
      : { level: state.level, exp: 0 };
    const currentPct = isLevelCapped ? 100 : Math.max(0, Math.min(100, (state.exp / Math.max(1, currentNeed)) * 100));
    const previewNeed = hasPreview ? this.getGhostNpcLabLevelExpNeed(preview.level, state.rarity) : currentNeed;
    const previewPct = hasPreview
      ? (preview.level >= reachableCap ? 100 : Math.max(0, Math.min(100, (preview.exp / Math.max(1, previewNeed)) * 100)))
      : 0;
    const backdropStyle = state.backgroundMode === "plain"
      ? `background:
          radial-gradient(circle at 18% 18%, rgba(96,165,250,.22) 0%, rgba(96,165,250,0) 26%),
          radial-gradient(circle at 82% 22%, rgba(192,132,252,.18) 0%, rgba(192,132,252,0) 24%),
          radial-gradient(circle at 52% 78%, rgba(45,212,191,.12) 0%, rgba(45,212,191,0) 20%),
          linear-gradient(160deg, #0f172a 0%, #172554 35%, #1e293b 70%, #111827 100%);`
      : `background: url("img/fondocasanpc.png") center center / cover no-repeat;`;

    modal.innerHTML = `
      <div class="ghost-npc-lab-window${focusClass}${levelUpClass}${skillTreeClass}">
        <style>
          #npc-ghost-lab-modal {
            position: fixed;
            inset: 0;
            z-index: 30000;
            display: grid;
            place-items: center;
            background: rgba(2, 6, 23, 0.76);
            backdrop-filter: blur(3px);
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window {
            position: relative;
            width: min(1180px, 96vw);
            height: min(760px, 92vh);
            overflow: hidden;
            border-radius: 26px;
            background: linear-gradient(180deg, rgba(2,6,23,.96) 0%, rgba(2,6,23,.9) 100%);
            box-shadow: 0 24px 70px rgba(0,0,0,.55);
            font-family: Arial, sans-serif;
            color: #f8fafc;
          }
          #npc-ghost-lab-modal .ghost-lab-scene {
            position: absolute;
            inset: 0;
            overflow: hidden;
          }
          #npc-ghost-lab-modal .ghost-lab-backdrop,
          #npc-ghost-lab-modal .ghost-lab-scene::before {
            position: absolute;
            inset: 0;
            pointer-events: none;
          }
          #npc-ghost-lab-modal .ghost-lab-backdrop {
            ${backdropStyle}
            transform-origin: center center;
            transition: transform 1.65s cubic-bezier(.16, 1, .3, 1), filter 1.65s ease;
            filter: saturate(1);
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-locking .ghost-lab-backdrop {
            transform: scale(1.01);
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-focused .ghost-lab-backdrop {
            transform: scale(1.11) translateX(-7%) translateY(-2%);
            filter: saturate(1.06);
          }
          #npc-ghost-lab-modal .ghost-lab-scene::before {
            content: none;
          }
          #npc-ghost-lab-modal .ghost-lab-top {
            position: absolute;
            inset: 18px 20px auto 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 5;
          }
          #npc-ghost-lab-modal .ghost-lab-title {
            display: grid;
            gap: 2px;
          }
          #npc-ghost-lab-modal .ghost-lab-title b {
            font-size: 24px;
          }
          #npc-ghost-lab-modal .ghost-lab-title span {
            font-size: 12px;
            color: #cbd5e1;
          }
          #npc-ghost-lab-modal .ghost-lab-close,
          #npc-ghost-lab-modal .ghost-lab-mini-btn,
          #npc-ghost-lab-modal .ghost-lab-stat-btn,
          #npc-ghost-lab-modal .ghost-lab-main-btn {
            border: none;
            cursor: pointer;
            font-weight: 700;
          }
          #npc-ghost-lab-modal .ghost-lab-close {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: rgba(15,23,42,.82);
            color: #fff;
            border: 1px solid rgba(255,255,255,.12);
          }
          #npc-ghost-lab-modal .ghost-lab-stage {
            position: absolute;
            inset: 88px 26px 36px 26px;
            overflow: hidden;
            z-index: 2;
          }
          #npc-ghost-lab-modal .ghost-lab-stage::after {
            content: none;
          }
          #npc-ghost-lab-modal .ghost-lab-mover {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            transition: left 4.4s linear, top 1.1s ease, transform 1.55s cubic-bezier(.16, 1, .3, 1), filter 1.55s cubic-bezier(.16, 1, .3, 1);
            z-index: 2;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-locking .ghost-lab-mover {
            transition: left .45s ease, top .45s ease, transform .45s ease, filter .45s ease;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-focused .ghost-lab-mover {
            transform: translate(-50%, -50%) scale(1.24);
            filter: none;
          }
          #npc-ghost-lab-modal .ghost-lab-card {
            width: 176px;
            aspect-ratio: 1 / 1;
            border-radius: 28px;
            border: 2px solid var(--ghost-card-accent, rgba(192,132,252,.82));
            background:
              linear-gradient(180deg, var(--ghost-card-bg1, rgba(91,33,182,.86)) 0%, var(--ghost-card-bg2, rgba(30,41,59,.94)) 100%);
            box-shadow: inset 0 1px 0 rgba(255,255,255,.12), 0 0 24px color-mix(in srgb, var(--ghost-card-accent, #c084fc) 32%, transparent);
            display: grid;
            place-items: center;
            color: #fff;
            position: relative;
            overflow: hidden;
          }
          #npc-ghost-lab-modal .ghost-lab-card::before {
            content: "";
            position: absolute;
            inset: 10px;
            border-radius: 22px;
            border: 1px solid rgba(255,255,255,.18);
          }
          #npc-ghost-lab-modal .ghost-lab-card-main {
            position: relative;
            z-index: 2;
            display: grid;
            justify-items: center;
            gap: 8px;
          }
          #npc-ghost-lab-modal .ghost-lab-card-sigil {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            display: grid;
            place-items: center;
            font-size: 28px;
            font-weight: 900;
            background: rgba(15,23,42,.45);
            border: 1px solid rgba(255,255,255,.18);
          }
          #npc-ghost-lab-modal .ghost-lab-card-name {
            font-size: 20px;
            font-weight: 900;
            text-align: center;
          }
          #npc-ghost-lab-modal .ghost-lab-card-sub {
            font-size: 12px;
            color: #ddd6fe;
          }
          #npc-ghost-lab-modal .ghost-lab-focus-tip {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -42px;
            text-align: center;
            font-size: 12px;
            color: #fef3c7;
            transition: opacity .2s ease;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-locking .ghost-lab-focus-tip,
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-focused .ghost-lab-focus-tip {
            opacity: 0;
          }
          #npc-ghost-lab-modal .ghost-lab-panel {
            position: absolute;
            top: 72px;
            right: 18px;
            bottom: 18px;
            width: min(390px, 34vw);
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(2,6,23,.9) 0%, rgba(15,23,42,.86) 100%);
            border: 1px solid rgba(255,255,255,.10);
            box-shadow: 0 16px 38px rgba(0,0,0,.34);
            padding: 18px;
            display: grid;
            grid-template-rows: auto auto auto auto 1fr auto;
            gap: 12px;
            transform: translateX(108%);
            opacity: 0;
            transition: transform .9s cubic-bezier(.16, 1, .3, 1), opacity .9s ease;
            z-index: 3;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-focused .ghost-lab-panel {
            transform: translateX(0);
            opacity: 1;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-levelup .ghost-lab-panel {
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-skilltree .ghost-lab-panel {
            transform: translateX(32px);
            opacity: 0;
            pointer-events: none;
          }
          #npc-ghost-lab-modal .ghost-lab-npc-head {
            display: grid;
            gap: 4px;
          }
          #npc-ghost-lab-modal .ghost-lab-stars {
            color: #fbbf24;
            letter-spacing: 2px;
          }
          #npc-ghost-lab-modal .ghost-lab-handle {
            font-size: 12px;
            color: #93c5fd;
          }
          #npc-ghost-lab-modal .ghost-lab-profile-desc {
            font-size: 12px;
            line-height: 1.35;
            color: #cbd5e1;
            background: rgba(30, 41, 59, 0.58);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            padding: 8px 10px;
          }
          #npc-ghost-lab-modal .ghost-lab-chip-row {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          #npc-ghost-lab-modal .ghost-lab-chip {
            padding: 7px 10px;
            border-radius: 999px;
            font-size: 12px;
            background: rgba(30,41,59,.95);
            border: 1px solid rgba(255,255,255,.08);
            color: #e2e8f0;
          }
          #npc-ghost-lab-modal .ghost-lab-main-actions {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 8px;
          }
          #npc-ghost-lab-modal .ghost-lab-main-btn {
            padding: 10px 12px;
            border-radius: 14px;
            color: #0f172a;
            background: #fbbf24;
          }
          #npc-ghost-lab-modal .ghost-lab-main-btn.alt {
            background: #38bdf8;
          }
          #npc-ghost-lab-modal .ghost-lab-main-btn.ghost {
            background: #c084fc;
          }
          #npc-ghost-lab-modal .ghost-lab-main-btn.dark {
            background: #334155;
            color: #e2e8f0;
          }
          #npc-ghost-lab-modal .ghost-lab-passive {
            border-radius: 18px;
            padding: 12px;
            background: rgba(88,28,135,.26);
            border: 1px solid rgba(192,132,252,.25);
            display: grid;
            gap: 8px;
          }
          #npc-ghost-lab-modal .ghost-lab-passive-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          }
          #npc-ghost-lab-modal .ghost-lab-passive-sub {
            font-size: 12px;
            color: #ddd6fe;
          }
          #npc-ghost-lab-modal .ghost-lab-mini-btn {
            padding: 8px 10px;
            border-radius: 12px;
            background: #c084fc;
            color: #240b36;
          }
          #npc-ghost-lab-modal .ghost-lab-stat-list {
            display: grid;
            gap: 8px;
            overflow: auto;
            padding-right: 2px;
          }
          #npc-ghost-lab-modal .ghost-lab-stat-row {
            display: grid;
            grid-template-columns: 1fr auto auto;
            gap: 8px;
            align-items: center;
            padding: 10px 12px;
            border-radius: 14px;
            background: rgba(15,23,42,.72);
            border: 1px solid rgba(255,255,255,.08);
          }
          #npc-ghost-lab-modal .ghost-lab-stat-name {
            font-size: 13px;
            font-weight: 700;
          }
          #npc-ghost-lab-modal .ghost-lab-stat-value {
            font-size: 13px;
            font-weight: 800;
            color: #f8fafc;
          }
          #npc-ghost-lab-modal .ghost-lab-stat-btn {
            min-width: 38px;
            height: 34px;
            border-radius: 10px;
            color: #052e16;
            font-size: 18px;
          }
          #npc-ghost-lab-modal .ghost-lab-foot {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            font-size: 12px;
            color: #94a3b8;
          }
          #npc-ghost-lab-modal .ghost-lab-foot b {
            color: #e2e8f0;
          }
          #npc-ghost-lab-modal .ghost-lab-main-btn.wide {
            grid-column: 1 / -1;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-view {
            position: absolute;
            inset: 88px 26px 24px 26px;
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(2,6,23,.84) 0%, rgba(15,23,42,.78) 100%);
            border: 1px solid rgba(255,255,255,.08);
            box-shadow: 0 16px 34px rgba(0,0,0,.32);
            display: grid;
            grid-template-columns: minmax(320px, 380px) 1fr;
            gap: 16px;
            padding: 18px;
            opacity: 0;
            pointer-events: none;
            transform: translateX(42px);
            transition: opacity .42s ease, transform .42s cubic-bezier(.16, 1, .3, 1);
            z-index: 4;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-levelup .ghost-lab-levelup-view {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(0);
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-left,
          #npc-ghost-lab-modal .ghost-lab-levelup-right {
            min-height: 0;
            border-radius: 20px;
            background: rgba(15,23,42,.54);
            border: 1px solid rgba(255,255,255,.08);
            padding: 16px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-left {
            display: grid;
            grid-template-rows: auto auto auto 1fr auto;
            gap: 14px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-head {
            display: flex;
            align-items: center;
            gap: 14px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-card {
            width: 110px;
            aspect-ratio: 1 / 1;
            border-radius: 22px;
            border: 2px solid rgba(192,132,252,.82);
            background: linear-gradient(180deg, rgba(91,33,182,.86) 0%, rgba(30,41,59,.94) 100%);
            display: grid;
            place-items: center;
            font-weight: 900;
            font-size: 38px;
            color: #fff;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-meta {
            display: grid;
            gap: 6px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-meta b {
            font-size: 24px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-meta span {
            font-size: 13px;
            color: #cbd5e1;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-stars {
            color: #fbbf24;
            letter-spacing: 2px;
          }
          #npc-ghost-lab-modal .ghost-lab-expbox {
            display: grid;
            gap: 8px;
          }
          #npc-ghost-lab-modal .ghost-lab-expbar {
            position: relative;
            height: 16px;
            border-radius: 999px;
            overflow: hidden;
            background: rgba(30,41,59,.9);
            border: 1px solid rgba(255,255,255,.08);
          }
          #npc-ghost-lab-modal .ghost-lab-expbar-fill,
          #npc-ghost-lab-modal .ghost-lab-expbar-preview {
            position: absolute;
            inset: 0 auto 0 0;
            border-radius: inherit;
          }
          #npc-ghost-lab-modal .ghost-lab-expbar-fill {
            width: ${currentPct}%;
            background: linear-gradient(90deg, #f59e0b, #facc15);
          }
          #npc-ghost-lab-modal .ghost-lab-expbar-preview {
            width: ${hasPreview ? (preview.level > state.level ? 100 : Math.max(currentPct, previewPct)) : 0}%;
            background: linear-gradient(90deg, rgba(250,204,21,.3), rgba(96,165,250,.72));
            opacity: ${hasPreview ? 1 : 0};
          }
          #npc-ghost-lab-modal .ghost-lab-exptext {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            font-size: 12px;
            color: #cbd5e1;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-slots {
            display: grid;
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 10px;
            align-content: start;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-slot {
            min-height: 74px;
            border-radius: 16px;
            border: 1px dashed rgba(255,255,255,.18);
            background: rgba(15,23,42,.44);
            color: #94a3b8;
            display: grid;
            place-items: center;
            text-align: center;
            font-size: 12px;
            padding: 8px;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-slot.filled {
            border-style: solid;
            background: rgba(51,65,85,.84);
            color: #fff;
            cursor: pointer;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-slot b {
            font-size: 13px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-actions {
            display: flex;
            gap: 10px;
          }
          #npc-ghost-lab-modal .ghost-lab-levelup-right {
            display: grid;
            grid-template-rows: auto 1fr;
            gap: 12px;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-grid {
            min-height: 0;
            overflow: auto;
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 10px;
            padding-right: 4px;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-card {
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 16px;
            padding: 10px;
            display: grid;
            gap: 6px;
            background: rgba(15,23,42,.72);
            color: #fff;
            cursor: pointer;
            text-align: left;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-card[data-rarity="1"] { box-shadow: inset 0 0 0 1px rgba(148,163,184,.24); }
          #npc-ghost-lab-modal .ghost-lab-feed-card[data-rarity="2"] { box-shadow: inset 0 0 0 1px rgba(96,165,250,.24); }
          #npc-ghost-lab-modal .ghost-lab-feed-card[data-rarity="3"] { box-shadow: inset 0 0 0 1px rgba(192,132,252,.28); }
          #npc-ghost-lab-modal .ghost-lab-feed-card small {
            color: #cbd5e1;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-card b {
            font-size: 14px;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-badge {
            justify-self: start;
            padding: 2px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 800;
            background: rgba(251,191,36,.18);
            color: #fde68a;
          }
          #npc-ghost-lab-modal .ghost-lab-feed-card .ghost-lab-levelup-stars {
            font-size: 12px;
          }
          #npc-ghost-lab-modal .ghost-lab-skilltree-view {
            position: absolute;
            inset: 88px 26px 24px 26px;
            border-radius: 24px;
            background: linear-gradient(180deg, rgba(2,6,23,.84) 0%, rgba(15,23,42,.78) 100%);
            border: 1px solid rgba(255,255,255,.08);
            box-shadow: 0 16px 34px rgba(0,0,0,.32);
            display: grid;
            grid-template-columns: 280px 1fr;
            gap: 16px;
            padding: 18px;
            opacity: 0;
            pointer-events: none;
            transform: translateX(42px);
            transition: opacity .42s ease, transform .42s cubic-bezier(.16, 1, .3, 1);
            z-index: 4;
          }
          #npc-ghost-lab-modal .ghost-npc-lab-window.is-skilltree .ghost-lab-skilltree-view {
            opacity: 1;
            pointer-events: auto;
            transform: translateX(0);
          }
          #npc-ghost-lab-modal .ghost-lab-skilltree-left,
          #npc-ghost-lab-modal .ghost-lab-skilltree-right {
            min-height: 0;
            border-radius: 20px;
            background: rgba(15,23,42,.54);
            border: 1px solid rgba(255,255,255,.08);
            padding: 16px;
          }
          #npc-ghost-lab-modal .ghost-lab-skilltree-left {
            display: grid;
            grid-template-rows: auto auto 1fr auto;
            gap: 14px;
          }
          #npc-ghost-lab-modal .ghost-lab-skilltree-card {
            width: 116px;
            aspect-ratio: 1 / 1;
            border-radius: 24px;
            border: 2px solid rgba(192,132,252,.82);
            background: linear-gradient(180deg, rgba(91,33,182,.86) 0%, rgba(30,41,59,.94) 100%);
            display: grid;
            place-items: center;
            font-weight: 900;
            font-size: 40px;
            color: #fff;
          }
          #npc-ghost-lab-modal .ghost-lab-skilltree-right {
            position: relative;
            overflow: auto;
          }
          #npc-ghost-lab-modal .ghost-lab-skilltree-canvas {
            position: relative;
            min-height: 620px;
            min-width: 760px;
          }
          #npc-ghost-lab-modal .ghost-lab-skill-line-v,
          #npc-ghost-lab-modal .ghost-lab-skill-line-h {
            position: absolute;
            background: linear-gradient(180deg, rgba(96,165,250,.28), rgba(192,132,252,.38));
            border-radius: 999px;
          }
          #npc-ghost-lab-modal .ghost-lab-skill-line-v {
            width: 6px;
            left: 14%;
            top: 14%;
            bottom: 18%;
          }
          #npc-ghost-lab-modal .ghost-lab-skill-line-h {
            height: 6px;
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node {
            position: absolute;
            width: 104px;
            min-height: 84px;
            transform: translate(-50%, -50%);
            border-radius: 18px;
            border: 2px solid rgba(255,255,255,.16);
            background: rgba(15,23,42,.88);
            color: #fff;
            padding: 10px;
            display: grid;
            gap: 4px;
            text-align: center;
            cursor: pointer;
            box-shadow: 0 10px 24px rgba(0,0,0,.28);
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node small {
            font-size: 11px;
            color: #cbd5e1;
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node.is-core {
            width: 118px;
            min-height: 118px;
            border-radius: 999px;
            background: radial-gradient(circle at 30% 25%, rgba(255,255,255,.2), transparent 30%), rgba(76,29,149,.92);
            border-color: rgba(196,181,253,.42);
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node.is-cap {
            background: rgba(51,65,85,.9);
            border-color: rgba(250,204,21,.36);
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node.is-unlocked {
            border-color: rgba(134,239,172,.48);
            box-shadow: 0 0 0 2px rgba(34,197,94,.18), 0 12px 28px rgba(0,0,0,.26);
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node.is-locked {
            opacity: .48;
            filter: grayscale(.18);
          }
          #npc-ghost-lab-modal .ghost-lab-skill-node strong {
            font-size: 14px;
          }
          #npc-ghost-lab-modal .ghost-lab-skill-cost {
            font-size: 11px;
            color: #fde68a;
          }
          @media (max-width: 980px) {
            #npc-ghost-lab-modal .ghost-lab-stage {
              inset: 88px 20px 280px 20px;
            }
            #npc-ghost-lab-modal .ghost-lab-panel {
              width: auto;
              left: 18px;
              right: 18px;
              top: auto;
              height: 250px;
              bottom: 18px;
              transform: translateY(104%);
            }
            #npc-ghost-lab-modal .ghost-npc-lab-window.is-focused .ghost-lab-panel {
              transform: translateY(0);
            }
            #npc-ghost-lab-modal .ghost-lab-levelup-view {
              inset: 88px 18px 18px 18px;
              grid-template-columns: 1fr;
            }
            #npc-ghost-lab-modal .ghost-lab-skilltree-view {
              inset: 88px 18px 18px 18px;
              grid-template-columns: 1fr;
            }
            #npc-ghost-lab-modal .ghost-lab-feed-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
            #npc-ghost-lab-modal .ghost-lab-feed-slots {
              grid-template-columns: repeat(5, minmax(0, 1fr));
            }
          }
        </style>

        <div class="ghost-lab-top">
          <div class="ghost-lab-title">
            <b>${state.contextTitle}</b>
            <span>${state.contextSubtitle}</span>
          </div>
          <button id="ghostNpcLabClose" class="ghost-lab-close">✕</button>
        </div>

        <div class="ghost-lab-scene">
          <div class="ghost-lab-backdrop"></div>
          <div class="ghost-lab-stage">
            <div id="ghostNpcMover" class="ghost-lab-mover">
              <button id="ghostNpcCard" class="ghost-lab-card" type="button" style="--ghost-card-bg1:${state.cardBg1};--ghost-card-bg2:${state.cardBg2};--ghost-card-accent:${state.cardAccent};">
                <div class="ghost-lab-card-main">
                  <div class="ghost-lab-card-sigil">${state.cardSigil}</div>
                  <div class="ghost-lab-card-name">${state.name}</div>
                  <div class="ghost-lab-card-sub">${stars}</div>
                </div>
              </button>
              <div class="ghost-lab-focus-tip">${state.focusPhase === "focused" ? "Vista enfocada" : "Haz click para abrir la UI del NPC"}</div>
            </div>
          </div>
        </div>

        <div class="ghost-lab-panel">
          <div class="ghost-lab-npc-head">
            <div style="font-size:22px;font-weight:900;">${state.name}</div>
            <div class="ghost-lab-handle">${state.handle}</div>
            <div class="ghost-lab-stars">${stars}</div>
            <div class="ghost-lab-profile-desc">${state.profileDescription}</div>
          </div>

          <div class="ghost-lab-chip-row">
            <div class="ghost-lab-chip">Nivel <b>${state.level}</b> / ${reachableCap}</div>
            <div class="ghost-lab-chip">Cap final <b>${hardMaxLevel}</b></div>
            <div class="ghost-lab-chip">EXP <b>${state.exp}</b> / ${currentNeed}</div>
            <div class="ghost-lab-chip">Pasiva <b>${state.passiveLevel}</b> / 5</div>
            <div class="ghost-lab-chip">Dupes <b>∞</b></div>
            <div class="ghost-lab-chip">Cristales Sup. <b>∞</b></div>
          </div>

          <div class="ghost-lab-main-actions">
            <button class="ghost-lab-main-btn wide" id="ghostNpcOpenLevelUp">Level Up</button>
            <button class="ghost-lab-main-btn alt" id="ghostNpcOpenSkillTree">Habilidades</button>
            <button class="ghost-lab-main-btn ghost" data-ghost-passive-add="1">Pasiva +1</button>
            <button class="ghost-lab-main-btn dark" id="ghostNpcLabReset">Reset</button>
          </div>

          <div class="ghost-lab-passive">
            <div class="ghost-lab-passive-top">
              <div>
                <div style="font-size:15px;font-weight:800;">${state.skillName}</div>
                <div class="ghost-lab-passive-sub">El dupe del mismo NPC sube la skill/pasiva hasta nivel 5. El arbol usa cristales superiores del mismo color y sus finales suben el cap de nivel.</div>
              </div>
              <button class="ghost-lab-mini-btn" data-ghost-passive-add="1">Evol +1</button>
            </div>
            <div class="ghost-lab-passive-sub">Boost actual de prueba: <b>+${state.passiveLevel * 20}%</b></div>
          </div>

          <div class="ghost-lab-stat-list">
            ${statDefs.map((stat) => `
              <div class="ghost-lab-stat-row">
                <div class="ghost-lab-stat-name" style="color:${stat.color};">${stat.label}</div>
                <div class="ghost-lab-stat-value">${state.stats[stat.key] || 0}</div>
                <button class="ghost-lab-stat-btn" data-ghost-stat="${stat.key}" style="background:${stat.color};">+</button>
              </div>
            `).join("")}
          </div>

          <div class="ghost-lab-foot">
            <span>NPC de prueba para validar la pantalla de habitacion.</span>
            <button id="ghostNpcLabBack" class="ghost-lab-mini-btn" style="background:#334155;color:#e2e8f0;">${state.focused ? "Volver" : "Centrar"}</button>
          </div>
        </div>

        <div class="ghost-lab-levelup-view">
          <div class="ghost-lab-levelup-left">
            <div class="ghost-lab-levelup-head">
              <div class="ghost-lab-levelup-card">${state.cardSigil}</div>
              <div class="ghost-lab-levelup-meta">
                <b>${state.name}</b>
                <span>Evol ${state.passiveLevel}/5</span>
                <span>Lv ${state.level}/${reachableCap}</span>
                <div class="ghost-lab-levelup-stars">${stars}</div>
              </div>
            </div>
            <div class="ghost-lab-expbox">
              <div class="ghost-lab-expbar">
                <div class="ghost-lab-expbar-preview"></div>
                <div class="ghost-lab-expbar-fill"></div>
              </div>
              <div class="ghost-lab-exptext">
                <span>${isLevelCapped ? `Cap bloqueado en ${reachableCap}` : `EXP actual ${state.exp}/${currentNeed}`}</span>
                <span>Ganado +${selectedFeedExp} | ${hasPreview ? `Preview Lv ${preview.level}/${reachableCap}` : `Sin preview`}</span>
              </div>
            </div>
            <div style="font-size:13px;font-weight:800;color:#e2e8f0;">Slots de sacrificio</div>
            <div class="ghost-lab-feed-slots">
              ${state.levelUpSlots.map((slot, index) => slot ? `
                <button class="ghost-lab-feed-slot filled" type="button" data-ghost-slot-remove="${index}">
                  <b>${slot.name}</b>
                  <span>${"★".repeat(slot.rarity)}</span>
                  <span>+${slot.exp} EXP</span>
                </button>
              ` : `
                <div class="ghost-lab-feed-slot">
                  <span>Slot ${index + 1}</span>
                </div>
              `).join("")}
            </div>
            <div class="ghost-lab-levelup-actions">
              <button id="ghostNpcCancelLevelUp" class="ghost-lab-main-btn dark" style="flex:1;">Cancelar</button>
              <button id="ghostNpcApplyLevelUp" class="ghost-lab-main-btn" style="flex:1;" ${selectedFeedExp <= 0 ? "disabled" : ""}>Subir nivel</button>
            </div>
          </div>
          <div class="ghost-lab-levelup-right">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
              <div>
                <div style="font-size:18px;font-weight:900;">Lista de personajes</div>
                <div style="font-size:12px;color:#cbd5e1;">Solo 1★ a 3★. El mismo personaje da EXP extra; los otros dan EXP normal.</div>
              </div>
            </div>
            <div class="ghost-lab-feed-grid">
              ${feedEntries.map((entry) => `
                <button class="ghost-lab-feed-card" type="button" data-ghost-feed-key="${entry.key}" data-rarity="${entry.rarity}">
                  <div class="ghost-lab-levelup-stars">${"★".repeat(entry.rarity)}</div>
                  <b>${entry.name}</b>
                  <small>Stock x${entry.count}</small>
                  <small>EXP +${entry.exp}</small>
                  <small>${entry.isSameUnit ? "Mismo NPC base" : `Main: ${entry.mainStatLabel} ${entry.mainStatValue}`}</small>
                  ${entry.isSameUnit ? `<div class="ghost-lab-feed-badge">Mismo NPC</div>` : `<div class="ghost-lab-feed-badge" style="background:rgba(96,165,250,.18);color:#bfdbfe;">EXP normal</div>`}
                </button>
              `).join("")}
            </div>
          </div>
        </div>

        <div class="ghost-lab-skilltree-view">
          <div class="ghost-lab-skilltree-left">
            <div style="display:flex;align-items:center;gap:14px;">
              <div class="ghost-lab-skilltree-card">${state.cardSigil}</div>
              <div style="display:grid;gap:6px;">
                <div style="font-size:22px;font-weight:900;">${state.name}</div>
                <div style="font-size:13px;color:#cbd5e1;">Cap actual <b>${reachableCap}</b> / ${hardMaxLevel}</div>
                <div class="ghost-lab-levelup-stars">${stars}</div>
              </div>
            </div>
            <div style="display:grid;gap:8px;font-size:13px;color:#cbd5e1;">
              <div>Nodo central: activa la red.</div>
              <div>5 ramas con stats en orden aleatorio.</div>
              <div>El nodo final de cada rama usa todos los cristales y sube el limite de nivel.</div>
              <div>Cristales superiores: <b>∞</b> | Oro: <b>${this.formatGoldHUD(this.gold)}</b></div>
            </div>
            <div style="display:grid;gap:8px;">
              ${statDefs.map((stat) => `<div style="display:flex;justify-content:space-between;gap:10px;font-size:13px;"><span style="color:${stat.color};font-weight:800;">${stat.label}</span><b>${state.stats[stat.key] || 0}</b></div>`).join("")}
            </div>
            <button id="ghostNpcCloseSkillTree" class="ghost-lab-main-btn dark">Volver</button>
          </div>
          <div class="ghost-lab-skilltree-right">
            <div class="ghost-lab-skilltree-canvas">
              <div class="ghost-lab-skill-line-v"></div>
              <button class="ghost-lab-skill-node is-core ${state.skillTree.coreUnlocked ? "is-unlocked" : ""}" type="button" id="ghostNpcSkillCore" style="left:14%;top:48%;">
                <strong>Nucleo</strong>
                <small>${state.skillTree.coreUnlocked ? "Activo" : "Abrir arbol"}</small>
                <div class="ghost-lab-skill-cost">${state.skillTree.coreUnlocked ? "OK" : "Todos x1"}</div>
              </button>
              ${(state.skillTree.branches || []).map((branch, branchIndex) => {
                const lineStart = 18;
                const nodes = branch.nodes || [];
                const firstX = nodes[0]?.x || 32;
                const lines = [
                  `<div class="ghost-lab-skill-line-h" style="left:${lineStart}%;top:${branch.y}%;width:${Math.max(1, firstX - lineStart)}%;"></div>`
                ];
                for (let i = 0; i < nodes.length - 1; i++) {
                  lines.push(`<div class="ghost-lab-skill-line-h" style="left:${nodes[i].x}%;top:${branch.y}%;width:${Math.max(1, nodes[i + 1].x - nodes[i].x)}%;"></div>`);
                }
                const nodeHtml = nodes.map((node, nodeIndex) => {
                  const prevUnlocked = nodeIndex === 0 ? state.skillTree.coreUnlocked : !!nodes[nodeIndex - 1]?.unlocked;
                  const lockedClass = (!prevUnlocked && !node.unlocked) ? " is-locked" : "";
                  const nodeColor = node.kind === "cap"
                    ? "#fde68a"
                    : (treeStatDefs[node.statKey]?.color || "#cbd5e1");
                  const crystalLabel = node.kind === "cap"
                    ? `Todos x${node.crystalCost}`
                    : `${(ITEM_DEFS[node.crystalKey]?.name || "Cristal")} x${node.crystalCost}`;
                  const effectLabel = node.kind === "cap"
                    ? `Cap +${node.capGain}`
                    : `${treeStatDefs[node.statKey]?.label || node.statKey} +${node.amount}`;
                  return `
                    <button class="ghost-lab-skill-node ${node.kind === "cap" ? "is-cap" : ""}${node.unlocked ? " is-unlocked" : ""}${lockedClass}" type="button" data-ghost-skill-node="${branchIndex}:${nodeIndex}" style="left:${node.x}%;top:${branch.y}%;border-color:${node.unlocked ? nodeColor : "rgba(255,255,255,.16)"};">
                      <strong style="color:${nodeColor};">${effectLabel}</strong>
                      <small>${node.kind === "cap" ? "Nodo final" : "Stat Node"}</small>
                      <div class="ghost-lab-skill-cost">${node.unlocked ? "Comprado" : `${crystalLabel} + Oro ${node.goldCost}`}</div>
                    </button>
                  `;
                }).join("");
                return lines.join("") + nodeHtml;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    `;

    requestAnimationFrame(() => {
      const targetMode = state.focusPhase === "focused" ? "focused" : "roam";
      this.setGhostNpcLabMoverTarget(modal, targetMode, true);
    });

    modal.querySelector("#ghostNpcLabClose")?.addEventListener("click", () => this.closeGhostNpcLabModal());
    modal.querySelector("#ghostNpcOpenLevelUp")?.addEventListener("click", () => {
      state.view = "levelup";
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelector("#ghostNpcOpenSkillTree")?.addEventListener("click", () => {
      state.view = "skilltree";
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelector("#ghostNpcCancelLevelUp")?.addEventListener("click", () => {
      state.view = "main";
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelector("#ghostNpcCloseSkillTree")?.addEventListener("click", () => {
      state.view = "main";
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelector("#ghostNpcApplyLevelUp")?.addEventListener("click", () => {
      if (selectedFeedExp <= 0) return;
      state.level = preview.level;
      state.exp = preview.exp;
      state.levelUpSlots = Array.from({ length: 10 }, () => null);
      state.levelUpPreview = null;
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelector("#ghostNpcSkillCore")?.addEventListener("click", () => {
      if (state.skillTree.coreUnlocked) return;
      state.skillTree.coreUnlocked = true;
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelectorAll("[data-ghost-skill-node]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const raw = String(btn.getAttribute("data-ghost-skill-node") || "");
        const [branchIndexStr, nodeIndexStr] = raw.split(":");
        const branchIndex = Math.max(0, Math.min(4, Math.round(Number(branchIndexStr) || 0)));
        const nodeIndex = Math.max(0, Math.min(3, Math.round(Number(nodeIndexStr) || 0)));
        const branch = state.skillTree.branches?.[branchIndex];
        const node = branch?.nodes?.[nodeIndex];
        if (!branch || !node || node.unlocked) return;
        const prevUnlocked = nodeIndex === 0 ? state.skillTree.coreUnlocked : !!branch.nodes?.[nodeIndex - 1]?.unlocked;
        if (!prevUnlocked) return;
        node.unlocked = true;
        if (node.kind === "stat" && state.stats[node.statKey] != null) {
          state.stats[node.statKey] = Math.max(0, Math.round(Number(state.stats[node.statKey]) || 0) + node.amount);
        }
        this.renderGhostNpcLabModal(modal);
      });
    });
    modal.querySelectorAll("[data-ghost-feed-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = String(btn.getAttribute("data-ghost-feed-key") || "");
        const activeNpcKey = String(state.npcKey || "");
        const isSameUnit = key === "ghost_self_dupe" || (!!activeNpcKey && key === activeNpcKey);
        const def = isSameUnit ? null : ITEM_DEFS[key];
        if (!key || (!isSameUnit && !def)) return;
        const rarity = isSameUnit
          ? Math.max(1, Math.min(3, Math.round(Number(state.rarity) || 3)))
          : Math.max(1, Math.min(3, Math.round(Number(def.rarity) || 1)));
        if (rarity >= 4) return;
        const slotIndex = state.levelUpSlots.findIndex((slot) => !slot);
        if (slotIndex < 0) return;
        if (!state.levelUpOwned[key]) return;
        const entry = feedEntries.find((it) => it.key === key);
        if (!entry) return;
        state.levelUpOwned[key] = Math.max(0, state.levelUpOwned[key] - 1);
        state.levelUpSlots[slotIndex] = {
          key,
          name: isSameUnit ? state.name : (def.name || key),
          rarity,
          exp: entry.exp
        };
        this.renderGhostNpcLabModal(modal);
      });
    });
    modal.querySelectorAll("[data-ghost-slot-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const slotIndex = Math.max(0, Math.min(9, Math.round(Number(btn.getAttribute("data-ghost-slot-remove")) || 0)));
        const slot = state.levelUpSlots[slotIndex];
        if (!slot) return;
        state.levelUpOwned[slot.key] = Math.max(0, Math.round(Number(state.levelUpOwned[slot.key]) || 0) + 1);
        state.levelUpSlots[slotIndex] = null;
        this.renderGhostNpcLabModal(modal);
      });
    });
    modal.querySelector("#ghostNpcCard")?.addEventListener("click", () => {
      if (state.focusPhase !== "roam") return;
      if (modal._ghostMoveTimer) {
        clearInterval(modal._ghostMoveTimer);
        modal._ghostMoveTimer = null;
      }
      if (modal._ghostResumeTimer) {
        clearTimeout(modal._ghostResumeTimer);
        modal._ghostResumeTimer = null;
      }
      state.focused = true;
      state.focusPhase = "locking";
      this.syncGhostNpcLabPhase(modal);
      if (modal._ghostFocusTimer) {
        clearTimeout(modal._ghostFocusTimer);
      }
      modal._ghostFocusTimer = setTimeout(() => {
        if (!modal?.isConnected) return;
        const nextState = this.getGhostNpcLabState();
        if (nextState.focusPhase !== "locking") return;
        nextState.focused = true;
        nextState.focusPhase = "focused";
        this.syncGhostNpcLabPhase(modal);
      }, 560);
    });
    modal.querySelector("#ghostNpcLabBack")?.addEventListener("click", () => {
      if (modal._ghostFocusTimer) {
        clearTimeout(modal._ghostFocusTimer);
        modal._ghostFocusTimer = null;
      }
      if (modal._ghostResumeTimer) {
        clearTimeout(modal._ghostResumeTimer);
        modal._ghostResumeTimer = null;
      }
      state.focused = false;
      state.focusPhase = "roam";
      state.cardY = 49;
      this.syncGhostNpcLabPhase(modal);
      modal._ghostResumeTimer = setTimeout(() => {
        if (!modal?.isConnected) return;
        const nextState = this.getGhostNpcLabState();
        if (nextState.focusPhase !== "roam") return;
        if (modal._ghostMoveTimer) {
          clearInterval(modal._ghostMoveTimer);
        }
        modal._ghostMoveTimer = setInterval(() => this.moveGhostNpcLabCard(modal), 4500);
        this.moveGhostNpcLabCard(modal);
      }, 1200);
    });
    modal.querySelector("#ghostNpcLabReset")?.addEventListener("click", () => {
      this.ghostNpcLabState = this.buildGhostNpcLabResetState(state);
      this.renderGhostNpcLabModal(modal);
    });
    modal.querySelectorAll("[data-ghost-passive-add]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.passiveLevel = Math.max(0, Math.min(5, state.passiveLevel + 1));
        this.renderGhostNpcLabModal(modal);
      });
    });
    modal.querySelectorAll("[data-ghost-stat]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const statKey = String(btn.getAttribute("data-ghost-stat") || "");
        if (!statKey || !Object.prototype.hasOwnProperty.call(state.stats, statKey)) return;
        state.stats[statKey] = Math.max(0, Math.min(999, Math.round(Number(state.stats[statKey]) || 0) + 1));
        this.renderGhostNpcLabModal(modal);
      });
    });

    if (modal._ghostMoveTimer) {
      clearInterval(modal._ghostMoveTimer);
      modal._ghostMoveTimer = null;
    }
    if (state.focusPhase === "roam") {
      modal._ghostMoveTimer = setInterval(() => this.moveGhostNpcLabCard(modal), 4500);
      this.moveGhostNpcLabCard(modal);
    }
  }

  openGhostNpcLabModal(overrides = null) {
    const nextOverrides = (overrides && typeof overrides === "object") ? overrides : null;
    try {
      if (nextOverrides) {
        this.ghostNpcLabState = this.createDefaultGhostNpcLabState(nextOverrides);
      } else {
        this.ghostNpcLabState = this.getGhostNpcLabState();
      }
      let modal = document.getElementById("npc-ghost-lab-modal");
      if (!modal) {
        modal = document.createElement("div");
        modal.id = "npc-ghost-lab-modal";
        modal.addEventListener("click", (e) => {
          if (e.target === modal) this.closeGhostNpcLabModal();
        });
        document.body.appendChild(modal);
      }
      this.renderGhostNpcLabModal(modal);
      return true;
    } catch (err) {
      console.error("openGhostNpcLabModal failed:", err);
      this.closeGhostNpcLabModal();
      this.showUiErrorMessage("No se pudo abrir la ventana NPC.");
      return false;
    }
  }

  renderInventoryIntoContainer(listEl) {
    if (!listEl) return;

    const keys = Object.keys(ITEM_DEFS);
    const rows = keys.map((k) => {
      const def = ITEM_DEFS[k];
      const c = this.inventory[k] || 0;
      const disabled = c <= 0 || def.buildable === false;
      const metaLine = getItemInventoryMeta(def);
      return `
        <button class="inv-row ${disabled ? "is-empty" : ""}" data-item="${k}" ${disabled ? "disabled" : ""}>
          <div class="inv-left">
            <div class="inv-name">${def.icon} ${def.name}</div>
            <div class="inv-meta">${metaLine}</div>
          </div>
          <div class="inv-count">x ${c}</div>
        </button>
      `;
    });

    listEl.innerHTML = rows.join("");

    listEl.querySelectorAll("[data-item]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-item");
        if (!key) return;
        const ok = this.selectBuildItem(key);
        if (!ok) return;
        const modal = document.getElementById("inventory-modal");
        if (modal) modal.remove();
      });
    });
  }
  createUI() {
    const s = this.scene;
    const HUD_FONT_FAMILY = "Melon Pop";
    const linear = Phaser?.Textures?.FilterMode?.LINEAR;
    if (linear !== undefined) {
      s.textures?.get?.("ui_moneda_icon")?.setFilter?.(linear);
      s.textures?.get?.("ui_exp_icon")?.setFilter?.(linear);
      s.textures?.get?.("ui_yapa_icon")?.setFilter?.(linear);
      s.textures?.get?.("ui_wish_perm_icon")?.setFilter?.(linear);
      s.textures?.get?.("ui_wish_lim_icon")?.setFilter?.(linear);
    }

    const style = (bg = null, color = "#ffffff") => {
      const cfg = {
        fontFamily: HUD_FONT_FAMILY,
        fontStyle: "bold",
        fontSize: "30px",
        color,
        stroke: "#000000",
        strokeThickness: 7
      };
      if (bg) cfg.backgroundColor = bg;
      return cfg;
    };
    const addHudShadow = (el) => {
      // Sin sombra: solicitado para UI superior.
      return;
    };

    // --- Textos base (se posicionan en layoutHorizontal)
    this.goldText = s.add.text(0, 12, "", style(null, "#ffffff"))
      .setOrigin(0.5, 0.5)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);
    this.goldUiIcon = s.textures?.exists?.("ui_moneda_icon")
      ? s.add.image(0, 12, "ui_moneda_icon")
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(10000)
      : null;
    this.yapaText = s.add.text(0, 12, "", style(null, "#ffffff"))
      .setOrigin(0.5, 0.5)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);
    this.yapaUiIcon = s.textures?.exists?.("ui_yapa_icon")
      ? s.add.image(0, 12, "ui_yapa_icon")
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(10000)
      : null;

    this.levelText = s.add.text(0, 12, "", style(null, "#ffffff"))
      .setOrigin(0.5, 0.5)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(10005);
    this.levelText.setVisible(false);

    // EXP label (centrado dentro de la barra)
    this.expText = s.add.text(0, 30, "", {
      fontFamily: HUD_FONT_FAMILY,
      fontSize: "30px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 7
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(10001);
    this.expUiIcon = s.textures?.exists?.("ui_exp_icon")
      ? s.add.image(0, 30, "ui_exp_icon")
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(10004)
      : null;
    this.expStarLevelText = s.add.text(0, 30, "", {
      fontFamily: HUD_FONT_FAMILY,
      fontSize: "30px",
      fontStyle: "bold",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 7
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(10006);
    addHudShadow(this.expStarLevelText);
    this.hudClockPanel = s.add.graphics()
      .setScrollFactor(0)
      .setDepth(10002);
    this.hudClockGhostText = s.add.text(0, 30, "88:88 P.M", {
      fontFamily: "Consolas",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#5f0d0d",
      stroke: "#2c0505",
      strokeThickness: 2
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(10003)
      .setAlpha(0.55);
    this.hudClockText = s.add.text(0, 30, "--:-- A.M", {
      fontFamily: "Consolas",
      fontSize: "28px",
      fontStyle: "bold",
      color: "#ff3b30",
      stroke: "#2c0505",
      strokeThickness: 3
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(10004);
    this.hudClockText.setShadow(0, 0, "#ff3b30", 14, true, true);
    this.hudClockMetaText = s.add.text(0, 46, "--°C", {
      fontFamily: "Arial",
      fontSize: "11px",
      fontStyle: "bold",
      color: "#9fb0c6",
      stroke: "#09101d",
      strokeThickness: 2
    })
      .setOrigin(0.5, 0.5)
      .setScrollFactor(0)
      .setDepth(10004);

    // EXP bar (estilo inspirado en tu referencia PNG)
    this.expBarBg = s.add.graphics()
      .setScrollFactor(0)
      .setDepth(9999);
    this.expBarFill = s.add.graphics()
      .setScrollFactor(0)
      .setDepth(10000);
    this.expBarGloss = s.add.graphics()
      .setScrollFactor(0)
      .setDepth(10001);
    this.expBarFrame = s.add.graphics()
      .setScrollFactor(0)
      .setDepth(10002);
    this.expBarMaskShape = s.make.graphics({ x: 0, y: 0, add: false });
    this.expBarMask = this.expBarMaskShape.createGeometryMask();
    this.expBarBg.setMask(this.expBarMask);
    this.expBarFill.setMask(this.expBarMask);
    this.expBarGloss.setMask(this.expBarMask);
    this.expBarWidth = 140;
    this.expBarHeight = 8;
    this.expBarBorder = 2;
    this.expBarRadius = 8;
    this.expBarX = 0;
    this.expBarY = 0;

    // Deseos (perm / limited)
    this.permWishText = s.add.text(0, 12, "", style(null, "#ffffff"))
      .setOrigin(0.5, 0.5)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);
    this.permWishIcon = s.textures?.exists?.("ui_wish_perm_icon")
      ? s.add.image(0, 12, "ui_wish_perm_icon")
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(10000)
      : null;

    this.limitedWishText = s.add.text(0, 12, "", style(null, "#ffffff"))
      .setOrigin(0.5, 0.5)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);

    this.goldSlotBg = s.add.graphics().setScrollFactor(0).setDepth(9997);
    this.yapaSlotBg = s.add.graphics().setScrollFactor(0).setDepth(9997);
    this.permSlotBg = s.add.graphics().setScrollFactor(0).setDepth(9997);
    this.limitedSlotBg = s.add.graphics().setScrollFactor(0).setDepth(9997);
    this.limitedWishIcon = s.textures?.exists?.("ui_wish_lim_icon")
      ? s.add.image(0, 12, "ui_wish_lim_icon")
        .setOrigin(0.5, 0.5)
        .setScrollFactor(0)
        .setDepth(10000)
      : null;

    // Boton Gacha (imagen custom + animaciones)
    this.gachaBtnIsImage = !!s.textures?.exists?.(GACHA_BTN_TEXTURE_KEY);
    this.gachaBtnHovering = false;
    this.gachaBtnBaseScale = 1;
    this.gachaBtnPulseTween = null;
    this.gachaBtnScaleTween = null;
    this.gachaBtnGlowTween = null;
    this.gachaBtnPressTween = null;
    this.gachaOpenPending = false;

    if (this.gachaBtnIsImage) {
      this.gachaBtnGlow = s.add.image(0, 12, GACHA_BTN_TEXTURE_KEY)
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setDepth(9998)
        .setBlendMode(Phaser.BlendModes.ADD)
        .setTint(0xbffaff)
        .setAlpha(0);

      this.gachaBtn = s.add.image(0, 12, GACHA_BTN_TEXTURE_KEY)
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setDepth(9999);

      const stopBtnTween = (key) => {
        if (this[key]) {
          this[key].stop();
          this[key] = null;
        }
      };

      const syncGlow = () => {
        if (!this.gachaBtnGlow || !this.gachaBtn) return;
        this.gachaBtnGlow.setPosition(this.gachaBtn.x, this.gachaBtn.y);
      };

      const hoverScale = () => this.gachaBtnBaseScale * 1.03;
      const idleScale = () => this.gachaBtnBaseScale;

      this.gachaBtn.on("pointerover", () => {
        this.gachaBtnHovering = true;
        stopBtnTween("gachaBtnPressTween");
        stopBtnTween("gachaBtnScaleTween");
        stopBtnTween("gachaBtnGlowTween");
        stopBtnTween("gachaBtnPulseTween");

        this.gachaBtnScaleTween = s.tweens.add({
          targets: this.gachaBtn,
          scaleX: hoverScale(),
          scaleY: hoverScale(),
          duration: 140,
          ease: "Quad.Out"
        });

        if (this.gachaBtnGlow) {
          syncGlow();
          this.gachaBtnGlow.setScale(this.gachaBtnBaseScale * 1.08);
          this.gachaBtnGlowTween = s.tweens.add({
            targets: this.gachaBtnGlow,
            alpha: 0.22,
            duration: 150,
            ease: "Quad.Out"
          });
          this.gachaBtnPulseTween = s.tweens.add({
            targets: this.gachaBtnGlow,
            alpha: { from: 0.18, to: 0.34 },
            duration: 620,
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
          });
        }
      });

      this.gachaBtn.on("pointerout", () => {
        this.gachaBtnHovering = false;
        stopBtnTween("gachaBtnPressTween");
        stopBtnTween("gachaBtnPulseTween");
        stopBtnTween("gachaBtnScaleTween");
        stopBtnTween("gachaBtnGlowTween");

        this.gachaBtnScaleTween = s.tweens.add({
          targets: this.gachaBtn,
          scaleX: idleScale(),
          scaleY: idleScale(),
          duration: 140,
          ease: "Quad.Out"
        });

        if (this.gachaBtnGlow) {
          this.gachaBtnGlowTween = s.tweens.add({
            targets: this.gachaBtnGlow,
            alpha: 0,
            duration: 160,
            ease: "Quad.Out"
          });
        }
      });
    } else {
      // fallback: texto si la textura no esta disponible
      this.gachaBtn = s.add.text(0, 12, "\uD83C\uDFB0 Gachapon", {
        fontFamily: "Arial",
        fontSize: "16px",
        color: "#022c22",
        backgroundColor: "#22c55e"
      })
        .setOrigin(1, 0)
        .setPadding(10, 6)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setDepth(9999);
    }

    // DEV buttons
    this.adminPanelBg = s.add.rectangle(0, 0, 10, 10, 0x020617, 0.62)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(9997);
    this.adminPanelBg.setStrokeStyle(1, 0x334155, 0.9);

    this.adminLabel = s.add.text(0, 0, "ADMIN", {
      fontFamily: "Arial",
      fontSize: "12px",
      fontStyle: "bold",
      color: "#cbd5e1"
    })
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(9998);

    this.devPermBtn = s.add.text(0, 52, "+10 Perm", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#334155"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devLimitedBtn = s.add.text(0, 52, "+10 Lim", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#475569"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devGoldBtn = s.add.text(0, 52, "+100K Oro", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#0f766e"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devExpBtn = s.add.text(0, 52, "+50 EXP", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#1e293b"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devMaxLevelBtn = s.add.text(0, 52, "Nivel MAX", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#7c2d12"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devSpendYapaBtn = s.add.text(0, 52, "-100 Yapa", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#7f1d1d"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devYaparYapaBtn = s.add.text(0, 52, "YAPAR +100", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#0f766e"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devSpawnQrBtn = s.add.text(0, 52, "Aparecer QR", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#4c1d95"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devGhostNpcLabBtn = s.add.text(0, 52, "NPC Fantasma", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#e2e8f0",
      backgroundColor: "#134e4a"
    })
      .setOrigin(0, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    // Click: abrir modal
    this.gachaBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      if (this.gachaBtnIsImage) {
        if (this.gachaBtnPressTween) {
          this.gachaBtnPressTween.stop();
          this.gachaBtnPressTween = null;
        }
        const target = this.gachaBtnHovering ? (this.gachaBtnBaseScale * 1.03) : this.gachaBtnBaseScale;
        this.gachaBtnPressTween = s.tweens.add({
          targets: this.gachaBtn,
          scaleX: this.gachaBtnBaseScale * 0.95,
          scaleY: this.gachaBtnBaseScale * 0.95,
          duration: 70,
          ease: "Quad.Out",
          yoyo: true,
          hold: 20,
          onComplete: () => {
            this.gachaBtn.setScale(target);
            this.gachaBtnPressTween = null;
          }
        });
      }

      if (this.gachaOpenPending) return;
      this.gachaOpenPending = true;
      s.time.delayedCall(this.gachaBtnIsImage ? 95 : 0, () => {
        this.gachaOpenPending = false;
        this.openGachaModal();
      });
    });

    // DEV: sumar deseos
    this.devPermBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      this.wishesPermanent += 10;
      this.refreshUI();
      this.updateModalCounts();
    });

    this.devLimitedBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      this.wishesLimited += 10;
      this.refreshUI();
      this.updateModalCounts();
    });

    this.devGoldBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      this.addGold(100000);
    });

    this.devExpBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      this.addExp(50);
    });

    this.devMaxLevelBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      if (this.level >= MAX_LEVEL) {
        this.refreshUI();
        this.updateModalCounts();
        return;
      }
      while (this.level < MAX_LEVEL) {
        this.level++;
        this.applyLevelRewards(this.level);
      }
      this.exp = 0;
      this.expToNext = this.calcExpToNext();
      this.refreshUI();
      this.updateModalCounts();
    });

    this.devSpendYapaBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      this.spendYapas(100, "Admin");
    });

    this.devYaparYapaBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      this.addYapas(100, "Admin", "in");
    });

    this.devSpawnQrBtn.on("pointerdown", (pointer) => {
      if (this.hasBlockingOverlayOpen()) return;
      s.uiGuard?.(pointer);
      const res = this.scene?.forceSpawnYapaBonus?.();
      if (res?.ok) {
        this.updateYapaBonusStatus(document.getElementById("yapa-modal"));
      }
    });

    this.devGhostNpcLabBtn.on("pointerdown", (pointer) => {
      s.uiGuard?.(pointer);
      document.getElementById("npc-inventory-modal")?.remove();
      requestAnimationFrame(() => {
        this.openGhostNpcLabModal({
          sourceMode: "ghost",
          backgroundMode: "plain"
        });
      });
    });

    // Layout inicial
    this.refreshHudClockInfo(false);
    this.layoutHorizontal();
    this.hudClockTimerEvent?.remove?.(false);
    this.hudClockTimerEvent = s.time?.addEvent?.({
      delay: 16,
      loop: true,
      callback: () => this.refreshHudClockInfo(false)
    }) || null;
    s.events?.once?.("shutdown", () => {
      this.hudClockTimerEvent?.remove?.(false);
      this.hudClockTimerEvent = null;
    });

    // Registrar UI para que worldCam lo ignore
    const uiList = [
      this.adminPanelBg,
      this.adminLabel,
      this.goldSlotBg,
      this.yapaSlotBg,
      this.permSlotBg,
      this.limitedSlotBg,
      this.goldText,
      this.yapaText,
      this.goldUiIcon,
      this.yapaUiIcon,
      this.levelText,
      this.expText,
      this.expUiIcon,
      this.expStarLevelText,
      this.hudClockPanel,
      this.hudClockGhostText,
      this.hudClockText,
      this.hudClockMetaText,
      this.expBarBg,
      this.expBarFill,
      this.expBarGloss,
      this.expBarFrame,
      this.permWishText,
      this.permWishIcon,
      this.limitedWishText,
      this.limitedWishIcon,
      this.gachaBtnGlow,
      this.gachaBtn,
      this.devPermBtn,
      this.devLimitedBtn,
      this.devGoldBtn,
      this.devExpBtn,
      this.devMaxLevelBtn,
      this.devSpendYapaBtn,
      this.devYaparYapaBtn,
      this.devSpawnQrBtn,
      this.devGhostNpcLabBtn
    ].filter(Boolean);

    if (Array.isArray(s.uiObjects)) {
      s.uiObjects.push(...uiList);
      s.worldCam.ignore(s.uiObjects);
    } else if (s.worldCam?.ignore) {
      s.worldCam.ignore(uiList);
    }

    // Responsive
    s.scale.on("resize", () => this.layoutHorizontal());
  }

  layoutHorizontal() {
    const s = this.scene;
    const w = s.scale.width;
    const h = s.scale.height;
    const isCompact = w <= 1100;
    const isTiny = w <= 900;
    const right = w - (isTiny ? 6 : 10);
    const top = isCompact ? 8 : 10;
    const gap = isTiny ? 8 : 10;
    const gachaTargetH = isTiny ? 54 : 66;
    const slotH = gachaTargetH;
    const hasYapaHudIcon = !!this.yapaUiIcon;
    const hasPermWishIcon = !!this.permWishIcon;
    const hasLimitedWishIcon = !!this.limitedWishIcon;

    this.goldText.setText(this.formatGoldHUD(this.gold));
    this.yapaText.setText(hasYapaHudIcon
      ? `${this.formatYapaHUD(this.yapas)}`
      : (isTiny ? `Yp:${this.formatYapaHUD(this.yapas)}` : `Yapa: ${this.formatYapaHUD(this.yapas)}`));
    this.levelText.setText(`Lv${this.level}`);
    this.levelText.setVisible(false);
    const permHUD = this.formatWishHUD(this.wishesPermanent);
    const limHUD = this.formatWishHUD(this.wishesLimited);
    this.permWishText.setText(hasPermWishIcon ? `${permHUD}` : (isTiny ? `Perm:${permHUD}` : `Perm: ${permHUD}`));
    this.limitedWishText.setText(hasLimitedWishIcon ? `${limHUD}` : (isTiny ? `Lim:${limHUD}` : `Lim: ${limHUD}`));
    this.expText.setText(this.level >= MAX_LEVEL ? MAX_EXP_LABEL : `${this.exp}/${this.expToNext}`);
    const starLevelHUD = String(Math.max(0, this.level)).padStart(2, "0");
    if (this.expStarLevelText?.setText) this.expStarLevelText.setText(starLevelHUD);
    this.refreshHudClockInfo(false);

    const fontSize = isTiny ? 26 : 30;
    const smallFont = isTiny ? 15 : 17;
    const padX = isTiny ? 14 : 18;
    const padY = isTiny ? 10 : 11;
    const hudTracking = isTiny ? 1.8 : 2.5;
    const expTracking = isTiny ? 1.5 : 2.2;

    const apply = (el, f = fontSize, px = padX, py = padY) => {
      if (!el) return;
      if (typeof el.setFontSize === "function") el.setFontSize(f);
      if (typeof el.setPadding === "function") el.setPadding(px, py);
    };
    const applyTracking = (el, value) => {
      if (!el) return;
      if (typeof el.setLetterSpacing === "function") {
        el.setLetterSpacing(value);
        return;
      }
      if (el.style) {
        el.style.letterSpacing = value;
        if (typeof el.updateText === "function") el.updateText();
      }
    };
    const applyFixedWidth = (el, width, height = 0) => {
      if (!el || typeof el.setFixedSize !== "function") return;
      el.setFixedSize(width, height);
      if (typeof el.setAlign === "function") el.setAlign("center");
    };
    const measureTextPx = (text, sizePx = fontSize, bold = true) => {
      this.hudMeasureCanvas = this.hudMeasureCanvas || document.createElement("canvas");
      const ctx = this.hudMeasureCanvas.getContext("2d");
      if (!ctx) return Math.ceil((String(text).length || 1) * (sizePx * 0.62));
      ctx.font = `${bold ? "900 " : ""}${sizePx}px "${HUD_FONT_FAMILY}"`;
      return Math.ceil(ctx.measureText(String(text)).width);
    };
    const getUIWidth = (el) => (el?.displayWidth ?? el?.width ?? 0);
    const getUIHeight = (el) => (el?.displayHeight ?? el?.height ?? 0);
    const syncGachaGlowPos = () => {
      if (!this.gachaBtnGlow || !this.gachaBtn) return;
      this.gachaBtnGlow.setPosition(this.gachaBtn.x, this.gachaBtn.y);
    };
    const goldIconTarget = slotH;
    const expIconTarget = slotH;
    const yapaIconTarget = slotH;
    const wishIconTarget = slotH;
    const iconGap = isTiny ? 10 : 14;

    const fitIcon = (icon, targetSize) => {
      if (!icon) return 0;
      const srcW = icon.width || 1;
      const srcH = icon.height || 1;
      const maxSide = Math.max(srcW, srcH);
      const scale = targetSize / maxSide;
      icon.setScale(scale);
      icon.setVisible(true);
      return icon.displayWidth;
    };

    const goldIconW = fitIcon(this.goldUiIcon, goldIconTarget);
    const expIconW = fitIcon(this.expUiIcon, expIconTarget);
    const yapaIconW = fitIcon(this.yapaUiIcon, yapaIconTarget);
    const permWishIconW = fitIcon(this.permWishIcon, wishIconTarget);
    const limitedWishIconW = fitIcon(this.limitedWishIcon, wishIconTarget);

    const getExtraWidth = (el) => {
      if (el === this.goldText && goldIconW > 0) return goldIconW + iconGap;
      if (el === this.yapaText && yapaIconW > 0) return yapaIconW + iconGap;
      if (el === this.permWishText && permWishIconW > 0) return permWishIconW + iconGap;
      if (el === this.limitedWishText && limitedWishIconW > 0) return limitedWishIconW + iconGap;
      return 0;
    };

    const getBlockWidth = (el) => getUIWidth(el) + getExtraWidth(el);

    const placeIconForText = (icon, text) => {
      if (!icon || !text) return;
      const left = text.x - (getUIWidth(text) * 0.5);
      const topY = text.y - (getUIHeight(text) * 0.5);
      icon.x = left - iconGap - (icon.displayWidth * 0.5);
      icon.y = topY + (getUIHeight(text) * 0.5);
    };

    apply(this.goldText);
    apply(this.yapaText);
    apply(this.permWishText);
    apply(this.limitedWishText);
    applyTracking(this.goldText, hudTracking);
    applyTracking(this.yapaText, hudTracking);
    applyTracking(this.permWishText, hudTracking);
    applyTracking(this.limitedWishText, hudTracking);
    if (this.expText?.setFontSize) this.expText.setFontSize(isTiny ? 26 : 30);
    applyTracking(this.expText, expTracking);
    if (this.hudClockGhostText?.setFontSize) this.hudClockGhostText.setFontSize(isTiny ? 24 : 28);
    if (this.hudClockText?.setFontSize) this.hudClockText.setFontSize(isTiny ? 24 : 28);
    if (this.hudClockMetaText?.setFontSize) this.hudClockMetaText.setFontSize(isTiny ? 11 : 12);
    applyTracking(this.hudClockGhostText, isTiny ? 1.5 : 2);
    applyTracking(this.hudClockText, isTiny ? 1.5 : 2);
    applyTracking(this.hudClockMetaText, 0.6);

    // Reserva exacta para: Oro 6 digitos, Deseos (texto + 3 digitos).
    // Ancho fijo por slot: no cambia aunque cambie el numero.
    const goldSlotW = isTiny ? 190 : 240;
    const yapaSlotW = isTiny ? 156 : 196;
    const permSlotW = isTiny ? 140 : 172;
    const limSlotW = isTiny ? 140 : 172;
    const clockSlotW = isTiny ? 230 : 272;
    applyFixedWidth(this.goldText, goldSlotW);
    applyFixedWidth(this.yapaText, yapaSlotW);
    applyFixedWidth(this.permWishText, permSlotW);
    applyFixedWidth(this.limitedWishText, limSlotW);
    applyFixedWidth(this.hudClockGhostText, clockSlotW);
    applyFixedWidth(this.hudClockText, clockSlotW);
    applyFixedWidth(this.hudClockMetaText, clockSlotW);

    if (this.gachaBtnIsImage) {
      this.gachaBtnBaseScale = gachaTargetH / this.gachaBtn.height;
      const hoverMul = this.gachaBtnHovering ? 1.03 : 1;
      this.gachaBtn.setScale(this.gachaBtnBaseScale * hoverMul);
      if (this.gachaBtnGlow) {
        this.gachaBtnGlow.setScale(this.gachaBtnBaseScale * 1.08);
        if (!this.gachaBtnHovering) this.gachaBtnGlow.setAlpha(0);
      }
    } else {
      apply(this.gachaBtn, fontSize, padX + 2, padY);
    }
    apply(this.adminLabel, isTiny ? 12 : 14, 0, 0);
    apply(this.devPermBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devLimitedBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devGoldBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devExpBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devMaxLevelBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devSpendYapaBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devYaparYapaBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devSpawnQrBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);
    apply(this.devGhostNpcLabBtn, smallFont, isTiny ? 9 : 12, isTiny ? 6 : 7);

    this.expBarWidth = isTiny ? 220 : 300;
    this.expBarHeight = slotH;
    this.expBarBorder = 3;
    this.expBarRadius = Math.round(this.expBarHeight * 0.5);
    if (this.expStarLevelText?.setFontSize) {
      const starDigits = String(Math.max(0, this.level)).length;
      const starFont = isTiny
        ? (starDigits >= 3 ? 24 : 28)
        : (starDigits >= 3 ? 28 : 32);
      this.expStarLevelText.setFontSize(starFont);
    }

    let x = right;
    this.gachaBtn.y = top;
    this.gachaBtn.x = x;
    x -= (getUIWidth(this.gachaBtn) + gap);

    const infoH = Math.max(
      getUIHeight(this.goldText),
      getUIHeight(this.yapaText),
      getUIHeight(this.permWishText),
      getUIHeight(this.limitedWishText)
    );
    const expVisualH = Math.max(this.expBarHeight, this.expUiIcon ? getUIHeight(this.expUiIcon) : 0);
    const rowH = Math.max(infoH, expVisualH);
    const barY = top + Math.max(0, Math.round((rowH - this.expBarHeight) / 2));
    const topRowY = top + Math.round(rowH * 0.5);
    const topRow = [this.limitedWishText, this.permWishText, this.yapaText, this.goldText];
    topRow.forEach((el) => {
      el.y = topRowY;
      el.x = x - (getUIWidth(el) * 0.5);
      x -= (getBlockWidth(el) + gap);
    });
    this.drawHudValueSlot(this.goldSlotBg, this.goldText, 0, goldSlotW, slotH);
    this.drawHudValueSlot(this.yapaSlotBg, this.yapaText, 0, yapaSlotW, slotH);
    this.drawHudValueSlot(this.permSlotBg, this.permWishText, 0, permSlotW, slotH);
    this.drawHudValueSlot(this.limitedSlotBg, this.limitedWishText, 0, limSlotW, slotH);

    const starToBarGap = isTiny ? 12 : 16;
    const clockGap = isTiny ? 12 : 16;
    // Bloque EXP reservado completo: estrella izquierda + barra.
    const expCoreW = this.expBarWidth + (this.expUiIcon ? (expIconW + starToBarGap) : 0);
    const expBlockW = clockSlotW + clockGap + expCoreW;
    x -= expBlockW;
    const expCoreLeft = x + clockSlotW + clockGap;
    const barLeft = expCoreLeft + (this.expUiIcon ? (expIconW + starToBarGap) : 0);
    const clockCenterX = x + (clockSlotW * 0.5);
    const clockTextNudgeX = isTiny ? 8 : 10;
    const clockTextCenterX = clockCenterX + clockTextNudgeX;
    const clockMainY = topRowY - Math.round(slotH * 0.13);
    const clockMetaY = topRowY + Math.round(slotH * 0.25);
    const clockPanelW = clockSlotW - (isTiny ? 12 : 16);
    const clockPanelH = slotH + (isTiny ? 2 : 4);
    this.drawHudClockPanel(clockCenterX, topRowY, clockPanelW, clockPanelH);
    if (this.hudClockGhostText) {
      this.hudClockGhostText.x = clockTextCenterX;
      this.hudClockGhostText.y = clockMainY;
    }
    this.hudClockText.x = clockTextCenterX;
    this.hudClockText.y = clockMainY;
    this.hudClockMetaText.x = clockTextCenterX;
    this.hudClockMetaText.y = clockMetaY;

    // Snap a pixel entero para evitar artefactos en bordes del frame.
    this.expBarX = Math.round(barLeft);
    this.expBarY = Math.round(barY);
    this.updateExpBarMask();
    this.drawExpBarBackground();
    this.drawExpBarFrame();
    const ratio = (this.level >= MAX_LEVEL) ? 1 : ((this.expToNext <= 0) ? 0 : (this.exp / this.expToNext));
    this.setExpBarRatio(ratio);

    this.expText.x = barLeft + (this.expBarWidth * 0.5);
    this.expText.y = barY + (this.expBarHeight * 0.5);
    if (this.expUiIcon) {
      this.expUiIcon.x = expCoreLeft + (expIconW * 0.5);
      this.expUiIcon.y = this.expText.y;
      this.expUiIcon.setVisible(true);
      if (this.expStarLevelText) {
        this.expStarLevelText.x = this.expUiIcon.x;
        this.expStarLevelText.y = this.expUiIcon.y;
        this.expStarLevelText.setVisible(true);
      }
    } else if (this.expStarLevelText) {
      this.expStarLevelText.setVisible(false);
    }
    this.levelText.y = topRowY;
    this.levelText.x = x;

    placeIconForText(this.goldUiIcon, this.goldText);
    placeIconForText(this.yapaUiIcon, this.yapaText);
    placeIconForText(this.permWishIcon, this.permWishText);
    placeIconForText(this.limitedWishIcon, this.limitedWishText);
    syncGachaGlowPos();

    const panelPad = isTiny ? 8 : 10;
    const btnGap = isTiny ? 6 : 8;
    const panelW = Math.max(
      getUIWidth(this.adminLabel),
      getUIWidth(this.devPermBtn),
      getUIWidth(this.devLimitedBtn),
      getUIWidth(this.devGoldBtn),
      getUIWidth(this.devExpBtn),
      getUIWidth(this.devMaxLevelBtn),
      getUIWidth(this.devSpendYapaBtn),
      getUIWidth(this.devYaparYapaBtn),
      getUIWidth(this.devSpawnQrBtn),
      getUIWidth(this.devGhostNpcLabBtn)
    ) + (panelPad * 2);
    const panelH = panelPad
      + getUIHeight(this.adminLabel)
      + btnGap
      + getUIHeight(this.devPermBtn)
      + btnGap
      + getUIHeight(this.devLimitedBtn)
      + btnGap
      + getUIHeight(this.devGoldBtn)
      + btnGap
      + getUIHeight(this.devExpBtn)
      + btnGap
      + getUIHeight(this.devMaxLevelBtn)
      + btnGap
      + getUIHeight(this.devSpendYapaBtn)
      + btnGap
      + getUIHeight(this.devYaparYapaBtn)
      + btnGap
      + getUIHeight(this.devSpawnQrBtn)
      + btnGap
      + getUIHeight(this.devGhostNpcLabBtn)
      + panelPad;

    const adminX = right - panelW;
    // Justo arriba de los botones DOM: Inventario/Admin.
    const reserveBottom = isTiny ? 116 : 124;
    const adminY = Math.max(top + infoH + 12, h - panelH - reserveBottom);
    const contentX = adminX + panelPad;

    this.adminLabel.x = contentX;
    this.adminLabel.y = adminY + panelPad;

    this.devPermBtn.x = contentX;
    this.devPermBtn.y = this.adminLabel.y + getUIHeight(this.adminLabel) + btnGap;

    this.devLimitedBtn.x = contentX;
    this.devLimitedBtn.y = this.devPermBtn.y + getUIHeight(this.devPermBtn) + btnGap;

    this.devGoldBtn.x = contentX;
    this.devGoldBtn.y = this.devLimitedBtn.y + getUIHeight(this.devLimitedBtn) + btnGap;

    this.devExpBtn.x = contentX;
    this.devExpBtn.y = this.devGoldBtn.y + getUIHeight(this.devGoldBtn) + btnGap;

    this.devMaxLevelBtn.x = contentX;
    this.devMaxLevelBtn.y = this.devExpBtn.y + getUIHeight(this.devExpBtn) + btnGap;

    this.devSpendYapaBtn.x = contentX;
    this.devSpendYapaBtn.y = this.devMaxLevelBtn.y + getUIHeight(this.devMaxLevelBtn) + btnGap;

    this.devYaparYapaBtn.x = contentX;
    this.devYaparYapaBtn.y = this.devSpendYapaBtn.y + getUIHeight(this.devSpendYapaBtn) + btnGap;

    this.devSpawnQrBtn.x = contentX;
    this.devSpawnQrBtn.y = this.devYaparYapaBtn.y + getUIHeight(this.devYaparYapaBtn) + btnGap;

    this.devGhostNpcLabBtn.x = contentX;
    this.devGhostNpcLabBtn.y = this.devSpawnQrBtn.y + getUIHeight(this.devSpawnQrBtn) + btnGap;

    this.adminPanelBg.x = adminX;
    this.adminPanelBg.y = adminY;
    this.adminPanelBg.width = panelW;
    this.adminPanelBg.height = panelH;

    this.positionYapaRail();
  }

  drawHudFrameOnGraphics(gfx, x, y, w, h, radius, border = 2) {
    if (!gfx) return;
    const outerStroke = border + 2;
    const inset = outerStroke * 0.5;
    const alignHalf = (v) => Math.round(v * 2) / 2;
    const frameX = alignHalf(x + inset);
    const frameY = alignHalf(y + inset);
    const frameW = alignHalf(Math.max(0, w - outerStroke));
    const frameH = alignHalf(Math.max(0, h - outerStroke));
    const frameR = Math.max(1, alignHalf(radius - inset));
    if (frameW <= 0 || frameH <= 0) return;

    // mismo marco para EXP y contadores (estilo original)
    gfx.lineStyle(outerStroke, 0x4d3f23, 0.65);
    gfx.strokeRoundedRect(frameX, frameY, frameW, frameH, frameR);
    gfx.lineStyle(border, 0xf6eed8, 1);
    gfx.strokeRoundedRect(frameX, frameY, frameW, frameH, frameR);
  }

  drawHudValueSlot(gfx, textObj, leftExtra = 0, forcedWidth = 0, forcedHeight = 0) {
    if (!gfx) return;
    if (!textObj) {
      gfx.clear();
      return;
    }

    const extra = Math.max(0, Math.round(leftExtra || 0));
    const baseW = Math.max(30, Math.round(forcedWidth || textObj.displayWidth || textObj.width || 0));
    const w = baseW + extra;
    const h = Math.max(20, Math.round(forcedHeight || textObj.displayHeight || textObj.height || 0));
    const ox = Number(textObj.originX ?? 0);
    const x = Math.round((textObj.x ?? 0) - (baseW * ox) - extra);
    const oy = Number(textObj.originY ?? 0);
    const y = Math.round((textObj.y ?? 0) - (h * oy));
    const r = Math.max(9, Math.round(h * 0.52));

    gfx.clear();
    // fondo claro limpio (sin sombras extras que rompen el borde)
    gfx.fillStyle(0xf8f6ec, 1);
    gfx.fillRoundedRect(x, y, w, h, r);
    this.drawHudFrameOnGraphics(gfx, x, y, w, h, r, 2);
  }

  drawHudClockPanel(centerX, centerY, width, height) {
    const gfx = this.hudClockPanel;
    if (!gfx) return;
    const w = Math.max(120, Math.round(Number(width) || 0));
    const h = Math.max(44, Math.round(Number(height) || 0));
    const x = Math.round((Number(centerX) || 0) - (w * 0.5));
    const y = Math.round((Number(centerY) || 0) - (h * 0.5));
    const rOuter = Math.max(8, Math.round(h * 0.22));

    gfx.clear();

    // Marco externo
    gfx.fillStyle(0x222733, 0.96);
    gfx.fillRoundedRect(x, y, w, h, rOuter);
    gfx.lineStyle(2, 0x9aa3b2, 0.85);
    gfx.strokeRoundedRect(x + 1, y + 1, w - 2, h - 2, Math.max(6, rOuter - 1));
    gfx.lineStyle(1, 0x313847, 0.95);
    gfx.strokeRoundedRect(x + 3, y + 3, w - 6, h - 6, Math.max(6, rOuter - 2));

    // Display LED interno
    const inset = Math.max(6, Math.round(h * 0.12));
    const ix = x + inset;
    const iy = y + inset;
    const iw = Math.max(24, w - (inset * 2));
    const ih = Math.max(18, h - (inset * 2));
    const rInner = Math.max(5, Math.round(ih * 0.2));

    gfx.fillStyle(0x06080c, 0.98);
    gfx.fillRoundedRect(ix, iy, iw, ih, rInner);
    gfx.lineStyle(1, 0x1b2330, 0.95);
    gfx.strokeRoundedRect(ix + 0.5, iy + 0.5, iw - 1, ih - 1, Math.max(4, rInner - 1));

    // Reflejo superior suave
    const glossH = Math.max(2, Math.round(ih * 0.18));
    gfx.fillStyle(0xffffff, 0.07);
    gfx.fillRoundedRect(ix + 2, iy + 2, Math.max(0, iw - 4), glossH, Math.max(3, rInner - 2));

    // Scanlines sutiles para look digital
    gfx.lineStyle(1, 0x101723, 0.22);
    for (let yy = iy + 3; yy < (iy + ih - 2); yy += 4) {
      gfx.lineBetween(ix + 2, yy, ix + iw - 2, yy);
    }
  }

  updateExpBarMask() {
    if (!this.expBarMaskShape) return;
    const x = Math.round(this.expBarX || 0);
    const y = Math.round(this.expBarY || 0);
    const w = Math.max(0, Math.round(this.expBarWidth || 0));
    const h = Math.max(0, Math.round(this.expBarHeight || 0));
    const r = Math.max(1, Math.round(this.expBarRadius || Math.round(h * 0.5)));
    const inset = Math.max(2, Math.round((this.expBarBorder || 2) + 1));
    const mx = x + inset;
    const my = y + inset;
    const mw = Math.max(0, w - (inset * 2));
    const mh = Math.max(0, h - (inset * 2));
    const mr = Math.max(2, r - inset);
    this.expBarMaskShape.clear();
    this.expBarMaskShape.fillStyle(0xffffff, 1);
    this.expBarMaskShape.fillRoundedRect(mx, my, mw, mh, mr);
  }

  drawExpBarBackground() {
    if (!this.expBarBg) return;
    const x = Math.round(this.expBarX || 0);
    const y = Math.round(this.expBarY || 0);
    const w = Math.max(0, Math.round(this.expBarWidth || 0));
    const h = Math.max(0, Math.round(this.expBarHeight || 0));
    const r = Math.max(1, Math.round(this.expBarRadius || Math.round(h * 0.5)));
    this.expBarBg.clear();
    // Track dorado/marron (como antes)
    this.expBarBg.fillStyle(0x7d6a42, 1);
    this.expBarBg.fillRoundedRect(x, y, w, h, r);
    // Sombra interior superior para profundidad
    this.expBarBg.fillStyle(0x4d3f23, 0.32);
    this.expBarBg.fillRoundedRect(
      x + 2,
      y + 2,
      Math.max(0, w - 4),
      Math.max(2, Math.floor(h * 0.28)),
      Math.max(2, r - 2)
    );
  }

  drawExpBarFrame() {
    if (!this.expBarFrame) return;
    const x = Math.round(this.expBarX || 0);
    const y = Math.round(this.expBarY || 0);
    const w = Math.max(0, Math.round(this.expBarWidth || 0));
    const h = Math.max(0, Math.round(this.expBarHeight || 0));
    const border = Math.max(1, Math.round(this.expBarBorder || 2));
    const radius = Math.max(3, Math.round(this.expBarRadius || Math.max(3, Math.round(h * 0.5))));

    this.expBarFrame.clear();
    this.drawHudFrameOnGraphics(this.expBarFrame, x, y, w, h, radius, border);
  }

  setExpBarRatio(value) {
    if (!this.expBarFill) return;
    const clamped = Phaser.Math.Clamp(value, 0, 1);
    const h = Math.max(1, Math.round(this.expBarHeight || 8));
    const border = Math.max(1, Math.round(this.expBarBorder || 2));
    const x = Math.round(this.expBarX || 0);
    const y = Math.round(this.expBarY || 0);
    const inset = border + 1;
    const innerW = Math.max(0, (this.expBarWidth || 0) - (inset * 2));
    const innerH = Math.max(1, h - (inset * 2));
    const fillW = Math.max(0, Math.floor(innerW * clamped));
    const fullW = Math.max(0, Math.floor(innerW));
    const isFull = fillW >= Math.max(1, fullW - 1);
    const bodyX = x + inset;
    const bodyY = y + inset;
    const capR = Math.max(2, Math.floor(innerH * 0.5));
    const glossyMinW = Math.max(10, Math.round(innerH * 1.35));

    this.expBarFill.clear();
    if (fillW > 0) {
      // Base gris
      this.expBarFill.fillStyle(0x9ca5b0, 1);
      if (isFull) {
        // Solo llena completo termina redondo.
        this.expBarFill.fillRoundedRect(bodyX, bodyY, innerW, innerH, capR);
      } else {
        // Parcial: punta derecha recta.
        if (fillW <= capR + 1) {
          this.expBarFill.fillRect(bodyX, bodyY, fillW, innerH);
        } else {
          // Izquierda redondeada + cuerpo recto.
          this.expBarFill.fillCircle(bodyX + capR, bodyY + capR, capR);
          this.expBarFill.fillRect(bodyX + capR, bodyY, fillW - capR, innerH);
        }
      }

      // Reflejo superior
      this.expBarFill.fillStyle(0xeff3f7, 0.7);
      if (isFull) {
        this.expBarFill.fillRoundedRect(
          bodyX + 1,
          bodyY + 1,
          Math.max(0, innerW - 2),
          Math.max(2, Math.floor(innerH * 0.5)),
          Math.max(2, capR - 1)
        );
      } else {
        this.expBarFill.fillRect(
          bodyX + 1,
          bodyY + 1,
          Math.max(0, fillW - 2),
          Math.max(2, Math.floor(innerH * 0.42))
        );
      }

      // Sombra inferior
      this.expBarFill.fillStyle(0x66707e, 0.28);
      if (isFull) {
        this.expBarFill.fillRoundedRect(
          bodyX + 1,
          bodyY + Math.max(1, Math.floor(innerH * 0.5)),
          Math.max(0, innerW - 2),
          Math.max(1, Math.floor(innerH * 0.45)),
          Math.max(2, capR - 1)
        );
      } else {
        this.expBarFill.fillRect(
          bodyX + 1,
          bodyY + Math.max(1, Math.floor(innerH * 0.5)),
          Math.max(0, fillW - 2),
          Math.max(1, Math.floor(innerH * 0.45))
        );
      }
    }

    if (this.expBarGloss) {
      this.expBarGloss.clear();
      if (fillW >= glossyMinW) {
        this.expBarGloss.fillStyle(0xffffff, 0.1);
        if (isFull) {
          this.expBarGloss.fillRoundedRect(
            bodyX + 2,
            bodyY + 2,
            Math.max(0, innerW - 4),
            Math.max(1, Math.floor(innerH * 0.2)),
            Math.max(2, capR - 2)
          );
        } else {
          this.expBarGloss.fillRect(
            bodyX + 2,
            bodyY + 2,
            Math.max(0, fillW - 4),
            Math.max(1, Math.floor(innerH * 0.2))
          );
        }
      }
    }
  }

  getHudGameClockSnapshot() {
    const cycleState = this.scene?.dayCycleState || null;
    let progress = Number(cycleState?.progress);
    if (Number.isFinite(progress) && String(cycleState?.mode || "auto") !== "manual") {
      const duration = Math.max(1000, Number(cycleState?.durationMs) || 1440000);
      const speed = Math.max(0, Number(cycleState?.speed) || 1);
      const lastWall = Math.max(0, Number(cycleState?.lastWallClockMs) || 0);
      if (lastWall > 0 && speed > 0) {
        const elapsed = Math.max(0, Date.now() - lastWall);
        progress = (progress + ((elapsed * speed) / duration)) % 1;
      }
    }
    if (!Number.isFinite(progress)) {
      const now = new Date();
      const h = now.getHours() + (now.getMinutes() / 60) + (now.getSeconds() / 3600);
      progress = (((h - HUD_GAME_CLOCK_OFFSET_HOUR) / 24) % 1 + 1) % 1;
    }
    const p = ((progress % 1) + 1) % 1;
    const daySecondsFloat = (((p * 86400) + (HUD_GAME_CLOCK_OFFSET_HOUR * 3600)) % 86400 + 86400) % 86400;
    const totalSeconds = Math.floor(daySecondsFloat);
    const hour24 = Math.floor(totalSeconds / 3600) % 24;
    const minute = Math.floor((totalSeconds % 3600) / 60);
    const second = totalSeconds % 60;
    return {
      progress: p,
      hour24,
      minute,
      second,
      mainLabel: `${String((hour24 % 12) || 12).padStart(2, "0")}:${String(minute).padStart(2, "0")} ${hour24 >= 12 ? "P.M" : "A.M"}`
    };
  }

  getPeruSeasonByMonth(month1to12 = 1) {
    const m = Math.max(1, Math.min(12, Math.round(Number(month1to12) || 1)));
    return LIMA_SEASON_BY_MONTH[m] || "Otono";
  }

  getLimaDateParts(now = new Date()) {
    const parsed = now instanceof Date ? now : new Date(now);
    const safeNow = Number.isFinite(parsed.getTime()) ? parsed : new Date();
    const fallback = {
      year: safeNow.getUTCFullYear(),
      month: safeNow.getUTCMonth() + 1,
      day: safeNow.getUTCDate(),
      hour24: safeNow.getUTCHours()
    };
    try {
      const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: LIMA_TIMEZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        hourCycle: "h23"
      }).formatToParts(safeNow);
      const readPart = (type, fallbackValue) => {
        const value = Number(parts.find((p) => p.type === type)?.value);
        return Number.isFinite(value) ? value : fallbackValue;
      };
      return {
        year: readPart("year", fallback.year),
        month: readPart("month", fallback.month),
        day: readPart("day", fallback.day),
        hour24: readPart("hour", fallback.hour24)
      };
    } catch (_) {
      return fallback;
    }
  }

  getWeekdayShortByIndex(weekday = 1) {
    const labels = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const idx = ((Math.floor(Number(weekday) || 0) % 7) + 7) % 7;
    return labels[idx] || "Lu";
  }

  getLimaWeekdayIndex(now = new Date()) {
    const { year, month, day } = this.getLimaDateParts(now);
    const yy = Math.max(1970, Math.floor(Number(year) || new Date().getUTCFullYear()));
    const mm = Math.max(1, Math.min(12, Math.floor(Number(month) || 1)));
    const dd = Math.max(1, Math.min(31, Math.floor(Number(day) || 1)));
    return new Date(Date.UTC(yy, mm - 1, dd)).getUTCDay();
  }

  getLimaWeekdayShort(now = new Date()) {
    return this.getWeekdayShortByIndex(this.getLimaWeekdayIndex(now));
  }

  getHudGameWeekdayShort(clock = null) {
    const rawProgress = Number(clock?.progress);
    const progress = Number.isFinite(rawProgress) ? (((rawProgress % 1) + 1) % 1) : 0;
    const h = Number(clock?.hour24);
    const m = Number(clock?.minute);
    const s = Number(clock?.second);
    const secondOfDay = (
      Number.isFinite(h) && Number.isFinite(m) && Number.isFinite(s)
    )
      ? (((Math.floor(h) * 3600) + (Math.floor(m) * 60) + Math.floor(s)) % 86400 + 86400) % 86400
      : Number.NaN;

    if (!Number.isFinite(this.hudGameWeekdayBaseIndex)) {
      this.hudGameWeekdayBaseIndex = this.getLimaWeekdayIndex(new Date());
      this.hudGameWeekdayOffset = 0;
      this.hudGameWeekdayLastProgress = progress;
      this.hudGameWeekdayLastSecondOfDay = secondOfDay;
    } else {
      let dayAdvance = 0;
      const prevSecond = Number(this.hudGameWeekdayLastSecondOfDay);
      if (Number.isFinite(prevSecond) && Number.isFinite(secondOfDay)) {
        // El dia avanza solo en cruce real de medianoche.
        // Ignora retrocesos cortos por ajustes visuales/tweens del ciclo.
        const backwardDelta = prevSecond - secondOfDay;
        if (secondOfDay < prevSecond && backwardDelta > (12 * 3600)) {
          dayAdvance = 1;
        }
      } else {
        // Fallback defensivo si no hay reloj valido.
        const prev = Number(this.hudGameWeekdayLastProgress);
        if (Number.isFinite(prev)) {
          const wrappedForward = prev > progress && (prev - progress) > 0.5;
          if (wrappedForward) dayAdvance = 1;
        }
      }

      if (dayAdvance > 0) {
        this.hudGameWeekdayOffset = Math.floor(Number(this.hudGameWeekdayOffset) || 0) + dayAdvance;
      }
      this.hudGameWeekdayLastProgress = progress;
      this.hudGameWeekdayLastSecondOfDay = secondOfDay;
    }
    const idx = ((Math.floor(Number(this.hudGameWeekdayBaseIndex) || 0) + Math.floor(Number(this.hudGameWeekdayOffset) || 0)) % 7 + 7) % 7;
    return this.getWeekdayShortByIndex(idx);
  }

  getPeruSeasonByDate(now = new Date()) {
    const { month, day } = this.getLimaDateParts(now);
    const mmdd = (month * 100) + day;
    // Rangos de Lima con fecha de inicio inclusiva y fecha de fin exclusiva:
    // Verano [21 Dic, 20 Mar), Otono [20 Mar, 20 Jun), Invierno [20 Jun, 22 Sep), Primavera [22 Sep, 21 Dic)
    if (mmdd >= 1221 || mmdd < 320) return "Verano";
    if (mmdd < 620) return "Otono";
    if (mmdd < 922) return "Invierno";
    return "Primavera";
  }

  isRainWeatherLabel(label = "") {
    const wx = String(label || "").toLowerCase();
    return wx.includes("lluvia") || wx.includes("llovizna") || wx.includes("garua") || wx.includes("gar\u00FAa");
  }

  seededRand01(seed = 1) {
    const x = Math.sin(Number(seed) * 12.9898) * 43758.5453123;
    return x - Math.floor(x);
  }

  hashHudSeed(text = "") {
    let hash = 2166136261;
    const str = String(text || "");
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  pickWeightedWeather(pool = [], seed = 1) {
    if (!Array.isArray(pool) || !pool.length) return "Clima variable";
    const total = pool.reduce((sum, row) => sum + Math.max(1, Number(row?.w) || 1), 0);
    let ticket = this.seededRand01(seed) * total;
    for (const row of pool) {
      const w = Math.max(1, Number(row?.w) || 1);
      ticket -= w;
      if (ticket <= 0) return String(row?.label || "Clima variable");
    }
    return String(pool[pool.length - 1]?.label || "Clima variable");
  }

  getRandomLimaWeatherLabel(season = "Otono", seed = Date.now()) {
    const pool = LIMA_WEATHER_POOLS[season] || [];
    return this.pickWeightedWeather(pool, Number(seed) + 17);
  }

  getLimaSeasonAnomalyPool(season = "") {
    const s = String(season || "");
    if (s === "Invierno") return [...LIMA_WEATHER_ANOMALIES];
    return LIMA_WEATHER_ANOMALIES.filter((row) => String(row || "").toLowerCase() !== "neblina intensa");
  }

  getRandomLimaWeatherEvent(seed = Date.now(), season = "") {
    const pool = this.getLimaSeasonAnomalyPool(season);
    if (!pool.length) return "Evento: Clima inestable";
    const safeLen = Math.max(1, pool.length);
    const idx = Math.floor(this.seededRand01(Number(seed) + 311) * safeLen) % safeLen;
    return `Evento: ${pool[idx] || "Clima inestable"}`;
  }

  setLimaWeatherDebugMode(mode = "auto", options = null) {
    const now = new Date();
    const season = this.getPeruSeasonByDate(now);
    const seed = Date.now() + Math.floor(Math.random() * 1000000);
    const opt = options && typeof options === "object" ? options : {};
    const pickSeason = (v) => {
      const raw = String(v || season);
      if (raw === "Verano" || raw === "Otono" || raw === "Invierno" || raw === "Primavera") return raw;
      return season;
    };

    if (mode === "auto") {
      this.weatherDebugOverride = null;
    } else if (mode === "event_cycle") {
      this.weatherDebugOverride = { kind: "event_cycle" };
    } else if (mode === "season_locked") {
      this.weatherDebugOverride = { kind: "season_locked", season: pickSeason(opt.season) };
    } else if (mode === "random_weather") {
      this.weatherDebugOverride = {
        kind: "pinned",
        season,
        weather: this.getRandomLimaWeatherLabel(season, seed)
      };
    } else if (mode === "random_event") {
      this.weatherDebugOverride = {
        kind: "pinned",
        season,
        weather: this.getRandomLimaWeatherEvent(seed, season)
      };
    } else if (mode === "set_weather") {
      const fixedSeason = pickSeason(opt.season);
      const fixedWeather = String(opt.weather || "").trim();
      this.weatherDebugOverride = {
        kind: "pinned",
        season: fixedSeason,
        weather: fixedWeather || this.getRandomLimaWeatherLabel(fixedSeason, seed)
      };
    } else if (mode === "set_event") {
      const fixedSeason = pickSeason(opt.season);
      const ev = String(opt.eventLabel || "").trim();
      const eventLabel = ev ? `Evento: ${ev}` : this.getRandomLimaWeatherEvent(seed, fixedSeason);
      this.weatherDebugOverride = {
        kind: "pinned",
        season: fixedSeason,
        weather: eventLabel
      };
    }

    this.hudClockLastMeta = "";
    this.refreshHudClockInfo(true);
    return this.getLimaWeatherSnapshot(now);
  }

  getLimaWeatherSnapshot(now = new Date()) {
    const parsed = now instanceof Date ? now : new Date(now);
    const safeNow = Number.isFinite(parsed.getTime()) ? parsed : new Date();
    const { month, day, year, hour24 } = this.getLimaDateParts(safeNow);
    const season = this.getPeruSeasonByDate(safeNow);
    const slot = Math.floor(hour24 / 3);
    const seedBase = this.hashHudSeed(`${year}-${month}-${day}-${slot}-${season}`);
    const anomalyRoll = this.seededRand01(seedBase + 97);
    const anomalyChance = season === "Invierno" ? 0.17 : 0.11;
    let weather = this.pickWeightedWeather(LIMA_WEATHER_POOLS[season] || [], seedBase + 11);
    const anomalyPool = this.getLimaSeasonAnomalyPool(season);
    if (anomalyRoll < anomalyChance && anomalyPool.length) {
      const idx = Math.floor(this.seededRand01(seedBase + 311) * anomalyPool.length) % Math.max(1, anomalyPool.length);
      weather = `Evento: ${anomalyPool[idx] || "Clima inestable"}`;
    }
    if (season === "Verano" && this.isRainWeatherLabel(weather)) {
      const allowSummerRain = this.seededRand01(seedBase + 701) < 0.02;
      if (!allowSummerRain) {
        const veranoPool = Array.isArray(LIMA_WEATHER_POOLS.Verano) ? LIMA_WEATHER_POOLS.Verano : [];
        const dryPool = veranoPool.filter((row) => !this.isRainWeatherLabel(row?.label));
        weather = this.pickWeightedWeather(dryPool.length ? dryPool : veranoPool, seedBase + 727);
        if (this.isRainWeatherLabel(weather)) weather = "Soleado";
      }
    }

    const dateLabel = safeNow
      .toLocaleDateString("es-PE", { day: "2-digit", month: "short", timeZone: LIMA_TIMEZONE })
      .replace(/\./g, "")
      .replace(/\s+/g, " ")
      .trim();

    const dbg = this.weatherDebugOverride;
    if (dbg?.kind === "event_cycle") {
      const eventSeed = this.hashHudSeed(`dbg-event-${year}-${month}-${day}-${slot}`);
      const forcedEvent = this.getRandomLimaWeatherEvent(eventSeed, season);
      return {
        season,
        weather: forcedEvent,
        metaLabel: `${dateLabel} | ${season} | ${forcedEvent} | DBG`
      };
    }
    if (dbg?.kind === "season_locked") {
      const forcedSeason = String(dbg?.season || season);
      const forcedSeed = this.hashHudSeed(`dbg-season-${year}-${month}-${day}-${slot}-${forcedSeason}`);
      const forcedWeather = this.pickWeightedWeather(LIMA_WEATHER_POOLS[forcedSeason] || [], forcedSeed + 29);
      return {
        season: forcedSeason,
        weather: forcedWeather,
        metaLabel: `${dateLabel} | ${forcedSeason} | ${forcedWeather} | DBG`
      };
    }
    if (dbg?.kind === "pinned" && typeof dbg.weather === "string" && dbg.weather.trim()) {
      const forcedSeason = String(dbg.season || season);
      const forcedWeather = String(dbg.weather || "Clima variable");
      return {
        season: forcedSeason,
        weather: forcedWeather,
        metaLabel: `${dateLabel} | ${forcedSeason} | ${forcedWeather} | DBG`
      };
    }

    return {
      season,
      weather,
      metaLabel: `${dateLabel} | ${season} | ${weather}`
    };
  }

  getLimaTemperatureSnapshot(now = new Date(), clock = null, weatherSnap = null) {
    const w = weatherSnap || this.getLimaWeatherSnapshot(now);
    const season = String(w?.season || "Otono");
    const wx = String(w?.weather || "").toLowerCase();
    const c = clock || this.getHudGameClockSnapshot();

    const thermal = {
      Verano: { min: 25, max: 34, normalMin: 25, normalMax: 30, amp: 1.3 },
      Otono: { min: 20, max: 24, normalMin: 20, normalMax: 24, amp: 0.9 },
      Invierno: { min: 13, max: 19, normalMin: 15, normalMax: 19, amp: 1.1 },
      Primavera: { min: 16, max: 22, normalMin: 16, normalMax: 22, amp: 0.9 }
    }[season] || { min: 17, max: 24, normalMin: 17, normalMax: 24, amp: 1.0 };

    const seed = this.hashHudSeed(`${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${season}`);
    const dayBase = thermal.normalMin
      + (this.seededRand01(seed + 79) * (thermal.normalMax - thermal.normalMin));

    const hour24 = Number(c?.hour24) || 0;
    const minute = Number(c?.minute) || 0;
    const second = Number(c?.second) || 0;
    const hFloat = hour24 + (minute / 60) + (second / 3600);
    // Pico de calor aprox 14:00 y minimo aprox 02:00
    const dayWave = Math.cos(((hFloat - 14) / 24) * (Math.PI * 2));
    const phaseDelta = dayWave * thermal.amp;

    let weatherDelta = 0;
    if (wx.includes("calor") || wx.includes("bochorno")) weatherDelta += 1.0;
    if (wx.includes("frio") || wx.includes("niebla") || wx.includes("garua")) weatherDelta -= 0.9;
    if (wx.includes("nublado")) weatherDelta -= 0.5;
    if (wx.includes("soleado") || wx.includes("sol")) weatherDelta += 0.6;
    if (wx.includes("viento")) weatherDelta -= 0.3;
    if (wx.includes("evento:")) weatherDelta += (this.seededRand01(seed + hour24 + 303) - 0.5) * 1.6;

    let peakDelta = 0;
    if (season === "Verano" && hFloat >= 12.25 && hFloat <= 16.2) {
      peakDelta += 0.8 + (this.seededRand01(seed + 405) * 1.6); // 0.8..2.4
      if (wx.includes("bochorno") || wx.includes("calor") || wx.includes("soleado") || wx.includes("sol")) {
        peakDelta += 0.6;
      }
    }

    let maxCap = thermal.max;
    if (season === "Verano") {
      const intenseSummer = peakDelta > 1.6 || wx.includes("bochorno") || wx.includes("calor fuera de temporada");
      if (!intenseSummer) maxCap = Math.min(maxCap, 30.4);
    }

    const isBochorno = wx.includes("bochorno");
    const computedC = Math.max(thermal.min, Math.min(maxCap, dayBase + phaseDelta + weatherDelta + peakDelta));
    const finalC = isBochorno ? 34 : computedC;
    const rounded = Math.round(finalC * 10) / 10;
    const txt = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    return {
      rawCelsius: finalC,
      celsius: rounded,
      label: `${txt}°C`
    };
  }

  lerpTemperatureRgb(a, b, t = 0) {
    const tt = Phaser.Math.Clamp(Number(t) || 0, 0, 1);
    const rr = Math.round(Phaser.Math.Linear(a[0], b[0], tt));
    const gg = Math.round(Phaser.Math.Linear(a[1], b[1], tt));
    const bb = Math.round(Phaser.Math.Linear(a[2], b[2], tt));
    const hex = [rr, gg, bb].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, "0")).join("");
    return `#${hex}`;
  }

  getHudTemperatureColor(tempC = 22) {
    const t = Number.isFinite(Number(tempC)) ? Number(tempC) : 22;
    const coldMin = 13;
    const mid = 22;
    const hotMax = 34;
    const coldColor = [103, 232, 249];   // celeste
    const midColor = [203, 213, 225];    // gris claro
    const hotColor = [239, 68, 68];      // rojo

    if (t <= mid) {
      const k = Phaser.Math.Clamp((t - coldMin) / Math.max(0.001, (mid - coldMin)), 0, 1);
      return this.lerpTemperatureRgb(coldColor, midColor, k);
    }
    const k = Phaser.Math.Clamp((t - mid) / Math.max(0.001, (hotMax - mid)), 0, 1);
    return this.lerpTemperatureRgb(midColor, hotColor, k);
  }

  refreshHudClockInfo(requestLayout = true) {
    if (!this.hudClockText || !this.hudClockMetaText) return;
    const now = new Date();
    const clock = this.getHudGameClockSnapshot();
    const weather = this.getLimaWeatherSnapshot(now);
    const temperature = this.getLimaTemperatureSnapshot(now, clock, weather);
    const main = clock.mainLabel;
    const weekdayShort = this.getHudGameWeekdayShort(clock);
    const meta = `${temperature.label} - ${weekdayShort}`;
    const tempColor = this.getHudTemperatureColor(
      Number.isFinite(Number(temperature.rawCelsius)) ? Number(temperature.rawCelsius) : Number(temperature.celsius)
    );
    const changed = main !== this.hudClockLastMain || meta !== this.hudClockLastMeta;
    const colorChanged = tempColor !== this.hudClockLastMetaColor;
    if (!changed && !colorChanged) return;

    if (changed) {
      this.hudClockLastMain = main;
      this.hudClockLastMeta = meta;
      this.hudClockText.setText(main);
      this.hudClockMetaText.setText(meta);
    }
    if (colorChanged) {
      this.hudClockLastMetaColor = tempColor;
      this.hudClockMetaText.setColor(tempColor);
      this.hudClockMetaText.setShadow(0, 0, tempColor, 10, true, true);
    }
    if (requestLayout && changed) this.layoutHorizontal();
  }

  refreshUI() {
    this.goldText.setText(`${this.formatGoldHUD(this.gold)}`);
    this.yapaText.setText(this.yapaUiIcon ? `${this.formatYapaHUD(this.yapas)}` : `Yapa: ${this.formatYapaHUD(this.yapas)}`);
    this.levelText.setText(`Lv${this.level}`);
    this.levelText.setVisible(false);
    if (this.expStarLevelText?.setText) {
      this.expStarLevelText.setText(String(Math.max(0, this.level)).padStart(2, "0"));
    }

    // deseos separados
    this.permWishText.setText(this.permWishIcon ? `${this.formatWishHUD(this.wishesPermanent)}` : `Perm: ${this.formatWishHUD(this.wishesPermanent)}`);
    this.limitedWishText.setText(this.limitedWishIcon ? `${this.formatWishHUD(this.wishesLimited)}` : `Lim: ${this.formatWishHUD(this.wishesLimited)}`);

    // exp text + bar
    const cur = this.exp;
    const next = this.expToNext;

    if (this.level >= MAX_LEVEL) {
      this.setExpBarRatio(1);
      this.expText.setText(MAX_EXP_LABEL);
    } else {
      this.expText.setText(`${cur}/${next}`);
      const ratio = (next <= 0) ? 0 : (cur / next);
      this.setExpBarRatio(ratio);
    }

    // si cambi\u00F3 el texto, recalcula layout (por anchos)
    this.layoutHorizontal();
  }

  // =========================
  // GACHA LOGIC (roll + pity + anim)
  // =========================
  pickPermanentFiveStarKey() {
    const pool = Object.values(ITEM_DEFS)
      .filter((d) => d.rarity === 5 && typeof d.key === "string" && d.key.startsWith("perm_"))
      .map((d) => d.key);

    if (pool.length === 0) return "perm_green_9";
    return pool[Phaser.Math.Between(0, pool.length - 1)];
  }

  pickNpcFeaturedFiveStarKey() {
    const pool = NPC_BANNER_POOLS[5] || ["npc_kotori_5", "npc_minuscula_5", "npc_ivybunny_5"];
    return pool[Phaser.Math.Between(0, pool.length - 1)];
  }

  pickFiveStarKey(bannerType) {
    if (bannerType === "perm") return this.pickPermanentFiveStarKey();

    if (bannerType === "npc") {
      if (this.npcGuaranteeFeatured) {
        this.npcGuaranteeFeatured = false;
        return this.pickNpcFeaturedFiveStarKey();
      }

      const winNpc = Phaser.Math.FloatBetween(0, 1) < 0.5;
      if (winNpc) return this.pickNpcFeaturedFiveStarKey();

      // pierde 50/50 => siguiente 5★ garantizado
      this.npcGuaranteeFeatured = true;
      return this.pickPermanentFiveStarKey();
    }

    if (this.limGuaranteeFeatured) {
      this.limGuaranteeFeatured = false;
      return "lim_gold_2";
    }

    const win = Phaser.Math.FloatBetween(0, 1) < 0.5;
    if (win) return "lim_gold_2";

    // pierde 50/50 => siguiente 5\u2605 garantizado
    this.limGuaranteeFeatured = true;
    return this.pickPermanentFiveStarKey();
  }

  rollWish(bannerType) {
    // bannerType: "perm" | "lim" | "npc"
    const isPermanent = bannerType === "perm";
    const isLimited = bannerType === "lim";
    const isNpcBanner = bannerType === "npc";

    // pity counters
    let pity4 = this.permPity4;
    let pity5 = this.permPity5;
    if (isLimited) {
      pity4 = this.limPity4;
      pity5 = this.limPity5;
    } else if (isNpcBanner) {
      pity4 = this.npcPity4;
      pity5 = this.npcPity5;
    }

    pity4++;
    pity5++;

    let rarity = 2;

    // 5★: 0.6% o garantía a los 50
    const hit5 = (Phaser.Math.FloatBetween(0, 1) < 0.006) || (pity5 >= 50);
    if (hit5) rarity = 5;
    else {
      // 4★: garantía cada 10 (y una chance base)
      const hit4 = (Phaser.Math.FloatBetween(0, 1) < 0.08) || (pity4 >= 10);
      if (hit4) rarity = 4;
      else if (isPermanent) {
        // permanente: 1★/2★/3★ = 40% / 30% / 30%
        const r = Phaser.Math.FloatBetween(0, 1);
        if (r < 0.40) rarity = 1;
        else if (r < 0.70) rarity = 2;
        else rarity = 3;
      } else {
        // limitado/NPC: sin 1★ -> 3★ 70% / 2★ 30%
        const r = Phaser.Math.FloatBetween(0, 1);
        rarity = (r < 0.70) ? 3 : 2;
      }
    }

    // reset pity según rarity
    if (rarity >= 4) pity4 = 0;
    if (rarity === 5) pity5 = 0;

    if (isLimited) {
      this.limPity4 = pity4;
      this.limPity5 = pity5;
    } else if (isNpcBanner) {
      this.npcPity4 = pity4;
      this.npcPity5 = pity5;
    } else {
      this.permPity4 = pity4;
      this.permPity5 = pity5;
    }

    // --- decide itemKey según banner + rareza ---
    let itemKey = "green_1"; // base
    if (rarity === 1) {
      const pool = isNpcBanner ? (NPC_BANNER_POOLS[1] || BANNER_BUILDING_POOLS[1]) : BANNER_BUILDING_POOLS[1];
      itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
    } else if (rarity === 2) {
      const pool = isNpcBanner ? (NPC_BANNER_POOLS[2] || BANNER_BUILDING_POOLS[2]) : BANNER_BUILDING_POOLS[2];
      itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
    } else if (rarity === 3) {
      if (isNpcBanner) {
        const pool = NPC_BANNER_POOLS[3] || ["npc_profesora_3", "npc_policia_3", "npc_chefcriollo_3", "npc_artesana_3"];
        itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
      } else {
        const pool = BANNER_BUILDING_POOLS[3];
        itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
      }
    }

    if (rarity === 4) {
      if (isNpcBanner) {
        const pool = NPC_BANNER_POOLS[4] || ["npc_kotori_4", "npc_minusculas_4", "npc_ivybunny_4"];
        itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
      } else {
        const pool = BANNER_BUILDING_POOLS[4];
        itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
      }
    }

    if (rarity === 5) {
      itemKey = this.pickFiveStarKey(bannerType);
    }

    return { rarity, itemKey };
  }

  playWishAnim(rarity) {
    const modal = document.getElementById("gacha-modal");
    if (!modal) return;

    const win = modal.querySelector(".gacha-window");
    if (!win) return;

    const colors = {
      2: "rgba(200,200,220,.35)", // plata
      4: "rgba(168,85,247,.35)",  // morado
      5: "rgba(245,158,11,.40)"   // dorado
    };

    const flash = document.createElement("div");
    Object.assign(flash.style, {
      position: "absolute",
      inset: "0",
      borderRadius: "16px",
      background: colors[rarity] || "rgba(255,255,255,.3)",
      opacity: "0",
      transition: "opacity .18s ease",
      pointerEvents: "none"
    });

    win.style.position = "relative";
    win.appendChild(flash);

    requestAnimationFrame(() => { flash.style.opacity = "1"; });
    setTimeout(() => { flash.style.opacity = "0"; }, 180);
    setTimeout(() => { flash.remove(); }, 360);
  }

  ensureGachaAnimStyles() {
    if (document.getElementById("gacha-anim-styles")) return;

    const style = document.createElement("style");
    style.id = "gacha-anim-styles";
    style.textContent = `
      #gacha-anim-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.75);
        z-index: 3000000;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      #gacha-anim-overlay.limited {
        background:
          radial-gradient(circle at 50% 15%, rgba(250,204,21,.2), rgba(0,0,0,.85) 55%),
          linear-gradient(180deg, rgba(127,29,29,.9), rgba(15,23,42,.95));
      }
      #gacha-anim-overlay.permanent {
        background:
          radial-gradient(circle at 50% 15%, rgba(56,189,248,.25), rgba(0,0,0,.85) 55%),
          linear-gradient(180deg, rgba(12,74,110,.9), rgba(15,23,42,.95));
      }
      .gacha-anim-window {
        width: min(760px, 94vw);
        --accent: #facc15;
        --accent-2: #ef4444;
        --bg-top: #3b0a0a;
        --bg-bottom: #0b1222;
        --textile-img: none;
        --andean-pattern: url("data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='120'%20height='40'%20viewBox='0%200%20120%2040'%3E%3Cpath%20d='M0%2020%20L20%200%20L40%2020%20L60%200%20L80%2020%20L100%200%20L120%2020'%20fill='none'%20stroke='%23f59e0b'%20stroke-width='4'/%3E%3Cpath%20d='M0%2030%20L20%2010%20L40%2030%20L60%2010%20L80%2030%20L100%2010%20L120%2030'%20fill='none'%20stroke='%23f97316'%20stroke-width='3'/%3E%3C/svg%3E");
        --btn-bg: #7f1d1d;
        --btn-text: #fef3c7;
        --stage-border: rgba(250,204,21,.18);
        --neon-1: rgba(250,204,21,.55);
        --neon-2: rgba(236,72,153,.45);
        background:
          linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 70%);
        color: #e5e7eb;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,.5);
        font-family: "Georgia", "Times New Roman", serif;
        position: relative;
        overflow: hidden;
      }
      #gacha-anim-overlay.match-gacha .gacha-anim-window {
        position: fixed;
        margin: 0;
        max-width: none;
        width: auto;
        height: auto;
        box-sizing: border-box;
      }
      .gacha-anim-window::after { content: none; }
      .gacha-anim-window .neon-frame {
        position: absolute;
        inset: 6px;
        border-radius: 12px;
        border: 2px solid var(--neon-1);
        box-shadow: 0 0 16px var(--neon-1), 0 0 28px var(--neon-2);
        opacity: .9;
        animation: neonFlicker 3.2s infinite;
        pointer-events: none;
      }
      .gacha-anim-window.limited {
        --accent: #f472b6;
        --accent-2: #a855f7;
        --bg-top: #2b0a3d;
        --bg-bottom: #0b1222;
        --btn-bg: #3b0764;
        --btn-text: #fdf4ff;
        --stage-border: rgba(244,114,182,.25);
        --neon-1: rgba(244,114,182,.7);
        --neon-2: rgba(168,85,247,.6);
        --textile-img: url("data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='80'%20height='80'%20viewBox='0%200%2080%2080'%3E%3Cpath%20d='M0%2010%20H20%20V20%20H40%20V30%20H60%20V40%20H80'%20fill='none'%20stroke='%23f472b6'%20stroke-width='4'/%3E%3Cpath%20d='M0%2040%20H20%20V50%20H40%20V60%20H60%20V70%20H80'%20fill='none'%20stroke='%23a855f7'%20stroke-width='4'/%3E%3Cpath%20d='M-10%200%20L80%2090'%20fill='none'%20stroke='%23f59e0b'%20stroke-width='3'/%3E%3C/svg%3E");
      }
      .gacha-anim-window.permanent {
        --accent: #38bdf8;
        --accent-2: #60a5fa;
        --bg-top: #0b2a4a;
        --bg-bottom: #0b1222;
        --textile-img: url("data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='80'%20height='80'%20viewBox='0%200%2080%2080'%3E%3Cpath%20d='M0%2010%20H20%20V20%20H40%20V30%20H60%20V40%20H80'%20fill='none'%20stroke='%2338bdf8'%20stroke-width='4'/%3E%3Cpath%20d='M0%2040%20H20%20V50%20H40%20V60%20H60%20V70%20H80'%20fill='none'%20stroke='%2360a5fa'%20stroke-width='4'/%3E%3Cpath%20d='M-10%200%20L80%2090'%20fill='none'%20stroke='%230ea5e9'%20stroke-width='3'/%3E%3C/svg%3E");
        --btn-bg: #0b3b59;
        --btn-text: #e0f2fe;
        --stage-border: rgba(56,189,248,.2);
        --neon-1: rgba(56,189,248,.6);
        --neon-2: rgba(59,130,246,.45);
      }
      .gacha-anim-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .gacha-anim-title {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 1px;
        color: var(--accent);
      }
      .gacha-anim-btn {
        background: var(--btn-bg);
        color: var(--btn-text);
        border: 1px solid color-mix(in srgb, var(--accent) 70%, rgba(255,255,255,.1));
        padding: 8px 12px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: 700;
      }
      .gacha-stage {
        position: relative;
        margin-top: 12px;
        height: 260px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: transparent;
        border: 0;
        border-radius: 14px;
        --env-anim: .55s;
        --card-anim: 1.1s;
        --glow-anim: .5s;
        --label-anim: .4s;
      }
      .gacha-stage.prelude {
        align-items: stretch;
        justify-content: stretch;
      }
      .gacha-prelude {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 14px;
        overflow: hidden;
        background:
          radial-gradient(circle at 50% 30%, rgba(14,165,233,.25), rgba(2,6,23,.85) 70%),
          linear-gradient(180deg, rgba(15,23,42,.85), rgba(2,6,23,.95));
      }
      .gacha-prelude::after {
        content: "";
        position: absolute;
        inset: 0;
        background-image: var(--andean-pattern);
        background-size: 120px 40px;
        opacity: .18;
        mix-blend-mode: screen;
        pointer-events: none;
      }
      .prelude-sky {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 20% 20%, rgba(255,255,255,.15), rgba(255,255,255,0) 40%),
          radial-gradient(circle at 80% 35%, rgba(255,255,255,.1), rgba(255,255,255,0) 45%);
        opacity: .8;
      }
      .prelude-motif {
        position: absolute;
        left: 12%;
        bottom: 18%;
        width: 76%;
        height: 12%;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(251,191,36,.15), rgba(248,113,113,.2), rgba(59,130,246,.2));
        box-shadow: 0 0 20px rgba(251,191,36,.2);
        opacity: .8;
      }
      .prelude-streaks {
        position: absolute;
        inset: 0;
      }
      .prelude-aura {
        position: absolute;
        inset: -15%;
        opacity: .35;
        filter: blur(2px);
        animation: auraPulse 1.4s ease forwards;
        pointer-events: none;
      }
      .prelude-aura.rarity-3 {
        background: radial-gradient(circle at 50% 50%, rgba(94,234,212,.5), rgba(94,234,212,0) 70%);
      }
      .prelude-aura.rarity-4 {
        background: radial-gradient(circle at 50% 50%, rgba(192,132,252,.7), rgba(192,132,252,0) 72%);
      }
      .prelude-aura.rarity-5 {
        background: radial-gradient(circle at 50% 50%, rgba(245,158,11,.85), rgba(245,158,11,0) 75%);
      }
      .prelude-streak {
        position: absolute;
        left: -40%;
        top: var(--y, 40%);
        width: 70%;
        height: 3px;
        background: rgba(125,211,252,.7);
        box-shadow: 0 0 16px rgba(125,211,252,.8);
        transform: rotate(-12deg);
        opacity: 0;
        animation: streakFly 1.3s ease forwards;
        animation-delay: var(--d, 0s);
      }
      .gacha-prelude.single .prelude-streak {
        width: 90%;
        height: 3px;
        box-shadow: 0 0 18px rgba(125,211,252,.9);
      }
      .prelude-streak::after {
        content: "";
        position: absolute;
        right: -8px;
        top: -3px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgba(255,255,255,.9);
        box-shadow: 0 0 12px rgba(255,255,255,.8);
      }
      .prelude-streak.rarity-3 {
        background: rgba(94,234,212,.85);
        box-shadow: 0 0 16px rgba(94,234,212,.85);
      }
      .prelude-streak.rarity-4 {
        background: rgba(192,132,252,1);
        box-shadow: 0 0 18px rgba(192,132,252,1);
      }
      .prelude-streak.rarity-5 {
        background: rgba(245,158,11,1);
        box-shadow: 0 0 22px rgba(245,158,11,1);
      }
      .prelude-badge {
        position: absolute;
        right: 16px;
        top: 16px;
        padding: 6px 10px;
        border-radius: 999px;
        font-weight: 700;
        letter-spacing: .5px;
        font-size: 12px;
        background: rgba(15,23,42,.75);
        border: 1px solid rgba(255,255,255,.2);
      }
      .prelude-badge.purple { color: #c084fc; border-color: rgba(192,132,252,.6); }
      .prelude-badge.gold { color: #fbbf24; border-color: rgba(245,158,11,.7); }

      .gacha-stage::before { content: none; }
      .gacha-stage::after { content: none; }
      .envelope {
        position: absolute;
        width: 200px;
        height: 130px;
        z-index: 2;
      }
      .env-body {
        position: absolute;
        inset: 0;
        background: #f3e7c4;
        border: 2px solid rgba(127,29,29,.45);
        border-radius: 12px;
      }
      .env-flap {
        position: absolute;
        left: 0;
        top: -2px;
        width: 100%;
        height: 70%;
        background: #e7d7b0;
        border: 2px solid rgba(127,29,29,.45);
        border-bottom: none;
        border-radius: 12px 12px 0 0;
        transform-origin: top;
        animation: envOpen var(--env-anim) ease forwards;
      }
      .card-anim {
        position: absolute;
        width: 150px;
        height: 210px;
        border-radius: 12px;
        background: linear-gradient(180deg, var(--card-bg1, #0f172a), var(--card-bg2, #0b1222));
        border: 2px solid rgba(148,163,184,.35);
        transform: translateY(50px) rotate(0deg) scale(.85);
        opacity: 0;
        animation: cardRise var(--card-anim) ease .2s forwards;
        box-shadow: 0 10px 30px rgba(0,0,0,.45);
        z-index: 3;
      }
      .gacha-stage.reveal .card-anim.rarity-4 { border-color: #a855f7; }
      .gacha-stage.reveal .card-anim.rarity-5 { border-color: #f59e0b; }
      .card-legend {
        box-shadow: 0 16px 40px rgba(245,158,11,.35), 0 10px 30px rgba(0,0,0,.55);
        border-width: 3px;
      }
      .card-face {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 6px;
        text-align: center;
        padding: 10px;
      }
      .card-sigil {
        font-size: 36px;
        line-height: 1;
        opacity: .95;
      }
      .card-tag {
        font-size: 11px;
        letter-spacing: 1px;
        text-transform: uppercase;
        opacity: .85;
      }
      .card-icon {
        font-size: 28px;
      }
      .card-front {
        position: absolute;
        inset: 0;
        opacity: 0;
        transform: scale(.96);
        transition: opacity .25s ease, transform .25s ease;
      }
      .card-back {
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background:
          repeating-linear-gradient(135deg,
            color-mix(in srgb, var(--accent) 35%, transparent) 0 8px,
            color-mix(in srgb, var(--accent-2) 35%, transparent) 8px 16px);
        border-radius: 10px;
        color: rgba(255,255,255,.9);
        font-weight: 700;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
      .card-back .mystery {
        font-size: 42px;
        line-height: 1;
        text-shadow: 0 0 12px color-mix(in srgb, var(--accent) 60%, transparent);
      }
      .card-back .mystery-sub {
        font-size: 18px;
        letter-spacing: 1px;
        opacity: .9;
      }
      .gacha-stage.reveal .card-front { opacity: 1; transform: scale(1); }
      .gacha-stage.reveal .card-back { opacity: 0; transition: opacity .2s ease; }
      .card-name {
        font-weight: 700;
      }
      .card-stars {
        display: inline-flex;
        gap: 2px;
        letter-spacing: 1px;
        opacity: .9;
      }
      .card-stars .star {
        opacity: 0;
        transform: translateY(6px) scale(.85);
      }
      .card-stars.stars-1 { --star-anim: .25s; }
      .card-stars.stars-2 { --star-anim: .3s; }
      .card-stars.stars-3 { --star-anim: .35s; }
      .card-stars.stars-4 { --star-anim: .4s; }
      .card-stars.stars-5 { --star-anim: .45s; }
      .gacha-stage.reveal .card-stars .star {
        animation: starPop var(--star-anim, .35s) ease forwards;
        animation-delay: var(--sd, 0s);
      }
      .glow {
        position: absolute;
        width: 240px;
        height: 240px;
        border-radius: 50%;
        opacity: 0;
        filter: blur(2px);
        z-index: 1;
      }
      .gacha-stage.reveal .glow {
        animation: glowPulse var(--glow-anim) ease forwards;
      }
      .legend-shine {
        position: absolute;
        width: 360px;
        height: 360px;
        border-radius: 50%;
        opacity: 0;
        z-index: 1;
        background:
          conic-gradient(from 0deg,
            rgba(245,158,11,.0),
            rgba(245,158,11,.35),
            rgba(245,158,11,.0),
            rgba(245,158,11,.35),
            rgba(245,158,11,.0));
        filter: blur(2px);
      }
      .gacha-stage.reveal .legend-shine {
        animation: legendShine 1.4s ease .25s forwards;
      }
      .card-label {
        position: absolute;
        bottom: 18px;
        font-weight: 700;
        opacity: 0;
        z-index: 3;
      }
      .gacha-stage.reveal .card-label {
        animation: labelIn var(--label-anim) ease forwards;
      }
      .glow.rarity-2 { background: rgba(148,163,184,.35); }
      .glow.rarity-4 { background: rgba(168,85,247,.55); }
      .glow.rarity-5 { background: rgba(245,158,11,.65); }
      .card-label.rarity-2 { color: #cbd5f5; }
      .card-label.rarity-4 { color: #c084fc; }
      .card-label.rarity-5 { color: #fbbf24; }
      .tap-hint {
        position: absolute;
        bottom: 12px;
        right: 14px;
        font-size: 12px;
        letter-spacing: .5px;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity .2s ease, transform .2s ease;
        color: rgba(226,232,240,.9);
      }
      .gacha-stage.await .tap-hint {
        opacity: .95;
        transform: translateY(0);
      }

      .reveal-flash {
        position: absolute;
        inset: -20%;
        background:
          radial-gradient(circle at center, rgba(255,255,255,1), rgba(255,255,255,.7) 35%, rgba(255,255,255,0) 75%);
        opacity: 0;
        z-index: 4;
        pointer-events: none;
        mix-blend-mode: screen;
        filter: blur(1px);
      }
      .reveal-flash.rarity-4 {
        background:
          radial-gradient(circle at center, rgba(192,132,252,1), rgba(192,132,252,.7) 38%, rgba(192,132,252,0) 78%);
      }
      .reveal-flash.rarity-5 {
        background:
          radial-gradient(circle at center, rgba(245,158,11,1), rgba(245,158,11,.8) 40%, rgba(245,158,11,0) 80%);
      }
      .gacha-stage.reveal .reveal-flash {
        animation: revealFlash .9s ease forwards;
      }

      .gacha-results {
        margin-top: 12px;
        display: grid;
        gap: 8px;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }
      .result-item {
        position: relative;
        display: flex;
        align-items: center;
        gap: 10px;
        background: color-mix(in srgb, var(--bg-top) 45%, rgba(2,6,23,.45));
        border: 1px solid rgba(255,255,255,.08);
        border-radius: 12px;
        padding: 10px;
        overflow: hidden;
        opacity: 0;
        transform: translateY(8px) scale(.98);
        animation: resultIn .45s ease forwards;
        animation-delay: calc(var(--i, 0) * 0.07s);
      }
      .result-icon { font-size: 22px; }
      .result-name { font-weight: 700; }
      .result-stars { opacity: .85; font-size: 12px; }
      .result-item.rarity-2 { border-color: rgba(148,163,184,.4); }
      .result-item.rarity-4 { border-color: rgba(168,85,247,.6); }
      .result-item.rarity-5 { border-color: rgba(245,158,11,.7); }

      .result-item.rarity-4::before,
      .result-item.rarity-5::before {
        content: "";
        position: absolute;
        inset: -20%;
        border-radius: 14px;
        z-index: 0;
        opacity: .55;
        pointer-events: none;
      }
      .result-item.rarity-4::before {
        background: radial-gradient(circle at 30% 30%, rgba(168,85,247,.55), rgba(168,85,247,0) 60%);
      }
      .result-item.rarity-5::before {
        background: radial-gradient(circle at 30% 30%, rgba(245,158,11,.65), rgba(245,158,11,0) 60%);
      }
      .result-item.rarity-5::after {
        content: "\u2726 \u2727 \u2726";
        position: absolute;
        top: 6px;
        right: 10px;
        font-size: 12px;
        color: rgba(245,158,11,.9);
        text-shadow: 0 0 8px rgba(245,158,11,.6);
        animation: sparkleTwinkle 1.4s ease-in-out infinite;
        z-index: 1;
        pointer-events: none;
      }
      .result-item > * {
        position: relative;
        z-index: 1;
      }

      @media (max-width: 900px) and (orientation: landscape) {
        .gacha-anim-window {
          width: 96vw;
          padding: 10px;
        }
        .gacha-anim-title { font-size: 16px; }
        .gacha-anim-btn { padding: 6px 10px; font-size: 12px; }
        .gacha-stage { height: 200px; }
        .gacha-prelude::after { background-size: 90px 30px; }
        .card-anim { width: 120px; height: 170px; }
        .envelope { width: 160px; height: 105px; }
        .glow { width: 200px; height: 200px; }
        .legend-shine { width: 260px; height: 260px; }
        .card-sigil { font-size: 30px; }
        .card-icon { font-size: 24px; }
        .card-back .mystery { font-size: 34px; }
        .card-back .mystery-sub { font-size: 14px; }
        .gacha-results { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
        .result-item { padding: 8px; }
        .result-icon { font-size: 18px; }
      }

      @keyframes envOpen {
        0% { transform: rotateX(0deg); }
        100% { transform: rotateX(70deg); }
      }
      @keyframes cardRise {
        0% { transform: translateY(50px) rotate(0deg) scale(.85); opacity: 0; }
        70% { transform: translateY(-10px) rotate(180deg) scale(1); opacity: 1; }
        100% { transform: translateY(-20px) rotate(360deg) scale(1); opacity: 1; }
      }
      @keyframes glowPulse {
        0% { opacity: 0; transform: scale(.8); }
        100% { opacity: 1; transform: scale(1); }
      }
      @keyframes labelIn {
        0% { opacity: 0; transform: translateY(6px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      @keyframes revealFlash {
        0% { opacity: 0; transform: scale(.9); }
        20% { opacity: 1; transform: scale(1.02); }
        60% { opacity: .95; transform: scale(1.08); }
        100% { opacity: 0; transform: scale(1.24); }
      }
      @keyframes auraPulse {
        0% { opacity: .2; transform: scale(.92); }
        40% { opacity: .8; transform: scale(1.02); }
        100% { opacity: 0; transform: scale(1.12); }
      }
      @keyframes resultIn {
        0% { opacity: 0; transform: translateY(10px) scale(.96); }
        60% { opacity: 1; transform: translateY(-2px) scale(1.01); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes starPop {
        0% { opacity: 0; transform: translateY(6px) scale(.85); }
        60% { opacity: 1; transform: translateY(-2px) scale(1.05); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes streakFly {
        0% { opacity: 0; transform: translateX(-20%) rotate(-12deg); }
        35% { opacity: 1; }
        100% { opacity: 0; transform: translateX(160%) rotate(-12deg); }
      }
      @keyframes neonFlicker {
        0%, 18%, 22%, 25%, 53%, 57%, 100% { opacity: .95; }
        20%, 24%, 55% { opacity: .35; }
      }
      @keyframes sparkleTwinkle {
        0%, 100% { opacity: .35; transform: translateY(0); }
        50% { opacity: 1; transform: translateY(-2px); }
      }
      @keyframes legendShine {
        0% { opacity: 0; transform: scale(.8) rotate(0deg); }
        100% { opacity: 1; transform: scale(1) rotate(35deg); }
      }
    `;
    document.head.appendChild(style);
  }

  renderWishStageHTML(result) {
    const def = ITEM_DEFS[result.itemKey] || { name: result.itemKey, icon: "\u2753", rarity: result.rarity };
    const rarity = result.rarity || def.rarity || 2;
    const rarityClass = `rarity-${rarity}`;
    const isLegend = rarity === 5;
    const starSpans = Array.from({ length: rarity }, (_, i) => (
      `<span class="star" style="--sd:${(i * 0.12).toFixed(2)}s">\u2605</span>`
    )).join("");
    const cardTag = def.cardTag || "";
    const cardSigil = def.cardSigil || "";
    const cardStyleParts = [];
    if (def.cardBg1) cardStyleParts.push(`--card-bg1:${def.cardBg1}`);
    if (def.cardBg2) cardStyleParts.push(`--card-bg2:${def.cardBg2}`);
    if (def.cardAccent) cardStyleParts.push(`--card-accent:${def.cardAccent}`);
    const cardStyle = cardStyleParts.length ? ` style="${cardStyleParts.join(";")}"` : "";

    return `
      <div class="envelope">
        <div class="env-body"></div>
        <div class="env-flap"></div>
      </div>
      <div class="card-anim ${rarityClass}${isLegend ? " card-legend" : ""}"${cardStyle}>
        <div class="card-back">
          <div class="mystery">\uD83C\uDDF5\uD83C\uDDEA</div>
          <div class="mystery-sub">\u2600\uFE0F</div>
        </div>
        <div class="card-face card-front">
          ${cardSigil ? `<div class="card-sigil">${cardSigil}</div>` : `<div class="card-icon">${def.icon || "\u2753"}</div>`}
          <div class="card-name">${def.name || result.itemKey}</div>
          ${cardTag ? `<div class="card-tag">${cardTag}</div>` : ""}
          <div class="card-stars stars-${rarity}">${starSpans}</div>
        </div>
      </div>
      <div class="glow ${rarityClass}"></div>
      ${isLegend ? `<div class="legend-shine"></div>` : ""}
      <div class="reveal-flash ${rarityClass}"></div>
      <div class="card-label ${rarityClass}">${def.name || result.itemKey}</div>
      <div class="tap-hint">Toca para continuar</div>
    `;
  }

  renderBannerCard(key, opts = {}) {
    const def = ITEM_DEFS[key] || { name: key, icon: "\u2753", rarity: 2, size: 1 };
    const rarity = def.rarity || 2;
    const stars = "\u2605".repeat(rarity);
    const badge = opts.badge || (rarity >= 5 ? "5\u2605" : (rarity === 4 ? "4\u2605" : ""));
    const large = opts.large ? " large" : "";
    const b1 = def.cardBg1 || (rarity >= 5 ? "#3b0a0a" : "#0f172a");
    const b2 = def.cardBg2 || (rarity >= 5 ? "#0b1222" : "#020617");
    const glow = def.cardAccent || (rarity >= 5 ? "#f59e0b" : (rarity === 4 ? "#a855f7" : "#38bdf8"));
    const sigil = def.cardSigil || def.icon || "\u2756";
    const size = getItemCardMeta(def);

    return `
      <div class="banner-card${large}" style="--b1:${b1};--b2:${b2};--glow:${glow};">
        ${badge ? `<div class="banner-badge">${badge}</div>` : ""}
        <div class="banner-sigil">${sigil}</div>
        <div class="banner-title">${def.name || key}</div>
        <div class="banner-meta">${size}</div>
        <div class="banner-stars">${stars}</div>
      </div>
    `;
  }

  renderWishResultsHTML(results) {
    return results.map((r, idx) => {
      const def = ITEM_DEFS[r.itemKey] || { name: r.itemKey, icon: "\u2753", rarity: r.rarity };
      const rarity = r.rarity || def.rarity || 2;
      const stars = "\u2605".repeat(rarity);
      return `
        <div class="result-item rarity-${rarity}" style="--i:${idx}">
          <div class="result-icon">${def.icon || "\u2753"}</div>
          <div>
            <div class="result-name">#${idx + 1} \u00B7 ${def.name || r.itemKey}</div>
            <div class="result-stars">${stars}</div>
          </div>
        </div>
      `;
    }).join("");
  }

  runWishAnimation(results, bannerType) {
    if (!Array.isArray(results) || results.length === 0) return;

    this.ensureGachaAnimStyles();
    this.isWishAnimating = true;

    const existing = document.getElementById("gacha-anim-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "gacha-anim-overlay";
    const gachaModal = document.getElementById("gacha-modal");
    const sourceGachaWindow = gachaModal?.querySelector?.(".gacha-window");
    const sourceRect = sourceGachaWindow?.getBoundingClientRect?.();
    const themeClass = (bannerType === "perm") ? "permanent" : "limited";
    const title = bannerType === "perm"
      ? "Deseo Permanente"
      : (bannerType === "npc" ? "Deseo NPC" : "Deseo Andino");

    overlay.className = `gacha-anim-overlay ${themeClass}`;

    overlay.innerHTML = `
      <div class="gacha-anim-window ${themeClass}">
        <div class="gacha-anim-header">
          <div class="gacha-anim-title">${title}</div>
          <button id="gachaSkipBtn" class="gacha-anim-btn">Saltar</button>
        </div>
        <div id="gachaStage" class="gacha-stage"></div>
        <div id="gachaResults" class="gacha-results" style="display:none;"></div>
        <div style="margin-top:12px; display:flex; justify-content:flex-end;">
          <button id="gachaCloseBtn" class="gacha-anim-btn" style="display:none;">Cerrar</button>
        </div>
        <div class="neon-frame"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    const animWindow = overlay.querySelector(".gacha-anim-window");
    const stage = overlay.querySelector("#gachaStage");
    const resultsEl = overlay.querySelector("#gachaResults");
    const skipBtn = overlay.querySelector("#gachaSkipBtn");
    const closeBtn = overlay.querySelector("#gachaCloseBtn");

    const canMatchGachaWindow = !!(sourceRect && Number.isFinite(sourceRect.width) && Number.isFinite(sourceRect.height) && sourceRect.width > 0 && sourceRect.height > 0);
    if (canMatchGachaWindow && animWindow) {
      overlay.classList.add("match-gacha");
      Object.assign(animWindow.style, {
        left: `${Math.round(sourceRect.left)}px`,
        top: `${Math.round(sourceRect.top)}px`,
        width: `${Math.round(sourceRect.width)}px`,
        height: `${Math.round(sourceRect.height)}px`,
        borderRadius: (sourceGachaWindow && getComputedStyle(sourceGachaWindow).borderRadius) || "18px"
      });
      // Ajuste de stage para aprovechar el alto real del banner/fondo.
      requestAnimationFrame(() => {
        try {
          const headerEl = animWindow.querySelector(".gacha-anim-header");
          const footerWrap = closeBtn?.parentElement;
          const styles = getComputedStyle(animWindow);
          const padY = (parseFloat(styles.paddingTop || "0") + parseFloat(styles.paddingBottom || "0"));
          const headerH = headerEl?.offsetHeight || 0;
          const footerH = footerWrap?.offsetHeight || 0;
          const reserved = padY + headerH + footerH + 34; // márgenes internos
          const stageH = Math.max(220, Math.floor(animWindow.clientHeight - reserved));
          if (stage) stage.style.height = `${stageH}px`;
          if (resultsEl) {
            resultsEl.style.maxHeight = `${Math.max(120, Math.floor(animWindow.clientHeight - headerH - footerH - padY - 30))}px`;
            resultsEl.style.overflow = "auto";
          }
        } catch (_) {
          // no-op: si falla el ajuste, usa tamaños por defecto
        }
      });
    }

    let restoreGachaModalVisibility = null;
    if (gachaModal) {
      const prevVisibility = gachaModal.style.visibility;
      const prevPointerEvents = gachaModal.style.pointerEvents;
      gachaModal.style.visibility = "hidden";
      gachaModal.style.pointerEvents = "none";
      restoreGachaModalVisibility = () => {
        if (!gachaModal.isConnected) return;
        gachaModal.style.visibility = prevVisibility;
        gachaModal.style.pointerEvents = prevPointerEvents;
      };
    }

    let idx = 0;
    let timer = null;
    let revealTimer = null;
    let preludeTimer = null;
    let advanceTimer = null;
    let awaitingClick = false;

    const getAnimMs = (rarity) => {
      if (rarity >= 5) return 2600;
      if (rarity >= 4) return 1850;
      return 1300;
    };

    const applyStageTiming = (rarity) => {
      if (!stage) return;
      if (rarity >= 5) {
        stage.style.setProperty("--env-anim", "0.8s");
        stage.style.setProperty("--card-anim", "1.6s");
        stage.style.setProperty("--glow-anim", "0.8s");
        stage.style.setProperty("--label-anim", "0.6s");
      } else if (rarity >= 4) {
        stage.style.setProperty("--env-anim", "0.65s");
        stage.style.setProperty("--card-anim", "1.25s");
        stage.style.setProperty("--glow-anim", "0.55s");
        stage.style.setProperty("--label-anim", "0.5s");
      } else {
        stage.style.setProperty("--env-anim", "0.55s");
        stage.style.setProperty("--card-anim", "1.05s");
        stage.style.setProperty("--glow-anim", "0.45s");
        stage.style.setProperty("--label-anim", "0.4s");
      }
    };

    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      if (revealTimer) {
        clearTimeout(revealTimer);
        revealTimer = null;
      }
      if (preludeTimer) {
        clearTimeout(preludeTimer);
        preludeTimer = null;
      }
      if (advanceTimer) {
        clearTimeout(advanceTimer);
        advanceTimer = null;
      }
      awaitingClick = false;
    };

    const showResults = () => {
      clearTimer();
      if (stage) stage.style.display = "none";
      if (resultsEl) {
        resultsEl.style.display = "grid";
        resultsEl.innerHTML = this.renderWishResultsHTML(results);
      }
      if (skipBtn) skipBtn.style.display = "none";
      if (closeBtn) closeBtn.style.display = "inline-flex";
    };

    const close = () => {
      clearTimer();
      if (overlay.parentNode) overlay.remove();
      if (restoreGachaModalVisibility) restoreGachaModalVisibility();
      this.isWishAnimating = false;
    };

    const renderPreludeHTML = () => {
      const isSingle = results.length <= 1;
      const topRarity = results.reduce((m, r) => Math.max(m, (r.rarity || ITEM_DEFS[r.itemKey]?.rarity || 2)), 1);
      const streakList = isSingle
        ? [results[0]]
        : results;

      const streaks = streakList.map((res, i) => {
        const rarity = res.rarity || (ITEM_DEFS[res.itemKey]?.rarity || 2);
        const cls = (rarity >= 5) ? "rarity-5" : (rarity >= 4 ? "rarity-4" : (rarity >= 3 ? "rarity-3" : ""));
        const y = isSingle ? 50 : (15 + (70 * (i / (streakList.length - 1))));
        const d = (i * 0.08).toFixed(2);
        return `<span class="prelude-streak ${cls}" style="--d:${d}s; --y:${y.toFixed(1)}%;"></span>`;
      }).join("");

      const has5 = topRarity >= 5;
      const has4 = topRarity >= 4;
      const badge = has5
        ? `<div class="prelude-badge gold">Destello Dorado</div>`
        : (has4 ? `<div class="prelude-badge purple">Destello Morado</div>` : "");
      const auraClass = has5 ? "rarity-5" : (has4 ? "rarity-4" : (topRarity >= 3 ? "rarity-3" : ""));

      return `
        <div class="gacha-prelude ${isSingle ? "single" : ""} ${has5 ? "has-5" : (has4 ? "has-4" : "")}">
          <div class="prelude-sky"></div>
          <div class="prelude-aura ${auraClass}"></div>
          <div class="prelude-streaks">${streaks}</div>
          ${badge}
        </div>
      `;
    };

    const playPrelude = () => {
      if (!stage) return;
      stage.style.display = "flex";
      stage.classList.add("prelude");
      stage.classList.remove("await");
      stage.classList.remove("reveal");
      stage.innerHTML = renderPreludeHTML();
      preludeTimer = setTimeout(() => {
        if (!stage) return;
        stage.classList.remove("prelude");
        playNext();
      }, 2200);
    };

    const playNext = () => {
      if (!stage) return;
      if (idx >= results.length) {
        showResults();
        return;
      }
      const res = results[idx++];
      const rarity = res.rarity || (ITEM_DEFS[res.itemKey]?.rarity || 2);
      applyStageTiming(rarity);
      stage.style.display = "flex";
      stage.classList.remove("await");
      stage.classList.remove("reveal");
      stage.innerHTML = this.renderWishStageHTML(res);
      const animMs = getAnimMs(rarity);
      const revealAt = Math.max(900, animMs - 650);
      revealTimer = setTimeout(() => {
        stage.classList.add("reveal");
        this.playStarSound(rarity);
      }, revealAt);
      advanceTimer = setTimeout(() => {
        awaitingClick = true;
        stage.classList.add("await");
      }, animMs);
    };

    if (skipBtn) skipBtn.onclick = () => {
      this.ensureAudio();
      showResults();
    };
    if (closeBtn) closeBtn.onclick = close;

    overlay.addEventListener("click", (e) => {
      this.ensureAudio();
      if (!awaitingClick) return;
      if (e.target?.closest(".gacha-anim-btn")) return;
      if (stage) {
        awaitingClick = false;
        stage.classList.remove("await");
        playNext();
      }
    });

    playPrelude();
  }

  // =========================
  // GACHA MODAL (HTML) + Animaci\u00F3n abrir/cerrar
  // =========================
  openGachaModal() {
    if (document.getElementById("gacha-modal")) return;

    const modal = document.createElement("div");
    modal.id = "gacha-modal";
    modal.className = "gacha-modal";

    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.55)",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto"
    });

    modal.innerHTML = `
      <div class="gacha-window" style="
        width: min(1160px, 98vw);
        height: min(78vh, 700px);
        background:
          linear-gradient(180deg, rgba(3,7,18,.70), rgba(3,7,18,.84)),
          url('img/fondobaner.png') center / cover no-repeat;
        color: #e5e7eb;
        border: none;
        border-radius: 18px;
        padding: 12px;
        box-shadow: 0 24px 70px rgba(0,0,0,.55);
        font-family: "Arial", Arial, sans-serif;
        position: relative;
        overflow: hidden;
        display: grid;
        grid-template-rows: auto auto minmax(0,1fr);
        gap: 8px;

        transform: translateY(12px) scale(.98);
        opacity: 0;
        transition: transform .18s ease, opacity .18s ease;
      ">
        <style>
          #gacha-modal .banner-block {
            border: none;
            border-radius: 14px;
            padding: 6px 8px 8px;
            background: transparent;
            display: grid;
            grid-template-rows: auto minmax(0,1fr);
            gap: 8px;
            height: 100%;
            min-height: 0;
            box-sizing: border-box;
          }
          #gacha-modal .banner-head {
            display:flex;
            justify-content:space-between;
            align-items:center;
            gap:10px;
          }
          #gacha-modal .banner-name {
            font-weight:700;
            letter-spacing:.3px;
          }
          #gacha-modal .banner-hero {
            position: relative;
            border-radius: 12px;
            padding: 8px 10px 10px;
            height: auto;
            min-height: 0;
            overflow: hidden;
            background: transparent;
            border: none;
            box-shadow: none;
            display: grid;
            grid-template-rows: minmax(0, 1fr) auto;
            align-content: center;
            align-self: stretch;
            justify-items: center;
            gap: 6px;
            box-sizing: border-box;
          }
          #gacha-modal .banner-hero::before {
            content:none;
            position:absolute;
            inset: 0;
            background:
              radial-gradient(circle at 50% 42%, rgba(255,255,255,.16), transparent 42%),
              linear-gradient(120deg, rgba(255,255,255,.06), transparent 42%, rgba(255,255,255,.05));
            pointer-events:none;
          }
          #gacha-modal .banner-hero > * {
            position: relative;
            z-index: 1;
          }
          #gacha-modal .banner-hero.npc-layout {
            align-content: stretch;
            justify-items: center;
          }
          #gacha-modal .banner-featured {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 10px;
            justify-items: center;
            align-items: center;
            width: 100%;
            grid-row: 1;
            align-self: center;
          }
          #gacha-modal .banner-featured.centered-5 {
            max-width: 620px;
            margin: 0 auto;
          }
          #gacha-modal .banner-featured.solo {
            grid-template-columns: minmax(0, 1fr);
            max-width: 420px;
            margin: 0 auto;
          }
          #gacha-modal .banner-card {
            position: relative;
            border-radius: 12px;
            padding: 12px;
            min-height: 0;
            aspect-ratio: 3 / 4;
            background: linear-gradient(135deg, var(--b1), var(--b2));
            border: 1px solid color-mix(in srgb, var(--glow) 60%, rgba(255,255,255,.15));
            box-shadow: 0 8px 20px color-mix(in srgb, var(--glow) 40%, rgba(0,0,0,.5));
            overflow: hidden;
            width: 100%;
            max-width: 152px;
            display: grid;
            align-content: start;
            justify-items: start;
          }
          #gacha-modal .banner-card::after {
            content: "";
            position: absolute;
            inset: 8px;
            border-radius: 10px;
            border: 1px solid rgba(255,255,255,.15);
            opacity: .6;
            pointer-events: none;
          }
          #gacha-modal .banner-card::before {
            content: "";
            position: absolute;
            inset: -25%;
            background: radial-gradient(circle at 50% 35%, color-mix(in srgb, var(--glow) 28%, white), transparent 44%);
            opacity: .32;
            pointer-events: none;
          }
          #gacha-modal .banner-card.large {
            max-width: 176px;
          }
          #gacha-modal .banner-card .banner-sigil,
          #gacha-modal .banner-card .banner-title,
          #gacha-modal .banner-card .banner-meta,
          #gacha-modal .banner-card .banner-stars,
          #gacha-modal .banner-card .banner-badge { position: relative; z-index: 1; }
          #gacha-modal .banner-card .banner-stars {
            font-weight: 700;
          }
          #gacha-modal .banner-badge {
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(15,23,42,.7);
            color: var(--glow);
            border: 1px solid color-mix(in srgb, var(--glow) 60%, rgba(255,255,255,.2));
            padding: 4px 8px;
            border-radius: 999px;
            font-size: 11px;
            font-weight: 700;
          }
          #gacha-modal .banner-sigil {
            font-size: 30px;
            line-height: 1;
          }
          #gacha-modal .banner-title {
            font-weight: 700;
            margin-top: 6px;
            font-size: 15px;
            line-height: 1.12;
          }
          #gacha-modal .banner-meta {
            font-size: 12px;
            opacity: .8;
          }
          #gacha-modal .banner-stars {
            margin-top: 6px;
            color: var(--glow);
            text-shadow: 0 0 12px color-mix(in srgb, var(--glow) 70%, transparent);
            letter-spacing: 1px;
            font-size: 14px;
          }
          #gacha-modal .gacha-carousel-nav {
            display:grid;
            place-items:center;
            margin-top:6px;
            min-height: 34px;
          }
          #gacha-modal .gacha-carousel-navbtn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 46px;
            height: 46px;
            border-radius: 999px;
            cursor:pointer;
            border:1px solid rgba(255,255,255,.2);
            background: linear-gradient(180deg, rgba(15,23,42,.92), rgba(2,6,23,.96));
            color:#e5e7eb;
            font-weight:700;
            font-size:18px;
            display:grid;
            place-items:center;
            box-shadow: 0 10px 24px rgba(0,0,0,.35);
            z-index: 5;
            transition: transform .14s ease, border-color .14s ease, box-shadow .14s ease;
          }
          #gacha-modal .gacha-carousel-navbtn:hover {
            transform: translateY(-50%) scale(1.04);
            border-color: rgba(255,255,255,.35);
            box-shadow: 0 12px 28px rgba(0,0,0,.45);
          }
          #gacha-modal .gacha-carousel-navbtn.prev {
            left: 10px;
          }
          #gacha-modal .gacha-carousel-navbtn.next {
            right: 10px;
          }
          #gacha-modal .gacha-carousel-center {
            width:100%;
            padding: 0 60px;
            text-align:center;
            display:grid;
            gap:2px;
          }
          #gacha-modal .gacha-carousel-title {
            font-size:13px;
            font-weight:700;
            letter-spacing:.3px;
            opacity:.95;
          }
          #gacha-modal .gacha-carousel-index {
            font-size:11px;
            opacity:.75;
          }
          #gacha-modal .gacha-carousel-pages {
            margin-top: 0;
            min-height: 0;
            height: 100%;
            position: relative;
            overflow: hidden;
          }
          #gacha-modal .gacha-carousel-page {
            display: none;
            height: 100%;
            min-height: 0;
            overflow: hidden;
            box-sizing: border-box;
            animation: gachaBannerFade .16s ease;
          }
          #gacha-modal .gacha-carousel-page.is-active {
            display: block;
          }
          #gacha-modal .banner-subtitle {
            font-size:12px;
            opacity:.82;
            margin:0;
            font-weight: 700;
            color: #e5e7eb;
            text-shadow: 0 1px 2px rgba(0,0,0,.55);
            display:none;
          }
          #gacha-modal .banner-footer {
            position: static;
            display: grid;
            gap: 4px;
            width: 100%;
            grid-row: 2;
            align-self: end;
          }
          #gacha-modal .wish-pull-row {
            margin-top: 0;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: flex-start;
            width: 100%;
            transform: translateY(-31px);
          }
          #gacha-modal .banner-prob {
            opacity: .92;
            font-size: 12px;
            text-shadow: 0 1px 2px rgba(0,0,0,.65);
            width: 100%;
            margin: 0;
            transform: translateY(-72px);
          }
          #gacha-modal .wish-pull-btn {
            border: none;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            padding: 10px 12px;
            min-width: 132px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            box-shadow: 0 8px 18px rgba(0,0,0,.22);
            backdrop-filter: blur(2px);
            transform: translateY(-31px);
          }
          #gacha-modal .wish-pull-btn img {
            width: 18px;
            height: 18px;
            object-fit: contain;
            display: block;
            filter: drop-shadow(0 1px 1px rgba(0,0,0,.35));
          }
          #gacha-modal .wish-pull-btn .wish-q {
            opacity: .9;
            font-weight: 800;
          }
          #gacha-modal .wish-pull-btn.lim {
            background:#fbbf24;color:#1f1400;
          }
          #gacha-modal .wish-pull-btn.lim.alt {
            background:#f59e0b;color:#1f1400;
          }
          #gacha-modal .wish-pull-btn.npc {
            background:#22d3ee;color:#082f49;
          }
          #gacha-modal .wish-pull-btn.npc.alt {
            background:#38bdf8;color:#082f49;
          }
          #gacha-modal .wish-pull-btn.perm {
            background:#16a34a;color:#022c22;
          }
          #gacha-modal .wish-pull-btn.perm.alt {
            background:#22c55e;color:#022c22;
          }
          #gacha-modal .gacha-ui-edit-panel {
            position: absolute;
            top: 56px;
            right: 12px;
            width: 260px;
            max-width: min(260px, 42vw);
            background: rgba(2, 6, 23, .94);
            border: 1px solid rgba(255,255,255,.14);
            border-radius: 12px;
            box-shadow: 0 18px 36px rgba(0,0,0,.38);
            padding: 10px;
            z-index: 20;
            display: none;
            color: #e5e7eb;
            font-size: 12px;
          }
          #gacha-modal .gacha-ui-edit-panel.is-open {
            display: grid;
            gap: 8px;
          }
          #gacha-modal .gacha-ui-edit-row {
            display:flex;
            align-items:center;
            gap:6px;
            flex-wrap: wrap;
          }
          #gacha-modal .gacha-ui-edit-btn {
            border: 1px solid rgba(255,255,255,.14);
            background: #0f172a;
            color: #e5e7eb;
            border-radius: 8px;
            padding: 6px 8px;
            cursor: pointer;
            font-size: 12px;
            line-height: 1;
          }
          #gacha-modal .gacha-ui-edit-btn.active {
            background: #0ea5e9;
            color: #06243a;
            border-color: rgba(14,165,233,.55);
            font-weight: 700;
          }
          #gacha-modal .gacha-ui-step-btn.active {
            background: #22c55e;
            color: #052e16;
            border-color: rgba(34,197,94,.55);
            font-weight: 700;
          }
          #gacha-modal .gacha-ui-edit-grid {
            display:grid;
            grid-template-columns: repeat(3, 34px);
            grid-template-rows: repeat(2, 30px);
            gap: 4px;
            justify-content: start;
            align-items: center;
          }
          #gacha-modal .gacha-ui-edit-grid .gacha-ui-edit-btn {
            display:grid;
            place-items:center;
            padding: 0;
            width: 34px;
            height: 30px;
          }
          #gacha-modal .gacha-ui-edit-selected-list {
            max-height: 120px;
            overflow: auto;
            border: 1px solid rgba(255,255,255,.08);
            border-radius: 8px;
            background: rgba(255,255,255,.03);
            padding: 6px;
            display: grid;
            gap: 4px;
          }
          #gacha-modal .gacha-ui-edit-selected-item {
            font-family: Consolas, "Courier New", monospace;
            font-size: 11px;
            line-height: 1.2;
            opacity: .95;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          #gacha-modal .gacha-ui-edit-selected-outline {
            outline: 2px dashed #22d3ee !important;
            outline-offset: 2px;
          }
          #gacha-modal .gacha-ui-edit-hover-outline {
            outline: 1px dashed rgba(250, 204, 21, .95) !important;
            outline-offset: 1px;
          }
          @keyframes gachaBannerFade {
            from { opacity: 0; transform: translateX(8px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @media (max-width: 900px) and (orientation: landscape) {
            #gacha-modal .banner-featured { grid-template-columns: 1fr; }
            #gacha-modal .banner-card { max-width: 180px; }
            #gacha-modal .banner-card.large { max-width: 220px; }
          }
          @media (max-width: 1200px) {
            #gacha-modal .banner-hero.npc-layout .banner-card { max-width: 138px; }
          }
          @media (max-width: 900px) {
            #gacha-modal .banner-hero.npc-layout .banner-card { max-width: 118px; }
            #gacha-modal .banner-featured { gap: 8px; }
            #gacha-modal .wish-pull-btn { min-width: 116px; padding: 9px 10px; }
          }
        </style>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <h2 style="margin:0;font-size:18px;">\uD83C\uDFB0 Gachapon</h2>
          <div style="display:flex;align-items:center;gap:8px;">
            <button id="gachaUiEditToggle" style="
              background:#0f172a;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);
              padding:8px 10px;border-radius:10px;cursor:pointer;font-size:12px;
            ">UI Selecci\u00F3n</button>
            <button id="gachaClose" style="
              background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
              padding:8px 10px;border-radius:10px;cursor:pointer;
            ">\u2716</button>
          </div>
        </div>

        <div class="gacha-carousel-nav">
          <button id="gachaBannerPrev" class="gacha-carousel-navbtn prev" type="button">&#9664;</button>
          <div class="gacha-carousel-center">
            <div id="gachaCarouselTitle" class="gacha-carousel-title">Banner Limitado</div>
            <div id="gachaCarouselIndex" class="gacha-carousel-index">1 / 3</div>
          </div>
          <button id="gachaBannerNext" class="gacha-carousel-navbtn next" type="button">&#9654;</button>
        </div>

        <div class="gacha-carousel-pages">
          <div class="gacha-carousel-page is-active" data-banner-page="0" data-banner-label="Banner Limitado">
            <div class="banner-block">
              <div class="banner-head">
                <div class="banner-name">\u23F3 Banner Limitado</div>
                <span>Deseos: <b id="limCount">${this.wishesLimited}</b></span>
              </div>

              <div class="banner-hero">
                <div class="banner-featured solo centered-5">
                  ${this.renderBannerCard("lim_gold_2", { badge: "Promocional", large: true })}
                </div>
                <div class="banner-footer">
                  <div class="banner-prob">4\u2605 asegurado cada 10 \u2022 5\u2605: 0.6%</div>
                  <div class="wish-pull-row">
                    <button id="limWish1" class="wish-pull-btn lim alt" type="button"><img src="img/deseolimi.png" alt="Deseo limitado"><span>Deseo <span class="wish-q">x1</span></span></button>
                    <button id="limWish10" class="wish-pull-btn lim" type="button"><img src="img/deseolimi.png" alt="Deseo limitado"><span>Deseo <span class="wish-q">x10</span></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="gacha-carousel-page" data-banner-page="1" data-banner-label="Banner NPC">
            <div class="banner-block">
              <div class="banner-head">
                <div class="banner-name">\uD83E\uDDD1 Banner NPC</div>
                <span>Deseos: <b id="npcCount">${this.wishesLimited}</b></span>
              </div>

              <div class="banner-hero npc-layout">
                <div class="banner-featured centered-5">
                  ${this.renderBannerCard("npc_kotori_5", { badge: "5\u2605" })}
                  ${this.renderBannerCard("npc_minuscula_5", { badge: "5\u2605" })}
                  ${this.renderBannerCard("npc_ivybunny_5", { badge: "5\u2605" })}
                </div>
                <div class="banner-footer">
                  <div class="banner-prob">4\u2605 asegurado cada 10 \u2022 5\u2605: 0.6%</div>
                  <div class="wish-pull-row">
                    <button id="npcWish1" class="wish-pull-btn npc alt" type="button"><img src="img/deseolimi.png" alt="Deseo limitado"><span>Deseo <span class="wish-q">x1</span></span></button>
                    <button id="npcWish10" class="wish-pull-btn npc" type="button"><img src="img/deseolimi.png" alt="Deseo limitado"><span>Deseo <span class="wish-q">x10</span></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="gacha-carousel-page" data-banner-page="2" data-banner-label="Banner Permanente">
            <div class="banner-block">
              <div class="banner-head">
                <div class="banner-name">\uD83C\uDF1F Banner Permanente</div>
                <span>Deseos: <b id="permCount">${this.wishesPermanent}</b></span>
              </div>

              <div class="banner-hero">
                <div class="banner-featured centered-5">
                  ${this.renderBannerCard("perm_green_9")}
                  ${this.renderBannerCard("perm_red_9")}
                  ${this.renderBannerCard("perm_blue_9")}
                </div>
                <div class="banner-footer">
                  <div class="banner-prob">4\u2605 asegurado cada 10 \u2022 5\u2605: 0.6%</div>
                  <div class="wish-pull-row">
                    <button id="permWish1" class="wish-pull-btn perm alt" type="button"><img src="img/deseoperma.png" alt="Deseo permanente"><span>Deseo <span class="wish-q">x1</span></span></button>
                    <button id="permWish10" class="wish-pull-btn perm" type="button"><img src="img/deseoperma.png" alt="Deseo permanente"><span>Deseo <span class="wish-q">x10</span></span></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="gachaUiEditPanel" class="gacha-ui-edit-panel" aria-hidden="true">
          <div style="font-weight:700;">Ajuste UI (Gacha)</div>
          <div style="opacity:.82;">Click para seleccionar. <b>Shift+click</b> para multi-selecci\u00F3n.</div>
          <div class="gacha-ui-edit-row">
            <span style="opacity:.8;">Paso:</span>
            <button class="gacha-ui-edit-btn gacha-ui-step-btn active" data-gui-step="1" type="button">1px</button>
            <button class="gacha-ui-edit-btn gacha-ui-step-btn" data-gui-step="2" type="button">2px</button>
            <button class="gacha-ui-edit-btn gacha-ui-step-btn" data-gui-step="4" type="button">4px</button>
            <button class="gacha-ui-edit-btn gacha-ui-step-btn" data-gui-step="8" type="button">8px</button>
          </div>
          <div class="gacha-ui-edit-grid">
            <span></span>
            <button class="gacha-ui-edit-btn" data-gui-move="up" type="button">\u25B2</button>
            <span></span>
            <button class="gacha-ui-edit-btn" data-gui-move="left" type="button">\u25C0</button>
            <button class="gacha-ui-edit-btn" data-gui-move="down" type="button">\u25BC</button>
            <button class="gacha-ui-edit-btn" data-gui-move="right" type="button">\u25B6</button>
          </div>
          <div class="gacha-ui-edit-row">
            <button id="gachaUiEditClear" class="gacha-ui-edit-btn" type="button">Limpiar Sel</button>
            <button id="gachaUiEditCopy" class="gacha-ui-edit-btn" type="button">Copiar</button>
          </div>
          <div id="gachaUiEditInfo" style="opacity:.85;font-family:Consolas,monospace;font-size:11px;">Sel: 0</div>
          <div id="gachaUiEditList" class="gacha-ui-edit-selected-list"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const gachaWindowEl = modal.querySelector(".gacha-window");
    const uiEditToggleBtn = modal.querySelector("#gachaUiEditToggle");
    const uiEditPanel = modal.querySelector("#gachaUiEditPanel");
    const uiEditInfo = modal.querySelector("#gachaUiEditInfo");
    const uiEditList = modal.querySelector("#gachaUiEditList");
    const uiEditClearBtn = modal.querySelector("#gachaUiEditClear");
    const uiEditCopyBtn = modal.querySelector("#gachaUiEditCopy");

    const uiEditState = {
      enabled: false,
      step: 1,
      selected: new Set(),
      offsets: new WeakMap(),
      hoverEl: null
    };

    const UI_EDIT_PICK_SELECTOR = [
      ".wish-pull-btn",
      ".wish-pull-row",
      ".banner-prob",
      ".banner-name",
      ".banner-head",
      ".banner-footer",
      ".banner-card",
      ".banner-featured",
      ".gacha-carousel-navbtn",
      ".gacha-carousel-title",
      ".gacha-carousel-index",
      "[id$='Count']",
      "b",
      "span"
    ].join(", ");

    const getUiEditOffset = (el) => uiEditState.offsets.get(el) || { x: 0, y: 0 };

    const getUiEditLabel = (el) => {
      if (!(el instanceof HTMLElement)) return "unknown";
      const tag = el.tagName.toLowerCase();
      const idPart = el.id ? `#${el.id}` : "";
      const classes = Array.from(el.classList || [])
        .filter((c) => !/^gacha-ui-edit/.test(c))
        .slice(0, 2)
        .map((c) => `.${c}`)
        .join("");
      const text = (el.textContent || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 28);
      return `${tag}${idPart || classes} ${text ? `| ${text}` : ""}`.trim();
    };

    const getUiEditPath = (el) => {
      if (!(el instanceof HTMLElement) || !gachaWindowEl) return "";
      const parts = [];
      let cur = el;
      while (cur && cur !== gachaWindowEl) {
        if (!(cur instanceof HTMLElement)) break;
        const tag = cur.tagName.toLowerCase();
        if (cur.id) {
          parts.unshift(`${tag}#${cur.id}`);
          break;
        }
        const cls = Array.from(cur.classList || [])
          .filter((c) => !/^gacha-ui-edit/.test(c))
          .slice(0, 2)
          .join(".");
        let index = 1;
        let sib = cur;
        while ((sib = sib.previousElementSibling)) {
          if (sib.tagName === cur.tagName) index += 1;
        }
        parts.unshift(`${tag}${cls ? `.${cls}` : ""}:nth-of-type(${index})`);
        cur = cur.parentElement;
      }
      return parts.join(" > ");
    };

    const ensureUiEditBaseTransform = (el) => {
      if (!(el instanceof HTMLElement)) return "";
      if (!Object.prototype.hasOwnProperty.call(el.dataset, "gachaUiBaseTransform")) {
        const computed = getComputedStyle(el).transform;
        el.dataset.gachaUiBaseTransform = (computed && computed !== "none") ? computed : "";
      }
      return el.dataset.gachaUiBaseTransform || "";
    };

    const applyUiEditOffset = (el) => {
      if (!(el instanceof HTMLElement)) return;
      const base = ensureUiEditBaseTransform(el);
      const { x, y } = getUiEditOffset(el);
      const translate = `translate(${x}px, ${y}px)`;
      el.style.transform = base ? `${base} ${translate}` : translate;
      el.style.willChange = "transform";
      el.dataset.gachaUiNudgeX = String(x);
      el.dataset.gachaUiNudgeY = String(y);
    };

    const clearUiEditHover = () => {
      if (uiEditState.hoverEl && !uiEditState.selected.has(uiEditState.hoverEl)) {
        uiEditState.hoverEl.classList.remove("gacha-ui-edit-hover-outline");
      }
      uiEditState.hoverEl = null;
    };

    const updateUiEditPanel = () => {
      if (!uiEditInfo || !uiEditList) return;
      uiEditInfo.textContent = `Sel: ${uiEditState.selected.size} | Paso: ${uiEditState.step}px | Flechas teclado o panel`;
      const selectedArr = Array.from(uiEditState.selected);
      if (!selectedArr.length) {
        uiEditList.innerHTML = `<div class="gacha-ui-edit-selected-item" style="opacity:.65;">Sin selección</div>`;
        return;
      }
      uiEditList.innerHTML = selectedArr.map((el, idx) => {
        const off = getUiEditOffset(el);
        const label = getUiEditLabel(el)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `<div class="gacha-ui-edit-selected-item">${idx + 1}. ${label} | x:${off.x} y:${off.y}</div>`;
      }).join("");
    };

    const deselectAllUiEdit = () => {
      uiEditState.selected.forEach((el) => {
        if (el instanceof HTMLElement) el.classList.remove("gacha-ui-edit-selected-outline");
      });
      uiEditState.selected.clear();
      clearUiEditHover();
      updateUiEditPanel();
    };

    const toggleUiEditSelection = (el, additive) => {
      if (!(el instanceof HTMLElement)) return;
      if (!additive) deselectAllUiEdit();
      if (uiEditState.selected.has(el) && additive) {
        uiEditState.selected.delete(el);
        el.classList.remove("gacha-ui-edit-selected-outline");
      } else {
        uiEditState.selected.add(el);
        el.classList.add("gacha-ui-edit-selected-outline");
      }
      el.classList.remove("gacha-ui-edit-hover-outline");
      updateUiEditPanel();
    };

    const moveUiEditSelection = (dx, dy) => {
      if (!uiEditState.selected.size) return;
      uiEditState.selected.forEach((el) => {
        const prev = getUiEditOffset(el);
        const next = { x: prev.x + dx, y: prev.y + dy };
        uiEditState.offsets.set(el, next);
        applyUiEditOffset(el);
      });
      updateUiEditPanel();
    };

    const pickUiEditTarget = (rawTarget) => {
      if (!(rawTarget instanceof HTMLElement) || !gachaWindowEl) return null;
      if (rawTarget.closest("#gachaUiEditPanel") || rawTarget.closest("#gachaUiEditToggle")) return null;
      if (rawTarget.closest("#gachaClose")) return null;
      let el = rawTarget;
      while (el && el !== gachaWindowEl) {
        if (el.matches?.(UI_EDIT_PICK_SELECTOR)) return el;
        el = el.parentElement;
      }
      return null;
    };

    const onUiEditMouseMove = (e) => {
      if (!uiEditState.enabled) return;
      const picked = pickUiEditTarget(e.target);
      if (picked === uiEditState.hoverEl) return;
      clearUiEditHover();
      if (picked && !uiEditState.selected.has(picked)) {
        uiEditState.hoverEl = picked;
        picked.classList.add("gacha-ui-edit-hover-outline");
      }
    };

    const onUiEditClickCapture = (e) => {
      if (!uiEditState.enabled || !gachaWindowEl) return;
      const target = e.target;
      if (!(target instanceof HTMLElement)) return;
      if (!gachaWindowEl.contains(target)) return;
      if (target.closest("#gachaUiEditPanel") || target.closest("#gachaUiEditToggle")) return;
      // En modo selección, bloquea acciones normales del modal y solo selecciona.
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation?.();
      const picked = pickUiEditTarget(target);
      if (!picked) {
        if (!e.shiftKey) deselectAllUiEdit();
        return;
      }
      toggleUiEditSelection(picked, !!e.shiftKey);
    };

    const onUiEditKeyDown = (e) => {
      if (!uiEditState.enabled || !document.body.contains(modal)) return;
      const step = uiEditState.step;
      let dx = 0;
      let dy = 0;
      if (e.key === "ArrowUp") dy = -step;
      else if (e.key === "ArrowDown") dy = step;
      else if (e.key === "ArrowLeft") dx = -step;
      else if (e.key === "ArrowRight") dx = step;
      else if (e.key === "Escape") {
        setUiEditMode(false);
        return;
      } else {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      moveUiEditSelection(dx, dy);
    };

    const copyUiEditState = async () => {
      const moved = Array.from(modal.querySelectorAll("[data-gacha-ui-nudge-x], [data-gacha-ui-nudge-y]"))
        .filter((el) => el instanceof HTMLElement)
        .map((el) => ({
          label: getUiEditLabel(el),
          path: getUiEditPath(el),
          x: Number(el.dataset.gachaUiNudgeX || 0),
          y: Number(el.dataset.gachaUiNudgeY || 0)
        }))
        .filter((r) => r.x || r.y);
      const payload = {
        modal: "gacha",
        activeBanner: modal.querySelector(".gacha-carousel-page.is-active")?.getAttribute("data-banner-label") || "",
        moved
      };
      const text = JSON.stringify(payload, null, 2);
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        }
      } catch (_) {
        // fallback below
      }
      uiEditList.innerHTML = `<div class="gacha-ui-edit-selected-item" style="white-space:pre-wrap;">Copiado (${moved.length})\\n${text.slice(0, 420)}${text.length > 420 ? "..." : ""}</div>`;
    };

    const setUiEditMode = (enabled) => {
      uiEditState.enabled = !!enabled;
      if (!uiEditPanel || !uiEditToggleBtn) return;
      uiEditPanel.classList.toggle("is-open", uiEditState.enabled);
      uiEditPanel.setAttribute("aria-hidden", uiEditState.enabled ? "false" : "true");
      uiEditToggleBtn.style.background = uiEditState.enabled ? "#0ea5e9" : "#0f172a";
      uiEditToggleBtn.style.color = uiEditState.enabled ? "#06243a" : "#e5e7eb";
      uiEditToggleBtn.style.borderColor = uiEditState.enabled ? "rgba(14,165,233,.55)" : "rgba(255,255,255,.14)";
      uiEditToggleBtn.textContent = uiEditState.enabled ? "UI Selección: ON" : "UI Selección";
      if (!uiEditState.enabled) {
        clearUiEditHover();
      }
      updateUiEditPanel();
    };

    const destroyUiEditTool = () => {
      document.removeEventListener("keydown", onUiEditKeyDown, true);
      gachaWindowEl?.removeEventListener("mousemove", onUiEditMouseMove, true);
      gachaWindowEl?.removeEventListener("click", onUiEditClickCapture, true);
      deselectAllUiEdit();
    };

    gachaWindowEl?.addEventListener("mousemove", onUiEditMouseMove, true);
    gachaWindowEl?.addEventListener("click", onUiEditClickCapture, true);
    document.addEventListener("keydown", onUiEditKeyDown, true);
    uiEditToggleBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setUiEditMode(!uiEditState.enabled);
    });
    uiEditClearBtn?.addEventListener("click", (e) => {
      e.preventDefault();
      deselectAllUiEdit();
    });
    uiEditCopyBtn?.addEventListener("click", async (e) => {
      e.preventDefault();
      await copyUiEditState();
    });
    uiEditPanel?.querySelectorAll("[data-gui-step]")?.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const next = Number(btn.getAttribute("data-gui-step") || "1");
        if (!Number.isFinite(next) || next <= 0) return;
        uiEditState.step = next;
        uiEditPanel.querySelectorAll(".gacha-ui-step-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateUiEditPanel();
      });
    });
    uiEditPanel?.querySelectorAll("[data-gui-move]")?.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const dir = btn.getAttribute("data-gui-move");
        const s = uiEditState.step;
        if (dir === "up") moveUiEditSelection(0, -s);
        else if (dir === "down") moveUiEditSelection(0, s);
        else if (dir === "left") moveUiEditSelection(-s, 0);
        else if (dir === "right") moveUiEditSelection(s, 0);
      });
    });
    updateUiEditPanel();

    // abrir anim
    requestAnimationFrame(() => {
      const win = modal.querySelector(".gacha-window");
      if (!win) return;
      win.style.opacity = "1";
      win.style.transform = "translateY(0) scale(1)";
    });

    // cerrar
    const close = () => {
      destroyUiEditTool();
      const win = modal.querySelector(".gacha-window");
      if (win) {
        win.style.opacity = "0";
        win.style.transform = "translateY(12px) scale(.98)";
        setTimeout(() => modal.remove(), 180);
      } else {
        modal.remove();
      }
    };

    modal.querySelector("#gachaClose").onclick = close;

    // click afuera
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    // Pulls: NO dan oro/exp directamente (solo items)
    const pull = (type, n) => {
      if (this.isWishAnimating) return;
      const useField = (type === "perm") ? "wishesPermanent" : "wishesLimited";
      if (this[useField] < n) return;

      this[useField] -= n;
      const wishLabel = type === "perm"
        ? "Deseo Permanente"
        : (type === "npc" ? "Deseo NPC" : "Deseo Limitado");
      this.recordYapaWishMovement("out", wishLabel, n);

      const results = [];
      const DOUBLE_FIVE_CHANCE = 0.0002; // 0.02%
      for (let i = 0; i < n; i++) {
        const doubleFive = Phaser.Math.FloatBetween(0, 1) < DOUBLE_FIVE_CHANCE;
        if (doubleFive) {
          if (type === "lim") {
            this.limPity4 = 0;
            this.limPity5 = 0;
          } else if (type === "npc") {
            this.npcPity4 = 0;
            this.npcPity5 = 0;
          } else {
            this.permPity4 = 0;
            this.permPity5 = 0;
          }

          const firstKey = this.pickFiveStarKey(type);
          const secondKey = this.pickFiveStarKey(type);

          results.push({ rarity: 5, itemKey: firstKey });
          results.push({ rarity: 5, itemKey: secondKey });
          this.addItem(firstKey, 1);
          this.addItem(secondKey, 1);
          continue;
        }

        const { rarity, itemKey } = this.rollWish(type);
        results.push({ rarity, itemKey });
        this.addItem(itemKey, 1);
      }

      this.refreshUI();
      this.updateModalCounts();
      this.runWishAnimation(results, type);
    };

    modal.querySelector("#permWish1").onclick = () => pull("perm", 1);
    modal.querySelector("#permWish10").onclick = () => pull("perm", 10);

    modal.querySelector("#limWish1").onclick = () => pull("lim", 1);
    modal.querySelector("#limWish10").onclick = () => pull("lim", 10);
    modal.querySelector("#npcWish1").onclick = () => pull("npc", 1);
    modal.querySelector("#npcWish10").onclick = () => pull("npc", 10);

    const pages = Array.from(modal.querySelectorAll("[data-banner-page]"));
    const carouselTitle = modal.querySelector("#gachaCarouselTitle");
    const carouselIndex = modal.querySelector("#gachaCarouselIndex");
    let activePage = 0;
    const setPage = (nextIdx) => {
      if (!pages.length) return;
      const len = pages.length;
      activePage = ((nextIdx % len) + len) % len;
      pages.forEach((page, idx) => page.classList.toggle("is-active", idx === activePage));
      const active = pages[activePage];
      if (carouselTitle) {
        carouselTitle.textContent = active?.getAttribute("data-banner-label") || "Banner";
      }
      if (carouselIndex) {
        carouselIndex.textContent = `${activePage + 1} / ${len}`;
      }
    };
    modal.querySelector("#gachaBannerPrev")?.addEventListener("click", () => setPage(activePage - 1));
    modal.querySelector("#gachaBannerNext")?.addEventListener("click", () => setPage(activePage + 1));
    setPage(0);
  }

  renderInventoryIntoModal() {
    const modal = document.getElementById("gacha-modal");
    if (!modal) return;

    const list = modal.querySelector("#invList");
    if (!list) return;

    // reusa el render del inventario
    this.renderInventoryIntoContainer(list);
  }

  updateModalCounts() {
    const modal = document.getElementById("gacha-modal");
    if (modal) {
      const perm = modal.querySelector("#permCount");
      const lim = modal.querySelector("#limCount");
      const npc = modal.querySelector("#npcCount");

      if (perm) perm.textContent = String(this.wishesPermanent);
      if (lim) lim.textContent = String(this.wishesLimited);
      if (npc) npc.textContent = String(this.wishesLimited);

      // actualizar contadores de inventario si est\u00E1n
      const invEls = modal.querySelectorAll("[data-inv]");
      invEls.forEach((el) => {
        const key = el.getAttribute("data-inv");
        if (!key) return;
        el.textContent = String(this.inventory[key] || 0);
      });

      // re-render de lista (para que agregue items nuevos aunque no exist\u00EDan)
      this.renderInventoryIntoModal();
    }

    // tambi\u00E9n actualiza inventario standalone si est\u00E1 abierto
    const invModal = document.getElementById("inventory-modal");
    if (invModal) {
      const list = invModal.querySelector("#invList");
      this.renderInventoryIntoContainer(list);
    }

    const roadInvModal = document.getElementById("road-inventory-modal");
    if (roadInvModal) {
      const stock = roadInvModal.querySelector("#roadInvGlobalCount");
      if (stock) stock.textContent = `x ${this.getRoadSharedCount()}`;
      const list = roadInvModal.querySelector("#roadInvList");
      this.renderRoadInventoryIntoContainer(list);
    }

    const npcInvModal = document.getElementById("npc-inventory-modal");
    if (npcInvModal) {
      const list = npcInvModal.querySelector("#npcInvList");
      this.renderNpcInventoryIntoContainer(list);
    }

    const goldStoreModal = document.getElementById("gold-store-modal");
    if (goldStoreModal) {
      this.renderGoldStoreModal(goldStoreModal);
    }

    this.renderYapaStoreOverlay(modal);
    this.renderYapaModalData();
  }

  // =========================
  // ECONOMIA SIMPLE
  // =========================
  addGold(v) {
    this.gold += v;
    this.refreshUI();
    this.updateModalCounts();
  }

  addPermanentWishes(v) {
    this.wishesPermanent += v;
    this.refreshUI();
    this.updateModalCounts();
  }

  addLimitedWishes(v) {
    this.wishesLimited += v;
    this.refreshUI();
    this.updateModalCounts();
  }

  addYapas(v, detail = "Usuario", kind = "in") {
    const amount = Math.max(0, Math.round((Number(v) || 0) * 100) / 100);
    if (amount <= 0) return;
    this.yapas = Math.round(((Number(this.yapas) || 0) + amount) * 100) / 100;
    this.recordYapaMovement(amount, detail, kind);
    this.refreshUI();
    this.updateModalCounts();
  }
}





















