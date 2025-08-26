import React, { useState } from "react";
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
  const user = usePage().props.auth.user;
  const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

  return (
    <div className="min-h-screen text-white bg-[#0b0e13]">
      {/* Topbar */}
      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-[#0c1016]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0c1016]/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <Link href="/dashboard" className="inline-flex items-center gap-2 group">
                  <img src="/logo1.png" alt="next2win" className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" />
                </Link>
              </div>

              <div className="hidden space-x-6 sm:-my-px sm:ms-8 sm:flex">
                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                  <span className="text-gray-200 hover:text-emerald-400 transition">Home</span>
                </NavLink>
                <NavLink href="#" active={false}><span className="text-gray-200 hover:text-white transition">Casino</span></NavLink>
                <NavLink href="#" active={false}><span className="text-gray-200 hover:text-white transition">Live Casino</span></NavLink>
                <NavLink href="#" active={false}><span className="text-gray-200 hover:text-white transition">Sport</span></NavLink>
                <NavLink href="#" active={false}><span className="text-gray-200 hover:text-white transition">Promos</span></NavLink>
              </div>
            </div>

            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <div className="relative ms-3">
                <Dropdown>
                  <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-md border border-zinc-700 bg-black/30 px-3 py-2 text-sm font-medium leading-4 text-gray-200 transition hover:text-white hover:border-emerald-500 active:scale-[.98] focus:outline-none"
                      >
                        {user.name}
                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </span>
                  </Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                  </Dropdown.Content>
                </Dropdown>
              </div>
            </div>

            {/* Mobile Button */}
            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() => setShowingNavigationDropdown(prev => !prev)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-300 transition hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                  <path className={showingNavigationDropdown ? 'inline-flex' : 'hidden'} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
          <div className="space-y-1 pb-3 pt-2">
            <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
              <span className="text-gray-200">Home</span>
            </ResponsiveNavLink>
            <ResponsiveNavLink href="#"><span className="text-gray-200">Casino</span></ResponsiveNavLink>
            <ResponsiveNavLink href="#"><span className="text-gray-200">Live Casino</span></ResponsiveNavLink>
            <ResponsiveNavLink href="#"><span className="text-gray-200">Sport</span></ResponsiveNavLink>
            <ResponsiveNavLink href="#"><span className="text-gray-200">Promos</span></ResponsiveNavLink>
          </div>

          <div className="border-t border-zinc-800 pb-1 pt-4">
            <div className="px-4">
              <div className="text-base font-medium text-white">{user.name}</div>
              <div className="text-sm font-medium text-gray-300">{user.email}</div>
            </div>

            <div className="mt-3 space-y-1">
              <ResponsiveNavLink href={route('profile.edit')}><span className="text-gray-200">Profile</span></ResponsiveNavLink>
              <ResponsiveNavLink method="post" href={route('logout')} as="button"><span className="text-gray-200">Log Out</span></ResponsiveNavLink>
            </div>
          </div>
        </div>
      </nav>

      {/* Optionaler Header-Slot */}
      {header && (
        <header className="bg-transparent">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main className="pb-12">{children}</main>
    </div>
  );
}
