import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "./actions";
import { DeleteButton } from "@/components/DeleteButton";
import { storagePublicUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

type ProductRow = {
  id: string;
  name: string;
  price: number | null;
  sort_order: number;
  categories: { name: string }[] | null;
  product_images: { path: string; sort_order: number }[];
};

export default async function ProductosPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, sort_order, categories(name), product_images(path, sort_order)")
    .order("sort_order", { ascending: true });

  const list = (products ?? []) as ProductRow[];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold">Productos</h1>
      <p className="mb-5 text-charcoal/60">
        {list.length === 0
          ? "Todavía no cargaste ningún producto."
          : `${list.length} ${list.length === 1 ? "producto" : "productos"} en el catálogo`}
      </p>

      <Link
        href="/admin/productos/nuevo"
        className="mb-6 flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-gold text-lg font-extrabold text-charcoal shadow-sm active:scale-[0.99]"
      >
        + Agregar producto
      </Link>

      <ul className="flex flex-col gap-3">
        {list.map((p) => {
          const cover = [...(p.product_images ?? [])].sort(
            (a, b) => a.sort_order - b.sort_order
          )[0];
          return (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-charcoal/10 bg-white p-3"
            >
              <div className="relative h-20 w-20 flex-none overflow-hidden rounded-xl bg-charcoal/5">
                {cover ? (
                  <Image
                    src={storagePublicUrl("product-images", cover.path)}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[10px] uppercase text-charcoal/30">
                    Sin foto
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate text-lg font-bold">{p.name}</div>
                <div className="text-sm text-charcoal/50">
                  {p.categories?.[0]?.name ?? "Sin categoría"}
                  {p.price != null ? ` · $${p.price.toLocaleString("es-AR")}` : ""}
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <Link
                    href={`/admin/productos/${p.id}`}
                    className="rounded-lg bg-charcoal/5 px-4 py-2 text-sm font-bold text-charcoal active:scale-95"
                  >
                    Editar
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <DeleteButton
                      confirmMessage={`¿Borrar "${p.name}"? Esta acción no se puede deshacer.`}
                      className="px-2 py-2 text-sm"
                    >
                      Borrar
                    </DeleteButton>
                  </form>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
