import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, deleteProductImage } from "../actions";
import { ProductFormFields } from "@/components/ProductFormFields";
import { ImageUploader } from "@/components/ImageUploader";
import { storagePublicUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, category_id, price, detalles, beneficios, caracteristicas, product_images(id, path, sort_order)"
    )
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

  const images = [...(product.product_images ?? [])].sort(
    (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
  );

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Editar producto</h1>
        <form action={updateProduct} className="flex max-w-xl flex-col gap-4">
          <input type="hidden" name="id" value={product.id} />
          <ProductFormFields categories={categories ?? []} defaultValues={product} />
          <button className="w-fit rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-cream">
            Guardar cambios
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold">Fotos</h2>
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img: { id: string; path: string }) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-charcoal/5"
            >
              <Image
                src={storagePublicUrl("product-images", img.path)}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
              <form action={deleteProductImage} className="absolute right-1 top-1">
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="product_id" value={product.id} />
                <button className="rounded-full bg-black/60 px-2 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100">
                  Borrar
                </button>
              </form>
            </div>
          ))}
          {!images.length && (
            <p className="col-span-full text-sm text-charcoal/50">Todavía no hay fotos.</p>
          )}
        </div>
        <ImageUploader productId={product.id} />
      </div>
    </div>
  );
}
