import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { deleteProductImage } from "../actions";
import { EditProductForm } from "@/components/EditProductForm";
import { ImageUploader } from "@/components/ImageUploader";
import { DeleteButton } from "@/components/DeleteButton";
import { storagePublicUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const { id } = await params;
  const { nuevo } = await searchParams;
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
    <div className="flex flex-col gap-8">
      <div>
        <Link href="/admin/productos" className="mb-4 inline-block font-bold text-charcoal/60">
          ← Volver
        </Link>

        {nuevo && (
          <p className="mb-5 rounded-xl bg-sage/25 px-4 py-3 text-base font-semibold text-charcoal">
            ✓ Producto creado. Ahora subile las fotos 👇
          </p>
        )}

        <h1 className="mb-6 text-2xl font-extrabold">Editar producto</h1>
        <EditProductForm
          productId={product.id}
          categories={categories ?? []}
          defaultValues={product}
        />
      </div>

      <div>
        <h2 className="mb-1 text-xl font-extrabold">Fotos</h2>
        <p className="mb-4 text-sm text-charcoal/60">
          La primera foto es la portada. Tocá una foto para verla; usá 🗑️ para borrarla.
        </p>

        <div className="mb-4 grid grid-cols-3 gap-3">
          {images.map((img: { id: string; path: string }, index: number) => (
            <div
              key={img.id}
              className="relative aspect-square overflow-hidden rounded-xl bg-charcoal/5"
            >
              <Image
                src={storagePublicUrl("product-images", img.path)}
                alt=""
                fill
                sizes="150px"
                className="object-cover"
              />
              {index === 0 && (
                <span className="absolute left-1 top-1 rounded-md bg-gold px-2 py-0.5 text-[10px] font-bold text-charcoal">
                  Portada
                </span>
              )}
              <form action={deleteProductImage} className="absolute right-1 top-1">
                <input type="hidden" name="id" value={img.id} />
                <input type="hidden" name="product_id" value={product.id} />
                <DeleteButton
                  confirmMessage="¿Borrar esta foto?"
                  pendingText="…"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-base text-white"
                >
                  🗑️
                </DeleteButton>
              </form>
            </div>
          ))}
          {!images.length && (
            <p className="col-span-full text-base text-charcoal/50">Todavía no hay fotos.</p>
          )}
        </div>

        <ImageUploader productId={product.id} />
      </div>
    </div>
  );
}
