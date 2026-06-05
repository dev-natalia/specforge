import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="SpecForge — início"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/specforge-icon.png" alt="" className="h-9 w-auto" />
          <span className="text-2xl font-extrabold tracking-tight">
            <span className="text-slate-900">spec</span>
            <span className="text-violet-500">forge</span>
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Projetos
          </Link>
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
          <Link href="/projects">
            <Button size="sm">Abrir workspace</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
