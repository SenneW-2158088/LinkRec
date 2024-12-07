import { ExperienceInputType, ExperienceLevelType, ExperienceType } from "./types"

export namespace Experience {

  export interface Type {
    id: string,
    title: string,
    company: string
    description?: string | null,
    years: number,
    level: string
  }

  export const Level = ExperienceLevelType

  export const Experience = ExperienceType

  export const Create = ExperienceInputType

}
