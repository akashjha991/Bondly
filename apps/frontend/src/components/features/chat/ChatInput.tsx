import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onTyping?: () => void;
};

export function ChatInput({ value, onChange, onSend, onTyping }: ChatInputProps) {
  return (
    <div className="border-t border-border bg-background/95 p-3 backdrop-blur">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-[20px] border border-border bg-card px-2 py-1 shadow-sm">
        <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground">
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onTyping?.();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Message..."
          className="border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <Button type="button" onClick={onSend} disabled={!value.trim()} size="icon" className="rounded-full bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] text-white">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
