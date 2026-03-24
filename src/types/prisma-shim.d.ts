/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@prisma/client" {
  export class PrismaClient {
    [key: string]: any;
  }
  export const Role: { USER: "USER"; ADMIN: "ADMIN" };
  export type Role = (typeof Role)[keyof typeof Role];
  export const ListingStatus: { DRAFT: "DRAFT"; ACTIVE: "ACTIVE"; SOLD: "SOLD"; ARCHIVED: "ARCHIVED" };
  export type ListingStatus = (typeof ListingStatus)[keyof typeof ListingStatus];
  export const ModerationStatus: { PENDING: "PENDING"; APPROVED: "APPROVED"; REJECTED: "REJECTED"; HIDDEN: "HIDDEN" };
  export type ModerationStatus = (typeof ModerationStatus)[keyof typeof ModerationStatus];
  export const ItemCondition: { NEW: "NEW"; LIKE_NEW: "LIKE_NEW"; VERY_GOOD: "VERY_GOOD"; GOOD: "GOOD"; FAIR: "FAIR"; FOR_PARTS: "FOR_PARTS" };
  export type ItemCondition = (typeof ItemCondition)[keyof typeof ItemCondition];
  export const DeliveryOption: { PICKUP: "PICKUP"; LOCAL_DELIVERY: "LOCAL_DELIVERY"; SHIPPING: "SHIPPING" };
  export type DeliveryOption = (typeof DeliveryOption)[keyof typeof DeliveryOption];
  export const ReportTargetType: { LISTING: "LISTING"; USER: "USER"; MESSAGE: "MESSAGE" };
  export type ReportTargetType = (typeof ReportTargetType)[keyof typeof ReportTargetType];
  export const ReportStatus: { OPEN: "OPEN"; REVIEWED: "REVIEWED"; RESOLVED: "RESOLVED"; DISMISSED: "DISMISSED" };
  export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
  export const AdminActionType: {
    LISTING_APPROVED: "LISTING_APPROVED";
    LISTING_REJECTED: "LISTING_REJECTED";
    LISTING_HIDDEN: "LISTING_HIDDEN";
    REPORT_REVIEWED: "REPORT_REVIEWED";
    USER_UPDATED: "USER_UPDATED";
    CATEGORY_UPDATED: "CATEGORY_UPDATED";
  };
  export type AdminActionType = (typeof AdminActionType)[keyof typeof AdminActionType];
  export namespace Prisma {
    export type ListingWhereInput = any;
    export type ListingOrderByWithRelationInput = any;
  }
}
