import { apiClient } from "./client";
import type { ContentMetricsSnapshot, PageResponse } from "@/types";

export const metricsApi = {
  sync: (contentId: number) =>
    apiClient.post<ContentMetricsSnapshot>(`/content/${contentId}/metrics/sync`).then((r) => r.data),
  history: (contentId: number, page = 0, size = 20) =>
    apiClient
      .get<PageResponse<ContentMetricsSnapshot>>(`/content/${contentId}/metrics`, { params: { page, size } })
      .then((r) => r.data),
};
