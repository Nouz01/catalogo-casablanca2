import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductSlide } from "@/components/ProductSlide";
import { LongPressAdminGate } from "@/components/LongPressAdminGate";
import { storagePublicUrl } from "@/lib/images";

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
    .select("id")
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
    <LongPressAdminGate>
      <main className="flex h-dvh w-full justify-center bg-charcoal">
        <ProductSlide
          product={{ ...prod, images }}
          brandName={settings?.brand_name ?? "Casablanca"}
          logoUrl={logoUrl}
          whatsappNumber={settings?.whatsapp_number ?? null}
        />
      </main>
    </LongPressAdminGate>
  );
}
