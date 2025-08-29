import React, { useEffect, useRef, useState, useLayoutEffect, useId } from "react";

/**
 * Next2Win — FAQ.jsx
 * - Compact Q&A with collapsible answers (Accordion)
 * - Short answers, many questions
 * - Same gold/black theme + header/footer as other pages
 */

export default function FAQ({ auth = null }) {
  // Theme einmal injizieren + Titel setzen
  useEffect(() => {
    const id = "nx2-gold-theme-v44";
    if (!document.getElementById(id)) {
      const styleTag = document.createElement("style");
      styleTag.id = id;
      styleTag.innerHTML = THEME_CSS;
      document.head.appendChild(styleTag);
    }
    try { document.title = "FAQ"; } catch {}
    if (!location.hash) {
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" })));
    }
  }, []);

  const username = auth?.user?.name || null;
  const balance  = auth?.user?.balance ?? 0;

  const faqs = [
    { q: "How do I create an account?", a: "Click Register, fill in your details, confirm your email, and you’re good to go." },
    { q: "Do I need to verify my identity (KYC)?", a: "Yes, we may ask for KYC before withdrawals to keep accounts safe and compliant." },
    { q: "Which deposit methods are available?", a: "Cards, e-wallets, bank transfer, and selected cryptocurrencies (availability depends on region)." },
    { q: "What’s the minimum deposit?", a: "Typically €10–€20, depending on your chosen payment method." },
    { q: "How do I request a withdrawal?", a: "Open Wallet → Withdraw, pick your method, enter the amount, and submit." },
    { q: "How long do withdrawals take?", a: "We aim to process quickly; e-wallets are fastest, banks/cards may take a few business days." },
    { q: "Is there a minimum withdrawal?", a: "Yes, a small minimum applies (e.g., €25); limits can vary by method." },
    { q: "Are there withdrawal fees?", a: "Most methods are fee-free on our side; your provider may charge its own fees." },
    { q: "Do you offer a welcome bonus?", a: "Yes. Check Promotions for current offers and full terms." },
    { q: "What about wagering requirements?", a: "Bonuses usually require wagering before cashout—see each bonus’s rules for details." },
    { q: "Do all games contribute to wagering?", a: "No. Slots usually contribute more than table or live games—see bonus terms." },
    { q: "Can I cancel an active bonus?", a: "Yes, but bonus funds and related winnings will be removed when cancelled." },
    { q: "How can I set deposit or loss limits?", a: "Go to Responsible Gaming in your account to set daily, weekly, or monthly limits." },
    { q: "Can I self-exclude?", a: "Yes. Choose a time-out or self-exclusion period to block access during that time." },
    { q: "Is Next2Win mobile friendly?", a: "Absolutely. Use your device’s browser—no app required." },
    { q: "Which currencies are supported?", a: "EUR is standard; other options may be available depending on region and payment method." },
    { q: "Are games fair and random?", a: "Yes. Games use certified RNGs and are provided by reputable studios." },
    { q: "What happens if my game disconnects?", a: "Your round result is preserved by the provider. Reopen the game to continue." },
    { q: "Can I have more than one account?", a: "No. Multiple accounts are not allowed and may be closed." },
    { q: "How do I change my personal details?", a: "Update them in Profile; support may request documents for certain changes." },
    { q: "How do I close my account?", a: "Contact support or use Responsible Gaming to request closure or long self-exclusion." },
    { q: "How can I contact support?", a: "Use live chat on the site or email our help team; we’re here 24/7." },
  ];

  return (
    <div className="nx2-app">
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
                <div className="nx2-balance-pill" title="Total Balance">
                  <svg aria-hidden viewBox="0 0 24 24" className="nx2-coin"><circle cx="12" cy="12" r="10" /></svg>
                  <span className="nx2-balance">{formatCurrency(balance)} EUR</span>
                </div>

                {username ? (
                  <>
                    <a className="nx2-btn nx2-btn-gold" href={routeSafe("wallet.deposit", "#")}>Deposit</a>
                    <div className="nx2-avatar" title={username} aria-label={username}>
                      {username.slice(0, 1).toUpperCase()}
                    </div>
                  </>
                ) : (
                  <>
                    <a className="nx2-btn nx2-btn-ghost" href={routeSafe("login", "/login")}>Login</a>
                    <a className="nx2-btn nx2-btn-gold" href={routeSafe("register", "/register")}>Register</a>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ===== TITLE ===== */}
          <section className="nx2-page-title">
            <h1 className="nx2-title-h1">Frequently Asked Questions</h1>
          </section>

          {/* ===== FAQ (Accordion) ===== */}
          <article className="nx2-doc" onKeyDown={handleListKeyDown}>
            <div className="nx2-faq">
              {faqs.map((item, i) => (
                <Accordion key={i} title={item.q}>
                  <p>{item.a}</p>
                </Accordion>
              ))}
            </div>
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
                <a href={routeSafe("agb", "/Terms&Conditions")}>Terms and Conditions</a>
                <a href={routeSafe("page.privacy", "/privacy-policy")}>Privacy policy</a>
                <a href={routeSafe("page.faq", "/FAQ")}>FAQ</a>
                <a href={routeSafe("page.responsible", "/Safer-Gambling")}>Safer Gambling</a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

/* ========== Accordion (accessible + smooth) ========== */
function Accordion({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const bodyRef = useRef(null);
  const [height, setHeight] = useState("0px");
  const panelId = useId().replace(/:/g, "_");
  const btnId = `btn_${panelId}`;
  const prefersReduced = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    setHeight(open ? `${el.scrollHeight}px` : "0px");
  }, [open, children]);

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

  const toggle = () => {
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
      // height will be set by layout effect
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle();
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
        onClick={toggle}
        onKeyDown={onKeyDown}
        data-acc-toggle
      >
        <span className="nx2-headline">{title}</span>
        <svg className="nx2-acc-caret" viewBox="0 0 24 24" aria-hidden><path d="M7 10l5 5 5-5" /></svg>
      </button>

      <div
        id={panelId}
        className="nx2-acc-body"
        ref={bodyRef}
        style={{ maxHeight: height, transition: prefersReduced ? "none" : "max-height .28s ease" }}
        aria-labelledby={btnId}
      >
        <div className="nx2-acc-content">
          {children}
        </div>
      </div>
    </section>
  );
}

/* Keyboard nav between accordion headers (↑ ↓ Home End) */
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

/* ========== Helpers ========== */
function formatCurrency(v){
  try { return new Intl.NumberFormat("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2}).format(Number(v)||0); }
  catch { return `${v}`; }
}
function routeSafe(name, fallback){
  try { if (typeof route === "function") return route(name); } catch {}
  return fallback;
}

/* ========== Theme / Styles (identisch zu anderen Seiten) ========== */
const THEME_CSS = `
:root{
  --h-header:72px;
  --bg:#0a0a0a; --panel:#101010; --muted:#141414; --stroke:#222;
  --text:#eaeaea; --text-dim:#bdbdbd; --gold:#d4af37; --gold-soft:#f6e27a;
  --radius-sm:12px; --radius:16px; --radius-lg:22px;
  --shadow:0 10px 40px rgba(0,0,0,.6);
}
*{box-sizing:border-box}
html, body { margin:0; padding:0; overflow-x:hidden; overflow-y:auto; }
#app{ display:block !important; height:auto !important; min-height:0 !important; overflow:visible !important; }

body{
  background:
    radial-gradient(1200px 800px at 15% -12%, rgba(212,175,55,.12), transparent 40%),
    radial-gradient(1000px 600px at 85% -12%, rgba(246,226,122,.06), transparent 45%),
    var(--bg);
  color:var(--text);
  -webkit-font-smoothing:antialiased; -moz-osx-font-smoothing:grayscale;
}

/* Layout */
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
.nx2-btn{ height:42px; padding:0 16px; border-radius:12px; display:inline-flex; align-items:center; gap:10px; border:1px solid transparent; text-decoration:none; font-weight:700; color:var(--text) }
.nx2-btn-gold{ background:linear-gradient(180deg,#f1d573,#d4af37); color:#1b1b1b; border:none; box-shadow:0 2px 18px rgba(212,175,55,.35) }
.nx2-btn-gold:hover{ filter:brightness(1.05) }
.nx2-btn-ghost{ background:transparent; border:1px solid var(--gold); color:var(--gold); }
.nx2-avatar{ width:36px; height:36px; border-radius:12px; background:#1d1d1d; display:grid; place-items:center; font-weight:800; color:var(--gold); border:1px solid #2a2a2a }
.nx2-balance-pill{ display:inline-flex; gap:8px; align-items:center; height:40px; padding:0 12px; border-radius:999px; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); color:var(--gold) }
.nx2-coin{ width:18px; height:18px; fill:none; stroke:var(--gold); stroke-width:2 }

/* Page Title */
.nx2-page-title{ max-width: 1000px; margin: 16px auto 10px; padding: 0 clamp(8px,2vw,20px); text-align: center; }
.nx2-title-h1{
  position: relative; display: inline-block; font-size: clamp(26px,3.2vw,34px);
  font-weight: 900; letter-spacing: .3px; color: var(--gold); margin: 0; padding-bottom: 10px;
}
.nx2-title-h1::after{
  content:""; position:absolute; left:50%; transform:translateX(-50%);
  bottom:-4px; height:4px; width:88px; border-radius:999px;
  background: linear-gradient(180deg,#f1d573,#d4af37); opacity:.9;
}

/* Document + Accordion */
.nx2-doc{ max-width:1000px; margin:16px auto; padding:0 }
.nx2-h2{ font-size:22px; line-height:1.25; color:var(--text); font-weight:900 }
.nx2-doc p, .nx2-doc li{ color:var(--text-dim); line-height:1.7 }
.nx2-acc{ border:1px solid #2a2a2a; background:#0f0f0f; border-radius:14px; overflow:hidden; box-shadow:0 10px 40px rgba(0,0,0,.35); margin:10px 0 }
.nx2-acc-head{
  width:100%; display:grid; grid-template-columns:1fr 24px; align-items:center;
  gap:8px; padding:12px 14px; background:linear-gradient(180deg,#111,#0f0f0f); border:none; text-align:left;
}
.nx2-acc-caret{ width:20px; height:20px; fill:none; stroke:#bbb; stroke-width:2; transition:transform .2s }
.nx2-acc.open .nx2-acc-caret{ transform:rotate(180deg) }
.nx2-acc-body{ max-height:0px; overflow:hidden; }
@media (prefers-reduced-motion: no-preference){ .nx2-acc-body{ transition:max-height .28s ease; } }
.nx2-acc-content{ padding:8px 14px 14px }

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
