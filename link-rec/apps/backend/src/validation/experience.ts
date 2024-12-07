import { z } from "zod";

export const experienceSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .transform(title => title.trim()), // Clean up whitespace

  company: z.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name cannot exceed 100 characters')
    .transform(company => company.trim()),

  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional(),

  years: z.number()
    .min(0, 'Years cannot be negative')
    .max(50, 'Years cannot exceed 50')
    .transform(years => Number(years.toFixed(1))), // Round to 1 decimal place
});

export type ExperienceInput = z.infer<typeof experienceSchema>;
