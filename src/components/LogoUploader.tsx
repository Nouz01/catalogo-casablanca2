"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import { updateLogo } from "@/app/admin/ajustes/actions";

export function LogoUploader() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    try {
      const compressed = await imageCompression(file, {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      });
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("branding")
        .upload(path, compressed, { contentType: compressed.type || file.type, upsert: true });
      if (uploadError) throw uploadError;

      const fd = new FormData();
      fd.set("path", path);
      await updateLogo(fd);
      router.refresh();
    } catch (err) {
      setError("No se pudo subir el logo. Probá de nuevo.");
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label
        className={`flex min-h-[60px] cursor-pointer items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-lg font-bold ${
          uploading
            ? "border-charcoal/20 text-charcoal/40"
            : "border-gold/60 text-charcoal active:scale-[0.99]"
        }`}
      >
        {uploading ? "Subiendo…" : "📷 Cambiar logo"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          disabled={uploading}
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-base font-semibold text-terracotta">{error}</p>}
    </div>
  );
}
