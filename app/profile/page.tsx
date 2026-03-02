"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return <div className="animate-pulse text-gray-400">Carregando...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const userImage = session?.user?.image || "https://via.placeholder.com/150";
  const userName = session?.user?.name || "Usuário";
  const userEmail = session?.user?.email || "";

  return (
    <section className="mt-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-50 p-8 sm:p-10">
        <div className="flex flex-col items-center gap-4 text-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-200/50 blur-xl" aria-hidden />
            <Image
              src={userImage}
              alt="Foto do usuário"
              width={120}
              height={120}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-lg object-cover border-4 border-white"
              priority
            />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700">Perfil do Usuário</h1>
            <p className="text-gray-600">Bem-vindo ao seu perfil! Aqui você pode ver suas informações e pedidos.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
          <div className="p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm bg-emerald-50/40">
            <p className="text-sm font-semibold text-emerald-700">Nome</p>
            <p className="text-lg font-semibold text-gray-800">{userName}</p>
          </div>
          <div className="p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm bg-emerald-50/40">
            <p className="text-sm font-semibold text-emerald-700">E-mail</p>
            <p className="text-lg font-semibold text-gray-800 wrap-break-word">{userEmail}</p>
          </div>
        </div>

        <div className="mt-6 p-4 sm:p-5 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 text-emerald-800 text-sm sm:text-base">
          <p>Em breve: histórico de pedidos, preferências e opções de edição do perfil.</p>
        </div>
      </div>
    </section>
  );
}