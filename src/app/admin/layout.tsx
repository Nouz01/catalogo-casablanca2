import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/LogoutButton";
import { AdminNav } from "@/components/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-cream pb-24">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-charcoal/10 bg-white px-5 py-4">
        <span className="text-lg font-extrabold text-charcoal">Panel Casablanca</span>
        <LogoutButton />
      </header>
      <div className="mx-auto max-w-2xl px-4 py-6">{children}</div>
      <AdminNav />
    </div>
  );
}
