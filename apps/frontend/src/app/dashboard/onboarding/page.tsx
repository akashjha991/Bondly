"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getMyBondlyId } from "@/app/dashboard/actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Copy, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();

    const [inviteCode, setInviteCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const [myInviteCode, setMyInviteCode] = useState("BOND...");

    useEffect(() => {
        getMyBondlyId().then(setMyInviteCode);
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(myInviteCode);
        setIsCopied(true);
        toast.success("Invite code copied!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteCode.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ inviteCode }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Failed to join relationship");
            }

            // Relationship handled externally or via refresh
            toast.success("Successfully paired!");
            router.push("/dashboard");
            router.refresh();

        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to join relationship";
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
            <Card className="w-full max-w-lg border-0 shadow-2xl ring-1 ring-slate-100 dark:ring-slate-800">
                <CardHeader className="text-center pb-8">
                    <CardTitle className="text-3xl font-bold">Find Your Person</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Bondly is built for two. Share your invite code or enter your partner’s code to begin.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-8">
                    {/* Share Code Section */}
                    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl flex flex-col items-center gap-4">
                        <span className="text-sm font-medium text-slate-500 uppercase tracking-widest">Your Code</span>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl font-black text-rose-500 tracking-wider font-mono bg-rose-50 dark:bg-rose-950/30 px-6 py-2 rounded-xl">
                                {myInviteCode}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                className="rounded-full w-12 h-12 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900"
                            >
                                {isCopied ? <CheckCircle2 className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                            </Button>
                        </div>
                        <p className="text-sm text-center text-slate-500">
                            Send this to your partner. Once they enter it, your private space will be unlocked.
                        </p>
                    </div>

                    <div className="relative flex items-center py-2">
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                        <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-medium uppercase">Or enter code</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    </div>

                    {/* Enter Code Section */}
                    <form onSubmit={handleJoin} className="space-y-4">
                        <div className="space-y-2">
                            <Input
                                placeholder="Enter partner’s 9-character code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                                className="text-center font-mono text-lg uppercase h-14 rounded-xl border-slate-200 focus-visible:ring-rose-500"
                                maxLength={9}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                            disabled={isLoading || inviteCode.length < 5}
                        >
                            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            Connect Accounts
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
