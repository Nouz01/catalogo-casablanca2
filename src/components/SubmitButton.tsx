"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "Guardando…",
  className = "",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`min-h-[52px] rounded-xl bg-charcoal px-6 text-base font-bold text-cream transition active:scale-[0.98] disabled:opacity-60 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
