import { NotesTracker } from "@/components/features/notes/NotesTracker";
import { getNotes } from "./actions";

export default async function NotesPage() {
    const notes = await getNotes();

    return (
        <div className="h-full pt-8 pb-16">
            <NotesTracker notes={notes} />
        </div>
    );
}
