"use client";

export function QuantityStepper({
  value,
  onChange,
  label,
  min = 1,
  max = 12,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
  min?: number;
  max?: number;
}) {
  return (
    <div
      className="inline-flex items-center border border-ink/20"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid h-8 w-8 place-items-center text-ink/70 transition-colors hover:bg-ink/6 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M1 5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
      <span
        className="min-w-7 text-center text-sm tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid h-8 w-8 place-items-center text-ink/70 transition-colors hover:bg-ink/6 hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
