import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, label, error, id, ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cn(
          "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500",
          error && "border-red-500 focus:border-red-500 focus:ring-red-500",
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
});
