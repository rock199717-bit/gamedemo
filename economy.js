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
const GREEN_HOUSE_ICON_HTML = `<img src="img/green_casa1x1_normal.png" alt="Casa Decorativa" style="width:18px;height:auto;display:inline-block;vertical-align:middle;">`;
const YAPA_WISH_COST_PERM = 150;
const YAPA_WISH_COST_LIM = 150;

// ===== ITEMS (lo que \u201Csale\u201D del gachapon / banner) =====
const ITEM_DEFS = {
  // ===== VERDE (1\u2605/2\u2605/3\u2605) =====
  green_1:       { key: "green_1",       name: "Casa Decorativa", icon: GREEN_HOUSE_ICON_HTML, size: 1, rarity: 1 },
  road_main_2x2:        { key: "road_main_2x2",        name: "Carretera 2x2",  icon: "\u2B1C", size: 2, rarity: 1 },
  green_2:       { key: "green_2",       name: "Verde 2x2",     icon: "\uD83D\uDFE9", size: 2, rarity: 2 },
  green_3:       { key: "green_3",       name: "Verde 3x3",     icon: "\uD83D\uDFE9", size: 3, rarity: 3 },
  green_4:       { key: "green_4",       name: "Verde 4x4",     icon: "\uD83D\uDFE9\u2728", size: 4, rarity: 4 },
  // ===== ROJO (1\u2605/2\u2605/3\u2605/4\u2605) =====
  red_1:         { key: "red_1",         name: "Rojo 1x1",      icon: "\uD83D\uDFE5", size: 1, rarity: 1 },
  red_2:         { key: "red_2",         name: "Rojo 2x2",      icon: "\uD83D\uDFE5", size: 2, rarity: 2 },
  red_3:         { key: "red_3",         name: "Rojo 3x3",      icon: "\uD83D\uDFE5", size: 3, rarity: 3 },
  red_4:         { key: "red_4",         name: "Rojo 4x4",      icon: "\uD83D\uDFE5\u2728", size: 4, rarity: 4 },
  // ===== AZUL (1\u2605/2\u2605/3\u2605/4\u2605) =====
  blue_1:        { key: "blue_1",        name: "Azul 1x1",      icon: "\uD83D\uDFE6", size: 1, rarity: 1 },
  blue_2:        { key: "blue_2",        name: "Azul 2x2",      icon: "\uD83D\uDFE6", size: 2, rarity: 2 },
  blue_3:        { key: "blue_3",        name: "Azul 3x3",      icon: "\uD83D\uDFE6", size: 3, rarity: 3 },
  blue_4:        { key: "blue_4",        name: "Azul 4x4",      icon: "\uD83D\uDFE6\u2728", size: 4, rarity: 4 },

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
    this.yapaClockTimer = null;

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
      road_main_2x2: 120,
      green_2: 3,
      green_3: 2,
      green_4: 1
    };

    // ===== Pity / garant\u00EDas =====
    // 4\u2605: garantizado cada 10 (base 8%)
    // 5\u2605: 2% y garantizado cada 50
    this.permPity4 = 0;
    this.permPity5 = 0;

    this.limPity4 = 0;
    this.limPity5 = 0;

    // Si pierdes 50/50 en limitado, el siguiente 5\u2605 es del banner
    this.limGuaranteeFeatured = false;

    // ===== UI =====
    this.createUI();
    this.refreshUI();
    this.ensureInventoryButton();
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
  addItem(key, n = 1) {
    this.inventory = this.inventory || {};
    this.inventory[key] = (this.inventory[key] || 0) + n;
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
    const cur = this.inventory[key] || 0;
    if (cur < n) return false;
    this.inventory[key] = cur - n;
    this.updateModalCounts?.();
    return true;
  }

  hasBlockingOverlayOpen() {
    const ids = [
      "gacha-modal",
      "gacha-anim-overlay",
      "inventory-modal",
      "admin-modal",
      "yapa-modal",
      "yapa-qr-modal",
      "building-modal",
      "evo-modal"
    ];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      const st = window.getComputedStyle(el);
      if (st.display !== "none" && st.visibility !== "hidden") return true;
    }
    return false;
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
    const n = Math.max(0, Math.round(Number(value) || 0));
    return String(n);
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
    if (document.getElementById("yapaBtn")) return;

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

    const timer = document.createElement("div");
    timer.id = "yapaRailTimer";
    timer.className = "yapa-rail-timer";
    timer.textContent = "Bono: --:--";

    rail.appendChild(btn);
    rail.appendChild(timer);
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
    const n = Math.max(0, Math.round(Number(value) || 0));
    return `S/.${n}`;
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
    const v = Math.round(Number(amount) || 0);
    if (v === 0) return;
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
    if (v < 0) this.yapaSpentTotal += Math.abs(v);
  }

  spendYapas(v, detail = "Usuario") {
    const amount = Math.max(0, Math.round(Number(v) || 0));
    if (amount <= 0) return false;
    if (this.yapas < amount) return false;
    this.yapas -= amount;
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
    const root = modal || document.getElementById("yapa-modal");
    if (!root) return;
    root.classList.toggle("yapa-wish-open", this.yapaWishViewOpen);
    this.renderYapaModalData();
  }

  openYapaModal() {
    if (document.getElementById("yapa-modal")) return;
    this.yapaShowMovements = false;
    this.yapaWishViewOpen = false;

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
              <button class="yapa-shortcut" data-yapa-note="Tienda">
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
    this.renderAdminRoadPieceList(modal.querySelector("#adminRoadList"), setHint);
  }

  renderAdminList(listEl) {
    if (!listEl) return;
    const keys = Object.keys(ITEM_DEFS);
    const rows = keys.map((k) => {
      const def = ITEM_DEFS[k];
      const c = this.inventory[k] || 0;
      return `
        <button class="inv-row" data-admin="${k}">
          <span class="inv-left">
            <span class="inv-name">${def.icon || "\u2756"} ${def.name || k}</span>
            <span class="inv-meta">${def.size}x${def.size} \u2022 ${def.rarity}\u2605 \u2022 en inv: ${c}</span>
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

  selectBuildItem(key) {
    if (!key || !this.scene) return;
    if (document.getElementById("building-modal") || document.getElementById("evo-modal")) return;
    this.scene.clearAdminRoadPiecePlacement?.();
    this.scene.selectedBuildKey = key;
    this.scene.setBuildMode?.();
  }

  renderInventoryIntoContainer(listEl) {
    if (!listEl) return;

    const keys = Object.keys(ITEM_DEFS);
    const rows = keys.map((k) => {
      const def = ITEM_DEFS[k];
      const c = this.inventory[k] || 0;
      const disabled = c <= 0;
      return `
        <button class="inv-row ${disabled ? "is-empty" : ""}" data-item="${k}" ${disabled ? "disabled" : ""}>
          <div class="inv-left">
            <div class="inv-name">${def.icon} ${def.name}</div>
            <div class="inv-meta">${def.size}x${def.size} \u2022 ${def.rarity}\u2605</div>
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
        this.selectBuildItem(key);
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

    // Layout inicial
    this.layoutHorizontal();

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
      this.devSpawnQrBtn
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

    // Reserva exacta para: Oro 6 digitos, Deseos (texto + 3 digitos).
    // Ancho fijo por slot: no cambia aunque cambie el numero.
    const goldSlotW = isTiny ? 190 : 240;
    const yapaSlotW = isTiny ? 156 : 196;
    const permSlotW = isTiny ? 140 : 172;
    const limSlotW = isTiny ? 140 : 172;
    applyFixedWidth(this.goldText, goldSlotW);
    applyFixedWidth(this.yapaText, yapaSlotW);
    applyFixedWidth(this.permWishText, permSlotW);
    applyFixedWidth(this.limitedWishText, limSlotW);

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
    // Bloque EXP reservado completo: estrella izquierda + barra.
    const expBlockW = this.expBarWidth + (this.expUiIcon ? (expIconW + starToBarGap) : 0);
    x -= expBlockW;
    const barLeft = x + (this.expUiIcon ? (expIconW + starToBarGap) : 0);

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
      this.expUiIcon.x = x + (expIconW * 0.5);
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
      getUIWidth(this.devSpawnQrBtn)
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

  pickFiveStarKey(bannerType) {
    const isLimited = bannerType === "lim";
    if (!isLimited) return this.pickPermanentFiveStarKey();

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
    // bannerType: "perm" | "lim"
    const isLimited = bannerType === "lim";

    // pity counters
    let pity4 = isLimited ? this.limPity4 : this.permPity4;
    let pity5 = isLimited ? this.limPity5 : this.permPity5;

    pity4++;
    pity5++;

    let rarity = 2;

    // 5\u2605: 2% o garant\u00EDa a los 50
    const hit5 = (Phaser.Math.FloatBetween(0, 1) < 0.006) || (pity5 >= 50);
    if (hit5) rarity = 5;
    else {
      // 4\u2605: garant\u00EDa cada 10 (y una chance base)
      const hit4 = (Phaser.Math.FloatBetween(0, 1) < 0.08) || (pity4 >= 10);
      if (hit4) rarity = 4;
      else if (!isLimited) {
        // permanente: 1\u2605/2\u2605/3\u2605 = 40% / 30% / 30%
        const r = Phaser.Math.FloatBetween(0, 1);
        if (r < 0.40) rarity = 1;
        else if (r < 0.70) rarity = 2;
        else rarity = 3;
      } else {
        // limitado: sin 1\u2605 -> 3\u2605 70% / 2\u2605 30%
        const r = Phaser.Math.FloatBetween(0, 1);
        rarity = (r < 0.70) ? 3 : 2;
      }
    }

    // reset pity seg\u00FAn rarity
    if (rarity >= 4) pity4 = 0;
    if (rarity === 5) pity5 = 0;

    if (isLimited) {
      this.limPity4 = pity4;
      this.limPity5 = pity5;
    } else {
      this.permPity4 = pity4;
      this.permPity5 = pity5;
    }

    // --- decide itemKey seg\u00FAn banner + rareza ---
    let itemKey = "green_1"; // base
    if (rarity === 1) {
      const pool = ["green_1", "red_1", "blue_1"];
      itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
    } else if (rarity === 2) {
      const pool = ["green_2", "red_2", "blue_2"];
      itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
    } else if (rarity === 3) {
      const pool = ["green_3", "red_3", "blue_3"];
      itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
    }

    if (rarity === 4) {
      if (isLimited) {
        const pool = ["green_4", "red_4", "blue_4"];
        itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
      } else {
        const pool = ["green_4", "red_4", "blue_4"];
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
        z-index: 1000000;
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
    const size = def.size ? `${def.size}x${def.size}` : "";

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
    const isLimited = bannerType === "lim";
    const title = isLimited ? "Deseo Andino" : "Deseo Permanente";

    overlay.className = `gacha-anim-overlay ${isLimited ? "limited" : "permanent"}`;

    overlay.innerHTML = `
      <div class="gacha-anim-window ${isLimited ? "limited" : "permanent"}">
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

    const stage = overlay.querySelector("#gachaStage");
    const resultsEl = overlay.querySelector("#gachaResults");
    const skipBtn = overlay.querySelector("#gachaSkipBtn");
    const closeBtn = overlay.querySelector("#gachaCloseBtn");

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
        width: min(720px, 94vw);
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
        <style>
          #gacha-modal .banner-block {
            border: 1px solid rgba(255,255,255,.10);
            border-radius: 14px;
            padding: 12px;
            background: linear-gradient(180deg, rgba(15,23,42,.85), rgba(2,6,23,.9));
            display: grid;
            gap: 10px;
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
            border-radius: 12px;
            padding: 10px;
            background:
              radial-gradient(circle at 20% 20%, rgba(255,255,255,.08), transparent 45%),
              linear-gradient(135deg, rgba(30,41,59,.9), rgba(2,6,23,.9));
            border: 1px solid rgba(255,255,255,.06);
          }
          #gacha-modal .banner-featured {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 8px;
          }
          #gacha-modal .banner-featured.solo {
            grid-template-columns: minmax(0, 1fr);
          }
          #gacha-modal .banner-card {
            position: relative;
            border-radius: 12px;
            padding: 10px;
            min-height: 110px;
            background: linear-gradient(135deg, var(--b1), var(--b2));
            border: 1px solid color-mix(in srgb, var(--glow) 60%, rgba(255,255,255,.15));
            box-shadow: 0 8px 20px color-mix(in srgb, var(--glow) 40%, rgba(0,0,0,.5));
            overflow: hidden;
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
          #gacha-modal .banner-card.large {
            min-height: 140px;
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
            font-size: 26px;
            line-height: 1;
          }
          #gacha-modal .banner-title {
            font-weight: 700;
            margin-top: 6px;
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
          }
          @media (max-width: 900px) and (orientation: landscape) {
            #gacha-modal .banner-featured { grid-template-columns: 1fr; }
            #gacha-modal .banner-card { min-height: 90px; }
            #gacha-modal .banner-card.large { min-height: 120px; }
          }
        </style>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <h2 style="margin:0;font-size:18px;">\uD83C\uDFB0 Gachapon</h2>
          <button id="gachaClose" style="
            background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
            padding:8px 10px;border-radius:10px;cursor:pointer;
          ">\u2716</button>
        </div>

        <div class="gacha-grid" style="margin-top:12px; display:grid; grid-template-columns: 1.15fr .85fr; gap:12px;">
          <!-- Columna izquierda: banners -->
          <div style="display:grid; gap:12px;">
            <!-- Permanente -->
            <div class="banner-block">
              <div class="banner-head">
                <div class="banner-name">\uD83C\uDF1F Banner Permanente</div>
                <span>Deseos: <b id="permCount">${this.wishesPermanent}</b></span>
              </div>

              <div class="banner-hero">
                <div class="banner-featured">
                  ${this.renderBannerCard("perm_green_9")}
                  ${this.renderBannerCard("perm_red_9")}
                  ${this.renderBannerCard("perm_blue_9")}
                </div>
              </div>

              <small style="opacity:.8; display:block;">
                4\u2605 asegurado cada 10 \u2022 5\u2605: 0.6%
              </small>

              <div style="margin-top:4px; display:flex; gap:10px; flex-wrap:wrap;">
                <button id="permWish1" style="
                  background:#22c55e;color:#022c22;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x1</button>
                <button id="permWish10" style="
                  background:#16a34a;color:#022c22;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x10</button>
              </div>
            </div>

            <!-- Limitado -->
            <div class="banner-block">
              <div class="banner-head">
                <div class="banner-name">\u23F3 Banner Limitado</div>
                <span>Deseos: <b id="limCount">${this.wishesLimited}</b></span>
              </div>

              <div class="banner-hero">
                <div class="banner-featured solo">
                  ${this.renderBannerCard("lim_gold_2", { badge: "Promocional", large: true })}
                </div>
              </div>

              <div style="opacity:.85; font-size:13px;">
                4\u2605 asegurado cada 10 \u2022 5\u2605: 0.6%
              </div>

              <div style="margin-top:4px; display:flex; gap:10px; flex-wrap:wrap;">
                <button id="limWish1" style="
                  background:#f59e0b;color:#1f1400;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x1</button>
                <button id="limWish10" style="
                  background:#fbbf24;color:#1f1400;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x10</button>
              </div>
            </div>
          </div>

          <!-- Columna derecha: inventario -->
          <div style="border:1px solid rgba(255,255,255,.10); border-radius:14px; padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <b>\uD83C\uDF92 Inventario</b>
              <span style="opacity:.8; font-size:12px;">(Items para construir)</span>
            </div>
            <div id="invList" style="margin-top:10px; display:grid; gap:8px; max-height: 360px; overflow:auto;"></div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // abrir anim
    requestAnimationFrame(() => {
      const win = modal.querySelector(".gacha-window");
      if (!win) return;
      win.style.opacity = "1";
      win.style.transform = "translateY(0) scale(1)";
    });

    // cerrar
    const close = () => {
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
      this.recordYapaWishMovement(
        "out",
        type === "lim" ? "Deseo Limitado" : "Deseo Permanente",
        n
      );

      const results = [];
      const DOUBLE_FIVE_CHANCE = 0.0002; // 0.02%
      for (let i = 0; i < n; i++) {
        const doubleFive = Phaser.Math.FloatBetween(0, 1) < DOUBLE_FIVE_CHANCE;
        if (doubleFive) {
          if (type === "lim") {
            this.limPity4 = 0;
            this.limPity5 = 0;
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

    // render inventario inicial
    this.renderInventoryIntoModal();
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

      if (perm) perm.textContent = String(this.wishesPermanent);
      if (lim) lim.textContent = String(this.wishesLimited);

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
    const amount = Math.max(0, Math.round(Number(v) || 0));
    if (amount <= 0) return;
    this.yapas += amount;
    this.recordYapaMovement(amount, detail, kind);
    this.refreshUI();
    this.updateModalCounts();
  }
}

















