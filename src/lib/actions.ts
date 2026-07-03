import type { SupabaseClient } from "@supabase/supabase-js";
import { slugify } from "@/lib/slug";

export type ActionState = { ok: boolean; message: string } | null;

/**
 * Genera un slug único para evitar el error de la restricción UNIQUE
 * (que de otro modo haría fallar el guardado en silencio). Agrega un
 * sufijo -2, -3, ... si el slug base ya existe.
 */
export async function makeUniqueSlug(
  supabase: SupabaseClient,
  opts: {
    table: "products" | "categories";
    name: string;
    categoryId?: string;
    excludeId?: string;
  }
): Promise<string> {
  const base = slugify(opts.name) || (opts.table === "products" ? "producto" : "categoria");
  let slug = base;

  for (let n = 2; n < 1000; n++) {
    let query = supabase.from(opts.table).select("id").eq("slug", slug).limit(1);
    if (opts.categoryId) query = query.eq("category_id", opts.categoryId);
    if (opts.excludeId) query = query.neq("id", opts.excludeId);

    const { data } = await query;
    if (!data || data.length === 0) return slug;
    slug = `${base}-${n}`;
  }

  return `${base}-${Date.now()}`;
}
