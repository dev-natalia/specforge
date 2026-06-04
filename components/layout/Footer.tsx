import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} SpecForge</p>
        <div className="flex gap-4">
          <Link href="/docs" className="hover:text-slate-900">
            Docs
          </Link>
          <Link href="/" className="hover:text-slate-900">
            Início
          </Link>
        </div>
      </div>
    </footer>
  );
}
