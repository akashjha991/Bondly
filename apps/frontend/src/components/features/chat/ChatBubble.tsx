import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ChatBubbleProps = {
  content: string;
  createdAt: Date | string;
  isMe: boolean;
  status?: "SENT" | "DELIVERED" | "READ";
};

export function ChatBubble({ content, createdAt, isMe, status = "SENT" }: ChatBubbleProps) {
  return (
    <div className={cn("max-w-[80%] rounded-3xl px-4 py-3 shadow-sm", isMe ? "ml-auto rounded-br-md bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] text-white" : "rounded-bl-md border border-border bg-card")}>
      <p className="text-sm">{content}</p>
      <div className="mt-1 flex items-center justify-end gap-1 text-[10px] opacity-80">
        <span>{format(new Date(createdAt), "h:mm a")}</span>
        {isMe ? status === "READ" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" /> : null}
      </div>
    </div>
  );
}
