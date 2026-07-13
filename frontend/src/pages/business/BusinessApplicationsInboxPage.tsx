import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { applicationsApi } from "@/api/applications";
import { useAuth } from "@/auth/AuthContext";
import { FullPageSpinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { InboxIcon } from "@/components/icons";
import { Button } from "@/components/Button";
import { ApplicationInboxRow } from "@/features/applications/ApplicationInboxRow";
import type { ApplicationStatus } from "@/types";

const tabs: { label: string; value: ApplicationStatus | undefined }[] = [
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "All", value: undefined },
];

export function BusinessApplicationsInboxPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ApplicationStatus | undefined>("PENDING");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["applications", "inbox", user?.id, status, page],
    queryFn: () => applicationsApi.inbox(user!.id, status, page),
    enabled: !!user,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Applications inbox</h1>
        <p className="mt-1.5 text-ink-500">Review creator pitches and decide who joins your partner roster.</p>
      </div>

      <div className="flex gap-2 rounded-full bg-ink-50 p-1 self-start">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => {
              setStatus(tab.value);
              setPage(0);
            }}
            className={clsx(
              "focus-ring rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              status === tab.value ? "bg-white text-ink-900 shadow-sm" : "text-ink-400 hover:text-ink-600",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : !data || data.content.length === 0 ? (
        <EmptyState icon={<InboxIcon className="h-10 w-10" />} title="No applications here" description="Check back later or switch tabs." />
      ) : (
        <div className="flex flex-col gap-3">
          {data.content.map((app) => (
            <ApplicationInboxRow key={app.id} application={app} />
          ))}

          {data.totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <span className="text-sm text-ink-400">
                Page {data.page + 1} of {data.totalPages}
              </span>
              <Button variant="secondary" size="sm" disabled={data.last} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
