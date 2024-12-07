import { jobMutation } from "./mutations";
import { jobQuery } from "./queries";

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
    company: string,
    description?: string | null,
    years: number,
    level: LevelType,
  };

  export const Experience = ExperienceType;

  export const Create = ExperienceInputType;

  export const queries = {
    "job": jobQuery
  }

  export const mutations = {
    "job": jobMutation,
  }
}
