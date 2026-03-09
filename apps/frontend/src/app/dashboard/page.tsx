import { getMessages, getPartnerInfo } from "./actions";
import { getProfileStats } from "./profileActions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MessageCircleHeart } from "lucide-react";

export default async function DashboardPage() {
    const { relationshipId } = await getProfileStats();
    if (!relationshipId) {
        redirect("/dashboard/onboarding");
    }

    const initialMessages = await getMessages(1); // just get latest msg
    const partner = await getPartnerInfo();
    const latestMessage = initialMessages.length > 0 ? initialMessages[initialMessages.length - 1] : null;

    return (
        <div className="h-full flex flex-col pt-4 px-4 sm:px-6">
            <h1 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <MessageCircleHeart className="w-6 h-6 text-rose-500" />
                Messages
            </h1>

            <div className="flex flex-col gap-2">
                <Link
                    href="/dashboard/chat"
                    className="flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors bg-white/50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm"
                >
                    <Avatar className="w-14 h-14 border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                        <AvatarImage src={partner?.image || ""} />
                        <AvatarFallback className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100 font-semibold text-lg">
                            {partner?.name?.substring(0, 2).toUpperCase() || "PA"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">
                                {partner?.name || "Partner"}
                            </span>
                            {latestMessage && (
                                <span className="text-xs text-slate-500 shrink-0">
                                    {format(new Date(latestMessage.createdAt), "MMM d")}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate w-full">
                            {latestMessage ? latestMessage.content : "Tap to start chatting"}
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
