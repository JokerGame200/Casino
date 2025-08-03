import React from "react";
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <>
            <Head title="Login" />
            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1b1b1b] via-[#2b2b2b] to-[#111] text-white">
                {/* Header */}
                <header className="w-full flex flex-col items-center pt-12">
                    <img src="/logo1.png" alt="Logo" className="h-32 mb-4" />
                    <h1 className="text-3xl font-bold drop-shadow-lg mb-3">Willkommen zurück!</h1>
                    <p className="text-lg text-gray-300 mb-6 text-center max-w-xl">Melde dich bei <span className='text-yellow-400 font-semibold'>next2win</span> an und erlebe das volle Casino-Erlebnis!</p>
                </header>

                <main className="w-full max-w-md bg-black/50 rounded-2xl shadow-2xl p-8 mt-6 flex flex-col items-center">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-500 text-center">
                            {status}
                        </div>
                    )}
                    <form onSubmit={submit} className="w-full space-y-5">
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-gray-200" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white"
                                autoComplete="username"
                                isFocused={true}
                                onChange={e => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="password" value="Passwort" className="text-gray-200" />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white"
                                autoComplete="current-password"
                                onChange={e => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                />
                                <span className="ms-2 text-sm text-gray-400">Angemeldet bleiben</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-yellow-400 hover:underline"
                                >
                                    Passwort vergessen?
                                </Link>
                            )}
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <Link
                                href={route('register')}
                                className="text-sm text-gray-300 hover:text-yellow-400 underline"
                            >
                                Noch kein Account?
                            </Link>
                            <PrimaryButton className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg shadow-lg transition-all" disabled={processing}>
                                Login
                            </PrimaryButton>
                        </div>
                    </form>
                </main>
                {/* Optional: Footer analog Welcome.jsx */}
                <footer className="mt-12 mb-2 text-gray-500 text-xs text-center">
                    &copy; {new Date().getFullYear()} next2win – Alle Rechte vorbehalten. | <Link href="/impressum" className="text-yellow-400 hover:underline">Impressum</Link> | <Link href="/datenschutz" className="text-yellow-400 hover:underline">Datenschutz</Link>
                </footer>
            </div>
        </>
    );
}
