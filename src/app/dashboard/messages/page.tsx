import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db/prisma";
import { requireUser } from "@/lib/permissions";
import { formatRelative } from "@/lib/utils";

export default async function MessagesPage() {
  const user = await requireUser();
  const conversations = await prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: user.id }, { sellerId: user.id }],
    },
    include: {
      listing: true,
      buyer: true,
      seller: true,
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { lastMessageAt: "desc" },
  });

  return (
    <Container className="space-y-6 py-10">
      <h1 className="text-4xl font-semibold text-stone-950">Messages</h1>
      <div className="space-y-4">
        {conversations.map((conversation) => (
          <Link key={conversation.id} href={`/dashboard/messages/${conversation.id}`}>
            <Card className="transition hover:-translate-y-0.5">
              <CardContent className="flex items-center justify-between gap-4 p-6">
                <div>
                  <div className="text-lg font-semibold text-stone-950">{conversation.listing.title}</div>
                  <div className="mt-1 text-sm text-stone-500">{conversation.messages[0]?.body || "Start the conversation"}</div>
                </div>
                <div className="text-sm text-stone-500">{formatRelative(conversation.lastMessageAt)}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
