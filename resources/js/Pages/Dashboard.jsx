import React, { useMemo, useEffect, useRef, useState } from "react";
import { Link } from "@inertiajs/react";

/**
 * Next2Win — Dashboard.jsx (v4.4)
 * - Vollbreite (ohne Sidebar/Aside)
 * - Spielarten-Block als EIN Akkordeon (default: eingeklappt, persistiert)
 * - Hero-Desktop-Fix (Badge nicht gestretcht)
 * - Footer-Links Fix (Abstände, responsiv)
 * - Suchleiste + "Mehr erfahren" + "Spiele entdecken" entfernt
 */

export default function Dashboard({ auth = null, games = [], categories = [] }) {
  // Theme-CSS einhängen (einmalig)
  useEffect(() => {
    const id = "nx2-gold-theme-v44";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = THEME_CSS;
      document.head.appendChild(style);
    }
  }, []);

  const username = auth?.user?.name || null;
  const balance = auth?.user?.balance ?? 0;

  // Spielarten-Block: default eingeklappt + Persistenz
  const [filtersOpen, setFiltersOpen] = useState(() => {
    try {
      const saved = localStorage.getItem("nx2_filters_open");
      return saved ? saved === "1" : false; // standard: zu
    } catch {
      return false;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("nx2_filters_open", filtersOpen ? "1" : "0");
    } catch {}
  }, [filtersOpen]);

  // Tabs
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

  // Regale (Shelves)
  const shelves = useMemo(() => {
    const source = games?.length ? games : PLACEHOLDER_GAMES;
    return [
      { key: "hot", title: "Hot & Beliebt", items: source.slice(0, 12) },
      { key: "picks", title: "Unsere Tipps", items: source.slice(12, 24) },
      { key: "for_you", title: "Für dich empfohlen", items: source.slice(6, 18) },
      { key: "live", title: "Live Spiele", items: source.slice(8, 20) },
      { key: "new", title: "Neu hinzugefügt", items: source.slice(18, 30) },
    ];
  }, [games]);

  return (
    <div className="nx2-app">
      <div className="nx2-page">
        <main className="nx2-main">
          {/* HEADER */}
          <header className="nx2-header">
            <div className="nx2-header-row">
              <a className="nx2-logo" href={routeSafe("home", "/")}>
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
                      {username.slice(0, 1).toUpperCase()}
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

          {/* SPIELARTEN-BLOCK (ein/aus) */}
          <section className="nx2-providerbar" aria-label="Spielarten & Filter">
            <div className={`nx2-filter ${filtersOpen ? "open" : ""}`}>
              <button
                className="nx2-filter-head"
                onClick={() => setFiltersOpen((v) => !v)}
                aria-expanded={filtersOpen}
              >
                <IconFilter /> <span>Spielarten</span>
                <svg viewBox="0 0 24 24" className="nx2-filter-caret">
                  <path d="M7 10l5 5 5-5" />
                </svg>
              </button>
              <div className="nx2-filter-body">
                <div className="nx2-filter-grid">
                  <a className="nx2-filter-chip" href="#">
                    <IconSlot />
                    <span>Slots</span>
                  </a>
                  <a className="nx2-filter-chip" href="#">
                    <IconLive />
                    <span>Live</span>
                  </a>
                  <a className="nx2-filter-chip" href="#">
                    <IconDice />
                    <span>Crash</span>
                  </a>
                  <a className="nx2-filter-chip" href="#">
                    <IconCards />
                    <span>Blackjack</span>
                  </a>
                  <a className="nx2-filter-chip" href="#">
                    <IconRoulette />
                    <span>Roulette</span>
                  </a>
                  <a className="nx2-filter-chip" href="#">
                    <IconJackpot />
                    <span>Jackpot</span>
                  </a>
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
              <div className="nx2-hero-graphic" aria-hidden>
                <RocketIcon />
              </div>
            </div>
          </section>

          {/* TABS */}
          <section className="nx2-tabs">
            <div className="nx2-tabs-row">
              <div className="nx2-tablist" role="tablist" aria-label="Kategorien">
                {tabs.map((t, i) => (
                  <button key={t.key} role="tab" className="nx2-tab" aria-selected={i === 0}>
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* REGAL-REIHEN */}
          {shelves.map((s) => (
            <Shelf key={s.key} title={s.title} items={s.items} />
          ))}

          {/* LONG TEXT */}
          <section className="nx2-longtext">
            <h2>Warum Next2Win?</h2>
            <p>
              5.000+ Spiele, faire Boni, schnelle Auszahlungen und ein aufgeräumtes Interface im edlen Gold-Look.
              Spiele verantwortungsbewusst. 18+ | AGB gelten.
            </p>
          </section>

          {/* FOOTER */}
          <footer className="nx2-footer">
            <div className="nx2-footer-grid">
              <div className="nx2-footer-brand">
                <a className="nx2-logo" href={routeSafe("home", "/")}>
                  next<span>2</span>win
                </a>
                <p>Spiele verantwortungsbewusst. 18+ | AGB gelten.</p>
              </div>
              <div className="nx2-footer-links">
                <Link href={routeSafe("AGB", "/Terms&Conditions")}>AGB</Link>
                <a href={routeSafe("page.privacy", "#")}>Datenschutz</a>
                <a href={routeSafe("page.faq", "#")}>FAQ</a>
                <a href={routeSafe("page.responsible", "#")}>Safer Gambling</a>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* MOBILE NAV (optional) */}
      <nav className="nx2-bottom-nav" aria-label="Untere Navigation">
        <a href={routeSafe("home", "/")} className="active">
          <span className="nx2-dot" />
          Start
        </a>
        <a href={routeSafe("games.index", "#")}>Spiele</a>
        <a href={routeSafe("promo.index", "#")}>Aktionen</a>
        <a href={routeSafe("wallet.index", "#")}>Wallet</a>
      </nav>
    </div>
  );
}

