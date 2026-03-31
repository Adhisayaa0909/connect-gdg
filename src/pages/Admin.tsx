import { useState } from "react";
import { getEvents, getRegistrations, createEvent, deleteEvent } from "@/lib/store";
import { GDGEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Users, Calendar } from "lucide-react";
import { format } from "date-fns";

const Admin = () => {
  const [events, setEvents] = useState(getEvents());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "All Departments",
    startDate: "",
    endDate: "",
    location: "",
    locationType: "offline" as "online" | "offline",
    organizer: "",
  });

  const registrations = selectedEventId ? getRegistrations(selectedEventId) : [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.startDate || !form.endDate) {
      toast.error("Please fill in required fields");
      return;
    }
    createEvent({ ...form, image: "", gallery: [] });
    setEvents(getEvents());
    setForm({ title: "", description: "", department: "All Departments", startDate: "", endDate: "", location: "", locationType: "offline", organizer: "" });
    toast.success("Event created!");
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
    setEvents(getEvents());
    if (selectedEventId === id) setSelectedEventId(null);
    toast.success("Event deleted");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">
        Admin Panel
      </h1>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="events" className="rounded-full">Events</TabsTrigger>
          <TabsTrigger value="create" className="rounded-full">Create Event</TabsTrigger>
          <TabsTrigger value="registrations" className="rounded-full">Registrations</TabsTrigger>
        </TabsList>

        {/* Events list */}
        <TabsContent value="events" className="animate-fade-in">
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No events yet.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground truncate">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(event.startDate), "MMM d")}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{getRegistrations(event.id).length} registered</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => setSelectedEventId(event.id)}>
                      View Regs
                    </Button>
                    <Button variant="destructive" size="sm" className="rounded-full" onClick={() => handleDelete(event.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* Create event */}
        <TabsContent value="create" className="animate-fade-in">
          <form onSubmit={handleCreate} className="max-w-2xl rounded-2xl border bg-card p-6 md:p-8 shadow-sm space-y-5">
            <div>
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="mt-1 rounded-lg" placeholder="Event title" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="mt-1 rounded-lg" rows={4} placeholder="Describe the event..." />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Department Eligibility</Label>
                <Input value={form.department} onChange={(e) => setForm({...form, department: e.target.value})} className="mt-1 rounded-lg" placeholder="e.g. CSE, IT, All" />
              </div>
              <div>
                <Label>Event Type</Label>
                <Select value={form.locationType} onValueChange={(v: "online" | "offline") => setForm({...form, locationType: v})}>
                  <SelectTrigger className="mt-1 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="offline">In Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>Start Date & Time *</Label>
                <Input type="datetime-local" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="mt-1 rounded-lg" />
              </div>
              <div>
                <Label>End Date & Time *</Label>
                <Input type="datetime-local" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="mt-1 rounded-lg" />
              </div>
            </div>
            <div>
              <Label>Location / Meeting Link</Label>
              <Input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} className="mt-1 rounded-lg" placeholder="Venue or URL" />
            </div>
            <div>
              <Label>Organizer Name</Label>
              <Input value={form.organizer} onChange={(e) => setForm({...form, organizer: e.target.value})} className="mt-1 rounded-lg" placeholder="Organizer" />
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Button>
          </form>
        </TabsContent>

        {/* Registrations */}
        <TabsContent value="registrations" className="animate-fade-in">
          <div className="mb-4">
            <Label>Select Event</Label>
            <Select value={selectedEventId || ""} onValueChange={setSelectedEventId}>
              <SelectTrigger className="mt-1 rounded-lg max-w-md"><SelectValue placeholder="Choose an event" /></SelectTrigger>
              <SelectContent>
                {events.map((e) => (
                  <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedEventId && (
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>College</TableHead>
                    <TableHead>Dept</TableHead>
                    <TableHead>RSVP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No registrations yet.</TableCell></TableRow>
                  ) : (
                    registrations.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium">{r.name}</TableCell>
                        <TableCell>{r.email}</TableCell>
                        <TableCell>{r.phone}</TableCell>
                        <TableCell>{r.college}</TableCell>
                        <TableCell>{r.department}</TableCell>
                        <TableCell>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${r.rsvp === "going" ? "bg-google-green/10 text-google-green" : "bg-destructive/10 text-destructive"}`}>
                            {r.rsvp === "going" ? "Going" : "Not Going"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
