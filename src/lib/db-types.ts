export const roles = ["USER", "ADMIN"] as const;
export type Role = (typeof roles)[number];

export const listingStatuses = ["DRAFT", "ACTIVE", "SOLD", "ARCHIVED"] as const;
export type ListingStatus = (typeof listingStatuses)[number];

export const moderationStatuses = ["PENDING", "APPROVED", "REJECTED", "HIDDEN"] as const;
export type ModerationStatus = (typeof moderationStatuses)[number];

export const itemConditions = ["NEW", "LIKE_NEW", "VERY_GOOD", "GOOD", "FAIR", "FOR_PARTS"] as const;
export type ItemCondition = (typeof itemConditions)[number];

export const deliveryOptions = ["PICKUP", "LOCAL_DELIVERY", "SHIPPING"] as const;
export type DeliveryOption = (typeof deliveryOptions)[number];

export const reportStatuses = ["OPEN", "REVIEWED", "RESOLVED", "DISMISSED"] as const;
export type ReportStatus = (typeof reportStatuses)[number];

export const reportTargetTypes = ["LISTING", "USER", "MESSAGE"] as const;
export type ReportTargetType = (typeof reportTargetTypes)[number];
