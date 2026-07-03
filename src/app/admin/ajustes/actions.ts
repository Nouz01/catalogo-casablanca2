"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSettings(formData: FormData) {
  const brand_name = String(formData.get("brand_name") ?? "Casablanca").trim();
  const whatsapp_number = String(formData.get("whatsapp_number") ?? "").trim() || null;

  const supabase = await createClient();
  await supabase
    .from("settings")
    .update({ brand_name, whatsapp_number, updated_at: new Date().toISOString() })
    .eq("id", 1);

  revalidatePath("/", "layout");
  revalidatePath("/admin/ajustes");
}

export async function updateLogo(formData: FormData) {
  const path = String(formData.get("path") ?? "");
  if (!path) return;
  const supabase = await createClient();
  await supabase.from("settings").update({ logo_path: path }).eq("id", 1);
  revalidatePath("/", "layout");
  revalidatePath("/admin/ajustes");
}
