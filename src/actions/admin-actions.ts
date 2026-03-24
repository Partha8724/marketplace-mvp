"use server";

import { AdminActionType, ModerationStatus, ReportStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/permissions";
import { categorySchema } from "@/lib/validations";

export async function moderateListingAction(listingId: string, status: ModerationStatus, note?: string): Promise<ActionState> {
  const admin = await requireAdmin();

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      moderationStatus: status,
      moderationReason: note || null,
      publishedAt: status === ModerationStatus.APPROVED ? new Date() : null,
    },
  });

  await prisma.moderationLog.create({
    data: {
      actorId: admin.id,
      listingId,
      action:
        status === ModerationStatus.APPROVED
          ? AdminActionType.LISTING_APPROVED
          : status === ModerationStatus.HIDDEN
            ? AdminActionType.LISTING_HIDDEN
            : AdminActionType.LISTING_REJECTED,
      note: note || null,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/listings");
  revalidatePath("/browse");
  return successState("Listing moderation updated.");
}

export async function reviewReportAction(reportId: string, status: ReportStatus, note?: string): Promise<ActionState> {
  const admin = await requireAdmin();

  await prisma.report.update({
    where: { id: reportId },
    data: { status },
  });

  await prisma.moderationLog.create({
    data: {
      actorId: admin.id,
      reportId,
      action: AdminActionType.REPORT_REVIEWED,
      note: note || null,
    },
  });

  revalidatePath("/admin/reports");
  return successState("Report reviewed.");
}

export async function saveCategoryAction(input: unknown): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = categorySchema.safeParse(input);

  if (!parsed.success) {
    return failureState("Please fix the category fields.", parsed.error.flatten().fieldErrors);
  }

  if (parsed.data.id) {
    await prisma.category.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        icon: parsed.data.icon || null,
        sortOrder: parsed.data.sortOrder,
        parentId: parsed.data.parentId || null,
      },
    });
  } else {
    await prisma.category.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        description: parsed.data.description || null,
        icon: parsed.data.icon || null,
        sortOrder: parsed.data.sortOrder,
        parentId: parsed.data.parentId || null,
      },
    });
  }

  await prisma.moderationLog.create({
    data: {
      actorId: admin.id,
      action: AdminActionType.CATEGORY_UPDATED,
      note: parsed.data.name,
    },
  });

  revalidatePath("/admin/categories");
  return successState("Category saved.");
}

export async function toggleUserBlockAction(userId: string, shouldBlock: boolean): Promise<ActionState> {
  const admin = await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { isBlocked: shouldBlock },
  });

  await prisma.moderationLog.create({
    data: {
      actorId: admin.id,
      action: AdminActionType.USER_UPDATED,
      note: `${shouldBlock ? "Blocked" : "Unblocked"} ${userId}`,
    },
  });

  revalidatePath("/admin/users");
  return successState("User updated.");
}
