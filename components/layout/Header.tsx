"use client"

import React, { useState } from 'react'
import { AuthStatus } from './AuthStatus';
import { useSession } from 'next-auth/react';
import { useCart } from '@/hooks/useCart';

import Link from 'next/link'
import { IoIosLogIn } from "react-icons/io";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { AiOutlineShoppingCart } from "react-icons/ai";




const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const cart = useCart();
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl shadow-xl border-b border-emerald-100/50">
      {/* Decorative top gradient line */}
      <div className="h-1 bg-linear-to-r from-emerald-400 via-lime-400 to-amber-400"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="group flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight relative z-10"
          >
            <div className="relative">
              <span role="img" aria-label="pizza" className="text-3xl sm:text-4xl lg:text-5xl transform group-hover:rotate-12 transition-transform duration-300">🍕</span>
              <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full group-hover:bg-emerald-400/40 transition-all duration-300"></div>
            </div>
            <span className="bg-linear-to-r from-emerald-600 via-lime-500 to-amber-500 bg-clip-text text-transparent group-hover:from-emerald-500 group-hover:via-lime-400 group-hover:to-amber-400 transition-all duration-300">
              Nossa Pizza
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <Link 
              href="/" 
              className="relative px-4 py-2 text-gray-700 font-semibold rounded-xl hover:text-emerald-600 transition-all duration-200 group"
            >
              <span className="relative z-10">Início</span>
              <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link 
              href="/menu" 
              className="relative px-4 py-2 text-gray-700 font-semibold rounded-xl hover:text-emerald-600 transition-all duration-200 group"
            >
              <span className="relative z-10">Cardápio</span>
              <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            {session && (
              <Link 
                href="/orders" 
                className="relative px-4 py-2 text-gray-700 font-semibold rounded-xl hover:text-emerald-600 transition-all duration-200 group"
              >
                <span className="relative z-10">Meus Pedidos</span>
                <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
            )}
            <Link 
              href="/#about" 
              className="relative px-4 py-2 text-gray-700 font-semibold rounded-xl hover:text-emerald-600 transition-all duration-200 group"
            >
              <span className="relative z-10">Sobre nós</span>
              <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            <Link 
              href="/#contact" 
              className="relative px-4 py-2 text-gray-700 font-semibold rounded-xl hover:text-emerald-600 transition-all duration-200 group"
            >
              <span className="relative z-10">Contato</span>
              <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            
            {/* Cart Link */}
            <Link 
              href="/cart" 
              className="relative px-4 py-2 ml-2 text-gray-700 font-semibold rounded-xl hover:text-emerald-600 transition-all duration-200 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <AiOutlineShoppingCart className="text-xl" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-xs font-bold text-white rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </span>
              <div className="absolute inset-0 bg-emerald-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </Link>
            
            {/* Desktop Auth Buttons */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <AuthStatus />
              {!session && (
                <>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-emerald-700 bg-white border-2 border-emerald-400 hover:bg-emerald-50 hover:border-emerald-500 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <span className="hidden xl:inline">Registrar</span>
                    <MdOutlinePersonAddAlt1 className="text-xl" />
                  </Link>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white bg-linear-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 border-2 border-emerald-400/30"
                  >
                    <span className="hidden xl:inline">Entrar</span>
                    <IoIosLogIn className="text-xl" />
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`lg:hidden p-2.5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
              menuOpen 
                ? 'bg-linear-to-br from-emerald-400 to-lime-500 text-white shadow-lg' 
                : 'text-gray-700 bg-linear-to-br from-emerald-50 to-lime-50 hover:from-emerald-100 hover:to-lime-100 hover:shadow-md'
            }`}
            onClick={() => setMenuOpen(prev => !prev)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? (
              <HiX className="w-7 h-7" />
            ) : (
              <HiMenuAlt3 className="w-7 h-7" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-y-0 right-0 w-full sm:w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out z-50 flex flex-col h-screen ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 bg-linear-to-br from-emerald-50 via-lime-50 to-green-50 shadow-md">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🍕</span>
            <span className="text-xl font-black bg-linear-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
              Nossa Pizza
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 rounded-lg hover:bg-white/80 transition-colors"
            aria-label="Fechar menu"
          >
            <HiX className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <nav className="flex flex-col p-4 sm:p-5 gap-2 overflow-y-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-xl">🏠</span>
            Início
          </Link>
          <Link
            href="/menu"
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-xl">📋</span>
            Cardápio
          </Link>
          {session && (
            <Link
              href="/orders"
              className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              <span className="text-xl">📦</span>
              Meus Pedidos
            </Link>
          )}
          <Link
            href="/#about"
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-xl">ℹ️</span>
            Sobre nós
          </Link>
          <Link
            href="/#contact"
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-xl">📞</span>
            Contato
          </Link>

          {/* Mobile Cart Link */}
          <Link
            href="/cart"
            className="flex items-center gap-3 px-4 py-3.5 text-gray-700 font-semibold rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-200 relative"
            onClick={() => setMenuOpen(false)}
          >
            <span className="text-xl">🛒</span>
            <span>Carrinho</span>
            {cart.itemCount > 0 && (
              <span className="absolute right-4 bg-red-500 text-xs font-bold text-white rounded-full w-5 h-5 flex items-center justify-center">
                {cart.itemCount}
              </span>
            )}
          </Link>

          {/* Mobile Auth Section */}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <div className="px-4">
              <AuthStatus />
            </div>
            {!session && (
              <div className="flex flex-col gap-3 px-4">
                <Link
                  href="/register"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-emerald-700 bg-white border-2 border-emerald-400 hover:bg-emerald-50 transition-all duration-200 shadow-md"
                  onClick={() => setMenuOpen(false)}
                >
                  Criar Conta
                  <MdOutlinePersonAddAlt1 className="text-xl" />
                </Link>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-white bg-linear-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 shadow-lg transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Entrar
                  <IoIosLogIn className="text-xl" />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setMenuOpen(false)}
          aria-label="Fechar menu"
        ></div>
      )}
    </header>
  );
}


export default Header
