import { EmployerRegister } from "../../../validation/employer";
import { EmployerQuery } from "../queries/employer";
import { SparqlBuilder } from "../sparql_builder";
import { ObjectListType, ObjectType, OptionalType, StringType } from "../sparql_parser";

export interface SparqlEmployer {
  id: string,
  email: string,
  name: string,
  phoneNumber: string
  webPage: string | null,
}

export const SparqlEmployerType = (id: string) => ObjectType<SparqlEmployer>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(EmployerQuery.get(id));
  },
  fields: {
    id: { type: StringType },
    email: { type: StringType },
    name: { type: StringType },
    phoneNumber: { type: StringType },
    webPage: { type: OptionalType(StringType) },
  }
})

export const SparqlAllEmployersType = () => ObjectListType<SparqlEmployer>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(EmployerQuery.all());
  },
  fields: {
    id: { type: StringType },
    email: { type: StringType },
    name: { type: StringType },
    phoneNumber: { type: StringType },
    webPage: { type: OptionalType(StringType) },
  }
})
