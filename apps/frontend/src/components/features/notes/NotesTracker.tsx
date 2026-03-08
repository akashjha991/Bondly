"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveNote, deleteNote } from "@/app/dashboard/notes/actions";
import { Plus, StickyNote, Trash2, Edit3, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Note = {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
    author: {
        name: string | null;
    };
};

export function NotesTracker({ notes }: { notes: Note[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Edit mode state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const openNewNote = () => {
        setEditingId(null);
        setTitle("");
        setContent("");
        setIsOpen(true);
    };

    const openEditNote = (note: Note) => {
        setEditingId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsSubmitting(true);
        try {
            await saveNote(editingId, title, content);
            toast.success(editingId ? "Note updated" : "Note created");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to save note");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            await deleteNote(id);
            toast.success("Note deleted");
        } catch (error) {
            toast.error("Failed to delete note");
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Shared Notes</h2>
                    <p className="text-slate-500 text-sm">Lists, ideas, and everything in between</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={openNewNote} className="bg-amber-500 hover:bg-amber-600">
                            <Plus className="w-4 h-4 mr-2" /> New Note
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Note" : "Create Note"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="sr-only">Title</Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note Title"
                                    className="text-lg font-semibold border-0 focus-visible:ring-0 px-0 rounded-none border-b focus-visible:border-amber-500"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content" className="sr-only">Content</Label>
                                <Textarea
                                    id="content"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Write something..."
                                    className="min-h-[200px] border-0 focus-visible:ring-0 px-0 resize-none text-base"
                                    required
                                />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button type="submit" className="bg-amber-500 hover:bg-amber-600" disabled={isSubmitting}>
                                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {editingId ? "Update Note" : "Save Note"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {notes.length === 0 ? (
                    <div className="col-span-full text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 border-dashed">
                        <StickyNote className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No notes yet</h3>
                        <p className="text-sm text-slate-500 mt-1">Create your first shared note to get started.</p>
                    </div>
                ) : (
                    notes.map((note) => (
                        <Card
                            key={note.id}
                            onClick={() => openEditNote(note)}
                            className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30 cursor-pointer hover:shadow-md transition-shadow group flex flex-col h-[280px]"
                        >
                            <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                                <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">
                                    {note.title}
                                </CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -mt-2 -mr-2"
                                    onClick={(e) => handleDelete(note.id, e)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </CardHeader>
                            <CardContent className="flex-1 overflow-hidden relative">
                                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words">
                                    {note.content}
                                </p>
                                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-amber-50/50 dark:from-slate-900 to-transparent pointer-events-none" />
                            </CardContent>
                            <CardFooter className="pt-3 pb-4 text-xs text-slate-400 border-t border-amber-100/50 dark:border-amber-900/20 bg-white/50 dark:bg-inherit flex justify-between">
                                <span>{format(new Date(note.updatedAt), "MMM d, yyyy")}</span>
                                <span>{note.author.name}</span>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
