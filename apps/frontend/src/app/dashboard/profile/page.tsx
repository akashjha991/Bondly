import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileOverviewCard } from "@/components/features/profile/ProfileOverviewCard";

export default async function ProfilePage() {
  const session = await getAuthSession();
  const userId = session?.user?.id;
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { name: true, image: true, xp: true, level: true },
  });
  if (!user) redirect("/sign-in");

  return (
    <ProfileOverviewCard
      user={{ name: user.name, image: user.image, xp: user.xp ?? 0, level: user.level ?? 1 }}
    />
  );
}
