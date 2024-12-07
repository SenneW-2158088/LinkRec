import { Experience as IExperience, Level as ILevel, ExperienceInputType, ExperienceLevelType, ExperienceType } from "./types"

export namespace Experience {

  export type LevelType = ILevel;

  export type Type = IExperience;

  export const Level = ExperienceLevelType

  export const Experience = ExperienceType

  export const Create = ExperienceInputType

  export const queries = {};

  export const mutations = {};

}
