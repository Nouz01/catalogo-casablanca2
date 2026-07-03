"use client";

import { useActionState, useEffect, useRef } from "react";
import { createCategory } from "@/app/admin/categorias/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/FormMessage";
import type { ActionState } from "@/lib/actions";

export function CreateCategoryForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createCategory, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="mb-6 flex flex-col gap-3">
      <input
        name="name"
        required
        placeholder="Nueva categoría (ej. Toallas)"
        className="w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base outline-none focus:border-gold"
      />
      <FormMessage state={state} />
      <SubmitButton pendingText="Agregando…">+ Agregar categoría</SubmitButton>
    </form>
  );
}