/*** Komponenten ***/
function Shelf({ title, items }) {
  const scrollerRef = useRef(null);
  const scrollBy = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };
  return (
    <section className="nx2-shelf">
      <div className="nx2-shelf-head">
        <h2>{title}</h2>
        <div className="nx2-shelf-arrows">
          <button className="nx2-arrow" onClick={() => scrollBy(-1)} aria-label="Zurück">
            ‹
          </button>
          <button className="nx2-arrow" onClick={() => scrollBy(1)} aria-label="Weiter">
            ›
          </button>
        </div>
      </div>
      <div className="nx2-shelf-row" ref={scrollerRef}>
        {items.map((g) => (
          <article key={g.id || g.slug} className="nx2-game">
            <a className="nx2-game-thumb" href={routeSafe("games.show", `#/game/${g.slug || g.id}`)}>
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
    </section>
  );
}

/*** Icons ***/
function IconSlot() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M7 10h2v2H7m4-2h2v2h-2m4-2h2v2h-2" />
    </svg>
  );
}
function IconLive() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <path d="M12 7a5 5 0 0 1 5 5m-10 0a5 5 0 0 1 5-5m7-3a10 10 0 0 1 0 16M3 4a10 10 0 0 0 0 16" fill="none" />
    </svg>
  );
}
function IconCards() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <rect x="6" y="6" width="10" height="14" rx="2" />
      <rect x="10" y="4" width="10" height="14" rx="2" />
    </svg>
  );
}
function IconRoulette() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v6M21 12h-6M12 21v-6M3 12h6" />
    </svg>
  );
}
function IconDice() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <rect x="4" y="4" width="8" height="8" rx="2" />
      <rect x="12" y="12" width="8" height="8" rx="2" />
    </svg>
  );
}
function IconJackpot() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <path d="M5 20h14l-2-9H7z" />
      <path d="M9 11V6h6v5" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg viewBox="0 0 24 24" className="nx2-ico" aria-hidden>
      <path d="M3 5h18M6 12h12M10 19h4" />
    </svg>
  );
}
function RocketIcon({ small = false }) {
  return (
    <svg viewBox="0 0 64 64" className={small ? "nx2-rocket nx2-rocket--sm" : "nx2-rocket"} aria-hidden>
      <path d="M32 4c10 4 20 14 24 24-10 2-20 12-24 22-4-10-14-20-24-22 4-10 14-20 24-24z" />
      <circle cx="38" cy="20" r="6" />
      <path d="M20 44l-4 12 12-4" />
    </svg>
  );
}

