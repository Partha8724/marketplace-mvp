"use client";

import { useEffect, useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  senderName: string | null;
};

export function ConversationThread({
  conversationId,
  currentUserId,
  initialMessages,
  onSend,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: Message[];
  onSend: (body: string) => Promise<void>;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [conversationId]);

  return (
    <div className="space-y-4">
      <div className="space-y-3 rounded-[28px] border border-stone-200 bg-white p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm ${
              message.senderId === currentUserId ? "ml-auto bg-stone-950 text-white" : "bg-stone-100 text-stone-700"
            }`}
          >
            <div className="font-semibold">{message.senderName || "Member"}</div>
            <div className="mt-1">{message.body}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <Textarea value={draft} onChange={(event) => setDraft(event.target.value)} />
        <Button
          onClick={async () => {
            if (!draft.trim()) return;
            await onSend(draft);
            setDraft("");
          }}
        >
          Send reply
        </Button>
      </div>
    </div>
  );
}
