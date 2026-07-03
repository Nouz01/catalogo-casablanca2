"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";
import { addProductImage } from "@/app/admin/productos/actions";

export function ImageUploader({ productId }: { productId: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();

    try {
      for (const file of Array.from(files)) {
        const compressed = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 2400,
          useWebWorker: true,
        });

        const ext = file.name.split(".").pop() || "jpg";
        const path = `${productId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, compressed, { contentType: compressed.type || file.type });

        if (uploadError) throw uploadError;

        const fd = new FormData();
        fd.set("product_id", productId);
        fd.set("path", path);
        await addProductImage(fd);
      }
      router.refresh();
    } catch (err) {
      setError("No se pudieron subir algunas fotos. Probá de nuevo.");
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="inline-block cursor-pointer rounded-lg border-2 border-dashed border-charcoal/30 px-6 py-4 text-sm font-semibold text-charcoal/70 hover:border-gold hover:text-gold">
        {uploading ? "Subiendo..." : "+ Subir fotos"}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={uploading}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>
      {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}
    </div>
  );
}
