import { MoodTracker } from "@/components/features/mood/MoodTracker";
import { getMoodHistory } from "./actions";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export default async function MoodPage() {
    const history = await getMoodHistory(7);

    const session = await getAuthSession();
    const userId = session?.user?.id;

    if (!userId) {
        redirect("/sign-in");
    }

    const fetchedUser = await db.user.findUnique({
        where: { id: userId },
        select: {
            xp: true,
            level: true,
            relationship: {
                select: {
                    streakDays: true
                }
            }
        }
    });

    const xp = fetchedUser?.xp || 0;
    const level = fetchedUser?.level || 1;
    const streak = fetchedUser?.relationship?.streakDays || 0;

    return (
        <div className="h-full pt-8 pb-16">
            <MoodTracker history={history} userXp={xp} userLevel={level} streakDays={streak} />
        </div>
    );
}
