"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { addEvent } from "@/app/dashboard/calendar/actions";

type CalendarEvent = { id: string; title: string; description: string | null; date: Date; isAnniversary: boolean };

export function CalendarTracker({ initialEvents }: { initialEvents: CalendarEvent[] }) {
  const [events, setEvents] = useState(initialEvents);
  const [open, setOpen] = useState(false);
  const anniversaries = events.filter((e) => e.isAnniversary).map((e) => new Date(e.date));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newEvent = await addEvent(new FormData(e.currentTarget));
    setEvents((prev) => [...prev, newEvent]);
    setOpen(false);
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-3">
      <Card className="rounded-3xl p-4 lg:col-span-2">
        <h2 className="mb-2 text-xl font-bold">Shared Calendar</h2>
        <CalendarUI
          mode="single"
          className="w-full"
          modifiers={{ anniversary: anniversaries }}
          modifiersStyles={{ anniversary: { color: "#FF6EC7", fontWeight: "bold" } }}
        />
      </Card>

      <Card className="rounded-3xl p-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full rounded-full bg-gradient-to-r from-[#FF6EC7] to-[#8B5CF6] text-white">Add Event</Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader><DialogTitle>New Event</DialogTitle></DialogHeader>
            <form className="space-y-3" onSubmit={onSubmit}>
              <div><Label>Title</Label><Input name="title" required /></div>
              <div><Label>Date</Label><Input name="date" type="datetime-local" defaultValue={format(new Date(), "yyyy-MM-dd'T'12:00")} required /></div>
              <div><Label>Description</Label><Input name="description" /></div>
              <label className="flex items-center gap-2 text-sm"><Checkbox name="isAnniversary" value="true" /> Anniversary</label>
              <Button type="submit" className="w-full">Save</Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="mt-4 space-y-2">
          {events.slice(0, 6).map((event) => (
            <div key={event.id} className="rounded-2xl border border-border p-3">
              <p className="font-medium">{event.title}</p>
              <p className="text-xs text-muted-foreground">{format(new Date(event.date), "MMM d, yyyy")}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
