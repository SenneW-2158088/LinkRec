import { z } from "zod";
import { GQLTypes } from "../schema/types";

export const jobseekingSchema = z.enum([
  GQLTypes.JobSeekingStatus.Type.ACTIVELY_LOOKING,
  GQLTypes.JobSeekingStatus.Type.NOT_LOOKING,
  GQLTypes.JobSeekingStatus.Type.OPEN_TO_OFFERS,
]);

export type JobseekingInput = z.infer<typeof jobseekingSchema>;
