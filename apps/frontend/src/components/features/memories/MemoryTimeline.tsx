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
import { Plus, Image as ImageIcon, Loader2, Heart } from "lucide-react";
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
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const { url } = await uploadRes.json();

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
        <div className="h-full relative w-full pb-20 md:pb-8 p-4 sm:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent w-max">Shared Memories</h2>
                <p className="text-muted-foreground text-sm">A beautiful collection of your moments together</p>
            </div>

            {initialMemories.length === 0 ? (
                <div className="text-center p-12 bg-card rounded-3xl border border-border border-dashed shadow-sm">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold text-foreground">No memories yet</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add your first photo to start the collection.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 auto-rows-max">
                    {initialMemories.map(memory => (
                        <Card key={memory.id} className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all duration-300 rounded-[24px] group flex flex-col">
                            <div className="relative aspect-square w-full bg-muted/20">
                                <img src={memory.imageUrl} alt={memory.caption || "Memory"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-black/60">
                                    <Heart className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
                                {memory.caption && <p className="text-sm font-medium text-foreground line-clamp-2 leading-relaxed">{memory.caption}</p>}
                                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                                    <time className="text-xs text-muted-foreground font-medium">
                                        {format(new Date(memory.date), "MMM d, yyyy")}
                                    </time>
                                    <Avatar className="w-6 h-6 border border-background">
                                        <AvatarImage src={memory.user.image || ""} />
                                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">{memory.user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 h-14 w-14 rounded-full shadow-[0_4px_14px_0_rgba(255,110,199,0.39)] hover:shadow-[0_6px_20px_rgba(255,110,199,0.23)] hover:-translate-y-1 transition-all duration-200 bg-gradient-to-tr from-bondly-pink to-bondly-purple border-0 z-40">
                        <Plus className="w-6 h-6 text-white" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md border-border sm:rounded-3xl bg-card shadow-lg p-6 sm:p-8">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent">Add a new memory</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUpload} className="space-y-5">
                        <div className="space-y-3">
                            <Label htmlFor="photo" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Photo</Label>
                            <Input
                                id="photo"
                                name="photo"
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="file:bg-bondly-pink/10 file:text-bondly-pink file:border-0 file:rounded-full file:px-4 file:py-1 cursor-pointer h-12 w-full rounded-2xl file:mr-4 border-border bg-background"
                            />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="caption" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Caption (Optional)</Label>
                            <Input id="caption" name="caption" placeholder="Remember when..." className="h-12 rounded-2xl border-border bg-background focus-visible:ring-bondly-pink focus-visible:ring-offset-0" />
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</Label>
                            <Input id="date" name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} className="h-12 rounded-2xl border-border bg-background focus-visible:ring-bondly-pink focus-visible:ring-offset-0" />
                        </div>

                        <div className="pt-4">
                            <Button type="submit" className="w-full h-12 rounded-full bg-gradient-to-r from-bondly-pink to-bondly-purple text-white hover:opacity-90 transition-opacity font-semibold shadow-md" disabled={isUploading || !file}>
                                {isUploading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <ImageIcon className="mr-2 h-5 w-5" />}
                                {isUploading ? "Uploading..." : "Save Memory"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
