import { GQLTypes } from "..";
import { jobMutation } from "./mutations";
import { jobQuery } from "./queries";
import { JobInputType, JobType } from "./types";

export * from "./types"
export * from "./queries"
export * from "./mutations"

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
    requirements: GQLTypes.Requirement.Type[],
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
