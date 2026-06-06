import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpecForge — Especifique. Forje. Gere.",
  description:
    "Gere specs (Spec-Driven Development) e harness para seus agentes de IA em minutos. Especifique. Forje. Gere.",
};

// Content-Security-Policy (defesa em profundidade). Aplicada só em produção
// (o dev usa eval/websocket para HMR). `connect-src` restringe a saída de dados
// ao próprio site e à Anthropic — limita exfiltração da chave mesmo sob XSS.
// O export é estático, então a CSP vai por <meta> (sem servidor para headers).
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.anthropic.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        {process.env.NODE_ENV === "production" && (
          <meta httpEquiv="Content-Security-Policy" content={CSP} />
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
