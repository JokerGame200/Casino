import React, { useMemo, useEffect, useState, useRef } from "react";
import { Link } from "@inertiajs/react";

/**
 * Next2Win — Dashboard.jsx (v4.9 Inertia Drag + Marquee + Profile)
 * - Shelves: CSS-Marquee (auto) + Drag/Swipe mit Trägheit, KEIN Snap-Back
 * - Tabs: Drag/Swipe (clamp, ohne Scrollbar)
 * - Mobile: Profil in Bottom-Nav (Avatar/Initiale)
 * - AGB-Link: Anker + Doppel-RAF -> immer ganz oben starten
 */

export default function Dashboard({ auth = null, games = [], categories = [] }) {
  useEffect(() => {
    const id = "nx2-theme-global";
    let tag = document.getElementById(id);
    if (!tag) {
      tag = document.createElement("style");
      tag.id = id;
      document.head.appendChild(tag);
    }
    if (tag.innerHTML !== THEME_CSS) tag.innerHTML = THEME_CSS;
    try { document.title = "Dashboard"; } catch {}
  }, []);

  const username = auth?.user?.name || null;
  const balance = auth?.user?.balance ?? 0;
  const userInitial = username ? username.slice(0, 1).toUpperCase() : "👤";

  const [filtersOpen, setFiltersOpen] = useState(() => {
    try { return localStorage.getItem("nx2_filters_open") === "1"; } catch { return false; }
  });
  useEffect(() => {
    try { localStorage.setItem("nx2_filters_open", filtersOpen ? "1" : "0"); } catch {}
  }, [filtersOpen]);

  const tabs = useMemo(() => {
    const base = [
      { key: "popular", label: "Beliebt" },
      { key: "slots", label: "Slots" },
      { key: "live", label: "Live" },
      { key: "table", label: "Tischspiele" },
      { key: "new", label: "Neu" },
      { key: "jackpot", label: "Jackpot" },
    ];
    if (categories?.length) {
      const extra = categories
        .filter((c) => !base.find((b) => b.key === c.slug))
        .map((c) => ({ key: c.slug, label: c.name }));
      return [...base, ...extra];
    }
    return base;
  }, [categories]);

  const shelves = useMemo(() => {
    const source = games?.length ? games : PLACEHOLDER_GAMES;
    return [
      { key: "hot", title: "Hot & Beliebt", items: source.slice(0, 12), dur: 28 },
      { key: "picks", title: "Unsere Tipps", items: source.slice(12, 24), dur: 32 },
      { key: "for_you", title: "Für dich empfohlen", items: source.slice(6, 18), dur: 30 },
      { key: "live", title: "Live Spiele", items: source.slice(8, 20), dur: 34 },
      { key: "new", title: "Neu hinzugefügt", items: source.slice(18, 30), dur: 28 },
    ];
  }, [games]);

  // Tabs: Drag/Swipe
  const tablistRef = useRef(null);
  useDragWrap(tablistRef); // macht die Tab-Leiste per Drag verschiebbar (clamp)

  return (
    <div className="nx2-app">
      <div className="nx2-page">
        <main className="nx2-main">
          {/* HEADER */}
          <header className="nx2-header">
            <div className="nx2-header-row">
              <a className="nx2-logo" href={routeSafe("home", "/dashboard")}>
                next<span>2</span>win
              </a>

              <nav className="nx2-nav" aria-label="Top Navigation">
                <a href={routeSafe("games.index", "#")}>Slots</a>
                <a href={routeSafe("live.index", "#")}>Live</a>
                <a href={routeSafe("table.index", "#")}>Tischspiele</a>
                <a href={routeSafe("promo.index", "#")}>Aktionen</a>
                <a href={routeSafe("vip.index", "#")}>VIP</a>
              </nav>

              <div className="nx2-actions">
                <div className="nx2-balance-pill" title="Gesamtguthaben">
                  <svg aria-hidden viewBox="0 0 24 24" className="nx2-coin">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="nx2-balance">{formatCurrency(balance)} EUR</span>
                </div>
                {username ? (
                  <>
                    <a className="nx2-btn nx2-btn-gold" href={routeSafe("wallet.deposit", "#")}>
                      Einzahlen
                    </a>
                    <div className="nx2-avatar" title={username} aria-label={username}>
                      {userInitial}
                    </div>
                  </>
                ) : (
                  <>
                    <a className="nx2-btn nx2-btn-ghost" href={routeSafe("login", "/login")}>
                      Anmelden
                    </a>
                    <a className="nx2-btn nx2-btn-gold" href={routeSafe("register", "/register")}>
                      Registrieren
                    </a>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* FILTER/Akkordeon */}
          <section className="nx2-providerbar" aria-label="Spielarten & Filter">
            <div className={`nx2-filter ${filtersOpen ? "open" : ""}`}>
              <button
                className="nx2-filter-head"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
              >
                <IconFilter /> <span>Spielarten</span>
                <svg viewBox="0 0 24 24" className="nx2-filter-caret"><path d="M7 10l5 5 5-5" /></svg>
              </button>
              <div className="nx2-filter-body">
                <div className="nx2-filter-grid">
                  <a className="nx2-filter-chip" href="#"><IconSlot /><span>Slots</span></a>
                  <a className="nx2-filter-chip" href="#"><IconLive /><span>Live</span></a>
                  <a className="nx2-filter-chip" href="#"><IconDice /><span>Crash</span></a>
                  <a className="nx2-filter-chip" href="#"><IconCards /><span>Blackjack</span></a>
                  <a className="nx2-filter-chip" href="#"><IconRoulette /><span>Roulette</span></a>
                  <a className="nx2-filter-chip" href="#"><IconJackpot /><span>Jackpot</span></a>
                </div>
              </div>
            </div>
          </section>

          {/* HERO */}
          <section className="nx2-hero nx2-hero--banner">
            <div className="nx2-hero-banner">
              <div className="nx2-hero-badge">next2win<span>Up</span></div>
              <div className="nx2-hero-text">
                <h1>Treueprogramm</h1>
                <p>Steige Level um Level auf und sichere dir goldene Belohnungen – ganz ohne Umsatzbedingungen.</p>
              </div>
              <div className="nx2-hero-graphic" aria-hidden><RocketIcon /></div>
            </div>
          </section>

          {/* TABS (Drag/Swipe) */}
          <section className="nx2-tabs">
            <div className="nx2-tabs-row">
              <div className="nx2-tablist" role="tablist" aria-label="Kategorien" ref={tablistRef}>
                <div className="nx2-drag-wrap nx2-tab-inner">
                  {tabs.map((t, i) => (
                    <button key={t.key} role="tab" className="nx2-tab" aria-selected={i === 0}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SHELVES (Marquee+Drag) */}
          {shelves.map((s) => (
            <Shelf key={s.key} title={s.title} items={s.items} durationSec={s.dur} />
          ))}

          {/* LONG TEXT */}
          <section className="nx2-longtext">
            <h2>Warum Next2Win?</h2>
            <p>5.000+ Spiele, faire Boni, schnelle Auszahlungen und ein aufgeräumtes Interface im edlen Gold-Look.
               Spiele verantwortungsbewusst. 18+ | AGB gelten.</p>
          </section>

          {/* FOOTER */}
          <footer className="nx2-footer">
            <div className="nx2-footer-grid">
              <div className="nx2-footer-brand">
                <a className="nx2-logo" href={routeSafe("home", "/")}>next<span>2</span>win</a>
                <p>Spiele verantwortungsbewusst. 18+ | AGB gelten.</p>
              </div>
              <div className="nx2-footer-links">
                <Link
                  href={`${routeSafe("AGB", "/Terms&Conditions")}#agb-top`}
                  preserveScroll={false}
                  onSuccess={() => {
                    requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
                  }}
                >AGB</Link>
                <a href={routeSafe("page.privacy", "/privacy-policy")}>Datenschutz</a>
                <a href={routeSafe("page.faq", "/FAQ")}>FAQ</a>
                <a href={routeSafe("page.responsible", "/Safer-Gambling")}>Safer Gambling</a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* MOBILE NAV (mit Profil) */}
      <nav className="nx2-bottom-nav" aria-label="Untere Navigation">
        <a href={routeSafe("home", "/")} className="active"><span className="nx2-dot" />Start</a>
        <a href={routeSafe("games.index", "#")}>Spiele</a>
        <a href={routeSafe("promo.index", "#")}>Aktionen</a>
        <a href={routeSafe("wallet.index", "#")}>Wallet</a>
        <a href={routeSafe("profile.index", "/profile")} aria-label="Konto" className="nx2-bottom-profile">
          <span className="nx2-avatar-mini">{userInitial}</span>
          <span className="nx2-bottom-label">Konto</span>
        </a>
      </nav>
    </div>
  );
}

/*** Shelf (CSS-Marquee + Drag/Swipe) ***/
function Shelf({ title, items, durationSec = 30 }) {
  const base = items && items.length ? items : [];
  const minCards = 10;
  let filled = base;
  while (filled.length < minCards) filled = [...filled, ...base];
  const doubled = [...filled, ...filled];

  const loopRef = useRef(null);
  useDragWrap(loopRef); // Drag/Swipe aktivieren (Loop-Modus)

  return (
    <section className="nx2-shelf">
      <div className="nx2-shelf-head">
        <h2>{title}</h2>
      </div>

      <div className="nx2-shelf-loop" ref={loopRef}>
        <div className="nx2-drag-wrap">
          <div
            className="nx2-shelf-track nx2-marquee"
            style={{ "--marquee-duration": `${durationSec}s` }}
          >
            {doubled.map((g, idx) => (
              <article key={(g.id || g.slug || "g") + "-" + idx} className="nx2-game">
                <a className="nx2-game-thumb" href={routeSafe("games.show", `#/game/${g.slug || g.id || idx}`)}>
                  <img src={g.image} alt={g.name} loading="lazy" />
                  <span className="nx2-game-overlay">Spielen</span>
                </a>
                <div className="nx2-game-meta">
                  <h3 className="nx2-game-title">{g.name}</h3>
                  <span className="nx2-game-provider">{g.provider}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/*** Drag/Swipe Hook (Loop für Shelves, Clamp für Tabs) — KEIN Snap-Back ***/
function useDragWrap(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wrap = container.querySelector(".nx2-drag-wrap");
    if (!wrap) return;

    // Wenn ein .nx2-shelf-track existiert => Loop-Modus (unendliche Marquee)
    // sonst Clamp-Modus (Tabs)
    const track = container.querySelector(".nx2-shelf-track");
    const marquee = container.querySelector(".nx2-marquee"); // optional

    // Helper: Shift über CSS-Variable steuern
    const getShift = () => {
      const v = getComputedStyle(wrap).getPropertyValue("--drag-x").trim();
      const n = parseFloat(v);
      return Number.isFinite(n) ? n : 0;
    };
    const setShift = (x) => wrap.style.setProperty("--drag-x", `${x}px`);

    const getX = (e) => ("touches" in e ? e.touches[0].clientX : e.clientX) ?? 0;

    // Loop-Normalisierung (ersetzt Snap-Back)
    const getHalf = () => (track ? Math.max(1, track.scrollWidth / 2) : 1);
    const normalizeLoop = (x) => {
      const half = getHalf();
      const m = ((x % half) + half) % half; // 0..half
      return m - half;                       // -half..0
    };

    // Clamp-Grenzen (für Tabs)
    const getClampMin = () => {
      const contW = container.clientWidth || 0;
      const wrapW = wrap.scrollWidth || 0;
      return Math.min(0, contW - wrapW); // negativ oder 0
    };

    let dragging = false;
    let startX = 0;
    let startShift = 0;

    // Trägheit
    let lastX = 0, lastT = 0, vpx = 0; // px/ms
    let raf = 0;

    const down = (e) => {
      dragging = true;
      startX = getX(e);
      startShift = getShift();
      lastX = startX;
      lastT = performance.now();
      vpx = 0;

      wrap.style.transition = "none";
      container.classList.add("is-dragging");
      if (marquee) container.classList.add("nx2-dragging"); // pausiert CSS-Marquee
    };

    const move = (e) => {
      if (!dragging) return;
      const x = getX(e);
      const dx = x - startX;
      let next = startShift + dx;

      if (track) {
        // Loop-Modus: frei bewegen, anschließend normalisieren
        next = normalizeLoop(next);
      } else {
        // Clamp-Modus (Tabs)
        const min = getClampMin();
        next = Math.min(0, Math.max(min, next));
      }

      setShift(next);

      // Geschwindigkeit schätzen (px/ms)
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 16) {
        vpx = (x - lastX) / dt;
        lastX = x;
        lastT = now;
      }

      // horizontales Ziehen blockt Seitenscroll
      if (Math.abs(dx) > 3 && e.cancelable) e.preventDefault();
    };

    const up = () => {
      if (!dragging) return;
      dragging = false;

      container.classList.remove("is-dragging");
      if (marquee) container.classList.remove("nx2-dragging");

      // Inertia-Glide (kurz und weich)
      const friction = 0.94;         // 0..1 — je höher, desto länger gleiten
      let shift = getShift();
      let v = vpx * 16.67;           // grobe Umrechnung in px/Frame

      cancelAnimationFrame(raf);
      const step = () => {
        v *= friction;
        shift += v;

        if (track) {
          // Loop: kontinuierlich normieren
          shift = normalizeLoop(shift);
        } else {
          // Clamp: an Grenzen stoppen
          const min = getClampMin();
          if (shift > 0) { shift = 0; v = 0; }
          if (shift < min) { shift = min; v = 0; }
        }

        setShift(shift);
        if (Math.abs(v) > 0.2) {
          raf = requestAnimationFrame(step);
        }
      };
      if (Math.abs(v) > 0.2) raf = requestAnimationFrame(step);
    };

    const opts = { passive: false };

    // Pointer (modern)
    wrap.addEventListener("pointerdown", down, opts);
    wrap.addEventListener("pointermove", move, opts);
    window.addEventListener("pointerup", up, opts);
    window.addEventListener("pointercancel", up, opts);

    // Touch/Maus Fallbacks
    wrap.addEventListener("touchstart", down, opts);
    wrap.addEventListener("touchmove", move, opts);
    wrap.addEventListener("touchend", up, opts);
    wrap.addEventListener("mousedown", down, opts);
    window.addEventListener("mousemove", move, opts);
    window.addEventListener("mouseup", up, opts);

    return () => {
      cancelAnimationFrame(raf);
      wrap.removeEventListener("pointerdown", down);
      wrap.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      wrap.removeEventListener("touchstart", down);
      wrap.removeEventListener("touchmove", move);
      wrap.removeEventListener("touchend", up);
      wrap.removeEventListener("mousedown", down);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [containerRef]);
}

/*** Icons ***/
function IconSlot(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><rect x="3" y="6" width="18" height="12" rx="3"/><path d="M7 10h2v2H7m4-2h2v2h-2m4-2h2v2h-2"/></svg>);}
function IconLive(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><path d="M12 7a5 5 0 0 1 5 5m-10 0a5 5 0 0 1 5-5m7-3a10 10 0 0 1 0 16M3 4a10 10 0 0 0 0 16" fill="none"/></svg>);}
function IconCards(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><rect x="6" y="6" width="10" height="14" rx="2"/><rect x="10" y="4" width="10" height="14" rx="2"/></svg>);}
function IconRoulette(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 3v6M21 12h-6M12 21v-6M3 12h6"/></svg>);}
function IconDice(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><rect x="4" y="4" width="8" height="8" rx="2"/><rect x="12" y="12" width="8" height="8" rx="2"/></svg>);}
function IconJackpot(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><path d="M5 20h14l-2-9H7z"/><path d="M9 11V6h6v5"/></svg>);}
function IconFilter(){return(<svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden><path d="M3 5h18M6 12h12M10 19h4"/></svg>);}
function RocketIcon({ small=false }){return(<svg viewBox="0 0 64 64" className={small?"nx2-rocket nx2-rocket--sm":"nx2-rocket"} aria-hidden><path d="M32 4c10 4 20 14 24 24-10 2-20 12-24 22-4-10-14-20-24-22 4-10 14-20 24-24z"/><circle cx="38" cy="20" r="6"/><path d="M20 44l-4 12 12-4"/></svg>);}

/*** Helpers & Dummy Data ***/
function formatCurrency(v){ try { return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v)||0); } catch { return `${v}`; } }
function routeSafe(name, fallback){ try { if (typeof route === "function") return route(name); } catch {} return fallback; }

