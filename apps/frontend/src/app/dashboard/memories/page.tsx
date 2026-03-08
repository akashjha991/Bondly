import { MemoryTimeline } from "@/components/features/memories/MemoryTimeline";
import { getMemories } from "./actions";

export default async function MemoriesPage() {
    const initialMemories = await getMemories();

    return (
        <div className="h-full pb-8">
            <MemoryTimeline initialMemories={initialMemories} />
        </div>
    );
}