/*** Helpers & Dummy Data ***/
function formatCurrency(v) {
  try {
    return new Intl.NumberFormat("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(v) || 0);
  } catch {
    return `${v}`;
  }
}
function routeSafe(name, fallback) {
  try {
    if (typeof route === "function") return route(name);
  } catch {}
  return fallback;
}

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

/* Desktop-Optimierung: zentrierte Breite & kompakter Hero */
@media (min-width:1000px){
  .nx2-page{ max-width:1400px; margin-inline:auto; padding-inline:clamp(12px, 2vw, 24px) }
  .nx2-hero--banner .nx2-hero-banner{ grid-template-columns:minmax(380px, 480px) 1fr; align-items:center; min-height:220px; padding:24px 28px }
  .nx2-hero-badge{ padding:8px 14px; font-size:14px }
  .nx2-hero-text{ align-self:center; padding-left:8px }
}

/* Tabs */
.nx2-tabs{position:sticky; top:calc(var(--h-header) + 0px); z-index:34; background:rgba(10,10,10,.75); backdrop-filter:blur(8px); border-bottom:1px solid rgba(255,255,255,.06)}
.nx2-tabs-row{height:48px; display:grid; grid-template-columns:1fr auto; gap:12px; align-items:center; padding:0 6px}
.nx2-tablist{display:flex; gap:8px; overflow:auto; scrollbar-width:thin}
.nx2-tab{height:34px; padding:0 14px; border-radius:999px; border:1px solid #2a2a2a; background:#0f0f0f; color:var(--text-dim); font-weight:700; white-space:nowrap}
.nx2-tab[aria-selected="true"], .nx2-tab:hover{color:#111; background:linear-gradient(180deg,#f1d573,#d4af37); border-color:transparent}
.nx2-select{height:34px; border-radius:10px; background:#0f0f0f; border:1px solid #2a2a2a; color:var(--text); padding:0 12px}

/* Shelves */
.nx2-shelf{padding:16px 0 6px}
.nx2-shelf-head{display:flex; align-items:center; justify-content:space-between; padding:0 4px 8px}
.nx2-shelf-head h2{margin:0; font-size:18px}
.nx2-shelf-arrows{display:none; gap:8px} @media (min-width:768px){ .nx2-shelf-arrows{display:flex} }
.nx2-arrow{width:36px; height:36px; border-radius:10px; border:1px solid #2a2a2a; background:#0f0f0f; color:var(--text); font-weight:900}
.nx2-shelf-row{display:grid; grid-auto-flow:column; grid-auto-columns:minmax(240px, 1fr); gap:12px; overflow-x:auto; padding-bottom:8px; scroll-snap-type:x mandatory}
@media (min-width:1400px){ .nx2-shelf-row{ grid-auto-columns:minmax(280px, 1fr) } }
.nx2-game{display:grid; gap:8px; scroll-snap-align:start}
.nx2-game-thumb{position:relative; display:block; border-radius:14px; overflow:hidden; border:1px solid #2a2a2a; background:#0f0f0f}
.nx2-game-thumb img{width:100%; height:100%; aspect-ratio:16/9; object-fit:cover; display:block}
.nx2-game-overlay{position:absolute; inset:auto 10px 10px; height:34px; border-radius:10px; background:linear-gradient(180deg,#f1d573,#d4af37); color:#111; font-weight:800; display:grid; place-items:center; padding:0 12px; opacity:0; transform:translateY(6px); transition:.18s}
.nx2-game-thumb:hover .nx2-game-overlay{opacity:1; transform:translateY(0)}
.nx2-game-meta{display:flex; align-items:baseline; justify-content:space-between; gap:10px; padding:0 2px}
.nx2-game-title{font-size:14px; font-weight:700; color:#f0f0f0}
.nx2-game-provider{font-size:12px; color:var(--text-dim)}

/* Long text & Footer */
.nx2-longtext{padding:18px 4px 28px; color:var(--text-dim)}

/* FOOTER + LINKS FIX */
.nx2-footer{border-top:1px solid rgba(255,255,255,.08); background:#0d0d0d; padding:26px 8px}
.nx2-footer-grid{display:grid; gap:16px; grid-template-columns:1fr; align-items:center; text-align:center}
.nx2-footer-brand p{color:var(--text-dim); margin-top:6px}
.nx2-footer-links{display:flex !important; flex-wrap:wrap; justify-content:center; gap:14px}
.nx2-footer-links > a{
  display:inline-block; padding:6px 10px; border-radius:8px;
  color:var(--text-dim); text-decoration:none; letter-spacing:.2px
}
.nx2-footer-links > a:hover{color:var(--text); background:#151515}
@supports not (gap:1rem){ .nx2-footer-links > a + a{ margin-left:14px } }
@media (min-width:900px){
  .nx2-footer-grid{ grid-template-columns:1fr auto; text-align:left }
  .nx2-footer-links{ justify-content:flex-end; gap:18px }
}

/* Bottom Mobile Nav */
.nx2-bottom-nav{position:sticky; bottom:0; z-index:35; display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#0d0d0d; border-top:1px solid #222}
.nx2-bottom-nav a{height:50px; display:grid; place-items:center; color:var(--text-dim); text-decoration:none; font-weight:700}
.nx2-bottom-nav a.active, .nx2-bottom-nav a:hover{color:var(--gold-soft)}
.nx2-dot{width:6px; height:6px; border-radius:999px; background:currentColor; display:inline-block; margin-right:6px}
`;
