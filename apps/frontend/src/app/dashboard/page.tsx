import { ChatRoom } from "@/components/features/chat/ChatRoom";
import { getMessages } from "./actions";
import { getProfileStats } from "./profileActions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const { relationshipId } = await getProfileStats();
    if (!relationshipId) {
        redirect("/dashboard/onboarding");
    }

    const initialMessages = await getMessages(50);

    return (
        <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0">
                <ChatRoom initialMessages={initialMessages} />
            </div>
        </div>
    );
}
