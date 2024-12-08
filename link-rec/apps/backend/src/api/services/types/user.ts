import { SparqlBuilder } from "../../sparql/sparql_builder"
import { IntegerType, ListType, ObjectListType, ObjectType, OptionalType, StringType } from "../../sparql/sparql_parser"

export interface SparqlUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  webPage?: string | null;
  status: string,
  location?: string | null;
  bio?: string | null;
  languages: string[];
}

export interface SparqlConnection {
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
  connectionStatus: string,
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

const SparqlEducationsType = (userId: string) => ObjectListType<SparqlEducation>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(`
    SELECT ?institution ?title ?degree
    WHERE {
      user:${userId} a lr:User ;
        lr:hasEducation ?education .
      ?education a lr:Education ;
        lr:hasInstitution ?institution ;
        lr:hasTitle ?title ;
        lr:hasDegree ?degree .
    }
  `)
},
  fields: {
    title: { type: StringType },
    institution: { type: StringType },
    degree: { type: StringType }
  }
})

export const SparqlExperienceType = (userId: string) => ObjectListType<SparqlExperience>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(`
    SELECT
      ?title
      ?company
      ?description
      ?years
      ?level
      ?profession
    WHERE {
      user:${userId} a lr:User ;
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
  `)
},
  fields: {
    profession: { type: StringType },
    title: { type: StringType },
    company: { type: StringType },
    description: { type: OptionalType(StringType) },
    years: { type: IntegerType },
    level: { type: StringType }
  }
})

export const SparqlUserType = (userId: string) => ObjectType<SparqlUser>({
    query: () => {
      const query = SparqlBuilder.defaultPrefixes().build(`
      SELECT
        ?id
        ?email
        ?firstName
        ?lastName
        ?email
        ?phoneNumber
        ?gender
        ?location
        ?status
        (GROUP_CONCAT(DISTINCT ?language; separator=",") as ?languages)
      WHERE {
        user:${userId} a lr:User ;
          lr:hasId ?id ;
          lr:hasEmail ?email ;
          lr:hasFirstName ?firstName ;
          lr:hasLastName ?lastName ;
          lr:hasEmail ?email ;
          lr:hasPhoneNumber ?phoneNumber .
        user:${userId} lr:hasJobSeekingStatus ?jobSeekingStatusResource .
        ?jobSeekingStatusResource rdfs:label ?status .
        OPTIONAL { user:${userId} lr:hasGender ?gender . }
        OPTIONAL { user:${userId} lr:hasLocation ?location . }
        OPTIONAL { user:${userId} lr:hasLanguage ?language . }
      }
      GROUP BY ?id ?email ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location
    `)
      console.log("QUERY", query)
      return query
    },
    fields: {
      id: { type: StringType },
      email: { type: StringType },
      firstName: { type: StringType },
      lastName: { type: StringType },
      phoneNumber: { type: StringType },
      webPage: { type: OptionalType(StringType) },
      status: { type: StringType },
      location: { type: OptionalType(StringType) },
      bio: { type: OptionalType(StringType) },
      languages: { type: ListType(StringType) }
    }
  })

export const SparqlConnectionType = (userId: string) => ObjectListType<SparqlUser>({
    query: () => {
      const query = SparqlBuilder.defaultPrefixes().build(`
      SELECT
        ?id
        ?email
        ?firstName
        ?lastName
        ?email
        ?phoneNumber
        ?gender
        ?location
        ?status
        (GROUP_CONCAT(DISTINCT ?language; separator=",") as ?languages)
      WHERE {
        user:${userId} a lr:User ;
          lr:knows ?user .
        ?user a lr:User ;
          lr:hasId ?id ;
          lr:hasEmail ?email ;
          lr:hasFirstName ?firstName ;
          lr:hasLastName ?lastName ;
          lr:hasEmail ?email ;
          lr:hasPhoneNumber ?phoneNumber .
        ?user lr:hasJobSeekingStatus ?jobSeekingStatusResource .
        ?jobSeekingStatusResource rdfs:label ?status .
        OPTIONAL { ?user lr:hasGender ?gender . }
        OPTIONAL { ?user lr:hasLocation ?location . }
        OPTIONAL { ?user lr:hasLanguage ?language . }
      }
      GROUP BY ?id ?email ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location
    `)
      console.log("QUER:", query)
      return query
    },
    fields: {
      id: { type: StringType },
      email: { type: StringType },
      firstName: { type: StringType },
      lastName: { type: StringType },
      phoneNumber: { type: StringType },
      webPage: { type: OptionalType(StringType) },
      status: { type: StringType },
      location: { type: OptionalType(StringType) },
      bio: { type: OptionalType(StringType) },
      languages: { type: ListType(StringType) }
    }
  })
