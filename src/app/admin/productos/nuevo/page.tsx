import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateProductForm } from "@/components/CreateProductForm";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  const cats = categories ?? [];

  return (
    <div>
      <Link href="/admin/productos" className="mb-4 inline-block font-bold text-charcoal/60">
        ← Volver
      </Link>
      <h1 className="mb-6 text-2xl font-extrabold">Nuevo producto</h1>

      {cats.length === 0 ? (
        <div className="rounded-2xl border border-charcoal/10 bg-white p-6 text-center">
          <p className="mb-4 text-lg font-semibold">
            Primero tenés que crear una categoría (ej. Sábanas, Acolchados).
          </p>
          <Link
            href="/admin/categorias"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-gold px-6 text-base font-extrabold text-charcoal"
          >
            Ir a Categorías
          </Link>
        </div>
      ) : (
        <CreateProductForm categories={cats} />
      )}
    </div>
  );
}
