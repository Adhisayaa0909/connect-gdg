import { GDGEvent } from "@/lib/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Monitor, Users } from "lucide-react";
import { format } from "date-fns";

const EventCard = ({ event, index }: { event: GDGEvent; index: number }) => {
  const colorAccents = [
    "border-l-google-blue",
    "border-l-google-red",
    "border-l-google-yellow",
    "border-l-google-green",
  ];

  return (
    <div
      className={`group rounded-xl border border-l-4 ${colorAccents[index % 4]} bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          {event.locationType === "online" ? <Monitor className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
          {event.locationType === "online" ? "Online" : "In Person"}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
          <Users className="h-3 w-3" />
          {event.department}
        </span>
      </div>

      <h3 className="font-display text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {event.title}
      </h3>

      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {event.description}
      </p>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="h-4 w-4 text-primary" />
        <span>{format(new Date(event.startDate), "MMM d, yyyy · h:mm a")}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
        <MapPin className="h-4 w-4 text-destructive" />
        <span className="truncate">{event.location}</span>
      </div>

      <div className="flex gap-2">
        <Link to={`/event/${event.id}`} className="flex-1">
          <Button variant="outline" className="w-full rounded-full">
            Details
          </Button>
        </Link>
        <Link to={`/register/${event.id}`} className="flex-1">
          <Button className="w-full rounded-full">Register</Button>
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
