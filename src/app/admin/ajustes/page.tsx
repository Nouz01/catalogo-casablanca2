import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/SettingsForm";
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
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="mb-5 text-2xl font-extrabold">Ajustes</h1>
        <SettingsForm
          brandName={settings?.brand_name ?? "Casablanca"}
          whatsappNumber={settings?.whatsapp_number ?? ""}
        />
      </div>

      <div>
        <h2 className="mb-4 text-xl font-extrabold">Logo</h2>
        <div className="mb-4 flex h-24 items-center justify-center rounded-2xl bg-charcoal p-4">
          <div className="relative h-full w-40">
            <Image
              src={
                settings?.logo_path
                  ? storagePublicUrl("branding", settings.logo_path)
                  : "/brand/casablanca-logo-white.png"
              }
              alt="Logo actual"
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>
        </div>
        <LogoUploader />
      </div>
    </div>
  );
}
