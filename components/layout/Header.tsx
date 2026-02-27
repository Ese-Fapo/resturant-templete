"use client"

import React, { useState } from 'react'
import { AuthStatus } from './AuthStatus';
import { useSession } from 'next-auth/react';

import Link from 'next/link'
import { IoIosLogIn } from "react-icons/io";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";




const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-lg shadow-lg px-2 sm:px-4 md:px-8 border-b border-lime-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-2 sm:py-3 md:py-5">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-3xl md:text-4xl font-extrabold tracking-tight bg-linear-to-r from-emerald-500 via-lime-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-200"
        >
          <span role="img" aria-label="pizza" className="text-4xl md:text-5xl">🍕</span>
          Nossa Pizza
        </Link>
        <nav
          className={`flex-col md:flex-row md:flex items-center gap-6 md:gap-10 text-gray-700 font-semibold text-base md:text-lg fixed md:static top-0 right-0 h-full w-4/5 sm:w-2/3 md:w-auto max-w-xs md:max-w-none bg-white/95 shadow-2xl md:shadow-none z-40 p-8 sm:p-10 md:p-0 transition-transform duration-300 ease-in-out ${menuOpen ? 'flex translate-x-0' : 'hidden md:flex translate-x-full md:translate-x-0'}`}
        >
          <Link href="/" className="w-full md:w-auto text-center hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setMenuOpen(false)}>Início</Link>
          <Link href="#" className="w-full md:w-auto text-center hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setMenuOpen(false)}>Cardápio</Link>
          <Link href="#" className="w-full md:w-auto text-center hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setMenuOpen(false)}>Sobre nós</Link>
          <Link href="#" className="w-full md:w-auto text-center hover:text-emerald-600 transition-colors px-3 py-2 rounded-lg hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-300" onClick={() => setMenuOpen(false)}>Contato</Link>
          {/* Auth status: show logout/greeting if logged in, else show register/login */}
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2 md:gap-4 items-center mt-4 md:mt-0">
            <AuthStatus />
            {/* Only show register/login if not authenticated */}
            {!session && (
              <div className="flex gap-2" id="auth-links">
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 border border-emerald-400 text-emerald-700 font-bold px-5 py-2 rounded-full bg-white hover:bg-emerald-100 hover:text-emerald-900 transition-all duration-200 shadow-sm md:ml-2 w-full md:w-auto"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrar
                  <MdOutlinePersonAddAlt1 className="text-xl" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-500 text-white px-6 py-2 shadow-lg border-2 border-white hover:border-rose-200 transition-all duration-200 font-bold text-base md:text-lg scale-105 hover:scale-110 drop-shadow-lg w-full md:w-auto"
                  onClick={() => setMenuOpen(false)}
                >
                  Entrar
                  <IoIosLogIn className="text-xl" />
                </Link>
              </div>
            )}
          </div>
        </nav>
        {/* Overlay for mobile menu */}
        {menuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Fechar menu"
          ></div>
        )}
      </div>
    </header>
      
  );
}


export default Header
