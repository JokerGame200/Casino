import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useLayoutEffect,
  useId,
} from "react";
import agbRaw from "./AGB.txt?raw";

/**
 * AGB.jsx – polished
 * - Single scroll (nur Body), Sticky footer
 * - Robust Accordion (ResizeObserver, auto-height)
 * - A11y: ARIA + Keyboard (↑ ↓ Home End, Enter/Space)
 * - Mobile header fixes (iPhone SE)
 * - No FOUC: inline <style> + head fallback
 */

export default function AGB({ auth = null }) {
  // Head-Fallback, falls Inline-Style mal überschrieben wird
  useEffect(() => {
    const id = "nx2-gold-theme-v44";
    if (!document.getElementById(id)) {
      const s = document.createElement("style");
      s.id = id;
      s.innerHTML = THEME_CSS;
      document.head.appendChild(s);
    }
    document.title = "AGB";
  }, []);

  const username = auth?.user?.name || null;
  const balance = auth?.user?.balance ?? 0;

  const sections = useMemo(() => parseByNumbers(agbRaw), []);

  return (
    <div className="nx2-app">
      {/* sofort laden: verhindert FOUC */}
      <style id="nx2-gold-theme-v44">{THEME_CSS}</style>

      <div className="nx2-page">
        <main className="nx2-main">
          {/* ===== HEADER ===== */}
          <header className="nx2-header">
            <div className="nx2-header-row">
              <a className="nx2-logo" href={routeSafe("home", "/dashboard")}>
                next<span>2</span>win
              </a>

              <nav className="nx2-nav" aria-label="Top Navigation">
                <a href={routeSafe("games.index", "#")}>Slots</a>
                <a href={routeSafe("live.index", "#")}>Live</a>
                <a href={routeSafe("table.index", "#")}>Table-games</a>
                <a href={routeSafe("promo.index", "#")}>Promotions</a>
                <a href={routeSafe("vip.index", "#")}>VIP</a>
              </nav>

              <div className="nx2-actions">
                <div className="nx2-balance-pill" title="Gesamtguthaben">
                  <svg aria-hidden viewBox="0 0 24 24" className="nx2-coin">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                  <span className="nx2-balance">{formatCurrency(balance)} EUR</span>
                </div>

                <a className="nx2-btn nx2-btn-gold" href={routeSafe("wallet.deposit", "#")}>
                  Deposit
                </a>

                {username ? (
                  <div className="nx2-avatar" title={username} aria-label={username}>
                    {username.slice(0, 1).toUpperCase()}
                  </div>
                ) : (
                  <div className="nx2-avatar" title="Profil" aria-label="Profil">
                    <IconUser />
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ===== PAGE TITLE ===== */}
          <section className="nx2-page-title">
            <h1 className="nx2-title-h1">Terms and Conditions</h1>
          </section>

          {/* ===== DOKUMENT ===== */}
          <article className="nx2-doc" onKeyDown={handleListKeyDown}>
            {sections.map((sec, i) => (
              <Accordion key={i} title={sec.title} defaultOpen={false}>
                {sec.blocks.map((b, j) => {
                  if (b.type === "subhead") return <h3 key={j} className="nx2-h3">{b.text}</h3>;
                  if (b.type === "ul") {
                    return (
                      <ul key={j} className="nx2-ul">
                        {b.items.map((li, k) => <li key={k}>{renderInline(li)}</li>)}
                      </ul>
                    );
                  }
                  return <p key={j}>{renderInline(b.text)}</p>;
                })}
              </Accordion>
            ))}
          </article>

          {/* ===== FOOTER ===== */}
          <footer className="nx2-footer">
            <div className="nx2-footer-grid">
              <div className="nx2-footer-brand">
                <a className="nx2-logo" href={routeSafe("home", "/")}>
                  next<span>2</span>win
                </a>
                <p>Play responsibly. 18+ | Terms and conditions apply.</p>
              </div>
              <div className="nx2-footer-links">
                <a href={routeSafe("agb", "/agb")}>Terms and Conditions</a>
                <a href={routeSafe("page.privacy", "#")}>Privacy policy</a>
                <a href={routeSafe("page.faq", "#")}>FAQ</a>
                <a href={routeSafe("page.responsible", "#")}>Safer Gambling</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ========== Accordion (a11y + ResizeObserver + auto-height) ========== */
function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const panelId = useId().replace(/:/g, "_");
  const btnId = `btn_${panelId}`;
  const prefersReduced = usePrefersReducedMotion();

  // Erstes Layout
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    setHeight(open ? `${el.scrollHeight}px` : "0px");
  }, [open, children]);

  // TransitionEnd -> bei "auf" auf auto setzen
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const onEnd = (e) => {
      if (e.propertyName !== "max-height") return;
      if (open) setHeight("auto");
    };
    el.addEventListener("transitionend", onEnd);
    return () => el.removeEventListener("transitionend", onEnd);
  }, [open]);

  // ResizeObserver: Inhalt ändert sich (Schriften, Wrap, Bilder) -> nachmessen
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      if (!open) return;
      if (height === "auto") {
        // kurz Pixel -> auto, damit zukünftige Togglen wieder animieren
        setHeight(`${el.scrollHeight}px`);
        requestAnimationFrame(() => setHeight("auto"));
      } else {
        setHeight(`${el.scrollHeight}px`);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, height]);

  const handleToggle = () => {
    const el = bodyRef.current;
    if (!el) return;
    if (open) {
      if (height === "auto") {
        setHeight(`${el.scrollHeight}px`);
        requestAnimationFrame(() => setHeight("0px"));
      } else {
        setHeight("0px");
      }
      setOpen(false);
    } else {
      setOpen(true);
      // Höhe setzt useLayoutEffect
    }
  };

  const onButtonKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <section className={`nx2-acc ${open ? "open" : ""}`}>
      <button
        id={btnId}
        className="nx2-acc-head nx2-h2"
        role="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={handleToggle}
        onKeyDown={onButtonKeyDown}
        data-acc-toggle
      >
        <span className="nx2-headline">{renderHeadingInline(title)}</span>
        <svg className="nx2-acc-caret" viewBox="0 0 24 24" aria-hidden>
          <path d="M7 10l5 5 5-5" />
        </svg>
      </button>

      <div
        id={panelId}
        className="nx2-acc-body"
        ref={bodyRef}
        style={{
          maxHeight: height,
          transition: prefersReduced ? "none" : "max-height .28s ease",
        }}
        aria-labelledby={btnId}
      >
        <div className="nx2-acc-content">{children}</div>
      </div>
    </section>
  );
}

