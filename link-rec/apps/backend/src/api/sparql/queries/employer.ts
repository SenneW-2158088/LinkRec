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
}
