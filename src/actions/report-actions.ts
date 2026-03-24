"use server";

import { ReportTargetType } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";
import { reportSchema } from "@/lib/validations";

export async function submitReportAction(input: unknown): Promise<ActionState> {
  const user = await requireUser();
  const parsed = reportSchema.safeParse(input);

  if (!parsed.success) {
    return failureState("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  const listing = await prisma.listing.findUnique({ where: { id: parsed.data.listingId } });
  if (!listing) return failureState("Listing not found.");

  await prisma.report.create({
    data: {
      reporterId: user.id,
      listingId: listing.id,
      targetType: ReportTargetType.LISTING,
      reason: parsed.data.reason,
      details: parsed.data.details || null,
    },
  });

  revalidatePath("/admin/reports");

  return successState("Report submitted. Our moderation team will review it.");
}
