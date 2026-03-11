"use client";

import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/components/providers/SocketProvider";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Camera, Mic, Smile, ArrowLeft, MoreVertical, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
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

export function ChatRoom({
    initialMessages,
    partner
}: {
    initialMessages: Message[];
    partner?: { name: string | null; image: string | null } | null;
}) {
    const { data: session } = useSession();
    const user = session?.user;
    const { socket, isConnected, relationshipId } = useSocket();
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on("receive-message", (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
            // scroll happens via other effect
        });

        // Mock typing indicator randomly turning off for demo purposes if implemented
        socket.on("typing", () => {
            setIsTyping(true);
            setTimeout(() => setIsTyping(false), 3000);
        });

        return () => {
            socket.off("receive-message");
            socket.off("typing");
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
    }, [messages, isTyping]);

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

            setMessages((prev) =>
                prev.map((m) => (m.id === optimisticMsg.id ? { ...savedMsg, status: "DELIVERED" } : m))
            );
        } catch (err) {
            console.error("Failed to send message", err);
            setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
        }
    };

    return (
        <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden relative">

            {/* Fixed Partner Header */}
            {partner && (
                <div className="shrink-0 pt-safe px-4 pb-3 border-b border-border bg-card/95 backdrop-blur-md z-20 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <Link href="/dashboard" className="p-2 -ml-2 text-muted-foreground hover:bg-accent rounded-full transition-colors active:scale-95">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <Avatar className="w-10 h-10 border border-border shadow-sm">
                            <AvatarImage src={partner.image || ""} />
                            <AvatarFallback className="bg-bondly-pink/10 text-bondly-pink font-semibold">
                                {partner.name?.substring(0, 2).toUpperCase() || "PA"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="font-bold text-foreground line-clamp-1">
                                {partner.name || "Partner"}
                            </span>
                            <span className="text-xs text-bondly-pink font-semibold">
                                {isConnected ? "online" : "connecting..."}
                            </span>
                        </div>
                    </div>

                    <button className="p-2 -mr-2 text-muted-foreground hover:bg-accent rounded-full transition-colors">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            )}

            <div className="absolute inset-0 z-0 bg-background/50 dark:bg-background/80" style={{ backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)", backgroundSize: "20px 20px", opacity: 0.1 }}></div>

            <ScrollArea className="flex-1 min-h-0 w-full z-10" ref={scrollRef}>
                <div className="flex flex-col gap-3 max-w-2xl mx-auto w-full p-4 pt-6">
                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        const prevMsg = index > 0 ? messages[index - 1] : null;
                        const showAvatar = !isMe && prevMsg?.senderId !== msg.senderId;

                        return (
                            <div
                                key={msg.id}
                                className={cn(
                                    "flex w-full group animate-in slide-in-from-bottom-2 fade-in duration-300",
                                    isMe ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn("flex max-w-[85%] sm:max-w-[70%] gap-2 items-end", isMe ? "flex-row-reverse" : "flex-row")}>

                                    {/* Partner Avatar snippet omitted if consecutive messages */}
                                    {!isMe && (
                                        <div className="w-6 shrink-0 flex items-end">
                                            {showAvatar && (
                                                <Avatar className="w-6 h-6 rounded-full shadow-sm border border-border">
                                                    <AvatarImage src={msg.sender?.image || ""} />
                                                    <AvatarFallback className="text-[8px] bg-muted text-muted-foreground">
                                                        {msg.sender?.name?.substring(0, 2).toUpperCase() || "PA"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    )}

                                    <div className={cn("flex flex-col flex-1 min-w-0", isMe ? "items-end" : "items-start")}>
                                        <div
                                            className={cn(
                                                "px-4 py-2.5 break-words shadow-sm relative group/bubble transition-all",
                                                isMe
                                                    ? "bg-gradient-to-r from-bondly-pink to-bondly-purple text-white rounded-[20px] rounded-br-[4px]"
                                                    : "bg-card text-foreground rounded-[20px] rounded-bl-[4px] border border-border"
                                            )}
                                            style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
                                        >
                                            <span className="leading-snug text-[15px]">{msg.content}</span>
                                            <div className="flex justify-end items-center gap-1 mt-1 -mb-1 opacity-70">
                                                <span className={cn(
                                                    "text-[10px] font-medium tracking-wide",
                                                    isMe ? "text-white/80" : "text-muted-foreground"
                                                )}>
                                                    {format(new Date(msg.createdAt), "h:mm a")}
                                                </span>
                                                {isMe && (
                                                    <span className="text-white/80">
                                                        {msg.status === "READ" ? <CheckCheck className="w-[12px] h-[12px]" /> : <Check className="w-[12px] h-[12px]" />}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Typing Indicator */}
                    {isTyping && (
                        <div className="flex w-full justify-start animate-in fade-in duration-300 pl-8">
                            <div className="bg-card border border-border px-4 py-3 rounded-full rounded-bl-sm shadow-sm flex gap-1 items-center">
                                <div className="w-1.5 h-1.5 bg-bondly-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-bondly-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-bondly-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Sticky Bottom Input */}
            <div className="p-3 sm:p-4 shrink-0 bg-background/95 backdrop-blur-md z-20 pb-safe shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)]">
                <form onSubmit={handleSend} className="flex gap-2 max-w-2xl mx-auto w-full items-end">

                    <button
                        type="button"
                        className="flex items-center justify-center w-11 h-11 shrink-0 rounded-full bg-accent hover:bg-muted text-foreground transition-colors mb-[2px]"
                    >
                        <Camera className="w-5 h-5 text-muted-foreground" />
                    </button>

                    <div className="flex-1 flex items-end bg-card border border-border rounded-3xl p-1.5 transition-all focus-within:ring-2 focus-within:ring-bondly-pink/30 shadow-sm relative min-h-[48px]">
                        <button type="button" className="p-2 text-muted-foreground hover:text-bondly-pink transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>

                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message..."
                            className="flex-1 bg-transparent border-0 focus-visible:ring-0 px-1 shadow-none py-2 resize-none rounded-none text-[15px] placeholder:text-muted-foreground"
                            autoComplete="off"
                        />

                        {input.trim() ? (
                            <button type="submit" className="flex items-center justify-center p-2 text-white bg-gradient-to-r from-bondly-pink to-bondly-purple hover:opacity-90 rounded-full transition-all shrink-0 shadow-md transform scale-100 mb-0.5 mr-0.5 w-[34px] h-[34px]">
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        ) : (
                            <button type="button" className="p-2 text-muted-foreground hover:text-foreground transition-colors mr-1">
                                <Mic className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
