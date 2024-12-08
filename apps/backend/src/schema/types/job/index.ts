import { createJobMutation, deleteJobMutation, updateJobMutation } from "./mutations";
import { allJobsQuery, jobQuery } from "./queries";
import { Job as IJob, JobInputType, JobType } from "./types";

export namespace Job {

  export type Type = IJob;

  export const Job = JobType;

  export const Create = JobInputType;

  export const queries = {
    "job": jobQuery,
    "allJobs": allJobsQuery,
  }

  export const mutations = {
    "createJob": createJobMutation,
    "deleteJob": deleteJobMutation,
  }
}
