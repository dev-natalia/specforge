"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import {
  getStoredKey,
  setStoredKey,
  clearStoredKey,
  looksLikeAnthropicKey,
  getKeyMode,
  type KeyMode,
} from "@/lib/byok";
import { anthropicProvider } from "@/lib/providers/anthropic";

function maskKey(key: string): string {
  if (key.length <= 12) return "sk-ant-••••";
  return `${key.slice(0, 10)}••••${key.slice(-4)}`;
}

interface ApiKeySettingsProps {
  // Chamado quando a chave é salva ou removida (para gates reagirem).
  onChange?: () => void;
}

export function ApiKeySettings({ onChange }: ApiKeySettingsProps = {}) {
  const [storedKey, setStored] = useState<string | null>(null);
  const [storedMode, setStoredMode] = useState<KeyMode>("local");
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<KeyMode>("local");
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState<{
    kind: "ok" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    setStored(getStoredKey());
    const m = getKeyMode();
    setStoredMode(m);
    setMode(m);
  }, []);

  async function handleSave() {
    setMessage(null);
    const key = input.trim();
    if (!looksLikeAnthropicKey(key)) {
      setMessage({
        kind: "error",
        text: "A chave deve começar com sk-ant- e ter o formato correto.",
      });
      return;
    }
    setTesting(true);
    try {
      await anthropicProvider.validateKey(key);
      setStoredKey(key, mode);
      setStored(key);
      setStoredMode(mode);
      setInput("");
      setMessage({
        kind: "ok",
        text:
          mode === "session"
            ? "Chave validada e guardada só nesta sessão (some ao fechar a aba)."
            : "Chave validada e guardada neste navegador.",
      });
      onChange?.();
    } catch (err) {
      setMessage({
        kind: "error",
        text: err instanceof Error ? err.message : "Chave inválida.",
      });
    } finally {
      setTesting(false);
    }
  }

  function handleRemove() {
    clearStoredKey();
    setStored(null);
    setMessage({ kind: "ok", text: "Chave removida deste navegador." });
    onChange?.();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Chave da Anthropic</h2>
            {storedKey ? (
              <Badge variant="success">Ativa</Badge>
            ) : (
              <Badge variant="neutral">Não configurada</Badge>
            )}
          </div>

          <p className="text-sm text-slate-600">
            O SpecForge usa a sua própria chave da Anthropic para gerar — você
            paga a Anthropic direto. Sem ela não é possível gerar specs nem
            harness.
          </p>

          <div className="space-y-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <p>
              🔒 A chave fica <strong>só neste navegador</strong> (não é gravada
              em lugar nenhum do nosso lado).
            </p>
            <p>
              A geração acontece <strong>direto do seu navegador</strong> para a
              Anthropic — a chave <strong>não passa por nenhum servidor nosso</strong>.
            </p>
            <p>
              💡 <strong>Dica de segurança:</strong> use uma chave com{" "}
              <strong>limite de gasto</strong> e rotacione de tempos em tempos. Como toda
              app que chama a IA do navegador, a chave fica legível pelo JavaScript deste
              site — o modo <strong>&quot;só nesta sessão&quot;</strong> reduz a exposição.
            </p>
          </div>

          {storedKey ? (
            <div className="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-slate-700">{maskKey(storedKey)}</span>
                <Badge variant="neutral">
                  {storedMode === "session" ? "só nesta sessão" : "permanente"}
                </Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemove}>
                Remover
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Escolha de armazenamento */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Como guardar a chave?</span>
                <label className="flex cursor-pointer gap-2 rounded-md border border-slate-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="key-mode"
                    className="mt-0.5"
                    checked={mode === "local"}
                    onChange={() => setMode("local")}
                  />
                  <span>
                    <span className="font-medium text-slate-800">Manter neste navegador</span>
                    <span className="block text-xs text-slate-500">
                      Persiste entre sessões — não precisa colar de novo a cada vez. Fica no
                      localStorage deste navegador/dispositivo.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer gap-2 rounded-md border border-slate-200 p-3 text-sm">
                  <input
                    type="radio"
                    name="key-mode"
                    className="mt-0.5"
                    checked={mode === "session"}
                    onChange={() => setMode("session")}
                  />
                  <span>
                    <span className="font-medium text-slate-800">Só nesta sessão</span>
                    <span className="block text-xs text-slate-500">
                      Mais seguro: a chave some ao <strong>fechar a aba</strong>. Você a recola na
                      próxima vez. Nada fica gravado entre sessões.
                    </span>
                  </span>
                </label>
              </div>

              <Input
                label="Cole sua chave"
                type="password"
                placeholder="sk-ant-..."
                autoComplete="off"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <Button onClick={handleSave} disabled={testing || !input.trim()}>
                {testing && <Spinner className="h-4 w-4" />}
                {testing ? "Validando..." : "Testar e salvar"}
              </Button>
            </div>
          )}

          {message && (
            <p
              className={
                message.kind === "ok"
                  ? "text-sm text-green-700"
                  : "text-sm text-red-700"
              }
            >
              {message.text}
            </p>
          )}

          <p className="text-xs text-slate-400">
            Crie uma chave em console.anthropic.com → API Keys.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
