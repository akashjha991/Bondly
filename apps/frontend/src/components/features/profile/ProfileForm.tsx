"use client";

import { useState, useRef } from "react";
import { updateProfile } from "@/app/dashboard/profile/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2, Camera, User, Mail, Hash } from "lucide-react";

interface InitialUser {
    name: string | null;
    email: string | null;
    image: string | null;
    bondlyId: string | null;
}

export function ProfileForm({ initialUser }: { initialUser: InitialUser }) {
    const [name, setName] = useState(initialUser.name || "");
    const [imageUrl, setImageUrl] = useState(initialUser.image || "");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Failed to upload image");

            const { url } = await uploadRes.json();
            setImageUrl(url);
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("Failed to upload image. Please try again.");
            console.error(error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error("Name cannot be empty");
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({ name, imageUrl });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg ring-1 ring-slate-100 dark:ring-slate-800">
            <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your photo and personal details here.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSave}>
                <CardContent className="space-y-8">
                    {/* Profile Picture Upload section */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <div className="relative group">
                            <Avatar className="w-24 h-24 border-4 border-white dark:border-slate-950 shadow-md">
                                <AvatarImage src={imageUrl} className="object-cover" />
                                <AvatarFallback className="bg-rose-100 text-rose-500 text-2xl">
                                    {name.charAt(0).toUpperCase() || <User className="w-10 h-10" />}
                                </AvatarFallback>
                            </Avatar>

                            <button
                                type="button"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                        </div>
                        <div className="text-center md:text-left">
                            <h3 className="font-semibold text-lg">{initialUser.name || "Your Name"}</h3>
                            <p className="text-sm text-slate-500 mb-2">JPG, GIF or PNG. 5MB max.</p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isUploading}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Change Picture
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Display Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-9"
                                    placeholder="Enter your name"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 opacity-70">
                            <Label htmlFor="email">Email Address <span className="text-xs text-slate-400 font-normal ml-2">(Cannot be changed)</span></Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="email"
                                    value={initialUser.email || ""}
                                    readOnly
                                    className="pl-9 bg-slate-50 dark:bg-slate-900 border-slate-200"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2 opacity-70">
                            <Label htmlFor="bondlyId">Your Invite Code</Label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <Input
                                    id="bondlyId"
                                    value={initialUser.bondlyId || ""}
                                    readOnly
                                    className="pl-9 font-mono bg-rose-50/50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/50 text-rose-600 dark:text-rose-400"
                                />
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-b-xl border-t border-slate-100 dark:border-slate-800">
                    <Button type="submit" disabled={isSaving || isUploading} className="bg-rose-500 hover:bg-rose-600 text-white min-w-[100px]">
                        {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Save Changes"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
