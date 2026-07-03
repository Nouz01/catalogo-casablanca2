import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, sort_order, categories(name)")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-cream"
        >
          + Nuevo producto
        </Link>
      </div>

      <ul className="flex flex-col gap-2">
        {products?.map(
          (p: {
            id: string;
            name: string;
            price: number | null;
            categories: { name: string }[] | null;
          }) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-charcoal/10 bg-white p-3"
            >
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-charcoal/50">
                  {p.categories?.[0]?.name ?? "Sin categoría"}
                  {p.price != null ? ` · $${p.price}` : ""}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/productos/${p.id}`} className="text-xs font-semibold text-sage">
                  Editar
                </Link>
                <form action={deleteProduct}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-xs font-semibold text-terracotta">Eliminar</button>
                </form>
              </div>
            </li>
          )
        )}
        {!products?.length && <p className="text-charcoal/50">Todavía no hay productos.</p>}
      </ul>
    </div>
  );
}
