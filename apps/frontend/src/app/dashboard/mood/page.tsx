import { MoodTracker } from "@/components/features/mood/MoodTracker";
import { getMoodHistory } from "./actions";

export default async function MoodPage() {
    const history = await getMoodHistory(7);

    return (
        <div className="h-full pt-8 pb-16">
            <MoodTracker history={history} />
        </div>
    );
}
