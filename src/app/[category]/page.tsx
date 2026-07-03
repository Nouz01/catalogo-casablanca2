import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("slug", category)
    .maybeSingle();

  if (!cat) notFound();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, slug, price, sort_order, product_images(path, sort_order)")
    .eq("category_id", cat.id)
    .order("sort_order", { ascending: true });

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <h1 className="mb-8 text-3xl font-extrabold">{cat.name}</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products?.map(
          (p: {
            id: string;
            slug: string;
            name: string;
            price: number | null;
            product_images: { path: string; sort_order: number }[];
          }) => {
            const cover = [...(p.product_images ?? [])].sort(
              (a, b) => a.sort_order - b.sort_order
            )[0];
            return (
              <ProductCard
                key={p.id}
                categorySlug={cat.slug}
                slug={p.slug}
                name={p.name}
                price={p.price}
                imagePath={cover?.path ?? null}
              />
            );
          }
        )}
        {!products?.length && (
          <p className="col-span-full text-charcoal/50">
            Todavía no hay productos en esta categoría.
          </p>
        )}
      </div>
    </main>
  );
}
