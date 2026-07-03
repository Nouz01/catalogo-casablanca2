"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
      }}
      className="rounded-full border border-charcoal/20 px-4 py-2 text-sm font-bold text-charcoal/70 active:scale-95"
    >
      Salir
    </button>
  );
}
