import clsx from "clsx";
import type { ApplicationStatus, CampaignStatus, ContentStatus, KycStatus, PayoutStatus } from "@/types";

type Status = ApplicationStatus | ContentStatus | CampaignStatus | KycStatus | PayoutStatus;

const styles: Record<Status, string> = {
  PENDING: "bg-ink-100 text-ink-600",
  SUBMITTED: "bg-signal-100 text-signal-700",
  CHANGES_REQUESTED: "bg-gold-100 text-gold-700",
  DRAFT: "bg-ink-100 text-ink-500",
  APPROVED: "bg-emerald-100 text-emerald-700",
  REJECTED: "bg-alert-100 text-alert-700",
  PUBLISHED: "bg-ink-900 text-paper-50",
  ACTIVE: "bg-emerald-100 text-emerald-700",
  CLOSED: "bg-ink-100 text-ink-500",
  VERIFIED: "bg-emerald-100 text-emerald-700",
  BELOW_THRESHOLD: "bg-ink-100 text-ink-500",
  PENDING_KYC: "bg-gold-100 text-gold-700",
  PAYABLE: "bg-signal-100 text-signal-700",
  PAID: "bg-emerald-100 text-emerald-700",
};

const labels: Record<Status, string> = {
  PENDING: "Pending",
  SUBMITTED: "Submitted",
  CHANGES_REQUESTED: "Changes requested",
  DRAFT: "Draft",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  PUBLISHED: "Published",
  ACTIVE: "Active",
  CLOSED: "Closed",
  VERIFIED: "Verified",
  BELOW_THRESHOLD: "Below threshold",
  PENDING_KYC: "Awaiting KYC",
  PAYABLE: "Payable",
  PAID: "Paid",
};

const dotStyles: Record<Status, string> = {
  PENDING: "bg-ink-400",
  SUBMITTED: "bg-signal-500",
  CHANGES_REQUESTED: "bg-gold-500",
  DRAFT: "bg-ink-300",
  APPROVED: "bg-emerald-500",
  REJECTED: "bg-alert-500",
  PUBLISHED: "bg-gold-400",
  ACTIVE: "bg-emerald-500",
  CLOSED: "bg-ink-300",
  VERIFIED: "bg-emerald-500",
  BELOW_THRESHOLD: "bg-ink-300",
  PENDING_KYC: "bg-gold-500",
  PAYABLE: "bg-signal-500",
  PAID: "bg-emerald-500",
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
