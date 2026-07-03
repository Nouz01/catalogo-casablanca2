/**
 * Normaliza una relación embebida de Supabase que puede venir como objeto
 * (relación to-one) o como array, y devuelve el primer/único elemento.
 */
export function relOne<T>(rel: T | T[] | null | undefined): T | null {
  if (!rel) return null;
  return Array.isArray(rel) ? (rel[0] ?? null) : rel;
}
