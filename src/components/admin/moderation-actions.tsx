"use client";

import { ModerationStatus, ReportStatus } from "@prisma/client";
import { useTransition } from "react";

import { moderateListingAction, reviewReportAction, toggleUserBlockAction } from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";

export function ModerationActions({ listingId }: { listingId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={pending} onClick={() => startTransition(async () => { await moderateListingAction(listingId, ModerationStatus.APPROVED); })}>Approve</Button>
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => startTransition(async () => { await moderateListingAction(listingId, ModerationStatus.REJECTED); })}>Reject</Button>
      <Button size="sm" variant="destructive" disabled={pending} onClick={() => startTransition(async () => { await moderateListingAction(listingId, ModerationStatus.HIDDEN); })}>Hide</Button>
    </div>
  );
}

export function ReportActions({ reportId }: { reportId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" disabled={pending} onClick={() => startTransition(async () => { await reviewReportAction(reportId, ReportStatus.REVIEWED); })}>Review</Button>
      <Button size="sm" variant="secondary" disabled={pending} onClick={() => startTransition(async () => { await reviewReportAction(reportId, ReportStatus.RESOLVED); })}>Resolve</Button>
      <Button size="sm" variant="ghost" disabled={pending} onClick={() => startTransition(async () => { await reviewReportAction(reportId, ReportStatus.DISMISSED); })}>Dismiss</Button>
    </div>
  );
}

export function UserBlockButton({ userId, isBlocked }: { userId: string; isBlocked: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button size="sm" variant={isBlocked ? "secondary" : "destructive"} disabled={pending} onClick={() => startTransition(async () => { await toggleUserBlockAction(userId, !isBlocked); })}>
      {isBlocked ? "Unblock" : "Block"}
    </Button>
  );
}
