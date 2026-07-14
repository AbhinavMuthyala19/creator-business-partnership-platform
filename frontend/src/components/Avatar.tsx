import clsx from "clsx";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const palette = [
  "bg-signal-soft text-signal-deep",
  "bg-gold-soft text-gold-deep",
  "bg-alert-soft text-alert-deep",
  "bg-danger-soft text-danger-deep",
];

export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const paletteIndex = name.length % palette.length;
  return (
    <span
      className={clsx("flex shrink-0 items-center justify-center rounded-avatar font-display font-semibold", palette[paletteIndex], className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initialsFrom(name) || "?"}
    </span>
  );
}
