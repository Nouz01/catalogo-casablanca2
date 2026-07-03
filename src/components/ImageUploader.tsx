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
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    setProgress({ done: 0, total: files.length });
    const supabase = createClient();

    try {
      const fileArray = Array.from(files);
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const compressed = await imageCompression(file, {
          maxSizeMB: 2,
          maxWidthOrHeight: 2400,
          useWebWorker: true,
        });

        const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${productId}/${crypto.randomUUID()}.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(path, compressed, { contentType: compressed.type || file.type });

        if (uploadError) throw uploadError;

        const fd = new FormData();
        fd.set("product_id", productId);
        fd.set("path", path);
        await addProductImage(fd);
        setProgress({ done: i + 1, total: fileArray.length });
      }
      router.refresh();
    } catch (err) {
      setError("No se pudieron subir algunas fotos. Probá de nuevo.");
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(null);
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
        {uploading && progress
          ? `Subiendo ${progress.done} de ${progress.total}…`
          : "📷 Subir fotos"}
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
      {error && <p className="mt-2 text-base font-semibold text-terracotta">{error}</p>}
    </div>
  );
}
