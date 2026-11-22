(function () {
  if (typeof EconomySystem === "undefined") return;

  const STYLE_ID = "npc-ui-bridge-style";
  const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
  const stars = (r) => Array.from({ length: Math.max(1, Math.min(5, Math.round(Number(r) || 1))) }, () => "&#9733;").join("");

  class NpcUiBridge {
    constructor(economy) {
      this.economy = economy;
      this.ensureStyles();
    }

    ensureStyles() {
      if (document.getElementById(STYLE_ID)) return;
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.textContent = `
#npc-inventory-modal.npc-ui-overlay,#npc-ghost-lab-modal.npc-ui-overlay{position:fixed;inset:0;z-index:1000001;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(2,6,23,.72);backdrop-filter:blur(6px)}
#npc-inventory-modal .npc-ui-card{width:min(1040px,92vw);max-height:min(760px,88vh);overflow:hidden;display:flex;flex-direction:column;border-radius:28px;border:1px solid rgba(148,163,184,.22);background:linear-gradient(180deg,rgba(3,18,47,.96),rgba(2,10,31,.97));box-shadow:0 28px 80px rgba(0,0,0,.44)}
#npc-inventory-modal .npc-ui-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:22px 24px 14px;color:#f8fafc}#npc-inventory-modal .npc-ui-title{font:800 30px/1.05 Arial,sans-serif}#npc-inventory-modal .npc-ui-subtitle{margin-top:4px;color:#94a3b8;font:500 13px/1.35 Arial,sans-serif}#npc-inventory-modal .npc-ui-close,#npc-ghost-lab-modal .npc-lab-close{width:44px;height:44px;border:1px solid rgba(148,163,184,.24);border-radius:14px;background:rgba(15,23,42,.82);color:#e2e8f0;font:700 22px/1 Arial,sans-serif;cursor:pointer}
#npcInvList{overflow:auto;padding:0 18px 20px}.npc-inv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(152px,152px));justify-content:start;gap:10px}.npc-inv-item{display:block;width:152px;padding:0;border:0;background:none;cursor:pointer}.npc-inv-card{position:relative;width:152px;aspect-ratio:5/6.5;border-radius:14px;border:2px solid color-mix(in srgb,var(--npc-card-accent) 74%,#e2e8f0 26%);background:linear-gradient(180deg,rgba(255,255,255,.09),rgba(255,255,255,.03) 24%),linear-gradient(180deg,var(--npc-card-bg1),var(--npc-card-bg2));color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 10px 20px rgba(0,0,0,.28),0 0 16px color-mix(in srgb,var(--npc-card-accent) 55%,transparent);overflow:hidden;transition:transform .16s ease,box-shadow .16s ease}.npc-inv-item:hover .npc-inv-card,.npc-inv-item:focus-visible .npc-inv-card{transform:translateY(-2px) scale(1.012);box-shadow:0 0 0 1px rgba(255,255,255,.12) inset,0 14px 24px rgba(0,0,0,.34),0 0 20px color-mix(in srgb,var(--npc-card-accent) 72%,transparent)}.npc-inv-item:focus-visible{outline:none}.npc-inv-stars{position:absolute;top:8px;left:8px;padding:2px 6px;border-radius:999px;border:1px solid rgba(255,255,255,.28);background:rgba(15,23,42,.5);font:900 11px/1 Arial,sans-serif;letter-spacing:1px;color:#fde68a;text-shadow:0 1px 3px rgba(0,0,0,.35)}.npc-inv-art{position:absolute;inset:0;display:grid;place-items:center;font:900 46px/1 Arial,sans-serif;color:rgba(255,255,255,.9);text-shadow:0 3px 10px rgba(0,0,0,.44)}.npc-inv-shine{position:absolute;inset:0;background:radial-gradient(ellipse at 25% 16%,rgba(255,255,255,.34),rgba(255,255,255,0) 44%),linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,0) 32%);pointer-events:none}.npc-inv-bottom{position:absolute;left:0;right:0;bottom:0;display:flex;align-items:center;justify-content:space-between;padding:6px 8px;border-top:1px solid rgba(255,255,255,.2);background:linear-gradient(180deg,rgba(2,6,23,.12),rgba(2,6,23,.54))}.npc-inv-diamonds{display:flex;align-items:center;gap:3px}.npc-inv-diamond{width:8px;height:8px;transform:rotate(45deg);border-radius:1px;border:1px solid rgba(148,163,184,.58);background:rgba(100,116,139,.24)}.npc-inv-diamond.on{border-color:#fcd34d;background:linear-gradient(135deg,#fde68a,#f59e0b);box-shadow:0 0 7px rgba(251,191,36,.4)}.npc-inv-lv{display:inline-flex;align-items:center;justify-content:center;min-width:46px;height:20px;padding:0 7px;border-radius:999px;border:1px solid rgba(255,255,255,.32);background:rgba(15,23,42,.58);font:900 11px/1 Arial,sans-serif;color:#fff}
#npc-ghost-lab-modal .npc-lab-window{position:relative;width:min(1180px,94vw);height:min(760px,88vh);overflow:hidden;border-radius:30px;border:1px solid rgba(148,163,184,.22);background:rgba(2,6,23,.92);box-shadow:0 34px 90px rgba(0,0,0,.5)}#npc-ghost-lab-modal .npc-lab-header{position:absolute;top:18px;left:22px;z-index:4;max-width:min(58%,620px);color:#f8fafc}#npc-ghost-lab-modal .npc-lab-title{font:900 22px/1.08 Arial,sans-serif}#npc-ghost-lab-modal .npc-lab-subtitle{margin-top:4px;color:#dbeafe;font:600 14px/1.35 Arial,sans-serif;text-shadow:0 1px 2px rgba(0,0,0,.3)}#npc-ghost-lab-modal .npc-lab-close{position:absolute;top:16px;right:16px;z-index:5}#npc-ghost-lab-modal .npc-lab-stage{position:absolute;inset:0;overflow:hidden}#npc-ghost-lab-modal .npc-lab-backdrop,#npc-ghost-lab-modal .npc-lab-shade{position:absolute;inset:0}#npc-ghost-lab-modal .npc-lab-backdrop{background-position:center;background-size:cover;background-repeat:no-repeat;transition:transform 1.55s cubic-bezier(.22,1,.36,1),filter 1.55s ease}.npc-lab-backdrop.is-room{background-image:linear-gradient(180deg,rgba(3,7,18,.08),rgba(3,7,18,.22)),url("img/fondocasanpc.png")}.npc-lab-backdrop.is-plain{background-image:radial-gradient(circle at 25% 20%,rgba(96,165,250,.26),rgba(96,165,250,0) 28%),radial-gradient(circle at 80% 18%,rgba(168,85,247,.22),rgba(168,85,247,0) 34%),linear-gradient(135deg,#0f172a,#10203d 44%,#172554)}#npc-ghost-lab-modal .npc-lab-shade{background:linear-gradient(180deg,rgba(2,6,23,.08),rgba(2,6,23,.14) 22%,rgba(2,6,23,.36))}.npc-lab-window.is-focused .npc-lab-backdrop{transform:scale(1.08) translateX(-3.4%);filter:brightness(.88) saturate(1.03)}#npcLabGlobalFx{position:fixed;inset:0;z-index:1000004;pointer-events:none}
#ghostNpcMover{position:absolute;z-index:3;width:214px;background:none;border:0;padding:0;cursor:pointer;opacity:1;transform:translate(-50%,-50%) scale(1);transition:left var(--npc-move-ms,3600ms) cubic-bezier(.22,1,.36,1),top var(--npc-move-ms,3600ms) cubic-bezier(.22,1,.36,1),transform 1.65s cubic-bezier(.22,1,.36,1),opacity .28s ease}.npc-lab-window.is-focused #ghostNpcMover{transform:translate(-50%,-50%) scale(1.12)}.npc-ghost-card{width:214px;height:248px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:18px 18px 22px;border-radius:28px;border:2px solid rgba(255,255,255,.28);background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02) 24%),linear-gradient(180deg,var(--npc-card-bg1),var(--npc-card-bg2));color:#fff;box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 0 24px color-mix(in srgb,var(--npc-card-accent) 70%,transparent),0 22px 40px rgba(0,0,0,.28)}.npc-ghost-card.is-hopping{animation:npcGhostHop .62s cubic-bezier(.2,.8,.2,1)}.npc-ghost-sigil{width:72px;height:72px;display:grid;place-items:center;margin-bottom:16px;border-radius:18px;border:1px solid rgba(255,255,255,.18);background:rgba(15,23,42,.24);font:900 22px/1 Arial,sans-serif}.npc-ghost-name{text-align:center;font:900 22px/1.06 Arial,sans-serif}.npc-ghost-role{margin-top:6px;color:rgba(255,255,255,.88);text-align:center;font:700 14px/1.18 Arial,sans-serif}.npc-ghost-stars{margin-top:10px;color:#f8fafc;font:800 18px/1 Arial,sans-serif;letter-spacing:2px}
#npc-ghost-lab-modal .npc-lab-tip{position:absolute;left:22px;bottom:20px;z-index:3;max-width:min(420px,calc(100% - 44px));color:#f8fafc;font:700 14px/1.3 Arial,sans-serif;text-shadow:0 2px 6px rgba(0,0,0,.45);transition:opacity .28s ease}#npcLabPanel{position:absolute;top:74px;right:20px;bottom:18px;width:min(410px,36vw);display:flex;flex-direction:column;gap:14px;padding:18px;border-radius:26px;border:1px solid rgba(148,163,184,.18);background:rgba(2,6,23,.74);backdrop-filter:blur(10px);box-shadow:0 24px 54px rgba(0,0,0,.34);transform:translateX(112%);opacity:0;transition:transform .92s cubic-bezier(.22,1,.36,1),opacity .65s ease}.npc-lab-window.is-focused #npcLabPanel{transform:translateX(0);opacity:1}
#npcLabSubview{position:absolute;inset:0;z-index:4;opacity:0;pointer-events:none;background:rgba(0,0,0,0);transition:opacity .36s ease,background-color .36s ease}#npcLabSubview .npc-subview-card{position:absolute;inset:18px;background:rgba(2,6,23,.92);border:1px solid rgba(148,163,184,.16);border-radius:28px;display:flex;flex-direction:column;overflow:hidden;transform:scale(.985);transition:transform .36s ease}#npcLabSubview .npc-subview-head{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 22px 14px;color:#f8fafc}#npcLabSubview .npc-subview-title{font:900 24px/1.05 Arial,sans-serif}#npcLabSubview .npc-subview-sub{margin-top:4px;color:#cbd5e1;font:600 13px/1.35 Arial,sans-serif}#npcLabSubview .npc-subview-body{flex:1 1 auto;min-height:0;padding:0 20px 18px;display:flex;flex-direction:column}#npcLabSubview .npc-subview-footer{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:0 20px 20px}#npcLabSubview .npc-subview-close{min-width:110px;padding:0 16px;height:42px;border:1px solid rgba(148,163,184,.22);border-radius:14px;background:rgba(30,41,59,.9);color:#f8fafc;font:800 14px/1 Arial,sans-serif;cursor:pointer}#npcLabSubview .npc-high-confirm{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.52)}#npcLabSubview .npc-high-confirm-card{width:min(420px,calc(100% - 32px));padding:20px;border-radius:22px;border:1px solid rgba(248,113,113,.24);background:rgba(15,23,42,.98);box-shadow:0 24px 60px rgba(0,0,0,.4)}#npcLabSubview .npc-high-confirm-title{color:#f8fafc;font:900 20px/1.08 Arial,sans-serif}#npcLabSubview .npc-high-confirm-sub{margin-top:8px;color:#cbd5e1;font:600 13px/1.45 Arial,sans-serif}#npcLabSubview .npc-high-confirm-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:16px}.npc-lab-window.is-subview #npcLabSubview{opacity:1;pointer-events:auto;background:rgba(0,0,0,.76)}.npc-lab-window.is-subview #npcLabSubview .npc-subview-card{transform:scale(1)}.npc-lab-window.is-subview #npcLabPanel,.npc-lab-window.is-subview #ghostNpcMover,.npc-lab-window.is-subview #npcLabTip{opacity:0;pointer-events:none}
.npc-lab-main-view{display:flex;flex-direction:column;gap:8px;min-height:100%}.npc-lab-panel-head{display:flex;flex-direction:column;gap:8px;color:#f8fafc}.npc-lab-panel-head.compact{gap:5px}.npc-lab-panel-name{font:900 24px/1.05 Arial,sans-serif}.npc-lab-panel-head.compact .npc-lab-panel-name{font:900 21px/1.02 Arial,sans-serif}.npc-lab-panel-handle{color:#93c5fd;font:700 13px/1.2 Arial,sans-serif}.npc-lab-panel-stars{color:#fde047;font:900 18px/1 Arial,sans-serif;letter-spacing:2px}.npc-lab-chip-row{display:flex;flex-wrap:wrap;gap:8px}.npc-lab-chip{padding:8px 12px;border-radius:999px;border:1px solid rgba(148,163,184,.18);background:rgba(30,41,59,.84);color:#f8fafc;font:700 12px/1 Arial,sans-serif}.npc-lab-chip.compact{padding:5px 9px;font:700 10px/1 Arial,sans-serif}.npc-lab-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.npc-lab-actions.is-main{gap:6px}.npc-lab-btn,.npc-tree-node,.npc-lab-mini-btn{border:0;cursor:pointer}.npc-lab-btn{min-height:44px;padding:0 14px;border-radius:16px;font:800 15px/1 Arial,sans-serif;color:#0f172a}.npc-lab-actions.is-main .npc-lab-btn{min-height:34px;border-radius:12px;font:800 13px/1 Arial,sans-serif;padding:0 10px}.npc-lab-btn.levelup{background:#fbbf24}.npc-lab-btn.skills{background:#38bdf8}.npc-lab-btn.passive{background:#c084fc}.npc-lab-btn.reset,.npc-lab-btn.back{background:#64748b;color:#f8fafc}.npc-lab-btn.apply{background:#22c55e}.npc-lab-btn.back.compact{min-height:100%;font:800 13px/1 Arial,sans-serif;padding:0 10px}.npc-lab-block{border-radius:20px;border:1px solid rgba(148,163,184,.14);background:rgba(15,23,42,.58);padding:14px;color:#e2e8f0}.npc-lab-block.compact{padding:8px 10px;border-radius:16px}.npc-lab-block-title{font:900 14px/1.08 Arial,sans-serif;color:#f8fafc}.npc-lab-block-sub{margin-top:6px;color:#cbd5e1;font:600 12px/1.35 Arial,sans-serif}.npc-lab-block-sub.compact{margin-top:3px;font:600 10px/1.2 Arial,sans-serif}.npc-lab-stat-list{display:grid;gap:10px}.npc-lab-stat-list.is-main{grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}.npc-lab-stat-row{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:12px 14px;border-radius:16px;background:rgba(15,23,42,.48)}.npc-lab-stat-row.is-main{grid-template-columns:1fr;gap:6px;padding:8px 10px;align-content:start}.npc-lab-stat-top{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:6px;align-items:start}.npc-lab-stat-heading{display:flex;align-items:center;gap:10px}.npc-lab-stat-heading.compact{gap:7px;align-items:flex-start}.npc-lab-stat-meta{min-width:0}.npc-stat-icon{width:30px;height:30px;display:grid;place-items:center;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:rgba(30,41,59,.88);color:#fff;font:900 15px/1 Arial,sans-serif;box-shadow:0 0 0 1px rgba(255,255,255,.04) inset}.npc-lab-stat-label{font:800 14px/1 Arial,sans-serif}.npc-lab-stat-value{font:900 15px/1 Arial,sans-serif;color:#f8fafc}.npc-lab-stat-sub{margin-top:3px;color:#cbd5e1;font:700 10px/1.18 Arial,sans-serif}.npc-lab-stat-value-wrap{display:flex;flex-direction:column;align-items:flex-end;gap:3px}.npc-lab-scroll{overflow:auto;padding-right:4px}
.npc-lab-stat-controls{display:flex;align-items:center;gap:8px}.npc-lab-stat-controls.is-main{justify-content:flex-end;gap:5px}.npc-lab-stat-draft{min-width:34px;text-align:center;color:#fbbf24;font:800 11px/1 Arial,sans-serif}.npc-lab-stat-btn{width:30px;height:30px;border:1px solid rgba(148,163,184,.22);border-radius:10px;background:rgba(30,41,59,.92);color:#f8fafc;font:900 18px/1 Arial,sans-serif;cursor:pointer}.npc-lab-stat-controls.is-main .npc-lab-stat-btn{width:26px;height:26px;font:900 16px/1 Arial,sans-serif}.npc-lab-stat-btn:disabled{opacity:.38;cursor:not-allowed}.npc-lab-confirm-wrap{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center}.npc-lab-confirm-wrap.is-main{grid-template-columns:minmax(0,1fr) 108px;gap:6px}.npc-lab-confirm-wrap.is-main .npc-lab-btn.apply{min-height:34px;border-radius:12px;font:800 13px/1 Arial,sans-serif;padding:0 10px}.npc-lab-confirm-meta{color:#cbd5e1;font:700 12px/1.35 Arial,sans-serif}.npc-lab-confirm-wrap.is-main .npc-lab-confirm-meta{font:700 11px/1.2 Arial,sans-serif}.npc-lab-main-footer{display:grid;grid-template-columns:minmax(0,1fr) 100px;gap:8px;align-items:stretch}.npc-lab-actions.is-main.triple{grid-template-columns:repeat(3,minmax(0,1fr));}.npc-lab-evo-row{display:flex;align-items:center;justify-content:space-between;gap:10px}.npc-lab-evo-text{color:#cbd5e1;font:700 12px/1.2 Arial,sans-serif}.npc-lab-evo-diamonds{display:flex;align-items:center;gap:6px}.npc-lab-evo-diamond{width:13px;height:13px;transform:rotate(45deg);border-radius:2px;border:1px solid rgba(148,163,184,.52);background:rgba(148,163,184,.15)}.npc-lab-evo-diamond.on{border-color:#fbbf24;background:linear-gradient(135deg,#fcd34d,#f59e0b);box-shadow:0 0 8px rgba(245,158,11,.45)}.npc-lab-evo-diamond.pulse{animation:npcEvoDiamondPulse .42s ease-in-out 2}.npc-lab-level{display:grid;gap:6px}.npc-lab-level-head{display:flex;align-items:center;justify-content:space-between;gap:8px;color:#e2e8f0;font:800 12px/1 Arial,sans-serif}.npc-lab-level-bar{height:10px;border-radius:999px;background:rgba(30,41,59,.9);overflow:hidden}.npc-lab-level-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#60a5fa,#22d3ee)}
.npc-levelup-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:14px;min-height:0;flex:1 1 auto}.npc-levelup-left,.npc-levelup-right{min-height:0}.npc-levelup-left{overflow:hidden}.npc-levelup-summary{display:grid;gap:14px;align-content:start}.npc-levelup-card{display:grid;justify-items:center;gap:10px}.npc-levelup-card-preview{display:grid;place-items:center;min-height:156px;overflow:hidden;width:100%}.npc-levelup-card-preview .npc-ghost-card{transform:scale(.76);transform-origin:top center;margin-bottom:-64px}.npc-levelup-bar{width:100%;height:14px;overflow:hidden;border-radius:999px;background:rgba(51,65,85,.78)}.npc-levelup-bar-fill{height:100%;border-radius:inherit;background:linear-gradient(90deg,#fbbf24,#f97316);transition:width .18s linear}.npc-levelup-slots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}.npc-levelup-slot{min-height:82px;padding:10px;border:1px dashed rgba(148,163,184,.24);border-radius:18px;background:rgba(15,23,42,.44);color:#cbd5e1;font:700 11px/1.25 Arial,sans-serif;text-align:center}.npc-levelup-slot.is-filled{border-style:solid;cursor:pointer}.npc-levelup-feed-list{display:grid;gap:10px}.npc-feed-item{display:grid;grid-template-columns:54px 1fr auto;gap:12px;align-items:center;padding:10px 12px;border:1px solid rgba(148,163,184,.16);border-radius:18px;background:rgba(15,23,42,.48)}.npc-feed-item.is-high-rarity{border-color:rgba(248,113,113,.32);background:rgba(69,10,10,.22)}.npc-feed-icon{width:54px;height:64px;display:grid;place-items:center;border-radius:14px;border:1px solid rgba(255,255,255,.2);color:#fff;font:900 16px/1 Arial,sans-serif}.npc-feed-name{color:#f8fafc;font:800 14px/1.15 Arial,sans-serif}.npc-feed-sub{margin-top:4px;color:#cbd5e1;font:600 12px/1.3 Arial,sans-serif}.npc-lab-mini-btn{padding:10px 12px;border-radius:14px;background:#22c55e;color:#052e16;font:900 13px/1 Arial,sans-serif}.npc-lab-mini-btn:disabled,.npc-levelup-slot:disabled,.npc-subview-close:disabled,.npc-lab-btn:disabled{cursor:not-allowed;opacity:.58}.npc-levelup-busy{position:relative}.npc-levelup-busy::after{content:"";position:absolute;inset:0;border-radius:22px;background:linear-gradient(180deg,rgba(2,6,23,.02),rgba(2,6,23,.26));pointer-events:none}.npc-super-levelup-global{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;padding:24px;pointer-events:none}.npc-super-levelup-global::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at center,rgba(250,204,21,.28) 0%,rgba(249,115,22,.18) 18%,rgba(0,0,0,.52) 54%,rgba(0,0,0,.72) 100%);animation:npcSuperFlash .42s ease-out infinite alternate}.npc-super-levelup-global span{position:relative;display:inline-flex;align-items:center;justify-content:center;min-height:108px;padding:20px 34px;border-radius:28px;border:2px solid rgba(250,204,21,.58);background:linear-gradient(180deg,rgba(120,53,15,.96),rgba(124,45,18,.94));color:#fff7ed;font:900 clamp(38px,6vw,88px)/1 Arial,sans-serif;letter-spacing:.04em;text-shadow:0 4px 20px rgba(0,0,0,.48);box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 0 48px rgba(251,191,36,.42);animation:npcSuperLevelPulse .72s ease-in-out infinite alternate}.npc-levelup-anim-note{color:#93c5fd;font:700 12px/1.3 Arial,sans-serif}
.npc-tree-wrap{display:flex;flex-direction:column;gap:14px;min-height:0;flex:1 1 auto;overflow:auto;padding:8px 6px 4px}.npc-tree-core{display:grid;justify-items:center;gap:10px}.npc-tree-core-rail{width:10px;height:26px;border-radius:999px;background:rgba(100,116,139,.7)}.npc-tree-core-rail.is-done{background:linear-gradient(180deg,#7dd3fc,#2563eb)}.npc-tree-core-rail.is-next{background:linear-gradient(180deg,#fdba74,#ea580c)}.npc-tree-branches{display:grid;grid-template-columns:repeat(5,minmax(124px,1fr));gap:12px;align-items:start}.npc-tree-branch{display:grid;justify-items:center;align-content:start;gap:0}.npc-tree-branch-head{width:16px;height:16px;margin-bottom:8px;border-radius:999px;border:2px solid rgba(148,163,184,.36);background:rgba(100,116,139,.72)}.npc-tree-branch-head.is-done{border-color:#93c5fd;background:#2563eb;box-shadow:0 0 20px rgba(59,130,246,.32)}.npc-tree-branch-head.is-next{border-color:#fdba74;background:#ea580c;box-shadow:0 0 18px rgba(249,115,22,.28)}.npc-tree-branch-head.is-locked{border-color:#94a3b8;background:#475569}.npc-tree-line{width:10px;height:28px;border-radius:999px;background:rgba(100,116,139,.7);margin:4px 0}.npc-tree-line.is-done{background:linear-gradient(180deg,#7dd3fc,#2563eb)}.npc-tree-line.is-next{background:linear-gradient(180deg,#fdba74,#ea580c)}.npc-tree-line.is-locked{background:linear-gradient(180deg,#94a3b8,#475569)}.npc-tree-node{width:118px;min-height:110px;padding:10px 10px 12px;border-radius:24px;border:2px solid rgba(148,163,184,.24);background:linear-gradient(180deg,rgba(30,41,59,.94),rgba(15,23,42,.96));color:#f8fafc;text-align:center;display:grid;justify-items:center;align-content:start;gap:5px;box-shadow:0 16px 24px rgba(0,0,0,.24)}.npc-tree-node.is-done{border-color:#93c5fd;background:linear-gradient(180deg,rgba(30,64,175,.96),rgba(15,23,42,.96));box-shadow:0 0 26px rgba(59,130,246,.24)}.npc-tree-node.is-next{border-color:#fdba74;background:linear-gradient(180deg,rgba(154,52,18,.94),rgba(15,23,42,.96));box-shadow:0 0 24px rgba(249,115,22,.22)}.npc-tree-node.is-locked{border-color:#64748b;background:linear-gradient(180deg,rgba(51,65,85,.92),rgba(15,23,42,.96));opacity:.72}.npc-tree-node[disabled]{cursor:not-allowed}.npc-tree-node-icon{width:42px;height:42px;display:grid;place-items:center;border-radius:16px;border:1px solid rgba(255,255,255,.2);background:rgba(15,23,42,.22);font:900 22px/1 Arial,sans-serif;color:#fff}.npc-tree-node-label{font:900 13px/1.08 Arial,sans-serif}.npc-tree-node-sub{margin-top:2px;color:#dbeafe;font:700 10px/1.25 Arial,sans-serif}.npc-tree-node.is-locked .npc-tree-node-sub{color:#cbd5e1}
.npc-evo-view .npc-subview-sub{display:none}.npc-evo-layout{display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px;min-height:0;flex:1 1 auto}.npc-evo-top{display:grid;grid-template-columns:minmax(280px,.72fr) minmax(0,1fr);gap:12px;min-height:0}.npc-evo-left,.npc-evo-right{min-height:0}.npc-evo-left{display:grid;gap:10px;align-content:start}.npc-evo-left .npc-levelup-card{padding-top:6px}.npc-evo-left .npc-levelup-card-preview{min-height:136px}.npc-evo-left .npc-levelup-card-preview .npc-ghost-card{transform:scale(.68);transform-origin:top center;margin-bottom:-84px}.npc-evo-actions{display:flex;gap:8px;flex-wrap:wrap}.npc-evo-actions .npc-lab-mini-btn{background:#1d4ed8;color:#dbeafe;padding:8px 10px}.npc-evo-grade-list{display:grid;gap:8px}.npc-evo-grade-row{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 10px;border-radius:12px;border:1px solid rgba(148,163,184,.24);background:rgba(15,23,42,.45);color:#cbd5e1}.npc-evo-grade-row.is-done{border-color:rgba(56,189,248,.55);background:rgba(30,64,175,.3);color:#dbeafe}.npc-evo-grade-row.is-next{border-color:rgba(251,191,36,.72);background:rgba(120,53,15,.45);color:#fef3c7;box-shadow:0 0 14px rgba(251,191,36,.2)}.npc-evo-grade-diamonds{display:flex;gap:4px}.npc-evo-grade-diamond{width:10px;height:10px;transform:rotate(45deg);border-radius:1px;border:1px solid rgba(148,163,184,.58);background:rgba(100,116,139,.26)}.npc-evo-grade-diamond.on{border-color:#67e8f9;background:linear-gradient(135deg,#7dd3fc,#38bdf8)}.npc-evo-grade-row.is-next .npc-evo-grade-diamond.on{border-color:#fcd34d;background:linear-gradient(135deg,#fcd34d,#f59e0b)}.npc-evo-grade-label{font:800 13px/1 Arial,sans-serif}.npc-evo-grade-state{font:800 11px/1 Arial,sans-serif;letter-spacing:.03em;text-transform:uppercase}.npc-evo-grade-row.is-done .npc-evo-grade-state{color:#7dd3fc}.npc-evo-grade-row.is-next .npc-evo-grade-state{color:#fbbf24}.npc-evo-grade-row.is-locked .npc-evo-grade-state{color:#94a3b8}.npc-evo-bottom{min-height:0;display:grid}.npc-evo-bottom .npc-lab-block{display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:10px;min-height:0}.npc-evo-slots{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}.npc-evo-slot{height:46px;border-radius:12px;border:1px dashed rgba(148,163,184,.32);background:rgba(15,23,42,.42);display:grid;place-items:center;color:#94a3b8;font:800 11px/1 Arial,sans-serif}.npc-evo-slot.filled{border-style:solid;border-color:rgba(250,204,21,.62);background:rgba(113,63,18,.45);color:#fef3c7;box-shadow:0 0 10px rgba(251,191,36,.25)}.npc-evo-slot.consuming{animation:npcEvoSlotPop .46s ease}.npc-evo-slot.done{opacity:.55;filter:saturate(.75)}.npc-evo-feed{display:flex;gap:8px;overflow:auto;padding:2px 2px 6px;align-items:stretch}.npc-evo-feed .npc-feed-item{flex:0 0 280px;padding:8px 10px;grid-template-columns:48px 1fr auto}.npc-evo-feed .npc-feed-item.is-selected{border-color:rgba(250,204,21,.72);box-shadow:0 0 14px rgba(251,191,36,.26)}.npc-evo-feed .npc-feed-item.is-consuming{border-color:rgba(56,189,248,.72);box-shadow:0 0 14px rgba(56,189,248,.24)}.npc-evo-feed .npc-feed-icon{width:48px;height:56px;font-size:14px}.npc-evo-feed .npc-feed-name{font-size:13px}.npc-evo-feed .npc-feed-sub{font-size:11px}.npc-evo-view.is-evolving .npc-lab-evo-diamonds{animation:npcEvoGlow .82s ease-in-out 2}.npc-evo-view.is-evolving .npc-evo-grade-row.is-next{animation:npcEvoGlow .82s ease-in-out 2}
.npc-skill-evo-global{position:fixed;inset:0;z-index:1000006;display:flex;align-items:center;justify-content:center;padding:20px;background:radial-gradient(circle at center,rgba(255,255,255,.12),rgba(2,6,23,.86) 62%,rgba(2,6,23,.96));pointer-events:auto;opacity:1;transition:opacity .36s ease}.npc-skill-evo-global.is-out{opacity:0}.npc-skill-evo-screenflash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:26}.npc-skill-evo-global.is-flash .npc-skill-evo-screenflash{animation:npcSkillFlash .52s ease-out forwards}.npc-skill-evo-stage{position:relative;z-index:24;width:min(560px,92vw);min-height:min(90vh,760px);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;overflow:hidden}.npc-skill-evo-cardwrap{position:relative;perspective:1200px;width:100%;display:grid;place-items:center;min-height:380px}.npc-skill-evo-card{transform-style:preserve-3d;transform:translateY(120px) scale(.54) rotateY(0deg);opacity:0}.npc-skill-evo-stage.is-spin .npc-skill-evo-card{animation:npcSkillCardSpin 1.45s cubic-bezier(.42,0,1,1) forwards}.npc-skill-evo-card .npc-ghost-card{transform:none!important;margin:0!important;width:300px;height:350px;border-radius:34px}.npc-skill-evo-banner{display:grid;justify-items:center;gap:8px;opacity:0;transform:translateY(16px) scale(.94);transition:opacity .28s ease,transform .28s ease}.npc-skill-evo-stage.is-reveal .npc-skill-evo-banner{opacity:1;transform:translateY(0) scale(1)}.npc-skill-evo-title{padding:10px 30px;border-radius:999px;border:2px solid rgba(187,247,208,.6);background:linear-gradient(90deg,#65a30d,#22c55e);color:#ecfdf5;font:900 clamp(30px,4.6vw,58px)/1 Arial,sans-serif;letter-spacing:.03em;text-shadow:0 2px 8px rgba(20,83,45,.42);box-shadow:0 0 0 1px rgba(255,255,255,.12) inset,0 16px 30px rgba(22,163,74,.28)}.npc-skill-evo-sub{color:#d1fae5;font:800 14px/1 Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}.npc-skill-evo-diamond-row{display:flex;align-items:center;justify-content:center;gap:16px;min-height:44px;opacity:0;transform:translateY(14px);transition:opacity .28s ease,transform .28s ease}.npc-skill-evo-stage.is-reveal .npc-skill-evo-diamond-row{opacity:1;transform:translateY(0)}.npc-skill-evo-diamond{width:26px;height:26px;transform:rotate(45deg);border-radius:2px;border:2px solid rgba(186,230,253,.84);background:linear-gradient(135deg,#67e8f9,#0ea5e9);box-shadow:0 0 0 1px rgba(255,255,255,.16) inset,0 0 14px rgba(56,189,248,.56)}.npc-skill-evo-diamond.is-base{opacity:.95}.npc-skill-evo-diamond.is-new{animation:npcSkillDiamondIn .54s cubic-bezier(.22,1,.36,1)}
@keyframes npcGhostHop{0%{transform:translateY(0)}20%{transform:translateY(-8px)}45%{transform:translateY(-22px)}70%{transform:translateY(-8px)}100%{transform:translateY(0)}}@keyframes npcSuperLevelPulse{0%{transform:scale(.96);opacity:0}18%{transform:scale(1.04);opacity:1}100%{transform:scale(1);opacity:1}}@keyframes npcSuperFlash{0%{opacity:.35}100%{opacity:.92}}@keyframes npcEvoGlow{0%{filter:brightness(1)}50%{filter:brightness(1.28) drop-shadow(0 0 8px rgba(251,191,36,.6))}100%{filter:brightness(1)}}@keyframes npcEvoSlotPop{0%{transform:scale(.84)}60%{transform:scale(1.08)}100%{transform:scale(1)}}@keyframes npcEvoDiamondPulse{0%{transform:rotate(45deg) scale(1)}50%{transform:rotate(45deg) scale(1.2)}100%{transform:rotate(45deg) scale(1)}}@keyframes npcSkillCardSpin{0%{transform:translateY(120px) scale(.54) rotateY(0deg);opacity:0}10%{opacity:1;transform:translateY(96px) scale(.58) rotateY(20deg)}28%{transform:translateY(70px) scale(.66) rotateY(180deg)}48%{transform:translateY(24px) scale(.84) rotateY(620deg)}68%{transform:translateY(-8px) scale(.94) rotateY(1180deg)}84%{transform:translateY(-16px) scale(1) rotateY(1840deg)}100%{transform:translateY(0) scale(1) rotateY(2160deg);opacity:1}}@keyframes npcSkillFlash{0%{opacity:0}12%{opacity:.96}100%{opacity:0}}@keyframes npcSkillDiamondIn{0%{opacity:0;transform:translateX(26px) rotate(45deg) scale(.36)}62%{opacity:1;transform:translateX(-2px) rotate(45deg) scale(1.18)}100%{opacity:1;transform:translateX(0) rotate(45deg) scale(1)}}
@media (max-width:980px){#npc-ghost-lab-modal .npc-lab-window{width:96vw;height:92vh}#npcLabPanel{width:min(420px,calc(100vw - 40px))}.npc-levelup-layout,.npc-evo-top{grid-template-columns:1fr}.npc-tree-branches{grid-template-columns:repeat(3,minmax(124px,1fr))}.npc-lab-stat-list.is-main{grid-template-columns:1fr}.npc-lab-main-footer{grid-template-columns:1fr}.npc-lab-actions.is-main.triple{grid-template-columns:repeat(2,minmax(0,1fr));}}@media (max-width:760px){#npcLabPanel{inset:auto 12px 12px 12px;top:auto;width:auto;max-height:54%}#npc-ghost-lab-modal .npc-lab-header{max-width:calc(100% - 84px)}.npc-levelup-slots,.npc-evo-slots{grid-template-columns:repeat(2,minmax(0,1fr))}.npc-evo-feed .npc-feed-item{flex:0 0 230px}.npc-tree-branches{grid-template-columns:repeat(2,minmax(124px,1fr))}#npcLabSubview .npc-subview-footer{grid-template-columns:1fr}}
      `;
      style.textContent += `
.npc-tree-core{display:none!important}
.npc-tree-wrap{padding:12px 10px 8px;background:linear-gradient(180deg,rgba(15,23,42,.38),rgba(2,6,23,.16));border:1px solid rgba(148,163,184,.12);border-radius:20px}
.npc-tree-branches{position:relative;display:grid;grid-template-columns:repeat(5,minmax(138px,1fr));gap:16px;align-items:start}
.npc-tree-branch{position:relative;z-index:2;display:grid;justify-items:center;align-content:start;gap:8px}
.npc-tree-branch-start{padding:4px 10px;border-radius:999px;border:1px solid rgba(96,165,250,.42);background:rgba(30,58,138,.32);color:#bfdbfe;font:800 10px/1 Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase}
.npc-tree-line{width:8px;height:34px;border-radius:999px;margin:0;box-shadow:0 0 0 1px rgba(2,6,23,.24) inset}
.npc-tree-line.is-done{background:repeating-linear-gradient(180deg,#dbeafe 0 4px,#60a5fa 4px 8px,#2563eb 8px 12px);box-shadow:0 0 10px rgba(96,165,250,.38)}
.npc-tree-line.is-next{background:repeating-linear-gradient(180deg,#fed7aa 0 4px,#fb923c 4px 8px,#ea580c 8px 12px);box-shadow:0 0 12px rgba(249,115,22,.45)}
.npc-tree-line.is-locked{background:linear-gradient(180deg,#94a3b8,#475569);opacity:.76}
.npc-tree-node{width:126px;min-height:126px;padding:10px 10px 12px;border:2px solid rgba(148,163,184,.34);border-radius:0;clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);background:linear-gradient(180deg,rgba(36,57,89,.96),rgba(15,23,42,.98));color:#f8fafc;text-align:center;display:grid;justify-items:center;align-content:center;gap:0;box-shadow:0 0 0 1px rgba(255,255,255,.08) inset,0 10px 22px rgba(0,0,0,.34)}
.npc-tree-node.is-done{border-color:#60a5fa;background:linear-gradient(180deg,rgba(30,58,138,.96),rgba(15,23,42,.98));box-shadow:0 0 0 1px rgba(219,234,254,.18) inset,0 0 20px rgba(59,130,246,.42)}
.npc-tree-node.is-next{border-color:#fb923c;background:linear-gradient(180deg,rgba(124,45,18,.95),rgba(15,23,42,.98));box-shadow:0 0 0 1px rgba(255,237,213,.18) inset,0 0 24px rgba(249,115,22,.36)}
.npc-tree-node.is-locked{border-color:#64748b;background:linear-gradient(180deg,rgba(51,65,85,.95),rgba(15,23,42,.98));opacity:.78}
.npc-tree-node[disabled]{cursor:not-allowed}
.npc-tree-node-icon{width:100%;height:100%;display:flex;align-items:center;justify-content:center;clip-path:none;border:0;background:transparent;font:900 40px/1 Arial,sans-serif;color:#fff;line-height:1;margin:0;padding:0}
.npc-tree-node-label{font:900 12px/1.06 Arial,sans-serif}
.npc-tree-node-sub{margin-top:1px;color:#dbeafe;font:700 9px/1.2 Arial,sans-serif}
.npc-tree-node.is-locked .npc-tree-node-sub{color:#cbd5e1}
.npc-tree-fx-text{position:absolute;top:-18px;left:50%;transform:translateX(-50%);padding:2px 8px;border-radius:999px;background:rgba(2,6,23,.86);border:1px solid currentColor;font:900 11px/1.1 Arial,sans-serif;white-space:nowrap;pointer-events:none;animation:npcTreeFxPop .95s ease forwards;z-index:4}
.npc-tree-link{position:absolute;height:8px;border-radius:999px;transform-origin:0 50%;pointer-events:none;z-index:1;opacity:.92;transition:opacity .25s ease,filter .25s ease}
.npc-tree-link.is-done{background:repeating-linear-gradient(90deg,#dbeafe 0 6px,#60a5fa 6px 12px,#2563eb 12px 18px);box-shadow:0 0 8px rgba(96,165,250,.42)}
.npc-tree-link.is-next{background:repeating-linear-gradient(90deg,#fed7aa 0 6px,#fb923c 6px 12px,#ea580c 12px 18px);animation:npcTreeLinkPulse 1.2s ease-in-out infinite;filter:drop-shadow(0 0 8px rgba(249,115,22,.55))}
.npc-tree-link.is-locked{background:linear-gradient(90deg,#94a3b8,#475569);opacity:.72}
@keyframes npcTreeLinkPulse{
  0%{opacity:.64;filter:drop-shadow(0 0 2px rgba(249,115,22,.32))}
  50%{opacity:1;filter:drop-shadow(0 0 10px rgba(249,115,22,.62))}
  100%{opacity:.64;filter:drop-shadow(0 0 2px rgba(249,115,22,.32))}
}
@keyframes npcTreeFxPop{
  0%{opacity:0;transform:translate(-50%,6px) scale(.86)}
  18%{opacity:1;transform:translate(-50%,-2px) scale(1)}
  80%{opacity:1;transform:translate(-50%,-14px) scale(1)}
  100%{opacity:0;transform:translate(-50%,-24px) scale(.96)}
}
@media (max-width:980px){
  .npc-tree-branches{grid-template-columns:repeat(3,minmax(132px,1fr));gap:14px}
}
@media (max-width:760px){
  .npc-tree-branches{grid-template-columns:repeat(2,minmax(124px,1fr));gap:12px}
  .npc-tree-node{width:118px;min-height:118px}
}
`;
      style.textContent += `
.npc-tree-wrap{position:relative;overflow:auto;scrollbar-width:none;-ms-overflow-style:none;cursor:grab;user-select:none}
.npc-tree-wrap::-webkit-scrollbar{width:0;height:0}
.npc-tree-wrap.is-dragging{cursor:grabbing}
.npc-tree-pan-hint{position:sticky;top:6px;left:8px;z-index:6;display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:999px;border:1px solid rgba(125,211,252,.28);background:rgba(2,6,23,.72);color:#bfdbfe;font:700 10px/1 Arial,sans-serif;letter-spacing:.04em;pointer-events:none}
.npc-tree-branches{position:relative!important;display:block!important;grid-template-columns:none!important;width:2200px;min-width:2200px;height:1400px;min-height:1400px;padding:0!important}
.npc-tree-branch,.npc-tree-branch-start,.npc-tree-tier,.npc-tree-node-hole{display:none!important}
.npc-tree-node{position:absolute!important;z-index:5;overflow:visible;transform:translate(-50%,-50%);width:118px;min-width:118px;height:118px;min-height:118px;padding:0!important;border:0!important;border-radius:0!important;clip-path:none!important;background:transparent!important;display:grid;place-items:center!important;align-content:center!important;justify-items:center!important;box-shadow:none!important}
.npc-tree-node:focus,.npc-tree-node:focus-visible{outline:none!important}
.npc-tree-node[disabled]{opacity:1!important;filter:none!important;cursor:not-allowed}
.npc-tree-node::before{content:"";position:absolute;inset:0;clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);-webkit-clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);background:#fff;z-index:0;backface-visibility:hidden;transform:translateZ(0)}
.npc-tree-node::after{content:"";position:absolute;inset:6px;clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);-webkit-clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);background:var(--node-color,#334155);z-index:1;backface-visibility:hidden;transform:translateZ(0);filter:drop-shadow(0 6px 10px rgba(2,6,23,.45))}
.npc-tree-node.is-next{box-shadow:none!important}
.npc-tree-node.is-done{box-shadow:none!important}
.npc-tree-node.is-locked::after{background:var(--node-color,#334155)!important;opacity:1!important}
.npc-tree-node-lock{position:absolute;inset:6px;clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);-webkit-clip-path:polygon(50% 0%,82% 12%,98% 41%,93% 74%,68% 96%,32% 96%,7% 74%,2% 41%,18% 12%);background:rgba(2,6,23,.32);z-index:4;display:flex;align-items:center;justify-content:center;pointer-events:none}
.npc-tree-node-lock span{font:900 34px/1 Arial,sans-serif;color:#f8fafc;text-shadow:0 2px 7px rgba(0,0,0,.6)}
.npc-tree-node-icon{position:relative;z-index:3;width:100%!important;height:100%!important;display:flex!important;align-items:center!important;justify-content:center!important;clip-path:none!important;border:0!important;background:transparent!important;color:#fff!important;font:900 48px/1 Arial,sans-serif;line-height:1;text-shadow:0 2px 6px rgba(0,0,0,.45);margin:0!important;padding:0!important;transform:translateY(0)!important}
.npc-tree-node-label,.npc-tree-node-sub{display:none!important}
.npc-tree-link{z-index:1!important;height:12px!important;border-radius:999px!important}
.npc-tree-link.is-done{background:linear-gradient(90deg,#60a5fa,#2563eb)!important;box-shadow:0 0 8px rgba(96,165,250,.45)}
.npc-tree-link.is-next{background:repeating-linear-gradient(90deg,#fed7aa 0 7px,#fb923c 7px 14px,#ea580c 14px 21px)!important;box-shadow:0 0 10px rgba(249,115,22,.5);animation:npcTreeLinkPulse 1.2s ease-in-out infinite}
.npc-tree-link.is-locked{background:linear-gradient(90deg,#9ca3af,#6b7280)!important;opacity:.95!important}
.npc-node-upgrade-modal{position:absolute;inset:0;z-index:20;display:grid;place-items:center;background:rgba(2,6,23,.52)}
.npc-node-upgrade-card{width:min(520px,86vw);border-radius:18px;border:1px solid rgba(148,163,184,.35);background:linear-gradient(180deg,rgba(15,23,42,.95),rgba(2,6,23,.95));box-shadow:0 18px 42px rgba(0,0,0,.45);padding:14px;display:flex;flex-direction:column;gap:10px}
.npc-node-upgrade-title{font:900 18px/1.08 Arial,sans-serif;color:#f8fafc}
.npc-node-upgrade-sub{font:700 12px/1.35 Arial,sans-serif;color:#cbd5e1}
.npc-node-upgrade-reqs{display:grid;gap:8px}
.npc-node-upgrade-req{display:flex;align-items:center;gap:8px;padding:8px 10px;border-radius:12px;border:1px solid rgba(148,163,184,.22);background:rgba(15,23,42,.55);color:#e2e8f0;font:700 12px/1 Arial,sans-serif}
.npc-node-upgrade-dot{width:10px;height:10px;border-radius:999px;flex:0 0 auto}
.npc-node-upgrade-have{margin-left:auto;color:#93c5fd}
.npc-node-upgrade-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}
@media (max-width:760px){
  .npc-tree-branches{width:1800px;min-width:1800px;height:1200px;min-height:1200px}
}
`;
      document.head.appendChild(style);
    }

    openInventoryModal() {
      try {
        this.ensureStyles();
        if (document.getElementById("npc-inventory-modal")) return true;
        const modal = document.createElement("div");
        modal.id = "npc-inventory-modal";
        modal.className = "npc-ui-overlay";
        modal.innerHTML = `
          <div class="npc-ui-card">
            <div class="npc-ui-header">
              <div><div class="npc-ui-title">Almacen NPC</div><div class="npc-ui-subtitle">Cada copia se muestra por separado. Si un NPC esta instalado, abre con fondo de habitacion.</div></div>
              <button type="button" class="npc-ui-close" id="npcInvClose">×</button>
            </div>
            <div id="npcInvList"></div>
          </div>`;
        modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
        modal.querySelector("#npcInvClose")?.addEventListener("click", () => modal.remove());
        document.body.appendChild(modal);
        this.renderNpcInventoryIntoContainer(modal.querySelector("#npcInvList"));
        return true;
      } catch (err) {
        console.error("NpcUiBridge.openInventoryModal failed:", err);
        document.getElementById("npc-inventory-modal")?.remove();
        this.economy.showUiErrorMessage(`No se pudo abrir Almacen NPC: ${err?.message || err}`);
        return false;
      }
    }

    renderNpcInventoryIntoContainer(listEl) {
      if (!listEl) return;
      const entries = this.economy.getNpcInventoryEntries();
      if (!entries.length) {
        listEl.innerHTML = `<div style="padding:0 4px 18px;color:#94a3b8;font:600 13px/1.4 Arial,sans-serif;">No tienes NPC en el almacen.</div>`;
        return;
      }
      listEl.innerHTML = `<div class="npc-inv-grid">${entries.map((entry) => {
        const accent = entry?.def?.cardAccent || "#c084fc";
        const bg1 = entry?.def?.cardBg1 || "#5b21b6";
        const bg2 = entry?.def?.cardBg2 || "#1e293b";
        const sigil = entry?.def?.cardSigil || entry?.def?.icon || "NPC";
        const level = Math.max(1, Math.round(Number(entry?.level) || 1));
        const passive = Math.max(0, Math.min(5, Math.round(Number(entry?.passiveLevel) || 0)));
        const rarityStars = stars(entry.rarity);
        const evoDiamonds = Array.from({ length: 5 }, (_, i) => `<span class="npc-inv-diamond${i < passive ? " on" : ""}"></span>`).join("");
        const cardName = entry?.def?.name || entry.key || "NPC";
        return `<button class="npc-inv-item" type="button" data-npc-open="${esc(entry.key)}" data-npc-entry="${esc(entry.entryId)}" aria-label="Abrir ${esc(cardName)}">
          <div class="npc-inv-card" style="--npc-card-bg1:${esc(bg1)};--npc-card-bg2:${esc(bg2)};--npc-card-accent:${esc(accent)};">
            <div class="npc-inv-stars">${rarityStars}</div>
            <div class="npc-inv-art">${esc(sigil)}</div>
            <div class="npc-inv-shine"></div>
            <div class="npc-inv-bottom">
              <div class="npc-inv-diamonds">${evoDiamonds}</div>
              <div class="npc-inv-lv">Lvl ${level}</div>
            </div>
          </div>
        </button>`;
      }).join("")}</div>`;
      listEl.querySelectorAll("[data-npc-open]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const npcKey = String(btn.getAttribute("data-npc-open") || "");
          const entryId = String(btn.getAttribute("data-npc-entry") || "");
          const entry = entries.find((it) => String(it.entryId || "") === entryId);
          if (!npcKey || !entry) return;
          const opened = this.openLabModal({
            npcKey,
            instanceId: String(entry.instanceId || ""),
            rarity: Math.max(1, Math.min(5, Math.round(Number(entry.rarity) || 1))),
            level: Math.max(1, Math.round(Number(entry.level) || 1)),
            exp: Math.max(0, Math.round(Number(entry.exp) || 0)),
            passiveLevel: Math.max(0, Math.min(5, Math.round(Number(entry.passiveLevel) || 0))),
            statCrystalSpent: entry?.statCrystalSpent && typeof entry.statCrystalSpent === "object"
              ? { ...entry.statCrystalSpent }
              : undefined,
            stats: entry?.stats && typeof entry.stats === "object"
              ? { ...entry.stats }
              : undefined,
            skillTree: entry?.skillTree && typeof entry.skillTree === "object"
              ? JSON.parse(JSON.stringify(entry.skillTree))
              : undefined,
            sourceMode: entry.installedInBuilding ? "building" : "inventory",
            backgroundMode: entry.installedInBuilding ? "room" : "plain",
            contextTitle: "Almacen NPC",
            contextSubtitle: entry.installedInBuilding ? `NPC instalado en ${entry.locationLabel || "edificio"}.` : "NPC fuera de edificios. Fondo limpio temporal.",
            handle: `@${npcKey}`
          });
          if (opened) document.getElementById("npc-inventory-modal")?.remove();
        });
      });
    }

    clearRoamTimers(modal) {
      if (!modal) return;
      if (modal._npcRoamTimer) { clearInterval(modal._npcRoamTimer); modal._npcRoamTimer = null; }
      if (modal._npcFocusTimer) { clearTimeout(modal._npcFocusTimer); modal._npcFocusTimer = null; }
      if (modal._npcHopTimer) { clearTimeout(modal._npcHopTimer); modal._npcHopTimer = null; }
    }

    clearLabTimers(modal) {
      if (!modal) return;
      this.clearRoamTimers(modal);
      if (modal._npcLevelIntroTimer) { clearTimeout(modal._npcLevelIntroTimer); modal._npcLevelIntroTimer = null; }
      if (modal._npcLevelAnimFrame) { cancelAnimationFrame(modal._npcLevelAnimFrame); modal._npcLevelAnimFrame = null; }
      if (modal._npcEvoFxTimer) { clearTimeout(modal._npcEvoFxTimer); modal._npcEvoFxTimer = null; }
      if (modal._npcEvoStepTimer) { clearTimeout(modal._npcEvoStepTimer); modal._npcEvoStepTimer = null; }
      if (modal._npcTreeFxTimer) { clearTimeout(modal._npcTreeFxTimer); modal._npcTreeFxTimer = null; }
      this.clearEvolutionCinematic(modal);
    }

    closeLabModal() {
      const modal = document.getElementById("npc-ghost-lab-modal");
      this.clearLabTimers(modal);
      if (modal) modal.remove();
    }

    openLabModal(overrides = null) {
      try {
        this.ensureStyles();
        this.economy.ghostNpcLabState = (overrides && typeof overrides === "object") ? this.economy.createDefaultGhostNpcLabState(overrides) : this.economy.getGhostNpcLabState();
        let modal = document.getElementById("npc-ghost-lab-modal");
        if (!modal) {
          modal = document.createElement("div");
          modal.id = "npc-ghost-lab-modal";
          modal.className = "npc-ui-overlay";
          modal.addEventListener("click", (e) => { if (e.target === modal) this.closeLabModal(); });
          document.body.appendChild(modal);
        }
        this.renderLabState(modal, { rebuildShell: true, phaseChanged: true });
        return true;
      } catch (err) {
        console.error("NpcUiBridge.openLabModal failed:", err);
        this.closeLabModal();
        this.economy.showUiErrorMessage(`No se pudo abrir la ventana NPC: ${err?.message || err}`);
        return false;
      }
    }

    buildLabShell(modal) {
      modal.innerHTML = `<div class="npc-lab-window"><div class="npc-lab-header"><div class="npc-lab-title" id="npcLabTitle"></div><div class="npc-lab-subtitle" id="npcLabSubtitle"></div></div><button type="button" class="npc-lab-close" id="ghostNpcLabClose">×</button><div class="npc-lab-stage"><div class="npc-lab-backdrop" id="npcLabBackdrop"></div><div class="npc-lab-shade"></div><button type="button" id="ghostNpcMover"></button><div class="npc-lab-tip" id="npcLabTip"></div><div id="npcLabPanel"></div><div id="npcLabSubview"></div></div></div><div id="npcLabGlobalFx"></div>`;
      modal.querySelector("#ghostNpcLabClose")?.addEventListener("click", () => this.closeLabModal());
      modal.querySelector("#ghostNpcMover")?.addEventListener("click", () => this.focusLabNpc(modal));
    }
    buildGhostCard(state) {
      const name = state.name || "NPC Fantasma";
      const role = (ITEM_DEFS[state.npcKey]?.npcRole || ITEM_DEFS[state.npcKey]?.cardMeta || `NPC ${state.rarity}*`).replace(/NPC\s*/i, "").trim() || "NPC";
      return `<div class="npc-ghost-card" style="--npc-card-bg1:${esc(state.cardBg1)};--npc-card-bg2:${esc(state.cardBg2)};--npc-card-accent:${esc(state.cardAccent)};"><div class="npc-ghost-sigil">${esc(state.cardSigil || "NPC")}</div><div class="npc-ghost-name">${esc(name)}</div><div class="npc-ghost-role">${esc(role)}</div><div class="npc-ghost-stars">${stars(state.rarity)}</div></div>`;
    }

    getNpcDescriptionText(state) {
      const key = String(state?.npcKey || "").toLowerCase();
      const name = String(state?.name || "").toLowerCase();
      if (
        key.includes("npc_kotori_5")
        || key.includes("npc_kotori_4")
        || name.includes("la paloma kotori")
      ) {
        return "La Paloma Kotori Streamer/Trabajador puede trabajar de Streamer desde su Casa, como tambien trabajar en alguna empresa, su puesto fuerte son trabajos de oficina o diseño.";
      }
      return String(state?.description || "").trim();
    }

    buildEvolutionDiamonds(level = 0, max = 5, pulseIndex = -1) {
      const lv = Math.max(0, Math.min(max, Math.round(Number(level) || 0)));
      return `<div class="npc-lab-evo-diamonds">${Array.from({ length: max }, (_, i) => (
        `<span class="npc-lab-evo-diamond${i < lv ? " on" : ""}${i === pulseIndex ? " pulse" : ""}"></span>`
      )).join("")}</div>`;
    }

    clearEvolutionCinematic(modal) {
      if (!modal) return;
      if (Array.isArray(modal._npcEvoCineTimers)) {
        modal._npcEvoCineTimers.forEach((t) => clearTimeout(t));
      }
      modal._npcEvoCineTimers = [];
      modal._npcEvoCinematicActive = false;
      modal._npcEvoCinematicPhase = "";
      const fx = modal.querySelector("#npcLabGlobalFx");
      if (fx) {
        fx.querySelectorAll(".npc-skill-evo-global").forEach((el) => el.remove());
      }
    }

    scheduleEvolutionCinematic(modal, ms, fn) {
      const timer = setTimeout(() => {
        if (!modal?.isConnected) return;
        modal._npcEvoCineTimers = (modal._npcEvoCineTimers || []).filter((t) => t !== timer);
        fn();
      }, Math.max(0, Math.round(Number(ms) || 0)));
      if (!Array.isArray(modal._npcEvoCineTimers)) modal._npcEvoCineTimers = [];
      modal._npcEvoCineTimers.push(timer);
      return timer;
    }

    playEvolutionSkillCinematic(modal, state, startLevel, endLevel) {
      if (!modal?.isConnected) return;
      const from = Math.max(0, Math.min(5, Math.round(Number(startLevel) || 0)));
      const to = Math.max(from, Math.min(5, Math.round(Number(endLevel) || 0)));
      if (to <= from) return;

      this.clearEvolutionCinematic(modal);

      const fx = modal.querySelector("#npcLabGlobalFx");
      if (!fx) return;

      const snapshot = {
        npcKey: state?.npcKey || "",
        name: state?.name || "NPC",
        rarity: Math.max(1, Math.min(5, Math.round(Number(state?.rarity) || 1))),
        cardSigil: state?.cardSigil || "NPC",
        cardBg1: state?.cardBg1 || "#5b21b6",
        cardBg2: state?.cardBg2 || "#1e293b",
        cardAccent: state?.cardAccent || "#c084fc"
      };

      const overlay = document.createElement("div");
      overlay.className = "npc-skill-evo-global";
      overlay.innerHTML = `<div class="npc-skill-evo-screenflash"></div><div class="npc-skill-evo-stage"><div class="npc-skill-evo-cardwrap"><div class="npc-skill-evo-card">${this.buildGhostCard(snapshot)}</div></div><div class="npc-skill-evo-banner"><div class="npc-skill-evo-title">Lvl Skill+${to}!</div><div class="npc-skill-evo-sub">Evolucion completada</div></div><div class="npc-skill-evo-diamond-row" id="npcSkillEvoRow"></div></div>`;
      fx.appendChild(overlay);

      const stage = overlay.querySelector(".npc-skill-evo-stage");
      const row = overlay.querySelector("#npcSkillEvoRow");
      const renderDiamonds = (count, animateNew = false) => {
        if (!row) return;
        row.innerHTML = "";
        for (let i = 0; i < count; i += 1) {
          const d = document.createElement("span");
          d.className = `npc-skill-evo-diamond${i < from ? " is-base" : ""}${animateNew && i >= from ? " is-new" : ""}`;
          row.appendChild(d);
        }
      };

      const finishOverlay = () => {
        if (!overlay.isConnected) return;
        overlay.classList.add("is-out");
        this.scheduleEvolutionCinematic(modal, 360, () => {
          this.clearEvolutionCinematic(modal);
          this.renderLabState(modal);
        });
      };

      const revealFinal = (fast = false) => {
        if (!overlay.isConnected || !stage) return;
        modal._npcEvoCinematicPhase = "reveal";
        const cardEl = overlay.querySelector(".npc-skill-evo-card");
        if (fast && cardEl) {
          stage.classList.remove("is-spin");
          cardEl.style.transform = "translateY(0) scale(1) rotateY(2160deg)";
          cardEl.style.opacity = "1";
        }
        overlay.classList.add("is-flash");
        this.scheduleEvolutionCinematic(modal, fast ? 70 : 230, () => {
          if (!stage.isConnected) return;
          stage.classList.add("is-reveal");
          if (fast) {
            renderDiamonds(to, true);
            return;
          }
          renderDiamonds(from, false);
          let curr = from;
          const addStep = () => {
            if (!row?.isConnected) return;
            if (curr >= to) return;
            curr += 1;
            renderDiamonds(curr, true);
            if (curr < to) this.scheduleEvolutionCinematic(modal, 340, addStep);
          };
          this.scheduleEvolutionCinematic(modal, 200, addStep);
        });
      };

      modal._npcEvoCinematicActive = true;
      modal._npcEvoCinematicPhase = "spin";
      renderDiamonds(from, false);
      this.scheduleEvolutionCinematic(modal, 40, () => stage?.classList.add("is-spin"));
      this.scheduleEvolutionCinematic(modal, 980, () => revealFinal(false));

      overlay.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        if (!modal._npcEvoCinematicActive) return;
        if (modal._npcEvoCinematicPhase === "spin") {
          if (Array.isArray(modal._npcEvoCineTimers)) {
            modal._npcEvoCineTimers.forEach((t) => clearTimeout(t));
          }
          modal._npcEvoCineTimers = [];
          revealFinal(true);
          return;
        }
        if (modal._npcEvoCinematicPhase === "reveal") {
          finishOverlay();
        }
      });
    }

    getStatVisualMeta(statKey) {
      const defs = this.economy.getGhostNpcLabTreeStatDefs();
      const base = defs?.[statKey] || { label: statKey || "Stat", color: "#cbd5e1" };
      const icons = {
        stamina: "💧",
        produccion: "⚙",
        felicidad: "😊",
        inteligencia: "🧠",
        fortuna: "🍀",
        estres: "⚡"
      };
      return {
        ...base,
        icon: icons[statKey] || "ST"
      };
    }

    normalizeTreeRefs(rawRefs, maxBranches = 5, maxNodes = 4) {
      const refs = Array.isArray(rawRefs) ? rawRefs : [];
      const seen = new Set();
      return refs
        .map((ref) => ({
          branch: Math.max(0, Math.min(Math.max(0, maxBranches - 1), Math.round(Number(ref?.branch) || 0))),
          node: Math.max(0, Math.min(Math.max(0, maxNodes - 1), Math.round(Number(ref?.node) || 0)))
        }))
        .filter((ref) => {
          if (!Number.isInteger(ref.branch) || !Number.isInteger(ref.node)) return false;
          const key = `${ref.branch}:${ref.node}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
    }

    getTreeNodeRequirementRefs(node, key, maxBranches = 5, maxNodes = 4) {
      return this.normalizeTreeRefs(node?.[key], maxBranches, maxNodes);
    }

    isTreeRefUnlocked(branches, ref) {
      return !!branches?.[ref?.branch]?.nodes?.[ref?.node]?.unlocked;
    }

    getTreeNodeCrossRefs(state, branchIndex, nodeIndex) {
      const branches = Array.isArray(state?.skillTree?.branches) ? state.skillTree.branches : [];
      const branch = branches?.[branchIndex];
      const node = branch?.nodes?.[nodeIndex];
      if (!node) return [];
      const maxBranches = branches.length || 5;
      const maxNodes = Array.isArray(branch?.nodes) ? branch.nodes.length : 4;
      const refsAll = this.getTreeNodeRequirementRefs(node, "requiresAll", maxBranches, maxNodes);
      const refsAny = this.getTreeNodeRequirementRefs(node, "requiresAny", maxBranches, maxNodes);
      const seen = new Set();
      return refsAll
        .concat(refsAny)
        .filter((ref) => {
          const key = `${ref.branch}:${ref.node}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });
    }

    isTreeNodePathAvailable(state, branchIndex, nodeIndex) {
      const branches = Array.isArray(state?.skillTree?.branches) ? state.skillTree.branches : [];
      const safeBranchIndex = Math.max(0, Math.min(branches.length - 1, Math.round(Number(branchIndex) || 0)));
      const branch = branches[safeBranchIndex];
      const node = branch?.nodes?.[nodeIndex];
      if (!node) return false;
      const maxBranches = branches.length || 5;
      const maxNodes = Array.isArray(branch?.nodes) ? branch.nodes.length : 4;
      const refsAll = this.getTreeNodeRequirementRefs(node, "requiresAll", maxBranches, maxNodes);
      const refsAny = this.getTreeNodeRequirementRefs(node, "requiresAny", maxBranches, maxNodes);
      const hasExplicitReqs = refsAll.length > 0 || refsAny.length > 0;
      const prevUnlocked = nodeIndex === 0
        ? !!state?.skillTree?.coreUnlocked
        : (hasExplicitReqs ? true : !!branch?.nodes?.[nodeIndex - 1]?.unlocked);
      if (!prevUnlocked) return false;
      const allOk = refsAll.every((ref) => this.isTreeRefUnlocked(branches, ref));
      const anyOk = refsAny.length ? refsAny.some((ref) => this.isTreeRefUnlocked(branches, ref)) : true;
      return allOk && anyOk;
    }

    getCoreTreeNode(state) {
      const statDefs = this.economy.getGhostNpcLabTreeStatDefs();
      const statKeys = Object.keys(statDefs || {});
      const fallbackStatKey = statKeys[0] || "stamina";
      const persisted = state?.skillTree?.coreNode && typeof state.skillTree.coreNode === "object"
        ? state.skillTree.coreNode
        : null;
      const branchSeedNode = state?.skillTree?.branches?.[0]?.nodes?.[0] || null;
      const statKeyRaw = String(persisted?.statKey || branchSeedNode?.statKey || fallbackStatKey);
      const statKey = Object.prototype.hasOwnProperty.call(statDefs, statKeyRaw) ? statKeyRaw : fallbackStatKey;
      const crystalKey = String(
        persisted?.crystalKey
        || statDefs?.[statKey]?.crystalKey
        || branchSeedNode?.crystalKey
        || "crystal_stamina_superior"
      );
      return {
        kind: "stat",
        statKey,
        amount: Math.max(1, Math.round(Number(persisted?.amount) || Number(branchSeedNode?.amount) || 4)),
        crystalKey,
        crystalCost: Math.max(1, Math.round(Number(persisted?.crystalCost) || Number(branchSeedNode?.crystalCost) || 1)),
        goldCost: Math.max(0, Math.round(Number(persisted?.goldCost) || Number(branchSeedNode?.goldCost) || 500)),
        capGain: 0,
        maxLevel: Math.max(1, Math.round(Number(persisted?.maxLevel) || 5)),
        level: Math.max(0, Math.round(Number(persisted?.level) || (state?.skillTree?.coreUnlocked ? 5 : 0))),
        unlocked: !!state?.skillTree?.coreUnlocked
      };
    }

    getTreeNodeState(state, branch, nodeIndex) {
      const node = branch?.nodes?.[nodeIndex];
      if (!node) return "locked";
      const maxLevel = Math.max(1, Math.round(Number(node?.maxLevel) || (node?.kind === "cap" ? 1 : 5)));
      const level = Math.max(0, Math.min(maxLevel, Math.round(Number(node?.level) || (node?.unlocked ? maxLevel : 0))));
      if (node.unlocked || level >= maxLevel) return "done";
      if (level > 0) return "next";
      const branchIndex = Array.isArray(state?.skillTree?.branches)
        ? state.skillTree.branches.indexOf(branch)
        : -1;
      if (branchIndex < 0) return "locked";
      return this.isTreeNodePathAvailable(state, branchIndex, nodeIndex) ? "next" : "locked";
    }

    getTreeNodeLevel(node) {
      const maxLevel = Math.max(1, Math.round(Number(node?.maxLevel) || (node?.kind === "cap" ? 1 : 5)));
      const levelRaw = Number(node?.level);
      const level = Number.isFinite(levelRaw)
        ? levelRaw
        : (node?.unlocked ? maxLevel : 0);
      return Math.max(0, Math.min(maxLevel, Math.round(level || 0)));
    }

    getTreeNodeMaxLevel(node) {
      return Math.max(1, Math.round(Number(node?.maxLevel) || (node?.kind === "cap" ? 1 : 5)));
    }

    getTreeNodeRef(state, branchIndex, nodeIndex) {
      const b = Math.round(Number(branchIndex) || 0);
      const n = Math.round(Number(nodeIndex) || 0);
      if (b === -1 && n === -1) {
        return { branchIndex: -1, nodeIndex: -1, node: this.getCoreTreeNode(state), isCore: true };
      }
      const branch = state?.skillTree?.branches?.[b];
      const node = branch?.nodes?.[n];
      if (!branch || !node) return null;
      return { branchIndex: b, nodeIndex: n, branch, node, isCore: false };
    }

    getTreeNodeUpgradeCost(state, nodeRef) {
      const node = nodeRef?.node;
      if (!node) return null;
      const level = this.getTreeNodeLevel(node);
      const maxLevel = this.getTreeNodeMaxLevel(node);
      if (level >= maxLevel) return { maxed: true, level, maxLevel };
      const targetLevel = level + 1;
      if (node.kind === "cap") {
        const defs = this.economy.getGhostNpcLabTreeStatDefs();
        const perColor = Math.max(2, Math.round(Number(node?.crystalCost) || 2) + 1);
        const colors = Object.entries(defs || {}).map(([statKey, meta]) => ({
          statKey,
          crystalKey: String(meta?.crystalKey || ""),
          label: String(meta?.label || statKey),
          color: String(meta?.color || "#e5e7eb"),
          qty: perColor
        }));
        return {
          maxed: false,
          kind: "cap",
          level,
          maxLevel,
          targetLevel,
          gold: Math.max(0, Math.round(Number(node?.goldCost) || 0)),
          colors
        };
      }
      const statMeta = this.getStatVisualMeta(node.statKey);
      const qty = Math.max(1, Math.round(Number(node?.crystalCost) || 1) * targetLevel);
      const gold = Math.max(0, Math.round(Number(node?.goldCost) || 0) * targetLevel);
      return {
        maxed: false,
        kind: "stat",
        level,
        maxLevel,
        targetLevel,
        statKey: String(node?.statKey || ""),
        statLabel: String(statMeta?.label || node?.statKey || "Stat"),
        color: String(statMeta?.color || "#e5e7eb"),
        crystalKey: String(node?.crystalKey || ""),
        qty,
        gold
      };
    }

    canPayTreeNodeUpgrade(state, cost) {
      if (!cost || cost.maxed) return false;
      if (String(state?.sourceMode || "") === "ghost") return true;
      if (Number(this.economy.gold) < Number(cost.gold || 0)) return false;
      if (cost.kind === "cap") {
        const list = Array.isArray(cost.colors) ? cost.colors : [];
        return list.every((entry) => {
          const have = Math.max(0, Math.round(Number(this.economy.inventory?.[entry.crystalKey]) || 0));
          return have >= Math.max(0, Math.round(Number(entry.qty) || 0));
        });
      }
      const have = Math.max(0, Math.round(Number(this.economy.inventory?.[cost.crystalKey]) || 0));
      return have >= Math.max(0, Math.round(Number(cost.qty) || 0));
    }

    spendTreeNodeUpgrade(state, cost, nodeRef) {
      if (!cost || cost.maxed) return false;
      if (String(state?.sourceMode || "") === "ghost") return true;
      if (cost.gold > 0) {
        const detail = nodeRef?.isCore
          ? "Arbol skill - Nodo central"
          : "Arbol skill - Nodo";
        if (!this.economy.spendGold(cost.gold, detail)) return false;
      }
      if (cost.kind === "cap") {
        const list = Array.isArray(cost.colors) ? cost.colors : [];
        for (const entry of list) {
          const qty = Math.max(0, Math.round(Number(entry.qty) || 0));
          if (qty <= 0) continue;
          if (!this.economy.consumeItem(entry.crystalKey, qty)) return false;
        }
        return true;
      }
      return this.economy.consumeItem(cost.crystalKey, Math.max(0, Math.round(Number(cost.qty) || 0)));
    }

    openTreeNodeUpgradeDialog(branchIndex, nodeIndex) {
      const state = this.economy.getGhostNpcLabState();
      const ref = this.getTreeNodeRef(state, branchIndex, nodeIndex);
      if (!ref?.node) return { ok: false };
      if (!ref.isCore) {
        const branch = ref.branch;
        const nodeState = this.getTreeNodeState(state, branch, ref.nodeIndex);
        if (nodeState === "locked") return { ok: false };
      }
      state.skillTree = state.skillTree || {};
      state.skillTree.upgradeDialog = {
        branchIndex: ref.branchIndex,
        nodeIndex: ref.nodeIndex
      };
      return { ok: true };
    }

    upgradeTreeNodeLevel(branchIndex, nodeIndex) {
      const state = this.economy.getGhostNpcLabState();
      const ref = this.getTreeNodeRef(state, branchIndex, nodeIndex);
      if (!ref?.node) return { ok: false, reason: "missing" };
      if (!ref.isCore) {
        const nodeState = this.getTreeNodeState(state, ref.branch, ref.nodeIndex);
        if (nodeState === "locked") return { ok: false, reason: "locked" };
      }
      const cost = this.getTreeNodeUpgradeCost(state, ref);
      if (!cost || cost.maxed) return { ok: false, reason: "maxed" };
      if (!this.canPayTreeNodeUpgrade(state, cost)) return { ok: false, reason: "funds" };
      const paid = this.spendTreeNodeUpgrade(state, cost, ref);
      if (!paid) return { ok: false, reason: "funds" };

      const node = ref.node;
      const maxLevel = this.getTreeNodeMaxLevel(node);
      const prevLevel = this.getTreeNodeLevel(node);
      const nextLevel = Math.max(0, Math.min(maxLevel, prevLevel + 1));
      node.level = nextLevel;
      node.maxLevel = maxLevel;
      node.unlocked = nextLevel >= maxLevel;

      let fxText = "";
      let fxColor = "#f8fafc";
      if (node.kind === "stat" && node.statKey) {
        const add = Math.max(1, Math.round(Number(node.amount) || 1));
        const meta = this.getStatVisualMeta(node.statKey);
        state.stats[node.statKey] = Math.max(0, Math.round(Number(state.stats[node.statKey]) || 0)) + add;
        fxText = `+${add} ${meta.label}`;
        fxColor = meta.color || "#f8fafc";
      } else if (node.kind === "cap") {
        const gain = Math.max(1, Math.round(Number(node.capGain) || this.economy.getGhostNpcLabCapNodeGain(state.rarity)));
        fxText = `+${gain} nivel cap`;
        fxColor = "#fbbf24";
      }

      state.skillTree = state.skillTree || {};
      if (ref.isCore) {
        state.skillTree.coreNode = {
          ...node
        };
        state.skillTree.coreUnlocked = !!node.unlocked;
      }
      state.skillTree.unlockFx = {
        branchIndex: ref.branchIndex,
        nodeIndex: ref.nodeIndex,
        text: fxText,
        color: fxColor,
        at: Date.now()
      };
      return { ok: true, text: fxText, color: fxColor };
    }

    buildTreeNodeMeta(state, node) {
      if (!node) return { label: "Nodo", icon: "ST", color: "#cbd5e1", costText: "", detailText: "" };
      const lvl = this.getTreeNodeLevel(node);
      const max = this.getTreeNodeMaxLevel(node);
      if (node.kind === "cap") {
        const gain = node.capGain || this.economy.getGhostNpcLabCapNodeGain(state.rarity);
        return {
          label: `Cap +${gain}`,
          icon: "LV",
          color: "#fbbf24",
          costText: `Todos colores | Oro`,
          detailText: `${lvl}/${max}`
        };
      }
      const meta = this.getStatVisualMeta(node.statKey);
      return {
        label: meta.label,
        icon: meta.icon,
        color: meta.color,
        costText: `${meta.label} x${node.crystalCost}`,
        detailText: `${lvl}/${max}`
      };
    }

    renderSkillTreeLinks(subview, state) {
      const branchesEl = subview?.querySelector(".npc-tree-branches");
      if (!branchesEl) return;
      branchesEl.querySelectorAll(".npc-tree-link").forEach((el) => el.remove());
      const branches = Array.isArray(state?.skillTree?.branches) ? state.skillTree.branches : [];
      if (!branches.length) return;
      const nodeEls = branchesEl.querySelectorAll(".npc-tree-node[data-tree-branch-index][data-tree-node-index]");
      if (!nodeEls.length) return;
      const nodeMap = new Map();
      nodeEls.forEach((el) => {
        const b = Math.round(Number(el.getAttribute("data-tree-branch-index")) || 0);
        const n = Math.round(Number(el.getAttribute("data-tree-node-index")) || 0);
        nodeMap.set(`${b}:${n}`, el);
      });
      const coreEl = nodeMap.get("-1:-1");
      const center = (el) => {
        if (el?.classList?.contains("npc-tree-node")) {
          return {
            x: el.offsetLeft,
            y: el.offsetTop
          };
        }
        const r = el.getBoundingClientRect();
        const baseRect = branchesEl.getBoundingClientRect();
        return {
          x: (r.left - baseRect.left) + (r.width / 2),
          y: (r.top - baseRect.top) + (r.height / 2)
        };
      };
      const drawLink = (sourceEl, targetEl, status = "locked") => {
        if (!sourceEl || !targetEl) return;
        const from = center(sourceEl);
        const to = center(targetEl);
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy);
        if (!Number.isFinite(len) || len < 1) return;
        const line = document.createElement("div");
        line.className = `npc-tree-link is-${status}`;
        line.style.left = `${from.x}px`;
        line.style.top = `${from.y}px`;
        line.style.width = `${len}px`;
        line.style.transform = `translateY(-50%) rotate(${Math.atan2(dy, dx)}rad)`;
        branchesEl.appendChild(line);
      };
      branches.forEach((branch, branchIndex) => {
        (branch?.nodes || []).forEach((node, nodeIndex) => {
          const targetEl = nodeMap.get(`${branchIndex}:${nodeIndex}`);
          if (!targetEl) return;
          const refs = this.getTreeNodeCrossRefs(state, branchIndex, nodeIndex);
          if (!refs.length) return;
          const targetState = this.getTreeNodeState(state, branch, nodeIndex);
          refs.forEach((ref) => {
            const sourceEl = nodeMap.get(`${ref.branch}:${ref.node}`);
            const status = node?.unlocked ? "done" : (targetState === "next" ? "next" : "locked");
            drawLink(sourceEl, targetEl, status);
          });
        });
      });
      // Nodo raiz unico: conecta con el nodo inicial de las 5 ramas.
      if (coreEl) {
        const coreUnlocked = !!state?.skillTree?.coreUnlocked;
        for (let i = 0; i < branches.length; i += 1) {
          const node0El = nodeMap.get(`${i}:0`);
          const node0 = branches?.[i]?.nodes?.[0];
          if (!node0El || !node0) continue;
          const node0State = node0.unlocked ? "done" : this.getTreeNodeState(state, branches[i], 0);
          const linkStatus = node0.unlocked
            ? "done"
            : (coreUnlocked && node0State === "next" ? "next" : "locked");
          drawLink(coreEl, node0El, linkStatus);
        }
      }
    }

    attachSkillTreeCameraDrag(subview) {
      const camera = subview?.querySelector(".npc-tree-wrap");
      if (!camera || camera.dataset.dragBound === "1") return;
      camera.dataset.dragBound = "1";
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let startLeft = 0;
      let startTop = 0;
      const stopDrag = () => {
        dragging = false;
        camera.classList.remove("is-dragging");
      };
      camera.addEventListener("pointerdown", (event) => {
        if ((event.button ?? 0) !== 0) return;
        dragging = true;
        startX = event.clientX;
        startY = event.clientY;
        startLeft = camera.scrollLeft;
        startTop = camera.scrollTop;
        camera.classList.add("is-dragging");
        try { camera.setPointerCapture(event.pointerId); } catch (_) {}
        event.preventDefault();
      });
      camera.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        camera.scrollLeft = startLeft - dx;
        camera.scrollTop = startTop - dy;
      });
      camera.addEventListener("pointerup", (event) => {
        try { if (camera.hasPointerCapture(event.pointerId)) camera.releasePointerCapture(event.pointerId); } catch (_) {}
        stopDrag();
      });
      camera.addEventListener("pointercancel", stopDrag);
      camera.addEventListener("mouseleave", () => { if (dragging) stopDrag(); });
      camera.addEventListener("wheel", (event) => {
        if (event.shiftKey) {
          camera.scrollLeft += event.deltaY;
        }
      }, { passive: true });
    }

    getStageMetrics(modal) {
      const stage = modal.querySelector(".npc-lab-stage");
      const mover = modal.querySelector("#ghostNpcMover");
      const panel = modal.querySelector("#npcLabPanel");
      const stageRect = stage?.getBoundingClientRect?.() || { width: 0, height: 0 };
      const moverRect = mover?.getBoundingClientRect?.() || { width: 214, height: 248 };
      const panelRect = panel?.getBoundingClientRect?.() || { width: 410, height: 0 };
      return {
        mover,
        width: Math.max(1, stageRect.width || stage?.clientWidth || 1),
        height: Math.max(1, stageRect.height || stage?.clientHeight || 1),
        moverWidth: Math.max(214, moverRect.width || mover?.offsetWidth || 214),
        moverHeight: Math.max(248, moverRect.height || mover?.offsetHeight || 248),
        panelWidth: Math.max(0, panelRect.width || panel?.offsetWidth || 410)
      };
    }

    placeMover(modal, phase, instant = false) {
      const metrics = this.getStageMetrics(modal);
      const mover = metrics.mover;
      if (!mover) return;
      const leftX = (metrics.moverWidth / 2) + 16;
      const rightX = metrics.width - (metrics.moverWidth / 2) - 16;
      let targetX = leftX;
      let targetY = metrics.height * 0.67;
      if (phase === "focused") {
        const focusLimit = Math.max(leftX, metrics.width - metrics.panelWidth - (metrics.moverWidth / 2) - 30);
        targetX = Math.max(leftX, Math.min(metrics.width * 0.28, focusLimit));
        targetY = metrics.height * 0.60;
      } else {
        const roamPoints = [0.24, 0.36, 0.48, 0.60, 0.72];
        const roamIndex = Math.max(0, Math.min(roamPoints.length - 1, Math.round(Number(modal._npcRoamIndex) || 0)));
        targetX = leftX + (rightX - leftX) * roamPoints[roamIndex];
      }
      if (instant) {
        const prev = mover.style.transition;
        mover.style.transition = "none";
        mover.style.left = `${Math.round(targetX)}px`;
        mover.style.top = `${Math.round(targetY)}px`;
        mover.getBoundingClientRect();
        mover.style.transition = prev || "";
      } else {
        mover.style.left = `${Math.round(targetX)}px`;
        mover.style.top = `${Math.round(targetY)}px`;
      }
    }

    triggerHop(modal) {
      if (!modal?.isConnected) return;
      const state = this.economy.getGhostNpcLabState();
      if (state.focusPhase !== "roam") return;
      const card = modal.querySelector(".npc-ghost-card");
      if (!card) return;
      card.classList.remove("is-hopping");
      card.getBoundingClientRect();
      card.classList.add("is-hopping");
      if (modal._npcHopTimer) clearTimeout(modal._npcHopTimer);
      modal._npcHopTimer = setTimeout(() => {
        card.classList.remove("is-hopping");
        modal._npcHopTimer = null;
      }, 640);
    }

    startRoam(modal, instant = false) {
      this.clearRoamTimers(modal);
      modal._npcRoamIndex = Number.isFinite(Number(modal._npcRoamIndex))
        ? Math.max(0, Math.min(4, Math.round(Number(modal._npcRoamIndex))))
        : 2;
      modal._npcRoamDir = Number(modal._npcRoamDir) === -1 ? -1 : 1;
      this.placeMover(modal, "roam", true);
      const mover = modal.querySelector("#ghostNpcMover");
      if (mover) mover.style.setProperty("--npc-move-ms", "3800ms");
      const queueNext = (delayMs) => {
        modal._npcRoamTimer = setTimeout(() => {
          if (!modal.isConnected) {
            this.clearLabTimers(modal);
            return;
          }
          const currentState = this.economy.getGhostNpcLabState();
          if (currentState.focusPhase !== "roam") return;
          if (Math.random() < 0.55) {
            this.triggerHop(modal);
          }
          const pauseMs = 900 + Math.round(Math.random() * 1500);
          const moveMs = 3400 + Math.round(Math.random() * 1900);
          modal._npcFocusTimer = setTimeout(() => {
            if (!modal.isConnected) return;
            const roamingState = this.economy.getGhostNpcLabState();
            if (roamingState.focusPhase !== "roam") return;
            let nextIndex = Math.max(0, Math.min(4, Math.round(Number(modal._npcRoamIndex) || 2))) + (modal._npcRoamDir || 1);
            if (nextIndex >= 4) {
              nextIndex = 4;
              modal._npcRoamDir = -1;
            } else if (nextIndex <= 0) {
              nextIndex = 0;
              modal._npcRoamDir = 1;
            }
            modal._npcRoamIndex = nextIndex;
            if (mover) mover.style.setProperty("--npc-move-ms", `${moveMs}ms`);
            this.placeMover(modal, "roam", false);
            if (Math.random() < 0.38) {
              modal._npcHopTimer = setTimeout(() => this.triggerHop(modal), Math.max(500, Math.round(moveMs * 0.68)));
            }
            queueNext(moveMs + 900 + Math.round(Math.random() * 1200));
          }, pauseMs);
        }, delayMs);
      };
      queueNext(instant ? 1100 : 650);
    }

    focusLabNpc(modal) {
      const state = this.economy.getGhostNpcLabState();
      if (state.focusPhase === "focused" || state.focusPhase === "locking") return;
      state.focusPhase = "locking";
      state.focused = true;
      this.syncLabPhase(modal);
      this.clearRoamTimers(modal);
      modal._npcFocusTimer = setTimeout(() => {
        const nextState = this.economy.getGhostNpcLabState();
        nextState.focusPhase = "focused";
        nextState.focused = true;
        this.syncLabPhase(modal);
      }, 280);
    }

    syncLabPhase(modal) {
      const state = this.economy.getGhostNpcLabState();
      const win = modal.querySelector(".npc-lab-window");
      const tip = modal.querySelector("#npcLabTip");
      if (win) {
        win.classList.toggle("is-focused", state.focusPhase === "focused");
        win.classList.toggle("is-locking", state.focusPhase === "locking");
      }
      if (tip) {
        tip.textContent = state.focusPhase === "focused" ? "NPC enfocado. Usa Level Up, Habilidades o Pasiva." : "Haz click en el NPC para enfocarlo y abrir su UI.";
      }
      if (state.focusPhase === "roam") this.startRoam(modal, false);
      else {
        this.clearRoamTimers(modal);
        this.placeMover(modal, "focused", false);
      }
    }

    renderMainView(state) {
      const cap = this.economy.getGhostNpcLabReachableLevelCap(state);
      const passiveLevel = Math.max(0, Math.min(5, Math.round(Number(state.passiveLevel) || 0)));
      const evoSkillText = passiveLevel >= 5
        ? `Skill Lv ${passiveLevel} · MAX`
        : `Skill Lv ${passiveLevel} · Evo ${passiveLevel + 1} desbloquea Skill Lv ${passiveLevel + 1}`;
      const descriptionText = this.getNpcDescriptionText(state);
      const descriptionBlock = descriptionText
        ? `<div class="npc-lab-block compact"><div class="npc-lab-block-title">Descripcion</div><div class="npc-lab-block-sub compact">${esc(descriptionText)}</div></div>`
        : "";
      const primary = state.npcKey ? this.economy.getNpcPrimaryStatForKey(state.npcKey) : null;
      const statDefs = this.economy.getGhostNpcLabTreeStatDefs();
      const spentTotal = this.economy.getGhostNpcLabSpentCrystalTotal(state);
      const draftTotal = this.economy.getGhostNpcLabDraftCrystalTotal(state);
      const crystalCap = this.economy.getGhostNpcLabCrystalCap();
      const canConfirm = draftTotal > 0;
      const levelPct = Math.max(0, Math.min(100, Math.round((Math.max(1, Number(state.level) || 1) / Math.max(1, cap)) * 100)));
      const statRows = Object.entries(statDefs).map(([key, meta]) => {
        const visual = this.getStatVisualMeta(key);
        const draft = Math.max(0, Math.round(Number(state?.statCrystalDraft?.[key]) || 0));
        const baseValue = Math.max(0, Math.round(Number(state?.stats?.[key]) || 0));
        const previewValue = baseValue + draft;
        const available = this.economy.getGhostNpcLabAvailableCrystalsForStat(state, key);
        const canMinus = draft > 0;
        const canPlus = this.economy.canGhostNpcLabAdjustStatDraft(state, key, 1);
        const availableLabel = Number.isFinite(available) ? `${available}` : "∞";
        const subText = primary?.key === key
          ? `Principal base ${primary.value} · Disp. ${availableLabel}`
          : `Cristal superior · Disp. ${availableLabel}`;
        return `<div class="npc-lab-stat-row is-main"><div class="npc-lab-stat-top"><div class="npc-lab-stat-heading compact"><div class="npc-stat-icon" style="border-color:${esc(visual.color)};color:${esc(visual.color)};">${visual.icon}</div><div class="npc-lab-stat-meta"><div class="npc-lab-stat-label" style="color:${esc(meta.color)};">${esc(meta.label)}</div><div class="npc-lab-stat-sub">${subText}</div></div></div><div class="npc-lab-stat-value-wrap"><div class="npc-lab-stat-value" style="${draft > 0 ? `color:${esc(meta.color)};` : ``}">${esc(previewValue)}</div></div></div><div class="npc-lab-stat-controls is-main"><button type="button" class="npc-lab-stat-btn" data-npc-action="stat-minus" data-stat-key="${esc(key)}" ${canMinus ? "" : "disabled"}>−</button><button type="button" class="npc-lab-stat-btn" data-npc-action="stat-plus" data-stat-key="${esc(key)}" ${canPlus ? "" : "disabled"}>+</button></div></div>`;
      }).join("");
      return `<div class="npc-lab-main-view"><div class="npc-lab-panel-head compact"><div class="npc-lab-panel-name">${esc(state.name)}</div><div class="npc-lab-panel-stars">${stars(state.rarity)}</div><div class="npc-lab-evo-row"><div class="npc-lab-evo-text">${esc(evoSkillText)}</div>${this.buildEvolutionDiamonds(passiveLevel, 5)}</div><div class="npc-lab-level"><div class="npc-lab-level-head"><span>Nivel</span><b>${state.level}/${cap}</b></div><div class="npc-lab-level-bar"><div class="npc-lab-level-fill" style="width:${levelPct}%;"></div></div></div></div><div class="npc-lab-actions is-main triple"><button class="npc-lab-btn levelup" data-npc-action="open-levelup">Level Up</button><button class="npc-lab-btn skills" data-npc-action="open-skilltree">Habilidades</button><button class="npc-lab-btn passive" data-npc-action="open-evolution">Evolucionar</button></div>${descriptionBlock}<div class="npc-lab-block compact"><div class="npc-lab-block-title">${esc(state.skillName)}</div><div class="npc-lab-block-sub compact">El dupe del mismo NPC sube la evolucion. Las stats usan cristales superiores del mismo color.</div></div><div class="npc-lab-stat-list is-main">${statRows}</div><div class="npc-lab-main-footer"><div class="npc-lab-block compact"><div class="npc-lab-confirm-wrap is-main"><div class="npc-lab-confirm-meta">Pendiente <b>${draftTotal}</b> · Usado <b>${spentTotal}</b>/<b>${crystalCap}</b></div><button class="npc-lab-btn apply" data-npc-action="confirm-stat-draft" ${canConfirm ? "" : "disabled"}>Confirmar</button></div></div><button class="npc-lab-btn back compact" data-npc-action="back-roam">Volver</button></div></div>`;
    }

    renderLevelUpView(state) {
      const cap = this.economy.getGhostNpcLabReachableLevelCap(state);
      const anim = state.levelUpAnim && state.levelUpAnim.active ? state.levelUpAnim : null;
      const displayLevel = anim ? anim.displayLevel : state.level;
      const displayExp = anim ? anim.displayExp : state.exp;
      const need = this.economy.getGhostNpcLabLevelExpNeed(displayLevel, state.rarity);
      const gained = anim
        ? Math.max(0, Math.round(Number(anim.displayGain) || 0))
        : (state.levelUpSlots || []).reduce((sum, slot) => sum + (slot?.exp || 0), 0);
      const hasPreview = !anim && gained > 0;
      const preview = hasPreview
        ? this.economy.simulateGhostNpcLabExpGain(displayLevel, displayExp, gained, state.rarity, cap)
        : { level: displayLevel, exp: 0 };
      const progressPct = displayLevel >= cap ? 100 : Math.max(0, Math.min(100, Math.round((displayExp / need) * 100)));
      const previewNeed = hasPreview ? this.economy.getGhostNpcLabLevelExpNeed(preview.level, state.rarity) : need;
      const previewPct = hasPreview
        ? (preview.level >= cap ? 100 : Math.max(0, Math.min(100, Math.round((preview.exp / previewNeed) * 100))))
        : 0;
      const feedEntries = this.economy.getGhostNpcLabFeedEntries(state);
      const confirmHigh = !anim && !!state.levelUpConfirmHighRarity;
      const isAnimating = !!anim;
      const previewLabel = hasPreview
        ? `Preview ${preview.level}/${cap} (${preview.exp}/${previewNeed})`
        : (isAnimating ? `Aplicando... ${anim.displayGain}/${anim.totalGain} EXP` : "Sin preview");
      const previewBarHtml = hasPreview
        ? `<div class="npc-levelup-bar" style="margin-top:10px;"><div class="npc-levelup-bar-fill" style="width:${previewPct}%;background:linear-gradient(90deg,#22c55e,#38bdf8);"></div></div>`
        : `<div class="npc-levelup-bar" style="margin-top:10px;"><div class="npc-levelup-bar-fill" style="width:0%;background:linear-gradient(90deg,#22c55e,#38bdf8);"></div></div>`;
      return `<div class="npc-subview-card ${isAnimating ? `npc-levelup-busy` : ``}"><div class="npc-subview-head"><div><div class="npc-subview-title">Level Up</div><div class="npc-subview-sub">El mismo NPC da mas EXP. 1★-3★ aparecen primero. 4★-5★ tambien pueden usarse.</div></div><button type="button" class="npc-subview-close" data-npc-action="back-main" ${isAnimating ? "disabled" : ""}>Cerrar</button></div><div class="npc-subview-body"><div class="npc-levelup-layout"><div class="npc-levelup-left"><div class="npc-levelup-summary"><div class="npc-levelup-card"><div class="npc-levelup-card-preview">${this.buildGhostCard(state)}</div><div class="npc-lab-chip-row"><div class="npc-lab-chip">Lv actual ${displayLevel}</div><div class="npc-lab-chip">Cap ${cap}</div><div class="npc-lab-chip">EXP +${gained}</div></div>${isAnimating ? `<div class="npc-levelup-anim-note">${anim?.phase === "secret-intro" ? "Evento secreto activado..." : "Aplicando EXP real. El preview secreto no se muestra."}</div>` : ``}</div><div class="npc-lab-block"><div class="npc-lab-block-title">EXP actual</div><div class="npc-levelup-bar"><div class="npc-levelup-bar-fill" style="width:${progressPct}%;"></div></div><div class="npc-lab-block-sub">${displayExp}/${need} | ${previewLabel}</div>${previewBarHtml}</div><div class="npc-lab-block"><div class="npc-lab-block-title">Slots de alimento</div><div class="npc-lab-block-sub">Click en un slot lleno para devolverlo.</div><div class="npc-levelup-slots">${(state.levelUpSlots || []).map((slot, index) => !slot ? `<button type="button" class="npc-levelup-slot" data-npc-action="remove-feed" data-slot-index="${index}" ${isAnimating ? "disabled" : ""}>VACIO</button>` : `<button type="button" class="npc-levelup-slot is-filled" data-npc-action="remove-feed" data-slot-index="${index}" ${isAnimating ? "disabled" : ""}>${esc(slot.name)}<br>Lv ${esc(slot.level || 1)} · ${stars(slot.rarity)}<br>+${esc(slot.exp)} EXP</button>`).join("")}</div></div></div></div><div class="npc-levelup-right npc-lab-scroll"><div class="npc-lab-block"><div class="npc-lab-block-title">NPC disponibles</div><div class="npc-lab-block-sub">Los de 4★ y 5★ se muestran al final. Si los incluyes, la aplicacion pedira confirmacion.</div></div><div class="npc-levelup-feed-list">${feedEntries.map((entry) => { const def = entry.key === "ghost_self_dupe" ? ITEM_DEFS[state.npcKey] : ITEM_DEFS[entry.key]; const accent = def?.cardAccent || state.cardAccent || "#c084fc"; const bg1 = def?.cardBg1 || state.cardBg1 || "#5b21b6"; const bg2 = def?.cardBg2 || state.cardBg2 || "#1e293b"; const sigil = def?.cardSigil || def?.icon || "NPC"; return `<div class="npc-feed-item ${entry.rarity >= 4 ? `is-high-rarity` : ``}"><div class="npc-feed-icon" style="background:linear-gradient(180deg,${esc(bg1)} 0%,${esc(bg2)} 100%);border-color:${esc(accent)};">${esc(sigil)}</div><div><div class="npc-feed-name">${esc(entry.name)}</div><div class="npc-feed-sub">Lv ${esc(entry.level || 1)} | ${stars(entry.rarity)} | Copia individual | EXP ${esc(entry.exp)}</div><div class="npc-feed-sub">${entry.isSameUnit ? "Mismo NPC: bonus de EXP" : (entry.rarity >= 4 ? "Alta rareza: requiere confirmacion" : "EXP normal")}</div></div><button class="npc-lab-mini-btn" data-npc-action="add-feed" data-feed-id="${esc(entry.entryId)}" ${isAnimating ? "disabled" : ""}>Usar</button></div>`; }).join("") || `<div class="npc-lab-block-sub">No hay NPC disponibles para alimentar.</div>`}</div></div></div></div><div class="npc-subview-footer"><button class="npc-lab-btn back" data-npc-action="back-main" ${isAnimating ? "disabled" : ""}>Cancelar</button><button class="npc-lab-btn apply" data-npc-action="apply-levelup" ${isAnimating ? "disabled" : ""}>${isAnimating ? "Subiendo..." : "Subir nivel"}</button></div>${confirmHigh ? `<div class="npc-high-confirm"><div class="npc-high-confirm-card"><div class="npc-high-confirm-title">Confirmar NPC de alta rareza</div><div class="npc-high-confirm-sub">Has seleccionado uno o mas NPC 4★/5★ como alimento. Se usaran de forma permanente. ¿Quieres continuar?</div><div class="npc-high-confirm-actions"><button class="npc-lab-btn back" data-npc-action="cancel-high-confirm">Cancelar</button><button class="npc-lab-btn apply" data-npc-action="confirm-high-confirm">Confirmar</button></div></div></div>` : ``}</div>`;
    }

    renderSkillTreeView(state) {
      const cap = this.economy.getGhostNpcLabReachableLevelCap(state);
      const fx = state?.skillTree?.unlockFx && (Date.now() - Number(state?.skillTree?.unlockFx?.at || 0) < 1200)
        ? state.skillTree.unlockFx
        : null;
      const branches = state.skillTree?.branches || [];
      const branchGapX = 780;
      const branchStartX = 480;
      const rootY = 96;
      const tierY = [240, 450, 690, 930];
      const tierXOffsets = [
        [0],
        [-170, 170],
        [-300, -100, 100, 300],
        [0]
      ];
      const canvasW = Math.max(5200, branchStartX + Math.max(0, branches.length - 1) * branchGapX + 700);
      const canvasH = 1200;
      const getNodePos = (branchIndex = 0, nodeIndex = 0) => {
        if (nodeIndex <= 0) {
          return { x: branchStartX + branchIndex * branchGapX + tierXOffsets[0][0], y: tierY[0] };
        }
        if (nodeIndex <= 2) {
          return { x: branchStartX + branchIndex * branchGapX + tierXOffsets[1][nodeIndex - 1], y: tierY[1] };
        }
        if (nodeIndex <= 6) {
          return { x: branchStartX + branchIndex * branchGapX + tierXOffsets[2][nodeIndex - 3], y: tierY[2] };
        }
        return { x: branchStartX + branchIndex * branchGapX + tierXOffsets[3][0], y: tierY[3] };
      };
      const rootMeta = this.buildTreeNodeMeta(state, this.getCoreTreeNode(state));
      const rootNode = this.getCoreTreeNode(state);
      const rootState = this.getTreeNodeLevel(rootNode) >= this.getTreeNodeMaxLevel(rootNode) ? "done" : "next";
      const rootPos = {
        x: branchStartX + ((Math.max(0, branches.length - 1) * branchGapX) / 2),
        y: rootY
      };
      const rootFxHtml = fx && fx.branchIndex === -1 && fx.nodeIndex === -1 && fx.text
        ? `<div class="npc-tree-fx-text" style="color:${esc(fx.color || rootMeta.color)};">${esc(fx.text)}</div>`
        : "";
      const rootNodeHtml = `<button class="npc-tree-node is-${rootState}" style="left:${rootPos.x}px;top:${rootPos.y}px;--node-color:${esc(rootMeta.color)};" data-npc-action="open-node-upgrade" data-branch-index="-1" data-node-index="-1" data-tree-branch-index="-1" data-tree-node-index="-1" title="${esc(rootMeta.label)} ${esc(rootMeta.detailText)}">${rootFxHtml}<div class="npc-tree-node-icon">${rootMeta.icon}</div></button>`;

      const branchNodesHtml = branches.map((branch, branchIndex) => {
        return (branch.nodes || []).map((node, nodeIndex) => {
          const nodeState = this.getTreeNodeState(state, branch, nodeIndex);
          const meta = this.buildTreeNodeMeta(state, node);
          const pos = getNodePos(branchIndex, nodeIndex);
          const fxHtml = fx && fx.branchIndex === branchIndex && fx.nodeIndex === nodeIndex && fx.text
            ? `<div class="npc-tree-fx-text" style="color:${esc(fx.color || meta.color)};">${esc(fx.text)}</div>`
            : "";
          const lockHtml = nodeState === "locked"
            ? `<div class="npc-tree-node-lock"><span>🔒</span></div>`
            : "";
          return `<button class="npc-tree-node is-${nodeState}" style="left:${pos.x}px;top:${pos.y}px;--node-color:${esc(meta.color)};" data-npc-action="open-node-upgrade" data-branch-index="${branchIndex}" data-node-index="${nodeIndex}" data-tree-branch-index="${branchIndex}" data-tree-node-index="${nodeIndex}" ${nodeState === "locked" ? "disabled" : ""} title="${esc(meta.label)} ${esc(meta.detailText)}">${fxHtml}<div class="npc-tree-node-icon">${meta.icon}</div>${lockHtml}</button>`;
        }).join("");
      }).join("");
      let dialogHtml = "";
      const dlg = state?.skillTree?.upgradeDialog;
      if (dlg && typeof dlg === "object") {
        const ref = this.getTreeNodeRef(state, dlg.branchIndex, dlg.nodeIndex);
        if (ref?.node) {
          const node = ref.node;
          const meta = this.buildTreeNodeMeta(state, node);
          const level = this.getTreeNodeLevel(node);
          const maxLevel = this.getTreeNodeMaxLevel(node);
          const cost = this.getTreeNodeUpgradeCost(state, ref);
          const isMaxed = !!cost?.maxed || level >= maxLevel;
          const canPay = !isMaxed && this.canPayTreeNodeUpgrade(state, cost);
          let reqHtml = "";
          if (cost?.kind === "cap") {
            const rows = (cost.colors || []).map((entry) => {
              const have = String(state?.sourceMode || "") === "ghost"
                ? "∞"
                : `${Math.max(0, Math.round(Number(this.economy.inventory?.[entry.crystalKey]) || 0))}`;
              return `<div class="npc-node-upgrade-req"><span class="npc-node-upgrade-dot" style="background:${esc(entry.color)};"></span>${esc(entry.label)} x${esc(entry.qty)} <span class="npc-node-upgrade-have">Inv ${esc(have)}</span></div>`;
            }).join("");
            reqHtml = rows;
          } else if (cost) {
            const have = String(state?.sourceMode || "") === "ghost"
              ? "∞"
              : `${Math.max(0, Math.round(Number(this.economy.inventory?.[cost.crystalKey]) || 0))}`;
            reqHtml = `<div class="npc-node-upgrade-req"><span class="npc-node-upgrade-dot" style="background:${esc(cost.color || meta.color)};"></span>${esc(cost.statLabel || meta.label)} x${esc(cost.qty)} <span class="npc-node-upgrade-have">Inv ${esc(have)}</span></div>`;
          }
          const goldReq = (cost && !cost.maxed)
            ? `<div class="npc-node-upgrade-req"><span class="npc-node-upgrade-dot" style="background:#fbbf24;"></span>Oro x${esc(cost.gold || 0)} <span class="npc-node-upgrade-have">Saldo ${esc(this.economy.formatGoldHUD(this.economy.gold))}</span></div>`
            : "";
          const buttonLabel = isMaxed ? "MAX" : `Subir ${level}/${maxLevel} → ${Math.min(maxLevel, level + 1)}/${maxLevel}`;
          dialogHtml = `
            <div class="npc-node-upgrade-modal">
              <div class="npc-node-upgrade-card">
                <div class="npc-node-upgrade-title">${esc(meta.label)} ${ref.isCore ? "(Nodo Central)" : ""}</div>
                <div class="npc-node-upgrade-sub">Progreso ${esc(level)}/${esc(maxLevel)} · Consigue cristales en Tienda Monedas.</div>
                <div class="npc-node-upgrade-reqs">${reqHtml}${goldReq}</div>
                <div class="npc-node-upgrade-actions">
                  <button class="npc-lab-btn back" data-npc-action="close-node-upgrade">Cerrar</button>
                  <button class="npc-lab-btn apply" data-npc-action="upgrade-node-level" data-branch-index="${esc(ref.branchIndex)}" data-node-index="${esc(ref.nodeIndex)}" ${(!isMaxed && canPay) ? "" : "disabled"}>${buttonLabel}</button>
                </div>
              </div>
            </div>
          `;
        }
      }
      return `<div class="npc-subview-card"><div class="npc-subview-head"><div><div class="npc-subview-title">Arbol de Habilidades</div><div class="npc-subview-sub">0/5 en nodos de stat y 0/1 en nodo final. Naranja indica camino disponible.</div></div><button type="button" class="npc-subview-close" data-npc-action="back-main">Cerrar</button></div><div class="npc-subview-body"><div class="npc-lab-chip-row" style="margin-bottom:14px;"><div class="npc-lab-chip">Cap actual ${cap}</div><div class="npc-lab-chip">Cristales Sup. ∞</div><div class="npc-lab-chip">Oro ${this.economy.formatGoldHUD(this.economy.gold)}</div></div><div class="npc-tree-wrap"><div class="npc-tree-pan-hint">Arrastra para mover camara</div><div class="npc-tree-branches" style="width:${canvasW}px;min-width:${canvasW}px;height:${canvasH}px;min-height:${canvasH}px;">${rootNodeHtml}${branchNodesHtml}</div>${dialogHtml}</div></div><div class="npc-subview-footer"><button class="npc-lab-btn back" data-npc-action="back-main">Volver</button></div></div>`;
    }

    renderEvolutionView(state) {
      const current = Math.max(0, Math.min(5, Math.round(Number(state.passiveLevel) || 0)));
      const sameNpcEntries = this.economy.getGhostNpcLabFeedEntries(state).filter((entry) => !!entry.isSameUnit);
      const evoAnim = state?.evolutionAnim && state.evolutionAnim.active ? state.evolutionAnim : null;
      const selectedIds = Array.isArray(state.evolutionSelectedFeedIds)
        ? state.evolutionSelectedFeedIds.map((id) => String(id || "")).filter(Boolean)
        : [];
      const selectedMap = new Map(sameNpcEntries.map((entry) => [String(entry.entryId || ""), entry]));
      const selectedEntries = evoAnim
        ? (Array.isArray(evoAnim.queue) ? evoAnim.queue : [])
        : selectedIds.map((id) => selectedMap.get(id)).filter(Boolean);
      const maxPick = 5;
      const missingForMax = Math.max(0, 5 - current);
      const willApply = Math.min(missingForMax, selectedEntries.length);
      const consumedCount = Math.max(0, Math.round(Number(evoAnim?.completed) || 0));
      const currentConsumeId = String(evoAnim?.currentEntryId || "");
      const availableCount = sameNpcEntries.length;
      const canEvolve = current < 5 && selectedEntries.length > 0 && !evoAnim;
      const availableLabel = Number.isFinite(availableCount) ? `${availableCount}` : "∞";
      const previewLevel = evoAnim ? current : Math.min(5, current + willApply);
      const selectedSlotsHtml = Array.from({ length: maxPick }, (_, i) => {
        const entry = selectedEntries[i];
        if (!entry) return `<div class="npc-evo-slot">VACIO</div>`;
        const sigil = ITEM_DEFS[entry.key]?.cardSigil || ITEM_DEFS[entry.key]?.icon || "NPC";
        const isDone = i < consumedCount;
        const isConsuming = !!currentConsumeId && String(entry.entryId || "") === currentConsumeId;
        return `<div class="npc-evo-slot filled${isDone ? " done" : ""}${isConsuming ? " consuming" : ""}">${esc(sigil)}</div>`;
      }).join("");
      const gradeRowsHtml = Array.from({ length: 5 }, (_, idx) => {
        const level = idx + 1;
        const rowState = level <= current ? "is-done" : (level <= previewLevel ? "is-next" : "is-locked");
        const statusText = level <= current ? "Skill activa" : (level <= previewLevel ? (evoAnim ? "Activando" : "Siguiente skill") : "Bloqueado");
        const reqDiamonds = Array.from({ length: 5 }, (__unused, d) => (
          `<span class="npc-evo-grade-diamond${d < level ? " on" : ""}"></span>`
        )).join("");
        return `<div class="npc-evo-grade-row ${rowState}"><div class="npc-evo-grade-diamonds">${reqDiamonds}</div><div class="npc-evo-grade-label">Evo ${level} → Skill Lv ${level}</div><div class="npc-evo-grade-state">${statusText}</div></div>`;
      }).join("");
      const feedHtml = sameNpcEntries.map((entry) => {
        const def = ITEM_DEFS[entry.key] || ITEM_DEFS[state.npcKey] || {};
        const accent = def?.cardAccent || state.cardAccent || "#c084fc";
        const bg1 = def?.cardBg1 || state.cardBg1 || "#5b21b6";
        const bg2 = def?.cardBg2 || state.cardBg2 || "#1e293b";
        const sigil = def?.cardSigil || def?.icon || "NPC";
        const entryId = String(entry.entryId || "");
        const isSelected = selectedIds.includes(entryId);
        const canAdd = selectedIds.length < maxPick;
        const label = isSelected ? "Quitar" : (canAdd ? "Agregar" : "Lleno");
        const isConsuming = !!currentConsumeId && entryId === currentConsumeId;
        return `<div class="npc-feed-item${isSelected ? " is-selected" : ""}${isConsuming ? " is-consuming" : ""}"><div class="npc-feed-icon" style="background:linear-gradient(180deg,${esc(bg1)} 0%,${esc(bg2)} 100%);border-color:${esc(accent)};">${esc(sigil)}</div><div><div class="npc-feed-name">${esc(entry.name)}</div><div class="npc-feed-sub">Lv ${esc(entry.level || 1)} · ${stars(entry.rarity)}</div></div><button class="npc-lab-mini-btn" data-npc-action="toggle-evo-feed" data-feed-id="${esc(entryId)}" ${evoAnim || (!isSelected && !canAdd) ? "disabled" : ""}>${label}</button></div>`;
      }).join("") || `<div class="npc-lab-block-sub">No hay duplicados del mismo NPC.</div>`;
      return `<div class="npc-subview-card npc-evo-view ${state.evolutionAnimating ? "is-evolving" : ""}"><div class="npc-subview-head"><div><div class="npc-subview-title">Evolucion NPC</div></div><button type="button" class="npc-subview-close" data-npc-action="back-main" ${evoAnim ? "disabled" : ""}>Cerrar</button></div><div class="npc-subview-body"><div class="npc-evo-layout"><div class="npc-evo-top"><div class="npc-evo-left"><div class="npc-levelup-card"><div class="npc-levelup-card-preview">${this.buildGhostCard(state)}</div></div><div class="npc-lab-block"><div class="npc-lab-evo-row"><div class="npc-lab-evo-text">${current >= 5 ? "Skill Lv 5 · MAX" : `Skill Lv ${current} · Evo ${current + 1} desbloquea Skill Lv ${current + 1}`}</div>${this.buildEvolutionDiamonds(current, 5, evoAnim ? (current - 1) : -1)}</div><div class="npc-lab-chip-row" style="margin-top:10px;"><div class="npc-lab-chip">Seleccionados ${selectedEntries.length}/${maxPick}</div><div class="npc-lab-chip">Aplicara +${willApply}</div><div class="npc-lab-chip">Disp. ${availableLabel}</div></div></div><div class="npc-evo-actions"><button class="npc-lab-mini-btn" data-npc-action="fill-evo-max" ${evoAnim ? "disabled" : ""}>Auto x5</button><button class="npc-lab-mini-btn" data-npc-action="clear-evo-feed" ${evoAnim ? "disabled" : ""}>Limpiar</button></div></div><div class="npc-evo-right npc-lab-scroll"><div class="npc-lab-block"><div class="npc-lab-block-title">Uncap Grade</div><div class="npc-lab-block-sub">Cada evo sube la skill pasiva al mismo nivel.</div><div class="npc-evo-grade-list" style="margin-top:10px;">${gradeRowsHtml}</div></div></div></div><div class="npc-evo-bottom"><div class="npc-lab-block"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;"><div class="npc-lab-block-title">Seleccion de duplicados</div><div class="npc-lab-block-sub" style="margin:0;">Solo dupes del mismo NPC.</div></div><div class="npc-evo-slots">${selectedSlotsHtml}</div><div class="npc-evo-feed">${feedHtml}</div></div></div></div></div><div class="npc-subview-footer"><button class="npc-lab-btn back" data-npc-action="back-main" ${evoAnim ? "disabled" : ""}>Cancelar</button><button class="npc-lab-btn apply" data-npc-action="apply-evolution" ${canEvolve ? "" : "disabled"}>${evoAnim ? "Evolucionando..." : (current >= 5 ? "MAX" : `Evolucionar +${Math.max(1, willApply)}`)}</button></div></div>`;
    }
    renderPanel(modal) {
      const panel = modal.querySelector("#npcLabPanel");
      const subview = modal.querySelector("#npcLabSubview");
      if (!panel) return;
      const state = this.economy.getGhostNpcLabState();
      let savedTreeScrollTop = null;
      let savedTreeScrollLeft = null;
      let savedSubviewScrollTop = null;
      if (subview && state.view === "skilltree") {
        const treeWrap = subview.querySelector(".npc-tree-wrap");
        if (treeWrap) {
          savedTreeScrollTop = treeWrap.scrollTop;
          savedTreeScrollLeft = treeWrap.scrollLeft;
        } else {
          const bodyWrap = subview.querySelector(".npc-subview-body");
          if (bodyWrap) savedSubviewScrollTop = bodyWrap.scrollTop;
        }
      }
      panel.innerHTML = this.renderMainView(state);
      if (subview) {
        subview.innerHTML = "";
        const win = modal.querySelector(".npc-lab-window");
        const isSubview = state.view === "levelup" || state.view === "skilltree" || state.view === "evolution";
        if (win) win.classList.toggle("is-subview", isSubview);
        if (isSubview) {
          if (state.view === "levelup") subview.innerHTML = this.renderLevelUpView(state);
          else if (state.view === "skilltree") subview.innerHTML = this.renderSkillTreeView(state);
          else subview.innerHTML = this.renderEvolutionView(state);
          if (state.view === "skilltree") {
            const hasSavedScroll = (savedTreeScrollTop !== null || savedTreeScrollLeft !== null || savedSubviewScrollTop !== null);
            const scrollTop = savedTreeScrollTop !== null ? savedTreeScrollTop : savedSubviewScrollTop;
            requestAnimationFrame(() => {
              if (!subview.isConnected) return;
              const treeWrap = subview.querySelector(".npc-tree-wrap");
              if (hasSavedScroll) {
                if (treeWrap) treeWrap.scrollTop = scrollTop;
                if (treeWrap && savedTreeScrollLeft !== null) treeWrap.scrollLeft = savedTreeScrollLeft;
                if (!treeWrap) {
                  const bodyWrap = subview.querySelector(".npc-subview-body");
                  if (bodyWrap) bodyWrap.scrollTop = scrollTop;
                }
              } else if (treeWrap) {
                treeWrap.scrollLeft = Math.max(0, (treeWrap.scrollWidth - treeWrap.clientWidth) / 2);
                treeWrap.scrollTop = Math.max(0, (treeWrap.scrollHeight - treeWrap.clientHeight) / 2);
              }
              this.attachSkillTreeCameraDrag(subview);
              this.renderSkillTreeLinks(subview, this.economy.getGhostNpcLabState());
            });
          }
        }
      }
      panel.querySelectorAll("[data-npc-action]").forEach((el) => {
        el.addEventListener("click", (event) => {
          event.preventDefault();
          this.handlePanelAction(modal, String(el.getAttribute("data-npc-action") || ""), {
            branchIndex: Number(el.getAttribute("data-branch-index")),
            nodeIndex: Number(el.getAttribute("data-node-index")),
            slotIndex: Number(el.getAttribute("data-slot-index")),
            statKey: String(el.getAttribute("data-stat-key") || ""),
            feedEntryId: String(el.getAttribute("data-feed-id") || ""),
            feedKey: String(el.getAttribute("data-feed-key") || "")
          });
        });
      });
      if (subview) {
        subview.querySelectorAll("[data-npc-action]").forEach((el) => {
          el.addEventListener("click", (event) => {
            event.preventDefault();
            this.handlePanelAction(modal, String(el.getAttribute("data-npc-action") || ""), {
              branchIndex: Number(el.getAttribute("data-branch-index")),
              nodeIndex: Number(el.getAttribute("data-node-index")),
              slotIndex: Number(el.getAttribute("data-slot-index")),
              statKey: String(el.getAttribute("data-stat-key") || ""),
              feedEntryId: String(el.getAttribute("data-feed-id") || ""),
              feedKey: String(el.getAttribute("data-feed-key") || "")
            });
          });
        });
      }
    }

    addFeedToSlots(feedEntryId) {
      const state = this.economy.getGhostNpcLabState();
      const feed = this.economy.getGhostNpcLabFeedEntries(state).find((entry) => String(entry.entryId || "") === String(feedEntryId || ""));
      if (!feed) return this.economy.showUiErrorMessage("No se encontro ese NPC para alimento.");
      const slotIndex = state.levelUpSlots.findIndex((slot) => !slot);
      if (slotIndex < 0) return this.economy.showUiErrorMessage("No hay slots libres.");
      if (String(state.sourceMode || "") === "ghost") {
        const available = Math.max(0, Math.round(Number(state.levelUpOwned?.[feed.key]) || 0));
        if (available <= 0) return this.economy.showUiErrorMessage("Ese NPC ya no esta disponible.");
        state.levelUpOwned[feed.key] = available - 1;
      }
      state.levelUpSlots[slotIndex] = {
        entryId: String(feed.entryId || ""),
        instanceId: String(feed.instanceId || ""),
        key: feed.key,
        name: feed.name,
        rarity: feed.rarity,
        level: Math.max(1, Math.round(Number(feed.level) || 1)),
        exp: feed.exp
      };
    }

    removeFeedFromSlot(slotIndex) {
      const state = this.economy.getGhostNpcLabState();
      const idx = Math.max(0, Math.min(state.levelUpSlots.length - 1, Math.round(Number(slotIndex) || 0)));
      const slot = state.levelUpSlots[idx];
      if (!slot) return;
      if (String(state.sourceMode || "") === "ghost") {
        state.levelUpOwned[slot.key] = Math.max(0, Math.round(Number(state.levelUpOwned[slot.key]) || 0)) + 1;
      }
      state.levelUpSlots[idx] = null;
    }

    buildLevelUpResolution(state) {
      const slots = (state.levelUpSlots || []).filter(Boolean);
      const baseGain = slots.reduce((sum, slot) => sum + Math.max(0, Math.round(Number(slot?.exp) || 0)), 0);
      const cap = this.economy.getGhostNpcLabReachableLevelCap(state);
      let appliedGain = 0;
      let secretCount = 0;
      for (const slot of slots) {
        const slotBase = Math.max(0, Math.round(Number(slot?.exp) || 0));
        const isSameNpc = slot?.key === "ghost_self_dupe" || (!!state.npcKey && slot?.key === state.npcKey);
        let slotGain = slotBase;
        if (isSameNpc && Math.random() < 0.6) {
          slotGain *= 8;
          secretCount += 1;
        }
        appliedGain += slotGain;
      }
      return {
        baseGain,
        appliedGain,
        cap,
        secretCount,
        secretTriggered: secretCount > 0,
        final: this.economy.simulateGhostNpcLabExpGain(state.level, state.exp, appliedGain, state.rarity, cap)
      };
    }

    startLevelUpAnimation(modal, resolution) {
      const state = this.economy.getGhostNpcLabState();
      const startLevel = Math.max(1, Math.round(Number(state.levelUpAnim?.startLevel) || 0) || Math.round(Number(state.level) || 1));
      const startExp = Math.max(0, Math.round(Number(state.levelUpAnim?.startExp) || 0));
      const totalGain = Math.max(0, Math.round(Number(resolution?.appliedGain) || 0));
      if (totalGain <= 0) {
        state.levelUpAnim = null;
        this.renderLabState(modal);
        return;
      }
      if (modal?._npcLevelAnimFrame) {
        cancelAnimationFrame(modal._npcLevelAnimFrame);
        modal._npcLevelAnimFrame = null;
      }
      const cap = Math.max(1, Math.round(Number(resolution?.cap) || this.economy.getGhostNpcLabReachableLevelCap(state)));
      const duration = (resolution?.secretTriggered ? 2400 : 1650) + Math.min(900, Math.round(totalGain / 6));
      const runBarAnimation = () => {
        const startedAt = (typeof performance !== "undefined" && typeof performance.now === "function") ? performance.now() : Date.now();
        const tick = (now) => {
          if (!modal?.isConnected) {
            if (modal?._npcLevelAnimFrame) cancelAnimationFrame(modal._npcLevelAnimFrame);
            modal._npcLevelAnimFrame = null;
            return;
          }
          const currentState = this.economy.getGhostNpcLabState();
          const elapsed = Math.max(0, (now || Date.now()) - startedAt);
          const raw = Math.min(1, elapsed / duration);
          const eased = 1 - Math.pow(1 - raw, 3);
          const appliedNow = Math.max(0, Math.min(totalGain, Math.round(totalGain * eased)));
          const previewNow = this.economy.simulateGhostNpcLabExpGain(startLevel, startExp, appliedNow, currentState.rarity, cap);
          currentState.levelUpAnim = {
            ...(currentState.levelUpAnim || {}),
            active: raw < 1,
            startLevel,
            startExp,
            displayLevel: previewNow.level,
            displayExp: previewNow.exp,
            displayGain: appliedNow,
            totalGain,
            cap,
            phase: "bar-anim",
            showSecretBanner: false,
            secretTriggered: !!resolution?.secretTriggered
          };
          if (raw >= 1) {
            currentState.levelUpAnim = null;
          }
          this.renderLabState(modal);
          if (raw < 1) {
            modal._npcLevelAnimFrame = requestAnimationFrame(tick);
          } else {
            modal._npcLevelAnimFrame = null;
          }
        };
        modal._npcLevelAnimFrame = requestAnimationFrame(tick);
      };
      if (resolution?.secretTriggered) {
        modal._npcLevelIntroTimer = setTimeout(() => {
          modal._npcLevelIntroTimer = null;
          const currentState = this.economy.getGhostNpcLabState();
          if (currentState?.levelUpAnim) {
            currentState.levelUpAnim.showSecretBanner = false;
            currentState.levelUpAnim.phase = "bar-anim";
          }
          this.renderLabState(modal);
          runBarAnimation();
        }, 1350);
      } else {
        runBarAnimation();
      }
    }

    applyLevelUp(modal) {
      const state = this.economy.getGhostNpcLabState();
      const resolution = this.buildLevelUpResolution(state);
      if (resolution.baseGain <= 0) return this.economy.showUiErrorMessage("Agrega NPC a los slots antes de subir.");
      const startLevel = Math.max(1, Math.round(Number(state.level) || 1));
      const finalLevel = Math.max(startLevel, Math.round(Number(resolution.final?.level) || startLevel));
      const gainedLevels = Math.max(0, finalLevel - startLevel);
      state.levelUpAnim = {
        active: true,
        startLevel: state.level,
        startExp: state.exp,
        displayLevel: state.level,
        displayExp: state.exp,
        displayGain: 0,
        totalGain: resolution.appliedGain,
        cap: resolution.cap,
        phase: resolution.secretTriggered ? "secret-intro" : "bar-anim",
        showSecretBanner: !!resolution.secretTriggered,
        secretTriggered: !!resolution.secretTriggered
      };
      (state.levelUpSlots || [])
        .map((slot) => String(slot?.instanceId || ""))
        .filter(Boolean)
        .forEach((instanceId) => this.economy.removeNpcInventoryInstanceById(instanceId));
      this.economy.applyGhostNpcLabLevelGrowth(state, gainedLevels);
      state.level = resolution.final.level;
      state.exp = resolution.final.exp;
      state.levelUpSlots = state.levelUpSlots.map(() => null);
      state.levelUpConfirmHighRarity = false;
      state.levelUpPreview = null;
      this.economy.persistGhostNpcLabState(state);
      this.renderLabState(modal);
      this.startLevelUpAnimation(modal, resolution);
    }

    unlockTreeNode(branchIndex, nodeIndex) {
      const state = this.economy.getGhostNpcLabState();
      const branch = state.skillTree?.branches?.[branchIndex];
      const node = branch?.nodes?.[nodeIndex];
      if (!branch || !node || node.unlocked) return { ok: false };
      if (!this.isTreeNodePathAvailable(state, branchIndex, nodeIndex)) return { ok: false };
      node.unlocked = true;
      let fxText = "";
      let fxColor = "#f8fafc";
      if (node.kind === "stat" && node.statKey) {
        const add = Math.max(1, Math.round(Number(node.amount) || 0));
        const meta = this.getStatVisualMeta(node.statKey);
        state.stats[node.statKey] = Math.max(0, Math.round(Number(state.stats[node.statKey]) || 0)) + add;
        fxText = `+${add} ${meta.label}`;
        fxColor = meta.color || "#f8fafc";
      } else if (node.kind === "cap") {
        const gain = Math.max(1, Math.round(Number(node.capGain) || this.economy.getGhostNpcLabCapNodeGain(state.rarity)));
        fxText = `+${gain} nivel cap`;
        fxColor = "#fbbf24";
      }
      state.skillTree = state.skillTree || {};
      state.skillTree.unlockFx = {
        branchIndex: Math.max(0, Math.round(Number(branchIndex) || 0)),
        nodeIndex: Math.max(0, Math.round(Number(nodeIndex) || 0)),
        text: fxText,
        color: fxColor,
        at: Date.now()
      };
      return { ok: true, text: fxText, color: fxColor };
    }

    unlockCoreNode() {
      const state = this.economy.getGhostNpcLabState();
      state.skillTree = state.skillTree || {};
      if (state.skillTree.coreUnlocked) return { ok: false };
      const node = this.getCoreTreeNode(state);
      state.skillTree.coreUnlocked = true;
      let fxText = "";
      let fxColor = "#f8fafc";
      if (node.kind === "stat" && node.statKey) {
        const add = Math.max(1, Math.round(Number(node.amount) || 0));
        const meta = this.getStatVisualMeta(node.statKey);
        state.stats[node.statKey] = Math.max(0, Math.round(Number(state.stats[node.statKey]) || 0)) + add;
        fxText = `+${add} ${meta.label}`;
        fxColor = meta.color || "#f8fafc";
      }
      state.skillTree.unlockFx = {
        branchIndex: -1,
        nodeIndex: -1,
        text: fxText,
        color: fxColor,
        at: Date.now()
      };
      return { ok: true, text: fxText, color: fxColor };
    }

    runEvolutionSequence(modal) {
      if (!modal?.isConnected) return;
      const state = this.economy.getGhostNpcLabState();
      const anim = state?.evolutionAnim;
      if (!anim || !anim.active) return;

      if (anim.cursor >= anim.queue.length || state.passiveLevel >= 5) {
        const startLevel = Math.max(0, Math.min(5, Math.round(Number(anim.startLevel) || (Math.round(Number(state.passiveLevel) || 0) - Math.round(Number(anim.completed) || 0)))));
        const endLevel = Math.max(0, Math.min(5, Math.round(Number(state.passiveLevel) || 0)));
        state.evolutionAnimating = false;
        state.evolutionAnim = null;
        state.evolutionSelectedFeedIds = [];
        this.economy.persistGhostNpcLabState(state);
        this.renderLabState(modal);
        if (endLevel > startLevel) {
          this.playEvolutionSkillCinematic(modal, state, startLevel, endLevel);
        }
        return;
      }

      const step = anim.queue[anim.cursor];
      anim.currentEntryId = String(step?.entryId || "");
      this.renderLabState(modal);

      modal._npcEvoStepTimer = setTimeout(() => {
        modal._npcEvoStepTimer = null;
        const currentState = this.economy.getGhostNpcLabState();
        const currentAnim = currentState?.evolutionAnim;
        if (!currentAnim || !currentAnim.active) return;

        const currentStep = currentAnim.queue[currentAnim.cursor];
        let consumed = false;
        if (String(currentState.sourceMode || "") === "ghost") {
          const k = String(currentStep?.key || "");
          const have = Math.max(0, Math.round(Number(currentState.levelUpOwned?.[k]) || 0));
          if (k && have > 0) {
            currentState.levelUpOwned[k] = have - 1;
            consumed = true;
          }
        } else {
          const instanceId = String(currentStep?.instanceId || "");
          consumed = !!(instanceId && this.economy.removeNpcInventoryInstanceById(instanceId));
        }

        if (consumed) {
          currentState.passiveLevel = Math.max(0, Math.min(5, Math.round(Number(currentState.passiveLevel) || 0) + 1));
          currentAnim.completed = Math.max(0, Math.round(Number(currentAnim.completed) || 0) + 1);
        }
        currentAnim.cursor = Math.max(0, Math.round(Number(currentAnim.cursor) || 0) + 1);
        currentAnim.currentEntryId = "";
        this.economy.persistGhostNpcLabState(currentState);
        this.renderLabState(modal);
        this.runEvolutionSequence(modal);
      }, 360);
    }

    handlePanelAction(modal, action, payload = {}) {
      const state = this.economy.getGhostNpcLabState();
      if (modal?._npcEvoCinematicActive) return;
      if ((state.levelUpAnim?.active || state.evolutionAnim?.active) && !["back-roam", "back-main"].includes(action)) return;
      switch (action) {
        case "open-levelup": state.view = "levelup"; state.levelUpConfirmHighRarity = false; state.skillTree.upgradeDialog = null; break;
        case "open-skilltree": state.view = "skilltree"; state.levelUpConfirmHighRarity = false; break;
        case "open-evolution":
          state.view = "evolution";
          state.levelUpConfirmHighRarity = false;
          state.evolutionSelectedFeedIds = [];
          state.evolutionAnimating = false;
          state.evolutionAnim = null;
          break;
        case "back-main": state.view = "main"; state.levelUpConfirmHighRarity = false; state.skillTree.upgradeDialog = null; break;
        case "back-roam": state.view = "main"; state.focused = false; state.focusPhase = "roam"; state.skillTree.upgradeDialog = null; break;
        case "toggle-evo-feed": {
          const feedId = String(payload.feedEntryId || "");
          if (!feedId) break;
          const ids = Array.isArray(state.evolutionSelectedFeedIds) ? state.evolutionSelectedFeedIds : [];
          if (ids.includes(feedId)) {
            state.evolutionSelectedFeedIds = ids.filter((id) => id !== feedId);
            break;
          }
          if (ids.length >= 5) {
            this.economy.showUiErrorMessage("Maximo 5 duplicados por evolucion.");
            break;
          }
          state.evolutionSelectedFeedIds = [...ids, feedId];
          break;
        }
        case "fill-evo-max": {
          const source = this.economy.getGhostNpcLabFeedEntries(state).filter((entry) => !!entry.isSameUnit);
          state.evolutionSelectedFeedIds = source.slice(0, 5).map((entry) => String(entry.entryId || ""));
          break;
        }
        case "clear-evo-feed":
          state.evolutionSelectedFeedIds = [];
          break;
        case "apply-evolution": {
          const evoNow = Math.max(0, Math.min(5, Math.round(Number(state.passiveLevel) || 0)));
          if (evoNow >= 5) {
            this.economy.showUiErrorMessage("Este NPC ya esta al maximo de evolucion.");
            break;
          }
          const selectedIds = Array.isArray(state.evolutionSelectedFeedIds)
            ? state.evolutionSelectedFeedIds.map((id) => String(id || "")).filter(Boolean)
            : [];
          if (!selectedIds.length) {
            this.economy.showUiErrorMessage("Selecciona al menos un duplicado.");
            break;
          }
          const missing = Math.max(0, 5 - evoNow);
          const feedEntries = this.economy.getGhostNpcLabFeedEntries(state).filter((entry) => !!entry.isSameUnit);
          const selectedEntries = selectedIds
            .map((id) => feedEntries.find((entry) => String(entry.entryId || "") === id))
            .filter(Boolean)
            .slice(0, missing);
          if (!selectedEntries.length) {
            this.economy.showUiErrorMessage("Los duplicados seleccionados ya no estan disponibles.");
            state.evolutionSelectedFeedIds = [];
            break;
          }
          state.evolutionAnim = {
            active: true,
            startLevel: evoNow,
            queue: selectedEntries.map((entry) => ({
              entryId: String(entry.entryId || ""),
              instanceId: String(entry.instanceId || ""),
              key: String(entry.key || ""),
              name: String(entry.name || ""),
              rarity: Math.max(1, Math.min(5, Math.round(Number(entry.rarity) || 1)))
            })),
            cursor: 0,
            completed: 0,
            currentEntryId: ""
          };
          state.evolutionAnimating = true;
          this.economy.persistGhostNpcLabState(state);
          this.renderLabState(modal);
          this.runEvolutionSequence(modal);
          break;
        }
        case "stat-plus":
          if (!this.economy.canGhostNpcLabAdjustStatDraft(state, payload.statKey, 1)) {
            this.economy.showUiErrorMessage("No puedes usar mas cristales en esa stat.");
            break;
          }
          state.statCrystalDraft[payload.statKey] = Math.max(0, Math.round(Number(state?.statCrystalDraft?.[payload.statKey]) || 0) + 1);
          break;
        case "stat-minus":
          if (!this.economy.canGhostNpcLabAdjustStatDraft(state, payload.statKey, -1)) break;
          state.statCrystalDraft[payload.statKey] = Math.max(0, Math.round(Number(state?.statCrystalDraft?.[payload.statKey]) || 0) - 1);
          break;
        case "confirm-stat-draft": {
          const res = this.economy.applyGhostNpcLabStatDraft(state);
          if (!res.ok) {
            const message = res.reason === "empty"
              ? "No hay cristales pendientes por confirmar."
              : (res.reason === "cap"
                ? `Limite maximo: ${this.economy.getGhostNpcLabCrystalCap()} cristales.`
                : "No tienes cristales suficientes.");
            this.economy.showUiErrorMessage(message);
          }
          break;
        }
        case "add-feed": this.addFeedToSlots(payload.feedEntryId || payload.feedKey); break;
        case "remove-feed": this.removeFeedFromSlot(payload.slotIndex); break;
        case "apply-levelup":
          if ((state.levelUpSlots || []).some((slot) => Number(slot?.rarity || 0) >= 4)) {
            state.levelUpConfirmHighRarity = true;
            break;
          }
          this.applyLevelUp(modal);
          break;
        case "cancel-high-confirm":
          state.levelUpConfirmHighRarity = false;
          break;
        case "confirm-high-confirm":
          this.applyLevelUp(modal);
          break;
        case "open-node-upgrade": {
          this.openTreeNodeUpgradeDialog(payload.branchIndex, payload.nodeIndex);
          break;
        }
        case "close-node-upgrade": {
          state.skillTree = state.skillTree || {};
          state.skillTree.upgradeDialog = null;
          break;
        }
        case "upgrade-node-level": {
          const res = this.upgradeTreeNodeLevel(payload.branchIndex, payload.nodeIndex);
          if (!res?.ok) {
            if (res?.reason === "funds") this.economy.showUiErrorMessage("No tienes cristales/u oro suficientes.");
            else if (res?.reason === "maxed") this.economy.showUiErrorMessage("Ese nodo ya esta al maximo.");
            else if (res?.reason === "locked") this.economy.showUiErrorMessage("Debes desbloquear el camino anterior.");
          } else if (modal) {
            if (modal._npcTreeFxTimer) clearTimeout(modal._npcTreeFxTimer);
            modal._npcTreeFxTimer = setTimeout(() => {
              if (!modal.isConnected) return;
              const current = this.economy.getGhostNpcLabState();
              if (current?.skillTree?.unlockFx) {
                current.skillTree.unlockFx = null;
                this.economy.persistGhostNpcLabState(current);
                this.renderLabState(modal);
              }
              modal._npcTreeFxTimer = null;
            }, 900);
          }
          break;
        }
        case "unlock-core": {
          const res = this.upgradeTreeNodeLevel(-1, -1);
          if (!res?.ok && res?.reason === "funds") this.economy.showUiErrorMessage("No tienes cristales/u oro suficientes.");
          break;
        }
        case "unlock-node": {
          this.openTreeNodeUpgradeDialog(payload.branchIndex, payload.nodeIndex);
          break;
        }
        default: break;
      }
      this.renderLabState(modal);
    }

    renderLabState(modal, options = {}) {
      if (!modal) return;
      if (options.rebuildShell || !modal.querySelector(".npc-lab-window")) this.buildLabShell(modal);
      const state = this.economy.getGhostNpcLabState();
      this.economy.persistGhostNpcLabState(state);
      modal.querySelector("#npcLabTitle").textContent = state.contextTitle || "Laboratorio NPC";
      modal.querySelector("#npcLabSubtitle").textContent = state.contextSubtitle || "";
      const backdrop = modal.querySelector("#npcLabBackdrop");
      backdrop.classList.toggle("is-room", state.backgroundMode === "room");
      backdrop.classList.toggle("is-plain", state.backgroundMode !== "room");
      modal.querySelector("#ghostNpcMover").innerHTML = this.buildGhostCard(state);
      const globalFx = modal.querySelector("#npcLabGlobalFx");
      if (globalFx) {
        if (!modal._npcEvoCinematicActive) {
          globalFx.innerHTML = state.levelUpAnim?.showSecretBanner
            ? `<div class="npc-super-levelup-global"><span>SUPER LEVEL UP!!!</span></div>`
            : "";
        }
      }
      this.renderPanel(modal);
      this.syncLabPhase(modal);
    }
  }

  EconomySystem.prototype.ensureNpcUiBridge = function () {
    if (!this._npcUiBridge) this._npcUiBridge = new NpcUiBridge(this);
    return this._npcUiBridge;
  };

  EconomySystem.prototype.openNpcInventoryModal = function () { return this.ensureNpcUiBridge().openInventoryModal(); };
  EconomySystem.prototype.renderNpcInventoryIntoContainer = function (listEl) { return this.ensureNpcUiBridge().renderNpcInventoryIntoContainer(listEl); };
  EconomySystem.prototype.openGhostNpcLabModal = function (overrides) { return this.ensureNpcUiBridge().openLabModal(overrides); };
  EconomySystem.prototype.closeGhostNpcLabModal = function () { return this.ensureNpcUiBridge().closeLabModal(); };
  EconomySystem.prototype.renderGhostNpcLabModal = function (modal) { return this.ensureNpcUiBridge().renderLabState(modal); };
})();

