"use client";

import { useActionState } from "react";
import { createProduct } from "@/app/admin/productos/actions";
import { ProductFormFields } from "@/components/ProductFormFields";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/FormMessage";
import type { ActionState } from "@/lib/actions";

export function CreateProductForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(createProduct, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <ProductFormFields categories={categories} />
      <FormMessage state={state} />
      <SubmitButton pendingText="Creando…">Crear producto</SubmitButton>
      <p className="text-center text-sm text-charcoal/50">
        Después de crearlo vas a poder subirle las fotos.
      </p>
    </form>
  );
}
