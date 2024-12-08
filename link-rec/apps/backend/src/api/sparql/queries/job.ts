import { SparqlFieldBuilder } from "../sparql_builder"

export namespace JobQuery {

  export const create = (
    id: string,
    title: string,
    location: string,
    active: boolean,
    requirements: {
      id: string,
      profession: string,
      years: number,
      language: string,
      education: string,
      degree: string,
      description: string,
    }[]
  ) : string => {


    const jobFields = SparqlFieldBuilder.fromFields(
      `job:${id} a lr:Job`,
      `lr:hasId ${id}`,
      `lr:hasTitle ${title}`,
      `lr:hasLocation "${location}"`,
      `lr:isActive "${active}`,
    );

    const requirementFields: string[] = [];

    requirements.forEach(req => {
      jobFields.field(`job:${id} lr:hasRequirement req:${req.id}`);

      const reqTriples = SparqlFieldBuilder.fromFields(
        `req:${req.id} a lr:Requirement`,
        `req:${req.id} lr:hasId "${req.id}"`,
        `req:${req.id} lr:hasProfession "${req.profession}"`,
        `req:${req.id} lr:hasYearsExperience "${req.years}"^^xsd:integer`,
        `req:${req.id} lr:hasLanguage "${req.language}"`,
        `req:${req.id} lr:hasEducation "${req.education}"`,
        `req:${req.id} lr:hasDegree "${req.degree}"`,
        `req:${req.id} lr:hasDescription "${req.description}"`
      );

      requirementFields.push(reqTriples.build());
    });

    return `
    INSERT DATA {
      ${jobFields.build()}
      ${requirementFields.join("\n")}
    }
    `
  }

  export const update = () : string => {
   return ""
  }

  export const remove = () : string => {
   return ""
  }
}
