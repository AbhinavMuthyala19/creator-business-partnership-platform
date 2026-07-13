import { Link } from "react-router-dom";
import type { BusinessProfile } from "@/types";

export function BusinessCard({ business }: { business: BusinessProfile }) {
  return (
    <Link
      to={`/businesses/${business.id}`}
      className="card-surface group flex flex-col gap-4 p-5 hover:-translate-y-0.5"
    >
      <div className="flex items-center gap-3">
        {business.logoUrl ? (
          <img src={business.logoUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-signal-50 font-display text-lg font-semibold text-signal-700">
            {business.companyName[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold text-ink-900 group-hover:text-signal-700">
            {business.companyName}
          </h3>
          {business.industry && <p className="text-xs uppercase tracking-wide text-ink-400">{business.industry}</p>}
        </div>
      </div>
      {business.description && <p className="line-clamp-3 text-sm text-ink-500">{business.description}</p>}
      <div className="mt-auto flex items-center justify-between pt-1">
        <span className="text-xs font-medium text-signal-600 group-hover:text-signal-700">View profile &amp; apply →</span>
      </div>
    </Link>
  );
}
