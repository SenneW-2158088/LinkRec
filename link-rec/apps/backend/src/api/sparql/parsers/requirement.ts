import { JobQuery } from "../queries/job";
import { RequirementQuery } from "../queries/requirement";
import { SparqlBuilder } from "../sparql_builder";
import { IntegerType, ObjectListType, ObjectType, OptionalType, StringType } from "../sparql_parser";

export interface SparqlRequirement {
  id: string,
  profession: string | null,
  years: number | null,
  language: string | null,
  education: string | null,
  degree: string | null,
  description: string | null,
}

export const SparqlJobRequirementsType = (id: string) => ObjectListType<SparqlRequirement>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(RequirementQuery.forJob(id));
  },
  fields: {
    id: { type: StringType },
    profession: { type: OptionalType(StringType) },
    years: { type: OptionalType(IntegerType) },
    language: { type: OptionalType(StringType) },
    education: { type: OptionalType(StringType) },
    degree: { type: OptionalType(StringType) },
    description: { type: OptionalType(StringType) },
  }
})
