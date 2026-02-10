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

  // ✅ PERMANENTE 4★ (los 3 cuadrados principales)
  perm_blue_9: {
    key: "perm_blue_9",
    label: "Azul 9x9",
    size: 9,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  perm_red_1: {
    key: "perm_red_1",
    label: "Rojo 1x1",
    size: 1,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 20,
    prodSeconds: 60,
    reward: { exp: 20, gold: 100 },
    glow: false
  },
  perm_yellow_4: {
    key: "perm_yellow_4",
    label: "Amarillo 4x4",
    size: 4,
    fill: 0xfacc15,
    border: 0xfde047,
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

  // ✅ LIMITADO 4★ (2x2) — recompensas NO las especificaste
  // Por ahora las dejo iguales que el verde básico para que funcione y luego ajustamos.
  lim_blue_2: {
    key: "lim_blue_2",
    label: "Azul 2x2",
    size: 2,
    fill: 0x3b82f6,
    border: 0x60a5fa,
    buildSeconds: 5,
    prodSeconds: 60,
    reward: { exp: 1, gold: 10 }, // TODO: ajustar si quieres
    glow: false
  },
  lim_red_2: {
    key: "lim_red_2",
    label: "Rojo 2x2",
    size: 2,
    fill: 0xef4444,
    border: 0xf87171,
    buildSeconds: 5,
    prodSeconds: 60,
    reward: { exp: 1, gold: 10 }, // TODO
    glow: false
  },
  lim_yellow_2: {
    key: "lim_yellow_2",
    label: "Amarillo 2x2",
    size: 2,
    fill: 0xfacc15,
    border: 0xfde047,
    buildSeconds: 5,
    prodSeconds: 60,
    reward: { exp: 1, gold: 10 }, // TODO
    glow: false
  },

  // ✅ DORADO 5★ (limitado) con brillo
  lim_gold_2: {
    key: "lim_gold_2",
    label: "Dorado 2x2",
    size: 2,
    fill: 0xfbbf24,
    border: 0xf59e0b,
    buildSeconds: 300,     // 5 min
    prodSeconds: 60,
    reward: { exp: 35, gold: 300 },
    glow: true
  }
};

// 0 = libre, >0 = id edificio
const grid = Array.from({ length: MAP_H }, () => Array(MAP_W).fill(0));
let nextBuildingId = 1;
const buildings = new Map();

let selectedSize = 1;
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

    this.sizeText = regUI(
      this.add.text(
        16, 40,
        this.sizeLabel(),
        { fontFamily: "Arial", fontSize: "14px", color: "#22c55e" }
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
    this.createSizeButtons(regUI);
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

      const ok = canPlace(selectedSize, tile.r, tile.c);
      const color = ok ? 0x22c55e : 0xf87171;

      const cells = [];
      for (let r = tile.r; r < tile.r + selectedSize; r++) {
        for (let c = tile.c; c < tile.c + selectedSize; c++) {
          if (inBounds(r, c)) cells.push({ r, c });
        }
      }
      this.drawCells(this.ghost, cells, color, 0.25);
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
        this.openBuildingMenu(idOnTile, pointer);
        return;
      }

      if (this.selectedBuildingId) {
        this.closeBuildingMenu();
        this.setCursorMode();
        return;
      }

      if (mode === "cursor") return;

      const ok = canPlace(selectedSize, tile.r, tile.c);
      this.pending = { tile, size: selectedSize, ok, clickX: pointer.x, clickY: pointer.y };

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
  sizeLabel() {
    return `Tamaño: ${selectedSize}x${selectedSize} (${selectedSize * selectedSize} celdas)`;
  }

  modeLabel() {
    return mode === "build" ? "Modo: 🏗 Construcción" : "Modo: 🖱 Cursor";
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

  setSize(s) {
    selectedSize = s;
    this.sizeText.setText(this.sizeLabel());
    this.setBuildMode();
  }

  uiGuard(pointer) {
    this.uiClick = true;
    if (pointer?.event) {
      pointer.event.preventDefault?.();
      pointer.event.stopPropagation?.();
    }
  }

  createSizeButtons(regUI) {
    const btnStyle = { fontFamily: "Arial", fontSize: "14px", color: "#e5e7eb", backgroundColor: "#020617" };

    const makeBtn = (x, y, label, size) => {
      const t = regUI(
        this.add.text(x, y, label, btnStyle)
          .setPadding(8, 6, 8, 6)
          .setInteractive({ useHandCursor: true })
          .setScrollFactor(0)
          .setDepth(9999)
      );

      t.on("pointerdown", (pointer) => {
        this.uiGuard(pointer);
        this.setSize(size);
      });

      const g = regUI(this.add.graphics().setScrollFactor(0).setDepth(9998));
      g.lineStyle(1, 0x1e293b, 1);
      g.strokeRoundedRect(x - 2, y - 2, t.width + 4, t.height + 4, 8);
    };

    makeBtn(16, 86, "1x1", 1);
    makeBtn(78, 86, "2x2", 2);
    makeBtn(140, 86, "3x3", 3);
    makeBtn(202, 86, "4x4", 4);
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
      const { tile, size } = this.pending;
      this.placeBuilding(tile.r, tile.c, size);
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
    const { tile, size, ok } = this.pending;

    this.ghost.clear();
    const color = ok ? 0x22c55e : 0xf87171;

    const cells = [];
    for (let r = tile.r; r < tile.r + size; r++) {
      for (let c = tile.c; c < tile.c + size; c++) {
        if (inBounds(r, c)) cells.push({ r, c });
      }
    }
    this.drawCells(this.ghost, cells, color, 0.35, color);
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
    if (typeKey === "green_1") return 2;
    if (typeKey === "perm_green_9" || typeKey === "lim_gold_2") return 5;
    if (typeof typeKey === "string" && (typeKey.startsWith("perm_") || typeKey.startsWith("lim_"))) return 4;
    return 2;
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
    const rarity = this.getRarityForKey(def.key || b.typeKey);
    const stars = "★".repeat(rarity);
    const baseLabel = def.label || def.key;
    const displayLabel = (b.typeKey === "green_1" && b.size !== def.size)
      ? `Verde ${b.size}x${b.size}`
      : baseLabel;
    const buildLabel = this.formatSeconds(def.buildSeconds);
    const prodLabel = this.formatSeconds(def.prodSeconds);
    const rewardGold = def.reward?.gold ?? 0;
    const rewardExp = def.reward?.exp ?? 0;
    const fillHex = this.colorToHex(def.fill);
    const borderHex = this.colorToHex(def.border);
    const previewSvg = `
      <svg width="120" height="80" viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <polygon points="60,8 112,40 60,72 8,40" fill="${fillHex}" stroke="${borderHex}" stroke-width="3"/>
      </svg>
    `;

    const modal = document.createElement("div");
    modal.id = "building-modal";
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
      <div class="building-window" style="
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
            <div style="
              width:140px;height:90px;display:flex;align-items:center;justify-content:center;
              background:#0f172a;border:1px solid rgba(255,255,255,.08);border-radius:12px;
            ">${previewSvg}</div>
            <div style="display:grid; gap:6px;">
              <div>Rareza: <b>${stars}</b></div>
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
    if (!modal || !b || this.selectedBuildingId !== b.id) return;

    const buildSection = modal.querySelector("#buildSection");
    const prodSection = modal.querySelector("#prodSection");
    const buildFill = modal.querySelector("#buildFill");
    const prodFill = modal.querySelector("#prodFill");
    const buildTime = modal.querySelector("#buildTime");
    const prodTime = modal.querySelector("#prodTime");
    const collectBtn = modal.querySelector("#bldCollect");

    if (!b.isBuilt) {
      if (buildSection) buildSection.style.display = "block";
      if (prodSection) prodSection.style.display = "none";

      const total = def.buildSeconds * 1000;
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
  }

  rotateSelected() {
    const id = this.selectedBuildingId;
    if (!id) return;

    const b = buildings.get(id);
    if (!b) return;

    b.rotationStep = ((b.rotationStep || 0) + 1) % 4;

    const borders = [0x22c55e, 0x60a5fa, 0xf59e0b, 0xf472b6];
    b.border = borders[b.rotationStep];

    b.gfx.clear();
    this.drawCells(b.gfx, b.cells, 0x22c55e, 0.85, b.border);
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

    b.gfx.clear();
    this.drawCells(b.gfx, b.cells, 0x22c55e, 0.85, b.border);
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

      b.gfx.clear();
      this.drawCells(b.gfx, b.cells, 0x22c55e, 0.85, border);
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
    const reward = def.reward || { exp: 0, gold: 0 };

    if (this.economy) {
      this.economy.addGold(reward.gold);
      this.economy.addExp(reward.exp);
    }

    b.rewardReady = false;
    b.prodStart = Date.now();
    b.rewardGoldIcon?.setVisible(false);
    b.rewardExpIcon?.setVisible(false);
  }

  placeBuilding(r0, c0, sizeIgnored) {
    // 👇 construir usando el item seleccionado
    const typeKey = this.selectedBuildKey || "green_1";
    const def = BUILDING_TYPES[typeKey] || BUILDING_TYPES.green_1;

    const size = (typeKey === "green_1" && typeof sizeIgnored === "number" && sizeIgnored > 0)
      ? sizeIgnored
      : def.size;

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
    const isInstant = def.buildSeconds <= 0;
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
    const buildEnd = now + def.buildSeconds * 1000;
    const prodCycle = def.prodSeconds * 1000;

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
      isBuilt: def.buildSeconds <= 0,
      buildEnd,
      prodCycle,
      prodStart: def.buildSeconds <= 0 ? now : buildEnd, // empieza cuando termina de construir
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
        const total = def.buildSeconds * 1000;
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
        const elapsed = now - b.prodStart;
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
