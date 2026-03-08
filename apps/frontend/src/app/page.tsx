import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth/session";

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user?.id) {
    redirect("/dashboard");
  } else {
    redirect("/sign-in");
  }
}
