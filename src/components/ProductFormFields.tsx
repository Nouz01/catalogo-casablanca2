export function ProductFormFields({
  categories,
  defaultValues,
}: {
  categories: { id: string; name: string }[];
  defaultValues?: {
    name?: string;
    category_id?: string;
    price?: number | null;
    detalles?: string | null;
    beneficios?: string | null;
    caracteristicas?: string | null;
  };
}) {
  return (
    <>
      <label className="text-sm">
        Nombre
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        Categoría
        <select
          name="category_id"
          required
          defaultValue={defaultValues?.category_id ?? ""}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        >
          <option value="" disabled>
            Elegir categoría
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Precio
        <input
          type="number"
          step="0.01"
          name="price"
          defaultValue={defaultValues?.price ?? undefined}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        Detalles
        <textarea
          name="detalles"
          defaultValue={defaultValues?.detalles ?? undefined}
          rows={2}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        Beneficios
        <textarea
          name="beneficios"
          defaultValue={defaultValues?.beneficios ?? undefined}
          rows={2}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
      <label className="text-sm">
        Características
        <textarea
          name="caracteristicas"
          defaultValue={defaultValues?.caracteristicas ?? undefined}
          rows={2}
          className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
        />
      </label>
    </>
  );
}
