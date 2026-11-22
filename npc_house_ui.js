(function () {
  'use strict';

  if (typeof window === 'undefined') return;
  if (window.__YJ_NPC_HOUSE_UI_PATCHED) return;
  window.__YJ_NPC_HOUSE_UI_PATCHED = true;

  if (typeof MainScene === 'undefined') {
    console.warn('npc_house_ui.js: MainScene no disponible.');
    return;
  }

  const MODAL_ID = 'npc-house-modal';
  const STYLE_ID = 'npc-house-ui-style';
  const GRID_ROWS = 10;
  const GRID_COLS = 10;
  const TILE_W = 112;
  const TILE_H = 56;

  const FLOOR_OPTIONS = [
    { key: 'basic', label: 'Base', fill: '#355f35', edge: '#2f4f2f' },
    { key: 'wood', label: 'Madera', fill: '#7b5a3d', edge: '#5c4029' },
    { key: 'tile', label: 'Baldosa', fill: '#4b5f7b', edge: '#36465d' },
    { key: 'dark', label: 'Noche', fill: '#2b3345', edge: '#212939' }
  ];

  const FURNITURE_OPTIONS = [
    { key: 'sofa', label: 'Sofa', invKey: 'house_furni_sofa', color: '#38bdf8' },
    { key: 'mesa', label: 'Mesa', invKey: 'house_furni_mesa', color: '#f59e0b' },
    { key: 'cama', label: 'Cama', invKey: 'house_furni_cama', color: '#c084fc' },
    { key: 'lampara', label: 'Lampara', invKey: 'house_furni_lampara', color: '#facc15' }
  ];

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const m4 = (v) => ((Math.round(Number(v) || 0) % 4) + 4) % 4;
  const cellKey = (r, c) => `${Math.round(r)},${Math.round(c)}`;

  function getFloorDef(key) {
    return FLOOR_OPTIONS.find((it) => it.key === key) || FLOOR_OPTIONS[0];
  }

  function getFurnitureDef(key) {
    return FURNITURE_OPTIONS.find((it) => it.key === key) || null;
  }

  function stateKey(buildingId, slotIndex, slotKind) {
    return `${Number(buildingId) || 0}:${String(slotKind || 'resident')}:${Number(slotIndex) || 0}`;
  }

  MainScene.prototype.ensureNpcHouseUiStyle = function ensureNpcHouseUiStyle() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      #${MODAL_ID} {
        position: fixed;
        inset: 0;
        z-index: 1000004;
        background: rgba(2,6,23,.74);
        display: grid;
        place-items: center;
        pointer-events: auto;
        backdrop-filter: blur(2px);
      }
      #${MODAL_ID} .npc-house-window {
        width: min(1380px, 98vw);
        height: min(920px, 95vh);
        border-radius: 16px;
        border: 1px solid rgba(148,163,184,.35);
        box-shadow: 0 20px 62px rgba(0,0,0,.55);
        background: #0b1222;
        color: #e5e7eb;
        overflow: hidden;
        display: grid;
        grid-template-rows: auto 1fr;
        font-family: Arial, sans-serif;
      }
      #${MODAL_ID} .npc-house-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 14px;
        border-bottom: 1px solid rgba(255,255,255,.08);
        background: linear-gradient(180deg, rgba(15,23,42,.95), rgba(15,23,42,.72));
      }
      #${MODAL_ID} .npc-house-head-title b {
        display: block;
        font-size: 17px;
      }
      #${MODAL_ID} .npc-house-head-title span {
        font-size: 12px;
        color: #93c5fd;
      }
      #${MODAL_ID} .npc-house-close {
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 10px;
        background: #111827;
        color: #f3f4f6;
        font-size: 12px;
        font-weight: 700;
        padding: 8px 12px;
        cursor: pointer;
      }
      #${MODAL_ID} .npc-house-body {
        min-height: 0;
        display: block;
        position: relative;
      }
      #${MODAL_ID} .npc-house-stage-wrap {
        position: relative;
        min-height: 0;
        height: 100%;
        background:
          radial-gradient(circle at 50% 18%, rgba(96,165,250,.12), rgba(2,6,23,.0) 50%),
          linear-gradient(180deg, rgba(2,6,23,.42), rgba(2,6,23,.7));
        overflow: hidden;
      }
      #${MODAL_ID} .npc-house-canvas {
        width: 100%;
        height: 100%;
        display: block;
        user-select: none;
        touch-action: none;
        cursor: crosshair;
      }
      #${MODAL_ID} .npc-house-tip {
        position: absolute;
        left: 12px;
        bottom: 10px;
        font-size: 12px;
        color: #93c5fd;
        background: rgba(15,23,42,.68);
        border: 1px solid rgba(59,130,246,.26);
        border-radius: 8px;
        padding: 5px 8px;
      }
      #${MODAL_ID} .npc-house-place-ctrl {
        position: absolute;
        z-index: 9;
        display: none;
        gap: 8px;
        align-items: center;
      }
      #${MODAL_ID} .npc-house-place-ctrl.active {
        display: flex;
      }
      #${MODAL_ID} .npc-house-place-btn {
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 900;
        line-height: 1;
        padding: 8px 10px;
        cursor: pointer;
      }
      #${MODAL_ID} .npc-house-place-btn.ok {
        background: #22c55e;
        color: #032a18;
      }
      #${MODAL_ID} .npc-house-place-btn.x {
        background: #0f172a;
        color: #e5e7eb;
      }
      #${MODAL_ID} .npc-house-place-btn[disabled] {
        opacity: .35;
        cursor: not-allowed;
      }
      #${MODAL_ID} .npc-house-toolbar.is-hidden,
      #${MODAL_ID} .npc-house-tip.is-hidden {
        opacity: 0;
        pointer-events: none;
      }
      #${MODAL_ID} .npc-house-toolbar {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 7;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
      #${MODAL_ID} .npc-house-toolbtn {
        border: 1px solid rgba(255,255,255,.18);
        border-radius: 10px;
        background: rgba(15,23,42,.86);
        color: #e5e7eb;
        font-size: 12px;
        font-weight: 800;
        padding: 8px 11px;
        cursor: pointer;
      }
      #${MODAL_ID} .npc-house-toolbtn.active {
        border-color: rgba(56,189,248,.95);
        color: #67e8f9;
        box-shadow: 0 0 0 1px rgba(56,189,248,.34);
      }
      #${MODAL_ID} .npc-house-float-panel {
        position: absolute;
        top: 54px;
        right: 10px;
        z-index: 6;
        width: min(320px, 90vw);
        max-height: calc(100% - 90px);
        overflow: auto;
        border: 1px solid rgba(96,165,250,.34);
        border-radius: 12px;
        background: rgba(10,16,34,.88);
        padding: 10px;
        display: none;
        gap: 8px;
      }
      #${MODAL_ID} .npc-house-float-panel.active {
        display: grid;
      }
      #${MODAL_ID} .npc-house-lab-host {
        position: absolute;
        inset: 0;
        z-index: 20;
        display: none;
      }
      #${MODAL_ID} .npc-house-lab-host.active {
        display: block;
      }
      #${MODAL_ID} .npc-house-mini-panel {
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 24;
        width: min(440px, 94vw);
        max-height: calc(100% - 28px);
        overflow: auto;
        border-radius: 18px;
        border: 1px solid rgba(96,165,250,.28);
        background: linear-gradient(180deg, rgba(7,12,26,.96), rgba(4,9,22,.96));
        box-shadow: 0 18px 48px rgba(0,0,0,.42);
        padding: 12px;
        display: none;
      }
      #${MODAL_ID} .npc-house-mini-panel.active { display: block; }
      #${MODAL_ID} .house-mini-stars { color: #facc15; letter-spacing: 1px; font-size: 26px; font-weight: 900; line-height: 1; }
      #${MODAL_ID} .house-mini-diamonds { display:flex; gap:6px; }
      #${MODAL_ID} .house-mini-dia {
        width: 14px; height: 14px; transform: rotate(45deg);
        border-radius: 2px; border: 1px solid rgba(148,163,184,.52); background: rgba(30,41,59,.42);
      }
      #${MODAL_ID} .house-mini-dia.on {
        border-color: rgba(245,158,11,.85);
        background: linear-gradient(135deg,#fde68a,#f59e0b);
        box-shadow: 0 0 10px rgba(245,158,11,.35);
      }
      #${MODAL_ID} .house-mini-level-bar {
        margin-top: 6px;
        height: 10px;
        border-radius: 999px;
        background: rgba(30,41,59,.9);
        border: 1px solid rgba(148,163,184,.22);
        overflow: hidden;
      }
      #${MODAL_ID} .house-mini-level-fill {
        height: 100%;
        background: linear-gradient(90deg,#22d3ee,#38bdf8);
      }
      #${MODAL_ID} .house-mini-action-row { margin-top: 10px; display:grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap:8px; }
      #${MODAL_ID} .house-mini-action-btn {
        border: none; border-radius: 12px; padding: 10px 8px; font-size: 14px; font-weight: 900; cursor: pointer;
        color: #04111f;
      }
      #${MODAL_ID} .house-mini-action-btn.lvl { background: #fbbf24; }
      #${MODAL_ID} .house-mini-action-btn.skl { background: #38bdf8; }
      #${MODAL_ID} .house-mini-action-btn.evo { background: #c084fc; }
      #${MODAL_ID} .house-mini-passive {
        margin-top: 10px; border: 1px solid rgba(96,165,250,.24); border-radius: 12px; background: rgba(15,23,42,.58); padding: 10px;
      }
      #${MODAL_ID} .house-mini-passive b { font-size: 17px; }
      #${MODAL_ID} .house-mini-passive small { display:block; margin-top:3px; color:#cbd5e1; font-size: 12px; }
      #${MODAL_ID} .house-mini-stats-grid { margin-top: 10px; display:grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap:8px; }
      #${MODAL_ID} .house-mini-stat {
        border: 1px solid rgba(59,130,246,.2); border-radius: 12px; background: rgba(10,18,38,.72); padding: 8px; min-height: 106px;
        display:grid; grid-template-rows:auto auto auto;
      }
      #${MODAL_ID} .house-mini-stat-top { display:flex; justify-content:space-between; align-items:center; gap:8px; }
      #${MODAL_ID} .house-mini-stat-name { font-weight:900; font-size: 16px; line-height: 1; }
      #${MODAL_ID} .house-mini-stat-val { color:#f8fafc; font-weight:900; font-size: 32px; line-height:1; }
      #${MODAL_ID} .house-mini-stat-sub { color:#cbd5e1; font-size: 12px; line-height:1.15; margin-top: 4px; }
      #${MODAL_ID} .house-mini-stat-act { display:flex; justify-content:flex-end; gap:8px; margin-top: 6px; }
      #${MODAL_ID} .house-mini-stat-btn {
        width: 30px; height: 30px; border-radius: 10px; border: 1px solid rgba(148,163,184,.2); background:#0f172a; color:#e2e8f0; font-weight:900; cursor:pointer;
      }
      #${MODAL_ID} .house-mini-stat-btn[disabled] { opacity: .4; cursor: not-allowed; }
      #${MODAL_ID} .house-mini-foot {
        margin-top: 10px; border:1px solid rgba(96,165,250,.24); border-radius: 12px; background: rgba(15,23,42,.58);
        padding: 8px; display:grid; grid-template-columns: minmax(0,1fr) auto auto; gap:8px; align-items:center;
      }
      #${MODAL_ID} .house-mini-confirm {
        border:none; border-radius: 12px; background: linear-gradient(135deg,#22c55e,#16a34a); color:#032a18; font-size: 14px; font-weight: 900; padding: 9px 18px; cursor:pointer;
      }
      #${MODAL_ID} .house-mini-back {
        border:none; border-radius: 12px; background: #64748b; color:#f8fafc; font-size: 14px; font-weight: 900; padding: 9px 18px; cursor:pointer;
      }
      #${MODAL_ID} .house-mini-note { font-size: 13px; color:#cbd5e1; font-weight:700; }
      #${MODAL_ID} .npc-house-block {
        border: 1px solid rgba(96,165,250,.32);
        border-radius: 12px;
        background: rgba(15,23,42,.74);
        padding: 8px;
        font-size: 12px;
      }
      #${MODAL_ID} .npc-house-block b {
        display: block;
        font-size: 13px;
        margin-bottom: 4px;
      }
      #${MODAL_ID} .npc-house-grid { display: grid; gap: 6px; }
      #${MODAL_ID} .npc-house-grid.two { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      #${MODAL_ID} .npc-house-btn {
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 9px;
        background: #172034;
        color: #e5e7eb;
        font-size: 12px;
        font-weight: 700;
        padding: 8px 10px;
        cursor: pointer;
      }
      #${MODAL_ID} .npc-house-btn.active {
        border-color: rgba(56,189,248,.95);
        box-shadow: 0 0 0 1px rgba(56,189,248,.35);
      }
      #${MODAL_ID} .npc-house-inv-list {
        display: grid;
        gap: 6px;
      }
      #${MODAL_ID} .npc-house-inv-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid rgba(255,255,255,.12);
        border-radius: 8px;
        padding: 6px 8px;
        font-size: 12px;
        color: #dbeafe;
      }
      #${MODAL_ID} .npc-house-inv-empty {
        font-size: 12px;
        color: #93c5fd;
      }
      #${MODAL_ID} .npc-house-msg {
        min-height: 18px;
        font-size: 12px;
        color: #93c5fd;
      }
      #${MODAL_ID} .npc-house-scroll {
        min-height: 0;
        overflow: auto;
        padding-right: 3px;
      }
      .npc-house-open-link {
        border: 1px solid rgba(56,189,248,.7);
        border-radius: 8px;
        background: rgba(8,47,73,.38);
        color: #67e8f9;
        font-size: 11px;
        font-weight: 800;
        padding: 4px 6px;
        cursor: pointer;
        margin-top: 6px;
      }
      #npc-ghost-lab-modal.npc-house-stats-overlay {
        z-index: 1000006;
        background: rgba(2,6,23,.48);
        backdrop-filter: blur(1px);
      }
      #npc-ghost-lab-modal.npc-house-stats-overlay .ghost-lab-backdrop,
      #npc-ghost-lab-modal.npc-house-stats-overlay .ghost-lab-scene::before {
        background:
          radial-gradient(circle at 50% 16%, rgba(96,165,250,.18), rgba(2,6,23,.0) 45%),
          repeating-linear-gradient(30deg, rgba(96,165,250,.10) 0 1px, transparent 1px 42px),
          repeating-linear-gradient(-30deg, rgba(96,165,250,.10) 0 1px, transparent 1px 42px),
          linear-gradient(180deg, rgba(8,15,30,.84), rgba(5,10,22,.94));
      }
      #npc-ghost-lab-modal.npc-house-embedded {
        position: absolute !important;
        inset: 0 !important;
        z-index: 22 !important;
        background: transparent !important;
        backdrop-filter: none !important;
      }
      #npc-ghost-lab-modal.npc-house-embedded::before {
        content: "";
        position: absolute;
        inset: 0;
        pointer-events: none;
        background: linear-gradient(90deg, rgba(2,6,23,0) 50%, rgba(2,6,23,.35) 60%, rgba(2,6,23,.58) 100%);
      }
      #npc-ghost-lab-modal.npc-house-embedded .ghost-npc-lab-window {
        width: 100% !important;
        height: 100% !important;
        max-height: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        grid-template-columns: minmax(0,1fr) 460px !important;
      }
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-top {
        display: none !important;
      }
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-scene {
        background: transparent !important;
      }
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-backdrop,
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-scene::before,
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-stage {
        display: none !important;
      }
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-panel {
        grid-column: 2 / 3 !important;
        margin: 10px 12px 10px 0 !important;
        max-height: calc(100% - 20px) !important;
        background: rgba(7,12,26,.94) !important;
        border-radius: 20px !important;
      }
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-levelup-view,
      #npc-ghost-lab-modal.npc-house-embedded .ghost-lab-skilltree-view {
        display: none !important;
      }
      @media (max-width: 980px) {
        #${MODAL_ID} .npc-house-float-panel {
          width: min(92vw, 360px);
          right: 8px;
        }
      }
    `;
    document.head.appendChild(style);
  };

  MainScene.prototype.closeNpcHouseInteriorModal = function closeNpcHouseInteriorModal() {
    this.closeNpcHouseMiniStatsPanel?.();
    const rt = this._npcHouseRuntime;
    if (rt?.rafId) cancelAnimationFrame(rt.rafId);
    this._npcHouseRuntime = null;
    const modal = document.getElementById(MODAL_ID);
    if (modal) modal.remove();
  };

  MainScene.prototype.getNpcHouseInteriorState = function getNpcHouseInteriorState(buildingId, slotIndex, npcKey, slotKind) {
    if (!this._npcHouseStore) this._npcHouseStore = new Map();
    const bId = Number(buildingId) || 0;
    const sIdx = Number(slotIndex) || 0;
    const sKind = String(slotKind || 'resident');
    const key = stateKey(bId, sIdx, sKind);
    let state = this._npcHouseStore.get(key);
    if (state) {
      // La habitacion pertenece al slot. Si cambia el NPC, se conserva layout/posicion
      // y solo actualizamos el NPC activo para UI/stats.
      state.npcKey = String(npcKey || '');
      return state;
    }

    // Compatibilidad con sesiones anteriores: migrar clave vieja con npcKey incluido.
    const legacyPrefix = `${bId}:${sKind}:${sIdx}:`;
    for (const [k, legacyState] of this._npcHouseStore.entries()) {
      if (!String(k).startsWith(legacyPrefix)) continue;
      state = legacyState;
      this._npcHouseStore.delete(k);
      this._npcHouseStore.set(key, state);
      state.npcKey = String(npcKey || '');
      return state;
    }

    const b = (typeof buildings !== 'undefined' && buildings) ? buildings.get(Number(buildingId) || 0) : null;
    const rot = m4(Number(b?.rot) || Number(b?.rotationStep) || 0);
    const midR = Math.floor(GRID_ROWS / 2);
    const midC = Math.floor(GRID_COLS / 2);
    let exitCell = { r: midR, c: GRID_COLS - 1, side: 'E' };
    if (rot === 1) exitCell = { r: GRID_ROWS - 1, c: midC, side: 'S' };
    else if (rot === 2) exitCell = { r: midR, c: 0, side: 'O' };
    else if (rot === 3) exitCell = { r: 0, c: midC, side: 'N' };

    state = {
      buildingId: Number(buildingId) || 0,
      slotIndex: Number(slotIndex) || 0,
      slotKind: String(slotKind || 'resident'),
      npcKey: String(npcKey || ''),
      rows: GRID_ROWS,
      cols: GRID_COLS,
      floorKey: 'basic',
      activeTool: 'sofa',
      furnitures: [],
      message: 'Interior listo. Click en NPC para abrir stats.',
      exitCell,
      npc: {
        r: midR,
        c: midC,
        fromR: midR,
        fromC: midC,
        toR: midR,
        toC: midC,
        moveStart: 0,
        moveDur: 0,
        pauseUntil: 0,
        alpha: 1,
        outsideUntil: 0,
        returning: false,
        lastExitAt: 0,
        facingR: 0,
        facingC: 1
      }
    };
    this._npcHouseStore.set(key, state);
    return state;
  };

  MainScene.prototype.showNpcHouseMessage = function showNpcHouseMessage(text, isError) {
    const rt = this._npcHouseRuntime;
    if (!rt) return;
    rt.state.message = String(text || '');
    const el = rt.modal?.querySelector('#npcHouseMsg');
    if (!el) return;
    el.textContent = rt.state.message;
    el.style.color = isError ? '#fca5a5' : '#93c5fd';
  };

  MainScene.prototype.tryNpcHouseSpend = function tryNpcHouseSpend(cost, currency, label) {
    const eco = this.economy;
    const amount = Math.max(0, Math.round(Number(cost) || 0));
    if (!amount) return true;
    if (!eco) return false;

    if (currency === 'yapa') {
      if (typeof eco.spendYapas === 'function') {
        return !!eco.spendYapas(amount, `Casa NPC: ${label || 'Decoracion'}`);
      }
      return false;
    }

    if ((Number(eco.gold) || 0) < amount) return false;
    if (typeof eco.addGold === 'function') {
      eco.addGold(-amount);
      return true;
    }
    eco.gold = Math.max(0, Math.round((Number(eco.gold) || 0) - amount));
    eco.refreshUI?.();
    return true;
  };

  MainScene.prototype.openNpcStatsOverlayFromHouse = function openNpcStatsOverlayFromHouse(npcKey) {
    const key = String(npcKey || '').trim();
    if (!key || !this.economy?.openGhostNpcLabModal) return false;
    const host = this._npcHouseRuntime?.modal?.querySelector('#npcHouseLabHost');
    if (!host) return false;
    this._npcHouseRuntime?.modal?.querySelector('#npcHouseBuildPanel')?.classList.remove('active');
    this._npcHouseRuntime?.modal?.querySelector('#npcHouseInvPanel')?.classList.remove('active');
    this._npcHouseRuntime?.modal?.querySelector('#npcHouseBtnBuild')?.classList.remove('active');
    this._npcHouseRuntime?.modal?.querySelector('#npcHouseBtnInv')?.classList.remove('active');
    host.classList.add('active');
    const ok = this.economy.openGhostNpcLabModal({
      npcKey: key,
      sourceMode: 'inventory',
      backgroundMode: 'plain',
      focused: true,
      focusPhase: 'focused',
      view: 'main',
      contextTitle: 'NPC - Interior de Casa',
      contextSubtitle: 'Gestion directa del NPC desde su casa.'
    });
    if (!ok) {
      host.classList.remove('active');
      return false;
    }
    const modal = document.getElementById('npc-ghost-lab-modal');
    if (!modal) {
      host.classList.remove('active');
      return false;
    }
    modal.classList.remove('npc-house-stats-overlay');
    modal.classList.add('npc-house-embedded');
    host.appendChild(modal);
    this.enforceNpcHouseMainOnlyPanel(modal);
    if (!modal._houseMainOnlyObserver) {
      const observer = new MutationObserver(() => {
        if (modal._houseMainOnlyPending) return;
        modal._houseMainOnlyPending = true;
        requestAnimationFrame(() => {
          modal._houseMainOnlyPending = false;
          if (!modal.isConnected) return;
          this.enforceNpcHouseMainOnlyPanel(modal);
        });
      });
      observer.observe(modal, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
      });
      modal._houseMainOnlyObserver = observer;
    }
    const clearHost = () => {
      const still = document.getElementById('npc-ghost-lab-modal');
      if (!still) host.classList.remove('active');
    };
    const closeBtn = modal.querySelector('#ghostNpcLabClose');
    if (closeBtn && !closeBtn.dataset.houseEmbedHooked) {
      closeBtn.dataset.houseEmbedHooked = '1';
      closeBtn.addEventListener('click', () => {
        setTimeout(clearHost, 0);
      });
    }
    return true;
  };

  MainScene.prototype.enforceNpcHouseMainOnlyPanel = function enforceNpcHouseMainOnlyPanel(modal) {
    if (!modal) return;
    try {
      if (this.economy?.ghostNpcLabState) this.economy.ghostNpcLabState.view = 'main';
    } catch (_) {}
    const win = modal.querySelector('.ghost-npc-lab-window');
    if (win) {
      win.classList.remove('is-locking', 'is-levelup', 'is-skilltree');
      win.classList.add('is-focused');
    }
    const top = modal.querySelector('.ghost-lab-top');
    if (top) top.style.display = 'none';
    const scene = modal.querySelector('.ghost-lab-scene');
    if (scene) scene.style.display = 'none';
    const lvl = modal.querySelector('.ghost-lab-levelup-view');
    if (lvl) lvl.style.display = 'none';
    const tree = modal.querySelector('.ghost-lab-skilltree-view');
    if (tree) tree.style.display = 'none';
  };

  MainScene.prototype.npcHouseCellToCanvas = function npcHouseCellToCanvas(rt, r, c) {
    return {
      x: rt.originX + (c - r) * (TILE_W * 0.5),
      y: rt.originY + (c + r) * (TILE_H * 0.5)
    };
  };

  MainScene.prototype.npcHouseCanvasToCell = function npcHouseCanvasToCell(rt, x, y) {
    const dx = x - rt.originX;
    const dy = y - rt.originY;
    const halfW = TILE_W * 0.5;
    const halfH = TILE_H * 0.5;
    const cF = ((dx / halfW) + (dy / halfH)) * 0.5;
    const rF = ((dy / halfH) - (dx / halfW)) * 0.5;
    const r = Math.round(rF);
    const c = Math.round(cF);
    if (!Number.isFinite(r) || !Number.isFinite(c)) return null;
    if (r < 0 || c < 0 || r >= rt.state.rows || c >= rt.state.cols) return null;
    return { r, c };
  };

  MainScene.prototype.evaluateNpcHousePlacement = function evaluateNpcHousePlacement(rt, cell) {
    if (!rt?.state || !cell) return { ok: false, reason: 'Fuera de la grilla.', cell: null };
    const state = rt.state;
    const r = Math.max(0, Math.min(state.rows - 1, Math.round(Number(cell.r) || 0)));
    const c = Math.max(0, Math.min(state.cols - 1, Math.round(Number(cell.c) || 0)));
    const out = { ok: false, reason: '', cell: { r, c }, mode: 'none', fd: null, removeIndex: -1 };

    if (r === state.exitCell.r && c === state.exitCell.c) {
      out.reason = 'La salida debe quedar libre.';
      return out;
    }

    if (state.activeTool === 'erase') {
      const idx = state.furnitures.findIndex((it) => Number(it.r) === r && Number(it.c) === c);
      if (idx < 0) {
        out.reason = 'No hay mueble en esa celda.';
        out.mode = 'erase';
        return out;
      }
      out.ok = true;
      out.mode = 'erase';
      out.removeIndex = idx;
      return out;
    }

    const fd = getFurnitureDef(state.activeTool);
    if (!fd) {
      out.reason = 'Selecciona un mueble.';
      return out;
    }
    const invKey = String(fd.invKey || '').trim();
    const eco = this.economy;
    const owned = invKey && eco
      ? Math.max(0, Math.round(Number(eco.inventory?.[invKey]) || 0))
      : 0;
    if (!owned) {
      out.reason = 'No tienes ese mueble. Compralo en tienda.';
      return out;
    }
    if (state.furnitures.some((it) => Number(it.r) === r && Number(it.c) === c)) {
      out.reason = 'Esa celda ya tiene un mueble.';
      return out;
    }
    out.ok = true;
    out.mode = 'place';
    out.fd = fd;
    return out;
  };

  MainScene.prototype.tryNpcHouseSpawnToStreet = function tryNpcHouseSpawnToStreet(state) {
    if (!state) return false;
    if (state.slotKind !== 'resident') return false;
    const b = (typeof buildings !== 'undefined' && buildings) ? buildings.get(Number(state.buildingId) || 0) : null;
    if (!b || !this.isNpcResidenceBuilding?.(b.typeKey)) return false;
    if (typeof this.spawnStreetNpcFromResidentBuilding !== 'function') return false;
    return !!this.spawnStreetNpcFromResidentBuilding(b, Number(state.slotIndex) || 0, Date.now());
  };

  MainScene.prototype.getResidentStreetNpcForHouseState = function getResidentStreetNpcForHouseState(state) {
    if (!state || state.slotKind !== 'resident' || !Array.isArray(this.streetNpcs)) return null;
    const bid = Number(state.buildingId) || 0;
    const slotIndex = Number(state.slotIndex) || 0;
    const expectedKey = String(state.npcKey || '').trim();
    if (!bid || !expectedKey) return null;
    for (const npc of this.streetNpcs) {
      if (!npc?.sprite?.active) continue;
      if (String(npc.spawnSource || '') !== 'conera') continue;
      if ((Number(npc.homeBuildingId) || 0) !== bid) continue;
      if ((Number(npc.residentSlotIndex) || 0) !== slotIndex) continue;
      if (String(npc.residentNpcKey || '').trim() !== expectedKey) continue;
      return npc;
    }
    return null;
  };

  MainScene.prototype.isResidentNpcOutsideWorldForHouseState = function isResidentNpcOutsideWorldForHouseState(state) {
    const npc = this.getResidentStreetNpcForHouseState(state);
    if (!npc) return false;
    const homeState = String(npc.homeState || '');
    if (homeState === 'home_sleeping' || homeState === 'home_entering' || homeState === 'home_waking') return false;
    return true;
  };

  MainScene.prototype.closeNpcHouseMiniStatsPanel = function closeNpcHouseMiniStatsPanel() {
    const rt = this._npcHouseRuntime;
    if (!rt?.modal) return;
    rt.houseMiniState = null;
    const panel = rt.modal.querySelector('#npcHouseMiniPanel');
    if (panel) {
      panel.classList.remove('active');
      panel.innerHTML = '';
    }
  };

  MainScene.prototype.renderNpcHouseMiniStatsPanel = function renderNpcHouseMiniStatsPanel() {
    const rt = this._npcHouseRuntime;
    if (!rt?.modal || !rt.houseMiniState) return;
    const panel = rt.modal.querySelector('#npcHouseMiniPanel');
    if (!panel) return;
    const s = rt.houseMiniState;
    const eco = this.economy;
    const evoLevel = Math.max(0, Math.min(5, Math.round(Number(this.getNpcEvolutionLevelForKey?.(s.npcKey)) || 0)));
    const stars = '★'.repeat(Math.max(1, Number(s.state?.rarity) || 1));
    const expNeed = Math.max(1, Number(eco?.getGhostNpcLabLevelExpNeed?.(s.state.level, s.state.rarity)) || 1);
    const levelFill = Math.max(0, Math.min(100, ((Number(s.state.exp) || 0) / expNeed) * 100));
    const cap = Math.max(1, Number(eco?.getGhostNpcLabReachableLevelCap?.(s.state)) || Number(eco?.getGhostNpcLabMaxLevel?.(s.state.rarity)) || 1);
    const draftTotal = Math.max(0, Number(eco?.getGhostNpcLabDraftCrystalTotal?.(s.state)) || 0);
    const spentTotal = Math.max(0, Number(eco?.getGhostNpcLabSpentCrystalTotal?.(s.state)) || 0);
    const statDefs = [
      { key: 'stamina', label: 'HP', color: '#4ade80' },
      { key: 'produccion', label: 'PR', color: '#fb923c' },
      { key: 'felicidad', label: 'FX', color: '#f472b6' },
      { key: 'inteligencia', label: 'IQ', color: '#60a5fa' },
      { key: 'fortuna', label: 'FT', color: '#fde047' },
      { key: 'estres', label: 'ES', color: '#c084fc' }
    ];

    panel.innerHTML = `
      <div style="font-size:44px;font-weight:900;line-height:1.05;">${s.state.name || s.npcKey}</div>
      <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-top:6px;">
        <div>
          <div class="house-mini-stars">${stars}</div>
          <div style="font-size:24px;color:#cbd5e1;font-weight:700;">Skill Lv ${Math.max(0, Math.round(Number(s.state.passiveLevel) || 0))} • Evo 1 desbloquea Skill Lv 1</div>
        </div>
        <div class="house-mini-diamonds">${Array.from({ length: 5 }, (_, i) => `<span class="house-mini-dia${i < evoLevel ? ' on' : ''}"></span>`).join('')}</div>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
        <div style="font-size:31px;font-weight:900;">Nivel</div>
        <div style="font-size:35px;font-weight:900;">${Math.max(1, Math.round(Number(s.state.level) || 1))}/${cap}</div>
      </div>
      <div class="house-mini-level-bar"><div class="house-mini-level-fill" style="width:${levelFill.toFixed(2)}%;"></div></div>
      <div class="house-mini-action-row">
        <button class="house-mini-action-btn lvl" id="houseMiniLevelBtn">Level Up</button>
        <button class="house-mini-action-btn skl" id="houseMiniSkillBtn">Habilidades</button>
        <button class="house-mini-action-btn evo" id="houseMiniEvoBtn">Evolucionar</button>
      </div>
      <div class="house-mini-passive">
        <b>Pasiva de ${s.state.name || s.npcKey}</b>
        <small>El dupe del mismo NPC sube la evolucion. Las stats usan cristales superiores del mismo color.</small>
      </div>
      <div class="house-mini-stats-grid">
        ${statDefs.map((it) => {
          const base = Math.max(0, Math.round(Number(s.state.stats?.[it.key]) || 0));
          const draft = Math.max(0, Math.round(Number(s.state.statCrystalDraft?.[it.key]) || 0));
          const val = base + draft;
          const canMinus = draft > 0;
          const canPlus = !!eco?.canGhostNpcLabAdjustStatDraft?.(s.state, it.key, 1);
          const disp = eco?.getGhostNpcLabAvailableCrystalsForStat?.(s.state, it.key);
          const dispText = Number.isFinite(Number(disp)) ? String(Math.max(0, Math.round(Number(disp)))) : '∞';
          return `
            <div class="house-mini-stat">
              <div class="house-mini-stat-top">
                <div class="house-mini-stat-name" style="color:${it.color};">${it.label}</div>
                <div class="house-mini-stat-val" style="color:${draft > 0 ? it.color : '#f8fafc'};">${val}</div>
              </div>
              <div class="house-mini-stat-sub">Cristal superior · Disp. ${dispText}</div>
              <div class="house-mini-stat-act">
                <button class="house-mini-stat-btn" data-mini-stat-minus="${it.key}" ${canMinus ? '' : 'disabled'}>−</button>
                <button class="house-mini-stat-btn" data-mini-stat-plus="${it.key}" ${canPlus ? '' : 'disabled'}>+</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="house-mini-foot">
        <div class="house-mini-note">Pendiente ${draftTotal} · Usado ${spentTotal}/150</div>
        <button class="house-mini-confirm" id="houseMiniConfirmBtn">Confirmar</button>
        <button class="house-mini-back" id="houseMiniBackBtn">Volver</button>
      </div>
    `;
    panel.classList.add('active');

    panel.querySelectorAll('[data-mini-stat-plus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = String(btn.getAttribute('data-mini-stat-plus') || '').trim();
        if (!key || !eco?.canGhostNpcLabAdjustStatDraft?.(s.state, key, 1)) return;
        s.state.statCrystalDraft[key] = Math.max(0, Math.round(Number(s.state.statCrystalDraft?.[key]) || 0) + 1);
        this.renderNpcHouseMiniStatsPanel();
      });
    });
    panel.querySelectorAll('[data-mini-stat-minus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = String(btn.getAttribute('data-mini-stat-minus') || '').trim();
        if (!key) return;
        const cur = Math.max(0, Math.round(Number(s.state.statCrystalDraft?.[key]) || 0));
        if (cur <= 0) return;
        s.state.statCrystalDraft[key] = cur - 1;
        this.renderNpcHouseMiniStatsPanel();
      });
    });
    panel.querySelector('#houseMiniConfirmBtn')?.addEventListener('click', () => {
      const res = eco?.applyGhostNpcLabStatDraft?.(s.state);
      if (!res?.ok) {
        const msg = res?.reason === 'funds' ? 'Cristales insuficientes.' : (res?.reason === 'cap' ? 'Limite de 150 alcanzado.' : 'Sin cambios pendientes.');
        this.showNpcHouseMessage(msg, true);
        return;
      }
      this.showNpcHouseMessage('Stats confirmadas.', false);
      this.renderNpcHouseMiniStatsPanel();
    });
    panel.querySelector('#houseMiniBackBtn')?.addEventListener('click', () => this.closeNpcHouseMiniStatsPanel());
    panel.querySelector('#houseMiniLevelBtn')?.addEventListener('click', () => this.showNpcHouseMessage('Level Up desde casa: en progreso.', false));
    panel.querySelector('#houseMiniSkillBtn')?.addEventListener('click', () => this.showNpcHouseMessage('Habilidades desde casa: en progreso.', false));
    panel.querySelector('#houseMiniEvoBtn')?.addEventListener('click', () => this.showNpcHouseMessage('Evolucionar desde casa: en progreso.', false));
  };

  MainScene.prototype.openNpcHouseMiniStatsPanel = function openNpcHouseMiniStatsPanel(npcKey) {
    const rt = this._npcHouseRuntime;
    const key = String(npcKey || '').trim();
    if (!rt?.modal || !key) return false;
    rt.modal.querySelector('#npcHouseBuildPanel')?.classList.remove('active');
    rt.modal.querySelector('#npcHouseInvPanel')?.classList.remove('active');
    rt.modal.querySelector('#npcHouseBtnBuild')?.classList.remove('active');
    rt.modal.querySelector('#npcHouseBtnInv')?.classList.remove('active');
    const eco = this.economy;
    if (!eco?.createDefaultGhostNpcLabState) return false;
    const state = eco.createDefaultGhostNpcLabState({
      npcKey: key,
      sourceMode: 'building',
      focused: true,
      focusPhase: 'focused',
      view: 'main',
      backgroundMode: 'plain',
      contextTitle: 'NPC - Interior de Casa',
      contextSubtitle: 'Panel compacto en casa.'
    });
    rt.houseMiniState = { npcKey: key, state };
    this.renderNpcHouseMiniStatsPanel();
    return true;
  };

  MainScene.prototype.updateNpcHouseNpc = function updateNpcHouseNpc(rt, dt, now) {
    const state = rt.state;
    const npc = state.npc;

    // Presencia exclusiva: si el residente esta afuera en mundo, no se dibuja en su habitacion.
    if (this.isResidentNpcOutsideWorldForHouseState(state)) {
      npc.alpha = Math.max(0, npc.alpha - (dt / 240));
      rt.npcRenderR = npc.r;
      rt.npcRenderC = npc.c;
      return;
    }

    if (npc.outsideUntil > now) {
      npc.alpha = Math.max(0, npc.alpha - (dt / 280));
      rt.npcRenderR = npc.r;
      rt.npcRenderC = npc.c;
      return;
    }

    if (npc.outsideUntil > 0 && npc.outsideUntil <= now) {
      npc.outsideUntil = 0;
      npc.returning = true;
      npc.r = state.exitCell.r;
      npc.c = state.exitCell.c;
      npc.fromR = npc.r;
      npc.fromC = npc.c;
      npc.toR = npc.r;
      npc.toC = npc.c;
      npc.moveStart = 0;
      npc.moveDur = 0;
      npc.pauseUntil = now + 420;
      this.showNpcHouseMessage('NPC regreso de la calle.', false);
    }

    npc.alpha = npc.returning
      ? Math.min(1, npc.alpha + (dt / 360))
      : Math.min(1, npc.alpha + (dt / 900));
    if (npc.returning && npc.alpha >= 0.98) npc.returning = false;

    if (npc.moveDur > 0) {
      const t = clamp((now - npc.moveStart) / npc.moveDur, 0, 1);
      rt.npcRenderR = npc.fromR + ((npc.toR - npc.fromR) * t);
      rt.npcRenderC = npc.fromC + ((npc.toC - npc.fromC) * t);
      if (t >= 1) {
        npc.r = npc.toR;
        npc.c = npc.toC;
        npc.moveDur = 0;
        npc.pauseUntil = now + (420 + Math.random() * 820);
        if ((now - npc.lastExitAt) > 12000
          && npc.r === state.exitCell.r
          && npc.c === state.exitCell.c
          && Math.random() < 0.33) {
          npc.lastExitAt = now;
          npc.outsideUntil = now + (2500 + Math.random() * 4200);
          this.tryNpcHouseSpawnToStreet(state);
          this.showNpcHouseMessage('NPC salio de casa hacia la calle.', false);
        }
      }
      return;
    }

    rt.npcRenderR = npc.r;
    rt.npcRenderC = npc.c;
    if (npc.pauseUntil > now) return;

    const blocked = new Set(state.furnitures.map((it) => cellKey(it.r, it.c)));
    const dirs = [
      { r: -1, c: 0 }, { r: 1, c: 0 }, { r: 0, c: -1 }, { r: 0, c: 1 },
      { r: -1, c: -1 }, { r: -1, c: 1 }, { r: 1, c: -1 }, { r: 1, c: 1 }
    ];
    const options = [];
    for (const d of dirs) {
      const nr = npc.r + d.r;
      const nc = npc.c + d.c;
      if (nr < 0 || nc < 0 || nr >= state.rows || nc >= state.cols) continue;
      if (blocked.has(cellKey(nr, nc))) continue;
      options.push({ r: nr, c: nc, d });
    }
    if (!options.length) {
      npc.pauseUntil = now + 700;
      return;
    }
    const pick = options[Math.floor(Math.random() * options.length)];
    npc.fromR = npc.r;
    npc.fromC = npc.c;
    npc.toR = pick.r;
    npc.toC = pick.c;
    npc.facingR = pick.d.r;
    npc.facingC = pick.d.c;
    npc.moveStart = now;
    npc.moveDur = 700 + (Math.random() * 900);
  };

  MainScene.prototype.renderNpcHouseFrame = function renderNpcHouseFrame(rt, dt, now) {
    const canvas = rt.canvas;
    const ctx = rt.ctx;
    const state = rt.state;
    const toolbar = rt.modal?.querySelector('.npc-house-toolbar');
    const tip = rt.modal?.querySelector('.npc-house-tip');
    toolbar?.classList.remove('is-hidden');
    tip?.classList.remove('is-hidden');
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(320, Math.round(rect.width * rt.dpr));
    const h = Math.max(240, Math.round(rect.height * rt.dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);
    rt.originX = Math.round(w * 0.5);
    rt.originY = Math.round(h * 0.21);

    this.updateNpcHouseNpc(rt, dt, now);

    const floor = getFloorDef(state.floorKey);
    const exit = state.exitCell;

    for (let r = 0; r < state.rows; r++) {
      for (let c = 0; c < state.cols; c++) {
        const p = this.npcHouseCellToCanvas(rt, r, c);
        const top = { x: p.x, y: p.y - TILE_H * 0.5 };
        const right = { x: p.x + TILE_W * 0.5, y: p.y };
        const bottom = { x: p.x, y: p.y + TILE_H * 0.5 };
        const left = { x: p.x - TILE_W * 0.5, y: p.y };
        const isExit = (r === exit.r && c === exit.c);

        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(right.x, right.y);
        ctx.lineTo(bottom.x, bottom.y);
        ctx.lineTo(left.x, left.y);
        ctx.closePath();
        ctx.fillStyle = isExit ? 'rgba(56,189,248,.35)' : floor.fill;
        ctx.fill();
        ctx.strokeStyle = isExit ? 'rgba(125,211,252,.95)' : floor.edge;
        ctx.lineWidth = Math.max(1, Math.round(1.2 * rt.dpr));
        ctx.stroke();
      }
    }

    for (const furni of state.furnitures) {
      const fd = getFurnitureDef(furni.key);
      if (!fd) continue;
      const p = this.npcHouseCellToCanvas(rt, furni.r, furni.c);
      const boxW = TILE_W * 0.9;
      const boxH = TILE_H * 0.9;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      ctx.moveTo(0, -boxH * 0.5);
      ctx.lineTo(boxW * 0.5, 0);
      ctx.lineTo(0, boxH * 0.5);
      ctx.lineTo(-boxW * 0.5, 0);
      ctx.closePath();
      ctx.fillStyle = fd.color;
      ctx.globalAlpha = 0.94;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'rgba(15,23,42,.95)';
      ctx.lineWidth = Math.max(1, Math.round(1.3 * rt.dpr));
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,.92)';
      ctx.font = `${Math.round(10 * rt.dpr)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(fd.label || '').slice(0, 1).toUpperCase(), 0, 0);
      ctx.restore();
    }

    const shouldGhost = rt.panelMode === 'build';
    const ghostRef = rt.pendingPlacement?.cell || rt.hoverCell;
    if (shouldGhost && ghostRef) {
      const evalRes = this.evaluateNpcHousePlacement(rt, ghostRef);
      const gp = this.npcHouseCellToCanvas(rt, evalRes.cell.r, evalRes.cell.c);
      const gw = TILE_W * 0.8;
      const gh = TILE_H * 0.8;
      const good = !!evalRes.ok;
      const gFill = evalRes.mode === 'erase'
        ? (good ? 'rgba(245,158,11,.42)' : 'rgba(248,113,113,.32)')
        : (good ? 'rgba(34,197,94,.36)' : 'rgba(248,113,113,.32)');
      const gStroke = evalRes.mode === 'erase'
        ? (good ? 'rgba(251,191,36,.95)' : 'rgba(248,113,113,.95)')
        : (good ? 'rgba(74,222,128,.95)' : 'rgba(248,113,113,.95)');
      ctx.save();
      ctx.translate(gp.x, gp.y);
      ctx.beginPath();
      ctx.moveTo(0, -gh * 0.5);
      ctx.lineTo(gw * 0.5, 0);
      ctx.lineTo(0, gh * 0.5);
      ctx.lineTo(-gw * 0.5, 0);
      ctx.closePath();
      ctx.fillStyle = gFill;
      ctx.fill();
      ctx.strokeStyle = gStroke;
      ctx.lineWidth = Math.max(1, Math.round(1.6 * rt.dpr));
      ctx.stroke();

      ctx.font = `${Math.round(18 * rt.dpr)}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = good ? 'rgba(34,197,94,.98)' : 'rgba(248,113,113,.98)';
      ctx.fillText(good ? '✔' : '✖', 0, -Math.round(gh * 0.75));
      ctx.restore();
    }

    const ep = this.npcHouseCellToCanvas(rt, exit.r, exit.c);
    ctx.save();
    ctx.font = `${Math.round(11 * rt.dpr)}px Arial`;
    ctx.fillStyle = 'rgba(125,211,252,.95)';
    ctx.textAlign = 'center';
    ctx.fillText('SALIDA', ep.x, ep.y - (TILE_H * 0.9));
    ctx.restore();

    const nr = Number.isFinite(rt.npcRenderR) ? rt.npcRenderR : state.npc.r;
    const nc = Number.isFinite(rt.npcRenderC) ? rt.npcRenderC : state.npc.c;
    const np = this.npcHouseCellToCanvas(rt, nr, nc);
    rt.npcPxX = np.x;
    rt.npcPxY = np.y - TILE_H * 0.95;

    const cardW = TILE_W * 0.72;
    const cardH = TILE_H * 1.45;
    const alpha = clamp(Number(state.npc.alpha) || 0, 0, 1);
    if (alpha > 0.01) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(rt.npcPxX, rt.npcPxY);
      const grd = ctx.createLinearGradient(-cardW * 0.5, -cardH * 0.5, cardW * 0.5, cardH * 0.5);
      grd.addColorStop(0, 'rgba(59,130,246,.95)');
      grd.addColorStop(1, 'rgba(30,41,59,.95)');
      const rr = Math.max(4, 8 * rt.dpr * 0.5);
      ctx.beginPath();
      ctx.moveTo(-cardW * 0.5 + rr, -cardH * 0.5);
      ctx.arcTo(cardW * 0.5, -cardH * 0.5, cardW * 0.5, cardH * 0.5, rr);
      ctx.arcTo(cardW * 0.5, cardH * 0.5, -cardW * 0.5, cardH * 0.5, rr);
      ctx.arcTo(-cardW * 0.5, cardH * 0.5, -cardW * 0.5, -cardH * 0.5, rr);
      ctx.arcTo(-cardW * 0.5, -cardH * 0.5, cardW * 0.5, -cardH * 0.5, rr);
      ctx.closePath();
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.strokeStyle = 'rgba(125,211,252,.92)';
      ctx.lineWidth = Math.max(1, Math.round(1.2 * rt.dpr));
      ctx.stroke();

      const defs = (typeof ITEM_DEFS !== 'undefined' && ITEM_DEFS) ? ITEM_DEFS : {};
      const def = defs[state.npcKey] || {};
      const sig = String(def.cardSigil || def.icon || 'NPC').slice(0, 3);
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `${Math.round(12 * rt.dpr)}px Arial`;
      ctx.textAlign = 'center';
      ctx.fillText(sig, 0, Math.round(4 * rt.dpr));
      ctx.restore();
    }
  };

  MainScene.prototype.startNpcHouseLoop = function startNpcHouseLoop() {
    const rt = this._npcHouseRuntime;
    if (!rt) return;
    const tick = (ts) => {
      const cur = this._npcHouseRuntime;
      if (!cur || cur !== rt || !document.body.contains(cur.modal)) {
        this.closeNpcHouseInteriorModal();
        return;
      }
      const dt = clamp(ts - (cur.lastTs || ts), 8, 80);
      cur.lastTs = ts;
      this.renderNpcHouseFrame(cur, dt, Date.now());
      cur.rafId = requestAnimationFrame(tick);
    };
    rt.rafId = requestAnimationFrame(tick);
  };

  MainScene.prototype.openNpcHouseInteriorModal = function openNpcHouseInteriorModal(opts) {
    const buildingId = Number(opts?.buildingId) || 0;
    const slotIndex = Math.max(0, Math.round(Number(opts?.slotIndex) || 0));
    const slotKind = String(opts?.slotKind || 'resident');
    const npcKey = String(opts?.npcKey || '').trim();
    const sourceModal = String(opts?.sourceModal || '');
    if (!buildingId || !npcKey) return false;

    const b = (typeof buildings !== 'undefined' && buildings) ? buildings.get(buildingId) : null;
    if (!b) return false;

    this.ensureNpcHouseUiStyle();
    this.closeNpcHouseInteriorModal();

    if (sourceModal === 'resident-npc-modal' && typeof this.closeResidentNpcModal === 'function') this.closeResidentNpcModal();
    if (sourceModal === 'npc-slots-modal' && typeof this.closeNpcSlotsModal === 'function') this.closeNpcSlotsModal();

    const defs = (typeof ITEM_DEFS !== 'undefined' && ITEM_DEFS) ? ITEM_DEFS : {};
    const npcDef = defs[npcKey] || {};
    const bDef = (typeof BUILDING_TYPES !== 'undefined' && BUILDING_TYPES) ? (BUILDING_TYPES[b.typeKey] || null) : null;
    const state = this.getNpcHouseInteriorState(buildingId, slotIndex, npcKey, slotKind);

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="npc-house-window">
        <div class="npc-house-head">
          <div class="npc-house-head-title">
            <b>Interior NPC - ${bDef?.label || b.typeKey}</b>
            <span>${npcDef?.name || npcKey} | Slot ${slotIndex + 1} | Salida ${state.exitCell.side}</span>
          </div>
          <button type="button" class="npc-house-close" id="npcHouseCloseBtn">Cerrar</button>
        </div>
        <div class="npc-house-body">
          <div class="npc-house-stage-wrap">
            <canvas id="npcHouseCanvas" class="npc-house-canvas"></canvas>
            <div class="npc-house-toolbar">
              <button type="button" class="npc-house-toolbtn active" id="npcHouseBtnBuild">Construccion</button>
              <button type="button" class="npc-house-toolbtn" id="npcHouseBtnInv">Inventario casa</button>
            </div>
            <section id="npcHouseBuildPanel" class="npc-house-float-panel active">
              <div class="npc-house-block">
                <b>${npcDef?.name || npcKey}</b>
                <div>${'★'.repeat(Math.max(1, Number(npcDef?.rarity) || 1))} | ${npcDef?.icon || 'NPC'}</div>
              </div>
              <div class="npc-house-block">
                <b>Pisos</b>
                <div id="npcHouseFloorGrid" class="npc-house-grid two"></div>
              </div>
              <div class="npc-house-block">
                <b>Muebles</b>
                <div id="npcHouseFurnitureGrid" class="npc-house-grid"></div>
              </div>
              <div class="npc-house-block npc-house-scroll"><div class="npc-house-msg" id="npcHouseMsg"></div></div>
            </section>
            <section id="npcHouseInvPanel" class="npc-house-float-panel">
              <div class="npc-house-block">
                <b>Inventario de casa</b>
                <div id="npcHouseInvList" class="npc-house-inv-list"></div>
              </div>
              <div class="npc-house-block">
                <b>Tip</b>
                <div style="font-size:12px;color:#93c5fd;">Gestiona stats desde Inventario NPC.</div>
              </div>
            </section>
            <div id="npcHousePlaceCtrl" class="npc-house-place-ctrl">
              <button type="button" id="npcHousePlaceOk" class="npc-house-place-btn ok">✔</button>
              <button type="button" id="npcHousePlaceX" class="npc-house-place-btn x">✖</button>
            </div>
            <div class="npc-house-tip">Ghost activo: click en grilla y confirma con ✔ / ✖</div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const canvas = modal.querySelector('#npcHouseCanvas');
    const ctx = canvas?.getContext('2d', { alpha: true }) || null;
    if (!canvas || !ctx) {
      modal.remove();
      return false;
    }

    this._npcHouseRuntime = {
      modal,
      canvas,
      ctx,
      state,
      dpr: Math.max(1, Math.min(2, Number(window.devicePixelRatio) || 1)),
      rafId: 0,
      lastTs: performance.now(),
      originX: 0,
      originY: 0,
      npcPxX: 0,
      npcPxY: 0,
      npcRenderR: state.npc.r,
      npcRenderC: state.npc.c,
      hoverCell: null,
      pendingPlacement: null,
      panelMode: 'none',
      placeCtrl: modal.querySelector('#npcHousePlaceCtrl'),
      placeOk: modal.querySelector('#npcHousePlaceOk'),
      placeX: modal.querySelector('#npcHousePlaceX')
    };

    const close = () => this.closeNpcHouseInteriorModal();
    modal.querySelector('#npcHouseCloseBtn')?.addEventListener('click', close);
    modal.addEventListener('click', (ev) => {
      if (ev.target === modal) close();
    });

    const floorGrid = modal.querySelector('#npcHouseFloorGrid');
    if (floorGrid) {
      floorGrid.innerHTML = FLOOR_OPTIONS.map((f) => `
        <button type="button" class="npc-house-btn${f.key === state.floorKey ? ' active' : ''}" data-floor-key="${f.key}">${f.label}</button>
      `).join('');
      floorGrid.querySelectorAll('[data-floor-key]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const key = String(btn.getAttribute('data-floor-key') || 'basic');
          state.floorKey = key;
          floorGrid.querySelectorAll('[data-floor-key]').forEach((it) => it.classList.remove('active'));
          btn.classList.add('active');
          this.showNpcHouseMessage(`Piso cambiado a ${getFloorDef(key).label}.`, false);
        });
      });
    }

    const furnGrid = modal.querySelector('#npcHouseFurnitureGrid');
    if (furnGrid) {
      const tools = [
        ...FURNITURE_OPTIONS.map((f) => ({ key: f.key, label: f.label })),
        { key: 'erase', label: 'Borrar', currency: '' }
      ];
      const renderFurnitureGrid = () => {
        furnGrid.innerHTML = tools.map((t) => {
          if (t.key === 'erase') {
            return `<button type="button" class="npc-house-btn${state.activeTool === t.key ? ' active' : ''}" data-tool-key="${t.key}">${t.label}</button>`;
          }
          const fd = getFurnitureDef(t.key);
          const invKey = String(fd?.invKey || '').trim();
          const qty = invKey ? Math.max(0, Math.round(Number(this.economy?.inventory?.[invKey]) || 0)) : 0;
          return `
            <button type="button" class="npc-house-btn${state.activeTool === t.key ? ' active' : ''}" data-tool-key="${t.key}">
              ${t.label} x${qty}
            </button>
          `;
        }).join('');
        furnGrid.querySelectorAll('[data-tool-key]').forEach((btn) => {
          btn.addEventListener('click', () => {
            const key = String(btn.getAttribute('data-tool-key') || '');
            state.activeTool = key;
            furnGrid.querySelectorAll('[data-tool-key]').forEach((it) => it.classList.remove('active'));
            btn.classList.add('active');
            hidePlacementControls();
          });
        });
      };
      modal._renderFurnitureGrid = renderFurnitureGrid;
      renderFurnitureGrid();
    }

    const buildPanel = modal.querySelector('#npcHouseBuildPanel');
    const invPanel = modal.querySelector('#npcHouseInvPanel');
    const btnBuild = modal.querySelector('#npcHouseBtnBuild');
    const btnInv = modal.querySelector('#npcHouseBtnInv');
    const rt = this._npcHouseRuntime;
    const hidePlacementControls = () => {
      if (!rt) return;
      rt.pendingPlacement = null;
      if (rt.placeCtrl) rt.placeCtrl.classList.remove('active');
      if (rt.placeOk) rt.placeOk.disabled = true;
    };
    const positionPlacementControls = (cell) => {
      if (!rt || !rt.placeCtrl || !cell) return;
      const p = this.npcHouseCellToCanvas(rt, cell.r, cell.c);
      const cx = Math.round(p.x / rt.dpr);
      const cy = Math.round(p.y / rt.dpr);
      rt.placeCtrl.style.left = `${cx - 48}px`;
      rt.placeCtrl.style.top = `${cy + 14}px`;
    };
    const openPlacementControls = (evalRes) => {
      if (!rt || !evalRes?.cell) return;
      rt.pendingPlacement = { cell: { r: evalRes.cell.r, c: evalRes.cell.c } };
      if (!rt.placeCtrl || !rt.placeOk) return;
      positionPlacementControls(evalRes.cell);
      rt.placeOk.disabled = !evalRes.ok;
      rt.placeCtrl.classList.add('active');
    };
    const applyPendingPlacement = () => {
      if (!rt?.pendingPlacement) return;
      const evalRes = this.evaluateNpcHousePlacement(rt, rt.pendingPlacement.cell);
      if (!evalRes.ok) {
        this.showNpcHouseMessage(evalRes.reason || 'No se puede colocar aqui.', true);
        if (rt.placeOk) rt.placeOk.disabled = true;
        return;
      }
      if (evalRes.mode === 'erase') {
        const removed = state.furnitures.splice(evalRes.removeIndex, 1)[0] || null;
        if (removed?.key) {
          const rd = getFurnitureDef(removed.key);
          const invKey = String(rd?.invKey || '').trim();
          if (invKey) this.economy?.addItem?.(invKey, 1);
        }
        this.showNpcHouseMessage('Mueble retirado.', false);
        renderInvPanel();
        modal._renderFurnitureGrid?.();
        hidePlacementControls();
        return;
      }
      if (evalRes.mode === 'place' && evalRes.fd) {
        const invKey = String(evalRes.fd.invKey || '').trim();
        if (!invKey || !this.economy?.consumeItem?.(invKey, 1)) {
          this.showNpcHouseMessage('No tienes ese mueble. Compralo en tienda.', true);
          return;
        }
        state.furnitures.push({ key: evalRes.fd.key, r: evalRes.cell.r, c: evalRes.cell.c });
        this.showNpcHouseMessage(`${evalRes.fd.label} colocado.`, false);
        renderInvPanel();
        modal._renderFurnitureGrid?.();
      }
      hidePlacementControls();
    };

    rt.placeOk?.addEventListener('click', () => applyPendingPlacement());
    rt.placeX?.addEventListener('click', () => hidePlacementControls());

    let panelMode = 'none';
    const setPanelMode = (mode) => {
      if (mode === 'inv') panelMode = (panelMode === 'inv') ? 'none' : 'inv';
      else if (mode === 'build') panelMode = (panelMode === 'build') ? 'none' : 'build';
      else panelMode = 'none';
      if (rt) rt.panelMode = panelMode;
      buildPanel?.classList.toggle('active', panelMode === 'build');
      invPanel?.classList.toggle('active', panelMode === 'inv');
      btnBuild?.classList.toggle('active', panelMode === 'build');
      btnInv?.classList.toggle('active', panelMode === 'inv');
      if (panelMode !== 'build') hidePlacementControls();
    };
    btnBuild?.addEventListener('click', () => setPanelMode('build'));
    btnInv?.addEventListener('click', () => setPanelMode('inv'));
    setPanelMode('none');

    const renderInvPanel = () => {
      const list = modal.querySelector('#npcHouseInvList');
      if (!list) return;
      const rows = FURNITURE_OPTIONS.map((f) => {
        const def = getFurnitureDef(f.key);
        const invKey = String(def?.invKey || '').trim();
        const qty = invKey ? Math.max(0, Math.round(Number(this.economy?.inventory?.[invKey]) || 0)) : 0;
        return { key: f.key, name: def?.label || f.key, qty };
      }).filter((row) => row.qty > 0);
      if (!rows.length) {
        list.innerHTML = `<div class="npc-house-inv-empty">No tienes muebles comprados.</div>`;
        return;
      }
      list.innerHTML = rows.map((row) => {
        return `<div class="npc-house-inv-row"><span>${row.name}</span><b>x${row.qty}</b></div>`;
      }).join('');
    };
    renderInvPanel();

    canvas.addEventListener('click', (ev) => {
      const rt = this._npcHouseRuntime;
      if (!rt || rt.modal !== modal) return;
      const rect = canvas.getBoundingClientRect();
      const x = (ev.clientX - rect.left) * rt.dpr;
      const y = (ev.clientY - rect.top) * rt.dpr;

      const npcDist = Math.hypot(x - rt.npcPxX, y - rt.npcPxY);
      if ((Number(state.npc.alpha) || 0) > 0.25 && npcDist <= (46 * rt.dpr)) {
        this.showNpcHouseMessage('Stats del NPC: usa Inventario NPC.', false);
        return;
      }
      if (panelMode !== 'build') return;

      const cell = this.npcHouseCanvasToCell(rt, x, y);
      rt.hoverCell = cell;
      if (!cell) {
        hidePlacementControls();
        return;
      }
      const evalRes = this.evaluateNpcHousePlacement(rt, cell);
      openPlacementControls(evalRes);
      if (!evalRes.ok && evalRes.reason) {
        this.showNpcHouseMessage(evalRes.reason, true);
      } else if (evalRes.mode === 'erase') {
        this.showNpcHouseMessage('Listo para borrar. Confirma con ✔.', false);
      } else if (evalRes.mode === 'place' && evalRes.fd) {
        this.showNpcHouseMessage(`Listo para colocar ${evalRes.fd.label}. Confirma con ✔.`, false);
      }
    });

    canvas.addEventListener('pointermove', (ev) => {
      const cur = this._npcHouseRuntime;
      if (!cur || cur.modal !== modal || panelMode !== 'build') return;
      const rect = canvas.getBoundingClientRect();
      const x = (ev.clientX - rect.left) * cur.dpr;
      const y = (ev.clientY - rect.top) * cur.dpr;
      cur.hoverCell = this.npcHouseCanvasToCell(cur, x, y);
      if (cur.pendingPlacement?.cell) positionPlacementControls(cur.pendingPlacement.cell);
    });
    canvas.addEventListener('pointerleave', () => {
      const cur = this._npcHouseRuntime;
      if (!cur || cur.modal !== modal) return;
      cur.hoverCell = null;
    });

    this.showNpcHouseMessage(state.message, false);
    this.startNpcHouseLoop();
    return true;
  };

  MainScene.prototype.attachNpcHouseOpenHooks = function attachNpcHouseOpenHooks(modalId, cardSelector, idxAttr, iconSelector, slotKind) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const buildingId = Number(modal.dataset.buildingId || 0);
    if (!buildingId) return;
    const b = (typeof buildings !== 'undefined' && buildings) ? buildings.get(buildingId) : null;
    if (!b) return;

    const slots = slotKind === 'resident'
      ? this.ensureResidentNpcSlotsForBuilding(b)
      : this.ensureNpcSlotsForBuilding(b);
    if (!Array.isArray(slots) || !slots.length) return;

    modal.querySelectorAll(cardSelector).forEach((card) => {
      const idx = Math.max(0, Math.round(Number(card.getAttribute(idxAttr) || 0)));
      const slot = slots[idx];
      const npcKey = String(slot?.key || '').trim();
      if (!npcKey.startsWith('npc_')) return;

      const openInterior = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        this.openNpcHouseInteriorModal({
          buildingId,
          slotIndex: idx,
          slotKind,
          npcKey,
          sourceModal: modalId
        });
      };

      const icon = card.querySelector(iconSelector);
      if (icon && !icon.dataset.houseHooked) {
        icon.dataset.houseHooked = '1';
        icon.style.cursor = 'pointer';
        icon.title = 'Abrir interior de casa';
        icon.addEventListener('click', openInterior);
      }

      if (!card.querySelector('.npc-house-open-link')) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'npc-house-open-link';
        btn.textContent = 'Casa';
        btn.addEventListener('click', openInterior);
        card.appendChild(btn);
      }
    });
  };

  const originalUpdateResidentNpcModal = MainScene.prototype.updateResidentNpcModal;
  MainScene.prototype.updateResidentNpcModal = function patchedUpdateResidentNpcModal(...args) {
    const out = originalUpdateResidentNpcModal.apply(this, args);
    this.attachNpcHouseOpenHooks('resident-npc-modal', '.resident-slot-card', 'data-resident-slot-index', '.resident-slot-icon', 'resident');
    return out;
  };

  const originalUpdateNpcSlotsModal = MainScene.prototype.updateNpcSlotsModal;
  MainScene.prototype.updateNpcSlotsModal = function patchedUpdateNpcSlotsModal(...args) {
    const out = originalUpdateNpcSlotsModal.apply(this, args);
    this.attachNpcHouseOpenHooks('npc-slots-modal', '.npc-slot-card', 'data-npc-slot-index', '.npc-slot-icon', 'npc');
    return out;
  };
})();
