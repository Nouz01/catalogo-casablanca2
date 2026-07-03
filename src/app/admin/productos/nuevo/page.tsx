import { createClient } from "@/lib/supabase/server";
import { createProduct } from "../actions";
import { ProductFormFields } from "@/components/ProductFormFields";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Nuevo producto</h1>
      <form action={createProduct} className="flex max-w-xl flex-col gap-4">
        <ProductFormFields categories={categories ?? []} />
        <button className="w-fit rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-cream">
          Crear producto
        </button>
      </form>
      <p className="mt-4 text-sm text-charcoal/50">
        Después de crear el producto vas a poder subirle las fotos.
      </p>
    </div>
  );
}
