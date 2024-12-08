import { BooleanType, ListType, ObjectListType, ObjectType, StringType } from "../sparql_parser";
import { SparqlJobRequirementsType, SparqlRequirement } from "./requirement";

export interface SparqlJob {
  id: string,
  title: string,
  location: string
  active: boolean,
  requirements: SparqlRequirement[],
}

export const SparqlJobType = (id: string) => ObjectType<SparqlJob>({
  query: () => {
    return "";
  },
  fields: {
    id: { type: StringType },
    title: { type: StringType },
    location: { type: StringType },
    active: { type: BooleanType },
    requirements: { type: SparqlJobRequirementsType(id) },
  }
})
