// =========================
// MAPA (10 veces más grande)
// =========================
const MAP_W = 140;
const MAP_H = 140;

const TILE_W = 64;
const TILE_H = 32;

// =========================
// BUILDING TYPES (WORLD)
// =========================
const BUILDING_TYPES = {
  // ✅ verdes básicos (lo que ya tenías “de prueba”)
  green_1: {
    key: "green_1",
    label: "Verde 1x1",
    size: 1,
    fill: 0x22c55e,
    border: 0x22c55e,
    buildSeconds: 5,
    prodSeconds: 60,
    reward: { exp: 1, gold: 10 },
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
  // ✅ VERDE 4x4 (4★)
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
  // ✅ ROJOS (1★/2★/3★/4★)
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
  // ✅ ROJO 4x4 (4★)
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
  // ✅ AZULES (1★/2★/3★/4★)
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
  // ✅ AZUL 4x4 (4★)
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

  // ✅ VERDE 9x9 (5★ permanente)
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
  // ✅ AZUL 9x9 (5★ permanente)
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
  // ✅ ROJO 9x9 (5★ permanente)
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

  // ✅ DORADO 5★ (limitado) con brillo
  lim_gold_2: {
    key: "lim_gold_2",
    label: "Dorado 9x9",
    size: 9,
    fill: 0xfbbf24,
    border: 0xf59e0b,
    buildSeconds: 60,      // rápida (base) -> 5★ lo reduce más
    prodSeconds: 120,      // semi lenta (base) -> 5★ lo hace más lento
    reward: { exp: 60, gold: 300 }, // muy alta (base) -> 5★ la triplica
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

// 0 = libre, >0 = id edificio
const grid = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0));
let nextBuildingId = 1;
const buildings = new Map();

let mode = "cursor"; // inicia en cursor

const DRAG_THRESHOLD = 10;

// ✅ ZOOM LIMITS
const ZOOM_MIN = 0.7;
const ZOOM_MAX = 1.6;
const ZOOM_STEP = 0.12; // rueda

// =========================
// ISO helpers
// =========================
function isoToScreen(row, col) {
  return {
    x: (col - row) * (TILE_W / 2),
    y: (col + row) * (TILE_H / 2)
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
  const cf = (a + b) / 2;
  const rf = (b - a) / 2;

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
  create() {
    
    // ===== CAMERAS =====
    // Main camera = WORLD (se zoom/pan)
    this.worldCam = this.cameras.main;
    this.worldCam.setBackgroundColor("#0f172a");

    // UI camera = fijo (NO zoom)
    this.uiCam = this.cameras.add(0, 0, this.scale.width, this.scale.height);
    this.uiCam.setScroll(0, 0);
    this.uiCam.setZoom(1);

    // si cambia tamaño (FIT), ajusta UI cam
    this.scale.on("resize", (gameSize) => {
      const w = gameSize.width;
      const h = gameSize.height;
      this.uiCam.setSize(w, h);
    });

    this.input.mouse.disableContextMenu();

    // UI arriba tiene prioridad en clicks
    this.input.topOnly = true;

    // ===== Mundo =====
    this.gridGfx = this.add.graphics();
    this.ghost = this.add.graphics();
    this.moveGhost = this.add.graphics();

    // por defecto, UI cam NO debe renderizar el mundo
    this.uiCam.ignore([this.gridGfx, this.ghost, this.moveGhost]);

    // ===== Estado input =====
    this.isDragging = false;
    this.dragged = false;
    this.pointerStart = { x: 0, y: 0, camX: 0, camY: 0 };

    this.uiClick = false;
    this.overUI = false;

    this.pending = null;
    this.selectedBuildingId = null;
    this.moveMode = null;
    // ✅ item seleccionado para construir (por defecto el verde 1x1)
    this.selectedBuildKey = "green_1";

    // lista de objetos UI para que el WORLD cam los ignore (así NO se mueven con zoom)
    this.uiObjects = [];
    const regUI = (obj) => {
      this.uiObjects.push(obj);
      return obj;
    };

    // ===== UI fija =====
    regUI(
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

    // crea botones UI (los registra adentro)
    this.createCancelBuildButton(regUI);
    this.createCancelSelectButton(regUI);
    this.createConfirmButtons(regUI);
    this.createActionButtons(regUI);

    // ✅ IMPORTANTÍSIMO:
    // el WORLD cam ignora todos los UI -> el UI no se escala con zoom
    this.worldCam.ignore(this.uiObjects);
    this.economy = new EconomySystem(this);

    // ===== Cámara / bounds =====
    this.setupCameraBounds();

    // ✅ Zoom inicial
    this.worldCam.setZoom(1);

    // ✅ Controles de zoom (rueda + pinch)
    this.setupZoomControls();

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
      if (pointer.y <= 140) return;

      this.isDragging = false;
      this.dragged = false;

      this.pointerStart.x = pointer.x;
      this.pointerStart.y = pointer.y;
      this.pointerStart.camX = this.worldCam.scrollX;
      this.pointerStart.camY = this.worldCam.scrollY;
    });

    this.input.on("pointermove", (pointer) => {
      if (pointer.y <= 140) return;

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
      if (mode !== "build" || this.pending || this.selectedBuildingId) return;

      const tile = screenToIsoTile(pointer.worldX, pointer.worldY);
      this.ghost.clear();
      if (!tile) return;

      const preview = this.getBuildPreview();
      const size = preview.size;
      const ok = canPlace(size, tile.r, tile.c);
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
    });

    this.input.on("pointerup", (pointer) => {
      if (this.uiClick) {
        this.uiClick = false;
        return;
      }
      if (this.overUI) return;

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

      if (idOnTile) {
        // En modo construcciÃ³n no abrir info de edificios
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
      const ok = canPlace(size, tile.r, tile.c);
      this.pending = {
        tile,
        size,
        ok,
        clickX: pointer.x,
        clickY: pointer.y,
        color: preview.def.fill ?? 0x22c55e,
        border: preview.def.border ?? (preview.def.fill ?? 0x22c55e)
      };

      this.renderPendingGhost();
      this.updateConfirmButtonsPosition();
      this.showConfirmButtons(ok);
    });
  }

  update() {
    const cam = this.worldCam;

    // ✅ redraw también cuando cambia zoom
    if (cam.scrollX !== this.lastCamX || cam.scrollY !== this.lastCamY || cam.zoom !== this.lastZoom) {
      this.lastCamX = cam.scrollX;
      this.lastCamY = cam.scrollY;
      this.lastZoom = cam.zoom;
      this.drawGridVisible();
    }
    // ✅ FIX: actualizar ghost SIEMPRE en moveMode (aunque no haya pointermove)
    if (this.moveMode) {
      const p = this.input.activePointer;

      // si estás arriba del UI, oculta el ghost
      if (p.y <= 140) {
        this.moveGhost.clear();
      } else {
        const tile = screenToIsoTile(p.worldX, p.worldY);
        this.renderMoveGhost(tile);
      }
    }

    if (this.pending) this.updateConfirmButtonsPosition();
    if (this.selectedBuildingId) this.updateActionButtonsPosition();

    // ✅ AQUI:
    this.updateBuildingsTimers();
  }

  // ================= ZOOM =================
  setupZoomControls() {
    // Wheel zoom (PC)
    this.input.on("wheel", (pointer, gameObjects, dx, dy) => {
      // evita zoom cuando estás sobre UI alta
      if (pointer.y <= 140) return;

      const cam = this.worldCam;

      // punto del mouse en mundo antes del zoom
      const worldPointBefore = cam.getWorldPoint(pointer.x, pointer.y);

      let z = cam.zoom;
      if (dy > 0) z -= ZOOM_STEP; // scroll down = zoom out
      else z += ZOOM_STEP;        // scroll up = zoom in

      z = Phaser.Math.Clamp(z, ZOOM_MIN, ZOOM_MAX);
      if (z === cam.zoom) return;

      cam.setZoom(z);

      // mantener el punto bajo el mouse
      const worldPointAfter = cam.getWorldPoint(pointer.x, pointer.y);
      cam.scrollX += (worldPointBefore.x - worldPointAfter.x);
      cam.scrollY += (worldPointBefore.y - worldPointAfter.y);

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

      const cam = this.worldCam;

      const worldBefore = cam.getWorldPoint(this.pinch.midX, this.pinch.midY);

      let z = this.pinch.startZoom * (dist / this.pinch.startDist);
      z = Phaser.Math.Clamp(z, ZOOM_MIN, ZOOM_MAX);

      cam.setZoom(z);

      const worldAfter = cam.getWorldPoint(this.pinch.midX, this.pinch.midY);
      cam.scrollX += (worldBefore.x - worldAfter.x);
      cam.scrollY += (worldBefore.y - worldAfter.y);

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
  modeLabel() {
    return mode === "build" ? "Modo: 🏗 Construcción" : "Modo: 🖱 Cursor";
  }

  getBuildPreview() {
    const typeKey = this.selectedBuildKey || "green_1";
    const def = BUILDING_TYPES[typeKey] || BUILDING_TYPES.green_1;
    const size = def.size;
    return { typeKey, def, size };
  }

  setBuildMode() {
    mode = "build";
    this.modeText.setText(this.modeLabel());
    this.cancelBuildBtn.setVisible(true);
    this.cancelBuildBorder.setVisible(true);
  }

  setCursorMode() {
    mode = "cursor";
    this.modeText.setText(this.modeLabel());
    this.clearPending();
    this.ghost.clear();

    this.cancelBuildBtn.setVisible(false);
    this.cancelBuildBorder.setVisible(false);
  }

  uiGuard(pointer) {
    this.uiClick = true;
    if (pointer?.event) {
      pointer.event.preventDefault?.();
      pointer.event.stopPropagation?.();
    }
  }


  createCancelBuildButton(regUI) {
    const style = { fontFamily: "Arial", fontSize: "14px", color: "#22c55e", backgroundColor: "#020617" };

    this.cancelBuildBtn = regUI(
      this.add.text(280, 86, "Cancelar", style)
        .setPadding(10, 6, 10, 6)
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
    const style = { fontFamily: "Arial", fontSize: "14px", color: "#f59e0b", backgroundColor: "#020617" };

    this.cancelSelectBtn = regUI(
      this.add.text(390, 86, "Cancelar", style)
        .setPadding(10, 6, 10, 6)
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

  // ===== Confirm (✔ ✖) =====
  createConfirmButtons(regUI) {
    const okStyle = { fontFamily: "Arial", fontSize: "18px", color: "#022c22", backgroundColor: "#22c55e" };
    const xStyle  = { fontFamily: "Arial", fontSize: "18px", color: "#e5e7eb", backgroundColor: "#0f172a" };

    this.confirmOk = regUI(
      this.add.text(0, 0, "✔", okStyle)
        .setPadding(10, 6, 10, 6)
        .setScrollFactor(0)
        .setInteractive({ useHandCursor: true })
        .setVisible(false)
        .setDepth(9999)
    );

    this.confirmX = regUI(
      this.add.text(0, 0, "✖", xStyle)
        .setPadding(10, 6, 10, 6)
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
    
    

    // ✅ convertir a pantalla considerando zoom
    
    const x = this.pending.clickX;
    const y = this.pending.clickY;

    const oy = 18;
    this.confirmOk.setPosition(x - 30, y + oy);
    this.confirmX.setPosition(x + 10, y + oy);
  }

  clearPending() {
    this.pending = null;
    this.confirmOk.setVisible(false);
    this.confirmX.setVisible(false);
  }

  renderPendingGhost() {
    if (!this.pending) return;
    const { tile, size, ok, color, border } = this.pending;

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
  }

  // ===== Action buttons (⟲ ✋ 🗑 ✖) =====
  createActionButtons(regUI) {
    const baseStyle   = { fontFamily: "Arial", fontSize: "18px", color: "#e5e7eb", backgroundColor: "#020617" };
    const dangerStyle = { fontFamily: "Arial", fontSize: "18px", color: "#f87171", backgroundColor: "#020617" };

    this.actRotate = regUI(
      this.add.text(0, 0, "⟲", baseStyle)
        .setPadding(10, 6, 10, 6).setScrollFactor(0)
        .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(9999)
    );

    this.actMove = regUI(
      this.add.text(0, 0, "✋", baseStyle)
        .setPadding(10, 6, 10, 6).setScrollFactor(0)
        .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(9999)
    );

    this.actTrash = regUI(
      this.add.text(0, 0, "🗑", dangerStyle)
        .setPadding(10, 6, 10, 6).setScrollFactor(0)
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
    this.actRotate.setVisible(true);
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
  
    

    // ✅ convertir a pantalla considerando zoom
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

    this.selectedBuildingId = idOnTile;

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
    return null;
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

  applyEvolution(b, now = Date.now()) {
    if (!b) return;
    const level = Math.max(0, Math.min(5, b.evoLevel || 0));
    const stage = (typeof b.evoStage === "number") ? b.evoStage : 5;
    const total = (stage >= 6) ? (5 + level) : level;
    const mult = 1 + (0.01 * total);
    const speed = Math.max(0.5, 1 - (0.01 * total));

    const prevBuild = b.buildSeconds ?? b.baseBuildSeconds ?? 0;
    const prevProd = b.prodSeconds ?? b.baseProdSeconds ?? 1;

    const baseBuild = b.baseBuildSeconds ?? prevBuild;
    const baseProd = b.baseProdSeconds ?? prevProd;
    const baseReward = b.baseReward || b.reward || { exp: 0, gold: 0 };

    b.buildSeconds = Math.max(0, Math.round(baseBuild * speed));
    b.prodSeconds = Math.max(1, Math.round(baseProd * speed));
    b.reward = {
      exp: Math.max(0, Math.round(baseReward.exp * mult)),
      gold: Math.max(0, Math.round(baseReward.gold * mult))
    };

    b.prodCycle = b.prodSeconds * 1000;

    if (!b.isBuilt) {
      const prevTotal = Math.max(1, prevBuild * 1000);
      const remain = Math.max(0, b.buildEnd - now);
      const ratio = remain / prevTotal;
      b.buildEnd = now + Math.round((b.buildSeconds * 1000) * ratio);
    } else if (!b.rewardReady) {
      const prevCycle = Math.max(1, prevProd * 1000);
      const elapsed = Math.max(0, now - b.prodStart);
      const ratio = elapsed / prevCycle;
      b.prodStart = now - Math.min(b.prodSeconds * 1000, Math.round((b.prodSeconds * 1000) * ratio));
    }
  }

  transcendBuilding(b, def) {
    if (!b) return;
    b.evoStage = 6;
    b.evoLevel = 0;
    this.applyEvolution(b, Date.now());
    if (def) this.updateBuildingInfoModal(b, def, Date.now());
  }

  openEvolutionModal(b) {
    if (!b || !this.economy) return;
    if (!b.isBuilt) return;
    const existing = document.getElementById("evo-modal");
    if (existing) existing.remove();

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const targetRarity = this.getRarityForKey(b.typeKey);
    if (targetRarity < 5) return;
    const targetSize = def.size;
    const targetColor = this.getColorForKey(b.typeKey);
    const fillHex = this.colorToHex(def.fill);
    const borderHex = this.colorToHex(def.border);
    const previewSvg = `
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
          const item = (typeof ITEM_DEFS !== "undefined" && ITEM_DEFS[key]) ? ITEM_DEFS[key] : { name: key, size: targetSize, rarity: targetRarity, icon: "❖" };
          const count = this.economy.inventory[key] || 0;
          return `
            <button class="evo-item" data-key="${key}">
              <span class="evo-item-left">
                <span class="evo-item-ico">${item.icon || "❖"}</span>
                <span>
                  <div class="evo-item-name">${item.name || key}</div>
                  <div class="evo-item-meta">${item.size}x${item.size} • ${item.rarity}★</div>
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
    const displayRarity = (targetRarity === 5 && evoStage >= 6) ? 6 : targetRarity;
    const evoActive = (evoLevel > 0) || (evoStage >= 6);
    const frameClass = displayRarity === 6
      ? `frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `frame-${displayRarity}${evoActive ? " evo-on" : ""}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5) ? " chrome" : "";
    const slotsHtml = Array.from({ length: 5 }, (_, i) => {
      const fixed = i < evoLevel;
      return `
        <div class="evo-slot${fixed ? " filled fixed" : ""}" data-slot="${i}" data-fixed="${fixed ? "1" : "0"}">
          <span class="evo-slot-ico"></span>
        </div>
      `;
    }).join("");
    const evoTransStars = Array.from({ length: 6 }, (_, i) => (
      `<span class="star" style="--h:${i * 60}deg">★</span>`
    )).join("");
    const evoStarsHtml = (displayRarity === 6) ? evoTransStars : "★".repeat(displayRarity);

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
            font-family: Arial;
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
          #evo-modal .evo-item-ico { font-size: 20px; }
          #evo-modal .evo-item-name { font-weight: 700; }
          #evo-modal .evo-item-meta { opacity:.75; font-size:12px; }
          #evo-modal .evo-main {
            display: grid;
            gap: 8px;
            align-content: start;
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
          #evo-modal .preview-frame { width: 100%; height: 140px; }
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
            border-radius: 14px;
            display:flex; align-items:center; justify-content:center;
            overflow: hidden;
          }
          #evo-modal .frame-1 { background: #6b7280; }
          #evo-modal .frame-2 { background: #065f46; }
          #evo-modal .frame-3 { background: #78350f; }
          #evo-modal .frame-4 { background: #94a3b8; }
          #evo-modal .frame-5 { background: #b45309; }
          #evo-modal .evo-on {
            box-shadow:
              inset 0 1px 2px rgba(255,255,255,.35),
              inset 0 -3px 6px rgba(0,0,0,.65),
              0 0 10px rgba(255,255,255,.12);
          }
          #evo-modal .evo-on::before {
            content:"";
            position:absolute;
            inset:2px;
            border-radius:12px;
            border:1px solid rgba(255,255,255,.28);
            pointer-events:none;
            mix-blend-mode: screen;
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
          }
          #evo-modal .frame-1.evo-on {
            background: linear-gradient(135deg,#e5e7eb 0%, #9ca3af 45%, #f8fafc 60%, #6b7280 100%);
          }
          #evo-modal .frame-2.evo-on {
            background: linear-gradient(135deg,#34d399 0%, #16a34a 45%, #86efac 60%, #065f46 100%);
          }
          #evo-modal .frame-3.evo-on {
            background: linear-gradient(135deg,#f59e0b 0%, #b45309 45%, #fcd34d 60%, #78350f 100%);
          }
          #evo-modal .frame-4.evo-on {
            background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 60%, #94a3b8 100%);
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
            border-radius: 10px;
            background: rgba(2,6,23,.65);
            display:flex; align-items:center; justify-content:center;
            overflow:hidden;
          }
          #evo-modal .preview-inner.chrome::after {
            content:"";
            position:absolute;
            inset:-60%;
            background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.65) 35%, rgba(255,255,255,0) 65%);
            animation: chromeSheen 2.2s linear infinite;
            mix-blend-mode: screen;
            opacity:.9;
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
            animation: evoRingSpin 1.6s ease forwards;
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
            animation: evoEnvUp 1.2s ease forwards;
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
            animation: evoCardRise 1.3s ease forwards;
            overflow: hidden;
          }
          #evo-modal .evo-trans-card::after {
            content:"";
            position:absolute;
            inset:-40%;
            background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,.7) 52%, rgba(255,255,255,0) 64%);
            opacity: .7;
            transform: translateX(-30%) rotate(8deg);
            animation: evoCardSheen 1.2s ease forwards;
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
          #evo-modal .evo-trans-flash {
            position: absolute;
            inset: -30%;
            background:
              radial-gradient(circle at 50% 50%, rgba(255,255,255,.8), rgba(255,255,255,0) 60%);
            opacity: 0;
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
        <div id="evoTransFx" class="evo-trans-fx" style="--fx-accent:${borderHex};">
          <div class="evo-trans-stage">
            <div class="evo-trans-ring"></div>
            <div class="evo-trans-envelope"></div>
            <div class="evo-trans-card">
              <div class="evo-trans-sigil">✦</div>
              <div class="evo-trans-title">Transcender</div>
              <div class="evo-trans-stars">${evoTransStars}</div>
            </div>
            <div class="evo-trans-flash"></div>
          </div>
        </div>
        <div class="evo-header">
          <b>Fusionar (${def.label || b.typeKey})</b>
          <button id="evoClose" style="background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);padding:6px 10px;border-radius:10px;cursor:pointer;">✖</button>
        </div>
        <div class="evo-grid">
          <div class="evo-list">
            ${list}
          </div>
          <div class="evo-main">
            <div id="evoMainCard" class="evo-main-card">
              <div id="evoFrame" class="${frameClass}">
                <div id="evoInner" class="preview-inner${chromeClass}">
                  ${previewSvg}
                </div>
              </div>
            </div>
            <div class="evo-title">${def.label || b.typeKey}</div>
          <div id="evoStars" class="evo-stars">${evoStarsHtml}</div>
            <small id="evoLevelText" style="opacity:.75;">Evolucion ${stageLabel}★: ${evoLevel}/5 (+${(evoStage >= 6) ? (5 + evoLevel) : evoLevel}%)</small>
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
    const evoFx = modal.querySelector("#evoTransFx");

    const triggerEvoFx = () => {
      if (!evoFx) return;
      evoFx.classList.remove("on");
      void evoFx.offsetWidth;
      evoFx.classList.add("on");
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
          if (ico) ico.textContent = "";
        } else if (s.dataset.pending !== "1") {
          s.classList.remove("filled");
          s.classList.remove("pending");
          s.dataset.key = "";
          const ico = s.querySelector(".evo-slot-ico");
          if (ico) ico.textContent = "";
        }
      });
    };

    const refreshMeta = () => {
      const level = getLevel();
      const stage = getStage();
      const total = (stage >= 6) ? (5 + level) : level;
      if (evoLevelText) evoLevelText.textContent = `Evolucion ${stage >= 5 ? stage : targetRarity}★: ${level}/5 (+${total}%)`;

      const display = (targetRarity === 5 && stage >= 6) ? 6 : targetRarity;
      const evoActive = (level > 0) || (stage >= 6);
      if (evoStars) {
        if (display === 6) {
          evoStars.innerHTML = evoTransStars;
        } else {
          evoStars.textContent = "★".repeat(display);
        }
      }
      const frameCls = display === 6
        ? `frame-6${(stage >= 6 && level >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
        : `frame-${display}${evoActive ? " evo-on" : ""}`;
      if (evoFrame) evoFrame.className = frameCls;
      if (evoInner) evoInner.className = `preview-inner${(display === 6 && stage >= 6 && level >= 5) ? " chrome" : ""}`;
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

    const addPending = (key, icon) => {
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
      if (ico) ico.textContent = icon || "❖";
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
          if (ico) ico.textContent = "";
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
        if (ico) ico.textContent = "";
        if (key) pendingUsed[key] = Math.max(0, (pendingUsed[key] || 1) - 1);
        updateListCounts();
        updateApplyState();
      });
    });

    modal.querySelectorAll("[data-key]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        if (!key) return;
        const icon = btn.querySelector(".evo-item-ico")?.textContent || "❖";
        addPending(key, icon);
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

        if (stageNow === 5) {
          b.evoStage = 5;
          b.evoLevel = Math.min(5, levelNow + pending);
        } else {
          b.evoStage = stageNow;
          b.evoLevel = Math.min(5, levelNow + pending);
        }

        this.applyEvolution(b, Date.now());
        this.updateBuildingInfoModal(b, def, Date.now());
        this.openBuildingInfoModal(b.id);

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
        triggerEvoFx();
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

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    const baseRarity = this.getRarityForKey(def.key || b.typeKey);
    const evoLevel = b.evoLevel || 0;
    const evoStage = (typeof b.evoStage === "number")
      ? b.evoStage
      : (baseRarity === 5 ? 5 : 0);
    const displayRarity = (baseRarity === 5 && evoStage >= 6) ? 6 : baseRarity;
    const evoActive = (evoLevel > 0) || (evoStage >= 6);
    const stars = "★".repeat(displayRarity);
    const starsHtml = (displayRarity === 6)
      ? Array.from({ length: 6 }, (_, i) => `<span class="star star-6" style="--h:${i * 60}deg">★</span>`).join("")
      : stars;
    const starClass = (displayRarity === 6) ? "stars-6" : (displayRarity === 5 ? "stars-5" : "stars-base");
    const frameClass = displayRarity === 6
      ? `frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `frame-${displayRarity}${evoActive ? " evo-on" : ""}`;
    const winClass = `building-window win-${displayRarity}${evoActive ? " evo-on" : ""}${(displayRarity === 6 && evoLevel >= 5) ? " win-6max" : ""}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5) ? " chrome" : "";
    const baseLabel = def.label || def.key;
    const displayLabel = (b.typeKey === "green_1" && b.size !== def.size)
      ? `Verde ${b.size}x${b.size}`
      : baseLabel;
    const buildLabel = this.formatSeconds(b.buildSeconds ?? def.buildSeconds);
    const prodLabel = this.formatSeconds(b.prodSeconds ?? def.prodSeconds);
    const rewardGold = b.reward?.gold ?? def.reward?.gold ?? 0;
    const rewardExp = b.reward?.exp ?? def.reward?.exp ?? 0;
    const fillHex = this.colorToHex(def.fill);
    const borderHex = this.colorToHex(def.border);
    const previewSvg = `
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
          border-radius: 14px;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: inset 0 1px 2px rgba(0,0,0,.45);
          overflow: hidden;
        }
        #building-modal .preview-frame::before {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.08);
          pointer-events: none;
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
        }
        #building-modal .preview-inner {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background: rgba(2,6,23,.65);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
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
        }
        #building-modal .frame-1 { background: #6b7280; }
        #building-modal .frame-2 { background: #065f46; }
        #building-modal .frame-3 { background: #78350f; }
        #building-modal .frame-4 { background: #94a3b8; }
        #building-modal .frame-5 { background: #b45309; }
        #building-modal .frame-6 {
          background:
            conic-gradient(from 0deg,
              #22c55e, #38bdf8, #a855f7, #f59e0b, #ef4444, #22c55e);
        }
        #building-modal .frame-1.evo-on {
          background: linear-gradient(135deg,#e5e7eb 0%, #9ca3af 45%, #f8fafc 60%, #6b7280 100%);
        }
        #building-modal .frame-2.evo-on {
          background: linear-gradient(135deg,#34d399 0%, #16a34a 45%, #86efac 60%, #065f46 100%);
        }
        #building-modal .frame-3.evo-on {
          background: linear-gradient(135deg,#f59e0b 0%, #b45309 45%, #fcd34d 60%, #78350f 100%);
        }
        #building-modal .frame-4.evo-on {
          background: linear-gradient(135deg,#f8fafc 0%, #cbd5e1 45%, #e2e8f0 60%, #94a3b8 100%);
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
        font-family: Arial;
        transform: translateY(12px) scale(.98);
        opacity: 0;
        transition: transform .18s ease, opacity .18s ease;
      ">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <h2 style="margin:0;font-size:18px;">🏠 ${displayLabel}</h2>
          <button id="buildingClose" style="
            background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
            padding:8px 10px;border-radius:10px;cursor:pointer;
          ">✖</button>
        </div>

        <div style="margin-top:10px; display:grid; gap:8px; font-size:14px;">
          <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
            <div id="previewFrame" class="preview-frame ${frameClass}">
              <div id="previewInner" class="preview-inner${chromeClass}">
                ${previewSvg}
              </div>
            </div>
            <div style="display:grid; gap:6px;">
          <div>Rareza: <b id="previewStars" class="preview-stars ${starClass}">${starsHtml}</b></div>
              <div>Tamaño: <b>${b.size}x${b.size}</b></div>
            </div>
          </div>
          <div>Construcción: <b>${buildLabel}</b></div>
          <div>Producción: <b>${prodLabel}</b></div>
          <div>Recompensa: <b>+${rewardGold} Oro</b> · <b>+${rewardExp} EXP</b></div>
        </div>

        <div id="buildSection" style="margin-top:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; opacity:.85;">
            <span>Construcción</span>
            <span id="buildTime">—</span>
          </div>
          <div style="margin-top:6px; height:10px; background:#1e293b; border-radius:999px; overflow:hidden;">
            <div id="buildFill" style="height:100%; width:0%; background:#fbbf24;"></div>
          </div>
        </div>

        <div id="prodSection" style="margin-top:12px;">
          <div style="display:flex; justify-content:space-between; font-size:13px; opacity:.85;">
            <span>Producción</span>
            <span id="prodTime">—</span>
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
            <small id="evoHint" style="opacity:.8;">Evolución: ${b.evoLevel || 0}/5 (+${b.evoLevel || 0}%)</small>
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
          Toca 💰 / ⭐ sobre el edificio para recolectar.
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
    if (rotateBtn) rotateBtn.onclick = () => {
      this.closeBuildingInfoModal();
      this.rotateSelected();
      this.closeBuildingMenu();
      this.setCursorMode();
    };

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
    const frameClass = displayRarity === 6
      ? `preview-frame frame-6${(evoLevel >= 5) ? " frame-6max" : ""}${evoActive ? " evo-on" : ""}`
      : `preview-frame frame-${displayRarity}${evoActive ? " evo-on" : ""}`;
    const chromeClass = (displayRarity === 6 && evoLevel >= 5) ? "preview-inner chrome" : "preview-inner";
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

    if (previewStars) {
      if (displayRarity === 6) {
        previewStars.innerHTML = Array.from({ length: 6 }, (_, i) => (
          `<span class="star star-6" style="--h:${i * 60}deg">★</span>`
        )).join("");
      } else {
        previewStars.textContent = "★".repeat(displayRarity);
      }
      const starsCls = `preview-stars ${starClass}`;
      if (previewStars.className !== starsCls) previewStars.className = starsCls;
    }
    if (previewFrame && previewFrame.className !== frameClass) previewFrame.className = frameClass;
    if (previewInner && previewInner.className !== chromeClass) previewInner.className = chromeClass;
    if (win) {
      const winCls = `building-window win-${displayRarity}${evoActive ? " evo-on" : ""}${(displayRarity === 6 && evoLevelClamped >= 5) ? " win-6max" : ""}`;
      if (win.className !== winCls) win.className = winCls;
    }

    const evoLevelClamped = Math.max(0, Math.min(5, b.evoLevel || 0));
    const totalEvo = (evoStage >= 6) ? (5 + evoLevelClamped) : evoLevelClamped;
    if (evoDiamonds) evoDiamonds.innerHTML = this.buildEvoDiamonds(evoLevelClamped);
    if (evoHint) evoHint.textContent = `Evolucion ${(evoStage >= 5 ? evoStage : baseRarity)}★: ${evoLevelClamped}/5 (+${totalEvo}%)`;
    if (evoBtn) {
      if (!b.isBuilt) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = "En construcción";
      } else if (baseRarity < 5) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = "Solo 5★";
      } else if (evoStage >= 6 && evoLevelClamped >= 5) {
        evoBtn.setAttribute("disabled", "true");
        evoBtn.textContent = "Max";
      } else {
        evoBtn.removeAttribute("disabled");
        evoBtn.textContent = "Evolucionar";
      }
    }
    if (transBtn) {
      const ready = (b.isBuilt && baseRarity === 5 && evoStage === 5 && evoLevelClamped >= 5);
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

    b.rotationStep = ((b.rotationStep || 0) + 1) % 4;

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

    const min = b.cells.reduce((m, t) => ((t.r + t.c) < (m.r + m.c) ? t : m), b.cells[0]);

    freeBuilding(id);
    b.gfx.setVisible(false);

    this.moveMode = {
      id,
      size: b.size,
      from: { r: min.r, c: min.c },
      border: b.border || 0x22c55e,
      rotationStep: b.rotationStep || 0
    };

    this.selectedBuildingId = null;
    this.modeText.setText("Modo: ✋ Moviendo (naranja=OK / rojo=NO) | Click suelta / Click fuera cancela");
    this.moveGhost.clear();
  }

  renderMoveGhost(tile) {
    if (!this.moveMode) return;
    this.moveGhost.clear();
    if (!tile) return;

    const ok = canPlace(this.moveMode.size, tile.r, tile.c);
    const color = ok ? 0xf59e0b : 0xf87171;

    const cells = [];
    for (let r = tile.r; r < tile.r + this.moveMode.size; r++) {
      for (let c = tile.c; c < tile.c + this.moveMode.size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }
    this.drawCells(this.moveGhost, cells, color, 0.35, color);
  }

  finishMoveAt(r0, c0) {
    const mm = this.moveMode;
    const b = buildings.get(mm.id);
    if (!b) return;

    b.cells = occupy(mm.id, mm.size, r0, c0);
    b.rotationStep = mm.rotationStep;
    b.border = mm.border;

    const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
    b.gfx.clear();
    this.drawCells(b.gfx, b.cells, def.fill, 0.85, b.border);
    b.gfx.setVisible(true);

    this.moveGhost.clear();
    this.moveMode = null;
    this.modeText.setText(this.modeLabel());
  }

  cancelMoveMode(restore) {
    if (!this.moveMode) return;

    const { id, size, from, border, rotationStep } = this.moveMode;
    const b = buildings.get(id);

    if (b && restore) {
      b.cells = occupy(id, size, from.r, from.c);
      b.border = border;
      b.rotationStep = rotationStep;

      const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;
      b.gfx.clear();
      this.drawCells(b.gfx, b.cells, def.fill, 0.85, border);
      b.gfx.setVisible(true);
    }

    this.moveGhost.clear();
    this.moveMode = null;
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

    // ✅ devolver item al inventario (si no es el verde base)
    if (this.economy && b.typeKey && b.typeKey !== "green_1") {
      this.economy.addItem?.(b.typeKey, 1);
    }

    b.gfx.destroy();
    b.buildBar?.destroy();
    b.prodBar?.destroy();
    b.glowGfx?.destroy();
    b.rewardGoldIcon?.destroy();
    b.rewardExpIcon?.destroy();
    buildings.delete(id);
    freeBuilding(id);
  }

  collectBuildingReward(id) {
    const b = buildings.get(id);
    if (!b || !b.rewardReady) return;

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
  }

  placeBuilding(r0, c0) {
    // 👇 construir usando el item seleccionado
    const typeKey = this.selectedBuildKey || "green_1";
    const def = BUILDING_TYPES[typeKey] || BUILDING_TYPES.green_1;

    const size = def.size;
    const rarity = this.getRarityForKey(typeKey);
    const mods = RARITY_MODS[rarity] || RARITY_MODS[2];
    const baseBuild = def.buildSeconds ?? 0;
    const baseProd = def.prodSeconds ?? 0;
    const baseReward = def.reward || { exp: 0, gold: 0 };
    const effBuild = Math.max(0, Math.round(baseBuild * mods.build));
    const effProd = Math.max(1, Math.round(baseProd * mods.prod));
    const effReward = {
      exp: Math.max(0, Math.round(baseReward.exp * mods.reward)),
      gold: Math.max(0, Math.round(baseReward.gold * mods.reward))
    };

    // validar espacio
    if (!canPlace(size, r0, c0)) return;

    // ✅ si no es el verde básico, debe existir en inventario y se consume
    // (si quieres que verde también consuma, lo cambiamos luego)
    if (this.economy && typeKey !== "green_1") {
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

    // ✅ UI cam NO renderiza edificios
    this.uiCam.ignore(gfx);

    // ===== barras en mundo =====
    const buildBar = this.add.graphics();
    const prodBar = this.add.graphics();
    this.uiCam.ignore([buildBar, prodBar]);

    // ===== iconos de recompensa (manual) =====
    const rewardGoldIcon = this.add.text(0, 0, "💰", {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#fbbf24",
      backgroundColor: "#0b1222"
    })
      .setOrigin(0.5, 0.5)
      .setPadding(6, 4, 6, 4)
      .setDepth(60)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    const rewardExpIcon = this.add.text(0, 0, "⭐", {
      fontFamily: "Arial",
      fontSize: "22px",
      color: "#22c55e",
      backgroundColor: "#0b1222"
    })
      .setOrigin(0.5, 0.5)
      .setPadding(6, 4, 6, 4)
      .setDepth(60)
      .setVisible(false)
      .setInteractive({ useHandCursor: true });

    this.uiCam.ignore([rewardGoldIcon, rewardExpIcon]);

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
      this.uiCam.ignore(glowGfx);
    }

    // tiempos
    const now = Date.now();
    const buildEnd = now + effBuild * 1000;
    const prodCycle = effProd * 1000;

    buildings.set(id, {
      id,
      typeKey,
      size,
      cells,
      gfx,
      buildBar,
      prodBar,
      rewardGoldIcon,
      rewardExpIcon,
      rewardReady: false,
      glowGfx,
      isBuilt: effBuild <= 0,
      buildSeconds: effBuild,
      prodSeconds: effProd,
      reward: effReward,
      baseBuildSeconds: effBuild,
      baseProdSeconds: effProd,
      baseReward: { ...effReward },
      evoLevel: 0,
      evoStage: (rarity >= 5) ? 5 : 0,
      buildEnd,
      prodCycle,
      prodStart: effBuild <= 0 ? now : buildEnd, // empieza cuando termina de construir
      lastRewardAt: 0,
      border: def.border
    });
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
    const view = cam.worldView;

    const corners = [
      { x: view.x, y: view.y },
      { x: view.x + view.width, y: view.y },
      { x: view.x, y: view.y + view.height },
      { x: view.x + view.width, y: view.y + view.height }
    ];

    let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;

    for (const p of corners) {
      const a = p.x / (TILE_W / 2);
      const b = p.y / (TILE_H / 2);
      const cf = (a + b) / 2;
      const rf = (b - a) / 2;
      minR = Math.min(minR, rf);
      maxR = Math.max(maxR, rf);
      minC = Math.min(minC, cf);
      maxC = Math.max(maxC, cf);
    }

    const buffer = 6;
    const rStart = Math.max(0, Math.floor(minR) - buffer);
    const rEnd = Math.min(MAP_H - 1, Math.ceil(maxR) + buffer);
    const cStart = Math.max(0, Math.floor(minC) - buffer);
    const cEnd = Math.min(MAP_W - 1, Math.ceil(maxC) + buffer);

    this.gridGfx.clear();
    this.gridGfx.lineStyle(1, 0x1e293b, 1);

    for (let r = rStart; r <= rEnd; r++) {
      for (let c = cStart; c <= cEnd; c++) {
        const p = isoToScreen(r, c);
        this.drawDiamond(this.gridGfx, p.x, p.y, TILE_W, TILE_H, 0x020617, 1);
        this.outlineDiamond(this.gridGfx, p.x, p.y, TILE_W, TILE_H);
      }
    }
  }

  updateBuildingsTimers() {
    const now = Date.now();

    for (const b of buildings.values()) {
      const def = BUILDING_TYPES[b.typeKey] || BUILDING_TYPES.green_1;

      // encontrar un punto “anchor” (top-left)
      const topLeft = b.cells.reduce((best, cur) => {
        if (!best) return cur;
        return (cur.r + cur.c) < (best.r + best.c) ? cur : best;
      }, null);

      const p = isoToScreen(topLeft.r, topLeft.c);

      // posición barra (un poquito arriba del edificio)
      const barX = p.x;
      const barY = p.y - (TILE_H * 0.9);

      // ===== Construcción =====
      if (!b.isBuilt) {
        const total = (b.buildSeconds ?? def.buildSeconds) * 1000;
        const remain = Math.max(0, b.buildEnd - now);
        const done = 1 - (remain / total);

        // dibujar barra construcción
        b.buildBar.clear();
        b.prodBar.clear();
        b.rewardGoldIcon?.setVisible(false);
        b.rewardExpIcon?.setVisible(false);

        // fondo
        b.buildBar.fillStyle(0x0b1222, 0.8);
        b.buildBar.fillRoundedRect(barX - 34, barY, 68, 8, 4);

        // progreso
        b.buildBar.fillStyle(0xfbbf24, 1);
        b.buildBar.fillRoundedRect(barX - 34, barY, 68 * Phaser.Math.Clamp(done, 0, 1), 8, 4);

        // listo
        if (remain <= 0) {
          b.isBuilt = true;
          b.prodStart = now; // empieza producción
          b.rewardReady = false;
          b.buildBar.clear();
          // reemplaza ghost por edificio final
          b.gfx.clear();
          this.drawCells(b.gfx, b.cells, def.fill, 0.85, def.border);
        }

        this.updateBuildingInfoModal(b, def, now);
        continue;
      }

      // ===== Producción =====
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

      // barra producción
      b.prodBar.clear();
      b.prodBar.fillStyle(0x0b1222, 0.75);
      b.prodBar.fillRoundedRect(barX - 34, barY, 68, 8, 4);

      b.prodBar.fillStyle(0x22c55e, 1);
      b.prodBar.fillRoundedRect(barX - 34, barY, 68 * Phaser.Math.Clamp(p01, 0, 1), 8, 4);

      // iconos de recompensa (manual)
      const showReward = !!b.rewardReady;
      if (b.rewardGoldIcon) {
        b.rewardGoldIcon.setVisible(showReward);
        if (showReward) b.rewardGoldIcon.setPosition(barX - 16, barY - 24);
      }
      if (b.rewardExpIcon) {
        b.rewardExpIcon.setVisible(showReward);
        if (showReward) b.rewardExpIcon.setPosition(barX + 16, barY - 24);
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
    const corners = [
      isoToScreen(0, 0),
      isoToScreen(0, MAP_W - 1),
      isoToScreen(MAP_H - 1, 0),
      isoToScreen(MAP_H - 1, MAP_W - 1)
    ];

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const p of corners) {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    minX -= TILE_W;
    maxX += TILE_W;
    minY -= TILE_H;
    maxY += TILE_H;

    const worldW = maxX - minX;
    const worldH = maxY - minY;

    this.worldCam.setBounds(minX, minY, worldW, worldH);

    const mid = isoToScreen(Math.floor(MAP_H / 2), Math.floor(MAP_W / 2));
    this.worldCam.centerOn(mid.x, mid.y);
    this.worldCam.preRender();
  }
}

// =========================
// Config 16:9 + responsive
// =========================
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game",
  scene: MainScene,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

new Phaser.Game(config);
