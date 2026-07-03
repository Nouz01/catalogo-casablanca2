import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { updateSettings } from "./actions";
import { LogoUploader } from "@/components/LogoUploader";
import { storagePublicUrl } from "@/lib/images";

export const dynamic = "force-dynamic";

export default async function AjustesPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("settings")
    .select("brand_name, whatsapp_number, logo_path")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="flex max-w-xl flex-col gap-10">
      <div>
        <h1 className="mb-6 text-2xl font-bold">Ajustes</h1>
        <form action={updateSettings} className="flex flex-col gap-4">
          <label className="text-sm">
            Nombre de la marca
            <input
              name="brand_name"
              defaultValue={settings?.brand_name ?? "Casablanca"}
              className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
            />
          </label>
          <label className="text-sm">
            WhatsApp de contacto (con código de país, ej. 5493511234567)
            <input
              name="whatsapp_number"
              defaultValue={settings?.whatsapp_number ?? ""}
              className="mt-1 w-full rounded-lg border border-charcoal/20 px-3 py-2"
            />
          </label>
          <button className="w-fit rounded-lg bg-charcoal px-4 py-2 text-sm font-semibold text-cream">
            Guardar
          </button>
        </form>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-bold">Logo</h2>
        {settings?.logo_path && (
          <div className="relative mb-4 h-20 w-40">
            <Image
              src={storagePublicUrl("branding", settings.logo_path)}
              alt="Logo actual"
              fill
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
        )}
        <LogoUploader />
      </div>
    </div>
  );
}
