export type UserRole = "CREATOR" | "BUSINESS" | "ADMIN";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ContentStatus = "DRAFT" | "SUBMITTED" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED" | "PUBLISHED";

export type MediaType = "IMAGE" | "VIDEO";

export interface UserSummary {
  id: number;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserSummary;
}

export interface CreatorProfile {
  id: number;
  userId: number;
  email: string;
  displayName: string;
  bio: string | null;
  niche: string | null;
  followerCount: number;
  socialLinks: string[];
  portfolioLinks: string[];
  createdAt: string;
}

export interface BusinessProfile {
  id: number;
  userId: number;
  companyName: string;
  industry: string | null;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  createdAt: string;
}

export interface ApplicationRecord {
  id: number;
  creatorId: number;
  creatorDisplayName: string;
  businessId: number;
  businessCompanyName: string;
  pitchMessage: string;
  status: ApplicationStatus;
  reviewNote: string | null;
  appliedAt: string;
  reviewedAt: string | null;
}

export interface ContentReviewNote {
  id: number;
  authoredByUserId: number;
  contentVersion: number;
  decision: ContentStatus;
  noteText: string | null;
  createdAt: string;
}

export interface ContentRecord {
  id: number;
  applicationId: number;
  creatorId: number;
  creatorDisplayName: string;
  businessId: number;
  businessCompanyName: string;
  caption: string | null;
  mediaUrl: string;
  mediaType: MediaType;
  postUrl: string | null;
  status: ContentStatus;
  version: number;
  reviewNotes: ContentReviewNote[];
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  publishedAt: string | null;
}

export interface ContentMetricsSnapshot {
  id: number;
  contentId: number;
  likeCount: number;
  commentCount: number;
  viewCount: number | null;
  fetchedAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  creatorId: number;
  creatorDisplayName: string;
  totalViews: number;
  publishedContentCount: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ApiErrorShape {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: { field: string; message: string }[];
}
