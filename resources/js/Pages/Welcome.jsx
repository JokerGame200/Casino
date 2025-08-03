import React from "react";
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1b1b1b] via-[#2b2b2b] to-[#111] text-white">
                {/* Header */}
                <header className="w-full flex flex-col items-center pt-12">
                    <img src="/logo1.png" alt="Logo" className="h-32 mb-4" />
                    <h1 className="text-3xl font-bold drop-shadow-lg mb-3">Willkommen auf next2win</h1>
                    <p className="text-lg text-gray-300 mb-6 text-center max-w-xl">Das ultimative Casino-Erlebnis – registrieren Sie sich jetzt kostenlos!</p>
                    <div className="flex gap-4 mb-4">
                        {auth.user ? (
                            <Link href={route('dashboard')} className="bg-yellow-400 text-black rounded-lg px-5 py-2 font-semibold shadow hover:bg-yellow-500 transition">Dashboard</Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="bg-yellow-400 text-black rounded-lg px-5 py-2 font-semibold shadow hover:bg-yellow-500 transition">Login</Link>
                                <Link href={route('register')} className="bg-gray-900 border border-yellow-400 text-yellow-400 rounded-lg px-5 py-2 font-semibold shadow hover:bg-yellow-500 hover:text-black transition">Registrieren</Link>
                            </>
                        )}
                    </div>
                </header>

                {/* Main Section */}
                <main className="w-full max-w-2xl bg-black/50 rounded-2xl shadow-2xl p-8 mt-6 flex flex-col items-center">
                    <h2 className="text-2xl font-semibold mb-4">Spiele jetzt und gewinne!</h2>
                    <p className="text-gray-300 mb-6 text-center">Entdecke spannende Automatenspiele, sichere Zahlungen und beste Gewinnchancen. Trete unserer Community bei und starte dein nächstes Spielabenteuer!</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
                        <a href="/ueber-uns" className="block rounded-xl bg-zinc-900 border border-zinc-700 p-6 shadow-lg hover:border-yellow-400 transition group">
                        <div className="w-full flex justify-center mb-4">
                            <span className="inline-block min-w-[40%] px-8 py-2 text-2xl font-bold tracking-wide text-center rounded-md border border-yellow-400 bg-black text-yellow-400 drop-shadow group-hover:bg-yellow-400 group-hover:text-black transition-all duration-150">
                            ÜBER UNS
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed text-center">
                            Erfahre mehr über next2win, unser Team und warum wir auf faires, modernes Glücksspiel setzen.
                        </p>
                        </a>

                        <a href="/spiele" className="block rounded-xl bg-zinc-900 border border-zinc-700 p-6 shadow-lg hover:border-yellow-400 transition group">
                        <div className="w-full flex justify-center mb-4">
                            <span className="inline-block min-w-[40%] px-8 py-2 text-2xl font-bold tracking-wide text-center rounded-md border border-yellow-400 bg-black text-yellow-400 drop-shadow group-hover:bg-yellow-400 group-hover:text-black transition-all duration-150">
                            SPIELE ENTDECKEN
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed text-center">
                            Probiere unsere beliebtesten Games direkt aus.
                        </p>
                        </a>

                        <a href={route('register')} className="block rounded-xl bg-zinc-900 border border-zinc-700 p-6 shadow-lg hover:border-yellow-400 transition group">
                        <div className="w-full flex justify-center mb-4">
                            <span className="inline-block min-w-[40%] px-8 py-2 text-2xl font-bold tracking-wide text-center rounded-md border border-yellow-400 bg-black text-yellow-400 drop-shadow group-hover:bg-yellow-400 group-hover:text-black transition-all duration-150">
                            BONUS SICHERN
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed text-center">
                            Jetzt Freispiele zum Start erhalten!
                        </p>
                        </a>

                        <a href="/support" className="block rounded-xl bg-zinc-900 border border-zinc-700 p-6 shadow-lg hover:border-yellow-400 transition group">
                        <div className="w-full flex justify-center mb-4">
                            <span className="inline-block min-w-[40%] px-8 py-2 text-2xl font-bold tracking-wide text-center rounded-md border border-yellow-400 bg-black text-yellow-400 drop-shadow group-hover:bg-yellow-400 group-hover:text-black transition-all duration-150">
                            SUPPORT
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed text-center">
                            24/7 Hilfe und FAQ für alle Fragen.
                        </p>
                        </a>
                    </div>
                </main>

                {/* Footer */}
                <footer className="mt-12 mb-2 text-gray-500 text-xs text-center">
                    &copy; {new Date().getFullYear()} next2win – Alle Rechte vorbehalten. | <Link href="/impressum" className="text-yellow-400 hover:underline">Impressum</Link> | <Link href="/datenschutz" className="text-yellow-400 hover:underline">Datenschutz</Link>
                </footer>
            </div>
        </>
    );
}
