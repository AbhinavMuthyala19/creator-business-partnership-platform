import { apiClient } from "./client";
import type { LeaderboardEntry, PageResponse } from "@/types";

export const leaderboardApi = {
  business: (businessId: number, page = 0, size = 20) =>
    apiClient
      .get<PageResponse<LeaderboardEntry>>(`/businesses/${businessId}/leaderboard`, { params: { page, size } })
      .then((r) => r.data),
  global: (page = 0, size = 20) =>
    apiClient.get<PageResponse<LeaderboardEntry>>("/leaderboard/global", { params: { page, size } }).then((r) => r.data),
};
