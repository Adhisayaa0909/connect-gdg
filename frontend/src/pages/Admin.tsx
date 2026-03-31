import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GDGEvent, Registration } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Trash2, Users, Calendar, LogOut } from "lucide-react";
import { format } from "date-fns";
import {
  createEventApi,
  deleteEventApi,
  getAllEvents,
  getRegistrationsByEventApi,
} from "@/services/api";
import { validateRequiredEventFields } from "@/utils/validators";

const Admin = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<GDGEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("events");
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(false);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [creating, setCreating] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const fetchEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await getAllEvents();
      setEvents(data);

      // Load registration counts for quick admin visibility.
      const counts = await Promise.all(
        data.map(async (event) => {
          try {
            const eventRegistrations = await getRegistrationsByEventApi(event.id);
            return [event.id, eventRegistrations.length] as const;
          } catch {
            return [event.id, 0] as const;
          }
        })
      );

      setRegistrationCounts(Object.fromEntries(counts));
    } catch (apiError: any) {
      toast.error(apiError?.response?.data?.message || "Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!selectedEventId) {
        setRegistrations([]);
        return;
      }

      try {
        setLoadingRegistrations(true);
        const data = await getRegistrationsByEventApi(selectedEventId);
        setRegistrations(data);
      } catch (apiError: any) {
        toast.error(apiError?.response?.data?.message || "Failed to fetch registrations");
      } finally {
        setLoadingRegistrations(false);
      }
    };

    fetchRegistrations();
  }, [selectedEventId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationMessage = validateRequiredEventFields({
      title: form.title,
      startDate: form.startDate,
      endDate: form.endDate,
    });

    if (validationMessage) {
      toast.error(validationMessage);
      return;
    }

    try {
      setCreating(true);
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("department", form.department);
      payload.append("startDate", form.startDate);
      payload.append("endDate", form.endDate);
      payload.append("location", form.location);
      payload.append("locationType", form.locationType);
      payload.append("organizer", form.organizer);

      if (imageFile) {
        payload.append("image", imageFile);
      }

      await createEventApi(payload);
      setForm({ title: "", description: "", department: "All Departments", startDate: "", endDate: "", location: "", locationType: "offline", organizer: "" });
      setImageFile(null);
      toast.success("Event created!");
      fetchEvents();
    } catch (apiError: any) {
      toast.error(apiError?.response?.data?.message || "Failed to create event");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEventApi(id);
      if (selectedEventId === id) {
        setSelectedEventId(null);
      }
      toast.success("Event deleted");
      fetchEvents();
    } catch (apiError: any) {
      toast.error(apiError?.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">
          Admin Panel
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="rounded-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="rounded-full">
          <TabsTrigger value="events" className="rounded-full">Events</TabsTrigger>
          <TabsTrigger value="create" className="rounded-full">Create Event</TabsTrigger>
          <TabsTrigger value="registrations" className="rounded-full">Registrations</TabsTrigger>
        </TabsList>

        {/* Events list */}
        <TabsContent value="events" className="animate-fade-in">
          <div className="space-y-3">
            {loadingEvents ? (
              <p className="text-muted-foreground py-8 text-center">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No events yet.</p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground truncate">{event.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(event.startDate), "MMM d")}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{registrationCounts[event.id] || 0} registered</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button variant="outline" size="sm" className="rounded-full" onClick={() => {
                      setSelectedEventId(event.id);
                      setActiveTab("registrations");
                    }}>
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
            <div>
              <Label>Event Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                className="mt-1 rounded-lg"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-muted-foreground mt-1">Optional. Max size 5MB.</p>
            </div>
            <Button type="submit" size="lg" className="w-full rounded-full">
              <Plus className="mr-2 h-4 w-4" /> {creating ? "Creating..." : "Create Event"}
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
                  {loadingRegistrations ? (
                    <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading registrations...</TableCell></TableRow>
                  ) : registrations.length === 0 ? (
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
