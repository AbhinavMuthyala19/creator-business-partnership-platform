import clsx from "clsx";

interface TabsProps<T> {
  tabs: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T>({ tabs, value, onChange, className }: TabsProps<T>) {
  return (
    <div className={clsx("flex flex-wrap gap-2 self-start rounded-[10px] bg-paper-200 p-1", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => onChange(tab.value)}
          className={clsx(
            "focus-ring rounded-[8px] px-4 py-1.5 text-sm font-medium transition-colors",
            value === tab.value ? "bg-white text-ink-900 shadow-card" : "text-ink-400 hover:text-ink-600",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
