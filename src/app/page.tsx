import { createClient } from "@/lib/supabase/server";
import { ProductSlide } from "@/components/ProductSlide";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, price, detalles, beneficios, caracteristicas, sort_order, product_images(id, path, sort_order)"
    )
    .order("sort_order", { ascending: true });

  const { data: settings } = await supabase
    .from("settings")
    .select("brand_name, whatsapp_number")
    .eq("id", 1)
    .maybeSingle();

  const brandName = settings?.brand_name ?? "Casablanca";
  const whatsappNumber = settings?.whatsapp_number ?? null;

  if (!products?.length) {
    return (
      <main className="flex h-dvh items-center justify-center bg-charcoal px-6 text-center">
        <div>
          <div className="mb-4 font-script text-4xl text-gold">{brandName}</div>
          <p className="text-white/60">Todavía no hay productos cargados en el catálogo.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="h-dvh w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain bg-charcoal">
      {products.map(
        (p: {
          id: string;
          name: string;
          price: number | null;
          detalles: string | null;
          beneficios: string | null;
          caracteristicas: string | null;
          product_images: { id: string; path: string; sort_order: number }[];
        }) => {
          const images = [...(p.product_images ?? [])].sort(
            (a, b) => a.sort_order - b.sort_order
          );
          return (
            <section
              key={p.id}
              className="flex h-dvh w-full snap-start snap-always justify-center"
            >
              <ProductSlide
                product={{ ...p, images }}
                brandName={brandName}
                whatsappNumber={whatsappNumber}
              />
            </section>
          );
        }
      )}
    </main>
  );
}
