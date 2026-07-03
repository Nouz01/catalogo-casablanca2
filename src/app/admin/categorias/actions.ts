"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { makeUniqueSlug, type ActionState } from "@/lib/actions";

function revalidateAll() {
  revalidatePath("/admin/categorias");
  revalidatePath("/admin/productos");
  revalidatePath("/", "layout");
}

export async function createCategory(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Escribí el nombre de la categoría." };

  const supabase = await createClient();
  const slug = await makeUniqueSlug(supabase, { table: "categories", name });
  const { error } = await supabase.from("categories").insert({ name, slug });

  if (error) return { ok: false, message: "No se pudo agregar. Probá de nuevo." };

  revalidateAll();
  return { ok: true, message: `Categoría "${name}" agregada` };
}

export async function renameCategory(formData: FormData) {
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  const supabase = await createClient();
  const slug = await makeUniqueSlug(supabase, { table: "categories", name, excludeId: id });
  await supabase.from("categories").update({ name, slug }).eq("id", id);
  revalidateAll();
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();

  // Juntar las fotos de todos los productos de la categoría y borrarlas del
  // storage antes del delete (el cascade borra las filas pero no los archivos).
  const { data: prods } = await supabase.from("products").select("id").eq("category_id", id);
  const prodIds = (prods ?? []).map((p: { id: string }) => p.id);
  if (prodIds.length) {
    const { data: imgs } = await supabase
      .from("product_images")
      .select("path")
      .in("product_id", prodIds);
    const paths = (imgs ?? []).map((i: { path: string }) => i.path);
    if (paths.length) {
      await supabase.storage.from("product-images").remove(paths);
    }
  }

  await supabase.from("categories").delete().eq("id", id);
  revalidateAll();
}
