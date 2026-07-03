"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/actions";

export async function updateSettings(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const brand_name = String(formData.get("brand_name") ?? "Casablanca").trim() || "Casablanca";
  const whatsapp_number = String(formData.get("whatsapp_number") ?? "").replace(/\D/g, "") || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("settings")
    .update({ brand_name, whatsapp_number, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) return { ok: false, message: "No se pudo guardar. Probá de nuevo." };

  revalidatePath("/", "layout");
  revalidatePath("/admin/ajustes");
  return { ok: true, message: "Cambios guardados" };
}

export async function updateLogo(formData: FormData) {
  const path = String(formData.get("path") ?? "");
  if (!path) return;
  const supabase = await createClient();
  await supabase.from("settings").update({ logo_path: path }).eq("id", 1);
  revalidatePath("/", "layout");
  revalidatePath("/admin/ajustes");
}
