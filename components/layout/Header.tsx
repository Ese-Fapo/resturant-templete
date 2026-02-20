import React from 'react'
import Link from 'next/link'


const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur shadow-md px-4 md:px-12 border-b border-lime-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4">
        {/* Logo/Brand */}
        <Link
          className="flex items-center gap-2 text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-lime-400 to-amber-400 bg-clip-text text-transparent drop-shadow-lg hover:scale-105 transition-transform duration-200"
          href="#"
        >
          <span role="img" aria-label="pizza" className="text-4xl md:text-5xl">🍕</span>
          Nossa Pizza
        </Link>
        {/* Navigation */}
        <nav className="flex items-center gap-4 md:gap-10 text-gray-700 font-semibold text-base md:text-lg">
          <Link href="#" className="hover:text-emerald-600 transition-colors px-2 py-1 rounded-md hover:bg-emerald-50">Inicio</Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors px-2 py-1 rounded-md hover:bg-emerald-50">Nosso menu</Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors px-2 py-1 rounded-md hover:bg-emerald-50">Sobre nós</Link>
          <Link href="#" className="hover:text-emerald-600 transition-colors px-2 py-1 rounded-md hover:bg-emerald-50">Contato</Link>
          <Link href="#" className="rounded-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-rose-600 hover:to-red-500 text-white px-7 py-2 shadow-lg border-2 border-white hover:border-rose-200 transition-all duration-200 ml-4 font-bold text-base md:text-lg scale-105 hover:scale-110">
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header
