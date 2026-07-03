import { createClient } from "@/lib/supabase/server";
import { createCategory, renameCategory, deleteCategory } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Categorías</h1>

      <form action={createCategory} className="mb-8 flex gap-2">
        <input
          name="name"
          placeholder="Nueva categoría (ej. Toallas)"
          required
          className="flex-1 rounded-lg border border-charcoal/20 px-3 py-2"
        />
        <button className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-cream">
          Agregar
        </button>
      </form>

      <ul className="flex flex-col gap-2">
        {categories?.map((c: { id: string; name: string }) => (
          <li
            key={c.id}
            className="flex items-center gap-3 rounded-lg border border-charcoal/10 bg-white p-3"
          >
            <form action={renameCategory} className="flex flex-1 items-center gap-2">
              <input type="hidden" name="id" value={c.id} />
              <input
                name="name"
                defaultValue={c.name}
                className="flex-1 rounded border border-transparent px-2 py-1 hover:border-charcoal/20 focus:border-charcoal/40"
              />
              <button className="text-xs font-semibold text-sage">Guardar</button>
            </form>
            <form action={deleteCategory}>
              <input type="hidden" name="id" value={c.id} />
              <button className="text-xs font-semibold text-terracotta">Eliminar</button>
            </form>
          </li>
        ))}
        {!categories?.length && <p className="text-charcoal/50">Todavía no hay categorías.</p>}
      </ul>
    </div>
  );
}
