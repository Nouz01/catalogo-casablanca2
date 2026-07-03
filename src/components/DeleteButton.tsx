"use client";

import { useFormStatus } from "react-dom";

export function DeleteButton({
  confirmMessage,
  children,
  className = "",
  pendingText = "Borrando…",
}: {
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      className={`font-semibold text-terracotta transition active:scale-[0.98] disabled:opacity-60 ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
