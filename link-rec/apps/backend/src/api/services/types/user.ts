import { SparqlBuilder } from "../../sparql/sparql_builder"
import { IntegerType, ListType, ObjectListType, ObjectType, OptionalType, StringType } from "../../sparql/sparql_parser"

export interface SparqlUser {
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  webPage?: string | null;
  status: string,
  location?: string | null;
  bio?: string | null;
  languages: string[];
  educations: SparqlEducation[],
  experiences: SparqlExperience[],
  // connections: SparqlUser[]
}

export interface SparqlEmployer {
  name: string;
  phoneNumber: string;
  webPage?: string | null;
  jobs: SparqlJob[];
}

export interface SparqlEducation {
  institution: string,
  title: string,
  degree: string
}

export interface SparqlConnection {
  user: SparqlUser,
  status: string,
};

export interface SparqlExperience {
  profession: string,
  title: string,
  company: string
  description?: string | null,
  years: number,
  level: string
}

export interface SparqlRequirement {
  profession: string,
  years: number,
  language: string,
  education: string,
  degree: string,
  description: string,
}

export interface SparqlJob {
  title: string,
  requirements: SparqlRequirement[],
  location: string
  active: boolean,
}

// SELECT
//   ?firstName
//   ?lastName
//   ?email
//   ?phone
//   ?gender
//   ?location
//   ?jobSeekingStatus
//   ?language
//   ?experience
//   ?education
// WHERE {
//   user:${id} a lr:User ;
//     lr:hasFirstName ?firstName ;
//     lr:hasLastName ?lastName ;
//     lr:hasEmail ?email .
//   user:JohnDoe lr:hasJobSeekingStatus ?jobSeekingStatusResource .
//   ?jobSeekingStatusResource rdfs:label ?jobSeekingStatus .
//   OPTIONAL { user:JohnDoe lr:hasPhoneNumber ?phone . }
//   OPTIONAL { user:JohnDoe lr:hasGender ?gender . }
//   OPTIONAL { user:JohnDoe lr:hasLocation ?location . }
//   OPTIONAL { user:JohnDoe lr:hasLanguage ?language . }
//   OPTIONAL { user:JohnDoe lr:hasExperience ?experience . }
//   OPTIONAL { user:JohnDoe lr:hasEducation ?education . }
// }

export const SparqlUserType = (id: string = "JohnDoe") => ObjectType<SparqlUser>({
  query: SparqlBuilder.defaultPrefixes().build(`
    SELECT
      ?firstName
      ?lastName
      ?email
      ?phone
      ?gender
      ?location
      ?status
      (GROUP_CONCAT(?language; separator=",") as ?languages)
    WHERE {
      user:${id} a lr:User ;
      lr:hasFirstName ?firstName ;
      lr:hasLastName ?lastName ;
      lr:hasEmail ?email .
      user:${id} lr:hasJobSeekingStatus ?jobSeekingStatusResource .
      ?jobSeekingStatusResource rdfs:label ?status .
      OPTIONAL { user:${id} lr:hasPhoneNumber ?phone . }
      OPTIONAL { user:${id} lr:hasGender ?gender . }
      OPTIONAL { user:${id} lr:hasLocation ?location . }
      OPTIONAL { user:${id} lr:hasLanguage ?language . }
    }
    GROUP BY ?firstName ?lastName ?email ?status ?phone ?gender ?location
  `),
  fields: {
    firstName: { type: StringType },
    lastName: { type: StringType },
    phoneNumber: { type: OptionalType(StringType) },
    webPage: { type: OptionalType(StringType) },
    status: { type: StringType },
    location: { type: OptionalType(StringType) },
    bio: { type: OptionalType(StringType) },
    languages: { type: ListType(StringType) },
    educations: {
      type: ObjectListType<SparqlEducation>({
        query: SparqlBuilder.defaultPrefixes().build(`
          SELECT ?institution ?title ?degree
          WHERE {
            user:${id} a lr:User ;
              lr:hasEducation ?education .
            ?education a lr:Education ;
              lr:hasInstitution ?institution ;
              lr:hasTitle ?title ;
              lr:hasDegree ?degree .
          }
        `),
        fields: {
          title: { type: StringType },
          institution: { type: StringType },
          degree: { type: StringType }
        }
      })
    },
    experiences: {
      type: ObjectListType<SparqlExperience>({
        query: SparqlBuilder.defaultPrefixes().build(`
          SELECT
            ?title
            ?company
            ?description
            ?years
            ?level
            ?profession
          WHERE {
            user:${id} a lr:User ;
              lr:hasExperience ?experience .
            ?experience a lr:Experience ;
              lr:hasProfession ?profession ;
              lr:hasTitle ?title ;
              lr:hasCompany ?company ;
              lr:hasDescription ?description ;
              lr:hasYears ?years ;
              lr:hasExperienceLevel ?levelUri .
       			?levelUri rdfs:label ?level .
          }
        `),
        fields: {
          profession: { type: StringType },
          title: { type: StringType },
          company: { type: StringType },
          description: { type: OptionalType(StringType) },
          years: { type: IntegerType },
          level: { type: StringType }
        }
      })
    },
    // connections: {
    //   type: ObjectListType<SparqlConnection>,
    //   fields: {
    //     user: { type: ObjectType<SparqlUser>({
    //       query: "",
    //       fields: {
    //         firstName: { type: StringType },
    //         lastName: { type: StringType },
    //         phoneNumber: { type: OptionalType(StringType) },
    //         webPage: { type: OptionalType(StringType) },
    //         status: { type: StringType },
    //         location: { type: OptionalType(StringType) },
    //         bio: { type: OptionalType(StringType) },
    //         languages: { type: ListType(StringType) },
    //         educations: { type: ListType() },
    //         experiences: { type: ListType() },
    //       }
    //     })},
    //     status: { type: StringType }
    //   }
    // }
  }
})
