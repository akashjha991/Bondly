"use client";

import { useState } from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { addEvent } from "@/app/dashboard/calendar/actions";
import { Plus, CalendarHeart, Loader2, Sparkles, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type CalendarEvent = {
    id: string;
    title: string;
    description: string | null;
    date: Date;
    isAnniversary: boolean;
};

export function CalendarTracker({ initialEvents }: { initialEvents: CalendarEvent[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

    // Local state for optimistic updates
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);
            const newEvent = await addEvent(formData);

            setEvents((prev) => [...prev, newEvent].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            toast.success("Event added!");
            setIsOpen(false);
        } catch (error) {
            toast.error("Failed to add event");
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedDayEvents = events.filter((e) => selectedDate && isSameDay(new Date(e.date), selectedDate));

    // Upcoming events
    const today = startOfDay(new Date());
    const upcomingEvents = events.filter((e) => new Date(e.date) >= today).slice(0, 5);

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Calendar</h2>
                    <p className="text-slate-500 text-sm">Plan your future together</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-500 hover:bg-indigo-600 shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Name</Label>
                                <Input id="title" name="title" placeholder="Dinner reservation, Trip, etc." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date">Date & Time</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    defaultValue={selectedDate ? format(selectedDate, "yyyy-MM-dd'T'12:00") : format(new Date(), "yyyy-MM-dd'T'12:00")}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Details (Optional)</Label>
                                <Input id="description" name="description" placeholder="Location or notes..." />
                            </div>
                            <div className="flex items-center space-x-2 pt-2 pb-2">
                                <Checkbox id="isAnniversary" name="isAnniversary" value="true" />
                                <label
                                    htmlFor="isAnniversary"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1 text-rose-500"
                                >
                                    <Sparkles className="w-3 h-3" /> Mark as Special Anniversary / Milestone
                                </label>
                            </div>
                            <Button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Save Event
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Side: Calendar Widget */}
                <div className="md:col-span-5 h-fit">
                    <Card className="shadow-sm border-slate-200 dark:border-slate-800">
                        <CardContent className="p-4 flex justify-center">
                            <CalendarUI
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md w-full max-w-[320px] mx-auto [&_.rdp-day_button]:h-9 [&_.rdp-day_button]:w-9 [&_.rdp-day_button]:mx-auto"
                                classNames={{
                                    day_selected: "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white focus:bg-indigo-500 focus:text-white",
                                    day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50",
                                }}
                                modifiers={{
                                    hasEvent: events.map((e) => new Date(e.date)),
                                    isAnniversary: events.filter((e) => e.isAnniversary).map((e) => new Date(e.date)),
                                }}
                                modifiersStyles={{
                                    hasEvent: { fontWeight: "bold", textDecoration: "underline", textDecorationColor: "rgba(99, 102, 241, 0.5)", textDecorationThickness: "2px", textUnderlineOffset: "4px" },
                                    isAnniversary: { color: "#f43f5e", fontWeight: "900" }
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Event Details / Upcoming List */}
                <div className="md:col-span-7 space-y-6">
                    <Card className="shadow-sm border-0 bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-indigo-100 dark:ring-indigo-900/50 min-h-[160px]">
                        <CardHeader className="pb-3 border-b border-indigo-100 dark:border-indigo-900/50">
                            <CardTitle className="text-lg flex items-center justify-between text-indigo-900 dark:text-indigo-100">
                                <span>{selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}</span>
                                <CalendarHeart className="w-5 h-5 text-indigo-400" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {selectedDayEvents.length === 0 ? (
                                <div className="text-slate-500 text-sm italic">No plans for this day. Free time! ✨</div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedDayEvents.map((event) => (
                                        <div key={event.id} className={cn(
                                            "p-3 rounded-lg border",
                                            event.isAnniversary
                                                ? "bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900"
                                                : "bg-white border-indigo-100 dark:bg-slate-900 dark:border-indigo-900/40"
                                        )}>
                                            <div className="flex justify-between items-start">
                                                <h4 className={cn("font-medium", event.isAnniversary && "text-rose-600 dark:text-rose-400 flex items-center gap-1.5")}>
                                                    {event.isAnniversary && <Sparkles className="w-3.5 h-3.5" />}
                                                    {event.title}
                                                </h4>
                                                <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                                                    {format(new Date(event.date), "h:mm a")}
                                                </span>
                                            </div>
                                            {event.description && (
                                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex items-start gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 opacity-50" />
                                                    {event.description}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upcoming Events Mini List */}
                    <div className="space-y-4 pt-4">
                        <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Upcoming Highlights</h3>
                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-slate-500">No upcoming events scheduled.</p>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                                {upcomingEvents.map((event) => (
                                    <Card key={event.id} className="min-w-[200px] snap-start shrink-0 shadow-sm hover:shadow-md transition-all">
                                        <CardHeader className="p-4 pb-2">
                                            <div className="text-xs font-bold text-indigo-500 mb-1">{format(new Date(event.date), "MMM d")}</div>
                                            <CardTitle className="text-sm font-semibold truncate leading-tight">{event.title}</CardTitle>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
