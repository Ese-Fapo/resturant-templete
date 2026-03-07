"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  slug: string;
};

type MenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: Category | null;
  available: boolean;
  featured: boolean;
};

export default function MenuAdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);

  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    setIsFetching(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/menu-items", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar itens do menu.");
      }

      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar itens do menu.";
      setErrorMessage(message);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (response.ok) {
        setCategories(Array.isArray(data?.categories) ? data.categories : []);
      }
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "authenticated") {
      const userIsAdmin = session?.user?.admin === true;

      if (!userIsAdmin) {
        router.replace("/menu");
        return;
      }

      fetchMenuItems();
      fetchCategories();
    }
  }, [status, session, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateItem = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedPrice = price.trim();

    if (!trimmedName) {
      setErrorMessage("Informe o nome do item.");
      return;
    }

    if (!trimmedPrice || isNaN(parseFloat(trimmedPrice)) || parseFloat(trimmedPrice) < 0) {
      setErrorMessage("Informe um preço válido.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("name", trimmedName);
      formData.append("description", description.trim());
      formData.append("price", trimmedPrice);
      formData.append("categoryId", categoryId);
      formData.append("available", available.toString());
      formData.append("featured", featured.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível criar o item.");
      }

      setName("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setImageFile(null);
      setImagePreview("");
      setAvailable(true);
      setFeatured(false);
      setSuccessMessage("Item criado com sucesso.");
      await fetchMenuItems();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível criar o item.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAvailability = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setActiveItemId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("available", (!item.available).toString());

      const response = await fetch(`/api/menu-items/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o item.");
      }

      setItems((previous) => previous.map((i) => (i.id === id ? { ...i, available: !i.available } : i)));
      setSuccessMessage("Disponibilidade do item atualizada.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível atualizar o item.";
      setErrorMessage(message);
    } finally {
      setActiveItemId(null);
    }
  };

  const toggleFeatured = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    setActiveItemId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const formData = new FormData();
      formData.append("featured", (!item.featured).toString());

      const response = await fetch(`/api/menu-items/${id}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o item.");
      }

      setItems((previous) => previous.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));
      setSuccessMessage("Status de destaque atualizado.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível atualizar o item.";
      setErrorMessage(message);
    } finally {
      setActiveItemId(null);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este item?")) return;

    setActiveItemId(id);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await fetch(`/api/menu-items/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível remover o item.");
      }

      setItems((previous) => previous.filter((item) => item.id !== id));
      setSuccessMessage("Item removido com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível remover o item.";
      setErrorMessage(message);
    } finally {
      setActiveItemId(null);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  const availableCount = items.filter((item) => item.available).length;
  const featuredCount = items.filter((item) => item.featured).length;

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/menu" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            ← Voltar para o Cardápio
          </Link>
          <Link href="/profile" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Ir para o Perfil
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">Gerenciar Cardápio</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow border border-emerald-100">
            <p className="text-sm text-gray-500">Total de itens</p>
            <p className="text-3xl font-bold text-emerald-700">{items.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-emerald-100">
            <p className="text-sm text-gray-500">Itens disponíveis</p>
            <p className="text-3xl font-bold text-emerald-700">{availableCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow border border-emerald-100">
            <p className="text-sm text-gray-500">Itens em destaque</p>
            <p className="text-3xl font-bold text-emerald-700">{featuredCount}</p>
          </div>
        </div>

        <form onSubmit={handleCreateItem} className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Novo item do cardápio</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  Nome do Item *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Ex.: Pizza Margherita"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Descreva os ingredientes e características do item"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
                    Categoria
                  </label>
                  <select
                    id="category"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Sem categoria</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => setAvailable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 font-semibold">Disponível</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                  <span className="text-gray-700 font-semibold">Em destaque</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
                Imagem do Item
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                {imagePreview ? (
                  <div className="relative w-full h-48 mb-4">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-gray-400">
                    <p>Nenhuma imagem selecionada</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleImageChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                <p className="text-xs text-gray-500 mt-2">JPEG, PNG, WEBP ou AVIF (máx. 5MB)</p>
              </div>
            </div>
          </div>

          {errorMessage && <p className="text-rose-600 text-sm mt-4">{errorMessage}</p>}
          {successMessage && <p className="text-emerald-600 text-sm mt-4">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-bold shadow transition-all duration-200 border border-emerald-200 disabled:opacity-50"
          >
            {isSubmitting ? "Salvando..." : "Adicionar item"}
          </button>
        </form>

        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Itens do Cardápio</h2>

          {isFetching && (
            <div className="bg-white p-4 rounded-lg border border-gray-100 text-gray-600">
              Carregando itens...
            </div>
          )}

          {!isFetching && items.length === 0 && (
            <div className="bg-white p-4 rounded-lg border border-gray-100 text-gray-600">
              Nenhum item cadastrado ainda.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden"
              >
                {item.image && (
                  <div className="relative w-full h-48">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <div className="flex flex-col gap-1">
                      {item.available ? (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Disponível
                        </span>
                      ) : (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-200 text-gray-600">
                          Indisponível
                        </span>
                      )}
                      {item.featured && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          Destaque
                        </span>
                      )}
                    </div>
                  </div>

                  {item.description && <p className="text-gray-600 mb-3 text-sm">{item.description}</p>}

                  <div className="flex items-center justify-between mb-4">
                    <p className="text-2xl font-bold text-emerald-700">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                    {item.category && (
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {item.category.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => toggleAvailability(item.id)}
                      disabled={activeItemId === item.id}
                      className="px-3 py-1.5 rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold text-xs disabled:opacity-50"
                    >
                      {item.available ? "Tornar indisponível" : "Tornar disponível"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleFeatured(item.id)}
                      disabled={activeItemId === item.id}
                      className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-700 hover:bg-amber-50 font-semibold text-xs disabled:opacity-50"
                    >
                      {item.featured ? "Remover destaque" : "Destacar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      disabled={activeItemId === item.id}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs disabled:opacity-50"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
