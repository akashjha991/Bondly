"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useSocket } from "@/components/providers/SocketProvider";
import { sendMessage } from "@/app/dashboard/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date | string;
  status: "SENT" | "DELIVERED" | "READ";
};

export function ChatRoom({ initialMessages, partner }: { initialMessages: Message[]; partner?: { name: string | null; image: string | null } | null }) {
  const { data: session } = useSession();
  const { socket, relationshipId, isConnected } = useSocket();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const onReceive = (msg: Message) => setMessages((prev) => [...prev, msg]);
    const onTyping = () => {
      setIsTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1600);
    };

    socket.on("receive-message", onReceive);
    socket.on("typing", onTyping);

    return () => {
      socket.off("receive-message", onReceive);
      socket.off("typing", onTyping);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [socket]);

  useEffect(() => {
    containerRef.current?.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const onSend = async () => {
    if (!input.trim() || !session?.user?.id) return;
    const optimistic: Message = {
      id: crypto.randomUUID(),
      content: input,
      senderId: session.user.id,
      createdAt: new Date(),
      status: "SENT",
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    try {
      const saved = await sendMessage(optimistic.content);
      socket?.emit("send-message", { ...saved, room: relationshipId });
      setMessages((prev) => prev.map((m) => (m.id === optimistic.id ? { ...saved, status: "DELIVERED" } : m)));
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  };

  const emitTyping = () => {
    if (!socket || !relationshipId) return;
    socket.emit("typing", { room: relationshipId });
  };

  const title = useMemo(() => partner?.name || "Partner", [partner?.name]);

  return (
    <div className="flex h-[100dvh] flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-3 shadow-sm">
        <Link href="/dashboard" className="rounded-full p-2 text-muted-foreground hover:bg-accent">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <Avatar className="h-10 w-10">
          <AvatarImage src={partner?.image || ""} />
          <AvatarFallback>{title.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-zinc-400"}`} />
            {isConnected ? "Online" : "Offline"}
          </p>
        </div>
      </header>

      <main ref={containerRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <ChatBubble key={msg.id} content={msg.content} createdAt={msg.createdAt} isMe={msg.senderId === session?.user?.id} status={msg.status} />
        ))}

        {isTyping && (
          <div className="max-w-[80%] rounded-[20px] rounded-bl-md border border-border bg-card px-4 py-3 text-xs text-muted-foreground shadow-sm">
            Typing...
          </div>
        )}
      </main>

      <ChatInput value={input} onChange={setInput} onSend={onSend} onTyping={emitTyping} />
    </div>
  );
}
