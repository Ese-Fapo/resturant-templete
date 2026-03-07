"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export function AuthStatus({ onLogout }: { onLogout?: () => void }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="animate-pulse text-gray-400">Carregando...</div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-emerald-700 font-semibold">Olá, {session.user?.name || session.user?.email}!</span>
        <Link
          href="/profile"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow transition-all duration-200 border border-emerald-200"
        >
          Perfil
        </Link>
        <button
          onClick={() => {
            signOut();
            if (onLogout) onLogout();
          }}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-bold shadow transition-all duration-200 border border-rose-200"
        >
          Sair
        </button>
      </div>
    );
  }

  return null;
}
