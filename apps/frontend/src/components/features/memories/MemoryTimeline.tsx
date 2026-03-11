"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { format } from "date-fns";
import { addMemory } from "@/app/dashboard/memories/actions";
import { toast } from "sonner";
import { MemoryCard } from "./MemoryCard";

type Memory = { id: string; imageUrl: string; caption: string | null; date: Date };

export function MemoryTimeline({ initialMemories }: { initialMemories: Memory[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (searchParams.get("addMemory") === "1") setIsOpen(true);
  }, [searchParams]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    try {
      const submitData = new FormData(e.currentTarget);
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("upload failed");
      const { url } = await uploadRes.json();
      await addMemory(submitData, url);
      setIsOpen(false);
      toast.success("Memory added");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Failed to add memory");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-bold">Shared memories</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {initialMemories.map((memory) => (
          <MemoryCard key={memory.id} imageUrl={memory.imageUrl} caption={memory.caption} date={memory.date} />
        ))}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Add Memory</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleUpload}>
            <div>
              <Label htmlFor="photo">Image</Label>
              <Input id="photo" name="photo" type="file" accept="image/*" required onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input id="caption" name="caption" placeholder="A sweet memory" />
            </div>
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" defaultValue={format(new Date(), "yyyy-MM-dd")} />
            </div>
            <Button type="submit" disabled={isUploading || !file} className="w-full rounded-full bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] text-white">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