const PLACEHOLDER_GAMES = [
  { id: "g1", name: "Gold Rush Deluxe", provider: "Pragmatic Play", image: "https://picsum.photos/seed/g1/640/360", slug: "gold-rush-deluxe" },
  { id: "g2", name: "Royal Fortune", provider: "Relax Gaming", image: "https://picsum.photos/seed/g2/640/360", slug: "royal-fortune" },
  { id: "g3", name: "Temple of Amun", provider: "Play'n GO", image: "https://picsum.photos/seed/g3/640/360", slug: "temple-of-amun" },
  { id: "g4", name: "Black & Gold", provider: "Hacksaw", image: "https://picsum.photos/seed/g4/640/360", slug: "black-and-gold" },
  { id: "g5", name: "Midnight Dice", provider: "Push Gaming", image: "https://picsum.photos/seed/g5/640/360", slug: "midnight-dice" },
  { id: "g6", name: "Vault Heist", provider: "NoLimit City", image: "https://picsum.photos/seed/g6/640/360", slug: "vault-heist" },
  { id: "g7", name: "Lucky Pharaoh", provider: "Pragmatic Play", image: "https://picsum.photos/seed/g7/640/360", slug: "lucky-pharaoh" },
  { id: "g8", name: "Auric Storm", provider: "ELK", image: "https://picsum.photos/seed/g8/640/360", slug: "auric-storm" },
  { id: "g9", name: "VIP Roulette", provider: "Evolution", image: "https://picsum.photos/seed/g9/640/360", slug: "vip-roulette" },
  { id: "g10", name: "Crash Royale", provider: "Spribe", image: "https://picsum.photos/seed/g10/640/360", slug: "crash-royale" },
  { id: "g11", name: "Golden Blackjack", provider: "Evolution", image: "https://picsum.photos/seed/g11/640/360", slug: "golden-blackjack" },
  { id: "g12", name: "Jackpot Mine", provider: "Relax Gaming", image: "https://picsum.photos/seed/g12/640/360", slug: "jackpot-mine" },
  { id: "g13", name: "Royal Spins", provider: "Pragmatic Play", image: "https://picsum.photos/seed/g13/640/360", slug: "royal-spins" },
  { id: "g14", name: "Golden Fruits", provider: "ELK", image: "https://picsum.photos/seed/g14/640/360", slug: "golden-fruits" },
  { id: "g15", name: "Viking Gold", provider: "Play'n GO", image: "https://picsum.photos/seed/g15/640/360", slug: "viking-gold" },
  { id: "g16", name: "Pyramid Riches", provider: "Hacksaw", image: "https://picsum.photos/seed/g16/640/360", slug: "pyramid-riches" },
  { id: "g17", name: "Jet Rush", provider: "Spribe", image: "https://picsum.photos/seed/g17/640/360", slug: "jet-rush" },
  { id: "g18", name: "Roulette VIP", provider: "Evolution", image: "https://picsum.photos/seed/g18/640/360", slug: "roulette-vip" },
  { id: "g19", name: "Blackjack VIP", provider: "Evolution", image: "https://picsum.photos/seed/g19/640/360", slug: "blackjack-vip" },
  { id: "g20", name: "Golden Mine", provider: "Relax Gaming", image: "https://picsum.photos/seed/g20/640/360", slug: "golden-mine" },
  { id: "g21", name: "Neon Dice", provider: "Push Gaming", image: "https://picsum.photos/seed/g21/640/360", slug: "neon-dice" },
  { id: "g22", name: "Pharaoh II", provider: "Pragmatic Play", image: "https://picsum.photos/seed/g22/640/360", slug: "pharaoh-ii" },
  { id: "g23", name: "Storm of Gold", provider: "ELK", image: "https://picsum.photos/seed/g23/640/360", slug: "storm-of-gold" },
  { id: "g24", name: "Lucky Clover", provider: "Play'n GO", image: "https://picsum.photos/seed/g24/640/360", slug: "lucky-clover" },
  { id: "g25", name: "VIP Baccarat", provider: "Evolution", image: "https://picsum.photos/seed/g25/640/360", slug: "vip-baccarat" },
  { id: "g26", name: "Aurum Storm", provider: "Relax Gaming", image: "https://picsum.photos/seed/g26/640/360", slug: "aurum-storm" },
  { id: "g27", name: "Crash X", provider: "Spribe", image: "https://picsum.photos/seed/g27/640/360", slug: "crash-x" },
  { id: "g28", name: "Golden Spin", provider: "Hacksaw", image: "https://picsum.photos/seed/g28/640/360", slug: "golden-spin" },
  { id: "g29", name: "Temple Wilds", provider: "Push Gaming", image: "https://picsum.photos/seed/g29/640/360", slug: "temple-wilds" },
  { id: "g30", name: "Jackpot Storm", provider: "Relax Gaming", image: "https://picsum.photos/seed/g30/640/360", slug: "jackpot-storm" },
];

