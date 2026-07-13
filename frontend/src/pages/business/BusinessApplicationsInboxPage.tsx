import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { applicationsApi } from "@/api/applications";
import { campaignsApi } from "@/api/campaigns";
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
  const [status, setStatus] = useState<ApplicationStatus | undefined>("PENDING");
  const [page, setPage] = useState(0);
  const [campaignId, setCampaignId] = useState<number | null>(null);

  const { data: myCampaigns, isLoading: campaignsLoading } = useQuery({
    queryKey: ["campaigns", "mine", 0],
    queryFn: () => campaignsApi.mine(0, 100),
  });

  useEffect(() => {
    if (campaignId === null && myCampaigns && myCampaigns.content.length > 0) {
      setCampaignId(myCampaigns.content[0].id);
    }
  }, [campaignId, myCampaigns]);

  const { data, isLoading } = useQuery({
    queryKey: ["applications", "inbox", campaignId, status, page],
    queryFn: () => applicationsApi.inbox(campaignId!, status, page),
    enabled: campaignId !== null,
  });

  if (campaignsLoading) return <FullPageSpinner />;

  if (!myCampaigns || myCampaigns.content.length === 0) {
    return (
      <EmptyState
        icon={<InboxIcon className="h-10 w-10" />}
        title="No campaigns yet"
        description="Create a campaign before you can receive applications."
        action={
          <Link to="/business/campaigns">
            <Button size="sm">Create a campaign</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Applications inbox</h1>
        <p className="mt-1.5 text-ink-500">Review creator pitches and decide who joins your campaign.</p>
      </div>

      <label className="flex max-w-sm flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-700">Campaign</span>
        <select
          value={campaignId ?? ""}
          onChange={(e) => {
            setCampaignId(Number(e.target.value));
            setPage(0);
          }}
          className="focus-ring w-full rounded-lg border border-ink-200 bg-white px-3.5 py-2.5 text-sm text-ink-900"
        >
          {myCampaigns.content.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.title}
            </option>
          ))}
        </select>
      </label>

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
