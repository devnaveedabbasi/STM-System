import { z } from "zod";

export const studentSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.email("Invalid email"),
    age: z.number().min(18, "Age must be at least 18"),
    course: z.string().min(2, "Course name is required"),
});