import { z } from "zod";
import { requirementInputScheme } from "./requirement";

export const jobSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .transform(title => title.trim()),
  requirements:
    z.array(requirementInputScheme),
  location: z.string()
    .min(2, 'Locattion must be at least 2 characters')
    .max(100, 'Location cannot exceed 100 characters'),
  active:
    z.boolean(),
});

export type JobInput = z.infer<typeof jobSchema>;
