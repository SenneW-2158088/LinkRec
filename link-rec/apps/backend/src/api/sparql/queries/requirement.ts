import { v4 } from "uuid";
import { Requirement } from "../../../schema/types/requirement/types";
import { RequirementInput } from "../../../validation/requirement";
import { SparqlFieldBuilder } from "../sparql_builder"

export namespace RequirementQuery {
  export const forJob = (id: string) : string => {

  const jobField = SparqlFieldBuilder.fromFields(
    `job:${id} lr:hasRequirement ?requirement`,
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
}
  `
  }

  export const addRequirementsForJob = (
    id: string,
    requirements: {
      profession?: string,
      years?: number,
      language?: string,
      education?: string,
      degree?: string,
      description?: string,
    }[]
  ) : string => {

    let jobField = SparqlFieldBuilder.create().setSeparator(". \n")

    let requirementsFields: SparqlFieldBuilder[] = []

    for (const requirement of requirements) {
      const requirement_id = v4();
      jobField.field(`job:${id} lr:hasRequirement requirement:${requirement_id}`)

      let fields = SparqlFieldBuilder.fromFields(
        `requirement:${requirement_id} a lr:requirement`,
      ).setSeparator(". \n");

      if(requirement.education){
        fields.field(`OPTIONAL { requirement:${requirement_id} lr:hasEducation "${requirement.education}"}`)
      }

      if(requirement.profession){
        fields.field(`OPTIONAL { requirement:${requirement_id} lr:hasProfession "${requirement.profession}"}`)
      }

      if(requirement.years){
        fields.field(`OPTIONAL { requirement:${requirement_id} lr:requiredYears ${requirement.years}}`)
      }

      if(requirement.language){
        fields.field(`OPTIONAL { requirement:${requirement_id} lr:hasLanguage "${requirement.language}}"`)
      }

      if(requirement.degree){
        fields.field(`OPTIONAL { requirement:${requirement_id} lr:hasDegree "${requirement.degree}"}`)
      }

      requirementsFields.push(fields);
    }

    return `
    INSERT DATA {
      ${jobField.build()}
      ${requirementsFields.forEach(field => (field.build() + "\n"))}
    }
    `
  }

  export const deleteRequirementsForJob = (id: string) : string => {
    return `
    DELETE {
      job:${id} lr:hasRequirement ?requirement .
   	  ?requirement lr:hasId ?id .
      ?requirement lr:hasEducation ?education .
      ?requirement lr:hasProfession ?profession .
      ?requirement lr:requiredYears ?years .
      ?requirement lr:hasLanguage ?language .
      ?requirement lr:hasDegree ?degree .
      ?requirement lr:hasDescription ?description .
    }
    WHERE {
      job:${id} lr:hasRequirement ?requirement .
      ?requirement a lr:Requirement .
     	?requirement lr:hasId ?id .
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
