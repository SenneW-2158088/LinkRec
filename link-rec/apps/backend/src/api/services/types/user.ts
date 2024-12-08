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
  connections?: SparqlUser[]
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

const SparqlEducationsType = () => ObjectListType<SparqlEducation>({
  query: (education) => {
    return SparqlBuilder.defaultPrefixes().build(`
    SELECT ?institution ?title ?degree
    WHERE {
      <${education}> a lr:Education ;
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

const SparqlExperienceType = () => ObjectListType<SparqlExperience>({
  query: (experience) => {
    return SparqlBuilder.defaultPrefixes().build(`
    SELECT
      ?title
      ?company
      ?description
      ?years
      ?level
      ?profession
    WHERE {
      <${experience}> a lr:Experience ;
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

export const SparqlUserConfig: any = (depth: number = 3) => {
  return {
    query: (user: string) => {
      return SparqlBuilder.defaultPrefixes().build(`
      SELECT
        ?firstName
        ?lastName
        ?email
        ?phoneNumber
        ?gender
        ?location
        ?status
        (GROUP_CONCAT(DISTINCT ?education; separator=",") as ?educations)
        (GROUP_CONCAT(DISTINCT ?language; separator=",") as ?languages)
        (GROUP_CONCAT(DISTINCT ?experience; separator=",") as ?experiences)
        (GROUP_CONCAT(DISTINCT ?connection; separator=",") as ?connections)
      WHERE {
        <${user}> a lr:User ;
          lr:hasFirstName ?firstName ;
          lr:hasLastName ?lastName ;
          lr:hasEmail ?email ;
          lr:hasPhoneNumber ?phoneNumber .
        <${user}> lr:hasJobSeekingStatus ?jobSeekingStatusResource .
        ?jobSeekingStatusResource rdfs:label ?status .
        OPTIONAL { <${user}> lr:hasGender ?gender . }
        OPTIONAL { <${user}> lr:hasLocation ?location . }
        OPTIONAL { <${user}> lr:hasEducation ?education . }
        OPTIONAL { <${user}> lr:hasLanguage ?language . }
        OPTIONAL { <${user}> lr:hasExperience ?experience . }
        OPTIONAL { <${user}> lr:knows ?connection . }
      }
      GROUP BY ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location
    `)
    },
    fields: {
      firstName: { type: StringType },
      lastName: { type: StringType },
      phoneNumber: { type: StringType },
      webPage: { type: OptionalType(StringType) },
      status: { type: StringType },
      location: { type: OptionalType(StringType) },
      bio: { type: OptionalType(StringType) },
      languages: { type: ListType(StringType) },
      educations: {
        type: SparqlEducationsType()
      },
      experiences: {
        type: SparqlExperienceType()
      },
      connections: depth > 0 ? {
        type: ObjectListType(SparqlUserConfig(depth - 1))
      } : undefined
    }
  }
}

export const SparqlUserType = ObjectType<SparqlUser>(SparqlUserConfig())
