"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { BottomNavigation, TopNavigation } from "@/components/features/navigation/Navigation";

export function ClientLayout({ children }: { children: ReactNode; xp: number; level: number }) {
  const pathname = usePathname();
  const isChatPage = pathname === "/dashboard/chat";

  if (isChatPage) {
    return <div className="h-[100dvh] overflow-hidden bg-background">{children}</div>;
  }

  return (
    <div className="min-h-[100dvh] bg-background">
      <TopNavigation />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 md:px-6 md:pb-8">{children}</main>
      <BottomNavigation />
    </div>
  );
}
