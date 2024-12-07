import { requirementInputType, requirementType } from "./types"

export namespace Requirement {

  export interface Type {
    id: string,
    profession: string,
    years: number,
    language: string,
    education: string,
    degree: string,
    description: string,
  }

  export const Requirement = requirementType;

  export const Create = requirementInputType;

  export const queries = {

  }

  export const mutations = {

  }
}
