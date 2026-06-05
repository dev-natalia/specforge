"use client";

// Navegação anterior/próximo no rodapé de cada página de docs.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCS_ORDER } from "@/lib/docs/nav";

export function DocPager() {
  const pathname = usePathname();
  const index = DOCS_ORDER.findIndex((l) => l.href === pathname);
  if (index === -1) return null;
  const prev = index > 0 ? DOCS_ORDER[index - 1] : null;
  const next = index < DOCS_ORDER.length - 1 ? DOCS_ORDER[index + 1] : null;

  return (
    <div className="mt-12 flex items-center justify-between border-t border-slate-200 pt-6">
      {prev ? (
        <Link href={prev.href} className="text-sm text-brand-700 hover:underline">
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link href={next.href} className="text-sm text-brand-700 hover:underline">
          {next.label} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  );
}
