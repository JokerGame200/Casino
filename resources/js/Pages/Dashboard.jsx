import React from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

const categories = [
  { key: 'top', label: 'Top' },
  { key: 'new', label: 'Neu' },
  { key: 'recommended', label: 'Empfohlen' },
  { key: 'jackpots', label: 'Bonumsumsatz' },
  { key: 'crypto', label: 'Crypto Games' },
];

const games = [
  { id: 1, title: 'Miner’s Fortune', provider: 'Lucky Labs', tag: 'Top', img: '/images/games/miners-fortune.jpg' },
  { id: 2, title: 'Coin Flip 2', provider: 'NeoSlot', tag: 'Top', img: '/images/games/coinflip-2.jpg' },
  { id: 3, title: 'Sticky Lips', provider: 'RetroSpin', tag: 'Neu', img: '/images/games/sticky-lips.jpg' },
  { id: 4, title: 'Power Gems', provider: 'NeonSoft', tag: 'Neu', img: '/images/games/power-gems.jpg' },
  { id: 5, title: 'Blue Tuna Bonanza', provider: 'OceanPlay', tag: 'Empfohlen', img: '/images/games/blue-tuna.jpg' },
  { id: 6, title: '16 Coins', provider: 'Gold Rush', tag: 'Empfohlen', img: '/images/games/16-coins.jpg' },
  { id: 7, title: 'Dice Invaders', provider: 'Arcadia', tag: 'Crypto', img: '/images/games/dice-invaders.jpg' },
  { id: 8, title: 'Lucky Hot Coins', provider: 'HotSpin', tag: 'Crypto', img: '/images/games/lucky-hot-coins.jpg' },
];

const promos = [
  { id: 'p1', title: '100% Bonus bis zu 1.000 € + 100 Freispiele', cta: 'Registrieren', colorFrom: 'from-purple-700', colorTo: 'to-fuchsia-600' },
  { id: 'p2', title: '200% Bonus bis zu 1.000 €', cta: 'Bonus sichern', colorFrom: 'from-amber-600', colorTo: 'to-rose-600' },
  { id: 'p3', title: 'Tägliche Drops & Wins', cta: 'Mehr erfahren', colorFrom: 'from-cyan-600', colorTo: 'to-indigo-700' },
];

const payments = ['VISA','Mastercard','Skrill','Neteller','Bitcoin','Ethereum','Tether','Apple Pay','Google Pay'];

function SectionTitle({ children, action }){
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl md:text-2xl font-bold text-white">{children}</h3>
      {action}
    </div>
  );
}

function GameCard({ game }){
  return (
    <a href="#" className="group bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-yellow-400 transition">
      <div className="aspect-[4/5] bg-gradient-to-b from-zinc-800 to-zinc-900 flex items-center justify-center">
        <span className="text-zinc-500 text-sm">Bildplatzhalter</span>
      </div>
      <div className="p-3">
        <div className="text-sm text-zinc-400">{game.provider}</div>
        <div className="font-semibold text-white group-hover:text-yellow-300 truncate">{game.title}</div>
      </div>
    </a>
  );
}

