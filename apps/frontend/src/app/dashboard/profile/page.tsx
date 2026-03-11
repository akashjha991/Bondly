import Link from "next/link";
import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { XPProgressBar } from "@/components/features/profile/XPProgressBar";
import { ChevronRight, Wallet, Smile, BarChart3, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await getAuthSession();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { id: userId }, select: { name: true, image: true, xp: true, level: true } });
  if (!user) redirect("/sign-in");

  const menu = [
    { label: "Mood tracker", href: "/dashboard/mood", icon: Smile },
    { label: "Expenses", href: "/dashboard/expenses", icon: Wallet },
    { label: "Relationship stats", href: "/dashboard/notes", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/profile/settings", icon: Settings },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || ""} />
            <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">{user.name || "User"}</h1>
            <p className="text-sm text-muted-foreground">Relationship level {user.level ?? 1}</p>
          </div>
        </div>
        <XPProgressBar xp={user.xp ?? 0} level={user.level ?? 1} className="mt-4" />
      </Card>

      {menu.map((item) => {
        const Icon = item.icon;
        return (
          <Link href={item.href} key={item.label}>
            <Card className="flex items-center justify-between rounded-3xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-accent p-2"><Icon className="h-5 w-5" /></span>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
