interface Props {
  percent: number;
  /** Always pass a translated label — there is no built-in default. */
  label: string;
  indeterminate?: boolean;
}

export default function ProgressBar({ percent, label, indeterminate }: Props) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div className="rounded-xl border-[3px] border-ink bg-white px-3.5 py-3 shadow-brutal-sm">
      <div className="mb-1.5 flex justify-between font-display text-xs font-bold text-ink">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sun ring-2 ring-ink" />
          {label}
        </span>
        {!indeterminate && <span>{clamped}%</span>}
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full border-2 border-ink bg-paper">
        <div
          className={`h-full bg-sun transition-[width] duration-300 ${
            indeterminate ? "w-full animate-pulse" : ""
          }`}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
