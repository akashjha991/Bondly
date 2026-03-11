import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Smile, Send } from "lucide-react";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
};

export function ChatInput({ value, onChange, onSend }: ChatInputProps) {
  return (
    <div className="border-t border-border bg-background p-3">
      <div className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-3xl border border-border bg-card px-2 py-1">
        <Button type="button" variant="ghost" size="icon" className="rounded-full text-muted-foreground">
          <Smile className="h-5 w-5" />
        </Button>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
