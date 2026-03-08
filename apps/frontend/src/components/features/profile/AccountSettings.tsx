"use client";

import { useState } from "react";
import { deleteAccount } from "@/app/dashboard/profile/settings-actions";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";

export function AccountSettings() {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteAccount();
            toast.success("Account deleted successfully.");
            setIsDialogOpen(false);
            // Sign out to clear session and redirect to login
            await signOut({ callbackUrl: "/sign-in" });
        } catch (error) {
            toast.error("Failed to delete account. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <Card className="border-red-200 dark:border-red-900/50 shadow-sm mt-8 bg-white dark:bg-slate-900">
            <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <CardTitle className="text-red-600 dark:text-red-500">Delete Account</CardTitle>
                    <CardDescription className="mt-1">
                        Permanently delete your account and remove your personal data from our servers.
                        This action cannot be undone.
                    </CardDescription>
                </div>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" className="shrink-0">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Account
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Delete Account</DialogTitle>
                            <DialogDescription>
                                Are you absolutely sure you want to delete your account?
                                This will permanently erase your profile and you will be disconnected from any active relationship.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="mt-4">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                Permanently Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardHeader>
        </Card>
    );
}
