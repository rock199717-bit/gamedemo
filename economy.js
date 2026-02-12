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

const MAX_LEVEL = 100;
const GACHA_BTN_TEXTURE_KEY = "ui_gachapon_btn";

// ===== ITEMS (lo que \u201Csale\u201D del gachapon / banner) =====
const ITEM_DEFS = {
  // ===== VERDE (1\u2605/2\u2605/3\u2605) =====
  green_1:       { key: "green_1",       name: "Verde 1x1",     icon: "\uD83D\uDFE9", size: 1, rarity: 1 },
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

    // ===== Banner Permanente: sin barra de carga (se quit\u00F3 el ciclo) =====
  }

  // =========================
  // EXP / LEVEL
  // =========================
  calcExpToNext() {
    // curva para que se ponga m\u00E1s dif\u00EDcil y nivel 100 sea duro
    return Math.floor(120 * Math.pow(this.level, 1.45));
  }

  addExp(amount) {
    if (this.level >= MAX_LEVEL) return;

    this.exp += amount;

    while (this.exp >= this.expToNext && this.level < MAX_LEVEL) {
      this.exp -= this.expToNext;
      this.level++;
      this.expToNext = this.calcExpToNext();

      // Rewards por subir nivel (como pediste)
      // hasta 30: +10 perm, +5 lim, +10000 oro
      // luego: +3 perm, +3 lim, +1000 oro
      if (this.level <= 30) {
        this.wishesPermanent += 10;
        this.wishesLimited += 5;
        this.gold += 10000;
      } else {
        this.wishesPermanent += 3;
        this.wishesLimited += 3;
        this.gold += 1000;
      }
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
        <div id="adminList" class="inv-list admin-list"></div>
        <small class="inv-hint">Toca un item para a\u00F1adirlo al inventario.</small>
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

    this.renderAdminList(modal.querySelector("#adminList"));
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

    const style = (bg = "#020617") => ({
      fontFamily: "Arial",
      fontSize: "16px",
      color: "#e5e7eb",
      backgroundColor: bg
    });

    // --- Textos base (se posicionan en layoutHorizontal)
    this.goldText = s.add.text(0, 12, "", style())
      .setOrigin(1, 0)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);

    this.levelText = s.add.text(0, 12, "", style())
      .setOrigin(1, 0)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);

    // EXP label (texto debajo de la barra)
    this.expText = s.add.text(0, 30, "", style())
      .setOrigin(1, 0)
      .setPadding(6, 4)
      .setScrollFactor(0)
      .setDepth(9999);

    // EXP bar
    this.expBarBg = s.add.rectangle(0, 30, 140, 8, 0x1e293b)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(9999);

    this.expBarFill = s.add.rectangle(0, 30, 140, 8, 0x22c55e)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10000);
    this.expBarWidth = 140;

    // Deseos (perm / limited)
    this.permWishText = s.add.text(0, 12, "", style())
      .setOrigin(1, 0)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);

    this.limitedWishText = s.add.text(0, 12, "", style())
      .setOrigin(1, 0)
      .setPadding(8, 6)
      .setScrollFactor(0)
      .setDepth(9999);

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
    this.devPermBtn = s.add.text(0, 52, "+10 Perm (DEV)", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#022c22",
      backgroundColor: "#facc15"
    })
      .setOrigin(1, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devLimitedBtn = s.add.text(0, 52, "+10 Lim (DEV)", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#022c22",
      backgroundColor: "#f59e0b"
    })
      .setOrigin(1, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    this.devExpBtn = s.add.text(0, 52, "+50 EXP (DEV)", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#022c22",
      backgroundColor: "#38bdf8"
    })
      .setOrigin(1, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    // Click: abrir modal
    this.gachaBtn.on("pointerdown", (pointer) => {
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
      s.uiGuard?.(pointer);
      this.wishesPermanent += 10;
      this.refreshUI();
      this.updateModalCounts();
    });

    this.devLimitedBtn.on("pointerdown", (pointer) => {
      s.uiGuard?.(pointer);
      this.wishesLimited += 10;
      this.refreshUI();
      this.updateModalCounts();
    });

    this.devExpBtn.on("pointerdown", (pointer) => {
      s.uiGuard?.(pointer);
      this.addExp(50);
    });

    // Layout inicial
    this.layoutHorizontal();

    // Registrar UI para que worldCam lo ignore
    const uiList = [
      this.goldText,
      this.levelText,
      this.expText,
      this.expBarBg,
      this.expBarFill,
      this.permWishText,
      this.limitedWishText,
      this.gachaBtnGlow,
      this.gachaBtn,
      this.devPermBtn,
      this.devLimitedBtn,
      this.devExpBtn
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
    const right = w - 12;
    const isCompact = w <= 900;
    const isTiny = w <= 720;
    const top = isCompact ? 6 : 10;

    const fontSize = isTiny ? 13 : (isCompact ? 14 : 16);
    const smallFont = isTiny ? 12 : (isCompact ? 13 : 14);
    const padX = isTiny ? 7 : (isCompact ? 8 : 9);
    const padY = isTiny ? 5 : (isCompact ? 6 : 7);

    const apply = (el, f = fontSize, px = padX, py = padY) => {
      if (!el) return;
      if (typeof el.setFontSize === "function") el.setFontSize(f);
      if (typeof el.setPadding === "function") el.setPadding(px, py);
    };
    const getUIWidth = (el) => (el?.displayWidth ?? el?.width ?? 0);
    const syncGachaGlowPos = () => {
      if (!this.gachaBtnGlow || !this.gachaBtn) return;
      this.gachaBtnGlow.setPosition(this.gachaBtn.x, this.gachaBtn.y);
    };

    apply(this.goldText);
    apply(this.levelText);
    apply(this.permWishText);
    apply(this.limitedWishText);
    if (this.gachaBtnIsImage) {
      const targetH = isTiny ? 34 : (isCompact ? 40 : 46);
      this.gachaBtnBaseScale = targetH / this.gachaBtn.height;
      const hoverMul = this.gachaBtnHovering ? 1.03 : 1;
      this.gachaBtn.setScale(this.gachaBtnBaseScale * hoverMul);
      if (this.gachaBtnGlow) {
        this.gachaBtnGlow.setScale(this.gachaBtnBaseScale * 1.08);
        if (!this.gachaBtnHovering) this.gachaBtnGlow.setAlpha(0);
      }
    } else {
      apply(this.gachaBtn, fontSize, padX + 2, padY);
    }
    apply(this.devPermBtn, smallFont, padX, Math.max(3, padY - 1));
    apply(this.devLimitedBtn, smallFont, padX, Math.max(3, padY - 1));
    apply(this.devExpBtn, smallFont, padX, Math.max(3, padY - 1));

    this.expBarWidth = isTiny ? 100 : (isCompact ? 120 : 140);
    this.expBarBg.width = this.expBarWidth;
    this.expBarBg.setOrigin(1, 0);
    this.expBarFill.width = this.expBarWidth;
    this.expBarFill.setOrigin(1, 0);
    const ratio = (this.level >= MAX_LEVEL) ? 1 : ((this.expToNext <= 0) ? 0 : (this.exp / this.expToNext));
    this.setExpBarRatio(ratio);

    if (!isCompact) {
      // fila superior (derecha -> izquierda)
      let x = right;
      const topRow = [
        this.goldText,
        this.levelText,
        this.permWishText,
        this.limitedWishText,
        this.gachaBtn
      ];

      topRow.forEach((el) => {
        el.y = top;
        el.x = x;
        x -= (getUIWidth(el) + 10);
      });
      syncGachaGlowPos();

      // exp bar debajo del level
      this.expBarBg.x = this.levelText.x;
      this.expBarBg.y = top + 28;

      // fill alineado al bg
      this.expBarFill.x = this.expBarBg.x;
      this.expBarFill.y = this.expBarBg.y;

      // texto exp debajo
      this.expText.x = this.levelText.x;
      this.expText.y = top + 40;

      // DEV buttons (abajo, derecha)
      this.devExpBtn.x = right;
      this.devExpBtn.y = top + 68;

      this.devLimitedBtn.x = this.devExpBtn.x - (getUIWidth(this.devExpBtn) + 10);
      this.devLimitedBtn.y = this.devExpBtn.y;

      this.devPermBtn.x = this.devLimitedBtn.x - (getUIWidth(this.devLimitedBtn) + 10);
      this.devPermBtn.y = this.devLimitedBtn.y;
      return;
    }

    // Compacto: dos filas
    let x = right;
    const row1 = [
      this.gachaBtn,
      this.goldText,
      this.levelText
    ];
    row1.forEach((el) => {
      el.y = top;
      el.x = x;
      x -= (getUIWidth(el) + 8);
    });
    syncGachaGlowPos();

    const expBarY = top + 22;
    const expTextY = top + 34;
    this.expBarBg.x = this.levelText.x;
    this.expBarBg.y = expBarY;
    this.expBarFill.x = this.expBarBg.x;
    this.expBarFill.y = this.expBarBg.y;
    this.expText.x = this.levelText.x;
    this.expText.y = expTextY;

    const row2Y = top + 52;
    x = right;
    const row2 = [
      this.permWishText,
      this.limitedWishText
    ];
    row2.forEach((el) => {
      el.y = row2Y;
      el.x = x;
      x -= (getUIWidth(el) + 8);
    });

    const devY = row2Y + 26;
    this.devExpBtn.x = right;
    this.devExpBtn.y = devY;

    this.devLimitedBtn.x = this.devExpBtn.x - (getUIWidth(this.devExpBtn) + 8);
    this.devLimitedBtn.y = this.devExpBtn.y;

    this.devPermBtn.x = this.devLimitedBtn.x - (getUIWidth(this.devLimitedBtn) + 8);
    this.devPermBtn.y = this.devLimitedBtn.y;
  }

  setExpBarRatio(value) {
    const clamped = Phaser.Math.Clamp(value, 0, 1);
    this.expBarFill.scaleX = clamped;
    this.expBarFill.scaleY = 1;
  }

  refreshUI() {
    this.goldText.setText(`\uD83D\uDCB0 ${this.gold}`);
    this.levelText.setText(`\u2B50 Lv.${this.level}`);

    // deseos separados
    this.permWishText.setText(`\uD83C\uDF9F Perm: ${this.wishesPermanent}`);
    this.limitedWishText.setText(`\u23F3 Lim: ${this.wishesLimited}`);

    // exp text + bar
    const cur = this.exp;
    const next = this.expToNext;

    if (this.level >= MAX_LEVEL) {
      this.setExpBarRatio(1);
      this.expText.setText(`EXP: MAX`);
    } else {
      this.expText.setText(`EXP: ${cur}/${next}`);
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
        font-family: Arial;

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
    if (!modal) return;

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

    // tambi\u00E9n actualiza inventario standalone si est\u00E1 abierto
    const invModal = document.getElementById("inventory-modal");
    if (invModal) {
      const list = invModal.querySelector("#invList");
      this.renderInventoryIntoContainer(list);
    }
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
}
