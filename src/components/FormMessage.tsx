import type { ActionState } from "@/lib/actions";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state) return null;
  return (
    <p
      className={`rounded-xl px-4 py-3 text-base font-semibold ${
        state.ok ? "bg-sage/25 text-charcoal" : "bg-terracotta/15 text-terracotta"
      }`}
    >
      {state.ok ? "✓ " : "⚠️ "}
      {state.message}
    </p>
  );
}
