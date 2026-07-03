const inputClass =
  "mt-1.5 w-full rounded-xl border border-charcoal/20 bg-white px-4 py-3 text-base outline-none focus:border-gold";

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
      <label className="block text-base font-bold">
        Nombre del producto
        <input
          name="name"
          required
          defaultValue={defaultValues?.name}
          placeholder="Ej. Acolchado Oro"
          className={inputClass}
        />
      </label>

      <label className="block text-base font-bold">
        Categoría
        <select
          name="category_id"
          required
          defaultValue={defaultValues?.category_id ?? ""}
          className={inputClass}
        >
          <option value="" disabled>
            Elegir categoría…
          </option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-base font-bold">
        Precio
        <input
          type="number"
          inputMode="decimal"
          step="0.01"
          name="price"
          defaultValue={defaultValues?.price ?? undefined}
          placeholder="Ej. 20000"
          className={inputClass}
        />
      </label>

      <div className="rounded-2xl bg-charcoal/[0.03] p-4">
        <p className="mb-3 text-sm font-semibold text-charcoal/50">
          Estos textos aparecen junto al producto (podés dejarlos vacíos)
        </p>
        <div className="flex flex-col gap-4">
          <label className="block text-base font-bold">
            Detalles
            <input
              name="detalles"
              defaultValue={defaultValues?.detalles ?? undefined}
              placeholder="Ej. 2 plazas"
              className={inputClass}
            />
          </label>
          <label className="block text-base font-bold">
            Beneficios
            <input
              name="beneficios"
              defaultValue={defaultValues?.beneficios ?? undefined}
              placeholder="Ej. Bien abrigado"
              className={inputClass}
            />
          </label>
          <label className="block text-base font-bold">
            Características
            <input
              name="caracteristicas"
              defaultValue={defaultValues?.caracteristicas ?? undefined}
              placeholder="Ej. Relleno de guata"
              className={inputClass}
            />
          </label>
        </div>
      </div>
    </>
  );
}
