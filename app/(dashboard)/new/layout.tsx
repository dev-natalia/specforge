export default function NewProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Novo projeto</h1>
      {children}
    </div>
  );
}
