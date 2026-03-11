import { ChatRoom } from "@/components/features/chat/ChatRoom";
import { getMessages, getPartnerInfo } from "../actions";
import { getProfileStats } from "../profileActions";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { relationshipId } = await getProfileStats();
  if (!relationshipId) redirect("/dashboard/onboarding");
  const initialMessages = await getMessages(50);
  const partner = await getPartnerInfo();
  return <ChatRoom initialMessages={initialMessages} partner={partner} />;
}
