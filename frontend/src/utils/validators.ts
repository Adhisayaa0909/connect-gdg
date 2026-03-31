import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().min(10, "Phone must be at least 10 digits").max(15),
  college: z.string().trim().min(1, "College name is required").max(200),
  department: z.string().min(1, "Select a department"),
});

export const validateRequiredEventFields = (form: {
  title: string;
  startDate: string;
  endDate: string;
}) => {
  if (!form.title || !form.startDate || !form.endDate) {
    return "Please fill in title, start date, and end date";
  }

  if (new Date(form.endDate).getTime() <= new Date(form.startDate).getTime()) {
    return "End date must be after start date";
  }

  return "";
};
