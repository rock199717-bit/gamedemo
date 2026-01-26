// =========================
// MAPA (10 veces más grande)
// =========================
const MAP_W = 140;
const MAP_H = 140;

const TILE_W = 64;
const TILE_H = 32;

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
    this.createConfirmButtons(regUI);
    this.createActionButtons(regUI);

    // ✅ IMPORTANTÍSIMO:
    // el WORLD cam ignora todos los UI -> el UI no se escala con zoom
    this.worldCam.ignore(this.uiObjects);

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

    if (this.pending) this.updateConfirmButtonsPosition();
    if (this.selectedBuildingId) this.updateActionButtonsPosition();
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
    const closeStyle  = { fontFamily: "Arial", fontSize: "18px", color: "#22c55e", backgroundColor: "#020617" };

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

    this.actClose = regUI(
      this.add.text(0, 0, "✖", closeStyle)
        .setPadding(10, 6, 10, 6).setScrollFactor(0)
        .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(9999)
    );

    this.attachOverUI(this.actRotate);
    this.attachOverUI(this.actMove);
    this.attachOverUI(this.actTrash);
    this.attachOverUI(this.actClose);

    this.actRotate.on("pointerdown", (pointer) => { this.uiGuard(pointer); this.rotateSelected(); });
    this.actMove.on("pointerdown", (pointer) => { this.uiGuard(pointer); this.startMoveSelected(); this.hideActionButtons(); });
    this.actTrash.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.destroySelected();
      this.hideActionButtons();
      this.closeBuildingMenu();
      this.setCursorMode();
    });
    this.actClose.on("pointerdown", (pointer) => {
      this.uiGuard(pointer);
      this.hideActionButtons();
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
    this.actClose.setVisible(true);
  }

  hideActionButtons() {
    this.actRotate.setVisible(false);
    this.actMove.setVisible(false);
    this.actTrash.setVisible(false);
    this.actClose.setVisible(false);
    this.overUI = false;
  }

  updateActionButtonsPosition() {
    if (!this.selectedBuildingId) return;
  
    

    // ✅ convertir a pantalla considerando zoom
    const x = this.actionClickX ?? 0;
    const y = this.actionClickY ?? 0;
    

    const oy = - 60;
    this.actRotate.setPosition(x - 70, y + oy);
    this.actMove.setPosition(x - 20, y + oy);
    this.actTrash.setPosition(x + 30, y + oy)
    this.actClose.setPosition(x + 80, y + oy);
  }

  openBuildingMenu(idOnTile, pointer) {
    this.clearPending();
    this.ghost.clear();

    this.selectedBuildingId = idOnTile;

    this.actionClickX = pointer.x;
    this.actionClickY = pointer.y;

    this.showActionButtons();
    this.updateActionButtonsPosition();

    mode = "cursor";
    this.modeText.setText(this.modeLabel());
    this.cancelBuildBtn.setVisible(false);
    this.cancelBuildBorder.setVisible(false);
  }

  closeBuildingMenu() {
    this.selectedBuildingId = null;
    this.hideActionButtons();
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
    b.gfx.destroy();
    buildings.delete(id);
    freeBuilding(id);
  }

  placeBuilding(r0, c0, size) {
    const id = nextBuildingId++;
    const cells = occupy(id, size, r0, c0);

    const gfx = this.add.graphics();
    this.drawCells(gfx, cells, 0x22c55e, 0.85, 0x22c55e);

    // ✅ el UI cam NO debe renderizar edificios
    this.uiCam.ignore(gfx);

    buildings.set(id, { size, cells, gfx, rotationStep: 0, border: 0x22c55e });
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
