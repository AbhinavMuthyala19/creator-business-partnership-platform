import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "@/api/leaderboard";
import { FullPageSpinner } from "@/components/Spinner";
import { Button } from "@/components/Button";
import { LeaderboardTable } from "@/features/leaderboard/LeaderboardTable";

export function LeaderboardPage() {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["leaderboard", "global", page],
    queryFn: () => leaderboardApi.global(page),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">Global leaderboard</h1>
        <p className="mt-1.5 text-ink-500">Creators ranked by total views across every published piece of content.</p>
      </div>

      {isLoading || !data ? <FullPageSpinner /> : <LeaderboardTable entries={data.content} />}

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
