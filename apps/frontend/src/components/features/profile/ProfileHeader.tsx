"use client";

import { useSession } from "next-auth/react";
import { Trophy, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

export function ProfileHeader({
    xp,
    level,
}: {
    xp: number;
    level: number;
}) {
    const { data: session } = useSession();
    const user = session?.user;

    // Calculate progress to next level (each level requires 100 XP)
    const xpCurrentLevel = xp % 100;
    const progressPercent = (xpCurrentLevel / 100) * 100;

    return (
        <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full mb-6">
            <Avatar className="w-14 h-14 border-2 border-rose-100 dark:border-rose-900/50">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback className="bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400 font-bold">
                    {user?.name?.substring(0, 2).toUpperCase() || "ME"}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                            {user?.name || "Partner"}
                        </h3>
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                            <Trophy className="w-3 h-3" /> Lvl {level}
                        </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {xpCurrentLevel} / 100 XP
                    </span>
                </div>
                <Progress value={progressPercent} className="h-2 bg-slate-100 dark:bg-slate-800" />
            </div>
        </div>
    );
}
