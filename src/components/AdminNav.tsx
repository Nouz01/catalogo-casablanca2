"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/productos", label: "Productos", icon: "🛏️" },
  { href: "/admin/categorias", label: "Categorías", icon: "🏷️" },
  { href: "/admin/ajustes", label: "Ajustes", icon: "⚙️" },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-charcoal/10 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      {tabs.map((t) => {
        const active = pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-bold ${
              active ? "text-gold" : "text-charcoal/50"
            }`}
          >
            <span className="text-2xl leading-none">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
