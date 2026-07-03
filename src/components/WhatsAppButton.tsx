export function WhatsAppButton({ phone, message }: { phone: string; message: string }) {
  const href = `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex w-fit items-center justify-center rounded-full border border-white/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-charcoal sm:text-sm"
    >
      Consultar por WhatsApp
    </a>
  );
}
