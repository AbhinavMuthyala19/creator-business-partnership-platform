import clsx from "clsx";
import type { ApplicationStatus, ContentStatus } from "@/types";

type Status = ApplicationStatus | ContentStatus;

const styles: Record<Status, string> = {
  PENDING: "bg-ink-100 text-ink-600",
  SUBMITTED: "bg-signal-100 text-signal-700",
  CHANGES_REQUESTED: "bg-gold-100 text-gold-700",
  DRAFT: "bg-ink-100 text-ink-500",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-alert-100 text-alert-700",
  PUBLISHED: "bg-ink-900 text-paper-50",
};

const labels: Record<Status, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  CHANGES_REQUESTED: "Changes requested",
  DRAFT: "Draft",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
};

const dotStyles: Record<Status, string> = {
  PENDING: "bg-ink-400",
  SUBMITTED: "bg-signal-500",
  CHANGES_REQUESTED: "bg-gold-500",
  DRAFT: "bg-ink-300",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-alert-500",
  PUBLISHED: "bg-gold-400",
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[status],
        className,
      )}
    >
      <span className={clsx("h-1.5 w-1.5 rounded-full", dotStyles[status])} />
      {labels[status]}
    </span>
  );
}
