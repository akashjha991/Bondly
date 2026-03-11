"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addMood } from "@/app/dashboard/mood/actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Flame, Award, HeartHandshake } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS = [
    { icon: "🤩", label: "Amazing", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { icon: "😊", label: "Good", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { icon: "😐", label: "Okay", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { icon: "😔", label: "Rough", color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { icon: "😡", label: "Frustrated", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { icon: "🤒", label: "Sick", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
];

type Mood = {
    id: string;
    emoji: string;
    date: Date;
    user: {
        id: string;
        name: string | null;
    };
};

export function MoodTracker({ history, userXp = 0, userLevel = 1, streakDays = 0 }: { history: Mood[], userXp?: number, userLevel?: number, streakDays?: number }) {
    const { data: session } = useSession();
    const user = session?.user;
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date();
    const myMoods = history.filter((m) => m.user.id === user?.id);
    const myMoodToday = myMoods.find((m) => isSameDay(new Date(m.date), today));

    const partnerMoods = history.filter((m) => m.user.id !== user?.id);
    const partnerMoodToday = partnerMoods.find((m) => isSameDay(new Date(m.date), today));

    const xpCurrentLevel = userXp % 100;

    const handleSave = async (emoji: string) => {
        setSelectedEmoji(emoji);
        setIsSubmitting(true);
        try {
            await addMood(emoji);
            toast.success("Mood updated!");
        } catch (error) {
            toast.error("Failed to update mood");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto w-full px-4 sm:px-6">
            <div className="flex flex-col mb-8">
                <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent w-max">Us</h2>
                <p className="text-muted-foreground">Keep the connection strong every day.</p>
            </div>

            {/* Top Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                {/* Streak Card */}
                <Card className="bg-card border-border shadow-sm rounded-[24px] overflow-hidden group">
                    <CardContent className="p-5 flex flex-col justify-between h-full bg-gradient-to-br from-orange-500/5 to-rose-500/5">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-orange-500/10 rounded-xl">
                                <Flame className="w-5 h-5 text-orange-500" />
                            </div>
                            <span className="font-semibold text-foreground text-sm">Hit Streak</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black bg-gradient-to-br from-orange-500 to-rose-500 bg-clip-text text-transparent">{streakDays}</span>
                            <span className="text-muted-foreground font-medium text-sm">Days</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Level Card */}
                <Card className="bg-card border-border shadow-sm rounded-[24px] overflow-hidden">
                    <CardContent className="p-5 flex flex-col justify-between h-full relative">
                        {/* Soft background pattern */}
                        <div className="absolute -right-4 -top-4 opacity-[0.03] dark:opacity-10 pointer-events-none">
                            <Award className="w-32 h-32" />
                        </div>

                        <div className="flex items-center gap-2 mb-4 relative z-10">
                            <div className="p-2 bg-bondly-purple/10 rounded-xl">
                                <Award className="w-5 h-5 text-bondly-purple" />
                            </div>
                            <span className="font-semibold text-foreground text-sm">Relationship Level</span>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-3xl font-black text-foreground">{userLevel}</span>
                                <span className="text-xs font-semibold text-muted-foreground">{xpCurrentLevel} / 100 XP</span>
                            </div>
                            <div className="w-full bg-accent rounded-full h-3 overflow-hidden shadow-inner">
                                <div
                                    className="bg-gradient-to-r from-bondly-pink to-bondly-purple h-full rounded-full transition-all duration-1000 ease-out relative"
                                    style={{ width: `${Math.max(4, xpCurrentLevel)}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Today's Status */}
            <h3 className="text-lg font-bold text-foreground mt-8 mb-2 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-bondly-pink" />
                Today's Vibe
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <Card className={cn(
                    "border shadow-sm rounded-[24px] transition-all duration-300",
                    myMoodToday ? "bg-bondly-pink/5 border-bondly-pink/20" : "bg-card border-border"
                )}>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <span className={cn(
                            "text-sm font-semibold mb-3",
                            myMoodToday ? "text-bondly-pink" : "text-muted-foreground"
                        )}>You</span>
                        <div className={cn(
                            "text-5xl mb-3 transition-transform duration-500",
                            myMoodToday ? "scale-110" : "opacity-40 grayscale"
                        )}>
                            {myMoodToday?.emoji || "💭"}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground mt-1 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
                            {myMoodToday ? "Checked in" : "Waiting for you"}
                        </span>
                    </CardContent>
                </Card>

                <Card className={cn(
                    "border shadow-sm rounded-[24px] transition-all duration-300",
                    partnerMoodToday ? "bg-bondly-purple/5 border-bondly-purple/20" : "bg-card border-border"
                )}>
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <span className={cn(
                            "text-sm font-semibold mb-3",
                            partnerMoodToday ? "text-bondly-purple" : "text-muted-foreground"
                        )}>Partner</span>
                        <div className={cn(
                            "text-5xl mb-3 transition-transform duration-500",
                            partnerMoodToday ? "scale-110" : "opacity-40 grayscale blur-[2px]"
                        )}>
                            {partnerMoodToday?.emoji || "💭"}
                        </div>
                        <span className="text-xs font-medium text-muted-foreground mt-1 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
                            {partnerMoodToday ? "Checked in" : "Has not checked in"}
                        </span>
                    </CardContent>
                </Card>
            </div>

            {/* Mood Selector Picker */}
            <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border-border bg-card rounded-[32px] overflow-hidden mt-6">
                <div className="bg-accent/50 p-4 border-b border-border text-center">
                    <span className="font-semibold text-sm text-foreground">How are you feeling right now?</span>
                </div>
                <CardContent className="p-5 sm:p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
                        {EMOJIS.map((mood) => {
                            const isActive = (myMoodToday?.emoji === mood.icon) || (selectedEmoji === mood.icon);
                            return (
                                <button
                                    key={mood.label}
                                    disabled={isSubmitting}
                                    onClick={() => handleSave(mood.icon)}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-4 px-2 rounded-[20px] transition-all duration-300 border",
                                        isActive
                                            ? `${mood.bg} ${mood.border} scale-105 shadow-sm ring-1 ring-black/5 dark:ring-white/10`
                                            : "bg-background border-transparent hover:bg-accent/50 hover:scale-105"
                                    )}
                                >
                                    <span className="text-3xl sm:text-4xl mb-3 transition-transform duration-300 drop-shadow-sm">{mood.icon}</span>
                                    <span className={cn(
                                        "text-[11px] font-bold uppercase tracking-wider truncate w-full text-center",
                                        isActive ? mood.color : "text-muted-foreground"
                                    )}>{mood.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
