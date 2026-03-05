"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";

export default function UsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "authenticated" && !session?.user?.admin) {
      router.replace("/profile");
    }
  }, [status, session, router]);

  if (status === "loading" || (status === "authenticated" && !session?.user?.admin)) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/profile" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-block">
          ← Voltar para o Perfil
        </Link>
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">Gerenciar Usuários</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Em desenvolvimento...</p>
        </div>
      </div>
    </section>
  );
}
