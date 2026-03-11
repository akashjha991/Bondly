"use client";

import { useState } from "react";
import { addMood } from "@/app/dashboard/mood/actions";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { XPProgressBar } from "@/components/features/profile/XPProgressBar";

const EMOJIS = ["🤩", "😊", "😐", "😔", "😡", "🤒"];

type Mood = { id: string; emoji: string; date: Date; user: { id: string; name: string | null } };

export function MoodTracker({ history, userXp = 0, userLevel = 1, streakDays = 0 }: { history: Mood[]; userXp?: number; userLevel?: number; streakDays?: number }) {
  const [saving, setSaving] = useState(false);

  const onPick = async (emoji: string) => {
    setSaving(true);
    try {
      await addMood(emoji);
      toast.success("Mood saved");
    } catch {
      toast.error("Mood save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card className="rounded-3xl p-5">
        <h2 className="mb-3 text-lg font-semibold">Mood + XP</h2>
        <div className="mb-4 flex gap-2">
          {EMOJIS.map((emoji) => (
            <button key={emoji} disabled={saving} onClick={() => onPick(emoji)} className="rounded-2xl border border-border bg-card px-3 py-2 text-2xl">
              {emoji}
            </button>
          ))}
        </div>
        <XPProgressBar xp={userXp} level={userLevel} />
        <p className="mt-3 text-sm text-muted-foreground">Current streak: {streakDays} days</p>
      </Card>

      <Card className="rounded-3xl p-5">
        <h3 className="mb-3 font-semibold">Mood history chart</h3>
        <div className="grid grid-cols-7 gap-2">
          {history.slice(0, 7).map((m) => (
            <div key={m.id} className="rounded-2xl bg-accent p-3 text-center text-xl">
              {m.emoji}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
