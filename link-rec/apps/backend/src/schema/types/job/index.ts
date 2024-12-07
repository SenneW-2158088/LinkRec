import { Requirement } from "../requirement";
import { jobMutation } from "./mutations";
import { jobQuery } from "./queries";
import { JobInputType, JobType } from "./types";

export namespace Job {

  export const enum LevelType {
    ENTRY,
    MID,
    SENIOR,
    LEAD,
  };

  export interface Type {
    id: string,
    title: string,
    requirements: Requirement.Type[],
    location: string
    active: boolean,
  };

  export const Job = JobType;

  export const Create = JobInputType;

  export const queries = {
    "job": jobQuery
  }

  export const mutations = {
    "job": jobMutation,
  }
}
