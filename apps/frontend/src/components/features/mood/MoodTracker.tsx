"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { addMood } from "@/app/dashboard/mood/actions";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const EMOJIS = [
    { icon: "🤩", label: "Amazing" },
    { icon: "😊", label: "Good" },
    { icon: "😐", label: "Okay" },
    { icon: "😔", label: "Rough" },
    { icon: "😡", label: "Frustrated" },
    { icon: "🤒", label: "Sick" },
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

export function MoodTracker({ history }: { history: Mood[] }) {
    const { data: session } = useSession();
    const user = session?.user;
    const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const today = new Date();
    const myMoods = history.filter((m) => m.user.id === user?.id);
    const myMoodToday = myMoods.find((m) => isSameDay(new Date(m.date), today));

    const partnerMoods = history.filter((m) => m.user.id !== user?.id);
    const partnerMoodToday = partnerMoods.find((m) => isSameDay(new Date(m.date), today));

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
        <div className="space-y-8 max-w-2xl mx-auto w-full">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-2">How are you feeling today?</h2>
                <p className="text-slate-500">Check in with your partner.</p>
            </div>

            {/* Today's Status */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900 shadow-none">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-rose-600 dark:text-rose-400 mb-2">You</span>
                        <div className="text-5xl mb-2">
                            {myMoodToday?.emoji || "💭"}
                        </div>
                        <span className="text-xs text-rose-500 font-medium">
                            {myMoodToday ? "Checked in" : "Waiting for you"}
                        </span>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-none">
                    <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Partner</span>
                        <div className="text-5xl mb-2 opacity-80">
                            {partnerMoodToday?.emoji || "💭"}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">
                            {partnerMoodToday ? "Checked in" : "Has not checked in"}
                        </span>
                    </CardContent>
                </Card>
            </div>

            {/* Mood Selector Picker */}
            <Card className="shadow-sm">
                <CardContent className="p-6">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
                        {EMOJIS.map((mood) => {
                            const isActive = (myMoodToday?.emoji === mood.icon) || (selectedEmoji === mood.icon);
                            return (
                                <button
                                    key={mood.label}
                                    disabled={isSubmitting}
                                    onClick={() => handleSave(mood.icon)}
                                    className={cn(
                                        "flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200",
                                        isActive
                                            ? "bg-rose-100 dark:bg-rose-900 scale-110 ring-2 ring-rose-500 border-transparent shadow-sm"
                                            : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:scale-105"
                                    )}
                                >
                                    <span className="text-3xl sm:text-4xl mb-2 transition-transform">{mood.icon}</span>
                                    <span className="text-[10px] font-medium text-slate-500 truncate w-full">{mood.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* Mini History view could go here. For now keeping it simple as an MVP component. */}
        </div>
    );
}
