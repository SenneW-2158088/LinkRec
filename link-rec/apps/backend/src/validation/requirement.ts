import { z } from "zod";

export const requirementInputScheme = z.object({
  profession: z.string(),
  years: z.number(),
  language: z.string(),
  education: z.string(),
  degree: z.string(),
  description: z.string(),
})

export type RequirementInput = z.infer<typeof requirementInputScheme>;
