import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductSlide } from "@/components/ProductSlide";
import { storagePublicUrl } from "@/lib/images";
import { CATEGORY_PILL_CLASS } from "@/lib/ui";

export const dynamic = "force-dynamic";

const DEFAULT_LOGO = "/brand/casablanca-logo-white.png";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category, product } = await params;
  const supabase = await createClient();

  const { data: cat } = await supabase
    .from("categories")
    .select("id, name")
    .eq("slug", category)
    .maybeSingle();
  if (!cat) notFound();

  const { data: prod } = await supabase
    .from("products")
    .select(
      "id, name, price, detalles, beneficios, caracteristicas, product_images(id, path, sort_order)"
    )
    .eq("category_id", cat.id)
    .eq("slug", product)
    .maybeSingle();
  if (!prod) notFound();

  const { data: settings } = await supabase
    .from("settings")
    .select("whatsapp_number, brand_name, logo_path")
    .eq("id", 1)
    .maybeSingle();

  const images = [...(prod.product_images ?? [])].sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  const logoUrl = settings?.logo_path
    ? storagePublicUrl("branding", settings.logo_path)
    : DEFAULT_LOGO;

  return (
    <main className="relative flex h-dvh w-full justify-center bg-charcoal">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex justify-center">
        <div className="flex w-full max-w-[520px] justify-end p-4">
          <Link href="/" className={`pointer-events-auto active:scale-95 ${CATEGORY_PILL_CLASS}`}>
            {cat.name}
          </Link>
        </div>
      </div>
      <ProductSlide
        product={{ ...prod, images }}
        brandName={settings?.brand_name ?? "Casablanca"}
        logoUrl={logoUrl}
        whatsappNumber={settings?.whatsapp_number ?? null}
        priority
      />
    </main>
  );
}
