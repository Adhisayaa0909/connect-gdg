import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GDGEvent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { getEventById, createRegistrationApi } from "@/services/api";
import { registrationSchema } from "@/utils/validators";

const departments = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "Other"];

const Register = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<GDGEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getEventById(eventId);
        setEvent(data);
      } catch (apiError: any) {
        toast.error(apiError?.response?.data?.message || "Failed to load event");
        setEvent(null);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground">Loading registration form...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground mb-4">Event Not Found</h2>
        <Link to="/"><Button variant="outline" className="rounded-full"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button></Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="container mx-auto max-w-md px-4 py-20 text-center animate-fade-in">
        <CheckCircle2 className="mx-auto h-16 w-16 text-google-green mb-4" />
        <h2 className="font-display text-2xl font-bold text-foreground mb-2">You're Registered!</h2>
        <p className="text-muted-foreground mb-6">
          You've successfully registered for <strong>{event.title}</strong>.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to={`/event/${event.id}`}>
            <Button variant="outline" className="rounded-full">View Event</Button>
          </Link>
          <Link to="/">
            <Button className="rounded-full">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = registrationSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    try {
      setSubmitting(true);
      await createRegistrationApi({ ...form, eventId: event.id, rsvp: "going" });
      toast.success("Registration successful!");
      setSubmitted(true);
    } catch (apiError: any) {
      toast.error(apiError?.response?.data?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <Link to={`/event/${event.id}`}>
        <Button variant="ghost" className="mb-6 rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Event
        </Button>
      </Link>

      <div className="rounded-2xl border bg-card p-6 md:p-8 shadow-sm animate-fade-in">
        <h1 className="font-display text-2xl font-bold text-foreground mb-1">Register</h1>
        <p className="text-sm text-muted-foreground mb-6">for {event.title}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { id: "name", label: "Full Name", placeholder: "John Doe", type: "text" },
            { id: "email", label: "Email", placeholder: "john@example.com", type: "email" },
            { id: "phone", label: "Phone Number", placeholder: "9876543210", type: "tel" },
            { id: "college", label: "College Name", placeholder: "Your college", type: "text" },
          ].map((field) => (
            <div key={field.id}>
              <Label htmlFor={field.id} className="text-sm font-medium">{field.label}</Label>
              <Input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                value={form[field.id as keyof typeof form]}
                onChange={(e) => update(field.id, e.target.value)}
                className={`mt-1 rounded-lg ${errors[field.id] ? "border-destructive" : ""}`}
              />
              {errors[field.id] && <p className="text-xs text-destructive mt-1">{errors[field.id]}</p>}
            </div>
          ))}

          <div>
            <Label className="text-sm font-medium">Department</Label>
            <Select value={form.department} onValueChange={(v) => update("department", v)}>
              <SelectTrigger className={`mt-1 rounded-lg ${errors.department ? "border-destructive" : ""}`}>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-xs text-destructive mt-1">{errors.department}</p>}
          </div>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Registration"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;
