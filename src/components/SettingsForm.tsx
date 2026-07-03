"use client";

import { useActionState } from "react";
import { updateSettings } from "@/app/admin/ajustes/actions";
import { SubmitButton } from "@/components/SubmitButton";
import { FormMessage } from "@/components/FormMessage";
import type { ActionState } from "@/lib/actions";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base outline-none focus:border-gold";

export function SettingsForm({
  brandName,
  whatsappNumber,
}: {
  brandName: string;
  whatsappNumber: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(updateSettings, null);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="block text-base font-bold">
        Nombre de la marca
        <input name="brand_name" defaultValue={brandName} className={inputClass} />
      </label>
      <label className="block text-base font-bold">
        WhatsApp de contacto
        <input
          name="whatsapp_number"
          inputMode="numeric"
          defaultValue={whatsappNumber}
          placeholder="Ej. 5493511234567"
          className={inputClass}
        />
        <span className="mt-1 block text-sm font-normal text-charcoal/50">
          Con código de país (54) y de área, sin 0 ni 15.
        </span>
      </label>
      <FormMessage state={state} />
      <SubmitButton>Guardar</SubmitButton>
    </form>
  );
}
