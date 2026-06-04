import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpecForge — Especifique. Forje. Gere.",
  description:
    "Gere specs (Spec-Driven Development) e harness para seus agentes de IA em minutos. Especifique. Forje. Gere.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
