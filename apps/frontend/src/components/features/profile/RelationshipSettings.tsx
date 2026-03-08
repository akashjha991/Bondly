"use client";

import { useState } from "react";
import { format } from "date-fns";
import { updateAnniversary, disconnectPartner } from "@/app/dashboard/profile/settings-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, CalendarHeart, Unplug, User } from "lucide-react";
import { useRouter } from "next/navigation";

interface PartnerDetails {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
}

interface RelationshipData {
    id: string;
    anniversaryDate: Date | null;
    partner: PartnerDetails | null;
}

export function RelationshipSettings({ relationship }: { relationship: RelationshipData | null }) {
    const router = useRouter();
    const [isSavingDate, setIsSavingDate] = useState(false);
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Default to today if null
    const initialDate = relationship?.anniversaryDate
        ? format(new Date(relationship.anniversaryDate), "yyyy-MM-dd")
        : "";

    const [anniversary, setAnniversary] = useState(initialDate);

    if (!relationship) return null;

    const handleSaveAnniversary = async () => {
        if (!anniversary) return;
        setIsSavingDate(true);
        try {
            await updateAnniversary(anniversary);
            toast.success("Anniversary date updated!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update anniversary date.");
        } finally {
            setIsSavingDate(false);
        }
    };

    const handleDisconnect = async () => {
        setIsDisconnecting(true);
        try {
            await disconnectPartner();
            toast.success("Disconnected successfully.");
            setIsDialogOpen(false);
            router.push("/dashboard"); // Will redirect to connection screen if relationshipId is null
        } catch (error) {
            toast.error("Failed to disconnect.");
            setIsDisconnecting(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg ring-1 ring-slate-100 dark:ring-slate-800 mt-8">
            <CardHeader>
                <CardTitle>Relationship Settings</CardTitle>
                <CardDescription>Manage your partnership and connection details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">

                {relationship.partner ? (
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <Avatar className="w-16 h-16 border-2 border-white dark:border-slate-950 shadow-sm">
                            <AvatarImage src={relationship.partner.image || ""} className="object-cover" />
                            <AvatarFallback className="bg-rose-100 text-rose-500 text-xl">
                                {relationship.partner.name?.charAt(0).toUpperCase() || <User className="w-8 h-8" />}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-lg">{relationship.partner.name || "Unknown Partner"}</h3>
                            <p className="text-sm text-slate-500">{relationship.partner.email}</p>
                            <span className="inline-block px-2 py-1 mt-1 text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                                Currently Connected
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-center text-slate-500">
                        <p>You are not connected to a partner yet.</p>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="anniversary">Anniversary Date</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <CalendarHeart className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="anniversary"
                                    type="date"
                                    value={anniversary}
                                    onChange={(e) => setAnniversary(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                            <Button
                                onClick={handleSaveAnniversary}
                                disabled={isSavingDate || anniversary === initialDate || !anniversary}
                                variant="secondary"
                            >
                                {isSavingDate ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Date"}
                            </Button>
                        </div>
                    </div>
                </div>

            </CardContent>

            {relationship.partner && (
                <div className="px-6 pb-6 pt-2">
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h4>
                            <p className="text-sm text-red-500/80 dark:text-red-400/80 mt-1">
                                Disconnecting will remove your access to shared memories, chats, and expenses.
                            </p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="destructive" className="shrink-0 w-full md:w-auto">
                                    <Unplug className="w-4 h-4 mr-2" />
                                    Disconnect Partner
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action will disconnect you from {relationship.partner.name || "your partner"}.
                                        You will lose immediate access to your shared Bondly dashboard.
                                        You can reconnect later by exchanging invite codes again.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="mt-4">
                                    <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isDisconnecting}>
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" onClick={handleDisconnect} disabled={isDisconnecting}>
                                        {isDisconnecting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                        Yes, Disconnect
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            )}
        </Card>
    );
}
