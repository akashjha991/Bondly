"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, ChevronRight, Wallet, Smile, BarChart3, Settings, Loader2 } from "lucide-react";
import { XPProgressBar } from "./XPProgressBar";
import { updateProfile } from "@/app/dashboard/profile/actions";
import { toast } from "sonner";
import { useSocket } from "@/components/providers/SocketProvider";
import { useRouter } from "next/navigation";

type UserProfile = {
  name: string | null;
  image: string | null;
  xp: number;
  level: number;
};

export function ProfileOverviewCard({ user }: { user: UserProfile }) {
  const { isConnected } = useSocket();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(user.image || "");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const menu = [
    { label: "Mood tracker", href: "/dashboard/mood", icon: Smile },
    { label: "Expenses", href: "/dashboard/expenses", icon: Wallet },
    { label: "Relationship stats", href: "/dashboard/notes", icon: BarChart3 },
    { label: "Settings", href: "/dashboard/profile/settings", icon: Settings },
  ];

  const onFile = (f: File | null) => {
    setFile(f);
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const saveImage = async () => {
    if (!file) return;
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("upload failed");
      const { url } = await uploadRes.json();
      await updateProfile({ imageUrl: url });
      toast.success("Profile photo updated");
      setOpen(false);
      setFile(null);
      router.refresh();
    } catch {
      toast.error("Could not update profile photo");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card className="rounded-[20px] p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button className="group relative">
                <Avatar className="h-16 w-16 ring-2 ring-border">
                  <AvatarImage src={user.image || ""} />
                  <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-1 -right-1 rounded-full bg-card p-1 shadow">
                  <Camera className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground" />
                </span>
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-[20px]">
              <DialogHeader>
                <DialogTitle>Update profile photo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border border-border">
                  <img src={preview || user.image || ""} alt="Preview" className="h-full w-full object-cover" />
                </div>
                <div>
                  <Label htmlFor="profile-file">Image</Label>
                  <Input
                    ref={inputRef}
                    id="profile-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => onFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={saveImage} disabled={!file || saving} className="w-full rounded-full bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] text-white">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save photo"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div>
            <h1 className="text-xl font-bold">{user.name || "User"}</h1>
            <p className="text-sm text-muted-foreground">Relationship level {user.level || 1}</p>
            <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
              <span className={`h-2 w-2 rounded-full ${isConnected ? "bg-emerald-500" : "bg-zinc-400"}`} />
              {isConnected ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <XPProgressBar xp={user.xp || 0} level={user.level || 1} className="mt-4" />
      </Card>

      {menu.map((item) => {
        const Icon = item.icon;
        return (
          <Link href={item.href} key={item.label}>
            <Card className="flex items-center justify-between rounded-[20px] p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-accent p-2"><Icon className="h-5 w-5" /></span>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
