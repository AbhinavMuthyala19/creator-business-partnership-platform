import type { LeaderboardEntry } from "@/types";
import { EmptyState } from "@/components/EmptyState";
import { TrophyIcon } from "@/components/icons";
import { LeaderboardRow } from "./LeaderboardRow";

export function LeaderboardTable({ entries }: { entries: LeaderboardEntry[] }) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<TrophyIcon className="h-10 w-10" />}
        title="No published content yet"
        description="Rankings appear once creators publish content and sync their metrics."
      />
    );
  }

  return (
    <div className="card-surface overflow-x-auto p-2">
      <table className="w-full min-w-[480px] text-left text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-ink-400">
            <th className="py-2 pl-4 pr-2 font-medium">Rank</th>
            <th className="py-2 pr-4 font-medium">Creator</th>
            <th className="py-2 pr-4 text-right font-medium">Published</th>
            <th className="py-2 pr-4 text-right font-medium">Total views</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <LeaderboardRow key={entry.creatorId} entry={entry} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
