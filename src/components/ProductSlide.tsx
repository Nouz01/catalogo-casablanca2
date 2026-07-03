"use client";

import { useState } from "react";
import Image from "next/image";
import { storagePublicUrl } from "@/lib/images";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function ProductSlide({
  product,
  brandName,
  logoUrl,
  whatsappNumber,
}: {
  product: {
    name: string;
    price: number | null;
    detalles: string | null;
    beneficios: string | null;
    caracteristicas: string | null;
    images: { id: string; path: string }[];
  };
  brandName: string;
  logoUrl: string;
  whatsappNumber: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const images = product.images;
  const active = images[activeIndex];

  return (
    <div className="relative h-full w-full max-w-[520px] bg-neutral-600">
      {active && (
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 block h-full w-full"
        >
          <Image
            src={storagePublicUrl("product-images", active.path)}
            alt={product.name}
            fill
            sizes="520px"
            quality={90}
            className="object-cover"
            preload
          />
        </button>
      )}

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-start gap-4 bg-gradient-to-r from-black/90 via-black/45 to-transparent px-[6%] pb-10 pt-[18%] text-white sm:max-w-[62%]">
        <div className="relative w-fit">
          <Image
            src={logoUrl}
            alt={brandName}
            width={220}
            height={86}
            className="pointer-events-auto absolute bottom-full left-1/2 mb-3 h-auto w-24 -translate-x-1/2 sm:w-28"
          />
          <h1 className="text-xl font-extrabold uppercase leading-tight sm:text-2xl">
            {product.name}
          </h1>
        </div>
        <hr className="w-10 border-white/40" />
        <dl className="flex flex-col gap-3 text-xs sm:text-sm">
          {product.detalles && (
            <div>
              <dt className="font-bold">Detalles</dt>
              <dd className="text-white/75">{product.detalles}</dd>
            </div>
          )}
          {product.beneficios && (
            <div>
              <dt className="font-bold">Beneficios</dt>
              <dd className="text-white/75">{product.beneficios}</dd>
            </div>
          )}
          {product.caracteristicas && (
            <div>
              <dt className="font-bold">Características</dt>
              <dd className="text-white/75">{product.caracteristicas}</dd>
            </div>
          )}
        </dl>
        <hr className="w-10 border-white/40" />
        {product.price != null && (
          <div className="text-3xl font-extrabold sm:text-4xl">
            ${product.price.toLocaleString("es-AR")}
          </div>
        )}
        {whatsappNumber && (
          <div className="pointer-events-auto w-fit">
            <WhatsAppButton
              phone={whatsappNumber}
              message={`Hola! Quería consultar por "${product.name}"`}
            />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent pb-[3%] pt-10">
          <div className="pointer-events-auto grid grid-cols-5 gap-[2%] px-[4%]">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 ${
                  i === activeIndex ? "border-white" : "border-white/30"
                }`}
              >
                <Image
                  src={storagePublicUrl("product-images", img.path)}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {lightboxOpen && active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative h-full w-full max-w-3xl">
            <Image
              src={storagePublicUrl("product-images", active.path)}
              alt={product.name}
              fill
              sizes="100vw"
              quality={95}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
