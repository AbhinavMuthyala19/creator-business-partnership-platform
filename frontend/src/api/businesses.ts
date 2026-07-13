import { apiClient } from "./client";
import type { BusinessProfile, PageResponse } from "@/types";

export interface BusinessSearchParams {
  search?: string;
  industry?: string;
  page?: number;
  size?: number;
}

export interface BusinessUpdatePayload {
  companyName: string;
  industry: string;
  description: string;
  logoUrl: string;
  website: string;
}

export const businessesApi = {
  search: (params: BusinessSearchParams) =>
    apiClient
      .get<PageResponse<BusinessProfile>>("/businesses", { params: { size: 12, ...params } })
      .then((r) => r.data),
  getById: (id: number) => apiClient.get<BusinessProfile>(`/businesses/${id}`).then((r) => r.data),
  getMine: () => apiClient.get<BusinessProfile>("/businesses/me").then((r) => r.data),
  updateMine: (payload: BusinessUpdatePayload) =>
    apiClient.put<BusinessProfile>("/businesses/me", payload).then((r) => r.data),
};
