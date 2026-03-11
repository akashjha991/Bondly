"use client";

import { ReactNode } from "react";
import { BottomNavigation, TopNavigation } from "@/components/features/navigation/Navigation";

export function ClientLayout({ children }: { children: ReactNode; xp: number; level: number }) {
  return (
    <div className="min-h-[100dvh] bg-background">
      <TopNavigation />
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-4 md:px-6 md:pb-8">{children}</main>
      <BottomNavigation />
    </div>
  );
}
