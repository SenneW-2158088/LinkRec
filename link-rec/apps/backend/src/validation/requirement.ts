import { optional, z } from "zod";

export const requirementInputScheme = z.object({

  profession: z.string()
    .min(2, 'Profession must be at least 2 characters')
    .max(100, 'Profession cannot exceed 100 characters')
    .trim()
    .optional(),

  years: z.number()
    .int('Years must be a whole number')
    .min(0, 'Years cannot be negative')
    .max(50, 'Years of experience cannot exceed 50')
    .optional(),

  language: z.string()
    .min(2, 'Language must be at least 2 characters')
    .max(50, 'Language cannot exceed 50 characters')
    .trim()
    .optional(),
  education: z.string()
    .min(2, 'Education must be at least 2 characters')
    .max(50, 'Education cannot exceed 50 characters')
    .trim()
    .optional(),
  degree: z.string()
    .min(2, 'Education must be at least 2 characters')
    .max(50, 'Education cannot exceed 50 characters')
    .trim()
    .optional(),

})

export const requirementUpdateInputScheme = z.object({
  profession: z.string()
    .min(2, 'Profession must be at least 2 characters')
    .max(100, 'Profession cannot exceed 100 characters')
    .trim()
    .optional()
  ,

  years: z.number()
    .int('Years must be a whole number')
    .min(0, 'Years cannot be negative')
    .max(50, 'Years of experience cannot exceed 50')
    .optional(),

  language: z.string()
    .min(2, 'Language must be at least 2 characters')
    .max(50, 'Language cannot exceed 50 characters')
    .trim()
    .optional(),
  education: z.string()
    .min(2, 'Education must be at least 2 characters')
    .max(50, 'Education cannot exceed 50 characters')
    .trim()
    .optional(),
  degree: z.string()
    .min(2, 'Education must be at least 2 characters')
    .max(50, 'Education cannot exceed 50 characters')
    .trim()
    .optional(),
})

export type RequirementInput = z.infer<typeof requirementInputScheme>;
export type RequirementUpdate = z.infer<typeof requirementUpdateInputScheme>;
