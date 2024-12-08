import { SparqlBuilder } from "../../sparql/sparql_builder"
import { ObjectListType, ObjectType, StringType } from "../../sparql/sparql_parser"

export interface SparkqlUser {
  firstName: string,
  lastName: string,
  educations: Education[]
}

export interface Education {
  institution: string,
  title: string,
  degree: string
}

export const SparqlUserType = (id: string) => ObjectType<SparkqlUser>({
  query: SparqlBuilder.defaultPrefixes().build(`
    SELECT ?firstName ?lastName ?email
    WHERE {
      user:JohnDoe a lr:User ;
        lr:hasFirstName ?firstName ;
        lr:hasLastName ?lastName ;
    }
  `),
  fields: {
    firstName: { type: StringType },
    lastName: { type: StringType },
    educations: {
      type: ObjectListType<Education>({
        query: `
          SELECT ?
          WHERE {
            user:JohnDoe a lr:User ;
              lr:hasEducation ?education .
            ?education a lr:Education ;
              lr:hasInstitution ?institution ;
              lr:hasTitle ?title ;
              lr:hasDegree ?degree .
          }
        `,
        fields: {
          title: { type: StringType },
          institution: { type: StringType },
          degree: { type: StringType }
        }
      })
    }
  }
})
