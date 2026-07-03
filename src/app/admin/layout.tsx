import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-charcoal/10 bg-white px-6 py-4">
        <nav className="flex flex-wrap items-center gap-6 text-sm font-semibold">
          <span className="font-script text-xl text-gold">Casablanca · Admin</span>
          <Link href="/admin/productos">Productos</Link>
          <Link href="/admin/categorias">Categorías</Link>
          <Link href="/admin/ajustes">Ajustes</Link>
        </nav>
        <LogoutButton />
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}
