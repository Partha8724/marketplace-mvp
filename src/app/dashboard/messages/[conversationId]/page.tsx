import { notFound } from "next/navigation";

import { ConversationThread } from "@/components/dashboard/conversation-thread";
import { Container } from "@/components/layout/container";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
  const user = await requireUser();
  const { conversationId } = await params;

  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      listing: true,
      messages: {
        include: { sender: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!conversation || ![conversation.buyerId, conversation.sellerId].includes(user.id)) notFound();

  return (
    <Container className="space-y-6 py-10">
      <div>
        <div className="text-sm text-stone-500">Conversation</div>
        <h1 className="text-4xl font-semibold text-stone-950">{conversation.listing.title}</h1>
      </div>
      <ConversationThread
        conversationId={conversation.id}
        currentUserId={user.id}
        initialMessages={conversation.messages.map((message) => ({
          id: message.id,
          body: message.body,
          createdAt: message.createdAt.toISOString(),
          senderId: message.senderId,
          senderName: message.sender.name,
        }))}
        onSend={async () => {}}
      />
    </Container>
  );
}
