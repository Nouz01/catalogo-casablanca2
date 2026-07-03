"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";

function readProductFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category_id = String(formData.get("category_id") ?? "");
  const priceRaw = String(formData.get("price") ?? "");
  const price = priceRaw ? Number(priceRaw) : null;
  const detalles = String(formData.get("detalles") ?? "").trim() || null;
  const beneficios = String(formData.get("beneficios") ?? "").trim() || null;
  const caracteristicas = String(formData.get("caracteristicas") ?? "").trim() || null;
  return { name, category_id, price, detalles, beneficios, caracteristicas };
}

export async function createProduct(formData: FormData) {
  const fields = readProductFields(formData);
  if (!fields.name || !fields.category_id) return;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({ ...fields, slug: slugify(fields.name) })
    .select("id")
    .single();

  revalidatePath("/admin/productos");
  revalidatePath("/");

  if (!error && data) {
    redirect(`/admin/productos/${data.id}`);
  }
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id"));
  const fields = readProductFields(formData);
  if (!id || !fields.name || !fields.category_id) return;

  const supabase = await createClient();
  await supabase
    .from("products")
    .update({ ...fields, slug: slugify(fields.name) })
    .eq("id", id);

  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${id}`);
  revalidatePath("/");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id"));
  if (!id) return;
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  revalidatePath("/admin/productos");
  revalidatePath("/");
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
  revalidatePath("/");
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
  revalidatePath("/");
}
