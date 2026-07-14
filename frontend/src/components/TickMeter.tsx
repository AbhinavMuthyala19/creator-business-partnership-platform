import clsx from "clsx";

interface TickMeterProps {
  value: number;
  max: number;
  ticks?: number;
  label?: string;
  accent?: "signal" | "gold";
  className?: string;
}

/** A segmented tick-mark gauge used for follower counts and other at-a-glance scores. */
export function TickMeter({ value, max, ticks = 12, label, accent = "signal", className }: TickMeterProps) {
  const ratio = max > 0 ? Math.min(1, Math.max(0, value / max)) : 0;
  const filledTicks = Math.round(ratio * ticks);

  const accentClass = accent === "gold" ? "bg-gold-400" : "bg-signal-500";

  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      {label && (
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>{label}</span>
        </div>
      )}
      <div className="flex h-4 items-end gap-[2px]">
        {Array.from({ length: ticks }).map((_, i) => (
          <span
            key={i}
            className={clsx(
              "w-[3px] rounded-[1px] transition-colors",
              i % 4 === 0 ? "h-full" : "h-[60%]",
              i < filledTicks ? accentClass : "bg-ink-100",
            )}
          />
        ))}
      </div>
    </div>
  );
}
