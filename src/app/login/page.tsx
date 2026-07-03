"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// La vendedora escribe solo un nombre de usuario; por detrás se completa
// con este dominio fijo para autenticar contra Supabase (que usa email).
const LOGIN_DOMAIN = "casablanca.app";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const input = username.trim().toLowerCase();
    // Si ya escribieron un email completo (con @) se usa tal cual; si es solo
    // un nombre de usuario, se le agrega el dominio fijo.
    const email = input.includes("@") ? input : `${input}@${LOGIN_DOMAIN}`;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Usuario o contraseña incorrectos.");
      return;
    }
    router.push(searchParams.get("next") ?? "/admin");
    router.refresh();
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3.5 text-base outline-none focus:border-gold";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-3xl bg-cream p-7 shadow-2xl">
      <div className="mb-6 flex justify-center">
        <div className="relative h-14 w-44">
          <Image
            src="/brand/casablanca-logo-white.png"
            alt="Casablanca"
            fill
            sizes="176px"
            className="object-contain brightness-0"
          />
        </div>
      </div>
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-charcoal/40">
        Panel de administración
      </p>
      <label className="mb-4 block text-base font-bold">
        Usuario
        <input
          type="text"
          required
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          placeholder="Ej. casablanca"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={inputClass}
        />
      </label>
      <label className="mb-5 block text-base font-bold">
        Contraseña
        <input
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
      </label>
      {error && (
        <p className="mb-4 rounded-xl bg-terracotta/15 px-4 py-3 text-base font-semibold text-terracotta">
          ⚠️ {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="min-h-[54px] w-full rounded-xl bg-charcoal text-lg font-bold text-cream active:scale-[0.98] disabled:opacity-60"
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
      <Link
        href="/"
        className="mt-4 block text-center text-sm font-semibold text-charcoal/50"
      >
        ← Volver al catálogo
      </Link>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-charcoal px-6">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
