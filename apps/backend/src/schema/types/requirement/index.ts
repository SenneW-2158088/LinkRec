import { Requirement as IRequirement, requirementInputType, requirementType } from "./types"

export namespace Requirement {

  export type Type = IRequirement;

  export const Requirement = requirementType;

  export const Create = requirementInputType;

  export const queries = {}

  export const mutations = {}
}
