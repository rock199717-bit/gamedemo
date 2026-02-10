// =========================
// ECONOMY SYSTEM (FULL)
// - Oro + Level/EXP con barra
// - Deseos separados (Perm / Lim)
// - Modal Gachapon con animación (abrir/cerrar)
// - Banner Permanente: items 4★ (Azul/Rojo/Amarillo)
// - DEV buttons: +10 Perm / +10 Lim
// - Inventario básico (se muestra en modal)
// - No gasta tickets ni da oro/exp por tirar deseos (solo da items).
// =========================

const MAX_LEVEL = 100;

// ===== ITEMS (lo que “sale” del gachapon / banner) =====
const ITEM_DEFS = {
  // ===== PERMANENTE (4★) =====
  perm_blue_9:   { key: "perm_blue_9",   name: "Azul 9x9",      icon: "🟦", size: 9, rarity: 4 },
  perm_red_1:    { key: "perm_red_1",    name: "Rojo 1x1",      icon: "🟥", size: 1, rarity: 4 },
  perm_yellow_4: { key: "perm_yellow_4", name: "Amarillo 4x4",  icon: "🟨", size: 4, rarity: 4 },

  // ===== VERDE (2★ mínimo) =====
  green_1:       { key: "green_1",       name: "Verde 1x1",     icon: "🟩", size: 1, rarity: 2 },

  // ===== 5★ permanente =====
  perm_green_9:  {
    key: "perm_green_9",
    name: "Verde 9x9",
    icon: "🟩✨",
    size: 9,
    rarity: 5,
    cardTag: "Bosque Sagrado",
    cardSigil: "🌿",
    cardBg1: "#0b3b2c",
    cardBg2: "#052e1b",
    cardAccent: "#22c55e"
  },

  // ===== LIMITADO (4★) =====
  lim_blue_2:    { key: "lim_blue_2",    name: "Azul 2x2",      icon: "🟦", size: 2, rarity: 4 },
  lim_red_2:     { key: "lim_red_2",     name: "Rojo 2x2",      icon: "🟥", size: 2, rarity: 4 },
  lim_yellow_2:  { key: "lim_yellow_2",  name: "Amarillo 2x2",  icon: "🟨", size: 2, rarity: 4 },

  // ===== 5★ limitado =====
  lim_gold_2:    {
    key: "lim_gold_2",
    name: "Dorado 2x2",
    icon: "🟨✨",
    size: 2,
    rarity: 5,
    cardTag: "Sol Dorado",
    cardSigil: "☀️",
    cardBg1: "#4a2100",
    cardBg2: "#7c2d12",
    cardAccent: "#f59e0b"
  },
};

class EconomySystem {
  constructor(scene) {
    this.scene = scene;
    this.isWishAnimating = false;

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
    this.inventory = {};

    // ===== Pity / garantías =====
    // 4★: garantizado cada 10 (base 8%)
    // 5★: 2% y garantizado cada 50
    this.permPity4 = 0;
    this.permPity5 = 0;

    this.limPity4 = 0;
    this.limPity5 = 0;

    // Si pierdes 50/50 en limitado, el siguiente 5★ es del banner
    this.limGuaranteeFeatured = false;

    // ===== UI =====
    this.createUI();
    this.refreshUI();

    // ===== Banner Permanente: sin barra de carga (se quitó el ciclo) =====
  }

