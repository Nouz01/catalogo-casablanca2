"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { makeUniqueSlug, type ActionState } from "@/lib/actions";

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "");
  const priceRaw = String(formData.get("price") ?? "").replace(",", ".");
  const priceNum = priceRaw ? Number(priceRaw) : null;
  const price = priceNum != null && !Number.isNaN(priceNum) ? priceNum : null;
  const detalles = String(formData.get("detalles") ?? "").trim() || null;
  const beneficios = String(formData.get("beneficios") ?? "").trim() || null;
  const caracteristicas = String(formData.get("caracteristicas") ?? "").trim() || null;
  return { name, category_id, price, detalles, beneficios, caracteristicas };
}

function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const fields = readProductFields(formData);
  if (!fields.name) return { ok: false, message: "Escribí el nombre del producto." };
  if (!fields.category_id) return { ok: false, message: "Elegí una categoría." };

  const supabase = await createClient();
  const slug = await makeUniqueSlug(supabase, {
    table: "products",
    name: fields.name,
    categoryId: fields.category_id,
  });

  const { data, error } = await supabase
    .from("products")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false, message: "No se pudo guardar. Probá de nuevo." };
  }

  revalidatePath("/admin/productos");
  revalidatePublic();
  redirect(`/admin/productos/${data.id}?nuevo=1`);
}

export async function updateProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = String(formData.get("id"));
  const fields = readProductFields(formData);
  if (!id) return { ok: false, message: "Error interno." };
  if (!fields.name) return { ok: false, message: "Escribí el nombre del producto." };
  if (!fields.category_id) return { ok: false, message: "Elegí una categoría." };

  const supabase = await createClient();
  const slug = await makeUniqueSlug(supabase, {
    table: "products",
    name: fields.name,
    categoryId: fields.category_id,
    excludeId: id,
  });

  const { error } = await supabase
    .from("products")
    .update({ ...fields, slug })
    .eq("id", id);

  if (error) return { ok: false, message: "No se pudo guardar. Probá de nuevo." };

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidatePublic();
  return { ok: true, message: "Cambios guardados" };
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();

  // Borrar primero las fotos del storage para no dejar archivos huérfanos.
  const { data: imgs } = await supabase
    .from("product_images")
    .select("path")
    .eq("product_id", id);
  const paths = (imgs ?? []).map((i: { path: string }) => i.path);
  if (paths.length) {
    await supabase.storage.from("product-images").remove(paths);
  }

  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/productos");
  revalidatePublic();
}

export async function addProductImage(formData: FormData) {
  const product_id = String(formData.get("product_id"));
  const path = String(formData.get("path"));
  if (!product_id || !path) return;

  const supabase = await createClient();
  const { count } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .eq("product_id", product_id);

  await supabase.from("product_images").insert({
    product_id,
    path,
    sort_order: count ?? 0,
  });

  revalidatePath(`/admin/productos/${product_id}`);
  revalidatePublic();
}

export async function deleteProductImage(formData: FormData) {
  const id = String(formData.get("id"));
  const product_id = String(formData.get("product_id"));
  if (!id) return;

  const supabase = await createClient();
  const { data: img } = await supabase
    .from("product_images")
    .select("path")
    .eq("id", id)
    .maybeSingle();

  await supabase.from("product_images").delete().eq("id", id);

  if (img?.path) {
    await supabase.storage.from("product-images").remove([img.path]);
  }

  revalidatePath(`/admin/productos/${product_id}`);
  revalidatePublic();
}
