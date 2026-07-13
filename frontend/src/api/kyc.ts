import { apiClient } from "./client";
import type { CreatorKycProfile, CreatorKycReviewDetail, KycStatus } from "@/types";

export interface KycSubmitPayload {
  panNumber: string;
  nameOnPan: string;
  documentUrl: string;
}

export interface KycReviewPayload {
  status: KycStatus;
  reviewNote?: string;
}

export interface KycUploadResult {
  url: string;
  contentType: string;
  sizeBytes: number;
}

export const kycApi = {
  submit: (payload: KycSubmitPayload) =>
    apiClient.post<CreatorKycProfile>("/kyc/me", payload).then((r) => r.data),
  mine: () => apiClient.get<CreatorKycProfile>("/kyc/me").then((r) => r.data),
  getForReview: (creatorId: number) =>
    apiClient.get<CreatorKycReviewDetail>(`/creators/${creatorId}/kyc`).then((r) => r.data),
  review: (creatorId: number, payload: KycReviewPayload) =>
    apiClient.patch<CreatorKycReviewDetail>(`/creators/${creatorId}/kyc`, payload).then((r) => r.data),
  uploadDocument: (file: File, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient
      .post<KycUploadResult>("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) onProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      })
      .then((r) => r.data);
  },
};
