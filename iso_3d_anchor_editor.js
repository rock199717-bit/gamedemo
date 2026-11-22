(() => {
  "use strict";

  const el = {
    canvas: document.getElementById("iso3dCanvas"),
    hud: document.getElementById("iso3dHud"),
    console: document.getElementById("iso3dConsole"),
    modelInput: document.getElementById("iso3dModelInput"),
    loadBtn: document.getElementById("iso3dLoadBtn"),
    clearBtn: document.getElementById("iso3dClearBtn"),
    exportBtn: document.getElementById("iso3dExportBtn"),
    scaleInput: document.getElementById("iso3dScaleInput"),
    pivotInput: document.getElementById("iso3dPivotInput"),
    pickPivotBtn: document.getElementById("iso3dPickPivotBtn"),
    pivotCombinedBtn: document.getElementById("iso3dPivotCombinedBtn"),
    outlineChk: document.getElementById("iso3dOutlineChk"),
    outlineWidthInput: document.getElementById("iso3dOutlineWidthInput"),
    outlineWidthValue: document.getElementById("iso3dOutlineWidthValue"),
    footprintSelect: document.getElementById("iso3dFootprintSelect"),
    anchorHeightInput: document.getElementById("iso3dAnchorHeightInput"),
    showAnchorChk: document.getElementById("iso3dShowAnchorChk"),
    tileXInput: document.getElementById("iso3dTileXInput"),
    tileZInput: document.getElementById("iso3dTileZInput"),
    rotLBtn: document.getElementById("iso3dRotLBtn"),
    rotRBtn: document.getElementById("iso3dRotRBtn"),
    rotInput: document.getElementById("iso3dRotInput"),
    zoomInput: document.getElementById("iso3dZoomInput"),
    centerCamBtn: document.getElementById("iso3dCenterCamBtn"),
    resetCamBtn: document.getElementById("iso3dResetCamBtn"),
    copyBtn: document.getElementById("iso3dCopyBtn"),
    animSelect: document.getElementById("iso3dAnimSelect"),
    animPlayBtn: document.getElementById("iso3dAnimPlayBtn"),
    animPauseBtn: document.getElementById("iso3dAnimPauseBtn"),
    animPrevBtn: document.getElementById("iso3dAnimPrevBtn"),
    animNextBtn: document.getElementById("iso3dAnimNextBtn"),
    animFrameInput: document.getElementById("iso3dAnimFrameInput"),
    animStepInput: document.getElementById("iso3dAnimStepInput"),
    animApplyFrameBtn: document.getElementById("iso3dAnimApplyFrameBtn"),
    animResetBtn: document.getElementById("iso3dAnimResetBtn"),
    animMeta: document.getElementById("iso3dAnimMeta")
  };
  if (!el.canvas) return;

  const state = {
    footprint: 2,
    anchorHeight: 2,
    tileX: 0,
    tileZ: 0,
    rotationDeg: 0,
    zoomOrtho: 20,
    showAnchor: true,
    outlineEnabled: true,
    outlineWidth: 12,
    modelScale: 1,
    modelName: "",
    pivotMeshRequested: "Box001",
    pivotMeshUsed: null,
    pivotPickMode: false,
    modelOffset: { x: 0, y: 0, z: 0 },
    animGroupIndex: -1,
    animFrame: 0,
    animStep: 1,
    animPlaying: false
  };

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const n = (v, fallback = 0) => (Number.isFinite(Number(v)) ? Number(v) : fallback);
  const r = (v, d = 3) => {
    const p = 10 ** d;
    return Math.round(v * p) / p;
  };

  const engine = new BABYLON.Engine(el.canvas, true, { preserveDrawingBuffer: true, stencil: true });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.4745, 0.7059, 0.2902, 1);

  new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0.4, 1, 0.2), scene).intensity = 1.05;
  const key = new BABYLON.DirectionalLight("sun", new BABYLON.Vector3(-0.6, -1, -0.5), scene);
  key.position = new BABYLON.Vector3(40, 80, 20);
  key.intensity = 0.5;

  const ISO_ALPHA = -Math.PI / 4;
  const ISO_BETA = Math.PI / 3;

  const camera = new BABYLON.ArcRotateCamera(
    "isoCam",
    ISO_ALPHA,
    ISO_BETA,
    40,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.inputs.clear();
  camera.lowerBetaLimit = ISO_BETA;
  camera.upperBetaLimit = ISO_BETA;
  camera.lowerAlphaLimit = ISO_ALPHA;
  camera.upperAlphaLimit = ISO_ALPHA;
  camera.wheelPrecision = 0.0001;

  function applyOrtho(halfOverride = null) {
    const w = Math.max(1, engine.getRenderWidth());
    const h = Math.max(1, engine.getRenderHeight());
    const aspect = w / h;
    const half = clamp(n(halfOverride ?? state.zoomOrtho, 20), 4, 240);
    camera.orthoLeft = -half * aspect;
    camera.orthoRight = half * aspect;
    camera.orthoBottom = -half;
    camera.orthoTop = half;
  }

  function resetCamera() {
    camera.alpha = ISO_ALPHA;
    camera.beta = ISO_BETA;
    camera.target = BABYLON.Vector3.Zero();
    state.zoomOrtho = 20;
    applyOrtho();
    syncInputs();
  }

  function setCameraTarget(v) {
    const target = (v && typeof v.clone === "function") ? v.clone() : BABYLON.Vector3.Zero();
    if (typeof camera.setTarget === "function") camera.setTarget(target);
    else camera.target = target;
  }

  function getBoundsCorners(bounds) {
    if (!bounds) return [];
    const { min, max } = bounds;
    return [
      new BABYLON.Vector3(min.x, min.y, min.z),
      new BABYLON.Vector3(min.x, min.y, max.z),
      new BABYLON.Vector3(min.x, max.y, min.z),
      new BABYLON.Vector3(min.x, max.y, max.z),
      new BABYLON.Vector3(max.x, min.y, min.z),
      new BABYLON.Vector3(max.x, min.y, max.z),
      new BABYLON.Vector3(max.x, max.y, min.z),
      new BABYLON.Vector3(max.x, max.y, max.z)
    ];
  }

  function centerCameraOnModel(opts = {}) {
    if (!importedRenderableMeshes.length) return null;
    const bounds = getWorldBoundsFromMeshes(importedRenderableMeshes);
    if (!bounds) return null;

    const center = bounds.min.add(bounds.max).scale(0.5);
    setCameraTarget(center);

    const shouldFit = opts.fit !== false;
    let fittedHalf = null;
    if (shouldFit) {
      const corners = getBoundsCorners(bounds);
      const view = camera.getViewMatrix(true);
      let maxAbsX = 0;
      let maxAbsY = 0;
      for (const c of corners) {
        const cv = BABYLON.Vector3.TransformCoordinates(c, view);
        maxAbsX = Math.max(maxAbsX, Math.abs(cv.x));
        maxAbsY = Math.max(maxAbsY, Math.abs(cv.y));
      }

      const w = Math.max(1, engine.getRenderWidth());
      const h = Math.max(1, engine.getRenderHeight());
      const aspect = w / h;
      const margin = clamp(n(opts.margin, 1.12), 1.0, 2.5);
      const pad = clamp(n(opts.pad, 0.35), 0, 20);
      let half = Math.max(maxAbsY, (aspect > 0 ? (maxAbsX / aspect) : maxAbsX));
      if (!Number.isFinite(half) || half <= 0) half = clamp(n(state.zoomOrtho, 20), 4, 240);
      fittedHalf = clamp((half + pad) * margin, 4, 240);

      if (opts.commitState === false) {
        applyOrtho(fittedHalf);
      } else {
        state.zoomOrtho = fittedHalf;
        applyOrtho();
        syncInputs();
      }
    }

    if (opts.silent !== true) updateHudAndConsole();
    return { center, fittedHalf };
  }

  function createGroundGrid(range = 120, step = 1) {
    const lines = [];
    for (let i = -range; i <= range; i += step) {
      lines.push([new BABYLON.Vector3(i, 0, -range), new BABYLON.Vector3(i, 0, range)]);
      lines.push([new BABYLON.Vector3(-range, 0, i), new BABYLON.Vector3(range, 0, i)]);
    }
    const grid = BABYLON.MeshBuilder.CreateLineSystem("gridLines", { lines }, scene);
    grid.color = new BABYLON.Color3(0.364, 0.558, 0.258);
    grid.alpha = 0.68;
    grid.isPickable = false;
    return grid;
  }

  const groundGrid = createGroundGrid();

  const pickGround = BABYLON.MeshBuilder.CreateGround("pickGround", { width: 1200, height: 1200 }, scene);
  pickGround.isVisible = false;
  pickGround.isPickable = true;

  const anchorRoot = new BABYLON.TransformNode("anchorRoot", scene);
  const modelOffsetRoot = new BABYLON.TransformNode("modelOffsetRoot", scene);
  const modelScaleRoot = new BABYLON.TransformNode("modelScaleRoot", scene);
  modelOffsetRoot.parent = anchorRoot;
  modelScaleRoot.parent = modelOffsetRoot;

  const anchorFillMat = new BABYLON.StandardMaterial("anchorFillMat", scene);
  anchorFillMat.diffuseColor = new BABYLON.Color3(0.180, 0.847, 0.733);
  anchorFillMat.specularColor = BABYLON.Color3.Black();
  anchorFillMat.alpha = 0.18;

  const anchorBoxMat = new BABYLON.StandardMaterial("anchorBoxMat", scene);
  anchorBoxMat.diffuseColor = new BABYLON.Color3(0.196, 0.517, 0.992);
  anchorBoxMat.specularColor = BABYLON.Color3.Black();
  anchorBoxMat.alpha = 0.08;

  let anchorFootprint = null;
  let anchorBox = null;
  let anchorTileLines = null;
  let importedRootNodes = [];
  let importedRenderableMeshes = [];
  let importedAnimationGroups = [];

  function buildAnchorHelpers() {
    if (anchorFootprint) anchorFootprint.dispose();
    if (anchorBox) anchorBox.dispose();
    if (anchorTileLines) anchorTileLines.dispose();

    const size = Math.max(1, Math.round(n(state.footprint, 2)));
    const height = clamp(n(state.anchorHeight, 2), 0.2, 30);

    anchorFootprint = BABYLON.MeshBuilder.CreateGround("anchorFoot", { width: size, height: size }, scene);
    anchorFootprint.parent = anchorRoot;
    anchorFootprint.position.y = 0.01;
    anchorFootprint.material = anchorFillMat;
    anchorFootprint.isPickable = false;

    anchorBox = BABYLON.MeshBuilder.CreateBox("anchorBox", {
      width: size,
      depth: size,
      height
    }, scene);
    anchorBox.parent = anchorRoot;
    anchorBox.position.y = height / 2;
    anchorBox.material = anchorBoxMat;
    anchorBox.isPickable = false;
    anchorBox.enableEdgesRendering();
    anchorBox.edgesWidth = 4;
    anchorBox.edgesColor = new BABYLON.Color4(0.012, 0.078, 0.173, 0.85);

    const lines = [];
    const half = size / 2;
    for (let i = 0; i <= size; i++) {
      const t = -half + i;
      lines.push([new BABYLON.Vector3(t, 0.02, -half), new BABYLON.Vector3(t, 0.02, half)]);
      lines.push([new BABYLON.Vector3(-half, 0.02, t), new BABYLON.Vector3(half, 0.02, t)]);
    }
    const h = height;
    lines.push([new BABYLON.Vector3(-half, h, -half), new BABYLON.Vector3(half, h, -half)]);
    lines.push([new BABYLON.Vector3(half, h, -half), new BABYLON.Vector3(half, h, half)]);
    lines.push([new BABYLON.Vector3(half, h, half), new BABYLON.Vector3(-half, h, half)]);
    lines.push([new BABYLON.Vector3(-half, h, half), new BABYLON.Vector3(-half, h, -half)]);
    anchorTileLines = BABYLON.MeshBuilder.CreateLineSystem("anchorTileLines", { lines }, scene);
    anchorTileLines.parent = anchorRoot;
    anchorTileLines.color = new BABYLON.Color3(0.058, 0.216, 0.375);
    anchorTileLines.alpha = 0.95;
    anchorTileLines.isPickable = false;

    const vis = !!state.showAnchor;
    anchorFootprint.setEnabled(vis);
    anchorBox.setEnabled(vis);
    anchorTileLines.setEnabled(vis);
  }

  function updateAnchorTransform() {
    const fp = Math.max(1, Math.round(n(state.footprint, 2)));
    anchorRoot.position.x = n(state.tileX, 0) + (fp / 2);
    anchorRoot.position.z = n(state.tileZ, 0) + (fp / 2);
    anchorRoot.rotationQuaternion = null;
    anchorRoot.rotation.y = BABYLON.Tools.ToRadians(n(state.rotationDeg, 0));
  }

  function setModelScale(scale) {
    state.modelScale = clamp(n(scale, state.modelScale), 0.05, 8);
    modelScaleRoot.scaling.setAll(state.modelScale);
  }

  function applyModelOutlines(exportBoost = 1) {
    const uiWidth = clamp(n(state.outlineWidth, 12), 1, 64);
    const boost = Math.max(1, exportBoost);
    // Solo contorno por aristas (sin sombra/silueta).
    const edgeWidth = clamp(Math.round(uiWidth * 1.4 * boost), 1, 128);
    for (const mesh of importedRenderableMeshes) {
      if (!(mesh instanceof BABYLON.AbstractMesh)) continue;
      if (typeof mesh.getTotalVertices === "function" && mesh.getTotalVertices() <= 0) continue;
      if (state.outlineEnabled) {
        mesh.renderOutline = false;
        if (typeof mesh.enableEdgesRendering === "function") {
          mesh.enableEdgesRendering(0.95);
          mesh.edgesColor = new BABYLON.Color4(0, 0, 0, 1);
          mesh.edgesWidth = edgeWidth;
        }
      } else {
        if (typeof mesh.disableEdgesRendering === "function") mesh.disableEdgesRendering();
        mesh.renderOutline = false;
      }
    }
  }

  function clearModelOutlines() {
    for (const mesh of importedRenderableMeshes) {
      if (!(mesh instanceof BABYLON.AbstractMesh)) continue;
      mesh.renderOutline = false;
      if (typeof mesh.disableEdgesRendering === "function") {
        mesh.disableEdgesRendering();
      }
    }
  }

  function clearModel() {
    for (const g of importedAnimationGroups) {
      try {
        if (typeof g.stop === "function") g.stop();
        if (typeof g.dispose === "function") g.dispose();
      } catch (_) {
        // ignore
      }
    }
    importedAnimationGroups = [];
    for (const node of importedRootNodes) {
      if (node && !node.isDisposed()) node.dispose(false, true);
    }
    importedRootNodes = [];
    importedRenderableMeshes = [];
    modelOffsetRoot.position.set(0, 0, 0);
    modelScaleRoot.scaling.setAll(1);
    state.modelScale = 1;
    state.modelName = "";
    state.modelOffset = { x: 0, y: 0, z: 0 };
    state.pivotMeshUsed = null;
    state.pivotPickMode = false;
    state.animGroupIndex = -1;
    state.animFrame = 0;
    state.animPlaying = false;
    clearModelOutlines();
    syncInputs();
    updateHudAndConsole();
  }

  function getAnimationGroupFrameRange(group) {
    if (!group) return null;
    let from = Number(group.from);
    let to = Number(group.to);

    if (!Number.isFinite(from) || !Number.isFinite(to)) {
      let min = Infinity;
      let max = -Infinity;
      const targeted = Array.isArray(group.targetedAnimations) ? group.targetedAnimations : [];
      for (const ta of targeted) {
        const keys = ta?.animation?.getKeys?.();
        if (!Array.isArray(keys) || !keys.length) continue;
        for (const k of keys) {
          const f = Number(k?.frame);
          if (!Number.isFinite(f)) continue;
          if (f < min) min = f;
          if (f > max) max = f;
        }
      }
      if (Number.isFinite(min) && Number.isFinite(max)) {
        from = min;
        to = max;
      }
    }

    if (!Number.isFinite(from) || !Number.isFinite(to)) return null;
    if (to < from) {
      const tmp = from;
      from = to;
      to = tmp;
    }
    return { from, to };
  }

  function getSelectedAnimationGroup() {
    const idx = Math.round(n(state.animGroupIndex, -1));
    if (idx < 0 || idx >= importedAnimationGroups.length) return null;
    return importedAnimationGroups[idx] || null;
  }

  function stopAllAnimationGroups(keepGroup = null) {
    for (const g of importedAnimationGroups) {
      if (!g || g === keepGroup) continue;
      try {
        if (typeof g.stop === "function") g.stop();
      } catch (_) {
        // ignore
      }
    }
  }

  function readAnimationRuntimeFrame(group) {
    if (!group) return null;
    const list = Array.isArray(group.animatables) ? group.animatables : [];
    for (const anim of list) {
      const f = Number(anim?.masterFrame);
      if (Number.isFinite(f)) return f;
      const cf = Number(anim?.currentFrame);
      if (Number.isFinite(cf)) return cf;
    }
    return null;
  }

  function ensureAnimationGroupStartedForScrub(group, range) {
    if (!group || !range) return false;
    try {
      const hasAnimatables = Array.isArray(group.animatables) && group.animatables.length > 0;
      if (!hasAnimatables && typeof group.start === "function") {
        group.start(false, 1, range.from, range.to, false);
      }
      return true;
    } catch (_) {
      return false;
    }
  }

  function scrubSelectedAnimationFrame(frame, opts = {}) {
    const group = getSelectedAnimationGroup();
    if (!group) return false;
    const range = getAnimationGroupFrameRange(group);
    if (!range) return false;

    const nextFrame = clamp(n(frame, range.from), range.from, range.to);
    stopAllAnimationGroups(group);
    ensureAnimationGroupStartedForScrub(group, range);
    try {
      if (typeof group.goToFrame === "function") group.goToFrame(nextFrame);
      if (typeof group.pause === "function") group.pause();
    } catch (_) {
      // ignore
    }
    state.animPlaying = false;
    state.animFrame = nextFrame;
    if (opts.sync !== false) syncInputs();
    if (opts.hud !== false) updateHudAndConsole();
    if (opts.render !== false) scene.render();
    return true;
  }

  function playSelectedAnimation() {
    const group = getSelectedAnimationGroup();
    if (!group) return false;
    const range = getAnimationGroupFrameRange(group);
    if (!range) return false;
    stopAllAnimationGroups(group);
    try {
      if (typeof group.start === "function") {
        group.start(true, 1, range.from, range.to, false);
      } else if (typeof group.play === "function") {
        group.play(true);
      }
      state.animPlaying = true;
      const runtimeFrame = readAnimationRuntimeFrame(group);
      if (Number.isFinite(runtimeFrame)) state.animFrame = runtimeFrame;
      syncInputs();
      updateHudAndConsole();
      return true;
    } catch (_) {
      return false;
    }
  }

  function pauseSelectedAnimation() {
    const group = getSelectedAnimationGroup();
    if (!group) return false;
    try {
      if (typeof group.pause === "function") group.pause();
      else if (typeof group.stop === "function") group.stop();
    } catch (_) {
      // ignore
    }
    state.animPlaying = false;
    const runtimeFrame = readAnimationRuntimeFrame(group);
    if (Number.isFinite(runtimeFrame)) state.animFrame = runtimeFrame;
    syncInputs();
    updateHudAndConsole();
    return true;
  }

  function stepSelectedAnimationFrame(direction = 1) {
    const group = getSelectedAnimationGroup();
    if (!group) return false;
    const range = getAnimationGroupFrameRange(group);
    if (!range) return false;
    const step = Math.max(1, Math.round(n(state.animStep, 1)));
    const base = Number.isFinite(state.animFrame) ? state.animFrame : range.from;
    const delta = (direction >= 0 ? step : -step);
    return scrubSelectedAnimationFrame(base + delta);
  }

  function selectAnimationGroupByIndex(index, opts = {}) {
    const next = Math.round(n(index, -1));
    stopAllAnimationGroups();
    state.animPlaying = false;
    if (next < 0 || next >= importedAnimationGroups.length) {
      state.animGroupIndex = -1;
      state.animFrame = 0;
      if (opts.sync !== false) syncInputs();
      if (opts.hud !== false) updateHudAndConsole();
      return false;
    }
    state.animGroupIndex = next;
    const group = getSelectedAnimationGroup();
    const range = getAnimationGroupFrameRange(group);
    state.animFrame = range ? range.from : 0;
    if (range) scrubSelectedAnimationFrame(range.from, { sync: false, hud: false, render: true });
    if (opts.sync !== false) syncInputs();
    if (opts.hud !== false) updateHudAndConsole();
    return true;
  }

  function rebuildAnimationUi() {
    if (el.animSelect) {
      const prev = Math.round(n(state.animGroupIndex, -1));
      const options = ['<option value="-1">(sin animaciones)</option>'];
      for (let i = 0; i < importedAnimationGroups.length; i++) {
        const g = importedAnimationGroups[i];
        const range = getAnimationGroupFrameRange(g);
        const nm = String(g?.name || `Anim ${i + 1}`);
        const suffix = range ? ` [${Math.round(range.from)}..${Math.round(range.to)}]` : "";
        options.push(`<option value="${i}">${nm}${suffix}</option>`);
      }
      el.animSelect.innerHTML = options.join("");
      el.animSelect.value = String(prev >= 0 && prev < importedAnimationGroups.length ? prev : -1);
    }
    syncInputs();
  }

  function getWorldBoundsFromMeshes(meshes) {
    let min = new BABYLON.Vector3(Infinity, Infinity, Infinity);
    let max = new BABYLON.Vector3(-Infinity, -Infinity, -Infinity);
    let found = false;
    for (const mesh of meshes) {
      if (!(mesh instanceof BABYLON.AbstractMesh)) continue;
      if (typeof mesh.getTotalVertices === "function" && mesh.getTotalVertices() <= 0) continue;
      mesh.computeWorldMatrix(true);
      const bi = mesh.getBoundingInfo();
      if (!bi) continue;
      const b = bi.boundingBox;
      min = BABYLON.Vector3.Minimize(min, b.minimumWorld);
      max = BABYLON.Vector3.Maximize(max, b.maximumWorld);
      found = true;
    }
    if (!found) return null;
    return { min, max };
  }

  function findPivotMesh(meshes) {
    const key = String(state.pivotMeshRequested || "").trim().toLowerCase();
    if (!key) return null;
    let exact = null;
    let partial = null;
    for (const mesh of meshes) {
      if (!(mesh instanceof BABYLON.AbstractMesh)) continue;
      const nm = String(mesh.name || "").toLowerCase();
      const id = String(mesh.id || "").toLowerCase();
      if (nm === key || id === key) {
        exact = mesh;
        break;
      }
      if (!partial && (nm.includes(key) || id.includes(key))) partial = mesh;
    }
    return exact || partial;
  }

  function setPivotPickMode(on) {
    state.pivotPickMode = !!on;
    if (el.pickPivotBtn) {
      el.pickPivotBtn.textContent = state.pivotPickMode ? "Click en modelo..." : "Elegir pivote con click";
      el.pickPivotBtn.style.background = state.pivotPickMode ? "#2563eb" : "";
      el.pickPivotBtn.style.borderColor = state.pivotPickMode ? "#60a5fa" : "";
    }
    updateHudAndConsole();
  }

  function isImportedRenderableMesh(mesh) {
    return importedRenderableMeshes.includes(mesh);
  }

  function pickPivotMeshFromPointer() {
    if (!importedRenderableMeshes.length) {
      setPivotPickMode(false);
      return false;
    }
    const pick = scene.pick(scene.pointerX, scene.pointerY, (m) => isImportedRenderableMesh(m));
    if (!pick?.hit || !pick.pickedMesh) {
      updateHudAndConsole();
      return false;
    }
    const mesh = pick.pickedMesh;
    const candidate = String(mesh.name || mesh.id || "").trim();
    if (!candidate) return false;
    state.pivotMeshRequested = candidate;
    setPivotPickMode(false);
    recenterModelToAnchorBase();
    syncInputs();
    updateHudAndConsole();
    return true;
  }

  function recenterModelToAnchorBase() {
    if (!importedRenderableMeshes.length) return;

    const savedPos = anchorRoot.position.clone();
    const savedRot = anchorRoot.rotation.y;
    anchorRoot.position.set(0, 0, 0);
    anchorRoot.rotation.y = 0;

    modelOffsetRoot.position.set(0, 0, 0);
    modelScaleRoot.scaling.setAll(state.modelScale);
    for (const mesh of importedRenderableMeshes) mesh.computeWorldMatrix(true);

    const pivotMesh = findPivotMesh(importedRenderableMeshes);
    const bounds = pivotMesh
      ? getWorldBoundsFromMeshes([pivotMesh])
      : getWorldBoundsFromMeshes(importedRenderableMeshes);

    if (bounds) {
      const cx = (bounds.min.x + bounds.max.x) / 2;
      const cz = (bounds.min.z + bounds.max.z) / 2;
      const minY = bounds.min.y;
      modelOffsetRoot.position.set(-cx, -minY, -cz);
      state.modelOffset = { x: -cx, y: -minY, z: -cz };
      state.pivotMeshUsed = pivotMesh ? String(pivotMesh.name || "") : "(combined)";
    } else {
      modelOffsetRoot.position.set(0, 0, 0);
      state.modelOffset = { x: 0, y: 0, z: 0 };
      state.pivotMeshUsed = null;
    }

    anchorRoot.position.copyFrom(savedPos);
    anchorRoot.rotation.y = savedRot;
  }

  async function loadModelFromFile(file) {
    if (!file) return;
    clearModel();
    const lower = String(file.name || "").toLowerCase();
    let ext = ".glb";
    if (lower.endsWith(".gltf")) ext = ".gltf";

    const url = URL.createObjectURL(file);
    try {
      const result = await BABYLON.SceneLoader.ImportMeshAsync("", "", url, scene, null, ext);
      const allNodes = [...result.transformNodes, ...result.meshes];
      const importedSet = new Set(allNodes);

      const topNodes = [];
      for (const node of allNodes) {
        if (!node) continue;
        const parent = node.parent;
        if (!parent || !importedSet.has(parent)) topNodes.push(node);
      }
      for (const node of topNodes) {
        if (node === pickGround || node === anchorRoot || node === modelOffsetRoot || node === modelScaleRoot) continue;
        node.parent = modelScaleRoot;
      }
      importedRootNodes = topNodes.filter((x) => x && x !== modelScaleRoot);
      importedRenderableMeshes = result.meshes.filter((m) =>
        (m instanceof BABYLON.AbstractMesh) &&
        m !== pickGround &&
        m !== anchorFootprint &&
        m !== anchorBox &&
        m !== anchorTileLines
      );
      importedAnimationGroups = Array.isArray(result.animationGroups) ? result.animationGroups.slice() : [];
      state.animGroupIndex = importedAnimationGroups.length ? 0 : -1;
      state.animFrame = 0;
      state.animPlaying = false;

      state.modelName = String(file.name || "modelo");
      setModelScale(state.modelScale);
      recenterModelToAnchorBase();
      applyModelOutlines();
      rebuildAnimationUi();
      if (state.animGroupIndex >= 0) {
        selectAnimationGroupByIndex(state.animGroupIndex, { sync: false, hud: false });
      }
      syncInputs();
      updateHudAndConsole();
    } catch (err) {
      console.error("No se pudo cargar el modelo:", err);
      clearModel();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function syncInputs() {
    if (el.footprintSelect) el.footprintSelect.value = String(state.footprint);
    if (el.anchorHeightInput) el.anchorHeightInput.value = String(r(state.anchorHeight, 2));
    if (el.showAnchorChk) el.showAnchorChk.checked = !!state.showAnchor;
    if (el.tileXInput) el.tileXInput.value = String(Math.round(state.tileX));
    if (el.tileZInput) el.tileZInput.value = String(Math.round(state.tileZ));
    if (el.rotInput) el.rotInput.value = String(Math.round(state.rotationDeg));
    if (el.zoomInput) el.zoomInput.value = String(r(state.zoomOrtho, 2));
    if (el.scaleInput) el.scaleInput.value = String(r(state.modelScale, 3));
    if (el.pivotInput) el.pivotInput.value = String(state.pivotMeshRequested || "");
    if (el.outlineChk) el.outlineChk.checked = !!state.outlineEnabled;
    if (el.outlineWidthInput) el.outlineWidthInput.value = String(Math.round(state.outlineWidth));
    if (el.outlineWidthValue) el.outlineWidthValue.textContent = String(Math.round(state.outlineWidth));

    const activeGroup = getSelectedAnimationGroup();
    const range = getAnimationGroupFrameRange(activeGroup);
    const hasAnim = !!activeGroup && !!range;
    if (el.animSelect) {
      const validIdx = (state.animGroupIndex >= 0 && state.animGroupIndex < importedAnimationGroups.length)
        ? state.animGroupIndex
        : -1;
      if (el.animSelect.value !== String(validIdx)) el.animSelect.value = String(validIdx);
      el.animSelect.disabled = importedAnimationGroups.length === 0;
    }
    if (el.animFrameInput) {
      if (range) {
        el.animFrameInput.min = String(Math.floor(range.from));
        el.animFrameInput.max = String(Math.ceil(range.to));
      } else {
        el.animFrameInput.min = "0";
        el.animFrameInput.max = "0";
      }
      el.animFrameInput.value = String(Math.round(n(state.animFrame, range ? range.from : 0)));
      el.animFrameInput.disabled = !hasAnim;
    }
    if (el.animStepInput) {
      el.animStepInput.value = String(Math.max(1, Math.round(n(state.animStep, 1))));
      el.animStepInput.disabled = !hasAnim;
    }
    if (el.animPlayBtn) el.animPlayBtn.disabled = !hasAnim;
    if (el.animPauseBtn) el.animPauseBtn.disabled = !hasAnim;
    if (el.animPrevBtn) el.animPrevBtn.disabled = !hasAnim;
    if (el.animNextBtn) el.animNextBtn.disabled = !hasAnim;
    if (el.animApplyFrameBtn) el.animApplyFrameBtn.disabled = !hasAnim;
    if (el.animResetBtn) el.animResetBtn.disabled = !hasAnim;
    if (el.animMeta) {
      if (!importedAnimationGroups.length) {
        el.animMeta.textContent = "Carga un modelo con animaciones para activar este panel.";
      } else if (!hasAnim) {
        el.animMeta.textContent = "Selecciona un clip para mover cuadro por cuadro.";
      } else {
        const gName = String(activeGroup?.name || `Anim ${state.animGroupIndex + 1}`);
        const playing = state.animPlaying ? "PLAY" : "PAUSA";
        el.animMeta.textContent = `${gName} | ${playing} | rango ${Math.round(range.from)}..${Math.round(range.to)} | cuadro ${Math.round(n(state.animFrame, range.from))}`;
      }
    }
  }

  function buildPayload() {
    const animGroup = getSelectedAnimationGroup();
    const animRange = getAnimationGroupFrameRange(animGroup);
    return {
      camera: {
        mode: "orthographic",
        alphaDeg: r(BABYLON.Tools.ToDegrees(ISO_ALPHA), 6),
        betaDeg: r(BABYLON.Tools.ToDegrees(ISO_BETA), 6),
        orthoZoom: r(state.zoomOrtho, 4)
      },
      anchorBase: {
        footprint: state.footprint,
        anchorHeight: r(state.anchorHeight, 3),
        tileX: Math.round(state.tileX),
        tileZ: Math.round(state.tileZ),
        worldCenterX: r(anchorRoot.position.x, 4),
        worldCenterZ: r(anchorRoot.position.z, 4),
        rotationDeg: r(state.rotationDeg, 4),
        showAnchor: !!state.showAnchor
      },
      model: {
        name: state.modelName || "(none)",
        scale: r(state.modelScale, 4),
        pivotMeshRequested: state.pivotMeshRequested,
        pivotMeshUsed: state.pivotMeshUsed || "(none)",
        outlineEnabled: !!state.outlineEnabled,
        outlineWidth: Math.round(state.outlineWidth),
        offset: {
          x: r(state.modelOffset.x, 5),
          y: r(state.modelOffset.y, 5),
          z: r(state.modelOffset.z, 5)
        }
      },
      animation: {
        clips: importedAnimationGroups.length,
        selectedIndex: Math.round(n(state.animGroupIndex, -1)),
        selectedName: animGroup ? String(animGroup.name || "(sin nombre)") : "(none)",
        playing: !!state.animPlaying,
        frame: r(n(state.animFrame, 0), 3),
        step: Math.max(1, Math.round(n(state.animStep, 1))),
        range: animRange ? { from: r(animRange.from, 3), to: r(animRange.to, 3) } : null
      },
      note: "La rotacion siempre se aplica en el centro de anchorBase (cubo guia)."
    };
  }

  function updateHudAndConsole() {
    const animGroup = getSelectedAnimationGroup();
    const animRange = getAnimationGroupFrameRange(animGroup);
    const animLine = animRange
      ? `Anim: ${String(animGroup?.name || `Anim ${state.animGroupIndex + 1}`)} | ${state.animPlaying ? "PLAY" : "PAUSA"} | Frame ${Math.round(n(state.animFrame, animRange.from))} (${Math.round(animRange.from)}..${Math.round(animRange.to)})`
      : `Anim: ${importedAnimationGroups.length ? "clip no valido" : "sin animaciones"}`;
    if (el.hud) {
      el.hud.textContent =
        `Base ${state.footprint}x${state.footprint} | Tile (${Math.round(state.tileX)}, ${Math.round(state.tileZ)}) | ` +
        `Rot ${Math.round(state.rotationDeg)} deg | Zoom ${r(state.zoomOrtho, 2)}\n` +
        `Modelo: ${state.modelName || "(sin cargar)"} | Pivot usado: ${state.pivotMeshUsed || "(none)"} | ` +
        `Scale ${r(state.modelScale, 3)} | Outline ${state.outlineEnabled ? "ON" : "OFF"} (${Math.round(state.outlineWidth)})\n` +
        `${animLine}\n` +
        `${state.pivotPickMode ? "MODO PIVOTE: click en el modelo para elegir centro." : "Click izquierdo en suelo: mover base."} Rueda: zoom ortografico.`;
    }
    if (el.console) {
      el.console.textContent = JSON.stringify(buildPayload(), null, 2);
    }
  }

  async function copyPayload() {
    const text = JSON.stringify(buildPayload(), null, 2);
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
    } catch (_) {
      // ignore
    }
  }

  function downloadDataUrl(dataUrl, fileName) {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function cropTransparentBorders(dataUrl, padding = 18) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const src = document.createElement("canvas");
          src.width = img.width;
          src.height = img.height;
          const sctx = src.getContext("2d", { willReadFrequently: true });
          if (!sctx) {
            resolve(dataUrl);
            return;
          }
          sctx.drawImage(img, 0, 0);
          const raw = sctx.getImageData(0, 0, src.width, src.height).data;

          let minX = src.width;
          let minY = src.height;
          let maxX = -1;
          let maxY = -1;
          for (let y = 0; y < src.height; y++) {
            for (let x = 0; x < src.width; x++) {
              const a = raw[((y * src.width) + x) * 4 + 3];
              if (a <= 0) continue;
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }

          if (maxX < minX || maxY < minY) {
            resolve(dataUrl);
            return;
          }

          minX = Math.max(0, minX - padding);
          minY = Math.max(0, minY - padding);
          maxX = Math.min(src.width - 1, maxX + padding);
          maxY = Math.min(src.height - 1, maxY + padding);

          const w = (maxX - minX) + 1;
          const h = (maxY - minY) + 1;
          const out = document.createElement("canvas");
          out.width = w;
          out.height = h;
          const octx = out.getContext("2d");
          if (!octx) {
            resolve(dataUrl);
            return;
          }
          octx.drawImage(src, minX, minY, w, h, 0, 0, w, h);
          resolve(out.toDataURL("image/png"));
        } catch (_) {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function fitPngToAdaptiveBox(dataUrl, options = {}) {
    const maxSide = Math.max(1, Math.round(n(options.maxSide, 1080)));
    const minSide = Math.max(1, Math.round(n(options.minSide, 180)));
    const padding = Math.max(0, Math.round(n(options.padding, 24)));
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const innerMaxW = Math.max(1, maxSide - (padding * 2));
          const innerMaxH = Math.max(1, maxSide - (padding * 2));
          const scale = Math.min(innerMaxW / img.width, innerMaxH / img.height);
          const drawW = Math.max(1, Math.round(img.width * scale));
          const drawH = Math.max(1, Math.round(img.height * scale));

          const outW = Math.min(maxSide, Math.max(minSide, drawW + (padding * 2)));
          const outH = Math.min(maxSide, Math.max(minSide, drawH + (padding * 2)));

          const out = document.createElement("canvas");
          out.width = outW;
          out.height = outH;
          const ctx = out.getContext("2d");
          if (!ctx) {
            resolve(dataUrl);
            return;
          }
          ctx.clearRect(0, 0, outW, outH);
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          const x = Math.round((outW - drawW) / 2);
          const y = Math.round((outH - drawH) / 2);
          ctx.drawImage(img, x, y, drawW, drawH);
          resolve(out.toDataURL("image/png"));
        } catch (_) {
          resolve(dataUrl);
        }
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  function pngBytesFromDataUrl(dataUrl) {
    const base64 = String(dataUrl || "").split(",")[1] || "";
    if (!base64) return null;
    const bin = atob(base64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) & 0xff;
    return out;
  }

  function dataUrlFromPngBytes(bytes) {
    const chunkSize = 0x8000;
    let bin = "";
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const sub = bytes.subarray(i, i + chunkSize);
      bin += String.fromCharCode(...sub);
    }
    return `data:image/png;base64,${btoa(bin)}`;
  }

  function readU32BE(bytes, offset) {
    return (
      ((bytes[offset] << 24) >>> 0) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      (bytes[offset + 3])
    ) >>> 0;
  }

  function writeU32BE(bytes, offset, value) {
    bytes[offset] = (value >>> 24) & 0xff;
    bytes[offset + 1] = (value >>> 16) & 0xff;
    bytes[offset + 2] = (value >>> 8) & 0xff;
    bytes[offset + 3] = value & 0xff;
  }

  function crc32(bytes) {
    if (!crc32.table) {
      const table = new Uint32Array(256);
      for (let i = 0; i < 256; i++) {
        let c = i;
        for (let j = 0; j < 8; j++) {
          c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[i] = c >>> 0;
      }
      crc32.table = table;
    }
    let c = 0xffffffff;
    const table = crc32.table;
    for (let i = 0; i < bytes.length; i++) {
      c = table[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makePngChunk(typeStr, dataBytes) {
    const type = new Uint8Array(4);
    for (let i = 0; i < 4; i++) type[i] = typeStr.charCodeAt(i) & 0xff;

    const len = dataBytes.length >>> 0;
    const out = new Uint8Array(12 + len);
    writeU32BE(out, 0, len);
    out.set(type, 4);
    out.set(dataBytes, 8);

    const crcInput = new Uint8Array(4 + len);
    crcInput.set(type, 0);
    crcInput.set(dataBytes, 4);
    writeU32BE(out, 8 + len, crc32(crcInput));
    return out;
  }

  function withPngPpi(dataUrl, ppi = 150) {
    try {
      const src = pngBytesFromDataUrl(dataUrl);
      if (!src || src.length < 12) return dataUrl;

      const sig = [137, 80, 78, 71, 13, 10, 26, 10];
      for (let i = 0; i < 8; i++) {
        if (src[i] !== sig[i]) return dataUrl;
      }

      const ppm = Math.max(1, Math.round(ppi / 0.0254)); // 150 ppi -> 5906 ppm
      const physData = new Uint8Array(9);
      writeU32BE(physData, 0, ppm);
      writeU32BE(physData, 4, ppm);
      physData[8] = 1; // unit = meter
      const physChunk = makePngChunk("pHYs", physData);

      const parts = [];
      parts.push(src.subarray(0, 8)); // signature

      let pos = 8;
      let inserted = false;
      while ((pos + 8) <= src.length) {
        const len = readU32BE(src, pos);
        const typeOffset = pos + 4;
        const dataOffset = pos + 8;
        const chunkEnd = dataOffset + len + 4;
        if (chunkEnd > src.length) break;

        const typeStr = String.fromCharCode(
          src[typeOffset],
          src[typeOffset + 1],
          src[typeOffset + 2],
          src[typeOffset + 3]
        );

        const chunk = src.subarray(pos, chunkEnd);
        if (typeStr !== "pHYs") {
          parts.push(chunk);
        }
        if (typeStr === "IHDR" && !inserted) {
          parts.push(physChunk);
          inserted = true;
        }
        pos = chunkEnd;
      }

      if (!inserted) return dataUrl;

      let total = 0;
      for (const p of parts) total += p.length;
      const out = new Uint8Array(total);
      let off = 0;
      for (const p of parts) {
        out.set(p, off);
        off += p.length;
      }
      return dataUrlFromPngBytes(out);
    } catch (_) {
      return dataUrl;
    }
  }

  async function exportCurrentPng() {
    let prevClear = null;
    let prevGrid = false;
    let prevAnchorFoot = false;
    let prevAnchorBox = false;
    let prevAnchorLines = false;
    let prevW = 0;
    let prevH = 0;
    let prevZoomState = 0;
    let prevTarget = null;
    let prevCamPos = null;
    let prevCamAlpha = 0;
    let prevCamBeta = 0;
    let prevCamRadius = 0;
    let restoredView = false;

    const restoreLiveEditorView = () => {
      if (restoredView) return;
      restoredView = true;
      if (prevClear) scene.clearColor = prevClear;
      if (groundGrid) groundGrid.setEnabled(prevGrid);
      if (anchorFootprint) anchorFootprint.setEnabled(prevAnchorFoot);
      if (anchorBox) anchorBox.setEnabled(prevAnchorBox);
      if (anchorTileLines) anchorTileLines.setEnabled(prevAnchorLines);
      if (prevW > 0 && prevH > 0) engine.setSize(prevW, prevH);
      if (prevTarget) setCameraTarget(prevTarget);
      if (prevCamPos && typeof camera.setPosition === "function") {
        camera.setPosition(prevCamPos.clone ? prevCamPos.clone() : prevCamPos);
      }
      camera.alpha = prevCamAlpha;
      camera.beta = prevCamBeta;
      camera.radius = prevCamRadius;
      if (prevTarget) setCameraTarget(prevTarget);
      state.zoomOrtho = clamp(n(prevZoomState, state.zoomOrtho), 4, 240);
      applyModelOutlines(1);
      applyOrtho();
      syncInputs();
      updateHudAndConsole();
      scene.render();
    };
    try {
      const hasModel = importedRenderableMeshes.some((m) =>
        (m instanceof BABYLON.AbstractMesh) &&
        (typeof m.getTotalVertices !== "function" || m.getTotalVertices() > 0)
      );
      if (!hasModel) return;

      const safeName = String(state.modelName || "iso_model")
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]+/g, "_");

      prevClear = scene.clearColor.clone();
      prevGrid = groundGrid ? groundGrid.isEnabled() : false;
      prevAnchorFoot = anchorFootprint ? anchorFootprint.isEnabled() : false;
      prevAnchorBox = anchorBox ? anchorBox.isEnabled() : false;
      prevAnchorLines = anchorTileLines ? anchorTileLines.isEnabled() : false;
      prevW = engine.getRenderWidth();
      prevH = engine.getRenderHeight();
      prevZoomState = state.zoomOrtho;
      prevTarget = camera.target?.clone ? camera.target.clone() : BABYLON.Vector3.Zero();
      prevCamPos = camera.position?.clone ? camera.position.clone() : null;
      prevCamAlpha = Number(camera.alpha) || 0;
      prevCamBeta = Number(camera.beta) || 0;
      prevCamRadius = Number(camera.radius) || 0;

      scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
      if (groundGrid) groundGrid.setEnabled(false);
      if (anchorFootprint) anchorFootprint.setEnabled(false);
      if (anchorBox) anchorBox.setEnabled(false);
      if (anchorTileLines) anchorTileLines.setEnabled(false);

      const exportCaptureSize = 1080;
      engine.setSize(exportCaptureSize, exportCaptureSize);
      applyOrtho();
      centerCameraOnModel({ fit: true, margin: 1.16, pad: 0.45, commitState: false, silent: true });
      applyModelOutlines(1.45);
      scene.render();
      let dataUrl = el.canvas.toDataURL("image/png");
      // Restaurar la vista del editor inmediatamente para que no "desaparezca"
      // mientras se procesa el PNG (crop/fit/ppi).
      restoreLiveEditorView();
      dataUrl = await cropTransparentBorders(dataUrl, 22);
      dataUrl = await fitPngToAdaptiveBox(dataUrl, {
        maxSide: 1080,
        minSide: 180,
        padding: 24
      });
      dataUrl = withPngPpi(dataUrl, 150);
      downloadDataUrl(dataUrl, `${safeName}_outline.png`);

    } catch (err) {
      console.error("No se pudo exportar PNG:", err);
    } finally {
      restoreLiveEditorView();
    }
  }

  buildAnchorHelpers();
  updateAnchorTransform();
  applyOrtho();
  syncInputs();
  updateHudAndConsole();

  let draggingPlacement = false;
  function placeFromPointer() {
    const pick = scene.pick(scene.pointerX, scene.pointerY, (m) => m === pickGround);
    if (!pick?.hit || !pick.pickedPoint) return;
    const fp = Math.max(1, Math.round(state.footprint));
    state.tileX = Math.round(pick.pickedPoint.x - (fp / 2));
    state.tileZ = Math.round(pick.pickedPoint.z - (fp / 2));
    updateAnchorTransform();
    syncInputs();
    updateHudAndConsole();
  }

  scene.onPointerObservable.add((pi) => {
    if (pi.type === BABYLON.PointerEventTypes.POINTERDOWN) {
      const ev = pi.event;
      if (ev.button === 0) {
        if (state.pivotPickMode) {
          draggingPlacement = false;
          pickPivotMeshFromPointer();
          return;
        }
        draggingPlacement = true;
        placeFromPointer();
      }
    } else if (pi.type === BABYLON.PointerEventTypes.POINTERMOVE) {
      if (draggingPlacement) placeFromPointer();
    } else if (
      pi.type === BABYLON.PointerEventTypes.POINTERUP ||
      pi.type === BABYLON.PointerEventTypes.POINTERDOUBLETAP
    ) {
      draggingPlacement = false;
    }
  });

  el.canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 0.93 : (1 / 0.93);
    state.zoomOrtho = clamp(state.zoomOrtho * factor, 4, 80);
    applyOrtho();
    syncInputs();
    updateHudAndConsole();
  }, { passive: false });

  if (el.loadBtn) {
    el.loadBtn.addEventListener("click", () => {
      const file = el.modelInput?.files?.[0];
      if (!file) return;
      loadModelFromFile(file);
    });
  }
  if (el.clearBtn) {
    el.clearBtn.addEventListener("click", () => {
      clearModel();
    });
  }
  if (el.scaleInput) {
    el.scaleInput.addEventListener("input", () => {
      state.modelScale = clamp(n(el.scaleInput.value, state.modelScale), 0.05, 8);
      setModelScale(state.modelScale);
      recenterModelToAnchorBase();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.pivotInput) {
    el.pivotInput.addEventListener("input", () => {
      state.pivotMeshRequested = String(el.pivotInput.value || "").trim();
      recenterModelToAnchorBase();
      updateHudAndConsole();
    });
  }
  if (el.pickPivotBtn) {
    el.pickPivotBtn.addEventListener("click", () => {
      if (!importedRenderableMeshes.length) return;
      setPivotPickMode(!state.pivotPickMode);
    });
  }
  if (el.pivotCombinedBtn) {
    el.pivotCombinedBtn.addEventListener("click", () => {
      state.pivotMeshRequested = "";
      setPivotPickMode(false);
      recenterModelToAnchorBase();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.outlineChk) {
    el.outlineChk.addEventListener("change", () => {
      state.outlineEnabled = !!el.outlineChk.checked;
      applyModelOutlines();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.outlineWidthInput) {
    el.outlineWidthInput.addEventListener("input", () => {
      state.outlineWidth = clamp(Math.round(n(el.outlineWidthInput.value, state.outlineWidth)), 1, 64);
      applyModelOutlines();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.footprintSelect) {
    el.footprintSelect.addEventListener("change", () => {
      state.footprint = clamp(Math.round(n(el.footprintSelect.value, state.footprint)), 1, 9);
      buildAnchorHelpers();
      updateAnchorTransform();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.anchorHeightInput) {
    el.anchorHeightInput.addEventListener("input", () => {
      state.anchorHeight = clamp(n(el.anchorHeightInput.value, state.anchorHeight), 0.2, 30);
      buildAnchorHelpers();
      updateAnchorTransform();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.showAnchorChk) {
    el.showAnchorChk.addEventListener("change", () => {
      state.showAnchor = !!el.showAnchorChk.checked;
      if (anchorFootprint) anchorFootprint.setEnabled(state.showAnchor);
      if (anchorBox) anchorBox.setEnabled(state.showAnchor);
      if (anchorTileLines) anchorTileLines.setEnabled(state.showAnchor);
      updateHudAndConsole();
    });
  }
  if (el.tileXInput) {
    el.tileXInput.addEventListener("input", () => {
      state.tileX = Math.round(n(el.tileXInput.value, state.tileX));
      updateAnchorTransform();
      updateHudAndConsole();
    });
  }
  if (el.tileZInput) {
    el.tileZInput.addEventListener("input", () => {
      state.tileZ = Math.round(n(el.tileZInput.value, state.tileZ));
      updateAnchorTransform();
      updateHudAndConsole();
    });
  }
  if (el.rotInput) {
    el.rotInput.addEventListener("input", () => {
      state.rotationDeg = n(el.rotInput.value, state.rotationDeg);
      updateAnchorTransform();
      updateHudAndConsole();
    });
  }
  if (el.rotLBtn) {
    el.rotLBtn.addEventListener("click", () => {
      state.rotationDeg -= 90;
      updateAnchorTransform();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.rotRBtn) {
    el.rotRBtn.addEventListener("click", () => {
      state.rotationDeg += 90;
      updateAnchorTransform();
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.zoomInput) {
    el.zoomInput.addEventListener("input", () => {
      state.zoomOrtho = clamp(n(el.zoomInput.value, state.zoomOrtho), 4, 80);
      applyOrtho();
      updateHudAndConsole();
    });
  }
  if (el.centerCamBtn) {
    el.centerCamBtn.addEventListener("click", () => {
      centerCameraOnModel({ fit: true, margin: 1.10, pad: 0.25 });
    });
  }
  if (el.resetCamBtn) {
    el.resetCamBtn.addEventListener("click", () => {
      resetCamera();
      updateHudAndConsole();
    });
  }
  if (el.copyBtn) {
    el.copyBtn.addEventListener("click", () => copyPayload());
  }
  if (el.exportBtn) {
    el.exportBtn.addEventListener("click", () => exportCurrentPng());
  }
  if (el.animSelect) {
    el.animSelect.addEventListener("change", () => {
      const idx = Math.round(n(el.animSelect.value, -1));
      selectAnimationGroupByIndex(idx);
    });
  }
  if (el.animPlayBtn) {
    el.animPlayBtn.addEventListener("click", () => {
      playSelectedAnimation();
    });
  }
  if (el.animPauseBtn) {
    el.animPauseBtn.addEventListener("click", () => {
      pauseSelectedAnimation();
    });
  }
  if (el.animPrevBtn) {
    el.animPrevBtn.addEventListener("click", () => {
      stepSelectedAnimationFrame(-1);
    });
  }
  if (el.animNextBtn) {
    el.animNextBtn.addEventListener("click", () => {
      stepSelectedAnimationFrame(1);
    });
  }
  if (el.animStepInput) {
    el.animStepInput.addEventListener("input", () => {
      state.animStep = Math.max(1, Math.round(n(el.animStepInput.value, state.animStep || 1)));
      syncInputs();
      updateHudAndConsole();
    });
  }
  if (el.animFrameInput) {
    el.animFrameInput.addEventListener("change", () => {
      const group = getSelectedAnimationGroup();
      const range = getAnimationGroupFrameRange(group);
      if (!range) return;
      scrubSelectedAnimationFrame(n(el.animFrameInput.value, range.from));
    });
  }
  if (el.animApplyFrameBtn) {
    el.animApplyFrameBtn.addEventListener("click", () => {
      const group = getSelectedAnimationGroup();
      const range = getAnimationGroupFrameRange(group);
      if (!range) return;
      scrubSelectedAnimationFrame(n(el.animFrameInput?.value, range.from));
    });
  }
  if (el.animResetBtn) {
    el.animResetBtn.addEventListener("click", () => {
      const group = getSelectedAnimationGroup();
      const range = getAnimationGroupFrameRange(group);
      if (!range) return;
      scrubSelectedAnimationFrame(range.from);
    });
  }

  window.addEventListener("resize", () => {
    engine.resize();
    applyOrtho();
  });

  let lastAnimHudSyncMs = 0;
  engine.runRenderLoop(() => {
    if (state.animPlaying) {
      const g = getSelectedAnimationGroup();
      const runtimeFrame = readAnimationRuntimeFrame(g);
      if (Number.isFinite(runtimeFrame)) state.animFrame = runtimeFrame;
      const now = performance.now();
      if ((now - lastAnimHudSyncMs) >= 120) {
        lastAnimHudSyncMs = now;
        syncInputs();
        updateHudAndConsole();
      }
    }
    scene.render();
  });
})();

