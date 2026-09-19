"use client";

/** Shared underlined input used across the checkout. */
export function Field({
  id,
  label,
  error,
  className = "",
  hint,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="eyebrow block text-ink/50">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`mt-2 w-full border-b bg-transparent py-2.5 text-[0.95rem] outline-none transition-colors placeholder:text-ink/25 ${
          error
            ? "border-copper"
            : "border-ink/25 focus:border-ink"
        }`}
        {...rest}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-copper">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-ink/45">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