  // =========================
  // EXP / LEVEL
  // =========================
  calcExpToNext() {
    // curva para que se ponga más difícil y nivel 100 sea duro
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
  createUI() {
    const s = this.scene;

    const style = (bg = "#020617") => ({
      fontFamily: "Arial",
      fontSize: "14px",
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

    this.expBarFill = s.add.rectangle(0, 30, 0, 8, 0x22c55e)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(10000);

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

    // Botón Gacha (solo abre ventana)
    this.gachaBtn = s.add.text(0, 12, "🎰 Gachapon", {
      fontFamily: "Arial",
      fontSize: "14px",
      color: "#022c22",
      backgroundColor: "#22c55e"
    })
      .setOrigin(1, 0)
      .setPadding(10, 6)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    // DEV buttons
    this.devPermBtn = s.add.text(0, 52, "+10 Perm (DEV)", {
      fontFamily: "Arial",
      fontSize: "12px",
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
      fontSize: "12px",
      color: "#022c22",
      backgroundColor: "#f59e0b"
    })
      .setOrigin(1, 0)
      .setPadding(8, 5)
      .setScrollFactor(0)
      .setInteractive({ useHandCursor: true })
      .setDepth(9999);

    // Click: abrir modal
    this.gachaBtn.on("pointerdown", (pointer) => {
      s.uiGuard?.(pointer);
      this.openGachaModal();
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
      this.gachaBtn,
      this.devPermBtn,
      this.devLimitedBtn
    ];

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
    const right = s.scale.width - 16;
    const top = 10;

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
      x -= (el.width + 10);
    });

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
    this.devLimitedBtn.x = right;
    this.devLimitedBtn.y = top + 68;

    this.devPermBtn.x = this.devLimitedBtn.x - (this.devLimitedBtn.width + 10);
    this.devPermBtn.y = this.devLimitedBtn.y;
  }

  refreshUI() {
    this.goldText.setText(`💰 ${this.gold}`);
    this.levelText.setText(`⭐ Lv.${this.level}`);

    // deseos separados
    this.permWishText.setText(`🎟 Perm: ${this.wishesPermanent}`);
    this.limitedWishText.setText(`⏳ Lim: ${this.wishesLimited}`);

    // exp text + bar
    const cur = this.exp;
    const next = this.expToNext;

    if (this.level >= MAX_LEVEL) {
      this.expBarFill.width = 140;
      this.expText.setText(`EXP: MAX`);
    } else {
      this.expText.setText(`EXP: ${cur}/${next}`);
      const ratio = (next <= 0) ? 0 : (cur / next);
      this.expBarFill.width = 140 * Phaser.Math.Clamp(ratio, 0, 1);
    }

    // si cambió el texto, recalcula layout (por anchos)
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

    // pierde 50/50 => siguiente 5★ garantizado
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

    // 5★: 2% o garantía a los 50
    const hit5 = (Phaser.Math.FloatBetween(0, 1) < 0.02) || (pity5 >= 50);
    if (hit5) rarity = 5;
    else {
      // 4★: garantía cada 10 (y una chance base)
      const hit4 = (Phaser.Math.FloatBetween(0, 1) < 0.08) || (pity4 >= 10);
      if (hit4) rarity = 4;
    }

    // reset pity según rarity
    if (rarity >= 4) pity4 = 0;
    if (rarity === 5) pity5 = 0;

    if (isLimited) {
      this.limPity4 = pity4;
      this.limPity5 = pity5;
    } else {
      this.permPity4 = pity4;
      this.permPity5 = pity5;
    }

    // --- decide itemKey según banner + rareza ---
    let itemKey = "green_1"; // 2★

    if (rarity === 4) {
      if (isLimited) {
        const pool = ["lim_blue_2", "lim_red_2", "lim_yellow_2"];
        itemKey = pool[Phaser.Math.Between(0, pool.length - 1)];
      } else {
        const pool = ["perm_blue_9", "perm_red_1", "perm_yellow_4"];
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
      .gacha-stage::before { content: none; }
      .gacha-stage::after { content: none; }
      .gacha-backdrop {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
        background-color: var(--bg-top);
        background-image:
          linear-gradient(color-mix(in srgb, var(--accent) 18%, rgba(255,255,255,.04)) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,.35) 2px, transparent 2px),
          linear-gradient(90deg, rgba(0,0,0,.35) 2px, transparent 2px);
        background-size: 120px 60px, 120px 60px, 120px 60px;
        background-position: 0 0, 0 0, 60px 30px;
      }
      .gacha-backdrop::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at 50% 50%, rgba(0,0,0,0), rgba(0,0,0,.35) 70%);
        pointer-events: none;
      }
      .neon-frame {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(var(--s, 1));
        width: 86%;
        height: 62%;
        border-radius: 10px;
        border: 2px solid var(--neon-1);
        box-shadow: 0 0 14px var(--neon-1), 0 0 26px var(--neon-2);
        opacity: var(--o, .95);
        animation: neonFlicker 3s infinite;
        pointer-events: none;
      }
      .neon-frame.frame-1 { --s: 1; --o: .98; }
      .neon-frame.frame-1::after {
        content: "";
        position: absolute;
        inset: -10px;
        border: 10px solid transparent;
        border-image: var(--textile-img) 30 round;
        opacity: .85;
        pointer-events: none;
      }
      .neon-frame.frame-2 {
        --s: .82;
        --o: .92;
        border-color: var(--neon-2);
        box-shadow: 0 0 12px var(--neon-2), 0 0 22px var(--neon-1);
        animation-delay: .2s;
      }
      .neon-frame.frame-3 { --s: .66; --o: .86; animation-delay: .4s; }
      .neon-frame.frame-4 { --s: .52; --o: .8; border-color: var(--neon-2); animation-delay: .6s; }
      .neon-frame.frame-5 { --s: .40; --o: .74; animation-delay: .8s; }
      .neon-icon {
        position: absolute;
        font-size: 22px;
        color: var(--accent);
        text-shadow: 0 0 10px var(--accent), 0 0 18px var(--accent-2);
        opacity: .95;
        animation: neonFlicker 2.6s infinite;
        pointer-events: none;
      }
      .neon-icon.i1 { top: 16px; left: 18px; }
      .neon-icon.i2 { top: 16px; right: 18px; color: var(--accent-2); }
      .neon-icon.i3 { bottom: 16px; left: 20px; color: var(--accent-2); }
      .neon-icon.i4 { bottom: 16px; right: 18px; }
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
        letter-spacing: 1px;
        opacity: .9;
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

      .reveal-flash {
        position: absolute;
        inset: -20%;
        background: radial-gradient(circle at center, rgba(255,255,255,.9), rgba(255,255,255,0) 55%);
        opacity: 0;
        z-index: 4;
        pointer-events: none;
        mix-blend-mode: screen;
      }
      .reveal-flash.rarity-4 {
        background: radial-gradient(circle at center, rgba(192,132,252,.9), rgba(192,132,252,0) 60%);
      }
      .reveal-flash.rarity-5 {
        background: radial-gradient(circle at center, rgba(245,158,11,.95), rgba(245,158,11,0) 60%);
      }
      .gacha-stage.reveal .reveal-flash {
        animation: revealFlash .35s ease forwards;
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
        content: "✦ ✧ ✦";
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
        30% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(1.08); }
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
    const def = ITEM_DEFS[result.itemKey] || { name: result.itemKey, icon: "❓", rarity: result.rarity };
    const stars = "★".repeat(result.rarity || def.rarity || 2);
    const rarityClass = `rarity-${result.rarity || def.rarity || 2}`;
    const isLegend = (result.rarity || def.rarity || 2) === 5;
    const cardTag = def.cardTag || "";
    const cardSigil = def.cardSigil || "";
    const cardStyleParts = [];
    if (def.cardBg1) cardStyleParts.push(`--card-bg1:${def.cardBg1}`);
    if (def.cardBg2) cardStyleParts.push(`--card-bg2:${def.cardBg2}`);
    if (def.cardAccent) cardStyleParts.push(`--card-accent:${def.cardAccent}`);
    const cardStyle = cardStyleParts.length ? ` style="${cardStyleParts.join(";")}"` : "";

    return `
      <div class="gacha-backdrop">
        <div class="neon-frame frame-1"></div>
        <div class="neon-frame frame-2"></div>
        <div class="neon-frame frame-3"></div>
        <div class="neon-frame frame-4"></div>
        <div class="neon-frame frame-5"></div>
        <div class="neon-icon i1">🦙</div>
        <div class="neon-icon i2">☀️</div>
        <div class="neon-icon i3">🏔️</div>
        <div class="neon-icon i4">🪶</div>
      </div>
      <div class="envelope">
        <div class="env-body"></div>
        <div class="env-flap"></div>
      </div>
      <div class="card-anim ${rarityClass}${isLegend ? " card-legend" : ""}"${cardStyle}>
        <div class="card-back">
          <div class="mystery">🇵🇪</div>
          <div class="mystery-sub">☀️</div>
        </div>
        <div class="card-face card-front">
          ${cardSigil ? `<div class="card-sigil">${cardSigil}</div>` : `<div class="card-icon">${def.icon || "❓"}</div>`}
          <div class="card-name">${def.name || result.itemKey}</div>
          ${cardTag ? `<div class="card-tag">${cardTag}</div>` : ""}
          <div class="card-stars">${stars}</div>
        </div>
      </div>
      <div class="glow ${rarityClass}"></div>
      ${isLegend ? `<div class="legend-shine"></div>` : ""}
      <div class="reveal-flash ${rarityClass}"></div>
      <div class="card-label ${rarityClass}">${def.name || result.itemKey}</div>
    `;
  }

  renderWishResultsHTML(results) {
    return results.map((r, idx) => {
      const def = ITEM_DEFS[r.itemKey] || { name: r.itemKey, icon: "❓", rarity: r.rarity };
      const rarity = r.rarity || def.rarity || 2;
      const stars = "★".repeat(rarity);
      return `
        <div class="result-item rarity-${rarity}">
          <div class="result-icon">${def.icon || "❓"}</div>
          <div>
            <div class="result-name">#${idx + 1} · ${def.name || r.itemKey}</div>
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
      stage.classList.remove("reveal");
      stage.innerHTML = this.renderWishStageHTML(res);
      const animMs = getAnimMs(rarity);
      const revealAt = Math.max(900, animMs - 650);
      revealTimer = setTimeout(() => {
        stage.classList.add("reveal");
      }, revealAt);
      timer = setTimeout(playNext, animMs);
    };

    if (skipBtn) skipBtn.onclick = showResults;
    if (closeBtn) closeBtn.onclick = close;

    playNext();
  }

  // =========================
  // GACHA MODAL (HTML) + Animación abrir/cerrar
  // =========================
  openGachaModal() {
    if (document.getElementById("gacha-modal")) return;

    const modal = document.createElement("div");
    modal.id = "gacha-modal";

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
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
          <h2 style="margin:0;font-size:18px;">🎰 Gachapon</h2>
          <button id="gachaClose" style="
            background:#111827;color:#e5e7eb;border:1px solid rgba(255,255,255,.12);
            padding:8px 10px;border-radius:10px;cursor:pointer;
          ">✖</button>
        </div>

        <div style="margin-top:12px; display:grid; grid-template-columns: 1.15fr .85fr; gap:12px;">
          <!-- Columna izquierda: banners -->
          <div style="display:grid; gap:12px;">
            <!-- Permanente -->
            <div style="border:1px solid rgba(255,255,255,.10); border-radius:14px; padding:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <b>🌟 Banner Permanente</b>
                <span>Deseos: <b id="permCount">${this.wishesPermanent}</b></span>
              </div>

              <small style="opacity:.8; display:block; margin-top:10px;">
                Items permanentes: Azul 9x9, Rojo 1x1 y Amarillo 4x4.
              </small>

              <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap;">
                <button id="permWish1" style="
                  background:#22c55e;color:#022c22;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x1</button>
                <button id="permWish10" style="
                  background:#16a34a;color:#022c22;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x10</button>
              </div>
              <small style="opacity:.75; display:block; margin-top:8px;">
                Pity: 4★ garantizado cada 10 (8% base) • 5★ 2% y garantizado cada 50 • Doble 5★: 0.02%.
              </small>
            </div>

            <!-- Limitado -->
            <div style="border:1px solid rgba(255,255,255,.10); border-radius:14px; padding:12px;">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <b>⏳ Banner Limitado</b>
                <span>Deseos: <b id="limCount">${this.wishesLimited}</b></span>
              </div>

              <div style="margin-top:10px; opacity:.85; font-size:13px;">
                4★: (Azul/Rojo/Amarillo 2x2) • 5★: (Dorado 2x2) • 50/50 vs permanente.
              </div>

              <div style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;">
                <button id="limWish1" style="
                  background:#f59e0b;color:#1f1400;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x1</button>
                <button id="limWish10" style="
                  background:#fbbf24;color:#1f1400;border:none;
                  padding:10px 12px;border-radius:12px;cursor:pointer;font-weight:700;
                ">Deseo x10</button>
              </div>
              <small style="opacity:.75; display:block; margin-top:8px;">
                En 5★ limitado: 50/50 entre dorado y permanente. Si pierdes, el siguiente 5★ es del banner.
              </small>
            </div>
          </div>

          <!-- Columna derecha: inventario -->
          <div style="border:1px solid rgba(255,255,255,.10); border-radius:14px; padding:12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <b>🎒 Inventario</b>
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

    const keys = Object.keys(ITEM_DEFS);

    // arma filas
    const rows = keys.map((k) => {
      const def = ITEM_DEFS[k];
      const c = this.inventory[k] || 0;
      return `
        <div style="
          display:flex; align-items:center; justify-content:space-between; gap:10px;
          border:1px solid rgba(255,255,255,.08);
          border-radius:12px;
          padding:10px;
          background: rgba(2,6,23,.35);
        ">
          <div style="display:flex; flex-direction:column;">
            <b>${def.icon} ${def.name}</b>
            <small style="opacity:.75;">${def.size}x${def.size} • ${def.rarity}★</small>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span>x <b data-inv="${k}">${c}</b></span>
          </div>
        </div>
      `;
    });

    list.innerHTML = rows.join("");
  }

  updateModalCounts() {
    const modal = document.getElementById("gacha-modal");
    if (!modal) return;

    const perm = modal.querySelector("#permCount");
    const lim = modal.querySelector("#limCount");

    if (perm) perm.textContent = String(this.wishesPermanent);
    if (lim) lim.textContent = String(this.wishesLimited);

    // actualizar contadores de inventario si están
    const invEls = modal.querySelectorAll("[data-inv]");
    invEls.forEach((el) => {
      const key = el.getAttribute("data-inv");
      if (!key) return;
      el.textContent = String(this.inventory[key] || 0);
    });

    // re-render de lista (para que agregue items nuevos aunque no existían)
    this.renderInventoryIntoModal();
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
