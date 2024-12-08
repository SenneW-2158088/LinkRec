import { SparqlFieldBuilder } from "../sparql_builder"

export namespace RequirementQuery {
  export const forJob = (id: string) : string => {

  const jobField = SparqlFieldBuilder.fromFields(
    `job:${id} a lr:Requirement`,
    `lr:hasRequirement ?requirement`,
  );

  return `
SELECT ?requirement ?id ?education ?years ?language ?degree
WHERE {
  ${jobField.build()}

  ?requirement a lr:Requirement ;
  	lr:hasId ?id .
      OPTIONAL { ?requirement lr:hasEducation ?education } .
      OPTIONAL { ?requirement lr:hasProfession ?profession} .
      OPTIONAL { ?requirement lr:requiredYears ?years } .
      OPTIONAL { ?requirement lr:hasLanguage ?language } .
      OPTIONAL { ?requirement lr:hasDegree ?degree } .
      OPTIONAL { ?requirement lr:hasDescription ?description } .
}
  `
  }
}
