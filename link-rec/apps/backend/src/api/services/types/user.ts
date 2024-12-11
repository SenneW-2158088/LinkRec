import { SparqlJob } from "../../sparql/parsers/job";
import { EmployerQuery } from "../../sparql/queries/employer";
import { SparqlBuilder } from "../../sparql/sparql_builder"
import { BooleanType, IntegerType, ListType, ObjectListType, ObjectType, OptionalType, StringType } from "../../sparql/sparql_parser"

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
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  webPage?: string | null;
  status: string,
  location?: string | null;
  bio?: string | null;
  connectionStatus: string;
  languages: string[];
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

export interface SparqlExperience {
  profession: string,
  title: string,
  company: string
  description?: string | null,
  years: number,
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

export const SparqlEducationsType = (userId: string) => ObjectListType<SparqlEducation>({
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
      ?profession
    WHERE {
      user:${userId} a lr:User ;
        lr:hasExperience ?experience .
      ?experience a lr:Experience ;
        lr:hasProfession ?profession ;
        lr:hasTitle ?title ;
        lr:hasCompany ?company ;
        lr:hasDescription ?description ;
        lr:hasYears ?years .
    }
  `)
},
  fields: {
    profession: { type: StringType },
    title: { type: StringType },
    company: { type: StringType },
    description: { type: OptionalType(StringType) },
    years: { type: IntegerType },
  }
})

export const SparqlMatchesUserType = (employerId: string) => ObjectListType<SparqlUser>({
    query: () => {
      return EmployerQuery.matches(employerId);
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
        ?bio
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
        OPTIONAL { user:${userId} lr:hasBio ?bio . }
      }
      GROUP BY ?id ?email ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location ?bio
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

export const SparqlConnectionsType = (userId: string) => ObjectListType<SparqlConnection>({
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
        ?connectionStatus
        ?bio
        (GROUP_CONCAT(DISTINCT ?language; separator=",") as ?languages)
      WHERE {
        user:${userId} a lr:User ;
          lr:knows ?user ;
          ?connectionRelation ?user .
        ?connectionRelation rdfs:label ?connectionStatus .
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
        OPTIONAL { ?user lr:hasBio ?bio . }
      }
      GROUP BY ?id ?email ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location ?connectionStatus ?bio
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
      status: { type: StringType },
      webPage: { type: OptionalType(StringType) },
      location: { type: OptionalType(StringType) },
      bio: { type: OptionalType(StringType) },
      connectionStatus: { type: StringType },
      languages: { type: ListType(StringType) },
    }
  })

export const SparqlConnectionType = (userId: string, peerId: string) => ObjectType<SparqlConnection>({
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
        ?connectionStatus
        ?bio
        (GROUP_CONCAT(DISTINCT ?language; separator=",") as ?languages)
      WHERE {
        user:${userId} a lr:User ;
          lr:knows user:${peerId} ;
          ?connectionRelation user:${peerId} .
        ?connectionRelation rdfs:label ?connectionStatus .
        user:${peerId} a lr:User ;
          lr:hasId ?id ;
          lr:hasEmail ?email ;
          lr:hasFirstName ?firstName ;
          lr:hasLastName ?lastName ;
          lr:hasEmail ?email ;
          lr:hasPhoneNumber ?phoneNumber .
        user:${peerId} lr:hasJobSeekingStatus ?jobSeekingStatusResource .
        ?jobSeekingStatusResource rdfs:label ?status .
        OPTIONAL { user:${peerId} lr:hasGender ?gender . }
        OPTIONAL { user:${peerId} lr:hasLocation ?location . }
        OPTIONAL { user:${peerId} lr:hasLanguage ?language . }
        OPTIONAL { user:${peerId} lr:hasBio ?bio . }
      }
      GROUP BY ?id ?email ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location ?connectionStatus ?bio
    `)
      return query
    },
    fields: {
      id: { type: StringType },
      email: { type: StringType },
      firstName: { type: StringType },
      lastName: { type: StringType },
      phoneNumber: { type: StringType },
      status: { type: StringType },
      webPage: { type: OptionalType(StringType) },
      location: { type: OptionalType(StringType) },
      bio: { type: OptionalType(StringType) },
      connectionStatus: { type: StringType },
      languages: { type: ListType(StringType) },
    }
  })

export type MatchingRequirementIds = {
  ids: string[]
}

export const MatchingJobsType = (userId: string) => ObjectListType<SparqlJob>({
  query: () => {
    return SparqlBuilder.defaultPrefixes().build(`
      SELECT
        ?id
        ?title
        ?location
        ?active
      WHERE {
        user:${userId} a lr:User ;
          lr:matchesRequirement ?requirement .
        ?job lr:hasRequirement ?requirement ;
          lr:hasId ?id ;
          lr:hasTitle ?title ;
          lr:hasLocation ?location ;
          lr:isActive ?active .
      }
    `)
  },
  fields: {
   id: { type: StringType },
   title: { type: StringType },
   location: { type: StringType },
   active: { type: BooleanType },
  }
})
