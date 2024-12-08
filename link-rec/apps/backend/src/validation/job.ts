import { optional, z } from "zod";
import { requirementInputScheme, requirementUpdateInputScheme } from "./requirement";

export const jobSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .transform(title => title.trim()),
  location: z.string()
    .min(2, 'Locattion must be at least 2 characters')
    .max(100, 'Location cannot exceed 100 characters'),
  isActive:
    z.boolean(),
  requirements:
    z.array(requirementInputScheme),
});

export const jobUpdateSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot exceed 100 characters')
    .transform(title => title.trim())
    .optional()
  ,
  location: z.string()
    .min(2, 'Locattion must be at least 2 characters')
    .max(100, 'Location cannot exceed 100 characters')
    .optional()
  ,
  isActive: z
    .boolean()
    .optional()
    ,
  requirements:  z
    .array(requirementUpdateInputScheme).optional(),
});

export type JobInput = z.infer<typeof jobSchema>;
export type JobUpdate = z.infer<typeof jobUpdateSchema>;
