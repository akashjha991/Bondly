"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMemory } from "@/app/dashboard/memories/actions";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Memory = {
    id: string;
    imageUrl: string;
    caption: string | null;
    date: Date;
    user: {
        id: string;
        name: string | null;
        image: string | null;
    };
};

export function MemoryTimeline({ initialMemories }: { initialMemories: Memory[] }) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        const submitData = new FormData(e.currentTarget);

        setIsUploading(true);
        try {
            // 1. Upload to Cloudinary via our API route
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const { url } = await uploadRes.json();

            // 2. Save Memory to DB
            await addMemory(submitData, url);

            toast.success("Memory added!");
            setIsOpen(false);
            setFile(null);
            router.refresh();

        } catch (error) {
            console.error("Upload Error:", error);
            toast.error("Failed to add memory");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Timeline</h2>
                    <p className="text-slate-500 text-sm">A collection of your moments together</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="icon" className="rounded-full bg-rose-500 hover:bg-rose-600 h-10 w-10">
                            <Plus className="w-5 h-5" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-0 sm:rounded-2xl">
                        <DialogHeader>
                            <DialogTitle>Add a new memory</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="photo">Photo</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="photo"
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        className="file:bg-rose-50 file:text-rose-600 file:border-0 file:rounded-md file:px-4 file:py-1 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="caption">Caption (Optional)</Label>
                                <Input id="caption" name="caption" placeholder="Remember when..." />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input id="date" name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900" disabled={isUploading || !file}>
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImageIcon className="mr-2 h-4 w-4" />}
                                    {isUploading ? "Uploading..." : "Save Memory"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {initialMemories.length === 0 ? (
                <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                    <ImageIcon className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No memories yet</h3>
                    <p className="text-sm text-slate-500 mt-1">Add your first photo to start the timeline.</p>
                </div>
            ) : (
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-800 before:to-transparent">
                    {initialMemories.map((memory) => (
                        <div key={memory.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-950 bg-white dark:bg-slate-900 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                <Avatar className="w-8 h-8 rounded-full">
                                    <AvatarImage src={memory.user.image || ""} />
                                    <AvatarFallback className="text-[10px]">{memory.user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                            </div>

                            <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] border-0 shadow-sm ring-1 ring-slate-100 dark:ring-slate-800 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                                <img src={memory.imageUrl} alt={memory.caption || "Memory"} className="w-full aspect-square object-cover" loading="lazy" />
                                {(memory.caption || memory.date) && (
                                    <CardContent className="p-4 bg-white dark:bg-slate-900">
                                        {memory.caption && <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{memory.caption}</p>}
                                        <time className="text-xs text-slate-400 font-medium block mt-1">
                                            {format(new Date(memory.date), "MMMM d, yyyy")}
                                        </time>
                                    </CardContent>
                                )}
                            </Card>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
