import { JobQuery } from "../queries/job";
import { SparqlBuilder } from "../sparql_builder";
import { BooleanType, ListType, ObjectListType, ObjectType, StringType } from "../sparql_parser";
import { SparqlJobRequirementsType, SparqlRequirement } from "./requirement";

export interface SparqlJob {
  id: string,
  title: string,
  location: string
  active: boolean,
}

export const SparqlJobType = (id: string) => ObjectType<SparqlJob>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(JobQuery.get(id));
  },
  fields: {
    id: { type: StringType },
    title: { type: StringType },
    location: { type: StringType },
    active: { type: BooleanType },
  }
})

export const SparqlAllJobType = () => ObjectListType<SparqlJob>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(JobQuery.all());
  },
  fields: {
    id: { type: StringType },
    title: { type: StringType },
    location: { type: StringType },
    active: { type: BooleanType },
  }
})
