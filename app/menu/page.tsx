"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/useCart";

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
  featured: boolean;
};

export default function MenuPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const cart = useCart();

  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [addedToCart, setAddedToCart] = useState<string | null>(null);

  const fetchMenuItems = async () => {
    setIsFetching(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/menu", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível carregar o cardápio.");
      }

      const loadedItems = Array.isArray(data?.items) ? data.items : [];
      setItems(loadedItems);
      setFilteredItems(loadedItems);

      // Extract unique categories
      const uniqueCategories = Array.from(
        new Map(
          loadedItems
            .filter((item: MenuItem) => item.category)
            .map((item: MenuItem) => [item.category!.id, item.category!])
        ).values()
      ) as Category[];

      setCategories(uniqueCategories);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível carregar o cardápio.";
      setErrorMessage(message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    cart.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category,
    });

    setAddedToCart(item.id);
    setTimeout(() => setAddedToCart(null), 2000);
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "authenticated") {
      fetchMenuItems();
    }
  }, [status, router]);

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredItems(items);
    } else if (selectedCategory === "featured") {
      setFilteredItems(items.filter((item) => item.featured));
    } else {
      setFilteredItems(items.filter((item) => item.category?.id === selectedCategory));
    }
  }, [selectedCategory, items]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  const isAdmin = session?.user?.admin === true;
  const featuredItems = items.filter((item) => item.featured);

  return (
    <section className="min-h-screen bg-linear-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Admin Link and Cart */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 font-semibold">
            <span>←</span> Voltar
          </Link>
          <div className="flex items-center gap-4">
            {!cart.isEmpty && (
              <Link
                href="/cart"
                className="relative px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow transition-all duration-200 inline-flex items-center gap-2"
              >
                🛒 Carrinho
                {cart.itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {cart.itemCount}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                href="/menu/admin"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow transition-all duration-200"
              >
                Gerenciar Cardápio
              </Link>
            )}
          </div>
        </div>

        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-700 mb-4 drop-shadow-lg">
            Nosso Cardápio
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Explore nossos deliciosos pratos preparados com ingredientes frescos e muito amor
          </p>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
            {errorMessage}
          </div>
        )}

        {isFetching ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando cardápio...</p>
          </div>
        ) : (
          <>
            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="mb-8 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                    selectedCategory === "all"
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                  }`}
                >
                  Todos
                </button>
                {featuredItems.length > 0 && (
                  <button
                    onClick={() => setSelectedCategory("featured")}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                      selectedCategory === "featured"
                        ? "bg-amber-500 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-amber-50 border border-gray-200"
                    }`}
                  >
                    ⭐ Em Destaque
                  </button>
                )}
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                      selectedCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}

            {/* Menu Items Grid */}
            {filteredItems.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-xl text-gray-600">
                  {items.length === 0
                    ? "Nosso cardápio está sendo preparado..."
                    : "Nenhum item encontrado nesta categoria."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {filteredItems.map((item) => (
                  <article
                    key={item.id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-emerald-200 transform hover:-translate-y-1"
                  >
                    {/* Image */}
                    <div className="relative w-full h-56 bg-linear-to-br from-gray-100 to-gray-200">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-6xl">
                          🍽️
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                          <span>⭐</span> Destaque
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                          {item.name}
                        </h3>
                        {item.category && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                            {item.category.name}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <p className="text-gray-600 mb-4 leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="text-3xl font-black text-emerald-600">
                          R$ {item.price.toFixed(2).replace(".", ",")}
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className={`px-6 py-2.5 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
                            addedToCart === item.id
                              ? "bg-green-500 text-white"
                              : "bg-linear-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white"
                          }`}
                        >
                          {addedToCart === item.id ? "✅ Adicionado" : "🛒 Pedir"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
