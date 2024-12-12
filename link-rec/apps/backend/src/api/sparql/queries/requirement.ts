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
SELECT ?requirement ?id ?education ?years ?language ?degree ?profession
WHERE {
  ${jobField.build()}

  ?requirement a lr:Requirement ;
  	lr:hasId ?id .
      OPTIONAL { ?requirement lr:hasEducationTitle ?education } .
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
        `requirement:${requirement_id} a lr:Requirement`,
        `requirement:${requirement_id} lr:hasId "${requirement_id}"`,
      ).setSeparator(". \n");

      if(requirement.education){
        fields.field(`requirement:${requirement_id} lr:hasEducationTitle "${requirement.education}"`)
      }

      if(requirement.profession){
        fields.field(`requirement:${requirement_id} lr:hasProfession "${requirement.profession}"`)
      }

      if(requirement.years){
        fields.field(`requirement:${requirement_id} lr:requiredYears ${requirement.years}`)
      }

      if(requirement.language){
        fields.field(`requirement:${requirement_id} lr:hasLanguage "${requirement.language}"`)
      }

      if(requirement.degree){
        fields.field(`requirement:${requirement_id} lr:hasDegree "${requirement.degree}"`)
      }

      requirementsFields.push(fields);
    }

    return `
    INSERT DATA {
      ${jobField.build()}
      ${requirementsFields.map(field => (field.build() + "\n"))}
    }
    `
  }

  export const deleteRequirementsForJob = (id: string) : string => {
    return `
    DELETE {
      job:${id} lr:hasRequirement ?requirement .
   	  ?requirement lr:hasId ?id .
      ?requirement lr:hasEducationTitle ?education .
      ?requirement lr:hasInferredEducationTitle ?inferredEducation .
      ?requirement lr:hasProfession ?profession .
      ?requirement lr:hasInferredProfession ?inferredProfession .
      ?requirement lr:requiredYears ?years .
      ?requirement lr:hasLanguage ?language .
      ?requirement lr:hasDegree ?degree .
      ?requirement lr:hasDescription ?description .
    }
    WHERE {
      job:${id} lr:hasRequirement ?requirement .
      ?requirement a lr:Requirement .
     	?requirement lr:hasId ?id .
          OPTIONAL { ?requirement lr:hasEducationTitle ?education } .
          OPTIONAL { ?requirement lr:hasInferredEducationTitle ?inferredEducation } .
          OPTIONAL { ?requirement lr:hasProfession ?profession} .
          OPTIONAL { ?requirement lr:hasInferredProfession ?inferredProfession} .
          OPTIONAL { ?requirement lr:requiredYears ?years } .
          OPTIONAL { ?requirement lr:hasLanguage ?language } .
          OPTIONAL { ?requirement lr:hasDegree ?degree } .
          OPTIONAL { ?requirement lr:hasDescription ?description } .
    }
    `
  }
}
