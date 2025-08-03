import React from "react";
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Registrieren" />
            <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#1b1b1b] via-[#2b2b2b] to-[#111] text-white">
                {/* Header */}
                <header className="w-full flex flex-col items-center pt-12">
                    <img src="/logo1.png" alt="Logo" className="h-32 mb-4" />
                    <h1 className="text-3xl font-bold drop-shadow-lg mb-3">Jetzt registrieren!</h1>
                    <p className="text-lg text-gray-300 mb-6 text-center max-w-xl">
                        Erstelle kostenlos einen <span className='text-yellow-400 font-semibold'>next2win</span>-Account und sichere dir den Willkommensbonus!
                    </p>
                </header>

                <main className="w-full max-w-md bg-black/50 rounded-2xl shadow-2xl p-8 mt-6 flex flex-col items-center">
                    <form onSubmit={submit} className="w-full space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Name" className="text-gray-200" />
                            <TextInput
                                id="name"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white"
                                autoComplete="name"
                                isFocused={true}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="email" value="Email" className="text-gray-200" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
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
                                autoComplete="new-password"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Passwort bestätigen" className="text-gray-200" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full bg-zinc-900 border-zinc-700 text-white"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>
                        <div className="flex items-center justify-between mt-6">
                            <Link
                                href={route('login')}
                                className="text-sm text-gray-300 hover:text-yellow-400 underline"
                            >
                                Bereits registriert?
                            </Link>
                            <PrimaryButton className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg shadow-lg transition-all" disabled={processing}>
                                Registrieren
                            </PrimaryButton>
                        </div>
                    </form>
                </main>
                <footer className="mt-12 mb-2 text-gray-500 text-xs text-center">
                    &copy; {new Date().getFullYear()} next2win – Alle Rechte vorbehalten. | <Link href="/impressum" className="text-yellow-400 hover:underline">Impressum</Link> | <Link href="/datenschutz" className="text-yellow-400 hover:underline">Datenschutz</Link>
                </footer>
            </div>
        </>
    );
}
