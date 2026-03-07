"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug?: string;
  description: string;
  itemCount: number;
  active: boolean;
};

export default function CategoriesPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsFetching(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar categorias.");
      }

      setCategories(Array.isArray(data?.categories) ? data.categories : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar categorias.";
      setErrorMessage(message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "authenticated" && !session?.user?.admin) {
      router.replace("/profile");
    }

    if (status === "authenticated" && session?.user?.admin) {
      fetchCategories();
    }
  }, [status, session, router]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    (status === "authenticated" && !session?.user?.admin)
  ) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  const activeCount = categories.filter((category) => category.active).length;

  const handleCreateCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName) {
      setErrorMessage("Informe o nome da categoria.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          description: trimmedDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível criar a categoria.");
      }

      setName("");
      setDescription("");
      setSuccessMessage("Categoria criada com sucesso.");
      await fetchCategories();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar a categoria.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategoryStatus = async (id: string) => {
    const category = categories.find((item) => item.id === id);
    if (!category) return;

    setActiveCategoryId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !category.active }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o status da categoria.");
      }

      setCategories((previous) =>
        previous.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
      );
      setSuccessMessage("Status da categoria atualizado.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Não foi possível atualizar o status da categoria.";
      setErrorMessage(message);
    } finally {
      setActiveCategoryId(null);
    }
  };

  const removeCategory = async (id: string) => {
    setActiveCategoryId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível remover a categoria.");
      }

      setCategories((previous) => previous.filter((category) => category.id !== id));
      setSuccessMessage("Categoria removida com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível remover a categoria.";
      setErrorMessage(message);
    } finally {
      setActiveCategoryId(null);
    }
  };

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/profile" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-block">
          ← Voltar para o Perfil
        </Link>
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">Gerenciar Categorias</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border border-emerald-100">
            <p className="text-sm text-gray-500">Total de categorias</p>
            <p className="text-3xl font-bold text-emerald-700">{categories.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-emerald-100">
            <p className="text-sm text-gray-500">Categorias ativas</p>
            <p className="text-3xl font-bold text-emerald-700">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-emerald-100">
            <p className="text-sm text-gray-500">Itens no cardápio</p>
            <p className="text-3xl font-bold text-emerald-700">
              {categories.reduce((sum, category) => sum + category.itemCount, 0)}
            </p>
          </div>
        </div>
      </div>
      <form onSubmit={handleCreateCategory} className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Nova categoria</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Nome da Categoria
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ex.: Pratos executivos"
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
              Descrição
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Resumo rápido da categoria"
            />
          </div>
        </div>

        {errorMessage && <p className="text-rose-600 text-sm mt-3">{errorMessage}</p>}
        {successMessage && <p className="text-emerald-600 text-sm mt-3">{successMessage}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow transition-all duration-200 border border-emerald-200"
        >
          {isSubmitting ? "Salvando..." : "Adicionar categoria"}
        </button>
      </form>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isFetching && (
          <div className="col-span-full bg-white p-4 rounded-lg border border-gray-100 text-gray-600">
            Carregando categorias...
          </div>
        )}

        {!isFetching && categories.length === 0 && (
          <div className="col-span-full bg-white p-4 rounded-lg border border-gray-100 text-gray-600">
            Nenhuma categoria cadastrada ainda.
          </div>
        )}

        {categories.map((category) => (
          <article key={category.id} className="bg-white rounded-xl p-5 shadow border border-gray-100">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-xl font-bold text-gray-900">{category.name}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  category.active ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600"
                }`}
              >
                {category.active ? "Ativa" : "Inativa"}
              </span>
            </div>
            <p className="text-gray-600 mb-4">{category.description}</p>
            <p className="text-sm text-gray-500 mb-4">{category.itemCount} item(ns)</p>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => toggleCategoryStatus(category.id)}
                disabled={activeCategoryId === category.id}
                className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold text-sm"
              >
                {category.active ? "Desativar" : "Ativar"}
              </button>
              <button
                type="button"
                onClick={() => removeCategory(category.id)}
                disabled={activeCategoryId === category.id}
                className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-sm"
              >
                Remover
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
