import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { applicationsApi } from "@/api/applications";
import { StatusPill } from "@/components/StatusPill";
import { FullPageSpinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { InboxIcon } from "@/components/icons";
import { Button } from "@/components/Button";
import { Pagination } from "@/components/Pagination";
import { Link } from "react-router-dom";

export function CreatorApplicationsPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading } = useQuery({
    queryKey: ["applications", "me", page],
    queryFn: () => applicationsApi.mine(page),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">My applications</h1>
        <p className="mt-1.5 text-ink-500">Track the status of every business you've applied to.</p>
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={<InboxIcon className="h-10 w-10" />}
          title="No applications yet"
          description="Browse campaigns and submit a pitch to get started."
          action={
            <Link to="/">
              <Button size="sm">Discover campaigns</Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {data.content.map((app) => (
            <div key={app.id} className="card-surface flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <Link to={`/campaigns/${app.campaignId}`} className="font-display text-base font-semibold text-ink-900 hover:text-signal-700">
                  {app.campaignTitle}
                </Link>
                <p className="text-xs text-ink-400">{app.businessCompanyName}</p>
                <p className="mt-1 line-clamp-2 text-sm text-ink-500">{app.pitchMessage}</p>
                {app.reviewNote && (
                  <p className="mt-2 rounded-md bg-paper-100 px-2.5 py-1.5 text-xs text-ink-500">
                    <span className="font-semibold text-ink-700">Note: </span>
                    {app.reviewNote}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusPill status={app.status} />
                {app.status === "APPROVED" && (
                  <Link to="/creator/content">
                    <Button size="sm" variant="gold">
                      Submit content
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))}

          <Pagination page={data.page} totalPages={data.totalPages} last={data.last} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
