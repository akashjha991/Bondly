"use client";

import { useTheme } from "next-themes";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm mt-8 bg-white dark:bg-slate-900">
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Select your preferred theme.</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm mt-8 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        Appearance
                    </CardTitle>
                    <CardDescription className="mt-1">
                        Customize the look and feel of your app.
                    </CardDescription>
                </div>

                <div className="relative shrink-0">
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full md:w-48 appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                    >
                        <option value="light">Light Mode</option>
                        <option value="dark">Dark Mode</option>
                        <option value="system">System Default</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                        {theme === 'light' && <Sun className="h-4 w-4" />}
                        {theme === 'dark' && <Moon className="h-4 w-4" />}
                        {theme === 'system' && <Monitor className="h-4 w-4" />}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
