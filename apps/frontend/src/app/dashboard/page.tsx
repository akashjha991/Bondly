import { MemoryTimeline } from "@/components/features/memories/MemoryTimeline";
import { getMemories } from "./memories/actions";

export default async function DashboardPage() {
  const initialMemories = await getMemories();
  return <MemoryTimeline initialMemories={initialMemories} />;
}
