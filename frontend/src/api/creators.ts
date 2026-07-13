import { apiClient } from "./client";
import type { CreatorProfile } from "@/types";

export interface CreatorUpdatePayload {
  displayName: string;
  bio: string;
  niche: string;
  followerCount: number;
  socialLinks: string[];
  portfolioLinks: string[];
}

export const creatorsApi = {
  getById: (id: number) => apiClient.get<CreatorProfile>(`/creators/${id}`).then((r) => r.data),
  getMine: () => apiClient.get<CreatorProfile>("/creators/me").then((r) => r.data),
  updateMine: (payload: CreatorUpdatePayload) =>
    apiClient.put<CreatorProfile>("/creators/me", payload).then((r) => r.data),
};
