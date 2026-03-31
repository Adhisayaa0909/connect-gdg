import { getEvents } from "@/lib/store";
import { useState } from "react";

const Gallery = () => {
  const events = getEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  // Placeholder gallery images using colored divs
  const colors = ["bg-google-blue", "bg-google-red", "bg-google-yellow", "bg-google-green"];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Event Gallery</h1>
      <p className="text-muted-foreground mb-8">Browse photos from past events</p>

      {/* Event filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedEvent(null)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            !selectedEvent ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
          }`}
        >
          All Events
        </button>
        {events.map((e) => (
          <button
            key={e.id}
            onClick={() => setSelectedEvent(e.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedEvent === e.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {e.title}
          </button>
        ))}
      </div>

      {/* Gallery grid - placeholder */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {(selectedEvent ? events.filter((e) => e.id === selectedEvent) : events).map((event, eventIdx) =>
          Array.from({ length: 3 }).map((_, imgIdx) => (
            <div
              key={`${event.id}-${imgIdx}`}
              className={`aspect-square rounded-xl ${colors[(eventIdx + imgIdx) % 4]} opacity-20 flex items-center justify-center animate-fade-in`}
              style={{ animationDelay: `${(eventIdx * 3 + imgIdx) * 50}ms` }}
            >
              <div className="text-center">
                <p className="text-xs font-medium text-foreground/60">{event.title}</p>
                <p className="text-[10px] text-foreground/40">Photo {imgIdx + 1}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 text-center py-8 rounded-2xl border-2 border-dashed border-border">
        <p className="text-muted-foreground text-sm">
          📸 Gallery images will appear here once uploaded via the Admin Panel.
        </p>
      </div>
    </div>
  );
};

export default Gallery;
