import { cn } from "@/lib/utils";

type XPProgressBarProps = {
  xp: number;
  level: number;
  className?: string;
};

export function XPProgressBar({ xp, level, className }: XPProgressBarProps) {
  const current = xp % 100;
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold">Level {level}</span>
        <span className="text-muted-foreground">{current}/100 XP</span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-muted">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6]"
          style={{ width: `${Math.max(4, current)}%` }}
        />
      </div>
    </div>
  );
}
