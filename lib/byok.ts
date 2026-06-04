// BYOK (Bring Your Own Key): a chave Anthropic do usuário fica APENAS no
// navegador (localStorage). A geração roda no cliente (browser → Anthropic),
// então a chave nunca passa por servidor nosso.

const STORAGE_KEY = "sddh_anthropic_key";

/** Checagem leve de formato — a validação real é a própria chamada à IA. */
export function looksLikeAnthropicKey(key: string): boolean {
  const k = key.trim();
  return k.startsWith("sk-ant-") && k.length >= 20;
}

export function getStoredKey(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredKey(key: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, key.trim());
  } catch {
    // ignora indisponibilidade de storage
  }
}

export function clearStoredKey(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}
