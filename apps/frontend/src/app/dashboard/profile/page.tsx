import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, Wallet, Smile, Heart, ChevronRight, Edit3, Image as ImageIcon } from "lucide-react";

export default async function ProfilePage() {
    const session = await getAuthSession();
    const userId = session?.user?.id;
    const fetchedUser = userId ? await db.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            xp: true,
            level: true,
            relationshipId: true,
            relationship: {
                select: {
                    id: true,
                    anniversaryDate: true,
                }
            }
        },
    }) : null;

    if (!fetchedUser) {
        redirect("/sign-in");
    }

    const xp = fetchedUser.xp || 0;
    const level = fetchedUser.level || 1;
    const xpCurrentLevel = xp % 100;

    const menuItems = [
        {
            title: "Mood Tracker",
            description: "Log your daily feelings",
            icon: Smile,
            href: "/dashboard/mood",
            color: "text-amber-500",
            bg: "bg-amber-500/10"
        },
        {
            title: "Expenses",
            description: "Manage shared costs",
            icon: Wallet,
            href: "/dashboard/expenses",
            color: "text-emerald-500",
            bg: "bg-emerald-500/10"
        },
        {
            title: "Settings",
            description: "App and account preferences",
            icon: Settings,
            href: "/dashboard/profile/settings",
            color: "text-slate-500",
            bg: "bg-slate-500/10"
        }
    ];

    return (
        <div className="h-full overflow-y-auto pb-24 md:pb-8 bg-background relative">
            {/* Soft decorative background element */}
            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-bondly-pink/10 to-transparent pointer-events-none"></div>

            <div className="max-w-2xl mx-auto p-4 sm:p-6 relative z-10 space-y-6 pt-8">

                {/* Top Profile Card */}
                <div className="bg-card border border-border shadow-sm rounded-[32px] p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden group">
                    <div className="relative mb-4">
                        <Avatar className="w-24 h-24 sm:w-28 sm:h-28 border-4 border-background shadow-md">
                            <AvatarImage src={fetchedUser.image || ""} />
                            <AvatarFallback className="bg-bondly-pink/10 text-bondly-pink text-2xl font-bold">
                                {fetchedUser.name?.substring(0, 2).toUpperCase() || "US"}
                            </AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-bondly-pink to-bondly-purple text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                            <ImageIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <h1 className="text-2xl font-bold text-foreground mb-1">{fetchedUser.name || "User"}</h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Edit3 className="w-3 h-3" /> Edit Info
                    </p>

                    <div className="mt-8 w-full max-w-sm bg-accent/50 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex flex-col items-start">
                                <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Level</span>
                                <span className="text-2xl font-black bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent">{level}</span>
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">
                                {xpCurrentLevel} <span className="text-xs">/ 100 XP</span>
                            </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-bondly-pink to-bondly-purple h-2.5 rounded-full transition-all duration-1000 ease-out"
                                style={{ width: `${Math.max(2, xpCurrentLevel)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation List */}
                <div className="flex flex-col gap-3">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground ml-2 mb-1">Your Space</h2>
                    {menuItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={idx}
                                href={item.href}
                                className="flex items-center p-4 bg-card border border-border rounded-[24px] hover:shadow-md transition-all duration-200 group"
                            >
                                <div className={`w-12 h-12 flex items-center justify-center rounded-2xl ${item.bg} ${item.color} mr-4 transition-transform group-hover:scale-105`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-semibold text-foreground text-[16px]">{item.title}</span>
                                    <span className="text-sm text-muted-foreground">{item.description}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-muted-foreground/50 group-hover:text-foreground transition-colors group-hover:translate-x-1" />
                            </Link>
                        );
                    })}
                </div>

            </div>
        </div>
    );
}
