import { useState, useEffect, useMemo } from "react";
import { getEvents } from "@/lib/store";
import { GDGEvent } from "@/lib/types";
import EventCard from "@/components/EventCard";
import SkeletonCard from "@/components/SkeletonCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Home = () => {
  const [events, setEvents] = useState<GDGEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(getEvents());
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const filtered = useMemo(() => {
    return events
      .filter((e) => {
        if (filter === "online") return e.locationType === "online";
        if (filter === "offline") return e.locationType === "offline";
        return true;
      })
      .filter(
        (e) =>
          e.title.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase())
      );
  }, [events, search, filter]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero */}
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold text-foreground mb-3 md:text-5xl">
          <span className="text-google-gradient">GDG</span> On Campus Events
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover workshops, hackathons, and study jams organized by your Google Developer Group.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "offline", "online"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              className="rounded-full capitalize"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All Events" : f === "online" ? "🌐 Online" : "📍 In Person"}
            </Button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg text-muted-foreground">No events found.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} onImageUpdate={() => setEvents(getEvents())} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
