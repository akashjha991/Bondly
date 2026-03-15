import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

type MemoryCardProps = {
  imageUrl: string;
  caption: string | null;
  date: Date | string;
};

export function MemoryCard({ imageUrl, caption, date }: MemoryCardProps) {
  return (
    <Card className="overflow-hidden rounded-[16px] border-border/70 bg-card shadow-[0_4px_14px_rgba(15,15,20,0.08)] dark:shadow-[0_4px_14px_rgba(0,0,0,0.35)]">
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        <Image
          src={imageUrl}
          alt={caption || "Shared memory"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="h-full w-full object-cover"
          unoptimized
        />
      </div>
      <CardContent className="space-y-2 p-4">
        <p className="line-clamp-2 text-sm font-medium text-foreground">{caption || "A special memory"}</p>
        <time className="block text-xs text-muted-foreground">{format(new Date(date), "MMM d, yyyy")}</time>
      </CardContent>
    </Card>
  );
}
