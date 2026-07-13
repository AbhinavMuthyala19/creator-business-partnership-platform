import { apiClient } from "./client";
import type { ApplicationRecord, ApplicationStatus, PageResponse } from "@/types";

export interface CreateApplicationPayload {
  businessId: number;
  pitchMessage: string;
}

export interface ApplicationStatusUpdatePayload {
  status: ApplicationStatus;
  reviewNote?: string;
}

export const applicationsApi = {
  create: (payload: CreateApplicationPayload) =>
    apiClient.post<ApplicationRecord>("/applications", payload).then((r) => r.data),
  mine: (page = 0, size = 10) =>
    apiClient
      .get<PageResponse<ApplicationRecord>>("/applications/me", { params: { page, size } })
      .then((r) => r.data),
  inbox: (businessId: number, status?: ApplicationStatus, page = 0, size = 10) =>
    apiClient
      .get<PageResponse<ApplicationRecord>>(`/businesses/${businessId}/applications`, {
        params: { status, page, size },
      })
      .then((r) => r.data),
  updateStatus: (applicationId: number, payload: ApplicationStatusUpdatePayload) =>
    apiClient
      .patch<ApplicationRecord>(`/applications/${applicationId}/status`, payload)
      .then((r) => r.data),
};
