// BYOK (Bring Your Own Key): a chave Anthropic do usuário fica APENAS no
// navegador. A geração roda no cliente (browser → Anthropic), então a chave
// nunca passa por servidor nosso.
//
// Dois modos de armazenamento, escolhidos pela usuária:
// - "local"  → localStorage: persiste entre sessões (cômodo).
// - "session"→ sessionStorage: some ao fechar a aba (mais seguro).

const STORAGE_KEY = "sddh_anthropic_key";
const MODE_KEY = "sddh_key_mode";

export type KeyMode = "local" | "session";

/** Checagem leve de formato — a validação real é a própria chamada à IA. */
export function looksLikeAnthropicKey(key: string): boolean {
  const k = key.trim();
  return k.startsWith("sk-ant-") && k.length >= 20;
}

/** Modo de armazenamento preferido (lembrado entre sessões). */
export function getKeyMode(): KeyMode {
  if (typeof window === "undefined") return "local";
  try {
    return window.localStorage.getItem(MODE_KEY) === "session" ? "session" : "local";
  } catch {
    return "local";
  }
}

/** Lê a chave de onde estiver (sessão tem prioridade sobre permanente). */
export function getStoredKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.sessionStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(STORAGE_KEY)
    );
  } catch {
    return null;
  }
}

/** Salva a chave no armazenamento do modo escolhido, limpando o outro. */
export function setStoredKey(key: string, mode: KeyMode = "local"): void {
  if (typeof window === "undefined") return;
  const k = key.trim();
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
    if (mode === "session") {
      window.sessionStorage.setItem(STORAGE_KEY, k);
    } else {
      window.localStorage.setItem(STORAGE_KEY, k);
    }
    window.localStorage.setItem(MODE_KEY, mode);
  } catch {
    // ignora indisponibilidade de storage
  }
}

/** Remove a chave dos dois armazenamentos. */
export function clearStoredKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}
