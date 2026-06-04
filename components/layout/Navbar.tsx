import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-slate-900"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand-600 text-sm font-bold tracking-tight text-white">
            SF
          </span>
          <span>SpecForge</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/docs"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Docs
          </Link>
          <Link
            href="/settings"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Configurações
          </Link>
          <Link href="/new">
            <Button size="sm">Novo projeto</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
