import { createClient } from "@/lib/supabase/server";
import { CreateCategoryForm } from "@/components/CreateCategoryForm";
import { CategoryRow } from "@/components/CategoryRow";

export const dynamic = "force-dynamic";

type CategoryRowData = {
  id: string;
  name: string;
  products: { count: number }[];
};

export default async function CategoriasPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, products(count)")
    .order("sort_order", { ascending: true });

  const list = (categories ?? []) as CategoryRowData[];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold">Categorías</h1>
      <p className="mb-5 text-charcoal/60">
        Agrupan los productos (ej. Sábanas, Acolchados, Toallas).
      </p>

      <CreateCategoryForm />

      <ul className="flex flex-col gap-3">
        {list.map((c) => (
          <CategoryRow
            key={c.id}
            id={c.id}
            name={c.name}
            productCount={c.products?.[0]?.count ?? 0}
          />
        ))}
        {list.length === 0 && (
          <p className="text-base text-charcoal/50">Todavía no hay categorías.</p>
        )}
      </ul>
    </div>
  );
}
