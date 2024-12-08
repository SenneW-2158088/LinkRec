import { z } from "zod";
import { GQLTypes } from "../schema/types";
import { JobSeekingStatus } from "../schema/types/jobseeking/types";

export const jobseekingSchema = z.enum([
  JobSeekingStatus.ACTIVELY_LOOKING,
  JobSeekingStatus.NOT_LOOKING,
  JobSeekingStatus.OPEN_TO_OFFERS,
]);

export type JobseekingInput = z.infer<typeof jobseekingSchema>;