/* ========== Keyboard Navigation (↑ ↓ Home End) ========== */
function handleListKeyDown(e) {
  const isHeader = e.target && e.target.matches?.(".nx2-acc-head");
  if (!isHeader) return;

  const headers = Array.from(document.querySelectorAll(".nx2-acc-head"));
  const idx = headers.indexOf(e.target);
  if (idx === -1) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    headers[Math.min(idx + 1, headers.length - 1)]?.focus();
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    headers[Math.max(idx - 1, 0)]?.focus();
  } else if (e.key === "Home") {
    e.preventDefault();
    headers[0]?.focus();
  } else if (e.key === "End") {
    e.preventDefault();
    headers[headers.length - 1]?.focus();
  }
}

/* ========== Parser ==========
   Top-Level = ^\d+ … (z. B. "1. Title")
   Sub-Level = ^\d+\.\d+ … (z. B. "1.1 Subtitle") */
function parseByNumbers(raw) {
  const text = String(raw ?? "").replace(/\r\n/g, "\n");
  const lines = text.split("\n");

  const topRe = /^\s*(\d+)(?:[.)-])?\s+(.*\S)\s*$/;          // 1 Title / 1. Title / 1) Title
  const subRe = /^\s*(\d+)\.(\d+)(?:[.)-])?\s+(.*\S)\s*$/;   // 1.1 Subtitle / 2.3) Subtitle

  const sections = [];
  let current = null;
  let list = null;
  const buf = [];

  const flushBuf = () => {
    if (!buf.length) return;
    const txt = buf.join(" ").trim();
    if (txt) current.blocks.push({ type: "p", text: txt });
    buf.length = 0;
  };

  for (let rawLine of lines) {
    const line = rawLine.replace(/\t/g, " ").trim();

    if (!line) { flushBuf(); list = null; continue; }

    // Sub-Heading zuerst prüfen (damit 1.1 nicht als 1. greift)
    let m = line.match(subRe);
    if (m) {
      if (!current) { current = { title: `${m[1]}`, blocks: [] }; sections.push(current); }
      flushBuf();
      current.blocks.push({ type: "subhead", text: line });
      list = null;
      continue;
    }

    // Top-Heading
    m = line.match(topRe);
    if (m) {
      flushBuf();
      current = { title: line, blocks: [] };
      sections.push(current);
      list = null;
      continue;
    }

    // Listenpunkte
    if (/^[-*•]\s+/.test(line)) {
      flushBuf();
      if (!list) {
        list = { type: "ul", items: [] };
        if (!current) { current = { title: "Allgemeines", blocks: [] }; sections.push(current); }
        current.blocks.push(list);
      }
      list.items.push(line.replace(/^[-*•]\s+/, ""));
      continue;
    }

    // normaler Absatz
    if (!current) { current = { title: "Allgemeines", blocks: [] }; sections.push(current); }
    buf.push(line);
  }
  flushBuf();
  return sections;
}

