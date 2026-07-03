"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { renameCategory, deleteCategory } from "@/app/admin/categorias/actions";

export function CategoryRow({
  id,
  name,
  productCount,
}: {
  id: string;
  name: string;
  productCount: number;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function rename() {
    const nuevo = window.prompt("Nuevo nombre de la categoría:", name);
    if (nuevo == null) return;
    const limpio = nuevo.trim();
    if (!limpio || limpio === name) return;
    const fd = new FormData();
    fd.set("id", id);
    fd.set("name", limpio);
    startTransition(async () => {
      await renameCategory(fd);
      router.refresh();
    });
  }

  async function remove() {
    const aviso =
      productCount > 0
        ? `¿Borrar "${name}"? Se van a borrar también sus ${productCount} producto(s).`
        : `¿Borrar la categoría "${name}"?`;
    if (!window.confirm(aviso)) return;
    const fd = new FormData();
    fd.set("id", id);
    startTransition(async () => {
      await deleteCategory(fd);
      router.refresh();
    });
  }

  return (
    <li className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-white p-4">
      <div className="min-w-0 flex-1">
        <div className="truncate text-lg font-bold">{name}</div>
        <div className="text-sm text-charcoal/50">
          {productCount} {productCount === 1 ? "producto" : "productos"}
        </div>
      </div>
      <button
        onClick={rename}
        disabled={isPending}
        className="rounded-lg bg-charcoal/5 px-4 py-2 text-sm font-bold text-charcoal active:scale-95 disabled:opacity-50"
      >
        Cambiar nombre
      </button>
      <button
        onClick={remove}
        disabled={isPending}
        className="px-2 py-2 text-sm font-bold text-terracotta active:scale-95 disabled:opacity-50"
      >
        Borrar
      </button>
    </li>
  );
}
