"use server";

import { revalidatePath } from "next/cache";

import { failureState, successState, type ActionState } from "@/lib/action-state";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";

export async function sendConversationReplyAction(conversationId: string, body: string): Promise<ActionState> {
  const user = await requireUser();
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  if (!conversation || ![conversation.buyerId, conversation.sellerId].includes(user.id)) {
    return failureState("Conversation not found.");
  }

  if (!body.trim()) {
    return failureState("Message cannot be empty.");
  }

  await prisma.message.create({
    data: {
      conversationId,
      senderId: user.id,
      body: body.trim(),
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      lastMessageAt: new Date(),
      ...(conversation.buyerId === user.id ? { buyerLastReadAt: new Date() } : { sellerLastReadAt: new Date() }),
    },
  });

  revalidatePath("/dashboard/messages");
  revalidatePath(`/dashboard/messages/${conversationId}`);
  return successState("Reply sent.");
}