/* ========== Inline-Renderer ==========
   - **bold** im Fließtext (grau)
   - "Label: Text" => Label fett (Sterne im Label entfernt)
   - **Teilfett** in Überschriften bleibt fett (weiß) */
function stripMDStrong(s) {
  return String(s).replace(/\*\*(.*?)\*\*/g, "$1");
}
function renderInline(text) {
  const s = String(text);
  const m = s.match(/^([^:\n]{1,80}):\s*(.+)$/);
  if (m) {
    const clean = stripMDStrong(m[1]);
    return (
      <>
        <strong>{clean}:</strong> {renderInline(m[2])}
      </>
    );
  }
  const parts = s.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p)
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}
function renderHeadingInline(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return parts.map((p, i) =>
    /^\*\*[^*]+\*\*$/.test(p)
      ? <strong key={i} className="nx2-head-strong">{p.slice(2, -2)}</strong>
      : <React.Fragment key={i}>{p}</React.Fragment>
  );
}

/* ========== Utility Hooks / Icons / Helpers ========== */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setPrefers(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return prefers;
}

function IconUser() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function formatCurrency(v){
  try { return new Intl.NumberFormat("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(v)||0); }
  catch { return `${v}`; }
}
function routeSafe(name, fallback){
  try { if (typeof route === "function") return route(name); } catch {}
  return fallback;
}

/* ========== Theme / Styles ========== */
const THEME_CSS = `
:root{
  --h-header:72px;
  --bg:#0a0a0a; --panel:#101010; --muted:#141414; --stroke:#222;
  --text:#eaeaea; --text-dim:#bdbdbd; --gold:#d4af37; --gold-soft:#f6e27a;
  --radius-sm:12px; --radius:16px; --radius-lg:22px;
  --shadow:0 10px 40px rgba(0,0,0,.6);
}
*{box-sizing:border-box}

/* nur Body scrollt (kein Doppel-Scroll) */
html, body { margin:0; padding:0; overflow-x:hidden; overflow-y:auto; }
#app{
  display:block !important;
  height:auto !important;
  min-height:0 !important;
  overflow:visible !important;
}

/* Background */
body{
  background:
    radial-gradient(1200px 800px at 15% -12%, rgba(212,175,55,.12), transparent 40%),
    radial-gradient(1000px 600px at 85% -12%, rgba(246,226,122,.06), transparent 45%),
    var(--bg);
  color:var(--text);
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
}

/* Layout: Sticky Footer ohne Leerscroll */
.nx2-app{ min-height:100svh; display:flex; flex-direction:column; }
.nx2-page{ flex:1 1 auto; display:flex; flex-direction:column; min-height:0; width:100%; margin:0 auto; padding:0 clamp(8px,2vw,20px) }
.nx2-main{ flex:1 1 auto; display:flex; flex-direction:column; min-height:0; }
.nx2-footer{ margin-top:auto; }
.nx2-page, .nx2-main { overflow:visible !important; }

/* Header */
.nx2-header{ position:sticky; top:0; z-index:38; background:rgba(10,10,10,.75); backdrop-filter:blur(10px); border-bottom:1px solid rgba(255,255,255,.06) }
.nx2-header-row{ height:var(--h-header); display:grid; grid-template-columns:auto 1fr auto; gap:12px; align-items:center; padding:0 6px }
.nx2-logo{ font-weight:900; font-size:22px; letter-spacing:.4px; color:var(--text); text-transform:uppercase; text-decoration:none }
.nx2-logo span{ color:var(--gold) }
.nx2-nav{ display:none; gap:14px }
@media (min-width:1100px){ .nx2-nav{ display:flex } }
.nx2-nav a{ color:var(--text-dim); padding:10px 12px; border-radius:10px; text-decoration:none }
.nx2-nav a:hover{ color:var(--text); background:#151515 }
.nx2-actions{ display:flex; gap:10px; align-items:center; justify-self:end }

/* Buttons / Avatar */
.nx2-btn{ height:42px; padding:0 16px; border-radius:12px; display:inline-flex; align-items:center; gap:10px; border:1px solid transparent; text-decoration:none; font-weight:700; color:var(--text) }
.nx2-btn-gold{ background:linear-gradient(180deg,#f1d573,#d4af37); color:#1b1b1b; border:none; box-shadow:0 2px 18px rgba(212,175,55,.35) }
.nx2-btn-gold:hover{ filter:brightness(1.05) }
.nx2-avatar{ width:36px; height:36px; border-radius:12px; background:#1d1d1d; display:grid; place-items:center; font-weight:800; color:var(--gold); border:1px solid #2a2a2a }
.nx2-balance-pill{ display:inline-flex; gap:8px; align-items:center; height:40px; padding:0 12px; border-radius:999px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); color:var(--gold) }
.nx2-coin{ width:18px; height:18px; fill:none; stroke:var(--gold); stroke-width:2 }

/* Mobile Header: iPhone SE etc. */
@media (max-width: 400px){
  .nx2-balance-pill{ display:none; }
  .nx2-btn{ height:36px; padding:0 12px; }
  .nx2-avatar{ width:32px; height:32px; border-radius:10px; }
}

/* Page Title */
.nx2-page-title{
  max-width: 1000px;
  margin: 16px auto 10px;
  padding: 0 clamp(8px,2vw,20px);
  text-align: center;
}
.nx2-title-h1{
  position: relative;
  display: inline-block;
  font-size: clamp(26px,3.2vw,34px);
  font-weight: 900;
  letter-spacing: .3px;
  color: var(--gold);
  margin: 0;
  padding-bottom: 10px;
}
.nx2-title-h1::after{
  content:"";
  position:absolute; left:50%; transform:translateX(-50%);
  bottom:-4px; height:4px; width:88px; border-radius:999px;
  background: linear-gradient(180deg,#f1d573,#d4af37);
  opacity:.9;
}

/* Document */
.nx2-doc{ max-width:1000px; margin:16px auto; padding:0 }
.nx2-h2{ font-size:22px; line-height:1.25; color:var(--text); font-weight:900 }
.nx2-h3{ font-size:18px; line-height:1.25; color:var(--text); font-weight:900 }
.nx2-doc p, .nx2-doc li{ color:var(--text-dim); line-height:1.7 }
.nx2-ul{ padding-left:20px; margin:8px 0 }
.nx2-doc p strong, .nx2-doc li strong{ color:#d0d0d0; font-weight:800 }

/* Accordion */
.nx2-acc{ border:1px solid #2a2a2a; background:#0f0f0f; border-radius:14px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,.35); margin:10px 0 }
.nx2-acc-head{
  width:100%; display:grid; grid-template-columns:1fr 24px; align-items:center;
  gap:8px; padding:12px 14px; background:linear-gradient(180deg,#111,#0f0f0f); border:none; text-align:left;
}
.nx2-acc-caret{ width:20px; height:20px; fill:none; stroke:#bbb; stroke-width:2; transition:transform .2s }
.nx2-acc.open .nx2-acc-caret{ transform:rotate(180deg) }
.nx2-acc-body{ max-height:0px; overflow:hidden; }
@media (prefers-reduced-motion: no-preference){
  .nx2-acc-body{ transition:max-height .28s ease; }
}
.nx2-acc-content{ padding:8px 14px 16px }

/* Footer */
.nx2-footer{ border-top:1px solid rgba(255,255,255,.08); background:#0d0d0d; padding:26px 8px }
.nx2-footer-grid{ display:grid; gap:16px; grid-template-columns:1fr; align-items:center; text-align:center }
.nx2-footer-brand p{ color:var(--text-dim); margin-top:6px }
.nx2-footer-links{ display:flex !important; flex-wrap:wrap; justify-content:center; gap:14px }
.nx2-footer-links > a{ display:inline-block; padding:6px 10px; border-radius:8px; color:var(--text-dim); text-decoration:none }
@media (min-width:900px){
  .nx2-footer-grid{ grid-template-columns:1fr auto; text-align:left }
  .nx2-footer-links{ justify-content:flex-end; gap:18px }
}
`;
