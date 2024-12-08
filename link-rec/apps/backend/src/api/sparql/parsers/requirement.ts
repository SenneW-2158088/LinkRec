import { IntegerType, ObjectType, StringType } from "../sparql_parser";

export interface SparqlRequirement {
  id: string,
  profession: string,
  years: number,
  language: string,
  education: string,
  degree: string,
  description: string,
}

export const SparqlRequirementType = (jobid: string) => ObjectType<SparqlRequirement>({
  query: () => {
    return ""
  },
  fields: {
    id: { type: StringType },
    profession: { type: StringType },
    years: { type: IntegerType },
    language: { type: StringType },
    education: { type: StringType },
    degree: { type: StringType },
    description: { type: StringType },
  }
})
