
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CiFacebook } from "react-icons/ci";
import { FaTwitter } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto flex flex-col items-center md:flex-row md:justify-between gap-6 sm:gap-8 lg:gap-10">
        {/* Branding */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Image
            src="/images/3chefs.avif"
            alt="Logo 3 Chefs"
            width={48}
            height={48}
            className="w-10 sm:w-12 h-10 sm:h-12 rounded-full shadow-lg"
            priority
          />
          <span className="text-xl sm:text-2xl font-bold tracking-wide text-white">Chefs</span>
        </div>
        {/* Navigation */}
        <nav className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Início</Link>
          <Link href="/#menu" className="hover:text-primary transition-colors">Cardápio</Link>
          <Link href="/#about" className="hover:text-primary transition-colors">Sobre</Link>
          <Link href="/#contact" className="hover:text-primary transition-colors">Contato</Link>
        </nav>
        {/* Social Links */}
        <div className="flex gap-3 sm:gap-4">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-blue-400 transition-colors">
            <CiFacebook className="w-5 sm:w-6 h-5 sm:h-6" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-sky-400 transition-colors">
            <FaTwitter className="w-5 sm:w-6 h-5 sm:h-6" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-pink-400 transition-colors">
            <FaInstagramSquare className="w-5 sm:w-6 h-5 sm:h-6" />
          </a>
        </div>
      </div>
      <div className="mt-6 sm:mt-8 text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} Chefs. Todos os direitos reservados..
      </div>
    </footer>
  );
};
