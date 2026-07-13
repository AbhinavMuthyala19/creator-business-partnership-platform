import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { contentApi } from "@/api/content";
import { useAuth } from "@/auth/AuthContext";
import { FullPageSpinner } from "@/components/Spinner";
import { EmptyState } from "@/components/EmptyState";
import { ImageStackIcon } from "@/components/icons";
import { Button } from "@/components/Button";
import { ContentReviewCard } from "@/features/content/ContentReviewCard";
import type { ContentStatus } from "@/types";

const tabs: { label: string; value: ContentStatus | undefined }[] = [
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Changes requested", value: "CHANGES_REQUESTED" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "All", value: undefined },
];

export function BusinessContentReviewPage() {
  const { user } = useAuth();
  const [status, setStatus] = useState<ContentStatus | undefined>("SUBMITTED");
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["content", "review-queue", user?.id, status, page],
    queryFn: () => contentApi.reviewQueue(user!.id, status, page),
    enabled: !!user,
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Content review queue</h1>
        <p className="mt-1.5 text-ink-500">Approve, reject, or request changes on submitted creator content.</p>
      </div>

      <div className="flex flex-wrap gap-2 rounded-full bg-ink-50 p-1 self-start">
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
        <EmptyState icon={<ImageStackIcon className="h-10 w-10" />} title="Nothing here" description="Check back once creators submit content." />
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {data.content.map((item) => (
            <ContentReviewCard key={item.id} content={item} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
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
  );
}
