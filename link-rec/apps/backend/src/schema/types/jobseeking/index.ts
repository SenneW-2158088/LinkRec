import { JobSeekingStatusType } from "./types";

export namespace JobSeekingStatus {

  export enum Type {
    ACTIVELY_LOOKING,
    OPEN_TO_OFFERS,
    NOT_LOOKING,
  }

  export const JobSeekingStatus = JobSeekingStatusType

  export const queries = {};

  export const mutations = {};
}
