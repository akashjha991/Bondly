import { ChatRoom } from "@/components/features/chat/ChatRoom";
import { getMessages, getPartnerInfo } from "../actions";
import { getProfileStats } from "../profileActions";
import { redirect } from "next/navigation";

export default async function ChatPage() {
    const { relationshipId } = await getProfileStats();
    if (!relationshipId) {
        redirect("/dashboard/onboarding");
    }

    const initialMessages = await getMessages(50);
    const partner = await getPartnerInfo();

    return (
        <div className="h-[100dvh] flex flex-col w-full bg-slate-50 dark:bg-slate-950 overflow-hidden absolute inset-0">
            <div className="flex-1 w-full h-full relative">
                <ChatRoom initialMessages={initialMessages} partner={partner} />
            </div>
        </div>
    );
}
