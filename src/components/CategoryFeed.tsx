"use client";

import { useEffect, useRef, useState } from "react";
import { ProductSlide } from "@/components/ProductSlide";
import { CATEGORY_PILL_CLASS } from "@/lib/ui";

export type FeedProduct = {
  id: string;
  name: string;
  price: number | null;
  detalles: string | null;
  beneficios: string | null;
  caracteristicas: string | null;
  categoryName: string;
  images: { id: string; path: string }[];
};

export function CategoryFeed({
  products,
  brandName,
  logoUrl,
  whatsappNumber,
}: {
  products: FeedProduct[];
  brandName: string;
  logoUrl: string;
  whatsappNumber: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const categories: string[] = [];
  for (const p of products) {
    if (p.categoryName && !categories.includes(p.categoryName)) {
      categories.push(p.categoryName);
    }
  }

  const activeCategory = products[activeIndex]?.categoryName ?? "";

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        }
      },
      { threshold: 0.6 }
    );
    const els = sectionRefs.current;
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [products.length]);

  function jumpToCategory(cat: string) {
    setMenuOpen(false);
    const idx = products.findIndex((p) => p.categoryName === cat);
    if (idx >= 0) {
      sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <>
      <div className="no-scrollbar h-dvh w-full snap-y snap-mandatory overflow-y-scroll overscroll-contain bg-charcoal">
        {products.map((p, index) => (
          <section
            key={p.id}
            data-index={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="flex h-dvh w-full snap-start snap-always justify-center"
          >
            <ProductSlide
              product={{
                name: p.name,
                price: p.price,
                detalles: p.detalles,
                beneficios: p.beneficios,
                caracteristicas: p.caracteristicas,
                images: p.images,
              }}
              brandName={brandName}
              logoUrl={logoUrl}
              whatsappNumber={whatsappNumber}
              priority={index === 0}
            />
          </section>
        ))}
      </div>

      {/* Pill de categoría: fijo en pantalla, no se mueve al hacer scroll */}
      {activeCategory && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center">
          <div className="flex w-full max-w-[520px] justify-end p-4">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`pointer-events-auto active:scale-95 ${CATEGORY_PILL_CLASS}`}
            >
              {activeCategory}
            </button>
          </div>
        </div>
      )}

      {/* Selector de categorías */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 flex animate-fade items-center justify-center bg-black/80 p-6"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-3xl bg-cream p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-3 text-center text-sm font-bold uppercase tracking-widest text-charcoal/40">
              Elegí una categoría
            </p>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => jumpToCategory(cat)}
                  className={`min-h-[52px] rounded-xl px-5 text-base font-bold active:scale-[0.98] ${
                    cat === activeCategory
                      ? "bg-charcoal text-cream"
                      : "bg-charcoal/5 text-charcoal"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
