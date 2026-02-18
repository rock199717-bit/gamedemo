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

// =========================
// DECOR AURA (Casa Decorativa green_1)
// =========================
const DECOR_AURA_MAX_LEVEL = 5;
const DECOR_AURA_MAX_STACKS = 5;
const DECOR_AURA_BUILD_REDUCTION_MAX = 0.03; // -3% construccion al evo max
const DECOR_AURA_PROD_BOOST_MAX = 0.02;      // +2% produccion al evo max
// Base equivalente al tamano que antes tenia aprox en evo 4; luego crece suavemente.
const DECOR_AURA_RADIUS_BASE_TILES = 2.0;
const DECOR_AURA_RADIUS_PER_LEVEL_TILES = 0.12;

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
    label: "Verde 2x2",
    size: 2,
    fill: 0x22c55e,
    border: 0x22c55e,
    buildSeconds: 8,
    prodSeconds: 60,
    reward: { exp: 2, gold: 20 },
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
    label: "Rojo 1x1",
    size: 1,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 5,
    prodSeconds: 60,
    reward: { exp: 1, gold: 10 },
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
    label: "Azul 1x1",
    size: 1,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 5,
    prodSeconds: 60,
    reward: { exp: 1, gold: 10 },
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
const TRAFFIC_MAX_NPCS = 14;
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
const TRAFFIC_NPC_OFFROAD_GRACE_MS = 260;
const TRAFFIC_NPC_SCREEN_LERP = 0.26;
const TRAFFIC_NPC_TURN_PAUSE_MIN_MS = 180;
const TRAFFIC_NPC_TURN_PAUSE_MAX_MS = 320;
const TRAFFIC_NPC_BACK_COLOR = 0xef4444;
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
const ZOOM_STEP = 0.1; // rueda

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
    for (let i = 1; i <= ROADKOTO_PIECES; i++) {
      const id = String(i).padStart(2, "0");
      this.load.image(`roadkoto_${id}`, `img/roadkoto-${id}.jpg`);
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
    this.yapaScanMode = false;
    // [OK] item seleccionado para construir (por defecto el verde 1x1)
    this.selectedBuildKey = "green_1";
    this.buildRotationStep = 0;
    this.buildPreviewTypeKey = this.selectedBuildKey;
    this.nextYapaBonusAt = Date.now() + YAPA_BONUS_INTERVAL_MS;
    this.activeYapaBonusBuildingId = null;
    this.trafficCars = [];
    this.streetNpcs = [];
    this.npcDebugEnabled = false;
    this.gridCodeDebugEnabled = false;
    this.gridCodeTextPool = [];
    this.itemDirDebugEnabled = false;
    this.itemDirDebugTextPool = [];
    this.itemDirDebugLastDrawAt = 0;
    this.roadPieceDebugEnabled = false;
    this.roadPieceDebugTextPool = [];
    this.roadPieceDebugLastDrawAt = 0;
    this.adminForcedRoadPiece = 0;
    this.nextTrafficCarId = 1;
    this.nextStreetNpcId = 1;

    // lista de objetos UI para que el WORLD cam los ignore (asi NO se mueven con zoom)
    this.uiObjects = [];
    const regUI = (obj) => {
      this.uiObjects.push(obj);
      return obj;
    };

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
      if (!this.npcDebugEnabled) this.npcDebugGfx?.clear();
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

    // [OK] Controles de zoom (rueda + pinch)
    this.setupZoomControls();

    // Algunas carreteras base para empezar el mapa.
    this.placeStarterRoads();

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
      const ok = this.canPlaceBuildAt(preview.typeKey, size, tile.r, tile.c);
      const okColor = preview.def.fill ?? 0x22c55e;
      const okBorder = preview.def.border ?? okColor;
      const badColor = 0xf87171;

      const cells = [];
      for (let r = tile.r; r < tile.r + size; r++) {
        for (let c = tile.c; c < tile.c + size; c++) {
          if (inBounds(r, c)) cells.push({ r, c });
        }
      }
      this.drawCells(this.ghost, cells, ok ? okColor : badColor, 0.25, ok ? okBorder : badColor);
      this.drawBuffAreaGhostForPlacement(preview.typeKey, tile.r, tile.c, size, 0);

      if (this.isSpriteBuilding(preview.typeKey) && size === 1) {
        this.placeSpriteAtTile(this.ghostSprite, preview.typeKey, preview.rotationStep || 0, tile.r, tile.c, ok ? 0.55 : 0.42);
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
        const ok = canPlace(this.moveMode.size, tile.r, tile.c);
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
      const ok = this.canPlaceBuildAt(preview.typeKey, size, tile.r, tile.c);

      // Auto-colocar carretera: instantaneo y sin confirmacion.
      if (preview.typeKey === "road_main_2x2") {
        if (ok) this.placeBuilding(tile.r, tile.c);
        return;
      }

      this.pending = {
        tile,
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
  }

  update() {
    const cam = this.worldCam;
    if (this.yapaScanMode && !this.getActiveYapaBonusBuilding(Date.now())) {
      this.stopYapaScanMode();
    }
    if ((document.getElementById("evo-modal") || document.getElementById("building-modal")) && mode === "build") {
      this.setCursorMode();
    }

    // [OK] redraw tambien cuando cambia zoom
    if (cam.scrollX !== this.lastCamX || cam.scrollY !== this.lastCamY || cam.zoom !== this.lastZoom) {
      this.lastCamX = cam.scrollX;
      this.lastCamY = cam.scrollY;
      this.lastZoom = cam.zoom;
      this.drawGridVisible();
    }
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

    // [OK] AQUI:
    this.updateBuildingsTimers();
  }

  // ================= ZOOM =================
  setupZoomControls() {
    // Wheel zoom (PC)
    this.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      if (this.hasBlockingDomOverlay()) return;
      // evita zoom cuando estas sobre UI alta
      if (pointer.y <= 140) return;

      const cam = this.worldCam;

      // zoom estable: usar centro de pantalla como ancla
      const anchorX = cam.width * 0.5;
      const anchorY = cam.height * 0.5;
      const worldPointBefore = cam.getWorldPoint(anchorX, anchorY);

      let z = cam.zoom;
      if (dy > 0) z -= ZOOM_STEP; // scroll down = zoom out
      else z += ZOOM_STEP;        // scroll up = zoom in

      z = Phaser.Math.Clamp(z, ZOOM_MIN, ZOOM_MAX);
      if (z === cam.zoom) return;

      cam.setZoom(z);

      // mantener el centro del viewport en el mismo punto de mundo
      const worldPointAfter = cam.getWorldPoint(anchorX, anchorY);
      cam.scrollX += (worldPointBefore.x - worldPointAfter.x);
      cam.scrollY += (worldPointBefore.y - worldPointAfter.y);
      this.clampWorldCamera();

      // forzar refresh grid
      this.lastCamX = cam.scrollX;
      this.lastCamY = cam.scrollY;
      this.lastZoom = cam.zoom;
      this.drawGridVisible();
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

      const cam = this.worldCam;

      const worldBefore = cam.getWorldPoint(this.pinch.midX, this.pinch.midY);

      let z = this.pinch.startZoom * (dist / this.pinch.startDist);
      z = Phaser.Math.Clamp(z, ZOOM_MIN, ZOOM_MAX);

      cam.setZoom(z);

      const worldAfter = cam.getWorldPoint(this.pinch.midX, this.pinch.midY);
      cam.scrollX += (worldBefore.x - worldAfter.x);
      cam.scrollY += (worldBefore.y - worldAfter.y);
      this.clampWorldCamera();

      // refresh
      this.lastCamX = cam.scrollX;
      this.lastCamY = cam.scrollY;
      this.lastZoom = cam.zoom;
      this.drawGridVisible();
    });

    this.input.on("pointerup", () => {
      const p1 = this.input.pointer1;
      const p2 = this.input.pointer2;
      if (!(p1.isDown && p2.isDown)) {
        this.pinch.active = false;
      }
    });
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
      document.getElementById("yapa-qr-modal")
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
    const h = this.scale?.height || this.game?.config?.height || 1080;
    const baseY = Math.max(150, h - 76);
    if (this.helpText?.setPosition) this.helpText.setPosition(16, baseY);
    if (this.modeText?.setPosition) this.modeText.setPosition(16, baseY + 28);
    const rowY = baseY + 56;
    let nextX = 16;
    if (this.npcDebugBtn?.setPosition) {
      this.npcDebugBtn.setPosition(nextX, rowY);
      nextX += (this.npcDebugBtn.width || 110) + 10;
    }
    if (this.gridCodeBtn?.setPosition) {
      this.gridCodeBtn.setPosition(nextX, rowY);
      nextX += (this.gridCodeBtn.width || 130) + 10;
    }
    if (this.itemDirDebugBtn?.setPosition) {
      this.itemDirDebugBtn.setPosition(nextX, rowY);
      nextX += (this.itemDirDebugBtn.width || 130) + 10;
    }
    if (this.roadPieceDebugBtn?.setPosition) {
      this.roadPieceDebugBtn.setPosition(16, rowY + 32);
    }
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

  requiresAdjacentRoadForPlacement(typeKey) {
    // Casas que spawnean NPC: requieren pista adyacente para poder construirse.
    return typeKey === "green_1";
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

  canPlaceBuildAt(typeKey, size, r0, c0) {
    if (!canPlace(size, r0, c0)) return false;
    if (!this.requiresAdjacentRoadForPlacement(typeKey)) return true;
    return this.hasAdjacentRoadAroundArea(r0, c0, size);
  }

  getHouseSpawnFacing(typeKey, rotationStep = 0) {
    const step = (((rotationStep || 0) % 4) + 4) % 4;
    if (typeKey === "green_1") {
      // Mapeo pedido por diseño:
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
    return `roadkoto_${String(n).padStart(2, "0")}`;
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
    const m = /^roadkoto_(\d{2})$/.exec(String(texKey || ""));
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

  getRoadSpecialPieceByNeighborRoads(mask, r0, c0) {
    const m = (mask & 15);

    const centerRoad = this.getBuildingAtCell(r0, c0);
    if (!centerRoad || centerRoad.typeKey !== "road_main_2x2") return 0;

    const centerPiece = this.getRoadCurrentPieceNumber(centerRoad);
    const n = this.getRoadNeighborPieceBySide(r0, c0, "N");
    const e = this.getRoadNeighborPieceBySide(r0, c0, "E");
    const s = this.getRoadNeighborPieceBySide(r0, c0, "S");
    const w = this.getRoadNeighborPieceBySide(r0, c0, "W");
    const diagMask = this.getRoadDiagonalMaskForBlock(r0, c0);

    const hasN = n > 0;
    const hasE = e > 0;
    const hasS = s > 0;
    const hasW = w > 0;
    const hasNW = (diagMask & 1) !== 0;
    const hasNE = (diagMask & 2) !== 0;
    const hasSE = (diagMask & 4) !== 0;
    const hasSW = (diagMask & 8) !== 0;

    // Regla exacta solicitada: ROAD 19 con O=1 y N=2 + nueva pieza en NO.
    // Resultado forzado: ROAD 1 -> 45, ROAD 2 -> 40, ROAD 19 -> 36.
    if ((centerPiece === 19 || centerPiece === 36) && hasNW && (w === 1 || w === 45) && (n === 2 || n === 40)) return 36;
    if ((centerPiece === 1 || centerPiece === 45) && hasN && (e === 19 || e === 36)) return 45;
    if ((centerPiece === 2 || centerPiece === 40) && hasW && (s === 19 || s === 36)) return 40;

    // Variantes diagonales (NO/NE/SE/SO) para ROAD 1, ROAD 2 y esquinas 17/18/19/20.
    if (centerPiece === 1 || centerPiece === 42 || centerPiece === 43 || centerPiece === 44 || centerPiece === 45) {
      if (hasN && hasE && !hasS && !hasW) return 45; // N+E
      if (hasN && hasW && !hasS && !hasE) return 42; // N+O
      if (hasS && hasE && !hasN && !hasW) return 43; // S+E
      if (hasS && hasW && !hasN && !hasE) return 44; // S+O
    }
    if (centerPiece === 2 || centerPiece === 38 || centerPiece === 39 || centerPiece === 40 || centerPiece === 41) {
      if (hasS && hasW && !hasN && !hasE) return 40; // S+O
      if (hasS && hasE && !hasN && !hasW) return 41; // S+E
      if (hasN && hasW && !hasS && !hasE) return 38; // N+O
      if (hasN && hasE && !hasS && !hasW) return 39; // N+E
    }
    if ((centerPiece === 19 || centerPiece === 36) && hasW && hasN && hasNW) return 36; // esquina NO
    if ((centerPiece === 20 || centerPiece === 37) && hasN && hasE && hasNE) return 37; // esquina NE
    if ((centerPiece === 17 || centerPiece === 34) && hasE && hasS && hasSE) return 34; // esquina SE
    if ((centerPiece === 18 || centerPiece === 35) && hasS && hasW && hasSW) return 35; // esquina SO


    // Transiciones directas solicitadas por diseno (basadas en pieza actual).
    if (centerPiece === 5) {
      if (hasN && hasS) return 10;  // ROAD 5 + N + S
      if (hasN && !hasS) return 20; // ROAD 5 + N
      if (hasS && !hasN) return 17; // ROAD 5 + S
    }
    if (centerPiece === 20 && hasS) return 10; // ROAD 20 + S
    if (centerPiece === 17 && hasN) return 10; // ROAD 17 + N


    if (centerPiece === 3) {
      if (hasN && hasS) return 8;  // ROAD 3 + N + S
      if (hasS) return 18;         // ROAD 3 + S
      if (hasN) return 19;         // ROAD 3 + N
    }

    if (centerPiece === 19 && hasS) return 18; // ROAD 19 + S
    if (centerPiece === 19 && hasE && hasN && !hasS) return 20; // ROAD 19 puente -> 20

    if (centerPiece === 18) {
      if (hasE) return 11;         // ROAD 18 + E
      if (hasN) return 8;          // ROAD 18 + N
    }

    if (centerPiece === 8 && hasE) return 11;  // ROAD 8 + E
    if (centerPiece === 10 && hasW) return 11; // ROAD 10 + O

    // Evitar que una segunda pasada pise ROAD 11 con variantes de cruce.
    if (centerPiece === 11 && m === 15) return 11;

    if (m !== 15) return 0;

    const ruleA = (w === 1 && e === 1 && n === 2 && s === 2);
    const ruleB = (w === 5 && e === 3 && (n === 4 || n === 2 || n === 6) && (s === 6 || s === 5 || s === 2 || s === 4));
    if (ruleA || ruleB) return 11;

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
    const pick = (arr) => {
      if (!Array.isArray(arr) || !arr.length) return 12;
      const h = this.hashRoadVariant(r0, c0, mask, diagMask);
      return arr[h % arr.length];
    };

    const specialPiece = this.getRoadSpecialPieceByNeighborRoads(mask, r0, c0);
    if (specialPiece > 0) return { piece: specialPiece, rot: 0 };

    // N=1, E=2, S=4, W=8
    // Devuelve pieza base + rotacion top-down (antes de proyeccion iso).
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
      case 15: return { piece: pick([12, 13, 14, 15, 16, 26, 27, 28, 29, 30, 31, 32, 25]), rot: 0 };
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
      npc.sprite.setFillStyle(
        isBackFacing ? TRAFFIC_NPC_BACK_COLOR : (npc.baseColor || 0xf8fafc),
        1
      );
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

    let chosenPath = null;
    for (let i = 0; i < 12; i++) {
      const target = this.pickRandomRoadCell(from, 4);
      if (!target) break;
      const maybe = this.findRoadPath(from, target, 2500);
      if (maybe && maybe.length >= 2) {
        chosenPath = maybe;
        break;
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

  spawnStreetNpcFromCar(car) {
    if (!car?.targetRoad) return;
    if (this.streetNpcs.length >= TRAFFIC_MAX_NPCS) return;

    const baseColor = Phaser.Utils.Array.GetRandom(TRAFFIC_NPC_BASE_COLORS) || 0xf8fafc;
    const sprite = this.add.circle(0, 0, 5, baseColor, 1)
      .setStrokeStyle(2, 0x0f172a, 0.95)
      .setAlpha(0)
      .setDepth(69);
    this.uiCam.ignore(sprite);

    const npc = {
      id: this.nextStreetNpcId++,
      sprite,
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
      nextPathAt: Date.now() + Phaser.Math.Between(200, 800),
      homeBuildingId: car.targetHouseId,
      sideSwitchStartAt: 0,
      lastMoveAt: Date.now(),
      lastMoveR: car.targetRoad.r,
      lastMoveC: car.targetRoad.c,
      offRoadSince: 0,
      turnPauseUntil: 0,
      turnPauseR: car.targetRoad.r,
      turnPauseC: car.targetRoad.c
    };
    npc.sideTarget = npc.side;
    npc.sideVisual = npc.side;

    this.setStreetNpcScreenPosition(npc, npc.r, npc.c);
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
    const centerR = Math.round(center.r);
    const centerC = Math.round(center.c);
    const priorityDirs = this.getHouseSpawnDirectionPriority(b.typeKey, b.rotationStep || 0);

    // 1) prioridad absoluta: lado segun rotacion del PNG
    for (const d of priorityDirs) {
      const rr = centerR + d.dr;
      const cc = centerC + d.dc;
      if (inBounds(rr, cc) && this.isRoadCell(rr, cc)) return { r: rr, c: cc };
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
    if (!b || b.typeKey !== "green_1" || !b.isBuilt) return false;
    if (this.streetNpcs.length >= TRAFFIC_MAX_NPCS) return false;
    if (b.residentNpcSpawned) return false;

    const targetRoad = this.getRoadSpawnCellNearBuilding(b);
    if (!targetRoad) return false;

    const baseColor = Phaser.Utils.Array.GetRandom(TRAFFIC_NPC_BASE_COLORS) || 0xf8fafc;
    const sprite = this.add.circle(0, 0, 5, baseColor, 1)
      .setStrokeStyle(2, 0x0f172a, 0.95)
      .setAlpha(0)
      .setDepth(69);
    this.uiCam.ignore(sprite);

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

    const npc = {
      id: this.nextStreetNpcId++,
      sprite,
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
      nextPathAt: now + introDuration + Phaser.Math.Between(320, 900),
      homeBuildingId: b.id,
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
      screenY: introY
    };
    npc.sideTarget = npc.side;
    npc.sideVisual = npc.side;

    const facingScreenDy = (npc.dirVisualR + npc.dirVisualC) * (TILE_H * 0.5);
    npc.isBackFacing = facingScreenDy < -0.01;
    sprite.setFillStyle(npc.isBackFacing ? TRAFFIC_NPC_BACK_COLOR : baseColor, 1);
    sprite.setPosition(introX, introY);
    sprite.setDepth(30.18 + (introY * 0.01));

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

      if (!Number.isFinite(npc.lastMoveAt)) npc.lastMoveAt = now;
      if (!Number.isFinite(npc.lastMoveR)) npc.lastMoveR = npc.r;
      if (!Number.isFinite(npc.lastMoveC)) npc.lastMoveC = npc.c;
      if (!Number.isFinite(npc.sideSwitchStartAt)) npc.sideSwitchStartAt = 0;
      if (!Number.isFinite(npc.turnPauseUntil)) npc.turnPauseUntil = 0;

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
          npc.sprite.destroy();
          this.streetNpcs.splice(i, 1);
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
      npc.progress += (npc.speed * deltaMs) / 1000;
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
        this.assignStreetNpcRoute(npc, now);
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
    this.updateStreetNpcs(now, deltaMs);
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
  }

  setAdminRoadPiecePlacement(piece = 0) {
    const clamped = Phaser.Math.Clamp(Math.round(Number(piece) || 0), 0, ROADKOTO_PIECES);
    this.adminForcedRoadPiece = clamped;
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

  drawNpcDebugOverlay() {
    const g = this.npcDebugGfx;
    if (!g) return;
    g.clear();
    if (!this.npcDebugEnabled) return;

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

  trySpawnDeliveryCarToDecorHouse(b, now = Date.now()) {
    if (!TRAFFIC_ENABLE_CARS) return;
    if (!b || b.typeKey !== "green_1" || !b.isBuilt) return;
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
        if (b.typeKey === "green_1") {
          this.spawnStreetNpcFromHouse(b, Date.now());
        }
        this.updateBuildingInfoModal(b, BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1, Date.now());
      }
    });
  }

  onBuildingConstructed(b, now = Date.now()) {
    if (!b) return;
    const waitForDropAnim = (b.typeKey === "green_1") && ((b.buildSeconds ?? 0) > 0);
    this.playBuildingConstructDropAnimation(b, now);
    if (b.typeKey === "green_1" && !waitForDropAnim) {
      this.spawnStreetNpcFromHouse(b, now);
    }
  }

  isSpriteBuilding(typeKey) {
    return typeKey === "green_1";
  }

  getSpriteTextureForBuilding(typeKey, rotationStep = 0) {
    if (!this.isSpriteBuilding(typeKey)) return null;
    const step = ((rotationStep % 4) + 4) % 4;
    if (step === 0) return "green_house_1x1_normal";
    return `green_house_1x1_giro${step}`;
  }

  getSpriteImagePathForBuilding(typeKey, rotationStep = 0) {
    if (!this.isSpriteBuilding(typeKey)) return null;
    const step = ((rotationStep % 4) + 4) % 4;
    if (step === 0) return "img/green_casa1x1_normal.png";
    return `img/green_casa1x1_giro${step}.png`;
  }

  getSpriteDrawSize(textureKey) {
    const maxW = TILE_W * 1.03;
    const maxH = TILE_H * 1.60;
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
    const size = this.getSpriteDrawSize(textureKey);
    const anchor = isoToScreen(r, c);
    sprite.setDisplaySize(size.w, size.h);
    const px = Math.round(anchor.x);
    const py = Math.round(anchor.y + (TILE_H * 0.31));
    sprite.setPosition(px, py);
    sprite.setAlpha(alpha);
    sprite.setDepth(30 + (anchor.y * 0.01));
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
  }

  setBuildMode() {
    if (this.yapaScanMode) this.stopYapaScanMode();
    if (document.getElementById("evo-modal") || document.getElementById("building-modal")) {
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
        this.pending.tile.c
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
    const ok = this.canPlaceBuildAt(refreshed.typeKey, size, tile.r, tile.c);
    const okColor = refreshed.def.fill ?? 0x22c55e;
    const okBorder = refreshed.def.border ?? okColor;
    const badColor = 0xf87171;

    const cells = [];
    for (let r = tile.r; r < tile.r + size; r++) {
      for (let c = tile.c; c < tile.c + size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }

    this.ghost.clear();
    this.drawCells(this.ghost, cells, ok ? okColor : badColor, 0.25, ok ? okBorder : badColor);
    this.drawBuffAreaGhostForPlacement(refreshed.typeKey, tile.r, tile.c, size, 0);

    if (this.isSpriteBuilding(refreshed.typeKey) && size === 1) {
      this.placeSpriteAtTile(this.ghostSprite, refreshed.typeKey, refreshed.rotationStep || 0, tile.r, tile.c, ok ? 0.55 : 0.42);
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
    this.drawCells(this.ghost, cells, ok ? okColor : badColor, 0.35, ok ? okBorder : badColor);
    this.drawBuffAreaGhostForPlacement(preview.typeKey, tile.r, tile.c, size, 0);
    if (this.isSpriteBuilding(preview.typeKey) && size === 1) {
      this.placeSpriteAtTile(this.ghostSprite, preview.typeKey, preview.rotationStep || 0, tile.r, tile.c, ok ? 0.55 : 0.42);
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

    this.openBuildingInfoModal(idOnTile);
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
  }

  getRarityForKey(typeKey) {
    if (typeKey === "green_1") return 1;
    if (typeKey === "road_main_2x2") return 1;
    if (typeKey === "green_2") return 2;
    if (typeKey === "green_3") return 3;
    if (typeKey === "green_4") return 4;
    if (typeKey === "red_1") return 1;
    if (typeKey === "red_2") return 2;
    if (typeKey === "red_3") return 3;
    if (typeKey === "red_4") return 4;
    if (typeKey === "blue_1") return 1;
    if (typeKey === "blue_2") return 2;
    if (typeKey === "blue_3") return 3;
    if (typeKey === "blue_4") return 4;
    if (typeKey === "perm_green_9" || typeKey === "perm_blue_9" || typeKey === "perm_red_9" || typeKey === "lim_gold_2") return 5;
    if (typeof typeKey === "string" && (typeKey.startsWith("perm_") || typeKey.startsWith("lim_"))) return 4;
    return 2;
  }

  getColorForKey(typeKey) {
    if (!typeKey) return null;
    if (typeKey.startsWith("green_") || typeKey === "perm_green_9") return "green";
    if (typeKey.startsWith("red_") || typeKey === "perm_red_9") return "red";
    if (typeKey.startsWith("blue_") || typeKey === "perm_blue_9") return "blue";
    if (typeKey === "lim_gold_2") return "gold";
    if (typeKey === "road_main_2x2") return "road";
    return null;
  }

  isDecorativeHouse(typeKey) {
    return typeKey === "green_1";
  }

  isRotationDisabledBuilding(typeKey) {
    return typeKey === "road_main_2x2";
  }

  canRotateBuilding(typeKey) {
    return !this.isRotationDisabledBuilding(typeKey);
  }

  isEvolutionDisabledBuilding(typeKey) {
    return typeKey === "road_main_2x2";
  }

  getDecorAuraFromLevel(level) {
    const clamped = Math.max(0, Math.min(DECOR_AURA_MAX_LEVEL, level || 0));
    const t = clamped / DECOR_AURA_MAX_LEVEL;
    return {
      level: clamped,
      radiusTiles: DECOR_AURA_RADIUS_BASE_TILES + (DECOR_AURA_RADIUS_PER_LEVEL_TILES * clamped),
      buildReduction: DECOR_AURA_BUILD_REDUCTION_MAX * t,
      prodBoost: DECOR_AURA_PROD_BOOST_MAX * t
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

  isAuraSourceBuilding(b) {
    if (!b || !b.isBuilt) return false;
    if (!this.isDecorativeHouse(b.typeKey)) return false;
    return true;
  }

  hasBuildingProduction(b, def = null) {
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
    if (!targetB) {
      return { buildMult: 1, prodMult: 1, stacks: 0, buildReductionPct: 0, prodBoostPct: 0 };
    }
    const targetCenter = this.getBuildingGridCenter(targetB);
    if (!targetCenter) {
      return { buildMult: 1, prodMult: 1, stacks: 0, buildReductionPct: 0, prodBoostPct: 0 };
    }

    const inRangeSources = [];
    for (const source of buildings.values()) {
      if (!this.isAuraSourceBuilding(source)) continue;
      if (source.id === targetB.id) continue;

      const sourceCenter = this.getBuildingGridCenter(source);
      if (!sourceCenter) continue;

      const aura = this.getDecorAuraFromLevel(source.evoLevel || 0);
      if (aura.buildReduction <= 0 && aura.prodBoost <= 0) continue;

      const dist = Math.hypot(sourceCenter.r - targetCenter.r, sourceCenter.c - targetCenter.c);
      if (dist > aura.radiusTiles) continue;

      inRangeSources.push({
        dist,
        power: aura.buildReduction + aura.prodBoost,
        buildReduction: aura.buildReduction,
        prodBoost: aura.prodBoost
      });
    }

    inRangeSources.sort((a, b) => (b.power - a.power) || (a.dist - b.dist));
    const used = inRangeSources.slice(0, DECOR_AURA_MAX_STACKS);

    let totalBuildReduction = 0;
    let totalProdBoost = 0;
    for (const src of used) {
      totalBuildReduction += src.buildReduction;
      totalProdBoost += src.prodBoost;
    }

    return {
      buildMult: Math.max(0.75, 1 - totalBuildReduction),
      prodMult: Math.max(0.8, 1 - totalProdBoost),
      stacks: used.length,
      buildReductionPct: Math.round(totalBuildReduction * 100),
      prodBoostPct: Math.round(totalProdBoost * 100)
    };
  }

  recalculateAllBuildingStats(now = Date.now()) {
    for (const b of buildings.values()) {
      this.applyEvolution(b, now);
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
        bonusLabel: `Aura r${aura.radiusTiles.toFixed(1)} | Constr -${buildPct}% | Prod +${prodPct}%`
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

    const prevBuild = b.buildSeconds ?? b.baseBuildSeconds ?? 0;
    const prevProd = b.prodSeconds ?? b.baseProdSeconds ?? 1;

    const baseBuild = b.baseBuildSeconds ?? prevBuild;
    const baseProd = b.baseProdSeconds ?? prevProd;
    const baseReward = b.baseReward || b.reward || { exp: 0, gold: 0 };
    const hasProduction = this.hasBuildingProduction(b, {
      prodSeconds: baseProd,
      reward: baseReward
    });

    b.buildSeconds = Math.max(0, Math.round(baseBuild * evoStats.buildMult * auraStats.buildMult));
    if (hasProduction) {
      b.prodSeconds = Math.max(1, Math.round(baseProd * evoStats.prodMult * auraStats.prodMult));
      b.reward = {
        exp: Math.max(0, Math.round(baseReward.exp * evoStats.rewardMult)),
        gold: Math.max(0, Math.round(baseReward.gold * evoStats.rewardMult))
      };
    } else {
      b.prodSeconds = 0;
      b.reward = { exp: 0, gold: 0 };
      b.rewardReady = false;
    }
    b.hasProduction = hasProduction;
    b.areaBuff = auraStats;

    b.prodCycle = hasProduction ? (b.prodSeconds * 1000) : 0;

    if (!b.isBuilt) {
      const prevTotal = Math.max(1, prevBuild * 1000);
      const remain = Math.max(0, b.buildEnd - now);
      const ratio = remain / prevTotal;
      b.buildEnd = now + Math.round((b.buildSeconds * 1000) * ratio);
    } else if (hasProduction && !b.rewardReady) {
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
    const maxColorFrameClass = (displayRarity >= 1 && displayRarity <= 4 && evoLevel >= 5)
      ? ` maxed-${displayRarity}`
      : "";
    const frameClass = displayRarity === 6
      ? `frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `frame-${displayRarity}${evoActive ? " evo-on" : ""}${maxColorFrameClass}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5)
      ? " chrome"
      : ((displayRarity >= 1 && displayRarity <= 4 && evoLevel >= 5) ? ` chrome-${displayRarity}` : "");
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
          #evo-modal .preview-inner.chrome-4::after {
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
      const maxColorFrame = (display >= 1 && display <= 4 && level >= 5)
        ? ` maxed-${display}`
        : "";
      const frameCls = display === 6
        ? `frame-6${(stage >= 6 && level >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
        : `frame-${display}${evoActive ? " evo-on" : ""}${maxColorFrame}`;
      if (evoFrame) evoFrame.className = frameCls;
      const innerChrome = (display === 6 && stage >= 6 && level >= 5)
        ? " chrome"
        : ((display >= 1 && display <= 4 && level >= 5) ? ` chrome-${display}` : "");
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
    const maxColorFrameClass = (displayRarity >= 1 && displayRarity <= 4 && evoLevel >= 5)
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
      : ((displayRarity >= 1 && displayRarity <= 4 && evoLevel >= 5) ? ` chrome-${displayRarity}` : "");
    const baseLabel = def.label || def.key;
    const hasProduction = this.hasBuildingProduction(b, def);
    const displayLabel = (b.typeKey === "green_1")
      ? "Casa Decorativa"
      : baseLabel;
    const buildLabel = this.formatSeconds(b.buildSeconds ?? def.buildSeconds);
    const prodLabel = hasProduction
      ? this.formatSeconds(b.prodSeconds ?? def.prodSeconds)
      : "Sin produccion";
    const rewardGold = b.reward?.gold ?? def.reward?.gold ?? 0;
    const rewardExp = b.reward?.exp ?? def.reward?.exp ?? 0;
    const rewardLine = hasProduction
      ? `<div>Recompensa: <b>+${rewardGold} Oro</b>  |  <b>+${rewardExp} EXP</b></div>`
      : `<div>Recompensa: <b>No produce recursos</b></div>`;
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
      pointerEvents: "auto"
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
        #building-modal .preview-inner.chrome-4::after {
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
        #building-modal .frame-1 { background: #6b7280; }
        #building-modal .frame-2 { background: linear-gradient(135deg,#22c55e 0%, #16a34a 45%, #86efac 62%, #065f46 100%); }
        #building-modal .frame-3 { background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 62%, #94a3b8 100%); }
        #building-modal .frame-4 { background: linear-gradient(135deg,#c4b5fd 0%, #8b5cf6 45%, #a78bfa 62%, #5b21b6 100%); }
        #building-modal .frame-5 { background: #b45309; }
        #building-modal .frame-1.maxed-1 { box-shadow: 0 0 14px rgba(226,232,240,.5); }
        #building-modal .frame-2.maxed-2 { box-shadow: 0 0 16px rgba(34,197,94,.62), 0 0 30px rgba(16,185,129,.32); }
        #building-modal .frame-3.maxed-3 { box-shadow: 0 0 16px rgba(226,232,240,.6), 0 0 30px rgba(148,163,184,.38); }
        #building-modal .frame-4.maxed-4 { box-shadow: 0 0 16px rgba(168,85,247,.62), 0 0 30px rgba(139,92,246,.38); }
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

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
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
      this.cancelSelectBtn?.setVisible(false);
      this.cancelSelectBorder?.setVisible(false);
      this.setCursorMode();
    };

    const closeBtn = modal.querySelector("#buildingClose");
    if (closeBtn) closeBtn.onclick = close;

    const collectBtn = modal.querySelector("#bldCollect");
    if (collectBtn) collectBtn.onclick = () => {
      this.collectBuildingReward(id);
      this.updateBuildingInfoModal(b, def, Date.now());
    };

    const moveBtn = modal.querySelector("#bldMove");
    if (moveBtn) moveBtn.onclick = () => {
      this.closeBuildingInfoModal();
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

    const baseRarity = this.getRarityForKey(def.key || b.typeKey);
    const evoLevel = Math.max(0, Math.min(5, b.evoLevel || 0));
    const evoStage = (typeof b.evoStage === "number")
      ? b.evoStage
      : (baseRarity === 5 ? 5 : 0);
    const displayRarity = (baseRarity === 5 && evoStage >= 6) ? 6 : baseRarity;
    const evoActive = (evoLevel > 0) || (evoStage >= 6);
    const maxLabel = `Max ${displayRarity}\u2605`;
    const maxColorFrameClass = (displayRarity >= 1 && displayRarity <= 4 && evoLevel >= 5)
      ? ` maxed-${displayRarity}`
      : "";
    const frameClass = displayRarity === 6
      ? `preview-frame frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `preview-frame frame-${displayRarity}${evoActive ? " evo-on" : ""}${maxColorFrameClass}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5)
      ? "preview-inner chrome"
      : ((displayRarity >= 1 && displayRarity <= 4 && evoLevel >= 5) ? `preview-inner chrome-${displayRarity}` : "preview-inner");
    const starClass = (displayRarity === 6) ? "stars-6" : (displayRarity === 5 ? "stars-5" : "stars-base");

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
      // Las carreteras no se giran: se conectan/compactan automaticamente por adyacencia.
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
    this.drawCells(b.gfx, b.cells, def.fill, 0.85, b.border);
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

    const ok = canPlace(this.moveMode.size, tile.r, tile.c);
    const color = ok ? 0xf59e0b : 0xf87171;

    const cells = [];
    for (let r = tile.r; r < tile.r + this.moveMode.size; r++) {
      for (let c = tile.c; c < tile.c + this.moveMode.size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }
    this.drawCells(this.moveGhost, cells, color, 0.35, color);
    this.drawBuffAreaGhostForPlacement(
      this.moveMode.typeKey,
      tile.r,
      tile.c,
      this.moveMode.size,
      this.moveMode.evoLevel || 0
    );
    if (this.isSpriteBuilding(this.moveMode.typeKey) && this.moveMode.size === 1) {
      this.placeSpriteAtTile(this.moveGhostSprite, this.moveMode.typeKey, this.moveMode.rotationStep || 0, tile.r, tile.c, ok ? 0.56 : 0.42);
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
      this.drawCells(b.gfx, b.cells, def.fill, 0.85, b.border);
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
        this.drawCells(b.gfx, b.cells, def.fill, 0.85, border);
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
    if (this.economy && b.typeKey && b.typeKey !== "green_1" && b.inventoryConsumed !== false) {
      this.economy.addItem?.(b.typeKey, 1);
    }

    b.gfx.destroy();
    b.sprite?.destroy();
    b.roadSprite?.destroy();
    b.buildBar?.destroy();
    b.prodBar?.destroy();
    b.glowGfx?.destroy();
    b.rewardGoldIcon?.destroy();
    b.rewardExpIcon?.destroy();
    b.yapaBonusIcon?.destroy();
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
    this.economy?.updateYapaRailTimer?.();
  }

  placeBuilding(r0, c0) {
    // construir usando el item seleccionado
    const typeKey = this.selectedBuildKey || "green_1";
    const def = BUILDING_TYPES[typeKey] || BUILDING_TYPES.green_1;

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

    // validar espacio
    if (!this.canPlaceBuildAt(typeKey, size, r0, c0)) return;

    const forcedRoadPiece = (typeKey === "road_main_2x2") ? this.getAdminForcedRoadPiece() : 0;
    const isTempAdminRoadPlacement = (typeKey === "road_main_2x2" && forcedRoadPiece > 0);

    // [OK] si no es el verde basico, debe existir en inventario y se consume
    // excepto en el modo temporal de piezas de carretera del admin.
    if (this.economy && typeKey !== "green_1" && !isTempAdminRoadPlacement) {
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
    this.drawCells(gfx, cells, def.fill, ghostAlpha, ghostBorder);

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

    this.uiCam.ignore([rewardGoldIcon, rewardExpIcon, yapaBonusIcon]);

    const onCollect = (pointer) => {
      this.uiGuard(pointer);
      this.collectBuildingReward(id);
    };
    rewardGoldIcon.on("pointerdown", onCollect);
    rewardExpIcon.on("pointerdown", onCollect);

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
      evoLevel: 0,
      evoStage: (rarity >= 5) ? 5 : 0,
      buildEnd,
      prodCycle,
      prodStart: effBuild <= 0 ? now : buildEnd, // empieza cuando termina de construir
      lastRewardAt: 0,
      border: def.border,
      rotationStep: previewRotationStep,
      roadForcedPiece: (typeKey === "road_main_2x2") ? forcedRoadPiece : 0,
      inventoryConsumed: (typeKey !== "green_1") && !isTempAdminRoadPlacement,
      residentNpcSpawned: false,
      constructAnimActive: false,
      constructAnimUntil: 0
    });

    const b = buildings.get(id);
    if (b) this.applyEvolution(b, now);
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
          b.prodStart = now; // empieza produccion
          b.rewardReady = false;
          b.buildBar.clear();
          // reemplaza ghost por edificio final
          b.gfx.clear();
          if (b.sprite) {
            this.updateBuildingSpriteVisual(b);
            b.sprite.setAlpha(1);
            b.sprite.setVisible(true);
            b.gfx.setVisible(false);
          } else {
            this.drawCells(b.gfx, b.cells, def.fill, 0.85, def.border);
            b.gfx.setVisible(true);
          }
          this.onBuildingConstructed(b, now);
        }

        this.updateBuildingInfoModal(b, def, now);
        continue;
      }

      // ===== Produccion =====
      if (!this.hasBuildingProduction(b, def)) {
        b.rewardReady = false;
        b.prodBar.clear();
        b.rewardGoldIcon?.setVisible(false);
        b.rewardExpIcon?.setVisible(false);
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

  clampWorldCamera() {
    const cam = this.worldCam;
    const b = this.worldBounds;
    const verts = this.mapDiamondVerts;
    if (!cam || !b) return;

    const viewW = cam.width / cam.zoom;
    const viewH = cam.height / cam.zoom;
    if (!verts) {
      // Fallback simple por rectangulo si aun no existen vertices.
      const minScrollX = b.minX;
      const maxScrollX = Math.max(minScrollX, b.maxX - viewW);
      const minScrollY = b.minY;
      const maxScrollY = Math.max(minScrollY, b.maxY - viewH);
      cam.scrollX = Phaser.Math.Clamp(cam.scrollX, minScrollX, maxScrollX);
      cam.scrollY = Phaser.Math.Clamp(cam.scrollY, minScrollY, maxScrollY);
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

    // Clamp por "punto de enfoque" dentro del rombo:
    // permite ver/editar todos los bordes en zoom min y max, sin pasarse del limite.
    const focusOffX = viewW * 0.5;
    const focusOffY = viewH * 0.56;
    const padX = Math.max(10 / cam.zoom, TILE_W * 0.16);
    const padY = Math.max(10 / cam.zoom, TILE_H * 0.32);

    let focusY = cam.scrollY + focusOffY;
    const minFocusY = vTop.y + padY;
    const maxFocusY = vBottom.y - padY;
    if (minFocusY <= maxFocusY) {
      focusY = Phaser.Math.Clamp(focusY, minFocusY, maxFocusY);
    } else {
      focusY = (vTop.y + vBottom.y) * 0.5;
    }
    cam.scrollY = focusY - focusOffY;

    const leftX = leftEdgeXAtY(focusY) + padX;
    const rightX = rightEdgeXAtY(focusY) - padX;
    let minScrollX = leftX - focusOffX;
    let maxScrollX = rightX - focusOffX;

    // Evita rango invertido en extremos.
    if (minScrollX > maxScrollX) {
      const centerX = (leftX + rightX) * 0.5;
      minScrollX = centerX - focusOffX;
      maxScrollX = minScrollX;
    }

    cam.scrollX = Phaser.Math.Clamp(cam.scrollX, minScrollX, maxScrollX);
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
































