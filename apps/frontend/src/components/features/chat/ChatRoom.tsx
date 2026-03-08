"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { sendMessage } from "@/app/dashboard/actions";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Message = {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date | string;
    status: "SENT" | "DELIVERED" | "READ";
    sender?: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

export function ChatRoom({ initialMessages }: { initialMessages: Message[] }) {
    const { data: session } = useSession();
    const user = session?.user;
    const { socket, isConnected, relationshipId } = useSocket();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on("receive-message", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("receive-message");
        };
    }, [socket]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || !user?.id) return;

        const optimisticMsg: Message = {
            id: crypto.randomUUID(),
            content: input,
            senderId: user.id,
            createdAt: new Date(),
            status: "SENT",
        };

        setMessages((prev) => [...prev, optimisticMsg]);
        setInput("");

        try {
            const savedMsg = await sendMessage(optimisticMsg.content);
            if (socket && relationshipId) {
                socket.emit("send-message", {
                    ...savedMsg,
                    room: relationshipId,
                });
            }

            // Update optimistic msg with real ID
            setMessages((prev) =>
                prev.map((m) => (m.id === optimisticMsg.id ? savedMsg : m))
            );
        } catch (err) {
            console.error("Failed to send message", err);
            setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Chat <span className={cn("w-2 h-2 rounded-full", isConnected ? "bg-green-500" : "bg-red-500")} />
                </h2>
            </div>

            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
                    {messages.map((msg) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn("flex max-w-[75%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                                    <Avatar className="w-8 h-8 rounded-full shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 mt-1">
                                        <AvatarImage src={msg.sender?.image || ""} />
                                        <AvatarFallback className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                                            {msg.sender?.name?.substring(0, 2).toUpperCase() || (isMe ? "ME" : "PA")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                        <div
                                            className={cn(
                                                "px-4 py-2 rounded-2xl",
                                                isMe
                                                    ? "bg-rose-500 text-white rounded-tr-none"
                                                    : "bg-slate-100 dark:bg-slate-800 rounded-tl-none"
                                            )}
                                        >
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 px-1">
                                            {format(new Date(msg.createdAt), "h:mm a")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                <form onSubmit={handleSend} className="flex gap-2 max-w-2xl mx-auto w-full">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-full bg-slate-100 dark:bg-slate-800 border-transparent focus-visible:ring-rose-500"
                    />
                    <Button type="submit" size="icon" className="rounded-full bg-rose-500 hover:bg-rose-600">
                        <Send className="w-4 h-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}
