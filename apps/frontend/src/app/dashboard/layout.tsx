import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { ClientLayout } from "./ClientLayout";
import { Toaster } from "@/components/ui/sonner";
import { getProfileStats } from "./profileActions";
import { db } from "@/lib/db";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getAuthSession();

    if (!session?.user) {
        redirect("/sign-in");
    }

    const { xp, level, relationshipId } = await getProfileStats();

    return (
        <SocketProvider relationshipId={relationshipId || ""}>
            <ClientLayout xp={xp || 0} level={level || 1}>
                {children}
            </ClientLayout>
            <Toaster position="top-center" richColors />
        </SocketProvider>
    );
}
