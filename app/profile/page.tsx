"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Link from "next/link";

type Address = {
  street: string;
  city: string;
  postalCode: string;
  label?: string;
  isDefault?: boolean;
};

type ProfileCache = {
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const loadProfile = async () => {
      // 1) Attempt local cache for instant render
      if (typeof window !== "undefined") {
        const cachedRaw = localStorage.getItem("profile-cache");
        if (cachedRaw) {
          try {
            const cached: ProfileCache = JSON.parse(cachedRaw);
            if (cached.name) setName(cached.name);
            if (cached.phone) setPhone(cached.phone);
            if (Array.isArray(cached.addresses) && cached.addresses.length) {
              setAddresses(cached.addresses);
            }
            setInitialLoaded(true);
          } catch (e) {
            console.warn("Failed to parse profile cache", e);
          }
        }
      }

      // 2) Fetch fresh data
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data?.user?.name) setName(data.user.name);
          if (typeof data?.user?.phone === "string") setPhone(data.user.phone);
          if (Array.isArray(data?.user?.addresses)) {
            setAddresses(data.user.addresses.length ? data.user.addresses : [{ street: "", city: "", postalCode: "", isDefault: true }]);
          }
          cacheProfile({
            name: data?.user?.name || "",
            phone: data?.user?.phone || "",
            email: data?.user?.email || session?.user?.email || "",
            addresses: Array.isArray(data?.user?.addresses) ? data.user.addresses : [],
          });
          setInitialLoaded(true);
          setIsLoadingAddresses(false);
          return;
        }
      } catch (err) {
        console.error("Erro ao carregar perfil", err);
      }

      // 3) Fallback to session if API fails
      if (!initialLoaded) {
        if (session?.user?.name) setName(session.user.name);
        if (session?.user?.phone) setPhone(session.user.phone);
        setInitialLoaded(true);
      }
      setIsLoadingAddresses(false);
    };

    setIsLoadingAddresses(true);
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.name, session?.user?.phone, session?.user?.email]);

  const userImage = session?.user?.image || "https://via.placeholder.com/150";
  const userEmail = session?.user?.email || "";

  const isDirty = useMemo(() => {
    const currentName = session?.user?.name || "";
    const currentPhone = session?.user?.phone || "";
    return name.trim() !== currentName.trim() || phone.trim() !== currentPhone.trim();
  }, [name, phone, session?.user?.name, session?.user?.phone]);

  if (status === "loading" || !initialLoaded) {
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

    if (phone && phone.trim().length < 8) {
      setError("Informe um telefone válido (mínimo 8 caracteres).");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, phone: phone.trim() }),
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
          phone: phone.trim(),
        },
      });

      setSuccess("Nome atualizado com sucesso!");
      toast.success("Perfil atualizado!");

      cacheProfile({
        name: trimmedName,
        phone: phone.trim(),
        email: session?.user?.email || "",
        addresses,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressChange = (index: number, field: keyof Address, value: string | boolean) => {
    setAddresses((prev) => {
      const clone = [...prev];
      const updated = { ...clone[index], [field]: value } as Address;
      clone[index] = updated;
      return clone;
    });
  };

  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { street: "", city: "", postalCode: "", isDefault: prev.length === 0 }]);
  };

  const handleRemoveAddress = (index: number) => {
    setAddresses((prev) => {
      if (prev.length === 1) return prev; // always keep at least one
      const clone = prev.filter((_, i) => i !== index);
      // ensure one default
      if (!clone.some((a) => a.isDefault)) {
        clone[0] = { ...clone[0], isDefault: true };
      }
      return clone;
    });
  };

  const handleDefaultChange = (index: number) => {
    setAddresses((prev) => prev.map((addr, i) => ({ ...addr, isDefault: i === index })));
  };

  const handleSaveAddresses = async () => {
    setError(null);
    setSuccess(null);
    setIsSavingAddress(true);
    try {
      const res = await fetch("/api/profile/address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addresses }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Não foi possível salvar endereços.");
      setAddresses(data.addresses || []);
      setSuccess("Endereços atualizados com sucesso!");
      cacheProfile({
        name,
        phone,
        email: session?.user?.email || "",
        addresses: data.addresses || [],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao salvar endereços.";
      setError(message);
    } finally {
      setIsSavingAddress(false);
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
      toast.success("Avatar atualizado!");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado. Tente novamente.";
      setError(message);
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <section className="text-center items-center mt-10 px-4">
        <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
          <div className="flex-1 min-w-[250px]">
            <Link href="/profile" className="text-3xl sm:text-4xl font-bold text-emerald-700 inline-block hover:text-emerald-800 transition-colors">
              Minha Profile
            </Link>
            <p className="text-gray-600 mt-2 mb-4">Gerencie suas informações pessoais e endereços aqui.</p>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/orders"
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition-colors shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              📦 Meus Pedidos
            </Link>
            {!session?.user?.admin && (
              <Link 
                href="/admin-login" 
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-colors shadow-md hover:shadow-lg"
              >
                🔐 Admin
              </Link>
            )}
          </div>
        </div>
          {session?.user?.admin && (
            <div className="flex flex-wrap gap-2 items-center mt-4 mb-6 pt-4 border-t border-gray-200">
              <span className="text-sm font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Ferramentas de Admin
              </span>
              <Link href="/categories" className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-emerald-700 font-semibold transition-colors shadow-sm hover:shadow-md">
                Categorias
              </Link>
              <Link href="/categories" className="px-4 py-2 rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold transition-colors">
                Itens do Menu
              </Link>
              <Link href="/users" className="px-4 py-2 rounded-lg border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-semibold transition-colors">
                Usuários
              </Link>
            </div>
          )}
        {(error || success) && (
          <div className="mb-6 text-left">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {success}
              </div>
            )}
          </div>
        )}
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
            <label htmlFor="phone" className="text-sm font-semibold text-emerald-700 block mb-2">
              Telefone
            </label>
            <input
              id="phone"
              name="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="(11) 99999-9999"
              disabled={isSaving}
            />
          </div>
          

          <div className="p-4 sm:p-5 rounded-xl border border-gray-100 shadow-sm bg-emerald-50/40 text-left">
            <p className="text-sm font-semibold text-emerald-700">Email</p>
            <p className="text-lg font-semibold text-gray-800 wrap-break-word">{userEmail}</p>
          </div>

          <div className={`p-4 sm:p-5 rounded-xl border shadow-sm text-left ${
            session?.user?.admin 
              ? "border-amber-200 bg-linear-to-br from-amber-50 to-amber-100/50" 
              : "border-gray-100 bg-emerald-50/40"
          }`}>
            <p className={`text-sm font-semibold mb-2 ${session?.user?.admin ? "text-amber-700" : "text-emerald-700"}`}>
              Tipo de Conta
            </p>
            <div className="flex items-center gap-3">
              {session?.user?.admin ? (
                <>
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-amber-700">Administrador</p>
                    <p className="text-xs text-amber-600">Acesso total ao sistema</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">Usuário Regular</p>
                    <p className="text-xs text-gray-600">Acesso padrão</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
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
          <h2 className="text-lg font-semibold text-emerald-700 mb-3">Endereços</h2>
          {isLoadingAddresses ? (
            <p className="text-gray-600">Carregando endereços...</p>
          ) : (
            <div className="space-y-4">
              {addresses.map((address, index) => (
                <div key={index} className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="default-address"
                        checked={!!address.isDefault}
                        onChange={() => handleDefaultChange(index)}
                        className="text-emerald-600"
                        aria-label="Endereço padrão"
                      />
                      <input
                        type="text"
                        value={address.label || ""}
                        onChange={(e) => handleAddressChange(index, "label", e.target.value)}
                        placeholder="Ex: Casa, Trabalho"
                        className="border border-emerald-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    {addresses.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAddress(index)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remover
                      </button>
                    )}
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-medium text-emerald-700">Rua / Endereço</label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => handleAddressChange(index, "street", e.target.value)}
                        className="w-full mt-1 rounded border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="Rua Exemplo, 123"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-emerald-700">Cidade</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange(index, "city", e.target.value)}
                        className="w-full mt-1 rounded border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="São Paulo"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-emerald-700">CEP</label>
                      <input
                        type="text"
                        value={address.postalCode}
                        onChange={(e) => handleAddressChange(index, "postalCode", e.target.value)}
                        className="w-full mt-1 rounded border border-emerald-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        placeholder="00000-000"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-3 items-center">
                <button
                  type="button"
                  onClick={handleAddAddress}
                  className="px-4 py-2 border border-emerald-300 text-emerald-700 rounded-lg hover:bg-emerald-50"
                >
                  Adicionar endereço
                </button>
                <button
                  type="button"
                  onClick={handleSaveAddresses}
                  disabled={isSavingAddress}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                >
                  {isSavingAddress ? "Salvando..." : "Salvar endereços"}
                </button>
              </div>
            </div>
          )}
        </div>
    </section>
  );
}

function cacheProfile(profile: ProfileCache) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("profile-cache", JSON.stringify(profile));
  } catch (err) {
    console.warn("Failed to cache profile", err);
  }
}
