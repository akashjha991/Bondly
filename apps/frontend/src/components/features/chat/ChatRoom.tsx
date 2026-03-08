"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Camera, Mic, Image as ImageIcon, Smile, PlusCircle } from "lucide-react";
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
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            } else {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
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
        <div className="flex flex-col h-full bg-white dark:bg-slate-900 sm:rounded-xl shadow-[0_-2px_10px_rgba(0,0,0,0.02)] sm:shadow-sm border-t sm:border border-slate-200 dark:border-slate-800 -mx-4 sm:mx-0 overflow-hidden relative">

            <ScrollArea className="flex-1 w-full" ref={scrollRef}>
                <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full p-4">
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
                                <div className={cn("flex max-w-[85%] sm:max-w-[75%] gap-2", isMe ? "flex-row-reverse" : "flex-row")}>
                                    <Avatar className="w-8 h-8 rounded-full shadow-sm shrink-0 border border-slate-100 dark:border-slate-800 mt-1">
                                        <AvatarImage src={msg.sender?.image || ""} />
                                        <AvatarFallback className="text-[10px] bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                                            {msg.sender?.name?.substring(0, 2).toUpperCase() || (isMe ? "ME" : "PA")}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className={cn("flex flex-col flex-1 min-w-0", isMe ? "items-end" : "items-start")}>
                                        <div
                                            className={cn(
                                                "px-4 py-2 rounded-2xl break-words",
                                                isMe
                                                    ? "bg-rose-500 text-white rounded-tr-none"
                                                    : "bg-slate-100 dark:bg-slate-800 rounded-tl-none"
                                            )}
                                            style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
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

            <div className="p-2 sm:p-4 shrink-0 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
                <form onSubmit={handleSend} className="flex gap-2 max-w-2xl mx-auto w-full items-center">
                    {/* Camera Button (Left side) */}
                    <button
                        type="button"
                        className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                    >
                        <Camera className="w-5 h-5" />
                    </button>

                    {/* Input Pill Container */}
                    <div className="flex-1 flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-full px-4 h-[44px] transition-all focus-within:ring-1 focus-within:ring-slate-300 dark:focus-within:ring-slate-700">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-0 shadow-none h-full placeholder:text-slate-500"
                        />

                        {/* Right Side Icons or Send Button */}
                        {input.trim() ? (
                            <button type="submit" className="text-blue-600 hover:text-blue-700 font-semibold text-sm ml-2">
                                Send
                            </button>
                        ) : (
                            <div className="flex items-center gap-3 md:gap-4 text-slate-500 ml-2 shrink-0">
                                <button type="button" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                    <Mic className="w-[20px] h-[20px]" />
                                </button>
                                <button type="button" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                    <ImageIcon className="w-[20px] h-[20px]" />
                                </button>
                                <button type="button" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors hidden sm:block">
                                    <Smile className="w-[20px] h-[20px]" />
                                </button>
                                <button type="button" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                                    <PlusCircle className="w-[20px] h-[20px]" />
                                </button>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
