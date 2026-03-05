"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfettiAnimation from "@/components/ui/ConfettiAnimation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (success && !isLoggingIn) {
      const timer = setTimeout(async () => {
        setIsLoggingIn(true);
        const result = await signIn("credentials", {
          redirect: false,
          email: form.email,
          password: form.password,
        });
        if (result?.ok) {
          router.push("/profile");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, form.email, form.password, isLoggingIn, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

  
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setSuccess("");
      } else {
        setSuccess("Cadastro realizado com sucesso!");
        setError("");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch {
      setError("Ocorreu um erro. Por favor, tente novamente.");
      setSuccess("");
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-2 sm:px-6 lg:px-8 bg-linear-to-r from-emerald-100 to-lime-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-700 mb-6">Crie sua conta</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition pr-10"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && (
            <>
              <div className="text-green-600 text-sm text-center">{success}</div>
              <ConfettiAnimation />
            </>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Registrar
            <MdOutlinePersonAddAlt1 className="inline-block ml-2 text-xl" />
          </button>
          <div className="text-center mt-4">ou fazer login com </div>

 <button onClick={() => signIn('google')}
            type="button"
            className="w-full py-2 px-4 bg-gray-400 hover:bg-white/90 text-gray-800 font-semibold rounded-lg shadow-md transition"
          >
            Google
            <FcGoogle className="inline-block ml-2 text-xl" />
          </button>

          <div className="text-center mt-4">
            <p className="font-bold text-gray-600">
              Já tem uma conta? <a href="/login" className="text-emerald-600 hover:text-emerald-800 text-2xl underline">Entrar</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
    
    
