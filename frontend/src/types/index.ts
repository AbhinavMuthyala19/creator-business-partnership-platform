export type UserRole = "CREATOR" | "BUSINESS" | "ADMIN";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ContentStatus = "DRAFT" | "SUBMITTED" | "CHANGES_REQUESTED" | "APPROVED" | "REJECTED" | "PUBLISHED";

export type MediaType = "IMAGE" | "VIDEO";

export type CampaignStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type KycStatus = "PENDING" | "VERIFIED" | "REJECTED";

export type PayoutStatus = "BELOW_THRESHOLD" | "PENDING_KYC" | "PAYABLE" | "PAID";

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

export interface Campaign {
  id: number;
  businessId: number;
  businessCompanyName: string;
  title: string;
  description: string | null;
  startDate: string;
  endDate: string;
  ratePerThousandViewsInr: number;
  status: CampaignStatus;
  acceptingApplications: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationRecord {
  id: number;
  creatorId: number;
  creatorDisplayName: string;
  campaignId: number;
  campaignTitle: string;
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
  campaignId: number;
  campaignTitle: string;
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

export interface CreatorKycProfile {
  creatorId: number;
  panNumberMasked: string;
  nameOnPan: string;
  documentUrl: string;
  status: KycStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
}

export interface CreatorKycReviewDetail {
  creatorId: number;
  panNumber: string;
  nameOnPan: string;
  documentUrl: string;
  status: KycStatus;
  reviewNote: string | null;
  reviewedAt: string | null;
}

export interface Payout {
  id: number;
  contentId: number;
  creatorId: number;
  campaignId: number;
  businessId: number;
  viewCountUsed: number;
  rateUsed: number;
  amountInr: number;
  status: PayoutStatus;
  calculatedAt: string;
  eligibleAt: string | null;
  paidAt: string | null;
  paidNote: string | null;
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
