import Image from "next/image";
import Link from "next/link";
import { storagePublicUrl } from "@/lib/images";

export function ProductCard({
  categorySlug,
  slug,
  name,
  price,
  imagePath,
}: {
  categorySlug: string;
  slug: string;
  name: string;
  price: number | null;
  imagePath: string | null;
}) {
  return (
    <Link
      href={`/${categorySlug}/${slug}`}
      className="group block overflow-hidden rounded-2xl bg-white/60"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/5">
        {imagePath ? (
          <Image
            src={storagePublicUrl("product-images", imagePath)}
            alt={name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-charcoal/30">
            Sin foto
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-sm font-semibold">{name}</div>
        {price != null && (
          <div className="mt-1 text-lg font-extrabold text-gold">
            ${price.toLocaleString("es-AR")}
          </div>
        )}
      </div>
    </Link>
  );
}
