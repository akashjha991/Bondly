"use client";

import { useState } from "react";
import { format, isSameDay, startOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    const today = startOfDay(new Date());
    const upcomingEvents = events.filter((e) => new Date(e.date) >= today).slice(0, 5);

    return (
        <div className="space-y-6 max-w-5xl mx-auto w-full px-4 sm:px-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-bondly-pink to-bondly-purple bg-clip-text text-transparent">Calendar</h2>
                    <p className="text-muted-foreground text-sm">Plan your future together</p>
                </div>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-tr from-bondly-pink to-bondly-purple hover:opacity-90 shadow-[0_4px_14px_0_rgba(255,110,199,0.39)] text-white rounded-full px-5 h-10 transition-all duration-200 hover:-translate-y-0.5">
                            <Plus className="w-4 h-4 mr-2" /> New Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md border-border sm:rounded-3xl bg-card shadow-lg p-6 sm:p-8">
                        <DialogHeader className="mb-4">
                            <DialogTitle className="text-xl font-bold text-foreground">Add Event</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Event Name</Label>
                                <Input id="title" name="title" placeholder="Dinner reservation, Trip, etc." required className="h-12 rounded-2xl border-border bg-background focus-visible:ring-bondly-pink" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & Time</Label>
                                <Input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    defaultValue={selectedDate ? format(selectedDate, "yyyy-MM-dd'T'12:00") : format(new Date(), "yyyy-MM-dd'T'12:00")}
                                    required
                                    className="h-12 rounded-2xl border-border bg-background focus-visible:ring-bondly-pink"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Details (Optional)</Label>
                                <Input id="description" name="description" placeholder="Location or notes..." className="h-12 rounded-2xl border-border bg-background focus-visible:ring-bondly-pink" />
                            </div>
                            <div className="flex items-center space-x-2 pt-2 pb-2">
                                <Checkbox id="isAnniversary" name="isAnniversary" value="true" className="rounded border-border data-[state=checked]:bg-bondly-pink data-[state=checked]:border-bondly-pink" />
                                <label
                                    htmlFor="isAnniversary"
                                    className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1 text-bondly-pink"
                                >
                                    <Sparkles className="w-4 h-4" /> Mark as Special Anniversary / Milestone
                                </label>
                            </div>
                            <Button type="submit" className="w-full h-12 rounded-full bg-gradient-to-r from-bondly-pink to-bondly-purple text-white hover:opacity-90 transition-opacity font-semibold shadow-md mt-4" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                                Save Event
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Side: Calendar Widget */}
                <div className="md:col-span-6 lg:col-span-5 flex justify-center h-fit">
                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border-border bg-card rounded-[32px] w-full max-w-[380px] overflow-hidden">
                        <CardContent className="p-6">
                            <CalendarUI
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="w-full mx-auto"
                                classNames={{
                                    day_selected: "bg-gradient-to-tr from-bondly-pink to-bondly-purple text-white hover:text-white shadow-md rounded-[12px] font-bold",
                                    day_today: "bg-accent text-foreground font-bold rounded-[12px]",
                                    day: "h-11 w-11 p-0 font-normal hover:bg-accent/50 hover:text-foreground text-center text-sm rounded-[12px] transition-all",
                                    head_cell: "text-muted-foreground rounded-md w-11 font-medium text-[0.8rem] pb-2 uppercase tracking-wider",
                                    cell: "h-12 w-11 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-transparent focus-within:relative focus-within:z-20",
                                }}
                                modifiers={{
                                    hasEvent: events.map((e) => new Date(e.date)),
                                    isAnniversary: events.filter((e) => e.isAnniversary).map((e) => new Date(e.date)),
                                }}
                                modifiersStyles={{
                                    hasEvent: { fontWeight: "bold", position: "relative" },
                                    isAnniversary: { color: "#FF6EC7", fontWeight: "900" }
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Event Details / Upcoming List */}
                <div className="md:col-span-6 lg:col-span-7 space-y-6">
                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(255,255,255,0.02)] border-border bg-card rounded-[32px] min-h-[220px] overflow-hidden">
                        <div className="bg-gradient-to-r from-bondly-pink/10 to-bondly-purple/10 p-5 px-6 border-b border-border">
                            <h3 className="text-xl font-bold flex items-center gap-2 text-foreground">
                                {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a date"}
                                <CalendarHeart className="w-5 h-5 text-bondly-pink ml-auto" />
                            </h3>
                        </div>
                        <CardContent className="p-6">
                            {selectedDayEvents.length === 0 ? (
                                <div className="text-muted-foreground text-sm italic py-8 text-center flex flex-col items-center gap-2">
                                    <Sparkles className="w-6 h-6 opacity-30" />
                                    No plans for this day. Free time!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDayEvents.map((event) => (
                                        <div key={event.id} className={cn(
                                            "p-4 rounded-[20px] border shadow-sm transition-all hover:shadow-md",
                                            event.isAnniversary
                                                ? "bg-bondly-pink/5 border-bondly-pink/20"
                                                : "bg-background border-border"
                                        )}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className={cn("font-bold text-lg", event.isAnniversary && "text-bondly-pink flex items-center gap-2")}>
                                                    {event.isAnniversary && <Sparkles className="w-4 h-4" />}
                                                    {event.title}
                                                </h4>
                                                <span className="text-xs font-semibold text-muted-foreground bg-accent px-3 py-1.5 rounded-full shrink-0">
                                                    {format(new Date(event.date), "h:mm a")}
                                                </span>
                                            </div>
                                            {event.description && (
                                                <p className="text-sm text-foreground/80 flex items-start gap-2 leading-relaxed">
                                                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-50 text-bondly-purple" />
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
                    <div className="space-y-3 pt-4">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground px-2">Upcoming Highlights</h3>
                        {upcomingEvents.length === 0 ? (
                            <p className="text-sm text-muted-foreground px-2">No upcoming events scheduled.</p>
                        ) : (
                            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x px-2 mx-[-8px]">
                                {upcomingEvents.map((event) => (
                                    <div key={event.id} className="min-w-[220px] snap-start shrink-0">
                                        <div className="bg-card border border-border shadow-sm rounded-[20px] p-5 hover:-translate-y-1 hover:shadow-md transition-all h-full flex flex-col justify-between group cursor-pointer">
                                            <div className="text-xs font-black text-bondly-purple mb-2 uppercase tracking-wide bg-bondly-purple/10 w-fit px-2 py-1 rounded-md">{format(new Date(event.date), "MMM d")}</div>
                                            <div className="text-[15px] font-bold truncate leading-tight group-hover:text-bondly-pink transition-colors">{event.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
