"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { storagePublicUrl } from "@/lib/images";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function ProductSlide({
  product,
  brandName,
  logoUrl,
  whatsappNumber,
  priority = false,
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
  priority?: boolean;
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
            key={active.id}
            src={storagePublicUrl("product-images", active.path)}
            alt={product.name}
            fill
            sizes="520px"
            quality={85}
            className="animate-fade object-cover"
            preload={priority}
          />
        </button>
      )}

      <div className="pointer-events-none absolute left-0 top-0 flex h-[44%] w-[40%] flex-col gap-4 overflow-y-auto bg-gradient-to-b from-black via-black/70 to-transparent px-[6%] pb-10 pt-[18%] text-white">
        <div className="relative w-fit">
          <Link
            href="/login"
            aria-label="Entrar al panel"
            className="pointer-events-auto absolute bottom-full left-1/2 mb-6 block w-16 -translate-x-1/2 sm:w-20"
          >
            <Image
              src={logoUrl}
              alt={brandName}
              width={220}
              height={86}
              priority={priority}
              className="h-auto w-full"
            />
          </Link>
          <h1 className="break-words text-base font-extrabold uppercase leading-tight sm:text-2xl">
            {product.name}
          </h1>
        </div>
        <hr className="w-10 border-white/40" />
        <div className="flex flex-col gap-2 text-xs sm:text-sm">
          {product.detalles && <p className="text-white/75">{product.detalles}</p>}
          {product.beneficios && <p className="text-white/75">{product.beneficios}</p>}
          {product.caracteristicas && <p className="text-white/75">{product.caracteristicas}</p>}
        </div>
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
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-transform duration-150 active:scale-95 ${
                  i === activeIndex ? "border-white" : "border-white/30"
                }`}
              >
                <Image
                  src={storagePublicUrl("product-images", img.path)}
                  alt=""
                  fill
                  sizes="110px"
                  quality={60}
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {lightboxOpen && active && (
        <div
          className="fixed inset-0 z-50 flex animate-fade items-center justify-center bg-black/95 p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            aria-label="Cerrar"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white"
          >
            ✕
          </button>
          <div className="relative h-full w-full max-w-3xl">
            <Image
              src={storagePublicUrl("product-images", active.path)}
              alt={product.name}
              fill
              sizes="100vw"
              quality={90}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
