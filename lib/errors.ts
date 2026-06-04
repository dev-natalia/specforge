// Erro de aplicação usável no cliente (sem dependências de servidor).
export type AppErrorCode = "INVALID_API_KEY" | "AI_ERROR" | "INVALID_INPUT";

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = "AppError";
    this.code = code;
    if (options?.cause) this.cause = options.cause;
  }
}
