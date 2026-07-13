import clsx from "clsx";

function initialsFrom(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const palette = [
  "bg-signal-100 text-signal-700",
  "bg-gold-100 text-gold-700",
  "bg-emerald-100 text-emerald-700",
  "bg-alert-100 text-alert-700",
];

export function Avatar({ name, size = 40, className }: { name: string; size?: number; className?: string }) {
  const paletteIndex = name.length % palette.length;
  return (
    <span
      className={clsx("flex shrink-0 items-center justify-center rounded-full font-semibold", palette[paletteIndex], className)}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {initialsFrom(name) || "?"}
    </span>
  );
}
