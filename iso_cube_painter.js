(() => {
  "use strict";

  const el = {
    canvas: document.getElementById("isoPainterCanvas"),
    hud: document.getElementById("isoHud"),
    stateConsole: document.getElementById("isoStateConsole"),
    copyStateBtn: document.getElementById("isoCopyStateBtn"),
    exportBtn: document.getElementById("isoExportBtn"),
    footprintSelect: document.getElementById("isoFootprintSelect"),
    heightInput: document.getElementById("isoHeightInput"),
    applySizeBtn: document.getElementById("isoApplySizeBtn"),
    newDocBtn: document.getElementById("isoNewDocBtn"),
    toolButtons: [...document.querySelectorAll(".iso-tool-btn")],
    brushColor: document.getElementById("isoBrushColor"),
    brushSize: document.getElementById("isoBrushSize"),
    brushOpacity: document.getElementById("isoBrushOpacity"),
    faceModeSelect: document.getElementById("isoFaceModeSelect"),
    layerList: document.getElementById("isoLayerList"),
    layerAddBtn: document.getElementById("isoLayerAddBtn"),
    layerDupBtn: document.getElementById("isoLayerDupBtn"),
    layerDelBtn: document.getElementById("isoLayerDelBtn"),
    layerUpBtn: document.getElementById("isoLayerUpBtn"),
    layerDownBtn: document.getElementById("isoLayerDownBtn"),
    layerNameInput: document.getElementById("isoLayerNameInput"),
    layerOpacity: document.getElementById("isoLayerOpacity"),
    importFaceSelect: document.getElementById("isoImportFaceSelect"),
    importFaceInput: document.getElementById("isoImportFaceInput"),
    clearFaceBtn: document.getElementById("isoClearFaceBtn"),
    clearLayerBtn: document.getElementById("isoClearLayerBtn")
  };
  if (!el.canvas) return;

  const FACES = ["top", "left", "right"];
  const TOOLS = ["brush", "eraser", "fill", "picker", "pan"];
  const ISO_W = 64;
  const ISO_H = 32;
  const TEX = 64;
  const MAX_HISTORY = 24;

  const s = {
    footprint: 2,
    height: 2,
    zoom: 1,
    panX: 0,
    panY: 0,
    tool: "brush",
    faceMode: "auto",
    color: "#5b6579",
    size: 12,
    alpha: 1,
    layers: [],
    activeLayerId: null,
    layerIndex: 1,
    pointer: null,
    hover: null,
    dpr: 1,
    showGrid: true,
    spacePan: false,
    history: [],
    historyIndex: -1,
    pending: null,
    uiDirty: true
  };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const n = (v, f = 0) => (Number.isFinite(Number(v)) ? Number(v) : f);
  const r = (v, d = 2) => Math.round(v * (10 ** d)) / (10 ** d);

  function hexToRgb(hex) {
    const h = String(hex || "").replace("#", "").trim();
    const m = (h.length === 3 ? h.split("").map((x) => x + x).join("") : h.padEnd(6, "0")).slice(0, 6);
    return {
      r: parseInt(m.slice(0, 2), 16),
      g: parseInt(m.slice(2, 4), 16),
      b: parseInt(m.slice(4, 6), 16)
    };
  }

  function faceDims(face, fp = s.footprint, h = s.height) {
    if (face === "top") return { w: fp * TEX, h: fp * TEX };
    return { w: fp * TEX, h: h * TEX };
  }

  function mkCanvas(w, h) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    return c;
  }

  function mkLayer(name) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const layer = { id, name, visible: true, opacity: 1, faces: {} };
    for (const f of FACES) {
      const d = faceDims(f);
      layer.faces[f] = mkCanvas(d.w, d.h);
    }
    return layer;
  }

  function getLayer(id = s.activeLayerId) {
    return s.layers.find((x) => x.id === id) || null;
  }

  function ensureLayer() {
    if (s.layers.length) return;
    const l = mkLayer(`Capa ${s.layerIndex++}`);
    s.layers.push(l);
    s.activeLayerId = l.id;
  }

  function iso(x, y, z) {
    return {
      x: (x - y) * (ISO_W / 2),
      y: (x + y) * (ISO_H / 2) - (z * ISO_H)
    };
  }

  function view() {
    const rect = el.canvas.getBoundingClientRect();
    return {
      w: Math.max(1, rect.width),
      h: Math.max(1, rect.height),
      cx: rect.width / 2,
      cy: rect.height / 2
    };
  }

  function toScreen(p, v) {
    return {
      x: v.cx + s.panX + (p.x * s.zoom),
      y: v.cy + s.panY + (p.y * s.zoom)
    };
  }

  function geometry(v) {
    const nfp = Math.max(1, Math.round(s.footprint));
    const hz = Math.max(1, Math.round(s.height));
    const t0 = iso(0, 0, hz);
    const t1 = iso(nfp, 0, hz);
    const t2 = iso(nfp, nfp, hz);
    const t3 = iso(0, nfp, hz);
    const b1 = iso(nfp, 0, 0);
    const b2 = iso(nfp, nfp, 0);
    const b3 = iso(0, nfp, 0);
    return {
      top: [t0, t1, t2, t3].map((p) => toScreen(p, v)),
      right: [t1, t2, b2, b1].map((p) => toScreen(p, v)),
      left: [t3, t2, b2, b3].map((p) => toScreen(p, v))
    };
  }

  function drawGrid(ctx, v) {
    ctx.fillStyle = "#7eb74f";
    ctx.fillRect(0, 0, v.w, v.h);
    const tw = ISO_W * s.zoom;
    const th = ISO_H * s.zoom;
    const max = Math.ceil((v.w + v.h) / Math.max(1, th)) + 10;
    const cx = v.cx + s.panX;
    const cy = v.cy + s.panY;
    const p = (r0, c0) => ({ x: cx + ((c0 - r0) * (tw / 2)), y: cy + ((c0 + r0) * (th / 2)) });
    for (let k = -max; k <= max; k++) {
      const a = p(k, -max), b = p(k, max);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = (k % 5 === 0) ? "rgba(88,136,55,.56)" : "rgba(100,153,61,.55)";
      ctx.lineWidth = (k % 5 === 0) ? 1.5 : 1;
      ctx.stroke();
    }
    for (let k = -max; k <= max; k++) {
      const a = p(-max, k), b = p(max, k);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
      ctx.strokeStyle = (k % 5 === 0) ? "rgba(88,136,55,.56)" : "rgba(100,153,61,.55)";
      ctx.lineWidth = (k % 5 === 0) ? 1.5 : 1;
      ctx.stroke();
    }
  }

  function drawQuadImage(ctx, img, q, alpha = 1) {
    const w = img.width, h = img.height;
    if (!w || !h) return;
    const p0 = q[0], p1 = q[1], p3 = q[3];
    const a = (p1.x - p0.x) / w, b = (p1.y - p0.y) / w, c = (p3.x - p0.x) / h, d = (p3.y - p0.y) / h;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(q[0].x, q[0].y); ctx.lineTo(q[1].x, q[1].y); ctx.lineTo(q[2].x, q[2].y); ctx.lineTo(q[3].x, q[3].y);
    ctx.closePath(); ctx.clip();
    ctx.transform(a, b, c, d, p0.x, p0.y);
    ctx.globalAlpha = clamp(alpha, 0, 1);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, w, h);
    ctx.restore();
  }

  function drawOutline(ctx, q, col, w = 1.2) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(q[0].x, q[0].y); ctx.lineTo(q[1].x, q[1].y); ctx.lineTo(q[2].x, q[2].y); ctx.lineTo(q[3].x, q[3].y);
    ctx.closePath();
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.stroke();
    ctx.restore();
  }

  function drawFaceGrid(ctx, q, fu, fv) {
    if (!s.showGrid) return;
    const lerp = (a, b, t) => ({ x: a.x + ((b.x - a.x) * t), y: a.y + ((b.y - a.y) * t) });
    ctx.save();
    ctx.strokeStyle = "rgba(18,33,53,.32)";
    ctx.lineWidth = 1;
    for (let i = 1; i < fu; i++) {
      const t = i / fu, a = lerp(q[0], q[1], t), b = lerp(q[3], q[2], t);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    for (let i = 1; i < fv; i++) {
      const t = i / fv, a = lerp(q[0], q[3], t), b = lerp(q[1], q[2], t);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.restore();
  }

  function pointInPoly(p, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const xi = poly[i].x, yi = poly[i].y, xj = poly[j].x, yj = poly[j].y;
      const inter = ((yi > p.y) !== (yj > p.y)) && (p.x < (((xj - xi) * (p.y - yi)) / ((yj - yi) || 1e-7)) + xi);
      if (inter) inside = !inside;
    }
    return inside;
  }

  function uvOnFace(p, q) {
    const p0 = q[0], p1 = q[1], p3 = q[3];
    const vx = { x: p1.x - p0.x, y: p1.y - p0.y };
    const vy = { x: p3.x - p0.x, y: p3.y - p0.y };
    const rp = { x: p.x - p0.x, y: p.y - p0.y };
    const det = (vx.x * vy.y) - (vx.y * vy.x);
    if (Math.abs(det) < 1e-7) return null;
    return {
      u: ((rp.x * vy.y) - (rp.y * vy.x)) / det,
      v: ((vx.x * rp.y) - (vx.y * rp.x)) / det
    };
  }

  function pickAt(p, g) {
    const layer = getLayer();
    if (!layer) return null;
    const order = ["top", "right", "left"];
    const forced = s.faceMode !== "auto" ? s.faceMode : null;
    for (const face of order) {
      if (forced && forced !== face) continue;
      const q = g[face];
      if (!pointInPoly(p, q)) continue;
      const uv = uvOnFace(p, q);
      if (!uv) continue;
      if (uv.u < -0.001 || uv.u > 1.001 || uv.v < -0.001 || uv.v > 1.001) continue;
      const c = layer.faces[face];
      const tx = clamp(uv.u, 0, 1) * Math.max(1, c.width - 1);
      const ty = clamp(uv.v, 0, 1) * Math.max(1, c.height - 1);
      return { face, point: p, tx, ty };
    }
    return null;
  }

  function captureLayer(id) {
    const layer = getLayer(id);
    if (!layer) return null;
    const snap = { id, faces: {} };
    for (const f of FACES) {
      const c = layer.faces[f], ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      snap.faces[f] = ctx.getImageData(0, 0, c.width, c.height);
    }
    return snap;
  }

  function restoreLayer(snap) {
    if (!snap) return;
    const layer = getLayer(snap.id);
    if (!layer) return;
    for (const f of FACES) {
      const c = layer.faces[f], d = snap.faces[f];
      if (!c || !d || c.width !== d.width || c.height !== d.height) continue;
      const ctx = c.getContext("2d");
      if (!ctx) continue;
      ctx.putImageData(d, 0, 0);
    }
  }

  function beginAction(label) {
    const layer = getLayer();
    if (!layer) return;
    s.pending = { label, id: layer.id, before: captureLayer(layer.id), changed: false };
  }

  function markChanged() {
    if (s.pending) s.pending.changed = true;
  }

  function endAction() {
    const p = s.pending;
    s.pending = null;
    if (!p || !p.changed || !p.before) return;
    const after = captureLayer(p.id);
    if (!after) return;
    if (s.historyIndex < s.history.length - 1) s.history.splice(s.historyIndex + 1);
    s.history.push({ before: p.before, after, id: p.id, label: p.label });
    if (s.history.length > MAX_HISTORY) s.history.shift();
    s.historyIndex = s.history.length - 1;
  }

  function undo() {
    if (s.historyIndex < 0) return;
    restoreLayer(s.history[s.historyIndex].before);
    s.historyIndex -= 1;
  }

  function redo() {
    const i = s.historyIndex + 1;
    if (i >= s.history.length) return;
    restoreLayer(s.history[i].after);
    s.historyIndex = i;
  }

  function paintAt(pick, first = false) {
    const layer = getLayer();
    if (!layer) return;
    const ctx = layer.faces[pick.face].getContext("2d");
    if (!ctx) return;
    const rgb = hexToRgb(s.color);
    ctx.lineWidth = s.size;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (s.tool === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = `rgba(0,0,0,${r(s.alpha, 4)})`;
      ctx.fillStyle = `rgba(0,0,0,${r(s.alpha, 4)})`;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = `rgba(${rgb.r},${rgb.g},${rgb.b},${r(s.alpha, 4)})`;
      ctx.fillStyle = ctx.strokeStyle;
    }

    const last = s.pointer?.last;
    if (!last || first || last.face !== pick.face) {
      ctx.beginPath();
      ctx.arc(pick.tx, pick.ty, Math.max(0.5, s.size / 2), 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(last.tx, last.ty);
      ctx.lineTo(pick.tx, pick.ty);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    s.pointer.last = { face: pick.face, tx: pick.tx, ty: pick.ty };
    markChanged();
  }

  function fillAt(pick) {
    const layer = getLayer();
    if (!layer) return;
    const c = layer.faces[pick.face];
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const w = c.width, h = c.height;
    const x0 = clamp(Math.floor(pick.tx), 0, w - 1);
    const y0 = clamp(Math.floor(pick.ty), 0, h - 1);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const start = (y0 * w + x0) * 4;
    const target = [d[start], d[start + 1], d[start + 2], d[start + 3]];
    const rgb = hexToRgb(s.color);
    const paint = (s.tool === "eraser")
      ? [0, 0, 0, 0]
      : [rgb.r, rgb.g, rgb.b, Math.round(clamp(s.alpha, 0, 1) * 255)];
    if (target[0] === paint[0] && target[1] === paint[1] && target[2] === paint[2] && target[3] === paint[3]) return;
    const eq = (i) => d[i] === target[0] && d[i + 1] === target[1] && d[i + 2] === target[2] && d[i + 3] === target[3];
    const q = [[x0, y0]];
    while (q.length) {
      const itm = q.pop();
      if (!itm) break;
      const x = itm[0], y = itm[1];
      if (x < 0 || y < 0 || x >= w || y >= h) continue;
      const i = (y * w + x) * 4;
      if (!eq(i)) continue;
      d[i] = paint[0]; d[i + 1] = paint[1]; d[i + 2] = paint[2]; d[i + 3] = paint[3];
      q.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(img, 0, 0);
    markChanged();
  }

  function pickColor(pick) {
    const layer = getLayer();
    if (!layer) return;
    const c = layer.faces[pick.face];
    const ctx = c.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    const x = clamp(Math.floor(pick.tx), 0, c.width - 1);
    const y = clamp(Math.floor(pick.ty), 0, c.height - 1);
    const px = ctx.getImageData(x, y, 1, 1).data;
    const hx = (v) => v.toString(16).padStart(2, "0");
    s.color = `#${hx(px[0])}${hx(px[1])}${hx(px[2])}`;
    s.alpha = r(px[3] / 255, 3);
    s.uiDirty = true;
  }

  function resetDoc() {
    s.layers = [];
    s.activeLayerId = null;
    s.layerIndex = 1;
    ensureLayer();
    s.zoom = 1;
    s.panX = 0;
    s.panY = 0;
    s.history = [];
    s.historyIndex = -1;
    s.pending = null;
    s.uiDirty = true;
  }

  function resizeFaces(prevFp, prevH) {
    for (const layer of s.layers) {
      for (const face of FACES) {
        const old = layer.faces[face];
        const pd = faceDims(face, prevFp, prevH);
        const nd = faceDims(face, s.footprint, s.height);
        const neo = mkCanvas(nd.w, nd.h);
        const ctx = neo.getContext("2d");
        if (ctx) {
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(old, 0, 0, pd.w, pd.h, 0, 0, nd.w, nd.h);
        }
        layer.faces[face] = neo;
      }
    }
  }

  function addLayer() {
    const l = mkLayer(`Capa ${s.layerIndex++}`);
    s.layers.push(l);
    s.activeLayerId = l.id;
    s.uiDirty = true;
  }

  function dupLayer() {
    const l = getLayer();
    if (!l) return;
    const idx = s.layers.findIndex((x) => x.id === l.id);
    if (idx < 0) return;
    const neo = mkLayer(`${l.name} copia`);
    neo.visible = l.visible;
    neo.opacity = l.opacity;
    for (const face of FACES) {
      const ctx = neo.faces[face].getContext("2d");
      if (!ctx) continue;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(l.faces[face], 0, 0, neo.faces[face].width, neo.faces[face].height);
    }
    s.layers.splice(idx + 1, 0, neo);
    s.activeLayerId = neo.id;
    s.uiDirty = true;
  }

  function delLayer() {
    if (s.layers.length <= 1) return;
    const idx = s.layers.findIndex((x) => x.id === s.activeLayerId);
    if (idx < 0) return;
    s.layers.splice(idx, 1);
    s.activeLayerId = (s.layers[Math.max(0, idx - 1)] || s.layers[0]).id;
    s.uiDirty = true;
  }

  function moveLayer(dir) {
    const idx = s.layers.findIndex((x) => x.id === s.activeLayerId);
    if (idx < 0) return;
    const j = idx + dir;
    if (j < 0 || j >= s.layers.length) return;
    const [a] = s.layers.splice(idx, 1);
    s.layers.splice(j, 0, a);
    s.uiDirty = true;
  }

  function clearFace(face) {
    const layer = getLayer();
    if (!layer) return;
    beginAction(`clear_${face}`);
    const c = layer.faces[face], ctx = c.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, c.width, c.height);
      markChanged();
    }
    endAction();
  }

  function clearLayer() {
    const layer = getLayer();
    if (!layer) return;
    beginAction("clear_layer");
    for (const face of FACES) {
      const c = layer.faces[face], ctx = c.getContext("2d");
      if (!ctx) continue;
      ctx.clearRect(0, 0, c.width, c.height);
    }
    markChanged();
    endAction();
  }

  function importFace(face, file) {
    if (!file) return;
    if (!/\.png$/i.test(file.name || "") && String(file.type || "").toLowerCase() !== "image/png") return;
    const layer = getLayer();
    if (!layer) return;
    const c = layer.faces[face], ctx = c.getContext("2d");
    if (!ctx) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      beginAction(`import_${face}`);
      ctx.clearRect(0, 0, c.width, c.height);
      const k = Math.min(c.width / Math.max(1, img.width), c.height / Math.max(1, img.height));
      const dw = img.width * k, dh = img.height * k;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, (c.width - dw) / 2, (c.height - dh) / 2, dw, dh);
      markChanged();
      endAction();
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  function syncUi() {
    if (el.footprintSelect) el.footprintSelect.value = String(s.footprint);
    if (el.heightInput) el.heightInput.value = String(s.height);
    if (el.brushColor) el.brushColor.value = s.color;
    if (el.brushSize) el.brushSize.value = String(r(s.size, 1));
    if (el.brushOpacity) el.brushOpacity.value = String(r(s.alpha, 3));
    if (el.faceModeSelect) el.faceModeSelect.value = s.faceMode;
    for (const b of el.toolButtons) b.classList.toggle("is-active", b.dataset.tool === s.tool);
    if (el.layerList) {
      el.layerList.innerHTML = "";
      for (const layer of s.layers.slice().reverse()) {
        const row = document.createElement("div");
        row.className = `iso-layer-row${layer.id === s.activeLayerId ? " is-active" : ""}`;
        const vis = document.createElement("input");
        vis.type = "checkbox"; vis.checked = !!layer.visible;
        vis.addEventListener("click", (ev) => ev.stopPropagation());
        vis.addEventListener("change", () => { layer.visible = !!vis.checked; });
        const nm = document.createElement("div");
        nm.className = "iso-layer-name";
        nm.textContent = layer.name;
        const op = document.createElement("input");
        op.type = "range"; op.min = "0"; op.max = "1"; op.step = "0.01"; op.value = String(r(layer.opacity, 2));
        op.addEventListener("click", (ev) => ev.stopPropagation());
        op.addEventListener("input", () => { layer.opacity = clamp(n(op.value, layer.opacity), 0, 1); if (layer.id === s.activeLayerId) s.uiDirty = true; });
        row.appendChild(vis); row.appendChild(nm); row.appendChild(op);
        row.addEventListener("click", () => { s.activeLayerId = layer.id; s.uiDirty = true; });
        el.layerList.appendChild(row);
      }
    }
    const active = getLayer();
    if (el.layerNameInput) el.layerNameInput.value = active?.name || "";
    if (el.layerOpacity) el.layerOpacity.value = String(r(active?.opacity ?? 1, 3));
  }

  function renderStateConsole() {
    if (!el.stateConsole) return;
    el.stateConsole.textContent = JSON.stringify({
      doc: { footprint: s.footprint, height: s.height },
      view: { zoom: r(s.zoom, 4), panX: r(s.panX, 2), panY: r(s.panY, 2) },
      brush: { tool: s.tool, color: s.color, size: r(s.size, 2), alpha: r(s.alpha, 3), faceMode: s.faceMode },
      activeLayerId: s.activeLayerId,
      layers: s.layers.map((l, i) => ({
        order: i, id: l.id, name: l.name, visible: l.visible, opacity: r(l.opacity, 3),
        top: `${l.faces.top.width}x${l.faces.top.height}`,
        left: `${l.faces.left.width}x${l.faces.left.height}`,
        right: `${l.faces.right.width}x${l.faces.right.height}`
      }))
    }, null, 2);
  }

  async function copyState() {
    const text = el.stateConsole?.textContent || "";
    if (!text) return;
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const ta = document.createElement("textarea");
        ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
        document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
      }
    } catch (_) {
      // ignore
    }
  }

  function exportPng() {
    const tempView = { w: 1, h: 1, cx: 0, cy: 0 };
    const g = geometry(tempView);
    const pts = [...g.top, ...g.left, ...g.right];
    const minX = Math.min(...pts.map((p) => p.x));
    const maxX = Math.max(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxY = Math.max(...pts.map((p) => p.y));
    const pad = 4;
    const w = Math.ceil((maxX - minX) + (pad * 2));
    const h = Math.ceil((maxY - minY) + (pad * 2));
    const out = document.createElement("canvas");
    out.width = Math.max(1, w);
    out.height = Math.max(1, h);
    const ctx = out.getContext("2d");
    if (!ctx) return;
    const off = { top: g.top.map((p) => ({ x: p.x - minX + pad, y: p.y - minY + pad })), left: g.left.map((p) => ({ x: p.x - minX + pad, y: p.y - minY + pad })), right: g.right.map((p) => ({ x: p.x - minX + pad, y: p.y - minY + pad })) };
    for (const layer of s.layers) {
      if (!layer.visible || layer.opacity <= 0) continue;
      drawQuadImage(ctx, layer.faces.left, off.left, layer.opacity);
      drawQuadImage(ctx, layer.faces.right, off.right, layer.opacity);
      drawQuadImage(ctx, layer.faces.top, off.top, layer.opacity);
    }
    drawOutline(ctx, off.left, "rgba(18,27,38,.92)", 1);
    drawOutline(ctx, off.right, "rgba(18,27,38,.92)", 1);
    drawOutline(ctx, off.top, "rgba(18,27,38,.96)", 1.2);
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `iso_cube_${s.footprint}x${s.footprint}_h${s.height}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }

  function render() {
    const v = view();
    const dpr = Math.max(1, Math.min(3, window.devicePixelRatio || 1));
    const pw = Math.max(1, Math.round(v.w * dpr));
    const ph = Math.max(1, Math.round(v.h * dpr));
    if (el.canvas.width !== pw || el.canvas.height !== ph) {
      el.canvas.width = pw; el.canvas.height = ph; s.dpr = dpr;
    }
    const ctx = el.canvas.getContext("2d");
    if (!ctx) {
      requestAnimationFrame(render);
      return;
    }
    ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
    drawGrid(ctx, v);
    const g = geometry(v);
    for (const layer of s.layers) {
      if (!layer.visible || layer.opacity <= 0) continue;
      drawQuadImage(ctx, layer.faces.left, g.left, layer.opacity);
      drawQuadImage(ctx, layer.faces.right, g.right, layer.opacity);
      drawQuadImage(ctx, layer.faces.top, g.top, layer.opacity);
    }
    drawFaceGrid(ctx, g.left, s.footprint, s.height);
    drawFaceGrid(ctx, g.right, s.footprint, s.height);
    drawFaceGrid(ctx, g.top, s.footprint, s.footprint);
    drawOutline(ctx, g.left, "rgba(20,29,42,.75)", 1.2);
    drawOutline(ctx, g.right, "rgba(20,29,42,.75)", 1.2);
    drawOutline(ctx, g.top, "rgba(20,29,42,.95)", 1.4);
    if (s.hover) {
      drawOutline(ctx, g[s.hover.face], "rgba(56,189,248,.9)", 2);
      ctx.fillStyle = "rgba(56,189,248,.95)";
      ctx.beginPath(); ctx.arc(s.hover.point.x, s.hover.point.y, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    if (el.hud) {
      const face = s.hover ? s.hover.face.toUpperCase() : "--";
      const tex = s.hover ? `${r(s.hover.tx, 1)}, ${r(s.hover.ty, 1)}` : "--, --";
      const active = getLayer();
      el.hud.textContent =
        `Tool: ${s.tool.toUpperCase()} | Face: ${face} | UV(px): ${tex}\n` +
        `Zoom: x${r(s.zoom, 3)} | Pan: (${r(s.panX, 1)}, ${r(s.panY, 1)}) | Lote: ${s.footprint}x${s.footprint} | Altura: ${s.height}\n` +
        `Capa activa: ${active?.name || "(none)"} | Opacidad: ${r(active?.opacity ?? 1, 2)} | Pincel: ${r(s.size, 1)} px @ ${r(s.alpha, 2)}`;
    }
    renderStateConsole();
    if (s.uiDirty) {
      syncUi();
      s.uiDirty = false;
    }
    requestAnimationFrame(render);
  }

  function onDown(e) {
    e.preventDefault();
    const v = view(), g = geometry(v), p = { x: e.offsetX, y: e.offsetY };
    s.hover = pickAt(p, g);
    if (s.tool === "pan" || s.spacePan || e.button === 1 || e.button === 2) {
      s.pointer = { id: e.pointerId, mode: "pan", sx: e.offsetX, sy: e.offsetY, px: s.panX, py: s.panY };
      el.canvas.setPointerCapture(e.pointerId);
      return;
    }
    if (!s.hover) return;
    s.pointer = { id: e.pointerId, mode: "paint", last: null };
    el.canvas.setPointerCapture(e.pointerId);
    if (s.tool === "brush" || s.tool === "eraser") {
      beginAction(s.tool);
      paintAt(s.hover, true);
    } else if (s.tool === "fill") {
      beginAction("fill");
      fillAt(s.hover);
      endAction();
      s.pointer = null;
    } else if (s.tool === "picker") {
      pickColor(s.hover);
      s.pointer = null;
    }
  }

  function onMove(e) {
    const v = view(), g = geometry(v), p = { x: e.offsetX, y: e.offsetY };
    s.hover = pickAt(p, g);
    if (!s.pointer || s.pointer.id !== e.pointerId) return;
    if (s.pointer.mode === "pan") {
      s.panX = s.pointer.px + (e.offsetX - s.pointer.sx);
      s.panY = s.pointer.py + (e.offsetY - s.pointer.sy);
      return;
    }
    if (s.pointer.mode === "paint" && s.hover && (s.tool === "brush" || s.tool === "eraser")) {
      paintAt(s.hover, false);
    }
  }

  function onUp(e) {
    if (!s.pointer || s.pointer.id !== e.pointerId) return;
    const mode = s.pointer.mode;
    s.pointer = null;
    if (mode === "paint" && (s.tool === "brush" || s.tool === "eraser")) endAction();
    if (el.canvas.hasPointerCapture(e.pointerId)) el.canvas.releasePointerCapture(e.pointerId);
  }

  function onWheel(e) {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.09 : (1 / 1.09);
    const prev = s.zoom;
    const next = clamp(prev * factor, 0.2, 9);
    if (Math.abs(next - prev) < 1e-6) return;
    const v = view();
    const wx = (e.offsetX - v.cx - s.panX) / prev;
    const wy = (e.offsetY - v.cy - s.panY) / prev;
    s.zoom = next;
    s.panX = e.offsetX - v.cx - (wx * next);
    s.panY = e.offsetY - v.cy - (wy * next);
  }

  function bind() {
    el.canvas.addEventListener("contextmenu", (e) => e.preventDefault());
    el.canvas.addEventListener("pointerdown", onDown);
    el.canvas.addEventListener("pointermove", onMove);
    el.canvas.addEventListener("pointerup", onUp);
    el.canvas.addEventListener("pointercancel", onUp);
    el.canvas.addEventListener("pointerleave", () => { s.hover = null; });
    el.canvas.addEventListener("wheel", onWheel, { passive: false });

    for (const b of el.toolButtons) b.addEventListener("click", () => { if (TOOLS.includes(b.dataset.tool)) { s.tool = b.dataset.tool; s.uiDirty = true; } });
    el.brushColor?.addEventListener("input", () => { s.color = el.brushColor.value; });
    el.brushSize?.addEventListener("input", () => { s.size = clamp(n(el.brushSize.value, s.size), 1, 96); });
    el.brushOpacity?.addEventListener("input", () => { s.alpha = clamp(n(el.brushOpacity.value, s.alpha), 0.01, 1); });
    el.faceModeSelect?.addEventListener("change", () => { s.faceMode = (el.faceModeSelect.value === "auto" || FACES.includes(el.faceModeSelect.value)) ? el.faceModeSelect.value : "auto"; });

    el.applySizeBtn?.addEventListener("click", () => {
      const pf = s.footprint, ph = s.height;
      s.footprint = clamp(Math.round(n(el.footprintSelect?.value, s.footprint)), 1, 9);
      s.height = clamp(Math.round(n(el.heightInput?.value, s.height)), 1, 24);
      resizeFaces(pf, ph);
      s.history = []; s.historyIndex = -1; s.pending = null;
      s.uiDirty = true;
    });
    el.newDocBtn?.addEventListener("click", resetDoc);

    el.layerAddBtn?.addEventListener("click", addLayer);
    el.layerDupBtn?.addEventListener("click", dupLayer);
    el.layerDelBtn?.addEventListener("click", delLayer);
    el.layerUpBtn?.addEventListener("click", () => moveLayer(+1));
    el.layerDownBtn?.addEventListener("click", () => moveLayer(-1));
    el.layerNameInput?.addEventListener("input", () => { const layer = getLayer(); if (layer) { layer.name = String(el.layerNameInput.value || "").slice(0, 42) || "Capa"; s.uiDirty = true; } });
    el.layerOpacity?.addEventListener("input", () => { const layer = getLayer(); if (layer) { layer.opacity = clamp(n(el.layerOpacity.value, layer.opacity), 0, 1); s.uiDirty = true; } });

    el.importFaceInput?.addEventListener("change", () => {
      const file = el.importFaceInput.files?.[0];
      if (!file) return;
      const face = FACES.includes(el.importFaceSelect?.value || "") ? el.importFaceSelect.value : "top";
      importFace(face, file);
      el.importFaceInput.value = "";
    });
    el.clearFaceBtn?.addEventListener("click", () => {
      const face = FACES.includes(el.importFaceSelect?.value || "") ? el.importFaceSelect.value : "top";
      clearFace(face);
    });
    el.clearLayerBtn?.addEventListener("click", clearLayer);
    el.exportBtn?.addEventListener("click", exportPng);
    el.copyStateBtn?.addEventListener("click", copyState);

    window.addEventListener("keydown", (e) => {
      const key = String(e.key || "").toLowerCase();
      if (key === " ") s.spacePan = true;
      if ((e.ctrlKey || e.metaKey) && !e.altKey && key === "z") { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
      if ((e.ctrlKey || e.metaKey) && !e.altKey && key === "y") { e.preventDefault(); redo(); return; }
      if (key === "b") { s.tool = "brush"; s.uiDirty = true; }
      else if (key === "e") { s.tool = "eraser"; s.uiDirty = true; }
      else if (key === "g") { s.tool = "fill"; s.uiDirty = true; }
      else if (key === "i") { s.tool = "picker"; s.uiDirty = true; }
      else if (key === "h") { s.tool = "pan"; s.uiDirty = true; }
    });
    window.addEventListener("keyup", (e) => { if (String(e.key || "") === " ") s.spacePan = false; });
  }

  ensureLayer();
  bind();
  render();
})();
