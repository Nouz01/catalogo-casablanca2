import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CategoryFeed, type FeedProduct } from "@/components/CategoryFeed";
import { storagePublicUrl } from "@/lib/images";
import { relOne } from "@/lib/rel";

export const dynamic = "force-dynamic";

const DEFAULT_LOGO = "/brand/casablanca-logo-white.png";

type CategoryRel = { name: string; sort_order: number };

type RawProduct = {
  id: string;
  name: string;
  price: number | null;
  detalles: string | null;
  beneficios: string | null;
  caracteristicas: string | null;
  sort_order: number;
  categories: CategoryRel | CategoryRel[] | null;
  product_images: { id: string; path: string; sort_order: number }[];
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, price, detalles, beneficios, caracteristicas, sort_order, categories(name, sort_order), product_images(id, path, sort_order)"
    );

  const { data: settings } = await supabase
    .from("settings")
    .select("brand_name, whatsapp_number, logo_path")
    .eq("id", 1)
    .maybeSingle();

  const brandName = settings?.brand_name ?? "Casablanca";
  const whatsappNumber = settings?.whatsapp_number ?? null;
  const logoUrl = settings?.logo_path
    ? storagePublicUrl("branding", settings.logo_path)
    : DEFAULT_LOGO;

  if (!products?.length) {
    return (
      <main className="flex h-dvh items-center justify-center bg-charcoal px-6 text-center">
        <div>
          <Link href="/login" aria-label="Entrar al panel" className="mx-auto mb-4 block w-32">
            <Image
              src={logoUrl}
              alt={brandName}
              width={220}
              height={86}
              className="mx-auto h-auto w-full"
            />
          </Link>
          <p className="text-white/60">Todavía no hay productos cargados en el catálogo.</p>
        </div>
      </main>
    );
  }

  // Agrupar por categoría (según el orden de la categoría, luego del producto)
  // para que el feed recorra una categoría completa antes de pasar a la siguiente.
  const feedProducts: FeedProduct[] = (products as RawProduct[])
    .map((p) => {
      const cat = relOne(p.categories);
      return {
        ...p,
        categoryName: cat?.name ?? "Sin categoría",
        categoryOrder: cat?.sort_order ?? 9999,
        images: [...(p.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order),
      };
    })
    .sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
      return a.sort_order - b.sort_order;
    })
    .map(({ id, name, price, detalles, beneficios, caracteristicas, categoryName, images }) => ({
      id,
      name,
      price,
      detalles,
      beneficios,
      caracteristicas,
      categoryName,
      images,
    }));

  return (
    <CategoryFeed
      products={feedProducts}
      brandName={brandName}
      logoUrl={logoUrl}
      whatsappNumber={whatsappNumber}
    />
  );
}
