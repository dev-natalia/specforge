"use client";

import { useEffect, useState } from "react";
import { getStoredKey } from "@/lib/byok";
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";
import { Spinner } from "@/components/ui/Spinner";

// Gate: só libera o wizard depois que a chave da Anthropic estiver configurada.
// Se não houver chave, mostra o formulário ali mesmo (sem precisar sair da página).
export function RequireApiKey({ children }: { children: React.ReactNode }) {
  // null = ainda verificando (evita flash/mismatch de hidratação).
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  function recheck() {
    setHasKey(Boolean(getStoredKey()));
  }

  useEffect(() => {
    recheck();
  }, []);

  if (hasKey === null) {
    return (
      <div className="flex justify-center py-16 text-slate-400">
        <Spinner />
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Antes de criar um projeto, configure sua{" "}
          <strong>chave da Anthropic</strong>. As gerações usam a sua chave (você
          paga a Anthropic direto) e ela fica só no seu navegador.
        </div>
        <ApiKeySettings onChange={recheck} />
      </div>
    );
  }

  return <>{children}</>;
}
