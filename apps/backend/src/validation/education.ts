import { z } from "zod";

export const Degree = z.enum(["BACHELOR", "MASTER"]);

export type DegreeInput = z.infer<typeof Degree>;

export const educationInputSchema = z.object({
  institution: z
    .string()
    .min(10, "Institution name need minimum of 10 characters")
    .max(100, "Institution name can have a maximum of 100 characters")
  ,
  title: z
    .string()
    .min(10, "Title need minimum of 10 characters")
    .max(100, "Title can have a maximum of 100 characters")
  ,
  degree: Degree,
})

export type EducationInput = z.infer<typeof educationInputSchema>;
