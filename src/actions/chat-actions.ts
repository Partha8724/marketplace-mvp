"use server";

import { revalidatePath } from "next/cache";

import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";
import { messageSchema } from "@/lib/validations";

export async function sendMessageAction(input: unknown): Promise<ActionState> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse(input);

  if (!parsed.success) {
    return failureState("Message could not be sent.", parsed.error.flatten().fieldErrors);
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
  });

  if (!listing) return failureState("Listing not found.");
  if (listing.userId === user.id) return failureState("You cannot message yourself.");

  const conversation =
    (await prisma.conversation.findUnique({
      where: {
        listingId_buyerId_sellerId: {
          listingId: listing.id,
          buyerId: user.id,
          sellerId: listing.userId,
        },
      },
    })) ||
    (await prisma.conversation.create({
      data: {
        listingId: listing.id,
        buyerId: user.id,
        sellerId: listing.userId,
      },
    }));

  await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      body: parsed.data.body,
    },
  });

  await prisma.conversation.update({
    where: { id: conversation.id },
    data: {
      lastMessageAt: new Date(),
      buyerLastReadAt: new Date(),
    },
  });

  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${conversation.id}`);

  return successState("Message sent.", `/dashboard/messages/${conversation.id}`);
}
