"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session?.user?.name]);

  const userImage = session?.user?.image || "https://via.placeholder.com/150";
  const userEmail = session?.user?.email || "";

  const isDirty = useMemo(() => {
    const currentName = session?.user?.name || "";
    return name.trim() !== currentName.trim();
  }, [name, session?.user?.name]);

  if (status === "loading") {
    return <div className="animate-pulse text-gray-400">Carregando...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setError("Informe um nome com pelo menos 2 caracteres.");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Não foi possível salvar agora.");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          name: trimmedName,
        },
      });

      setSuccess("Nome atualizado com sucesso!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("avatar", file);

    setIsUploading(true);
    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "Não foi possível atualizar o avatar.");
      }

      await update({
        ...session,
        user: {
          ...session?.user,
          image: result.image,
        },
      });

      setSuccess("Avatar atualizado com sucesso!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
      setError(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="text-center items-center mt-10 px-4">
        <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-700 items-center">Minha profile </h1>
            <p className="text-gray-600">Bem-vindo ao seu perfil! Aqui você pode ver suas informações e pedidos.</p>
          </div>
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-50 p-8 sm:p-10">
        <div className="flex flex-col items-center gap-4 text-center mb-6">
          <div className="relative">
            <div className="bg-gray-100 p-2 " aria-hidden />
            <Image
              src={userImage}
              alt="Foto do usuário"
              width={180}
              height={180}
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full shadow-lg object-cover border-4 border-white"
              priority
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-3 inline-flex items-center justify-center rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:opacity-60"
              disabled={isUploading}
            >
              {isUploading ? "Enviando..." : "Trocar foto"}
            </button>
          </div>
          
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4 sm:gap-6 sm:grid-cols-2 mt-2">
          <div className="p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm bg-emerald-50/40 text-left">
            <label htmlFor="name" className="text-sm font-semibold text-emerald-700 block mb-2">
              Nome
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Seu nome"
              disabled={isSaving}
            />
          </div>

          <div className="p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm bg-emerald-50/40 text-left">
            <p className="text-sm font-semibold text-emerald-700">Email</p>
            <p className="text-lg font-semibold text-gray-800 break-words">{userEmail}</p>
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-left">
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-emerald-600">{success}</p>}
            </div>
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 sm:p-5 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/50 text-emerald-800 text-sm sm:text-base">
          <p>Em breve: histórico de pedidos, preferências e opções de edição do perfil.</p>
        </div>
      </div>
    </section>
  );
}
