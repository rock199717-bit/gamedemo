(() => {
  "use strict";

  const el = {
    toggleBtn: document.getElementById("pngEditorToggleBtn"),
    overlay: document.getElementById("pngEditorOverlay"),
    closeBtn: document.getElementById("pngEditorCloseBtn"),
    workspace: document.getElementById("pngEditorWorkspace"),
    gridCanvas: document.getElementById("pngEditorIsoGridCanvas"),
    ghostCanvas: document.getElementById("pngEditorGhostCanvas"),
    handleLayer: document.getElementById("pngEditorHandleLayer"),
    image: document.getElementById("pngEditorImage"),
    buildingSelect: document.getElementById("pngEditorBuildingSelect"),
    refreshBuildingsBtn: document.getElementById("pngEditorRefreshBuildingsBtn"),
    loadBuildingBtn: document.getElementById("pngEditorLoadBuildingBtn"),
    resetBuildingBtn: document.getElementById("pngEditorResetBuildingBtn"),
    fileInput: document.getElementById("pngEditorFileInput"),
    centerBtn: document.getElementById("pngEditorCenterBtn"),
    resetBtn: document.getElementById("pngEditorResetBtn"),
    copyBtn: document.getElementById("pngEditorCopyBtn"),
    zoomRange: document.getElementById("pngEditorZoomRange"),
    zoomInput: document.getElementById("pngEditorZoomInput"),
    ghostOffBtn: document.getElementById("pngEditorGhostOffBtn"),
    ghost1Btn: document.getElementById("pngEditorGhost1Btn"),
    ghost2Btn: document.getElementById("pngEditorGhost2Btn"),
    ghost4Btn: document.getElementById("pngEditorGhost4Btn"),
    ghost9Btn: document.getElementById("pngEditorGhost9Btn"),
    fitGhostBtn: document.getElementById("pngEditorFitGhostBtn"),
    lockScale: document.getElementById("pngEditorLockScale"),
    rotRange: document.getElementById("pngEditorRotRange"),
    rotInput: document.getElementById("pngEditorRotInput"),
    scaleXRange: document.getElementById("pngEditorScaleXRange"),
    scaleXInput: document.getElementById("pngEditorScaleXInput"),
    scaleYRange: document.getElementById("pngEditorScaleYRange"),
    scaleYInput: document.getElementById("pngEditorScaleYInput"),
    skewXRange: document.getElementById("pngEditorSkewXRange"),
    skewXInput: document.getElementById("pngEditorSkewXInput"),
    skewYRange: document.getElementById("pngEditorSkewYRange"),
    skewYInput: document.getElementById("pngEditorSkewYInput"),
    xInput: document.getElementById("pngEditorXInput"),
    yInput: document.getElementById("pngEditorYInput"),
    opacityRange: document.getElementById("pngEditorOpacityRange"),
    opacityInput: document.getElementById("pngEditorOpacityInput"),
    info: document.getElementById("pngEditorInfo"),
    console: document.getElementById("pngEditorConsole")
  };

  if (!el.toggleBtn || !el.overlay || !el.workspace || !el.image || !el.gridCanvas || !el.ghostCanvas || !el.handleLayer) return;

  const STORAGE_KEY = "png_editor_state_v1";
  const ISO_TILE_W = 64;
  const ISO_TILE_H = 32;

  const state = {
    sourceMode: "file",
    selectedBuildingId: null,
    srcName: "",
    baseWidth: 0,
    baseHeight: 0,
    x: 0,
    y: 0,
    rotation: 0,
    scaleX: 1,
    scaleY: 1,
    skewX: 0,
    skewY: 0,
    opacity: 1,
    ghostSize: 1,
    viewZoom: 1,
    cornerWarp: {
      nw: { x: 0, y: 0 },
      ne: { x: 0, y: 0 },
      se: { x: 0, y: 0 },
      sw: { x: 0, y: 0 }
    }
  };

  const limits = {
    rotation: { min: -180, max: 180 },
    scaleX: { min: 0.05, max: 8 },
    scaleY: { min: 0.05, max: 8 },
    skewX: { min: -89, max: 89 },
    skewY: { min: -89, max: 89 },
    opacity: { min: 0.05, max: 1 }
  };

  let currentObjectUrl = "";
  let hasImageLoaded = false;
  let dragging = null;
  let activeHandleTransform = null;
  const MAX_HISTORY = 300;
  const undoStack = [];
  const redoStack = [];
  const HANDLE_KEYS = ["nw", "n", "ne", "e", "se", "s", "sw", "w", "rotate"];
  const CORNER_KEYS = ["nw", "ne", "se", "sw"];
  const handleNodes = {};
  let handleBoxNode = null;

  (() => {
    handleBoxNode = document.createElement("div");
    handleBoxNode.className = "png-editor-handle-box";
    handleBoxNode.style.display = "none";
    el.handleLayer.appendChild(handleBoxNode);
    for (const key of HANDLE_KEYS) {
      const node = document.createElement("button");
      node.type = "button";
      node.className = "png-editor-handle";
      node.dataset.handle = key;
      node.style.display = "none";
      node.setAttribute("aria-label", `handle-${key}`);
      el.handleLayer.appendChild(node);
      handleNodes[key] = node;
    }
  })();

  function getStateSnapshot() {
    return {
      sourceMode: state.sourceMode,
      selectedBuildingId: state.selectedBuildingId,
      srcName: state.srcName,
      x: state.x,
      y: state.y,
      rotation: state.rotation,
      scaleX: state.scaleX,
      scaleY: state.scaleY,
      skewX: state.skewX,
      skewY: state.skewY,
      opacity: state.opacity,
      ghostSize: state.ghostSize,
      viewZoom: state.viewZoom,
      cornerWarp: normalizeCornerWarp(state.cornerWarp)
    };
  }

  function applyStateSnapshot(snap) {
    if (!snap) return;
    state.sourceMode = (snap.sourceMode === "building") ? "building" : "file";
    state.selectedBuildingId = Number.isFinite(Number(snap.selectedBuildingId))
      ? Number(snap.selectedBuildingId)
      : null;
    state.srcName = String(snap.srcName || state.srcName || "");
    state.x = toNum(snap.x, state.x);
    state.y = toNum(snap.y, state.y);
    state.rotation = clamp(toNum(snap.rotation, state.rotation), limits.rotation.min, limits.rotation.max);
    state.scaleX = clamp(toNum(snap.scaleX, state.scaleX), limits.scaleX.min, limits.scaleX.max);
    state.scaleY = clamp(toNum(snap.scaleY, state.scaleY), limits.scaleY.min, limits.scaleY.max);
    state.skewX = clamp(toNum(snap.skewX, state.skewX), limits.skewX.min, limits.skewX.max);
    state.skewY = clamp(toNum(snap.skewY, state.skewY), limits.skewY.min, limits.skewY.max);
    state.opacity = clamp(toNum(snap.opacity, state.opacity), limits.opacity.min, limits.opacity.max);
    state.ghostSize = [0, 1, 2, 4, 9].includes(Number(snap.ghostSize)) ? Number(snap.ghostSize) : state.ghostSize;
    state.viewZoom = clamp(toNum(snap.viewZoom, state.viewZoom), 0.25, 8);
    state.cornerWarp = normalizeCornerWarp(snap.cornerWarp);
    if (el.buildingSelect && state.selectedBuildingId != null) {
      el.buildingSelect.value = String(state.selectedBuildingId);
    }
    updateGhostButtons();
    drawGhostGuide();
    applyTransform();
  }

  function snapshotsEqual(a, b) {
    if (!a || !b) return false;
    return a.sourceMode === b.sourceMode &&
      Number(a.selectedBuildingId) === Number(b.selectedBuildingId) &&
      String(a.srcName || "") === String(b.srcName || "") &&
      Number(a.x) === Number(b.x) &&
      Number(a.y) === Number(b.y) &&
      Number(a.rotation) === Number(b.rotation) &&
      Number(a.scaleX) === Number(b.scaleX) &&
      Number(a.scaleY) === Number(b.scaleY) &&
      Number(a.skewX) === Number(b.skewX) &&
      Number(a.skewY) === Number(b.skewY) &&
      Number(a.opacity) === Number(b.opacity) &&
      Number(a.ghostSize) === Number(b.ghostSize) &&
      Number(a.viewZoom) === Number(b.viewZoom) &&
      CORNER_KEYS.every((k) =>
        Number(a.cornerWarp?.[k]?.x ?? 0) === Number(b.cornerWarp?.[k]?.x ?? 0) &&
        Number(a.cornerWarp?.[k]?.y ?? 0) === Number(b.cornerWarp?.[k]?.y ?? 0));
  }

  function recordHistory() {
    if (!hasImageLoaded) return;
    const snap = getStateSnapshot();
    const last = undoStack.length ? undoStack[undoStack.length - 1] : null;
    if (last && snapshotsEqual(last, snap)) return;
    undoStack.push(snap);
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack.length = 0;
  }

  function undoHistory() {
    if (!undoStack.length || !hasImageLoaded) return;
    const current = getStateSnapshot();
    const prev = undoStack.pop();
    redoStack.push(current);
    applyStateSnapshot(prev);
    setInfo("Undo aplicado.");
  }

  function redoHistory() {
    if (!redoStack.length || !hasImageLoaded) return;
    const current = getStateSnapshot();
    const next = redoStack.pop();
    undoStack.push(current);
    applyStateSnapshot(next);
    setInfo("Redo aplicado.");
  }

  function getBridgeApi() {
    const api = window.__yjPngSpriteEditorApi;
    if (!api || typeof api !== "object") return null;
    if (typeof api.listSpriteHouses !== "function") return null;
    if (typeof api.getSpriteHouseState !== "function") return null;
    if (typeof api.applySpriteHouseEdit !== "function") return null;
    if (typeof api.resetSpriteHouseEdit !== "function") return null;
    return api;
  }

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function toNum(v, fallback = 0) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function round(v, d = 2) {
    const p = 10 ** d;
    return Math.round(v * p) / p;
  }

  function createZeroCornerWarp() {
    return {
      nw: { x: 0, y: 0 },
      ne: { x: 0, y: 0 },
      se: { x: 0, y: 0 },
      sw: { x: 0, y: 0 }
    };
  }

  function normalizeCornerWarp(raw) {
    const out = createZeroCornerWarp();
    if (!raw || typeof raw !== "object") return out;
    for (const key of CORNER_KEYS) {
      const src = raw[key];
      out[key].x = round(toNum(src?.x, 0), 4);
      out[key].y = round(toNum(src?.y, 0), 4);
    }
    return out;
  }

  function setInfo(text) {
    if (!el.info) return;
    el.info.textContent = String(text || "");
  }

  function getWorkspaceSize() {
    const rect = el.workspace.getBoundingClientRect();
    return { width: Math.max(1, rect.width), height: Math.max(1, rect.height) };
  }

  function worldToScreen(point) {
    const ws = getWorkspaceSize();
    const cx = ws.width / 2;
    const cy = ws.height / 2;
    const z = clamp(toNum(state.viewZoom, 1), 0.25, 8);
    return {
      x: cx + ((point.x - cx) * z),
      y: cy + ((point.y - cy) * z)
    };
  }

  function screenToWorld(point) {
    const ws = getWorkspaceSize();
    const cx = ws.width / 2;
    const cy = ws.height / 2;
    const z = clamp(toNum(state.viewZoom, 1), 0.25, 8);
    return {
      x: cx + ((point.x - cx) / z),
      y: cy + ((point.y - cy) / z)
    };
  }

  function worldToScreenFromSnap(point, snap) {
    const ws = getWorkspaceSize();
    const cx = ws.width / 2;
    const cy = ws.height / 2;
    const z = clamp(toNum(snap?.viewZoom, state.viewZoom), 0.25, 8);
    return {
      x: cx + ((point.x - cx) * z),
      y: cy + ((point.y - cy) * z)
    };
  }

  function dist2(a, b) {
    return Math.hypot((a?.x || 0) - (b?.x || 0), (a?.y || 0) - (b?.y || 0));
  }

  function midpoint(a, b) {
    return {
      x: ((a?.x || 0) + (b?.x || 0)) / 2,
      y: ((a?.y || 0) + (b?.y || 0)) / 2
    };
  }

  function solveLinearSystem8x8(matrixIn, vectorIn) {
    const n = 8;
    const m = matrixIn.map((row) => row.slice());
    const v = vectorIn.slice();

    for (let i = 0; i < n; i++) {
      let pivotRow = i;
      let maxAbs = Math.abs(m[i][i]);
      for (let r = i + 1; r < n; r++) {
        const absVal = Math.abs(m[r][i]);
        if (absVal > maxAbs) {
          maxAbs = absVal;
          pivotRow = r;
        }
      }
      if (maxAbs < 1e-10) return null;
      if (pivotRow !== i) {
        [m[i], m[pivotRow]] = [m[pivotRow], m[i]];
        [v[i], v[pivotRow]] = [v[pivotRow], v[i]];
      }

      const pivot = m[i][i];
      for (let c = i; c < n; c++) m[i][c] /= pivot;
      v[i] /= pivot;

      for (let r = 0; r < n; r++) {
        if (r === i) continue;
        const factor = m[r][i];
        if (!factor) continue;
        for (let c = i; c < n; c++) m[r][c] -= factor * m[i][c];
        v[r] -= factor * v[i];
      }
    }

    return v;
  }

  function computeProjectiveCoefficients(srcPoints, dstPoints) {
    const a = [];
    const b = [];
    for (let i = 0; i < 4; i++) {
      const sx = srcPoints[i].x;
      const sy = srcPoints[i].y;
      const dx = dstPoints[i].x;
      const dy = dstPoints[i].y;

      a.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]);
      b.push(dx);
      a.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]);
      b.push(dy);
    }
    const solved = solveLinearSystem8x8(a, b);
    if (!solved) return null;
    return {
      a: solved[0],
      b: solved[1],
      c: solved[2],
      d: solved[3],
      e: solved[4],
      f: solved[5],
      g: solved[6],
      h: solved[7]
    };
  }

  function buildMatrix3dFromCoefficients(coef) {
    if (!coef) return "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";
    const vals = [
      coef.a, coef.d, 0, coef.g,
      coef.b, coef.e, 0, coef.h,
      0, 0, 1, 0,
      coef.c, coef.f, 0, 1
    ].map((n) => round(toNum(n, 0), 10));
    return `matrix3d(${vals.join(",")})`;
  }

  function getRenderGeometry(snap = state) {
    if (!hasImageLoaded) return null;
    const w = Math.max(1, toNum(state.baseWidth, 1));
    const h = Math.max(1, toNum(state.baseHeight, 1));
    const center = worldToScreenFromSnap({ x: snap.x, y: snap.y }, snap);
    const z = clamp(toNum(snap.viewZoom, state.viewZoom), 0.25, 8);
    const sx = toNum(snap.scaleX, state.scaleX) * z;
    const sy = toNum(snap.scaleY, state.scaleY) * z;
    const rad = toNum(snap.rotation, state.rotation) * (Math.PI / 180);
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const tanSkewX = Math.tan(toNum(snap.skewX, state.skewX) * (Math.PI / 180));
    const tanSkewY = Math.tan(toNum(snap.skewY, state.skewY) * (Math.PI / 180));
    const warp = normalizeCornerWarp(snap.cornerWarp);

    const localCorners = {
      nw: { x: -w / 2, y: -h / 2 },
      ne: { x: w / 2, y: -h / 2 },
      se: { x: w / 2, y: h / 2 },
      sw: { x: -w / 2, y: h / 2 }
    };

    const affineCorners = {};
    const corners = {};
    for (const key of CORNER_KEYS) {
      const p = localCorners[key];
      const skewXVal = p.x + (tanSkewX * p.y);
      const skewYVal = p.y + (tanSkewY * p.x);
      const scaledX = skewXVal * sx;
      const scaledY = skewYVal * sy;
      const rotX = (scaledX * cos) - (scaledY * sin);
      const rotY = (scaledX * sin) + (scaledY * cos);
      const base = {
        x: center.x + rotX,
        y: center.y + rotY
      };
      affineCorners[key] = base;
      corners[key] = {
        x: base.x + warp[key].x,
        y: base.y + warp[key].y
      };
    }

    const srcPts = [
      { x: 0, y: 0 },
      { x: w, y: 0 },
      { x: w, y: h },
      { x: 0, y: h }
    ];
    const dstPts = [corners.nw, corners.ne, corners.se, corners.sw];
    const coef = computeProjectiveCoefficients(srcPts, dstPts);
    const matrix3d = buildMatrix3dFromCoefficients(coef);

    return {
      width: w,
      height: h,
      center,
      affineCorners,
      corners,
      matrix3d,
      projective: coef
    };
  }

  function resizeCanvasToWorkspace(canvas) {
    if (!canvas) return { width: 1, height: 1, dpr: 1 };
    const ws = getWorkspaceSize();
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    const pixelW = Math.max(1, Math.round(ws.width * dpr));
    const pixelH = Math.max(1, Math.round(ws.height * dpr));
    if (canvas.width !== pixelW || canvas.height !== pixelH) {
      canvas.width = pixelW;
      canvas.height = pixelH;
    }
    return { width: ws.width, height: ws.height, dpr };
  }

  function isoLocal(row, col) {
    return {
      x: (col - row) * (ISO_TILE_W / 2),
      y: (col + row) * (ISO_TILE_H / 2)
    };
  }

  function drawIsoGrid() {
    const dims = resizeCanvasToWorkspace(el.gridCanvas);
    const ctx = el.gridCanvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dims.dpr, 0, 0, dims.dpr, 0, 0);
    ctx.clearRect(0, 0, dims.width, dims.height);
    ctx.fillStyle = "#79b44a";
    ctx.fillRect(0, 0, dims.width, dims.height);

    const cx = dims.width / 2;
    const cy = dims.height / 2;
    const z = clamp(toNum(state.viewZoom, 1), 0.25, 8);
    const tileW = ISO_TILE_W * z;
    const tileH = ISO_TILE_H * z;
    const maxIdx = Math.ceil((dims.width + dims.height) / Math.max(1, tileH)) + 8;

    const isoZoomed = (row, col) => ({
      x: (col - row) * (tileW / 2),
      y: (col + row) * (tileH / 2)
    });

    const drawFamily = (isRowFamily) => {
      for (let k = -maxIdx; k <= maxIdx; k++) {
        const a = isRowFamily ? isoZoomed(k, -maxIdx) : isoZoomed(-maxIdx, k);
        const b = isRowFamily ? isoZoomed(k, maxIdx) : isoZoomed(maxIdx, k);
        const major = (k % 5) === 0;
        ctx.beginPath();
        ctx.moveTo(cx + a.x, cy + a.y);
        ctx.lineTo(cx + b.x, cy + b.y);
        ctx.lineWidth = major ? 1.5 : 1;
        ctx.strokeStyle = major ? "rgba(94,143,60,0.55)" : "rgba(110,166,70,0.55)";
        ctx.stroke();
      }
    };

    drawFamily(true);
    drawFamily(false);

    const axisTop = { x: cx, y: cy - tileH / 2 };
    const axisRight = { x: cx + tileW / 2, y: cy };
    const axisBottom = { x: cx, y: cy + tileH / 2 };
    const axisLeft = { x: cx - tileW / 2, y: cy };
    ctx.beginPath();
    ctx.moveTo(axisTop.x, axisTop.y);
    ctx.lineTo(axisRight.x, axisRight.y);
    ctx.lineTo(axisBottom.x, axisBottom.y);
    ctx.lineTo(axisLeft.x, axisLeft.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.stroke();
  }

  function updateGhostButtons() {
    const map = [
      [el.ghostOffBtn, 0],
      [el.ghost1Btn, 1],
      [el.ghost2Btn, 2],
      [el.ghost4Btn, 4],
      [el.ghost9Btn, 9]
    ];
    for (const [btn, val] of map) {
      if (!btn) continue;
      btn.classList.toggle("is-active", Number(state.ghostSize) === Number(val));
    }
  }

  function drawGhostGuide() {
    const dims = resizeCanvasToWorkspace(el.ghostCanvas);
    const ctx = el.ghostCanvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dims.dpr, 0, 0, dims.dpr, 0, 0);
    ctx.clearRect(0, 0, dims.width, dims.height);

    const n = Number(state.ghostSize) || 0;
    if (n <= 0) return;

    const centerScreen = worldToScreen({ x: dims.width / 2, y: dims.height / 2 });
    const cx = centerScreen.x;
    const cy = centerScreen.y;
    const z = clamp(toNum(state.viewZoom, 1), 0.25, 8);
    const tileW = ISO_TILE_W * z;
    const tileH = ISO_TILE_H * z;
    const halfW = (n * tileW) / 2;
    const halfH = (n * tileH) / 2;

    const top = { x: cx, y: cy - halfH };
    const right = { x: cx + halfW, y: cy };
    const bottom = { x: cx, y: cy + halfH };
    const left = { x: cx - halfW, y: cy };

    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath();
    ctx.fillStyle = "rgba(56,189,248,0.18)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(125,211,252,0.95)";
    ctx.stroke();

    if (n > 1) {
      const areaCenter = {
        x: cx - ((n - 1) * tileW) / 2,
        y: cy
      };

      const isoZoomed = (row, col) => ({
        x: (col - row) * (tileW / 2),
        y: (col + row) * (tileH / 2)
      });

      for (let r = 1; r < n; r++) {
        const a = isoZoomed(r, 0);
        const b = isoZoomed(r, n);
        ctx.beginPath();
        ctx.moveTo(areaCenter.x + a.x, areaCenter.y + a.y - (tileH / 2));
        ctx.lineTo(areaCenter.x + b.x, areaCenter.y + b.y - (tileH / 2));
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(125,211,252,0.55)";
        ctx.stroke();
      }

      for (let c = 1; c < n; c++) {
        const a = isoZoomed(0, c);
        const b = isoZoomed(n, c);
        ctx.beginPath();
        ctx.moveTo(areaCenter.x + a.x, areaCenter.y + a.y - (tileH / 2));
        ctx.lineTo(areaCenter.x + b.x, areaCenter.y + b.y - (tileH / 2));
        ctx.lineWidth = 1;
        ctx.strokeStyle = "rgba(125,211,252,0.55)";
        ctx.stroke();
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = "700 12px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Ghost ${n}x${n} (${n * ISO_TILE_W}x${n * ISO_TILE_H})`, cx, top.y - 6);
  }

  function fitImageToGhost() {
    if (!hasImageLoaded) {
      setInfo("Carga un PNG primero.");
      return;
    }
    const n = Number(state.ghostSize) || 0;
    if (n <= 0) {
      setInfo("Activa un ghost (1x1, 2x2, 4x4 o 9x9).");
      return;
    }
    recordHistory();
    const targetW = n * ISO_TILE_W;
    const targetH = n * ISO_TILE_H;
    const fitScale = Math.min(targetW / Math.max(1, state.baseWidth), targetH / Math.max(1, state.baseHeight));
    state.scaleX = fitScale;
    state.scaleY = fitScale;
    centerImage();
    applyTransform();
    setInfo(`PNG encajado al ghost ${n}x${n}.`);
  }

  function hideHandles() {
    if (handleBoxNode) handleBoxNode.style.display = "none";
    for (const key of HANDLE_KEYS) {
      const node = handleNodes[key];
      if (node) node.style.display = "none";
    }
  }

  function updateHandleOverlay() {
    if (!hasImageLoaded || !el.image.classList.contains("is-active")) {
      hideHandles();
      return;
    }
    const geom = getRenderGeometry();
    if (!geom) {
      hideHandles();
      return;
    }
    const c = geom.corners;
    const center = geom.center;
    const all = [c.nw, c.ne, c.se, c.sw];
    const left = Math.min(...all.map((p) => p.x));
    const top = Math.min(...all.map((p) => p.y));
    const right = Math.max(...all.map((p) => p.x));
    const bottom = Math.max(...all.map((p) => p.y));
    const edgeTop = midpoint(c.nw, c.ne);
    const edgeRight = midpoint(c.ne, c.se);
    const edgeBottom = midpoint(c.sw, c.se);
    const edgeLeft = midpoint(c.nw, c.sw);
    const topVec = { x: c.ne.x - c.nw.x, y: c.ne.y - c.nw.y };
    const topLen = Math.max(1, Math.hypot(topVec.x, topVec.y));
    const normalA = { x: -topVec.y / topLen, y: topVec.x / topLen };
    const normalB = { x: -normalA.x, y: -normalA.y };
    const rotA = { x: edgeTop.x + (normalA.x * 26), y: edgeTop.y + (normalA.y * 26) };
    const rotB = { x: edgeTop.x + (normalB.x * 26), y: edgeTop.y + (normalB.y * 26) };
    const rotatePos = (dist2(rotA, center) >= dist2(rotB, center)) ? rotA : rotB;

    if (handleBoxNode) {
      handleBoxNode.style.display = "block";
      handleBoxNode.style.left = `${round(left, 2)}px`;
      handleBoxNode.style.top = `${round(top, 2)}px`;
      handleBoxNode.style.width = `${round(right - left, 2)}px`;
      handleBoxNode.style.height = `${round(bottom - top, 2)}px`;
    }

    const pos = {
      nw: c.nw,
      n: edgeTop,
      ne: c.ne,
      e: edgeRight,
      se: c.se,
      s: edgeBottom,
      sw: c.sw,
      w: edgeLeft,
      rotate: rotatePos
    };

    for (const key of HANDLE_KEYS) {
      const node = handleNodes[key];
      if (!node) continue;
      node.style.display = "block";
      node.style.left = `${round(pos[key].x, 2)}px`;
      node.style.top = `${round(pos[key].y, 2)}px`;
    }
  }

  function beginHandleTransform(e, type) {
    if (!hasImageLoaded) return;
    e.preventDefault();
    e.stopPropagation();
    recordHistory();
    const wsRect = el.workspace.getBoundingClientRect();
    const geom = getRenderGeometry();
    const center = geom?.center || {
      x: wsRect.width / 2,
      y: wsRect.height / 2
    };
    const topWidth = geom ? dist2(geom.corners.nw, geom.corners.ne) : Math.max(1, state.baseWidth);
    const sideHeight = geom ? dist2(geom.corners.nw, geom.corners.sw) : Math.max(1, state.baseHeight);
    activeHandleTransform = {
      type,
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startState: getStateSnapshot(),
      startBoxWidth: Math.max(1, topWidth),
      startBoxHeight: Math.max(1, sideHeight),
      centerX: center.x,
      centerY: center.y,
      startAngleRad: Math.atan2((e.clientY - wsRect.top) - center.y, (e.clientX - wsRect.left) - center.x),
      startDist: Math.max(1, Math.hypot((e.clientX - wsRect.left) - center.x, (e.clientY - wsRect.top) - center.y)),
      startCorners: geom ? {
        nw: { x: geom.corners.nw.x, y: geom.corners.nw.y },
        ne: { x: geom.corners.ne.x, y: geom.corners.ne.y },
        se: { x: geom.corners.se.x, y: geom.corners.se.y },
        sw: { x: geom.corners.sw.x, y: geom.corners.sw.y }
      } : null,
      startWarp: normalizeCornerWarp(state.cornerWarp)
    };
    if (e.target?.setPointerCapture) {
      try { e.target.setPointerCapture(e.pointerId); } catch (_) {}
    }
  }

  function updateActiveHandleTransform(e) {
    if (!activeHandleTransform || activeHandleTransform.pointerId !== e.pointerId) return;
    const t = activeHandleTransform;
    const wsRect = el.workspace.getBoundingClientRect();
    const zoom = clamp(toNum(state.viewZoom, 1), 0.25, 8);
    const dx = (e.clientX - t.startClientX) / zoom;
    const dy = (e.clientY - t.startClientY) / zoom;
    const start = t.startState;

    if (typeof t.type === "string" && t.type.startsWith("distort:")) {
      const cornerKey = t.type.slice(8);
      if (!CORNER_KEYS.includes(cornerKey)) return;
      const localX = e.clientX - wsRect.left;
      const localY = e.clientY - wsRect.top;
      const startCorner = t.startCorners?.[cornerKey];
      if (!startCorner) return;
      const deltaX = localX - startCorner.x;
      const deltaY = localY - startCorner.y;
      const nextWarp = normalizeCornerWarp(t.startWarp);
      nextWarp[cornerKey].x = round(nextWarp[cornerKey].x + deltaX, 2);
      nextWarp[cornerKey].y = round(nextWarp[cornerKey].y + deltaY, 2);
      state.cornerWarp = nextWarp;
      applyTransform();
      return;
    }

    if (t.type === "free") {
      const sx = clamp(start.scaleX + (dx * 0.01), limits.scaleX.min, limits.scaleX.max);
      const sy = clamp(start.scaleY + (dx * 0.01), limits.scaleY.min, limits.scaleY.max);
      state.scaleX = sx;
      state.scaleY = sy;
      state.rotation = clamp(start.rotation + (dy * 0.45), limits.rotation.min, limits.rotation.max);
      applyTransform();
      return;
    }

    if (t.type === "rotate") {
      const localX = e.clientX - wsRect.left;
      const localY = e.clientY - wsRect.top;
      const angle = Math.atan2(localY - t.centerY, localX - t.centerX);
      const delta = (angle - t.startAngleRad) * (180 / Math.PI);
      state.rotation = clamp(start.rotation + delta, limits.rotation.min, limits.rotation.max);
      applyTransform();
      return;
    }

    if (t.type === "move") {
      state.x = round(start.x + dx, 2);
      state.y = round(start.y + dy, 2);
      applyTransform();
      return;
    }

    if (["nw", "ne", "se", "sw"].includes(t.type)) {
      const localX = e.clientX - wsRect.left;
      const localY = e.clientY - wsRect.top;
      const dist = Math.max(1, Math.hypot(localX - t.centerX, localY - t.centerY));
      const ratio = clamp(dist / t.startDist, 0.05, 16);
      state.scaleX = clamp(start.scaleX * ratio, limits.scaleX.min, limits.scaleX.max);
      state.scaleY = clamp(start.scaleY * ratio, limits.scaleY.min, limits.scaleY.max);
      applyTransform();
      return;
    }

    if (t.type === "e" || t.type === "w") {
      const dir = (t.type === "e") ? 1 : -1;
      const ratioX = 1 + ((dir * dx) / Math.max(1, t.startBoxWidth / zoom));
      state.scaleX = clamp(start.scaleX * Math.max(0.05, ratioX), limits.scaleX.min, limits.scaleX.max);
      applyTransform();
      return;
    }

    if (t.type === "n" || t.type === "s") {
      const dir = (t.type === "s") ? 1 : -1;
      const ratioY = 1 + ((dir * dy) / Math.max(1, t.startBoxHeight / zoom));
      state.scaleY = clamp(start.scaleY * Math.max(0.05, ratioY), limits.scaleY.min, limits.scaleY.max);
      applyTransform();
    }
  }

  function endHandleTransform(e) {
    if (!activeHandleTransform || activeHandleTransform.pointerId !== e.pointerId) return;
    activeHandleTransform = null;
    el.workspace.classList.remove("is-free-transform");
    updateHandleOverlay();
  }

  function centerImage() {
    const ws = getWorkspaceSize();
    state.x = round(ws.width / 2, 2);
    state.y = round(ws.height / 2, 2);
  }

  function resetTransform(keepPosition = false) {
    if (!keepPosition) centerImage();
    state.rotation = 0;
    state.scaleX = 1;
    state.scaleY = 1;
    state.skewX = 0;
    state.skewY = 0;
    state.opacity = 1;
    state.cornerWarp = createZeroCornerWarp();
  }

  function getBuildingPatchFromState() {
    const ws = getWorkspaceSize();
    const centerX = ws.width / 2;
    const centerY = ws.height / 2;
    return {
      offsetX: round(state.x - centerX, 2),
      offsetY: round(state.y - centerY, 2),
      scaleX: round(state.scaleX, 6),
      scaleY: round(state.scaleY, 6),
      rotationDeg: round(state.rotation, 3),
      skewXDeg: round(state.skewX, 3),
      skewYDeg: round(state.skewY, 3),
      opacityMul: round(state.opacity, 4),
      cornerWarp: normalizeCornerWarp(state.cornerWarp)
    };
  }

  function populateBuildingList(keepSelection = true) {
    if (!el.buildingSelect) return;
    const api = getBridgeApi();
    const prev = keepSelection ? String(el.buildingSelect.value || "") : "";
    el.buildingSelect.innerHTML = "";

    const baseOpt = document.createElement("option");
    baseOpt.value = "";
    baseOpt.textContent = "-- Sin seleccionar --";
    el.buildingSelect.appendChild(baseOpt);

    if (!api) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No disponible (juego no listo)";
      el.buildingSelect.appendChild(opt);
      return;
    }

    const list = Array.isArray(api.listSpriteHouses()) ? api.listSpriteHouses() : [];
    for (const item of list) {
      const opt = document.createElement("option");
      opt.value = String(item.id);
      const label = String(item.label || item.typeKey || "Casa");
      opt.textContent = `#${item.id} ${label}`;
      el.buildingSelect.appendChild(opt);
    }

    if (prev && [...el.buildingSelect.options].some((o) => o.value === prev)) {
      el.buildingSelect.value = prev;
    } else if (state.selectedBuildingId != null) {
      const idStr = String(state.selectedBuildingId);
      if ([...el.buildingSelect.options].some((o) => o.value === idStr)) {
        el.buildingSelect.value = idStr;
      }
    }
  }

  function persistState() {
    try {
      const payload = {
        sourceMode: state.sourceMode || "file",
        selectedBuildingId: state.selectedBuildingId,
        srcName: state.srcName || "",
        x: state.x,
        y: state.y,
        rotation: state.rotation,
        scaleX: state.scaleX,
        scaleY: state.scaleY,
        skewX: state.skewX,
        skewY: state.skewY,
        opacity: state.opacity,
        ghostSize: state.ghostSize,
        viewZoom: state.viewZoom,
        cornerWarp: normalizeCornerWarp(state.cornerWarp),
        lockScale: !!el.lockScale?.checked
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {
      // Ignore storage failures.
    }
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      state.sourceMode = (saved.sourceMode === "building") ? "building" : "file";
      state.selectedBuildingId = Number.isFinite(Number(saved.selectedBuildingId))
        ? Number(saved.selectedBuildingId)
        : null;
      state.x = toNum(saved.x, state.x);
      state.y = toNum(saved.y, state.y);
      state.rotation = clamp(toNum(saved.rotation, state.rotation), limits.rotation.min, limits.rotation.max);
      state.scaleX = clamp(toNum(saved.scaleX, state.scaleX), limits.scaleX.min, limits.scaleX.max);
      state.scaleY = clamp(toNum(saved.scaleY, state.scaleY), limits.scaleY.min, limits.scaleY.max);
      state.skewX = clamp(toNum(saved.skewX, state.skewX), limits.skewX.min, limits.skewX.max);
      state.skewY = clamp(toNum(saved.skewY, state.skewY), limits.skewY.min, limits.skewY.max);
      state.opacity = clamp(toNum(saved.opacity, state.opacity), limits.opacity.min, limits.opacity.max);
      state.ghostSize = [0, 1, 2, 4, 9].includes(Number(saved.ghostSize)) ? Number(saved.ghostSize) : state.ghostSize;
      state.viewZoom = clamp(toNum(saved.viewZoom, state.viewZoom), 0.25, 8);
      state.cornerWarp = normalizeCornerWarp(saved.cornerWarp);
      state.srcName = String(saved.srcName || "");
      if (el.lockScale) el.lockScale.checked = !!saved.lockScale;
    } catch (_) {
      // Ignore malformed storage.
    }
  }

  function syncInputs() {
    if (el.rotRange) el.rotRange.value = String(round(state.rotation, 2));
    if (el.rotInput) el.rotInput.value = String(round(state.rotation, 2));
    if (el.scaleXRange) el.scaleXRange.value = String(round(state.scaleX, 4));
    if (el.scaleXInput) el.scaleXInput.value = String(round(state.scaleX, 4));
    if (el.scaleYRange) el.scaleYRange.value = String(round(state.scaleY, 4));
    if (el.scaleYInput) el.scaleYInput.value = String(round(state.scaleY, 4));
    if (el.skewXRange) el.skewXRange.value = String(round(state.skewX, 2));
    if (el.skewXInput) el.skewXInput.value = String(round(state.skewX, 2));
    if (el.skewYRange) el.skewYRange.value = String(round(state.skewY, 2));
    if (el.skewYInput) el.skewYInput.value = String(round(state.skewY, 2));
    if (el.xInput) el.xInput.value = String(round(state.x, 2));
    if (el.yInput) el.yInput.value = String(round(state.y, 2));
    if (el.opacityRange) el.opacityRange.value = String(round(state.opacity, 3));
    if (el.opacityInput) el.opacityInput.value = String(round(state.opacity, 3));
    if (el.zoomRange) el.zoomRange.value = String(round(state.viewZoom, 4));
    if (el.zoomInput) el.zoomInput.value = String(round(state.viewZoom, 4));
  }

  function buildCodePayload() {
    const wsRect = el.workspace.getBoundingClientRect();
    const geom = getRenderGeometry();
    const corners = geom?.corners || createZeroCornerWarp();
    const all = [corners.nw, corners.ne, corners.se, corners.sw];
    const bboxLeft = Math.min(...all.map((p) => p.x));
    const bboxTop = Math.min(...all.map((p) => p.y));
    const bboxRight = Math.max(...all.map((p) => p.x));
    const bboxBottom = Math.max(...all.map((p) => p.y));
    const bboxWidth = bboxRight - bboxLeft;
    const bboxHeight = bboxBottom - bboxTop;
    const cornerWarp = normalizeCornerWarp(state.cornerWarp);

    return {
      editorTarget: {
        mode: state.sourceMode || "file",
        buildingId: state.selectedBuildingId
      },
      sourcePng: state.srcName || "(sin nombre)",
      originalSize: {
        width: round(state.baseWidth, 2),
        height: round(state.baseHeight, 2)
      },
      transform: {
        x: round(state.x, 2),
        y: round(state.y, 2),
        rotationDeg: round(state.rotation, 3),
        scaleX: round(state.scaleX, 6),
        scaleY: round(state.scaleY, 6),
        skewXDeg: round(state.skewX, 3),
        skewYDeg: round(state.skewY, 3),
        opacity: round(state.opacity, 4),
        cornerWarp,
        matrix3d: geom?.matrix3d || ""
      },
      scaledSize: {
        width: round(state.baseWidth * state.scaleX, 2),
        height: round(state.baseHeight * state.scaleY, 2)
      },
      renderCorners: {
        nw: { x: round(corners.nw.x, 2), y: round(corners.nw.y, 2) },
        ne: { x: round(corners.ne.x, 2), y: round(corners.ne.y, 2) },
        se: { x: round(corners.se.x, 2), y: round(corners.se.y, 2) },
        sw: { x: round(corners.sw.x, 2), y: round(corners.sw.y, 2) }
      },
      workspaceBoundingBox: {
        left: round(bboxLeft, 2),
        top: round(bboxTop, 2),
        width: round(bboxWidth, 2),
        height: round(bboxHeight, 2)
      },
      workspaceSize: {
        width: round(wsRect.width, 2),
        height: round(wsRect.height, 2)
      },
      editorView: {
        zoom: round(state.viewZoom, 4)
      },
      ghost: {
        size: Number(state.ghostSize) || 0,
        width: (Number(state.ghostSize) || 0) * ISO_TILE_W,
        height: (Number(state.ghostSize) || 0) * ISO_TILE_H
      },
      gameSpriteEditPatch: (state.sourceMode === "building" && state.selectedBuildingId != null)
        ? getBuildingPatchFromState()
        : null
    };
  }

  function updateConsole() {
    if (!el.console) return;
    if (!hasImageLoaded) {
      el.console.textContent =
        "Sin PNG cargado.\n" +
        "1) Carga un PNG o selecciona una casa colocada.\n" +
        "2) Arrastra para mover.\n" +
        "3) Ajusta rotacion, escala y distorsion.\n" +
        "4) Ctrl + arrastra esquina para perspectiva.\n" +
        "5) Copia el codigo generado.";
      return;
    }

    const payload = buildCodePayload();
    const cssTransform =
      "left: 0px;\n" +
      "top: 0px;\n" +
      "transform-origin: 0 0;\n" +
      `transform: ${payload.transform.matrix3d};\n` +
      `opacity: ${payload.transform.opacity};`;

    const phaserHint =
      "const cfg = " + JSON.stringify(payload.transform, null, 2) + ";\n" +
      "sprite.setPosition(cfg.x, cfg.y);\n" +
      "sprite.setScale(cfg.scaleX, cfg.scaleY);\n" +
      "sprite.setAngle(cfg.rotationDeg);\n" +
      "sprite.setAlpha(cfg.opacity);";

    const gamePatchHint = payload.gameSpriteEditPatch
      ? "\n\n=== PATCH CASA EN JUEGO ===\n" +
        "api.applySpriteHouseEdit(" + JSON.stringify(payload.editorTarget.buildingId) + ", " +
        JSON.stringify(payload.gameSpriteEditPatch, null, 2) + ");"
      : "";

    el.console.textContent =
      "=== ESTADO ACTUAL ===\n" +
      JSON.stringify(payload, null, 2) +
      "\n\n=== CSS TRANSFORM ===\n" +
      cssTransform +
      "\n\n=== REFERENCIA PHASER ===\n" +
      phaserHint +
      gamePatchHint;
  }

  function applyTransform() {
    if (!hasImageLoaded) {
      el.image.classList.remove("is-active");
      syncInputs();
      drawGhostGuide();
      hideHandles();
      updateConsole();
      persistState();
      return;
    }

    el.image.classList.add("is-active");
    state.cornerWarp = normalizeCornerWarp(state.cornerWarp);
    const geom = getRenderGeometry();
    el.image.style.left = "0px";
    el.image.style.top = "0px";
    el.image.style.transformOrigin = "0 0";
    el.image.style.opacity = String(round(state.opacity, 4));
    el.image.style.transform = geom?.matrix3d || "matrix3d(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1)";

    if (state.sourceMode === "building" && state.selectedBuildingId != null) {
      const api = getBridgeApi();
      if (api) {
        const patch = getBuildingPatchFromState();
        try {
          api.applySpriteHouseEdit(state.selectedBuildingId, patch);
        } catch (_) {
          // Ignore bridge errors to keep editor usable.
        }
      }
    }

    syncInputs();
    drawGhostGuide();
    updateHandleOverlay();
    updateConsole();
    persistState();
  }

  function setMode(open) {
    const isOpen = !!open;
    document.body.classList.toggle("png-editor-mode", isOpen);
    el.overlay.hidden = !isOpen;
    el.toggleBtn.textContent = isOpen ? "Salir Editor PNG" : "Modo Editor PNG";
    if (!isOpen) {
      hideHandles();
      activeHandleTransform = null;
      el.workspace.classList.remove("is-free-transform");
    }
    if (isOpen) {
      drawIsoGrid();
      drawGhostGuide();
      populateBuildingList(true);
      if (state.sourceMode === "building" && state.selectedBuildingId != null) {
        if (el.buildingSelect) el.buildingSelect.value = String(state.selectedBuildingId);
        if (!hasImageLoaded) loadSelectedBuilding();
      }
      updateHandleOverlay();
      updateConsole();
    }
  }

  function setNumberProp(name, value, opts = {}) {
    recordHistory();
    const n = toNum(value, state[name]);
    if (!Object.prototype.hasOwnProperty.call(state, name)) return;

    if (name === "x" || name === "y") {
      state[name] = n;
    } else if (Object.prototype.hasOwnProperty.call(limits, name)) {
      state[name] = clamp(n, limits[name].min, limits[name].max);
    } else {
      state[name] = n;
    }

    if (opts.syncScale && el.lockScale?.checked) {
      if (name === "scaleX") state.scaleY = state.scaleX;
      if (name === "scaleY") state.scaleX = state.scaleY;
    }

    applyTransform();
  }

  function bindRangeInput(rangeEl, inputEl, prop, opts = {}) {
    if (rangeEl) {
      rangeEl.addEventListener("input", () => {
        setNumberProp(prop, rangeEl.value, opts);
      });
    }

    if (inputEl) {
      inputEl.addEventListener("input", () => {
        setNumberProp(prop, inputEl.value, opts);
      });
    }
  }

  function releaseObjectUrl() {
    if (!currentObjectUrl) return;
    URL.revokeObjectURL(currentObjectUrl);
    currentObjectUrl = "";
  }

  function loadImageFromSource(src, sourceLabel, onLoaded) {
    el.image.onload = () => {
      hasImageLoaded = true;
      state.baseWidth = toNum(el.image.naturalWidth, 0);
      state.baseHeight = toNum(el.image.naturalHeight, 0);
      if (typeof onLoaded === "function") onLoaded();
      setInfo(
        `${sourceLabel} | ${state.baseWidth}x${state.baseHeight} px | ` +
        "Arrastra en el lienzo para mover."
      );
      applyTransform();
    };

    el.image.onerror = () => {
      hasImageLoaded = false;
      state.baseWidth = 0;
      state.baseHeight = 0;
      setInfo(`No se pudo cargar: ${sourceLabel}`);
      applyTransform();
    };

    el.image.src = src;
  }

  function handlePngFile(file) {
    if (!file) return;
    if (!/\.png$/i.test(file.name) && String(file.type || "").toLowerCase() !== "image/png") {
      setInfo("Solo se permiten archivos PNG.");
      return;
    }

    if (hasImageLoaded) recordHistory();
    state.sourceMode = "file";
    state.selectedBuildingId = null;
    if (el.buildingSelect) el.buildingSelect.value = "";
    releaseObjectUrl();
    currentObjectUrl = URL.createObjectURL(file);
    state.srcName = file.name;

    loadImageFromSource(currentObjectUrl, `PNG cargado: ${state.srcName}`, () => {
      resetTransform(false);
    });
  }

  function loadSelectedBuilding() {
    const api = getBridgeApi();
    if (!api) {
      setInfo("API del juego no disponible todavia.");
      return;
    }
    const id = Number(el.buildingSelect?.value || 0);
    if (!Number.isFinite(id) || id <= 0) {
      setInfo("Selecciona una casa colocada.");
      return;
    }
    const house = api.getSpriteHouseState(id);
    if (!house || !house.imagePath) {
      setInfo("No se pudo obtener la casa seleccionada.");
      return;
    }

    if (hasImageLoaded) recordHistory();
    state.sourceMode = "building";
    state.selectedBuildingId = id;
    state.srcName = String(house.imagePath || `casa_${id}.png`);
    releaseObjectUrl();

    loadImageFromSource(state.srcName, `Casa #${id} cargada`, () => {
      const edit = house.edit || {};
      centerImage();
      const ws = getWorkspaceSize();
      state.x = round((ws.width / 2) + toNum(edit.offsetX, 0), 2);
      state.y = round((ws.height / 2) + toNum(edit.offsetY, 0), 2);
      state.rotation = clamp(toNum(edit.rotationDeg, 0), limits.rotation.min, limits.rotation.max);
      state.scaleX = clamp(toNum(edit.scaleX, 1), limits.scaleX.min, limits.scaleX.max);
      state.scaleY = clamp(toNum(edit.scaleY, 1), limits.scaleY.min, limits.scaleY.max);
      state.skewX = clamp(toNum(edit.skewXDeg, 0), limits.skewX.min, limits.skewX.max);
      state.skewY = clamp(toNum(edit.skewYDeg, 0), limits.skewY.min, limits.skewY.max);
      state.opacity = clamp(toNum(edit.opacityMul, 1), limits.opacity.min, limits.opacity.max);
      state.cornerWarp = normalizeCornerWarp(edit.cornerWarp);
    });
  }

  async function copyCurrentCode() {
    const payload = hasImageLoaded ? buildCodePayload() : {
      message: "Sin PNG cargado."
    };
    const text = JSON.stringify(payload, null, 2);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
      }
      setInfo("Codigo copiado al portapapeles.");
    } catch (_) {
      setInfo("No se pudo copiar automaticamente. Usa el bloque de consola.");
    }
  }

  function onImagePointerDown(e) {
    if (!hasImageLoaded) return;
    e.preventDefault();
    const wantsFree = !!(e.ctrlKey || e.metaKey);
    beginHandleTransform(e, wantsFree ? "free" : "move");
    el.workspace.classList.toggle("is-free-transform", wantsFree);
    if (!wantsFree) el.image.classList.add("is-dragging");
    dragging = { pointerId: e.pointerId };
    if (el.image.setPointerCapture) el.image.setPointerCapture(e.pointerId);
  }

  function onImagePointerMove(e) {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    updateActiveHandleTransform(e);
  }

  function onImagePointerUp(e) {
    if (!dragging || dragging.pointerId !== e.pointerId) return;
    el.image.classList.remove("is-dragging");
    dragging = null;
    if (el.image.hasPointerCapture(e.pointerId)) el.image.releasePointerCapture(e.pointerId);
    endHandleTransform(e);
    applyTransform();
  }

  restoreState();
  centerImage();
  syncInputs();
  updateGhostButtons();
  drawIsoGrid();
  drawGhostGuide();
  populateBuildingList(true);
  updateConsole();

  bindRangeInput(el.rotRange, el.rotInput, "rotation");
  bindRangeInput(el.scaleXRange, el.scaleXInput, "scaleX", { syncScale: true });
  bindRangeInput(el.scaleYRange, el.scaleYInput, "scaleY", { syncScale: true });
  bindRangeInput(el.skewXRange, el.skewXInput, "skewX");
  bindRangeInput(el.skewYRange, el.skewYInput, "skewY");
  bindRangeInput(el.opacityRange, el.opacityInput, "opacity");

  if (el.xInput) {
    el.xInput.addEventListener("input", () => setNumberProp("x", el.xInput.value));
  }
  if (el.yInput) {
    el.yInput.addEventListener("input", () => setNumberProp("y", el.yInput.value));
  }

  if (el.lockScale) {
    el.lockScale.addEventListener("change", () => {
      if (el.lockScale.checked) {
        state.scaleY = state.scaleX;
        applyTransform();
      }
      persistState();
    });
  }

  if (el.fileInput) {
    el.fileInput.addEventListener("change", () => {
      const file = el.fileInput.files?.[0];
      if (!file) return;
      handlePngFile(file);
    });
  }

  if (el.refreshBuildingsBtn) {
    el.refreshBuildingsBtn.addEventListener("click", () => {
      populateBuildingList(true);
      setInfo("Lista de casas refrescada.");
    });
  }

  if (el.buildingSelect) {
    el.buildingSelect.addEventListener("change", () => {
      const id = Number(el.buildingSelect.value || 0);
      state.selectedBuildingId = Number.isFinite(id) && id > 0 ? id : null;
      persistState();
      updateConsole();
    });
  }

  if (el.loadBuildingBtn) {
    el.loadBuildingBtn.addEventListener("click", () => {
      loadSelectedBuilding();
    });
  }

  if (el.resetBuildingBtn) {
    el.resetBuildingBtn.addEventListener("click", () => {
      const api = getBridgeApi();
      const id = Number(el.buildingSelect?.value || 0);
      if (!api || !Number.isFinite(id) || id <= 0) {
        setInfo("Selecciona una casa para resetear.");
        return;
      }
      if (hasImageLoaded) recordHistory();
      api.resetSpriteHouseEdit(id);
      loadSelectedBuilding();
      setInfo(`Casa #${id} reseteada.`);
    });
  }

  if (el.centerBtn) {
    el.centerBtn.addEventListener("click", () => {
      recordHistory();
      centerImage();
      applyTransform();
    });
  }

  if (el.resetBtn) {
    el.resetBtn.addEventListener("click", () => {
      recordHistory();
      resetTransform(false);
      applyTransform();
    });
  }

  if (el.copyBtn) {
    el.copyBtn.addEventListener("click", () => {
      copyCurrentCode();
    });
  }

  const setViewZoom = (value, fromWheel = false) => {
    const z = clamp(toNum(value, state.viewZoom), 0.25, 8);
    if (Math.abs(z - state.viewZoom) < 0.000001) return;
    if (!fromWheel) recordHistory();
    state.viewZoom = z;
    drawIsoGrid();
    drawGhostGuide();
    applyTransform();
  };

  if (el.zoomRange) {
    el.zoomRange.addEventListener("input", () => {
      setViewZoom(el.zoomRange.value);
    });
  }
  if (el.zoomInput) {
    el.zoomInput.addEventListener("input", () => {
      setViewZoom(el.zoomInput.value);
    });
  }

  el.workspace.addEventListener("wheel", (e) => {
    if (el.overlay.hidden) return;
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : (1 / 1.08);
    setViewZoom(state.viewZoom * factor, true);
  }, { passive: false });

  const setGhostSize = (size) => {
    const next = [0, 1, 2, 4, 9].includes(Number(size)) ? Number(size) : 0;
    if (Number(state.ghostSize) === next) return;
    recordHistory();
    state.ghostSize = next;
    updateGhostButtons();
    drawGhostGuide();
    persistState();
    updateConsole();
  };

  if (el.ghostOffBtn) el.ghostOffBtn.addEventListener("click", () => setGhostSize(0));
  if (el.ghost1Btn) el.ghost1Btn.addEventListener("click", () => setGhostSize(1));
  if (el.ghost2Btn) el.ghost2Btn.addEventListener("click", () => setGhostSize(2));
  if (el.ghost4Btn) el.ghost4Btn.addEventListener("click", () => setGhostSize(4));
  if (el.ghost9Btn) el.ghost9Btn.addEventListener("click", () => setGhostSize(9));
  if (el.fitGhostBtn) el.fitGhostBtn.addEventListener("click", () => fitImageToGhost());

  el.image.addEventListener("pointerdown", onImagePointerDown);
  el.image.addEventListener("pointermove", onImagePointerMove);
  el.image.addEventListener("pointerup", onImagePointerUp);
  el.image.addEventListener("pointercancel", onImagePointerUp);

  for (const key of HANDLE_KEYS) {
    const node = handleNodes[key];
    if (!node) continue;
    node.addEventListener("pointerdown", (e) => {
      const wantsCornerWarp = (e.ctrlKey || e.metaKey) && CORNER_KEYS.includes(key);
      beginHandleTransform(e, wantsCornerWarp ? `distort:${key}` : key);
      el.workspace.classList.toggle("is-free-transform", wantsCornerWarp);
    });
    node.addEventListener("pointermove", (e) => {
      updateActiveHandleTransform(e);
    });
    node.addEventListener("pointerup", (e) => {
      endHandleTransform(e);
      applyTransform();
    });
    node.addEventListener("pointercancel", (e) => {
      endHandleTransform(e);
      applyTransform();
    });
  }

  el.toggleBtn.addEventListener("click", () => {
    setMode(el.overlay.hidden);
  });

  if (el.closeBtn) {
    el.closeBtn.addEventListener("click", () => setMode(false));
  }

  window.addEventListener("resize", () => {
    drawIsoGrid();
    drawGhostGuide();
    updateHandleOverlay();
    updateConsole();
  });

  window.addEventListener("pointermove", (e) => {
    updateActiveHandleTransform(e);
  });

  window.addEventListener("pointerup", (e) => {
    endHandleTransform(e);
  });

  window.addEventListener("keydown", (e) => {
    if (el.overlay.hidden) return;
    const key = String(e.key || "").toLowerCase();
    if ((e.ctrlKey || e.metaKey) && !e.altKey) {
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) redoHistory();
        else undoHistory();
        return;
      }
      if (key === "y") {
        e.preventDefault();
        redoHistory();
        return;
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setMode(false);
      return;
    }
    if (!hasImageLoaded) return;

    const step = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      recordHistory();
      state.x -= step;
      applyTransform();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      recordHistory();
      state.x += step;
      applyTransform();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      recordHistory();
      state.y -= step;
      applyTransform();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      recordHistory();
      state.y += step;
      applyTransform();
    }
  });

  if (typeof ResizeObserver !== "undefined") {
    const ro = new ResizeObserver(() => {
      drawIsoGrid();
      drawGhostGuide();
      updateConsole();
    });
    ro.observe(el.workspace);
  }

  window.addEventListener("beforeunload", () => {
    releaseObjectUrl();
  });
})();
