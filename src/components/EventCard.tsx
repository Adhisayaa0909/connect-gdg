import { GDGEvent } from "@/lib/types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Monitor, Users, ImagePlus } from "lucide-react";
import { format } from "date-fns";
import { updateEventImage } from "@/lib/store";
import { useRef } from "react";
import { toast } from "sonner";

const EventCard = ({
  event,
  index,
  onImageUpdate,
}: {
  event: GDGEvent;
  index: number;
  onImageUpdate?: () => void;
}) => {
  const colorAccents = [
    "border-l-google-blue",
    "border-l-google-red",
    "border-l-google-yellow",
    "border-l-google-green",
  ];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateEventImage(event.id, reader.result as string);
      toast.success("Banner image updated!");
      onImageUpdate?.();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`group rounded-xl border border-l-4 ${colorAccents[index % 4]} bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in overflow-hidden`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Banner image area */}
      <div className="relative w-full h-40 bg-muted">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/50">
            <span className="text-xs text-muted-foreground">No banner image</span>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="absolute top-2 right-2 rounded-full bg-card/80 backdrop-blur-sm p-2 text-muted-foreground hover:text-primary hover:bg-card transition-colors shadow-sm"
          title="Upload banner image"
        >
          <ImagePlus className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6">
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
    </div>
  );
};

export default EventCard;
