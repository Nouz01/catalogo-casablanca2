"use client";

import { useActionState } from "react";
import { updateProduct } from "@/app/admin/productos/actions";
import { ProductFormFields } from "@/components/ProductFormFields";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/FormMessage";
import type { ActionState } from "@/lib/actions";

export function EditProductForm({
  productId,
  categories,
  defaultValues,
}: {
  productId: string;
  categories: { id: string; name: string }[];
  defaultValues: {
    name?: string;
    category_id?: string;
    price?: number | null;
    detalles?: string | null;
    beneficios?: string | null;
    caracteristicas?: string | null;
  };
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateProduct, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="id" value={productId} />
      <ProductFormFields categories={categories} defaultValues={defaultValues} />
      <FormMessage state={state} />
      <SubmitButton>Guardar cambios</SubmitButton>
    </form>
  );
}
