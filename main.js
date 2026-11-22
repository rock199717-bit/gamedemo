// =========================
// MAPA (10 veces mas grande)
// =========================
const MAP_W = 700;
const MAP_H = 700;
const MAP_CENTER_R = Math.floor(MAP_H / 2);
const MAP_CENTER_C = Math.floor(MAP_W / 2);

const TILE_W = 64;
const TILE_H = 32;

// =========================
// WORLD PALETTE (grid/suelo)
// =========================
const WORLD_BG_GRASS_COLOR = 0x79b44a;
const WORLD_TILE_GRASS_COLOR = 0x84c253;
const WORLD_BG_GRID_LINE_COLOR = 0x5e8f3c;
const WORLD_GRID_LINE_COLOR = 0x6ea646;
const WORLD_MAP_BORDER_COLOR = 0x4f7f2b;
const ROADKOTO_PIECES = 45;
const ROADKOTO_ISO_CHILD_ANGLE = 45;
const ROADKOTO_ISO_PARENT_SCALE_Y = 0.5;
const DAY_CYCLE_LOCAL_OFFSET_HOUR = 7; // 07:00 inicia el tramo de "dia" del ciclo visual
const DAY_CYCLE_DURATION_MS = 1440000; // 24 minutos por ciclo completo (24h simuladas)
const DAY_CYCLE_VISUAL_SMOOTH_MS = 900;
const DAY_CYCLE_DEBUG_FAST_FORWARD_TARGET_MS = 2600;
const DAY_CYCLE_DEBUG_FAST_FORWARD_MIN_SPEED = 12;
const DAY_CYCLE_DEBUG_FAST_FORWARD_MAX_SPEED = 180;
const DAY_CYCLE_KEYFRAMES = [
  { t: 0.00, tintColor: 0xfff1cf, tintAlpha: 0.00, shadeColor: 0x0a1224, shadeAlpha: 0.00 }, // dia
  { t: 0.20, tintColor: 0xffe0ad, tintAlpha: 0.08, shadeColor: 0x291b13, shadeAlpha: 0.05 }, // sol suave
  { t: 0.34, tintColor: 0xffa24a, tintAlpha: 0.20, shadeColor: 0x2b170e, shadeAlpha: 0.10 }, // tarde
  { t: 0.46, tintColor: 0xff7f1f, tintAlpha: 0.30, shadeColor: 0x2a130d, shadeAlpha: 0.14 }, // tarde fuerte naranja
  { t: 0.58, tintColor: 0x5279c8, tintAlpha: 0.18, shadeColor: 0x071328, shadeAlpha: 0.34 }, // noche
  { t: 0.70, tintColor: 0x355da8, tintAlpha: 0.21, shadeColor: 0x03163b, shadeAlpha: 0.50 }, // madrugada azul
  { t: 0.88, tintColor: 0x2b4f96, tintAlpha: 0.22, shadeColor: 0x03163d, shadeAlpha: 0.56 }, // madrugada profunda
  { t: 0.96, tintColor: 0x6f90d2, tintAlpha: 0.12, shadeColor: 0x081d3f, shadeAlpha: 0.28 }, // amanecer
  { t: 1.00, tintColor: 0xfff1cf, tintAlpha: 0.00, shadeColor: 0x0a1224, shadeAlpha: 0.00 }  // cierre ciclo
];
const DAY_CYCLE_DEBUG_JUMP_PHASES = [
  { key: "manana", progress: 0.12 },
  { key: "tarde", progress: 0.36 },
  { key: "noche", progress: 0.54 },
  { key: "madrugada", progress: 0.78 }
];
// =========================
// DECOR AURA (Casa Decorativa green_1)
// =========================
const DECOR_AURA_MAX_LEVEL = 5;
const DECOR_AURA_MAX_STACKS = 4;
const DECOR_AURA_BUILD_REDUCTION_BASE = 0.01; // -1% construccion base
const DECOR_AURA_BUILD_REDUCTION_PER_LEVEL = 0.01; // +1% por nivel
const DECOR_AURA_BUILD_REDUCTION_CAP = 0.05; // -5% construccion max
const DECOR_AURA_PROD_BOOST_BASE = 0.02; // +2% oro/exp base
const DECOR_AURA_PROD_BOOST_PER_LEVEL = 0.02; // +2% por nivel
const DECOR_AURA_PROD_BOOST_CAP = 0.12; // +12% oro/exp max
// Radio base mas amplio y crecimiento por evolucion.
const DECOR_AURA_RADIUS_BASE_TILES = 3.4;
const DECOR_AURA_RADIUS_PER_LEVEL_TILES = 0.7;
// =========================
// NPC SLOTS / BUFFS
// =========================
const NPC_SLOT_MAX = 5;
const NPC_SLOT_MAX_SPECIAL_BUILDING = 4;
const CASA_CONERA_RESIDENT_BASE = 5;
const CASA_CONERA_RESIDENT_MAX = 10;
const NPC_BUFF_BUILD_BASE = 0.010;
const NPC_BUFF_PROD_BASE = 0.012;
const NPC_BUFF_REWARD_BASE = 0.030;
const NPC_BUFF_PRODUCER_AMOUNT_BASE = 0.050;
const NPC_BUFF_PRODUCER_PREMIUM_BASE = 0.006;
const NPC_BUFF_EVO_STEP = 0.20; // +20% poder por nivel evo NPC
const NPC_BUFF_RARITY_FACTOR = {
  1: 0.45,
  2: 0.7,
  3: 1.0,
  4: 1.45,
  5: 2.0
};
const NPC_BUFF_BUILD_CAP = 0.45;
const NPC_BUFF_PROD_CAP = 0.55;
const NPC_BUFF_REWARD_CAP = 2.50;
const NPC_BUFF_PRODUCER_AMOUNT_CAP = 1.20;
const NPC_BUFF_PRODUCER_PREMIUM_CAP = 0.25;
const PRODUCER_PREMIUM_MAX_TOTAL_CHANCE = 0.35;

// =========================
// BUILDING TYPES (WORLD)
// =========================
const BUILDING_TYPES = {
  // [OK] verdes basicos (lo que ya tenias "de prueba")
  green_1: {
    key: "green_1",
    label: "Casa Decorativa",
    size: 1,
    fill: 0x22c55e,
    border: 0x22c55e,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  green_temp_outline_1: {
    key: "green_temp_outline_1",
    label: "Casa Decorativa Temp",
    size: 1,
    fill: 0x22c55e,
    border: 0x22c55e,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  producer_food_1x1: {
    key: "producer_food_1x1",
    label: "Productora Alimentos 1x1",
    size: 1,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  producer_drink_1x1: {
    key: "producer_drink_1x1",
    label: "Productora Bebidas 1x1",
    size: 1,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  producer_snack_1x1: {
    key: "producer_snack_1x1",
    label: "Productora Snacks 1x1",
    size: 1,
    fill: 0xa855f7,
    border: 0xc084fc,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  road_main_2x2: {
    key: "road_main_2x2",
    label: "Carretera 2x2",
    size: 2,
    fill: 0x6b7280,
    border: 0x9ca3af,
    buildSeconds: 0,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  green_2: {
    key: "green_2",
    label: "TAMBA+",
    size: 2,
    fill: 0x22c55e,
    border: 0x22c55e,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
    glow: false
  },
  casa_conera_4: {
    key: "casa_conera_4",
    label: "Casa Conera",
    size: 4,
    fill: 0xb45309,
    border: 0xf59e0b,
    buildSeconds: 16,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  green_3: {
    key: "green_3",
    label: "Verde 3x3",
    size: 3,
    fill: 0x22c55e,
    border: 0x22c55e,
    buildSeconds: 12,
    prodSeconds: 60,
    reward: { exp: 4, gold: 40 },
    glow: false
  },
  // [OK] VERDE 4x4 (4*)
  green_4: {
    key: "green_4",
    label: "Verde 4x4",
    size: 4,
    fill: 0x16a34a,
    border: 0x22c55e,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  // [OK] ROJOS (1*/2*/3*/4*)
  red_1: {
    key: "red_1",
    label: "Productora Alimentos 1x1",
    size: 1,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  red_2: {
    key: "red_2",
    label: "Rojo 2x2",
    size: 2,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
    glow: false
  },
  red_3: {
    key: "red_3",
    label: "Rojo 3x3",
    size: 3,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 12,
    prodSeconds: 60,
    reward: { exp: 4, gold: 40 },
    glow: false
  },
  // [OK] ROJO 4x4 (4*)
  red_4: {
    key: "red_4",
    label: "Rojo 4x4",
    size: 4,
    fill: 0xb91c1c,
    border: 0xef4444,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  // [OK] AZULES (1*/2*/3*/4*)
  blue_1: {
    key: "blue_1",
    label: "Productora Bebidas 1x1",
    size: 1,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  blue_2: {
    key: "blue_2",
    label: "Azul 2x2",
    size: 2,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
    glow: false
  },
  blue_3: {
    key: "blue_3",
    label: "Azul 3x3",
    size: 3,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 12,
    prodSeconds: 60,
    reward: { exp: 4, gold: 40 },
    glow: false
  },
  // [OK] AZUL 4x4 (4*)
  blue_4: {
    key: "blue_4",
    label: "Azul 4x4",
    size: 4,
    fill: 0x1d4ed8,
    border: 0x60a5fa,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  // [OK] AMARILLOS (1*/2*/3*/4*)
  yellow_1: {
    key: "yellow_1",
    label: "Amarillo 1x1",
    size: 1,
    fill: 0xfacc15,
    border: 0xfde047,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  yellow_2: {
    key: "yellow_2",
    label: "Amarillo 2x2",
    size: 2,
    fill: 0xfacc15,
    border: 0xfde047,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
    glow: false
  },
  yellow_3: {
    key: "yellow_3",
    label: "Amarillo 3x3",
    size: 3,
    fill: 0xfacc15,
    border: 0xfde047,
    buildSeconds: 12,
    prodSeconds: 60,
    reward: { exp: 4, gold: 40 },
    glow: false
  },
  yellow_4: {
    key: "yellow_4",
    label: "Amarillo 4x4",
    size: 4,
    fill: 0xeab308,
    border: 0xfacc15,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  // [OK] NARANJAS (1*/2*/3*/4*)
  orange_1: {
    key: "orange_1",
    label: "Naranja 1x1",
    size: 1,
    fill: 0xfb923c,
    border: 0xfdba74,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  orange_2: {
    key: "orange_2",
    label: "Naranja 2x2",
    size: 2,
    fill: 0xfb923c,
    border: 0xfdba74,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
    glow: false
  },
  orange_3: {
    key: "orange_3",
    label: "Naranja 3x3",
    size: 3,
    fill: 0xf97316,
    border: 0xfb923c,
    buildSeconds: 12,
    prodSeconds: 60,
    reward: { exp: 4, gold: 40 },
    glow: false
  },
  orange_4: {
    key: "orange_4",
    label: "Naranja 4x4",
    size: 4,
    fill: 0xea580c,
    border: 0xfb923c,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  // [OK] ROSAS (1*/2*/3*/4*)
  pink_1: {
    key: "pink_1",
    label: "Rosa 1x1",
    size: 1,
    fill: 0xf472b6,
    border: 0xf9a8d4,
    buildSeconds: 5,
    prodSeconds: 0,
    reward: { exp: 0, gold: 0 },
    glow: false
  },
  pink_2: {
    key: "pink_2",
    label: "Rosa 2x2",
    size: 2,
    fill: 0xf472b6,
    border: 0xf9a8d4,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
    glow: false
  },
  pink_3: {
    key: "pink_3",
    label: "Rosa 3x3",
    size: 3,
    fill: 0xec4899,
    border: 0xf472b6,
    buildSeconds: 12,
    prodSeconds: 60,
    reward: { exp: 4, gold: 40 },
    glow: false
  },
  pink_4: {
    key: "pink_4",
    label: "Rosa 4x4",
    size: 4,
    fill: 0xdb2777,
    border: 0xec4899,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },

  // [OK] VERDE 9x9 (5* permanente)
  perm_green_9: {
    key: "perm_green_9",
    label: "Verde 9x9",
    size: 9,
    fill: 0x16a34a,
    border: 0x22c55e,
    buildSeconds: 120,     // 2 min
    prodSeconds: 60,       // produce cada 1 min
    reward: { exp: 10, gold: 150 },
    glow: false
  },
  // [OK] AZUL 9x9 (5* permanente)
  perm_blue_9: {
    key: "perm_blue_9",
    label: "Azul 9x9",
    size: 9,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 120,     // 2 min
    prodSeconds: 60,       // produce cada 1 min
    reward: { exp: 10, gold: 150 },
    glow: false
  },
  // [OK] ROJO 9x9 (5* permanente)
  perm_red_9: {
    key: "perm_red_9",
    label: "Rojo 9x9",
    size: 9,
    fill: 0x991b1b,
    border: 0xef4444,
    buildSeconds: 120,     // 2 min
    prodSeconds: 60,       // produce cada 1 min
    reward: { exp: 10, gold: 150 },
    glow: false
  },

  // [OK] DORADO 5* (limitado) con brillo
  lim_gold_2: {
    key: "lim_gold_2",
    label: "Dorado 9x9",
    size: 9,
    fill: 0xfbbf24,
    border: 0xf59e0b,
    buildSeconds: 60,      // rapida (base) -> 5* lo reduce mas
    prodSeconds: 120,      // semi lenta (base) -> 5* lo hace mas lento
    reward: { exp: 60, gold: 300 }, // muy alta (base) -> 5* la triplica
    glow: true
  }
};

// =========================
// RARITY MODS
// buildSeconds, prodSeconds, reward multipliers
// =========================
const RARITY_MODS = {
  1: { build: 0.6, prod: 1.25, reward: 0.6 },
  2: { build: 0.8, prod: 1.0,  reward: 1.0 },
  3: { build: 1.2, prod: 0.9,  reward: 1.4 },
  4: { build: 0.7, prod: 1.15, reward: 2.0 },
  5: { build: 0.6, prod: 1.3,  reward: 3.0 }
};

// =========================
// PRODUCER HOUSES (1x1)
// - Solo fabrican materiales
// - No usan oro/exp ni buffos
// =========================
const PRODUCER_TYPE_GROUP = {
  red_1: "food",
  blue_1: "drink",
  producer_food_1x1: "food", // legacy compat
  producer_drink_1x1: "drink", // legacy compat
  producer_snack_1x1: "snack"
};

const PRODUCER_RARITY_MULT = {
  common: 1.0,
  rare: 1.6,
  epic: 2.4,
  legendary: 3.5
};

const PRODUCER_RARITY_LABEL = {
  common: "Comun",
  rare: "Raro",
  epic: "Epico",
  legendary: "Legendario"
};

const PRODUCER_EVOLUTION_MAX_LEVEL = 5;
const PRODUCER_EVOLUTION_PREMIUM_MAX_CHANCE = 0.10;
const PRODUCER_EVOLUTION_AMOUNT_STEP = 0.20; // +20% por nivel
const PRODUCER_EVOLUTION_TIME_STEP = 0.08;   // -8% por nivel
const PRODUCER_EVOLUTION_DUPE_COST = [1, 1, 1, 1, 1];
const PRODUCER_EVOLUTION_UPGRADE_COST = [1, 2, 3, 4, 5];

const PRODUCER_UPGRADE_ITEM_BY_GROUP = {
  food: "upgrade_prod_food",
  drink: "upgrade_prod_drink",
  snack: "upgrade_prod_snack"
};

const PRODUCER_UPGRADE_ITEM_LABEL = {
  upgrade_prod_food: "Mejora Produccion (Alimentos)",
  upgrade_prod_drink: "Mejora Produccion (Bebidas)",
  upgrade_prod_snack: "Mejora Produccion (Snacks)"
};

// Minimarket (green_2): requiere un set de materiales una sola vez para activar produccion.
const MINIMARKET_GREEN2_UNLOCK_REQUIREMENTS = [
  { key: "food_empanada_carne", amount: 5 },
  { key: "drink_limonada", amount: 5 },
  { key: "snack_papas_fritas", amount: 5 }
];

const PRODUCER_RECIPES = {
  food: [
    { key: "food_empanada_carne", label: "Empanada de carne", rarity: "common", baseSeconds: 12, amount: 1, unlockLevel: 0 },
    { key: "food_hotdog_simple", label: "Hot dog simple", rarity: "common", baseSeconds: 13, amount: 1, unlockLevel: 0 },
    { key: "food_sandwich_pollo", label: "Sandwich de pollo", rarity: "common", baseSeconds: 14, amount: 1, unlockLevel: 0 },
    { key: "food_arroz_huevo", label: "Arroz con huevo", rarity: "common", baseSeconds: 15, amount: 1, unlockLevel: 0 },

    { key: "food_hamburguesa_clasica", label: "Hamburguesa clasica", rarity: "rare", baseSeconds: 20, amount: 1, unlockLevel: 1 },
    { key: "food_salchipapa", label: "Salchipapa", rarity: "rare", baseSeconds: 22, amount: 1, unlockLevel: 1 },
    { key: "food_pizza_personal", label: "Pizza personal", rarity: "rare", baseSeconds: 24, amount: 1, unlockLevel: 1 },
    { key: "food_pollo_broaster_combo", label: "Combo pollo broaster", rarity: "rare", baseSeconds: 26, amount: 1, unlockLevel: 1 },

    { key: "food_hamburguesa_doble", label: "Hamburguesa doble", rarity: "epic", baseSeconds: 30, amount: 1, unlockLevel: 2 },
    { key: "food_lomo_saltado", label: "Lomo saltado", rarity: "epic", baseSeconds: 32, amount: 1, unlockLevel: 2 },
    { key: "food_burrito_cargado", label: "Burrito cargado", rarity: "epic", baseSeconds: 34, amount: 1, unlockLevel: 2 },
    { key: "food_lasana_casera", label: "Lasana casera", rarity: "epic", baseSeconds: 36, amount: 1, unlockLevel: 2 },

    { key: "food_hamburguesa_suprema", label: "Hamburguesa suprema", rarity: "legendary", baseSeconds: 42, amount: 1, unlockLevel: 3 },
    { key: "food_parrilla_mixta", label: "Parrilla mixta", rarity: "legendary", baseSeconds: 46, amount: 1, unlockLevel: 3 },
    { key: "food_pizza_familiar_especial", label: "Pizza familiar especial", rarity: "legendary", baseSeconds: 48, amount: 1, unlockLevel: 3 },
    { key: "food_banquete_criollo", label: "Banquete criollo", rarity: "legendary", baseSeconds: 52, amount: 1, unlockLevel: 3 }
  ],
  drink: [
    { key: "drink_limonada", label: "Limonada", rarity: "common", baseSeconds: 12, amount: 1, unlockLevel: 0 },
    { key: "drink_chicha_morada", label: "Chicha morada", rarity: "common", baseSeconds: 13, amount: 1, unlockLevel: 0 },
    { key: "drink_cafe_latte", label: "Cafe latte", rarity: "common", baseSeconds: 14, amount: 1, unlockLevel: 0 },
    { key: "drink_te_helado", label: "Te helado", rarity: "common", baseSeconds: 15, amount: 1, unlockLevel: 0 },

    { key: "drink_gaseosa_combo", label: "Gaseosa combo", rarity: "rare", baseSeconds: 20, amount: 1, unlockLevel: 1 },
    { key: "drink_malteada_vainilla", label: "Malteada vainilla", rarity: "rare", baseSeconds: 22, amount: 1, unlockLevel: 1 },
    { key: "drink_jugo_natural_mix", label: "Jugo natural mix", rarity: "rare", baseSeconds: 24, amount: 1, unlockLevel: 1 },
    { key: "drink_frappe_cafe", label: "Frappe de cafe", rarity: "rare", baseSeconds: 26, amount: 1, unlockLevel: 1 },

    { key: "drink_malteada_especial", label: "Malteada especial", rarity: "epic", baseSeconds: 30, amount: 1, unlockLevel: 2 },
    { key: "drink_smoothie_proteico", label: "Smoothie proteico", rarity: "epic", baseSeconds: 32, amount: 1, unlockLevel: 2 },
    { key: "drink_bubble_tea", label: "Bubble tea", rarity: "epic", baseSeconds: 34, amount: 1, unlockLevel: 2 },
    { key: "drink_mocaccino_frio", label: "Mocaccino frio", rarity: "epic", baseSeconds: 36, amount: 1, unlockLevel: 2 },

    { key: "drink_refresco_supremo", label: "Refresco supremo", rarity: "legendary", baseSeconds: 42, amount: 1, unlockLevel: 3 },
    { key: "drink_fusion_tropical_real", label: "Fusion tropical real", rarity: "legendary", baseSeconds: 46, amount: 1, unlockLevel: 3 },
    { key: "drink_elixir_energetico", label: "Elixir energetico", rarity: "legendary", baseSeconds: 48, amount: 1, unlockLevel: 3 },
    { key: "drink_bebida_festival", label: "Bebida festival", rarity: "legendary", baseSeconds: 52, amount: 1, unlockLevel: 3 }
  ],
  snack: [
    { key: "snack_papas_fritas", label: "Papas fritas", rarity: "common", baseSeconds: 12, amount: 1, unlockLevel: 0 },
    { key: "snack_galletas_mantequilla", label: "Galletas de mantequilla", rarity: "common", baseSeconds: 13, amount: 1, unlockLevel: 0 },
    { key: "snack_cancha_tostada", label: "Cancha tostada", rarity: "common", baseSeconds: 14, amount: 1, unlockLevel: 0 },
    { key: "snack_palitos_salados", label: "Palitos salados", rarity: "common", baseSeconds: 15, amount: 1, unlockLevel: 0 },

    { key: "snack_nachos_queso", label: "Nachos con queso", rarity: "rare", baseSeconds: 20, amount: 1, unlockLevel: 1 },
    { key: "snack_alitas_bbq", label: "Alitas BBQ", rarity: "rare", baseSeconds: 22, amount: 1, unlockLevel: 1 },
    { key: "snack_tequenos", label: "Tequenos", rarity: "rare", baseSeconds: 24, amount: 1, unlockLevel: 1 },
    { key: "snack_mix_crujiente", label: "Mix crujiente", rarity: "rare", baseSeconds: 26, amount: 1, unlockLevel: 1 },

    { key: "snack_combo_nachos_supremo", label: "Combo nachos supremo", rarity: "epic", baseSeconds: 30, amount: 1, unlockLevel: 2 },
    { key: "snack_boneless_picante", label: "Boneless picante", rarity: "epic", baseSeconds: 32, amount: 1, unlockLevel: 2 },
    { key: "snack_piqueo_mixto", label: "Piqueo mixto", rarity: "epic", baseSeconds: 34, amount: 1, unlockLevel: 2 },
    { key: "snack_rollitos_rellenos", label: "Rollitos rellenos", rarity: "epic", baseSeconds: 36, amount: 1, unlockLevel: 2 },

    { key: "snack_caja_festival", label: "Caja festival", rarity: "legendary", baseSeconds: 42, amount: 1, unlockLevel: 3 },
    { key: "snack_piqueo_real", label: "Piqueo real", rarity: "legendary", baseSeconds: 46, amount: 1, unlockLevel: 3 },
    { key: "snack_combo_party_supremo", label: "Combo party supremo", rarity: "legendary", baseSeconds: 48, amount: 1, unlockLevel: 3 },
    { key: "snack_bandeja_premium", label: "Bandeja premium", rarity: "legendary", baseSeconds: 52, amount: 1, unlockLevel: 3 }
  ]
};

// =========================
// BONO YAPA (1?/2?/3?)
// =========================
const YAPA_BONUS_INTERVAL_MS = 15 * 60 * 1000; // cada 15 min
const YAPA_BONUS_DURATION_MS = 60 * 1000;      // dura 1 min
const YAPA_BONUS_CHANCE = 0.0002;              // 0.02%

// =========================
// TRAFICO / NPC (placeholder)
// =========================
const TRAFFIC_ENABLE_CARS = false;
const TRAFFIC_MAX_CARS = 6;
const TRAFFIC_MAX_NPCS = Infinity;
const TRAFFIC_NPC_ZONE_MAX_COUNT = Infinity;
const TRAFFIC_NPC_ZONE_RADIUS_TILES = 12;
const TRAFFIC_NPC_ZONE_RELOCATE_MIN_DIST_TILES = 14;
const TRAFFIC_NPC_ZONE_RELOCATE_TRIES = 28;
const TRAFFIC_NPC_CAPACITY_MSG_COOLDOWN_MS = 4200;
const TRAFFIC_NPC_CAMERA_FADE_MARGIN_PX = 92;
const TRAFFIC_NPC_CAMERA_FADE_LERP = 0.18;
const TRAFFIC_CAR_SPEED_TILES = 1.65;
const TRAFFIC_NPC_SPEED_TILES = 0.56;
const TRAFFIC_NPC_SIDE_OFFSET_TILES = 0;
const TRAFFIC_NPC_BLOCKED_SIDE_OFFSET_TILES = 0;
const TRAFFIC_NPC_SIDE_LERP = 0.18;
const TRAFFIC_NPC_DIR_LERP = 0.22;
const TRAFFIC_NPC_OCCLUSION_DEPTH_MARGIN = 0.06;
const TRAFFIC_NPC_OCCLUSION_SCAN_RANGE = 2;
const TRAFFIC_NPC_OCCLUSION_FRONT_EPS = 0.12;
const TRAFFIC_NPC_CROSS_WAIT_MIN_MS = 900;
const TRAFFIC_NPC_CROSS_WAIT_MAX_MS = 2200;
const TRAFFIC_CAR_NEAR_RADIUS_TILES = 2.4;
const TRAFFIC_NPC_SIDE_SWITCH_TIMEOUT_MS = 2600;
const TRAFFIC_NPC_STUCK_REPATH_MS = 2400;
const TRAFFIC_NPC_STUCK_EPS_TILES = 0.025;
const TRAFFIC_NPC_OFFROAD_GRACE_MS = 2200;
const TRAFFIC_NPC_SCREEN_LERP = 0.26;
const TRAFFIC_NPC_TURN_PAUSE_MIN_MS = 180;
const TRAFFIC_NPC_TURN_PAUSE_MAX_MS = 320;
const TRAFFIC_NPC_SHOP_ENTER_CHANCE_BASE = 0.18;
const TRAFFIC_NPC_SHOP_ENTER_CHANCE_PER_SHOP = 0.04;
const TRAFFIC_NPC_SHOP_ENTER_CHANCE_CAP = 0.88;
const TRAFFIC_NPC_SHOP_DWELL_MIN_MS = 4200;
const TRAFFIC_NPC_SHOP_DWELL_MAX_MS = 10800;
const TRAFFIC_NPC_SHOP_RETRY_MIN_MS = 1800;
const TRAFFIC_NPC_SHOP_RETRY_MAX_MS = 4200;
const TRAFFIC_NPC_SHOP_YAPA_DROP_CHANCE = 0.10;
const TRAFFIC_NPC_SHOP_YAPA_HALF_DROP_CHANCE = 0.50;
const TRAFFIC_NPC_SHOP_FADE_MS = 260;
const TRAFFIC_NPC_HOME_FADE_MS = 340;
const TRAFFIC_NPC_WAKE_STAGGER_MIN_MS = 600;
const TRAFFIC_NPC_WAKE_STAGGER_MAX_MS = 24000;
const TRAFFIC_NPC_BACK_COLOR = 0xef4444;
const TRAFFIC_NPC_EMOTE_MAX_VISIBLE = 4;
const TRAFFIC_NPC_EMOTE_SPAWN_MIN_MS = 1600;
const TRAFFIC_NPC_EMOTE_SPAWN_MAX_MS = 5200;
const TRAFFIC_NPC_EMOTE_REPEAT_MIN_MS = 3200;
const TRAFFIC_NPC_EMOTE_REPEAT_MAX_MS = 9800;
const TRAFFIC_NPC_EMOTE_DURATION_MS = 2300;
const TRAFFIC_NPC_EMOTE_FLOAT_PX = 16;
const TRAFFIC_NPC_STAMINA_MAX_BY_RARITY = {
  1: 220,
  2: 265,
  3: 320,
  4: 390,
  5: 460
};
const TRAFFIC_NPC_STAMINA_DRAIN_BASE_PER_SEC = 0.19;
const TRAFFIC_NPC_STAMINA_DRAIN_STRONG_SUN_PER_SEC = 0.66;
const TRAFFIC_NPC_STAMINA_DRAIN_PHASE_MULT = {
  dia: 1.00,
  tarde: 1.08,
  noche: 1.24,
  madrugada: 1.40
};
const TRAFFIC_NPC_STAMINA_RECOVER_SHOP_PER_SEC = 2.2;
const TRAFFIC_NPC_STAMINA_RECOVER_SHOP_MAX_RATIO = 0.62;
const TRAFFIC_NPC_STAMINA_RECOVER_SLEEP_PER_SEC = 1.6;
const TRAFFIC_NPC_STAMINA_RECOVER_SLEEP_MAX_RATIO = 0.94;
const TRAFFIC_SPECIAL_NPC_STAMINA_RECOVER_SLEEP_MAX_RATIO = 0.88;
const TRAFFIC_NPC_STAMINA_RECOVER_HOME_MEAL_PER_SEC = 0.85;
const TRAFFIC_NPC_STAMINA_RECOVER_HOME_MEAL_MAX_RATIO = 0.68;
const TRAFFIC_NPC_VITALS_SIM_SCALE_MIN = 1;
const TRAFFIC_NPC_VITALS_SIM_SCALE_MAX = 30;
const TRAFFIC_NPC_QUICK_REFRESH_SHOP_STAMINA_RATIO = 0.024;
const TRAFFIC_NPC_QUICK_REFRESH_SHOP_STAMINA_FLAT = 5;
const TRAFFIC_NPC_QUICK_REFRESH_SHOP_BODY_TEMP_DROP = 0.20;
const TRAFFIC_NPC_QUICK_REFRESH_SHOP_STRESS_DROP = 7;
const TRAFFIC_NPC_QUICK_REFRESH_HOME_STAMINA_RATIO = 0.032;
const TRAFFIC_NPC_QUICK_REFRESH_HOME_STAMINA_FLAT = 7;
const TRAFFIC_NPC_QUICK_REFRESH_HOME_BODY_TEMP_DROP = 0.28;
const TRAFFIC_NPC_QUICK_REFRESH_HOME_STRESS_DROP = 10;
const TRAFFIC_NPC_HEAT_ZERO_TRIGGER_MS = 60000;
const TRAFFIC_NPC_HEAT_FAINT_MS = 120000;
const TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS = 3200;
const TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS = 7600;
const TRAFFIC_NPC_LOW_STAMINA_RATIO = 0.16;
const TRAFFIC_NPC_HEAT_HOME_RECOVER_BOOST_PER_SEC = 14.0;
const TRAFFIC_NPC_SLEEP_IDEAL_MIN_HOURS = 7;
const TRAFFIC_NPC_SLEEP_IDEAL_MAX_HOURS = 8;
const TRAFFIC_NPC_SLEEP_MAX_HOURS = 10;
const TRAFFIC_NPC_SLEEP_FULL_RECOVER_MIN_HOURS = 6;
const TRAFFIC_NPC_SLEEP_FULL_RECOVER_MAX_HOURS = 8;
const TRAFFIC_NPC_SLEEP_ALLNIGHT_AWAKE_HOURS = 18;
const TRAFFIC_NPC_SLEEP_ALLNIGHT_WORK_HOURS = 2;
const TRAFFIC_NPC_SLEEP_OVERSLEEP_RECOVER_MULT = 0.90;
const TRAFFIC_NPC_SLEEP_ALLNIGHT_RECOVER_MULT = 0.72;
const TRAFFIC_NPC_SLEEP_WINDOW_START_HOUR = 23.0;
const TRAFFIC_PERU_DAY_START_HOUR = 5.5; // 05:30
const TRAFFIC_NPC_SLEEP_WINDOW_END_HOUR = TRAFFIC_PERU_DAY_START_HOUR;
const TRAFFIC_NPC_NIGHTOWL_START_HOUR = 22.2;
const TRAFFIC_NPC_NIGHTOWL_MAX_END_HOUR = 3.6;
const TRAFFIC_NPC_NIGHTOWL_MIN_SLEEP_HOURS = 6.0;
const TRAFFIC_SPECIAL_NPC_BED_MAX_HOUR = 1.0;
const TRAFFIC_SPECIAL_NPC_WAKE_MIN_HOUR = 6.0;
const TRAFFIC_SPECIAL_NPC_WAKE_MAX_HOUR = 8.0;
const TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS = 5.5;
const TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS = 6.0;
const TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MAX_HOURS = 8.0;
const TRAFFIC_SHOP_DEFAULT_OPEN_HOUR = 8.0;
const TRAFFIC_SHOP_DEFAULT_CLOSE_HOUR = 22.0;
const TRAFFIC_SHOP_SCHEDULE_BY_TYPE = {
  green_2: { open24h: true, openHour: 0, closeHour: 24 }
};
const TRAFFIC_NPC_BASE_COLORS = [
  0x60a5fa, // azul
  0x34d399, // verde
  0xfbbf24, // amarillo
  0xa78bfa, // morado
  0x22d3ee, // celeste
  0xf59e0b  // naranja
];

// 0 = libre, >0 = id edificio
const grid = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0));
let nextBuildingId = 1;
const buildings = new Map();

let mode = "cursor"; // inicia en cursor

const DRAG_THRESHOLD = 10;

// [OK] ZOOM LIMITS
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2.2;
const ZOOM_WHEEL_SENSITIVITY = 0.00065;
const ZOOM_SMOOTH_LERP = 0.18;
const ZOOM_SMOOTH_CLAMP_STRENGTH = 0.38;
const ZOOM_CLAMP_DEADZONE = 0.85;

// =========================
// ISO helpers
// =========================
function isoToScreen(row, col) {
  const r = row - MAP_CENTER_R;
  const c = col - MAP_CENTER_C;
  return {
    x: (c - r) * (TILE_W / 2),
    y: (c + r) * (TILE_H / 2)
  };
}

function inBounds(r, c) {
  return r >= 0 && c >= 0 && r < MAP_H && c < MAP_W;
}

function canPlace(size, r0, c0) {
  for (let r = r0; r < r0 + size; r++) {
    for (let c = c0; c < c0 + size; c++) {
      if (!inBounds(r, c)) return false;
      if (grid[r][c] !== 0) return false;
    }
  }
  return true;
}

function occupy(id, size, r0, c0) {
  const cells = [];
  for (let r = r0; r < r0 + size; r++) {
    for (let c = c0; c < c0 + size; c++) {
      grid[r][c] = id;
      cells.push({ r, c });
    }
  }
  return cells;
}

function freeBuilding(id) {
  for (let r = 0; r < MAP_H; r++) {
    for (let c = 0; c < MAP_W; c++) {
      if (grid[r][c] === id) grid[r][c] = 0;
    }
  }
}

function isPointInDiamond(mx, my, cx, cy) {
  const dx = Math.abs(mx - cx) / (TILE_W / 2);
  const dy = Math.abs(my - cy) / (TILE_H / 2);
  return (dx + dy) <= 1;
}

function screenToIsoTile(mx, my) {
  const a = mx / (TILE_W / 2); // c - r
  const b = my / (TILE_H / 2); // c + r
  const cf = ((a + b) / 2) + MAP_CENTER_C;
  const rf = ((b - a) / 2) + MAP_CENTER_R;

  const r0 = Math.floor(rf);
  const c0 = Math.floor(cf);

  const candidates = [
    { r: r0, c: c0 },
    { r: r0 + 1, c: c0 },
    { r: r0, c: c0 + 1 },
    { r: r0 + 1, c: c0 + 1 },
    { r: r0 - 1, c: c0 },
    { r: r0, c: c0 - 1 }
  ];

  for (const t of candidates) {
    if (!inBounds(t.r, t.c)) continue;
    const center = isoToScreen(t.r, t.c);
    if (isPointInDiamond(mx, my, center.x, center.y)) return t;
  }
  return null;
}

// =========================
// Scene
// =========================
class MainScene extends Phaser.Scene {
  preload() {
    this.load.image("ui_gachapon_btn", "img/gachaponbutton.png");
    this.load.image("ui_moneda_icon", "img/moneda.png");
    this.load.image("ui_exp_icon", "img/experiencia.png");
    this.load.image("ui_yapa_icon", "img/yapa.png");
    this.load.image("ui_wish_perm_icon", "img/deseoperma.png");
    this.load.image("ui_wish_lim_icon", "img/deseolimi.png");
    this.load.image("green_house_1x1_normal", "img/green_casa1x1_normal.png");
    this.load.image("green_house_1x1_giro1", "img/green_casa1x1_giro1.png");
    this.load.image("green_house_1x1_giro2", "img/green_casa1x1_giro2.png");
    this.load.image("green_house_1x1_giro3", "img/green_casa1x1_giro3.png");
    this.load.image("green_temp_outline_1x1", "img/casanueva_outline.png");
    this.load.image("tambo_2x2_1", "img/tambo1.png");
    this.load.image("tambo_2x2_2", "img/tambo2.png");
    this.load.image("tambo_2x2_3", "img/tambo3.png");
    this.load.image("tambo_2x2_4", "img/tambo4.png");
    this.load.image("casa_conera_4x4_1", "img/casanpc1.png");
    this.load.image("casa_conera_4x4_2", "img/casanpc2.png");
    this.load.image("casa_conera_4x4_3", "img/casanpc3.png");
    this.load.image("casa_conera_4x4_4", "img/casanpc4.png");
    this.load.image("food_factory_1x1_1", "img/fabricacomida1.png");
    this.load.image("food_factory_1x1_2", "img/fabricacomida2.png");
    this.load.image("food_factory_1x1_3", "img/fabricacomida3.png");
    this.load.image("food_factory_1x1_4", "img/fabricacomida4.png");
    this.load.image("drink_factory_1x1_1", "img/fabricabebida1.png");
    this.load.image("drink_factory_1x1_2", "img/fabricabebida2.png");
    this.load.image("drink_factory_1x1_3", "img/fabricabebida3.png");
    this.load.image("drink_factory_1x1_4", "img/fabricabebida4.png");
    for (let i = 1; i <= ROADKOTO_PIECES; i++) {
      const id = String(i).padStart(2, "0");
      this.load.image(`roadkoto_${id}_png`, `img/roadkoto-${id}.png`);
      this.load.image(`roadkoto_${id}_jpg`, `img/roadkoto-${id}.jpg`);
    }
  }

  create() {
    
    // ===== CAMERAS =====
    // Main camera = WORLD (se zoom/pan)
    this.worldCam = this.cameras.main;
    this.worldCam.setBackgroundColor("rgba(0,0,0,0)");

    // UI camera = fijo (NO zoom)
    this.uiCam = this.cameras.add(0, 0, this.scale.width, this.scale.height);
    this.uiCam.setScroll(0, 0);
    this.uiCam.setZoom(1);

    // si cambia tamano (FIT), ajusta UI cam
    this.scale.on("resize", (gameSize) => {
      const w = gameSize.width;
      const h = gameSize.height;
      this.uiCam.setSize(w, h);
      this.resizeDayCycleOverlay(w, h);
      this.resizeWeatherFxOverlay(w, h);
      this.clampWorldCamera();
      this.updateBottomHintLayout();
    });

    this.input.mouse.disableContextMenu();

    // UI arriba tiene prioridad en clicks
    this.input.topOnly = true;

    // ===== Mundo =====
    this.bgGridGfx = this.add.graphics();
    this.gridGfx = this.add.graphics();
    this.buffAreaGhost = this.add.graphics();
    this.ghost = this.add.graphics();
    this.moveGhost = this.add.graphics();
    this.ghostSprite = this.add.image(0, 0, "green_house_1x1_normal")
      .setOrigin(0.5, 0.9)
      .setVisible(false)
      .setAlpha(0.55)
      .setDepth(6);
    this.moveGhostSprite = this.add.image(0, 0, "green_house_1x1_normal")
      .setOrigin(0.5, 0.9)
      .setVisible(false)
      .setAlpha(0.55)
      .setDepth(6);
    this.bgGridGfx.setDepth(-5);
    this.gridGfx.setDepth(-4);
    this.buffAreaGhost.setDepth(-3);

    // por defecto, UI cam NO debe renderizar el mundo
    this.uiCam.ignore([this.bgGridGfx, this.gridGfx, this.buffAreaGhost, this.ghost, this.moveGhost, this.ghostSprite, this.moveGhostSprite]);

    // ===== Estado input =====
    this.isDragging = false;
    this.dragged = false;
    this.pointerStart = { x: 0, y: 0, camX: 0, camY: 0 };

    this.uiClick = false;
    this.overUI = false;

    this.pending = null;
    this.selectedBuildingId = null;
    this.moveMode = null;
    this.hoverAuraBuildingId = null;
    this.occlusionGhostBuildingId = null;
    this.yapaScanMode = false;
    // [OK] item seleccionado para construir (por defecto el verde 1x1)
    this.selectedBuildKey = "green_1";
    this.buildRotationStep = 0;
    this.buildPreviewTypeKey = this.selectedBuildKey;
    this.nextYapaBonusAt = Date.now() + YAPA_BONUS_INTERVAL_MS;
    this.activeYapaBonusBuildingId = null;
    this.materialInventory = Object.create(null);
    this.npcEvolutionLevels = Object.create(null);
    this.producerModalLastLabel = "";
    this.residentNpcModalLastLabel = "";
    this.trafficCars = [];
    this.streetNpcs = [];
    this.npcEmoteState = {
      active: [],
      nextSpawnAt: Date.now() + Phaser.Math.Between(1800, 4200),
      weatherLabel: "",
      weatherLabelLower: "",
      tempC: 22,
      lastClimateAt: 0
    };
    this.npcHeatStatus = {
      activeNpcId: 0,
      modalOpen: false
    };
    this.npcDebugEnabled = false;
    this.npcStatsDebugEnabled = false;
    this.npcStatsDebugTextPool = [];
    this.gridCodeDebugEnabled = false;
    this.gridCodeTextPool = [];
    this.itemDirDebugEnabled = false;
    this.itemDirDebugTextPool = [];
    this.itemDirDebugLastDrawAt = 0;
    this.roadPieceDebugEnabled = false;
    this.roadPieceDebugTextPool = [];
    this.roadPieceDebugLastDrawAt = 0;
    this.camCenterDebugEnabled = false;
    this.camCenterDebugLastLabel = "";
    this.dayCycleState = {
      mode: "auto",
      manualIndex: 0,
      progress: 0.12,
      durationMs: DAY_CYCLE_DURATION_MS,
      speed: 1,
      baseSpeed: 1,
      phaseLabel: "MANANA",
      visualSample: null,
      debugJump: null,
      lastWallClockMs: Date.now()
    };
    this.weatherFxState = {
      lastLabel: "",
      lastSeason: "",
      nextPollAt: 0,
      transitionMs: 1400,
      currentTintColor: 0xffffff,
      currentShadeColor: 0x0a1224,
      currentTintAlpha: 0,
      currentShadeAlpha: 0,
      currentPulseAmp: 0,
      currentPulseSpeed: 0.0015,
      currentFlashColor: 0xffffff,
      currentCloudDensity: 0,
      currentVisionDebuff: 0,
      currentWindBoost: 0,
      currentRainIntensity: 0,
      targetTintColor: 0xffffff,
      targetShadeColor: 0x0a1224,
      targetTintAlpha: 0,
      targetShadeAlpha: 0,
      targetPulseAmp: 0,
      targetPulseSpeed: 0.0015,
      targetFlashColor: 0xffffff,
      targetCloudDensity: 0,
      targetVisionDebuff: 0,
      targetWindBoost: 0,
      targetRainIntensity: 0,
      clouds: [],
      rainDrops: []
    };
    this.adminForcedRoadPiece = 0;
    this.adminForcedRoadPieceNoConsume = true;
    this.roadAutoRulesEnabled = true;
    this.nextTrafficCarId = 1;
    this.nextStreetNpcId = 1;
    this.nextResidentNpcSyncAt = 0;
    this.nextTrafficCapacityMsgAt = 0;
    this.trafficCapacityHideCall = null;
    this.trafficCapacityLastMessage = "";

    // lista de objetos UI para que el WORLD cam los ignore (asi NO se mueven con zoom)
    this.uiObjects = [];
    const regUI = (obj) => {
      this.uiObjects.push(obj);
      return obj;
    };
    this.dayCycleState.progress = this.getInitialDayCycleProgressFromLocalTime();
    this.dayCycleState.phaseLabel = this.getDayCyclePhaseLabel(this.dayCycleState.progress);
    this.createDayCycleOverlay(regUI);
    this.createWeatherFxOverlay(regUI);
    this.dayCycleState.visualSample = this.sampleDayCycleFrame(this.dayCycleState.progress);
    this.applyDayCycleVisual(this.dayCycleState.visualSample);

    // ===== UI fija =====
    this.helpText = regUI(
      this.add.text(
        16, 12,
        "City Builder Iso | Arrastra para mover | Zoom: rueda/pinch",
        { fontFamily: "Arial", fontSize: "16px", color: "#e5e7eb" }
      ).setScrollFactor(0).setDepth(9999)
    );

    this.modeText = regUI(
      this.add.text(
        16, 62,
        this.modeLabel(),
        { fontFamily: "Arial", fontSize: "14px", color: "#94a3b8" }
      ).setScrollFactor(0).setDepth(9999)
    );
    this.npcDebugBtn = regUI(
      this.add.text(
        16, 88,
        "NPC DBG: OFF",
        { fontFamily: "Arial", fontSize: "14px", color: "#bfdbfe", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.npcDebugBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.npcDebugEnabled = !this.npcDebugEnabled;
      this.npcDebugBtn.setText(this.npcDebugEnabled ? "NPC DBG: ON" : "NPC DBG: OFF");
      if (!this.npcDebugEnabled && !this.npcStatsDebugEnabled) this.npcDebugGfx?.clear();
      this.updateBottomHintLayout();
    });
    this.npcStatsDebugBtn = regUI(
      this.add.text(
        16, 88,
        "NPC STATS: OFF",
        { fontFamily: "Arial", fontSize: "14px", color: "#86efac", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.npcStatsDebugBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.npcStatsDebugEnabled = !this.npcStatsDebugEnabled;
      this.npcStatsDebugBtn.setText(this.npcStatsDebugEnabled ? "NPC STATS: ON" : "NPC STATS: OFF");
      if (!this.npcStatsDebugEnabled) this.clearNpcStatsDebugTexts();
      if (!this.npcStatsDebugEnabled && !this.npcDebugEnabled) this.npcDebugGfx?.clear();
      this.updateBottomHintLayout();
    });
    this.gridCodeBtn = regUI(
      this.add.text(
        16, 116,
        "GRID DBG: OFF",
        { fontFamily: "Arial", fontSize: "14px", color: "#bbf7d0", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.gridCodeBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.gridCodeDebugEnabled = !this.gridCodeDebugEnabled;
      this.gridCodeBtn.setText(this.gridCodeDebugEnabled ? "GRID DBG: ON" : "GRID DBG: OFF");
      if (this.gridCodeDebugEnabled) this.drawGridCodeOverlay(true);
      else this.clearGridCodeOverlay();
      this.updateBottomHintLayout();
    });
    this.itemDirDebugBtn = regUI(
      this.add.text(
        16, 116,
        "ITEM NESO: OFF",
        { fontFamily: "Arial", fontSize: "14px", color: "#fde68a", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.itemDirDebugBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.itemDirDebugEnabled = !this.itemDirDebugEnabled;
      this.itemDirDebugBtn.setText(this.itemDirDebugEnabled ? "ITEM NESO: ON" : "ITEM NESO: OFF");
      this.itemDirDebugLastDrawAt = 0;
      if (this.itemDirDebugEnabled) this.drawItemDirectionOverlay(true);
      else this.clearItemDirectionOverlay();
      this.updateBottomHintLayout();
    });
    this.roadPieceDebugBtn = regUI(
      this.add.text(
        16, 146,
        "ROAD NUM: OFF",
        { fontFamily: "Arial", fontSize: "14px", color: "#fca5a5", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.roadPieceDebugBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.roadPieceDebugEnabled = !this.roadPieceDebugEnabled;
      this.roadPieceDebugBtn.setText(this.roadPieceDebugEnabled ? "ROAD NUM: ON" : "ROAD NUM: OFF");
      this.roadPieceDebugLastDrawAt = 0;
      if (this.roadPieceDebugEnabled) this.drawRoadPieceDebugOverlay(true);
      else this.clearRoadPieceDebugOverlay();
      this.updateBottomHintLayout();
    });
    this.camCenterDebugBtn = regUI(
      this.add.text(
        16, 178,
        "CAM CTR DBG: OFF",
        { fontFamily: "Arial", fontSize: "14px", color: "#fecaca", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.camCenterDebugBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.camCenterDebugEnabled = !this.camCenterDebugEnabled;
      this.camCenterDebugBtn.setText(this.camCenterDebugEnabled ? "CAM CTR DBG: ON" : "CAM CTR DBG: OFF");
      this.updateBottomHintLayout();
      this.updateCameraCenterDebugOverlay(true);
    });
    this.dayCycleDebugBtn = regUI(
      this.add.text(
        16, 210,
        this.getDayCycleDebugButtonLabel(),
        { fontFamily: "Arial", fontSize: "14px", color: "#a5f3fc", backgroundColor: "#0f172a" }
      ).setPadding(8, 5, 8, 5).setScrollFactor(0).setDepth(9999)
        .setInteractive({ useHandCursor: true })
    );
    this.dayCycleDebugBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.cycleDayCycleMode();
      this.refreshDayCycleDebugButton();
      this.updateBottomHintLayout();
    });

    this.camCenterDebugDot = regUI(
      this.add.circle(0, 0, 6, 0xff4d4f, 0.95)
        .setScrollFactor(0)
        .setDepth(10005)
        .setVisible(false)
    );
    this.camCenterDebugCrossH = regUI(
      this.add.rectangle(0, 0, 34, 2, 0xff4d4f, 0.95)
        .setScrollFactor(0)
        .setDepth(10004)
        .setVisible(false)
    );
    this.camCenterDebugCrossV = regUI(
      this.add.rectangle(0, 0, 2, 34, 0xff4d4f, 0.95)
        .setScrollFactor(0)
        .setDepth(10004)
        .setVisible(false)
    );
    this.camCenterDebugLabel = regUI(
      this.add.text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "13px",
        color: "#fecaca",
        backgroundColor: "#0f172a"
      })
        .setPadding(6, 4, 6, 4)
        .setScrollFactor(0)
        .setDepth(10006)
        .setVisible(false)
    );
    this.trafficCapacityText = regUI(
      this.add.text(0, 0, "", {
        fontFamily: "Arial",
        fontSize: "16px",
        fontStyle: "bold",
        color: "#fef3c7",
        backgroundColor: "#111827"
      })
        .setOrigin(0.5, 0.5)
        .setPadding(12, 8, 12, 8)
        .setScrollFactor(0)
        .setDepth(10008)
        .setVisible(false)
        .setAlpha(0)
    );
    this.updateBottomHintLayout();

    // crea botones UI (los registra adentro)
    this.createCancelBuildButton(regUI);
    this.createCancelSelectButton(regUI);
    this.createConfirmButtons(regUI);
    this.createActionButtons(regUI);

    this.npcDebugGfx = this.add.graphics().setDepth(34);
    this.uiCam.ignore(this.npcDebugGfx);
    this.gridCodeLayer = this.add.layer().setDepth(33);
    this.uiCam.ignore(this.gridCodeLayer);
    this.itemDirDebugGfx = this.add.graphics().setDepth(35);
    this.itemDirDebugLayer = this.add.layer().setDepth(36);
    this.uiCam.ignore(this.itemDirDebugGfx);
    this.uiCam.ignore(this.itemDirDebugLayer);
    this.roadPieceDebugLayer = this.add.layer().setDepth(37);
    this.uiCam.ignore(this.roadPieceDebugLayer);

    // [OK] IMPORTANTISIMO:
    // el WORLD cam ignora todos los UI -> el UI no se escala con zoom
    this.worldCam.ignore(this.uiObjects);
    this.economy = new EconomySystem(this);

    // ===== Camara / bounds =====
    this.setupCameraBounds();

    // [OK] Zoom inicial: arrancar al maximo configurado
    this.worldCam.setZoom(ZOOM_MAX);

    this.zoomState = {
      active: false,
      targetZoom: this.worldCam.zoom,
      anchorX: this.worldCam.width * 0.5,
      anchorY: this.worldCam.height * 0.5,
      anchorWorld: (() => { const p = this.worldCam.getWorldPoint(this.worldCam.width * 0.5, this.worldCam.height * 0.5); return { x: p.x, y: p.y }; })(),
      lerp: ZOOM_SMOOTH_LERP
    };

    // [OK] Controles de zoom (rueda + pinch)
    this.setupZoomControls();

    // Algunas carreteras base para empezar el mapa.
    this.placeStarterRoads();
    // Casa Conera inicial para pruebas de NPC residencia.
    this.placeStarterConera();
    // Las carreteras vuelven a compactar automaticamente usando solo N/E/S/O.
    this.releaseAllRoadForcedPieces(false);
    this.roadAutoRulesEnabled = true;
    this.refreshRoadVisualsAroundCells(
      Array.from(buildings.values())
        .filter((b) => b?.typeKey === "road_main_2x2" && Array.isArray(b.cells))
        .flatMap((b) => b.cells),
      1
    );

    // Grid inicial (doble draw para que se vea al entrar)
    this.lastCamX = this.worldCam.scrollX;
    this.lastCamY = this.worldCam.scrollY;
    this.lastZoom = this.worldCam.zoom;

    this.drawGridVisible();
    this.time.delayedCall(0, () => {
      this.lastCamX = this.worldCam.scrollX;
      this.lastCamY = this.worldCam.scrollY;
      this.lastZoom = this.worldCam.zoom;
      this.drawGridVisible();
    });

    // ===== Input =====
    this.input.on("pointerdown", (pointer) => {
      if (this.hasBlockingDomOverlay()) return;
      if (pointer.y <= 140) return;

      const isRightClick = (pointer?.event?.button === 2);
      if (isRightClick) {
        return;
      }
      this.isDragging = false;
      this.dragged = false;

      this.pointerStart.x = pointer.x;
      this.pointerStart.y = pointer.y;
      this.pointerStart.camX = this.worldCam.scrollX;
      this.pointerStart.camY = this.worldCam.scrollY;
    });

    this.input.on("pointermove", (pointer) => {
      if (this.hasBlockingDomOverlay()) {
        this.clearBuffAreaGhost();
        return;
      }
      if (pointer.y <= 140) {
        this.clearBuffAreaGhost();
        return;
      }

      // PAN: arrastre izquierdo siempre
      if (pointer.isDown && pointer.leftButtonDown()) {
        const dx = pointer.x - this.pointerStart.x;
        const dy = pointer.y - this.pointerStart.y;

        if (!this.isDragging && (Math.abs(dx) + Math.abs(dy) >= DRAG_THRESHOLD)) {
          this.isDragging = true;
          this.dragged = true;
        }

        if (this.isDragging) {
          this.worldCam.scrollX = this.pointerStart.camX - dx / this.worldCam.zoom;
          this.worldCam.scrollY = this.pointerStart.camY - dy / this.worldCam.zoom;
          this.clampWorldCamera();
          return;
        }
      }

      // mover ghost
      if (this.moveMode) {
        if (this.isDragging) return;
        const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
        this.renderMoveGhost(tile);
        return;
      }

      // ghost build
      if (mode !== "build" || this.selectedBuildingId) {
        this.ghostSprite?.setVisible(false);
        this.updateBuffAreaGhostFromPointer(pointer);
        return;
      }

      if (this.pending) {
        // Mantener visible el ghost mientras estan los botones de confirmar.
        this.renderPendingGhost();
        return;
      }

      const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
      this.ghost.clear();
      if (!tile) {
        this.clearBuffAreaGhost();
        this.ghostSprite?.setVisible(false);
        return;
      }

      const preview = this.getBuildPreview();
      const size = preview.size;
      const placeAt = this.getPlacementTopLeftForHoverTile(tile, size);
      const ok = this.canPlaceBuildAt(preview.typeKey, size, placeAt.r, placeAt.c, preview.rotationStep || 0);
      const okColor = preview.def.fill ?? 0x22c55e;
      const okBorder = preview.def.border ?? okColor;
      const badColor = 0xf87171;

      const cells = [];
      for (let r = placeAt.r; r < placeAt.r + size; r++) {
        for (let c = placeAt.c; c < placeAt.c + size; c++) {
          if (inBounds(r, c)) cells.push({ r, c });
        }
      }
      if (this.isProducerBuilding(preview.typeKey) && !this.isSpriteBuilding(preview.typeKey)) {
        this.drawProducerCubes(this.ghost, cells, ok ? okColor : badColor, 0.25, ok ? okBorder : badColor);
      } else {
        this.drawCells(this.ghost, cells, ok ? okColor : badColor, 0.25, ok ? okBorder : badColor);
      }
      this.drawBuffAreaGhostForPlacement(preview.typeKey, placeAt.r, placeAt.c, size, 0);

      if (this.isSpriteBuilding(preview.typeKey)) {
        this.placeSpriteAtTile(this.ghostSprite, preview.typeKey, preview.rotationStep || 0, placeAt.r, placeAt.c, ok ? 0.55 : 0.42);
        this.applyDefaultSpriteEditToLooseSprite(this.ghostSprite, preview.typeKey, ok ? 0.55 : 0.42);
      } else {
        this.ghostSprite?.setVisible(false);
      }
    });

    this.input.on("pointerup", (pointer) => {
      if (this.uiClick) {
        this.uiClick = false;
        return;
      }
      if (this.overUI) return;
      if (this.hasBlockingDomOverlay()) return;

      const isRightClick = (pointer?.event?.button === 2);
      if (isRightClick) {
        if (mode === "build" && !this.moveMode && !this.selectedBuildingId) {
          this.rotateBuildPreview();
        }
        return;
      }
      if (pointer.y <= 140) return;
      if (this.dragged) return;

      // mover: click suelta
      if (this.moveMode) {
        const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
        if (!tile) {
          this.cancelMoveMode(true);
          this.setCursorMode();
          return;
        }
        const ok = this.canPlaceBuildAt(
          this.moveMode.typeKey,
          this.moveMode.size,
          tile.r,
          tile.c,
          this.moveMode.rotationStep || 0
        );
        if (!ok) {
          this.renderMoveGhost(tile);
          return;
        }
        this.finishMoveAt(tile.r, tile.c);
        return;
      }

      const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
      if (!tile) {
        this.closeBuildingMenu();
        this.setCursorMode();
        return;
      }

      const idOnTile = grid[tile.r][tile.c];

      if (this.yapaScanMode) {
        this.handleYapaScanTap(idOnTile);
        return;
      }

      if (mode === "cursor") {
        const faintNpc = this.pickHeatFaintedNpcAt(pointer.worldX, pointer.worldY, 26);
        if (faintNpc) {
          this.openNpcHeatAssistModal(faintNpc);
          return;
        }
      }

      if (idOnTile) {
        // En modo construccion no abrir info de edificios
        if (mode === "build") return;
        this.openBuildingMenu(idOnTile, pointer);
        return;
      }

      if (this.selectedBuildingId) {
        this.closeBuildingMenu();
        this.setCursorMode();
        return;
      }

      if (mode === "cursor") return;

      const preview = this.getBuildPreview();
      const size = preview.size;
      const placeAt = this.getPlacementTopLeftForHoverTile(tile, size);
      const ok = this.canPlaceBuildAt(preview.typeKey, size, placeAt.r, placeAt.c, preview.rotationStep || 0);

      // Auto-colocar carretera: instantaneo y sin confirmacion.
      if (preview.typeKey === "road_main_2x2") {
        if (ok) this.placeBuilding(placeAt.r, placeAt.c);
        return;
      }

      this.pending = {
        tile: placeAt,
        typeKey: preview.typeKey,
        size,
        ok,
        clickX: pointer.x,
        clickY: pointer.y,
        color: preview.def.fill ?? 0x22c55e,
        border: preview.def.border ?? (preview.def.fill ?? 0x22c55e),
        rotationStep: preview.rotationStep || 0
      };

      this.renderPendingGhost();
      this.updateConfirmButtonsPosition();
      this.showConfirmButtons(ok);
    });

    this.setupBuildHotkeys();
    this.registerPngEditorBridge();
  }

  update() {
    const cam = this.worldCam;
    if (this.yapaScanMode && !this.getActiveYapaBonusBuilding(Date.now())) {
      this.stopYapaScanMode();
    }
    if ((document.getElementById("evo-modal") || document.getElementById("building-modal") || document.getElementById("producer-modal") || document.getElementById("npc-slots-modal")) && mode === "build") {
      this.setCursorMode();
    }

    this.updateZoomSmoothing();
    this.updateDayCycle(this.game?.loop?.delta || 16);
    this.updateWeatherFx(this.game?.loop?.delta || 16);

    // [OK] redraw tambien cuando cambia zoom
    if (cam.scrollX !== this.lastCamX || cam.scrollY !== this.lastCamY || cam.zoom !== this.lastZoom) {
      this.lastCamX = cam.scrollX;
      this.lastCamY = cam.scrollY;
      this.lastZoom = cam.zoom;
      this.drawGridVisible();
    }

    this.updateCameraCenterDebugOverlay();
    // [OK] FIX: actualizar ghost SIEMPRE en moveMode (aunque no haya pointermove)
    if (this.moveMode) {
      const p = this.input.activePointer;

      // si estas arriba del UI, oculta el ghost
      if (p.y <= 140) {
        this.moveGhost.clear();
        this.clearBuffAreaGhost();
        this.moveGhostSprite?.setVisible(false);
      } else {
        const tile = screenToIsoTile(p.worldX, p.worldY);
        this.renderMoveGhost(tile);
      }
    }

    if (this.hoverAuraBuildingId) {
      const p = this.input.activePointer;
      if (this.hasBlockingDomOverlay() || mode === "build" || this.moveMode || p.y <= 140) {
        this.clearBuffAreaGhost();
      } else {
        const auraB = buildings.get(this.hoverAuraBuildingId);
        if (this.isAuraSourceBuilding(auraB)) this.drawBuffAreaGhostForBuilding(auraB);
        else this.clearBuffAreaGhost();
      }
    }

    if (this.pending) this.updateConfirmButtonsPosition();
    if (this.selectedBuildingId) this.updateActionButtonsPosition();
    this.updateTrafficSystem(this.game?.loop?.delta || 16);
    if (this.npcHeatStatus?.modalOpen) {
      const activeId = Number(this.npcHeatStatus.activeNpcId) || 0;
      const live = this.streetNpcs.find((npc) => Number(npc?.id || 0) === activeId) || null;
      if (!live || live.heatState !== "fainted") {
        this.closeNpcHeatAssistModal();
      }
    }
    this.updateNpcEmotes(this.game?.loop?.delta || 16);
    this.drawNpcDebugOverlay();
    if (this.itemDirDebugEnabled) {
      const nowDbg = Date.now();
      if ((nowDbg - (this.itemDirDebugLastDrawAt || 0)) >= 120) {
        this.drawItemDirectionOverlay();
        this.itemDirDebugLastDrawAt = nowDbg;
      }
    }
    if (this.roadPieceDebugEnabled) {
      const nowRoadDbg = Date.now();
      if ((nowRoadDbg - (this.roadPieceDebugLastDrawAt || 0)) >= 120) {
        this.drawRoadPieceDebugOverlay();
        this.roadPieceDebugLastDrawAt = nowRoadDbg;
      }
    }

    this.updateOcclusionGhostFromPointer();
    this.updateBuildingsTimers();
    this.updateProducerRecipeModal();
  }

  // ================= ZOOM =================
  setupZoomControls() {
    // Wheel zoom (PC)
    this.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      if (this.hasBlockingDomOverlay()) return;
      if (pointer.y <= 140) return;

      const cam = this.worldCam;
      const anchorX = cam.width * 0.5;
      const anchorY = cam.height * 0.5;

      const baseTarget = Number.isFinite(this.zoomState?.targetZoom)
        ? this.zoomState.targetZoom
        : cam.zoom;
      const safeBase = Phaser.Math.Clamp(baseTarget, ZOOM_MIN, ZOOM_MAX);
      const minLog = Math.log(ZOOM_MIN);
      const maxLog = Math.log(ZOOM_MAX);
      const baseLog = Phaser.Math.Clamp(Math.log(safeBase), minLog, maxLog);
      const nextLog = Phaser.Math.Clamp(baseLog + ((-Number(dy) || 0) * ZOOM_WHEEL_SENSITIVITY), minLog, maxLog);
      const nextTarget = Math.exp(nextLog);

      if (!this.zoomState.active) {
        this.zoomState.anchorX = anchorX;
        this.zoomState.anchorY = anchorY;
        { const p = cam.getWorldPoint(anchorX, anchorY); this.zoomState.anchorWorld = { x: p.x, y: p.y }; }
      }
      this.zoomState.active = true;
      this.zoomState.targetZoom = nextTarget;
      this.zoomState.lerp = ZOOM_SMOOTH_LERP;
    });

    // Pinch zoom (mobile)
    this.input.addPointer(1); // asegura 2 pointers

    this.pinch = {
      active: false,
      startDist: 0,
      startZoom: 1,
      midX: 0,
      midY: 0
    };

    this.input.on("pointerdown", () => {
      const p1 = this.input.pointer1;
      const p2 = this.input.pointer2;

      if (p1.isDown && p2.isDown) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;

        this.pinch.active = true;
        this.pinch.startDist = Math.hypot(dx, dy);
        this.pinch.startZoom = this.worldCam.zoom;
        this.pinch.midX = (p1.x + p2.x) / 2;
        this.pinch.midY = (p1.y + p2.y) / 2;

        const cam = this.worldCam;
        this.zoomState.active = true;
        this.zoomState.targetZoom = cam.zoom;
        this.zoomState.anchorX = this.pinch.midX;
        this.zoomState.anchorY = this.pinch.midY;
        { const p = cam.getWorldPoint(this.pinch.midX, this.pinch.midY); this.zoomState.anchorWorld = { x: p.x, y: p.y }; }
        this.zoomState.lerp = 0.34;
      }
    });

    this.input.on("pointermove", () => {
      if (!this.pinch.active) return;

      const p1 = this.input.pointer1;
      const p2 = this.input.pointer2;
      if (!(p1.isDown && p2.isDown)) return;

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const dist = Math.hypot(dx, dy);
      if (this.pinch.startDist <= 0) return;

      this.pinch.midX = (p1.x + p2.x) / 2;
      this.pinch.midY = (p1.y + p2.y) / 2;

      const cam = this.worldCam;
      let z = this.pinch.startZoom * (dist / this.pinch.startDist);
      z = Phaser.Math.Clamp(z, ZOOM_MIN, ZOOM_MAX);

      this.zoomState.active = true;
      this.zoomState.targetZoom = z;
      this.zoomState.anchorX = this.pinch.midX;
      this.zoomState.anchorY = this.pinch.midY;
      { const p = cam.getWorldPoint(this.pinch.midX, this.pinch.midY); this.zoomState.anchorWorld = { x: p.x, y: p.y }; }
      this.zoomState.lerp = 0.34;
    });

    this.input.on("pointerup", () => {
      const p1 = this.input.pointer1;
      const p2 = this.input.pointer2;
      if (!(p1.isDown && p2.isDown)) {
        this.pinch.active = false;
      }
    });
  }

  updateZoomSmoothing() {
    const cam = this.worldCam;
    const zs = this.zoomState;
    if (!cam || !zs || !zs.active) return;

    const targetZoom = Phaser.Math.Clamp(Number(zs.targetZoom), ZOOM_MIN, ZOOM_MAX);
    const lerpAlpha = Phaser.Math.Clamp(Number(zs.lerp) || ZOOM_SMOOTH_LERP, 0.08, 1);

    const safeCurrent = Phaser.Math.Clamp(cam.zoom, ZOOM_MIN, ZOOM_MAX);
    const minLog = Math.log(ZOOM_MIN);
    const maxLog = Math.log(ZOOM_MAX);
    const currentLog = Phaser.Math.Clamp(Math.log(safeCurrent), minLog, maxLog);
    const targetLog = Phaser.Math.Clamp(Math.log(targetZoom), minLog, maxLog);

    let nextLog = Phaser.Math.Linear(currentLog, targetLog, lerpAlpha);
    if (Math.abs(nextLog - targetLog) < 0.00045) nextLog = targetLog;
    const nextZoom = Math.exp(nextLog);

    // Fija el punto de mundo del ancla durante todo el gesto de zoom.
    const anchorX = Number.isFinite(zs.anchorX) ? zs.anchorX : (cam.width * 0.5);
    const anchorY = Number.isFinite(zs.anchorY) ? zs.anchorY : (cam.height * 0.5);
    const anchorWorld = (zs.anchorWorld && Number.isFinite(zs.anchorWorld.x) && Number.isFinite(zs.anchorWorld.y))
      ? zs.anchorWorld
      : cam.getWorldPoint(anchorX, anchorY);

    cam.setZoom(nextZoom);
    cam.preRender();

    const worldAfter = cam.getWorldPoint(anchorX, anchorY);
    cam.scrollX += (anchorWorld.x - worldAfter.x);
    cam.scrollY += (anchorWorld.y - worldAfter.y);
    cam.preRender();

    if (Math.abs(nextZoom - targetZoom) < 0.0008) {
      zs.active = false;
    }
  }

  createDayCycleOverlay(regUI) {
    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    this.dayTintOverlay = regUI(
      this.add.rectangle(0, 0, w, h, 0xffefc1, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(9600)
    );
    this.dayShadeOverlay = regUI(
      this.add.rectangle(0, 0, w, h, 0x0a1224, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setBlendMode(Phaser.BlendModes.MULTIPLY)
        .setDepth(9601)
    );
  }

  resizeDayCycleOverlay(w, h) {
    const width = Math.max(1, Math.round(Number(w) || 0));
    const height = Math.max(1, Math.round(Number(h) || 0));
    this.dayTintOverlay?.setSize(width, height);
    this.dayShadeOverlay?.setSize(width, height);
  }

  createWeatherFxOverlay(regUI) {
    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    this.weatherTintOverlay = regUI(
      this.add.rectangle(0, 0, w, h, 0xffffff, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(9602)
    );
    this.weatherShadeOverlay = regUI(
      this.add.rectangle(0, 0, w, h, 0x0a1224, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setBlendMode(Phaser.BlendModes.MULTIPLY)
        .setDepth(9603)
    );
    this.weatherCloudOverlay = regUI(
      this.add.graphics()
        .setScrollFactor(0)
        .setDepth(9603.5)
    );
    this.weatherRainOverlay = regUI(
      this.add.graphics()
        .setScrollFactor(0)
        .setDepth(9603.7)
    );
    const vignetteKey = this.buildWeatherVisionVignetteTexture(w, h);
    this.weatherVisionOverlay = regUI(
      this.add.image(0, 0, vignetteKey)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(9604)
        .setAlpha(0)
    );
    this.weatherFlashOverlay = regUI(
      this.add.rectangle(0, 0, w, h, 0xffffff, 0)
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setDepth(9605)
    );
    this.rebuildWeatherClouds(Math.max(12, Math.round((w / 180) + (h / 220))));
    this.rebuildWeatherRainDrops(Math.max(70, Math.round((w * h) / 15500)));
  }

  resizeWeatherFxOverlay(w, h) {
    const width = Math.max(1, Math.round(Number(w) || 0));
    const height = Math.max(1, Math.round(Number(h) || 0));
    this.weatherTintOverlay?.setSize(width, height);
    this.weatherShadeOverlay?.setSize(width, height);
    this.weatherFlashOverlay?.setSize(width, height);
    if (this.weatherVisionOverlay) {
      const key = this.buildWeatherVisionVignetteTexture(width, height);
      this.weatherVisionOverlay.setTexture(key).setDisplaySize(width, height);
    }
    this.rebuildWeatherClouds(Math.max(12, Math.round((width / 180) + (height / 220))));
    this.rebuildWeatherRainDrops(Math.max(70, Math.round((width * height) / 15500)));
  }

  buildWeatherVisionVignetteTexture(widthRaw, heightRaw) {
    const width = Math.max(4, Math.round(Number(widthRaw) || 4));
    const height = Math.max(4, Math.round(Number(heightRaw) || 4));
    const key = "weather_vision_vignette_tex";
    if (this.textures?.exists?.(key)) {
      this.textures.remove(key);
    }
    const tex = this.textures.createCanvas(key, width, height);
    const ctx = tex?.getContext?.();
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      const cx = width * 0.5;
      const cy = height * 0.5;
      const inner = Math.min(width, height) * 0.17;
      const outer = Math.max(width, height) * 0.78;
      const grad = ctx.createRadialGradient(cx, cy, inner, cx, cy, outer);
      grad.addColorStop(0.00, "rgba(0,0,0,0.00)");
      grad.addColorStop(0.44, "rgba(0,0,0,0.16)");
      grad.addColorStop(0.72, "rgba(0,0,0,0.58)");
      grad.addColorStop(1.00, "rgba(0,0,0,0.96)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }
    tex?.refresh?.();
    return key;
  }

  rebuildWeatherClouds(targetCount = 16) {
    const state = this.weatherFxState;
    if (!state) return;
    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    const count = Math.max(8, Math.round(Number(targetCount) || 16));
    state.clouds = Array.from({ length: count }, () => {
      const r = Phaser.Math.Between(80, 180);
      return {
        x: Phaser.Math.Between(-r, Math.round(w + r)),
        y: Phaser.Math.Between(Math.round(h * 0.08), Math.round(h * 0.92)),
        r,
        speed: Phaser.Math.FloatBetween(0.010, 0.050),
        driftAmp: Phaser.Math.FloatBetween(6, 26),
        driftSpeed: Phaser.Math.FloatBetween(0.0004, 0.0018),
        alphaMul: Phaser.Math.FloatBetween(0.70, 1.30),
        seed: Math.random() * 1000
      };
    });
  }

  rebuildWeatherRainDrops(targetCount = 120) {
    const state = this.weatherFxState;
    if (!state) return;
    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    const count = Math.max(80, Math.round(Number(targetCount) || 120));
    state.rainDrops = Array.from({ length: count }, () => ({
      x: Phaser.Math.Between(-20, Math.round(w + 20)),
      y: Phaser.Math.Between(-20, Math.round(h + 20)),
      len: Phaser.Math.FloatBetween(10, 24),
      speed: Phaser.Math.FloatBetween(0.14, 0.46),
      alpha: Phaser.Math.FloatBetween(0.45, 1.00),
      seed: Math.random() * 1000
    }));
  }

  getWeatherFxProfileByLabel(labelRaw = "", seasonRaw = "") {
    const label = String(labelRaw || "").toLowerCase();
    const isEvent = label.includes("evento:");
    const season = String(seasonRaw || "");
    const rainLevel = (() => {
      if (label.includes("lluvia extrema")) return 1.00;
      if (label.includes("lluvia fuerte")) return 0.85;
      if (label.includes("lluvia intermedia")) return 0.62;
      if (label.includes("lluvia ligera")) return 0.38;
      if (label.includes("lluvia atipica")) return 0.76;
      if (label.includes("llovizna") || label.includes("garua")) return 0.26;
      return 0;
    })();
    const base = {
      tintColor: 0xffffff,
      tintAlpha: 0,
      shadeColor: 0x0a1224,
      shadeAlpha: 0,
      pulseAmp: 0,
      pulseSpeed: 0.0015,
      flashColor: 0xffffff,
      cloudDensity: 0,
      visionDebuff: 0,
      windBoost: 0,
      rainIntensity: 0
    };
    if (!label) return base;

    // Eventos climaticos (filtros notorios, base dia/tarde/noche se respeta)
    if (label.includes("neblina intensa")) {
      if (season === "Invierno") {
        return {
          tintColor: 0xe8eef7,
          tintAlpha: 0.36,
          shadeColor: 0x2d415b,
          shadeAlpha: 0.32,
          pulseAmp: 0.072,
          pulseSpeed: 0.0010,
          flashColor: 0xf2f8ff,
          cloudDensity: 1.35,
          visionDebuff: 0.86,
          windBoost: 0.06,
          rainIntensity: 0
        };
      }
      return {
        tintColor: 0xe1e8f2,
        tintAlpha: 0.20,
        shadeColor: 0x3a4c61,
        shadeAlpha: 0.14,
        pulseAmp: 0.028,
        pulseSpeed: 0.0010,
        flashColor: 0xf2f8ff,
        cloudDensity: 0.55,
        visionDebuff: 0.28,
        windBoost: 0.05,
        rainIntensity: 0
      };
    }
    if (label.includes("viento fuerte")) {
      return {
        tintColor: 0xbfe8ff,
        tintAlpha: 0.10,
        shadeColor: 0x112945,
        shadeAlpha: 0.10,
        pulseAmp: 0.034,
        pulseSpeed: 0.0029,
        flashColor: 0xd8f3ff,
        cloudDensity: 0.22,
        visionDebuff: 0.07,
        windBoost: 1.0,
        rainIntensity: 0
      };
    }
    if (label.includes("lluvia atipica")) {
      return {
        tintColor: 0x8eb8ff,
        tintAlpha: 0.16,
        shadeColor: 0x0b1f46,
        shadeAlpha: 0.18,
        pulseAmp: 0.031,
        pulseSpeed: 0.0021,
        flashColor: 0xb9d4ff,
        cloudDensity: 0.36,
        visionDebuff: 0.20,
        windBoost: 0.25,
        rainIntensity: rainLevel || 0.76
      };
    }
    if (label.includes("lluvia fuerte")) {
      return {
        tintColor: 0x93bcff,
        tintAlpha: 0.18,
        shadeColor: 0x0a1b40,
        shadeAlpha: 0.20,
        pulseAmp: 0.036,
        pulseSpeed: 0.0023,
        flashColor: 0xc7dcff,
        cloudDensity: 0.52,
        visionDebuff: 0.26,
        windBoost: 0.30,
        rainIntensity: rainLevel || 0.85
      };
    }
    if (label.includes("lluvia extrema")) {
      return {
        tintColor: 0x8badff,
        tintAlpha: 0.23,
        shadeColor: 0x061533,
        shadeAlpha: 0.28,
        pulseAmp: 0.046,
        pulseSpeed: 0.0029,
        flashColor: 0xe0ebff,
        cloudDensity: 0.72,
        visionDebuff: 0.34,
        windBoost: 0.36,
        rainIntensity: rainLevel || 1.0
      };
    }
    if (label.includes("humedad extrema")) {
      return {
        tintColor: 0xa5f3d0,
        tintAlpha: 0.12,
        shadeColor: 0x0f2b34,
        shadeAlpha: 0.10,
        pulseAmp: 0.028,
        pulseSpeed: 0.0016,
        flashColor: 0xd9fff1,
        cloudDensity: 0.28,
        visionDebuff: 0.10,
        windBoost: 0.08,
        rainIntensity: 0
      };
    }
    if (label.includes("calor fuera de temporada")) {
      return {
        tintColor: 0xffa45f,
        tintAlpha: 0.17,
        shadeColor: 0x3b180b,
        shadeAlpha: 0.12,
        pulseAmp: 0.030,
        pulseSpeed: 0.0019,
        flashColor: 0xffd9ac,
        cloudDensity: 0.06,
        visionDebuff: 0.04,
        windBoost: 0.03,
        rainIntensity: 0
      };
    }

    // Climas normales: sin filtro adicional de color (solo nubes/lluvia/debuff visual).
    if (label.includes("garua") || label.includes("llovizna") || label.includes("lluvia")) {
      return {
        ...base,
        cloudDensity: 0.20 + (rainLevel * 0.18),
        visionDebuff: 0.04 + (rainLevel * 0.05),
        windBoost: 0.07,
        rainIntensity: rainLevel || 0.24
      };
    }
    if (label.includes("niebla") || label.includes("neblina")) {
      return {
        ...base,
        cloudDensity: 0.40,
        visionDebuff: 0.18,
        windBoost: 0.05,
        rainIntensity: 0
      };
    }
    if (label.includes("calor") || label.includes("bochorno")) {
      return { ...base, cloudDensity: 0.05, visionDebuff: 0.03, windBoost: 0.02, rainIntensity: 0 };
    }
    if (label.includes("viento") || label.includes("brisa")) {
      return { ...base, cloudDensity: 0.14, visionDebuff: 0.04, windBoost: 0.50, rainIntensity: 0 };
    }
    if (label.includes("nublado") || label.includes("gris")) {
      return { ...base, cloudDensity: 0.10, visionDebuff: 0.03, windBoost: 0.03, rainIntensity: 0 };
    }
    if (label.includes("soleado") || label.includes("sol")) {
      return { ...base, cloudDensity: 0.02, visionDebuff: 0.00, windBoost: 0.02, rainIntensity: 0 };
    }

    return isEvent
      ? { tintColor: 0xdbeafe, tintAlpha: 0.10, shadeColor: 0x1e293b, shadeAlpha: 0.09, pulseAmp: 0.020, pulseSpeed: 0.0016, flashColor: 0xe2e8f0, cloudDensity: 0.14, visionDebuff: 0.08, windBoost: 0.08, rainIntensity: 0 }
      : base;
  }

  triggerWeatherEventFlash(color = 0xffffff, peak = 0.26, duration = 420) {
    if (!this.weatherFlashOverlay || !this.tweens) return;
    this.weatherFlashOverlay.setFillStyle(Number(color) >>> 0, 0);
    this.tweens.killTweensOf(this.weatherFlashOverlay);
    this.tweens.add({
      targets: this.weatherFlashOverlay,
      alpha: Phaser.Math.Clamp(Number(peak) || 0.26, 0, 0.55),
      duration: Math.max(60, Math.round(duration * 0.30)),
      ease: "Quad.Out",
      yoyo: true,
      hold: Math.max(20, Math.round(duration * 0.08)),
      onComplete: () => {
        if (this.weatherFlashOverlay) this.weatherFlashOverlay.setAlpha(0);
      }
    });
  }

  updateWeatherFx(deltaMs = 16) {
    const state = this.weatherFxState;
    if (!state || !this.weatherTintOverlay || !this.weatherShadeOverlay) return;

    const nowMs = Date.now();
    if (nowMs >= (state.nextPollAt || 0)) {
      state.nextPollAt = nowMs + 800;
      const snap = this.economy?.getLimaWeatherSnapshot?.(new Date()) || null;
      const label = String(snap?.weather || "");
      const labelLc = label.toLowerCase();
      const season = String(snap?.season || "");
      if (label && (label !== state.lastLabel || season !== state.lastSeason)) {
        const profile = this.getWeatherFxProfileByLabel(label, season);
        // Regla: no superponer filtros de clima/evento entre si.
        // Solo "viento fuerte" puede coexistir como capa secundaria (boost de movimiento).
        let windAssist = 0;
        if (!labelLc.includes("viento fuerte")) {
          const slot = Math.floor(nowMs / 180000); // cambia cada 3 min reales
          const seedText = `wind-overlay-${season}-${slot}`;
          const seed = this.economy?.hashHudSeed?.(seedText) ?? slot;
          const rr = this.economy?.seededRand01?.(seed + 71) ?? ((Math.sin((seed + 71) * 12.9898) * 43758.5453123) % 1);
          const norm = rr < 0 ? (rr + 1) : rr;
          const chance = season === "Invierno" ? 0.22 : 0.10;
          if (norm < chance) {
            windAssist = season === "Invierno" ? 0.72 : 0.52;
          }
        }
        state.targetTintColor = Number(profile.tintColor) >>> 0;
        state.targetShadeColor = Number(profile.shadeColor) >>> 0;
        state.targetTintAlpha = Phaser.Math.Clamp(Number(profile.tintAlpha) || 0, 0, 0.7);
        state.targetShadeAlpha = Phaser.Math.Clamp(Number(profile.shadeAlpha) || 0, 0, 0.75);
        state.targetPulseAmp = Phaser.Math.Clamp(Number(profile.pulseAmp) || 0, 0, 0.22);
        state.targetPulseSpeed = Math.max(0.0004, Number(profile.pulseSpeed) || 0.0015);
        state.targetFlashColor = Number(profile.flashColor) >>> 0;
        state.targetCloudDensity = Phaser.Math.Clamp(Number(profile.cloudDensity) || 0, 0, 1.4);
        state.targetVisionDebuff = Phaser.Math.Clamp(Number(profile.visionDebuff) || 0, 0, 1);
        state.targetWindBoost = Phaser.Math.Clamp(Math.max(Number(profile.windBoost) || 0, windAssist), 0, 1.2);
        state.targetRainIntensity = Phaser.Math.Clamp(Number(profile.rainIntensity) || 0, 0, 1);
        const baseTransition =
          (Number(profile.visionDebuff) || 0) > 0.50 ? 2400
            : (Number(profile.rainIntensity) || 0) > 0.35 ? 1800
              : 1400;
        const isEvent = label.toLowerCase().includes("evento:");
        state.transitionMs = Math.max(900, baseTransition + (isEvent ? 450 : 0));
        if (isEvent) {
          const peak = Math.max(0.18, state.targetPulseAmp + 0.16);
          this.time?.delayedCall?.(120, () => {
            this.triggerWeatherEventFlash(state.targetFlashColor, peak, 640);
          });
        }
        state.lastLabel = label;
        state.lastSeason = season;
      }
    }

    const dt = Math.max(0, Number(deltaMs) || 16);
    const smooth = 1 - Math.exp(-(dt / Math.max(900, Number(state.transitionMs) || 1400)));
    state.currentTintColor = this.lerpDayCycleColor(state.currentTintColor, state.targetTintColor, smooth);
    state.currentShadeColor = this.lerpDayCycleColor(state.currentShadeColor, state.targetShadeColor, smooth);
    state.currentTintAlpha = Phaser.Math.Linear(Number(state.currentTintAlpha) || 0, Number(state.targetTintAlpha) || 0, smooth);
    state.currentShadeAlpha = Phaser.Math.Linear(Number(state.currentShadeAlpha) || 0, Number(state.targetShadeAlpha) || 0, smooth);
    state.currentPulseAmp = Phaser.Math.Linear(Number(state.currentPulseAmp) || 0, Number(state.targetPulseAmp) || 0, smooth);
    state.currentPulseSpeed = Phaser.Math.Linear(Number(state.currentPulseSpeed) || 0.0015, Number(state.targetPulseSpeed) || 0.0015, smooth);
    state.currentCloudDensity = Phaser.Math.Linear(Number(state.currentCloudDensity) || 0, Number(state.targetCloudDensity) || 0, smooth);
    state.currentVisionDebuff = Phaser.Math.Linear(Number(state.currentVisionDebuff) || 0, Number(state.targetVisionDebuff) || 0, smooth);
    state.currentWindBoost = Phaser.Math.Linear(Number(state.currentWindBoost) || 0, Number(state.targetWindBoost) || 0, smooth);
    state.currentRainIntensity = Phaser.Math.Linear(Number(state.currentRainIntensity) || 0, Number(state.targetRainIntensity) || 0, smooth);

    const pulse = (Math.sin(nowMs * state.currentPulseSpeed) * 0.5 + 0.5) * state.currentPulseAmp;
    const tintFinal = Phaser.Math.Clamp((Number(state.currentTintAlpha) || 0) + pulse, 0, 0.75);
    const shadeFinal = Phaser.Math.Clamp((Number(state.currentShadeAlpha) || 0) + (pulse * 0.55), 0, 0.80);
    this.weatherTintOverlay.setFillStyle(state.currentTintColor, tintFinal);
    this.weatherShadeOverlay.setFillStyle(state.currentShadeColor, shadeFinal);
    this.drawWeatherClouds(nowMs, dt, state.currentCloudDensity, state.currentWindBoost);
    this.drawWeatherRain(nowMs, dt, state.currentRainIntensity, state.currentWindBoost);
    if (this.weatherVisionOverlay) {
      const v = Phaser.Math.Clamp(Number(state.currentVisionDebuff) || 0, 0, 1);
      const heavy = (v * 0.72) + (v * v * 0.30);
      this.weatherVisionOverlay.setAlpha(Phaser.Math.Clamp(heavy, 0, 0.94));
    }
  }

  drawWeatherClouds(nowMs = 0, deltaMs = 16, density = 0, windBoost = 0) {
    const g = this.weatherCloudOverlay;
    const state = this.weatherFxState;
    if (!g || !state) return;
    g.clear();

    const fog = Phaser.Math.Clamp(Number(density) || 0, 0, 1.4);
    const wind = Phaser.Math.Clamp(Number(windBoost) || 0, 0, 1.2);
    if (fog <= 0.01 || !Array.isArray(state.clouds) || !state.clouds.length) return;

    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    const dt = Math.max(0, Number(deltaMs) || 16);
    const cloudTone = fog > 0.75 ? 0xe8edf5 : 0xf1f5f9;
    const baseAlpha = 0.022 + (Math.min(1, fog) * 0.17) + (Math.max(0, fog - 1) * 0.14);
    const moveMul = (0.25 + (fog * 1.35)) * (1 + (wind * 2.25));

    if (fog > 0.92) {
      const blanket = Phaser.Math.Clamp(0.05 + ((fog - 0.92) * 0.35), 0, 0.14);
      g.fillStyle(0xe6edf6, blanket);
      g.fillRect(0, 0, w, h);
    }

    for (const c of state.clouds) {
      const r = Math.max(40, Number(c.r) || 80);
      const speed = Math.max(0.004, Number(c.speed) || 0.02);
      c.x += (dt * speed * moveMul);
      if (c.x > (w + r * 2)) c.x = -r * 2;
      const drift = Math.sin((nowMs * (Number(c.driftSpeed) || 0.001)) + (Number(c.seed) || 0)) * (Number(c.driftAmp) || 10);
      const y = Phaser.Math.Clamp((Number(c.y) || (h * 0.5)) + drift, -r, h + r);
      const alphaMul = Phaser.Math.Clamp(Number(c.alphaMul) || 1, 0.5, 1.5);
      const localPulse = 0.85 + (0.15 * Math.sin(nowMs * 0.0012 + (Number(c.seed) || 0)));
      const a = Phaser.Math.Clamp(baseAlpha * alphaMul * localPulse, 0, 0.30);

      g.fillStyle(cloudTone, a);
      g.fillEllipse(c.x - r * 0.42, y + r * 0.03, r * 1.00, r * 0.58);
      g.fillEllipse(c.x, y - r * 0.08, r * 1.34, r * 0.70);
      g.fillEllipse(c.x + r * 0.48, y + r * 0.05, r * 0.92, r * 0.54);
      if (fog > 0.65) {
        g.fillStyle(0xffffff, a * 0.28);
        g.fillEllipse(c.x + r * 0.10, y - r * 0.20, r * 0.70, r * 0.38);
      }
    }
  }

  drawWeatherRain(nowMs = 0, deltaMs = 16, intensity = 0, windBoost = 0) {
    const g = this.weatherRainOverlay;
    const state = this.weatherFxState;
    if (!g || !state) return;
    g.clear();

    const rain = Phaser.Math.Clamp(Number(intensity) || 0, 0, 1);
    if (rain <= 0.01) return;
    if (!Array.isArray(state.rainDrops) || !state.rainDrops.length) {
      this.rebuildWeatherRainDrops();
    }

    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    const dt = Math.max(0, Number(deltaMs) || 16);
    const wind = Phaser.Math.Clamp(Number(windBoost) || 0, 0, 1.2);
    const speedMul = (0.70 + (rain * 2.65)) * (1 + (wind * 2.10));
    const slant = (wind * 5.8) + 0.8;
    const baseAlpha = 0.18 + (rain * 0.52);
    const rainColor = rain >= 0.8 ? 0xb4d2ff : (rain >= 0.5 ? 0xc6ddff : 0xdce9ff);
    const activeCount = Math.max(18, Math.min(state.rainDrops.length, Math.round(state.rainDrops.length * (0.30 + (rain * 0.90)))));
    const lineW = rain >= 0.85 ? 2 : 1;

    for (let i = 0; i < activeCount; i++) {
      const d = state.rainDrops[i];
      const len = Math.max(6, (Number(d.len) || 10) * (0.85 + (rain * 0.95)));
      const dropSpeed = Math.max(0.04, Number(d.speed) || 0.14);
      d.y += dt * dropSpeed * speedMul;
      d.x += (dt * 0.018 * wind) + (Math.sin((nowMs * 0.0022) + (Number(d.seed) || 0)) * 0.015 * dt);

      if (d.y > (h + len + 8)) {
        d.y = -Phaser.Math.Between(6, 42);
        d.x = Phaser.Math.Between(-20, Math.round(w + 20));
      }
      if (d.x > (w + 32)) d.x = -24;
      if (d.x < -32) d.x = w + 24;

      const a = Phaser.Math.Clamp(baseAlpha * (Number(d.alpha) || 0.8), 0.08, 0.92);
      g.lineStyle(lineW, rainColor, a);
      g.beginPath();
      g.moveTo(d.x, d.y);
      g.lineTo(d.x + slant, d.y + len);
      g.strokePath();

      if (rain >= 0.78 && d.y > (h - 8)) {
        g.fillStyle(0xd9e8ff, a * 0.45);
        g.fillEllipse(d.x + (slant * 0.5), h - 3, 3 + (rain * 4), 1.2 + (rain * 1.6));
      }
    }
  }

  getInitialDayCycleProgressFromLocalTime() {
    return this.getDayCycleProgressFromLocalClock(new Date());
  }

  getDayCycleProgressFromLocalClock(dateValue = null) {
    const now = dateValue instanceof Date ? dateValue : new Date();
    const totalHours =
      now.getHours()
      + (now.getMinutes() / 60)
      + (now.getSeconds() / 3600)
      + (now.getMilliseconds() / 3600000);
    const raw = (totalHours - DAY_CYCLE_LOCAL_OFFSET_HOUR) / 24;
    return ((raw % 1) + 1) % 1;
  }

  getDayCyclePhaseLabel(progress = 0) {
    const p = ((Number(progress) % 1) + 1) % 1;
    if (p < 0.26) return "MANANA";
    if (p < 0.46) return "TARDE";
    if (p < 0.62) return "NOCHE";
    return "MADRUGADA";
  }

  getDayCycleDebugButtonLabel() {
    const state = this.dayCycleState || {};
    const phase = String(state.phaseLabel || this.getDayCyclePhaseLabel(state.progress || 0));
    return `CICLO: AUTO | ${phase}`;
  }

  refreshDayCycleDebugButton() {
    if (!this.dayCycleDebugBtn) return;
    this.dayCycleDebugBtn.setText(this.getDayCycleDebugButtonLabel());
  }

  cycleDayCycleMode() {
    const state = this.dayCycleState;
    if (!state) return;
    state.mode = "auto";
    const p = ((Number(state.progress) % 1) + 1) % 1;
    const jumps = Array.isArray(DAY_CYCLE_DEBUG_JUMP_PHASES) && DAY_CYCLE_DEBUG_JUMP_PHASES.length
      ? DAY_CYCLE_DEBUG_JUMP_PHASES
      : [{ progress: 0.12 }, { progress: 0.36 }, { progress: 0.54 }, { progress: 0.78 }];
    let next = jumps[0];
    for (let i = 0; i < jumps.length; i++) {
      const jp = Number(jumps[i]?.progress);
      if (!Number.isFinite(jp)) continue;
      if (jp > (p + 0.0001)) {
        next = jumps[i];
        break;
      }
    }
    const nextProgress = ((Number(next?.progress) % 1) + 1) % 1;
    const deltaProgress = ((nextProgress - p + 1) % 1);
    const baseSpeed = Math.max(0.05, Number(state.baseSpeed) || Number(state.speed) || 1);
    const duration = Math.max(1000, Number(state.durationMs) || DAY_CYCLE_DURATION_MS);
    const targetMs = Math.max(900, DAY_CYCLE_DEBUG_FAST_FORWARD_TARGET_MS);
    const rawBoost = (Math.max(0.0001, deltaProgress) * duration) / targetMs;
    const boostSpeed = Phaser.Math.Clamp(
      Math.max(baseSpeed * 1.5, rawBoost),
      DAY_CYCLE_DEBUG_FAST_FORWARD_MIN_SPEED,
      DAY_CYCLE_DEBUG_FAST_FORWARD_MAX_SPEED
    );
    state.baseSpeed = baseSpeed;
    state.speed = boostSpeed;
    state.debugJump = {
      targetProgress: nextProgress,
      startedAt: Date.now(),
      timeoutMs: Math.max(1400, Math.round(targetMs * 2.8)),
      baseSpeed,
      boostSpeed
    };
    state.lastWallClockMs = Date.now();
    this.refreshDayCycleDebugButton();
  }

  didDayCycleProgressReachTargetForward(prevProgress = 0, currentProgress = 0, targetProgress = 0) {
    const p0 = ((Number(prevProgress) % 1) + 1) % 1;
    const p1 = ((Number(currentProgress) % 1) + 1) % 1;
    const t = ((Number(targetProgress) % 1) + 1) % 1;
    if (p0 <= p1) {
      return t > p0 && t <= p1;
    }
    return t > p0 || t <= p1;
  }

  lerpDayCycleColor(colorA, colorB, t = 0) {
    const c1 = Number(colorA) >>> 0;
    const c2 = Number(colorB) >>> 0;
    const k = Phaser.Math.Clamp(Number(t) || 0, 0, 1);
    const r = Math.round(((c1 >> 16) & 0xff) + ((((c2 >> 16) & 0xff) - ((c1 >> 16) & 0xff)) * k));
    const g = Math.round(((c1 >> 8) & 0xff) + ((((c2 >> 8) & 0xff) - ((c1 >> 8) & 0xff)) * k));
    const b = Math.round((c1 & 0xff) + (((c2 & 0xff) - (c1 & 0xff)) * k));
    return (r << 16) | (g << 8) | b;
  }

  sampleDayCycleFrame(progress = 0) {
    const p = ((Number(progress) % 1) + 1) % 1;
    const keys = DAY_CYCLE_KEYFRAMES;
    let a = keys[0];
    let b = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      const k0 = keys[i];
      const k1 = keys[i + 1];
      if (p >= k0.t && p <= k1.t) {
        a = k0;
        b = k1;
        break;
      }
    }
    const span = Math.max(0.000001, Number(b.t) - Number(a.t));
    const tRaw = Phaser.Math.Clamp((p - Number(a.t)) / span, 0, 1);
    const t = tRaw * tRaw * (3 - (2 * tRaw)); // smoothstep
    return {
      tintColor: this.lerpDayCycleColor(a.tintColor, b.tintColor, t),
      tintAlpha: Phaser.Math.Linear(Number(a.tintAlpha) || 0, Number(b.tintAlpha) || 0, t),
      shadeColor: this.lerpDayCycleColor(a.shadeColor, b.shadeColor, t),
      shadeAlpha: Phaser.Math.Linear(Number(a.shadeAlpha) || 0, Number(b.shadeAlpha) || 0, t),
      phaseLabel: this.getDayCyclePhaseLabel(p)
    };
  }

  blendDayCycleSample(current, target, amount = 0.1) {
    if (!current) return target;
    if (!target) return current;
    const a = Phaser.Math.Clamp(Number(amount) || 0, 0, 1);
    return {
      tintColor: this.lerpDayCycleColor(current.tintColor, target.tintColor, a),
      tintAlpha: Phaser.Math.Linear(Number(current.tintAlpha) || 0, Number(target.tintAlpha) || 0, a),
      shadeColor: this.lerpDayCycleColor(current.shadeColor, target.shadeColor, a),
      shadeAlpha: Phaser.Math.Linear(Number(current.shadeAlpha) || 0, Number(target.shadeAlpha) || 0, a),
      phaseLabel: String(target.phaseLabel || current.phaseLabel || "MANANA")
    };
  }

  applyDayCycleVisual(sample) {
    if (!sample) return;
    if (this.dayTintOverlay) {
      this.dayTintOverlay.setFillStyle(sample.tintColor, Phaser.Math.Clamp(Number(sample.tintAlpha) || 0, 0, 1));
    }
    if (this.dayShadeOverlay) {
      this.dayShadeOverlay.setFillStyle(sample.shadeColor, Phaser.Math.Clamp(Number(sample.shadeAlpha) || 0, 0, 1));
    }
  }

  updateDayCycle(deltaMs = 16) {
    const state = this.dayCycleState;
    if (!state) return;
    state.mode = "auto";
    const delta = Math.max(0, Number(deltaMs) || 16);
    const nowWall = Date.now();
    const lastWall = Math.max(0, Math.round(Number(state.lastWallClockMs) || 0));
    let elapsedWall = delta;
    if (lastWall > 0 && nowWall >= lastWall) {
      elapsedWall = Math.max(0, nowWall - lastWall);
    }
    state.lastWallClockMs = nowWall;

    const duration = Math.max(1000, Number(state.durationMs) || DAY_CYCLE_DURATION_MS);
    const speed = Math.max(0.05, Number(state.speed) || 1);
    const prevProgress = ((Number(state.progress) % 1) + 1) % 1;
    state.progress = (prevProgress + ((elapsedWall * speed) / duration)) % 1;
    const jump = state.debugJump;
    if (jump && typeof jump === "object") {
      const targetProgress = ((Number(jump.targetProgress) % 1) + 1) % 1;
      const reached = this.didDayCycleProgressReachTargetForward(prevProgress, state.progress, targetProgress);
      const timedOut = (nowWall - Math.max(0, Number(jump.startedAt) || nowWall))
        >= Math.max(900, Number(jump.timeoutMs) || 2200);
      if (reached || timedOut) {
        state.progress = targetProgress;
        state.speed = Math.max(0.05, Number(jump.baseSpeed) || Number(state.baseSpeed) || 1);
        state.baseSpeed = state.speed;
        state.debugJump = null;
      }
    } else {
      state.baseSpeed = Math.max(0.05, Number(state.speed) || 1);
    }
    const target = this.sampleDayCycleFrame(state.progress);
    const smooth = 1 - Math.exp(-(delta / DAY_CYCLE_VISUAL_SMOOTH_MS));
    state.visualSample = this.blendDayCycleSample(state.visualSample, target, smooth);
    this.applyDayCycleVisual(state.visualSample);

    const nextLabel = String(target.phaseLabel || this.getDayCyclePhaseLabel(state.progress));
    if (nextLabel !== state.phaseLabel) {
      state.phaseLabel = nextLabel;
      this.refreshDayCycleDebugButton();
    }
  }

  // ================= UI helpers =================
  hasBlockingDomOverlay() {
    return Boolean(
      document.getElementById("building-modal") ||
      document.getElementById("evo-modal") ||
      document.getElementById("gacha-modal") ||
      document.getElementById("gacha-anim-overlay") ||
      document.getElementById("inventory-modal") ||
      document.getElementById("admin-modal") ||
      document.getElementById("yapa-modal") ||
      document.getElementById("yapa-qr-modal") ||
      document.getElementById("producer-modal") ||
      document.getElementById("npc-slots-modal") ||
      document.getElementById("npc-heat-modal")
    );
  }

  modeLabel() {
    if (this.yapaScanMode) {
      return "Modo: Escanear QR | Toca la casa con icono Yapa";
    }
    return mode === "build"
      ? "Modo: \u{1F3D7}\uFE0F Construccion"
      : "Modo: \u{1F5B1}\uFE0F Cursor";
  }

  startYapaScanMode() {
    const active = this.getActiveYapaBonusBuilding(Date.now());
    if (!active) return false;

    this.closeBuildingMenu();
    if (this.moveMode) this.cancelMoveMode(true);
    this.setCursorMode();
    this.yapaScanMode = true;
    this.modeText.setText(this.modeLabel());
    return true;
  }

  stopYapaScanMode() {
    if (!this.yapaScanMode) return;
    this.yapaScanMode = false;
    this.modeText.setText(this.modeLabel());
  }

  handleYapaScanTap(idOnTile) {
    if (!this.yapaScanMode) return false;
    const now = Date.now();
    const active = this.getActiveYapaBonusBuilding(now);
    if (!active) {
      this.stopYapaScanMode();
      return false;
    }
    if (!idOnTile || idOnTile !== active.id) return false;

    const def = BUILDING_TYPES[active.typeKey] || BUILDING_TYPES.green_1;
    const payload = {
      buildingId: active.id,
      typeKey: active.typeKey,
      label: def.label || active.typeKey
    };

    const amount = 5 + Math.floor(Math.random() * 6); // 5..10
    this.economy?.openYapaQrModal?.({ ...payload, amount });
    this.economy?.updateYapaRailTimer?.();
    this.stopYapaScanMode();
    return true;
  }

  claimYapaBonusFromQr(buildingId) {
    const b = this.getActiveYapaBonusBuilding(Date.now());
    if (!b) return false;
    if (Number(buildingId) !== Number(b.id)) return false;
    this.clearBuildingYapaBonus(b);
    return true;
  }

  updateBottomHintLayout() {
    const w = this.scale?.width || this.game?.config?.width || 1920;
    const h = this.scale?.height || this.game?.config?.height || 1080;
    const bottomPad = 14;
    const rowGap = 32;
    const row2Y = Math.max(170, h - (rowGap + bottomPad));
    const rowY = row2Y - rowGap;
    const modeY = rowY - 28;
    const helpY = modeY - 28;

    if (this.helpText?.setPosition) this.helpText.setPosition(16, helpY);
    if (this.modeText?.setPosition) this.modeText.setPosition(16, modeY);
    if (this.trafficCapacityText?.setPosition) {
      this.trafficCapacityText.setPosition(Math.round(w * 0.5), 126);
    }

    let nextX = 16;
    if (this.npcDebugBtn?.setPosition) {
      this.npcDebugBtn.setPosition(nextX, rowY);
      nextX += (this.npcDebugBtn.width || 110) + 10;
    }
    if (this.npcStatsDebugBtn?.setPosition) {
      this.npcStatsDebugBtn.setPosition(nextX, rowY);
      nextX += (this.npcStatsDebugBtn.width || 140) + 10;
    }
    if (this.gridCodeBtn?.setPosition) {
      this.gridCodeBtn.setPosition(nextX, rowY);
      nextX += (this.gridCodeBtn.width || 130) + 10;
    }
    if (this.itemDirDebugBtn?.setPosition) {
      this.itemDirDebugBtn.setPosition(nextX, rowY);
      nextX += (this.itemDirDebugBtn.width || 130) + 10;
    }

    let row2X = 16;
    if (this.roadPieceDebugBtn?.setPosition) {
      this.roadPieceDebugBtn.setPosition(row2X, row2Y);
      row2X += (this.roadPieceDebugBtn.width || 130) + 10;
    }
    if (this.camCenterDebugBtn?.setPosition) {
      this.camCenterDebugBtn.setPosition(row2X, row2Y);
      row2X += (this.camCenterDebugBtn.width || 150) + 10;
    }
    if (this.dayCycleDebugBtn?.setPosition) {
      this.dayCycleDebugBtn.setPosition(row2X, row2Y);
    }
  }

  showTrafficCapacityMessage(message, durationMs = 3200) {
    const msg = String(message || "").trim();
    if (!msg || !this.trafficCapacityText) return;

    const now = Date.now();
    if ((this.nextTrafficCapacityMsgAt || 0) > now && this.trafficCapacityLastMessage === msg) return;
    this.nextTrafficCapacityMsgAt = now + TRAFFIC_NPC_CAPACITY_MSG_COOLDOWN_MS;
    this.trafficCapacityLastMessage = msg;

    const label = this.trafficCapacityText;
    this.trafficCapacityHideCall?.remove(false);
    this.tweens.killTweensOf(label);
    label.setText(msg);
    this.updateBottomHintLayout();
    label.setVisible(true);
    label.setAlpha(0);

    this.tweens.add({
      targets: label,
      alpha: 1,
      duration: 180,
      ease: "Quad.Out"
    });

    this.trafficCapacityHideCall = this.time.delayedCall(durationMs, () => {
      this.tweens.killTweensOf(label);
      this.tweens.add({
        targets: label,
        alpha: 0,
        duration: 260,
        ease: "Quad.In",
        onComplete: () => {
          label.setVisible(false);
        }
      });
    });
  }

  setCameraCenterDebugVisible(visible) {
    const v = !!visible;
    this.camCenterDebugDot?.setVisible(v);
    this.camCenterDebugCrossH?.setVisible(v);
    this.camCenterDebugCrossV?.setVisible(v);
    this.camCenterDebugLabel?.setVisible(v);
  }

  updateCameraCenterDebugOverlay(force = false) {
    if (!this.camCenterDebugEnabled) {
      this.setCameraCenterDebugVisible(false);
      this.camCenterDebugLastLabel = "";
      return;
    }

    const cam = this.worldCam;
    if (!cam) return;

    const w = this.scale?.width || cam.width || 0;
    const h = this.scale?.height || cam.height || 0;
    const cx = w * 0.5;
    const cy = h * 0.5;

    const worldCenter = cam.getWorldPoint(cx, cy);
    const label = `SCR C (${Math.round(cx)}, ${Math.round(cy)}) | WORLD C (${Math.round(worldCenter.x)}, ${Math.round(worldCenter.y)}) | Z ${Number(cam.zoom || 1).toFixed(3)}`;

    this.setCameraCenterDebugVisible(true);
    this.camCenterDebugDot?.setPosition(cx, cy);
    this.camCenterDebugCrossH?.setPosition(cx, cy);
    this.camCenterDebugCrossV?.setPosition(cx, cy);

    if (force || label !== this.camCenterDebugLastLabel) {
      this.camCenterDebugLabel?.setText(label);
      this.camCenterDebugLastLabel = label;
    }

    const labelX = Math.min(Math.max(8, cx + 16), Math.max(8, w - ((this.camCenterDebugLabel?.width || 0) + 8)));
    const labelY = Math.max(8, cy + 14);
    this.camCenterDebugLabel?.setPosition(labelX, labelY);
  }

  getBuildPreview() {
    const typeKey = this.selectedBuildKey || "green_1";
    if (this.buildPreviewTypeKey !== typeKey) {
      this.buildPreviewTypeKey = typeKey;
      this.buildRotationStep = 0;
    }
    const def = BUILDING_TYPES[typeKey] || BUILDING_TYPES.green_1;
    const size = def.size;
    const rawStep = Number.isFinite(this.buildRotationStep) ? this.buildRotationStep : 0;
    const rotationStep = this.canRotateBuilding(typeKey)
      ? (((rawStep % 4) + 4) % 4)
      : 0;
    return { typeKey, def, size, rotationStep };
  }

  getPlacementTopLeftForHoverTile(tile, size = 1) {
    if (!tile) return null;
    const s = Math.max(1, Math.floor(Number(size) || 1));
    if (s <= 1) return { r: tile.r, c: tile.c };

    // Ajustes por tamano para que el ghost quede centrado al mouse en cada caso.
    const anchorBySize = {
      2: { r: 0, c: 0 },
      3: { r: 1, c: 1 },
      4: { r: 1, c: 1 },
      9: { r: 4, c: 4 }
    };

    const anchor = anchorBySize[s];
    if (anchor) return { r: tile.r - anchor.r, c: tile.c - anchor.c };

    const half = Math.floor(s / 2);
    return { r: tile.r - half, c: tile.c - half };
  }

  requiresDoorFacingRoadForPlacement(typeKey) {
    // Mapeo de puerta por rotacion: 0/1/2/3 => E/S/O/N.
    // Aplica a tiendas y casas con puerta.
    return this.isMinimarketBuilding(typeKey) || this.isDecorativeHouse(typeKey) || this.isNpcResidenceBuilding(typeKey);
  }

  requiresAdjacentRoadForPlacement(typeKey) {
    return this.requiresDoorFacingRoadForPlacement(typeKey);
  }

  hasAdjacentRoadAroundArea(r0, c0, size) {
    for (let r = r0; r < r0 + size; r++) {
      if (this.isRoadCell(r, c0 - 1)) return true;
      if (this.isRoadCell(r, c0 + size)) return true;
    }
    for (let c = c0; c < c0 + size; c++) {
      if (this.isRoadCell(r0 - 1, c)) return true;
      if (this.isRoadCell(r0 + size, c)) return true;
    }
    return false;
  }

  hasRoadOnFacingSide(r0, c0, size, facing = { dr: 0, dc: 1 }) {
    const dr = Math.sign(Number(facing?.dr) || 0);
    const dc = Math.sign(Number(facing?.dc) || 0);
    if (dr === 0 && dc === 1) {
      const cc = c0 + size;
      for (let r = r0; r < r0 + size; r++) if (this.isRoadCell(r, cc)) return true;
      return false;
    }
    if (dr === 1 && dc === 0) {
      const rr = r0 + size;
      for (let c = c0; c < c0 + size; c++) if (this.isRoadCell(rr, c)) return true;
      return false;
    }
    if (dr === 0 && dc === -1) {
      const cc = c0 - 1;
      for (let r = r0; r < r0 + size; r++) if (this.isRoadCell(r, cc)) return true;
      return false;
    }
    if (dr === -1 && dc === 0) {
      const rr = r0 - 1;
      for (let c = c0; c < c0 + size; c++) if (this.isRoadCell(rr, c)) return true;
      return false;
    }
    return false;
  }

  hasDoorFacingRoadForPlacement(typeKey, size, r0, c0, rotationStep = 0) {
    if (!this.requiresDoorFacingRoadForPlacement(typeKey)) return true;
    const facing = this.getHouseSpawnFacing(typeKey, rotationStep);
    return this.hasRoadOnFacingSide(r0, c0, size, facing);
  }

  canPlaceBuildAt(typeKey, size, r0, c0, rotationStep = 0) {
    const replacingRoad = (typeKey === "road_main_2x2") ? this.getRoadReplacementTarget(r0, c0, size) : null;
    if (!canPlace(size, r0, c0) && !replacingRoad) return false;
    if (typeKey === "road_main_2x2" && !replacingRoad && this.blocksParallelRoadPlacementAt(r0, c0, size)) return false;
    if (!this.requiresAdjacentRoadForPlacement(typeKey)) return true;
    if (this.requiresDoorFacingRoadForPlacement(typeKey)) {
      return this.hasDoorFacingRoadForPlacement(typeKey, size, r0, c0, rotationStep);
    }
    return this.hasAdjacentRoadAroundArea(r0, c0, size);
  }

  getHouseSpawnFacing(typeKey, rotationStep = 0) {
    const step = (((rotationStep || 0) % 4) + 4) % 4;
    if (this.isMinimarketBuilding(typeKey) || this.isDecorativeHouse(typeKey) || this.isNpcResidenceBuilding(typeKey)) {
      // Mapeo pedido por diseÃ±o:
      // 0(normal): abajo-derecha
      // 1(giro1):  abajo-izquierda
      // 2(giro2):  arriba-izquierda
      // 3(giro3):  arriba-derecha
      if (step === 0) return { dr: 0, dc: 1 };
      if (step === 1) return { dr: 1, dc: 0 };
      if (step === 2) return { dr: 0, dc: -1 };
      return { dr: -1, dc: 0 };
    }
    return { dr: 0, dc: 1 };
  }

  getHouseSpawnDirectionPriority(typeKey, rotationStep = 0) {
    const fwd = this.getHouseSpawnFacing(typeKey, rotationStep);
    const left = { dr: -fwd.dc, dc: fwd.dr };
    const right = { dr: fwd.dc, dc: -fwd.dr };
    const back = { dr: -fwd.dr, dc: -fwd.dc };
    return [fwd, left, right, back];
  }

  placeStarterRoads() {
    const prevBuildKey = this.selectedBuildKey;
    const prevMode = mode;

    this.selectedBuildKey = "road_main_2x2";

    // Patron simple en cruz cerca del centro para que ya existan carreteras base.
    const r0 = MAP_CENTER_R - 6;
    const c0 = MAP_CENTER_C - 6;
    const coords = [];

    for (let i = 0; i < 7; i++) {
      coords.push({ r: r0 + (i * 2), c: c0 + 6 });
    }
    for (let i = 0; i < 7; i++) {
      coords.push({ r: r0 + 6, c: c0 + (i * 2) });
    }

    for (const t of coords) {
      if (canPlace(2, t.r, t.c)) this.placeBuilding(t.r, t.c);
    }

    this.selectedBuildKey = prevBuildKey;
    mode = prevMode;
  }

  placeStarterConera() {
    const prevBuildKey = this.selectedBuildKey;
    const prevMode = mode;
    const prevRotationStep = this.buildRotationStep || 0;

    this.selectedBuildKey = "casa_conera_4";
    // Garantiza que exista 1 unidad para el starter placement.
    this.economy?.addItem?.("casa_conera_4", 1);

    const size = 4;
    const candidates = [
      // Ajuste al sur, evitando pisar la carretera horizontal central.
      // (r = center-4) queda mas al sur que antes y sigue siendo valido.
      // Puerta al Este (rot 0) mirando a la columna vertical de carreteras iniciales.
      { r: MAP_CENTER_R - 4, c: MAP_CENTER_C - 4, rot: 0 },
      // Puerta al Oeste (rot 2) misma altura, lado contrario.
      { r: MAP_CENTER_R - 4, c: MAP_CENTER_C + 2, rot: 2 },
      // Fallback mas al sur.
      { r: MAP_CENTER_R + 4, c: MAP_CENTER_C - 4, rot: 0 },
      { r: MAP_CENTER_R + 4, c: MAP_CENTER_C + 2, rot: 2 },
      // Fallback cerca del tramo horizontal con orientaciones N/S.
      { r: MAP_CENTER_R - 6, c: MAP_CENTER_C - 2, rot: 1 },
      { r: MAP_CENTER_R + 2, c: MAP_CENTER_C - 2, rot: 3 }
    ];

    let placedId = 0;
    for (const cand of candidates) {
      const r = Math.round(Number(cand.r) || 0);
      const c = Math.round(Number(cand.c) || 0);
      const rot = (((Number(cand.rot) || 0) % 4) + 4) % 4;
      if (!inBounds(r, c) || !inBounds(r + size - 1, c + size - 1)) continue;
      if (!this.canPlaceBuildAt("casa_conera_4", size, r, c, rot)) continue;

      const beforeId = nextBuildingId;
      this.buildRotationStep = rot;
      this.placeBuilding(r, c);
      const built = buildings.get(beforeId);
      if (built && built.typeKey === "casa_conera_4") {
        // Completa la construccion en el siguiente tick.
        built.buildEnd = Date.now() - 1;
        placedId = built.id;
      }
      break;
    }

    this.selectedBuildKey = prevBuildKey;
    this.buildRotationStep = prevRotationStep;
    mode = prevMode;
    return placedId;
  }

  tileKey(r, c) {
    return `${r},${c}`;
  }

  parseTileKey(key) {
    const parts = String(key || "").split(",");
    return {
      r: Number(parts[0]) || 0,
      c: Number(parts[1]) || 0
    };
  }

  isRoadBuilding(b) {
    return !!(b && b.isBuilt && b.typeKey === "road_main_2x2");
  }

  isRoadCell(r, c) {
    if (!inBounds(r, c)) return false;
    const id = grid[r][c];
    if (!id) return false;
    const b = buildings.get(id);
    return this.isRoadBuilding(b);
  }

  getRoadReplacementTarget(r0, c0, size = 2) {
    if (size !== 2) return null;

    let roadId = 0;
    for (let r = r0; r < r0 + size; r++) {
      for (let c = c0; c < c0 + size; c++) {
        if (!inBounds(r, c)) return null;
        const id = grid[r][c];
        if (!id) return null;
        if (!roadId) roadId = id;
        if (id !== roadId) return null;
      }
    }

    const b = buildings.get(roadId);
    if (!b || b.typeKey !== "road_main_2x2") return null;
    const topLeft = this.getRoadTopLeftCell(b);
    if (!topLeft) return null;
    if (topLeft.r !== r0 || topLeft.c !== c0) return null;
    return b;
  }

  freezeExistingRoadPiecesToForced(defaultPiece = 33) {
    const fallback = Phaser.Math.Clamp(Math.round(Number(defaultPiece) || 33), 1, ROADKOTO_PIECES);
    for (const b of buildings.values()) {
      if (!b || b.typeKey !== "road_main_2x2") continue;
      const current = this.getRoadCurrentPieceNumber(b);
      const frozen = Phaser.Math.Clamp(Math.round(Number(current) || fallback), 1, ROADKOTO_PIECES);
      b.roadForcedPiece = frozen;
      b.roadResolvedPiece = frozen;
      b.roadResolvedRot = 0;
      this.normalizeRoadBuildingState(b, false);
      this.redrawRoadBuildingVisual(b, 0.85);
    }
  }

  releaseAllRoadForcedPieces(redraw = true) {
    for (const b of buildings.values()) {
      if (!b || b.typeKey !== "road_main_2x2") continue;
      b.roadForcedPiece = 0;
      this.normalizeRoadBuildingState(b, false);
      if (redraw) this.redrawRoadBuildingVisual(b, 0.85);
    }
  }

  normalizeRoadBuildingState(b, redraw = false) {
    if (!b || b.typeKey !== "road_main_2x2") return false;
    const def = BUILDING_TYPES.road_main_2x2;
    let changed = false;
    if ((b.rotationStep || 0) !== 0) {
      b.rotationStep = 0;
      changed = true;
    }
    if (b.border !== def.border) {
      b.border = def.border;
      changed = true;
    }
    if (redraw) this.redrawRoadBuildingVisual(b);
    return changed;
  }

  getRoadBuildingIdsAroundCells(cells, padding = 1) {
    const ids = new Set();
    if (!Array.isArray(cells) || !cells.length) return ids;

    for (const cell of cells) {
      for (let rr = cell.r - padding; rr <= cell.r + padding; rr++) {
        for (let cc = cell.c - padding; cc <= cell.c + padding; cc++) {
          if (!inBounds(rr, cc)) continue;
          const id = grid[rr][cc];
          if (!id) continue;
          const b = buildings.get(id);
          if (this.isRoadBuilding(b)) ids.add(id);
        }
      }
    }
    return ids;
  }

  refreshRoadVisualsAroundCells(cells, padding = 1) {
    const ids = this.getRoadBuildingIdsAroundCells(cells, padding);

    // Expandir 1 salto mas: cuando cambia un vecino, puede afectar al vecino del vecino.
    const firstWaveCells = [];
    for (const id of ids) {
      const b = buildings.get(id);
      if (!b?.cells?.length) continue;
      for (const t of b.cells) firstWaveCells.push({ r: t.r, c: t.c });
    }
    const expandedIds = this.getRoadBuildingIdsAroundCells(firstWaveCells, 1);
    for (const id of expandedIds) ids.add(id);

    // Dos pasadas para estabilizar reglas que dependen de la pieza de vecinos.
    for (let pass = 0; pass < 2; pass++) {
      for (const id of ids) {
        const b = buildings.get(id);
        this.redrawRoadBuildingVisual(b);
      }
    }
  }

  getRoadKotoTextureKey(index) {
    const n = Phaser.Math.Clamp(Math.round(Number(index) || 1), 1, ROADKOTO_PIECES);
    const id = String(n).padStart(2, "0");
    const pngKey = `roadkoto_${id}_png`;
    const jpgKey = `roadkoto_${id}_jpg`;
    const legacyKey = `roadkoto_${id}`;
    if (this.textures?.exists?.(pngKey)) return pngKey;
    if (this.textures?.exists?.(jpgKey)) return jpgKey;
    if (this.textures?.exists?.(legacyKey)) return legacyKey;
    return jpgKey;
  }

  getRoadTopLeftCell(b) {
    if (!b?.cells?.length) return null;
    let minR = Infinity;
    let minC = Infinity;
    for (const t of b.cells) {
      if (t.r < minR) minR = t.r;
      if (t.c < minC) minC = t.c;
    }
    if (!Number.isFinite(minR) || !Number.isFinite(minC)) return null;
    return { r: minR, c: minC };
  }

  getRoadPieceFromTextureKey(texKey) {
    const m = /^roadkoto_(\d{2})(?:_(?:png|jpg))?$/.exec(String(texKey || ""));
    if (!m) return 0;
    return Phaser.Math.Clamp(parseInt(m[1], 10) || 0, 0, ROADKOTO_PIECES);
  }

  getRoadCurrentPieceNumber(b) {
    if (!b || b.typeKey !== "road_main_2x2") return 0;

    // El numero ROAD debe corresponder al JPG que se esta viendo.
    const texPiece = this.getRoadPieceFromTextureKey(b.roadSpriteImg?.texture?.key);
    if (texPiece > 0) return texPiece;

    const forcedPiece = Phaser.Math.Clamp(Math.round(Number(b.roadForcedPiece) || 0), 0, ROADKOTO_PIECES);
    if (forcedPiece > 0) return forcedPiece;

    const resolvedPiece = Phaser.Math.Clamp(Math.round(Number(b.roadResolvedPiece) || 0), 0, ROADKOTO_PIECES);
    if (resolvedPiece > 0) return resolvedPiece;

    return 0;
  }

  getRoadTopLeftParityKey(r, c) {
    return `${(r & 1)}:${(c & 1)}`;
  }

  isRoadBlockAlignedWith(r0, c0, b) {
    if (!b || b.typeKey !== "road_main_2x2") return false;
    const topLeft = this.getRoadTopLeftCell(b);
    if (!topLeft) return false;
    return this.getRoadTopLeftParityKey(r0, c0) === this.getRoadTopLeftParityKey(topLeft.r, topLeft.c);
  }

  getRoadNeighborBuildingAtSide(r0, c0, side) {
    const candidates = (side === "N")
      ? [{ r: r0 - 1, c: c0 }, { r: r0 - 1, c: c0 + 1 }]
      : (side === "E")
        ? [{ r: r0, c: c0 + 2 }, { r: r0 + 1, c: c0 + 2 }]
        : (side === "S")
          ? [{ r: r0 + 2, c: c0 }, { r: r0 + 2, c: c0 + 1 }]
          : [{ r: r0, c: c0 - 1 }, { r: r0 + 1, c: c0 - 1 }];

    for (const p of candidates) {
      if (!inBounds(p.r, p.c)) continue;
      const b = this.getBuildingAtCell(p.r, p.c);
      if (this.isRoadBlockAlignedWith(r0, c0, b)) return b;
    }
    return null;
  }

  getRoadNeighborPieceBySide(r0, c0, side) {
    const b = this.getRoadNeighborBuildingAtSide(r0, c0, side);
    if (!b) return 0;
    return this.getRoadCurrentPieceNumber(b);
  }

  getRoadMaskForBuilding(b) {
    if (!b || b.typeKey !== "road_main_2x2") return 0;
    const topLeft = this.getRoadTopLeftCell(b);
    if (!topLeft) return 0;
    return this.getRoadNeighborMaskForBlock(topLeft.r, topLeft.c);
  }

  isRoadMaskVerticalStraight(mask) {
    const m = (mask & 15);
    return m === 1 || m === 4 || m === 5;
  }

  isRoadMaskHorizontalStraight(mask) {
    const m = (mask & 15);
    return m === 2 || m === 8 || m === 10;
  }

  blocksParallelRoadPlacementAt(r0, c0, size = 2) {
    if (size !== 2) return false;

    const diagonals = ["NW", "NE", "SE", "SW"];
    for (const diag of diagonals) {
      const b = this.getRoadNeighborBuildingAtDiagonal(r0, c0, diag);
      if (!b) continue;
      if ((this.getRoadMaskForBuilding(b) & 15) === 15) return true;
    }

    return false;
  }

  getRoadNeighborBuildingAtDiagonal(r0, c0, diag) {
    const probe = (diag === "NW")
      ? { r: r0 - 1, c: c0 - 1 }
      : (diag === "NE")
        ? { r: r0 - 1, c: c0 + 2 }
        : (diag === "SE")
          ? { r: r0 + 2, c: c0 + 2 }
          : { r: r0 + 2, c: c0 - 1 };

    if (!inBounds(probe.r, probe.c)) return null;
    const b = this.getBuildingAtCell(probe.r, probe.c);
    if (this.isRoadBlockAlignedWith(r0, c0, b)) return b;
    return null;
  }

  getRoadNeighborPieceByDiagonal(r0, c0, diag) {
    const b = this.getRoadNeighborBuildingAtDiagonal(r0, c0, diag);
    if (!b) return 0;
    return this.getRoadCurrentPieceNumber(b);
  }

  getRoadSpecialPieceByNeighborRoads(mask, r0, c0) {
    const m = (mask & 15);

    const centerRoad = this.getBuildingAtCell(r0, c0);
    if (!centerRoad || centerRoad.typeKey !== "road_main_2x2") return 0;

    const centerPiece = this.getRoadCurrentPieceNumber(centerRoad);
    const n = this.getRoadNeighborPieceBySide(r0, c0, "N");
    const e = this.getRoadNeighborPieceBySide(r0, c0, "E");
    const s = this.getRoadNeighborPieceBySide(r0, c0, "S");
    const w = this.getRoadNeighborPieceBySide(r0, c0, "W");
    const nwDiag = this.getRoadNeighborPieceByDiagonal(r0, c0, "NW");
    const neDiag = this.getRoadNeighborPieceByDiagonal(r0, c0, "NE");
    const swDiag = this.getRoadNeighborPieceByDiagonal(r0, c0, "SW");
    const diagMask = this.getRoadDiagonalMaskForBlock(r0, c0);

    const hasN = n > 0;
    const hasE = e > 0;
    const hasS = s > 0;
    const hasW = w > 0;
    const hasNW = (diagMask & 1) !== 0;
    const hasNE = (diagMask & 2) !== 0;
    const hasSE = (diagMask & 4) !== 0;
    const hasSW = (diagMask & 8) !== 0;

    if ((centerPiece === 19 || centerPiece === 36) && hasNW && (w === 1 || w === 45) && (n === 2 || n === 40)) return 36;
    if ((centerPiece === 11 || centerPiece === 15) && hasNW) return 15;

    // Cadena 21/22 -> 30 y colocado -> 34.
    const ruleRoad21WestTo30 = ((centerPiece === 21 || centerPiece === 30) && hasN && hasW && n === 34 && (swDiag === 5 || swDiag === 37));
    const ruleRoad22NorthTo30 = ((centerPiece === 22 || centerPiece === 30) && hasN && hasW && w === 34 && neDiag === 4);
    const rulePlacedWestTo34 = (hasE && hasS && (e === 21 || e === 30) && (s === 5 || s === 37) && neDiag === 34);
    const rulePlacedNorthTo34 = (hasS && hasE && (s === 22 || s === 30) && e === 4 && swDiag === 34);
    if (ruleRoad21WestTo30 || ruleRoad22NorthTo30) return 30;
    if (rulePlacedWestTo34 || rulePlacedNorthTo34) return 34;

    // Cadena al colocar al O de ROAD 34.
    const ruleRoad34WestChainA = ((centerPiece === 34 || centerPiece === 22) && hasW && hasS && hasSW && (s === 45 || s === 24));
    const ruleRoad34WestChainB = ((centerPiece === 45 || centerPiece === 24) && hasN && hasW && hasNW && (n === 34 || n === 22) && (w === 5 || w === 37));
    const ruleRoad45Under21Chain = ((centerPiece === 45 || centerPiece === 24) && hasN && hasW && hasNW && (n === 21 || n === 30) && (w === 5 || w === 37) && nwDiag === 34);
    if (ruleRoad34WestChainA) return 22;
    if (ruleRoad34WestChainB) return 24;
    if (ruleRoad45Under21Chain) return 24;

    // Cadena al colocar al N de ROAD 34.
    const ruleRoad34NorthChainA = ((centerPiece === 34 || centerPiece === 21) && hasN && hasE && hasNE && (e === 40 || e === 23));
    const ruleRoad34NorthChainB = ((centerPiece === 40 || centerPiece === 23) && hasN && hasW && hasNW && (n === 4 || n === 35) && (w === 34 || w === 21));
    const ruleRoad34NorthChainC = ((centerPiece === 4 || centerPiece === 35) && hasS && hasW && hasSW && (s === 40 || s === 23));
    if (ruleRoad34NorthChainA) return 21;
    if (ruleRoad34NorthChainB) return 23;
    if (ruleRoad34NorthChainC) return 35;

    if (centerPiece === 1 || centerPiece === 45) {
      if (hasN && (e === 19 || e === 36)) return 45;
    }

    if (centerPiece === 2 || centerPiece === 40) {
      if (hasW && (s === 19 || s === 36)) return 40;
    }

    if (centerPiece === 1 || centerPiece === 42 || centerPiece === 43 || centerPiece === 44 || centerPiece === 45) {
      if (hasN && hasE && !hasS && !hasW) return 45;
      if (hasN && hasW && !hasS && !hasE) return 42;
      if (hasS && hasE && !hasN && !hasW) return 43;
      if (hasS && hasW && !hasN && !hasE) return 44;
    }

    if (centerPiece === 2 || centerPiece === 38 || centerPiece === 39 || centerPiece === 40 || centerPiece === 41) {
      if (hasS && hasW && !hasN && !hasE) return 40;
      if (hasS && hasE && !hasN && !hasW) return 41;
      if (hasN && hasW && !hasS && !hasE) return 38;
      if (hasN && hasE && !hasS && !hasW) return 39;
    }

    if ((centerPiece === 19 || centerPiece === 36) && hasW && hasN && hasNW) return 36;
    if ((centerPiece === 20 || centerPiece === 37) && hasN && hasE && hasNE) return 37;
    if ((centerPiece === 17 || centerPiece === 34) && hasE && hasS && hasSE) return 34;
    if ((centerPiece === 18 || centerPiece === 35) && hasS && hasW && hasSW) return 35;

    if ((centerPiece === 5 || centerPiece === 20 || centerPiece === 37) && hasN && hasE && hasNE && (e === 45 || e === 24)) return 37;
    if ((centerPiece === 5 || centerPiece === 20 || centerPiece === 37) && hasN && hasE && (n === 34) && (e === 45 || e === 24) && (neDiag === 21 || neDiag === 30)) return 37;

    if (centerPiece === 5) {
      if (hasN && hasS) return 10;
      if (hasN && !hasS) return 20;
      if (hasS && !hasN) return 17;
    }

    if (centerPiece === 20 && hasS) return 10;
    if (centerPiece === 17 && hasN) return 10;

    if (centerPiece === 3) {
      if (hasN && hasS) return 8;
      if (hasS) return 18;
      if (hasN) return 19;
    }

    if (centerPiece === 19 && hasS) return 18;
    if (centerPiece === 19 && hasE && hasN && !hasS) return 20;

    if (centerPiece === 18) {
      if (hasE) return 11;
      if (hasN) return 8;
    }

    if (centerPiece === 8 && hasE) return 11;
    if (centerPiece === 10 && hasW) return 11;

    if (centerPiece === 11 && m === 15) return 11;
    if (m !== 15) return 0;

    const ruleA = (w === 1 && e === 1 && n === 2 && s === 2);
    const ruleB = (w === 5 && e === 3 && (n === 4 || n === 2 || n === 6) && (s === 6 || s === 5 || s === 2 || s === 4));
    const ruleC = (centerPiece === 7 && (w === 5 || w === 1) && (e === 1 || e === 3) && (s === 6 || s === 2) && hasN);
    const ruleD = (centerPiece === 9 && (n === 2 || n === 4) && (w === 5 || w === 1) && (e === 1 || e === 3) && (s === 2 || s === 6));
    if (ruleA || ruleB || ruleC || ruleD) return 11;

    return 0;
  }

  hasRoadNeighborNorth(r0, c0) {
    return !!this.getRoadNeighborBuildingAtSide(r0, c0, "N");
  }

  hasRoadNeighborEast(r0, c0) {
    return !!this.getRoadNeighborBuildingAtSide(r0, c0, "E");
  }

  hasRoadNeighborSouth(r0, c0) {
    return !!this.getRoadNeighborBuildingAtSide(r0, c0, "S");
  }

  hasRoadNeighborWest(r0, c0) {
    return !!this.getRoadNeighborBuildingAtSide(r0, c0, "W");
  }

  getRoadNeighborMaskForBlock(r0, c0) {
    let mask = 0;
    if (this.hasRoadNeighborNorth(r0, c0)) mask |= 1;
    if (this.hasRoadNeighborEast(r0, c0)) mask |= 2;
    if (this.hasRoadNeighborSouth(r0, c0)) mask |= 4;
    if (this.hasRoadNeighborWest(r0, c0)) mask |= 8;
    return mask;
  }

  getRoadDiagonalMaskForBlock(r0, c0) {
    let mask = 0;
    const markIfAlignedRoad = (rr, cc, bit) => {
      const b = this.getBuildingAtCell(rr, cc);
      if (this.isRoadBlockAlignedWith(r0, c0, b)) mask |= bit;
    };
    markIfAlignedRoad(r0 - 1, c0 - 1, 1); // NW
    markIfAlignedRoad(r0 - 1, c0 + 2, 2); // NE
    markIfAlignedRoad(r0 + 2, c0 + 2, 4); // SE
    markIfAlignedRoad(r0 + 2, c0 - 1, 8); // SW
    return mask;
  }

  hashRoadVariant(r0, c0, mask, diagMask) {
    const a = ((r0 * 73856093) ^ (c0 * 19349663)) >>> 0;
    const b = (((mask & 15) * 83492791) ^ ((diagMask & 15) * 2654435761)) >>> 0;
    return (a ^ b) >>> 0;
  }

  getRoadKotoPieceForMask(mask, diagMask, r0, c0) {
    const stableDiagMask = 0;
    const pick = (arr) => {
      if (!Array.isArray(arr) || !arr.length) return 12;
      const h = this.hashRoadVariant(r0, c0, mask, stableDiagMask);
      return arr[h % arr.length];
    };

    // N=1, E=2, S=4, W=8
    // Solo usa conexiones principales N/E/S/O. Las diagonales no fuerzan piezas.
    switch (mask & 15) {
      case 0: return { piece: 33, rot: 0 }; // aislado
      // Regla guiada por diseno (conexion de 2 carreteras adyacentes):
      // solo N -> pieza 6, solo S -> pieza 4, solo E -> pieza 5, solo O -> pieza 3
      case 1: return { piece: 6, rot: 0 }; // solo N
      case 2: return { piece: 5, rot: 0 }; // solo E
      case 4: return { piece: 4, rot: 0 }; // solo S
      case 8: return { piece: 3, rot: 0 }; // solo O
      case 5: return { piece: 2, rot: 0 };   // N-S
      case 10: return { piece: 1, rot: 0 };  // E-W
      case 3: return { piece: 20, rot: 0 };   // N-E
      case 6: return { piece: 17, rot: 0 };  // E-S
      case 12: return { piece: 18, rot: 0 }; // S-W
      case 9: return { piece: 19, rot: 0 }; // W-N
      case 11: return { piece: 9, rot: 0 };    // falta N
      case 13: return { piece: 8, rot: 0 };   // N-S + O
      case 14: return { piece: 7, rot: 0 };  // T desde ROAD 1 + S
      case 7: return { piece: 10, rot: 0 };   // N-S + E
      case 15: return { piece: 11, rot: 0 }; // N+E+S+O siempre ROAD 11
      default: return { piece: 12, rot: 0 };
    }
  }

  ensureRoadKotoSprite(b) {
    if (!b || b.typeKey !== "road_main_2x2") return null;
    if (b.roadSprite?.active && b.roadSpriteImg?.active) return b.roadSprite;

    const sprite = this.add.container(0, 0).setVisible(true);
    const img = this.add.image(0, 0, this.getRoadKotoTextureKey(12))
      .setOrigin(0.5, 0.5)
      .setVisible(true);
    sprite.add(img);
    this.uiCam.ignore(sprite);

    b.roadSprite = sprite;
    b.roadSpriteImg = img;
    return sprite;
  }

  applyRoadKotoSpriteVisual(b, alpha = 1) {
    if (!b || b.typeKey !== "road_main_2x2") return false;
    const topLeft = this.getRoadTopLeftCell(b);
    if (!topLeft) return false;

    const pieceSel = this.getRoadPieceSelectionForBuilding(b);
    if (!pieceSel?.piece) return false;
    const texKey = this.getRoadKotoTextureKey(pieceSel.piece);
    if (!this.textures?.exists?.(texKey)) return false;

    const roadSprite = this.ensureRoadKotoSprite(b);
    if (!roadSprite || !b.roadSpriteImg) return false;

    const img = b.roadSpriteImg;
    if (img.texture?.key !== texKey) img.setTexture(texKey);
    img.setAlpha(Phaser.Math.Clamp(alpha, 0, 1));

    const source = img.texture?.getSourceImage?.();
    const texW = Math.max(1, Number(source?.width) || 295);
    const blockW = TILE_W * 2;
    const baseScale = blockW / (Math.SQRT2 * texW);
    img.setScale(baseScale);
    img.setAngle(ROADKOTO_ISO_CHILD_ANGLE + pieceSel.rot);

    b.roadResolvedPiece = pieceSel.piece;
    b.roadResolvedRot = pieceSel.rot;

    roadSprite.setScale(1, ROADKOTO_ISO_PARENT_SCALE_Y);
    const center = isoToScreen(topLeft.r + 0.5, topLeft.c + 0.5);
    roadSprite.setPosition(Math.round(center.x), Math.round(center.y));
    roadSprite.setDepth(8 + (center.y * 0.001));
    roadSprite.setVisible(true);
    return true;
  }

  getBuildingAtCell(r, c) {
    if (!inBounds(r, c)) return null;
    const id = grid[r][c];
    if (!id) return null;
    return buildings.get(id) || null;
  }

  isBlockedByNonRoadBuilding(r, c) {
    const b = this.getBuildingAtCell(r, c);
    if (!b) return false;
    return !this.isRoadBuilding(b);
  }

  getNpcSideCell(r, c, dirR, dirC, side = 1) {
    const perpR = -dirC * side;
    const perpC = dirR * side;
    return {
      r: Math.round(r + perpR),
      c: Math.round(c + perpC)
    };
  }

  isSideBlockedForNpc(r, c, dirR, dirC, side = 1) {
    if (!dirR && !dirC) return false;

    const perpR = -dirC * side;
    const perpC = dirR * side;
    const checks = [];
    const addCheck = (rr, cc) => {
      checks.push({ r: Math.round(rr), c: Math.round(cc) });
      checks.push({ r: Math.floor(rr), c: Math.floor(cc) });
      checks.push({ r: Math.ceil(rr), c: Math.ceil(cc) });
    };

    addCheck(r + perpR, c + perpC);
    addCheck(r + perpR + (dirR * 0.5), c + perpC + (dirC * 0.5));
    addCheck(r + perpR - (dirR * 0.5), c + perpC - (dirC * 0.5));
    addCheck(r + perpR + dirR, c + perpC + dirC);
    addCheck(r + perpR - dirR, c + perpC - dirC);

    const visited = new Set();
    for (const t of checks) {
      if (!inBounds(t.r, t.c)) continue;
      const key = this.tileKey(t.r, t.c);
      if (visited.has(key)) continue;
      visited.add(key);
      if (this.isBlockedByNonRoadBuilding(t.r, t.c)) return true;
    }
    return false;
  }

  getSafeRoadEdgeSideForNpc(r, c, dirR, dirC, fallback = 1) {
    if (!dirR && !dirC) return fallback || 1;

    const preferred = this.getPreferredRoadEdgeSide(r, c, dirR, dirC, fallback);
    if (!this.isSideBlockedForNpc(r, c, dirR, dirC, preferred)) return preferred;

    const opposite = -preferred;
    if (!this.isSideBlockedForNpc(r, c, dirR, dirC, opposite)) return opposite;

    return preferred;
  }

  getBuildingRenderDepth(b) {
    if (!b) return 0;
    if (Number.isFinite(b?.sprite?.depth)) return b.sprite.depth;
    const anchor = this.getBuildingAnchor(b);
    if (!anchor) return 0;
    return 30 + (anchor.y * 0.01);
  }

  getBuildingFrontIndex(b) {
    if (!b?.cells?.length) return -Infinity;
    let front = -Infinity;
    for (const cell of b.cells) {
      const idx = cell.r + cell.c;
      if (idx > front) front = idx;
    }
    return front;
  }

  getNearbyNonRoadBuildings(r, c, range = TRAFFIC_NPC_OCCLUSION_SCAN_RANGE, limit = 12) {
    const rr = Math.round(r);
    const cc = Math.round(c);
    const out = [];
    const seen = new Set();

    for (let tr = rr - range; tr <= rr + range; tr++) {
      for (let tc = cc - range; tc <= cc + range; tc++) {
        if (!inBounds(tr, tc)) continue;
        const b = this.getBuildingAtCell(tr, tc);
        if (!b || this.isRoadBuilding(b)) continue;
        const id = Number(b.id) || 0;
        if (seen.has(id)) continue;
        seen.add(id);
        out.push(b);
        if (out.length >= limit) return out;
      }
    }
    return out;
  }

  clampNpcDepthAgainstNearbyBuildings(baseDepth, r, c) {
    let outDepth = baseDepth;
    const npcFrontIndex = r + c;
    const nearby = this.getNearbyNonRoadBuildings(r, c);

    for (const b of nearby) {
      const buildingDepth = this.getBuildingRenderDepth(b);
      if (!(buildingDepth > 0)) continue;
      const buildingFront = this.getBuildingFrontIndex(b);
      if (!(buildingFront > -Infinity)) continue;

      // Si el NPC esta "detras" del frente de la casa, siempre va por debajo en depth.
      if (npcFrontIndex <= (buildingFront + TRAFFIC_NPC_OCCLUSION_FRONT_EPS)) {
        outDepth = Math.min(outDepth, buildingDepth - TRAFFIC_NPC_OCCLUSION_DEPTH_MARGIN);
      }
    }
    return outDepth;
  }

  getBuiltRoadCells(limit = 6000) {
    const cells = [];
    for (const b of buildings.values()) {
      if (!this.isRoadBuilding(b)) continue;
      for (const cell of b.cells) {
        cells.push({ r: cell.r, c: cell.c });
        if (cells.length >= limit) return cells;
      }
    }
    return cells;
  }

  pickRandomRoadCell(refCell = null, minDist = 0) {
    const cells = this.getBuiltRoadCells();
    if (!cells.length) return null;

    let pool = cells;
    if (refCell && minDist > 0) {
      const minDist2 = minDist * minDist;
      const filtered = cells.filter((t) => {
        const dr = t.r - refCell.r;
        const dc = t.c - refCell.c;
        return ((dr * dr) + (dc * dc)) >= minDist2;
      });
      if (filtered.length) pool = filtered;
    }

    return pool[Math.floor(Math.random() * pool.length)] || null;
  }

  getStreetNpcZoneCountAt(r, c, radiusTiles = TRAFFIC_NPC_ZONE_RADIUS_TILES, excludeNpcId = 0) {
    const radius = Math.max(0, Number(radiusTiles) || 0);
    let count = 0;
    for (const npc of this.streetNpcs) {
      if (!npc?.sprite?.active) continue;
      if (excludeNpcId && Number(npc.id) === Number(excludeNpcId)) continue;
      const dr = (Number(npc.r) || 0) - r;
      const dc = (Number(npc.c) || 0) - c;
      if (Math.hypot(dr, dc) <= radius) count++;
    }
    return count;
  }

  findStreetNpcOverflowRoadTarget(fromRoad) {
    if (!fromRoad || !this.isRoadCell(fromRoad.r, fromRoad.c)) return null;

    const minDist2 = TRAFFIC_NPC_ZONE_RELOCATE_MIN_DIST_TILES * TRAFFIC_NPC_ZONE_RELOCATE_MIN_DIST_TILES;
    const cells = this.getBuiltRoadCells(9000);
    if (!cells.length) return null;

    let best = null;
    let bestCount = Infinity;
    for (let i = 0; i < TRAFFIC_NPC_ZONE_RELOCATE_TRIES; i++) {
      const target = cells[Math.floor(Math.random() * cells.length)] || null;
      if (!target) continue;
      const dr = target.r - fromRoad.r;
      const dc = target.c - fromRoad.c;
      if (((dr * dr) + (dc * dc)) < minDist2) continue;

      const zoneCount = this.getStreetNpcZoneCountAt(target.r, target.c, TRAFFIC_NPC_ZONE_RADIUS_TILES);
      if (zoneCount >= TRAFFIC_NPC_ZONE_MAX_COUNT) continue;

      const path = this.findRoadPath(fromRoad, target, 4500);
      if (!path || path.length < 2) continue;

      if (zoneCount < bestCount) {
        best = { r: target.r, c: target.c };
        bestCount = zoneCount;
        if (zoneCount <= 0) break;
      }
    }

    return best;
  }

  prepareStreetNpcSpawnPlan(preferredRoad) {
    if (!preferredRoad || !this.isRoadCell(preferredRoad.r, preferredRoad.c)) {
      return { ok: false, overflowTargetRoad: null };
    }

    const localCount = this.getStreetNpcZoneCountAt(preferredRoad.r, preferredRoad.c, TRAFFIC_NPC_ZONE_RADIUS_TILES);
    if (localCount < TRAFFIC_NPC_ZONE_MAX_COUNT) {
      return { ok: true, overflowTargetRoad: null };
    }

    const overflowTargetRoad = this.findStreetNpcOverflowRoadTarget(preferredRoad);
    if (overflowTargetRoad) {
      return { ok: true, overflowTargetRoad };
    }

    this.showTrafficCapacityMessage("Falta espacio para NPC. Agranda la zona y carreteras.");
    return { ok: false, overflowTargetRoad: null };
  }

  getNearestRoadCellToPoint(r, c, limit = 6000) {
    let best = null;
    let bestD2 = Infinity;
    let seen = 0;

    for (const b of buildings.values()) {
      if (!this.isRoadBuilding(b)) continue;
      for (const cell of b.cells) {
        const dr = cell.r - r;
        const dc = cell.c - c;
        const d2 = (dr * dr) + (dc * dc);
        if (d2 < bestD2) {
          bestD2 = d2;
          best = { r: cell.r, c: cell.c };
        }
        seen++;
        if (seen >= limit) return best;
      }
    }
    return best;
  }

  findRoadPath(start, end, maxNodes = 4200) {
    if (!start || !end) return null;
    if (!this.isRoadCell(start.r, start.c)) return null;
    if (!this.isRoadCell(end.r, end.c)) return null;

    const startKey = this.tileKey(start.r, start.c);
    const endKey = this.tileKey(end.r, end.c);
    if (startKey === endKey) return [{ r: start.r, c: start.c }];

    const q = [{ r: start.r, c: start.c }];
    let head = 0;
    const prev = new Map();
    prev.set(startKey, null);

    const dirs = [
      { dr: 1, dc: 0 },
      { dr: -1, dc: 0 },
      { dr: 0, dc: 1 },
      { dr: 0, dc: -1 }
    ];

    while (head < q.length && prev.size <= maxNodes) {
      const cur = q[head++];
      const curKey = this.tileKey(cur.r, cur.c);
      if (curKey === endKey) break;

      for (const d of dirs) {
        const nr = cur.r + d.dr;
        const nc = cur.c + d.dc;
        if (!this.isRoadCell(nr, nc)) continue;
        const nk = this.tileKey(nr, nc);
        if (prev.has(nk)) continue;
        prev.set(nk, curKey);
        q.push({ r: nr, c: nc });
      }
    }

    if (!prev.has(endKey)) return null;

    const path = [];
    let k = endKey;
    while (k) {
      path.push(this.parseTileKey(k));
      k = prev.get(k);
    }
    path.reverse();
    return path;
  }

  getPreferredRoadEdgeSide(r, c, dirR, dirC, fallback = 1) {
    if (!dirR && !dirC) return fallback || 1;

    // side=1  -> izquierda del movimiento
    // side=-1 -> derecha del movimiento
    const leftR = r + (-dirC);
    const leftC = c + dirR;
    const rightR = r + dirC;
    const rightC = c + (-dirR);

    const leftRoad = this.isRoadCell(leftR, leftC);
    const rightRoad = this.isRoadCell(rightR, rightC);
    const leftBlocked = this.isSideBlockedForNpc(r, c, dirR, dirC, 1);
    const rightBlocked = this.isSideBlockedForNpc(r, c, dirR, dirC, -1);

    // Nunca elegir lado que este ocupado por casa/edificio no-carretera.
    if (leftBlocked && !rightBlocked) return -1;
    if (rightBlocked && !leftBlocked) return 1;

    // Prioriza caminar pegado al borde donde NO hay carretera.
    if (!leftRoad && rightRoad) return 1;
    if (leftRoad && !rightRoad) return -1;

    return fallback || 1;
  }

  getRoadSideOffsetPixels(r, c, dirR, dirC, side = 1) {
    if (!dirR && !dirC) return { x: 0, y: 0 };
    // Regla dura: peatones solo dentro de bloques de pista.
    // Si por cualquier motivo no estamos sobre una celda de pista, no aplicar offset lateral.
    if (!this.isRoadCell(Math.round(r), Math.round(c))) return { x: 0, y: 0 };
    let sideToUse = side >= 0 ? 1 : -1;
    if (this.isSideBlockedForNpc(r, c, dirR, dirC, sideToUse)
      && !this.isSideBlockedForNpc(r, c, dirR, dirC, -sideToUse)) {
      sideToUse = -sideToUse;
    }

    const perpR = -dirC * sideToUse;
    const perpC = dirR * sideToUse;
    const sideCell = this.getNpcSideCell(r, c, dirR, dirC, sideToUse);
    const sideCellR = sideCell.r;
    const sideCellC = sideCell.c;
    // Si ese lado no es pista, mantener al NPC centrado en la pista (sin salirse).
    if (!this.isRoadCell(sideCellR, sideCellC)) return { x: 0, y: 0 };
    let offsetTiles = TRAFFIC_NPC_SIDE_OFFSET_TILES;

    // Si ese lado tiene edificio, reduce el offset para no encimarse.
    if (this.isBlockedByNonRoadBuilding(sideCellR, sideCellC)) {
      offsetTiles = Math.min(offsetTiles, TRAFFIC_NPC_BLOCKED_SIDE_OFFSET_TILES);
    }

    const p0 = isoToScreen(r, c);
    const p1 = isoToScreen(
      r + (perpR * offsetTiles),
      c + (perpC * offsetTiles)
    );
    return { x: p1.x - p0.x, y: p1.y - p0.y };
  }

  setTrafficCarScreenPosition(car, r, c, dirR = 0, dirC = 0) {
    const p = isoToScreen(r, c);
    const carY = p.y + (TILE_H * 0.12);
    const tileR = Math.round(r);
    const tileC = Math.round(c);

    car.r = r;
    car.c = c;
    car.sprite.setPosition(Math.round(p.x), Math.round(carY));

    let carDepth = 30.35 + (carY * 0.01);
    let dirRForSide = dirR ? Math.sign(dirR) : 0;
    let dirCForSide = dirC ? Math.sign(dirC) : 0;
    if (!dirRForSide && !dirCForSide) {
      dirRForSide = 0;
      dirCForSide = 1;
    }

    const side = this.getSafeRoadEdgeSideForNpc(tileR, tileC, dirRForSide, dirCForSide, 1);
    const sideCell = this.getNpcSideCell(tileR, tileC, dirRForSide, dirCForSide, side);
    const sideBuilding = this.getBuildingAtCell(sideCell.r, sideCell.c);
    if (sideBuilding && !this.isRoadBuilding(sideBuilding)) {
      const sideDepth = this.getBuildingRenderDepth(sideBuilding);
      if (sideDepth > 0) {
        carDepth = Math.min(carDepth, sideDepth - TRAFFIC_NPC_OCCLUSION_DEPTH_MARGIN);
      }
    }
    car.sprite.setDepth(carDepth);

    if (dirR || dirC) {
      const p2 = isoToScreen(r + dirR, c + dirC);
      const angle = Phaser.Math.RadToDeg(Math.atan2(p2.y - p.y, p2.x - p.x));
      car.sprite.setAngle(angle);
    }
  }

  setStreetNpcScreenPosition(npc, r, c) {
    const p = isoToScreen(r, c);
    const tileR = Math.round(r);
    const tileC = Math.round(c);

    const targetDirRRaw = Number.isFinite(npc.dirR) ? npc.dirR : 0;
    const targetDirCRaw = Number.isFinite(npc.dirC) ? npc.dirC : 1;
    let dirRForSide = targetDirRRaw ? Math.sign(targetDirRRaw) : 0;
    let dirCForSide = targetDirCRaw ? Math.sign(targetDirCRaw) : 0;
    if (!dirRForSide && !dirCForSide) {
      dirRForSide = 0;
      dirCForSide = 1;
    }

    let sideForOffset = npc.side || 1;
    if (npc.side === npc.sideTarget) {
      const preferredSide = this.getSafeRoadEdgeSideForNpc(
        tileR,
        tileC,
        dirRForSide,
        dirCForSide,
        sideForOffset
      );
      npc.sideTarget = preferredSide;
    }
    if (typeof npc.sideVisual !== "number") {
      npc.sideVisual = sideForOffset;
    }
    npc.sideVisual = Phaser.Math.Linear(npc.sideVisual, npc.sideTarget || sideForOffset, TRAFFIC_NPC_SIDE_LERP);
    if (Math.abs((npc.sideTarget || sideForOffset) - npc.sideVisual) < 0.02) {
      npc.sideVisual = npc.sideTarget || sideForOffset;
    }
    sideForOffset = npc.sideVisual;

    const sideForChecks = sideForOffset >= 0 ? 1 : -1;
    if (this.isSideBlockedForNpc(tileR, tileC, dirRForSide, dirCForSide, sideForChecks)) {
      const safeSide = this.getSafeRoadEdgeSideForNpc(tileR, tileC, dirRForSide, dirCForSide, sideForChecks);
      npc.side = safeSide;
      npc.sideTarget = safeSide;
      npc.sideVisual = safeSide;
      sideForOffset = safeSide;
    }

    const targetDirR = targetDirRRaw;
    const targetDirC = targetDirCRaw;
    if (typeof npc.dirVisualR !== "number") npc.dirVisualR = targetDirR;
    if (typeof npc.dirVisualC !== "number") npc.dirVisualC = targetDirC;
    npc.dirVisualR = Phaser.Math.Linear(npc.dirVisualR, targetDirR, TRAFFIC_NPC_DIR_LERP);
    npc.dirVisualC = Phaser.Math.Linear(npc.dirVisualC, targetDirC, TRAFFIC_NPC_DIR_LERP);
    const dirLen = Math.hypot(npc.dirVisualR, npc.dirVisualC);
    if (dirLen > 0.0001) {
      npc.dirVisualR /= dirLen;
      npc.dirVisualC /= dirLen;
    } else {
      npc.dirVisualR = 0;
      npc.dirVisualC = 1;
    }

    const off = this.getRoadSideOffsetPixels(r, c, dirRForSide, dirCForSide, sideForOffset);
    const npcY = p.y + (TILE_H * 0.20) + off.y;
    const targetX = Math.round(p.x + off.x);
    const targetY = Math.round(npcY);
    npc.r = r;
    npc.c = c;

    if (!Number.isFinite(npc.screenX) || !Number.isFinite(npc.screenY)) {
      npc.screenX = targetX;
      npc.screenY = targetY;
    } else {
      npc.screenX = Phaser.Math.Linear(npc.screenX, targetX, TRAFFIC_NPC_SCREEN_LERP);
      npc.screenY = Phaser.Math.Linear(npc.screenY, targetY, TRAFFIC_NPC_SCREEN_LERP);
      if (Math.abs(targetX - npc.screenX) < 0.35) npc.screenX = targetX;
      if (Math.abs(targetY - npc.screenY) < 0.35) npc.screenY = targetY;
    }
    npc.sprite.setPosition(
      npc.screenX,
      npc.screenY
    );

    // Si camina hacia arriba en pantalla, lo tratamos como "de espaldas".
    const facingScreenDy = (npc.dirVisualR + npc.dirVisualC) * (TILE_H * 0.5);
    const isBackFacing = facingScreenDy < -0.01;
    if (npc.isBackFacing !== isBackFacing) {
      npc.isBackFacing = isBackFacing;
      this.setStreetNpcFillColor(npc, isBackFacing);
    }

    let npcDepth = 30.18 + ((Number.isFinite(npc.screenY) ? npc.screenY : npcY) * 0.01);
    const sideCell = this.getNpcSideCell(r, c, dirRForSide, dirCForSide, sideForOffset >= 0 ? 1 : -1);
    const sideBuilding = this.getBuildingAtCell(sideCell.r, sideCell.c);
    if (sideBuilding && !this.isRoadBuilding(sideBuilding)) {
      const sideDepth = this.getBuildingRenderDepth(sideBuilding);
      if (sideDepth > 0) {
        npcDepth = Math.min(npcDepth, sideDepth - TRAFFIC_NPC_OCCLUSION_DEPTH_MARGIN);
      }
    }
    npcDepth = this.clampNpcDepthAgainstNearbyBuildings(npcDepth, r, c);
    npc.sprite.setDepth(npcDepth);
  }
  updateStreetNpcCameraFade(npc, deltaMs = 16) {
    const sprite = npc?.sprite;
    const cam = this.worldCam;
    if (!sprite?.active || !cam) return;

    const zoom = Math.max(0.001, Number(cam.zoom) || 1);
    const marginWorld = TRAFFIC_NPC_CAMERA_FADE_MARGIN_PX / zoom;
    const view = cam.worldView;
    const x = Number.isFinite(npc?.screenX) ? npc.screenX : sprite.x;
    const y = Number.isFinite(npc?.screenY) ? npc.screenY : sprite.y;
    const visible = (
      x >= (view.x - marginWorld)
      && x <= (view.x + view.width + marginWorld)
      && y >= (view.y - marginWorld)
      && y <= (view.y + view.height + marginWorld)
    );
    const target = visible ? 1 : 0;
    const lerp = 1 - Math.pow(1 - TRAFFIC_NPC_CAMERA_FADE_LERP, Math.max(1, deltaMs / 16));

    if (!Number.isFinite(npc.cameraFadeAlpha)) npc.cameraFadeAlpha = target;
    npc.cameraFadeAlpha = Phaser.Math.Linear(npc.cameraFadeAlpha, target, lerp);
    if (Math.abs(target - npc.cameraFadeAlpha) < 0.02) npc.cameraFadeAlpha = target;
    sprite.setAlpha(npc.cameraFadeAlpha);
  }

  isRoadCellOnDoorFacingSideOfBuilding(b, roadR, roadC) {
    if (!b?.cells?.length) return false;
    const size = Math.max(1, Math.round(Number(b.size) || Number(BUILDING_TYPES[b.typeKey]?.size) || 1));
    let minR = Infinity;
    let minC = Infinity;
    for (const cell of b.cells) {
      minR = Math.min(minR, Number(cell?.r) || 0);
      minC = Math.min(minC, Number(cell?.c) || 0);
    }
    if (!Number.isFinite(minR) || !Number.isFinite(minC)) return false;
    const face = this.getHouseSpawnFacing(b.typeKey, b.rotationStep || 0);
    const dr = Math.sign(Number(face?.dr) || 0);
    const dc = Math.sign(Number(face?.dc) || 0);
    if (dr === 0 && dc === 1) return roadC === (minC + size) && roadR >= minR && roadR < (minR + size);
    if (dr === 1 && dc === 0) return roadR === (minR + size) && roadC >= minC && roadC < (minC + size);
    if (dr === 0 && dc === -1) return roadC === (minC - 1) && roadR >= minR && roadR < (minR + size);
    if (dr === -1 && dc === 0) return roadR === (minR - 1) && roadC >= minC && roadC < (minC + size);
    return false;
  }

  isStreetNpcShopBuildingActive(b, now = Date.now()) {
    if (!b || !b.isBuilt || !this.isMinimarketBuilding(b.typeKey)) return false;
    if (!this.isStreetNpcShopOpenNow(b, now)) return false;
    if (!this.isBuildingActivationUnlocked(b)) return false;
    if (!this.hasBuildingProduction(b)) return false;
    if (b.rewardReady) return true;
    const cycle = Math.max(0, Number(b.prodCycle) || 0);
    const startedAt = Number(b.prodStart) || 0;
    if (!(cycle > 0)) return true;
    if (!(startedAt > 0)) return true;
    const elapsed = now - startedAt;
    if (!(elapsed >= 0)) return false;
    if (elapsed > (cycle * 1.2)) return false;
    return true;
  }

  getAdjacentMinimarketCandidatesForRoadCell(r, c, now = Date.now()) {
    const facing = [];
    const side = [];
    const seen = new Set();
    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];
    for (const d of dirs) {
      const b = this.getBuildingAtCell(r + d.dr, c + d.dc);
      if (!b || !b.isBuilt || !this.isMinimarketBuilding(b.typeKey)) continue;
      const id = Number(b.id) || 0;
      if (seen.has(id)) continue;
      if (!this.isStreetNpcShopBuildingActive(b, now)) continue;
      seen.add(id);
      if (this.isRoadCellOnDoorFacingSideOfBuilding(b, r, c)) facing.push(b);
      else side.push(b);
    }
    return facing.length ? facing : side;
  }

  getStreetNpcShopRoadTarget(building) {
    if (!building?.cells?.length) return null;
    const center = this.getBuildingGridCenter(building) || building.cells[0];
    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];
    const seen = new Set();
    let bestFacing = null;
    let bestFacingD2 = Infinity;
    let bestAny = null;
    let bestAnyD2 = Infinity;
    for (const cell of building.cells) {
      for (const d of dirs) {
        const rr = cell.r + d.dr;
        const cc = cell.c + d.dc;
        if (!inBounds(rr, cc) || !this.isRoadCell(rr, cc)) continue;
        const code = `${rr},${cc}`;
        if (seen.has(code)) continue;
        seen.add(code);
        const dr = rr - center.r;
        const dc = cc - center.c;
        const d2 = (dr * dr) + (dc * dc);
        const onFacingSide = this.isRoadCellOnDoorFacingSideOfBuilding(building, rr, cc);
        if (onFacingSide && d2 < bestFacingD2) {
          bestFacingD2 = d2;
          bestFacing = { r: rr, c: cc };
        }
        if (d2 < bestAnyD2) {
          bestAnyD2 = d2;
          bestAny = { r: rr, c: cc };
        }
      }
    }
    return bestFacing || bestAny || this.getRoadSpawnCellNearBuilding(building);
  }

  pickStreetNpcActiveShopRoadTarget(fromRoad, now = Date.now(), maxCandidates = 8) {
    if (!fromRoad || !this.isRoadCell(fromRoad.r, fromRoad.c)) return null;
    const pool = [];
    for (const b of buildings.values()) {
      if (!this.isStreetNpcShopBuildingActive(b, now)) continue;
      const road = this.getStreetNpcShopRoadTarget(b);
      if (!road || !this.isRoadCell(road.r, road.c)) continue;
      const dr = road.r - fromRoad.r;
      const dc = road.c - fromRoad.c;
      pool.push({ road, d2: (dr * dr) + (dc * dc) });
    }
    if (!pool.length) return null;
    pool.sort((a, b) => a.d2 - b.d2);
    const cap = Math.max(1, Math.min(Math.max(1, Math.round(Number(maxCandidates) || 8)), pool.length));
    const pick = pool[Phaser.Math.Between(0, cap - 1)] || pool[0];
    return pick?.road || null;
  }

  getStreetNpcShopYapaRewardAmount() {
    return Math.random() < TRAFFIC_NPC_SHOP_YAPA_HALF_DROP_CHANCE ? 0.5 : 1;
  }

  tryAwardStreetNpcShopYapa(npc, shopBuilding, now = Date.now()) {
    if (!npc?.sprite?.active) return 0;
    if (Math.random() > TRAFFIC_NPC_SHOP_YAPA_DROP_CHANCE) return 0;
    if (!this.economy?.addYapas) return 0;
    const amount = this.getStreetNpcShopYapaRewardAmount();
    if (!(amount > 0)) return 0;
    const def = BUILDING_TYPES[shopBuilding?.typeKey] || null;
    const shopName = String(def?.label || shopBuilding?.typeKey || "Tienda");
    this.economy.addYapas(amount, `Compra NPC: ${shopName}`, "in");
    this.economy?.renderYapaModalData?.();
    this.economy?.updateYapaRailTimer?.();
    return amount;
  }

  getStreetNpcShopEnterChance(snapshot = null) {
    const snap = snapshot || this.getTrafficRoutineSnapshot(Date.now());
    const shops = Math.max(0, Math.round(Number(snap?.shopCount) || 0));
    let chance = TRAFFIC_NPC_SHOP_ENTER_CHANCE_BASE + (shops * TRAFFIC_NPC_SHOP_ENTER_CHANCE_PER_SHOP);
    const phase = String(snap?.phaseKey || "dia");
    if (phase === "noche") chance *= 0.82;
    else if (phase === "madrugada") chance *= 0.22;
    else if (phase === "tarde") chance *= 0.95;
    return Phaser.Math.Clamp(chance, 0.01, TRAFFIC_NPC_SHOP_ENTER_CHANCE_CAP);
  }

  getStreetNpcEntryScreenPoint(building, roadCell, lerp = 0.5) {
    if (!building || !roadCell) return null;
    const center = this.getBuildingGridCenter(building) || building.cells?.[0] || roadCell;
    const roadP = isoToScreen(roadCell.r, roadCell.c);
    const homeP = isoToScreen(center.r, center.c);
    const t = Phaser.Math.Clamp(Number(lerp) || 0.5, 0.25, 0.82);
    return {
      x: Math.round(Phaser.Math.Linear(roadP.x, homeP.x, t)),
      y: Math.round(Phaser.Math.Linear(roadP.y + (TILE_H * 0.20), homeP.y + (TILE_H * 0.18), t))
    };
  }

  getStreetNpcWalkTweenDuration(fromX, fromY, toX, toY, minMs = 320, maxMs = 1900, speedPxPerSec = 115) {
    const fx = Number(fromX) || 0;
    const fy = Number(fromY) || 0;
    const tx = Number(toX) || 0;
    const ty = Number(toY) || 0;
    const dist = Math.hypot(tx - fx, ty - fy);
    const min = Math.max(120, Math.round(Number(minMs) || 320));
    const max = Math.max(min + 120, Math.round(Number(maxMs) || 1900));
    const speed = Math.max(40, Number(speedPxPerSec) || 115);
    const raw = (dist / speed) * 1000;
    return Phaser.Math.Clamp(Math.round(raw), min, max);
  }

  startStreetNpcShopEntry(npc, shopBuilding, roadCell, now = Date.now()) {
    if (!npc?.sprite?.active || !shopBuilding || !roadCell) return false;
    npc.shopState = "entering";
    npc.shopBuildingId = Number(shopBuilding.id) || 0;
    npc.shopRoad = { r: roadCell.r, c: roadCell.c };
    npc.shopExitAt = 0;
    npc.path = null;
    npc.pathIndex = 0;
    npc.progress = 0;
    npc.waitUntil = 0;
    npc.sideSwitchStartAt = 0;
    npc.turnPauseUntil = 0;
    this.setStreetNpcScreenPosition(npc, roadCell.r, roadCell.c);
    this.spawnStreetNpcEmote(npc, now, { emoji: "\uD83D\uDED2", kind: "compra", durationMs: 1400, risePx: 16 });
    const entryPoint = this.getStreetNpcEntryScreenPoint(shopBuilding, roadCell, 0.54);
    npc.shopEntryScreen = entryPoint ? { x: entryPoint.x, y: entryPoint.y } : null;
    const startX = Number.isFinite(npc.sprite?.x) ? npc.sprite.x : (entryPoint?.x ?? 0);
    const startY = Number.isFinite(npc.sprite?.y) ? npc.sprite.y : (entryPoint?.y ?? 0);
    const enterDuration = this.getStreetNpcWalkTweenDuration(
      startX,
      startY,
      entryPoint?.x ?? startX,
      entryPoint?.y ?? startY,
      360,
      2100,
      105
    );

    this.tweens.add({
      targets: npc.sprite,
      x: entryPoint?.x ?? npc.sprite.x,
      y: entryPoint?.y ?? npc.sprite.y,
      duration: enterDuration,
      ease: "Sine.InOut",
      onComplete: () => {
        if (!npc?.sprite?.active) return;
        this.tweens.add({
          targets: npc.sprite,
          alpha: 0,
          duration: TRAFFIC_NPC_SHOP_FADE_MS,
          ease: "Quad.In",
          onComplete: () => {
            if (!npc?.sprite?.active) return;
            npc.shopState = "inside";
            this.applyStreetNpcQuickRefresh(npc, "shop", Date.now());
            npc.shopExitAt = Date.now() + Phaser.Math.Between(TRAFFIC_NPC_SHOP_DWELL_MIN_MS, TRAFFIC_NPC_SHOP_DWELL_MAX_MS);
            npc.sprite.setVisible(false);
          }
        });
      }
    });
    npc.nextShopTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_SHOP_RETRY_MIN_MS, TRAFFIC_NPC_SHOP_RETRY_MAX_MS);
    return true;
  }

  updateStreetNpcShopState(npc, now = Date.now()) {
    const state = String(npc?.shopState || "");
    if (!state || !npc?.sprite?.active) return false;
    const road = npc.shopRoad || { r: Math.round(npc.r), c: Math.round(npc.c) };

    if (state === "entering") {
      npc.screenX = Number.isFinite(npc.sprite?.x) ? npc.sprite.x : npc.screenX;
      npc.screenY = Number.isFinite(npc.sprite?.y) ? npc.sprite.y : npc.screenY;
      return true;
    }

    if (state === "inside") {
      npc.sprite.setVisible(false);
      if (now < (npc.shopExitAt || 0)) return true;
      const shop = buildings.get(Number(npc.shopBuildingId) || 0);
      npc.lastShopYapaDrop = this.tryAwardStreetNpcShopYapa(npc, shop, now);
      npc.shopState = "exiting";
      npc.path = null;
      npc.pathIndex = 0;
      npc.progress = 0;
      npc.waitUntil = 0;
      npc.turnPauseUntil = 0;
      const entryPoint = npc.shopEntryScreen || this.getStreetNpcEntryScreenPoint(shop, road, 0.54);
      if (entryPoint) {
        npc.sprite.setPosition(entryPoint.x, entryPoint.y);
        npc.screenX = entryPoint.x;
        npc.screenY = entryPoint.y;
      } else {
        this.setStreetNpcScreenPosition(npc, road.r, road.c);
      }
      npc.sprite.setVisible(true);
      npc.sprite.setAlpha(0);
      npc.cameraFadeAlpha = 0;
      const roadP = isoToScreen(road.r, road.c);
      const exitDuration = this.getStreetNpcWalkTweenDuration(
        Number.isFinite(npc.sprite?.x) ? npc.sprite.x : roadP.x,
        Number.isFinite(npc.sprite?.y) ? npc.sprite.y : roadP.y,
        roadP.x,
        roadP.y,
        360,
        2100,
        105
      );
      this.tweens.add({
        targets: npc.sprite,
        alpha: 1,
        x: roadP.x,
        y: roadP.y,
        duration: exitDuration,
        ease: "Quad.Out",
        onComplete: () => {
          if (!npc?.sprite?.active) return;
          const exitNow = Date.now();
          const exitedShopId = Number(npc.shopBuildingId) || 0;
          const shopGraceMs = this.getStreetNpcRoamGraceMs(exitNow, "shop_exit");
          npc.shopState = "";
          npc.shopBuildingId = 0;
          npc.shopExitAt = 0;
          npc.shopEntryScreen = null;
          npc.screenX = npc.sprite.x;
          npc.screenY = npc.sprite.y;
          npc.lastShopBuildingId = exitedShopId;
          npc.lastShopExitAt = exitNow;
          npc.avoidSameShopUntil = exitNow + Phaser.Math.Between(12000, 26000);
          npc.noShopEnterUntil = exitNow + shopGraceMs;
          npc.nextShopTryAt = npc.noShopEnterUntil;
          npc.nextHeatRefreshTryAt = Math.max(
            Number(npc.nextHeatRefreshTryAt) || 0,
            exitNow + Phaser.Math.Between(9000, 18000)
          );
          npc.noHomeReturnUntil = Math.max(
            Number(npc.noHomeReturnUntil) || 0,
            exitNow + Math.max(1800, Math.round(shopGraceMs * 0.55))
          );
          const yapaGain = Math.max(0, Number(npc.lastShopYapaDrop) || 0);
          npc.lastShopYapaDrop = 0;
          if (yapaGain > 0) {
            this.spawnStreetNpcEmote(npc, exitNow, {
              textureKey: "ui_yapa_icon",
              kind: "yapa_compra_gana",
              durationMs: 2100,
              risePx: 22
            });
          } else {
            this.spawnStreetNpcEmote(npc, exitNow, { emoji: "\uD83D\uDED2", kind: "compra", durationMs: 1500, risePx: 16 });
          }
          this.scheduleNextStreetNpcLifeBreak(npc, exitNow, "taken");
          npc.nextPathAt = exitNow + Phaser.Math.Between(720, 1950);
        }
      });
      return true;
    }

    if (state === "exiting") {
      npc.screenX = Number.isFinite(npc.sprite?.x) ? npc.sprite.x : npc.screenX;
      npc.screenY = Number.isFinite(npc.sprite?.y) ? npc.sprite.y : npc.screenY;
      return true;
    }

    return false;
  }

  tryStreetNpcEnterNearbyShop(npc, now = Date.now(), opts = null) {
    if (!npc?.sprite?.active) return false;
    const force = !!opts?.force;
    const reason = String(opts?.reason || "").trim().toLowerCase();
    const forceBypassAllowed = force && (reason === "kotori_lunch" || reason === "kotori_party");
    if (npc.shopState) return false;
    if (this.hasStreetNpcGameplayStats(npc)) {
      const kotoriPlan = this.getKotoriNpcDailyPlan(npc, now);
      if (kotoriPlan) {
        const hourNow = this.getTrafficClockHourFloat(now);
        const inWork = this.isKotoriWorkWindow(kotoriPlan, hourNow);
        const inLunch = this.isKotoriLunchWindow(kotoriPlan, hourNow);
        // En horario laboral normal no entrar a tienda salvo acciones laborales explicitas.
        if (inWork && !inLunch && !forceBypassAllowed) return false;
      }
    }
    if (!forceBypassAllowed && now < (Number(npc.noShopEnterUntil) || 0)) return false;
    if (!forceBypassAllowed && now < (Number(npc.nextShopTryAt) || 0)) return false;
    const atR = Math.round(npc.r);
    const atC = Math.round(npc.c);
    if (!this.isRoadCell(atR, atC)) {
      npc.nextShopTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_SHOP_RETRY_MIN_MS, TRAFFIC_NPC_SHOP_RETRY_MAX_MS);
      return false;
    }

    let candidates = this.getAdjacentMinimarketCandidatesForRoadCell(atR, atC, now);
    const avoidShopId = Number(npc.lastShopBuildingId) || 0;
    const avoidUntil = Number(npc.avoidSameShopUntil) || 0;
    if (avoidShopId > 0 && now < avoidUntil && candidates.length) {
      const filtered = candidates.filter((b) => (Number(b?.id) || 0) !== avoidShopId);
      if (filtered.length) {
        candidates = filtered;
      } else if (!forceBypassAllowed) {
        npc.nextShopTryAt = Math.max(
          now + Phaser.Math.Between(TRAFFIC_NPC_SHOP_RETRY_MIN_MS, TRAFFIC_NPC_SHOP_RETRY_MAX_MS),
          avoidUntil
        );
        return false;
      }
    }
    if (!candidates.length) {
      const targetRoad = this.pickStreetNpcActiveShopRoadTarget({ r: atR, c: atC }, now);
      if (targetRoad && (targetRoad.r !== atR || targetRoad.c !== atC)) {
        const route = this.findRoadPath({ r: atR, c: atC }, targetRoad, 3200);
        if (route && route.length >= 2) {
          npc.path = route;
          npc.pathIndex = 0;
          npc.progress = 0;
          npc.waitUntil = 0;
          npc.sideSwitchStartAt = 0;
          npc.turnPauseUntil = 0;
          npc.turnPauseR = atR;
          npc.turnPauseC = atC;
          npc.nextPathAt = now + Phaser.Math.Between(90, 220);
          npc.nextShopTryAt = now + Phaser.Math.Between(900, 2200);
          return true;
        }
      }
      npc.nextShopTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_SHOP_RETRY_MIN_MS, TRAFFIC_NPC_SHOP_RETRY_MAX_MS);
      return false;
    }

    if (!force) {
      const snapshot = this.getTrafficRoutineSnapshot(now);
      const chanceBase = this.getStreetNpcShopEnterChance(snapshot);
      const individuality = 0.75 + (this.sampleTrafficRoutine01((Number(snapshot.seed) || 0) + ((Number(npc.id) || 0) * 13.7)) * 0.5);
      const chance = Phaser.Math.Clamp(chanceBase * individuality, 0.01, TRAFFIC_NPC_SHOP_ENTER_CHANCE_CAP);
      if (Math.random() > chance) {
        npc.nextShopTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_SHOP_RETRY_MIN_MS, TRAFFIC_NPC_SHOP_RETRY_MAX_MS);
        return false;
      }
    }

    const pick = candidates[Phaser.Math.Between(0, candidates.length - 1)];
    return this.startStreetNpcShopEntry(npc, pick, { r: atR, c: atC }, now);
  }

  tryStreetNpcLifeBreak(npc, now = Date.now()) {
    if (!npc?.sprite?.active) return false;
    if (npc.shopState || npc.homeState) return false;
    if ((npc.introUntil || 0) > now) return false;
    if (now < (Number(npc.nextLifeBreakAt) || 0)) return false;

    const kotoriPlan = this.getKotoriNpcDailyPlan(npc, now);
    if (kotoriPlan) {
      const hourNow = this.getTrafficClockHourFloat(now);
      if (kotoriPlan.isWorkday) {
        if (this.isKotoriLunchWindow(kotoriPlan, hourNow)) {
          const ate = this.tryStreetNpcEnterNearbyShop(npc, now, { force: true, reason: "kotori_lunch" });
          if (!ate) this.applyKotoriMissedLunchPenalty(npc, kotoriPlan, now);
          this.scheduleNextStreetNpcLifeBreak(npc, now, ate ? "taken" : "cycle");
          return ate;
        }
        if (this.isKotoriWorkWindow(kotoriPlan, hourNow)) {
          const targetRoad = kotoriPlan.workTarget?.road || null;
          const atWork = !!targetRoad
            && Math.round(Number(npc.r) || 0) === Math.round(Number(targetRoad.r) || 0)
            && Math.round(Number(npc.c) || 0) === Math.round(Number(targetRoad.c) || 0);
          if (!atWork) {
            const routed = this.routeKotoriNpcToWork(npc, kotoriPlan, now);
            this.scheduleNextStreetNpcLifeBreak(npc, now, routed ? "taken" : "cycle");
            return routed;
          }
          npc.waitUntil = Math.max(Number(npc.waitUntil) || 0, now + Phaser.Math.Between(650, 1600));
          this.scheduleNextStreetNpcLifeBreak(npc, now, "cycle");
          return false;
        }
      }
      if (this.isKotoriPartyWindow(kotoriPlan, hourNow)) {
        const acted = this.tryStreetNpcEnterNearbyShop(npc, now, { force: true, reason: "kotori_party" });
        this.scheduleNextStreetNpcLifeBreak(npc, now, acted ? "taken" : "cycle");
        return acted;
      }
    }

    const phase = this.getTrafficLifePhaseKey(now);
    const canGoHome = (Number(npc.homeBuildingId) || 0) > 0;
    const hasStats = this.hasStreetNpcGameplayStats(npc);
    const staminaRatio = hasStats ? this.getStreetNpcStaminaRatio(npc) : 1;
    let homeChance = phase === "madrugada" ? 0.72 : (phase === "noche" ? 0.46 : 0.34);
    let shopChance = phase === "madrugada" ? 0.14 : (phase === "noche" ? 0.28 : 0.48);
    if (hasStats) {
      // Con stamina alta no deberian estar entrando/saliendo a cada rato.
      if (staminaRatio >= 0.78 && phase !== "madrugada") {
        this.scheduleNextStreetNpcLifeBreak(npc, now, "cycle");
        return false;
      }
      homeChance = Math.max(0.14, homeChance - 0.12);
      shopChance = Math.max(0.14, Math.min(0.42, shopChance - 0.10));
      if (staminaRatio <= 0.40) {
        homeChance = Math.min(0.76, homeChance + 0.22);
        shopChance = Math.min(0.60, shopChance + 0.18);
      }
    }

    const bucket = Math.floor((Number(now) || Date.now()) / 8000);
    const roll = this.sampleTrafficRoutine01(((Number(npc.id) || 0) * 13.27) + (bucket * 0.91));
    let acted = false;

    if (canGoHome && roll < homeChance) {
      acted = this.tryStartStreetNpcHomeReturn(npc, now, { reason: "meal" });
    } else if (roll < (homeChance + shopChance)) {
      acted = this.tryStreetNpcEnterNearbyShop(npc, now, { reason: "meal_break" });
      if (!acted && canGoHome && phase !== "madrugada") {
        acted = this.tryStartStreetNpcHomeReturn(npc, now, { reason: "meal" });
      }
    } else if (canGoHome && phase === "madrugada" && roll > 0.93) {
      acted = this.tryStartStreetNpcHomeReturn(npc, now, { reason: "meal" });
    }

    this.scheduleNextStreetNpcLifeBreak(npc, now, acted ? "taken" : "cycle");
    return acted;
  }

  tryStartStreetNpcHomeReturn(npc, now = Date.now(), opts = null) {
    if (!npc?.sprite?.active) return false;
    const homeState = String(npc.homeState || "");
    const allowWhileReturning = !!opts?.allowWhileReturning;
    if (homeState === "home_entering" || homeState === "home_sleeping" || homeState === "home_waking") return false;
    if (homeState === "home_returning" && !allowWhileReturning) return false;
    const intent = String(opts?.reason || "sleep");
    const homeId = Number(npc.homeBuildingId) || 0;
    if (homeId <= 0) return false;
    const home = buildings.get(homeId);
    if (!home?.isBuilt) return false;

    // Si estaba en tienda, fuerza salida primero y luego vuelve a casa.
    if (npc.shopState === "inside") {
      npc.shopExitAt = Math.min(Number(npc.shopExitAt) || now, now + 120);
      return false;
    }
    if (npc.shopState === "entering" || npc.shopState === "exiting") return false;

    const targetRoad = this.getRoadSpawnCellNearBuilding(home);
    if (!targetRoad) return false;

    const from = { r: Math.round(npc.r), c: Math.round(npc.c) };
    if (!this.isRoadCell(from.r, from.c)) {
      const snap = this.getNearestRoadCellToPoint(from.r, from.c);
      if (snap) {
        from.r = snap.r;
        from.c = snap.c;
      } else {
        npc.homeState = "";
        npc.homeTargetRoad = null;
        npc.homeBuildingRefId = 0;
        npc.nextPathAt = now + Phaser.Math.Between(900, 2200);
        npc.noHomeReturnUntil = Math.max(Number(npc.noHomeReturnUntil) || 0, now + 4200);
        return false;
      }
    }

    const dist = Math.hypot(targetRoad.r - from.r, targetRoad.c - from.c);
    if (dist <= 0.2) {
      this.startStreetNpcHomeEnter(npc, home, targetRoad, now, { reason: intent });
      return true;
    }

    const path = this.findRoadPath(from, targetRoad, 5200);
    if (!path || path.length < 2) {
      npc.homeState = "";
      npc.homeTargetRoad = null;
      npc.homeBuildingRefId = 0;
      npc.nextPathAt = now + Phaser.Math.Between(1200, 3000);
      npc.noHomeReturnUntil = Math.max(Number(npc.noHomeReturnUntil) || 0, now + 5200);
      return false;
    }
    npc.homeTargetRoad = { r: targetRoad.r, c: targetRoad.c };
    npc.homeBuildingRefId = Number(home.id) || homeId;
    npc.homeIntent = intent;
    npc.homeState = "home_returning";
    npc.path = path;
    npc.pathIndex = 0;
    npc.progress = 0;
    npc.waitUntil = 0;
    npc.sideSwitchStartAt = 0;
    npc.turnPauseUntil = 0;
    npc.nextPathAt = now + 9999999;
    return true;
  }

  startStreetNpcHomeEnter(npc, home, roadCell, now = Date.now(), opts = null) {
    if (!npc?.sprite?.active || !home || !roadCell) return false;
    const reason = String(opts?.reason || npc.homeIntent || "sleep");
    npc.homeState = "home_entering";
    npc.homeTargetRoad = { r: roadCell.r, c: roadCell.c };
    npc.homeBuildingRefId = Number(home.id) || Number(npc.homeBuildingId) || 0;
    npc.homeReason = reason;
    npc.homeIntent = reason;
    npc.homeMealExitAt = reason === "meal"
      ? (now + Phaser.Math.Between(5200, 15000))
      : 0;
    npc.path = null;
    npc.pathIndex = 0;
    npc.progress = 0;
    npc.waitUntil = 0;
    npc.sideSwitchStartAt = 0;
    npc.turnPauseUntil = 0;
    this.setStreetNpcScreenPosition(npc, roadCell.r, roadCell.c);
    const entryPoint = this.getStreetNpcEntryScreenPoint(home, roadCell, 0.58);
    npc.homeEntryScreen = entryPoint ? { x: entryPoint.x, y: entryPoint.y } : null;
    const startX = Number.isFinite(npc.sprite?.x) ? npc.sprite.x : (entryPoint?.x ?? 0);
    const startY = Number.isFinite(npc.sprite?.y) ? npc.sprite.y : (entryPoint?.y ?? 0);
    const enterDuration = this.getStreetNpcWalkTweenDuration(
      startX,
      startY,
      entryPoint?.x ?? startX,
      entryPoint?.y ?? startY,
      420,
      2400,
      96
    );

    this.tweens.add({
      targets: npc.sprite,
      x: entryPoint?.x ?? npc.sprite.x,
      y: entryPoint?.y ?? npc.sprite.y,
      duration: enterDuration,
      ease: "Sine.InOut",
      onComplete: () => {
        if (!npc?.sprite?.active) return;
        this.tweens.add({
          targets: npc.sprite,
          alpha: 0,
          duration: TRAFFIC_NPC_HOME_FADE_MS,
          ease: "Quad.In",
          onComplete: () => {
            if (!npc?.sprite?.active) return;
            npc.homeState = "home_sleeping";
            this.markStreetNpcSleepStart(npc, Date.now());
            this.applyStreetNpcQuickRefresh(npc, "home", Date.now());
            npc.sleepWakeAt = Date.now() + Phaser.Math.Between(TRAFFIC_NPC_WAKE_STAGGER_MIN_MS, TRAFFIC_NPC_WAKE_STAGGER_MAX_MS);
            npc.sprite.setVisible(false);
          }
        });
      }
    });
    return true;
  }

  updateStreetNpcHomeState(npc, now = Date.now()) {
    const state = String(npc?.homeState || "");
    if (!state || !npc?.sprite?.active) return false;
    const keepSleepingNow = this.shouldStreetNpcKeepSleeping(npc, now);
    const reason = String(npc.homeReason || npc.homeIntent || "sleep");
    const homeRoad = npc.homeTargetRoad || { r: Math.round(npc.r), c: Math.round(npc.c) };

    if (state === "home_entering") {
      npc.screenX = Number.isFinite(npc.sprite?.x) ? npc.sprite.x : npc.screenX;
      npc.screenY = Number.isFinite(npc.sprite?.y) ? npc.sprite.y : npc.screenY;
      return true;
    }

    if (state === "home_sleeping") {
      npc.sprite.setVisible(false);
      if (reason === "meal") {
        if (this.isTrafficSleepPhase(now, npc)) {
          npc.homeReason = "sleep";
          npc.homeIntent = "sleep";
          npc.homeMealExitAt = 0;
          if (keepSleepingNow) return true;
        } else {
          const leaveAt = Number(npc.homeMealExitAt) || (now + 1000);
          if (now < leaveAt) return true;
        }
      } else {
        if (keepSleepingNow) return true;
        if (now < (npc.sleepWakeAt || 0)) return true;
      }
      this.applyStreetNpcSleepRecoveryBySchedule(npc, now);
      npc.homeState = "home_waking";
      npc.path = null;
      npc.pathIndex = 0;
      npc.progress = 0;
      npc.waitUntil = 0;
      npc.turnPauseUntil = 0;
      const homeId = Number(npc.homeBuildingRefId || npc.homeBuildingId) || 0;
      const home = buildings.get(homeId);
      const entryPoint = npc.homeEntryScreen || this.getStreetNpcEntryScreenPoint(home, homeRoad, 0.58);
      if (entryPoint) {
        npc.sprite.setPosition(entryPoint.x, entryPoint.y);
        npc.screenX = entryPoint.x;
        npc.screenY = entryPoint.y;
      } else {
        this.setStreetNpcScreenPosition(npc, homeRoad.r, homeRoad.c);
      }
      npc.sprite.setVisible(true);
      npc.sprite.setAlpha(0);
      npc.cameraFadeAlpha = 0;
      const roadP = isoToScreen(homeRoad.r, homeRoad.c);
      const wakeDuration = this.getStreetNpcWalkTweenDuration(
        Number.isFinite(npc.sprite?.x) ? npc.sprite.x : roadP.x,
        Number.isFinite(npc.sprite?.y) ? npc.sprite.y : roadP.y,
        roadP.x,
        roadP.y,
        420,
        2400,
        96
      );
      this.tweens.add({
        targets: npc.sprite,
        alpha: 1,
        x: roadP.x,
        y: roadP.y,
        duration: wakeDuration,
        ease: "Quad.Out",
        onComplete: () => {
          if (!npc?.sprite?.active) return;
          const wakeNow = Date.now();
          const roamGraceMs = this.getStreetNpcRoamGraceMs(wakeNow, "wake");
          const shopGraceMs = Math.max(3600, Math.round(roamGraceMs * 0.58));
          npc.homeState = "";
          npc.homeTargetRoad = null;
          npc.homeBuildingRefId = 0;
          npc.homeEntryScreen = null;
          npc.homeReason = "";
          npc.homeIntent = "";
          npc.homeMealExitAt = 0;
          npc.sleepWakeAt = 0;
          npc.screenX = npc.sprite.x;
          npc.screenY = npc.sprite.y;
          npc.noHomeReturnUntil = wakeNow + roamGraceMs;
          npc.noShopEnterUntil = wakeNow + shopGraceMs;
          npc.nextShopTryAt = Math.max(Number(npc.nextShopTryAt) || 0, npc.noShopEnterUntil);
          const kotoriPlan = this.getKotoriNpcDailyPlan(npc, wakeNow);
          if (kotoriPlan) {
            this.applyKotoriWakeDebuffs(npc, kotoriPlan, wakeNow);
            if (!kotoriPlan.isWorkday) npc.kotoriWorkLunchDebuffUntil = 0;
          }
          this.scheduleNextStreetNpcLifeBreak(npc, wakeNow, "wake");
          npc.nextPathAt = wakeNow + Phaser.Math.Between(300, 1200);
        }
      });
      return true;
    }

    if (state === "home_waking") {
      npc.screenX = Number.isFinite(npc.sprite?.x) ? npc.sprite.x : npc.screenX;
      npc.screenY = Number.isFinite(npc.sprite?.y) ? npc.sprite.y : npc.screenY;
      return true;
    }

    if (state === "home_returning") {
      const done = !npc.path || npc.pathIndex >= ((npc.path?.length || 1) - 1);
      if (!done) return false;
      const atR = Math.round(npc.r);
      const atC = Math.round(npc.c);
      const distToHomeRoad = Math.hypot((homeRoad.r || 0) - atR, (homeRoad.c || 0) - atC);
      if (distToHomeRoad > 0.35) {
        return this.tryStartStreetNpcHomeReturn(npc, now, {
          reason: String(npc.homeIntent || "sleep"),
          allowWhileReturning: true
        });
      }
      const homeId = Number(npc.homeBuildingRefId || npc.homeBuildingId) || 0;
      const home = buildings.get(homeId);
      if (home?.isBuilt) {
        this.startStreetNpcHomeEnter(npc, home, homeRoad, now, { reason: String(npc.homeIntent || "sleep") });
        return true;
      }
      npc.homeState = "";
      npc.homeTargetRoad = null;
      npc.homeBuildingRefId = 0;
      return false;
    }

    return false;
  }

  hasNearbyCarAt(r, c, radiusTiles = TRAFFIC_CAR_NEAR_RADIUS_TILES) {
    const rr = Math.max(0, radiusTiles || 0);
    for (const car of this.trafficCars) {
      const dr = (car.r || 0) - r;
      const dc = (car.c || 0) - c;
      if (Math.hypot(dr, dc) <= rr) return true;
    }
    return false;
  }

  assignStreetNpcRoute(npc, now = Date.now()) {
    const from = {
      r: Math.round(npc.r),
      c: Math.round(npc.c)
    };

    if (!this.isRoadCell(from.r, from.c)) {
      const snap = this.getNearestRoadCellToPoint(from.r, from.c);
      if (!snap) {
        npc.nextPathAt = now + 1500;
        return;
      }
      from.r = snap.r;
      from.c = snap.c;
      this.setStreetNpcScreenPosition(npc, from.r, from.c);
    }

    const kotoriPlan = this.getKotoriNpcDailyPlan(npc, now);
    if (kotoriPlan) {
      const hourNow = this.getTrafficClockHourFloat(now);
      if (kotoriPlan.isWorkday && this.isKotoriWorkWindow(kotoriPlan, hourNow) && !this.isKotoriLunchWindow(kotoriPlan, hourNow)) {
        if (this.routeKotoriNpcToWork(npc, kotoriPlan, now)) return;
        const targetRoad = kotoriPlan.workTarget?.road || null;
        if (targetRoad
          && Math.round(from.r) === Math.round(Number(targetRoad.r) || 0)
          && Math.round(from.c) === Math.round(Number(targetRoad.c) || 0)) {
          npc.path = [{ r: from.r, c: from.c }];
          npc.pathIndex = 0;
          npc.progress = 0;
          npc.nextPathAt = now + Phaser.Math.Between(1600, 3600);
          return;
        }
      }
      if (kotoriPlan.isWorkday && this.isKotoriLunchWindow(kotoriPlan, hourNow)) {
        if (this.tryStreetNpcEnterNearbyShop(npc, now, { force: true, reason: "kotori_lunch" })) return;
        this.applyKotoriMissedLunchPenalty(npc, kotoriPlan, now);
      }
      if (this.isKotoriPartyWindow(kotoriPlan, hourNow)) {
        const partyShopRoad = this.pickStreetNpcActiveShopRoadTarget(from, now, 6);
        if (partyShopRoad) {
          const partyPath = this.findRoadPath(from, partyShopRoad, 3600);
          if (partyPath && partyPath.length >= 2) {
            npc.path = partyPath;
            npc.pathIndex = 0;
            npc.progress = 0;
            npc.turnPauseUntil = 0;
            npc.turnPauseR = partyPath[0].r;
            npc.turnPauseC = partyPath[0].c;
            npc.nextPathAt = now + Phaser.Math.Between(240, 760);
            return;
          }
        }
      }
    }

    let chosenPath = null;
    const forcedOverflowTarget = npc?.overflowTargetRoad;
    if (forcedOverflowTarget && this.isRoadCell(forcedOverflowTarget.r, forcedOverflowTarget.c)) {
      const forcedPath = this.findRoadPath(from, forcedOverflowTarget, 4500);
      npc.overflowTargetRoad = null;
      if (forcedPath && forcedPath.length >= 2) {
        chosenPath = forcedPath;
      }
    } else {
      npc.overflowTargetRoad = null;
    }

    if (!chosenPath) {
      if (Math.random() < 0.42) {
        const shopRoad = this.pickStreetNpcActiveShopRoadTarget(from, now);
        if (shopRoad) {
          const toShop = this.findRoadPath(from, shopRoad, 3200);
          if (toShop && toShop.length >= 2) {
            chosenPath = toShop;
          }
        }
      }
    }

    if (!chosenPath) {
      for (let i = 0; i < 12; i++) {
        const target = this.pickRandomRoadCell(from, 4);
        if (!target) break;
        const maybe = this.findRoadPath(from, target, 2500);
        if (maybe && maybe.length >= 2) {
          chosenPath = maybe;
          break;
        }
      }
    }

    if (!chosenPath) {
      npc.path = [{ r: from.r, c: from.c }];
      npc.pathIndex = 0;
      npc.progress = 0;
      npc.sideTarget = npc.side || 1;
      npc.waitUntil = 0;
      npc.sideSwitchStartAt = 0;
      npc.turnPauseUntil = 0;
      npc.turnPauseR = from.r;
      npc.turnPauseC = from.c;
      npc.nextPathAt = now + Phaser.Math.Between(900, 1800);
      return;
    }

    npc.path = chosenPath;
    npc.pathIndex = 0;
    npc.progress = 0;
    npc.turnPauseUntil = 0;
    npc.turnPauseR = chosenPath[0].r;
    npc.turnPauseC = chosenPath[0].c;
    npc.nextPathAt = now + Phaser.Math.Between(600, 1300);
    if (chosenPath.length >= 2) {
      const a = chosenPath[0];
      const b = chosenPath[1];
      npc.dirR = b.r - a.r;
      npc.dirC = b.c - a.c;
      npc.dirVisualR = npc.dirR;
      npc.dirVisualC = npc.dirC;
      npc.side = this.getSafeRoadEdgeSideForNpc(a.r, a.c, npc.dirR, npc.dirC, npc.side || 1);
      npc.sideTarget = npc.side;
      npc.sideVisual = npc.side;
      npc.sideSwitchStartAt = 0;
    }

    if (Math.random() < 0.32) {
      const crossCandidate = -npc.side;
      if (!this.isSideBlockedForNpc(from.r, from.c, npc.dirR, npc.dirC, crossCandidate)) {
        npc.sideTarget = crossCandidate;
        npc.waitUntil = now + Phaser.Math.Between(TRAFFIC_NPC_CROSS_WAIT_MIN_MS, TRAFFIC_NPC_CROSS_WAIT_MAX_MS);
        npc.sideSwitchStartAt = now;
      } else {
        npc.sideTarget = npc.side;
        npc.waitUntil = 0;
        npc.sideSwitchStartAt = 0;
      }
    } else {
      npc.sideTarget = npc.side;
      npc.waitUntil = 0;
      npc.sideSwitchStartAt = 0;
    }
  }

  getNpcWorldVisualMeta(npcKey = "") {
    const key = String(npcKey || "").trim();
    const def = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS?.[key]) ? ITEM_DEFS[key] : null;
    const rarity = this.getNpcRarityForKey(key);
    const fallbackByRarity = {
      3: 0x38bdf8,
      4: 0xa78bfa,
      5: 0xf59e0b
    };
    let baseColor = fallbackByRarity[rarity] || 0xf8fafc;
    const accent = String(def?.cardAccent || "").trim();
    if (/^#[0-9a-f]{6}$/i.test(accent)) {
      baseColor = Number.parseInt(accent.slice(1), 16);
    }
    let label = String(def?.cardSigil || def?.icon || key.replace(/^npc_/, "") || "NPC")
      .replace(/<[^>]+>/g, "")
      .trim()
      .toUpperCase();
    if (!label) label = "NPC";
    if (label.length > 3) label = label.slice(0, 3);
    return { baseColor, label };
  }

  createStreetNpcVisual(meta = {}) {
    const baseColor = Number.isFinite(Number(meta.baseColor)) ? Number(meta.baseColor) : 0xf8fafc;
    const labelText = String(meta.label || "").trim();
    const radius = labelText ? 8 : 5;
    const sprite = this.add.container(0, 0)
      .setAlpha(0)
      .setDepth(69);
    const body = this.add.circle(0, 0, radius, baseColor, 1)
      .setStrokeStyle(2, 0x0f172a, 0.95);
    sprite.add(body);

    let label = null;
    if (labelText) {
      label = this.add.text(0, 0, labelText, {
        fontFamily: "Arial",
        fontSize: labelText.length >= 3 ? "7px" : "9px",
        fontStyle: "bold",
        color: "#f8fafc"
      }).setOrigin(0.5, 0.5);
      sprite.add(label);
    }

    this.uiCam.ignore([sprite, body, label].filter(Boolean));
    return { sprite, body, label };
  }

  setStreetNpcFillColor(npc, isBackFacing = false) {
    const fillTarget = npc?.spriteBody && typeof npc.spriteBody.setFillStyle === "function"
      ? npc.spriteBody
      : npc?.sprite;
    if (fillTarget?.setFillStyle) {
      fillTarget.setFillStyle(
        isBackFacing ? TRAFFIC_NPC_BACK_COLOR : (npc?.baseColor || 0xf8fafc),
        1
      );
    }
    if (npc?.spriteLabel?.setColor) {
      npc.spriteLabel.setColor(isBackFacing ? "#fee2e2" : "#f8fafc");
    }
  }

  getStreetNpcEmotePriority(npc) {
    if (!npc) return -1;
    const rarity = Math.max(0, Math.round(Number(npc.npcRarity) || 0));
    if (rarity >= 4) return 3;
    if (npc.spawnSource === "conera" || npc.isResidentNpc) return 2;
    if (npc.spawnSource === "decor") return 1;
    return 0;
  }

  hasStreetNpcGameplayStats(npc) {
    if (!npc) return false;
    const key = String(npc.residentNpcKey || "").trim();
    return !!(npc.isResidentNpc && npc.spawnSource === "conera" && key.startsWith("npc_"));
  }

  getStreetNpcBaseStaminaStat(npc) {
    const key = String(npc?.residentNpcKey || "").trim();
    if (!key.startsWith("npc_")) return Number.NaN;
    const base = Number(this.economy?.getNpcRandomStatsForKey?.(key)?.stats?.stamina);
    if (!Number.isFinite(base) || base <= 0) return Number.NaN;
    return Math.max(1, Math.round(base));
  }

  getStreetNpcStaminaCap(npc) {
    const rarity = Math.max(1, Math.min(5, Math.round(Number(npc?.npcRarity) || 1)));
    const fallbackCap = Math.max(80, Number(TRAFFIC_NPC_STAMINA_MAX_BY_RARITY?.[rarity]) || 120);
    const baseFromStat = this.getStreetNpcBaseStaminaStat(npc);
    let cap = Number.isFinite(baseFromStat) ? baseFromStat : fallbackCap;

    const npcKey = String(npc?.residentNpcKey || "").trim();
    let evo = Number(npc?.npcEvolutionLevel);
    if (!Number.isFinite(evo)) evo = this.getNpcEvolutionLevelForKey(npcKey);
    evo = Math.max(0, Math.min(5, Math.round(evo)));
    if (evo > 0) {
      cap *= (1 + (0.12 * evo));
    }
    return Math.max(80, Math.round(cap));
  }

  getStreetNpcStaminaRatio(npc) {
    if (!this.hasStreetNpcGameplayStats(npc)) return 1;
    this.ensureStreetNpcWorldVitals(npc, Date.now());
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    const cur = Phaser.Math.Clamp(Number(npc.worldStamina) || 0, 0, cap);
    return Phaser.Math.Clamp(cur / cap, 0, 1);
  }

  getTrafficGameHoursPerMs(now = Date.now()) {
    const state = this.dayCycleState || {};
    const duration = Math.max(1000, Number(state.durationMs) || DAY_CYCLE_DURATION_MS);
    const speed = Math.max(0, Number(state.speed) || 1);
    return (24 * speed) / duration;
  }

  getTrafficVitalsDeltaScale() {
    const state = this.dayCycleState || {};
    const speed = Math.max(0.05, Number(state.speed) || 1);
    return Phaser.Math.Clamp(
      speed,
      TRAFFIC_NPC_VITALS_SIM_SCALE_MIN,
      TRAFFIC_NPC_VITALS_SIM_SCALE_MAX
    );
  }

  getTrafficClockHourFloat(now = Date.now()) {
    const clock = this.economy?.getHudGameClockSnapshot?.();
    if (clock && Number.isFinite(Number(clock.hour24))) {
      const h = Number(clock.hour24) % 24;
      const m = Number.isFinite(Number(clock.minute)) ? Number(clock.minute) : 0;
      const s = Number.isFinite(Number(clock.second)) ? Number(clock.second) : 0;
      return (((h + (m / 60) + (s / 3600)) % 24) + 24) % 24;
    }
    const state = this.dayCycleState || {};
    let progress = Number(state.progress) || 0;
    const duration = Math.max(1000, Number(state.durationMs) || DAY_CYCLE_DURATION_MS);
    const speed = Math.max(0, Number(state.speed) || 1);
    const lastWall = Math.max(0, Number(state.lastWallClockMs) || 0);
    if (lastWall > 0 && speed > 0) {
      const elapsed = Math.max(0, now - lastWall);
      progress = (progress + ((elapsed * speed) / duration)) % 1;
    }
    const p = ((progress % 1) + 1) % 1;
    return ((((p * 24) + DAY_CYCLE_LOCAL_OFFSET_HOUR) % 24) + 24) % 24;
  }

  getTrafficClockHoursUntil(targetHour = 0, fromHour = 0) {
    const t = (((Number(targetHour) % 24) + 24) % 24);
    const f = (((Number(fromHour) % 24) + 24) % 24);
    return (t - f + 24) % 24;
  }

  normalizeTrafficClockHour(hour = 0) {
    const h = Number(hour);
    if (!Number.isFinite(h)) return 0;
    return (((h % 24) + 24) % 24);
  }

  isTrafficClockHourInWindow(hourNow = 0, startHour = 0, endHour = 0) {
    const h = this.normalizeTrafficClockHour(hourNow);
    const start = this.normalizeTrafficClockHour(startHour);
    const end = this.normalizeTrafficClockHour(endHour);
    if (Math.abs(start - end) < 0.001) return false;
    if (start < end) return h >= start && h < end;
    return h >= start || h < end;
  }

  getTrafficLifePhaseKey(now = Date.now()) {
    const h = this.getTrafficClockHourFloat(now);
    if (h >= TRAFFIC_NPC_SLEEP_WINDOW_START_HOUR || h < TRAFFIC_PERU_DAY_START_HOUR) return "madrugada";
    if (h < 12.5) return "dia";
    if (h < 19.5) return "tarde";
    return "noche";
  }

  getStreetNpcRoamGraceMs(now = Date.now(), source = "spawn") {
    const phase = this.getTrafficLifePhaseKey(now);
    let min = 9000;
    let max = 22000;
    if (phase === "tarde") {
      min = 12000;
      max = 28000;
    } else if (phase === "noche") {
      min = 17000;
      max = 36000;
    } else if (phase === "madrugada") {
      min = 26000;
      max = 62000;
    }
    if (source === "wake") {
      min = Math.max(5000, Math.round(min * 0.8));
      max = Math.max(min + 1000, Math.round(max * 1.12));
    } else if (source === "shop_exit") {
      // Evita que el NPC rebote entrando/saliendo de la misma tienda en bucle.
      min = Math.max(7600, Math.round(min * 0.72));
      max = Math.max(min + 1400, Math.round(max * 1.05));
    }
    return Phaser.Math.Between(min, max);
  }

  scheduleNextStreetNpcLifeBreak(npc, now = Date.now(), source = "cycle") {
    if (!npc) return 0;
    const phase = this.getTrafficLifePhaseKey(now);
    let min = 22000;
    let max = 52000;
    if (phase === "tarde") {
      min = 18000;
      max = 42000;
    } else if (phase === "noche") {
      min = 28000;
      max = 62000;
    } else if (phase === "madrugada") {
      min = 46000;
      max = 98000;
    }
    if (source === "spawn") {
      min = Math.max(6000, Math.round(min * 0.65));
      max = Math.max(min + 2000, Math.round(max * 0.82));
    } else if (source === "taken") {
      min = Math.round(min * 1.12);
      max = Math.round(max * 1.22);
    } else if (source === "wake") {
      min = Math.max(7000, Math.round(min * 0.74));
      max = Math.max(min + 2000, Math.round(max * 0.92));
    }
    const at = now + Phaser.Math.Between(min, max);
    npc.nextLifeBreakAt = at;
    return at;
  }

  getStreetNpcShopSchedule(typeKey = "") {
    const key = String(typeKey || "").trim();
    const cfg = (key && TRAFFIC_SHOP_SCHEDULE_BY_TYPE?.[key]) ? TRAFFIC_SHOP_SCHEDULE_BY_TYPE[key] : null;
    if (!cfg) {
      return {
        open24h: false,
        openHour: TRAFFIC_SHOP_DEFAULT_OPEN_HOUR,
        closeHour: TRAFFIC_SHOP_DEFAULT_CLOSE_HOUR
      };
    }
    return {
      open24h: !!cfg.open24h,
      openHour: Number.isFinite(Number(cfg.openHour)) ? Number(cfg.openHour) : TRAFFIC_SHOP_DEFAULT_OPEN_HOUR,
      closeHour: Number.isFinite(Number(cfg.closeHour)) ? Number(cfg.closeHour) : TRAFFIC_SHOP_DEFAULT_CLOSE_HOUR
    };
  }

  isStreetNpcShopOpenNow(buildingOrTypeKey, now = Date.now()) {
    const typeKey = (typeof buildingOrTypeKey === "string")
      ? buildingOrTypeKey
      : String(buildingOrTypeKey?.typeKey || "");
    const schedule = this.getStreetNpcShopSchedule(typeKey);
    if (schedule.open24h) return true;
    const open = (((Number(schedule.openHour) % 24) + 24) % 24);
    const close = (((Number(schedule.closeHour) % 24) + 24) % 24);
    if (Math.abs(open - close) < 0.001) return false;
    const hourNow = this.getTrafficClockHourFloat(now);
    if (open < close) return hourNow >= open && hourNow < close;
    return hourNow >= open || hourNow < close;
  }

  getStreetNpcScheduleSeedFromMeta(homeBuildingId = 0, residentSlotIndex = 0, npcKey = "", npcRarity = 1) {
    const homeId = Number(homeBuildingId) || 0;
    const slot = Math.max(0, Math.round(Number(residentSlotIndex) || 0));
    const rarity = Math.max(1, Math.min(5, Math.round(Number(npcRarity) || 1)));
    const key = String(npcKey || "");
    let keyHash = 0;
    for (let i = 0; i < key.length; i++) {
      keyHash += key.charCodeAt(i) * (i + 1);
    }
    return (homeId * 17.13) + ((slot + 1) * 9.17) + (rarity * 2.73) + (keyHash * 0.013);
  }

  getStreetNpcScheduleSeed(npc) {
    if (!npc) return 0;
    return this.getStreetNpcScheduleSeedFromMeta(
      Number(npc.homeBuildingId) || 0,
      Number(npc.residentSlotIndex) || 0,
      String(npc.residentNpcKey || ""),
      Number(npc.npcRarity) || this.getNpcRarityForKey(String(npc.residentNpcKey || ""))
    );
  }

  isStrictSpecialResidentNpcByMeta(npcKey = "", npcRarity = 1) {
    const key = String(npcKey || "").trim();
    const rarity = Math.max(1, Math.min(5, Math.round(Number(npcRarity) || 1)));
    return key.startsWith("npc_") && rarity >= 4;
  }

  isStrictSpecialResidentNpc(npc) {
    if (!this.hasStreetNpcGameplayStats(npc)) return false;
    return this.isStrictSpecialResidentNpcByMeta(
      String(npc?.residentNpcKey || ""),
      Number(npc?.npcRarity) || this.getNpcRarityForKey(String(npc?.residentNpcKey || ""))
    );
  }

  isKotoriNpcByMeta(npcKey = "", npcName = "") {
    const marker = `${String(npcKey || "")} ${String(npcName || "")}`.toLowerCase();
    return marker.includes("npc_kotori_5")
      || marker.includes("npc_kotori_4")
      || marker.includes("la paloma kotori")
      || marker.includes("paloma kotori");
  }

  isKotoriNpc(npc) {
    if (!npc) return false;
    const key = String(npc?.residentNpcKey || npc?.npcKey || "");
    const name = String(this.getStreetNpcDisplayName(npc) || "");
    return this.isKotoriNpcByMeta(key, name);
  }

  getTrafficWeekdayIndex(now = Date.now()) {
    const econ = this.economy;
    if (econ?.getHudGameClockSnapshot && econ?.getHudGameWeekdayShort) {
      const clock = econ.getHudGameClockSnapshot();
      const short = String(econ.getHudGameWeekdayShort(clock) || "").trim().toLowerCase();
      const map = { do: 0, lu: 1, ma: 2, mi: 3, ju: 4, vi: 5, sa: 6 };
      if (Object.prototype.hasOwnProperty.call(map, short)) return map[short];
    }
    return new Date(now).getDay();
  }

  getTrafficWeekdayKey(now = Date.now()) {
    const idx = this.getTrafficWeekdayIndex(now);
    return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][idx] || "sun";
  }

  getTrafficRealMsForGameHours(hours = 0, now = Date.now()) {
    const h = Math.max(0, Number(hours) || 0);
    const hoursPerMs = this.getTrafficGameHoursPerMs(now);
    if (!(hoursPerMs > 0)) return h * 60000;
    return h / hoursPerMs;
  }

  estimateStreetNpcTravelHours(tileSteps = 0, npcSpeed = TRAFFIC_NPC_SPEED_TILES, now = Date.now()) {
    const steps = Math.max(0, Number(tileSteps) || 0);
    const speed = Math.max(0.1, Number(npcSpeed) || TRAFFIC_NPC_SPEED_TILES);
    const realSec = steps / speed;
    const hoursPerMs = this.getTrafficGameHoursPerMs(now);
    if (!(hoursPerMs > 0)) return Math.max(0.05, realSec / 60);
    return Math.max(0.05, realSec * 1000 * hoursPerMs);
  }

  getKotoriWorkAffinityForType(typeKey = "") {
    const t = String(typeKey || "");
    if (!t) return 0;
    if (/^blue_/.test(t) || /^pink_/.test(t) || /^orange_/.test(t)) return 1.45;
    if (/^producer_/.test(t) || /^red_1$/.test(t) || /^blue_1$/.test(t)) return 1.28;
    if (t === "green_2") return 1.0;
    if (this.isProducerBuilding?.(t)) return 1.2;
    if (this.isMinimarketBuilding?.(t)) return 1.0;
    if (this.isNpcResidenceBuilding?.(t)) return 0;
    if (this.isDecorativeHouse?.(t)) return 0;
    if (t.includes("road")) return 0;
    return 0.75;
  }

  getKotoriWorkTargetForHome(homeBuildingId = 0, now = Date.now(), seedBase = 0) {
    const homeId = Number(homeBuildingId) || 0;
    if (homeId <= 0) return null;
    const home = buildings.get(homeId);
    if (!home?.isBuilt) return null;
    const homeRoad = this.getRoadSpawnCellNearBuilding(home);
    if (!homeRoad) return null;
    let best = null;
    const jitter = (val) => this.sampleTrafficRoutine01((Number(seedBase) || 0) + val);

    for (const b of buildings.values()) {
      if (!b?.isBuilt) continue;
      const bid = Number(b.id) || 0;
      if (bid <= 0 || bid === homeId) continue;
      if (this.isRoadBuilding?.(b)) continue;
      if (this.isDecorativeHouse?.(b.typeKey)) continue;
      if (this.isNpcResidenceBuilding?.(b.typeKey)) continue;
      const affinity = this.getKotoriWorkAffinityForType(String(b.typeKey || ""));
      if (!(affinity > 0)) continue;
      const workRoad = this.getRoadSpawnCellNearBuilding(b);
      if (!workRoad) continue;

      const path = this.findRoadPath(homeRoad, workRoad, 4800);
      const tileSteps = path && path.length >= 2
        ? Math.max(1, path.length - 1)
        : Math.max(1, Math.hypot(workRoad.r - homeRoad.r, workRoad.c - homeRoad.c) * 1.45);
      const travelHours = this.estimateStreetNpcTravelHours(tileSteps, TRAFFIC_NPC_SPEED_TILES, now);
      const randomJitter = 0.92 + (jitter((bid * 0.17) + 5.31) * 0.16);
      const score = (tileSteps / affinity) * randomJitter;
      if (!best || score < best.score) {
        best = {
          buildingId: bid,
          typeKey: String(b.typeKey || ""),
          road: { r: workRoad.r, c: workRoad.c },
          tileSteps,
          travelHours,
          score
        };
      }
    }
    return best;
  }

  getKotoriDailyPlanByMeta(homeBuildingId = 0, npcKey = "", now = Date.now(), seedBase = 0) {
    if (!this.isKotoriNpcByMeta(npcKey, "")) return null;
    if (!(this._kotoriDailyPlanCache instanceof Map)) this._kotoriDailyPlanCache = new Map();
    const dayKey = this.getTrafficSimulationDayKey(now);
    const homeId = Number(homeBuildingId) || 0;
    const cacheKey = `${dayKey}|${homeId}|${String(npcKey || "")}`;
    const cached = this._kotoriDailyPlanCache.get(cacheKey);
    if (cached && typeof cached === "object") return cached;
    if (this._kotoriDailyPlanCache.size > 200) this._kotoriDailyPlanCache.clear();

    const weekday = this.getTrafficWeekdayIndex(now); // 0=Dom ... 6=Sab
    const isWorkday = weekday >= 1 && weekday <= 5;
    const isSaturday = weekday === 6;
    const isSunday = weekday === 0;
    const rand = (offset) => this.sampleTrafficRoutine01(
      (Number(seedBase) || 0) + (dayKey * 1.913) + (homeId * 0.417) + Number(offset || 0)
    );
    const workTarget = isWorkday
      ? this.getKotoriWorkTargetForHome(homeId, now, seedBase + 21.7)
      : null;

    let wakeHour = 9 + ((rand(1.1) - 0.5) * 0.6);
    let bedHour = rand(2.2) * 2.0; // 00:00 - 02:00
    let targetSleepHours = 7.1 + (rand(3.3) * 0.9);
    let leaveHomeDelayHours = 0.16 + (rand(4.4) * 0.34);
    let returnHomeLeadHours = 0.50 + (rand(5.5) * 0.42);
    let nightOwl = false;
    let overnightActiveUntil = 0;
    let morningStaminaPenaltyPct = 0;
    let sundayPartyDebuff = false;
    let sleepLateEvent = false;
    let workTravelHours = Number(workTarget?.travelHours) || 0.22;

    if (isWorkday) {
      sleepLateEvent = rand(6.4) > 0.62;
      workTravelHours = Math.max(0.12, Number(workTarget?.travelHours) || (0.18 + (rand(6.9) * 0.44)));
      wakeHour = Phaser.Math.Clamp(
        6.0 - Math.min(1.45, workTravelHours + (rand(7.2) * 0.16)),
        4.55,
        6.0
      );
      bedHour = sleepLateEvent
        ? (0.75 + (rand(8.1) * 1.15))
        : (((23.1 + (rand(8.7) * 0.8)) % 24) + 24) % 24;
      targetSleepHours = sleepLateEvent
        ? (5.8 + (rand(9.3) * 0.45))
        : (6.8 + (rand(9.9) * 0.8));
      morningStaminaPenaltyPct = sleepLateEvent ? (0.12 + (rand(10.4) * 0.12)) : 0;
      leaveHomeDelayHours = 0.04 + (rand(10.8) * 0.12);
      returnHomeLeadHours = 0.62 + (rand(11.4) * 0.30);
    } else if (isSaturday) {
      wakeHour = 9 + ((rand(12.1) - 0.5) * 0.5);
      bedHour = 3.95; // regresa de fiesta ~04:00
      targetSleepHours = 5.6 + (rand(12.7) * 0.6);
      leaveHomeDelayHours = 0.12 + (rand(13.3) * 0.2);
      returnHomeLeadHours = 0.45;
      nightOwl = true;
      overnightActiveUntil = 4.0;
    } else if (isSunday) {
      sundayPartyDebuff = true;
      wakeHour = 12 + (rand(14.1) * 2.0); // 12:00 - 14:00
      bedHour = (1.0 + (rand(14.7) * 1.1)); // duerme tarde pero normaliza noche dom
      targetSleepHours = 6.0 + (rand(15.3) * 0.9);
      leaveHomeDelayHours = 0.26 + (rand(15.9) * 0.36);
      returnHomeLeadHours = 0.54 + (rand(16.5) * 0.32);
      morningStaminaPenaltyPct = 0.25; // Noche de diversion
    }

    const plan = {
      dayKey,
      weekday,
      weekdayKey: this.getTrafficWeekdayKey(now),
      isWorkday,
      isSaturday,
      isSunday,
      wakeHour: this.normalizeTrafficClockHour(wakeHour),
      bedHour: this.normalizeTrafficClockHour(bedHour),
      targetSleepHours: Phaser.Math.Clamp(targetSleepHours, 5.2, 9.4),
      leaveHomeDelayHours: Phaser.Math.Clamp(leaveHomeDelayHours, 0.02, 1.6),
      returnHomeLeadHours: Phaser.Math.Clamp(returnHomeLeadHours, 0.2, 1.8),
      nightOwl: !!nightOwl,
      overnightActiveUntil: this.normalizeTrafficClockHour(overnightActiveUntil || 0),
      breakfastHour: 11,
      lunchHour: 15,
      dinnerHour: 22,
      workStartHour: 6,
      workLunchStartHour: 13,
      workLunchEndHour: 14,
      workEndHour: 18,
      partyStartHour: 23,
      partyReturnHour: 4,
      morningStaminaPenaltyPct: Phaser.Math.Clamp(morningStaminaPenaltyPct, 0, 0.35),
      sundayPartyDebuff: !!sundayPartyDebuff,
      sleepLateEvent: !!sleepLateEvent,
      workTarget: workTarget
        ? {
            buildingId: Number(workTarget.buildingId) || 0,
            typeKey: String(workTarget.typeKey || ""),
            road: { r: Number(workTarget.road?.r) || 0, c: Number(workTarget.road?.c) || 0 },
            tileSteps: Math.max(1, Number(workTarget.tileSteps) || 1),
            travelHours: Math.max(0.05, Number(workTarget.travelHours) || workTravelHours)
          }
        : null
    };

    this._kotoriDailyPlanCache.set(cacheKey, plan);
    return plan;
  }

  applyKotoriPlanToSleepSchedule(schedule, plan) {
    if (!schedule || !plan) return schedule;
    schedule.wakeHour = this.normalizeTrafficClockHour(plan.wakeHour);
    schedule.bedHour = this.normalizeTrafficClockHour(plan.bedHour);
    schedule.targetSleepHours = Phaser.Math.Clamp(Number(plan.targetSleepHours) || 7, 5.2, 9.6);
    schedule.leaveHomeDelayHours = Phaser.Math.Clamp(Number(plan.leaveHomeDelayHours) || 0.2, 0.02, 1.6);
    schedule.returnHomeLeadHours = Phaser.Math.Clamp(Number(plan.returnHomeLeadHours) || 0.6, 0.2, 1.8);
    schedule.nightOwl = !!plan.nightOwl;
    schedule.overnightActiveUntil = Number.isFinite(Number(plan.overnightActiveUntil))
      ? this.normalizeTrafficClockHour(plan.overnightActiveUntil)
      : 0;
    schedule.kotoriPlan = {
      dayKey: Number(plan.dayKey) || 0,
      weekday: Number(plan.weekday) || 0,
      isWorkday: !!plan.isWorkday,
      isSaturday: !!plan.isSaturday,
      isSunday: !!plan.isSunday,
      workStartHour: Number(plan.workStartHour) || 6,
      workLunchStartHour: Number(plan.workLunchStartHour) || 13,
      workLunchEndHour: Number(plan.workLunchEndHour) || 14,
      workEndHour: Number(plan.workEndHour) || 18
    };
    return schedule;
  }

  getKotoriNpcDailyPlan(npc, now = Date.now()) {
    if (!this.isKotoriNpc(npc)) return null;
    const npcKey = String(npc?.residentNpcKey || npc?.npcKey || "");
    const seedBase = this.getStreetNpcScheduleSeed(npc);
    const plan = this.getKotoriDailyPlanByMeta(Number(npc?.homeBuildingId) || 0, npcKey, now, seedBase);
    if (!plan) return null;
    npc.kotoriDayPlanKey = Number(plan.dayKey) || 0;
    npc.kotoriDayPlan = plan;
    return plan;
  }

  isKotoriWorkWindow(plan, hourNow = 0) {
    if (!plan?.isWorkday) return false;
    return this.isTrafficClockHourInWindow(hourNow, plan.workStartHour, plan.workEndHour);
  }

  isKotoriLunchWindow(plan, hourNow = 0) {
    if (!plan?.isWorkday) return false;
    return this.isTrafficClockHourInWindow(hourNow, plan.workLunchStartHour, plan.workLunchEndHour);
  }

  isKotoriPartyWindow(plan, hourNow = 0) {
    if (!plan) return false;
    if (plan.isSaturday && this.isTrafficClockHourInWindow(hourNow, plan.partyStartHour, 24)) return true;
    if (plan.isSunday && hourNow < Number(plan.partyReturnHour || 4)) return true;
    return false;
  }

  applyKotoriMissedLunchPenalty(npc, plan, now = Date.now()) {
    if (!npc || !plan) return false;
    if (Number(npc.kotoriMissedLunchDayKey) === Number(plan.dayKey)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    npc.kotoriMissedLunchDayKey = Number(plan.dayKey) || 0;
    npc.kotoriWorkLunchDebuffUntil = now + this.getTrafficRealMsForGameHours(
      Math.max(0.4, this.getTrafficClockHoursUntil(Number(plan.workEndHour) || 18, this.getTrafficClockHourFloat(now))),
      now
    );
    npc.worldStamina = Phaser.Math.Clamp((Number(npc.worldStamina) || 0) - (cap * 0.06), 0, cap);
    npc.worldStress = Phaser.Math.Clamp((Number(npc.worldStress) || 0) + 12, 0, 100);
    this.spawnStreetNpcEmote(npc, now, { emoji: "😓", kind: "almuerzo_pendiente", durationMs: 1600, risePx: 16 });
    return true;
  }

  applyKotoriWakeDebuffs(npc, plan, now = Date.now()) {
    if (!npc || !plan) return false;
    const dayKey = Number(plan.dayKey) || 0;
    if (Number(npc.kotoriWakeDebuffDayKey) === dayKey) return false;
    let penalty = Math.max(0, Number(plan.morningStaminaPenaltyPct) || 0);
    if (plan.sundayPartyDebuff) penalty = Math.max(penalty, 0.25);
    npc.kotoriWakeDebuffDayKey = dayKey;
    if (!(penalty > 0)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    npc.worldStamina = Phaser.Math.Clamp((Number(npc.worldStamina) || 0) - (cap * penalty), 0, cap);
    npc.worldStress = Phaser.Math.Clamp(
      (Number(npc.worldStress) || 0) + (plan.sundayPartyDebuff ? 16 : 8),
      0,
      100
    );
    if (plan.sundayPartyDebuff) {
      this.spawnStreetNpcEmote(npc, now, { emoji: "🥱", kind: "noche_diversion", durationMs: 1800, risePx: 18 });
    }
    return true;
  }

  routeKotoriNpcToWork(npc, plan, now = Date.now()) {
    if (!npc || !plan?.workTarget?.road) return false;
    const targetRoad = {
      r: Math.round(Number(plan.workTarget.road.r) || 0),
      c: Math.round(Number(plan.workTarget.road.c) || 0)
    };
    if (!this.isRoadCell(targetRoad.r, targetRoad.c)) return false;
    const from = { r: Math.round(Number(npc.r) || 0), c: Math.round(Number(npc.c) || 0) };
    if (!this.isRoadCell(from.r, from.c)) {
      const snap = this.getNearestRoadCellToPoint(from.r, from.c);
      if (!snap) return false;
      from.r = snap.r;
      from.c = snap.c;
      this.setStreetNpcScreenPosition(npc, from.r, from.c);
    }
    if (from.r === targetRoad.r && from.c === targetRoad.c) return false;
    const path = this.findRoadPath(from, targetRoad, 5200);
    if (!path || path.length < 2) return false;
    npc.path = path;
    npc.pathIndex = 0;
    npc.progress = 0;
    npc.waitUntil = 0;
    npc.sideSwitchStartAt = 0;
    npc.turnPauseUntil = 0;
    npc.turnPauseR = from.r;
    npc.turnPauseC = from.c;
    npc.nextPathAt = now + Phaser.Math.Between(120, 420);
    if (path.length >= 2) {
      const a = path[0];
      const b = path[1];
      npc.dirR = b.r - a.r;
      npc.dirC = b.c - a.c;
      npc.dirVisualR = npc.dirR;
      npc.dirVisualC = npc.dirC;
      npc.side = this.getSafeRoadEdgeSideForNpc(a.r, a.c, npc.dirR, npc.dirC, npc.side || 1);
      npc.sideTarget = npc.side;
      npc.sideVisual = npc.side;
    }
    return true;
  }

  normalizeSpecialResidentSleepSchedule(schedule, seedBase = 0) {
    if (!schedule || typeof schedule !== "object") return schedule;
    const bedNoise = this.sampleTrafficRoutine01(seedBase + 12.17);
    const wakeNoise = this.sampleTrafficRoutine01(seedBase + 13.29);
    const targetSleepNoise = this.sampleTrafficRoutine01(seedBase + 14.53);

    const rawBed = 22.0 + (bedNoise * 3.0); // 22:00 - 01:00 (mod 24)
    let bedHour = (((rawBed % 24) + 24) % 24);
    bedHour = (bedHour > TRAFFIC_SPECIAL_NPC_BED_MAX_HOUR && bedHour < 12)
      ? TRAFFIC_SPECIAL_NPC_BED_MAX_HOUR
      : bedHour;

    let wakeHour = TRAFFIC_SPECIAL_NPC_WAKE_MIN_HOUR
      + (wakeNoise * (TRAFFIC_SPECIAL_NPC_WAKE_MAX_HOUR - TRAFFIC_SPECIAL_NPC_WAKE_MIN_HOUR));
    let sleepHours = this.getTrafficClockHoursUntil(wakeHour, bedHour);
    if (sleepHours < TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS) {
      wakeHour += (TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS - sleepHours);
    } else if (sleepHours > TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MAX_HOURS) {
      wakeHour -= (sleepHours - TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MAX_HOURS);
    }
    wakeHour = Phaser.Math.Clamp(
      (((wakeHour % 24) + 24) % 24),
      TRAFFIC_SPECIAL_NPC_WAKE_MIN_HOUR,
      TRAFFIC_SPECIAL_NPC_WAKE_MAX_HOUR
    );

    schedule.bedHour = bedHour;
    schedule.wakeHour = wakeHour;
    schedule.targetSleepHours = Phaser.Math.Clamp(
      TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS
      + (targetSleepNoise * (TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MAX_HOURS - TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS)),
      TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS,
      TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MAX_HOURS
    );
    schedule.nightOwl = false;
    schedule.overnightActiveUntil = 0;
    schedule.leaveHomeDelayHours = Phaser.Math.Clamp(Number(schedule.leaveHomeDelayHours) || 0.22, 0.05, 0.35);
    schedule.returnHomeLeadHours = Phaser.Math.Clamp(Number(schedule.returnHomeLeadHours) || 0.55, 0.25, 0.95);
    return schedule;
  }

  normalizeResidentSleepScheduleForRole(schedule, seedBase = 0, npcKey = "", npcRarity = 1) {
    if (!schedule || typeof schedule !== "object") return schedule;
    if (this.isStrictSpecialResidentNpcByMeta(npcKey, npcRarity)) {
      return this.normalizeSpecialResidentSleepSchedule(schedule, seedBase);
    }
    return schedule;
  }

  getTrafficSimulationDayKey(now = Date.now()) {
    const state = this.dayCycleState || {};
    const duration = Math.max(60000, Number(state.durationMs) || DAY_CYCLE_DURATION_MS);
    const speed = Math.max(0.05, Number(state.speed) || 1);
    const simDayMs = duration / speed;
    return Math.floor((Number(now) || Date.now()) / simDayMs);
  }

  applyDailyVariationToSleepSchedule(schedule, seedBase = 0, dayKey = 0, isStrictSpecial = false) {
    if (!schedule || typeof schedule !== "object") return schedule;
    const day = Math.floor(Number(dayKey) || 0);
    if (!Number.isFinite(schedule.baseWakeHour)) schedule.baseWakeHour = Number(schedule.wakeHour) || 7;
    if (!Number.isFinite(schedule.baseBedHour)) schedule.baseBedHour = Number(schedule.bedHour) || 23;
    if (!Number.isFinite(schedule.baseTargetSleepHours)) {
      schedule.baseTargetSleepHours = Number(schedule.targetSleepHours) || TRAFFIC_NPC_SLEEP_IDEAL_MIN_HOURS;
    }
    if (!Number.isFinite(schedule.baseLeaveHomeDelayHours)) {
      schedule.baseLeaveHomeDelayHours = Number(schedule.leaveHomeDelayHours) || 0.35;
    }
    if (!Number.isFinite(schedule.baseReturnHomeLeadHours)) {
      schedule.baseReturnHomeLeadHours = Number(schedule.returnHomeLeadHours) || 0.65;
    }
    if (typeof schedule.baseNightOwl !== "boolean") schedule.baseNightOwl = !!schedule.nightOwl;
    if (!Number.isFinite(schedule.baseOvernightActiveUntil)) {
      schedule.baseOvernightActiveUntil = Number(schedule.overnightActiveUntil) || 0;
    }
    if (Number(schedule.dailyVariantKey) === day) return schedule;

    const rand = (offset) => this.sampleTrafficRoutine01(seedBase + (day * 1.3187) + Number(offset || 0));
    let bed = Number(schedule.baseBedHour) + ((rand(21.1) - 0.5) * (isStrictSpecial ? 0.70 : 1.65));
    let wake = Number(schedule.baseWakeHour) + ((rand(22.7) - 0.5) * (isStrictSpecial ? 0.65 : 1.35));
    let targetSleep = Number(schedule.baseTargetSleepHours) + ((rand(23.9) - 0.5) * (isStrictSpecial ? 0.8 : 1.25));
    let leaveDelay = Number(schedule.baseLeaveHomeDelayHours) + ((rand(24.8) - 0.5) * (isStrictSpecial ? 0.12 : 0.36));
    let returnLead = Number(schedule.baseReturnHomeLeadHours) + ((rand(25.6) - 0.5) * (isStrictSpecial ? 0.20 : 0.48));

    bed = (((bed % 24) + 24) % 24);
    wake = (((wake % 24) + 24) % 24);

    if (isStrictSpecial) {
      if (bed > TRAFFIC_SPECIAL_NPC_BED_MAX_HOUR && bed < 12) {
        bed = Math.max(0, TRAFFIC_SPECIAL_NPC_BED_MAX_HOUR - (rand(26.4) * 0.22));
      }
      wake = Phaser.Math.Clamp(wake, TRAFFIC_SPECIAL_NPC_WAKE_MIN_HOUR, TRAFFIC_SPECIAL_NPC_WAKE_MAX_HOUR);
      targetSleep = Phaser.Math.Clamp(
        targetSleep,
        TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS,
        TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MAX_HOURS
      );
      let sleepSpan = this.getTrafficClockHoursUntil(wake, bed);
      if (sleepSpan < TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS) {
        wake = Phaser.Math.Clamp(
          wake + (TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS - sleepSpan),
          TRAFFIC_SPECIAL_NPC_WAKE_MIN_HOUR,
          TRAFFIC_SPECIAL_NPC_WAKE_MAX_HOUR
        );
      }
      schedule.nightOwl = false;
      schedule.overnightActiveUntil = 0;
      leaveDelay = Phaser.Math.Clamp(leaveDelay, 0.05, 0.35);
      returnLead = Phaser.Math.Clamp(returnLead, 0.25, 0.95);
    } else {
      targetSleep = Phaser.Math.Clamp(targetSleep, 5.5, 9.6);
      leaveDelay = Phaser.Math.Clamp(leaveDelay, 0.02, 1.8);
      returnLead = Phaser.Math.Clamp(returnLead, 0.10, 1.8);
      schedule.nightOwl = !!schedule.baseNightOwl;
      schedule.overnightActiveUntil = Number(schedule.baseOvernightActiveUntil) || 0;
    }

    schedule.bedHour = bed;
    schedule.wakeHour = wake;
    schedule.targetSleepHours = targetSleep;
    schedule.leaveHomeDelayHours = leaveDelay;
    schedule.returnHomeLeadHours = returnLead;
    schedule.dailyVariantKey = day;
    return schedule;
  }

  buildStreetNpcSleepSchedule(seedBase = 0) {
    const wakeNoise = this.sampleTrafficRoutine01(seedBase + 1.11);
    const sleepNoise = this.sampleTrafficRoutine01(seedBase + 2.37);
    const bedShiftNoise = this.sampleTrafficRoutine01(seedBase + 3.91);
    const earlyBirdNoise = this.sampleTrafficRoutine01(seedBase + 4.49);
    const nightOwlNoise = this.sampleTrafficRoutine01(seedBase + 5.07);
    const leaveNoise = this.sampleTrafficRoutine01(seedBase + 6.41);
    const returnNoise = this.sampleTrafficRoutine01(seedBase + 7.13);

    const earlyBird = earlyBirdNoise >= 0.83; // ~17% se levantan muy temprano
    let wakeHour = earlyBird
      ? (4.9 + (this.sampleTrafficRoutine01(seedBase + 8.19) * 1.8)) // 04:54 - 06:42
      : (7.2 + (wakeNoise * 3.6)); // 07:12 - 10:48

    let bedHour = 22.0 + (bedShiftNoise * 2.0); // 22:00 - 00:00
    if (earlyBird) {
      bedHour = Math.max(20.8, bedHour - (0.55 + (this.sampleTrafficRoutine01(seedBase + 9.07) * 0.5)));
    }
    bedHour = (((bedHour % 24) + 24) % 24);

    let targetSleepHours = 7.0 + (sleepNoise * 2.1); // 7h00 - 9h06
    const nightOwl = nightOwlNoise >= 0.80; // ~20%
    let overnightActiveUntil = 0;
    if (nightOwl) {
      const delay = 0.75 + (this.sampleTrafficRoutine01(seedBase + 10.53) * 1.55); // +45m a +2h18
      bedHour = (bedHour + delay) % 24;
      wakeHour = Math.min(11.4, wakeHour + (delay * 0.42));
      targetSleepHours = Math.max(6.4, targetSleepHours - 0.35);
      overnightActiveUntil = Math.min(
        TRAFFIC_NPC_NIGHTOWL_MAX_END_HOUR,
        2.3 + (this.sampleTrafficRoutine01(seedBase + 11.31) * 1.3)
      );
    }

    const leaveHomeDelayHours = earlyBird
      ? (0.02 + (leaveNoise * 0.55)) // 1m - 34m
      : (0.15 + (leaveNoise * 1.35)); // 9m - 1h30m
    const returnHomeLeadHours = 0.20 + (returnNoise * 1.25); // 12m - 1h27m antes de dormir

    return {
      profileVersion: 3,
      wakeHour,
      targetSleepHours,
      bedHour,
      nightOwl,
      overnightActiveUntil,
      leaveHomeDelayHours,
      returnHomeLeadHours
    };
  }

  getStreetNpcPassiveScheduleSeed(npc) {
    const homeId = Number(npc?.homeBuildingId) || 0;
    const npcId = Number(npc?.id) || 0;
    const source = String(npc?.spawnSource || "");
    let sourceHash = 0;
    for (let i = 0; i < source.length; i++) {
      sourceHash += source.charCodeAt(i) * (i + 1);
    }
    return (homeId * 17.13) + (npcId * 1.91) + (sourceHash * 0.019) + 31.7;
  }

  getStreetNpcLifeSchedule(npc, now = Date.now()) {
    if (!npc) return null;
    if (this.hasStreetNpcGameplayStats(npc)) {
      return this.ensureStreetNpcSleepSchedule(npc, now);
    }
    const current = npc.simpleSleepSchedule;
    if (!current || typeof current !== "object" || Number(current.profileVersion) !== 3) {
      npc.simpleSleepSchedule = this.buildStreetNpcSleepSchedule(this.getStreetNpcPassiveScheduleSeed(npc));
    }
    return npc.simpleSleepSchedule;
  }

  getStreetNpcActiveWindow(schedule) {
    const wakeHour = Number.isFinite(Number(schedule?.wakeHour)) ? Number(schedule.wakeHour) : 8.4;
    const bedHour = Number.isFinite(Number(schedule?.bedHour)) ? Number(schedule.bedHour) : 23.0;
    const leaveDelayHours = Phaser.Math.Clamp(Number(schedule?.leaveHomeDelayHours) || 0.35, 0, 1.8);
    const returnLeadHours = Phaser.Math.Clamp(Number(schedule?.returnHomeLeadHours) || 0.65, 0.1, 1.8);
    const start = (wakeHour + leaveDelayHours) % 24;
    let end = (bedHour - returnLeadHours + 24) % 24;
    if (this.getTrafficClockHoursUntil(end, start) < 2.4) {
      end = bedHour;
    }
    return { start, end };
  }

  isStreetNpcScheduleActiveNow(schedule, now = Date.now()) {
    if (!schedule) return true;
    const hourNow = this.getTrafficClockHourFloat(now);
    const window = this.getStreetNpcActiveWindow(schedule);
    if (this.isTrafficClockHourInWindow(hourNow, window.start, window.end)) {
      return true;
    }
    if (!schedule.nightOwl) return false;
    const lateUntil = Number.isFinite(Number(schedule.overnightActiveUntil))
      ? Number(schedule.overnightActiveUntil)
      : 2.8;
    return this.isTrafficClockHourInWindow(hourNow, TRAFFIC_NPC_NIGHTOWL_START_HOUR, lateUntil);
  }

  canStreetNpcNightOwlStayOut(npc, now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) return false;
    const schedule = this.ensureStreetNpcSleepSchedule(npc, now) || {};
    if (!schedule.nightOwl) return false;
    const hourNow = this.getTrafficClockHourFloat(now);
    const lateUntil = Number.isFinite(Number(schedule.overnightActiveUntil))
      ? Number(schedule.overnightActiveUntil)
      : 2.8;
    return hourNow >= TRAFFIC_NPC_NIGHTOWL_START_HOUR || hourNow < lateUntil;
  }

  canResidentNpcSlotSpawnAtHour(b, slotIndex, npcKey, now = Date.now()) {
    const rarity = this.getNpcRarityForKey(npcKey);
    const seedBase = this.getStreetNpcScheduleSeedFromMeta(
      Number(b?.id) || 0,
      slotIndex,
      npcKey,
      rarity
    );
    const schedule = this.normalizeResidentSleepScheduleForRole(
      this.buildStreetNpcSleepSchedule(seedBase),
      seedBase,
      npcKey,
      rarity
    );
    this.applyDailyVariationToSleepSchedule(
      schedule,
      seedBase,
      this.getTrafficSimulationDayKey(now),
      this.isStrictSpecialResidentNpcByMeta(npcKey, rarity)
    );
    const kotoriPlanForSlot = this.getKotoriDailyPlanByMeta(
      Number(b?.id) || 0,
      npcKey,
      now,
      seedBase
    );
    if (kotoriPlanForSlot) {
      this.applyKotoriPlanToSleepSchedule(schedule, kotoriPlanForSlot);
    }
    const hourNow = this.getTrafficClockHourFloat(now);

    const wakeHour = Number.isFinite(Number(schedule.wakeHour)) ? Number(schedule.wakeHour) : 8.5;
    const bedHour = Number.isFinite(Number(schedule.bedHour)) ? Number(schedule.bedHour) : 23.0;
    const leaveDelayHours = Phaser.Math.Clamp(Number(schedule.leaveHomeDelayHours) || 0.35, 0, 1.8);
    const returnLeadHours = Phaser.Math.Clamp(Number(schedule.returnHomeLeadHours) || 0.65, 0.1, 1.8);

    const activeStart = (wakeHour + leaveDelayHours) % 24;
    let activeEnd = (bedHour - returnLeadHours + 24) % 24;
    if (this.getTrafficClockHoursUntil(activeEnd, activeStart) < 2.4) {
      activeEnd = bedHour;
    }

    if (this.isTrafficClockHourInWindow(hourNow, activeStart, activeEnd)) {
      return true;
    }
    if (!schedule.nightOwl) return false;
    const lateUntil = Number.isFinite(Number(schedule.overnightActiveUntil))
      ? Number(schedule.overnightActiveUntil)
      : 2.8;
    return this.isTrafficClockHourInWindow(hourNow, TRAFFIC_NPC_NIGHTOWL_START_HOUR, lateUntil);
  }

  ensureStreetNpcSleepSchedule(npc, now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) return null;
    const current = npc.sleepSchedule;
    const seedBase = this.getStreetNpcScheduleSeed(npc);
    const npcKey = String(npc?.residentNpcKey || "");
    const npcRarity = Number(npc?.npcRarity) || this.getNpcRarityForKey(npcKey);
    if (!current || typeof current !== "object" || Number(current.profileVersion) !== 3) {
      npc.sleepSchedule = this.buildStreetNpcSleepSchedule(seedBase);
    }
    this.normalizeResidentSleepScheduleForRole(npc.sleepSchedule, seedBase, npcKey, npcRarity);
    this.applyDailyVariationToSleepSchedule(
      npc.sleepSchedule,
      seedBase,
      this.getTrafficSimulationDayKey(now),
      this.isStrictSpecialResidentNpcByMeta(npcKey, npcRarity)
    );
    const kotoriPlan = this.getKotoriDailyPlanByMeta(
      Number(npc?.homeBuildingId) || 0,
      npcKey,
      now,
      seedBase
    );
    if (kotoriPlan) {
      this.applyKotoriPlanToSleepSchedule(npc.sleepSchedule, kotoriPlan);
      npc.kotoriDayPlan = kotoriPlan;
      npc.kotoriDayPlanKey = Number(kotoriPlan.dayKey) || 0;
      if (!Number.isFinite(Number(npc.kotoriWorkLunchDebuffUntil))) npc.kotoriWorkLunchDebuffUntil = 0;
      if (!Number.isFinite(Number(npc.kotoriMissedLunchDayKey))) npc.kotoriMissedLunchDayKey = -1;
      if (!Number.isFinite(Number(npc.kotoriWakeDebuffDayKey))) npc.kotoriWakeDebuffDayKey = -1;
    }
    if (typeof npc.sleepSchedule.nightOwl !== "boolean") npc.sleepSchedule.nightOwl = false;
    if (!Number.isFinite(Number(npc.sleepSchedule.overnightActiveUntil))) {
      npc.sleepSchedule.overnightActiveUntil = npc.sleepSchedule.nightOwl ? 2.8 : 0;
    }
    if (!Number.isFinite(Number(npc.sleepSchedule.leaveHomeDelayHours))) {
      npc.sleepSchedule.leaveHomeDelayHours = 0.4;
    }
    if (!Number.isFinite(Number(npc.sleepSchedule.returnHomeLeadHours))) {
      npc.sleepSchedule.returnHomeLeadHours = 0.6;
    }
    if (!Number.isFinite(npc.awakeAccumMs)) npc.awakeAccumMs = 0;
    if (!Number.isFinite(npc.overnightWorkMs)) npc.overnightWorkMs = 0;
    if (!Number.isFinite(npc.sleepStartAt)) npc.sleepStartAt = 0;
    if (!Number.isFinite(npc.sleepStartStamina)) npc.sleepStartStamina = Number(npc.worldStamina) || 0;
    if (!Number.isFinite(npc.lastSleepRecoveredAt)) npc.lastSleepRecoveredAt = 0;
    return npc.sleepSchedule;
  }

  markStreetNpcSleepStart(npc, now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    this.ensureStreetNpcSleepSchedule(npc, now);
    npc.sleepStartAt = now;
    npc.sleepStartStamina = Number(npc.worldStamina) || 0;
    npc.lastSleepRecoveredAt = 0;
    return true;
  }

  getStreetNpcSleptGameHours(npc, now = Date.now()) {
    const start = Math.max(0, Number(npc?.sleepStartAt) || 0);
    if (start <= 0 || now <= start) return 0;
    const hoursPerMs = this.getTrafficGameHoursPerMs(now);
    if (!(hoursPerMs > 0)) return 0;
    return Math.max(0, (now - start) * hoursPerMs);
  }

  applyStreetNpcSleepRecoveryBySchedule(npc, now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) return null;
    this.ensureStreetNpcWorldVitals(npc, now);
    const schedule = this.ensureStreetNpcSleepSchedule(npc, now);
    const isStrictSpecial = this.isStrictSpecialResidentNpc(npc);
    const maxSleepRecoverRatio = isStrictSpecial
      ? TRAFFIC_SPECIAL_NPC_STAMINA_RECOVER_SLEEP_MAX_RATIO
      : TRAFFIC_NPC_STAMINA_RECOVER_SLEEP_MAX_RATIO;
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    const sleptHours = this.getStreetNpcSleptGameHours(npc, now);
    if (sleptHours <= 0) return null;
    const hPerMs = this.getTrafficGameHoursPerMs(now);
    const awakeHours = Math.max(0, Number(npc.awakeAccumMs) || 0) * hPerMs;
    const overnightWorkHours = Math.max(0, Number(npc.overnightWorkMs) || 0) * hPerMs;
    const allNighter =
      awakeHours >= TRAFFIC_NPC_SLEEP_ALLNIGHT_AWAKE_HOURS
      || overnightWorkHours >= TRAFFIC_NPC_SLEEP_ALLNIGHT_WORK_HOURS;
    const inFullRecoverWindow =
      sleptHours >= TRAFFIC_NPC_SLEEP_FULL_RECOVER_MIN_HOURS
      && sleptHours <= TRAFFIC_NPC_SLEEP_FULL_RECOVER_MAX_HOURS;
    const overslept = sleptHours > TRAFFIC_NPC_SLEEP_FULL_RECOVER_MAX_HOURS;
    const underslept = sleptHours < TRAFFIC_NPC_SLEEP_FULL_RECOVER_MIN_HOURS;
    const sleepEventSeed =
      ((Number(npc?.id) || 0) * 17.37)
      + (Math.floor((Number(npc?.sleepStartAt) || 0) / 60000) * 0.71)
      + (Math.floor(Number(now) / 60000) * 0.37);
    const roll = this.sampleTrafficRoutine01(sleepEventSeed + 91.13);

    let targetRatio = maxSleepRecoverRatio;
    if (inFullRecoverWindow && !allNighter) {
      const qualityCenter = Math.abs(sleptHours - 7.0);
      const quality = Phaser.Math.Clamp(1 - (qualityCenter / 1.25), 0, 1);
      const fullChance = Phaser.Math.Clamp(0.40 + (quality * 0.45), 0.40, 0.85);
      if (roll <= fullChance) {
        targetRatio = 1;
      } else {
        const nearFullRoll = this.sampleTrafficRoutine01(sleepEventSeed + 123.17);
        targetRatio = Phaser.Math.Clamp(0.90 + (nearFullRoll * 0.09), 0.88, maxSleepRecoverRatio);
      }
    } else {
      const target = Math.max(1, Number(schedule?.targetSleepHours) || TRAFFIC_NPC_SLEEP_IDEAL_MIN_HOURS);
      const base = Phaser.Math.Clamp(sleptHours / target, 0, 1.05);
      const randomPenalty = 0.06 + (roll * 0.18); // variacion diaria: no siempre recupera igual
      targetRatio = (0.24 + (base * 0.72)) - randomPenalty;
      if (overslept) targetRatio *= TRAFFIC_NPC_SLEEP_OVERSLEEP_RECOVER_MULT;
      if (allNighter) targetRatio *= TRAFFIC_NPC_SLEEP_ALLNIGHT_RECOVER_MULT;
      if (underslept) targetRatio *= 0.92;
      targetRatio = Phaser.Math.Clamp(targetRatio, 0.18, maxSleepRecoverRatio);
    }

    const targetStamina = cap * targetRatio;
    const sleepStartStamina = Math.max(0, Number(npc.sleepStartStamina) || 0);
    const currentStamina = Math.max(0, Number(npc.worldStamina) || 0);
    // Descansar nunca debe reducir stamina: al menos conserva el valor previo al dormir.
    npc.worldStamina = Phaser.Math.Clamp(
      Math.max(targetStamina, sleepStartStamina, currentStamina),
      0,
      cap
    );
    npc.awakeAccumMs = 0;
    npc.overnightWorkMs = 0;
    npc.sleepStartAt = 0;
    npc.sleepStartStamina = npc.worldStamina;
    npc.lastSleepRecoveredAt = now;
    npc.lastSleepMeta = {
      sleptHours,
      targetRatio,
      allNighter,
      overslept,
      inFullRecoverWindow
    };
    return npc.lastSleepMeta;
  }

  shouldStreetNpcReturnHomeByStamina(npc, now = Date.now()) {
    if (!npc) return false;
    if (now < (Number(npc.noHomeReturnUntil) || 0)) return false;
    if (!this.hasStreetNpcGameplayStats(npc)) {
      const commonSchedule = this.getStreetNpcLifeSchedule(npc, now);
      if (this.isStreetNpcScheduleActiveNow(commonSchedule, now)) return false;
      const hourNow = this.getTrafficClockHourFloat(now);
      const bucket = Math.floor((Number(now) || Date.now()) / 180000);
      const seed = this.sampleTrafficRoutine01(((Number(npc.id) || 0) * 17.9) + (bucket * 1.7));
      const stayOutsideChance = hourNow < 4.5 ? 0.10 : 0.18;
      return seed >= stayOutsideChance;
    }
    this.ensureStreetNpcSleepSchedule(npc, now);
    const isStrictSpecial = this.isStrictSpecialResidentNpc(npc);
    const minSleepHours = isStrictSpecial ? TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS : TRAFFIC_NPC_SLEEP_IDEAL_MIN_HOURS;
    const phase = this.getTrafficLifePhaseKey(now);
    const ratio = this.getStreetNpcStaminaRatio(npc);
    const sleepSchedule = npc.sleepSchedule || {};
    const hourNow = this.getTrafficClockHourFloat(now);
    const kotoriPlan = this.getKotoriNpcDailyPlan(npc, now);
    if (kotoriPlan) {
      if (this.isKotoriPartyWindow(kotoriPlan, hourNow)) return false;
      if (kotoriPlan.isWorkday && this.isKotoriWorkWindow(kotoriPlan, hourNow) && !this.isKotoriLunchWindow(kotoriPlan, hourNow)) {
        return false;
      }
      if (kotoriPlan.isWorkday && hourNow >= Number(kotoriPlan.workEndHour || 18) && hourNow < 22) {
        if (ratio <= 0.92) return true;
      }
    }
    const bedHour = Number.isFinite(Number(sleepSchedule.bedHour))
      ? Number(sleepSchedule.bedHour)
      : 22;
    const wakeHour = Number.isFinite(Number(sleepSchedule.wakeHour))
      ? Number(sleepSchedule.wakeHour)
      : 7;
    const returnLeadHours = Phaser.Math.Clamp(Number(sleepSchedule.returnHomeLeadHours) || 0.65, 0.1, 1.8);
    const targetSleepHours = Math.max(
      minSleepHours,
      Number(sleepSchedule.targetSleepHours) || (isStrictSpecial ? TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS : TRAFFIC_NPC_SLEEP_IDEAL_MIN_HOURS)
    );
    const toBed = this.getTrafficClockHoursUntil(bedHour, hourNow);
    const toWake = this.getTrafficClockHoursUntil(wakeHour, hourNow);
    const nightOwlActive = this.canStreetNpcNightOwlStayOut(npc, now);
    const sleepWindowOpen = this.isTrafficClockHourInWindow(hourNow, bedHour, wakeHour);
    if (sleepWindowOpen) {
      if (!nightOwlActive) return true;
      const minNightOwlSleep = Math.max(TRAFFIC_NPC_NIGHTOWL_MIN_SLEEP_HOURS, targetSleepHours - 0.8);
      if (toWake <= minNightOwlSleep) return true;
    }
    const inBedWindow = toBed <= (nightOwlActive ? Math.max(0.45, returnLeadHours * 0.9) : returnLeadHours)
      || toWake <= (targetSleepHours + 0.45);
    const awakeHours = Math.max(0, Number(npc.awakeAccumMs) || 0) * this.getTrafficGameHoursPerMs(now);
    if (awakeHours >= TRAFFIC_NPC_SLEEP_ALLNIGHT_AWAKE_HOURS) return true;
    if (toBed <= 0.08) return true;
    if (inBedWindow && ratio <= (nightOwlActive ? 0.66 : 0.78)) return true;
    if (phase === "dia") return ratio <= 0.01;
    if (phase === "tarde") return ratio <= 0.05;
    if (phase === "noche") return ratio <= (nightOwlActive ? 0.10 : 0.20);
    if (phase === "madrugada") return ratio <= (nightOwlActive ? 0.16 : 0.36);
    return false;
  }

  shouldStreetNpcKeepSleeping(npc, now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) {
      const commonSchedule = this.getStreetNpcLifeSchedule(npc, now);
      return !this.isStreetNpcScheduleActiveNow(commonSchedule, now);
    }
    this.ensureStreetNpcSleepSchedule(npc, now);
    const isStrictSpecial = this.isStrictSpecialResidentNpc(npc);
    const minSleepHours = isStrictSpecial ? TRAFFIC_SPECIAL_NPC_SLEEP_MIN_HOURS : TRAFFIC_NPC_SLEEP_IDEAL_MIN_HOURS;
    const schedule = npc.sleepSchedule || {};
    const phase = this.getTrafficLifePhaseKey(now);
    const ratio = this.getStreetNpcStaminaRatio(npc);
    const sleptHours = this.getStreetNpcSleptGameHours(npc, now);
    const hourNow = this.getTrafficClockHourFloat(now);
    const wakeHour = Number.isFinite(Number(schedule.wakeHour)) ? Number(schedule.wakeHour) : 7;
    const wakeDelayHours = Phaser.Math.Clamp(Number(schedule.leaveHomeDelayHours) || 0.35, 0, 1.8);
    const wakeTargetHour = (wakeHour + wakeDelayHours) % 24;
    const toWake = this.getTrafficClockHoursUntil(wakeTargetHour, hourNow);
    const targetSleepHours = Math.max(
      minSleepHours,
      Number(schedule.targetSleepHours) || (isStrictSpecial ? TRAFFIC_SPECIAL_NPC_SLEEP_TARGET_MIN_HOURS : 7)
    );

    if (now < (Number(npc.fastHomeRecoverUntil) || 0) && sleptHours >= 1.2 && ratio >= 0.60) return false;
    if (sleptHours < minSleepHours) return true;
    if (sleptHours >= TRAFFIC_NPC_SLEEP_MAX_HOURS) return false;
    if (toWake <= 0.20) return false;
    if (toWake > 12 && sleptHours >= minSleepHours) return false;
    const isNightPhase = phase === "noche" || phase === "madrugada";
    if (isNightPhase && hourNow < TRAFFIC_PERU_DAY_START_HOUR) return true;
    if (phase === "dia" && sleptHours >= targetSleepHours && ratio >= 0.92) return false;
    if (phase === "tarde" && sleptHours >= targetSleepHours && ratio >= 0.86) return false;
    return ratio < 0.90;
  }

  ensureStreetNpcWorldVitals(npc, now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) return;
    const cap = this.getStreetNpcStaminaCap(npc);
    npc.worldStaminaCap = cap;
    if (!Number.isFinite(npc.worldStamina)) {
      npc.worldStamina = cap;
    } else {
      npc.worldStamina = Phaser.Math.Clamp(Number(npc.worldStamina) || 0, 0, cap);
    }
    if (!Number.isFinite(npc.heatZeroSince)) npc.heatZeroSince = 0;
    if (!Number.isFinite(npc.nextHeatRefreshTryAt)) {
      npc.nextHeatRefreshTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS, TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS);
    }
    if (!Number.isFinite(npc.worldBodyTempC)) {
      npc.worldBodyTempC = 36.6;
    } else {
      npc.worldBodyTempC = Phaser.Math.Clamp(Number(npc.worldBodyTempC) || 36.6, 34.0, 41.0);
    }
    if (!Number.isFinite(npc.worldStress)) {
      npc.worldStress = 12;
    } else {
      npc.worldStress = Phaser.Math.Clamp(Number(npc.worldStress) || 0, 0, 100);
    }
    if (!Number.isFinite(npc.climateHeatStress)) npc.climateHeatStress = 0;
    if (!Number.isFinite(npc.climateColdStress)) npc.climateColdStress = 0;
    if (!Number.isFinite(npc.climateDiscomfort)) npc.climateDiscomfort = 0;
    if (typeof npc.climatePreferenceKey !== "string" || !npc.climatePreferenceKey) {
      const pref = this.getStreetNpcClimatePreference(npc);
      npc.climatePreferenceKey = String(pref.teamKey || "templado");
    }
    if (!Number.isFinite(npc.fastHomeRecoverUntil)) npc.fastHomeRecoverUntil = 0;
    if (!Number.isFinite(npc.heatRecoverAt)) npc.heatRecoverAt = 0;
    if (typeof npc.heatState !== "string") npc.heatState = "";
    this.ensureStreetNpcSleepSchedule(npc, now);
  }

  applyStreetNpcQuickRefresh(npc, source = "shop", now = Date.now()) {
    if (!this.hasStreetNpcGameplayStats(npc)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    const inHome = String(source || "shop").toLowerCase() === "home";
    const staminaRatio = inHome
      ? TRAFFIC_NPC_QUICK_REFRESH_HOME_STAMINA_RATIO
      : TRAFFIC_NPC_QUICK_REFRESH_SHOP_STAMINA_RATIO;
    const staminaFlat = inHome
      ? TRAFFIC_NPC_QUICK_REFRESH_HOME_STAMINA_FLAT
      : TRAFFIC_NPC_QUICK_REFRESH_SHOP_STAMINA_FLAT;
    const bodyTempDrop = inHome
      ? TRAFFIC_NPC_QUICK_REFRESH_HOME_BODY_TEMP_DROP
      : TRAFFIC_NPC_QUICK_REFRESH_SHOP_BODY_TEMP_DROP;
    const stressDrop = inHome
      ? TRAFFIC_NPC_QUICK_REFRESH_HOME_STRESS_DROP
      : TRAFFIC_NPC_QUICK_REFRESH_SHOP_STRESS_DROP;

    const curStamina = Phaser.Math.Clamp(Number(npc.worldStamina) || 0, 0, cap);
    const gain = Math.max(staminaFlat, cap * staminaRatio);
    npc.worldStamina = Phaser.Math.Clamp(curStamina + gain, 0, cap);
    npc.worldBodyTempC = Phaser.Math.Clamp((Number(npc.worldBodyTempC) || 36.6) - bodyTempDrop, 34.0, 41.0);
    npc.worldStress = Phaser.Math.Clamp((Number(npc.worldStress) || 0) - stressDrop, 0, 100);
    npc.heatZeroSince = 0;
    npc.nextHeatRefreshTryAt = Math.max(
      Number(npc.nextHeatRefreshTryAt) || 0,
      now + Phaser.Math.Between(1200, 2600)
    );
    return true;
  }

  isStrongSunForStreetNpc(now = Date.now()) {
    const phase = this.getTrafficLifePhaseKey(now);
    if (phase === "noche" || phase === "madrugada") return false;
    const state = this.npcEmoteState || {};
    const wx = String(state.weatherLabelLower || "");
    const temp = Number.isFinite(Number(state.tempC)) ? Number(state.tempC) : 22;
    if (/calor fuera de temporada|bochorno/.test(wx)) return true;
    if (temp >= 31) return true;
    if ((/soleado|sol|calor/.test(wx)) && temp >= 27) return true;
    return false;
  }

  getStreetNpcDisplayName(npc) {
    if (!npc) return "NPC";
    const key = String(npc.residentNpcKey || "").trim();
    const def = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS?.[key]) ? ITEM_DEFS[key] : null;
    return String(def?.name || key || "NPC");
  }

  getStreetNpcClimatePreference(npc) {
    const key = String(npc?.residentNpcKey || "").toLowerCase();
    const name = String(this.getStreetNpcDisplayName(npc) || "").toLowerCase();
    const marker = `${name} ${key}`;
    if (marker.includes("kotori") || marker.includes("paloma kotori")) {
      return {
        teamKey: "frio",
        idealMin: 16,
        idealMax: 22,
        hotWarn: 23.5,
        hotHard: 30.5,
        coldWarn: 12.0,
        coldHard: 8.0
      };
    }
    return {
      teamKey: "templado",
      idealMin: 19,
      idealMax: 26,
      hotWarn: 28.5,
      hotHard: 34.0,
      coldWarn: 14.5,
      coldHard: 10.5
    };
  }

  getStreetNpcThermalDiscomfort(npc, ambientTempC = 22, weatherLabelLower = "") {
    const pref = this.getStreetNpcClimatePreference(npc);
    const temp = Number.isFinite(Number(ambientTempC)) ? Number(ambientTempC) : 22;
    const wx = String(weatherLabelLower || "");
    const hotSpan = Math.max(0.1, Number(pref.hotHard) - Number(pref.hotWarn));
    const coldSpan = Math.max(0.1, Number(pref.coldWarn) - Number(pref.coldHard));
    let heat = temp > Number(pref.hotWarn)
      ? Phaser.Math.Clamp((temp - Number(pref.hotWarn)) / hotSpan, 0, 1.45)
      : 0;
    let cold = temp < Number(pref.coldWarn)
      ? Phaser.Math.Clamp((Number(pref.coldWarn) - temp) / coldSpan, 0, 1.35)
      : 0;
    if (/bochorno|calor fuera de temporada/.test(wx)) heat = Math.min(1.45, heat + 0.22);
    if (/lluvia|garua|llovizna/.test(wx)) {
      heat = Math.max(0, heat - 0.12);
      if (temp <= Number(pref.idealMin)) cold = Math.min(1.35, cold + 0.08);
    }
    if (/frio/.test(wx)) cold = Math.min(1.35, cold + 0.10);
    return {
      pref,
      heat,
      cold,
      discomfort: Phaser.Math.Clamp(Math.max(heat, cold), 0, 1.45)
    };
  }

  getStreetNpcStaminaDrainPhaseMult(phase = "dia") {
    const key = String(phase || "dia").toLowerCase();
    const raw = Number(TRAFFIC_NPC_STAMINA_DRAIN_PHASE_MULT?.[key]);
    return Number.isFinite(raw) && raw > 0 ? raw : 1;
  }

  updateStreetNpcBodyTempAndStress(npc, now = Date.now(), deltaMs = 16, opts = {}) {
    if (!this.hasStreetNpcGameplayStats(npc)) return;
    this.ensureStreetNpcWorldVitals(npc, now);
    const dtSec = Math.max(0, Math.min(0.4, (Math.max(0, Number(deltaMs) || 16) / 1000)));
    const inHome = !!opts.inHome;
    const inShop = !!opts.inShop;
    const ambientTempC = Number.isFinite(Number(opts.ambientTempC))
      ? Number(opts.ambientTempC)
      : (Number.isFinite(Number(this.npcEmoteState?.tempC)) ? Number(this.npcEmoteState?.tempC) : 22);
    const weatherLabelLower = String(
      opts.weatherLabelLower ?? this.npcEmoteState?.weatherLabelLower ?? ""
    );
    const thermal = this.getStreetNpcThermalDiscomfort(npc, ambientTempC, weatherLabelLower);
    const staminaRatio = this.getStreetNpcStaminaRatio(npc);
    const prefMid = (Number(thermal.pref.idealMin) + Number(thermal.pref.idealMax)) * 0.5;

    let targetBodyTemp = 36.6 + ((ambientTempC - prefMid) * 0.11);
    targetBodyTemp += thermal.heat * 1.25;
    targetBodyTemp -= thermal.cold * 1.05;
    if (inHome) targetBodyTemp -= 0.28;
    if (inShop) targetBodyTemp -= 0.18;
    targetBodyTemp = Phaser.Math.Clamp(targetBodyTemp, 34.2, 40.2);
    const bodyTempCurrent = Number.isFinite(Number(npc.worldBodyTempC)) ? Number(npc.worldBodyTempC) : 36.6;
    const bodyLerp = Phaser.Math.Clamp(dtSec * (inHome ? 1.05 : 0.75), 0, 1);
    npc.worldBodyTempC = Phaser.Math.Linear(bodyTempCurrent, targetBodyTemp, bodyLerp);

    let stressTarget = 8 + (thermal.discomfort * 56) + ((1 - staminaRatio) * 32);
    if (/evento:/.test(weatherLabelLower)) stressTarget += 6;
    if (inHome) stressTarget *= 0.56;
    else if (inShop) stressTarget *= 0.74;
    if (npc.heatState === "fainted") stressTarget = 100;
    stressTarget = Phaser.Math.Clamp(stressTarget, 0, 100);
    const stressCurrent = Number.isFinite(Number(npc.worldStress)) ? Number(npc.worldStress) : 12;
    const stressLerp = Phaser.Math.Clamp(dtSec * (inHome ? 1.45 : 0.9), 0, 1);
    npc.worldStress = Phaser.Math.Linear(stressCurrent, stressTarget, stressLerp);

    npc.climatePreferenceKey = String(thermal.pref.teamKey || "templado");
    npc.climateHeatStress = thermal.heat;
    npc.climateColdStress = thermal.cold;
    npc.climateDiscomfort = thermal.discomfort;
  }

  startStreetNpcHeatFaint(npc, now = Date.now()) {
    if (!npc?.sprite?.active || !this.hasStreetNpcGameplayStats(npc)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    if (npc.heatState === "fainted") return true;

    npc.heatState = "fainted";
    npc.heatRecoverAt = now + TRAFFIC_NPC_HEAT_FAINT_MS;
    npc.heatZeroSince = now;
    npc.path = null;
    npc.pathIndex = 0;
    npc.progress = 0;
    npc.waitUntil = now + TRAFFIC_NPC_HEAT_FAINT_MS;
    npc.nextPathAt = now + TRAFFIC_NPC_HEAT_FAINT_MS;
    npc.shopState = "";
    npc.shopExitAt = 0;
    npc.nextShopTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS, TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS);
    npc.turnPauseUntil = 0;
    npc.sideSwitchStartAt = 0;
    npc.sprite.setVisible(true);
    npc.sprite.setAlpha(Math.max(0.9, Number(npc.cameraFadeAlpha) || 1));
    this.clearStreetNpcEmoteForNpc(npc);
    this.spawnStreetNpcEmote(npc, now, { emoji: "🤒", kind: "golpe_calor", durationMs: 1800 });
    this.showTrafficCapacityMessage(`${this.getStreetNpcDisplayName(npc)} sufrio golpe de calor.`);
    return true;
  }

  clearStreetNpcHeatFaint(npc, now = Date.now(), source = "time") {
    if (!npc?.sprite?.active || !this.hasStreetNpcGameplayStats(npc)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    npc.heatState = "";
    npc.heatRecoverAt = 0;
    npc.heatZeroSince = 0;
    npc.nextHeatRefreshTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS, TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS);
    if (source === "medicine") {
      npc.worldStamina = Math.max(cap * 0.68, cap * 0.5);
      npc.fastHomeRecoverUntil = 0;
      npc.nextPathAt = now + Phaser.Math.Between(220, 900);
      this.showTrafficCapacityMessage(`${this.getStreetNpcDisplayName(npc)} se recupero con medicina.`);
    } else if (source === "home") {
      npc.worldStamina = Math.max(cap * 0.35, cap * 0.18);
      npc.fastHomeRecoverUntil = now + 70000;
      this.tryStartStreetNpcHomeReturn(npc, now);
      this.showTrafficCapacityMessage(`${this.getStreetNpcDisplayName(npc)} fue enviado a casa.`);
    } else {
      npc.worldStamina = Math.max(cap * 0.32, cap * 0.15);
    }
    npc.waitUntil = 0;
    if (source !== "home") {
      npc.path = null;
      npc.pathIndex = 0;
      npc.progress = 0;
    }
    this.clearStreetNpcEmoteForNpc(npc);
    return true;
  }

  updateStreetNpcHeatAndStamina(npc, now = Date.now(), deltaMs = 16) {
    if (!this.hasStreetNpcGameplayStats(npc)) return false;
    this.ensureStreetNpcWorldVitals(npc, now);
    const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
    const isStrictSpecial = this.isStrictSpecialResidentNpc(npc);
    const simScale = this.getTrafficVitalsDeltaScale();
    const dtMs = Math.max(0, Math.min(480, (Math.max(0, Number(deltaMs) || 16) * simScale)));
    const dtSec = dtMs / 1000;
    const inHome = (npc.homeState === "home_sleeping" || npc.homeState === "home_entering" || npc.homeState === "home_waking");
    const inShop = (npc.shopState === "inside" || npc.shopState === "entering" || npc.shopState === "exiting");
    const canMoveWorld = !inHome && !inShop;
    if (!inHome) {
      npc.awakeAccumMs = Math.max(0, Number(npc.awakeAccumMs) || 0) + dtMs;
    } else if (npc.homeState === "home_sleeping" && !(Number(npc.sleepStartAt) > 0)) {
      this.markStreetNpcSleepStart(npc, now);
    }
    const phaseNow = this.getTrafficLifePhaseKey(now);
    const climateState = this.npcEmoteState || {};
    const ambientTempC = Number.isFinite(Number(climateState.tempC)) ? Number(climateState.tempC) : 22;
    const weatherLabelLower = String(climateState.weatherLabelLower || "");
    this.updateStreetNpcBodyTempAndStress(npc, now, dtMs, {
      inHome,
      inShop,
      ambientTempC,
      weatherLabelLower
    });
    if (inShop && (phaseNow === "noche" || phaseNow === "madrugada")) {
      npc.overnightWorkMs = Math.max(0, Number(npc.overnightWorkMs) || 0) + dtMs;
    }

    if (npc.heatState === "fainted") {
      npc.path = null;
      npc.pathIndex = 0;
      npc.progress = 0;
      npc.waitUntil = now + 500;
      this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
      if (!npc.activeEmoteId && now >= (Number(npc.nextEmoteAt) || 0)) {
        this.spawnStreetNpcEmote(npc, now, { emoji: "🤒", kind: "golpe_calor", durationMs: 1800 });
        npc.nextEmoteAt = now + Phaser.Math.Between(2400, 4200);
      }
      if (now >= (Number(npc.heatRecoverAt) || 0)) {
        this.clearStreetNpcHeatFaint(npc, now, "time");
        return false;
      }
      return true;
    }

    if (inHome) {
      const cur = Phaser.Math.Clamp(Number(npc.worldStamina) || 0, 0, cap);
      const homeState = String(npc.homeState || "");
      const homeReason = String(npc.homeReason || npc.homeIntent || "sleep");
      let recoverPerSec = 0;
      let recoverCapRatio = 1;
      if (homeState === "home_sleeping") {
        if (homeReason === "meal") {
          recoverPerSec = TRAFFIC_NPC_STAMINA_RECOVER_HOME_MEAL_PER_SEC;
          recoverCapRatio = TRAFFIC_NPC_STAMINA_RECOVER_HOME_MEAL_MAX_RATIO;
        } else if (now < (Number(npc.fastHomeRecoverUntil) || 0)) {
          recoverPerSec = TRAFFIC_NPC_HEAT_HOME_RECOVER_BOOST_PER_SEC;
          recoverCapRatio = 1;
        } else {
          recoverPerSec = TRAFFIC_NPC_STAMINA_RECOVER_SLEEP_PER_SEC;
          recoverCapRatio = isStrictSpecial
            ? TRAFFIC_SPECIAL_NPC_STAMINA_RECOVER_SLEEP_MAX_RATIO
            : TRAFFIC_NPC_STAMINA_RECOVER_SLEEP_MAX_RATIO;
        }
      } else {
        recoverPerSec = 0;
        recoverCapRatio = 0.74;
      }
      const recoverCap = cap * Phaser.Math.Clamp(Number(recoverCapRatio) || 1, 0.2, 1);
      const maxRecoverStamina = Math.max(cur, recoverCap);
      npc.worldStamina = Phaser.Math.Clamp(cur + (recoverPerSec * dtSec), 0, maxRecoverStamina);
      if (npc.worldStamina > 0) npc.heatZeroSince = 0;
      return false;
    }

    if (inShop) {
      const cur = Phaser.Math.Clamp(Number(npc.worldStamina) || 0, 0, cap);
      const recoverCap = cap * TRAFFIC_NPC_STAMINA_RECOVER_SHOP_MAX_RATIO;
      const maxRecoverStamina = Math.max(cur, recoverCap);
      npc.worldStamina = Phaser.Math.Clamp(cur + (TRAFFIC_NPC_STAMINA_RECOVER_SHOP_PER_SEC * dtSec), 0, maxRecoverStamina);
      if (npc.worldStamina > 0) npc.heatZeroSince = 0;
      return false;
    }

    const strongSun = this.isStrongSunForStreetNpc(now);
    const phaseDrainMult = this.getStreetNpcStaminaDrainPhaseMult(phaseNow);
    let drain = TRAFFIC_NPC_STAMINA_DRAIN_BASE_PER_SEC * phaseDrainMult;
    if (strongSun) {
      drain += TRAFFIC_NPC_STAMINA_DRAIN_STRONG_SUN_PER_SEC;
    }
    if (phaseNow === "madrugada" && !this.canStreetNpcNightOwlStayOut(npc, now)) {
      drain += 0.06;
    }
    const stressRatio = Phaser.Math.Clamp((Number(npc.worldStress) || 0) / 100, 0, 1);
    drain *= (1 + (stressRatio * 0.22));
    if (this.isKotoriNpc(npc) && now < (Number(npc.kotoriWorkLunchDebuffUntil) || 0)) {
      drain *= 1.24;
      npc.worldStress = Phaser.Math.Clamp((Number(npc.worldStress) || 0) + (dtSec * 2.8), 0, 100);
    }
    npc.worldStamina = Phaser.Math.Clamp((Number(npc.worldStamina) || 0) - (drain * dtSec), 0, cap);
    const staminaRatio = Phaser.Math.Clamp((Number(npc.worldStamina) || 0) / cap, 0, 1);

    // Busca tienda para refrescarse antes de llegar a 0 stamina.
    const shouldTryRefreshShop = strongSun
      ? (staminaRatio <= 0.42)
      : (staminaRatio <= 0.26);
    if (shouldTryRefreshShop && now >= (Number(npc.nextHeatRefreshTryAt) || 0)) {
      const forcedShop = this.tryStreetNpcEnterNearbyShop(npc, now, {
        force: true,
        reason: strongSun ? "heat_seek" : "rest_seek"
      });
      if (!forcedShop && staminaRatio <= 0.10) {
        this.tryStartStreetNpcHomeReturn(npc, now, { reason: "rest" });
      }
      npc.nextHeatRefreshTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS, TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS);
    }

    if (npc.worldStamina <= 0.001) {
      if (!npc.heatZeroSince) npc.heatZeroSince = now;

      if (now >= (Number(npc.nextHeatRefreshTryAt) || 0)) {
        const sleepNow = this.isTrafficSleepPhase(now, npc);
        const forcedShop = !sleepNow && this.tryStreetNpcEnterNearbyShop(npc, now, { force: true, reason: "heat" });
        if (!forcedShop) {
          this.tryStartStreetNpcHomeReturn(npc, now);
        }
        npc.nextHeatRefreshTryAt = now + Phaser.Math.Between(TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS, TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS);
      }

      // Golpe de calor solo bajo sol/calor fuerte.
      if (strongSun && (now - npc.heatZeroSince) >= TRAFFIC_NPC_HEAT_ZERO_TRIGGER_MS) {
        this.startStreetNpcHeatFaint(npc, now);
        return true;
      }

      // Sin calor fuerte: stamina 0 = agotado, vuelve a casa a descansar.
      if (!strongSun) {
        this.tryStartStreetNpcHomeReturn(npc, now);
        npc.waitUntil = Math.max(Number(npc.waitUntil) || 0, now + Phaser.Math.Between(220, 640));
        if (!npc.activeEmoteId && now >= (Number(npc.nextEmoteAt) || 0)) {
          this.spawnStreetNpcEmote(npc, now, { emoji: "😪", kind: "agotado", durationMs: 1600 });
          npc.nextEmoteAt = now + Phaser.Math.Between(2600, 5200);
        }
      }
      return false;
    }

    npc.heatZeroSince = 0;
    if (canMoveWorld && npc.worldStamina <= (cap * TRAFFIC_NPC_LOW_STAMINA_RATIO)) {
      npc.waitUntil = Math.max(Number(npc.waitUntil) || 0, now + Phaser.Math.Between(260, 740));
    }
    return false;
  }

  pickHeatFaintedNpcAt(worldX, worldY, maxDistPx = 24) {
    const x = Number(worldX);
    const y = Number(worldY);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    let best = null;
    let bestD2 = Number(maxDistPx) * Number(maxDistPx);
    for (const npc of this.streetNpcs) {
      if (!npc?.sprite?.active || npc.heatState !== "fainted") continue;
      if (!this.hasStreetNpcGameplayStats(npc)) continue;
      const nx = Number.isFinite(npc.screenX) ? npc.screenX : npc.sprite.x;
      const ny = Number.isFinite(npc.screenY) ? npc.screenY : npc.sprite.y;
      const dx = nx - x;
      const dy = ny - y;
      const d2 = (dx * dx) + (dy * dy);
      if (d2 > bestD2) continue;
      bestD2 = d2;
      best = npc;
    }
    return best;
  }

  closeNpcHeatAssistModal() {
    this.npcHeatStatus.modalOpen = false;
    this.npcHeatStatus.activeNpcId = 0;
    const modal = document.getElementById("npc-heat-modal");
    if (modal?.parentNode) modal.remove();
  }

  openNpcHeatAssistModal(npc) {
    if (!npc?.sprite?.active || npc.heatState !== "fainted") return;
    const id = Number(npc.id) || 0;
    this.closeNpcHeatAssistModal();
    this.npcHeatStatus.activeNpcId = id;
    this.npcHeatStatus.modalOpen = true;

    const medKey = "med_heat_stroke";
    const medCount = Math.max(0, Math.round(Number(this.economy?.inventory?.[medKey]) || 0));
    const name = this.getStreetNpcDisplayName(npc);
    const modal = document.createElement("div");
    modal.id = "npc-heat-modal";
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      zIndex: "13050",
      background: "rgba(2,6,23,.72)",
      display: "grid",
      placeItems: "center",
      padding: "14px"
    });
    modal.innerHTML = `
      <div style="
        width:min(420px,94vw);
        border-radius:16px;
        background:linear-gradient(180deg,#0b1220 0%,#0a1020 100%);
        border:1px solid rgba(248,113,113,.45);
        box-shadow:0 16px 44px rgba(2,6,23,.7);
        padding:14px 14px 12px;
        color:#e2e8f0;
        font-family:Arial,sans-serif;
        display:grid;
        gap:10px;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;">
          <div style="font-size:22px;font-weight:900;line-height:1;">🤒 Golpe de Calor</div>
          <button id="npcHeatAssistClose" type="button" style="width:36px;height:36px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:#0f172a;color:#e2e8f0;font-size:20px;font-weight:800;cursor:pointer;">×</button>
        </div>
        <div style="font-size:15px;font-weight:700;color:#fca5a5;">${name}</div>
        <div style="font-size:13px;color:#cbd5e1;">El NPC se desmayo por calor. Puedes curarlo con medicina o enviarlo a casa para recuperacion rapida.</div>
        <div style="font-size:12px;color:#93c5fd;">Medicina disponible: <b>${medCount}</b></div>
        <div id="npcHeatAssistHint" style="font-size:12px;color:#fbbf24;min-height:18px;"></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
          <button id="npcHeatUseMed" type="button" style="border:none;border-radius:12px;padding:12px 10px;background:#22c55e;color:#052e16;font-size:14px;font-weight:900;cursor:pointer;">Usar medicina</button>
          <button id="npcHeatSendHome" type="button" style="border:none;border-radius:12px;padding:12px 10px;background:#60a5fa;color:#0b1020;font-size:14px;font-weight:900;cursor:pointer;">Enviar a casa</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const close = () => this.closeNpcHeatAssistModal();
    modal.querySelector("#npcHeatAssistClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    const getNpcLive = () => this.streetNpcs.find((row) => Number(row?.id || 0) === id) || null;
    const hintEl = modal.querySelector("#npcHeatAssistHint");
    const setHint = (msg, ok = false) => {
      if (!hintEl) return;
      hintEl.textContent = String(msg || "");
      hintEl.style.color = ok ? "#86efac" : "#fbbf24";
    };

    modal.querySelector("#npcHeatUseMed")?.addEventListener("click", () => {
      const live = getNpcLive();
      if (!live || live.heatState !== "fainted") {
        setHint("El NPC ya no necesita asistencia.");
        return;
      }
      const consumed = !!this.economy?.consumeItem?.(medKey, 1);
      if (!consumed) {
        setHint("No tienes medicina para golpe de calor.");
        return;
      }
      this.clearStreetNpcHeatFaint(live, Date.now(), "medicine");
      close();
    });

    modal.querySelector("#npcHeatSendHome")?.addEventListener("click", () => {
      const live = getNpcLive();
      if (!live || live.heatState !== "fainted") {
        setHint("El NPC ya no necesita asistencia.");
        return;
      }
      this.clearStreetNpcHeatFaint(live, Date.now(), "home");
      close();
    });
  }

  updateStreetNpcEmoteClimateSnapshot(now = Date.now()) {
    const state = this.npcEmoteState;
    if (!state) return;
    if ((now - (Number(state.lastClimateAt) || 0)) < 4200) return;

    try {
      const dateNow = new Date(now);
      const weatherSnap = this.economy?.getLimaWeatherSnapshot?.(dateNow) || null;
      const clockSnap = this.economy?.getHudGameClockSnapshot?.() || null;
      const tempSnap = this.economy?.getLimaTemperatureSnapshot?.(dateNow, clockSnap, weatherSnap) || null;
      const label = String(weatherSnap?.weather || "");
      const temp = Number(tempSnap?.celsius);
      state.weatherLabel = label;
      state.weatherLabelLower = label.toLowerCase();
      state.tempC = Number.isFinite(temp) ? temp : 22;
      state.lastClimateAt = now;
    } catch (_) {
      state.weatherLabel = "";
      state.weatherLabelLower = "";
      state.tempC = 22;
      state.lastClimateAt = now;
    }
  }

  pickStreetNpcEmote(npc, now = Date.now()) {
    const state = this.npcEmoteState || {};
    const wx = String(state.weatherLabelLower || "");
    const temp = Number.isFinite(Number(state.tempC)) ? Number(state.tempC) : 22;
    if (npc?.heatState === "fainted") {
      return { emoji: "🤒", kind: "golpe_calor" };
    }
    const hasStats = this.hasStreetNpcGameplayStats(npc);
    const lifePhase = this.getTrafficLifePhaseKey(now);
    const hourNow = this.getTrafficClockHourFloat(now);
    const isSpecialZoneNpc = this.getStreetNpcEmotePriority(npc) >= 2;
    const thermal = hasStats ? this.getStreetNpcThermalDiscomfort(npc, temp, wx) : null;
    const stressRatio = hasStats
      ? Phaser.Math.Clamp((Number(npc.worldStress) || 0) / 100, 0, 1)
      : 0;
    const climateTeam = hasStats ? String(thermal?.pref?.teamKey || "templado") : "templado";
    const pool = [];
    const push = (emoji, kind, weight = 1) => {
      const n = Math.max(1, Math.round(Number(weight) || 1));
      for (let i = 0; i < n; i++) pool.push({ emoji, kind });
    };
    const pushSet = (arr, kind, weight = 1) => {
      const list = Array.isArray(arr) ? arr : [];
      for (const emo of list) {
        if (!emo) continue;
        push(String(emo), kind, weight);
      }
    };
    const pushRandomFrom = (arr, kind, weight = 1) => {
      const list = Array.isArray(arr) ? arr.filter(Boolean) : [];
      if (!list.length) return;
      const n = Math.max(1, Math.round(Number(weight) || 1));
      for (let i = 0; i < n; i++) {
        const pick = list[Math.floor(Math.random() * list.length)];
        push(String(pick), kind, 1);
      }
    };

    if (temp <= 15) {
      push("\uD83E\uDD76", "frio", 4);
      push("\uD83E\uDD27", "resfrio", 2);
      push("\uD83D\uDE2C", "frio", 2);
    } else if (temp <= 18) {
      push("\uD83E\uDD76", "frio", 2);
    }

    if (temp >= 29) {
      push("\uD83E\uDD75", "calor", 4);
      push("\uD83D\uDE2E", "calor", 2);
    } else if (temp >= 26) {
      push("\uD83E\uDD75", "calor", 2);
    }

    if (/lluvia|garua|llovizna/.test(wx)) {
      push("\u2614", "lluvia", 3);
      push("\uD83D\uDCA7", "lluvia", 2);
      push("\uD83C\uDF27\uFE0F", "lluvia", 2);
    }
    if (/viento/.test(wx)) {
      push("\uD83C\uDF2C", "viento", 2);
    }
    if (/neblina|niebla/.test(wx)) {
      push("\uD83D\uDE36", "neblina", 3);
      push("\uD83C\uDF2B\uFE0F", "neblina", 2);
    }
    if (/calor fuera de temporada|bochorno/.test(wx) || (temp >= 31 && /evento:/.test(wx))) {
      push("\uD83E\uDD12", "enfermo", 3);
    } else if ((temp <= 13 && /evento:/.test(wx)) || /frio/.test(wx)) {
      push("\uD83E\uDD12", "enfermo", 2);
    }

    if (lifePhase === "dia") {
      pushSet(["\uD83D\uDE03", "\uD83D\uDE04", "\uD83D\uDE42", "\uD83D\uDE0E"], "animo", 1);
      pushRandomFrom(["\uD83D\uDEB6", "\uD83D\uDCF1", "\uD83D\uDED2", "\uD83D\uDC4B"], "accion", 2);
    } else if (lifePhase === "tarde") {
      pushSet(["\uD83D\uDE42", "\uD83D\uDE0B", "\uD83D\uDE05", "\uD83D\uDE0C"], "animo", 2);
      pushRandomFrom(["\u2615", "\uD83C\uDF54", "\uD83D\uDEB6", "\uD83C\uDFB5"], "accion", 3);
    } else if (lifePhase === "noche") {
      pushSet(["\uD83D\uDE0C", "\uD83D\uDE10", "\uD83D\uDE09", "\uD83D\uDE0E"], "animo", 2);
      pushRandomFrom(["\uD83D\uDDE3\uFE0F", "\uD83D\uDCE3", "\uD83D\uDCAC", "\uD83D\uDD0A"], "accion", 3);
      pushRandomFrom(["\uD83C\uDFB5", "\u2615", "\uD83C\uDF19"], "accion", 2);
    } else {
      pushSet(["\uD83D\uDE2A", "\uD83D\uDE34", "\uD83D\uDE36", "\uD83D\uDE0C"], "animo", 2);
      pushRandomFrom(["\u2615", "\uD83C\uDF19", "\uD83D\uDC40"], "accion", 2);
    }

    if (!hasStats) {
      if (!pool.length) {
        if (temp >= 27) push("🥵", "calor", 2);
        else if (temp <= 16) push("🥶", "frio", 2);
        else push("😐", "animo", 1);
      }
      return pool[Math.floor(Math.random() * pool.length)] || { emoji: "😐", kind: "animo" };
    }

    const roll = this.sampleTrafficRoutine01(((Number(npc?.id) || 0) * 17.31) + Math.floor(now / 12000));
    if (roll < 0.16) {
      push("\uD83D\uDE16", "estres", 4);
      push("\uD83D\uDCA2", "estres", 2);
    } else if (roll < 0.32) {
      push("\uD83D\uDE13", "estres", 3);
    } else if (roll > 0.86) {
      push("\uD83C\uDF40", "suerte", 4);
      push("\u2728", "suerte", 2);
    } else if (roll > 0.72) {
      push("\uD83D\uDE42", "animo", 3);
    } else {
      push("\uD83D\uDE10", "animo", 2);
    }

    const staminaRatio = hasStats ? this.getStreetNpcStaminaRatio(npc) : 1;
    if (staminaRatio <= 0.22) {
      pushSet(["\uD83D\uDE13", "\uD83D\uDE2A", "\uD83D\uDE34", "\uD83E\uDD71"], "agotado", 2);
    } else if (staminaRatio >= 0.86) {
      pushSet(["\uD83D\uDE04", "\uD83D\uDE03", "\uD83D\uDE0E"], "activo", 1);
    }

    if (isSpecialZoneNpc) {
      pushSet(["\u2728", "\uD83C\uDF1F", "\uD83E\uDD73", "\uD83D\uDE0E"], "especial", 2);
      pushRandomFrom(["\uD83D\uDDE3\uFE0F", "\uD83D\uDCE3", "\uD83D\uDCAC"], "especial", 2);
    }

    if (hourNow >= TRAFFIC_NPC_SLEEP_WINDOW_START_HOUR || hourNow < 4.5) {
      pushSet(["\uD83D\uDE2A", "\uD83D\uDE34", "\u2615"], "noche", 1);
    }

    if (!pool.length) {
      push("\uD83D\uDE42", "animo", 1);
      push("\uD83D\uDE10", "animo", 1);
    }
    return pool[Math.floor(Math.random() * pool.length)] || { emoji: "\uD83D\uDE42", kind: "animo" };
  }

  pickStreetNpcEmoteRich(npc, now = Date.now()) {
    const state = this.npcEmoteState || {};
    const wx = String(state.weatherLabelLower || "");
    const temp = Number.isFinite(Number(state.tempC)) ? Number(state.tempC) : 22;
    if (npc?.heatState === "fainted") {
      return { emoji: "\uD83E\uDD12", kind: "golpe_calor" };
    }

    const hasStats = this.hasStreetNpcGameplayStats(npc);
    const lifePhase = this.getTrafficLifePhaseKey(now);
    const hourNow = this.getTrafficClockHourFloat(now);
    const isSpecialZoneNpc = this.getStreetNpcEmotePriority(npc) >= 2;
    const thermal = hasStats ? this.getStreetNpcThermalDiscomfort(npc, temp, wx) : null;
    const stressRatio = hasStats
      ? Phaser.Math.Clamp((Number(npc.worldStress) || 0) / 100, 0, 1)
      : 0;
    const climateTeam = hasStats ? String(thermal?.pref?.teamKey || "templado") : "templado";
    const pool = [];
    const push = (emoji, kind, weight = 1) => {
      const n = Math.max(1, Math.round(Number(weight) || 1));
      for (let i = 0; i < n; i++) pool.push({ emoji: String(emoji || "?"), kind: String(kind || "animo") });
    };
    const pushSet = (arr, kind, weight = 1) => {
      if (!Array.isArray(arr)) return;
      for (const emo of arr) {
        if (!emo) continue;
        push(emo, kind, weight);
      }
    };
    const pushRandomFrom = (arr, kind, weight = 1) => {
      const list = Array.isArray(arr) ? arr.filter(Boolean) : [];
      if (!list.length) return;
      const n = Math.max(1, Math.round(Number(weight) || 1));
      for (let i = 0; i < n; i++) {
        push(list[Math.floor(Math.random() * list.length)], kind, 1);
      }
    };

    const emojiHeat = ["\uD83E\uDD75", "\uD83E\uDEE0", "\uD83D\uDD25", "\u2600\uFE0F", "\uD83D\uDE13", "\uD83E\uDD2F"];
    const emojiCold = ["\uD83E\uDD76", "\u2744\uFE0F", "\uD83D\uDE2C", "\uD83E\uDD27"];
    const emojiRain = ["\u2614", "\uD83C\uDF27\uFE0F", "\uD83D\uDCA7"];
    const emojiWind = ["\uD83C\uDF2C", "\uD83D\uDE2E\u200D\uD83D\uDCA8"];
    const emojiLove = ["\u2764\uFE0F", "\uD83D\uDE0D", "\uD83D\uDE18", "\uD83D\uDC95", "\uD83D\uDC98"];
    const emojiAngry = ["\uD83D\uDE20", "\uD83D\uDE21", "\uD83E\uDD2C", "\uD83D\uDCA2", "\uD83D\uDC4E", "\uD83D\uDE24"];
    const emojiSigns = ["?", "!", "\u2753", "\u2754", "\u2757", "\u2049\uFE0F"];

    if (thermal?.heat >= 0.56) {
      pushSet(emojiHeat, "calor", 3 + Math.round(thermal.heat * 2));
    } else if (thermal?.heat >= 0.30) {
      pushSet(["🥵", "😮", "😓"], "calor", 2);
    } else if (temp >= 33) {
      pushSet(emojiHeat, "calor", 3);
    } else if (temp >= 29) {
      pushSet(["\uD83E\uDD75", "\uD83D\uDE2E", "\uD83D\uDE13"], "calor", 2);
    } else if (temp >= 25) {
      pushSet(["\uD83D\uDE05", "\uD83D\uDE42"], "calor", 1);
    }
    if (thermal?.cold >= 0.54) {
      pushSet(emojiCold, "frio", 3 + Math.round(thermal.cold * 2));
    } else if (thermal?.cold >= 0.28) {
      pushSet(["🥶", "😬", "😐"], "frio", 2);
    } else if (temp <= 13) {
      pushSet(emojiCold, "frio", 3);
    } else if (temp <= 17) {
      pushSet(["\uD83E\uDD76", "\uD83D\uDE10"], "frio", 2);
    }
    if (climateTeam === "frio" && temp >= 16 && temp <= 22) {
      pushSet(["😌", "🙂", "✨"], "clima_favorito", 2);
    }

    if (/lluvia|garua|llovizna/.test(wx)) pushSet(emojiRain, "lluvia", 3);
    if (/viento/.test(wx)) pushSet(emojiWind, "viento", 2);
    if (/neblina|niebla/.test(wx)) pushSet(["\uD83C\uDF2B\uFE0F", "\uD83D\uDE36", "\uD83D\uDC40"], "neblina", 2);
    if (/evento:/.test(wx)) pushSet(["\u26A0\uFE0F", "\uD83D\uDE2E", "\u2757"], "evento", 2);
    if (/bochorno|calor fuera de temporada/.test(wx)) pushSet(["\uD83E\uDD12", "\uD83D\uDE35\u200D\uD83D\uDCAB"], "enfermo", 2);

    if (lifePhase === "dia") {
      pushSet(["\uD83D\uDE03", "\uD83D\uDE04", "\uD83D\uDE42", "\uD83D\uDE0E"], "animo", 2);
      pushRandomFrom(["\uD83D\uDEB6", "\uD83D\uDCF1", "\uD83D\uDED2", "\uD83D\uDC4B", "\uD83C\uDF7D\uFE0F"], "accion", 3);
    } else if (lifePhase === "tarde") {
      pushSet(["\uD83D\uDE0B", "\uD83D\uDE0C", "\uD83D\uDE05", "\uD83D\uDE42"], "animo", 2);
      pushRandomFrom(["\u2615", "\uD83C\uDF54", "\uD83C\uDF55", "\uD83D\uDEB6", "\uD83C\uDFB5"], "accion", 3);
    } else if (lifePhase === "noche") {
      pushSet(["\uD83D\uDE09", "\uD83D\uDE0E", "\uD83D\uDE10", "\uD83D\uDE0C"], "animo", 2);
      pushRandomFrom(["\uD83D\uDCE3", "\uD83D\uDDE3\uFE0F", "\uD83D\uDCAC", "\uD83D\uDD0A", "\u2615"], "accion", 3);
    } else {
      pushSet(["\uD83D\uDE2A", "\uD83D\uDE34", "\uD83D\uDE36", "\uD83C\uDF19"], "animo", 2);
      pushRandomFrom(["\u2615", "\uD83D\uDC40", "\uD83D\uDE2E", "\uD83D\uDE34"], "accion", 2);
    }

    const moodRoll = this.sampleTrafficRoutine01(((Number(npc?.id) || 0) * 17.31) + Math.floor(now / 9000));
    if (moodRoll < 0.14) {
      pushSet(emojiAngry, "enojo", 3);
      pushSet(["\uD83D\uDE44", "\uD83D\uDE12"], "insulto", 2);
    } else if (moodRoll < 0.28) {
      pushSet(["\uD83D\uDE13", "\uD83D\uDE2A", "\uD83D\uDE34", "\uD83E\uDD71"], "cansancio", 2);
    } else if (moodRoll > 0.88) {
      pushSet(emojiLove, "amor", 2);
      pushSet(["\uD83E\uDD73", "\u2728", "\uD83C\uDF1F"], "alegria", 1);
    } else if (moodRoll > 0.74) {
      pushSet(["\uD83D\uDE01", "\uD83D\uDE06", "\uD83D\uDE0A"], "alegria", 2);
    } else {
      pushSet(["\uD83D\uDE10", "\uD83E\uDD14", "\uD83D\uDE42"], "animo", 1);
    }
    if (stressRatio >= 0.60) {
      const stressWeight = 2 + Math.round(stressRatio * 3);
      pushSet(emojiAngry, "enojo", stressWeight);
      pushSet(["!", "❗", "⁉️"], "signo", Math.max(2, stressWeight - 1));
      pushSet(["😤", "😡", "💢"], "estres", stressWeight);
    } else if (stressRatio <= 0.20 && (Number(thermal?.discomfort) || 0) <= 0.20) {
      pushSet(["😊", "😌", "🙂"], "calma", 2);
    }

    const talkRoll = this.sampleTrafficRoutine01(((Number(npc?.id) || 0) * 8.51) + Math.floor(now / 7000));
    if (talkRoll < 0.24) pushSet(emojiSigns, "signo", 2);
    else if (talkRoll > 0.82) pushSet(["\uD83D\uDCE2", "\uD83D\uDDE3\uFE0F", "\uD83D\uDCAC"], "habla", 2);

    if (hasStats) {
      const staminaRatio = this.getStreetNpcStaminaRatio(npc);
      if (staminaRatio <= 0.22) pushSet(["\uD83D\uDE2A", "\uD83D\uDE34", "\uD83D\uDE13"], "agotado", 3);
      else if (staminaRatio >= 0.86) pushSet(["\uD83D\uDE03", "\uD83D\uDE04", "\uD83D\uDE0E"], "activo", 2);
      if ((Number(thermal?.heat) || 0) >= 0.50) {
        pushSet(["😡", "😤", "💢"], "enojo_calor", 3);
      }
    } else {
      pushSet(["\uD83D\uDE42", "\uD83D\uDE10", "\uD83D\uDE0C"], "animo", 1);
    }

    if (isSpecialZoneNpc) {
      pushSet(["\u2728", "\uD83C\uDF1F", "\uD83E\uDD73", "\uD83D\uDE0E", "\uD83D\uDC51"], "especial", 3);
      pushRandomFrom(["\uD83D\uDCE3", "\uD83D\uDDE3\uFE0F", "\uD83D\uDCAC"], "especial", 2);
    }

    if (hourNow >= TRAFFIC_NPC_SLEEP_WINDOW_START_HOUR || hourNow < 4.5) {
      pushSet(["\uD83D\uDE2A", "\uD83D\uDE34", "\u2615", "\uD83C\uDF19"], "noche", 1);
    }

    if (!pool.length) {
      pushSet(["\uD83D\uDE42", "\uD83D\uDE10", "\u2753"], "animo", 1);
    }
    return pool[Math.floor(Math.random() * pool.length)] || { emoji: "\uD83D\uDE42", kind: "animo" };
  }

  createStreetNpcEmoteVisual(pick = "\uD83D\uDE42") {
    const src = (pick && typeof pick === "object")
      ? pick
      : { emoji: pick };
    const emoji = String(src?.emoji || "\uD83D\uDE42");
    const textureKey = String(src?.textureKey || "").trim();
    const iconSize = Phaser.Math.Clamp(Math.round(Number(src?.iconSize) || 15), 10, 26);
    const container = this.add.container(0, 0).setDepth(31).setAlpha(0);
    const bubble = this.add.graphics();
    bubble.fillStyle(0x0b1220, 0.86);
    bubble.lineStyle(1.2, 0xe2e8f0, 0.72);
    bubble.fillRoundedRect(-15, -18, 30, 23, 8);
    bubble.strokeRoundedRect(-15, -18, 30, 23, 8);
    bubble.fillTriangle(-5, 5, 0, 11, 5, 5);
    let iconNode;
    if (textureKey && this.textures?.exists?.(textureKey)) {
      iconNode = this.add.image(0, -6, textureKey)
        .setOrigin(0.5, 0.5)
        .setDisplaySize(iconSize, iconSize);
    } else {
      iconNode = this.add.text(0, -6, emoji, {
        fontFamily: "\"Segoe UI Emoji\", \"Apple Color Emoji\", \"Noto Color Emoji\", Arial",
        fontSize: "14px",
        color: "#f8fafc"
      }).setOrigin(0.5, 0.5);
    }
    container.add([bubble, iconNode]);
    this.uiCam.ignore([container, bubble, iconNode]);
    return { container, bubble, text: iconNode };
  }

  destroyStreetNpcEmote(entry) {
    if (!entry) return;
    if (entry.npc && entry.npc.activeEmoteId === entry.id) {
      entry.npc.activeEmoteId = 0;
    }
    entry.container?.destroy();
  }

  clearStreetNpcEmoteForNpc(npc) {
    if (!npc) return;
    const state = this.npcEmoteState;
    if (!state || !Array.isArray(state.active) || !state.active.length) {
      npc.activeEmoteId = 0;
      return;
    }
    for (let i = state.active.length - 1; i >= 0; i--) {
      const e = state.active[i];
      if (!e || Number(e.npcId) !== Number(npc.id)) continue;
      this.destroyStreetNpcEmote(e);
      state.active.splice(i, 1);
    }
    npc.activeEmoteId = 0;
  }

  updateStreetNpcEmoteEntries(now = Date.now()) {
    const state = this.npcEmoteState;
    if (!state || !Array.isArray(state.active) || !state.active.length) return;

    for (let i = state.active.length - 1; i >= 0; i--) {
      const e = state.active[i];
      if (!e?.container?.active || !e?.npc?.sprite?.active) {
        this.destroyStreetNpcEmote(e);
        state.active.splice(i, 1);
        continue;
      }

      const age = now - (Number(e.startAt) || now);
      const duration = Math.max(500, Number(e.durationMs) || TRAFFIC_NPC_EMOTE_DURATION_MS);
      if (age >= duration) {
        this.destroyStreetNpcEmote(e);
        state.active.splice(i, 1);
        continue;
      }

      const t = Phaser.Math.Clamp(age / duration, 0, 1);
      const rise = (Number(e.risePx) || TRAFFIC_NPC_EMOTE_FLOAT_PX) * Phaser.Math.Easing.Cubic.Out(t);
      const fadeInMs = Number(e.fadeInMs) || 180;
      const fadeOutMs = Number(e.fadeOutMs) || 260;
      let alpha = 1;
      if (age <= fadeInMs) alpha = Phaser.Math.Clamp(age / fadeInMs, 0, 1);
      else if (age >= (duration - fadeOutMs)) alpha = Phaser.Math.Clamp((duration - age) / fadeOutMs, 0, 1);

      const camAlphaRaw = Number(e.npc.cameraFadeAlpha);
      const npcCamAlpha = Phaser.Math.Clamp(Number.isFinite(camAlphaRaw) ? camAlphaRaw : 1, 0, 1);
      const baseX = Number.isFinite(e.npc.screenX) ? e.npc.screenX : e.npc.sprite.x;
      const baseY = Number.isFinite(e.npc.screenY) ? e.npc.screenY : e.npc.sprite.y;
      const x = baseX + (Number(e.driftX) || 0);
      const y = baseY - 16 - rise;
      e.container.setPosition(Math.round(x), Math.round(y));
      e.container.setDepth((Number(e.npc.sprite.depth) || 30.5) + 0.08);
      e.container.setAlpha(alpha * npcCamAlpha);
      const scl = 0.96 + (0.06 * Math.sin((t * Math.PI) * 0.9));
      e.container.setScale(scl, scl);
    }
  }

  spawnStreetNpcEmote(npc, now = Date.now(), forcedPick = null) {
    if (!npc?.sprite?.active) return false;
    const state = this.npcEmoteState;
    if (!state) return false;
    const isForced = !!(forcedPick && typeof forcedPick === "object");
    if (!isForced && Array.isArray(state.active) && state.active.length >= TRAFFIC_NPC_EMOTE_MAX_VISIBLE) return false;
    if (isForced && npc.activeEmoteId) this.clearStreetNpcEmoteForNpc(npc);
    if (!isForced && npc.activeEmoteId) return false;

    let pick = isForced
      ? forcedPick
      : this.pickStreetNpcEmoteRich(npc, now);
    if (!forcedPick && npc.lastEmoteEmoji) {
      const prev = String(npc.lastEmoteEmoji);
      let attempts = 0;
      while (attempts < 4 && String(pick?.emoji || "") === prev) {
        pick = this.pickStreetNpcEmoteRich(npc, now + (attempts + 1) * 197);
        attempts++;
      }
    }
    const visual = this.createStreetNpcEmoteVisual(pick || { emoji: "\uD83D\uDE42" });
    const id = Math.max(1, Number(state.nextId) || 1);
    state.nextId = id + 1;
    const entry = {
      id,
      npcId: Number(npc.id) || 0,
      npc,
      kind: String(pick?.kind || "animo"),
      container: visual.container,
      startAt: now,
      durationMs: Math.max(500, Number(pick?.durationMs) || (TRAFFIC_NPC_EMOTE_DURATION_MS + Phaser.Math.Between(-240, 360))),
      fadeInMs: 180,
      fadeOutMs: 260,
      risePx: Math.max(8, Number(pick?.risePx) || (TRAFFIC_NPC_EMOTE_FLOAT_PX + Phaser.Math.Between(-2, 6))),
      driftX: Phaser.Math.Between(-7, 7)
    };
    if (!Array.isArray(state.active)) state.active = [];
    state.active.push(entry);
    npc.activeEmoteId = id;
    npc.lastEmoteEmoji = String(pick?.emoji || pick?.textureKey || "\uD83D\uDE42");
    npc.lastEmoteKind = String(pick?.kind || "animo");
    npc.nextEmoteAt = now + Phaser.Math.Between(TRAFFIC_NPC_EMOTE_REPEAT_MIN_MS, TRAFFIC_NPC_EMOTE_REPEAT_MAX_MS);
    return true;
  }

  trySpawnStreetNpcEmote(now = Date.now()) {
    const state = this.npcEmoteState;
    if (!state) return false;
    if (Array.isArray(state.active) && state.active.length >= TRAFFIC_NPC_EMOTE_MAX_VISIBLE) return false;

    const view = this.worldCam?.worldView;
    const candidates = [];
    let highestPriority = -1;
    let hasVisibleSpecialNpc = false;

    for (const npc of this.streetNpcs) {
      if (!npc?.sprite?.active) continue;
      if (!npc.sprite.visible) continue;
      if (npc.activeEmoteId) continue;
      if ((npc.introUntil || 0) > now) continue;
      if (npc.shopState === "inside" || npc.homeState === "home_sleeping" || npc.homeState === "home_entering") continue;
      const camAlphaRaw = Number(npc.cameraFadeAlpha);
      if (Phaser.Math.Clamp(Number.isFinite(camAlphaRaw) ? camAlphaRaw : 1, 0, 1) < 0.72) continue;

      const x = Number.isFinite(npc.screenX) ? npc.screenX : npc.sprite.x;
      const y = Number.isFinite(npc.screenY) ? npc.screenY : npc.sprite.y;
      if (view) {
        const margin = 36;
        if (x < (view.x - margin) || x > (view.x + view.width + margin) || y < (view.y - margin) || y > (view.y + view.height + margin)) {
          continue;
        }
      }

      const priority = this.getStreetNpcEmotePriority(npc);
      if (priority >= 2) hasVisibleSpecialNpc = true;
      if (now < (Number(npc.nextEmoteAt) || 0)) continue;
      highestPriority = Math.max(highestPriority, priority);
      candidates.push({ npc, priority });
    }

    if (!candidates.length) return false;
    const sourcePool = hasVisibleSpecialNpc
      ? candidates.filter((row) => row.priority >= 2)
      : candidates;
    if (!sourcePool.length) return false;
    if (hasVisibleSpecialNpc) {
      highestPriority = Math.max(...sourcePool.map((row) => row.priority));
    }
    const priorityPool = sourcePool.filter((row) => row.priority === highestPriority);
    if (!priorityPool.length) return false;
    const chosen = Phaser.Utils.Array.GetRandom(priorityPool);
    if (!chosen?.npc) return false;
    return this.spawnStreetNpcEmote(chosen.npc, now);
  }

  updateNpcEmotes(_deltaMs = 16) {
    const state = this.npcEmoteState;
    if (!state) return;
    const now = Date.now();

    this.updateStreetNpcEmoteClimateSnapshot(now);
    this.updateStreetNpcEmoteEntries(now);

    if (!Number.isFinite(state.nextSpawnAt)) {
      state.nextSpawnAt = now + Phaser.Math.Between(TRAFFIC_NPC_EMOTE_SPAWN_MIN_MS, TRAFFIC_NPC_EMOTE_SPAWN_MAX_MS);
      return;
    }
    if (now < state.nextSpawnAt) return;

    this.trySpawnStreetNpcEmote(now);
    state.nextSpawnAt = now + Phaser.Math.Between(TRAFFIC_NPC_EMOTE_SPAWN_MIN_MS, TRAFFIC_NPC_EMOTE_SPAWN_MAX_MS);
  }

  removeStreetNpcAt(index, fadeMs = 160) {
    if (index < 0 || index >= this.streetNpcs.length) return false;
    const npc = this.streetNpcs[index];
    this.clearStreetNpcEmoteForNpc(npc);
    const sprite = npc?.sprite || null;
    this.streetNpcs.splice(index, 1);
    if (!sprite?.active) return true;
    if (fadeMs > 0) {
      this.tweens.add({
        targets: sprite,
        alpha: 0,
        duration: fadeMs,
        ease: "Quad.In",
        onComplete: () => sprite.destroy()
      });
      return true;
    }
    sprite.destroy();
    return true;
  }

  removeStreetNpcsForBuilding(idOrBuilding, spawnSource = null) {
    const buildingId = (typeof idOrBuilding === "object")
      ? Number(idOrBuilding?.id || 0)
      : Number(idOrBuilding || 0);
    if (!Number.isFinite(buildingId) || buildingId <= 0) return 0;

    let removed = 0;
    for (let i = this.streetNpcs.length - 1; i >= 0; i--) {
      const npc = this.streetNpcs[i];
      if ((Number(npc?.homeBuildingId) || 0) !== buildingId) continue;
      if (spawnSource && npc?.spawnSource !== spawnSource) continue;
      this.removeStreetNpcAt(i);
      removed++;
    }
    return removed;
  }

  spawnStreetNpcFromCar(car) {
    if (!car?.targetRoad) return;

    const now = Date.now();
    const spawnPlan = this.prepareStreetNpcSpawnPlan(car.targetRoad);
    if (!spawnPlan.ok) return;

    const baseColor = Phaser.Utils.Array.GetRandom(TRAFFIC_NPC_BASE_COLORS) || 0xf8fafc;
    const visual = this.createStreetNpcVisual({ baseColor });
    const sprite = visual.sprite;
    const spawnRoamGraceMs = this.getStreetNpcRoamGraceMs(now, "spawn");
    const spawnShopGraceMs = Math.max(2800, Math.round(spawnRoamGraceMs * 0.72));

    const npc = {
      id: this.nextStreetNpcId++,
      sprite,
      spriteBody: visual.body,
      spriteLabel: visual.label,
      baseColor,
      isBackFacing: false,
      r: car.targetRoad.r,
      c: car.targetRoad.c,
      path: null,
      pathIndex: 0,
      progress: 0,
      speed: TRAFFIC_NPC_SPEED_TILES,
      dirR: 0,
      dirC: 1,
      dirVisualR: 0,
      dirVisualC: 1,
      side: Math.random() < 0.5 ? -1 : 1,
      sideTarget: 0,
      sideVisual: 0,
      waitUntil: 0,
      nextPathAt: now + Phaser.Math.Between(spawnPlan.overflowTargetRoad ? 60 : 200, spawnPlan.overflowTargetRoad ? 180 : 800),
      homeBuildingId: car.targetHouseId,
      spawnSource: "delivery",
      overflowTargetRoad: spawnPlan.overflowTargetRoad ? { r: spawnPlan.overflowTargetRoad.r, c: spawnPlan.overflowTargetRoad.c } : null,
      sideSwitchStartAt: 0,
      lastMoveAt: Date.now(),
      lastMoveR: car.targetRoad.r,
      lastMoveC: car.targetRoad.c,
      offRoadSince: 0,
      turnPauseUntil: 0,
      turnPauseR: car.targetRoad.r,
      turnPauseC: car.targetRoad.c,
      npcRarity: 0,
      isSpecialNpc: false,
      isResidentNpc: false,
      nextEmoteAt: now + Phaser.Math.Between(2200, 7000),
      activeEmoteId: 0,
      nextShopTryAt: now + spawnShopGraceMs,
      noShopEnterUntil: now + spawnShopGraceMs,
      noHomeReturnUntil: now + spawnRoamGraceMs,
      nextLifeBreakAt: 0,
      homeIntent: "",
      homeReason: "",
      homeMealExitAt: 0,
      lastShopYapaDrop: 0
    };
    npc.sideTarget = npc.side;
    npc.sideVisual = npc.side;

    this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
    this.scheduleNextStreetNpcLifeBreak(npc, now, "spawn");
    this.streetNpcs.push(npc);

    this.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: 220,
      ease: "Quad.Out"
    });
  }

  getRoadSpawnCellNearBuilding(b) {
    if (!b?.cells?.length) return null;
    const center = this.getBuildingGridCenter(b) || b.cells[0];
    const priorityDirs = this.getHouseSpawnDirectionPriority(b.typeKey, b.rotationStep || 0);
    let minR = Infinity;
    let maxR = -Infinity;
    let minC = Infinity;
    let maxC = -Infinity;
    for (const cell of b.cells) {
      const rr = Number(cell?.r);
      const cc = Number(cell?.c);
      if (!Number.isFinite(rr) || !Number.isFinite(cc)) continue;
      minR = Math.min(minR, rr);
      maxR = Math.max(maxR, rr);
      minC = Math.min(minC, cc);
      maxC = Math.max(maxC, cc);
    }
    if (!Number.isFinite(minR) || !Number.isFinite(minC) || !Number.isFinite(maxR) || !Number.isFinite(maxC)) {
      return this.getNearestRoadCellToPoint(center.r, center.c);
    }

    const pickClosestToCenter = (cells) => {
      let best = null;
      let bestD2 = Infinity;
      for (const cell of cells) {
        const dr = (Number(cell?.r) || 0) - Number(center.r || 0);
        const dc = (Number(cell?.c) || 0) - Number(center.c || 0);
        const d2 = (dr * dr) + (dc * dc);
        if (d2 < bestD2) {
          bestD2 = d2;
          best = { r: Math.round(Number(cell.r) || 0), c: Math.round(Number(cell.c) || 0) };
        }
      }
      return best;
    };

    const collectFacingSideRoads = (dir) => {
      const dr = Math.sign(Number(dir?.dr) || 0);
      const dc = Math.sign(Number(dir?.dc) || 0);
      const out = [];
      if (dr === 0 && dc === 1) {
        const cc = maxC + 1;
        for (let rr = minR; rr <= maxR; rr++) {
          if (inBounds(rr, cc) && this.isRoadCell(rr, cc)) out.push({ r: rr, c: cc });
        }
        return out;
      }
      if (dr === 1 && dc === 0) {
        const rr = maxR + 1;
        for (let cc = minC; cc <= maxC; cc++) {
          if (inBounds(rr, cc) && this.isRoadCell(rr, cc)) out.push({ r: rr, c: cc });
        }
        return out;
      }
      if (dr === 0 && dc === -1) {
        const cc = minC - 1;
        for (let rr = minR; rr <= maxR; rr++) {
          if (inBounds(rr, cc) && this.isRoadCell(rr, cc)) out.push({ r: rr, c: cc });
        }
        return out;
      }
      if (dr === -1 && dc === 0) {
        const rr = minR - 1;
        for (let cc = minC; cc <= maxC; cc++) {
          if (inBounds(rr, cc) && this.isRoadCell(rr, cc)) out.push({ r: rr, c: cc });
        }
        return out;
      }
      return out;
    };

    // 1) prioridad absoluta: lado segun rotacion del PNG
    for (const d of priorityDirs) {
      const sideRoads = collectFacingSideRoads(d);
      if (sideRoads.length) {
        const pick = pickClosestToCenter(sideRoads);
        if (pick) return pick;
      }
    }

    // 2) fallback: cualquier borde de la casa que toque pista, minimizando distancia al centro
    const dirs = [
      { dr: -1, dc: 0 },
      { dr: 1, dc: 0 },
      { dr: 0, dc: -1 },
      { dr: 0, dc: 1 }
    ];
    let best = null;
    let bestD2 = Infinity;
    for (const cell of b.cells) {
      for (const d of dirs) {
        const rr = cell.r + d.dr;
        const cc = cell.c + d.dc;
        if (!inBounds(rr, cc) || !this.isRoadCell(rr, cc)) continue;
        const dr = rr - center.r;
        const dc = cc - center.c;
        const d2 = (dr * dr) + (dc * dc);
        if (d2 < bestD2) {
          bestD2 = d2;
          best = { r: rr, c: cc };
        }
      }
    }

    if (best) return best;
    return this.getNearestRoadCellToPoint(center.r, center.c);
  }

  spawnStreetNpcFromHouse(b, now = Date.now()) {
    if (!b || !this.isDecorativeHouse(b.typeKey) || !b.isBuilt) return false;
    if (b.residentNpcSpawned) return false;

    const targetRoad = this.getRoadSpawnCellNearBuilding(b);
    if (!targetRoad) return false;
    const spawnPlan = this.prepareStreetNpcSpawnPlan(targetRoad);
    if (!spawnPlan.ok) return false;

    const baseColor = Phaser.Utils.Array.GetRandom(TRAFFIC_NPC_BASE_COLORS) || 0xf8fafc;
    const visual = this.createStreetNpcVisual({ baseColor });
    const sprite = visual.sprite;

    const center = this.getBuildingGridCenter(b) || b.cells?.[0] || targetRoad;
    const face = this.getHouseSpawnFacing(b.typeKey, b.rotationStep || 0);
    let faceR = face.dr;
    let faceC = face.dc;
    if (!faceR && !faceC) {
      faceR = Math.sign(targetRoad.r - center.r);
      faceC = Math.sign(targetRoad.c - center.c);
      if (!faceR && !faceC) {
        faceR = 0;
        faceC = 1;
      }
    }

    const roadP = isoToScreen(targetRoad.r, targetRoad.c);
    const houseP = isoToScreen(center.r, center.c);
    const introLerp = 0.36;
    const introX = Math.round(Phaser.Math.Linear(roadP.x, houseP.x, introLerp));
    const introY = Math.round(Phaser.Math.Linear(roadP.y + (TILE_H * 0.20), houseP.y + (TILE_H * 0.18), introLerp));
    const introDuration = 520;
    const spawnRoamGraceMs = this.getStreetNpcRoamGraceMs(now, "spawn");
    const spawnShopGraceMs = Math.max(3200, Math.round(spawnRoamGraceMs * 0.74));

    const npc = {
      id: this.nextStreetNpcId++,
      sprite,
      spriteBody: visual.body,
      spriteLabel: visual.label,
      baseColor,
      isBackFacing: false,
      r: targetRoad.r,
      c: targetRoad.c,
      path: null,
      pathIndex: 0,
      progress: 0,
      speed: TRAFFIC_NPC_SPEED_TILES,
      dirR: faceR,
      dirC: faceC,
      dirVisualR: faceR,
      dirVisualC: faceC,
      side: Math.random() < 0.5 ? -1 : 1,
      sideTarget: 0,
      sideVisual: 0,
      waitUntil: 0,
      nextPathAt: now + introDuration + Phaser.Math.Between(spawnPlan.overflowTargetRoad ? 60 : 320, spawnPlan.overflowTargetRoad ? 180 : 900),
      homeBuildingId: b.id,
      spawnSource: "decor",
      overflowTargetRoad: spawnPlan.overflowTargetRoad ? { r: spawnPlan.overflowTargetRoad.r, c: spawnPlan.overflowTargetRoad.c } : null,
      sideSwitchStartAt: 0,
      lastMoveAt: now,
      lastMoveR: targetRoad.r,
      lastMoveC: targetRoad.c,
      offRoadSince: 0,
      turnPauseUntil: 0,
      turnPauseR: targetRoad.r,
      turnPauseC: targetRoad.c,
      introUntil: now + introDuration,
      introX,
      introY,
      screenX: introX,
      screenY: introY,
      npcRarity: 0,
      isSpecialNpc: false,
      isResidentNpc: false,
      nextEmoteAt: now + introDuration + Phaser.Math.Between(2500, 7800),
      activeEmoteId: 0,
      nextShopTryAt: now + spawnShopGraceMs,
      noShopEnterUntil: now + spawnShopGraceMs,
      noHomeReturnUntil: now + spawnRoamGraceMs,
      nextLifeBreakAt: 0,
      homeIntent: "",
      homeReason: "",
      homeMealExitAt: 0,
      lastShopYapaDrop: 0
    };
    npc.sideTarget = npc.side;
    npc.sideVisual = npc.side;

    const facingScreenDy = (npc.dirVisualR + npc.dirVisualC) * (TILE_H * 0.5);
    npc.isBackFacing = facingScreenDy < -0.01;
    this.setStreetNpcFillColor(npc, npc.isBackFacing);
    sprite.setPosition(introX, introY);
    sprite.setDepth(30.18 + (introY * 0.01));

    this.scheduleNextStreetNpcLifeBreak(npc, now, "spawn");
    this.streetNpcs.push(npc);
    b.residentNpcSpawned = true;

    this.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: introDuration,
      ease: "Quad.Out"
    });
    return true;
  }

  spawnStreetNpcFromResidentBuilding(b, slotIndex, now = Date.now()) {
    if (!b || !this.isNpcResidenceBuilding(b.typeKey) || !b.isBuilt) return false;

    const slots = this.ensureResidentNpcSlotsForBuilding(b);
    const idx = Math.max(0, Math.min(slots.length - 1, Math.round(Number(slotIndex) || 0)));
    const entry = slots[idx];
    const npcKey = String(entry?.key || "").trim();
    if (!npcKey.startsWith("npc_")) return false;
    const npcEvoLevel = Math.max(
      0,
      Math.min(
        5,
        Math.round(
          Number.isFinite(Number(entry?.evo))
            ? Number(entry.evo)
            : this.getNpcEvolutionLevelForKey(npcKey)
        )
      )
    );

    const existing = this.streetNpcs.some((npc) =>
      npc?.spawnSource === "conera"
      && Number(npc.homeBuildingId) === Number(b.id)
      && Number(npc.residentSlotIndex) === idx
      && String(npc.residentNpcKey || "") === npcKey
    );
    if (existing) return true;

    const targetRoad = this.getRoadSpawnCellNearBuilding(b);
    if (!targetRoad) return false;
    const spawnPlan = this.prepareStreetNpcSpawnPlan(targetRoad);
    if (!spawnPlan.ok) return false;

    const center = this.getBuildingGridCenter(b) || b.cells?.[0] || targetRoad;
    const face = this.getHouseSpawnFacing(b.typeKey, b.rotationStep || 0);
    let faceR = face.dr;
    let faceC = face.dc;
    if (!faceR && !faceC) {
      faceR = Math.sign(targetRoad.r - center.r);
      faceC = Math.sign(targetRoad.c - center.c);
      if (!faceR && !faceC) {
        faceR = 0;
        faceC = 1;
      }
    }

    const meta = this.getNpcWorldVisualMeta(npcKey);
    const npcRarity = this.getNpcRarityForKey(npcKey);
    const visual = this.createStreetNpcVisual(meta);
    const sprite = visual.sprite;
    const roadP = isoToScreen(targetRoad.r, targetRoad.c);
    const houseP = isoToScreen(center.r, center.c);
    const introLerp = 0.42;
    const introX = Math.round(Phaser.Math.Linear(roadP.x, houseP.x, introLerp));
    const introY = Math.round(Phaser.Math.Linear(roadP.y + (TILE_H * 0.20), houseP.y + (TILE_H * 0.18), introLerp));
    const introDuration = 420 + Phaser.Math.Between(0, 120);
    const spawnRoamGraceMs = this.getStreetNpcRoamGraceMs(now, "spawn");
    const spawnShopGraceMs = Math.max(3400, Math.round(spawnRoamGraceMs * 0.76));

    const npc = {
      id: this.nextStreetNpcId++,
      sprite,
      spriteBody: visual.body,
      spriteLabel: visual.label,
      baseColor: meta.baseColor,
      isBackFacing: false,
      r: targetRoad.r,
      c: targetRoad.c,
      path: null,
      pathIndex: 0,
      progress: 0,
      speed: TRAFFIC_NPC_SPEED_TILES,
      dirR: faceR,
      dirC: faceC,
      dirVisualR: faceR,
      dirVisualC: faceC,
      side: Math.random() < 0.5 ? -1 : 1,
      sideTarget: 0,
      sideVisual: 0,
      waitUntil: 0,
      nextPathAt: now + introDuration + Phaser.Math.Between(spawnPlan.overflowTargetRoad ? 60 : 280, spawnPlan.overflowTargetRoad ? 180 : 900),
      homeBuildingId: b.id,
      spawnSource: "conera",
      overflowTargetRoad: spawnPlan.overflowTargetRoad ? { r: spawnPlan.overflowTargetRoad.r, c: spawnPlan.overflowTargetRoad.c } : null,
      residentSlotIndex: idx,
      residentNpcKey: npcKey,
      npcEvolutionLevel: npcEvoLevel,
      sideSwitchStartAt: 0,
      lastMoveAt: now,
      lastMoveR: targetRoad.r,
      lastMoveC: targetRoad.c,
      offRoadSince: 0,
      turnPauseUntil: 0,
      turnPauseR: targetRoad.r,
      turnPauseC: targetRoad.c,
      introUntil: now + introDuration,
      introX,
      introY,
      screenX: introX,
      screenY: introY,
      npcRarity,
      isSpecialNpc: npcRarity >= 4,
      isResidentNpc: true,
      nextEmoteAt: now + introDuration + Phaser.Math.Between(1800, 6400),
      activeEmoteId: 0,
      nextShopTryAt: now + spawnShopGraceMs,
      noShopEnterUntil: now + spawnShopGraceMs,
      noHomeReturnUntil: now + spawnRoamGraceMs,
      nextLifeBreakAt: 0,
      homeIntent: "",
      homeReason: "",
      homeMealExitAt: 0,
      lastShopYapaDrop: 0,
      worldStaminaCap: 0,
      worldStamina: 0,
      worldBodyTempC: 36.6,
      worldStress: 12,
      climatePreferenceKey: "",
      climateHeatStress: 0,
      climateColdStress: 0,
      climateDiscomfort: 0,
      heatZeroSince: 0,
      heatState: "",
      heatRecoverAt: 0,
      nextHeatRefreshTryAt: now + Phaser.Math.Between(TRAFFIC_NPC_HEAT_REFRESH_RETRY_MIN_MS, TRAFFIC_NPC_HEAT_REFRESH_RETRY_MAX_MS),
      fastHomeRecoverUntil: 0
    };
    npc.worldStaminaCap = this.getStreetNpcStaminaCap(npc);
    npc.worldStamina = Number(npc.worldStaminaCap) || 0;
    npc.sideTarget = npc.side;
    npc.sideVisual = npc.side;
    const kotoriPlan = this.getKotoriNpcDailyPlan(npc, now);
    if (kotoriPlan) {
      this.ensureStreetNpcSleepSchedule(npc, now);
      this.applyKotoriWakeDebuffs(npc, kotoriPlan, now);
    }

    const facingScreenDy = (npc.dirVisualR + npc.dirVisualC) * (TILE_H * 0.5);
    npc.isBackFacing = facingScreenDy < -0.01;
    this.setStreetNpcFillColor(npc, npc.isBackFacing);
    sprite.setPosition(introX, introY);
    sprite.setDepth(30.18 + (introY * 0.01));

    this.scheduleNextStreetNpcLifeBreak(npc, now, "spawn");
    this.streetNpcs.push(npc);
    this.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: introDuration,
      ease: "Quad.Out"
    });
    return true;
  }

  finishTrafficCar(index, car, now = Date.now()) {
    const home = buildings.get(car.targetHouseId);
    if (home && home.isBuilt) {
      this.spawnStreetNpcFromCar(car);
    }

    const spr = car.sprite;
    this.trafficCars.splice(index, 1);
    this.tweens.add({
      targets: spr,
      alpha: 0,
      duration: 260,
      ease: "Quad.In",
      onComplete: () => spr.destroy()
    });
  }

  updateTrafficCars(now = Date.now(), deltaMs = 16) {
    for (let i = this.trafficCars.length - 1; i >= 0; i--) {
      const car = this.trafficCars[i];
      if (!car?.sprite?.active) {
        this.trafficCars.splice(i, 1);
        continue;
      }

      const lastIndex = car.path.length - 1;
      if (car.pathIndex >= lastIndex) {
        if (now >= (car.holdUntil || 0)) {
          this.finishTrafficCar(i, car, now);
        } else {
          this.setTrafficCarScreenPosition(car, car.r, car.c, car.dirR || 0, car.dirC || 0);
        }
        continue;
      }

      car.progress += (car.speed * deltaMs) / 1000;
      while (car.progress >= 1 && car.pathIndex < lastIndex) {
        car.progress -= 1;
        car.pathIndex++;
      }

      if (car.pathIndex >= lastIndex) {
        const end = car.path[lastIndex];
        this.setTrafficCarScreenPosition(car, end.r, end.c, car.dirR || 0, car.dirC || 0);
        if (now >= (car.holdUntil || 0)) {
          this.finishTrafficCar(i, car, now);
        }
        continue;
      }

      const from = car.path[car.pathIndex];
      const to = car.path[car.pathIndex + 1];
      const dirR = to.r - from.r;
      const dirC = to.c - from.c;
      car.dirR = dirR;
      car.dirC = dirC;
      const r = from.r + (dirR * car.progress);
      const c = from.c + (dirC * car.progress);
      this.setTrafficCarScreenPosition(car, r, c, dirR, dirC);
    }
  }

  updateStreetNpcs(now = Date.now(), deltaMs = 16) {
    const dtMs = Math.max(0, Math.min(90, Number(deltaMs) || 16));
    this.updateStreetNpcEmoteClimateSnapshot(now);
    for (let i = this.streetNpcs.length - 1; i >= 0; i--) {
      const npc = this.streetNpcs[i];
      if (!npc?.sprite?.active) {
        this.streetNpcs.splice(i, 1);
        continue;
      }

      if ((npc.introUntil || 0) > now) {
        if (Number.isFinite(npc.introX) && Number.isFinite(npc.introY)) {
          npc.screenX = npc.introX;
          npc.screenY = npc.introY;
          npc.sprite.setPosition(Math.round(npc.introX), Math.round(npc.introY));
          npc.sprite.setDepth(30.18 + (npc.introY * 0.01));
        }
        continue;
      }
      if (npc.introUntil) {
        npc.introUntil = 0;
        this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
        npc.lastMoveAt = now;
        npc.lastMoveR = npc.r;
        npc.lastMoveC = npc.c;
      }

      const shouldGoHomeNow = this.shouldStreetNpcReturnHomeByStamina(npc, now);
      if (shouldGoHomeNow) {
        this.tryStartStreetNpcHomeReturn(npc, now);
      }

      const heatStopsNpc = this.updateStreetNpcHeatAndStamina(npc, now, dtMs);
      if (heatStopsNpc) {
        this.updateStreetNpcCameraFade(npc, dtMs);
        continue;
      }

      if (this.updateStreetNpcShopState(npc, now)) {
        continue;
      }
      if (this.updateStreetNpcHomeState(npc, now)) {
        continue;
      }

      this.updateStreetNpcCameraFade(npc, dtMs);

      if (!Number.isFinite(npc.lastMoveAt)) npc.lastMoveAt = now;
      if (!Number.isFinite(npc.lastMoveR)) npc.lastMoveR = npc.r;
      if (!Number.isFinite(npc.lastMoveC)) npc.lastMoveC = npc.c;
      if (!Number.isFinite(npc.sideSwitchStartAt)) npc.sideSwitchStartAt = 0;
      if (!Number.isFinite(npc.turnPauseUntil)) npc.turnPauseUntil = 0;
      if (!Number.isFinite(npc.nextShopTryAt)) npc.nextShopTryAt = 0;
      if (!Number.isFinite(npc.noShopEnterUntil)) npc.noShopEnterUntil = 0;
      if (!Number.isFinite(npc.noHomeReturnUntil)) npc.noHomeReturnUntil = 0;
      if (!Number.isFinite(npc.lastShopYapaDrop)) npc.lastShopYapaDrop = 0;
      if (!Number.isFinite(npc.nextLifeBreakAt)) {
        this.scheduleNextStreetNpcLifeBreak(npc, now, "spawn");
      }

      const atR = Math.round(npc.r);
      const atC = Math.round(npc.c);
      if (!this.isRoadCell(atR, atC)) {
        const cellB = this.getBuildingAtCell(atR, atC);
        const blockedByBuilding = !!(cellB && !this.isRoadBuilding(cellB));
        if (!blockedByBuilding && !npc.offRoadSince) npc.offRoadSince = now;
        if (!blockedByBuilding && (now - npc.offRoadSince) < TRAFFIC_NPC_OFFROAD_GRACE_MS) {
          this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
          continue;
        }
        const snap = this.getNearestRoadCellToPoint(atR, atC);
        if (!snap) {
          npc.path = null;
          npc.pathIndex = 0;
          npc.progress = 0;
          npc.waitUntil = 0;
          npc.sideSwitchStartAt = 0;
          npc.turnPauseUntil = 0;
          npc.nextPathAt = now + Phaser.Math.Between(450, 1200);
          this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
          continue;
        }
        npc.path = null;
        npc.pathIndex = 0;
        npc.progress = 0;
        npc.waitUntil = 0;
        npc.sideSwitchStartAt = 0;
        npc.turnPauseUntil = 0;
        npc.turnPauseR = snap.r;
        npc.turnPauseC = snap.c;
        // Evita deslizamiento visual sobre la casa al reubicar.
        npc.screenX = Number.NaN;
        npc.screenY = Number.NaN;
        this.setStreetNpcScreenPosition(npc, snap.r, snap.c);
        npc.lastMoveAt = now;
        npc.lastMoveR = snap.r;
        npc.lastMoveC = snap.c;
        npc.offRoadSince = 0;
      } else {
        npc.offRoadSince = 0;
      }

      const done = !npc.path || npc.pathIndex >= (npc.path.length - 1);
      if (done) {
        if (npc.homeState === "home_returning") {
          this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
          continue;
        }
        if (this.tryStreetNpcLifeBreak(npc, now)) {
          continue;
        }
        if (this.tryStreetNpcEnterNearbyShop(npc, now)) {
          continue;
        }
        if (now >= (npc.nextPathAt || 0)) {
          this.assignStreetNpcRoute(npc, now);
        }
        npc.sideSwitchStartAt = 0;
        npc.turnPauseUntil = 0;
        this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
        continue;
      }

      if (npc.side !== npc.sideTarget) {
        if (!npc.sideSwitchStartAt) npc.sideSwitchStartAt = now;
        if ((now - npc.sideSwitchStartAt) >= TRAFFIC_NPC_SIDE_SWITCH_TIMEOUT_MS) {
          npc.sideTarget = npc.side;
          npc.waitUntil = 0;
          npc.sideSwitchStartAt = 0;
        }

        if (now < (npc.waitUntil || 0)) continue;

        const curR = Math.round(npc.r);
        const curC = Math.round(npc.c);
        if (this.isSideBlockedForNpc(curR, curC, npc.dirR || 0, npc.dirC || 0, npc.sideTarget || 1)) {
          const safeSide = this.getSafeRoadEdgeSideForNpc(
            curR,
            curC,
            npc.dirR || 0,
            npc.dirC || 0,
            npc.side || 1
          );

          if (safeSide === npc.side
            || this.isSideBlockedForNpc(curR, curC, npc.dirR || 0, npc.dirC || 0, safeSide)) {
            npc.sideTarget = npc.side;
            npc.waitUntil = 0;
            npc.sideSwitchStartAt = 0;
          } else {
            npc.sideTarget = safeSide;
            npc.waitUntil = now + Phaser.Math.Between(280, 600);
          }

          continue;
        }

        if (this.hasNearbyCarAt(npc.r, npc.c, TRAFFIC_CAR_NEAR_RADIUS_TILES)) {
          npc.waitUntil = now + Phaser.Math.Between(TRAFFIC_NPC_CROSS_WAIT_MIN_MS, TRAFFIC_NPC_CROSS_WAIT_MAX_MS);
          continue;
        }

        npc.side = npc.sideTarget;
        npc.waitUntil = 0;
        npc.sideSwitchStartAt = 0;
      } else {
        npc.sideSwitchStartAt = 0;
      }

      if ((npc.turnPauseUntil || 0) > now) {
        // Quedarse totalmente quieto durante la pausa de giro.
        continue;
      }
      npc.turnPauseUntil = 0;

      const prevR = npc.r;
      const prevC = npc.c;
      npc.progress += (npc.speed * dtMs) / 1000;
      const lastIndex = npc.path.length - 1;
      while (npc.progress >= 1 && npc.pathIndex < lastIndex) {
        const segFrom = npc.path[npc.pathIndex];
        const segTo = npc.path[npc.pathIndex + 1];
        const inDirR = segTo.r - segFrom.r;
        const inDirC = segTo.c - segFrom.c;
        npc.progress -= 1;
        npc.pathIndex++;

        if (npc.pathIndex < lastIndex) {
          const node = npc.path[npc.pathIndex];
          const nextNode = npc.path[npc.pathIndex + 1];
          const outDirR = nextNode.r - node.r;
          const outDirC = nextNode.c - node.c;
          const changedDir = (inDirR !== outDirR) || (inDirC !== outDirC);
          if (changedDir) {
            npc.r = node.r;
            npc.c = node.c;
            npc.dirR = outDirR;
            npc.dirC = outDirC;
            npc.sideTarget = npc.side;
            npc.sideVisual = npc.side;
            npc.progress = 0;
            npc.turnPauseR = node.r;
            npc.turnPauseC = node.c;
            // Fijar posicion exacta del nodo antes de pausar.
            npc.screenX = Number.NaN;
            npc.screenY = Number.NaN;
            this.setStreetNpcScreenPosition(npc, node.r, node.c);
            npc.turnPauseUntil = now + Phaser.Math.Between(
              TRAFFIC_NPC_TURN_PAUSE_MIN_MS,
              TRAFFIC_NPC_TURN_PAUSE_MAX_MS
            );
            break;
          }
        }
      }

      if ((npc.turnPauseUntil || 0) > now) {
        // Quedarse totalmente quieto durante la pausa de giro.
        continue;
      }

      if (npc.pathIndex >= lastIndex) {
        const end = npc.path[lastIndex];
        npc.dirR = 0;
        npc.dirC = 1;
        this.setStreetNpcScreenPosition(npc, end.r, end.c);
        const movedToEnd = Math.hypot(
          end.r - (Number.isFinite(npc.lastMoveR) ? npc.lastMoveR : prevR),
          end.c - (Number.isFinite(npc.lastMoveC) ? npc.lastMoveC : prevC)
        );
        if (movedToEnd > TRAFFIC_NPC_STUCK_EPS_TILES) {
          npc.lastMoveAt = now;
          npc.lastMoveR = end.r;
          npc.lastMoveC = end.c;
        }
        npc.nextPathAt = now + Phaser.Math.Between(800, 1700);
        continue;
      }

      const from = npc.path[npc.pathIndex];
      const to = npc.path[npc.pathIndex + 1];
      npc.dirR = to.r - from.r;
      npc.dirC = to.c - from.c;
      const r = from.r + (npc.dirR * npc.progress);
      const c = from.c + (npc.dirC * npc.progress);
      this.setStreetNpcScreenPosition(npc, r, c);

      const moved = Math.hypot(
        npc.r - (Number.isFinite(npc.lastMoveR) ? npc.lastMoveR : prevR),
        npc.c - (Number.isFinite(npc.lastMoveC) ? npc.lastMoveC : prevC)
      );
      if (moved > TRAFFIC_NPC_STUCK_EPS_TILES) {
        npc.lastMoveAt = now;
        npc.lastMoveR = npc.r;
        npc.lastMoveC = npc.c;
      } else if ((now - npc.lastMoveAt) >= TRAFFIC_NPC_STUCK_REPATH_MS) {
        npc.path = null;
        npc.pathIndex = 0;
        npc.progress = 0;
        npc.waitUntil = 0;
        npc.sideTarget = npc.side || 1;
        npc.sideSwitchStartAt = 0;
        npc.nextPathAt = now + Phaser.Math.Between(120, 320);
        if (npc.homeState === "home_returning") {
          this.tryStartStreetNpcHomeReturn(npc, now, {
            reason: String(npc.homeIntent || "sleep"),
            allowWhileReturning: true
          });
        } else {
          this.assignStreetNpcRoute(npc, now);
        }
        this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
        npc.lastMoveAt = now;
        npc.lastMoveR = npc.r;
        npc.lastMoveC = npc.c;
      }
    }
  }

  updateTrafficSystem(deltaMs = 16) {
    const now = Date.now();
    if (TRAFFIC_ENABLE_CARS) {
      this.updateTrafficCars(now, deltaMs);
    } else if (this.trafficCars.length) {
      for (const car of this.trafficCars) {
        if (car?.sprite?.active) car.sprite.destroy();
      }
      this.trafficCars.length = 0;
    }
    this.worldCam?.preRender?.();
    this.updateStreetNpcs(now, deltaMs);
    if (!Number.isFinite(this.nextResidentNpcSyncAt) || now >= this.nextResidentNpcSyncAt) {
      this.nextResidentNpcSyncAt = now + 1400;
      const trafficSnapshot = this.getTrafficRoutineSnapshot(now);
      for (const b of buildings.values()) {
        if (!this.isStreetNpcSourceBuilding(b?.typeKey)) continue;
        this.syncStreetNpcPresenceForBuilding(b, now, trafficSnapshot);
      }
    }
  }

  toGridCodeColumn(index) {
    let n = Math.max(0, Math.floor(index)) + 1;
    let out = "";
    while (n > 0) {
      const rem = (n - 1) % 26;
      out = String.fromCharCode(65 + rem) + out;
      n = Math.floor((n - 1) / 26);
    }
    return out || "A";
  }

  toGridCodeLabel(r, c) {
    return `${this.toGridCodeColumn(c)}${Math.max(1, Math.floor(r) + 1)}`;
  }

  getGridCodeText(index) {
    if (!Array.isArray(this.gridCodeTextPool)) this.gridCodeTextPool = [];
    if (this.gridCodeTextPool[index]) return this.gridCodeTextPool[index];

    const txt = this.add.text(0, 0, "", {
      fontFamily: "Arial",
      fontSize: "11px",
      color: "#0f172a",
      stroke: "#e2e8f0",
      strokeThickness: 2
    })
      .setOrigin(0.5, 0.5)
      .setDepth(33)
      .setVisible(false);

    this.gridCodeLayer?.add(txt);
    this.gridCodeTextPool[index] = txt;
    return txt;
  }

  clearGridCodeOverlay() {
    if (!Array.isArray(this.gridCodeTextPool)) return;
    for (const txt of this.gridCodeTextPool) {
      if (txt?.active) txt.setVisible(false);
    }
  }

  drawGridCodeOverlay(force = false) {
    if (!this.gridCodeDebugEnabled) {
      this.clearGridCodeOverlay();
      return;
    }

    const cam = this.worldCam;
    if (!cam) return;
    cam.preRender();
    const view = cam.worldView;
    const xMin = view.x - TILE_W;
    const xMax = view.x + view.width + TILE_W;
    const yMin = view.y - TILE_H;
    const yMax = view.y + view.height + TILE_H;

    const dMin = xMin / (TILE_W / 2);
    const dMax = xMax / (TILE_W / 2);
    const sMin = yMin / (TILE_H / 2);
    const sMax = yMax / (TILE_H / 2);

    const rowMin = ((sMin - dMax) / 2) + MAP_CENTER_R;
    const rowMax = ((sMax - dMin) / 2) + MAP_CENTER_R;
    const colMin = ((sMin + dMin) / 2) + MAP_CENTER_C;
    const colMax = ((sMax + dMax) / 2) + MAP_CENTER_C;

    const buffer = 1;
    const rStart = Math.max(0, Math.floor(rowMin) - buffer);
    const rEnd = Math.min(MAP_H - 1, Math.ceil(rowMax) + buffer);
    const cStart = Math.max(0, Math.floor(colMin) - buffer);
    const cEnd = Math.min(MAP_W - 1, Math.ceil(colMax) + buffer);

    const totalTiles = Math.max(1, (rEnd - rStart + 1) * (cEnd - cStart + 1));
    let step = 1;
    if (totalTiles > 2800) step = 2;
    if (totalTiles > 6200) step = 3;
    if (totalTiles > 10800) step = 4;
    if (cam.zoom < 1.4) step = Math.max(step, 3);
    if (cam.zoom < 1.0) step = Math.max(step, 4);

    const rOffset = ((step - (rStart % step)) % step);
    const cOffset = ((step - (cStart % step)) % step);
    let idx = 0;

    for (let r = rStart + rOffset; r <= rEnd; r += step) {
      for (let c = cStart + cOffset; c <= cEnd; c += step) {
        const p = isoToScreen(r, c);
        const txt = this.getGridCodeText(idx++);
        txt.setText(this.toGridCodeLabel(r, c));
        txt.setPosition(p.x, p.y + 1);
        txt.setVisible(true);
      }
    }

    for (let i = idx; i < this.gridCodeTextPool.length; i++) {
      const txt = this.gridCodeTextPool[i];
      if (txt?.active) txt.setVisible(false);
    }

    if (force) {
      // Fuerza refresh visual al alternar ON sin mover camara.
      this.gridCodeLayer?.setDepth(33);
    }
  }

  getAdminForcedRoadPiece() {
    const v = Number(this.adminForcedRoadPiece) || 0;
    return Phaser.Math.Clamp(Math.round(v), 0, ROADKOTO_PIECES);
  }

  clearAdminRoadPiecePlacement() {
    this.adminForcedRoadPiece = 0;
    this.adminForcedRoadPieceNoConsume = true;
  }

  setAdminRoadPiecePlacement(piece = 0) {
    const clamped = Phaser.Math.Clamp(Math.round(Number(piece) || 0), 0, ROADKOTO_PIECES);
    this.adminForcedRoadPiece = clamped;
    this.adminForcedRoadPieceNoConsume = true;
    this.selectedBuildKey = "road_main_2x2";
    this.buildRotationStep = 0;
    this.buildPreviewTypeKey = "road_main_2x2";
    if (this.pending) this.clearPending();
    this.setBuildMode();
    return clamped;
  }

  setInventoryRoadPiecePlacement(piece = 0) {
    const clamped = Phaser.Math.Clamp(Math.round(Number(piece) || 0), 0, ROADKOTO_PIECES);
    this.adminForcedRoadPiece = clamped;
    this.adminForcedRoadPieceNoConsume = false;
    this.selectedBuildKey = "road_main_2x2";
    this.buildRotationStep = 0;
    this.buildPreviewTypeKey = "road_main_2x2";
    if (this.pending) this.clearPending();
    this.setBuildMode();
    return clamped;
  }

  getRoadPieceSelectionForBuilding(b) {
    if (!b || b.typeKey !== "road_main_2x2") return { piece: 0, rot: 0, forced: false };

    const forcedPiece = Phaser.Math.Clamp(Math.round(Number(b.roadForcedPiece) || 0), 0, ROADKOTO_PIECES);
    if (forcedPiece > 0) {
      return { piece: forcedPiece, rot: 0, forced: true };
    }

    if (this.roadAutoRulesEnabled !== false) {
      const topLeft = this.getRoadTopLeftCell(b);
      if (!topLeft) return { piece: 0, rot: 0, forced: false };

      const mask = this.getRoadNeighborMaskForBlock(topLeft.r, topLeft.c);
      const diagMask = this.getRoadDiagonalMaskForBlock(topLeft.r, topLeft.c);
      const pieceSel = this.getRoadKotoPieceForMask(mask, diagMask, topLeft.r, topLeft.c) || { piece: 0, rot: 0 };
      const piece = Phaser.Math.Clamp(Math.round(Number(pieceSel?.piece) || 0), 0, ROADKOTO_PIECES);
      const rotRaw = Math.round(Number(pieceSel?.rot) || 0);
      const rot = ((rotRaw % 360) + 360) % 360;
      return { piece, rot, forced: false };
    }

    const current = this.getRoadCurrentPieceNumber(b);
    if (current > 0) return { piece: current, rot: 0, forced: false };
    return { piece: 33, rot: 0, forced: false };
  }

  toRoadPieceAdminCode(piece = 0) {
    const n = Phaser.Math.Clamp(Math.round(Number(piece) || 0), 0, ROADKOTO_PIECES);
    if (n <= 0) return "R--";
    return `R${String(n).padStart(2, "0")}`;
  }

  getRoadPieceNumberForBuilding(b) {
    if (!b || b.typeKey !== "road_main_2x2") return 0;
    const current = this.getRoadCurrentPieceNumber(b);
    if (current > 0) return current;
    return this.getRoadPieceSelectionForBuilding(b).piece;
  }

  getRoadPieceDebugText(index) {
    if (!Array.isArray(this.roadPieceDebugTextPool)) this.roadPieceDebugTextPool = [];
    if (this.roadPieceDebugTextPool[index]) return this.roadPieceDebugTextPool[index];

    const txt = this.add.text(0, 0, "", {
      fontFamily: "Arial",
      fontSize: "12px",
      fontStyle: "bold",
      color: "#fecaca",
      stroke: "#111827",
      strokeThickness: 3
    })
      .setOrigin(0.5, 0.5)
      .setDepth(37)
      .setVisible(false);

    this.roadPieceDebugLayer?.add(txt);
    this.roadPieceDebugTextPool[index] = txt;
    return txt;
  }

  clearRoadPieceDebugOverlay() {
    if (!Array.isArray(this.roadPieceDebugTextPool)) return;
    for (const txt of this.roadPieceDebugTextPool) {
      if (txt?.active) txt.setVisible(false);
    }
  }

  drawRoadPieceDebugOverlay(force = false) {
    if (!this.roadPieceDebugEnabled) {
      this.clearRoadPieceDebugOverlay();
      return;
    }

    const roads = [];
    for (const b of buildings.values()) {
      if (!b || b.typeKey !== "road_main_2x2" || !Array.isArray(b.cells) || !b.cells.length) continue;
      roads.push(b);
    }
    roads.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));

    let idx = 0;
    for (const road of roads) {
      const topLeft = this.getRoadTopLeftCell(road);
      if (!topLeft) continue;
      const pieceNum = this.getRoadPieceNumberForBuilding(road);
      if (pieceNum <= 0) continue;
      const center = isoToScreen(topLeft.r + 0.5, topLeft.c + 0.5);
      const txt = this.getRoadPieceDebugText(idx++);
      const mask = this.getRoadNeighborMaskForBlock(topLeft.r, topLeft.c);
      const diagMask = this.getRoadDiagonalMaskForBlock(topLeft.r, topLeft.c);
      const baseCode = this.toRoadPieceAdminCode(pieceNum);
      const nCode = (mask & 1) ? 1 : 0;
      const eCode = (mask & 2) ? 1 : 0;
      const sCode = (mask & 4) ? 1 : 0;
      const oCode = (mask & 8) ? 1 : 0;
      const noCode = (diagMask & 1) ? 1 : 0;
      const neCode = (diagMask & 2) ? 1 : 0;
      const seCode = (diagMask & 4) ? 1 : 0;
      const soCode = (diagMask & 8) ? 1 : 0;
      txt.setText(`${baseCode}\nN${nCode} E${eCode} S${sCode} O${oCode} | NO${noCode} NE${neCode} SE${seCode} SO${soCode}`);
      txt.setPosition(center.x, center.y - (TILE_H * 0.2));
      txt.setVisible(true);
    }

    for (let i = idx; i < this.roadPieceDebugTextPool.length; i++) {
      const txt = this.roadPieceDebugTextPool[i];
      if (txt?.active) txt.setVisible(false);
    }

    if (force) this.roadPieceDebugLayer?.setDepth(37);
  }

  shouldShowItemDirectionBySize(size) {
    return size === 1 || size === 2 || size === 3 || size === 4 || size === 9;
  }

  getItemDirectionCodePrefix(size) {
    if (size === 1) return "A";
    if (size === 2) return "B";
    if (size === 3) return "C";
    if (size === 4) return "D";
    if (size === 9) return "E";
    return "X";
  }

  getItemDirectionDebugText(index) {
    if (!Array.isArray(this.itemDirDebugTextPool)) this.itemDirDebugTextPool = [];
    if (this.itemDirDebugTextPool[index]) return this.itemDirDebugTextPool[index];

    const txt = this.add.text(0, 0, "", {
      fontFamily: "Arial",
      fontSize: "13px",
      fontStyle: "bold",
      color: "#f8fafc",
      stroke: "#020617",
      strokeThickness: 3
    })
      .setOrigin(0.5, 0.5)
      .setDepth(36)
      .setVisible(false);

    this.itemDirDebugLayer?.add(txt);
    this.itemDirDebugTextPool[index] = txt;
    return txt;
  }

  clearItemDirectionOverlay() {
    this.itemDirDebugGfx?.clear();
    if (!Array.isArray(this.itemDirDebugTextPool)) return;
    for (const txt of this.itemDirDebugTextPool) {
      if (txt?.active) txt.setVisible(false);
    }
  }

  drawItemDirectionOverlay(force = false) {
    const g = this.itemDirDebugGfx;
    if (!g) return;
    g.clear();
    if (!this.itemDirDebugEnabled) {
      this.clearItemDirectionOverlay();
      return;
    }

    const counters = new Map();
    const entries = [];
    for (const b of buildings.values()) {
      if (!b?.cells?.length) continue;
      const size = Number(b.size) || Number(BUILDING_TYPES[b.typeKey]?.size) || 1;
      if (!this.shouldShowItemDirectionBySize(size)) continue;
      const center = this.getBuildingGridCenter(b) || b.cells[0];
      if (!center) continue;

      const isRoad = b.typeKey === "road_main_2x2";
      let codeLabel = "";
      if (isRoad) {
        const roadNum = this.getRoadPieceNumberForBuilding(b);
        codeLabel = `ROAD ${String(Math.max(0, roadNum)).padStart(2, "0")}`;
      } else {
        const prefix = this.getItemDirectionCodePrefix(size);
        const nextNum = (counters.get(prefix) || 0) + 1;
        counters.set(prefix, nextNum);
        codeLabel = `${prefix}${nextNum}`;
      }
      entries.push({
        b,
        size,
        center,
        isRoad,
        code: codeLabel
      });
    }

    entries.sort((a, b) => (Number(a.b?.id) || 0) - (Number(b.b?.id) || 0));

    let textIdx = 0;
    for (const e of entries) {
      const center = isoToScreen(e.center.r, e.center.c);
      const reachTiles = Math.max(1.05, (e.size * 0.58) + 0.25);
      const pN = isoToScreen(e.center.r - reachTiles, e.center.c);
      const pE = isoToScreen(e.center.r, e.center.c + reachTiles);
      const pS = isoToScreen(e.center.r + reachTiles, e.center.c);
      const pO = isoToScreen(e.center.r, e.center.c - reachTiles);
      const diagScale = 0.82;
      const pNO = {
        x: center.x + (((pN.x - center.x) + (pO.x - center.x)) * diagScale),
        y: center.y + (((pN.y - center.y) + (pO.y - center.y)) * diagScale)
      };
      const pNE = {
        x: center.x + (((pN.x - center.x) + (pE.x - center.x)) * diagScale),
        y: center.y + (((pN.y - center.y) + (pE.y - center.y)) * diagScale)
      };
      const pSE = {
        x: center.x + (((pS.x - center.x) + (pE.x - center.x)) * diagScale),
        y: center.y + (((pS.y - center.y) + (pE.y - center.y)) * diagScale)
      };
      const pSO = {
        x: center.x + (((pS.x - center.x) + (pO.x - center.x)) * diagScale),
        y: center.y + (((pS.y - center.y) + (pO.y - center.y)) * diagScale)
      };

      g.lineStyle(1, 0x0f172a, 0.6);
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pN.x, pN.y); g.strokePath();
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pE.x, pE.y); g.strokePath();
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pS.x, pS.y); g.strokePath();
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pO.x, pO.y); g.strokePath();
      g.lineStyle(1, 0x334155, 0.45);
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pNO.x, pNO.y); g.strokePath();
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pNE.x, pNE.y); g.strokePath();
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pSE.x, pSE.y); g.strokePath();
      g.beginPath(); g.moveTo(center.x, center.y); g.lineTo(pSO.x, pSO.y); g.strokePath();

      g.fillStyle(0x020617, 0.9);
      g.fillCircle(center.x, center.y, 4);
      g.lineStyle(1.4, 0xf8fafc, 0.92);
      g.strokeCircle(center.x, center.y, 4);

      const code = this.getItemDirectionDebugText(textIdx++);
      code.setText(e.isRoad ? e.code : `${e.code} ${e.size}x${e.size}`);
      code.setColor("#fde68a");
      code.setPosition(center.x, center.y - (TILE_H * (0.58 + (e.size * 0.08))));
      code.setVisible(true);

      const n = this.getItemDirectionDebugText(textIdx++);
      n.setText("N");
      n.setColor("#93c5fd");
      n.setPosition(pN.x, pN.y - 2);
      n.setVisible(true);

      const eTxt = this.getItemDirectionDebugText(textIdx++);
      eTxt.setText("E");
      eTxt.setColor("#86efac");
      eTxt.setPosition(pE.x + 2, pE.y);
      eTxt.setVisible(true);

      const s = this.getItemDirectionDebugText(textIdx++);
      s.setText("S");
      s.setColor("#fef08a");
      s.setPosition(pS.x, pS.y + 2);
      s.setVisible(true);

      const o = this.getItemDirectionDebugText(textIdx++);
      o.setText("O");
      o.setColor("#fca5a5");
      o.setPosition(pO.x - 2, pO.y);
      o.setVisible(true);
      const noTxt = this.getItemDirectionDebugText(textIdx++);
      noTxt.setText("NO");
      noTxt.setColor("#bfdbfe");
      noTxt.setPosition(pNO.x - 2, pNO.y - 2);
      noTxt.setVisible(true);

      const neTxt = this.getItemDirectionDebugText(textIdx++);
      neTxt.setText("NE");
      neTxt.setColor("#a7f3d0");
      neTxt.setPosition(pNE.x + 2, pNE.y - 2);
      neTxt.setVisible(true);

      const seTxt = this.getItemDirectionDebugText(textIdx++);
      seTxt.setText("SE");
      seTxt.setColor("#fde68a");
      seTxt.setPosition(pSE.x + 2, pSE.y + 2);
      seTxt.setVisible(true);

      const soTxt = this.getItemDirectionDebugText(textIdx++);
      soTxt.setText("SO");
      soTxt.setColor("#fecaca");
      soTxt.setPosition(pSO.x - 2, pSO.y + 2);
      soTxt.setVisible(true);
    }

    for (let i = textIdx; i < this.itemDirDebugTextPool.length; i++) {
      const txt = this.itemDirDebugTextPool[i];
      if (txt?.active) txt.setVisible(false);
    }

    if (force) {
      this.itemDirDebugLayer?.setDepth(36);
      this.itemDirDebugGfx?.setDepth(35);
    }
  }

  getNpcStatsDebugText(index) {
    if (!Array.isArray(this.npcStatsDebugTextPool)) this.npcStatsDebugTextPool = [];
    if (this.npcStatsDebugTextPool[index]) return this.npcStatsDebugTextPool[index];

    const txt = this.add.text(0, 0, "", {
      fontFamily: "Arial",
      fontSize: "10px",
      color: "#e2e8f0",
      stroke: "#020617",
      strokeThickness: 2
    })
      .setOrigin(0.5, 1)
      .setDepth(35)
      .setVisible(false);
    this.uiCam.ignore(txt);
    this.npcStatsDebugTextPool[index] = txt;
    return txt;
  }

  clearNpcStatsDebugTexts() {
    if (!Array.isArray(this.npcStatsDebugTextPool)) return;
    for (const txt of this.npcStatsDebugTextPool) {
      if (txt?.active) txt.setVisible(false);
    }
  }

  drawNpcDebugOverlay() {
    const g = this.npcDebugGfx;
    if (!g) return;
    g.clear();
    const drawPathDebug = !!this.npcDebugEnabled;
    const drawSpecialStats = !!this.npcStatsDebugEnabled;
    if (!drawPathDebug && !drawSpecialStats) {
      this.clearNpcStatsDebugTexts();
      return;
    }
    if (!drawSpecialStats) {
      this.clearNpcStatsDebugTexts();
    }

    if (drawPathDebug) {
      for (const npc of this.streetNpcs) {
        if (!npc?.sprite?.active) continue;
        const color = (npc.id % 2 === 0) ? 0x38bdf8 : 0xf59e0b;
        const path = Array.isArray(npc.path) ? npc.path : null;
        const idx = Math.max(0, npc.pathIndex || 0);
        const pCur = isoToScreen(npc.r, npc.c);

        g.fillStyle(0x0f172a, 0.85);
        g.fillCircle(pCur.x, pCur.y + 6, 4);
        g.lineStyle(2, color, 0.9);

        if (path && path.length > 1) {
          g.beginPath();
          g.moveTo(pCur.x, pCur.y + 6);
          for (let i = idx + 1; i < path.length; i++) {
            const p = isoToScreen(path[i].r, path[i].c);
            g.lineTo(p.x, p.y + 6);
          }
          g.strokePath();

          for (let i = idx; i < path.length; i++) {
            const p = isoToScreen(path[i].r, path[i].c);
            g.fillStyle(i === idx ? 0x22c55e : 0xe2e8f0, i === idx ? 0.95 : 0.75);
            g.fillCircle(p.x, p.y + 6, i === idx ? 3.5 : 2.5);
          }
        }

        if ((npc.turnPauseUntil || 0) > Date.now()) {
          const holdR = Number.isFinite(npc.turnPauseR) ? npc.turnPauseR : npc.r;
          const holdC = Number.isFinite(npc.turnPauseC) ? npc.turnPauseC : npc.c;
          const pHold = isoToScreen(holdR, holdC);
          g.lineStyle(2, 0xef4444, 0.95);
          g.strokeCircle(pHold.x, pHold.y + 6, 8);
        }
      }
    }

    if (drawSpecialStats) {
      let statsTextIdx = 0;
      const drawStatBar = (x, y, w, h, ratio, fillColor) => {
        const r = Phaser.Math.Clamp(Number(ratio) || 0, 0, 1);
        g.fillStyle(0x020617, 0.88);
        g.fillRoundedRect(Math.round(x - (w * 0.5) - 1), Math.round(y - 1), w + 2, h + 2, 2);
        const fillW = Math.max(0, Math.round(w * r));
        if (fillW > 0) {
          g.fillStyle(fillColor, 0.95);
          g.fillRoundedRect(Math.round(x - (w * 0.5)), Math.round(y), fillW, h, 2);
        }
        g.lineStyle(1, 0xe2e8f0, 0.62);
        g.strokeRoundedRect(Math.round(x - (w * 0.5) - 1), Math.round(y - 1), w + 2, h + 2, 2);
      };
      for (const npc of this.streetNpcs) {
        if (!npc?.sprite?.active || !npc.sprite.visible) continue;
        if (!npc.isSpecialNpc) continue;
        if (!this.hasStreetNpcGameplayStats(npc)) continue;

        this.ensureStreetNpcWorldVitals(npc, Date.now());
        const cap = Math.max(1, Number(npc.worldStaminaCap) || this.getStreetNpcStaminaCap(npc));
        const cur = Phaser.Math.Clamp(Number(npc.worldStamina) || 0, 0, cap);
        const staminaRatio = Phaser.Math.Clamp(cur / cap, 0, 1);
        const bodyTemp = Phaser.Math.Clamp(Number(npc.worldBodyTempC) || 36.6, 34.0, 41.0);
        const bodyTempRatio = Phaser.Math.Clamp((bodyTemp - 34) / 7, 0, 1);
        const stress = Phaser.Math.Clamp(Number(npc.worldStress) || 0, 0, 100);
        const stressRatio = Phaser.Math.Clamp(stress / 100, 0, 1);
        const x = Number.isFinite(npc.screenX) ? npc.screenX : npc.sprite.x;
        const topY = (Number.isFinite(npc.screenY) ? npc.screenY : npc.sprite.y) - 28;
        const w = 34;
        const h = 4;
        const gap = 3;
        const staminaColor = staminaRatio >= 0.66 ? 0x22c55e : (staminaRatio >= 0.33 ? 0xf59e0b : 0xef4444);
        const tempColor = this.lerpDayCycleColor(0x38bdf8, 0xef4444, bodyTempRatio);
        const stressColor = stressRatio >= 0.72 ? 0xf59e0b : 0xfacc15;

        drawStatBar(x, topY, w, h, staminaRatio, staminaColor);
        drawStatBar(x, topY + (h + gap), w, h, bodyTempRatio, tempColor);
        drawStatBar(x, topY + ((h + gap) * 2), w, h, stressRatio, stressColor);

        const txt = this.getNpcStatsDebugText(statsTextIdx++);
        txt.setText(`STA ${cur.toFixed(0)}/${cap.toFixed(0)} | TMP ${bodyTemp.toFixed(1)}C | EST ${stress.toFixed(0)}%`);
        txt.setPosition(Math.round(x), Math.round(topY - 3));
        txt.setVisible(true);
      }
      for (let i = statsTextIdx; i < this.npcStatsDebugTextPool.length; i++) {
        const txt = this.npcStatsDebugTextPool[i];
        if (txt?.active) txt.setVisible(false);
      }
    }
  }

  trySpawnDeliveryCarToDecorHouse(b, now = Date.now()) {
    if (!TRAFFIC_ENABLE_CARS) return;
    if (!b || !this.isDecorativeHouse(b.typeKey) || !b.isBuilt) return;
    if (this.trafficCars.length >= TRAFFIC_MAX_CARS) return;

    const center = this.getBuildingGridCenter(b) || b.cells?.[0];
    if (!center) return;

    const targetRoad = this.getNearestRoadCellToPoint(center.r, center.c);
    if (!targetRoad) return;

    let path = null;
    for (let i = 0; i < 10; i++) {
      const startRoad = this.pickRandomRoadCell(targetRoad, 8);
      if (!startRoad) break;
      const candidate = this.findRoadPath(startRoad, targetRoad, 4500);
      if (candidate && candidate.length >= 2) {
        path = candidate;
        break;
      }
    }
    if (!path) path = [{ r: targetRoad.r, c: targetRoad.c }];

    const sprite = this.add.rectangle(0, 0, 24, 11, 0x374151, 1)
      .setStrokeStyle(2, 0xe5e7eb, 0.95)
      .setAlpha(0)
      .setDepth(68);
    this.uiCam.ignore(sprite);

    const start = path[0];
    const next = path[1] || start;
    const car = {
      id: this.nextTrafficCarId++,
      sprite,
      path,
      pathIndex: 0,
      progress: 0,
      speed: TRAFFIC_CAR_SPEED_TILES,
      dirR: next.r - start.r,
      dirC: next.c - start.c,
      r: start.r,
      c: start.c,
      holdUntil: now + (path.length <= 1 ? 420 : 0),
      targetHouseId: b.id,
      targetRoad
    };

    this.trafficCars.push(car);
    this.setTrafficCarScreenPosition(car, start.r, start.c, car.dirR, car.dirC);

    this.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: 260,
      ease: "Quad.Out"
    });
  }

  isBuildingInfoLocked(b, now = Date.now()) {
    if (!b) return true;
    if (!b.isBuilt) return true;
    return !!(b.constructAnimUntil && now < b.constructAnimUntil);
  }

  playBuildingConstructDropAnimation(b, now = Date.now()) {
    if (!b || b.typeKey === "road_main_2x2") return;
    if ((b.buildSeconds ?? 0) <= 0) return;
    if ((b.constructAnimUntil || 0) > now) return;

    const target = (b.sprite && b.sprite.visible) ? b.sprite : b.gfx;
    if (!target || !target.active) return;

    const duration = 480;
    const dropPx = Math.max(16, Math.round(TILE_H * 2.2));
    const finalY = Number(target.y) || 0;

    b.constructAnimActive = true;
    b.constructAnimUntil = now + duration;

    target.y = finalY - dropPx;
    target.alpha = Math.min(1, Math.max(0.45, Number(target.alpha) || 1));

    this.tweens.add({
      targets: target,
      y: finalY,
      alpha: 1,
      duration,
      ease: "Bounce.Out",
      onComplete: () => {
        if (!buildings.has(b.id)) return;
        target.y = finalY;
        target.alpha = 1;
        b.constructAnimActive = false;
        b.constructAnimUntil = 0;
        this.syncStreetNpcPresenceForBuilding(b, Date.now());
        this.updateBuildingInfoModal(b, BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1, Date.now());
      }
    });
  }

  onBuildingConstructed(b, now = Date.now()) {
    if (!b) return;
    const waitForDropAnim = this.isStreetNpcSourceBuilding(b.typeKey) && ((b.buildSeconds ?? 0) > 0);
    this.playBuildingConstructDropAnimation(b, now);
    if (this.isStreetNpcSourceBuilding(b.typeKey) && !waitForDropAnim) {
      this.syncStreetNpcPresenceForBuilding(b, now);
    }
  }

  isSpriteBuilding(typeKey) {
    return typeKey === "green_1" || typeKey === "green_temp_outline_1" || typeKey === "green_2" || typeKey === "red_1" || typeKey === "blue_1" || typeKey === "casa_conera_4";
  }

  getDefaultSpriteEditState() {
    return {
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
      rotationDeg: 0,
      skewXDeg: 0,
      skewYDeg: 0,
      opacityMul: 1
    };
  }

  getDefaultSpriteEditStateForType(typeKey) {
    const base = this.getDefaultSpriteEditState();
    if (typeKey === "green_2") {
      // Preset obtenido desde calibracion contra ghost 2x2 (tambo1) y convertido
      // a escala relativa del sprite base Phaser (no escala absoluta del PNG original).
      return {
        ...base,
        offsetX: -0.58,
        offsetY: -18.09,
        scaleX: 1.1815,
        scaleY: 1.1815
      };
    }
    if (typeKey === "red_1" || typeKey === "blue_1") {
      // Preset calibrado en juego (Calibrar Sprite) para footprint 1x1.
      return {
        ...base,
        offsetX: -0.16,
        offsetY: -3.28,
        scaleX: 0.7797118,
        scaleY: 0.7797118
      };
    }
    if (typeKey === "casa_conera_4") {
      return {
        ...base,
        offsetX: 1,
        offsetY: -38,
        scaleX: 2.05,
        scaleY: 2.05
      };
    }
    return base;
  }

  normalizeSpriteEditState(raw) {
    const src = raw || {};
    return {
      offsetX: Number.isFinite(Number(src.offsetX)) ? Number(src.offsetX) : 0,
      offsetY: Number.isFinite(Number(src.offsetY)) ? Number(src.offsetY) : 0,
      scaleX: Phaser.Math.Clamp(Number.isFinite(Number(src.scaleX)) ? Number(src.scaleX) : 1, 0.05, 8),
      scaleY: Phaser.Math.Clamp(Number.isFinite(Number(src.scaleY)) ? Number(src.scaleY) : 1, 0.05, 8),
      rotationDeg: Phaser.Math.Clamp(Number.isFinite(Number(src.rotationDeg)) ? Number(src.rotationDeg) : 0, -180, 180),
      skewXDeg: Phaser.Math.Clamp(Number.isFinite(Number(src.skewXDeg)) ? Number(src.skewXDeg) : 0, -89, 89),
      skewYDeg: Phaser.Math.Clamp(Number.isFinite(Number(src.skewYDeg)) ? Number(src.skewYDeg) : 0, -89, 89),
      opacityMul: Phaser.Math.Clamp(Number.isFinite(Number(src.opacityMul)) ? Number(src.opacityMul) : 1, 0.05, 1)
    };
  }

  getSpriteEditStateForBuilding(b) {
    if (!b) return this.getDefaultSpriteEditState();
    // Migracion suave: reemplaza el preset temporal viejo de red_1 por el preset calibrado.
    if (b.typeKey === "red_1" && b.spriteEdit) {
      const e = this.normalizeSpriteEditState(b.spriteEdit);
      const looksLikeOldTempPreset =
        Math.abs((e.offsetX || 0) - 0) <= 0.01 &&
        Math.abs((e.offsetY || 0) - (-10)) <= 0.01 &&
        Math.abs((e.scaleX || 1) - 1.1) <= 0.01 &&
        Math.abs((e.scaleY || 1) - 1.1) <= 0.01 &&
        Math.abs((e.rotationDeg || 0)) <= 0.01 &&
        Math.abs((e.skewXDeg || 0)) <= 0.01 &&
        Math.abs((e.skewYDeg || 0)) <= 0.01;
      const looksLikePreviousCalibratedPreset =
        Math.abs((e.offsetX || 0) - (-0.25)) <= 0.02 &&
        Math.abs((e.offsetY || 0) - (-15.63)) <= 0.02 &&
        Math.abs((e.scaleX || 1) - 0.7933) <= 0.005 &&
        Math.abs((e.scaleY || 1) - 0.7933) <= 0.005 &&
        Math.abs((e.rotationDeg || 0)) <= 0.01 &&
        Math.abs((e.skewXDeg || 0)) <= 0.01 &&
        Math.abs((e.skewYDeg || 0)) <= 0.01;
      const looksLikeCurrentBadRed1Preset =
        Math.abs((e.offsetX || 0) - (-0.16)) <= 0.02 &&
        Math.abs((e.offsetY || 0) - (-15.28)) <= 0.02 &&
        Math.abs((e.scaleX || 1) - 0.7797118) <= 0.005 &&
        Math.abs((e.scaleY || 1) - 0.7797118) <= 0.005 &&
        Math.abs((e.rotationDeg || 0)) <= 0.01 &&
        Math.abs((e.skewXDeg || 0)) <= 0.01 &&
        Math.abs((e.skewYDeg || 0)) <= 0.01;
      if (looksLikeOldTempPreset || looksLikePreviousCalibratedPreset || looksLikeCurrentBadRed1Preset) {
        b.spriteEdit = this.getDefaultSpriteEditStateForType("red_1");
      }
    }
    if (b.typeKey === "casa_conera_4" && b.spriteEdit) {
      const e = this.normalizeSpriteEditState(b.spriteEdit);
      const looksLikeOldConeraPreset =
        Math.abs((e.offsetX || 0) - 0) <= 0.02 &&
        Math.abs((e.offsetY || 0) - (-12)) <= 0.02 &&
        Math.abs((e.scaleX || 1) - 1.06) <= 0.01 &&
        Math.abs((e.scaleY || 1) - 1.06) <= 0.01 &&
        Math.abs((e.rotationDeg || 0)) <= 0.01 &&
        Math.abs((e.skewXDeg || 0)) <= 0.01 &&
        Math.abs((e.skewYDeg || 0)) <= 0.01;
      if (looksLikeOldConeraPreset) {
        b.spriteEdit = this.getDefaultSpriteEditStateForType("casa_conera_4");
      }
    }
    b.spriteEdit = this.normalizeSpriteEditState(b.spriteEdit || this.getDefaultSpriteEditStateForType(b.typeKey));
    return b.spriteEdit;
  }

  applySpriteEditToSprite(b, baseAlpha = 1) {
    if (!b || !b.sprite) return;
    const s = b.sprite;
    const edit = this.getSpriteEditStateForBuilding(b);
    const finalBaseAlpha = this.getEffectiveSpriteAlphaForBuilding(b, baseAlpha);

    const baseW = s.displayWidth;
    const baseH = s.displayHeight;
    const baseY = s.y;

    s.setDisplaySize(baseW * edit.scaleX, baseH * edit.scaleY);
    s.setPosition(s.x + edit.offsetX, s.y + edit.offsetY);
    s.setAngle(edit.rotationDeg);
    s.setAlpha(Phaser.Math.Clamp((Number(finalBaseAlpha) || 0) * edit.opacityMul, 0, 1));
    s.setDepth(30 + ((baseY + edit.offsetY) * 0.01));

    const skewRadX = Phaser.Math.DegToRad(edit.skewXDeg);
    const skewRadY = Phaser.Math.DegToRad(edit.skewYDeg);
    if (typeof s.setSkew === "function") {
      s.setSkew(skewRadX, skewRadY);
    } else {
      if (Object.prototype.hasOwnProperty.call(s, "skewX")) s.skewX = skewRadX;
      if (Object.prototype.hasOwnProperty.call(s, "skewY")) s.skewY = skewRadY;
    }
  }

  applyDefaultSpriteEditToLooseSprite(sprite, typeKey, baseAlpha = 1) {
    if (!sprite || !this.isSpriteBuilding(typeKey)) return;
    const edit = this.normalizeSpriteEditState(this.getDefaultSpriteEditStateForType(typeKey));
    if (
      Math.abs((edit.offsetX || 0)) < 0.001 &&
      Math.abs((edit.offsetY || 0)) < 0.001 &&
      Math.abs((edit.scaleX || 1) - 1) < 0.001 &&
      Math.abs((edit.scaleY || 1) - 1) < 0.001 &&
      Math.abs((edit.rotationDeg || 0)) < 0.001 &&
      Math.abs((edit.skewXDeg || 0)) < 0.001 &&
      Math.abs((edit.skewYDeg || 0)) < 0.001 &&
      Math.abs((edit.opacityMul || 1) - 1) < 0.001
    ) {
      return;
    }

    const baseW = sprite.displayWidth;
    const baseH = sprite.displayHeight;
    const baseY = sprite.y;
    sprite.setDisplaySize(baseW * edit.scaleX, baseH * edit.scaleY);
    sprite.setPosition(sprite.x + edit.offsetX, sprite.y + edit.offsetY);
    sprite.setAngle(edit.rotationDeg);
    sprite.setAlpha(Phaser.Math.Clamp((Number(baseAlpha) || 0) * edit.opacityMul, 0, 1));
    sprite.setDepth(30 + ((baseY + edit.offsetY) * 0.01));

    const skewRadX = Phaser.Math.DegToRad(edit.skewXDeg);
    const skewRadY = Phaser.Math.DegToRad(edit.skewYDeg);
    if (typeof sprite.setSkew === "function") {
      sprite.setSkew(skewRadX, skewRadY);
    } else {
      if (Object.prototype.hasOwnProperty.call(sprite, "skewX")) sprite.skewX = skewRadX;
      if (Object.prototype.hasOwnProperty.call(sprite, "skewY")) sprite.skewY = skewRadY;
    }
  }

  getSpriteTextureForBuilding(typeKey, rotationStep = 0) {
    if (!this.isSpriteBuilding(typeKey)) return null;
    if (typeKey === "green_temp_outline_1") return "green_temp_outline_1x1";
    if (typeKey === "red_1") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `food_factory_1x1_${step + 1}`;
    }
    if (typeKey === "blue_1") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `drink_factory_1x1_${step + 1}`;
    }
    if (typeKey === "green_2") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `tambo_2x2_${step + 1}`;
    }
    if (typeKey === "casa_conera_4") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `casa_conera_4x4_${step + 1}`;
    }
    const step = ((rotationStep % 4) + 4) % 4;
    if (step === 0) return "green_house_1x1_normal";
    return `green_house_1x1_giro${step}`;
  }

  getSpriteImagePathForBuilding(typeKey, rotationStep = 0) {
    if (!this.isSpriteBuilding(typeKey)) return null;
    if (typeKey === "green_temp_outline_1") return "img/casanueva_outline.png";
    if (typeKey === "red_1") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `img/fabricacomida${step + 1}.png`;
    }
    if (typeKey === "blue_1") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `img/fabricabebida${step + 1}.png`;
    }
    if (typeKey === "green_2") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `img/tambo${step + 1}.png`;
    }
    if (typeKey === "casa_conera_4") {
      const step = ((rotationStep % 4) + 4) % 4;
      return `img/casanpc${step + 1}.png`;
    }
    const step = ((rotationStep % 4) + 4) % 4;
    if (step === 0) return "img/green_casa1x1_normal.png";
    return `img/green_casa1x1_giro${step}.png`;
  }

  getSpriteDrawSize(textureKey, typeKey = null) {
    let maxW = TILE_W * 1.03;
    let maxH = TILE_H * 1.60;
    if (typeKey === "red_1" || typeKey === "blue_1") {
      maxW = TILE_W * 1.42;
      maxH = TILE_H * 2.75;
    }
    if (typeKey === "green_2") {
      // Tambo 2x2: render un poco mas grande para cubrir toda la base 2x2.
      maxW = TILE_W * 2.35;
      maxH = TILE_H * 2.95;
    }
    if (typeKey === "casa_conera_4") {
      maxW = TILE_W * 4.5;
      maxH = TILE_H * 5.8;
    }
    const tex = this.textures?.get?.(textureKey);
    const source = tex?.getSourceImage?.();
    if (!source || !source.width || !source.height) {
      return { w: maxW, h: maxH };
    }
    const scale = Math.min(maxW / source.width, maxH / source.height);
    return {
      w: source.width * scale,
      h: source.height * scale
    };
  }

  placeSpriteAtTile(sprite, typeKey, rotationStep, r, c, alpha = 1) {
    if (!sprite) return;
    const textureKey = this.getSpriteTextureForBuilding(typeKey, rotationStep);
    if (!textureKey) {
      sprite.setVisible(false);
      return;
    }
    if (sprite.texture?.key !== textureKey) {
      sprite.setTexture(textureKey);
    }
    const size = this.getSpriteDrawSize(textureKey, typeKey);
    let anchor = isoToScreen(r, c);
    let offsetX = 0;
    let offsetY = TILE_H * 0.31;
    if (typeKey === "red_1" || typeKey === "blue_1") {
      const step = ((rotationStep % 4) + 4) % 4;
      const perStep = [
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ][step] || { x: 0, y: 0 };
      offsetX = perStep.x;
      offsetY = (TILE_H * 0.50) + perStep.y;
    }
    if (typeKey === "green_2") {
      // Para 2x2 usar el punto base del diamante 2x2 (sur/abajo del footprint),
      // no el centro. Esto alinea mejor sprites exportados tipo edificio.
      anchor = isoToScreen(r + 1, c + 1);
      const step = ((rotationStep % 4) + 4) % 4;
      // Ajuste fino por sprite (tambo1..4) para compensar padding del render exportado.
      const perStep = [
        { x: 0, y: -7 }, // tambo1
        { x: -1, y: -7 }, // tambo2
        { x: 0, y: -8 }, // tambo3
        { x: 1, y: -8 }  // tambo4
      ][step] || { x: 0, y: -8 };
      offsetX = perStep.x;
      // +1 tile diagonal en iso equivale a +32px en Y de pantalla.
      // Esto corrige el desfase reportado (se estaba yendo a MJ/MK en vez de MK/ML).
      offsetY = (TILE_H * 1.08) + perStep.y;
    }
    if (typeKey === "casa_conera_4") {
      anchor = isoToScreen(r + 3, c + 3);
      const step = ((rotationStep % 4) + 4) % 4;
      const perStep = [
        { x: 0, y: -20 },
        { x: -2, y: -20 },
        { x: 0, y: -22 },
        { x: 2, y: -22 }
      ][step] || { x: 0, y: -21 };
      offsetX = perStep.x;
      offsetY = (TILE_H * 1.66) + perStep.y;
    }
    sprite.setDisplaySize(size.w, size.h);
    const px = Math.round(anchor.x + offsetX);
    const py = Math.round(anchor.y + offsetY);
    sprite.setPosition(px, py);
    sprite.setAlpha(alpha);
    sprite.setDepth(30 + (py * 0.01));
    sprite.setVisible(true);
  }

  updateBuildingSpriteVisual(b, alpha = 1) {
    if (!b || !b.sprite) return;
    const topLeft = b.cells.reduce((best, cur) => {
      if (!best) return cur;
      return (cur.r + cur.c) < (best.r + best.c) ? cur : best;
    }, null);
    if (!topLeft) return;
    this.placeSpriteAtTile(b.sprite, b.typeKey, b.rotationStep || 0, topLeft.r, topLeft.c, alpha);
    this.applySpriteEditToSprite(b, alpha);
    this.updateSpriteAlignModal();
  }

  getPlacedSpriteHousesForEditor() {
    const list = [];
    for (const b of buildings.values()) {
      if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) continue;
      const edit = this.getSpriteEditStateForBuilding(b);
      list.push({
        id: b.id,
        typeKey: b.typeKey,
        label: (BUILDING_TYPES[b.typeKey]?.label || b.typeKey),
        rotationStep: b.rotationStep || 0,
        textureKey: b.sprite.texture?.key || this.getSpriteTextureForBuilding(b.typeKey, b.rotationStep || 0),
        imagePath: this.getSpriteImagePathForBuilding(b.typeKey, b.rotationStep || 0),
        x: b.sprite.x,
        y: b.sprite.y,
        displayWidth: b.sprite.displayWidth,
        displayHeight: b.sprite.displayHeight,
        alpha: b.sprite.alpha,
        angleDeg: b.sprite.angle || 0,
        edit: { ...edit }
      });
    }
    list.sort((a, b2) => a.id - b2.id);
    return list;
  }

  getPlacedSpriteHouseForEditor(id) {
    const bid = Number(id);
    if (!Number.isFinite(bid)) return null;
    const b = buildings.get(bid);
    if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) return null;
    const edit = this.getSpriteEditStateForBuilding(b);
    return {
      id: b.id,
      typeKey: b.typeKey,
      label: (BUILDING_TYPES[b.typeKey]?.label || b.typeKey),
      rotationStep: b.rotationStep || 0,
      textureKey: b.sprite.texture?.key || this.getSpriteTextureForBuilding(b.typeKey, b.rotationStep || 0),
      imagePath: this.getSpriteImagePathForBuilding(b.typeKey, b.rotationStep || 0),
      x: b.sprite.x,
      y: b.sprite.y,
      displayWidth: b.sprite.displayWidth,
      displayHeight: b.sprite.displayHeight,
      alpha: b.sprite.alpha,
      angleDeg: b.sprite.angle || 0,
      edit: { ...edit }
    };
  }

  applySpriteHouseEditFromEditor(id, patch = {}) {
    const bid = Number(id);
    if (!Number.isFinite(bid)) return null;
    const b = buildings.get(bid);
    if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) return null;
    const merged = { ...this.getSpriteEditStateForBuilding(b), ...(patch || {}) };
    b.spriteEdit = this.normalizeSpriteEditState(merged);
    this.updateBuildingSpriteVisual(b, b.isBuilt ? 1 : 0.3);
    return this.getPlacedSpriteHouseForEditor(bid);
  }

  resetSpriteHouseEditFromEditor(id) {
    const bid = Number(id);
    if (!Number.isFinite(bid)) return null;
    const b = buildings.get(bid);
    if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) return null;
    b.spriteEdit = this.getDefaultSpriteEditStateForType(b.typeKey);
    this.updateBuildingSpriteVisual(b, b.isBuilt ? 1 : 0.3);
    return this.getPlacedSpriteHouseForEditor(bid);
  }

  closeSpriteAlignModal() {
    const modal = document.getElementById("sprite-align-modal");
    if (modal) modal.remove();
  }

  getBuildingCellCodesForDebug(b) {
    if (!b || !Array.isArray(b.cells)) return [];
    const cells = [...b.cells].map((t) => ({ r: t.r, c: t.c }));
    cells.sort((a, b2) => (a.r - b2.r) || (a.c - b2.c));
    return cells.map((t) => this.toGridCodeLabel(t.r, t.c));
  }

  copyTextToClipboard(text) {
    const raw = String(text || "");
    try {
      if (navigator?.clipboard?.writeText) {
        navigator.clipboard.writeText(raw).catch(() => {});
        return;
      }
    } catch (_) {}
    try {
      const ta = document.createElement("textarea");
      ta.value = raw;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    } catch (_) {}
  }

  nudgeSpriteAlign(id, dx = 0, dy = 0) {
    const b = buildings.get(Number(id));
    if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) return null;
    const edit = this.getSpriteEditStateForBuilding(b);
    return this.applySpriteHouseEditFromEditor(b.id, {
      offsetX: (edit.offsetX || 0) + (Number(dx) || 0),
      offsetY: (edit.offsetY || 0) + (Number(dy) || 0)
    });
  }

  nudgeSpriteAlignScale(id, delta = 0) {
    const b = buildings.get(Number(id));
    if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) return null;
    const edit = this.getSpriteEditStateForBuilding(b);
    const nextScale = Phaser.Math.Clamp((Number(edit.scaleX) || 1) + (Number(delta) || 0), 0.05, 8);
    return this.applySpriteHouseEditFromEditor(b.id, {
      scaleX: nextScale,
      scaleY: nextScale
    });
  }

  openSpriteAlignModal(idOrBuilding) {
    this.closeSpriteAlignModal();
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !b.sprite || !this.isSpriteBuilding(b.typeKey)) return;

    const modal = document.createElement("div");
    modal.id = "sprite-align-modal";
    modal.dataset.buildingId = String(b.id);
    modal.dataset.step = "1";
    modal.dataset.scaleStep = "0.05";
    Object.assign(modal.style, {
      position: "fixed",
      left: "12px",
      bottom: "12px",
      width: "min(360px, calc(100vw - 24px))",
      background: "rgba(7, 15, 33, 0.96)",
      border: "1px solid rgba(255,255,255,.12)",
      borderRadius: "14px",
      color: "#e5e7eb",
      zIndex: "999999",
      boxShadow: "0 12px 30px rgba(0,0,0,.4)",
      fontFamily: "Arial,sans-serif"
    });

    modal.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-bottom:1px solid rgba(255,255,255,.08);">
        <div>
          <div style="font-size:15px;font-weight:800;">Calibracion Sprite</div>
          <div id="spriteAlignSub" style="font-size:11px;opacity:.8;">--</div>
        </div>
        <button id="spriteAlignClose" type="button" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);border-radius:9px;padding:6px 9px;cursor:pointer;">X</button>
      </div>

      <div style="padding:10px 12px;display:grid;gap:10px;">
        <div id="spriteAlignCodes" style="font-size:12px;color:#cbd5e1;line-height:1.35;">--</div>

        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <span style="font-size:12px;opacity:.85;">Paso:</span>
          <button data-sprite-align-step="1" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">1px</button>
          <button data-sprite-align-step="2" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">2px</button>
          <button data-sprite-align-step="4" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">4px</button>
          <button data-sprite-align-step="8" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">8px</button>
        </div>

        <div style="display:grid;grid-template-columns:repeat(3,44px);grid-template-rows:repeat(3,36px);gap:6px;justify-content:center;">
          <div></div>
          <button data-sprite-align-nudge="0,-1" type="button" style="border:1px solid #334155;background:#13203a;color:#e5e7eb;border-radius:8px;cursor:pointer;">&#8593;</button>
          <div></div>
          <button data-sprite-align-nudge="-1,0" type="button" style="border:1px solid #334155;background:#13203a;color:#e5e7eb;border-radius:8px;cursor:pointer;">&#8592;</button>
          <button data-sprite-align-nudge="0,0" type="button" id="spriteAlignResetXY" style="border:1px solid #7c2d12;background:#3f1d1d;color:#fecaca;border-radius:8px;cursor:pointer;font-weight:700;">0</button>
          <button data-sprite-align-nudge="1,0" type="button" style="border:1px solid #334155;background:#13203a;color:#e5e7eb;border-radius:8px;cursor:pointer;">&#8594;</button>
          <div></div>
          <button data-sprite-align-nudge="0,1" type="button" style="border:1px solid #334155;background:#13203a;color:#e5e7eb;border-radius:8px;cursor:pointer;">&#8595;</button>
          <div></div>
        </div>

        <div style="display:grid;gap:8px;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <span style="font-size:12px;opacity:.85;">Escala:</span>
            <button data-sprite-align-scale-step="0.02" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">2%</button>
            <button data-sprite-align-scale-step="0.05" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">5%</button>
            <button data-sprite-align-scale-step="0.10" type="button" style="border:1px solid #334155;background:#0f172a;color:#e5e7eb;border-radius:8px;padding:4px 8px;cursor:pointer;">10%</button>
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;">
            <button data-sprite-align-scale="-1" type="button" style="border:1px solid #7f1d1d;background:#3f1d1d;color:#fee2e2;border-radius:8px;padding:7px 12px;cursor:pointer;font-weight:700;">Encoger</button>
            <button id="spriteAlignResetScale" type="button" style="border:1px solid #6b7280;background:#111827;color:#e5e7eb;border-radius:8px;padding:7px 10px;cursor:pointer;font-weight:700;">Escala base</button>
            <button data-sprite-align-scale="1" type="button" style="border:1px solid #0f766e;background:#0f3d39;color:#ccfbf1;border-radius:8px;padding:7px 12px;cursor:pointer;font-weight:700;">Crecer</button>
          </div>
        </div>

        <div id="spriteAlignState" style="font-family:Consolas,monospace;font-size:12px;background:#0b1326;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px;">--</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button id="spriteAlignPreset" type="button" style="border:1px solid #1d4ed8;background:#172554;color:#dbeafe;border-radius:9px;padding:7px 10px;cursor:pointer;font-weight:700;">Preset tipo</button>
          <button id="spriteAlignCopy" type="button" style="border:1px solid #0f766e;background:#0f3d39;color:#ccfbf1;border-radius:9px;padding:7px 10px;cursor:pointer;font-weight:700;">Copiar valores</button>
          <button id="spriteAlignResetAll" type="button" style="border:1px solid #7f1d1d;background:#3f1d1d;color:#fee2e2;border-radius:9px;padding:7px 10px;cursor:pointer;font-weight:700;">Reset spriteEdit</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => this.closeSpriteAlignModal();
    modal.querySelector("#spriteAlignClose")?.addEventListener("click", close);

    modal.addEventListener("click", (e) => {
      const stepBtn = e.target.closest?.("[data-sprite-align-step]");
      if (stepBtn) {
        modal.dataset.step = String(stepBtn.getAttribute("data-sprite-align-step") || "1");
        this.updateSpriteAlignModal();
        return;
      }
      const scaleStepBtn = e.target.closest?.("[data-sprite-align-scale-step]");
      if (scaleStepBtn) {
        modal.dataset.scaleStep = String(scaleStepBtn.getAttribute("data-sprite-align-scale-step") || "0.05");
        this.updateSpriteAlignModal();
        return;
      }
      const nudgeBtn = e.target.closest?.("[data-sprite-align-nudge]");
      if (nudgeBtn) {
        const raw = String(nudgeBtn.getAttribute("data-sprite-align-nudge") || "0,0");
        if (nudgeBtn.id === "spriteAlignResetXY") {
          this.applySpriteHouseEditFromEditor(Number(modal.dataset.buildingId || 0), { offsetX: 0, offsetY: 0 });
          this.updateSpriteAlignModal();
          return;
        }
        const [sx, sy] = raw.split(",");
        const step = Math.max(1, Math.round(Number(modal.dataset.step || "1") || 1));
        this.nudgeSpriteAlign(Number(modal.dataset.buildingId || 0), (Number(sx) || 0) * step, (Number(sy) || 0) * step);
        this.updateSpriteAlignModal();
        return;
      }
      const scaleBtn = e.target.closest?.("[data-sprite-align-scale]");
      if (scaleBtn) {
        const dir = Number(scaleBtn.getAttribute("data-sprite-align-scale") || "0");
        const scaleStep = Number(modal.dataset.scaleStep || "0.05") || 0.05;
        this.nudgeSpriteAlignScale(Number(modal.dataset.buildingId || 0), dir * scaleStep);
        this.updateSpriteAlignModal();
        return;
      }
      const resetScaleBtn = e.target.closest?.("#spriteAlignResetScale");
      if (resetScaleBtn) {
        const bid = Number(modal.dataset.buildingId || 0);
        const bld = buildings.get(bid);
        const base = this.getDefaultSpriteEditStateForType(bld?.typeKey || "");
        this.applySpriteHouseEditFromEditor(bid, {
          scaleX: base.scaleX || 1,
          scaleY: base.scaleY || 1
        });
        this.updateSpriteAlignModal();
        return;
      }
      const copyBtn = e.target.closest?.("#spriteAlignCopy");
      if (copyBtn) {
        const id = Number(modal.dataset.buildingId || 0);
        const s = this.getPlacedSpriteHouseForEditor(id);
        const bld = buildings.get(id);
        if (!s || !bld) return;
        const codes = this.getBuildingCellCodesForDebug(bld).join(", ");
        const payload = [
          `// ${s.label} | id=${s.id} | rot=${s.rotationStep}`,
          `// Celdas: ${codes}`,
          `offsetX: ${s.edit.offsetX},`,
          `offsetY: ${s.edit.offsetY},`,
          `scaleX: ${s.edit.scaleX},`,
          `scaleY: ${s.edit.scaleY},`,
          `rotationDeg: ${s.edit.rotationDeg},`
        ].join("\n");
        this.copyTextToClipboard(payload);
        return;
      }
      const presetBtn = e.target.closest?.("#spriteAlignPreset");
      if (presetBtn) {
        const bid = Number(modal.dataset.buildingId || 0);
        const bld = buildings.get(bid);
        if (!bld) return;
        this.applySpriteHouseEditFromEditor(bid, this.getDefaultSpriteEditStateForType(bld.typeKey));
        this.updateSpriteAlignModal();
        return;
      }
      const resetAllBtn = e.target.closest?.("#spriteAlignResetAll");
      if (resetAllBtn) {
        this.resetSpriteHouseEditFromEditor(Number(modal.dataset.buildingId || 0));
        this.updateSpriteAlignModal();
      }
    });

    this.updateSpriteAlignModal();
  }

  updateSpriteAlignModal() {
    const modal = document.getElementById("sprite-align-modal");
    if (!modal) return;
    const id = Number(modal.dataset.buildingId || 0);
    const b = buildings.get(id);
    const s = this.getPlacedSpriteHouseForEditor(id);
    if (!b || !s) {
      this.closeSpriteAlignModal();
      return;
    }

    const sub = modal.querySelector("#spriteAlignSub");
    const codesEl = modal.querySelector("#spriteAlignCodes");
    const stateEl = modal.querySelector("#spriteAlignState");
    const stepBtns = modal.querySelectorAll("[data-sprite-align-step]");
    const scaleStepBtns = modal.querySelectorAll("[data-sprite-align-scale-step]");
    const step = Math.max(1, Math.round(Number(modal.dataset.step || "1") || 1));
    const scaleStep = Number(modal.dataset.scaleStep || "0.05") || 0.05;

    if (sub) sub.textContent = `${s.label} | id ${s.id} | giro ${s.rotationStep}`;

    const topLeft = b.cells.reduce((best, cur) => {
      if (!best) return cur;
      return (cur.r + cur.c) < (best.r + best.c) ? cur : best;
    }, null);
    const topLeftCode = topLeft ? this.toGridCodeLabel(topLeft.r, topLeft.c) : "-";
    const codes = this.getBuildingCellCodesForDebug(b);
    if (codesEl) {
      codesEl.innerHTML = `
        <div><b>Top-left:</b> ${topLeftCode}</div>
        <div><b>Celdas:</b> ${codes.join(" | ")}</div>
      `;
    }

    if (stateEl) {
      stateEl.textContent = [
        `edit.offsetX = ${s.edit.offsetX}`,
        `edit.offsetY = ${s.edit.offsetY}`,
        `edit.scale  = ${Number(s.edit.scaleX || 1).toFixed(3)}x`,
        `sprite.x/y   = ${Math.round(s.x)} / ${Math.round(s.y)}`,
        `size(w/h)    = ${Math.round(s.displayWidth)} / ${Math.round(s.displayHeight)}`,
        `step         = ${step}px`,
        `step scale   = ${(scaleStep * 100).toFixed(0)}%`,
        `type/rot     = ${s.typeKey} / ${s.rotationStep}`
      ].join("\n");
    }

    stepBtns.forEach((btn) => {
      const v = Number(btn.getAttribute("data-sprite-align-step") || "1");
      const active = v === step;
      btn.style.background = active ? "#1d4ed8" : "#0f172a";
      btn.style.borderColor = active ? "#60a5fa" : "#334155";
    });
    scaleStepBtns.forEach((btn) => {
      const v = Number(btn.getAttribute("data-sprite-align-scale-step") || "0.05");
      const active = Math.abs(v - scaleStep) < 0.0001;
      btn.style.background = active ? "#0f766e" : "#0f172a";
      btn.style.borderColor = active ? "#5eead4" : "#334155";
    });
  }

  registerPngEditorBridge() {
    if (typeof window === "undefined") return;
    window.__yjPngSpriteEditorApi = {
      listSpriteHouses: () => this.getPlacedSpriteHousesForEditor(),
      getSpriteHouseState: (id) => this.getPlacedSpriteHouseForEditor(id),
      applySpriteHouseEdit: (id, patch) => this.applySpriteHouseEditFromEditor(id, patch),
      resetSpriteHouseEdit: (id) => this.resetSpriteHouseEditFromEditor(id)
    };
  }

  setBuildMode() {
    if (this.yapaScanMode) this.stopYapaScanMode();
    if (document.getElementById("evo-modal") || document.getElementById("building-modal") || document.getElementById("producer-modal") || document.getElementById("npc-slots-modal")) {
      this.setCursorMode();
      return;
    }
    mode = "build";
    this.modeText.setText(this.modeLabel());
    this.clearBuffAreaGhost();
    this.cancelBuildBtn.setVisible(true);
    this.cancelBuildBorder.setVisible(true);
  }

  setCursorMode() {
    mode = "cursor";
    this.modeText.setText(this.modeLabel());
    this.clearPending();
    this.ghost.clear();
    this.clearBuffAreaGhost();
    this.ghostSprite?.setVisible(false);
    this.moveGhostSprite?.setVisible(false);
    this.buildRotationStep = 0;
    this.buildPreviewTypeKey = this.selectedBuildKey || "green_1";
    this.cancelBuildBtn.setVisible(false);
    this.cancelBuildBorder.setVisible(false);
  }

  setupBuildHotkeys() {
    if (this._buildHotkeysBound) return;
    this._buildHotkeysBound = true;
    this.input.keyboard?.on("keydown-ESC", () => {
      if (mode !== "build") return;
      this.setCursorMode();
    });
  }

  rotateBuildPreview() {
    if (mode !== "build") return;
    const preview = this.getBuildPreview();
    if (!this.canRotateBuilding(preview.typeKey)) return;

    this.buildRotationStep = ((preview.rotationStep || 0) + 1) % 4;

    if (this.pending) {
      this.pending.rotationStep = this.buildRotationStep;
      this.pending.ok = this.canPlaceBuildAt(
        this.pending.typeKey || this.getBuildPreview().typeKey,
        this.pending.size,
        this.pending.tile.r,
        this.pending.tile.c,
        this.pending.rotationStep || this.buildRotationStep || 0
      );
      this.renderPendingGhost();
      this.showConfirmButtons(this.pending.ok);
      return;
    }

    const pointer = this.input?.activePointer;
    if (!pointer || pointer.y <= 140) return;
    const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
    if (!tile) {
      this.ghost.clear();
      this.clearBuffAreaGhost();
      this.ghostSprite?.setVisible(false);
      return;
    }

    const refreshed = this.getBuildPreview();
    const size = refreshed.size;
    const placeAt = this.getPlacementTopLeftForHoverTile(tile, size);
    const ok = this.canPlaceBuildAt(refreshed.typeKey, size, placeAt.r, placeAt.c, refreshed.rotationStep || 0);
    const okColor = refreshed.def.fill ?? 0x22c55e;
    const okBorder = refreshed.def.border ?? okColor;
    const badColor = 0xf87171;

    const cells = [];
    for (let r = placeAt.r; r < placeAt.r + size; r++) {
      for (let c = placeAt.c; c < placeAt.c + size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }

    this.ghost.clear();
    if (this.isProducerBuilding(refreshed.typeKey) && !this.isSpriteBuilding(refreshed.typeKey)) {
      this.drawProducerCubes(this.ghost, cells, ok ? okColor : badColor, 0.25, ok ? okBorder : badColor);
    } else {
      this.drawCells(this.ghost, cells, ok ? okColor : badColor, 0.25, ok ? okBorder : badColor);
    }
    this.drawBuffAreaGhostForPlacement(refreshed.typeKey, placeAt.r, placeAt.c, size, 0);

    if (this.isSpriteBuilding(refreshed.typeKey)) {
      this.placeSpriteAtTile(this.ghostSprite, refreshed.typeKey, refreshed.rotationStep || 0, placeAt.r, placeAt.c, ok ? 0.55 : 0.42);
      this.applyDefaultSpriteEditToLooseSprite(this.ghostSprite, refreshed.typeKey, ok ? 0.55 : 0.42);
    } else {
      this.ghostSprite?.setVisible(false);
    }
  }
  uiGuard(pointer) {
    this.uiClick = true;
    if (pointer?.event) {
      pointer.event.preventDefault?.();
      pointer.event.stopPropagation?.();
    }
  }

  clearBuffAreaGhost() {
    this.hoverAuraBuildingId = null;
    this.buffAreaGhost?.clear();
  }

  drawIsoAuraPolygon(centerR, centerC, radiusTiles) {
    if (!this.buffAreaGhost || !Number.isFinite(centerR) || !Number.isFinite(centerC)) {
      this.clearBuffAreaGhost();
      return;
    }
    const steps = 56;
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const rr = centerR + (Math.cos(a) * radiusTiles);
      const cc = centerC + (Math.sin(a) * radiusTiles);
      points.push(isoToScreen(rr, cc));
    }

    this.buffAreaGhost.clear();
    this.buffAreaGhost.fillStyle(0x38bdf8, 0.12);
    this.buffAreaGhost.beginPath();
    this.buffAreaGhost.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.buffAreaGhost.lineTo(points[i].x, points[i].y);
    }
    this.buffAreaGhost.closePath();
    this.buffAreaGhost.fillPath();
    this.buffAreaGhost.lineStyle(2, 0x7dd3fc, 0.92);
    this.buffAreaGhost.beginPath();
    this.buffAreaGhost.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.buffAreaGhost.lineTo(points[i].x, points[i].y);
    }
    this.buffAreaGhost.closePath();
    this.buffAreaGhost.strokePath();
  }

  drawBuffAreaGhostForBuilding(b) {
    if (!this.buffAreaGhost || !this.isAuraSourceBuilding(b)) {
      this.clearBuffAreaGhost();
      return;
    }
    const center = this.getBuildingGridCenter(b);
    if (!center) {
      this.clearBuffAreaGhost();
      return;
    }

    const aura = this.getDecorAuraFromLevel(b.evoLevel || 0);
    this.drawIsoAuraPolygon(center.r, center.c, aura.radiusTiles);
  }

  drawBuffAreaGhostForPlacement(typeKey, r0, c0, size = 1, evoLevel = 0) {
    if (!this.isDecorativeHouse(typeKey)) {
      this.clearBuffAreaGhost();
      return;
    }
    const aura = this.getDecorAuraFromLevel(evoLevel || 0);
    const centerR = r0 + ((Math.max(1, size) - 1) * 0.5);
    const centerC = c0 + ((Math.max(1, size) - 1) * 0.5);
    this.drawIsoAuraPolygon(centerR, centerC, aura.radiusTiles);
  }

  updateBuffAreaGhostFromPointer(pointer) {
    if (!pointer) {
      this.clearBuffAreaGhost();
      return;
    }
    if (this.hasBlockingDomOverlay() || pointer.y <= 140 || mode === "build" || this.moveMode) {
      this.clearBuffAreaGhost();
      return;
    }

    const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
    if (!tile || !inBounds(tile.r, tile.c)) {
      this.clearBuffAreaGhost();
      return;
    }

    const idOnTile = grid[tile.r][tile.c];
    const b = idOnTile ? buildings.get(idOnTile) : null;
    if (!this.isAuraSourceBuilding(b)) {
      this.clearBuffAreaGhost();
      return;
    }

    this.hoverAuraBuildingId = b.id;
    this.drawBuffAreaGhostForBuilding(b);
  }


  createCancelBuildButton(regUI) {
    const style = { fontFamily: "Arial", fontSize: "16px", color: "#22c55e", backgroundColor: "#020617" };

    this.cancelBuildBtn = regUI(
      this.add.text(280, 86, "Cancelar", style)
        .setPadding(12, 8, 12, 8)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setVisible(false)
        .setDepth(9999)
    );

    this.cancelBuildBorder = regUI(this.add.graphics().setScrollFactor(0).setVisible(false).setDepth(9998));

    const draw = () => {
      this.cancelBuildBorder.clear();
      this.cancelBuildBorder.lineStyle(1, 0x22c55e, 1);
      this.cancelBuildBorder.strokeRoundedRect(278, 84, this.cancelBuildBtn.width + 4, this.cancelBuildBtn.height + 4, 8);
    };
    draw();

    this.cancelBuildBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.setCursorMode();
    });
  }

  createCancelSelectButton(regUI) {
    const style = { fontFamily: "Arial", fontSize: "16px", color: "#f59e0b", backgroundColor: "#020617" };

    this.cancelSelectBtn = regUI(
      this.add.text(390, 86, "Cancelar", style)
        .setPadding(12, 8, 12, 8)
        .setInteractive({ useHandCursor: true })
        .setScrollFactor(0)
        .setVisible(false)
        .setDepth(9999)
    );

    this.cancelSelectBorder = regUI(this.add.graphics().setScrollFactor(0).setVisible(false).setDepth(9998));

    const draw = () => {
      this.cancelSelectBorder.clear();
      this.cancelSelectBorder.lineStyle(1, 0xf59e0b, 1);
      this.cancelSelectBorder.strokeRoundedRect(388, 84, this.cancelSelectBtn.width + 4, this.cancelSelectBtn.height + 4, 8);
    };
    draw();

    this.cancelSelectBtn.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.closeBuildingMenu();
      this.setCursorMode();
    });
  }

  // ===== Confirm (check / x) =====
  createConfirmButtons(regUI) {
    const okStyle = { fontFamily: "Arial", fontSize: "14px", color: "#022c22", backgroundColor: "#22c55e" };
    const xStyle  = { fontFamily: "Arial", fontSize: "14px", color: "#e5e7eb", backgroundColor: "#0f172a" };

    this.confirmOk = regUI(
      this.add.text(0, 0, "\u2714", okStyle)
        .setPadding(8, 5, 8, 5)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setVisible(false)
        .setDepth(9999)
    );

    this.confirmX = regUI(
      this.add.text(0, 0, "\u2716", xStyle)
        .setPadding(8, 5, 8, 5)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setVisible(false)
        .setDepth(9999)
    );

    this.attachOverUI(this.confirmOk);
    this.attachOverUI(this.confirmX);

    this.confirmOk.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      if (!this.pending || !this.pending.ok) return;
      const { tile } = this.pending;
      this.placeBuilding(tile.r, tile.c);
      this.clearPending();
    });

    this.confirmX.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.clearPending();
      this.ghost.clear();
    });
  }

  showConfirmButtons(ok) {
    this.confirmOk.setVisible(true);
    this.confirmX.setVisible(true);

    if (!ok) {
      this.confirmOk.setAlpha(0.25);
      this.confirmOk.disableInteractive();
    } else {
      this.confirmOk.setAlpha(1);
      this.confirmOk.setInteractive({ useHandCursor: true });
    }
  }

  updateConfirmButtonsPosition() {
    if (!this.pending) return;
    
    

    // [OK] convertir a pantalla considerando zoom
    
    const x = this.pending.clickX;
    const y = this.pending.clickY;

    const oy = 18;
    const gap = 12;
    const okW = this.confirmOk.width;
    this.confirmOk.setPosition(x - okW - (gap * 0.5), y + oy);
    this.confirmX.setPosition(x + (gap * 0.5), y + oy);
  }

  clearPending() {
    this.pending = null;
    this.confirmOk.setVisible(false);
    this.confirmX.setVisible(false);
    this.clearBuffAreaGhost();
    this.ghostSprite?.setVisible(false);
  }

  renderPendingGhost() {
    if (!this.pending) return;
    const { tile, size, ok, color, border, rotationStep } = this.pending;
    const preview = this.getBuildPreview();

    this.ghost.clear();
    const okColor = color ?? 0x22c55e;
    const okBorder = border ?? okColor;
    const badColor = 0xf87171;

    const cells = [];
    for (let r = tile.r; r < tile.r + size; r++) {
      for (let c = tile.c; c < tile.c + size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }
    if (this.isProducerBuilding(preview.typeKey) && !this.isSpriteBuilding(preview.typeKey)) {
      this.drawProducerCubes(this.ghost, cells, ok ? okColor : badColor, 0.35, ok ? okBorder : badColor);
    } else {
      this.drawCells(this.ghost, cells, ok ? okColor : badColor, 0.35, ok ? okBorder : badColor);
    }
    this.drawBuffAreaGhostForPlacement(preview.typeKey, tile.r, tile.c, size, 0);
    if (this.isSpriteBuilding(preview.typeKey)) {
      this.placeSpriteAtTile(this.ghostSprite, preview.typeKey, preview.rotationStep || 0, tile.r, tile.c, ok ? 0.55 : 0.42);
      this.applyDefaultSpriteEditToLooseSprite(this.ghostSprite, preview.typeKey, ok ? 0.55 : 0.42);
    } else {
      this.ghostSprite?.setVisible(false);
    }
  }

  // ===== Action buttons =====
  createActionButtons(regUI) {
    const baseStyle   = { fontFamily: "Arial", fontSize: "21px", color: "#e5e7eb", backgroundColor: "#020617" };
    const dangerStyle = { fontFamily: "Arial", fontSize: "21px", color: "#f87171", backgroundColor: "#020617" };

    this.actRotate = regUI(
      this.add.text(0, 0, "\u27F2", baseStyle)
        .setPadding(12, 8, 12, 8).setScrollFactor(0)
        .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(9999)
    );

    this.actMove = regUI(
      this.add.text(0, 0, "\u270B", baseStyle)
        .setPadding(12, 8, 12, 8).setScrollFactor(0)
        .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(9999)
    );

    this.actTrash = regUI(
      this.add.text(0, 0, "\u{1F5D1}", dangerStyle)
        .setPadding(12, 8, 12, 8).setScrollFactor(0)
        .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(9999)
    );

    this.attachOverUI(this.actRotate);
    this.attachOverUI(this.actMove);
    this.attachOverUI(this.actTrash);

    this.actRotate.on("pointerdown", (pointer) => { this.uiGuard(pointer); this.rotateSelected(); });
    this.actMove.on("pointerdown", (pointer) => { this.uiGuard(pointer); this.startMoveSelected(); this.closeBuildingMenu(); });
    this.actTrash.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.destroySelected();
      this.closeBuildingMenu();
      this.setCursorMode();
    });
  }

  attachOverUI(obj) {
    obj.on("pointerover", () => { this.overUI = true; });
    obj.on("pointerout",  () => { this.overUI = false; });
  }

  showActionButtons() {
    const b = this.selectedBuildingId ? buildings.get(this.selectedBuildingId) : null;
    this.actRotate.setVisible(!!(b && this.canRotateBuilding(b.typeKey)));
    this.actMove.setVisible(true);
    this.actTrash.setVisible(true);
  }

  hideActionButtons() {
    this.actRotate.setVisible(false);
    this.actMove.setVisible(false);
    this.actTrash.setVisible(false);
    this.overUI = false;
  }

  updateActionButtonsPosition() {
    if (!this.selectedBuildingId) return;
  
    

    // [OK] convertir a pantalla considerando zoom
    const x = this.actionClickX ?? 0;
    const y = this.actionClickY ?? 0;
    

    const oy = -60;
    this.actRotate.setPosition(x - 50, y + oy);
    this.actMove.setPosition(x, y + oy);
    this.actTrash.setPosition(x + 50, y + oy);
  }

  openBuildingMenu(idOnTile, pointer) {
    if (mode === "build") return;
    this.closeBuildingMenu();
    this.clearPending();
    this.ghost.clear();

    const selected = buildings.get(idOnTile);
    if (this.isBuildingInfoLocked(selected, Date.now())) {
      this.selectedBuildingId = null;
      return;
    }
    this.selectedBuildingId = idOnTile;
    if (selected?.typeKey === "road_main_2x2") {
      this.normalizeRoadBuildingState(selected, true);
      this.refreshRoadVisualsAroundCells(selected.cells, 1);
    }

    this.actionClickX = pointer.x;
    this.actionClickY = pointer.y;

    if (this.isProducerBuilding(selected?.typeKey)) {
      this.openProducerRecipeModal(idOnTile);
    } else {
      this.openBuildingInfoModal(idOnTile);
    }
    this.cancelSelectBtn.setVisible(true);
    this.cancelSelectBorder.setVisible(true);

    mode = "cursor";
    this.modeText.setText(this.modeLabel());
    this.cancelBuildBtn.setVisible(false);
    this.cancelBuildBorder.setVisible(false);
  }

  closeBuildingMenu() {
    this.selectedBuildingId = null;
    this.hideActionButtons();
    this.cancelSelectBtn?.setVisible(false);
    this.cancelSelectBorder?.setVisible(false);
    this.closeBuildingInfoModal();
    this.closeProducerRecipeModal();
  }

  getRarityForKey(typeKey) {
    if (!typeKey) return 2;
    if (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS?.[typeKey]) {
      const directRarity = Math.max(1, Math.round(Number(ITEM_DEFS[typeKey].rarity) || 1));
      return directRarity;
    }
    if (typeKey === "producer_food_1x1" || typeKey === "producer_drink_1x1" || typeKey === "producer_snack_1x1") return 1;
    if (typeKey === "road_main_2x2") return 1;
    if (typeof typeKey === "string" && (typeKey.startsWith("perm_") || typeKey.startsWith("lim_"))) return 5;
    return 2;
  }

  getColorForKey(typeKey) {
    if (!typeKey) return null;
    if (typeKey === "road_main_2x2") return "road";
    if (typeKey === "lim_gold_2") return "gold";
    if (typeKey === "producer_food_1x1") return "red";
    if (typeKey === "producer_drink_1x1") return "blue";
    if (typeKey === "producer_snack_1x1") return "purple";
    if (typeKey === "casa_conera_4") return "conera";
    const colorFamilies = ["green", "red", "blue", "yellow", "orange", "pink"];
    for (const family of colorFamilies) {
      if (typeKey.startsWith(`${family}_`) || typeKey === `perm_${family}_9`) return family;
    }
    return null;
  }

  isNpcResidenceBuilding(typeKey) {
    return typeKey === "casa_conera_4";
  }

  isStreetNpcSourceBuilding(typeKey) {
    return this.isDecorativeHouse(typeKey) || this.isNpcResidenceBuilding(typeKey);
  }

  isLargeOccluderBuilding(typeKey) {
    if (!this.isSpriteBuilding(typeKey)) return false;
    const size = Number(BUILDING_TYPES[typeKey]?.size) || 0;
    return size >= 4;
  }

  getSpriteOcclusionGhostAlpha(baseAlpha = 1) {
    const alpha = Number(baseAlpha) || 0;
    return Phaser.Math.Clamp(Math.min(alpha * 0.24, 0.18), 0.08, 0.18);
  }

  getEffectiveSpriteAlphaForBuilding(b, baseAlpha = 1) {
    if (!b) return Phaser.Math.Clamp(Number(baseAlpha) || 0, 0, 1);
    if (Number(this.occlusionGhostBuildingId || 0) === Number(b.id || 0)) {
      return this.getSpriteOcclusionGhostAlpha(baseAlpha);
    }
    return Phaser.Math.Clamp(Number(baseAlpha) || 0, 0, 1);
  }

  refreshGhostableBuildingVisual(id) {
    const bid = Number(id || 0);
    if (!Number.isFinite(bid) || bid <= 0) return;
    const b = buildings.get(bid);
    if (!b || !b.sprite || !this.isLargeOccluderBuilding(b.typeKey)) return;
    this.updateBuildingSpriteVisual(b, b.isBuilt ? 1 : 0.3);
  }

  setOcclusionGhostBuilding(id = null) {
    const nextId = Number.isFinite(Number(id)) ? Number(id) : null;
    const prevId = Number.isFinite(Number(this.occlusionGhostBuildingId)) ? Number(this.occlusionGhostBuildingId) : null;
    if (prevId === nextId) return;
    this.occlusionGhostBuildingId = nextId;
    if (prevId) this.refreshGhostableBuildingVisual(prevId);
    if (nextId) this.refreshGhostableBuildingVisual(nextId);
  }

  isPointerInsideBuildingFootprint(pointer, b) {
    if (!pointer || !b?.cells?.length) return false;
    const world = this.getPointerWorldPoint(pointer);
    if (!world) return false;
    const tile = screenToIsoTile(world.x, world.y);
    if (!tile) return false;
    return (grid?.[tile.r]?.[tile.c] || 0) === Number(b.id || 0);
  }

  getPointerWorldPoint(pointer) {
    if (!pointer || !this.worldCam?.getWorldPoint) return null;
    const p = this.worldCam.getWorldPoint(pointer.x, pointer.y);
    if (!p) return null;
    return { x: p.x, y: p.y };
  }

  isPointerInsideBuildingSprite(pointer, b) {
    if (!pointer || !b?.sprite?.visible || !b.sprite.active) return false;
    const bounds = typeof b.sprite.getBounds === "function" ? b.sprite.getBounds() : null;
    if (!bounds) return false;
    const world = this.getPointerWorldPoint(pointer);
    if (!world) return false;
    return bounds.contains(world.x, world.y);
  }

  getScreenBoundsForCells(cells) {
    if (!Array.isArray(cells) || !cells.length) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const cell of cells) {
      if (!cell || !inBounds(cell.r, cell.c)) continue;
      const p = isoToScreen(cell.r, cell.c);
      minX = Math.min(minX, p.x - (TILE_W * 0.5));
      maxX = Math.max(maxX, p.x + (TILE_W * 0.5));
      minY = Math.min(minY, p.y - (TILE_H * 0.5));
      maxY = Math.max(maxY, p.y + (TILE_H * 0.5));
    }
    if (!Number.isFinite(minX) || !Number.isFinite(minY) || !Number.isFinite(maxX) || !Number.isFinite(maxY)) {
      return null;
    }
    return new Phaser.Geom.Rectangle(minX, minY, Math.max(1, maxX - minX), Math.max(1, maxY - minY));
  }

  getPlacementCellsForArea(r0, c0, size) {
    const cells = [];
    for (let r = r0; r < r0 + size; r++) {
      for (let c = c0; c < c0 + size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }
    return cells;
  }

  getBuildPreviewOcclusionBounds(pointer) {
    if (this.pending?.tile && this.pending?.size) {
      return this.getScreenBoundsForCells(
        this.getPlacementCellsForArea(this.pending.tile.r, this.pending.tile.c, this.pending.size)
      );
    }
    if (mode !== "build" || this.selectedBuildingId) return null;
    if (!pointer) return null;
    const world = this.getPointerWorldPoint(pointer);
    if (!world) return null;
    const tile = screenToIsoTile(world.x, world.y);
    if (!tile) return null;
    const preview = this.getBuildPreview();
    const placeAt = this.getPlacementTopLeftForHoverTile(tile, preview.size);
    return this.getScreenBoundsForCells(
      this.getPlacementCellsForArea(placeAt.r, placeAt.c, preview.size)
    );
  }

  doScreenBoundsOverlap(a, b) {
    if (!a || !b) return false;
    return Phaser.Geom.Intersects.RectangleToRectangle(a, b);
  }

  getOcclusionGhostBuildingForPointer(pointer) {
    if (!pointer || this.hasBlockingDomOverlay() || this.moveMode || pointer.y <= 140) return null;
    const buildBounds = this.getBuildPreviewOcclusionBounds(pointer);

    let best = null;
    let bestDepth = -Infinity;
    for (const b of buildings.values()) {
      if (!b?.isBuilt || !b.sprite || !this.isLargeOccluderBuilding(b.typeKey)) continue;
      const spriteBounds = typeof b.sprite.getBounds === "function" ? b.sprite.getBounds() : null;
      const hit = this.isPointerInsideBuildingFootprint(pointer, b)
        || this.isPointerInsideBuildingSprite(pointer, b)
        || (buildBounds && this.doScreenBoundsOverlap(spriteBounds, buildBounds));
      if (!hit) continue;
      const depth = Number(b.sprite.depth || 0);
      if (depth >= bestDepth) {
        best = b;
        bestDepth = depth;
      }
    }
    return best;
  }

  updateOcclusionGhostFromPointer(pointer = null) {
    const p = pointer || this.input?.activePointer || null;
    const target = this.getOcclusionGhostBuildingForPointer(p);
    this.setOcclusionGhostBuilding(target ? target.id : null);
  }

  isDecorativeHouse(typeKey) {
    return typeKey === "green_1" || typeKey === "green_temp_outline_1";
  }

  isProducerBuilding(typeKey) {
    return !!PRODUCER_TYPE_GROUP[typeKey];
  }

  getProducerGroup(typeKey) {
    return PRODUCER_TYPE_GROUP[typeKey] || null;
  }

  isRotationDisabledBuilding(typeKey) {
    return typeKey === "road_main_2x2";
  }

  canRotateBuilding(typeKey) {
    return !this.isRotationDisabledBuilding(typeKey);
  }

  isEvolutionDisabledBuilding(typeKey) {
    return typeKey === "road_main_2x2" || this.isProducerBuilding(typeKey);
  }

  getDecorAuraFromLevel(level) {
    const clamped = Math.max(0, Math.min(DECOR_AURA_MAX_LEVEL, level || 0));
    const buildReduction = Math.min(
      DECOR_AURA_BUILD_REDUCTION_CAP,
      DECOR_AURA_BUILD_REDUCTION_BASE + (DECOR_AURA_BUILD_REDUCTION_PER_LEVEL * clamped)
    );
    const prodBoost = Math.min(
      DECOR_AURA_PROD_BOOST_CAP,
      DECOR_AURA_PROD_BOOST_BASE + (DECOR_AURA_PROD_BOOST_PER_LEVEL * clamped)
    );
    return {
      level: clamped,
      radiusTiles: DECOR_AURA_RADIUS_BASE_TILES + (DECOR_AURA_RADIUS_PER_LEVEL_TILES * clamped),
      buildReduction,
      prodBoost
    };
  }

  getBuildingGridCenter(b) {
    if (!b?.cells?.length) return null;
    let rSum = 0;
    let cSum = 0;
    for (const cell of b.cells) {
      rSum += cell.r;
      cSum += cell.c;
    }
    return {
      r: rSum / b.cells.length,
      c: cSum / b.cells.length
    };
  }


  isNpcSlotEligibleBuildingType(typeKey) {
    if (!typeKey) return false;
    if (typeKey === "road_main_2x2") return false;
    if (this.isDecorativeHouse(typeKey)) return false;
    if (this.isProducerBuilding(typeKey)) return true;
    if (this.hasBuildingActivation(typeKey)) return true;
    const rarity = this.getRarityForKey(typeKey);
    return rarity >= 3 && rarity <= 5;
  }

  getNpcSlotCountForBuildingType(typeKey) {
    if (this.isProducerBuilding(typeKey) || this.hasBuildingActivation(typeKey)) {
      return this.isNpcSlotEligibleBuildingType(typeKey) ? NPC_SLOT_MAX_SPECIAL_BUILDING : 0;
    }
    return this.isNpcSlotEligibleBuildingType(typeKey) ? NPC_SLOT_MAX : 0;
  }

  ensureNpcEvolutionLevels() {
    if (!this.npcEvolutionLevels || typeof this.npcEvolutionLevels !== "object") {
      this.npcEvolutionLevels = Object.create(null);
    }
    return this.npcEvolutionLevels;
  }

  getNpcEvolutionLevelForKey(npcKey) {
    const key = String(npcKey || "").trim();
    if (!key) return 0;
    const evoMap = this.ensureNpcEvolutionLevels();
    const raw = Number(evoMap[key]);
    if (!Number.isFinite(raw)) return 0;
    return Math.max(0, Math.min(5, Math.round(raw)));
  }

  getNpcRarityForKey(npcKey) {
    const key = String(npcKey || "").trim();
    if (!key) return 1;
    const def = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS?.[key]) ? ITEM_DEFS[key] : null;
    const defRarity = Number(def?.rarity);
    if (Number.isFinite(defRarity)) {
      return Math.max(1, Math.min(5, Math.round(defRarity)));
    }
    const m = key.match(/_(\d)$/);
    if (m) {
      const parsed = Number(m[1]);
      if (Number.isFinite(parsed)) return Math.max(1, Math.min(5, Math.round(parsed)));
    }
    return 1;
  }

  getNpcRoleForKey(npcKey) {
    const key = String(npcKey || "").toLowerCase();
    if (!key) return "reward";
    const def = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS?.[key]) ? ITEM_DEFS[key] : null;
    const directRole = String(def?.npcRole || "").trim().toLowerCase();
    if (directRole === "build" || directRole === "prod" || directRole === "reward") return directRole;
    if (key.includes("minuscula") || key.includes("minusculas") || key.includes("sds")) return "prod";
    if (key.includes("ivybunny") || key.includes("dextervt")) return "build";
    return "reward";
  }

  getResidentNpcCapacityForBuilding(buildingOrType, evoLevelOverride = null) {
    const typeKey = (typeof buildingOrType === "object")
      ? String(buildingOrType?.typeKey || "")
      : String(buildingOrType || "");
    if (!this.isNpcResidenceBuilding(typeKey)) return 0;

    const evoLevel = (evoLevelOverride !== null && evoLevelOverride !== undefined)
      ? Number(evoLevelOverride)
      : ((typeof buildingOrType === "object") ? Number(buildingOrType?.evoLevel || 0) : 0);
    const level = Math.max(0, Math.min(5, Math.round(Number.isFinite(evoLevel) ? evoLevel : 0)));
    return Math.max(
      CASA_CONERA_RESIDENT_BASE,
      Math.min(CASA_CONERA_RESIDENT_MAX, CASA_CONERA_RESIDENT_BASE + level)
    );
  }

  ensureResidentNpcSlotsForBuilding(b) {
    if (!b || !this.isNpcResidenceBuilding(b.typeKey)) {
      if (b && !Array.isArray(b.residentNpcSlots)) b.residentNpcSlots = [];
      return Array.isArray(b?.residentNpcSlots) ? b.residentNpcSlots : [];
    }

    const slotCount = this.getResidentNpcCapacityForBuilding(b);
    const current = Array.isArray(b.residentNpcSlots) ? b.residentNpcSlots : [];
    if (current.length > slotCount) {
      for (let i = slotCount; i < current.length; i++) {
        const extraKey = String(current[i]?.key || "").trim();
        if (extraKey.startsWith("npc_")) {
          this.economy?.addItem?.(extraKey, 1);
        }
      }
    }

    const next = [];
    for (let i = 0; i < slotCount; i++) {
      const entry = current[i];
      const key = String(entry?.key || "").trim();
      if (!key.startsWith("npc_")) {
        next.push(null);
        continue;
      }
      const evo = Number.isFinite(Number(entry?.evo))
        ? Math.max(0, Math.min(5, Math.round(Number(entry.evo))))
        : this.getNpcEvolutionLevelForKey(key);
      next.push({ key, evo });
    }
    b.residentNpcSlots = next;
    return next;
  }

  getResidentNpcActiveCountForBuilding(idOrBuilding) {
    const buildingId = (typeof idOrBuilding === "object")
      ? Number(idOrBuilding?.id || 0)
      : Number(idOrBuilding || 0);
    if (!Number.isFinite(buildingId) || buildingId <= 0) return 0;
    let count = 0;
    for (const npc of this.streetNpcs) {
      if (npc?.spawnSource !== "conera") continue;
      if ((Number(npc.homeBuildingId) || 0) !== buildingId) continue;
      count++;
    }
    return count;
  }

  getResidentNpcSummaryForBuilding(b) {
    const capacity = this.getResidentNpcCapacityForBuilding(b);
    if (capacity <= 0) return "Residentes NPC: No disponible";
    const slots = this.ensureResidentNpcSlotsForBuilding(b);
    const filled = slots.filter((slot) => !!String(slot?.key || "").trim()).length;
    const active = this.getResidentNpcActiveCountForBuilding(b);
    return `Residentes NPC: ${filled}/${capacity} | En mundo: ${active}`;
  }

  isNpcInstalledInAnyBuilding(npcKey) {
    const key = String(npcKey || "").trim();
    if (!key.startsWith("npc_")) return false;
    for (const b of buildings.values()) {
      const slots = Array.isArray(b?.npcSlots) ? b.npcSlots : [];
      if (slots.some((slot) => String(slot?.key || "").trim() === key)) return true;
      const residentSlots = Array.isArray(b?.residentNpcSlots) ? b.residentNpcSlots : [];
      if (residentSlots.some((slot) => String(slot?.key || "").trim() === key)) return true;
    }
    return false;
  }

  getInstalledNpcEntriesForRoster() {
    const entries = [];
    for (const b of buildings.values()) {
      const def = BUILDING_TYPES[b?.typeKey] || null;
      const buildingLabel = String(def?.label || b?.typeKey || "Edificio");
      const slots = Array.isArray(b?.npcSlots) ? b.npcSlots : [];
      for (let i = 0; i < slots.length; i++) {
        const key = String(slots[i]?.key || "").trim();
        if (!key.startsWith("npc_")) continue;
        entries.push({
          key,
          installedInBuilding: true,
          buildingId: Number(b?.id || 0),
          buildingTypeKey: String(b?.typeKey || ""),
          buildingLabel,
          slotIndex: i,
          slotKind: "npc"
        });
      }
      const residentSlots = Array.isArray(b?.residentNpcSlots) ? b.residentNpcSlots : [];
      for (let i = 0; i < residentSlots.length; i++) {
        const key = String(residentSlots[i]?.key || "").trim();
        if (!key.startsWith("npc_")) continue;
        entries.push({
          key,
          installedInBuilding: true,
          buildingId: Number(b?.id || 0),
          buildingTypeKey: String(b?.typeKey || ""),
          buildingLabel,
          slotIndex: i,
          slotKind: "resident"
        });
      }
    }
    return entries;
  }

  syncResidentNpcWorldSpawns(b, now = Date.now()) {
    if (!b || !this.isNpcResidenceBuilding(b.typeKey)) return;
    const slots = this.ensureResidentNpcSlotsForBuilding(b);

    const activeSlots = new Set();
    for (let i = this.streetNpcs.length - 1; i >= 0; i--) {
      const npc = this.streetNpcs[i];
      if (npc?.spawnSource !== "conera") continue;
      if ((Number(npc.homeBuildingId) || 0) !== Number(b.id)) continue;

      const slotIndex = Math.max(0, Math.round(Number(npc.residentSlotIndex) || 0));
      const entry = slots[slotIndex];
      const expectedKey = String(entry?.key || "").trim();
      if (!b.isBuilt || !expectedKey || expectedKey !== String(npc.residentNpcKey || "")) {
        this.removeStreetNpcAt(i);
        continue;
      }
      const slotEvo = Math.max(
        0,
        Math.min(
          5,
          Math.round(
            Number.isFinite(Number(entry?.evo))
              ? Number(entry.evo)
              : this.getNpcEvolutionLevelForKey(expectedKey)
          )
        )
      );
      if (Number(npc.npcEvolutionLevel) !== slotEvo) {
        npc.npcEvolutionLevel = slotEvo;
      }
      if (this.hasStreetNpcGameplayStats(npc)) {
        const updatedCap = this.getStreetNpcStaminaCap(npc);
        npc.worldStaminaCap = updatedCap;
        npc.worldStamina = Phaser.Math.Clamp(Number(npc.worldStamina) || updatedCap, 0, updatedCap);
      }
      activeSlots.add(slotIndex);
    }

    if (!b.isBuilt) return;

    for (let i = 0; i < slots.length; i++) {
      const npcKey = String(slots[i]?.key || "").trim();
      if (!npcKey.startsWith("npc_")) continue;
      if (activeSlots.has(i)) continue;
      if (!this.canResidentNpcSlotSpawnAtHour(b, i, npcKey, now)) continue;
      if (!this.spawnStreetNpcFromResidentBuilding(b, i, now)) break;
    }
  }

  sampleTrafficRoutine01(seed = 0) {
    const n = Number(seed) || 0;
    const x = Math.sin((n * 12.9898) + 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  getTrafficPhaseKey(now = Date.now()) {
    const label = String(this.dayCycleState?.phaseLabel || this.getDayCyclePhaseLabel(this.dayCycleState?.progress || 0)).toUpperCase();
    if (label.includes("MADRUGADA")) return "madrugada";
    if (label.includes("NOCHE")) return "noche";
    if (label.includes("TARDE")) return "tarde";
    return "dia";
  }

  isTrafficSleepPhase(now = Date.now(), npc = null) {
    const h = this.getTrafficClockHourFloat(now);
    const inBaseSleepWindow = h >= TRAFFIC_NPC_SLEEP_WINDOW_START_HOUR || h < TRAFFIC_NPC_SLEEP_WINDOW_END_HOUR;
    if (!inBaseSleepWindow) return false;
    if (npc && this.canStreetNpcNightOwlStayOut(npc, now)) {
      const schedule = npc.sleepSchedule || {};
      const lateUntil = Number.isFinite(Number(schedule.overnightActiveUntil))
        ? Number(schedule.overnightActiveUntil)
        : 2.8;
      if (h >= TRAFFIC_NPC_SLEEP_WINDOW_START_HOUR || h < lateUntil) return false;
    }
    return true;
  }

  getTrafficRoutineSnapshot(now = Date.now()) {
    let decorHouseCount = 0;
    let shopCount = 0;
    let sourceCount = 0;
    for (const b of buildings.values()) {
      if (!b?.isBuilt) continue;
      if (this.isStreetNpcSourceBuilding(b.typeKey)) sourceCount++;
      if (this.isDecorativeHouse(b.typeKey)) decorHouseCount++;
      if (this.isMinimarketBuilding(b.typeKey)) shopCount++;
    }
    const phaseKey = this.getTrafficLifePhaseKey(now);
    const phaseRatio = phaseKey === "madrugada"
      ? 0.14
      : (phaseKey === "noche" ? 0.55 : (phaseKey === "tarde" ? 0.90 : 1.0));
    const routineBucket = Math.floor((Number(now) || Date.now()) / 180000); // cambia cada 3 min
    const phaseSeed = phaseKey === "dia" ? 11 : (phaseKey === "tarde" ? 23 : (phaseKey === "noche" ? 37 : 47));
    const seed = (decorHouseCount * 131) + (shopCount * 97) + (sourceCount * 53) + (routineBucket * 17) + phaseSeed;
    return { now, phaseKey, phaseRatio, decorHouseCount, shopCount, sourceCount, seed };
  }

  hasDecorStreetNpcForBuilding(buildingId) {
    const bid = Number(buildingId) || 0;
    if (bid <= 0) return false;
    for (const npc of this.streetNpcs) {
      if (npc?.spawnSource !== "decor") continue;
      if ((Number(npc?.homeBuildingId) || 0) !== bid) continue;
      return true;
    }
    return false;
  }

  shouldDecorHouseSpawnNpcNow(b, snapshot = null) {
    if (!b || !b.isBuilt || !this.isDecorativeHouse(b.typeKey)) return false;
    const snap = snapshot || this.getTrafficRoutineSnapshot(Date.now());
    const ratio = Phaser.Math.Clamp(Number(snap?.phaseRatio) || 0, 0, 1);
    if (ratio <= 0.001) return false;
    const id = Number(b.id) || 0;
    if (id <= 0) return false;
    const clockNow = Number(snap?.now) || Date.now();
    const phaseKey = String(snap?.phaseKey || this.getTrafficLifePhaseKey(clockNow));
    const commonScheduleSeed = this.getStreetNpcScheduleSeedFromMeta(id, 0, `decor_${String(b.typeKey || "")}`, 1);
    const commonSchedule = this.buildStreetNpcSleepSchedule(commonScheduleSeed);
    if (!this.isStreetNpcScheduleActiveNow(commonSchedule, clockNow)) return false;
    const phaseSeed = phaseKey === "dia" ? 11 : (phaseKey === "tarde" ? 23 : (phaseKey === "noche" ? 37 : 47));
    const bucket = Math.floor(clockNow / 180000);
    const seed = (id * 19.73) + (bucket * 7.91) + phaseSeed;
    const dayScale = phaseKey === "dia"
      ? 0.86
      : (phaseKey === "tarde" ? 0.78 : (phaseKey === "noche" ? 0.48 : 0.16));
    const spawnRatio = Phaser.Math.Clamp(Math.min(ratio, dayScale), 0.05, 0.92);
    return this.sampleTrafficRoutine01(seed) < spawnRatio;
  }

  syncDecorHouseStreetNpc(b, now = Date.now(), snapshot = null) {
    if (!b || !this.isDecorativeHouse(b.typeKey)) return;
    const hasNpc = this.hasDecorStreetNpcForBuilding(b.id);
    if (!b.isBuilt) {
      if (hasNpc) this.removeStreetNpcsForBuilding(b.id, "decor");
      b.residentNpcSpawned = false;
      return;
    }

    const shouldSpawn = this.shouldDecorHouseSpawnNpcNow(b, snapshot || this.getTrafficRoutineSnapshot(now));
    if (!shouldSpawn) {
      b.residentNpcSpawned = hasNpc;
      return;
    }

    if (!hasNpc) {
      const spawned = this.spawnStreetNpcFromHouse(b, now);
      if (!spawned) b.residentNpcSpawned = false;
      return;
    }
    b.residentNpcSpawned = true;
  }

  syncStreetNpcPresenceForBuilding(b, now = Date.now(), trafficSnapshot = null) {
    if (!b || !this.isStreetNpcSourceBuilding(b.typeKey)) return;
    if (this.isDecorativeHouse(b.typeKey)) {
      this.syncDecorHouseStreetNpc(b, now, trafficSnapshot);
      return;
    }
    if (this.isNpcResidenceBuilding(b.typeKey)) {
      this.syncResidentNpcWorldSpawns(b, now);
    }
  }

  ensureNpcSlotsForBuilding(b) {
    if (!b) return [];
    const slotCount = this.getNpcSlotCountForBuildingType(b.typeKey);
    if (slotCount <= 0) {
      b.npcSlots = [];
      return b.npcSlots;
    }

    const current = Array.isArray(b.npcSlots) ? b.npcSlots : [];
    if (current.length > slotCount) {
      for (let i = slotCount; i < current.length; i++) {
        const extraKey = String(current[i]?.key || "").trim();
        if (extraKey.startsWith("npc_")) {
          this.economy?.addItem?.(extraKey, 1);
        }
      }
    }
    const next = [];
    for (let i = 0; i < slotCount; i++) {
      const entry = current[i];
      if (!entry || typeof entry !== "object") {
        next.push(null);
        continue;
      }
      const key = String(entry.key || "").trim();
      if (!key || !key.startsWith("npc_")) {
        next.push(null);
        continue;
      }
      const evoFromEntry = Number(entry.evo);
      const evo = Number.isFinite(evoFromEntry)
        ? Math.max(0, Math.min(5, Math.round(evoFromEntry)))
        : this.getNpcEvolutionLevelForKey(key);
      next.push({ key, evo });
    }
    b.npcSlots = next;
    return next;
  }

  getNpcBuffForBuilding(targetB) {
    const empty = {
      slotCount: 0,
      filled: 0,
      buildMult: 1,
      prodMult: 1,
      rewardMult: 1,
      producerTimeMult: 1,
      producerAmountMult: 1,
      producerPremiumBonus: 0,
      buildReductionPct: 0,
      prodReductionPct: 0,
      rewardBoostPct: 0,
      producerAmountBoostPct: 0,
      producerPremiumPct: 0
    };

    if (!targetB || !this.isNpcSlotEligibleBuildingType(targetB.typeKey)) {
      return empty;
    }

    const slots = this.ensureNpcSlotsForBuilding(targetB);
    const slotCount = this.getNpcSlotCountForBuildingType(targetB.typeKey);
    const used = slots.filter((s) => !!(s && s.key));
    if (!used.length) {
      return { ...empty, slotCount, filled: 0 };
    }

    let buildReduction = 0;
    let prodReduction = 0;
    let rewardBoost = 0;
    let producerAmountBoost = 0;
    let producerPremiumBoost = 0;

    for (const slot of used) {
      const key = String(slot.key || "");
      const role = this.getNpcRoleForKey(key);
      const rarity = this.getNpcRarityForKey(key);
      const evo = Math.max(0, Math.min(5, Number(slot.evo) || 0));
      const rarityFactor = Number(NPC_BUFF_RARITY_FACTOR[rarity] || 1.0);
      const evoFactor = 1 + (NPC_BUFF_EVO_STEP * evo);
      const power = rarityFactor * evoFactor;

      if (role === "build") {
        buildReduction += NPC_BUFF_BUILD_BASE * power;
      } else if (role === "prod") {
        prodReduction += NPC_BUFF_PROD_BASE * power;
        producerAmountBoost += NPC_BUFF_PRODUCER_AMOUNT_BASE * power;
        producerPremiumBoost += NPC_BUFF_PRODUCER_PREMIUM_BASE * power;
      } else {
        rewardBoost += NPC_BUFF_REWARD_BASE * power;
      }
    }

    buildReduction = Math.min(NPC_BUFF_BUILD_CAP, buildReduction);
    prodReduction = Math.min(NPC_BUFF_PROD_CAP, prodReduction);
    rewardBoost = Math.min(NPC_BUFF_REWARD_CAP, rewardBoost);
    producerAmountBoost = Math.min(NPC_BUFF_PRODUCER_AMOUNT_CAP, producerAmountBoost);
    producerPremiumBoost = Math.min(NPC_BUFF_PRODUCER_PREMIUM_CAP, producerPremiumBoost);

    const producerTimeReduction = Math.min(
      NPC_BUFF_PROD_CAP,
      prodReduction + (buildReduction * 0.35)
    );

    return {
      slotCount,
      filled: used.length,
      buildMult: Math.max(0.30, 1 - buildReduction),
      prodMult: Math.max(0.25, 1 - prodReduction),
      rewardMult: 1 + rewardBoost,
      producerTimeMult: Math.max(0.25, 1 - producerTimeReduction),
      producerAmountMult: 1 + producerAmountBoost,
      producerPremiumBonus: producerPremiumBoost,
      buildReductionPct: Math.round(buildReduction * 100),
      prodReductionPct: Math.round(prodReduction * 100),
      rewardBoostPct: Math.round(rewardBoost * 100),
      producerAmountBoostPct: Math.round(producerAmountBoost * 100),
      producerPremiumPct: Math.round(producerPremiumBoost * 1000) / 10
    };
  }

  getNpcBuffSummaryForBuilding(b) {
    const slotCount = this.getNpcSlotCountForBuildingType(b?.typeKey || "");
    if (slotCount <= 0) return "NPC: No disponible";

    const npc = b?.npcBuff || this.getNpcBuffForBuilding(b);
    const filled = Math.max(0, Number(npc?.filled) || 0);

    if (this.isProducerBuilding(b?.typeKey || "")) {
      const timePct = Math.max(0, Number(npc?.prodReductionPct) || 0);
      const amountPct = Math.max(0, Number(npc?.producerAmountBoostPct) || 0);
      const premiumPct = Math.max(0, Number(npc?.producerPremiumPct) || 0);
      return `NPC: ${filled}/${slotCount} | Tiempo -${timePct}% | Cantidad +${amountPct}% | Premium +${premiumPct}%`;
    }

    const buildPct = Math.max(0, Number(npc?.buildReductionPct) || 0);
    const prodPct = Math.max(0, Number(npc?.prodReductionPct) || 0);
    const rewardPct = Math.max(0, Number(npc?.rewardBoostPct) || 0);
    return `NPC: ${filled}/${slotCount} | Constr -${buildPct}% | Prod -${prodPct}% | Oro/EXP +${rewardPct}%`;
  }

  isAuraSourceBuilding(b) {
    if (!b || !b.isBuilt) return false;
    if (!this.isDecorativeHouse(b.typeKey)) return false;
    return true;
  }

  hasBuildingProduction(b, def = null) {
    if (this.isProducerBuilding(def?.key || b?.typeKey)) return false;
    if (b && this.isMinimarketBuilding(b.typeKey) && !this.isMinimarketUnlocked(b)) return false;
    if (b && typeof b.baseHasProduction === "boolean") return b.baseHasProduction;
    const src = def || b || {};
    const prodSeconds = src.prodSeconds ?? 0;
    const reward = src.reward || { exp: 0, gold: 0 };
    const rewardTotal = Math.max(0, reward.exp || 0) + Math.max(0, reward.gold || 0);
    return prodSeconds > 0 && rewardTotal > 0;
  }

  isYapaBonusEligibleBuilding(b, def = null) {
    if (!b || !b.isBuilt) return false;
    if (this.isEvolutionDisabledBuilding(b.typeKey)) return false;
    const rarity = this.getRarityForKey(b.typeKey);
    return rarity >= 1 && rarity <= 3;
  }

  ensureYapaBonusIcon(b) {
    if (!b) return null;
    if (b.yapaBonusIcon) return b.yapaBonusIcon;
    let icon;
    if (this.textures?.exists?.("ui_yapa_icon")) {
      icon = this.add.image(0, 0, "ui_yapa_icon")
        .setOrigin(0.5, 0.5)
        .setDepth(83)
        .setVisible(false);
      icon.setDisplaySize(24, 24);
    } else {
      icon = this.add.text(0, 0, "S/", {
        fontFamily: "Arial",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#5b21b6",
        backgroundColor: "#2dd4bf"
      })
        .setOrigin(0.5, 0.5)
        .setPadding(4, 1, 4, 1)
        .setDepth(83)
        .setVisible(false);
      icon.setStroke("#ecfeff", 1);
    }
    this.uiCam.ignore(icon);
    b.yapaBonusIcon = icon;
    return icon;
  }

  clearBuildingYapaBonus(b) {
    if (!b) return;
    b.yapaBonusReady = false;
    b.yapaBonusExpiresAt = 0;
    b.yapaBonusIcon?.setVisible(false);
    if (this.activeYapaBonusBuildingId === b.id) {
      this.activeYapaBonusBuildingId = null;
    }
  }

  getActiveYapaBonusBuilding(now = Date.now()) {
    const activeId = this.activeYapaBonusBuildingId;
    if (!activeId) return null;
    const b = buildings.get(activeId);
    if (!b || !b.yapaBonusReady) {
      this.activeYapaBonusBuildingId = null;
      return null;
    }
    if (now >= (b.yapaBonusExpiresAt || 0)) {
      this.clearBuildingYapaBonus(b);
      return null;
    }
    return b;
  }

  trySpawnYapaBonus(now = Date.now()) {
    this.getActiveYapaBonusBuilding(now);
    if (this.getActiveYapaBonusBuilding(now)) return;

    if (this.nextYapaBonusAt == null) {
      this.nextYapaBonusAt = now + YAPA_BONUS_INTERVAL_MS;
      return;
    }
    if (now < this.nextYapaBonusAt) return;

    // si el tiempo avanzó en segundo plano, procesa intervalos pendientes
    let dueCount = 0;
    while (now >= this.nextYapaBonusAt && dueCount < 24) {
      dueCount++;
      this.nextYapaBonusAt += YAPA_BONUS_INTERVAL_MS;

      if (this.getActiveYapaBonusBuilding(now)) continue;
      if (Math.random() > YAPA_BONUS_CHANCE) continue;

      const candidates = [];
      for (const b of buildings.values()) {
        const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
        if (!this.isYapaBonusEligibleBuilding(b, def)) continue;
        candidates.push(b);
      }
      if (!candidates.length) continue;

      const idx = Math.floor(Math.random() * candidates.length);
      const selected = candidates[idx];
      this.ensureYapaBonusIcon(selected);
      selected.yapaBonusReady = true;
      selected.yapaBonusExpiresAt = now + YAPA_BONUS_DURATION_MS;
      this.activeYapaBonusBuildingId = selected.id;
      break;
    }
  }

  forceSpawnYapaBonus() {
    const now = Date.now();
    const active = this.getActiveYapaBonusBuilding(now);
    if (active) {
      return { ok: false, reason: "active", buildingId: active.id };
    }

    const candidates = [];
    for (const b of buildings.values()) {
      if (!this.isYapaBonusEligibleBuilding(b)) continue;
      candidates.push(b);
    }

    if (!candidates.length) {
      return { ok: false, reason: "none" };
    }

    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    this.ensureYapaBonusIcon(selected);
    selected.yapaBonusReady = true;
    selected.yapaBonusExpiresAt = now + YAPA_BONUS_DURATION_MS; // respeta timer de 1 min
    this.activeYapaBonusBuildingId = selected.id;

    return { ok: true, reason: "spawned", buildingId: selected.id };
  }

  getYapaBonusStatus(now = Date.now()) {
    const b = this.getActiveYapaBonusBuilding(now);
    if (!b) {
      return { active: false, remainMs: 0, buildingId: null, label: "" };
    }
    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    return {
      active: true,
      remainMs: Math.max(0, (b.yapaBonusExpiresAt || 0) - now),
      buildingId: b.id,
      typeKey: b.typeKey,
      label: def.label || b.typeKey
    };
  }

  focusCameraOnBuilding(buildingId, duration = 520) {
    const b = buildings.get(buildingId);
    if (!b) return false;
    const center = this.getBuildingGridCenter(b);
    const anchor = center ? isoToScreen(center.r, center.c) : this.getBuildingAnchor(b);
    if (!anchor) return false;
    const cam = this.worldCam;
    if (!cam) return false;
    const startCenter = cam.getWorldPoint(cam.width * 0.5, cam.height * 0.5);
    if (!Number.isFinite(startCenter?.x) || !Number.isFinite(startCenter?.y)) return false;

    if (this._focusCamTween) {
      this._focusCamTween.stop();
      this._focusCamTween = null;
    }

    const tweenState = { t: 0 };
    this._focusCamTween = this.tweens.add({
      targets: tweenState,
      t: 1,
      duration,
      ease: "Cubic.Out",
      onUpdate: () => {
        const x = Phaser.Math.Linear(startCenter.x, anchor.x, tweenState.t);
        const y = Phaser.Math.Linear(startCenter.y, anchor.y, tweenState.t);
        cam.centerOn(x, y);
        this.clampWorldCamera();
      },
      onComplete: () => {
        cam.centerOn(anchor.x, anchor.y);
        this.clampWorldCamera();
        this._focusCamTween = null;
      }
    });
    return true;
  }

  consumeYapaBonusForScan(now = Date.now()) {
    const b = this.getActiveYapaBonusBuilding(now);
    if (!b) return null;
    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const payload = {
      buildingId: b.id,
      typeKey: b.typeKey,
      label: def.label || b.typeKey
    };
    this.clearBuildingYapaBonus(b);
    return payload;
  }

  getAreaBuffForBuilding(targetB) {
    const empty = {
      buildMult: 1,
      prodMult: 1,
      rewardMult: 1,
      stacks: 0,
      buildReductionPct: 0,
      prodBoostPct: 0,
      totalPct: 0
    };
    if (!targetB || !Array.isArray(targetB.cells) || !targetB.cells.length) {
      return empty;
    }
    if (this.isDecorativeHouse(targetB.typeKey) || this.isProducerBuilding(targetB.typeKey)) {
      return empty;
    }

    const targetCells = targetB.cells;
    const inRangeSources = [];
    for (const source of buildings.values()) {
      if (!this.isAuraSourceBuilding(source)) continue;
      if (source.id === targetB.id) continue;

      const sourceCenter = this.getBuildingGridCenter(source);
      if (!sourceCenter) continue;

      const aura = this.getDecorAuraFromLevel(source.evoLevel || 0);
      if (aura.buildReduction <= 0 && aura.prodBoost <= 0) continue;

      let inside = false;
      let minDist = Infinity;
      for (const cell of targetCells) {
        const dist = Math.hypot(sourceCenter.r - cell.r, sourceCenter.c - cell.c);
        if (dist < minDist) minDist = dist;
        if (dist <= aura.radiusTiles) {
          inside = true;
          break;
        }
      }
      if (!inside) continue;

      inRangeSources.push({
        dist: minDist,
        power: (aura.buildReduction + aura.prodBoost),
        buildReduction: aura.buildReduction,
        prodBoost: aura.prodBoost
      });
    }

    // Prioriza siempre las fuentes con mayor buffo total.
    inRangeSources.sort((a, b) =>
      (b.power - a.power) ||
      (b.prodBoost - a.prodBoost) ||
      (b.buildReduction - a.buildReduction) ||
      (a.dist - b.dist)
    );

    const used = inRangeSources.slice(0, DECOR_AURA_MAX_STACKS);

    let totalBuildReduction = 0;
    let totalProdBoost = 0;
    for (const src of used) {
      totalBuildReduction += src.buildReduction;
      totalProdBoost += src.prodBoost;
    }

    return {
      buildMult: Math.max(0.75, 1 - totalBuildReduction),
      prodMult: 1,
      rewardMult: 1 + totalProdBoost,
      stacks: used.length,
      buildReductionPct: Math.round(totalBuildReduction * 100),
      prodBoostPct: Math.round(totalProdBoost * 100),
      totalPct: Math.round((totalBuildReduction + totalProdBoost) * 100)
    };
  }



  recalculateAllBuildingStats(now = Date.now()) {
    for (const b of buildings.values()) {
      this.applyEvolution(b, now);
    }
    for (const b of buildings.values()) {
      if (this.isNpcResidenceBuilding(b?.typeKey)) {
        this.syncResidentNpcWorldSpawns(b, now);
      }
    }
  }

  buildEvoDiamonds(level) {
    const filled = Math.max(0, Math.min(5, level || 0));
    let html = `<div style="display:flex; gap:6px;">`;
    for (let i = 0; i < 5; i++) {
      const on = i < filled ? " evo-d on" : " evo-d";
      html += `<span class="${on}"></span>`;
    }
    html += `</div>`;
    return html;
  }

  getEvolutionStats(typeKey, stage, level) {
    const clampedLevel = Math.max(0, Math.min(5, level || 0));
    const baseRarity = this.getRarityForKey(typeKey);

    if (this.isEvolutionDisabledBuilding(typeKey)) {
      return {
        buildMult: 1,
        prodMult: 1,
        rewardMult: 1,
        bonusLabel: "Sin evolucion"
      };
    }

    if (this.isDecorativeHouse(typeKey)) {
      const aura = this.getDecorAuraFromLevel(clampedLevel);
      const buildPct = Math.round(aura.buildReduction * 100);
      const prodPct = Math.round(aura.prodBoost * 100);
      return {
        buildMult: 1,
        prodMult: 1,
        rewardMult: 1,
        bonusLabel: `Aura r${aura.radiusTiles.toFixed(1)} | Constr -${buildPct}% | Oro/XP +${prodPct}% | Acumula x${DECOR_AURA_MAX_STACKS}`
      };
    }

    if (this.isNpcResidenceBuilding(typeKey)) {
      const capacity = this.getResidentNpcCapacityForBuilding(typeKey, clampedLevel);
      return {
        buildMult: 1,
        prodMult: 1,
        rewardMult: 1,
        bonusLabel: `Capacidad NPC ${capacity}/${CASA_CONERA_RESIDENT_MAX}`
      };
    }

    if (baseRarity >= 1 && baseRarity <= 3) {
      const t = clampedLevel / 5;
      const prodReductionPct = Math.round(20 * t);
      const rewardBonusPct = Math.round(30 * t);
      return {
        buildMult: 1,
        prodMult: 1 - (0.20 * t),
        rewardMult: 1 + (0.30 * t),
        bonusLabel: `Prod -${prodReductionPct}% | Oro/EXP +${rewardBonusPct}%`
      };
    }

    const total = (stage >= 6) ? (5 + clampedLevel) : clampedLevel;
    const speedMult = Math.max(0.5, 1 - (0.01 * total));
    const rewardMult = 1 + (0.01 * total);
    return {
      buildMult: speedMult,
      prodMult: speedMult,
      rewardMult,
      bonusLabel: `+${total}%`
    };
  }

  applyEvolution(b, now = Date.now()) {
    if (!b) return;
    const level = Math.max(0, Math.min(5, b.evoLevel || 0));
    const stage = (typeof b.evoStage === "number") ? b.evoStage : 5;
    const evoStats = this.getEvolutionStats(b.typeKey, stage, level);
    const auraStats = this.getAreaBuffForBuilding(b);
    this.ensureNpcSlotsForBuilding(b);
    this.ensureResidentNpcSlotsForBuilding(b);
    const npcStats = this.getNpcBuffForBuilding(b);

    const prevBuild = b.buildSeconds ?? b.baseBuildSeconds ?? 0;
    const prevProd = b.prodSeconds ?? b.baseProdSeconds ?? 1;

    const baseBuild = b.baseBuildSeconds ?? prevBuild;
    const baseProd = b.baseProdSeconds ?? prevProd;
    const baseReward = b.baseReward || b.reward || { exp: 0, gold: 0 };
    const supportsProduction = this.hasBuildingProduction(null, {
      prodSeconds: baseProd,
      reward: baseReward
    });
    const activationLocked = !!(b && b.isBuilt && this.hasBuildingActivation(b.typeKey) && !this.isBuildingActivationUnlocked(b));

    b.buildSeconds = Math.max(0, Math.round(baseBuild * evoStats.buildMult * auraStats.buildMult * (npcStats.buildMult || 1)));
    if (supportsProduction) {
      const totalRewardMult = Math.max(0, evoStats.rewardMult * (auraStats.rewardMult || 1) * (npcStats.rewardMult || 1));
      b.prodSeconds = Math.max(1, Math.round(baseProd * evoStats.prodMult * (npcStats.prodMult || 1)));
      b.reward = {
        exp: Math.max(0, Math.round(baseReward.exp * totalRewardMult)),
        gold: Math.max(0, Math.round(baseReward.gold * totalRewardMult))
      };
    } else {
      b.prodSeconds = 0;
      b.reward = { exp: 0, gold: 0 };
      b.rewardReady = false;
    }
    b.hasProduction = supportsProduction && !activationLocked;
    b.areaBuff = auraStats;
    b.npcBuff = npcStats;

    b.prodCycle = supportsProduction ? (b.prodSeconds * 1000) : 0;

    if (!b.isBuilt) {
      const prevTotal = Math.max(1, prevBuild * 1000);
      const remain = Math.max(0, b.buildEnd - now);
      const ratio = remain / prevTotal;
      b.buildEnd = now + Math.round((b.buildSeconds * 1000) * ratio);
    } else if (supportsProduction && !activationLocked && !b.rewardReady) {
      const prevCycle = Math.max(1, prevProd * 1000);
      const elapsed = Math.max(0, now - b.prodStart);
      const ratio = elapsed / prevCycle;
      b.prodStart = now - Math.min(b.prodSeconds * 1000, Math.round((b.prodSeconds * 1000) * ratio));
    }
  }

  ensureTranscendAnimStyles() {
    if (document.getElementById("transcend-anim-styles")) return;
    const style = document.createElement("style");
    style.id = "transcend-anim-styles";
    style.textContent = `
      .transcend-anim {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background:
          radial-gradient(circle at 50% 45%, rgba(255,255,255,.35), rgba(255,255,255,0) 62%),
          radial-gradient(circle at 20% 20%, rgba(168,85,247,.25), rgba(168,85,247,0) 55%),
          radial-gradient(circle at 80% 30%, rgba(34,197,94,.25), rgba(34,197,94,0) 55%);
        opacity: 0;
        pointer-events: none;
        z-index: 9999;
      }
      .transcend-anim::before {
        content:"";
        position:absolute;
        inset:-10%;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.22), rgba(255,255,255,0) 70%);
        opacity:.6;
      }
      .transcend-anim.on { animation: transFade 2.0s ease forwards; }
      .transcend-stage { position: relative; width: 260px; height: 320px; }
      .transcend-streak {
        position: absolute;
        left: -30%;
        width: 160px;
        height: 2px;
        background: linear-gradient(90deg, transparent, var(--accent, #f59e0b), transparent);
        opacity: .9;
        animation: none;
        animation-delay: var(--d, 0s);
      }
      .transcend-env {
        position: absolute;
        left: 50%;
        bottom: 20px;
        width: 220px;
        height: 130px;
        transform: translateX(-50%) translateY(30px);
        border-radius: 14px;
        background: linear-gradient(160deg, #1f2937, #0b1222);
        border: 1px solid rgba(255,255,255,.12);
        box-shadow: 0 16px 30px rgba(0,0,0,.45);
        animation: none;
      }
      .transcend-card {
        position: absolute;
        left: 50%;
        bottom: 34px;
        width: 150px;
        height: 210px;
        transform: translate(-50%, 80px) scale(.88) rotate(-6deg);
        border-radius: 16px;
        background: linear-gradient(180deg, #0f172a, #0b1222);
        border: 2px solid var(--accent, #f59e0b);
        box-shadow: 0 18px 32px rgba(0,0,0,.45), 0 0 18px rgba(245,158,11,.35);
        animation: none;
        overflow: hidden;
      }
      .transcend-card::after {
        content:"";
        position:absolute;
        inset:-40%;
        background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.7) 52%, rgba(255,255,255,0) 64%);
        opacity:.7;
        transform: translateX(-30%) rotate(8deg);
        animation: none;
      }
      .transcend-icon {
        margin-top: 18px;
        font-size: 28px;
        text-align: center;
      }
      .transcend-name {
        margin-top: 6px;
        text-align: center;
        font-weight: 800;
        letter-spacing: .5px;
      }
      .transcend-stars {
        display: flex;
        gap: 4px;
        justify-content: center;
        margin-top: 8px;
        font-size: 18px;
      }
      .transcend-stars .star {
        display: inline-block;
        background: conic-gradient(from var(--h), #22c55e, #38bdf8, #a855f7, #f59e0b, #ef4444, #22c55e);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 0 8px rgba(255,255,255,.35);
      }
      .transcend-flash {
        position: absolute;
        inset: -30%;
        background: radial-gradient(circle at 50% 50%, rgba(255,255,255,.8), rgba(255,255,255,0) 60%);
        opacity: 0;
        animation: none;
      }
      .transcend-anim.on .transcend-streak { animation: transStreak 1.2s ease forwards; }
      .transcend-anim.on .transcend-env { animation: transEnv 1.3s ease forwards; }
      .transcend-anim.on .transcend-card { animation: transCard 1.45s ease forwards; }
      .transcend-anim.on .transcend-card::after { animation: transSheen 1.2s ease forwards; }
      .transcend-anim.on .transcend-flash { animation: transFlash 1.1s ease forwards; }
      @keyframes transFade {
        0% { opacity: 0; }
        10% { opacity: 1; }
        80% { opacity: .98; }
        100% { opacity: 0; }
      }
      @keyframes transStreak {
        0% { transform: translateX(0) translateY(0); opacity: 0; }
        30% { opacity: .9; }
        100% { transform: translateX(140%) translateY(-40px); opacity: 0; }
      }
      @keyframes transEnv {
        0% { transform: translateX(-50%) translateY(30px); opacity: .4; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
      }
      @keyframes transCard {
        0% { transform: translate(-50%, 80px) scale(.88) rotate(-6deg); opacity: .2; }
        60% { transform: translate(-50%, -10px) scale(1) rotate(2deg); opacity: 1; }
        100% { transform: translate(-50%, -18px) scale(1.02) rotate(0deg); opacity: 1; }
      }
      @keyframes transSheen {
        0% { opacity: 0; transform: translateX(-30%) rotate(8deg); }
        40% { opacity: .9; }
        100% { opacity: 0; transform: translateX(30%) rotate(8deg); }
      }
      @keyframes transFlash {
        0% { opacity: 0; }
        35% { opacity: .9; }
        100% { opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  playTranscendAnimation(targetEl, def) {
    if (!targetEl) return;
    this.ensureTranscendAnimStyles();
    const container = targetEl.closest?.(".evo-window") || targetEl.closest?.(".building-window") || targetEl;
    if (container && getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    if (container && !container.style.overflow) {
      container.style.overflow = "hidden";
    }
    const icon = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[def?.key]?.icon)
      ? ITEM_DEFS[def.key].icon
      : "\u2726";
    const name = def?.label || def?.key || "Transcender";
    const accent = this.colorToHex(def?.border ?? 0xf59e0b);
    const stars = Array.from({ length: 6 }, (_, i) => (
      `<span class="star" style="--h:${i * 60}deg">\u2605</span>`
    )).join("");
    const overlay = document.createElement("div");
    overlay.className = "transcend-anim";
    overlay.style.setProperty("--accent", accent);
    overlay.style.position = "absolute";
    overlay.style.inset = "0";
    overlay.style.zIndex = "100";
    overlay.innerHTML = `
      <div class="transcend-stage">
        ${Array.from({ length: 6 }, (_, i) => (
          `<span class="transcend-streak" style="top:${20 + i * 18}px; --d:${i * 0.06}s;"></span>`
        )).join("")}
        <div class="transcend-env"></div>
        <div class="transcend-card">
          <div class="transcend-icon">${icon}</div>
          <div class="transcend-name">${name}</div>
          <div class="transcend-stars">${stars}</div>
        </div>
        <div class="transcend-flash"></div>
      </div>
    `;
    const prev = container?.querySelector?.(".transcend-anim");
    if (prev) prev.remove();
    (container || document.body).appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add("on"));
    setTimeout(() => overlay.remove(), 2100);
  }

  transcendBuilding(b, def) {
    if (!b) return;
    this.setCursorMode();
    b.evoStage = 6;
    b.evoLevel = 0;
    const now = Date.now();
    this.recalculateAllBuildingStats(now);
    if (def) this.updateBuildingInfoModal(b, def, now);
  }

  openEvolutionModal(b) {
    if (!b || !this.economy) return;
    if (!b.isBuilt) return;
    if (this.isEvolutionDisabledBuilding(b.typeKey)) return;
    this.setCursorMode();
    const existing = document.getElementById("evo-modal");
    if (existing) existing.remove();

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const targetRarity = this.getRarityForKey(b.typeKey);
    const targetSize = def.size;
    const targetColor = this.getColorForKey(b.typeKey);
    const fillHex = this.colorToHex(def.fill);
    const borderHex = this.colorToHex(def.border);
    const itemIcon = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[b.typeKey]?.icon)
      ? ITEM_DEFS[b.typeKey].icon
      : "\u2726";
    const previewContent = this.isSpriteBuilding(b.typeKey)
      ? `<img src="${this.getSpriteImagePathForBuilding(b.typeKey, b.rotationStep || 0)}" alt="${def.label || b.typeKey}" style="width:56px;height:auto;display:block;filter: drop-shadow(0 3px 6px rgba(0,0,0,.35));">`
      : `
      <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,8 112,40 60,72 8,40" fill="${fillHex}" stroke="${borderHex}" stroke-width="3"/>
      </svg>
    `;

    const candidates = Object.keys(this.economy.inventory || {}).filter((key) => {
      const count = this.economy.inventory[key] || 0;
      if (count <= 0) return false;
      const item = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[key]) ? ITEM_DEFS[key] : null;
      const size = item?.size ?? BUILDING_TYPES[key]?.size;
      const rarity = item?.rarity ?? this.getRarityForKey(key);
      const color = this.getColorForKey(key);
      return size === targetSize && rarity === targetRarity && color === targetColor;
    });

    const modal = document.createElement("div");
    modal.id = "evo-modal";
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.6)",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    });

    const list = candidates.length
      ? candidates.map((key) => {
          const item = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[key]) ? ITEM_DEFS[key] : { name: key, size: targetSize, rarity: targetRarity, icon: "\u2726" };
          const count = this.economy.inventory[key] || 0;
          const itemIconHtml = this.isSpriteBuilding(key)
            ? `<img src="${this.getSpriteImagePathForBuilding(key, 0)}" alt="${item.name || key}" style="width:20px;height:auto;display:block;">`
            : (item.icon || "\u2726");
          return `
            <button class="evo-item" data-key="${key}">
              <span class="evo-item-left">
                <span class="evo-item-ico">${itemIconHtml}</span>
                <span>
                  <div class="evo-item-name">${item.name || key}</div>
                  <div class="evo-item-meta">${item.size}x${item.size}  |  ${item.rarity}\u2605</div>
                </span>
              </span>
              <b class="evo-item-count">x${count}</b>
            </button>
          `;
        }).join("")
      : `<div class="evo-empty">Sin duplicados para fusionar.</div>`;

    const evoLevel = Math.max(0, Math.min(5, b.evoLevel || 0));
    const evoStage = (typeof b.evoStage === "number")
      ? b.evoStage
      : (targetRarity === 5 ? 5 : 0);
    const stageLabel = (evoStage >= 5 ? evoStage : targetRarity);
    const evoStatsLabel = this.getEvolutionStats(b.typeKey, evoStage, evoLevel).bonusLabel;
    const displayRarity = (targetRarity === 5 && evoStage >= 6) ? 6 : targetRarity;
    const evoActive = (evoLevel > 0) || (evoStage >= 6);
    const maxColorFrameClass = (displayRarity >= 1 && displayRarity <= 5 && evoLevel >= 5)
      ? ` maxed-${displayRarity}`
      : "";
    const frameClass = displayRarity === 6
      ? `frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `frame-${displayRarity}${evoActive ? " evo-on" : ""}${maxColorFrameClass}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5)
      ? " chrome"
      : ((displayRarity >= 1 && displayRarity <= 5 && evoLevel >= 5) ? ` chrome-${displayRarity}` : "");
    const slotsHtml = Array.from({ length: 5 }, (_, i) => {
      const fixed = i < evoLevel;
      return `
        <div class="evo-slot${fixed ? " filled fixed" : ""}" data-slot="${i}" data-fixed="${fixed ? "1" : "0"}">
          <span class="evo-slot-ico"></span>
        </div>
      `;
    }).join("");
    const evoTransStars = Array.from({ length: 6 }, (_, i) => (
      `<span class="star" style="--h:${i * 60}deg">\u2605</span>`
    )).join("");
    const evoStarsHtml = (displayRarity === 6) ? evoTransStars : "\u2605".repeat(displayRarity);

    modal.innerHTML = `
      <div class="evo-window">
        <style>
          #evo-modal .evo-window {
            width: min(620px, 94vw);
            background: #0b1222;
            color: #e5e7eb;
            border: 1px solid rgba(255,255,255,.12);
            border-radius: 14px;
            padding: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,.5);
            font-family: "Arial", Arial, sans-serif;
            display: grid;
            gap: 10px;
            position: relative;
            overflow: hidden;
          }
          #evo-modal .evo-header {
            display:flex; justify-content:space-between; align-items:center;
          }
          #evo-modal .evo-grid {
            display: grid;
            grid-template-columns: 1.1fr 0.9fr;
            gap: 12px;
          }
          #evo-modal .evo-list {
            display: grid;
            gap: 8px;
            max-height: 280px;
            overflow: auto;
          }
          #evo-modal .evo-item {
            display:flex; justify-content:space-between; align-items:center; gap:10px;
            width:100%; padding:10px; border-radius:10px; border:1px solid rgba(255,255,255,.12);
            background:#0b1222; color:#e5e7eb; cursor:pointer;
          }
          #evo-modal .evo-item:disabled { opacity:.5; cursor:not-allowed; }
          #evo-modal .evo-item-left { display:flex; align-items:center; gap:10px; }
          #evo-modal .evo-item-ico {
            font-size: 20px;
            width: 22px;
            min-width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #evo-modal .evo-item-name { font-weight: 700; }
          #evo-modal .evo-item-meta { opacity:.75; font-size:12px; }
          #evo-modal .evo-main {
            display: grid;
            gap: 8px;
            align-content: start;
            position: relative;
          }
          #evo-modal .evo-target-icon {
            position: absolute;
            top: -4px;
            right: -4px;
            width: 34px;
            height: 34px;
            border-radius: 50%;
            background: #111827;
            border: 1px solid rgba(255,255,255,.15);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 6px 14px rgba(0,0,0,.35);
            display: none !important;
            opacity: 0;
            transform: scale(0);
            pointer-events: none;
          }
          #evo-modal .evo-main-card {
            position: relative;
            padding: 8px;
            border-radius: 14px;
            background: #0f172a;
          }
          #evo-modal .evo-main-card.evo-animate {
            animation: evoPulse .5s ease;
          }
          #evo-modal .preview-frame {
            width: 100%;
            height: 140px;
            --bevel: 11px;
            border-radius: 0;
            clip-path: polygon(
              var(--bevel) 0,
              calc(100% - var(--bevel)) 0,
              100% var(--bevel),
              100% calc(100% - var(--bevel)),
              calc(100% - var(--bevel)) 100%,
              var(--bevel) 100%,
              0 calc(100% - var(--bevel)),
              0 var(--bevel)
            );
          }
          #evo-modal .preview-inner { height: 100%; }
          #evo-modal .evo-title { font-weight: 700; }
          #evo-modal .evo-stars { letter-spacing: 1px; color: #fbbf24; }
          #evo-modal .evo-slots {
            display:flex; gap:10px; justify-content:center; align-items:center;
          }
          #evo-modal .evo-slot {
            width: 22px; height: 22px;
            border:1px solid rgba(148,163,184,.6);
            background: rgba(148,163,184,.12);
            transform: rotate(45deg);
            border-radius: 2px;
            display:flex; align-items:center; justify-content:center;
          }
          #evo-modal .evo-slot-ico {
            transform: rotate(-45deg) scale(.9);
            font-size: 12px;
            line-height: 1;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #evo-modal .evo-slot-ico img {
            width: 12px;
            height: auto;
            display: block;
          }
          #evo-modal .evo-slot.filled {
            background: #fbbf24;
            border-color: #f59e0b;
            box-shadow: 0 0 8px rgba(245,158,11,.6);
          }
          #evo-modal .evo-slot.pending {
            background: #fde68a;
            border-color: #f59e0b;
            box-shadow: 0 0 10px rgba(245,158,11,.7);
          }
          #evo-modal .evo-slot.pop { animation: slotPop .35s ease; }
          #evo-modal .frame-1, #evo-modal .frame-2, #evo-modal .frame-3, #evo-modal .frame-4, #evo-modal .frame-5, #evo-modal .frame-6, #evo-modal .frame-6max {
            position: relative;
            width: 100%;
            height: 140px;
            padding: 6px;
            border-radius: 0;
            display:flex; align-items:center; justify-content:center;
            overflow: hidden;
            clip-path: inherit;
          }
          #evo-modal .frame-1 { background: #6b7280; }
          #evo-modal .frame-2 { background: linear-gradient(135deg,#22c55e 0%, #16a34a 45%, #86efac 62%, #065f46 100%); }
          #evo-modal .frame-3 { background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 62%, #94a3b8 100%); }
          #evo-modal .frame-4 { background: linear-gradient(135deg,#c4b5fd 0%, #8b5cf6 45%, #a78bfa 62%, #5b21b6 100%); }
          #evo-modal .frame-5 { background: #b45309; }
          #evo-modal .frame-1.maxed-1 { box-shadow: 0 0 14px rgba(226,232,240,.5); }
          #evo-modal .frame-2.maxed-2 { box-shadow: 0 0 16px rgba(34,197,94,.62), 0 0 30px rgba(16,185,129,.32); }
          #evo-modal .frame-3.maxed-3 { box-shadow: 0 0 16px rgba(226,232,240,.6), 0 0 30px rgba(148,163,184,.38); }
          #evo-modal .frame-4.maxed-4 { box-shadow: 0 0 16px rgba(168,85,247,.62), 0 0 30px rgba(139,92,246,.38); }
          #evo-modal .frame-5.maxed-5 { box-shadow: 0 0 18px rgba(245,158,11,.72), 0 0 32px rgba(251,191,36,.42); }
          #evo-modal .evo-on {
            box-shadow:
              inset 0 1px 2px rgba(255,255,255,.35),
              inset 0 -3px 6px rgba(0,0,0,.65),
              0 0 10px rgba(255,255,255,.12);
          }
          #evo-modal .evo-on::before {
            content:"";
            position:absolute;
            inset:1px;
            border-radius:0;
            border:1px solid rgba(255,255,255,.28);
            pointer-events:none;
            mix-blend-mode: screen;
            clip-path: inherit;
          }
          #evo-modal .evo-on::after {
            content:"";
            position:absolute;
            inset:-40%;
            background: linear-gradient(120deg,
              rgba(255,255,255,0) 40%,
              rgba(255,255,255,.35) 52%,
              rgba(255,255,255,0) 64%);
            opacity:.55;
            transform: translateX(-20%) rotate(8deg);
            pointer-events:none;
            clip-path: inherit;
          }
          #evo-modal .frame-1.evo-on { background: #6b7280; box-shadow: inset 0 1px 2px rgba(0,0,0,.45); }
          #evo-modal .frame-1.evo-on::before,
          #evo-modal .frame-1.evo-on::after { content: none; }
          #evo-modal .frame-2.evo-on {
            background: linear-gradient(135deg,#34d399 0%, #16a34a 45%, #86efac 60%, #065f46 100%);
          }
          #evo-modal .frame-3.evo-on {
            background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 60%, #94a3b8 100%);
          }
          #evo-modal .frame-4.evo-on {
            background: linear-gradient(135deg,#c4b5fd 0%, #8b5cf6 45%, #a78bfa 60%, #5b21b6 100%);
          }
          #evo-modal .frame-5.evo-on {
            background: linear-gradient(135deg,#fde68a 0%, #f59e0b 45%, #fbbf24 60%, #b45309 100%);
          }
          #evo-modal .frame-6 {
            background: conic-gradient(from 0deg,#22c55e,#38bdf8,#a855f7,#f59e0b,#ef4444,#22c55e);
          }
          #evo-modal .frame-6max { box-shadow: 0 0 18px rgba(255,255,255,.4); }
          #evo-modal .preview-inner {
            position: relative;
            width: 100%;
            height: 100%;
            --bevel-in: 8px;
            border-radius: 0;
            background: rgba(2,6,23,.65);
            display:flex; align-items:center; justify-content:center;
            overflow:hidden;
            clip-path: polygon(
              var(--bevel-in) 0,
              calc(100% - var(--bevel-in)) 0,
              100% var(--bevel-in),
              100% calc(100% - var(--bevel-in)),
              calc(100% - var(--bevel-in)) 100%,
              var(--bevel-in) 100%,
              0 calc(100% - var(--bevel-in)),
              0 var(--bevel-in)
            );
          }
          #evo-modal .preview-inner.chrome::after {
            content:"";
            position:absolute;
            inset:-60%;
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.65) 35%, rgba(255,255,255,0) 65%);
            animation: chromeSheen 2.2s linear infinite;
            mix-blend-mode: screen;
            opacity:.9;
            clip-path: inherit;
          }
          #evo-modal .preview-inner.chrome-1::after,
          #evo-modal .preview-inner.chrome-2::after,
          #evo-modal .preview-inner.chrome-3::after,
          #evo-modal .preview-inner.chrome-4::after,
          #evo-modal .preview-inner.chrome-5::after {
            content:"";
            position:absolute;
            inset:-60%;
            animation: chromeSheen 2s linear infinite;
            mix-blend-mode: screen;
            opacity:.95;
            clip-path: inherit;
          }
          #evo-modal .preview-inner.chrome-1::after {
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(226,232,240,.78) 35%, rgba(148,163,184,.88) 50%, rgba(255,255,255,0) 65%);
          }
          #evo-modal .preview-inner.chrome-2::after {
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(134,239,172,.82) 35%, rgba(34,197,94,.86) 50%, rgba(255,255,255,0) 65%);
          }
          #evo-modal .preview-inner.chrome-3::after {
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(248,250,252,.85) 35%, rgba(203,213,225,.88) 50%, rgba(255,255,255,0) 65%);
          }
          #evo-modal .preview-inner.chrome-4::after {
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(196,181,253,.86) 35%, rgba(168,85,247,.9) 50%, rgba(255,255,255,0) 65%);
          }
          #evo-modal .preview-inner.chrome-5::after {
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(254,240,138,.86) 35%, rgba(245,158,11,.92) 50%, rgba(255,255,255,0) 65%);
          }
          #evo-modal .evo-empty { opacity:.75; padding: 10px; }
          #evo-modal .evo-trans-fx {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background:
              radial-gradient(circle at 50% 45%, rgba(255,255,255,.35), rgba(255,255,255,0) 60%),
              radial-gradient(circle at 15% 20%, rgba(168,85,247,.18), rgba(168,85,247,0) 55%),
              radial-gradient(circle at 85% 30%, rgba(34,197,94,.18), rgba(34,197,94,0) 55%);
            opacity: 0;
            pointer-events: none;
            z-index: 5;
          }
          #evo-modal .evo-trans-fx.on {
            animation: evoTransFade 1.6s ease forwards;
          }
          #evo-modal .evo-trans-stage {
            position: relative;
            width: 240px;
            height: 300px;
          }
          #evo-modal .evo-trans-ring {
            position: absolute;
            inset: -10%;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,.45);
            box-shadow: 0 0 20px rgba(255,255,255,.25);
            opacity: .8;
            animation: none;
          }
          #evo-modal .evo-trans-envelope {
            position: absolute;
            left: 50%;
            bottom: 20px;
            width: 220px;
            height: 130px;
            transform: translateX(-50%) translateY(24px);
            border-radius: 14px;
            background: linear-gradient(160deg, #1f2937, #0b1222);
            box-shadow: 0 16px 30px rgba(0,0,0,.45);
            animation: none;
          }
          #evo-modal .evo-trans-envelope::before {
            content:"";
            position:absolute;
            inset: 6px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,.18);
          }
          #evo-modal .evo-trans-card {
            position: absolute;
            left: 50%;
            bottom: 30px;
            width: 150px;
            height: 210px;
            transform: translate(-50%, 70px) scale(.86) rotate(-6deg);
            border-radius: 16px;
            background: linear-gradient(180deg, #0f172a, #0b1222);
            border: 2px solid var(--fx-accent, #f59e0b);
            box-shadow: 0 18px 32px rgba(0,0,0,.45), 0 0 18px rgba(245,158,11,.35);
            animation: none;
            overflow: hidden;
          }
          #evo-modal .evo-trans-card::after {
            content:"";
            position:absolute;
            inset:-40%;
            background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.7) 52%, rgba(255,255,255,0) 64%);
            opacity: .7;
            transform: translateX(-30%) rotate(8deg);
            animation: none;
          }
          #evo-modal .evo-trans-sigil {
            margin-top: 18px;
            font-size: 28px;
            color: #fbbf24;
            text-align: center;
          }
          #evo-modal .evo-trans-title {
            margin-top: 6px;
            text-align: center;
            font-weight: 800;
            letter-spacing: .5px;
          }
          #evo-modal .evo-trans-stars {
            display: flex;
            gap: 4px;
            justify-content: center;
            margin-top: 8px;
            font-size: 18px;
          }
          #evo-modal .evo-trans-stars .star {
            display: inline-block;
            background: conic-gradient(from var(--h), #22c55e, #38bdf8, #a855f7, #f59e0b, #ef4444, #22c55e);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 8px rgba(255,255,255,.35);
          }
          #evo-modal .evo-stars .star {
            display: inline-block;
            margin: 0 2px;
            background: conic-gradient(from var(--h), #22c55e, #38bdf8, #a855f7, #f59e0b, #ef4444, #22c55e);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            -webkit-text-fill-color: transparent;
            text-shadow: 0 0 8px rgba(255,255,255,.35);
          }
          #evo-modal .evo-spark-layer {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 6;
          }
          #evo-modal .evo-spark {
            position: absolute;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(253,224,71,.95) 28%, rgba(251,191,36,.78) 52%, rgba(245,158,11,0) 78%);
            box-shadow: 0 0 16px rgba(253,224,71,.95), 0 0 30px rgba(245,158,11,.75), 0 0 52px rgba(245,158,11,.45);
          }
          #evo-modal .evo-impact {
            position: absolute;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 2px solid rgba(253,224,71,.95);
            box-shadow: 0 0 14px rgba(253,224,71,.9), 0 0 26px rgba(245,158,11,.7);
            pointer-events: none;
          }
          #evo-modal .evo-trans-flash {
            position: absolute;
            inset: -30%;
            background:
              radial-gradient(circle at 50% 50%, rgba(255,255,255,.8), rgba(255,255,255,0) 60%);
            opacity: 0;
            animation: none;
          }
          #evo-modal .evo-trans-fx.on .evo-trans-ring {
            animation: evoRingSpin 1.6s ease forwards;
          }
          #evo-modal .evo-trans-fx.on .evo-trans-envelope {
            animation: evoEnvUp 1.2s ease forwards;
          }
          #evo-modal .evo-trans-fx.on .evo-trans-card {
            animation: evoCardRise 1.3s ease forwards;
          }
          #evo-modal .evo-trans-fx.on .evo-trans-card::after {
            animation: evoCardSheen 1.2s ease forwards;
          }
          #evo-modal .evo-trans-fx.on .evo-trans-flash {
            animation: evoFlash 1.1s ease forwards;
          }
          @keyframes evoPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
          }
          @keyframes slotPop {
            0% { transform: rotate(45deg) scale(.6); opacity:.3; }
            70% { transform: rotate(45deg) scale(1.1); opacity:1; }
            100% { transform: rotate(45deg) scale(1); opacity:1; }
          }
          @keyframes chromeSheen {
            0% { transform: translateX(-30%) rotate(8deg); opacity: .1; }
            50% { opacity: .9; }
            100% { transform: translateX(30%) rotate(8deg); opacity: .1; }
          }
          @keyframes evoTransFade {
            0% { opacity: 0; }
            15% { opacity: 1; }
            80% { opacity: .95; }
            100% { opacity: 0; }
          }
          @keyframes evoRingSpin {
            0% { transform: scale(.85) rotate(0deg); opacity: 0; }
            40% { opacity: .9; }
            100% { transform: scale(1.05) rotate(120deg); opacity: 0; }
          }
          @keyframes evoEnvUp {
            0% { transform: translateX(-50%) translateY(28px); opacity: .4; }
            100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          }
          @keyframes evoCardRise {
            0% { transform: translate(-50%, 70px) scale(.86) rotate(-6deg); opacity: .2; }
            60% { transform: translate(-50%, -10px) scale(1) rotate(2deg); opacity: 1; }
            100% { transform: translate(-50%, -18px) scale(1.02) rotate(0deg); opacity: 1; }
          }
          @keyframes evoCardSheen {
            0% { opacity: 0; transform: translateX(-30%) rotate(8deg); }
            40% { opacity: .9; }
            100% { opacity: 0; transform: translateX(30%) rotate(8deg); }
          }
          @keyframes evoFlash {
            0% { opacity: 0; }
            35% { opacity: .9; }
            100% { opacity: 0; }
          }
          @media (max-width: 900px) and (orientation: landscape) {
            #evo-modal .evo-grid { grid-template-columns: 1fr; }
          }
        </style>
        <div id="evoSparkLayer" class="evo-spark-layer"></div>
        <div class="evo-header">
          <b>Fusionar (${def.label || b.typeKey})</b>
          <button id="evoClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);padding:6px 10px;border-radius:10px;cursor:pointer;">\u2716</button>
        </div>
        <div class="evo-grid">
          <div class="evo-list">
            ${list}
          </div>
          <div class="evo-main">
            <div id="evoTargetIcon" class="evo-target-icon">${itemIcon}</div>
            <div id="evoMainCard" class="evo-main-card">
              <div id="evoFrame" class="${frameClass}">
                <div id="evoInner" class="preview-inner${chromeClass}">
                  ${previewContent}
                </div>
              </div>
            </div>
            <div class="evo-title">${def.label || b.typeKey}</div>
          <div id="evoStars" class="evo-stars">${evoStarsHtml}</div>
            <small id="evoLevelText" style="opacity:.75;">Evolucion ${stageLabel}\u2605: ${evoLevel}/5 (${evoStatsLabel})</small>
          </div>
        </div>
        <div id="evoSlots" class="evo-slots">
          ${slotsHtml}
        </div>
        <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
          <button id="evoApply" style="
            background:#fbbf24;color:#1f1400;border:none;
            padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700;
          ">Evolucionar</button>
          <button id="evoTrans" style="
            background:#8b5cf6;color:#fff;border:none;
            padding:10px 14px;border-radius:12px;cursor:pointer;font-weight:700;
            display:none;
          ">Transcender</button>
        </div>
        <small id="evoNote" style="opacity:.7;">
          Selecciona duplicados y luego pulsa Evolucionar.
        </small>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      if (modal.parentNode) modal.remove();
      this.updateBuildingInfoModal(b, def, Date.now());
    };
    modal.querySelector("#evoClose").onclick = close;
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    const slots = Array.from(modal.querySelectorAll(".evo-slot"));
    const evoStars = modal.querySelector("#evoStars");
    const evoLevelText = modal.querySelector("#evoLevelText");
    const evoMainCard = modal.querySelector("#evoMainCard");
    const evoFrame = modal.querySelector("#evoFrame");
    const evoInner = modal.querySelector("#evoInner");
    const evoApply = modal.querySelector("#evoApply");
    const evoTrans = modal.querySelector("#evoTrans");
    const evoSparkLayer = modal.querySelector("#evoSparkLayer");
    const evoWindow = modal.querySelector(".evo-window");
    // Usa un target visible y estable para evitar desvio de luces.
    const evoSparkTarget = modal.querySelector("#evoFrame")
      || modal.querySelector("#evoMainCard")
      || modal.querySelector("#evoTargetIcon");

    const playEvoSparks = (pendingSlots) => {
      if (!evoSparkLayer || !evoWindow || !evoSparkTarget) return;
      const winRect = evoWindow.getBoundingClientRect();
      let targetRect = evoSparkTarget.getBoundingClientRect();
      if (!targetRect || targetRect.width <= 0 || targetRect.height <= 0) {
        const fallbackTarget = modal.querySelector("#evoMainCard") || evoWindow;
        targetRect = fallbackTarget.getBoundingClientRect();
      }
      const tx = targetRect.left + targetRect.width / 2 - winRect.left;
      const ty = targetRect.top + targetRect.height / 2 - winRect.top;

      pendingSlots.forEach((slot, i) => {
        const r = slot.getBoundingClientRect();
        const sx = r.left + r.width / 2 - winRect.left;
        const sy = r.top + r.height / 2 - winRect.top;
        const spark = document.createElement("div");
        spark.className = "evo-spark";
        spark.style.left = `${sx - 7}px`;
        spark.style.top = `${sy - 7}px`;
        evoSparkLayer.appendChild(spark);
        const dx = tx - sx;
        const dy = ty - sy;
        const delay = i * 180;
        const travel = Math.hypot(dx, dy);
        const duration = Math.max(1250, Math.min(1900, Math.round(900 + (travel * 1.7))));
        const anim = spark.animate([
          { transform: "translate(0,0) scale(0.45)", opacity: 0 },
          { transform: "translate(0,0) scale(1.18)", opacity: 1, offset: 0.22 },
          { transform: `translate(${dx * 0.58}px, ${dy * 0.58}px) scale(1.02)`, opacity: 0.95, offset: 0.72 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0.05 }
        ], {
          duration,
          delay,
          easing: "cubic-bezier(.22,.61,.36,1)"
        });
        anim.onfinish = () => {
          spark.remove();
          if (i === pendingSlots.length - 1) {
            const impact = document.createElement("div");
            impact.className = "evo-impact";
            impact.style.left = `${tx - 9}px`;
            impact.style.top = `${ty - 9}px`;
            evoSparkLayer.appendChild(impact);
            const hit = impact.animate([
              { transform: "scale(0.35)", opacity: 0 },
              { transform: "scale(1)", opacity: 1, offset: 0.28 },
              { transform: "scale(1.95)", opacity: 0 }
            ], {
              duration: 520,
              easing: "ease-out"
            });
            hit.onfinish = () => impact.remove();
          }
        };
      });
    };

    const pendingUsed = {};
    const getStage = () => (typeof b.evoStage === "number")
      ? b.evoStage
      : (targetRarity === 5 ? 5 : 0);
    const getLevel = () => Math.max(0, Math.min(5, b.evoLevel || 0));
    const pendingTotal = () => slots.filter((s) => s.dataset.pending === "1").length;
    const remainingSlots = () => Math.max(0, 5 - getLevel() - pendingTotal());

    const syncFixedSlots = () => {
      const level = getLevel();
      slots.forEach((s, i) => {
        const fixed = i < level;
        s.dataset.fixed = fixed ? "1" : "0";
        s.classList.toggle("fixed", fixed);
        if (fixed) {
          s.classList.add("filled");
          s.classList.remove("pending");
          s.dataset.pending = "";
          s.dataset.key = "";
          const ico = s.querySelector(".evo-slot-ico");
          if (ico) ico.innerHTML = "";
        } else if (s.dataset.pending !== "1") {
          s.classList.remove("filled");
          s.classList.remove("pending");
          s.dataset.key = "";
          const ico = s.querySelector(".evo-slot-ico");
          if (ico) ico.innerHTML = "";
        }
      });
    };

    const refreshMeta = () => {
      const level = getLevel();
      const stage = getStage();
      const stats = this.getEvolutionStats(b.typeKey, stage, level);
      if (evoLevelText) evoLevelText.textContent = `Evolucion ${stage >= 5 ? stage : targetRarity}\u2605: ${level}/5 (${stats.bonusLabel})`;

      const display = (targetRarity === 5 && stage >= 6) ? 6 : targetRarity;
      const evoActive = (level > 0) || (stage >= 6);
      if (evoStars) {
        if (display === 6) {
          evoStars.innerHTML = evoTransStars;
        } else {
          evoStars.textContent = "\u2605".repeat(display);
        }
      }
      const maxColorFrame = (display >= 1 && display <= 5 && level >= 5)
        ? ` maxed-${display}`
        : "";
      const frameCls = display === 6
        ? `frame-6${(stage >= 6 && level >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
        : `frame-${display}${evoActive ? " evo-on" : ""}${maxColorFrame}`;
      if (evoFrame) evoFrame.className = frameCls;
      const innerChrome = (display === 6 && stage >= 6 && level >= 5)
        ? " chrome"
        : ((display >= 1 && display <= 5 && level >= 5) ? ` chrome-${display}` : "");
      if (evoInner) evoInner.className = `preview-inner${innerChrome}`;
    };

    const updateListCounts = () => {
      const remaining = remainingSlots();
      modal.querySelectorAll("[data-key]").forEach((btn) => {
        const key = btn.getAttribute("data-key");
        const count = this.economy.inventory[key] || 0;
        const used = pendingUsed[key] || 0;
        const left = Math.max(0, count - used);
        const countEl = btn.querySelector(".evo-item-count");
        if (countEl) countEl.textContent = `x${left}`;
        if (left <= 0 || remaining <= 0) {
          btn.setAttribute("disabled", "true");
        } else {
          btn.removeAttribute("disabled");
        }
      });
    };

    const updateApplyState = () => {
      const pending = pendingTotal();
      if (evoApply) {
        if (pending <= 0) {
          evoApply.setAttribute("disabled", "true");
          evoApply.textContent = "Evolucionar";
        } else {
          evoApply.removeAttribute("disabled");
          evoApply.textContent = `Evolucionar (+${pending})`;
        }
      }
      if (evoTrans) {
        const stageNow = getStage();
        const levelNow = getLevel();
        const ready = (stageNow === 5 && levelNow >= 5 && pending === 0);
        if (ready) {
          evoTrans.style.display = "inline-block";
          evoTrans.removeAttribute("disabled");
        } else {
          evoTrans.style.display = "none";
          evoTrans.setAttribute("disabled", "true");
        }
      }
    };

    const addPending = (key, iconHtml) => {
      if (remainingSlots() <= 0) return;
      const count = this.economy.inventory[key] || 0;
      const used = pendingUsed[key] || 0;
      if (used >= count) return;
      const slot = slots.find((s) => s.dataset.fixed !== "1" && s.dataset.pending !== "1");
      if (!slot) return;
      slot.dataset.pending = "1";
      slot.dataset.key = key;
      slot.classList.add("filled", "pending", "pop");
      const ico = slot.querySelector(".evo-slot-ico");
      if (ico) ico.innerHTML = iconHtml || "\u2726";
      setTimeout(() => slot.classList.remove("pop"), 350);
      pendingUsed[key] = used + 1;
      updateListCounts();
      updateApplyState();
    };

    const clearPending = () => {
      slots.forEach((s) => {
        if (s.dataset.pending === "1") {
          s.dataset.pending = "";
          s.dataset.key = "";
          s.classList.remove("pending");
          if (s.dataset.fixed !== "1") s.classList.remove("filled");
          const ico = s.querySelector(".evo-slot-ico");
          if (ico) ico.innerHTML = "";
        }
      });
      Object.keys(pendingUsed).forEach((k) => delete pendingUsed[k]);
      updateListCounts();
      updateApplyState();
    };

    slots.forEach((slot) => {
      slot.addEventListener("click", () => {
        if (slot.dataset.pending !== "1") return;
        const key = slot.dataset.key;
        slot.dataset.pending = "";
        slot.dataset.key = "";
        slot.classList.remove("pending");
        if (slot.dataset.fixed !== "1") slot.classList.remove("filled");
        const ico = slot.querySelector(".evo-slot-ico");
        if (ico) ico.innerHTML = "";
        if (key) pendingUsed[key] = Math.max(0, (pendingUsed[key] || 1) - 1);
        updateListCounts();
        updateApplyState();
      });
    });

    modal.querySelectorAll("[data-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        if (!key) return;
        const iconHtml = btn.querySelector(".evo-item-ico")?.innerHTML || "\u2726";
        addPending(key, iconHtml);
      });
    });

    const flashInfoModal = () => {
      this.updateBuildingInfoModal(b, def, Date.now());
    };

    if (evoApply) {
      evoApply.addEventListener("click", () => {
        const pending = pendingTotal();
        if (pending <= 0) return;
        const stageNow = getStage();
        const levelNow = getLevel();
        if (stageNow >= 6 && levelNow >= 5) return;

        for (const [key, used] of Object.entries(pendingUsed)) {
          if ((this.economy.inventory[key] || 0) < used) {
            updateListCounts();
            return;
          }
        }

        for (const [key, used] of Object.entries(pendingUsed)) {
          const ok = this.economy.consumeItem(key, used);
          if (!ok) {
            updateListCounts();
            return;
          }
        }

        const newLevel = Math.min(5, levelNow + pending);
        if (stageNow === 5) {
          b.evoStage = 5;
          b.evoLevel = newLevel;
        } else {
          b.evoStage = stageNow;
          b.evoLevel = newLevel;
        }

        const now = Date.now();
        this.recalculateAllBuildingStats(now);
        this.updateBuildingInfoModal(b, def, now);
        this.openBuildingInfoModal(b.id);

        const pendingSlots = slots.filter((s) => s.dataset.pending === "1");
        playEvoSparks(pendingSlots);

        if (evoMainCard) {
          evoMainCard.classList.remove("evo-animate");
          void evoMainCard.offsetWidth;
          evoMainCard.classList.add("evo-animate");
        }

        clearPending();
        syncFixedSlots();
        refreshMeta();
        updateListCounts();
        updateApplyState();
      });
    }

    if (evoTrans) {
      evoTrans.addEventListener("click", () => {
        const stageNow = getStage();
        const levelNow = getLevel();
        if (!(stageNow === 5 && levelNow >= 5)) return;

        this.transcendBuilding(b, def);
        if (evoWindow) this.playTranscendAnimation(evoWindow, def);
        this.openBuildingInfoModal(b.id);

        if (evoMainCard) {
          evoMainCard.classList.remove("evo-animate");
          void evoMainCard.offsetWidth;
          evoMainCard.classList.add("evo-animate");
        }
        flashInfoModal();

        syncFixedSlots();
        refreshMeta();
        updateListCounts();
        updateApplyState();
      });
    }

    syncFixedSlots();
    refreshMeta();
    updateListCounts();
    updateApplyState();
  }

  formatSeconds(s) {
    const total = Math.max(0, Math.floor(s || 0));
    if (total >= 60) {
      const m = Math.floor(total / 60);
      const r = total % 60;
      return r ? `${m}m ${r}s` : `${m}m`;
    }
    return `${total}s`;
  }

  colorToHex(n) {
    const v = Number(n) >>> 0;
    return `#${v.toString(16).padStart(6, "0")}`;
  }

  getProducerRarityLabel(rarity) {
    return PRODUCER_RARITY_LABEL[rarity] || "Comun";
  }

  getProducerRecipesForType(typeKey, evoLevel = null) {
    const group = this.getProducerGroup(typeKey);
    if (!group) return [];
    const list = Array.isArray(PRODUCER_RECIPES[group]) ? PRODUCER_RECIPES[group] : [];
    if (evoLevel === null || evoLevel === undefined) return list;
    const level = this.getProducerEvolutionLevel(evoLevel);
    return list.filter((r) => this.getProducerRecipeUnlockLevel(r) <= level);
  }

  getProducerRecipeByKey(typeKey, recipeKey, evoLevel = null) {
    const list = this.getProducerRecipesForType(typeKey, evoLevel);
    return list.find((r) => r.key === recipeKey) || null;
  }

  getProducerMaterialLabel(materialKey) {
    if (typeof materialKey === "string" && materialKey.endsWith("_premium")) {
      const baseKey = materialKey.slice(0, -8);
      return `${this.getProducerMaterialLabel(baseKey)} Premium`;
    }
    if (PRODUCER_UPGRADE_ITEM_LABEL[materialKey]) {
      return PRODUCER_UPGRADE_ITEM_LABEL[materialKey];
    }
    for (const groupKey of Object.keys(PRODUCER_RECIPES)) {
      const list = PRODUCER_RECIPES[groupKey] || [];
      const found = list.find((r) => r.key === materialKey);
      if (found) return found.label;
    }
    return materialKey;
  }

  getProducerUiIconForMaterial(materialKey, typeKeyOrGroup = "") {
    const key = String(materialKey || "").toLowerCase();
    const group = (typeKeyOrGroup === "food" || typeKeyOrGroup === "drink" || typeKeyOrGroup === "snack")
      ? typeKeyOrGroup
      : this.getProducerGroup(typeKeyOrGroup);

    if (key.includes("_premium")) return "\u2728";
    if (key === "upgrade_prod_food") return "\u{1F6E0}\uFE0F";
    if (key === "upgrade_prod_drink") return "\u{1F6E0}\uFE0F";
    if (key === "upgrade_prod_snack") return "\u{1F6E0}\uFE0F";

    if (key.includes("hamburguesa")) return "\u{1F354}";
    if (key.includes("pizza")) return "\u{1F355}";
    if (key.includes("hotdog")) return "\u{1F32D}";
    if (key.includes("sandwich")) return "\u{1F96A}";
    if (key.includes("arroz")) return "\u{1F35A}";
    if (key.includes("empanada")) return "\u{1F95F}";
    if (key.includes("pollo") || key.includes("alitas")) return "\u{1F357}";
    if (key.includes("lasana")) return "\u{1F35D}";
    if (key.includes("burrito")) return "\u{1F32F}";
    if (key.includes("taco")) return "\u{1F32E}";
    if (key.includes("parrilla")) return "\u{1F356}";
    if (key.includes("banquete")) return "\u{1F37D}\uFE0F";
    if (key.includes("lomo")) return "\u{1F969}";

    if (key.includes("cafe")) return "\u2615";
    if (key.includes("te_") || key.includes("mate")) return "\u{1F375}";
    if (key.includes("limonada") || key.includes("gaseosa") || key.includes("refresco") || key.includes("soda")) return "\u{1F964}";
    if (key.includes("jugo")) return "\u{1F9C3}";
    if (key.includes("smoothie") || key.includes("milkshake") || key.includes("chicha")) return "\u{1F95B}";
    if (key.includes("energy")) return "\u26A1";
    if (key.includes("mojito")) return "\u{1F378}";

    if (key.includes("papitas") || key.includes("papas") || key.includes("palitos")) return "\u{1F35F}";
    if (key.includes("nachos") || key.includes("tequenos")) return "\u{1F9C0}";
    if (key.includes("mix") || key.includes("caja")) return "\u{1F4E6}";
    if (key.includes("popcorn")) return "\u{1F37F}";
    if (key.includes("cookie") || key.includes("galleta")) return "\u{1F36A}";
    if (key.includes("brownie")) return "\u{1F370}";
    if (key.includes("donut")) return "\u{1F369}";

    if (group === "food") return "\u{1F354}";
    if (group === "drink") return "\u{1F964}";
    if (group === "snack") return "\u{1F35F}";
    return "\u{1F4E6}";
  }

  isMinimarketBuilding(typeKey) {
    return typeKey === "green_2";
  }

  hasBuildingActivation(typeKey) {
    return this.isMinimarketBuilding(typeKey);
  }

  getMinimarketUnlockRequirements(b = null) {
    if (!b || !this.isMinimarketBuilding(b.typeKey)) return [];
    return MINIMARKET_GREEN2_UNLOCK_REQUIREMENTS.map((r) => ({ key: r.key, amount: r.amount }));
  }

  isMinimarketUnlocked(b) {
    if (!b || !this.isMinimarketBuilding(b.typeKey)) return true;
    return !!b.minimarketUnlocked;
  }

  getBuildingActivationRequirements(b = null) {
    if (!b || !this.hasBuildingActivation(b.typeKey)) return [];
    if (this.isMinimarketBuilding(b.typeKey)) return this.getMinimarketUnlockRequirements(b);
    return [];
  }

  isBuildingActivationUnlocked(b) {
    if (!b || !this.hasBuildingActivation(b.typeKey)) return true;
    if (this.isMinimarketBuilding(b.typeKey)) return this.isMinimarketUnlocked(b);
    return true;
  }

  getBuildingActivationMeta(b = null) {
    if (b && this.isMinimarketBuilding(b.typeKey)) {
      return {
        title: "Activacion de Minimarket",
        icon: "\u{1F3EA}",
        description: "Activa una sola vez con materiales de productoras o Tienda Yapa."
      };
    }
    return {
      title: "Activacion de Edificio",
      icon: "\u2699\uFE0F",
      description: "Activa funciones especiales del edificio."
    };
  }

  canFulfillMaterialRequirementsWithPremium(requirements = []) {
    const list = Array.isArray(requirements) ? requirements : [];
    for (const req of list) {
      const key = String(req?.key || "");
      if (!key) continue;
      const need = Math.max(1, Math.round(Number(req?.amount) || 1));
      const normal = this.getMaterialCount(key);
      const premiumKey = this.getProducerPremiumKeyForMaterial(key);
      const premium = this.getMaterialCount(premiumKey);
      if (normal >= need) continue;
      if (premium >= 1) continue;
      return false;
    }
    return true;
  }

  tryUnlockMinimarket(idOrBuilding) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isMinimarketBuilding(b.typeKey)) return { ok: false, reason: "not_minimarket" };
    if (!b.isBuilt) return { ok: false, reason: "building" };
    if (this.isMinimarketUnlocked(b)) return { ok: false, reason: "already" };

    const reqs = this.getMinimarketUnlockRequirements(b);
    const res = this.consumeMaterialRequirementsWithPremium(reqs);
    if (!res.ok) return { ok: false, reason: "materials", missingKey: res.missingKey };

    b.minimarketUnlocked = true;
    b.prodStart = Date.now();
    b.rewardReady = false;
    this.recalculateAllBuildingStats(Date.now());
    this.updateBuildingInfoModal(b, BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1, Date.now());
    this.updateBuildingActivationModal();
    return { ok: true, reason: "unlocked" };
  }

  tryActivateBuilding(idOrBuilding) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b) return { ok: false, reason: "building" };
    if (!this.hasBuildingActivation(b.typeKey)) return { ok: false, reason: "no_activation" };
    if (this.isMinimarketBuilding(b.typeKey)) return this.tryUnlockMinimarket(b);
    return { ok: false, reason: "no_activation" };
  }

  closeBuildingActivationModal() {
    const modal = document.getElementById("building-activation-modal");
    if (modal) modal.remove();
  }

  openBuildingActivationModal(idOrBuilding) {
    this.closeBuildingActivationModal();
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.hasBuildingActivation(b.typeKey)) return;

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const meta = this.getBuildingActivationMeta(b);
    this.buildingActivationLastLabel = "";

    const modal = document.createElement("div");
    modal.id = "building-activation-modal";
    modal.dataset.buildingId = String(b.id);
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,.55)",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px"
    });

    modal.innerHTML = `
      <div style="
        width:min(540px,94vw);max-height:min(76vh,700px);overflow:hidden;
        background:#091127;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
        border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.45);
        display:grid;grid-template-rows:auto minmax(0,1fr) auto;
        font-family:Arial,sans-serif;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 14px 10px;border-bottom:1px solid rgba(255,255,255,.08);">
          <div>
            <div style="font-weight:800;font-size:18px;">${meta.title}</div>
            <div style="font-size:12px;opacity:.8;">${def.label || b.typeKey}</div>
          </div>
          <button id="buildingActClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:7px 10px;cursor:pointer;">X</button>
        </div>

        <div style="padding:12px;overflow:auto;display:grid;gap:12px;">
          <div id="buildingActSummary" style="font-size:13px;color:#cbd5e1;">--</div>
          <div id="buildingActHint" style="font-size:12px;color:#fbbf24;min-height:14px;">${meta.description}</div>

          <div style="display:grid;justify-items:center;gap:26px;">
            <div style="
              width:92px;height:92px;transform:rotate(45deg);border-radius:16px;
              background:linear-gradient(135deg,#0f172a,#1d4ed8);border:2px solid rgba(255,255,255,.18);
              display:grid;place-items:center;box-shadow:0 12px 28px rgba(29,78,216,.25);
            ">
              <div style="transform:rotate(-45deg);display:grid;justify-items:center;gap:2px;">
                <div style="font-size:24px;">${meta.icon}</div>
                <div id="buildingActBadgeState" style="font-size:11px;font-weight:800;color:#fff;">PEND.</div>
              </div>
            </div>
            <div id="buildingActReqLine" style="font-size:12px;color:#cbd5e1;text-align:center;">--</div>
          </div>

          <div style="display:grid;gap:8px;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px;">
            <div style="font-size:13px;opacity:.9;">Requisitos de activacion</div>
            <div id="buildingActReqList" style="display:grid;gap:8px;"></div>
          </div>
        </div>

        <div style="padding:12px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
          <button id="buildingActDo" style="background:#22c55e;color:#022c22;border:none;border-radius:12px;padding:10px 14px;font-weight:700;cursor:pointer;">Activar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => this.closeBuildingActivationModal();
    modal.querySelector("#buildingActClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    modal.querySelector("#buildingActDo")?.addEventListener("click", () => {
      const id = Number(modal.dataset.buildingId || 0);
      const res = this.tryActivateBuilding(id);
      if (!res.ok) {
        if (res.reason === "materials") {
          const missingLabel = this.getProducerMaterialLabel(res.missingKey || "");
          this.buildingActivationLastLabel = `Faltan materiales: ${missingLabel}`;
        } else if (res.reason === "building") {
          this.buildingActivationLastLabel = "Debe terminar construccion.";
        } else if (res.reason === "already") {
          this.buildingActivationLastLabel = "Este edificio ya esta activado.";
        } else {
          this.buildingActivationLastLabel = "No se pudo activar.";
        }
      } else {
        this.buildingActivationLastLabel = "Activacion completada.";
      }
      this.updateBuildingInfoModal(b, def, Date.now());
      this.updateBuildingActivationModal();
    });

    this.updateBuildingActivationModal();
  }

  updateBuildingActivationModal() {
    const modal = document.getElementById("building-activation-modal");
    if (!modal) return;
    const id = Number(modal.dataset.buildingId || 0);
    const b = buildings.get(id);
    if (!b || !this.hasBuildingActivation(b.typeKey)) {
      this.closeBuildingActivationModal();
      return;
    }

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const meta = this.getBuildingActivationMeta(b);
    const activated = this.isBuildingActivationUnlocked(b);
    const built = !!b.isBuilt;
    const reqs = this.getBuildingActivationRequirements(b);
    const canPay = this.canFulfillMaterialRequirementsWithPremium(reqs);
    const canActivate = built && !activated && canPay;

    const summaryEl = modal.querySelector("#buildingActSummary");
    const hintEl = modal.querySelector("#buildingActHint");
    const badgeEl = modal.querySelector("#buildingActBadgeState");
    const reqLineEl = modal.querySelector("#buildingActReqLine");
    const reqListEl = modal.querySelector("#buildingActReqList");
    const actBtn = modal.querySelector("#buildingActDo");

    if (summaryEl) {
      const stateText = !built ? "En construccion" : (activated ? "Activado" : "Pendiente");
      summaryEl.innerHTML = `<b>${def.label || b.typeKey}</b> | Estado: <b>${stateText}</b>`;
    }
    if (hintEl) {
      hintEl.textContent = this.buildingActivationLastLabel || meta.description || "";
      hintEl.style.color = activated ? "#86efac" : "#fbbf24";
    }
    if (badgeEl) badgeEl.textContent = !built ? "BUILD" : (activated ? "OK" : "PEND.");
    if (reqLineEl) {
      if (!reqs.length) reqLineEl.textContent = "Sin requisitos.";
      else reqLineEl.textContent = "Premium reemplaza el requisito completo de una linea.";
    }

    if (reqListEl) {
      reqListEl.innerHTML = reqs.map((r) => {
        const key = String(r.key || "");
        const need = Math.max(1, Math.round(Number(r.amount) || 1));
        const have = this.getMaterialCount(key);
        const premiumKey = this.getProducerPremiumKeyForMaterial(key);
        const premiumHave = this.getMaterialCount(premiumKey);
        const ok = (have >= need) || (premiumHave >= 1);
        const color = ok ? "#86efac" : "#fca5a5";
        const icon = this.getProducerUiIconForMaterial(key, b.typeKey);
        const premiumIcon = this.getProducerUiIconForMaterial(premiumKey, b.typeKey);
        return `
          <div style="display:grid;gap:6px;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px;background:#0b1326;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
              <div style="font-weight:700;color:${color};display:flex;align-items:center;gap:6px;">${icon} ${this.getProducerMaterialLabel(key)}</div>
              <div style="font-size:12px;color:${color};font-weight:800;">${ok ? "OK" : "FALTA"}</div>
            </div>
            <div style="font-size:12px;color:#cbd5e1;">
              Normal: ${have}/${need} | Premium (${premiumIcon}): ${premiumHave}/1
            </div>
          </div>
        `;
      }).join("") || `<div style="font-size:12px;color:#cbd5e1;">Sin requisitos.</div>`;
    }

    if (actBtn) {
      actBtn.textContent = !built ? "En construccion" : (activated ? "Activado" : "Activar");
      if (canActivate) {
        actBtn.removeAttribute("disabled");
        actBtn.style.opacity = "1";
        actBtn.style.cursor = "pointer";
      } else {
        actBtn.setAttribute("disabled", "true");
        actBtn.style.opacity = ".65";
        actBtn.style.cursor = "not-allowed";
      }
    }
  }

  getProducerEvolutionLevel(buildingOrLevel) {
    const raw = (typeof buildingOrLevel === "object")
      ? (buildingOrLevel?.evoLevel ?? 0)
      : Number(buildingOrLevel) || 0;
    return Math.max(0, Math.min(PRODUCER_EVOLUTION_MAX_LEVEL, Math.round(raw)));
  }

  getProducerEvolutionStats(levelRaw = 0) {
    const level = this.getProducerEvolutionLevel(levelRaw);
    const amountMult = 1 + (PRODUCER_EVOLUTION_AMOUNT_STEP * level);
    const timeMult = Math.max(0.45, 1 - (PRODUCER_EVOLUTION_TIME_STEP * level));
    const premiumChance = Math.min(
      PRODUCER_EVOLUTION_PREMIUM_MAX_CHANCE,
      (PRODUCER_EVOLUTION_PREMIUM_MAX_CHANCE / PRODUCER_EVOLUTION_MAX_LEVEL) * level
    );
    return { level, amountMult, timeMult, premiumChance };
  }

  getProducerRecipeUnlockLevel(recipe) {
    return Math.max(0, Math.min(PRODUCER_EVOLUTION_MAX_LEVEL, Math.round(Number(recipe?.unlockLevel) || 0)));
  }

  getProducerUpgradeItemKey(typeKeyOrGroup) {
    const group = PRODUCER_UPGRADE_ITEM_BY_GROUP[typeKeyOrGroup]
      ? typeKeyOrGroup
      : this.getProducerGroup(typeKeyOrGroup);
    if (!group) return null;
    return PRODUCER_UPGRADE_ITEM_BY_GROUP[group] || null;
  }

  getProducerUpgradeItemLabel(typeKeyOrGroup) {
    const key = this.getProducerUpgradeItemKey(typeKeyOrGroup);
    return key ? (PRODUCER_UPGRADE_ITEM_LABEL[key] || key) : "Mejora Produccion";
  }

  getProducerDupeItemKey(typeKey) {
    if (typeKey === "producer_food_1x1") return "red_1";
    if (typeKey === "producer_drink_1x1") return "blue_1";
    return typeKey;
  }

  getProducerDupeItemLabel(typeKey) {
    const dupeKey = this.getProducerDupeItemKey(typeKey);
    const item = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS?.[dupeKey]) ? ITEM_DEFS[dupeKey] : null;
    return item?.name || dupeKey;
  }

  getProducerNextEvolutionCost(levelRaw = 0, typeKey = "") {
    const level = this.getProducerEvolutionLevel(levelRaw);
    const idx = Math.max(0, Math.min(PRODUCER_EVOLUTION_MAX_LEVEL - 1, level));
    const dupes = Math.max(1, Math.round(Number(PRODUCER_EVOLUTION_DUPE_COST[idx]) || 1));
    const upgrades = Math.max(1, Math.round(Number(PRODUCER_EVOLUTION_UPGRADE_COST[idx]) || (idx + 1)));
    const upgradeKey = this.getProducerUpgradeItemKey(typeKey);
    return { level, dupes, upgrades, upgradeKey };
  }

  getProducerRecipePreview(b, recipe) {
    const level = this.getProducerEvolutionLevel(b);
    const evo = this.getProducerEvolutionStats(level);
    const unlockLevel = this.getProducerRecipeUnlockLevel(recipe);
    const unlocked = level >= unlockLevel;
    const npc = this.getNpcBuffForBuilding(b);

    const baseAmount = Math.max(1, Math.round(Number(recipe?.amount) || 1));
    const amount = Math.max(1, Math.round(baseAmount * evo.amountMult * (npc.producerAmountMult || 1)));
    const baseDuration = this.calculateProducerDurationSeconds(recipe, amount);
    const durationSec = Math.max(1, Math.round(baseDuration * evo.timeMult * (npc.producerTimeMult || 1)));
    const premiumChance = Phaser.Math.Clamp(
      (evo.premiumChance || 0) + (npc.producerPremiumBonus || 0),
      0,
      PRODUCER_PREMIUM_MAX_TOTAL_CHANCE
    );

    return {
      unlocked,
      unlockLevel,
      amount,
      durationSec,
      premiumChance,
      evo,
      npc
    };
  }

  calculateProducerDurationSeconds(recipe, amount = 1) {
    const qty = Math.max(1, Math.round(Number(amount) || 1));
    const base = Math.max(1, Math.round(Number(recipe?.baseSeconds) || 1));
    const mult = Number(PRODUCER_RARITY_MULT[recipe?.rarity] || 1);
    return Math.max(1, Math.round(base * mult * qty));
  }

  ensureMaterialInventory() {
    if (!this.materialInventory || typeof this.materialInventory !== "object") {
      this.materialInventory = Object.create(null);
    }
    return this.materialInventory;
  }

  getMaterialCount(materialKey) {
    const inv = this.ensureMaterialInventory();
    return Math.max(0, Math.round(Number(inv[materialKey]) || 0));
  }

  addMaterialItem(materialKey, amount = 1) {
    const inv = this.ensureMaterialInventory();
    const qty = Math.max(1, Math.round(Number(amount) || 1));
    inv[materialKey] = this.getMaterialCount(materialKey) + qty;
    return inv[materialKey];
  }

  consumeMaterialItem(materialKey, amount = 1) {
    const inv = this.ensureMaterialInventory();
    const qty = Math.max(1, Math.round(Number(amount) || 1));
    const current = this.getMaterialCount(materialKey);
    if (current < qty) return false;
    inv[materialKey] = current - qty;
    if (inv[materialKey] <= 0) delete inv[materialKey];
    return true;
  }

  getProducerPremiumKeyForMaterial(materialKey) {
    return `${materialKey}_premium`;
  }

  consumeMaterialRequirementWithPremium(materialKey, requiredAmount = 1) {
    const need = Math.max(1, Math.round(Number(requiredAmount) || 1));
    const normal = this.getMaterialCount(materialKey);
    if (normal >= need) {
      this.consumeMaterialItem(materialKey, need);
      return { ok: true, usedPremium: false, consumedKey: materialKey, consumedAmount: need };
    }

    const premiumKey = this.getProducerPremiumKeyForMaterial(materialKey);
    const premiumCount = this.getMaterialCount(premiumKey);
    if (premiumCount >= 1) {
      this.consumeMaterialItem(premiumKey, 1);
      return { ok: true, usedPremium: true, consumedKey: premiumKey, consumedAmount: 1 };
    }

    return { ok: false, usedPremium: false, consumedKey: materialKey, consumedAmount: 0 };
  }

  consumeMaterialRequirementsWithPremium(requirements = []) {
    if (!Array.isArray(requirements) || !requirements.length) return { ok: true, usedPremium: false };

    const dryRun = [];
    for (const req of requirements) {
      const key = req?.key;
      if (!key) continue;
      const need = Math.max(1, Math.round(Number(req?.amount) || 1));

      const normal = this.getMaterialCount(key);
      if (normal >= need) {
        dryRun.push({ key, amount: need, premium: false });
        continue;
      }

      const premiumKey = this.getProducerPremiumKeyForMaterial(key);
      const premiumCount = this.getMaterialCount(premiumKey);
      if (premiumCount >= 1) {
        dryRun.push({ key: premiumKey, amount: 1, premium: true });
        continue;
      }

      return { ok: false, missingKey: key, usedPremium: false };
    }

    let usedPremium = false;
    for (const op of dryRun) {
      const ok = this.consumeMaterialItem(op.key, op.amount);
      if (!ok) return { ok: false, missingKey: op.key, usedPremium };
      if (op.premium) usedPremium = true;
    }

    return { ok: true, usedPremium };
  }

  getProducerEvolutionState(b) {
    const level = this.getProducerEvolutionLevel(b);
    const stats = this.getProducerEvolutionStats(level);
    const cost = this.getProducerNextEvolutionCost(level, b?.typeKey);

    const dupeKey = this.getProducerDupeItemKey(b?.typeKey || "");
    const dupeInv = Math.max(0, Math.round(Number(this.economy?.inventory?.[dupeKey]) || 0));
    const upgradeInv = cost.upgradeKey ? this.getMaterialCount(cost.upgradeKey) : 0;

    return {
      level,
      maxed: level >= PRODUCER_EVOLUTION_MAX_LEVEL,
      stats,
      cost,
      dupeKey,
      dupeInv,
      upgradeInv,
      canEvolve: (level < PRODUCER_EVOLUTION_MAX_LEVEL) && (dupeInv >= cost.dupes) && (upgradeInv >= cost.upgrades)
    };
  }

  evolveProducerBuilding(idOrBuilding) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isProducerBuilding(b.typeKey)) return { ok: false, reason: "not_producer" };
    if (!b.isBuilt) return { ok: false, reason: "building" };

    const evoState = this.getProducerEvolutionState(b);
    if (evoState.maxed) return { ok: false, reason: "max" };

    if (evoState.dupeInv < evoState.cost.dupes) return { ok: false, reason: "dupe" };
    if (evoState.upgradeInv < evoState.cost.upgrades) return { ok: false, reason: "upgrade" };

    const consumeDupeOk = this.economy?.consumeItem?.(evoState.dupeKey, evoState.cost.dupes);
    if (!consumeDupeOk) return { ok: false, reason: "dupe" };

    const consumeUpgradeOk = this.consumeMaterialItem(evoState.cost.upgradeKey, evoState.cost.upgrades);
    if (!consumeUpgradeOk) {
      this.economy?.addItem?.(evoState.dupeKey, evoState.cost.dupes);
      return { ok: false, reason: "upgrade" };
    }

    b.evoLevel = Math.min(PRODUCER_EVOLUTION_MAX_LEVEL, evoState.level + 1);
    if ((b.evoStage || 0) < 5) b.evoStage = 5;

    this.producerModalLastLabel = `Evolucion completada: Nivel ${b.evoLevel}`;
    this.updateProducerRecipeModal();
    this.updateProducerEvolutionModal();
    return { ok: true, reason: "evolved", level: b.evoLevel };
  }

  startProducerRecipe(idOrBuilding, recipeKey) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isProducerBuilding(b.typeKey)) return { ok: false, reason: "not_producer" };
    if (!b.isBuilt) return { ok: false, reason: "building" };

    const current = b.producerJob || null;
    if (current && current.ready) return { ok: false, reason: "collect_first" };
    if (current && !current.ready) return { ok: false, reason: "busy" };

    const recipe = this.getProducerRecipeByKey(b.typeKey, recipeKey, null);
    if (!recipe) return { ok: false, reason: "recipe" };

    const preview = this.getProducerRecipePreview(b, recipe);
    if (!preview.unlocked) return { ok: false, reason: "recipe_locked" };

    const now = Date.now();
    const chancePct = Math.round(preview.premiumChance * 1000) / 10;

    b.producerJob = {
      recipeKey: recipe.key,
      recipeLabel: recipe.label,
      rarity: recipe.rarity,
      amount: preview.amount,
      durationSec: preview.durationSec,
      durationMs: preview.durationSec * 1000,
      startedAt: now,
      endsAt: now + (preview.durationSec * 1000),
      ready: false,
      unlockLevel: preview.unlockLevel,
      evoLevelAtStart: preview.evo.level,
      premiumChance: preview.premiumChance,
      premiumChancePct: chancePct,
      premiumKey: this.getProducerPremiumKeyForMaterial(recipe.key)
    };

    this.producerModalLastLabel = `Produccion iniciada: ${recipe.label}`;
    this.updateProducerRecipeModal();
    return { ok: true, reason: "started" };
  }

  collectProducerRecipe(idOrBuilding) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isProducerBuilding(b.typeKey)) return { ok: false, reason: "not_producer" };

    const job = b.producerJob || null;
    if (!job || !job.ready) return { ok: false, reason: "not_ready" };

    const chance = Phaser.Math.Clamp(Number(job.premiumChance) || 0, 0, PRODUCER_PREMIUM_MAX_TOTAL_CHANCE);
    const premiumHit = chance > 0 && Math.random() < chance;

    if (premiumHit) {
      const premiumKey = job.premiumKey || this.getProducerPremiumKeyForMaterial(job.recipeKey);
      this.addMaterialItem(premiumKey, 1);
      this.producerModalLastLabel = `Drop PREMIUM: ${this.getProducerMaterialLabel(premiumKey)} x1`;
    } else {
      this.addMaterialItem(job.recipeKey, job.amount);
      this.producerModalLastLabel = `Recolectado: ${job.amount}x ${job.recipeLabel}`;
    }

    b.producerJob = null;
    b.rewardReady = false;
    b.rewardGoldIcon?.setVisible(false);
    b.rewardExpIcon?.setVisible(false);
    this.updateProducerRecipeModal();
    return { ok: true, reason: "collected" };
  }
  closeProducerRecipeModal() {
    const modal = document.getElementById("producer-modal");
    this.closeProducerEvolutionModal();
    if (modal) modal.remove();
  }

  closeProducerEvolutionModal() {
    const modal = document.getElementById("producer-evo-modal");
    if (modal) modal.remove();
  }

  openProducerEvolutionModal(idOrBuilding) {
    this.closeProducerEvolutionModal();
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isProducerBuilding(b.typeKey)) return;

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const modal = document.createElement("div");
    modal.id = "producer-evo-modal";
    modal.dataset.buildingId = String(b.id);
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,.55)",
      zIndex: "999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px"
    });

    modal.innerHTML = `
      <div style="
        width:min(540px,94vw);max-height:min(76vh,700px);overflow:hidden;
        background:#091127;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
        border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.45);
        display:grid;grid-template-rows:auto minmax(0,1fr) auto;gap:0;
        font-family:Arial,sans-serif;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 14px 10px;border-bottom:1px solid rgba(255,255,255,.08);">
          <div>
            <div style="font-weight:800;font-size:18px;">Evolucionar Productora</div>
            <div style="font-size:12px;opacity:.8;">${def.label || b.typeKey}</div>
          </div>
          <button id="producerEvoClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);border-radius:10px;padding:7px 10px;cursor:pointer;">X</button>
        </div>

        <div style="padding:12px;overflow:auto;display:grid;gap:12px;">
          <div id="producerEvoSummary" style="font-size:13px;color:#cbd5e1;">--</div>
          <div id="producerEvoHint" style="font-size:12px;color:#fbbf24;min-height:14px;">Usa duplicado + item de mejora para subir nivel.</div>

          <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:10px;align-items:center;">
            <div id="producerEvoSlotDupe" style="
              background:#0f172a;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px;
              display:grid;justify-items:center;gap:8px;
            "></div>
            <div style="font-size:22px;opacity:.8;">&#x2795;</div>
            <div id="producerEvoSlotUpgrade" style="
              background:#0f172a;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:10px;
              display:grid;justify-items:center;gap:8px;
            "></div>
          </div>

          <div style="display:grid;justify-items:center;gap:26px;">
            <div style="
              width:92px;height:92px;transform:rotate(45deg);border-radius:16px;
              background:linear-gradient(135deg,#7c3aed,#a855f7);border:2px solid rgba(255,255,255,.18);
              display:grid;place-items:center;box-shadow:0 12px 28px rgba(124,58,237,.35);
            ">
              <div style="transform:rotate(-45deg);display:grid;justify-items:center;gap:2px;">
                <div style=\"font-size:24px;\">&#x1F48E;</div>
                <div id=\"producerEvoNextLevel\" style=\"font-size:12px;font-weight:800;color:#fff;\">L1</div>
              </div>
            </div>
            <div id="producerEvoReqLine" style="font-size:12px;color:#cbd5e1;text-align:center;">--</div>
          </div>

          <div style="display:grid;gap:8px;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px;">
            <div style="font-size:13px;opacity:.9;">Inventario relevante</div>
            <div id="producerEvoInventory" style="display:flex;flex-wrap:wrap;gap:8px;"></div>
          </div>
        </div>

        <div style="padding:12px;border-top:1px solid rgba(255,255,255,.08);display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
          <button id="producerEvoDo" style="background:#a855f7;color:#fff;border:none;border-radius:12px;padding:10px 14px;font-weight:700;cursor:pointer;">Evolucionar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => this.closeProducerEvolutionModal();
    modal.querySelector("#producerEvoClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    modal.querySelector("#producerEvoDo")?.addEventListener("click", () => {
      const id = Number(modal.dataset.buildingId || 0);
      const res = this.evolveProducerBuilding(id);
      if (!res.ok) {
        if (res.reason === "dupe") this.producerModalLastLabel = "Falta duplicado para evolucionar.";
        else if (res.reason === "upgrade") this.producerModalLastLabel = "Faltan Objetos de Mejora de Produccion.";
        else if (res.reason === "max") this.producerModalLastLabel = "Ya esta en nivel maximo.";
        else if (res.reason === "building") this.producerModalLastLabel = "Debe terminar construccion.";
        else this.producerModalLastLabel = "No se pudo evolucionar.";
      }
      this.updateProducerRecipeModal();
      this.updateProducerEvolutionModal();
    });

    this.updateProducerEvolutionModal();
  }

  updateProducerEvolutionModal() {
    const modal = document.getElementById("producer-evo-modal");
    if (!modal) return;
    const id = Number(modal.dataset.buildingId || 0);
    const b = buildings.get(id);
    if (!b || !this.isProducerBuilding(b.typeKey)) {
      this.closeProducerEvolutionModal();
      return;
    }

    const evoState = this.getProducerEvolutionState(b);
    const nextLevel = Math.min(PRODUCER_EVOLUTION_MAX_LEVEL, evoState.level + 1);
    const amountPct = Math.round((evoState.stats.amountMult - 1) * 100);
    const timePct = Math.round((1 - evoState.stats.timeMult) * 100);
    const premiumPct = (evoState.stats.premiumChance * 100).toFixed(1);
    const npcSummary = this.getNpcBuffSummaryForBuilding(b);
    const dupeLabel = this.getProducerDupeItemLabel(b.typeKey);
    const upgradeLabel = this.getProducerUpgradeItemLabel(b.typeKey);
    const summaryEl = modal.querySelector("#producerEvoSummary");
    const hintEl = modal.querySelector("#producerEvoHint");
    const reqLineEl = modal.querySelector("#producerEvoReqLine");
    const nextLevelEl = modal.querySelector("#producerEvoNextLevel");
    const invEl = modal.querySelector("#producerEvoInventory");
    const dupeSlotEl = modal.querySelector("#producerEvoSlotDupe");
    const upgradeSlotEl = modal.querySelector("#producerEvoSlotUpgrade");
    const evoBtn = modal.querySelector("#producerEvoDo");

    if (summaryEl) {
      summaryEl.innerHTML = `<b>Nivel ${evoState.level}/${PRODUCER_EVOLUTION_MAX_LEVEL}</b> | Cantidad +${amountPct}% | Tiempo -${timePct}% | Premium ${premiumPct}%`;
    }
    if (nextLevelEl) nextLevelEl.textContent = evoState.maxed ? "MAX" : `L${nextLevel}`;

    const dupeOk = evoState.dupeInv >= evoState.cost.dupes;
    const upgradeOk = evoState.upgradeInv >= evoState.cost.upgrades;
    const okColor = "#22c55e";
    const badColor = "#ef4444";
    const slotWrap = (icon, title, need, have, ok) => `
      <div style="
        width:72px;height:72px;transform:rotate(45deg);border-radius:14px;
        background:${ok ? "linear-gradient(135deg,#0f5132,#16a34a)" : "linear-gradient(135deg,#3f1d1d,#7f1d1d)"};
        border:1px solid rgba(255,255,255,.16);display:grid;place-items:center;
      ">
        <div style="transform:rotate(-45deg);display:grid;justify-items:center;gap:2px;">
          <div style="font-size:22px;">${icon}</div>
          <div style="font-size:10px;font-weight:800;color:#fff;">${have}/${need}</div>
        </div>
      </div>
      <div style="font-weight:700;font-size:12px;text-align:center;line-height:1.2;">${title}</div>
      <div style="font-size:11px;color:${ok ? okColor : badColor};font-weight:700;">${ok ? "Listo" : "Falta"}</div>
    `;

    if (dupeSlotEl) {
      dupeSlotEl.innerHTML = slotWrap(this.getProducerUiIconForMaterial(evoState.dupeKey, b.typeKey), dupeLabel, evoState.cost.dupes, evoState.dupeInv, dupeOk);
    }
    if (upgradeSlotEl) {
      upgradeSlotEl.innerHTML = slotWrap(this.getProducerUiIconForMaterial(evoState.cost.upgradeKey, b.typeKey), upgradeLabel, evoState.cost.upgrades, evoState.upgradeInv, upgradeOk);
    }

    if (reqLineEl) {
      reqLineEl.textContent = evoState.maxed
        ? "Nivel maximo alcanzado."
        : `Req L${nextLevel}: ${dupeLabel} x${evoState.cost.dupes} + ${upgradeLabel} x${evoState.cost.upgrades}`;
    }

    if (invEl) {
      invEl.innerHTML = [
        `<span style="padding:6px 8px;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:#0f172a;">${this.getProducerUiIconForMaterial(evoState.dupeKey, b.typeKey)} ${dupeLabel}: <b>x${evoState.dupeInv}</b></span>`,
        `<span style="padding:6px 8px;border:1px solid rgba(255,255,255,.14);border-radius:8px;background:#0f172a;">${this.getProducerUiIconForMaterial(evoState.cost.upgradeKey, b.typeKey)} ${upgradeLabel}: <b>x${evoState.upgradeInv}</b></span>`
      ].join("");
    }

    if (hintEl) {
      if (evoState.maxed) hintEl.textContent = "Esta productora ya esta al maximo.";
      else if (!b.isBuilt) hintEl.textContent = "Debe terminar construccion para evolucionar.";
      else if (!dupeOk && !upgradeOk) hintEl.textContent = "Necesitas duplicado y item de mejora.";
      else if (!dupeOk) hintEl.textContent = "Necesitas duplicado de la productora.";
      else if (!upgradeOk) hintEl.textContent = "Necesitas item de mejora de produccion.";
      else hintEl.textContent = "Todo listo para evolucionar.";
    }

    if (evoBtn) {
      if (!b.isBuilt || evoState.maxed || !evoState.canEvolve) evoBtn.setAttribute("disabled", "true");
      else evoBtn.removeAttribute("disabled");
      evoBtn.textContent = evoState.maxed ? "Nivel MAX" : `Evolucionar L${nextLevel}`;
      evoBtn.style.opacity = (!b.isBuilt || evoState.maxed || !evoState.canEvolve) ? ".65" : "1";
      evoBtn.style.cursor = (!b.isBuilt || evoState.maxed || !evoState.canEvolve) ? "not-allowed" : "pointer";
    }
  }

  openProducerRecipeModal(id) {
    this.closeProducerRecipeModal();

    const b = buildings.get(id);
    if (!b || !this.isProducerBuilding(b.typeKey)) return;
    if (this.isBuildingInfoLocked(b, Date.now())) return;

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const recipes = this.getProducerRecipesForType(b.typeKey, null);
    this.producerModalLastLabel = "";

    const modal = document.createElement("div");
    modal.id = "producer-modal";
    modal.dataset.buildingId = String(id);
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.55)",
      zIndex: "999998",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto",
      padding: "12px 10px",
      overflowY: "auto"
    });

    const rows = recipes.map((r) => {
      const preview = this.getProducerRecipePreview(b, r);
      const locked = !preview.unlocked;
      const unlockLabel = locked
        ? `Desbloquea en Evolucion ${preview.unlockLevel}`
        : `Disponible (Evolucion ${preview.evo.level})`;
      const premiumPct = (preview.premiumChance * 100).toFixed(1);
      const recipeIcon = this.getProducerUiIconForMaterial(r.key, b.typeKey);
      const buttonBg = locked ? "#111827" : "#0f172a";
      const buttonOpacity = locked ? 0.58 : 1;
      return `
        <button data-producer-recipe="${r.key}" data-unlock-level="${preview.unlockLevel}" style="
          background:${buttonBg};color:#e5e7eb;border:1px solid rgba(255,255,255,.16);
          padding:10px;border-radius:10px;cursor:pointer;text-align:left;
          display:grid;grid-template-columns:40px minmax(0,1fr);column-gap:10px;row-gap:4px;align-items:start;opacity:${buttonOpacity};
        ">
          <div style="grid-row:1 / span 3;width:40px;height:40px;border-radius:10px;background:#0b1630;border:1px solid rgba(255,255,255,.08);display:grid;place-items:center;font-size:20px;">${recipeIcon}</div>
          <div style="min-width:0;"><b>${r.label}</b> <span style="opacity:.8;">(${this.getProducerRarityLabel(r.rarity)})</span></div>
          <div data-producer-line="meta" style="font-size:12px;opacity:.85;">x${preview.amount} | ${this.formatSeconds(preview.durationSec)} | Premium ${premiumPct}%</div>
          <div data-producer-line="unlock" style="font-size:11px;opacity:.72;">${unlockLabel}</div>
        </button>
      `;
    }).join("");

    modal.innerHTML = `
      <div style="
        width:min(640px,92vw);max-width:640px;height:min(76vh,640px);background:#0b1222;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
        border-radius:16px;padding:14px;box-shadow:0 20px 60px rgba(0,0,0,.5);
        font-family:Arial,sans-serif;display:grid;gap:10px;overflow:hidden;grid-template-rows:auto auto auto auto auto auto minmax(0,1fr) auto auto;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <h2 style="margin:0;font-size:18px;">Recetas: ${def.label || b.typeKey}</h2>
          <button id="producerClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);padding:8px 10px;border-radius:10px;cursor:pointer;">X</button>
        </div>

        <div id="producerStatus" style="font-size:14px;color:#cbd5e1;">Estado: --</div>
        <div id="producerEvoStatus" style="font-size:13px;color:#93c5fd;">Evolucion: --</div>
        <div id="producerEvoReq" style="font-size:12px;color:#cbd5e1;opacity:.85;">Req: --</div>
        <div id="producerNpcStatus" style="font-size:12px;color:#67e8f9;">NPC: --</div>
        <div id="producerMsg" style="font-size:12px;color:#fbbf24;min-height:14px;"></div>

        <div style="display:grid;gap:6px;">
          <div style="display:flex;justify-content:space-between;font-size:13px;opacity:.85;">
            <span>Produccion</span>
            <span id="producerTime">-</span>
          </div>
          <div style="height:10px;background:#1e293b;border-radius:999px;overflow:hidden;">
            <div id="producerFill" style="height:100%;width:0%;background:#a855f7;"></div>
          </div>
          <button id="producerCollect" style="
            background:#f59e0b;color:#1f1400;border:none;padding:10px 12px;border-radius:12px;
            cursor:pointer;font-weight:700;justify-self:start;
          " disabled>Recolectar Material</button>
        </div>

        <div style="display:grid;gap:8px;min-height:0;">
          <div style="font-size:13px;opacity:.85;">Recetas disponibles</div>
          <div id="producerRecipeList" style="display:grid;grid-template-columns:1fr;gap:8px;min-height:0;overflow:auto;align-content:start;padding-right:4px;">${rows}</div>
        </div>

        <div style="display:grid;gap:8px;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:10px;">
          <div style="font-size:13px;opacity:.9;">Inventario de materiales</div>
          <div id="producerMaterialList" style="display:flex;flex-wrap:wrap;gap:8px;max-height:72px;overflow:auto;align-content:flex-start;"></div>
        </div>

        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button id="producerEvolve" style="background:#a855f7;color:#f5f3ff;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;">Evolucionar</button>
          <button id="producerNpcManage" style="background:#38bdf8;color:#032b44;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;">Gestionar NPC</button>
          <button id="producerSpriteAlign" style="background:#334155;color:#e2e8f0;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;display:none;">Calibrar Sprite</button>
          <button id="producerMove" style="background:#22c55e;color:#022c22;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;">Mover</button>
          <button id="producerRotate" style="background:#38bdf8;color:#022c22;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;">Girar</button>
          <button id="producerDelete" style="background:#ef4444;color:#fff;border:none;padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;">Eliminar</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => {
      if (modal.parentNode) modal.remove();
      this.selectedBuildingId = null;
      this.hideActionButtons();
      this.cancelSelectBtn?.setVisible(false);
      this.cancelSelectBorder?.setVisible(false);
      this.setCursorMode();
      this.closeBuildingActivationModal();
    };

    const closeBtn = modal.querySelector("#producerClose");
    if (closeBtn) closeBtn.onclick = close;

    const collectBtn = modal.querySelector("#producerCollect");
    if (collectBtn) {
      collectBtn.addEventListener("click", () => {
        this.collectProducerRecipe(id);
        this.updateProducerRecipeModal();
      });
    }

    modal.querySelectorAll("[data-producer-recipe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-producer-recipe");
        if (!key) return;
        const res = this.startProducerRecipe(id, key);
        if (!res.ok) {
          if (res.reason === "busy") this.producerModalLastLabel = "Ya hay una receta en curso.";
          else if (res.reason === "collect_first") this.producerModalLastLabel = "Recolecta primero la produccion lista.";
          else if (res.reason === "recipe_locked") this.producerModalLastLabel = "Esa receta aun no esta desbloqueada.";
          else this.producerModalLastLabel = "No se pudo iniciar la receta.";
        }
        this.updateProducerRecipeModal();
      });
    });

    const evoBtn = modal.querySelector("#producerEvolve");
    if (evoBtn) {
      evoBtn.addEventListener("click", () => {
        this.openProducerEvolutionModal(id);
      });
    }

    const producerNpcManageBtn = modal.querySelector("#producerNpcManage");
    if (producerNpcManageBtn) {
      producerNpcManageBtn.addEventListener("click", () => {
        this.openNpcSlotsModal(id);
      });
    }

    const producerSpriteAlignBtn = modal.querySelector("#producerSpriteAlign");
    if (producerSpriteAlignBtn) {
      const canSpriteAlign = !!(b.sprite && this.isSpriteBuilding(b.typeKey));
      producerSpriteAlignBtn.style.display = canSpriteAlign ? "" : "none";
      if (!canSpriteAlign) {
        producerSpriteAlignBtn.setAttribute("disabled", "true");
      } else {
        producerSpriteAlignBtn.removeAttribute("disabled");
        producerSpriteAlignBtn.addEventListener("click", () => {
          this.openSpriteAlignModal(id);
          this.updateSpriteAlignModal();
        });
      }
    }

    const moveBtn = modal.querySelector("#producerMove");
    if (moveBtn) {
      moveBtn.onclick = () => {
        this.closeProducerRecipeModal();
        this.startMoveSelected();
        this.cancelSelectBtn?.setVisible(false);
        this.cancelSelectBorder?.setVisible(false);
      };
    }

    const rotateBtn = modal.querySelector("#producerRotate");
    if (rotateBtn) {
      if (!this.canRotateBuilding(b.typeKey)) {
        rotateBtn.style.display = "none";
        rotateBtn.setAttribute("disabled", "true");
      } else {
        rotateBtn.onclick = () => {
          this.closeProducerRecipeModal();
          this.rotateSelected();
          this.closeBuildingMenu();
          this.setCursorMode();
        };
      }
    }

    const deleteBtn = modal.querySelector("#producerDelete");
    if (deleteBtn) {
      deleteBtn.onclick = () => {
        this.closeProducerRecipeModal();
        this.destroySelected();
        this.closeBuildingMenu();
        this.setCursorMode();
      };
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    this.updateProducerRecipeModal();
  }

  updateProducerRecipeModal() {
    const modal = document.getElementById("producer-modal");
    if (!modal) return;

    const id = Number(modal.dataset.buildingId || 0);
    const b = buildings.get(id);
    if (!b || !this.isProducerBuilding(b.typeKey)) {
      this.closeProducerRecipeModal();
      return;
    }

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const statusEl = modal.querySelector("#producerStatus");
    const evoStatusEl = modal.querySelector("#producerEvoStatus");
    const evoReqEl = modal.querySelector("#producerEvoReq");
    const msgEl = modal.querySelector("#producerMsg");
    const timeEl = modal.querySelector("#producerTime");
    const fillEl = modal.querySelector("#producerFill");
    const collectBtn = modal.querySelector("#producerCollect");
    const materialList = modal.querySelector("#producerMaterialList");
    const recipeButtons = modal.querySelectorAll("[data-producer-recipe]");
    const evolveBtn = modal.querySelector("#producerEvolve");
    const producerNpcStatusEl = modal.querySelector("#producerNpcStatus");
    const producerNpcManageBtn = modal.querySelector("#producerNpcManage");
    const producerSpriteAlignBtn = modal.querySelector("#producerSpriteAlign");

    const now = Date.now();
    const job = b.producerJob || null;
    if (job && !job.ready && now >= (job.endsAt || 0)) {
      job.ready = true;
      b.rewardReady = true;
    }

    let allowStart = false;
    if (!b.isBuilt) {
      const remain = Math.max(0, Math.ceil(((b.buildEnd || now) - now) / 1000));
      if (statusEl) statusEl.innerHTML = `<b>Estado:</b> En construccion (${this.formatSeconds(remain)})`;
      if (timeEl) timeEl.textContent = "Construyendo";
      if (fillEl) fillEl.style.width = "0%";
      if (collectBtn) collectBtn.setAttribute("disabled", "true");
    } else if (!job) {
      if (statusEl) statusEl.innerHTML = `<b>Estado:</b> Sin produccion activa`;
      if (timeEl) timeEl.textContent = "Sin receta";
      if (fillEl) {
        fillEl.style.width = "0%";
        fillEl.style.background = "#a855f7";
      }
      if (collectBtn) collectBtn.setAttribute("disabled", "true");
      allowStart = true;
      b.rewardReady = false;
    } else if (job.ready) {
      const rarityTxt = this.getProducerRarityLabel(job.rarity);
      const premiumTxt = `${Number(job.premiumChancePct || 0).toFixed(1)}% premium`;
      if (statusEl) statusEl.innerHTML = `<b>Estado:</b> Listo para recolectar <b>${job.amount}x ${job.recipeLabel}</b> (${rarityTxt} | ${premiumTxt})`;
      if (timeEl) timeEl.textContent = "Listo";
      if (fillEl) {
        fillEl.style.width = "100%";
        fillEl.style.background = "#f59e0b";
      }
      if (collectBtn) collectBtn.removeAttribute("disabled");
      b.rewardReady = true;
    } else {
      const remainMs = Math.max(0, (job.endsAt || now) - now);
      const done = 1 - (remainMs / Math.max(1, job.durationMs || 1));
      const rarityTxt = this.getProducerRarityLabel(job.rarity);
      const premiumTxt = `${Number(job.premiumChancePct || 0).toFixed(1)}% premium`;
      if (statusEl) statusEl.innerHTML = `<b>Estado:</b> Fabricando <b>${job.recipeLabel}</b> (${rarityTxt} | ${premiumTxt})`;
      if (timeEl) timeEl.textContent = `${this.formatSeconds(Math.ceil(remainMs / 1000))} restante`;
      if (fillEl) {
        fillEl.style.width = `${Math.floor(Phaser.Math.Clamp(done, 0, 1) * 100)}%`;
        fillEl.style.background = "#a855f7";
      }
      if (collectBtn) collectBtn.setAttribute("disabled", "true");
      b.rewardReady = false;
    }

    recipeButtons.forEach((btn) => {
      const key = btn.getAttribute("data-producer-recipe") || "";
      const recipe = this.getProducerRecipeByKey(b.typeKey, key, null);
      const preview = recipe ? this.getProducerRecipePreview(b, recipe) : null;

      const unlock = preview ? preview.unlockLevel : Math.max(0, Math.round(Number(btn.getAttribute("data-unlock-level") || 0)));
      const level = this.getProducerEvolutionLevel(b);
      const unlocked = level >= unlock;

      if (preview) {
        btn.setAttribute("data-unlock-level", String(unlock));
        const metaLine = btn.querySelector('[data-producer-line="meta"]');
        const unlockLine = btn.querySelector('[data-producer-line="unlock"]');
        const premiumPctNow = (preview.premiumChance * 100).toFixed(1);
        if (metaLine) metaLine.textContent = `x${preview.amount} | ${this.formatSeconds(preview.durationSec)} | Premium ${premiumPctNow}%`;
        if (unlockLine) {
          unlockLine.textContent = unlocked
            ? `Disponible (Evolucion ${preview.evo.level})`
            : `Desbloquea en Evolucion ${unlock}`;
        }
      }

      if (allowStart && unlocked) btn.removeAttribute("disabled");
      else btn.setAttribute("disabled", "true");
      btn.style.filter = unlocked ? "none" : "grayscale(.35)";
      btn.style.opacity = unlocked ? "1" : ".58";
    });

    const evoState = this.getProducerEvolutionState(b);
    const nextLevel = Math.min(PRODUCER_EVOLUTION_MAX_LEVEL, evoState.level + 1);
    const amountPct = Math.round((evoState.stats.amountMult - 1) * 100);
    const timePct = Math.round((1 - evoState.stats.timeMult) * 100);
    const premiumPct = (evoState.stats.premiumChance * 100).toFixed(1);
    const npcSummary = this.getNpcBuffSummaryForBuilding(b);

    if (evoStatusEl) {
      evoStatusEl.innerHTML = `<b>Evolucion:</b> Nivel ${evoState.level}/${PRODUCER_EVOLUTION_MAX_LEVEL} | Cantidad +${amountPct}% | Tiempo -${timePct}% | Premium ${premiumPct}%<br><span style="color:#67e8f9;">${npcSummary}</span>`;
    }

    if (producerNpcStatusEl) {
      producerNpcStatusEl.textContent = npcSummary;
    }
    if (producerNpcManageBtn) {
      producerNpcManageBtn.style.display = this.isNpcSlotEligibleBuildingType(b.typeKey) ? "" : "none";
      if (!b.isBuilt) {
        producerNpcManageBtn.setAttribute("disabled", "true");
        producerNpcManageBtn.style.opacity = ".6";
        producerNpcManageBtn.style.cursor = "not-allowed";
      } else {
        producerNpcManageBtn.removeAttribute("disabled");
        producerNpcManageBtn.style.opacity = "1";
        producerNpcManageBtn.style.cursor = "pointer";
      }
    }

    if (evoReqEl) {
      if (evoState.maxed) {
        evoReqEl.innerHTML = `<b>Req:</b> Nivel maximo alcanzado.`;
      } else {
        const upLabel = this.getProducerUpgradeItemLabel(b.typeKey);
        const dupeLabel = this.getProducerDupeItemLabel(b.typeKey);
        evoReqEl.innerHTML = `<b>Req L${nextLevel}:</b> ${dupeLabel} x${evoState.cost.dupes} + ${upLabel} x${evoState.cost.upgrades} | Inv: ${evoState.dupeInv}/${evoState.cost.dupes} y ${evoState.upgradeInv}/${evoState.cost.upgrades}`;
      }
    }

    if (evolveBtn) {
      if (evoState.maxed) {
        evolveBtn.setAttribute("disabled", "true");
      } else {
        evolveBtn.removeAttribute("disabled");
      }

      if (evoState.maxed) evolveBtn.textContent = "Nivel MAX";
      else evolveBtn.textContent = `Evolucionar L${nextLevel}`;
    }

    if (producerSpriteAlignBtn) {
      const canSpriteAlign = !!(b.sprite && this.isSpriteBuilding(b.typeKey));
      producerSpriteAlignBtn.style.display = canSpriteAlign ? "" : "none";
      if (!canSpriteAlign) producerSpriteAlignBtn.setAttribute("disabled", "true");
      else producerSpriteAlignBtn.removeAttribute("disabled");
    }

    if (msgEl) {
      msgEl.textContent = this.producerModalLastLabel || "";
    }

    if (materialList) {
      const inv = this.ensureMaterialInventory();
      const keys = Object.keys(inv).filter((k) => (inv[k] || 0) > 0).sort();
      if (!keys.length) {
        materialList.innerHTML = `<span style="opacity:.75;">Sin materiales aun.</span>`;
      } else {
        materialList.innerHTML = keys.map((k) => {
          const v = Math.max(0, Math.round(Number(inv[k]) || 0));
          return `<span style="padding:6px 8px;border:1px solid rgba(255,255,255,.16);border-radius:8px;background:#111827;display:inline-flex;align-items:center;gap:6px;">${this.getProducerUiIconForMaterial(k, b.typeKey)} ${this.getProducerMaterialLabel(k)}: <b>x${v}</b></span>`;
        }).join("");
      }
    }
  }
  openBuildingInfoModal(id) {
    this.closeBuildingInfoModal();

    const b = buildings.get(id);
    if (!b) return;
    if (this.isBuildingInfoLocked(b, Date.now())) return;
    this.setCursorMode();

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const baseRarity = this.getRarityForKey(def.key || b.typeKey);
    const evoLevel = b.evoLevel || 0;
    const evoStage = (typeof b.evoStage === "number")
      ? b.evoStage
      : (baseRarity === 5 ? 5 : 0);
    const displayRarity = (baseRarity === 5 && evoStage >= 6) ? 6 : baseRarity;
    const evoActive = (evoLevel > 0) || (evoStage >= 6);
    const initialEvoStatsLabel = this.getEvolutionStats(b.typeKey, evoStage, evoLevel).bonusLabel;
    const maxColorFrameClass = (displayRarity >= 1 && displayRarity <= 5 && evoLevel >= 5)
      ? ` maxed-${displayRarity}`
      : "";
    const stars = "\u2605".repeat(displayRarity);
    const starsHtml = (displayRarity === 6)
      ? Array.from({ length: 6 }, (_, i) => `<span class="star star-6" style="--h:${i * 60}deg">\u2605</span>`).join("")
      : stars;
    const starClass = (displayRarity === 6) ? "stars-6" : (displayRarity === 5 ? "stars-5" : "stars-base");
    const frameClass = displayRarity === 6
      ? `frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `frame-${displayRarity}${evoActive ? " evo-on" : ""}${maxColorFrameClass}`;
    const winClass = `building-window win-${displayRarity}${evoActive ? " evo-on" : ""}${(displayRarity === 6 && evoLevel >= 5) ? " win-6max" : ""}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5)
      ? " chrome"
      : ((displayRarity >= 1 && displayRarity <= 5 && evoLevel >= 5) ? ` chrome-${displayRarity}` : "");
    const baseLabel = def.label || def.key;
    const hasProduction = this.hasBuildingProduction(b, def);
    const displayLabel = (b.typeKey === "green_1")
      ? "Casa Decorativa"
      : baseLabel;
    const buildLabel = this.formatSeconds(b.buildSeconds ?? def.buildSeconds);
    const prodLabel = (this.hasBuildingActivation(b.typeKey) && !this.isBuildingActivationUnlocked(b))
      ? "Pendiente de activacion"
      : (hasProduction
        ? this.formatSeconds(b.prodSeconds ?? def.prodSeconds)
        : "Sin produccion");
    const rewardGold = b.reward?.gold ?? def.reward?.gold ?? 0;
    const rewardExp = b.reward?.exp ?? def.reward?.exp ?? 0;
    const rewardLine = hasProduction
      ? `<div id="rewardInfoLine">Recompensa: <b>+${rewardGold} Oro</b>  |  <b>+${rewardExp} EXP</b></div>`
      : `<div id="rewardInfoLine">Recompensa: <b>No produce recursos</b></div>`;
    const fillHex = this.colorToHex(def.fill);
    const borderHex = this.colorToHex(def.border);
    const previewContent = this.isSpriteBuilding(b.typeKey)
      ? `<img src="${this.getSpriteImagePathForBuilding(b.typeKey, b.rotationStep || 0)}" alt="${displayLabel}" style="width:64px;height:auto;display:block;filter: drop-shadow(0 3px 6px rgba(0,0,0,.35));">`
      : `
      <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,8 112,40 60,72 8,40" fill="${fillHex}" stroke="${borderHex}" stroke-width="3"/>
      </svg>
    `;

    const modal = document.createElement("div");
    modal.id = "building-modal";
    modal.dataset.buildingId = String(id);
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(0,0,0,0.55)",
      zIndex: "999998",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "auto",
      padding: "12px 10px",
      overflowY: "auto"
    });

    modal.innerHTML = `
      <style>
        #building-modal .evo-row { display:flex; align-items:center; gap:8px; }
        #building-modal .building-window {
          position: relative;
        }
        #building-modal .building-window.win-1 { border-color: #9ca3af; box-shadow: 0 10px 30px rgba(148,163,184,.18); }
        #building-modal .building-window.win-2 { border-color: #16a34a; box-shadow: 0 10px 30px rgba(34,197,94,.18); }
        #building-modal .building-window.win-3 { border-color: #b45309; box-shadow: 0 10px 30px rgba(180,83,9,.2); }
        #building-modal .building-window.win-4 { border-color: #94a3b8; box-shadow: 0 10px 34px rgba(148,163,184,.22); }
        #building-modal .building-window.win-5 { border-color: #f59e0b; box-shadow: 0 12px 40px rgba(245,158,11,.25); }
        #building-modal .building-window.win-6 {
          border-color: #a855f7;
          box-shadow: 0 14px 46px rgba(168,85,247,.25), 0 0 20px rgba(34,197,94,.18);
        }
        #building-modal .building-window.win-6max {
          box-shadow: 0 16px 60px rgba(168,85,247,.35), 0 0 28px rgba(59,130,246,.35);
        }
        #building-modal .building-window.evo-on {
          box-shadow:
            0 12px 40px rgba(255,255,255,.08),
            0 0 18px rgba(255,255,255,.12);
        }
        #building-modal .evo-d { width:12px; height:12px; border:1px solid rgba(148,163,184,.6); transform: rotate(45deg); background: rgba(148,163,184,.12); border-radius:2px; }
        #building-modal .evo-d.on { background: #fbbf24; border-color: #f59e0b; box-shadow: 0 0 8px rgba(245,158,11,.6); }
        #building-modal .preview-frame {
          position: relative;
          width: 140px;
          height: 90px;
          padding: 6px;
          --bevel: 10px;
          border-radius: 0;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 1px 2px rgba(0,0,0,.45);
          overflow: hidden;
          clip-path: polygon(
            var(--bevel) 0,
            calc(100% - var(--bevel)) 0,
            100% var(--bevel),
            100% calc(100% - var(--bevel)),
            calc(100% - var(--bevel)) 100%,
            var(--bevel) 100%,
            0 calc(100% - var(--bevel)),
            0 var(--bevel)
          );
        }
        #building-modal .preview-frame::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: 0;
          border: 1px solid rgba(255,255,255,.08);
          pointer-events: none;
          clip-path: inherit;
        }
        #building-modal .preview-frame.evo-on {
          box-shadow:
            inset 0 1px 2px rgba(255,255,255,.35),
            inset 0 -3px 6px rgba(0,0,0,.65),
            0 0 12px rgba(255,255,255,.12);
        }
        #building-modal .preview-frame.evo-on::before {
          border: 1px solid rgba(255,255,255,.28);
          mix-blend-mode: screen;
        }
        #building-modal .preview-frame.evo-on::after {
          content: "";
          position: absolute;
          inset: -40%;
          background: linear-gradient(120deg,
            rgba(255,255,255,0) 40%,
            rgba(255,255,255,.35) 52%,
            rgba(255,255,255,0) 64%);
          opacity: .55;
          transform: translateX(-20%) rotate(8deg);
          pointer-events: none;
          clip-path: inherit;
        }
        #building-modal .preview-frame.frame-1.evo-on {
          box-shadow: inset 0 1px 2px rgba(0,0,0,.45);
        }
        #building-modal .preview-frame.frame-1.evo-on::before,
        #building-modal .preview-frame.frame-1.evo-on::after {
          content: none;
        }
        #building-modal .preview-inner {
          position: relative;
          width: 100%;
          height: 100%;
          --bevel-in: 7px;
          border-radius: 0;
          background: rgba(2,6,23,.65);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          clip-path: polygon(
            var(--bevel-in) 0,
            calc(100% - var(--bevel-in)) 0,
            100% var(--bevel-in),
            100% calc(100% - var(--bevel-in)),
            calc(100% - var(--bevel-in)) 100%,
            var(--bevel-in) 100%,
            0 calc(100% - var(--bevel-in)),
            0 var(--bevel-in)
          );
        }
        #building-modal .preview-stars { font-weight: 800; letter-spacing: 1px; }
        #building-modal .stars-base { color: #fbbf24; text-shadow: 0 0 6px rgba(251,191,36,.35); }
        #building-modal .stars-5 {
          background: linear-gradient(135deg,#fff1b5 0%, #fbbf24 45%, #fde68a 60%, #b45309 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(245,158,11,.35);
        }
        #building-modal .stars-6 {
          color: #e5e7eb;
          text-shadow: 0 0 12px rgba(255,255,255,.35);
        }
        #building-modal .preview-stars .star-6 {
          display: inline-block;
          margin: 0 2px;
          background: conic-gradient(from var(--h), #22c55e, #38bdf8, #a855f7, #f59e0b, #ef4444, #22c55e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          text-shadow: 0 0 10px rgba(255,255,255,.35);
        }
        #building-modal .preview-inner.chrome::after {
          content: "";
          position: absolute;
          inset: -60%;
          background: linear-gradient(120deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,.65) 35%,
            rgba(255,255,255,0) 65%);
          animation: chromeSheen 2.2s linear infinite;
          mix-blend-mode: screen;
          opacity: .9;
          pointer-events: none;
          clip-path: inherit;
        }
        #building-modal .preview-inner.chrome-1::after,
        #building-modal .preview-inner.chrome-2::after,
        #building-modal .preview-inner.chrome-3::after,
        #building-modal .preview-inner.chrome-4::after,
        #building-modal .preview-inner.chrome-5::after {
          content: "";
          position: absolute;
          inset: -60%;
          animation: chromeSheen 2s linear infinite;
          mix-blend-mode: screen;
          opacity: .95;
          pointer-events: none;
          clip-path: inherit;
        }
        #building-modal .preview-inner.chrome-1::after {
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(226,232,240,.78) 35%, rgba(148,163,184,.88) 50%, rgba(255,255,255,0) 65%);
        }
        #building-modal .preview-inner.chrome-2::after {
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(134,239,172,.82) 35%, rgba(34,197,94,.86) 50%, rgba(255,255,255,0) 65%);
        }
        #building-modal .preview-inner.chrome-3::after {
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(248,250,252,.85) 35%, rgba(203,213,225,.88) 50%, rgba(255,255,255,0) 65%);
        }
        #building-modal .preview-inner.chrome-4::after {
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(196,181,253,.86) 35%, rgba(168,85,247,.9) 50%, rgba(255,255,255,0) 65%);
        }
        #building-modal .preview-inner.chrome-5::after {
          background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(254,240,138,.86) 35%, rgba(245,158,11,.92) 50%, rgba(255,255,255,0) 65%);
        }
        #building-modal .frame-1 { background: #6b7280; }
        #building-modal .frame-2 { background: linear-gradient(135deg,#22c55e 0%, #16a34a 45%, #86efac 62%, #065f46 100%); }
        #building-modal .frame-3 { background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 62%, #94a3b8 100%); }
        #building-modal .frame-4 { background: linear-gradient(135deg,#c4b5fd 0%, #8b5cf6 45%, #a78bfa 62%, #5b21b6 100%); }
        #building-modal .frame-5 { background: #b45309; }
        #building-modal .frame-1.maxed-1 { box-shadow: 0 0 14px rgba(226,232,240,.5); }
        #building-modal .frame-2.maxed-2 { box-shadow: 0 0 16px rgba(34,197,94,.62), 0 0 30px rgba(16,185,129,.32); }
        #building-modal .frame-3.maxed-3 { box-shadow: 0 0 16px rgba(226,232,240,.6), 0 0 30px rgba(148,163,184,.38); }
        #building-modal .frame-4.maxed-4 { box-shadow: 0 0 16px rgba(168,85,247,.62), 0 0 30px rgba(139,92,246,.38); }
        #building-modal .frame-5.maxed-5 { box-shadow: 0 0 18px rgba(245,158,11,.72), 0 0 32px rgba(251,191,36,.42); }
        #building-modal .frame-6 {
          background:
            conic-gradient(from 0deg,
              #22c55e, #38bdf8, #a855f7, #f59e0b, #ef4444, #22c55e);
        }
        #building-modal .frame-1.evo-on { background: #6b7280; }
        #building-modal .frame-2.evo-on {
          background: linear-gradient(135deg,#34d399 0%, #16a34a 45%, #86efac 60%, #065f46 100%);
        }
        #building-modal .frame-3.evo-on {
          background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 60%, #94a3b8 100%);
        }
        #building-modal .frame-4.evo-on {
          background: linear-gradient(135deg,#c4b5fd 0%, #8b5cf6 45%, #a78bfa 60%, #5b21b6 100%);
        }
        #building-modal .frame-5.evo-on {
          background: linear-gradient(135deg,#fde68a 0%, #f59e0b 45%, #fbbf24 60%, #b45309 100%);
        }
        #building-modal .frame-6max {
          box-shadow:
            inset 0 1px 6px rgba(0,0,0,.4),
            0 0 18px rgba(255,255,255,.45),
            0 0 28px rgba(59,130,246,.35);
        }
        @keyframes chromeSheen {
          0% { transform: translateX(-30%) rotate(8deg); opacity: .1; }
          50% { opacity: .9; }
          100% { transform: translateX(30%) rotate(8deg); opacity: .1; }
        }
      </style>
      <div class="${winClass}" style="
        width: min(520px, 94vw);
        background: #0b1222;
        color: #e5e7eb;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,.5);
        font-family: "Arial", Arial, sans-serif;
        transform: translateY(12px) scale(.98);
        opacity: 0;
        transition: transform .18s ease, opacity .18s ease;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <h2 style="margin:0;font-size:18px;">\u{1F3E0} ${displayLabel}</h2>
          <button id="buildingClose" style="
            background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
            padding:8px 10px;border-radius:10px;cursor:pointer;
          ">\u2716</button>
        </div>

        <div style="margin-top:10px; display:grid; gap:8px; font-size:14px;">
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
            <div id="previewFrame" class="preview-frame ${frameClass}">
              <div id="previewInner" class="preview-inner${chromeClass}">
                ${previewContent}
              </div>
            </div>
            <div style="display:grid; gap:6px;">
          <div>Rareza: <b id="previewStars" class="preview-stars ${starClass}">${starsHtml}</b></div>
              <div>Tamano: <b>${b.size}x${b.size}</b></div>
            </div>
          </div>
          <div>Construccion: <b>${buildLabel}</b></div>
          <div>Produccion: <b>${prodLabel}</b></div>
          ${rewardLine}
          <div id="buffInfoLine" style="color:#94a3b8;">Buff activo: --</div>
          <div id="npcSlotsSection" style="display:none;margin-top:4px;border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:8px;">
            <div id="npcSlotsLine" style="font-size:12px;color:#67e8f9;">NPC: --</div>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
              <button id="bldNpcManage" style="background:#38bdf8;color:#032b44;border:none;padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:700;">Gestionar NPC</button>
            </div>
          </div>
          <div id="residentNpcSection" style="display:none;margin-top:4px;border:1px solid rgba(245,158,11,.22);border-radius:10px;padding:8px;background:rgba(120,53,15,.14);">
            <div id="residentNpcLine" style="font-size:12px;color:#fcd34d;">Residentes NPC: --</div>
            <div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap;">
              <button id="bldResidentManage" style="background:#f59e0b;color:#1f1400;border:none;padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:700;">Gestionar Residentes</button>
            </div>
          </div>
        </div>

        <div id="buildSection" style="margin-top:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; opacity:.85;">
            <span>Construccion</span>
            <span id="buildTime">-</span>
          </div>
          <div style="margin-top:6px; height:10px; background:#1e293b; border-radius:999px; overflow:hidden;">
            <div id="buildFill" style="height:100%; width:0%; background:#fbbf24;"></div>
          </div>
        </div>

        <div id="prodSection" style="margin-top:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; opacity:.85;">
            <span>Produccion</span>
            <span id="prodTime">-</span>
          </div>
          <div style="margin-top:6px; height:10px; background:#1e293b; border-radius:999px; overflow:hidden;">
            <div id="prodFill" style="height:100%; width:0%; background:#22c55e;"></div>
          </div>
          <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
            <button id="bldCollect" style="
              background:#22c55e;color:#022c22;border:none;
              padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
            ">Recolectar</button>
          </div>
        </div>

        <div id="marketUnlockSection" style="margin-top:12px; display:none; border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;">
            <div style="font-size:13px;opacity:.9;"><b>Minimarket 2x2</b> | Activacion por materiales (una sola vez)</div>
            <button id="marketUnlockBtn" style="
              background:#22c55e;color:#032b1b;border:none;
              padding:8px 10px;border-radius:10px;cursor:pointer;font-weight:700;
            ">Activar</button>
          </div>
          <div id="marketUnlockReq" style="margin-top:8px; font-size:12px; color:#cbd5e1;">--</div>
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
          <button id="bldSpriteAlign" style="
            background:#334155;color:#e2e8f0;border:none;
            padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
            display:none;
          ">Calibrar Sprite</button>
          <button id="bldMove" style="
            background:#22c55e;color:#022c22;border:none;
            padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
          ">Mover</button>
          <button id="bldRotate" style="
            background:#38bdf8;color:#022c22;border:none;
            padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
          ">Girar</button>
          <button id="bldDelete" style="
            background:#ef4444;color:#fff;border:none;
            padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
          ">Eliminar</button>
        </div>

        <div style="margin-top:12px; display:grid; gap:8px; border:1px solid rgba(255,255,255,.08); border-radius:12px; padding:10px;">
          <div class="evo-row">
            <div id="evoDiamonds">${this.buildEvoDiamonds(b.evoLevel || 0)}</div>
            <small id="evoHint" style="opacity:.8;">Evolucion ${(evoStage >= 5 ? evoStage : baseRarity)}\u2605: ${Math.max(0, Math.min(5, evoLevel || 0))}/5 (${initialEvoStatsLabel})</small>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button id="bldActivation" style="
              background:#22c55e;color:#022c22;border:none;
              padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
              display:none;
            ">Activacion</button>
            <button id="bldEvolve" style="
              background:#fbbf24;color:#1f1400;border:none;
              padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
            ">Evolucionar</button>
            <button id="bldTrans" style="
              background:#8b5cf6;color:#fff;border:none;
              padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
              display:none;
            ">Transcender</button>
          </div>
        </div>

        <small style="opacity:.75; display:block; margin-top:10px;">
          Toca \u{1F4B0} / \u2B50 sobre el edificio para recolectar.
        </small>
      </div>
    `;

    document.body.appendChild(modal);

    requestAnimationFrame(() => {
      const win = modal.querySelector(".building-window");
      if (!win) return;
      win.style.opacity = "1";
      win.style.transform = "translateY(0) scale(1)";
    });

    const close = () => {
      const win = modal.querySelector(".building-window");
      if (win) {
        win.style.opacity = "0";
        win.style.transform = "translateY(12px) scale(.98)";
        setTimeout(() => {
          if (modal.parentNode) modal.remove();
        }, 180);
      } else if (modal.parentNode) {
        modal.remove();
      }

      this.selectedBuildingId = null;
      this.hideActionButtons();
      this.closeNpcSlotsModal();
      this.closeResidentNpcModal();
      this.cancelSelectBtn?.setVisible(false);
      this.cancelSelectBorder?.setVisible(false);
      this.setCursorMode();
    };

    const closeBtn = modal.querySelector("#buildingClose");
    if (closeBtn) closeBtn.onclick = close;

    const collectBtn = modal.querySelector("#bldCollect");
    const spriteAlignBtn = modal.querySelector("#bldSpriteAlign");
    const npcManageBtn = modal.querySelector("#bldNpcManage");
    const npcSlotsSection = modal.querySelector("#npcSlotsSection");
    const npcSlotsLine = modal.querySelector("#npcSlotsLine");
    const residentManageBtn = modal.querySelector("#bldResidentManage");
    const residentNpcSection = modal.querySelector("#residentNpcSection");
    const residentNpcLine = modal.querySelector("#residentNpcLine");
    if (collectBtn) collectBtn.onclick = () => {
      this.collectBuildingReward(id);
      this.updateBuildingInfoModal(b, def, Date.now());
    };

    const activationBtn = modal.querySelector("#bldActivation");
    if (activationBtn) activationBtn.onclick = () => {
      this.openBuildingActivationModal(id);
    };
    if (spriteAlignBtn) spriteAlignBtn.onclick = () => {
      this.openSpriteAlignModal(id);
    };
    if (npcManageBtn) npcManageBtn.onclick = () => {
      this.openNpcSlotsModal(id);
    };
    if (residentManageBtn) residentManageBtn.onclick = () => {
      this.openResidentNpcModal(id);
    };

    const moveBtn = modal.querySelector("#bldMove");
    if (moveBtn) moveBtn.onclick = () => {
      this.closeBuildingInfoModal();
      this.closeSpriteAlignModal();
      this.startMoveSelected();
      this.cancelSelectBtn?.setVisible(false);
      this.cancelSelectBorder?.setVisible(false);
    };

    const rotateBtn = modal.querySelector("#bldRotate");
    if (rotateBtn) {
      if (!this.canRotateBuilding(b.typeKey)) {
        rotateBtn.style.display = "none";
        rotateBtn.setAttribute("disabled", "true");
      } else {
        rotateBtn.onclick = () => {
          this.closeBuildingInfoModal();
          this.rotateSelected();
          this.closeBuildingMenu();
          this.setCursorMode();
        };
      }
    }

    const deleteBtn = modal.querySelector("#bldDelete");
    if (deleteBtn) deleteBtn.onclick = () => {
      this.closeBuildingInfoModal();
      this.closeSpriteAlignModal();
      this.destroySelected();
      this.closeBuildingMenu();
      this.setCursorMode();
    };

    const evoBtn = modal.querySelector("#bldEvolve");
    if (evoBtn) evoBtn.onclick = () => {
      this.openEvolutionModal(b);
    };
    const transBtn = modal.querySelector("#bldTrans");
    if (transBtn) transBtn.onclick = () => {
      if (baseRarity !== 5) return;
      if (b.evoStage === 5 && (b.evoLevel || 0) >= 5) {
        this.transcendBuilding(b, def);
        const win = modal.querySelector(".building-window");
        if (win) this.playTranscendAnimation(win, def);
      }
    };

    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    this.updateBuildingInfoModal(b, def, Date.now());
  }

  closeBuildingInfoModal() {
    const modal = document.getElementById("building-modal");
    if (modal) modal.remove();
    this.closeBuildingActivationModal();
    this.closeNpcSlotsModal();
    this.closeResidentNpcModal();
  }

  closeNpcSlotsModal() {
    const modal = document.getElementById("npc-slots-modal");
    if (modal) modal.remove();
  }

  closeResidentNpcModal() {
    const modal = document.getElementById("resident-npc-modal");
    if (modal) modal.remove();
  }

  getNpcSlotRoleLabel(role) {
    if (role === "build") return "Buff Construccion";
    if (role === "prod") return "Buff Produccion";
    return "Buff Oro/EXP";
  }

  getNpcUnitBuffText(npcKey, evoLevel = 0, buildingTypeKey = "") {
    const rarity = this.getNpcRarityForKey(npcKey);
    const role = this.getNpcRoleForKey(npcKey);
    const evo = Math.max(0, Math.min(5, Number(evoLevel) || 0));
    const rarityFactor = Number(NPC_BUFF_RARITY_FACTOR[rarity] || 1.0);
    const evoFactor = 1 + (NPC_BUFF_EVO_STEP * evo);
    const power = rarityFactor * evoFactor;

    if (role === "build") {
      const pct = Math.round((NPC_BUFF_BUILD_BASE * power) * 1000) / 10;
      return `Constr -${pct}%`;
    }
    if (role === "prod") {
      if (this.isProducerBuilding(buildingTypeKey)) {
        const timePct = Math.round((NPC_BUFF_PROD_BASE * power) * 1000) / 10;
        const amountPct = Math.round((NPC_BUFF_PRODUCER_AMOUNT_BASE * power) * 1000) / 10;
        const premiumPct = Math.round((NPC_BUFF_PRODUCER_PREMIUM_BASE * power) * 10000) / 10;
        return `Tiempo -${timePct}% | Cant +${amountPct}% | Prem +${premiumPct}%`;
      }
      const pct = Math.round((NPC_BUFF_PROD_BASE * power) * 1000) / 10;
      return `Prod -${pct}%`;
    }

    const pct = Math.round((NPC_BUFF_REWARD_BASE * power) * 1000) / 10;
    return `Oro/EXP +${pct}%`;
  }

  getNpcPoolEntriesForModal() {
    const defs = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS && typeof ITEM_DEFS === "object") ? ITEM_DEFS : {};
    const inv = this.economy?.inventory || {};

    return Object.keys(defs)
      .filter((key) => typeof key === "string" && key.startsWith("npc_"))
      .map((key) => {
        const def = defs[key] || {};
        return {
          key,
          def,
          count: Math.max(0, Math.round(Number(inv[key]) || 0)),
          rarity: this.getNpcRarityForKey(key),
          evo: this.getNpcEvolutionLevelForKey(key),
          role: this.getNpcRoleForKey(key)
        };
      })
      .filter((entry) => entry.count > 0)
      .sort((a, b) => {
        if (b.rarity !== a.rarity) return b.rarity - a.rarity;
        if (b.count !== a.count) return b.count - a.count;
        return String(a.def?.name || a.key).localeCompare(String(b.def?.name || b.key));
      });
  }

  isNpcKeyDuplicatedInSlots(slots, npcKey, ignoreIndex = -1) {
    const key = String(npcKey || "").trim();
    if (!key.startsWith("npc_") || !Array.isArray(slots)) return false;
    return slots.some((slot, idx) => idx !== ignoreIndex && String(slot?.key || "").trim() === key);
  }

  assignNpcToBuildingSlot(idOrBuilding, slotIndex, npcKey) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b) return false;
    if (!this.isNpcSlotEligibleBuildingType(b.typeKey)) return false;

    const key = String(npcKey || "").trim();
    if (!key || !key.startsWith("npc_")) return false;

    const slots = this.ensureNpcSlotsForBuilding(b);
    if (!slots.length) return false;

    const idx = Math.max(0, Math.min(slots.length - 1, Math.round(Number(slotIndex) || 0)));
    const current = slots[idx];
    if (current?.key === key) return true;
    if (this.isNpcKeyDuplicatedInSlots(slots, key, idx)) return false;

    if (!this.economy?.consumeItem?.(key, 1)) return false;

    if (current?.key) {
      this.economy?.addItem?.(current.key, 1);
    }

    slots[idx] = {
      key,
      evo: this.getNpcEvolutionLevelForKey(key)
    };
    b.npcSlots = slots;

    const now = Date.now();
    this.recalculateAllBuildingStats(now);
    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    this.updateBuildingInfoModal(b, def, now);
    this.updateProducerRecipeModal();
    return true;
  }

  unassignNpcFromBuildingSlot(idOrBuilding, slotIndex) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b) return false;

    const slots = this.ensureNpcSlotsForBuilding(b);
    if (!slots.length) return false;

    const idx = Math.max(0, Math.min(slots.length - 1, Math.round(Number(slotIndex) || 0)));
    const current = slots[idx];
    if (!current?.key) return false;

    this.economy?.addItem?.(current.key, 1);
    slots[idx] = null;
    b.npcSlots = slots;

    const now = Date.now();
    this.recalculateAllBuildingStats(now);
    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    this.updateBuildingInfoModal(b, def, now);
    this.updateProducerRecipeModal();
    return true;
  }

  assignResidentNpcToBuildingSlot(idOrBuilding, slotIndex, npcKey) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isNpcResidenceBuilding(b.typeKey) || !b.isBuilt) return false;

    const key = String(npcKey || "").trim();
    if (!key.startsWith("npc_")) return false;

    const slots = this.ensureResidentNpcSlotsForBuilding(b);
    if (!slots.length) return false;

    const idx = Math.max(0, Math.min(slots.length - 1, Math.round(Number(slotIndex) || 0)));
    const current = slots[idx];
    if (current?.key === key) return true;
    if (this.isNpcKeyDuplicatedInSlots(slots, key, idx)) return false;

    if (!this.economy?.consumeItem?.(key, 1)) return false;
    if (current?.key) {
      this.economy?.addItem?.(current.key, 1);
    }

    slots[idx] = {
      key,
      evo: this.getNpcEvolutionLevelForKey(key)
    };
    b.residentNpcSlots = slots;

    const now = Date.now();
    this.syncResidentNpcWorldSpawns(b, now);
    this.updateBuildingInfoModal(b, BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1, now);
    return true;
  }

  unassignResidentNpcFromBuildingSlot(idOrBuilding, slotIndex) {
    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isNpcResidenceBuilding(b.typeKey)) return false;

    const slots = this.ensureResidentNpcSlotsForBuilding(b);
    if (!slots.length) return false;

    const idx = Math.max(0, Math.min(slots.length - 1, Math.round(Number(slotIndex) || 0)));
    const current = slots[idx];
    if (!current?.key) return false;

    this.economy?.addItem?.(current.key, 1);
    slots[idx] = null;
    b.residentNpcSlots = slots;

    const now = Date.now();
    this.syncResidentNpcWorldSpawns(b, now);
    this.updateBuildingInfoModal(b, BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1, now);
    return true;
  }

  openResidentNpcModal(idOrBuilding) {
    this.closeResidentNpcModal();
    this.closeNpcSlotsModal();

    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b || !this.isNpcResidenceBuilding(b.typeKey)) return;

    this.ensureResidentNpcSlotsForBuilding(b);
    this.residentNpcModalLastLabel = "";

    const modal = document.createElement("div");
    modal.id = "resident-npc-modal";
    modal.dataset.buildingId = String(b.id);
    modal.dataset.activeSlot = "0";
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(3,7,18,.78)",
      display: "grid",
      placeItems: "center",
      zIndex: "1000002",
      pointerEvents: "auto",
      backdropFilter: "blur(2px)"
    });

    modal.innerHTML = `
      <style>
        #resident-npc-modal .resident-window {
          width: min(860px, 96vw);
          max-height: min(88vh, 800px);
          overflow: hidden;
          background: #0b1222;
          color: #e5e7eb;
          border: 1px solid rgba(245,158,11,.28);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,.55);
          font-family: "Arial", Arial, sans-serif;
          display: grid;
          grid-template-rows: auto auto auto minmax(0,1fr);
        }
        #resident-npc-modal .resident-head {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:14px 16px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        #resident-npc-modal .resident-summary {
          margin: 10px 16px 0;
          padding: 10px 12px;
          border: 1px solid rgba(245,158,11,.35);
          border-radius: 10px;
          color: #fcd34d;
          font-size: 13px;
          background: rgba(120,53,15,.28);
        }
        #resident-npc-modal .resident-help {
          margin: 8px 16px 0;
          font-size: 12px;
          color: #fdba74;
          min-height: 16px;
        }
        #resident-npc-modal .resident-body {
          min-height: 0;
          overflow: hidden;
          display: grid;
          grid-template-rows: auto auto minmax(220px, 1fr);
        }
        #resident-npc-modal .resident-slots {
          margin: 8px 16px 0;
          display:grid;
          gap:8px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          align-content:start;
        }
        #resident-npc-modal .resident-pool-head {
          margin: 12px 16px 0;
          font-size: 12px;
          color: #fdba74;
          font-weight: 700;
        }
        #resident-npc-modal .resident-slot-card,
        #resident-npc-modal .resident-pool-item {
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 12px;
          background: #0f172a;
        }
        #resident-npc-modal .resident-slot-card {
          padding: 8px;
          min-height: 142px;
          display:grid;
          gap:6px;
          align-content:start;
          cursor:pointer;
        }
        #resident-npc-modal .resident-slot-card.active {
          border-color: rgba(245,158,11,.95);
          box-shadow: 0 0 0 1px rgba(245,158,11,.55), 0 0 14px rgba(245,158,11,.22);
        }
        #resident-npc-modal .resident-slot-top {
          font-size:12px;
          font-weight:800;
          color:#fdba74;
        }
        #resident-npc-modal .resident-slot-empty {
          margin-top: 6px;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }
        #resident-npc-modal .resident-slot-icon,
        #resident-npc-modal .resident-pool-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.18);
          display:grid;
          place-items:center;
          font-weight:800;
          color:#f8fafc;
          background: linear-gradient(135deg,#334155 0%,#0f172a 100%);
        }
        #resident-npc-modal .resident-pool {
          margin: 8px 16px 16px;
          min-height: 220px;
          overflow:auto;
          display:grid;
          gap:8px;
          align-content:start;
        }
        #resident-npc-modal .resident-pool-item {
          padding: 10px;
          display:grid;
          grid-template-columns: auto 1fr auto;
          gap:10px;
          align-items:center;
        }
        #resident-npc-modal .resident-pool-meta {
          min-width: 0;
          display:grid;
          gap:4px;
        }
        #resident-npc-modal .resident-pool-name {
          font-size:13px;
          font-weight:800;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
        }
        #resident-npc-modal .resident-pool-sub {
          font-size:11px;
          color:#93c5fd;
        }
        #resident-npc-modal .resident-remove,
        #resident-npc-modal .resident-assign {
          border:none;
          border-radius:10px;
          padding:8px 10px;
          font-weight:700;
          cursor:pointer;
        }
        #resident-npc-modal .resident-remove {
          background:#ef4444;
          color:#fff;
        }
        #resident-npc-modal .resident-assign {
          background:#f59e0b;
          color:#1f1400;
        }
      </style>
      <div class="resident-window">
        <div class="resident-head">
          <div>
            <div style="font-size:18px;font-weight:800;">Casa Conera</div>
            <div style="font-size:12px;color:#cbd5e1;">Asigna NPC del banner para que salgan al mundo.</div>
          </div>
          <button id="residentNpcClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);padding:8px 10px;border-radius:10px;cursor:pointer;">X</button>
        </div>
        <div id="residentNpcSummary" class="resident-summary">Residentes NPC: --</div>
        <div id="residentNpcHint" class="resident-help"></div>
        <div class="resident-body">
          <div id="residentNpcSlots" class="resident-slots"></div>
          <div class="resident-pool-head">NPC disponibles del inventario</div>
          <div id="residentNpcPool" class="resident-pool"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => this.closeResidentNpcModal();
    modal.querySelector("#residentNpcClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    this.updateResidentNpcModal();
  }

  updateResidentNpcModal() {
    const modal = document.getElementById("resident-npc-modal");
    if (!modal) return;

    const id = Number(modal.dataset.buildingId || 0);
    const b = buildings.get(id);
    if (!b || !this.isNpcResidenceBuilding(b.typeKey)) {
      this.closeResidentNpcModal();
      return;
    }

    const slots = this.ensureResidentNpcSlotsForBuilding(b);
    if (!slots.length) {
      this.closeResidentNpcModal();
      return;
    }

    let activeSlot = Math.round(Number(modal.dataset.activeSlot) || 0);
    if (!Number.isFinite(activeSlot) || activeSlot < 0 || activeSlot >= slots.length) {
      activeSlot = 0;
    }
    modal.dataset.activeSlot = String(activeSlot);

    const defs = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS && typeof ITEM_DEFS === "object") ? ITEM_DEFS : {};
    const summaryEl = modal.querySelector("#residentNpcSummary");
    const hintEl = modal.querySelector("#residentNpcHint");
    const slotsEl = modal.querySelector("#residentNpcSlots");
    const poolEl = modal.querySelector("#residentNpcPool");

    if (summaryEl) {
      summaryEl.textContent = this.getResidentNpcSummaryForBuilding(b);
    }
    if (hintEl) {
      hintEl.textContent = this.residentNpcModalLastLabel || "";
    }

    if (slotsEl) {
      slotsEl.innerHTML = slots.map((slot, idx) => {
        const isActive = idx === activeSlot;
        if (!slot?.key) {
          return `
            <div class="resident-slot-card${isActive ? " active" : ""}" data-resident-slot-index="${idx}">
              <div class="resident-slot-top">Espacio ${idx + 1}</div>
              <div class="resident-slot-empty">Vacio</div>
              <div style="font-size:11px;color:#64748b;">Sin NPC residente</div>
            </div>
          `;
        }

        const key = String(slot.key || "");
        const def = defs[key] || {};
        const rarity = this.getNpcRarityForKey(key);
        const evo = Math.max(0, Math.min(5, Number(slot.evo) || 0));
        const stars = "\u2605".repeat(Math.max(1, rarity));
        return `
          <div class="resident-slot-card${isActive ? " active" : ""}" data-resident-slot-index="${idx}">
            <div class="resident-slot-top">Espacio ${idx + 1}</div>
            <div style="display:flex;align-items:center;gap:8px;min-width:0;">
              <div class="resident-slot-icon">${def.icon || "??"}</div>
              <div style="min-width:0;flex:1;">
                <div style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${def.name || key}</div>
                <div style="font-size:11px;color:#fcd34d;">${stars} | Evo ${evo}</div>
                <div style="font-size:11px;color:#93c5fd;">NPC residente activo</div>
              </div>
            </div>
            <button class="resident-remove" data-resident-unassign="${idx}">Quitar</button>
          </div>
        `;
      }).join("");

      slotsEl.querySelectorAll("[data-resident-slot-index]").forEach((card) => {
        card.addEventListener("click", (e) => {
          const removeBtn = e.target instanceof Element
            ? e.target.closest("[data-resident-unassign]")
            : null;
          if (removeBtn) return;
          const idx = Number(card.getAttribute("data-resident-slot-index") || -1);
          if (idx < 0) return;
          modal.dataset.activeSlot = String(idx);
          this.updateResidentNpcModal();
        });
      });

      slotsEl.querySelectorAll("[data-resident-unassign]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = Number(btn.getAttribute("data-resident-unassign") || -1);
          if (idx < 0) return;
          const ok = this.unassignResidentNpcFromBuildingSlot(id, idx);
          this.residentNpcModalLastLabel = ok
            ? `NPC retirado del espacio ${idx + 1}.`
            : "No se pudo retirar el NPC.";
          modal.dataset.activeSlot = String(Math.max(0, idx - 1));
          this.updateResidentNpcModal();
        });
      });
    }

    if (!poolEl) return;

    const canAssign = !!b.isBuilt;
    const pool = this.getNpcPoolEntriesForModal();
    if (!pool.length) {
      poolEl.innerHTML = `<div style="font-size:12px;color:#94a3b8;">No tienes NPC del banner disponibles en inventario.</div>`;
      return;
    }

    const assignLabel = `Enviar a E${activeSlot + 1}`;
    poolEl.innerHTML = pool.map((entry) => {
      const stars = "\u2605".repeat(Math.max(1, entry.rarity));
      const duplicated = this.isNpcKeyDuplicatedInSlots(slots, entry.key, activeSlot);
      const disabledAttr = (canAssign && !duplicated) ? "" : "disabled";
      const reasonText = duplicated
        ? "Ya esta en otro espacio de esta casa."
        : `${stars} | Evo ${entry.evo} | Inv x${entry.count}`;
      return `
        <div class="resident-pool-item">
          <div class="resident-pool-icon">${entry.def.icon || "??"}</div>
          <div class="resident-pool-meta">
            <div class="resident-pool-name">${entry.def.name || entry.key}</div>
            <div class="resident-pool-sub">${reasonText}</div>
          </div>
          <button class="resident-assign" data-resident-assign-key="${entry.key}" ${disabledAttr}>${assignLabel}</button>
        </div>
      `;
    }).join("");

    if (!canAssign) {
      poolEl.insertAdjacentHTML("afterbegin", `<div style="font-size:12px;color:#fca5a5;padding:4px 2px;">La Casa Conera debe terminar su construccion antes de recibir NPC.</div>`);
    }

    poolEl.querySelectorAll("[data-resident-assign-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const npcKey = String(btn.getAttribute("data-resident-assign-key") || "");
        const activeSlotNow = Number(modal.dataset.activeSlot || 0);
        if (this.isNpcKeyDuplicatedInSlots(this.ensureResidentNpcSlotsForBuilding(b), npcKey, activeSlotNow)) {
          this.residentNpcModalLastLabel = "Ese NPC ya esta asignado en otro espacio de este edificio.";
          this.updateResidentNpcModal();
          return;
        }
        const ok = this.assignResidentNpcToBuildingSlot(id, activeSlotNow, npcKey);
        this.residentNpcModalLastLabel = ok
          ? `NPC enviado al espacio ${activeSlotNow + 1}.`
          : `No se pudo enviar ${npcKey || "ese NPC"}.`;
        this.updateResidentNpcModal();
      });
    });
  }

  openNpcSlotsModal(idOrBuilding) {
    this.closeNpcSlotsModal();
    this.closeResidentNpcModal();

    const b = (typeof idOrBuilding === "object")
      ? idOrBuilding
      : buildings.get(Number(idOrBuilding));
    if (!b) return;
    if (!this.isNpcSlotEligibleBuildingType(b.typeKey)) return;

    this.ensureNpcSlotsForBuilding(b);
    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    this.npcSlotsModalLastLabel = "";

    const modal = document.createElement("div");
    modal.id = "npc-slots-modal";
    modal.dataset.buildingId = String(b.id);
    modal.dataset.activeSlot = "0";
    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      background: "rgba(3,7,18,.74)",
      display: "grid",
      placeItems: "center",
      zIndex: "1000001",
      pointerEvents: "auto",
      backdropFilter: "blur(2px)"
    });

    modal.innerHTML = `
      <style>
        #npc-slots-modal .npc-slots-window {
          width: min(820px, 95vw);
          max-height: min(86vh, 780px);
          overflow: hidden;
          background: #0b1222;
          color: #e5e7eb;
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,.55);
          font-family: "Arial", Arial, sans-serif;
          display: grid;
          grid-template-rows: auto auto auto 1fr;
        }
        #npc-slots-modal .npc-slots-body {
          display:grid;
          grid-template-rows: auto auto minmax(220px, 1fr);
          min-height: 0;
          overflow: hidden;
        }
        #npc-slots-modal .npc-slots-head {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          padding:14px 16px;
          border-bottom: 1px solid rgba(255,255,255,.08);
        }
        #npc-slots-modal .npc-slots-summary {
          margin: 10px 16px 0;
          padding: 10px 12px;
          border: 1px solid rgba(56,189,248,.4);
          border-radius: 10px;
          color: #67e8f9;
          font-size: 13px;
          background: rgba(8,47,73,.35);
        }
        #npc-slots-modal .npc-slots-help {
          margin: 8px 16px 0;
          font-size: 12px;
          color: #93c5fd;
        }
        #npc-slots-modal .npc-slots-grid {
          margin: 8px 16px 0;
          display:grid;
          gap:8px;
          grid-template-columns: repeat(5, minmax(0, 1fr));
        }
        #npc-slots-modal .npc-pool-head {
          margin: 12px 16px 0;
          font-size: 12px;
          color: #93c5fd;
          font-weight: 700;
        }
        #npc-slots-modal .npc-slot-card {
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 12px;
          padding: 8px;
          background: #0f172a;
          min-height: 150px;
          display: grid;
          align-content: start;
          gap: 6px;
          cursor: pointer;
        }
        #npc-slots-modal .npc-slot-card.active {
          border-color: rgba(56,189,248,.95);
          box-shadow: 0 0 0 1px rgba(56,189,248,.55), 0 0 16px rgba(56,189,248,.28);
        }
        #npc-slots-modal .npc-slot-top {
          font-size: 12px;
          font-weight: 800;
          color: #93c5fd;
        }
        #npc-slots-modal .npc-slot-empty {
          margin-top: 6px;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }
        #npc-slots-modal .npc-slot-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.18);
          display:grid;
          place-items:center;
          font-weight: 800;
          color: #f8fafc;
          background: linear-gradient(135deg,#1e293b 0%,#0f172a 100%);
          overflow: hidden;
        }
        #npc-slots-modal .npc-slot-icon.is-special {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          background: linear-gradient(135deg,#334155 0%,#0f172a 100%);
          border-color: rgba(251,191,36,.65);
          box-shadow: 0 0 12px rgba(251,191,36,.22);
        }
        #npc-slots-modal .npc-slot-remove {
          justify-self: end;
          background:#ef4444;
          color:#fff;
          border:none;
          border-radius:8px;
          padding:4px 7px;
          font-size:11px;
          font-weight:700;
          cursor:pointer;
        }
        #npc-slots-modal .npc-pool {
          margin: 10px 16px 16px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 12px;
          min-height: 220px;
          overflow: auto;
          background: rgba(2,6,23,.6);
          padding: 10px;
          display:grid;
          gap: 8px;
          align-content: start;
        }
        #npc-slots-modal .npc-pool-item {
          border:1px solid rgba(255,255,255,.1);
          border-radius: 12px;
          padding: 8px;
          background: #0f172a;
          display:flex;
          align-items:center;
          gap: 10px;
        }
        #npc-slots-modal .npc-pool-item.special-square {
          border-color: rgba(251,191,36,.55);
          background: linear-gradient(135deg,#111827 0%, #0b1222 100%);
          box-shadow: inset 0 0 0 1px rgba(251,191,36,.18);
        }
        #npc-slots-modal .npc-pool-icon {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,.2);
          display:grid;
          place-items:center;
          background: linear-gradient(135deg,#334155 0%,#1f2937 100%);
          color:#fff;
          font-weight:800;
          flex: 0 0 auto;
          overflow: hidden;
        }
        #npc-slots-modal .npc-pool-icon.square {
          width: 52px;
          height: 52px;
          border-radius: 8px;
          border-color: rgba(251,191,36,.7);
          box-shadow: 0 0 12px rgba(251,191,36,.25);
        }
        #npc-slots-modal .npc-pool-meta {
          min-width: 0;
          flex: 1 1 auto;
        }
        #npc-slots-modal .npc-pool-name {
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        #npc-slots-modal .npc-pool-sub {
          font-size: 12px;
          color: #93c5fd;
        }
        #npc-slots-modal .npc-pool-buff {
          font-size: 11px;
          color: #67e8f9;
        }
        #npc-slots-modal .npc-assign-btn {
          background:#22c55e;
          color:#032b1b;
          border:none;
          border-radius:8px;
          padding:7px 9px;
          font-size:12px;
          font-weight:800;
          cursor:pointer;
          white-space: nowrap;
        }
        #npc-slots-modal .npc-assign-btn[disabled] {
          opacity:.6;
          cursor:not-allowed;
        }
        @media (max-width: 880px) {
          #npc-slots-modal .npc-slots-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          #npc-slots-modal .npc-slot-card {
            min-height: 132px;
          }
        }
      </style>

      <div class="npc-slots-window">
        <div class="npc-slots-head">
          <div>
            <div style="font-size:16px;font-weight:800;">Slots NPC - ${def.label || b.typeKey}</div>
            <div style="font-size:12px;color:#93c5fd;">Asigna NPC para buffs activos por edificio.</div>
          </div>
          <button id="npcSlotsClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.14);padding:8px 10px;border-radius:10px;cursor:pointer;">X</button>
        </div>

        <div id="npcSlotsModalSummary" class="npc-slots-summary">NPC: --</div>
        <div class="npc-slots-help">Selecciona un slot y luego un NPC del inventario. NPC especiales (4/5 estrellas) se muestran en cuadro.</div>
        <div id="npcSlotsModalHint" style="margin:6px 16px 0;font-size:12px;color:#fbbf24;min-height:16px;"></div>
        <div class="npc-slots-body">
          <div id="npcSlotsModalSlots" class="npc-slots-grid"></div>
          <div class="npc-pool-head">NPC disponibles para asignar</div>
          <div id="npcSlotsModalPool" class="npc-pool"></div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => this.closeNpcSlotsModal();
    modal.querySelector("#npcSlotsClose")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });

    this.updateNpcSlotsModal();
  }

  updateNpcSlotsModal() {
    const modal = document.getElementById("npc-slots-modal");
    if (!modal) return;

    const id = Number(modal.dataset.buildingId || 0);
    const b = buildings.get(id);
    if (!b || !this.isNpcSlotEligibleBuildingType(b.typeKey)) {
      this.closeNpcSlotsModal();
      return;
    }

    const slots = this.ensureNpcSlotsForBuilding(b);
    if (!slots.length) {
      this.closeNpcSlotsModal();
      return;
    }

    let activeSlot = Math.round(Number(modal.dataset.activeSlot) || 0);
    if (!Number.isFinite(activeSlot) || activeSlot < 0 || activeSlot >= slots.length) {
      activeSlot = 0;
    }
    modal.dataset.activeSlot = String(activeSlot);

    const defs = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS && typeof ITEM_DEFS === "object") ? ITEM_DEFS : {};
    const summaryEl = modal.querySelector("#npcSlotsModalSummary");
    const hintEl = modal.querySelector("#npcSlotsModalHint");
    const slotsEl = modal.querySelector("#npcSlotsModalSlots");
    const poolEl = modal.querySelector("#npcSlotsModalPool");

    if (summaryEl) {
      summaryEl.textContent = this.getNpcBuffSummaryForBuilding(b);
    }
    if (hintEl) {
      hintEl.textContent = this.npcSlotsModalLastLabel || "";
    }

    if (slotsEl) {
      slotsEl.innerHTML = slots.map((slot, idx) => {
        const isActive = idx === activeSlot;
        if (!slot?.key) {
          return `
            <div class="npc-slot-card${isActive ? " active" : ""}" data-npc-slot-index="${idx}">
              <div class="npc-slot-top">Slot ${idx + 1}</div>
              <div class="npc-slot-empty">Vacio</div>
              <div style="font-size:11px;color:#64748b;">Sin NPC asignado</div>
            </div>
          `;
        }

        const key = String(slot.key || "");
        const def = defs[key] || {};
        const rarity = this.getNpcRarityForKey(key);
        const role = this.getNpcRoleForKey(key);
        const roleLabel = this.getNpcSlotRoleLabel(role);
        const evo = Math.max(0, Math.min(5, Number(slot.evo) || 0));
        const stars = "\u2605".repeat(Math.max(1, rarity));
        const icon = def.icon || "??";
        const name = def.name || key;
        const buffText = this.getNpcUnitBuffText(key, evo, b.typeKey);
        const specialClass = (rarity >= 4) ? " is-special" : "";

        return `
          <div class="npc-slot-card${isActive ? " active" : ""}" data-npc-slot-index="${idx}">
            <div class="npc-slot-top">Slot ${idx + 1}</div>
            <div style="display:flex;align-items:center;gap:8px;min-width:0;">
              <div class="npc-slot-icon${specialClass}">${icon}</div>
              <div style="min-width:0;flex:1;">
                <div style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
                <div style="font-size:11px;color:#93c5fd;">${stars} | ${roleLabel} | Evo ${evo}</div>
                <div style="font-size:11px;color:#67e8f9;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${buffText}</div>
              </div>
            </div>
            <button class="npc-slot-remove" data-npc-unassign="${idx}">Quitar</button>
          </div>
        `;
      }).join("");

      slotsEl.querySelectorAll("[data-npc-slot-index]").forEach((card) => {
        card.addEventListener("click", (e) => {
          const clickedUnassign = e.target instanceof Element
            ? e.target.closest("[data-npc-unassign]")
            : null;
          if (clickedUnassign) return;
          const idx = Number(card.getAttribute("data-npc-slot-index") || -1);
          if (idx < 0) return;
          modal.dataset.activeSlot = String(idx);
          this.updateNpcSlotsModal();
        });
      });

      slotsEl.querySelectorAll("[data-npc-unassign]").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const idx = Number(btn.getAttribute("data-npc-unassign") || -1);
          if (idx < 0) return;
          const ok = this.unassignNpcFromBuildingSlot(Number(modal.dataset.buildingId || 0), idx);
          this.npcSlotsModalLastLabel = ok
            ? `NPC removido del Slot ${idx + 1}.`
            : "No se pudo quitar el NPC.";
          modal.dataset.activeSlot = String(Math.max(0, idx));
          this.updateNpcSlotsModal();
        });
      });
    }

    if (!poolEl) return;

    const canAssign = !!b.isBuilt;
    const pool = this.getNpcPoolEntriesForModal();
    if (!pool.length) {
      poolEl.innerHTML = `<div style="font-size:12px;color:#94a3b8;">No tienes NPC disponibles en inventario.</div>`;
      return;
    }

    const assignLabel = `Asignar a S${activeSlot + 1}`;
    poolEl.innerHTML = pool.map((entry) => {
      const stars = "\u2605".repeat(Math.max(1, entry.rarity));
      const roleLabel = this.getNpcSlotRoleLabel(entry.role);
      const buffText = this.getNpcUnitBuffText(entry.key, entry.evo, b.typeKey);
      const special = entry.rarity >= 4;
      const itemClass = special ? "npc-pool-item special-square" : "npc-pool-item";
      const iconClass = special ? "npc-pool-icon square" : "npc-pool-icon";
      const duplicated = this.isNpcKeyDuplicatedInSlots(slots, entry.key, activeSlot);
      const disabledAttr = (canAssign && !duplicated) ? "" : "disabled";
      const subText = duplicated
        ? `${stars} | Ya esta en otro slot de este edificio`
        : `${stars} | ${roleLabel} | Inv x${entry.count}`;
      return `
        <div class="${itemClass}">
          <div class="${iconClass}">${entry.def.icon || "??"}</div>
          <div class="npc-pool-meta">
            <div class="npc-pool-name">${entry.def.name || entry.key}</div>
            <div class="npc-pool-sub">${subText}</div>
            <div class="npc-pool-buff">${buffText}</div>
          </div>
          <button class="npc-assign-btn" data-npc-assign-key="${entry.key}" ${disabledAttr}>${assignLabel}</button>
        </div>
      `;
    }).join("");

    if (!canAssign) {
      poolEl.insertAdjacentHTML("afterbegin", `<div style="font-size:12px;color:#fca5a5;padding:4px 2px;">Este edificio aun no termina construccion. No se puede asignar NPC.</div>`);
    }

    poolEl.querySelectorAll("[data-npc-assign-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const npcKey = String(btn.getAttribute("data-npc-assign-key") || "");
        const activeSlotNow = Number(modal.dataset.activeSlot || 0);
        if (this.isNpcKeyDuplicatedInSlots(this.ensureNpcSlotsForBuilding(b), npcKey, activeSlotNow)) {
          this.npcSlotsModalLastLabel = "Ese NPC ya esta asignado en otro slot de este edificio.";
          this.updateNpcSlotsModal();
          return;
        }
        const ok = this.assignNpcToBuildingSlot(Number(modal.dataset.buildingId || 0), activeSlotNow, npcKey);
        this.npcSlotsModalLastLabel = ok
          ? `NPC asignado al Slot ${activeSlotNow + 1}.`
          : `No se pudo asignar ${npcKey || "ese NPC"}.`;
        this.updateNpcSlotsModal();
      });
    });
  }

  updateBuildingInfoModal(b, def, now) {
    const modal = document.getElementById("building-modal");
    if (!modal || !b) return;
    const modalId = Number(modal.dataset.buildingId);
    if (Number.isFinite(modalId) && modalId !== b.id) return;

    const buildSection = modal.querySelector("#buildSection");
    const prodSection = modal.querySelector("#prodSection");
    const buildFill = modal.querySelector("#buildFill");
    const prodFill = modal.querySelector("#prodFill");
    const buildTime = modal.querySelector("#buildTime");
    const prodTime = modal.querySelector("#prodTime");
    const collectBtn = modal.querySelector("#bldCollect");
    const evoDiamonds = modal.querySelector("#evoDiamonds");
    const evoHint = modal.querySelector("#evoHint");
    const evoBtn = modal.querySelector("#bldEvolve");
    const transBtn = modal.querySelector("#bldTrans");
    const previewFrame = modal.querySelector("#previewFrame");
    const previewInner = modal.querySelector("#previewInner");
    const previewStars = modal.querySelector("#previewStars");
    const win = modal.querySelector(".building-window");
    const buffInfoLine = modal.querySelector("#buffInfoLine");
    const rewardInfoLine = modal.querySelector("#rewardInfoLine");
    const marketUnlockSection = modal.querySelector("#marketUnlockSection");
    const marketUnlockBtn = modal.querySelector("#marketUnlockBtn");
    const marketUnlockReq = modal.querySelector("#marketUnlockReq");
    const activationBtn = modal.querySelector("#bldActivation");
    const spriteAlignBtn = modal.querySelector("#bldSpriteAlign");
    const npcManageBtn = modal.querySelector("#bldNpcManage");
    const npcSlotsSection = modal.querySelector("#npcSlotsSection");
    const npcSlotsLine = modal.querySelector("#npcSlotsLine");
    const residentManageBtn = modal.querySelector("#bldResidentManage");
    const residentNpcSection = modal.querySelector("#residentNpcSection");
    const residentNpcLine = modal.querySelector("#residentNpcLine");
    const npcEligible = this.isNpcSlotEligibleBuildingType(b.typeKey);
    const residentEligible = this.isNpcResidenceBuilding(b.typeKey);
    const baseRarity = this.getRarityForKey(def.key || b.typeKey);
    const evoLevel = Math.max(0, Math.min(5, b.evoLevel || 0));
    const evoStage = (typeof b.evoStage === "number")
      ? b.evoStage
      : (baseRarity === 5 ? 5 : 0);
    const displayRarity = (baseRarity === 5 && evoStage >= 6) ? 6 : baseRarity;
    const evoActive = (evoLevel > 0) || (evoStage >= 6);
    const maxLabel = `Max ${displayRarity}\u2605`;
    const maxColorFrameClass = (displayRarity >= 1 && displayRarity <= 5 && evoLevel >= 5)
      ? ` maxed-${displayRarity}`
      : "";
    const frameClass = displayRarity === 6
      ? `preview-frame frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `preview-frame frame-${displayRarity}${evoActive ? " evo-on" : ""}${maxColorFrameClass}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5)
      ? "preview-inner chrome"
      : ((displayRarity >= 1 && displayRarity <= 5 && evoLevel >= 5) ? `preview-inner chrome-${displayRarity}` : "preview-inner");
    const starClass = (displayRarity === 6) ? "stars-6" : (displayRarity === 5 ? "stars-5" : "stars-base");

    const getAuraStats = () => (b.areaBuff || this.getAreaBuffForBuilding(b));
    const getNpcStats = () => (b.npcBuff || this.getNpcBuffForBuilding(b));

    const updateBuffInfoLine = () => {
      if (!buffInfoLine) return;
      const aura = getAuraStats();
      const stacks = Math.max(0, Number(aura?.stacks) || 0);
      const buildPct = Math.max(0, Number(aura?.buildReductionPct) || 0);
      const prodPct = Math.max(0, Number(aura?.prodBoostPct) || 0);
      if (stacks > 0) {
        buffInfoLine.style.color = "#67e8f9";
        buffInfoLine.innerHTML = `<b>\u2726 Buff activo:</b> Constr -${buildPct}% | Oro/XP +${prodPct}% | Fuentes ${stacks}/${DECOR_AURA_MAX_STACKS}`;
      } else {
        buffInfoLine.style.color = "#94a3b8";
        buffInfoLine.innerHTML = "<b>\u2726 Buff activo:</b> Ninguno";
      }
    };

    const updateRewardInfoLine = () => {
      if (!rewardInfoLine) return;
      if (this.isMinimarketBuilding(b.typeKey) && !this.isMinimarketUnlocked(b)) {
        rewardInfoLine.innerHTML = "Recompensa: <b>Minimarket bloqueado</b> (requiere Activacion)";
        return;
      }
      const hasProductionNow = this.hasBuildingProduction(b, def);
      if (!hasProductionNow) {
        rewardInfoLine.innerHTML = "Recompensa: <b>No produce recursos</b>";
        return;
      }

      const aura = getAuraStats();
      const stacks = Math.max(0, Number(aura?.stacks) || 0);
      const baseReward = b.baseReward || def.reward || { exp: 0, gold: 0 };
      const evoStatsForReward = this.getEvolutionStats(b.typeKey, evoStage, evoLevel);
      const rewardBaseGold = Math.max(0, Math.round((baseReward.gold || 0) * (evoStatsForReward.rewardMult || 1)));
      const rewardBaseExp = Math.max(0, Math.round((baseReward.exp || 0) * (evoStatsForReward.rewardMult || 1)));
      const rewardNowGold = Math.max(0, Math.round(b.reward?.gold ?? rewardBaseGold));
      const rewardNowExp = Math.max(0, Math.round(b.reward?.exp ?? rewardBaseExp));
      const extraGold = Math.max(0, rewardNowGold - rewardBaseGold);
      const extraExp = Math.max(0, rewardNowExp - rewardBaseExp);

      const showBonus = (extraGold > 0) || (extraExp > 0);
      const bonusColor = "#67e8f9";
      const goldBonusHtml = showBonus ? ` <span style="color:${bonusColor};font-weight:700;">(+${extraGold})</span>` : "";
      const expBonusHtml = showBonus ? ` <span style="color:${bonusColor};font-weight:700;">(+${extraExp})</span>` : "";

      rewardInfoLine.innerHTML = `Recompensa: <b>+${rewardNowGold} Oro</b>${goldBonusHtml}  |  <b>+${rewardNowExp} EXP</b>${expBonusHtml}`;
    };

    updateBuffInfoLine();
    updateRewardInfoLine();

    const hasActivation = this.hasBuildingActivation(b.typeKey);
    const activationUnlocked = this.isBuildingActivationUnlocked(b);
    if (marketUnlockSection) marketUnlockSection.style.display = "none";
    if (marketUnlockReq) marketUnlockReq.innerHTML = "";
    if (marketUnlockBtn) marketUnlockBtn.style.display = "none";
    if (activationBtn) {
      activationBtn.style.display = hasActivation ? "" : "none";
      activationBtn.textContent = "Activacion";
      if (!hasActivation || !b.isBuilt) {
        activationBtn.setAttribute("disabled", "true");
        activationBtn.style.opacity = ".65";
        activationBtn.style.cursor = "not-allowed";
      } else {
        activationBtn.removeAttribute("disabled");
        activationBtn.style.opacity = activationUnlocked ? ".9" : "1";
        activationBtn.style.cursor = "pointer";
      }
    }
    if (spriteAlignBtn) {
      const canSpriteAlign = !!(b.sprite && this.isSpriteBuilding(b.typeKey));
      spriteAlignBtn.style.display = canSpriteAlign ? "" : "none";
      if (!canSpriteAlign) {
        spriteAlignBtn.setAttribute("disabled", "true");
      } else {
        spriteAlignBtn.removeAttribute("disabled");
      }
    }

    if (npcSlotsSection) {
      npcSlotsSection.style.display = npcEligible ? "block" : "none";
    }
    if (npcSlotsLine) {
      if (npcEligible) {
        npcSlotsLine.style.color = "#67e8f9";
        npcSlotsLine.textContent = this.getNpcBuffSummaryForBuilding(b);
      } else {
        npcSlotsLine.style.color = "#94a3b8";
        npcSlotsLine.textContent = "NPC: No disponible";
      }
    }
    if (npcManageBtn) {
      npcManageBtn.style.display = npcEligible ? "inline-block" : "none";
      if (!npcEligible || !b.isBuilt) {
        npcManageBtn.setAttribute("disabled", "true");
        npcManageBtn.style.opacity = ".6";
        npcManageBtn.style.cursor = "not-allowed";
      } else {
        npcManageBtn.removeAttribute("disabled");
        npcManageBtn.style.opacity = "1";
        npcManageBtn.style.cursor = "pointer";
      }
    }

    if (residentNpcSection) {
      residentNpcSection.style.display = residentEligible ? "block" : "none";
    }
    if (residentNpcLine) {
      if (residentEligible) {
        residentNpcLine.style.color = "#fcd34d";
        residentNpcLine.textContent = this.getResidentNpcSummaryForBuilding(b);
      } else {
        residentNpcLine.style.color = "#94a3b8";
        residentNpcLine.textContent = "Residentes NPC: No disponible";
      }
    }
    if (residentManageBtn) {
      residentManageBtn.style.display = residentEligible ? "inline-block" : "none";
      if (!residentEligible || !b.isBuilt) {
        residentManageBtn.setAttribute("disabled", "true");
        residentManageBtn.style.opacity = ".6";
        residentManageBtn.style.cursor = "not-allowed";
      } else {
        residentManageBtn.removeAttribute("disabled");
        residentManageBtn.style.opacity = "1";
        residentManageBtn.style.cursor = "pointer";
      }
    }

    this.updateBuildingActivationModal();
    this.updateSpriteAlignModal();

    if (!b.isBuilt) {
      if (buildSection) buildSection.style.display = "block";
      if (prodSection) prodSection.style.display = "none";

      const total = (b.buildSeconds ?? def.buildSeconds) * 1000;
      const remain = Math.max(0, b.buildEnd - now);
      const done = total > 0 ? (1 - (remain / total)) : 1;

      if (buildFill) buildFill.style.width = `${Math.floor(Phaser.Math.Clamp(done, 0, 1) * 100)}%`;
      if (buildTime) buildTime.textContent = `${this.formatSeconds(Math.ceil(remain / 1000))} restante`;
      if (collectBtn) collectBtn.setAttribute("disabled", "true");
      return;
    }

    if (buildSection) buildSection.style.display = "none";
    const hasProduction = this.hasBuildingProduction(b, def);
    if (!hasProduction) {
      if (prodSection) prodSection.style.display = "none";
      if (collectBtn) collectBtn.setAttribute("disabled", "true");
    } else {
      if (prodSection) prodSection.style.display = "block";

      const cycle = b.prodCycle;
      let p01 = 1;
      let remain = 0;
      if (!b.rewardReady) {
        const elapsed = now - b.prodStart;
        if (cycle > 0) {
          p01 = Phaser.Math.Clamp(elapsed / cycle, 0, 1);
          remain = Math.max(0, cycle - elapsed);
        }
      }

      if (prodFill) prodFill.style.width = `${Math.floor(Phaser.Math.Clamp(p01, 0, 1) * 100)}%`;
      if (prodTime) {
        prodTime.textContent = b.rewardReady ? "Listo" : `${this.formatSeconds(Math.ceil(remain / 1000))} restante`;
      }

      if (collectBtn) {
        if (b.rewardReady) {
          collectBtn.removeAttribute("disabled");
        } else {
          collectBtn.setAttribute("disabled", "true");
        }
      }
    }

    if (previewStars) {
      if (displayRarity === 6) {
        previewStars.innerHTML = Array.from({ length: 6 }, (_, i) => (
          `<span class="star star-6" style="--h:${i * 60}deg">\u2605</span>`
        )).join("");
      } else {
        previewStars.textContent = "\u2605".repeat(displayRarity);
      }
      const starsCls = `preview-stars ${starClass}`;
      if (previewStars.className !== starsCls) previewStars.className = starsCls;
    }
    if (previewFrame && previewFrame.className !== frameClass) previewFrame.className = frameClass;
    if (previewInner && previewInner.className !== chromeClass) previewInner.className = chromeClass;
    const evoLevelClamped = Math.max(0, Math.min(5, b.evoLevel || 0));
    if (win) {
      const winCls = `building-window win-${displayRarity}${evoActive ? " evo-on" : ""}${(displayRarity === 6 && evoLevelClamped >= 5) ? " win-6max" : ""}`;
      if (win.className !== winCls) win.className = winCls;
    }

    const evoStats = this.getEvolutionStats(b.typeKey, evoStage, evoLevelClamped);
    if (evoDiamonds) evoDiamonds.innerHTML = this.buildEvoDiamonds(evoLevelClamped);
    if (evoHint) evoHint.textContent = `Evolucion ${(evoStage >= 5 ? evoStage : baseRarity)}\u2605: ${evoLevelClamped}/5 (${evoStats.bonusLabel})`;
    const noEvolution = this.isEvolutionDisabledBuilding(b.typeKey);
    if (noEvolution && evoHint) evoHint.textContent = "Evolucion no disponible";

    if (evoBtn) {
      if (noEvolution) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = "Sin evolucion";
      } else if (!b.isBuilt) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = "En construccion";
      } else if (evoStage >= 6 && evoLevelClamped >= 5) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = maxLabel;
      } else if (evoLevelClamped >= 5) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = maxLabel;
      } else {
        evoBtn.removeAttribute("disabled");
        evoBtn.textContent = "Evolucionar";
      }
    }
    if (transBtn) {
      const ready = !noEvolution && (b.isBuilt && baseRarity === 5 && evoStage === 5 && evoLevelClamped >= 5);
      if (ready) {
        transBtn.style.display = "inline-block";
        transBtn.removeAttribute("disabled");
      } else {
        transBtn.style.display = "none";
        transBtn.setAttribute("disabled", "true");
      }
    }
  }

  rotateSelected() {
    const id = this.selectedBuildingId;
    if (!id) return;

    const b = buildings.get(id);
    if (!b) return;
    if (this.isBuildingInfoLocked(b, Date.now())) return;
    if (!this.canRotateBuilding(b.typeKey)) {
      // Las carreteras no se giran: mantienen su pieza fija (manual/reemplazo).
      this.normalizeRoadBuildingState(b, true);
      if (b.cells?.length) this.refreshRoadVisualsAroundCells(b.cells, 1);
      return;
    }

    b.rotationStep = ((b.rotationStep || 0) + 1) % 4;

    if (b.sprite) {
      this.updateBuildingSpriteVisual(b);
      return;
    }

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const borders = [0x22c55e, 0x60a5fa, 0xf59e0b, 0xf472b6];
    b.border = borders[b.rotationStep];

    b.gfx.clear();
    if (this.isProducerBuilding(b.typeKey) && b.isBuilt) this.drawProducerCubes(b.gfx, b.cells, def.fill, 0.95, b.border);
    else this.drawCells(b.gfx, b.cells, def.fill, 0.85, b.border);
  }

  // ===== Move with orange/red ghost =====
  startMoveSelected() {
    const id = this.selectedBuildingId;
    if (!id) return;

    const b = buildings.get(id);
    if (!b) return;
    if (this.isBuildingInfoLocked(b, Date.now())) return;
    const isRoad = b.typeKey === "road_main_2x2";
    if (isRoad) this.normalizeRoadBuildingState(b, true);

    const min = b.cells.reduce((m, t) => ((t.r + t.c) < (m.r + m.c) ? t : m), b.cells[0]);

    freeBuilding(id);
    b.gfx.setVisible(false);
    b.sprite?.setVisible(false);
    b.roadSprite?.setVisible(false);
    if (isRoad && b.cells?.length) {
      this.refreshRoadVisualsAroundCells(b.cells, 1);
    }

    this.moveMode = {
      id,
      size: b.size,
      typeKey: b.typeKey,
      from: { r: min.r, c: min.c },
      border: isRoad ? (BUILDING_TYPES.road_main_2x2.border) : (b.border || 0x22c55e),
      rotationStep: isRoad ? 0 : (b.rotationStep || 0),
      evoLevel: b.evoLevel || 0
    };

    this.selectedBuildingId = null;
    this.modeText.setText("Modo: Moviendo (naranja=OK / rojo=NO) | Click suelta / Click fuera cancela");
    this.moveGhost.clear();
  }

  renderMoveGhost(tile) {
    if (!this.moveMode) return;
    this.moveGhost.clear();
    if (!tile) {
      this.clearBuffAreaGhost();
      this.moveGhostSprite?.setVisible(false);
      return;
    }

    const ok = this.canPlaceBuildAt(
      this.moveMode.typeKey,
      this.moveMode.size,
      tile.r,
      tile.c,
      this.moveMode.rotationStep || 0
    );
    const color = ok ? 0xf59e0b : 0xf87171;

    const cells = [];
    for (let r = tile.r; r < tile.r + this.moveMode.size; r++) {
      for (let c = tile.c; c < tile.c + this.moveMode.size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }
    if (this.isProducerBuilding(this.moveMode.typeKey) && !this.isSpriteBuilding(this.moveMode.typeKey)) {
      this.drawProducerCubes(this.moveGhost, cells, color, 0.35, color);
    } else {
      this.drawCells(this.moveGhost, cells, color, 0.35, color);
    }
    this.drawBuffAreaGhostForPlacement(
      this.moveMode.typeKey,
      tile.r,
      tile.c,
      this.moveMode.size,
      this.moveMode.evoLevel || 0
    );
    if (this.isSpriteBuilding(this.moveMode.typeKey)) {
      this.placeSpriteAtTile(this.moveGhostSprite, this.moveMode.typeKey, this.moveMode.rotationStep || 0, tile.r, tile.c, ok ? 0.56 : 0.42);
      this.applyDefaultSpriteEditToLooseSprite(this.moveGhostSprite, this.moveMode.typeKey, ok ? 0.56 : 0.42);
    } else {
      this.moveGhostSprite?.setVisible(false);
    }
  }

  finishMoveAt(r0, c0) {
    const mm = this.moveMode;
    const b = buildings.get(mm.id);
    if (!b) return;
    const now = Date.now();
    const prevCells = [];
    for (let rr = mm.from.r; rr < mm.from.r + mm.size; rr++) {
      for (let cc = mm.from.c; cc < mm.from.c + mm.size; cc++) {
        if (inBounds(rr, cc)) prevCells.push({ r: rr, c: cc });
      }
    }

    b.cells = occupy(mm.id, mm.size, r0, c0);
    b.rotationStep = this.canRotateBuilding(b.typeKey) ? mm.rotationStep : 0;
    b.border = this.canRotateBuilding(b.typeKey) ? mm.border : (BUILDING_TYPES.road_main_2x2.border);
    this.recalculateAllBuildingStats(now);

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    b.gfx.clear();
    if (b.typeKey === "road_main_2x2") {
      this.redrawRoadBuildingVisual(b, 0.85);
    } else if (b.sprite) {
      if (b.isBuilt) {
        this.updateBuildingSpriteVisual(b);
        b.sprite.setVisible(true);
        b.gfx.setVisible(false);
      } else {
        this.updateBuildingSpriteVisual(b, 0.3);
        b.sprite.setVisible(true);
        this.drawCells(b.gfx, b.cells, def.fill, 0.25, 0x64748b);
        b.gfx.setVisible(true);
      }
    } else {
      if (this.isProducerBuilding(b.typeKey) && b.isBuilt) this.drawProducerCubes(b.gfx, b.cells, def.fill, 0.95, b.border);
      else this.drawCells(b.gfx, b.cells, def.fill, 0.85, b.border);
      b.gfx.setVisible(true);
    }

    this.moveGhost.clear();
    this.moveGhostSprite?.setVisible(false);
    this.moveMode = null;
    this.clearBuffAreaGhost();
    this.modeText.setText(this.modeLabel());
    if (b.typeKey === "road_main_2x2") {
      this.refreshRoadVisualsAroundCells(prevCells, 1);
      this.refreshRoadVisualsAroundCells(b.cells, 1);
    }
  }

  cancelMoveMode(restore) {
    if (!this.moveMode) return;

    const { id, size, from, border, rotationStep } = this.moveMode;
    const b = buildings.get(id);

    if (b && restore) {
      b.cells = occupy(id, size, from.r, from.c);
      b.border = this.canRotateBuilding(b.typeKey) ? border : (BUILDING_TYPES.road_main_2x2.border);
      b.rotationStep = this.canRotateBuilding(b.typeKey) ? rotationStep : 0;

      const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
      b.gfx.clear();
      if (b.typeKey === "road_main_2x2") {
        this.redrawRoadBuildingVisual(b, 0.85);
        this.refreshRoadVisualsAroundCells(b.cells, 1);
      } else if (b.sprite) {
        if (b.isBuilt) {
          this.updateBuildingSpriteVisual(b);
          b.sprite.setVisible(true);
          b.gfx.setVisible(false);
        } else {
          this.updateBuildingSpriteVisual(b, 0.3);
          b.sprite.setVisible(true);
          this.drawCells(b.gfx, b.cells, def.fill, 0.25, 0x64748b);
          b.gfx.setVisible(true);
        }
      } else {
        if (this.isProducerBuilding(b.typeKey) && b.isBuilt) this.drawProducerCubes(b.gfx, b.cells, def.fill, 0.95, border);
        else this.drawCells(b.gfx, b.cells, def.fill, 0.85, border);
        b.gfx.setVisible(true);
      }
    }

    this.moveGhost.clear();
    this.moveGhostSprite?.setVisible(false);
    this.moveMode = null;
    this.clearBuffAreaGhost();
    this.modeText.setText(this.modeLabel());
  }

  destroySelected() {
    const id = this.selectedBuildingId;
    if (!id) return;
    this.destroyBuilding(id);
    this.selectedBuildingId = null;
  }

  destroyBuilding(id) {
    const b = buildings.get(id);
    if (!b) return;
    if (this.isBuildingInfoLocked(b, Date.now())) return;
    const wasRoad = b.typeKey === "road_main_2x2";
    const oldCells = Array.isArray(b.cells) ? b.cells.map((t) => ({ r: t.r, c: t.c })) : [];

    // [OK] devolver item solo si fue consumido al construir.
    if (this.economy && b.typeKey && !this.isDecorativeHouse(b.typeKey) && b.inventoryConsumed !== false) {
      this.economy.addItem?.(b.typeKey, 1);
    }

    if (this.economy) {
      const slots = this.ensureNpcSlotsForBuilding(b);
      for (const slot of slots) {
        const npcKey = String(slot?.key || "");
        if (!npcKey) continue;
        this.economy.addItem?.(npcKey, 1);
      }
      b.npcSlots = [];
      const residentSlots = this.ensureResidentNpcSlotsForBuilding(b);
      for (const slot of residentSlots) {
        const npcKey = String(slot?.key || "");
        if (!npcKey) continue;
        this.economy.addItem?.(npcKey, 1);
      }
      b.residentNpcSlots = [];
    }

    this.removeStreetNpcsForBuilding(id);

    b.gfx.destroy();
    b.sprite?.destroy();
    b.roadSprite?.destroy();
    b.buildBar?.destroy();
    b.prodBar?.destroy();
    b.glowGfx?.destroy();
    b.rewardGoldIcon?.destroy();
    b.rewardExpIcon?.destroy();
    b.activationNeedIcon?.destroy();
    b.yapaBonusIcon?.destroy();
    this.closeNpcSlotsModal();
    this.closeResidentNpcModal();
    if (this.activeYapaBonusBuildingId === id) {
      this.activeYapaBonusBuildingId = null;
    }
    buildings.delete(id);
    freeBuilding(id);
    this.recalculateAllBuildingStats(Date.now());
    this.clearBuffAreaGhost();
    if (wasRoad && oldCells.length) {
      this.refreshRoadVisualsAroundCells(oldCells, 1);
    }
  }

  collectBuildingReward(id) {
    const b = buildings.get(id);
    if (!b || !b.rewardReady) return;

    if (this.isProducerBuilding(b.typeKey)) {
      this.collectProducerRecipe(b);
      b.rewardGoldIcon?.setVisible(false);
      b.rewardExpIcon?.setVisible(false);
      b.activationNeedIcon?.setVisible(false);
      return;
    }

    if (!this.hasBuildingProduction(b)) return;

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const reward = b.reward || def.reward || { exp: 0, gold: 0 };
    const gold = Math.max(0, Math.round(reward.gold));
    const exp = Math.max(0, Math.round(reward.exp));

    if (this.economy) {
      this.economy.addGold(gold);
      this.economy.addExp(exp);
    }

    b.rewardReady = false;
    b.prodStart = Date.now();
    b.rewardGoldIcon?.setVisible(false);
    b.rewardExpIcon?.setVisible(false);
    b.activationNeedIcon?.setVisible(false);
    this.economy?.updateYapaRailTimer?.();
  }

  placeBuilding(r0, c0) {
    // construir usando el item seleccionado
    const typeKey = this.selectedBuildKey || "green_1";
    const def = BUILDING_TYPES[typeKey] || BUILDING_TYPES.green_1;
    const isProducerType = this.isProducerBuilding(typeKey);

    const size = def.size;
    const previewRotationStep = this.canRotateBuilding(typeKey)
      ? (((this.pending?.rotationStep ?? this.getBuildPreview().rotationStep ?? 0) % 4 + 4) % 4)
      : 0;
    const rarity = this.getRarityForKey(typeKey);
    const mods = RARITY_MODS[rarity] || RARITY_MODS[2];
    const baseBuild = def.buildSeconds ?? 0;
    const baseProd = def.prodSeconds ?? 0;
    const baseReward = def.reward || { exp: 0, gold: 0 };
    const hasProduction = this.hasBuildingProduction(null, {
      prodSeconds: baseProd,
      reward: baseReward
    });
    const effBuild = Math.max(0, Math.round(baseBuild * mods.build));
    const effProd = hasProduction ? Math.max(1, Math.round(baseProd * mods.prod)) : 0;
    const effReward = hasProduction
      ? {
        exp: Math.max(0, Math.round(baseReward.exp * mods.reward)),
        gold: Math.max(0, Math.round(baseReward.gold * mods.reward))
      }
      : { exp: 0, gold: 0 };

    const forcedRoadPiece = (typeKey === "road_main_2x2") ? this.getAdminForcedRoadPiece() : 0;
    const isTempAdminRoadPlacement = (typeKey === "road_main_2x2" && forcedRoadPiece > 0 && this.adminForcedRoadPieceNoConsume !== false);
    const replacingRoad = (typeKey === "road_main_2x2") ? this.getRoadReplacementTarget(r0, c0, size) : null;

    // validar espacio (permite reemplazar una carretera por otra sin consumir inventario)
    if (!this.canPlaceBuildAt(typeKey, size, r0, c0, previewRotationStep) && !replacingRoad) return;

    if (replacingRoad) {
      const replacementPiece = Phaser.Math.Clamp(Math.round(Number(forcedRoadPiece) || 0), 0, ROADKOTO_PIECES);
      replacingRoad.roadForcedPiece = replacementPiece;
      replacingRoad.roadResolvedPiece = replacementPiece || 0;
      replacingRoad.roadResolvedRot = 0;
      this.normalizeRoadBuildingState(replacingRoad, false);
      this.redrawRoadBuildingVisual(replacingRoad, 0.85);
      if (Array.isArray(replacingRoad.cells) && replacingRoad.cells.length) {
        this.refreshRoadVisualsAroundCells(replacingRoad.cells, 1);
      }
      return replacingRoad.id;
    }

    // [OK] si no es el verde basico, debe existir en inventario y se consume
    // excepto en el modo temporal de piezas de carretera del admin.
    if (this.economy && !this.isDecorativeHouse(typeKey) && !isTempAdminRoadPlacement && !replacingRoad) {
      const ok = this.economy.consumeItem(typeKey, 1);
      if (!ok) {
        console.log("No tienes ese item en inventario:", typeKey);
        return;
      }
    }

    const id = nextBuildingId++;
    const cells = occupy(id, size, r0, c0);

    // base gfx (tiles)
    const gfx = this.add.graphics();
    const isInstant = effBuild <= 0;
    const ghostAlpha = isInstant ? 0.85 : 0.25;
    const ghostBorder = isInstant ? def.border : 0x64748b;
    if (isProducerType && !this.isSpriteBuilding(typeKey)) {
      this.drawProducerCubes(gfx, cells, def.fill, isInstant ? 0.95 : 0.35, ghostBorder);
    } else {
      this.drawCells(gfx, cells, def.fill, ghostAlpha, ghostBorder);
    }

    // [OK] UI cam NO renderiza edificios
    this.uiCam.ignore(gfx);

    let sprite = null;
    const spriteTexture = this.getSpriteTextureForBuilding(typeKey, 0);
    if (spriteTexture) {
      sprite = this.add.image(0, 0, spriteTexture)
        .setOrigin(0.5, 0.9)
        .setVisible(true);
      this.uiCam.ignore(sprite);
    }

    // ===== barras en mundo =====
    const buildBar = this.add.graphics();
    const prodBar = this.add.graphics();
    buildBar.setDepth(80);
    prodBar.setDepth(80);
    this.uiCam.ignore([buildBar, prodBar]);

    // ===== iconos de recompensa (manual) =====
    const rewardGoldIcon = this.add.text(0, 0, "\u{1F4B0}", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#fbbf24",
      backgroundColor: "#0b1222"
    })
      .setOrigin(0.5, 0.5)
      .setPadding(10, 6, 10, 6)
      .setDepth(82)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    const rewardExpIcon = this.add.text(0, 0, "\u2B50", {
      fontFamily: "Arial",
      fontSize: "28px",
      color: "#22c55e",
      backgroundColor: "#0b1222"
    })
      .setOrigin(0.5, 0.5)
      .setPadding(10, 6, 10, 6)
      .setDepth(82)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    const activationNeedIcon = this.add.text(0, 0, "\u{1F4E6}", {
      fontFamily: "Arial",
      fontSize: "26px",
      color: "#bfdbfe",
      backgroundColor: "#0b1222"
    })
      .setOrigin(0.5, 0.5)
      .setPadding(10, 6, 10, 6)
      .setDepth(82)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });
    activationNeedIcon.setStroke("#1d4ed8", 2);

    if (isProducerType) {
      rewardGoldIcon
        .setText("[M]")
        .setFontSize(24)
        .setColor("#fef3c7")
        .setBackgroundColor("#78350f");
      rewardExpIcon.setVisible(false);
    }

    let yapaBonusIcon;
    if (this.textures?.exists?.("ui_yapa_icon")) {
      yapaBonusIcon = this.add.image(0, 0, "ui_yapa_icon")
        .setOrigin(0.5, 0.5)
        .setDepth(83)
        .setVisible(false);
      yapaBonusIcon.setDisplaySize(24, 24);
    } else {
      yapaBonusIcon = this.add.text(0, 0, "S/", {
        fontFamily: "Arial",
        fontSize: "12px",
        fontStyle: "bold",
        color: "#5b21b6",
        backgroundColor: "#2dd4bf"
      })
        .setOrigin(0.5, 0.5)
        .setPadding(4, 1, 4, 1)
        .setDepth(83)
        .setVisible(false);
      yapaBonusIcon.setStroke("#ecfeff", 1);
    }

    this.uiCam.ignore([rewardGoldIcon, rewardExpIcon, activationNeedIcon, yapaBonusIcon]);

    const onCollect = (pointer) => {
      this.uiGuard(pointer);
      this.collectBuildingReward(id);
    };
    rewardGoldIcon.on("pointerdown", onCollect);
    rewardExpIcon.on("pointerdown", onCollect);
    activationNeedIcon.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      const current = buildings.get(id);
      if (!current) return;
      if (this.hasBuildingActivation(current.typeKey) && !this.isBuildingActivationUnlocked(current) && current.isBuilt) {
        this.openBuildingActivationModal(current);
        return;
      }
      this.openBuildingInfoModal(id);
    });

    // glow (para dorado)
    let glowGfx = null;
    if (def.glow) {
      glowGfx = this.add.graphics();
      glowGfx.setDepth(10);
      this.uiCam.ignore(glowGfx);
    }

    // tiempos
    const now = Date.now();
    const buildEnd = now + effBuild * 1000;
    const prodCycle = hasProduction ? (effProd * 1000) : 0;
    const startsProductionLocked = this.hasBuildingActivation(typeKey);
    const initialProdStart = startsProductionLocked ? 0 : (effBuild <= 0 ? now : buildEnd);

    buildings.set(id, {
      id,
      typeKey,
      size,
      cells,
      gfx,
      sprite,
      roadSprite: null,
      roadSpriteImg: null,
      roadResolvedPiece: 0,
      roadResolvedRot: 0,
      buildBar,
      prodBar,
      rewardGoldIcon,
      rewardExpIcon,
      activationNeedIcon,
      yapaBonusIcon,
      rewardReady: false,
      yapaBonusReady: false,
      yapaBonusExpiresAt: 0,
      glowGfx,
      isBuilt: effBuild <= 0,
      buildSeconds: effBuild,
      prodSeconds: effProd,
      reward: effReward,
      baseBuildSeconds: effBuild,
      baseProdSeconds: effProd,
      baseReward: { ...effReward },
      baseHasProduction: hasProduction,
      hasProduction,
      producerJob: null,
      producerGroup: this.getProducerGroup(typeKey),
      minimarketUnlocked: (typeKey === "green_2") ? false : true,
      evoLevel: 0,
      evoStage: (rarity >= 5) ? 5 : 0,
      npcSlots: Array.from({ length: this.getNpcSlotCountForBuildingType(typeKey) }, () => null),
      residentNpcSlots: Array.from({ length: this.getResidentNpcCapacityForBuilding(typeKey) }, () => null),
      npcBuff: this.getNpcBuffForBuilding({ typeKey, npcSlots: Array.from({ length: this.getNpcSlotCountForBuildingType(typeKey) }, () => null) }),
      buildEnd,
      prodCycle,
      prodStart: initialProdStart,
      lastRewardAt: 0,
      border: def.border,
      rotationStep: previewRotationStep,
      spriteEdit: this.getDefaultSpriteEditStateForType(typeKey),
      roadForcedPiece: (typeKey === "road_main_2x2") ? forcedRoadPiece : 0,
      inventoryConsumed: (!this.isDecorativeHouse(typeKey)) && !isTempAdminRoadPlacement,
      residentNpcSpawned: false,
      constructAnimActive: false,
      constructAnimUntil: 0
    });

    const b = buildings.get(id);
    if (b) {
      this.ensureNpcSlotsForBuilding(b);
      this.applyEvolution(b, now);
    }
    if (b?.typeKey === "road_main_2x2") {
      this.normalizeRoadBuildingState(b, false);
      this.redrawRoadBuildingVisual(b, 0.85);
      this.refreshRoadVisualsAroundCells(b.cells, 1);
    }
    if (b?.sprite) {
      this.updateBuildingSpriteVisual(b, b.isBuilt ? 1 : 0.3);
      if (b.isBuilt) {
        b.gfx.clear();
        b.gfx.setVisible(false);
        b.sprite.setVisible(true);
      } else {
        b.sprite.setVisible(true);
        b.gfx.setVisible(true);
      }
    }
    if (b?.isBuilt) this.onBuildingConstructed(b, now);
  }

  getBuildingAnchor(b) {
    const topLeft = b.cells.reduce((best, cur) => {
      if (!best) return cur;
      return (cur.r + cur.c) < (best.r + best.c) ? cur : best;
    }, null);

    const p = isoToScreen(topLeft.r, topLeft.c);
    return { x: p.x, y: p.y };
  }

  // ================= Render =================
  drawDiamond(g, x, y, w, h, fillColor, alpha) {
    g.fillStyle(fillColor, alpha);
    g.beginPath();
    g.moveTo(x, y - h / 2);
    g.lineTo(x + w / 2, y);
    g.lineTo(x, y + h / 2);
    g.lineTo(x - w / 2, y);
    g.closePath();
    g.fillPath();
  }

  outlineDiamond(g, x, y, w, h) {
    g.beginPath();
    g.moveTo(x, y - h / 2);
    g.lineTo(x + w / 2, y);
    g.lineTo(x, y + h / 2);
    g.lineTo(x - w / 2, y);
    g.closePath();
    g.strokePath();
  }

  drawRoadCellsCompact(g, cells, color, alpha, borderColor = color) {
    if (!g || !Array.isArray(cells) || !cells.length) return;

    const a = Phaser.Math.Clamp(alpha ?? 1, 0, 1);
    const veredaColor = 0xf8fafc; // vereda blanca
    const pistaColor = 0x6b7280;  // pista gris
    const negro = 0x0b0b0b;       // borde negro

    // Esperado para road_main_2x2: bloque 2x2.
    const r0 = Math.min(...cells.map((c) => c.r));
    const c0 = Math.min(...cells.map((c) => c.c));

    // Fallback por seguridad (si alguna vez no es 2x2).
    if (cells.length !== 4) {
      const sorted = [...cells].sort((aa, bb) => (aa.r + aa.c) - (bb.r + bb.c));
      for (const cell of sorted) {
        const p = isoToScreen(cell.r, cell.c);
        this.drawDiamond(g, p.x, p.y, TILE_W, TILE_H, veredaColor, a);
        g.lineStyle(2, negro, a);
        this.outlineDiamond(g, p.x, p.y, TILE_W, TILE_H);
      }
      return;
    }

    const pTL = isoToScreen(r0, c0);
    const pTR = isoToScreen(r0, c0 + 1);
    const pBL = isoToScreen(r0 + 1, c0);
    const pBR = isoToScreen(r0 + 1, c0 + 1);

    const top = { x: pTL.x, y: pTL.y - (TILE_H / 2) };
    const right = { x: pTR.x + (TILE_W / 2), y: pTR.y };
    const bottom = { x: pBR.x, y: pBR.y + (TILE_H / 2) };
    const left = { x: pBL.x - (TILE_W / 2), y: pBL.y };
    const center = { x: (pTL.x + pTR.x + pBL.x + pBR.x) / 4, y: (pTL.y + pTR.y + pBL.y + pBR.y) / 4 };

    const north = this.isRoadCell(r0 - 1, c0) || this.isRoadCell(r0 - 1, c0 + 1);
    const east = this.isRoadCell(r0, c0 + 2) || this.isRoadCell(r0 + 1, c0 + 2);
    const south = this.isRoadCell(r0 + 2, c0) || this.isRoadCell(r0 + 2, c0 + 1);
    const west = this.isRoadCell(r0, c0 - 1) || this.isRoadCell(r0 + 1, c0 - 1);

    // 1) Base del tramo 2x2 (vereda).
    g.fillStyle(veredaColor, a);
    g.beginPath();
    g.moveTo(top.x, top.y);
    g.lineTo(right.x, right.y);
    g.lineTo(bottom.x, bottom.y);
    g.lineTo(left.x, left.y);
    g.closePath();
    g.fillPath();

    // 2) Bordes negros gruesos solo en lados externos (evita corte feo interno).
    const drawEdge = (a0, b0) => {
      g.beginPath();
      g.moveTo(a0.x, a0.y);
      g.lineTo(b0.x, b0.y);
      g.strokePath();
    };
    g.lineStyle(Math.max(3, Math.round(TILE_H * 0.16)), negro, a);
    if (!north) drawEdge(top, right);
    if (!east) drawEdge(right, bottom);
    if (!south) drawEdge(bottom, left);
    if (!west) drawEdge(left, top);

    // 3) Conectores de pista (I/L/T/X automáticos por vecinos de bloque 2x2).
    const toNorth = { x: (top.x + right.x) / 2, y: (top.y + right.y) / 2 };
    const toEast = { x: (right.x + bottom.x) / 2, y: (right.y + bottom.y) / 2 };
    const toSouth = { x: (bottom.x + left.x) / 2, y: (bottom.y + left.y) / 2 };
    const toWest = { x: (left.x + top.x) / 2, y: (left.y + top.y) / 2 };

    const connections = [];
    if (north) connections.push(toNorth);
    if (east) connections.push(toEast);
    if (south) connections.push(toSouth);
    if (west) connections.push(toWest);

    const drawPoly = (pts, fill) => {
      g.fillStyle(fill, a);
      g.beginPath();
      g.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
      g.closePath();
      g.fillPath();
    };

    const quadFromCenter = (to, halfW, extend = 0) => {
      const vx = to.x - center.x;
      const vy = to.y - center.y;
      const len = Math.hypot(vx, vy) || 1;
      const ux = vx / len;
      const uy = vy / len;
      const nx = -vy / len;
      const ny = vx / len;
      const ex = to.x + (ux * extend);
      const ey = to.y + (uy * extend);
      return [
        { x: center.x + (nx * halfW), y: center.y + (ny * halfW) },
        { x: center.x - (nx * halfW), y: center.y - (ny * halfW) },
        { x: ex - (nx * halfW), y: ey - (ny * halfW) },
        { x: ex + (nx * halfW), y: ey + (ny * halfW) }
      ];
    };

    const seamCoverAt = (to, halfW, halfLen) => {
      const vx = to.x - center.x;
      const vy = to.y - center.y;
      const len = Math.hypot(vx, vy) || 1;
      const ux = vx / len;
      const uy = vy / len;
      const nx = -vy / len;
      const ny = vx / len;
      return [
        { x: to.x + (ux * halfLen) + (nx * halfW), y: to.y + (uy * halfLen) + (ny * halfW) },
        { x: to.x + (ux * halfLen) - (nx * halfW), y: to.y + (uy * halfLen) - (ny * halfW) },
        { x: to.x - (ux * halfLen) - (nx * halfW), y: to.y - (uy * halfLen) - (ny * halfW) },
        { x: to.x - (ux * halfLen) + (nx * halfW), y: to.y - (uy * halfLen) + (ny * halfW) }
      ];
    };

    const outerHalf = Math.max(6, Math.round(TILE_H * 0.35));
    const innerHalf = Math.max(4, outerHalf - Math.max(2, Math.round(TILE_H * 0.11)));
    const overlap = Math.max(1.5, TILE_H * 0.10);
    const seamCoverLen = Math.max(1.2, TILE_H * 0.09);

    // Conectores rectos (sin bordes redondos).
    for (const to of connections) {
      drawPoly(quadFromCenter(to, outerHalf, overlap), negro);
    }
    for (const to of connections) {
      drawPoly(quadFromCenter(to, innerHalf, overlap), pistaColor);
    }
    // Tapa juntas entre bloques 2x2 para eliminar lineas negras visibles.
    for (const to of connections) {
      drawPoly(seamCoverAt(to, innerHalf + 0.2, seamCoverLen), pistaColor);
    }

    // Núcleo central recto (diamante), también sin círculos.
    const cOuter = [
      { x: center.x, y: center.y - (TILE_H * 0.34) },
      { x: center.x + (TILE_W * 0.34), y: center.y },
      { x: center.x, y: center.y + (TILE_H * 0.34) },
      { x: center.x - (TILE_W * 0.34), y: center.y }
    ];
    const cInner = [
      { x: center.x, y: center.y - (TILE_H * 0.23) },
      { x: center.x + (TILE_W * 0.23), y: center.y },
      { x: center.x, y: center.y + (TILE_H * 0.23) },
      { x: center.x - (TILE_W * 0.23), y: center.y }
    ];
    drawPoly(cOuter, negro);
    drawPoly(cInner, pistaColor);
  }

  redrawRoadBuildingVisual(b, alpha = 0.85) {
    if (!b || b.typeKey !== "road_main_2x2" || !b.gfx) return;
    const def = BUILDING_TYPES.road_main_2x2;
    this.normalizeRoadBuildingState(b, false);
    const usedRoadKoto = this.applyRoadKotoSpriteVisual(b, alpha);
    b.gfx.clear();
    if (usedRoadKoto) {
      b.gfx.setVisible(false);
      return;
    }
    this.drawRoadCellsCompact(b.gfx, b.cells, def.fill, alpha, def.border);
    b.gfx.setVisible(true);
    b.roadSprite?.setVisible(false);
  }

  drawCells(g, cells, color, alpha, borderColor = color) {
    g.fillStyle(color, alpha);
    g.lineStyle(1, borderColor, Math.min(1, alpha + 0.35));

    const sorted = [...cells].sort((a, b) => (a.r + a.c) - (b.r + b.c));
    for (const cell of sorted) {
      const p = isoToScreen(cell.r, cell.c);
      this.drawDiamond(g, p.x, p.y, TILE_W, TILE_H, color, alpha);
      this.outlineDiamond(g, p.x, p.y, TILE_W, TILE_H);
    }
  }

  shadeColor(hex, factor = 1) {
    const safe = Number(hex) >>> 0;
    const f = Number.isFinite(factor) ? factor : 1;
    const r = Math.max(0, Math.min(255, Math.round((((safe >> 16) & 0xff) * f))));
    const g = Math.max(0, Math.min(255, Math.round((((safe >> 8) & 0xff) * f))));
    const b = Math.max(0, Math.min(255, Math.round(((safe & 0xff) * f))));
    return (r << 16) | (g << 8) | b;
  }

  drawProducerCubes(g, cells, color, alpha, borderColor = color) {
    if (!g || !Array.isArray(cells) || !cells.length) return;

    const topColor = this.shadeColor(color, 1.12);
    const leftColor = this.shadeColor(color, 0.9);
    const rightColor = this.shadeColor(color, 0.78);
    const outline = this.shadeColor(borderColor, 0.7);
    const sideAlpha = Math.max(0.1, Math.min(1, (alpha ?? 1) * 0.98));
    const topAlpha = Math.max(0.12, Math.min(1, (alpha ?? 1) * 1.04));

    const drawPoly = (pts, fill, a = 1) => {
      g.fillStyle(fill, a);
      g.beginPath();
      g.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) g.lineTo(pts[i].x, pts[i].y);
      g.closePath();
      g.fillPath();
    };

    const sorted = [...cells].sort((a, b) => (a.r + a.c) - (b.r + b.c));
    for (const cell of sorted) {
      const p = isoToScreen(cell.r, cell.c);
      const hw = TILE_W * 0.5;
      const hh = TILE_H * 0.5;
      const h = Math.max(10, Math.round(TILE_H * 1.06));

      const n = { x: p.x, y: p.y - hh };
      const e = { x: p.x + hw, y: p.y };
      const s = { x: p.x, y: p.y + hh };
      const w = { x: p.x - hw, y: p.y };

      const nT = { x: n.x, y: n.y - h };
      const eT = { x: e.x, y: e.y - h };
      const sT = { x: s.x, y: s.y - h };
      const wT = { x: w.x, y: w.y - h };

      // Caras visibles: izquierda + derecha, y tapa superior.
      drawPoly([wT, sT, s, w], leftColor, sideAlpha);
      drawPoly([eT, sT, s, e], rightColor, sideAlpha);
      drawPoly([nT, eT, sT, wT], topColor, topAlpha);

      g.lineStyle(2, outline, Math.min(1, topAlpha + 0.15));
      g.beginPath(); g.moveTo(nT.x, nT.y); g.lineTo(eT.x, eT.y); g.lineTo(sT.x, sT.y); g.lineTo(wT.x, wT.y); g.closePath(); g.strokePath();
      g.beginPath(); g.moveTo(wT.x, wT.y); g.lineTo(w.x, w.y); g.strokePath();
      g.beginPath(); g.moveTo(eT.x, eT.y); g.lineTo(e.x, e.y); g.strokePath();
      g.beginPath(); g.moveTo(sT.x, sT.y); g.lineTo(s.x, s.y); g.strokePath();
    }
  }
  drawGridVisible() {
    const cam = this.worldCam;
    cam.preRender();
    const view = cam.worldView;
    const viewX = view.x;
    const viewY = view.y;
    const viewW = view.width;
    const viewH = view.height;

    const x0 = viewX - TILE_W * 2;
    const x1 = viewX + viewW + TILE_W * 2;
    const y0 = viewY - TILE_H * 2;
    const y1 = viewY + viewH + TILE_H * 2;

    const slope = TILE_H / TILE_W;
    const step = TILE_H / 2;
    const origin = isoToScreen(0, 0);
    const anchorA = (origin.y - (TILE_H / 2)) - (slope * origin.x);
    const anchorB = (origin.y - (TILE_H / 2)) + (slope * origin.x);

    const drawLineFamily = (target, m, anchor, alpha = 1) => {
      target.lineStyle(1, WORLD_BG_GRID_LINE_COLOR, alpha);

      const corners = [
        { x: x0, y: y0 },
        { x: x1, y: y0 },
        { x: x0, y: y1 },
        { x: x1, y: y1 }
      ];

      let bMin = Infinity;
      let bMax = -Infinity;
      for (const p of corners) {
        const b = p.y - (m * p.x);
        bMin = Math.min(bMin, b);
        bMax = Math.max(bMax, b);
      }

      let b = Math.floor((bMin - anchor) / step) * step + anchor;
      for (; b <= bMax; b += step) {
        const pts = [];
        const tryPoint = (x, y) => {
          if (x < x0 || x > x1 || y < y0 || y > y1) return;
          if (pts.some((p) => Math.abs(p.x - x) < 0.5 && Math.abs(p.y - y) < 0.5)) return;
          pts.push({ x, y });
        };

        tryPoint(x0, (m * x0) + b);
        tryPoint(x1, (m * x1) + b);
        if (m !== 0) {
          tryPoint((y0 - b) / m, y0);
          tryPoint((y1 - b) / m, y1);
        }

        if (pts.length < 2) continue;
        pts.sort((p1, p2) => (p1.x - p2.x) || (p1.y - p2.y));
        const pA = pts[0];
        const pB = pts[pts.length - 1];
        target.beginPath();
        target.moveTo(pA.x, pA.y);
        target.lineTo(pB.x, pB.y);
        target.strokePath();
      }
    };

    // Background grid layer (world space, zooms with camera).
    const bg = this.bgGridGfx;
    bg.clear();
    bg.fillStyle(WORLD_BG_GRASS_COLOR, 1);
    bg.fillRect(x0, y0, x1 - x0, y1 - y0);
    drawLineFamily(bg, slope, anchorA, 0.3);
    drawLineFamily(bg, -slope, anchorB, 0.3);

    // Main playable grid (same phase as background, clamped to map).
    const xMin = viewX - TILE_W;
    const xMax = viewX + viewW + TILE_W;
    const yMin = viewY - TILE_H;
    const yMax = viewY + viewH + TILE_H;

    const dMin = xMin / (TILE_W / 2);
    const dMax = xMax / (TILE_W / 2);
    const sMin = yMin / (TILE_H / 2);
    const sMax = yMax / (TILE_H / 2);

    const rowMin = ((sMin - dMax) / 2) + MAP_CENTER_R;
    const rowMax = ((sMax - dMin) / 2) + MAP_CENTER_R;
    const colMin = ((sMin + dMin) / 2) + MAP_CENTER_C;
    const colMax = ((sMax + dMax) / 2) + MAP_CENTER_C;

    const buffer = 2;
    const rStart = Math.max(0, Math.floor(rowMin) - buffer);
    const rEnd = Math.min(MAP_H - 1, Math.ceil(rowMax) + buffer);
    const cStart = Math.max(0, Math.floor(colMin) - buffer);
    const cEnd = Math.min(MAP_W - 1, Math.ceil(colMax) + buffer);

    const g = this.gridGfx;
    g.clear();
    g.lineStyle(1, WORLD_GRID_LINE_COLOR, 0.95);

    for (let r = rStart; r <= rEnd; r++) {
      for (let c = cStart; c <= cEnd; c++) {
        const p = isoToScreen(r, c);
        this.drawDiamond(g, p.x, p.y, TILE_W, TILE_H, WORLD_TILE_GRASS_COLOR, 1);
        this.outlineDiamond(g, p.x, p.y, TILE_W, TILE_H);
      }
    }

    // Playable map border (4 lados visibles).
    const topCenter = isoToScreen(0, 0);
    const rightCenter = isoToScreen(0, MAP_W - 1);
    const bottomCenter = isoToScreen(MAP_H - 1, MAP_W - 1);
    const leftCenter = isoToScreen(MAP_H - 1, 0);

    const vTop = { x: topCenter.x, y: topCenter.y - TILE_H / 2 };
    const vRight = { x: rightCenter.x + TILE_W / 2, y: rightCenter.y };
    const vBottom = { x: bottomCenter.x, y: bottomCenter.y + TILE_H / 2 };
    const vLeft = { x: leftCenter.x - TILE_W / 2, y: leftCenter.y };

    g.lineStyle(3, WORLD_MAP_BORDER_COLOR, 0.95);
    g.beginPath(); g.moveTo(vTop.x, vTop.y); g.lineTo(vRight.x, vRight.y); g.strokePath();
    g.beginPath(); g.moveTo(vRight.x, vRight.y); g.lineTo(vBottom.x, vBottom.y); g.strokePath();
    g.beginPath(); g.moveTo(vBottom.x, vBottom.y); g.lineTo(vLeft.x, vLeft.y); g.strokePath();
    g.beginPath(); g.moveTo(vLeft.x, vLeft.y); g.lineTo(vTop.x, vTop.y); g.strokePath();

    this.drawGridCodeOverlay();
  }
  updateBuildingsTimers() {
    const now = Date.now();
    this.trySpawnYapaBonus(now);

    for (const b of buildings.values()) {
      const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;

      // encontrar un punto "anchor" (top-left)
      const topLeft = b.cells.reduce((best, cur) => {
        if (!best) return cur;
        return (cur.r + cur.c) < (best.r + best.c) ? cur : best;
      }, null);

      const p = isoToScreen(topLeft.r, topLeft.c);

      // posicion barra (un poquito arriba del edificio)
      const barX = p.x;
      const barY = p.y - (TILE_H * 0.9);
      const barWidth = 84;
      const barHalf = barWidth / 2;
      const barHeight = 10;
      const barRadius = 5;
      const barLeft = Math.round(barX - barHalf);
      const barTop = Math.round(barY);

      // ===== Construccion =====
      if (!b.isBuilt) {
        const total = (b.buildSeconds ?? def.buildSeconds) * 1000;
        const remain = Math.max(0, b.buildEnd - now);
        const done = 1 - (remain / total);

        // dibujar barra construccion
        b.buildBar.clear();
        b.prodBar.clear();
        b.rewardGoldIcon?.setVisible(false);
        b.rewardExpIcon?.setVisible(false);
        b.activationNeedIcon?.setVisible(false);
        if (b.yapaBonusReady) this.clearBuildingYapaBonus(b);
        b.yapaBonusIcon?.setVisible(false);
        if (b.sprite) {
          const ghostAlpha = 0.2 + (0.45 * Phaser.Math.Clamp(done, 0, 1));
          this.updateBuildingSpriteVisual(b, ghostAlpha);
          b.sprite.setVisible(true);
          b.gfx.setVisible(true);
        }

        // fondo
        b.buildBar.fillStyle(0x0b1222, 0.8);
        b.buildBar.fillRoundedRect(barLeft, barTop, barWidth, barHeight, barRadius);

        // progreso
        const buildFillW = Math.floor(barWidth * Phaser.Math.Clamp(done, 0, 1));
        if (buildFillW >= 2) {
          b.buildBar.fillStyle(0xfbbf24, 1);
          b.buildBar.fillRect(barLeft, barTop, buildFillW, barHeight);
        }

        // listo
        if (remain <= 0) {
          b.isBuilt = true;
          b.prodStart = (this.hasBuildingActivation(b.typeKey) && !this.isBuildingActivationUnlocked(b)) ? 0 : now;
          b.rewardReady = false;
          b.buildBar.clear();
          // reemplaza ghost por edificio final
          b.gfx.clear();
          if (b.sprite) {
            this.updateBuildingSpriteVisual(b);
            b.sprite.setVisible(true);
            b.gfx.setVisible(false);
          } else {
            if (this.isProducerBuilding(b.typeKey)) this.drawProducerCubes(b.gfx, b.cells, def.fill, 0.95, def.border);
            else this.drawCells(b.gfx, b.cells, def.fill, 0.85, def.border);
            b.gfx.setVisible(true);
          }
          this.onBuildingConstructed(b, now);
        }

        this.updateBuildingInfoModal(b, def, now);
        continue;
      }

      // ===== Produccion =====
      if (this.isProducerBuilding(b.typeKey)) {
        const job = b.producerJob || null;

        b.buildBar.clear();
        b.prodBar.clear();
        b.rewardExpIcon?.setVisible(false);
        b.activationNeedIcon?.setVisible(false);
        if (b.yapaBonusReady) this.clearBuildingYapaBonus(b);
        b.yapaBonusIcon?.setVisible(false);

        if (job && !job.ready && now >= (job.endsAt || 0)) {
          job.ready = true;
        }

        if (job) {
          const totalMs = Math.max(1, Number(job.durationMs) || 1);
          const remainMs = job.ready ? 0 : Math.max(0, (job.endsAt || now) - now);
          const done = job.ready ? 1 : Phaser.Math.Clamp(1 - (remainMs / totalMs), 0, 1);

          b.prodBar.fillStyle(0x0b1222, 0.75);
          b.prodBar.fillRoundedRect(barLeft, barTop, barWidth, barHeight, barRadius);
          const fillW = Math.floor(barWidth * done);
          if (fillW >= 2) {
            b.prodBar.fillStyle(job.ready ? 0xf59e0b : 0xa855f7, 1);
            b.prodBar.fillRect(barLeft, barTop, fillW, barHeight);
          }

          b.rewardReady = !!job.ready;
          if (b.rewardGoldIcon) {
            b.rewardGoldIcon.setVisible(!!job.ready);
            if (job.ready) b.rewardGoldIcon.setPosition(barX, barY - 30);
          }
        } else {
          b.rewardReady = false;
          b.rewardGoldIcon?.setVisible(false);
        }
        continue;
      }

      if (!this.hasBuildingProduction(b, def)) {
        b.rewardReady = false;
        if (this.hasBuildingActivation(b.typeKey) && !this.isBuildingActivationUnlocked(b)) {
          b.prodStart = 0;
        }
        b.prodBar.clear();
        b.rewardGoldIcon?.setVisible(false);
        b.rewardExpIcon?.setVisible(false);
        const showActivationNeed = !!(b.isBuilt && this.hasBuildingActivation(b.typeKey) && !this.isBuildingActivationUnlocked(b));
        if (b.activationNeedIcon) {
          b.activationNeedIcon.setVisible(showActivationNeed);
          if (showActivationNeed) b.activationNeedIcon.setPosition(barX, barY - 30);
        }
        const yapaValidNoProd = !!(b.yapaBonusReady && now < (b.yapaBonusExpiresAt || 0));
        if (b.yapaBonusIcon) {
          b.yapaBonusIcon.setVisible(yapaValidNoProd);
          if (yapaValidNoProd) {
            // Para decorativas/sin produccion, mostrar sobre la barra de referencia.
            b.yapaBonusIcon.setPosition(barX, barY - 28);
          }
        }
        if (b.yapaBonusReady && !yapaValidNoProd) {
          this.clearBuildingYapaBonus(b);
        }
        this.updateBuildingInfoModal(b, def, now);
        continue;
      }

      const cycle = b.prodCycle;
      let p01 = 0;

      if (!b.rewardReady) {
        const elapsed = (now - b.prodStart);
        if (cycle <= 0) {
          p01 = 1;
          b.rewardReady = true;
        } else {
          p01 = Phaser.Math.Clamp(elapsed / cycle, 0, 1);
          if (elapsed >= cycle) {
            b.rewardReady = true;
          }
        }
      } else {
        p01 = 1;
      }

      if (b.sprite) {
        this.updateBuildingSpriteVisual(b, 1);
        b.sprite.setVisible(true);
        b.gfx.setVisible(false);
      }

      // barra produccion
      b.prodBar.clear();
      b.prodBar.fillStyle(0x0b1222, 0.75);
      b.prodBar.fillRoundedRect(barLeft, barTop, barWidth, barHeight, barRadius);

      const prodFillW = Math.floor(barWidth * Phaser.Math.Clamp(p01, 0, 1));
      if (prodFillW >= 2) {
        b.prodBar.fillStyle(0x22c55e, 1);
        b.prodBar.fillRect(barLeft, barTop, prodFillW, barHeight);
      }

      // iconos de recompensa (manual)
      const showReward = !!b.rewardReady;
      b.activationNeedIcon?.setVisible(false);
      if (b.rewardGoldIcon) {
        b.rewardGoldIcon.setVisible(showReward);
        if (showReward) b.rewardGoldIcon.setPosition(barX - 22, barY - 30);
      }
      if (b.rewardExpIcon) {
        b.rewardExpIcon.setVisible(showReward);
        if (showReward) b.rewardExpIcon.setPosition(barX + 22, barY - 30);
      }

      const yapaValid = !!(b.yapaBonusReady && now < (b.yapaBonusExpiresAt || 0));
      if (b.yapaBonusIcon) {
        b.yapaBonusIcon.setVisible(yapaValid);
        if (yapaValid) {
          // mini icono sobre el icono de cobrar
          b.yapaBonusIcon.setPosition(barX - 22, barY - 44);
        }
      }
      if (b.yapaBonusReady && !yapaValid) {
        this.clearBuildingYapaBonus(b);
      }

      // ===== glow para dorado =====
      if (def.glow && b.glowGfx) {
        const pulse = 0.5 + 0.5 * Math.sin(now / 140);
        b.glowGfx.clear();
        b.glowGfx.lineStyle(2, 0xfbbf24, 0.25 + 0.35 * pulse);

        // borde sobre las celdas
        const sorted = [...b.cells].sort((a, b2) => (a.r + a.c) - (b2.r + b2.c));
        for (const cell of sorted) {
          const q = isoToScreen(cell.r, cell.c);
          this.outlineDiamond(b.glowGfx, q.x, q.y, TILE_W, TILE_H);
        }
      }

      this.updateBuildingInfoModal(b, def, now);
    }
  }

  setupCameraBounds() {
    const topCenter = isoToScreen(0, 0);
    const rightCenter = isoToScreen(0, MAP_W - 1);
    const bottomCenter = isoToScreen(MAP_H - 1, MAP_W - 1);
    const leftCenter = isoToScreen(MAP_H - 1, 0);

    const vTop = { x: topCenter.x, y: topCenter.y - TILE_H / 2 };
    const vRight = { x: rightCenter.x + TILE_W / 2, y: rightCenter.y };
    const vBottom = { x: bottomCenter.x, y: bottomCenter.y + TILE_H / 2 };
    const vLeft = { x: leftCenter.x - TILE_W / 2, y: leftCenter.y };
    this.mapDiamond = [vTop, vRight, vBottom, vLeft];
    this.mapDiamondVerts = { top: vTop, right: vRight, bottom: vBottom, left: vLeft };

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of this.mapDiamond) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    const worldW = maxX - minX;
    const worldH = maxY - minY;
    this.worldBounds = { minX, maxX, minY, maxY };

    // Bounds amplios para evitar recorte visual del render al alejar.
    // El limite real de movimiento lo controla clampWorldCamera().
    const camPad = Math.max(worldW, worldH) + 8192;
    this.worldCam.setBounds(minX - camPad, minY - camPad, worldW + (camPad * 2), worldH + (camPad * 2));

    const mid = isoToScreen(Math.floor(MAP_H / 2), Math.floor(MAP_W / 2));
    this.worldCam.centerOn(mid.x, mid.y);
    this.clampWorldCamera();
    this.worldCam.preRender();
  }

  clampWorldCamera(options = null) {
    const cam = this.worldCam;
    const b = this.worldBounds;
    const verts = this.mapDiamondVerts;
    if (!cam || !b) return;

    const smooth = !!(options && options.smooth);
    const strength = Phaser.Math.Clamp(Number(options?.strength ?? 0.35), 0.08, 1);
    const deadzone = Math.max(0, Number(options?.deadzone ?? 0));
    const centerLock = !!(options && options.centerLock);
    const softClamp = (value, minVal, maxVal) => {
      const clamped = Phaser.Math.Clamp(value, minVal, maxVal);
      if (!smooth) return clamped;
      if (Math.abs(clamped - value) <= deadzone) return value;
      return Phaser.Math.Linear(value, clamped, strength);
    };

    const viewW = cam.width / cam.zoom;
    const viewH = cam.height / cam.zoom;
    if (!verts) {
      // Fallback simple por rectangulo si aun no existen vertices.
      const minScrollX = b.minX;
      const maxScrollX = Math.max(minScrollX, b.maxX - viewW);
      const minScrollY = b.minY;
      const maxScrollY = Math.max(minScrollY, b.maxY - viewH);
      cam.scrollX = softClamp(cam.scrollX, minScrollX, maxScrollX);
      cam.scrollY = softClamp(cam.scrollY, minScrollY, maxScrollY);
      return;
    }

    const vTop = verts.top;
    const vRight = verts.right;
    const vBottom = verts.bottom;
    const vLeft = verts.left;

    const lerpXByY = (p0, p1, y) => {
      const dy = p1.y - p0.y;
      if (Math.abs(dy) < 0.0001) return p0.x;
      const t = Phaser.Math.Clamp((y - p0.y) / dy, 0, 1);
      return p0.x + ((p1.x - p0.x) * t);
    };

    const leftEdgeXAtY = (y) => {
      if (y <= vLeft.y) return lerpXByY(vTop, vLeft, y);
      return lerpXByY(vLeft, vBottom, y);
    };

    const rightEdgeXAtY = (y) => {
      if (y <= vRight.y) return lerpXByY(vTop, vRight, y);
      return lerpXByY(vRight, vBottom, y);
    };

    // Clamp por punto central de enfoque para evitar deriva lateral en zoom.
    const focusOffX = viewW * 0.5;
    const focusOffY = viewH * 0.5;
    const padX = Math.max(10 / cam.zoom, TILE_W * 0.16);
    const padY = Math.max(10 / cam.zoom, TILE_H * 0.32);

    let focusY = cam.scrollY + focusOffY;
    const minFocusY = vTop.y + padY;
    const maxFocusY = vBottom.y - padY;
    if (minFocusY <= maxFocusY) {
      focusY = Phaser.Math.Clamp(focusY, minFocusY, maxFocusY);
    } else {
      // Cuando no hay rango valido (zoom muy abierto), mantener el centro actual para evitar jalon vertical.
      focusY = centerLock ? (cam.scrollY + focusOffY) : ((vTop.y + vBottom.y) * 0.5);
    }

    const targetScrollY = focusY - focusOffY;
    cam.scrollY = smooth
      ? Phaser.Math.Linear(cam.scrollY, targetScrollY, strength)
      : targetScrollY;

    const leftX = leftEdgeXAtY(focusY) + padX;
    const rightX = rightEdgeXAtY(focusY) - padX;
    let minScrollX = leftX - focusOffX;
    let maxScrollX = rightX - focusOffX;

    // Evita rango invertido en extremos.
    if (minScrollX > maxScrollX) {
      if (centerLock) {
        minScrollX = cam.scrollX;
        maxScrollX = cam.scrollX;
      } else {
        const centerX = (leftX + rightX) * 0.5;
        minScrollX = centerX - focusOffX;
        maxScrollX = minScrollX;
      }
    }

    cam.scrollX = softClamp(cam.scrollX, minScrollX, maxScrollX);
  }
}

// =========================
// Config 16:9 + responsive
// =========================
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  transparent: true,
  backgroundColor: "rgba(0,0,0,0)",
  parent: "game",
  scene: MainScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const bootGame = () => new Phaser.Game(config);
if (typeof document !== "undefined" && document.fonts?.load) {
  Promise.all([document.fonts.load('16px "Arial"'), document.fonts.load('16px "Melon Pop"')]).then(bootGame).catch(bootGame);
} else {
  bootGame();
}











































































