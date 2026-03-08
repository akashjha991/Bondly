import { CalendarTracker } from "@/components/features/calendar/CalendarTracker";
import { getEvents } from "./actions";

export default async function CalendarPage() {
    const events = await getEvents();

    return (
        <div className="h-full pt-8 pb-16">
            <CalendarTracker initialEvents={events} />
        </div>
    );
}
