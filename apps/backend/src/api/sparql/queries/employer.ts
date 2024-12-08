import { EmployerRegister } from "../../../validation/employer"
import { SparqlFieldBuilder } from "../sparql_builder"

export namespace EmployerQuery {

  export const create = (
    id: string,
    input: EmployerRegister
  ) : string => {

    let employerFields = SparqlFieldBuilder.fromFields(
      `employer:${id} a lr:Employer`,
      `lr:hasId "${id}"`,
      `lr:hasEmail "${input.email}"`,
      `lr:hasName "${input.name}"`,
      `lr:hasPhoneNumber "${input.phoneNumber}"`,
    )

    if(input.webPage)
      employerFields.field(`lr:hasWebPage "${input.webPage}"`)

    return `
    INSERT DATA {
      ${employerFields.build()}
    }
    `
  }

  export const update = () : string => {
    return ""
  }

  export const remove = (id: string) : string => {
    return `
    DELETE {
      employer:${id} a lr:Employer ;
        lr:hasEmail ?email ;
        lr:hasName ?name ;
        lr:hasPhoneNumber ?phoneNumber .
    }
    WHERE {
      OPTIONAL { employer:${id} lr:hasWebPage ?webPage }
    }
    `
  }

  export const get = (id: string) : string => {
    return `
    SELECT ?id ?email ?name ?webPage ?phoneNumber
    WHERE {
    employer:${id} a lr:Employer ;
      lr:hasEmail ?email ;
      lr:hasId ?id ;
      lr:hasName ?name ;
      lr:hasPhoneNumber ?phoneNumber .

      OPTIONAL { employer:${id} lr:hasWebPage ?webPage ; }
    }
    `
  }

  export const all = () : string => {
    return `
    SELECT ?id ?email ?name ?webPage ?phoneNumber
    WHERE {
    ?employer a lr:Employer ;
      lr:hasEmail ?email ;
      lr:hasId ?id ;
      lr:hasName ?name ;
      lr:hasPhoneNumber ?phoneNumber .

      OPTIONAL { ?employer lr:hasWebPage ?webPage ; }
    }
    `
  }

  export const addJob = (
    employerId: string,
    jobId: string
  ) : string => {
    return `
    INSERT {
	    ?employer a lr:Employer ;
				lr:hasJob job:${jobId} .
    } WHERE {
      ?employer lr:hasId "${employerId}"
    }
    `
  }

  export const removeJob = (
    employerId: string,
    jobId: string
  ) : string => {
    return `
    DELETE {
	    ?employer lr:hasJob ?job .
    } WHERE {
      ?employer lr:hasId "${employerId}" .
      ?employer lr:hasJob job:${jobId} .
    }
    `
  }

  export const matches = (
    employerId: string,
  ) : string => {
    return `
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
      ?user a lr:User ;
        lr:hasId ?id ;
        lr:hasEmail ?email ;
        lr:hasFirstName ?firstName ;
        lr:hasLastName ?lastName ;
        lr:hasEmail ?email ;
        lr:hasInferredProfession ?inferredProfession ;
        lr:hasPhoneNumber ?phoneNumber .
      ?user lr:hasJobSeekingStatus ?jobSeekingStatusResource .
      ?jobSeekingStatusResource rdfs:label ?status .
      OPTIONAL { ?user lr:hasGender ?gender . }
      OPTIONAL { ?user lr:hasLocation ?location . }
      OPTIONAL { ?user lr:hasLanguage ?language . }

      employer:${employerId} a lr:Employer ;
        lr:hasJob ?job .

      ?job lr:hasRequirement ?requirement .
      ?requirement lr:hasInferredProfession ?inferredProfession .
    }
    GROUP BY ?id ?email ?firstName ?lastName ?email ?status ?phoneNumber ?gender ?location`
  }
}
