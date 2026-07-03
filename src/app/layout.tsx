import type { Metadata } from "next";
import { Montserrat, Parisienne } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const parisienne = Parisienne({
  subsets: ["latin"],
  variable: "--font-parisienne",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Casablanca Hogar — Catálogo",
  description: "Catálogo digital de Casablanca Hogar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${montserrat.variable} ${parisienne.variable} antialiased`}>
      <body className="min-h-screen bg-cream font-sans text-charcoal">{children}</body>
    </html>
  );
}
