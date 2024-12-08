import { createJobMutation, updateJobMutation } from "./mutations";
import { jobQuery } from "./queries";
import { Job as IJob, JobInputType, JobType } from "./types";

export namespace Job {

  export type Type = IJob;

  export const Job = JobType;

  export const Create = JobInputType;

  export const queries = {
    "job": jobQuery
  }

  export const mutations = {
    "job": createJobMutation,
    "updateJob": updateJobMutation,
  }
}