export default function Dashboard({ isEmailVerified }) {
  return (
    <AuthenticatedLayout
      header={
        <div className="flex items-center gap-3">
          <img src="/logo1.png" alt="next2win" className="h-10 w-auto" />
          <h2 className="text-xl font-semibold leading-tight text-white">Dashboard</h2>
        </div>
      }
    >
      <Head title="next2win – Home" />

      {!isEmailVerified && (
        <div className="mx-auto max-w-7xl px-4">
          <div className="bg-yellow-500/10 border border-yellow-600 text-yellow-300 px-4 py-3 rounded-xl mt-4">
            Bitte bestätige deine E-Mail, um Boni zu erhalten.
          </div>
        </div>
      )}

      <div className="py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Promos */}
          <div className="grid md:grid-cols-3 gap-4">
            {promos.map(p => (
              <div key={p.id} className={`rounded-2xl p-5 md:p-6 bg-gradient-to-br ${p.colorFrom} ${p.colorTo} relative overflow-hidden`}>
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-black/10" />
                <div className="text-sm uppercase tracking-widest text-white/80 mb-1">Aktion</div>
                <div className="text-white text-lg md:text-xl font-bold leading-snug mb-4">{p.title}</div>
                <button className="inline-flex items-center gap-2 rounded-xl bg-black/30 hover:bg-black/40 text-white px-4 py-2 text-sm font-semibold">
                  {p.cta}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M13.5 4.5L21 12l-7.5 7.5-1.06-1.06L18.38 12l-5.94-5.94 1.06-1.06z"/>
                    <path d="M3 11.25h15v1.5H3z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Kategorien */}
          <div className="mt-8 flex flex-wrap items-center gap-2">
            <span className="text-zinc-400 mr-2">Kategorien:</span>
            {categories.map(c => (
              <button key={c.key} className="rounded-full border border-zinc-700 bg-black/30 hover:border-yellow-400 text-sm text-white/90 px-4 py-1.5">
                {c.label}
              </button>
            ))}
            <button className="ml-auto rounded-full bg-black/30 border border-zinc-700 text-sm text-white/90 px-3 py-1.5">Alle</button>
          </div>

          {/* Top */}
          <div className="mt-6">
            <SectionTitle action={<a href="#" className="text-yellow-300 text-sm hover:underline">Zeige alles</a>}>Top 🔥</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {games.slice(0, 6).map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </div>

          {/* Neu */}
          <div className="mt-10">
            <SectionTitle action={<a href="#" className="text-yellow-300 text-sm hover:underline">Zeige alles</a>}>Neu ✨</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {games.slice(2, 8).map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </div>

          {/* Aktionen */}
          <div className="mt-10">
            <SectionTitle>Aktionen</SectionTitle>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-700 to-fuchsia-600">
                <div className="text-white text-lg font-bold mb-2">100% Bonus + 100 FS</div>
                <p className="text-white/80 mb-4 text-sm">Erhalte 100% Bonus bis zu 1.000 € und 100 Freispiele.</p>
                <button className="rounded-xl bg-black/30 hover:bg-black/40 text-white px-4 py-2 text-sm font-semibold">Bedingungen einsehen</button>
              </div>
              <div className="rounded-2xl p-6 bg-gradient-to-br from-amber-600 to-rose-600">
                <div className="text-white text-lg font-bold mb-2">200% Bonus</div>
                <p className="text-white/80 mb-4 text-sm">Verdopple deine Einzahlung bis zu 1.000 €.</p>
                <button className="rounded-xl bg-black/30 hover:bg-black/40 text-white px-4 py-2 text-sm font-semibold">Bedingungen einsehen</button>
              </div>
            </div>
          </div>

          {/* Crypto */}
          <div className="mt-10">
            <SectionTitle action={<a href="#" className="text-yellow-300 text-sm hover:underline">Zeige alles</a>}>Crypto Games ₿</SectionTitle>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {games.slice(4, 10).map(g => <GameCard key={g.id} game={g} />)}
            </div>
          </div>

          {/* Textblock */}
          <div className="mt-12 bg-black/40 border border-zinc-800 rounded-2xl p-6">
            <h4 className="text-white text-lg font-bold mb-2">next2win – Online Casino</h4>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Spiele verantwortungsvoll. next2win bietet Slots, Tischspiele und Krypto-Titel für Spieler in ausgewählten Regionen.
              Prüfe stets die lokalen Gesetze. Bonusbedingungen gelten. 18+.
            </p>
          </div>

          {/* Footer */}
          <footer className="mt-10 pb-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl p-6 bg-black/40 border border-zinc-800">
                <div className="text-white font-semibold mb-3">Zahlungsmethoden</div>
                <div className="flex flex-wrap gap-2">
                  {payments.map(p => (
                    <span key={p} className="px-3 py-1 text-sm rounded-lg bg-black/50 border border-zinc-800 text-zinc-300">{p}</span>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl p-6 bg-black/40 border border-zinc-800">
                <div className="text-white font-semibold mb-3">Zertifikate & Schutz</div>
                <div className="text-zinc-400 text-sm">SSL • Fair Play • RNG-geprüft • Responsible Gaming</div>
              </div>
            </div>
            <div className="mt-6 text-xs text-zinc-400">
              © {new Date().getFullYear()} next2win. Alle Rechte vorbehalten.
            </div>
          </footer>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