/*** THEME CSS ***/
const THEME_CSS = `
:root{
  --h-header:72px;
  --bg:#0a0a0a; --panel:#101010; --muted:#141414; --stroke:#222;
  --text:#eaeaea; --text-dim:#bdbdbd; --gold:#d4af37; --gold-soft:#f6e27a;
  --radius-sm:12px; --radius:16px; --radius-lg:22px;
  --shadow:0 10px 40px rgba(0,0,0,.6);
}
*{box-sizing:border-box} html,body,#app{height:100%}
body{
  background:
    radial-gradient(1200px 800px at 15% -12%, rgba(212,175,55,.12), transparent 40%),
    radial-gradient(1000px 600px at 85% -12%, rgba(246,226,122,.06), transparent 45%),
    var(--bg);
  color:var(--text);
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
}

/* VOLLBREITE CONTAINER */
.nx2-app{min-height:100dvh}
.nx2-page{width:100%; margin:0 auto; padding:0 clamp(8px,2vw,20px)}
.nx2-main{min-width:0}

/* Header */
.nx2-header{
  position:sticky; top:0; z-index:38;
  background:rgba(10,10,10,.75); backdrop-filter:blur(10px);
  border-bottom:1px solid rgba(255,255,255,.06)
}
.nx2-header-row{height:var(--h-header); display:grid; grid-template-columns:auto 1fr auto; gap:16px; align-items:center; padding:0 6px}
.nx2-logo{font-weight:900; font-size:22px; letter-spacing:.4px; color:var(--text); text-transform:uppercase; text-decoration:none}
.nx2-logo span{color:var(--gold)}
.nx2-nav{display:none; gap:14px}
.nx2-nav a{color:var(--text-dim); padding:10px 12px; border-radius:10px; text-decoration:none}
.nx2-nav a:hover{color:var(--text); background:#151515}
@media (min-width:1100px){ .nx2-nav{display:flex} }
.nx2-actions{display:flex; gap:12px; align-items:center; justify-self:end}
.nx2-btn{height:42px; padding:0 16px; border-radius:12px; display:inline-flex; align-items:center; gap:10px; border:1px solid transparent; text-decoration:none; font-weight:700; color:var(--text)}
.nx2-btn-ghost{background:#111; border-color:#222}
.nx2-btn-ghost:hover{background:#161616}
.nx2-btn-gold{background:linear-gradient(180deg,#f1d573,#d4af37); color:#1b1b1b; border:none; box-shadow:0 2px 18px rgba(212,175,55,.35)}
.nx2-btn-gold:hover{filter:brightness(1.05)}
.nx2-avatar{width:36px; height:36px; border-radius:12px; background:#1d1d1d; display:grid; place-items:center; font-weight:800; color:var(--gold); border:1px solid #2a2a2a}
.nx2-balance-pill{display:inline-flex; gap:10px; align-items:center; height:40px; padding:0 14px; border-radius:999px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); backdrop-filter:blur(8px); color:var(--gold)}
.nx2-coin{width:18px; height:18px; fill:none; stroke:var(--gold); stroke-width:2}

/* Spielarten-Block */
.nx2-providerbar{
  position:sticky; top:var(--h-header); z-index:36;
  background:#0d0d0d; border-bottom:1px solid var(--stroke);
  padding:10px 6px 14px; border-radius:0 0 12px 12px
}
.nx2-filter{border:1px solid #2a2a2a; border-radius:12px; background:#0f0f0f; overflow:hidden}
.nx2-filter-head{
  width:100%; height:44px; display:grid; grid-template-columns:24px 1fr 24px;
  align-items:center; gap:8px; padding:0 12px; color:#ddd; background:transparent; border:none; text-align:left; font-weight:800
}
.nx2-filter-head:hover{background:#141414}
.nx2-filter-caret{width:20px; height:20px; fill:none; stroke:#bbb; stroke-width:2; transition:transform .18s ease}
.nx2-filter.open .nx2-filter-caret{transform:rotate(180deg)}
.nx2-filter-body{max-height:0; overflow:hidden; transition:max-height .22s ease; background:#0e0e0e}
.nx2-filter.open .nx2-filter-body{max-height:220px}
.nx2-filter-grid{display:grid; grid-template-columns:repeat(6, minmax(120px, 1fr)); gap:8px; padding:10px}
@media (max-width:900px){ .nx2-filter-grid{ grid-template-columns:repeat(3, minmax(120px, 1fr)) } }
@media (max-width:520px){ .nx2-filter-grid{ grid-template-columns:repeat(2, minmax(120px, 1fr)) } }
.nx2-filter-chip{
  height:42px; border-radius:12px; border:1px solid #2a2a2a; background:#121212; color:#cfcfcf;
  display:grid; grid-template-columns:24px 1fr; align-items:center; gap:10px; padding:0 12px; text-decoration:none; font-weight:800
}
.nx2-filter-chip:hover{color:#111; background:linear-gradient(180deg,#f1d573,#d4af37); border-color:transparent}

/* Hero */
.nx2-hero{padding:16px 0}
.nx2-hero--banner .nx2-hero-banner{
  position:relative; border-radius:18px; overflow:hidden;
  background:radial-gradient(120% 120% at 20% 0%, rgba(212,175,55,.18), rgba(255,255,255,.02)), #101010;
  border:1px solid #2a2a2a; box-shadow:var(--shadow);
  min-height:clamp(160px, 24vw, 260px);
  padding:18px; display:grid; grid-template-columns:1.1fr .9fr; gap:10px
}
@media (max-width:992px){ .nx2-hero--banner .nx2-hero-banner{ grid-template-columns:1fr; min-height:200px } }
.nx2-hero-badge{display:inline-flex; justify-self:start; align-self:start; width:auto; max-width:max-content; padding:6px 10px; border-radius:999px; font-weight:900; color:#111; background:linear-gradient(180deg,#f1d573,#d4af37)}
.nx2-hero-text h1{margin:6px 0 8px; font-size:clamp(22px, 3.5vw, 32px)}
.nx2-hero-text p{color:var(--text-dim)}
.nx2-hero-graphic{position:relative}
.nx2-rocket{position:absolute; right:-20px; top:-12px; width:clamp(180px, 26vw, 260px); height:auto; fill:rgba(246,226,122,.25); filter:drop-shadow(0 10px 30px rgba(0,0,0,.5))}
.nx2-rocket--sm{position:static; width:28px; height:28px; fill:rgba(246,226,122,.35)}

/* Desktop-Optimierung */
@media (min-width:1000px){
  .nx2-page{ max-width:1400px; margin-inline:auto; padding-inline:clamp(12px, 2vw, 24px) }
  .nx2-hero--banner .nx2-hero-banner{ grid-template-columns:minmax(380px, 480px) 1fr; align-items:center; min-height:220px; padding:24px 28px }
  .nx2-hero-badge{ padding:8px 14px; font-size:14px }
  .nx2-hero-text{ align-self:center; padding-left:8px }
}

/* Tabs (Drag/Swipe) */
.nx2-tabs{position:sticky; top:calc(var(--h-header)); z-index:34; background:rgba(10,10,10,.75); backdrop-filter:blur(8px); border-bottom:1px solid rgba(255,255,255,.06)}
.nx2-tabs-row{height:48px; display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center; padding:0 6px}
.nx2-tablist{overflow:hidden; touch-action:pan-y; cursor:grab}
.nx2-tablist.is-dragging{ cursor:grabbing }
.nx2-tab-inner{ display:flex; gap:8px; will-change:transform }
.nx2-tab{height:34px; padding:0 14px; border-radius:999px; border:1px solid #2a2a2a; background:#0f0f0f; color:#f0f0f0b3; font-weight:700; white-space:nowrap}
.nx2-tab[aria-selected="true"], .nx2-tab:hover{color:#111; background:linear-gradient(180deg,#f1d573,#d4af37); border-color:transparent}
.nx2-select{height:34px; border-radius:10px; background:#0f0f0f; border:1px solid #2a2a2a; color:var(--text); padding:0 12px}

/* Shelves (CSS-Marquee + Drag) */
.nx2-shelf{padding:16px 0 6px}
.nx2-shelf-head{display:flex; align-items:center; justify-content:space-between; padding:0 4px 8px}
.nx2-shelf-head h2{margin:0; font-size:18px}
.nx2-shelf-loop{ position:relative; overflow:hidden; touch-action:pan-y; cursor:grab }
.nx2-shelf-loop.is-dragging{ cursor:grabbing }

/* >>> Drag-Wrapper: Verschiebung per CSS-Variable (kein Snap-Back) <<< */
.nx2-drag-wrap{
  will-change: transform;
  transform: translateX(var(--drag-x, 0px));
}

/* Während Drag CSS-Marquee pausen */
.nx2-dragging .nx2-marquee{ animation-play-state: paused }
.nx2-shelf-track{ display:flex; gap:12px; will-change:transform }

/* Marquee Animation */
.nx2-marquee{
  animation-name:nx2-marquee-kf;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-duration: var(--marquee-duration, 30s);
}
.nx2-shelf-loop:hover .nx2-marquee{ animation-play-state: paused; }
@media (prefers-reduced-motion: reduce){
  .nx2-marquee{ animation: none; }
}
@keyframes nx2-marquee-kf{
  0%{ transform: translateX(0); }
  100%{ transform: translateX(-50%); }
}

/* Cards */
.nx2-game{display:grid; gap:8px}
.nx2-game-thumb{position:relative; display:block; border-radius:14px; overflow:hidden; border:1px solid #2a2a2a; background:#0f0f0f; min-width:240px}
.nx2-game-thumb img{width:100%; height:100%; aspect-ratio:16/9; object-fit:cover; display:block}
.nx2-game-overlay{position:absolute; inset:auto 10px 10px; height:34px; border-radius:10px; background:linear-gradient(180deg,#f1d573,#d4af37); color:#111; font-weight:800; display:grid; place-items:center; padding:0 12px; opacity:0; transform:translateY(6px); transition:.18s}
.nx2-game-thumb:hover .nx2-game-overlay{opacity:1; transform:translateY(0)}
.nx2-game-meta{display:flex; align-items:baseline; justify-content:space-between; gap:10px; padding:0 2px}
.nx2-game-title{font-size:14px; font-weight:700; color:#f0f0f0}
.nx2-game-provider{font-size:12px; color:var(--text-dim)}

/* Long text & Footer */
.nx2-longtext{padding:18px 4px 28px; color:var(--text-dim)}
.nx2-footer{border-top:1px solid rgba(255,255,255,.08); background:#0d0d0d; padding:26px 8px}
.nx2-footer-grid{display:grid; gap:16px; grid-template-columns:1fr; align-items:center; text-align:center}
.nx2-footer-brand p{color:var(--text-dim); margin-top:6px}
.nx2-footer-links{display:flex !important; flex-wrap:wrap; justify-content:center; gap:14px}
.nx2-footer-links > a{display:inline-block; padding:6px 10px; border-radius:8px; color:var(--text-dim); text-decoration:none; letter-spacing:.2px}
.nx2-footer-links > a:hover{color:var(--text); background:#151515}
@supports not (gap:1rem){ .nx2-footer-links > a + a{ margin-left:14px } }
@media (min-width:900px){
  .nx2-footer-grid{ grid-template-columns:1fr auto; text-align:left }
  .nx2-footer-links{ justify-content:flex-end; gap:18px }
}

/* Bottom Mobile Nav (mit Profil) */
.nx2-bottom-nav{
  position:sticky; bottom:0; z-index:35;
  display:grid; grid-template-columns:repeat(5,1fr);
  gap:1px; background:#0d0d0d; border-top:1px solid #222
}
.nx2-bottom-nav a{
  height:50px; display:grid; place-items:center;
  color:var(--text-dim); text-decoration:none; font-weight:700
}
.nx2-bottom-nav a.active, .nx2-bottom-nav a:hover{color:var(--gold-soft)}
.nx2-dot{width:6px; height:6px; border-radius:999px; background:currentColor; display:inline-block; margin-right:6px}
.nx2-bottom-profile{ display:grid; grid-template-rows:auto auto; align-items:center; gap:2px; padding-top:4px }
.nx2-avatar-mini{
  width:24px; height:24px; border-radius:999px; background:#1c1c1c;
  border:1px solid #2a2a2a; color:var(--gold); display:grid; place-items:center; font-weight:900; font-size:12px
}
.nx2-bottom-label{ font-size:11px; line-height:1; color:var(--text-dim) }

/* nur Body scrollt */
html, body { margin:0; padding:0; overflow-x:hidden; overflow-y:auto; }
#app{ display:block !important; height:auto !important; min-height:0 !important; overflow:visible !important; }

/* Vollbreite */
.nx2-page{ width:100%; max-width:none !important; margin:0 auto; padding:0 clamp(8px,2vw,20px); }

/* Sticky-Footer */
.nx2-app{ min-height:100svh; display:flex; flex-direction:column; }
.nx2-main{ flex:1 1 auto; display:flex; flex-direction:column; min-height:0; }
.nx2-footer{ margin-top:auto; }
`;
