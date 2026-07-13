import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { campaignsApi } from "@/api/campaigns";
import { CampaignCard } from "@/features/campaigns/CampaignCard";
import { EmptyState } from "@/components/EmptyState";
import { FullPageSpinner } from "@/components/Spinner";
import { CompassIcon } from "@/components/icons";
import { Button } from "@/components/Button";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function DiscoverCampaignsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["campaigns", debouncedSearch, page],
    queryFn: () => campaignsApi.searchPublic({ search: debouncedSearch || undefined, page }),
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Discover campaigns</h1>
        <p className="mt-1.5 max-w-2xl text-ink-500">
          Browse active brand campaigns looking for creators. Apply with a pitch and get approved to submit content.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          placeholder="Search by campaign title…"
          className="focus-ring w-full max-w-sm rounded-full border border-ink-200 bg-white px-4 py-2.5 text-sm placeholder:text-ink-300 sm:max-w-xs"
        />
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : !data || data.content.length === 0 ? (
        <EmptyState
          icon={<CompassIcon className="h-10 w-10" />}
          title="No campaigns found"
          description="Try a different search term, or check back soon as more brands launch campaigns."
        />
      ) : (
        <>
          <div className={`grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {data.content.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>

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
        </>
      )}
    </div>
  );
}
