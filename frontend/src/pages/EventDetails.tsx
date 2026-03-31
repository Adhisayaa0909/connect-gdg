import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GDGEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import CountdownTimer from "@/components/CountdownTimer";
import { Calendar, MapPin, Monitor, Users, User, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { getEventById } from "@/services/api";
import { toast } from "sonner";

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<GDGEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getEventById(id);
        setEvent(data);
      } catch (apiError: any) {
        toast.error(apiError?.response?.data?.message || "Failed to fetch event details");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Event Not Found</h2>
        <Link to="/">
          <Button variant="outline" className="rounded-full">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <Link to="/">
        <Button variant="ghost" className="mb-6 rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
        </Button>
      </Link>

      <div className="rounded-2xl border bg-card shadow-sm animate-fade-in overflow-hidden">
        {/* Event poster image */}
        <div className="relative w-full h-72 bg-muted">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/50">
              <span className="text-muted-foreground">No poster image</span>
            </div>
          )}
        </div>

        <div className="p-6 md:p-10">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {event.locationType === "online" ? <Monitor className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
            {event.locationType === "online" ? "Online" : "In Person"}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
            <Users className="h-3 w-3" />
            {event.department}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold text-foreground mb-6 md:text-4xl">
          {event.title}
        </h1>

        {/* Countdown */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground text-center mb-3">Event starts in</p>
          <CountdownTimer targetDate={event.startDate} />
        </div>

        {/* Details grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="rounded-xl bg-secondary/50 p-4 flex items-start gap-3">
            <Calendar className="h-5 w-5 text-google-blue mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Date & Time</p>
              <p className="text-sm font-medium text-foreground">
                {format(new Date(event.startDate), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.startDate), "h:mm a")} – {format(new Date(event.endDate), "h:mm a")}
              </p>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 flex items-start gap-3">
            <MapPin className="h-5 w-5 text-google-red mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Location</p>
              <p className="text-sm font-medium text-foreground">{event.location}</p>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 flex items-start gap-3">
            <User className="h-5 w-5 text-google-green mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Organizer</p>
              <p className="text-sm font-medium text-foreground">{event.organizer}</p>
            </div>
          </div>
          <div className="rounded-xl bg-secondary/50 p-4 flex items-start gap-3">
            <Users className="h-5 w-5 text-google-yellow mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground">Eligibility</p>
              <p className="text-sm font-medium text-foreground">{event.department}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-foreground mb-3">About This Event</h2>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </div>

        <Link to={`/register/${event.id}`}>
          <Button size="lg" className="w-full rounded-full text-base">
            Register Now
          </Button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
