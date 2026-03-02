
import React from 'react';
import Link from 'next/link';
import { CiFacebook } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-10 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Branding */}
        <div className="flex items-center gap-3">
          <img src="/images/3chefs.avif" alt="Logo 3 Chefs" className="w-12 h-12 rounded-full shadow-lg" />
          <span className="text-2xl font-bold tracking-wide text-white">Chefs</span>
        </div>
        {/* Navigation */}
        <nav className="flex flex-wrap gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <a href="/menu" className="hover:text-primary transition-colors">Cardápio</a>
          <a href="/about" className="hover:text-primary transition-colors">Sobre</a>
          <a href="/contact" className="hover:text-primary transition-colors">Contato</a>
        </nav>
        {/* Social Links */}
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition-colors">
            <CiFacebook className="w-6 h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition-colors">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition-colors">
            <FaInstagramSquare className="w-6 h-6" />
          </a>
        </div>
      </div>
      <div className="mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Chefs. Todos os direitos reservados.
      </div>
    </footer>
  );
};
