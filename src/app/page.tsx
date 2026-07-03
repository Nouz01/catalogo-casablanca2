import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductSlide } from "@/components/ProductSlide";
import { storagePublicUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

const DEFAULT_LOGO = "/brand/casablanca-logo-white.png";

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
                logoUrl={logoUrl}
                whatsappNumber={whatsappNumber}
              />
            </section>
          );
        }
      )}
    </main>
  );
}
