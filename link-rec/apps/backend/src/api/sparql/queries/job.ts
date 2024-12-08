import { SparqlBuilder, SparqlFieldBuilder } from "../sparql_builder"

export namespace JobQuery {

  export const all = () : string => {

    const jobFields = SparqlFieldBuilder.fromFields(
      `?job a lr:Job`,
      `lr:hasId ?id`,
      `lr:hasTitle ?title`,
      `lr:hasLocation ?location`,
      `lr:isActive ?active`,
    );

    return `
      SELECT ?id ?title ?location ?active
      WHERE {
        ${jobFields.build()}
      }
    `
  }

  export const get = (id: string) : string => {

    const jobFields = SparqlFieldBuilder.fromFields(
      `a lr:Job`,
      `lr:hasId ?id`,
      `lr:hasTitle ?title`,
      `lr:hasLocation ?location`,
      `lr:isActive ?active`,
    );

    return `
SELECT ?id ?title ?location ?active
WHERE {
  ${jobFields.build()}
}
    `
  }

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
    }[]
  ) : string => {

    const jobFields = SparqlFieldBuilder.fromFields(
      `job:${id} a lr:Job`,
      `lr:hasId "${id}"`,
      `lr:hasTitle "${title}"`,
      `lr:hasLocation "${location}"`,
      `lr:isActive ${active}`,
    );

    const requirementFields: string[] = [];

    requirements.forEach(req => {
      jobFields.field(`lr:hasRequirement requirement:${req.id}`);

      const reqTriples = SparqlFieldBuilder.fromFields(
        `requirement:${req.id} a lr:Requirement`,
        `lr:hasId "${req.id}"`,
        `lr:hasProfession "${req.profession}"`,
        `lr:requiredYears "${req.years}"`,
        `lr:hasLanguage "${req.language}"`,
        `lr:hasEducation "${req.education}"`,
        `lr:hasDegree "${req.degree}"`,
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

  export const update = (
      jobId: string,
      title?: string,
      location?: string,
      active?: boolean,
      requirements?: {
        id: string,
        profession?: string,
        years?: number,
        language?: string,
        education?: string,
        degree?: string,
        description?: string,
      }[]
    ): string => {
      const deleteBuilder = SparqlFieldBuilder.create();
      const insertBuilder = SparqlFieldBuilder.create();
      const whereBuilder = SparqlFieldBuilder.create();

      // Build WHERE clause first to establish existing data
      whereBuilder.field(`job:${jobId} a lr:Job`);

      // Build DELETE and INSERT for job fields
      if (title !== undefined) {
        deleteBuilder.field(`job:${jobId} lr:hasTitle ?oldTitle`);
        insertBuilder.field(`job:${jobId} lr:hasTitle "${title}"`);
        whereBuilder.field(`OPTIONAL { job:${jobId} lr:hasTitle ?oldTitle }`);
      }

      if (location !== undefined) {
        deleteBuilder.field(`job:${jobId} lr:hasLocation ?oldLocation`);
        insertBuilder.field(`job:${jobId} lr:hasLocation "${location}"`);
        whereBuilder.field(`OPTIONAL { job:${jobId} lr:hasLocation ?oldLocation }`);
      }

      if (active !== undefined) {
        deleteBuilder.field(`job:${jobId} lr:isActive ?oldActive`);
        insertBuilder.field(`job:${jobId} lr:isActive ${active}`);
        whereBuilder.field(`OPTIONAL { job:${jobId} lr:isActive ?oldActive }`);
      }

      // Handle requirements updates if provided
      if (requirements && requirements.length > 0) {
        requirements.forEach(req => {
          const reqId = req.id;
          whereBuilder.field(`OPTIONAL { job:${jobId} lr:hasRequirement requirement:${reqId} }`);

          if (req.profession !== undefined) {
            deleteBuilder.field(`requirement:${reqId} lr:hasProfession ?oldProfession${reqId}`);
            insertBuilder.field(`requirement:${reqId} lr:hasProfession "${req.profession}"`);
            whereBuilder.field(`OPTIONAL { requirement:${reqId} lr:hasProfession ?oldProfession${reqId} }`);
          }

          if (req.years !== undefined) {
            deleteBuilder.field(`requirement:${reqId} lr:hasYearsExperience ?oldYears${reqId}`);
            insertBuilder.field(`requirement:${reqId} lr:hasYearsExperience "${req.years}"`);
            whereBuilder.field(`OPTIONAL { requirement:${reqId} lr:hasYearsExperience ?oldYears${reqId} }`);
          }

          if (req.language !== undefined) {
            deleteBuilder.field(`requirement:${reqId} lr:hasLanguage ?oldLanguage${reqId}`);
            insertBuilder.field(`requirement:${reqId} lr:hasLanguage "${req.language}"`);
            whereBuilder.field(`OPTIONAL { requirement:${reqId} lr:hasLanguage ?oldLanguage${reqId} }`);
          }

          if (req.education !== undefined) {
            deleteBuilder.field(`requirement:${reqId} lr:hasEducation ?oldEducation${reqId}`);
            insertBuilder.field(`requirement:${reqId} lr:hasEducation "${req.education}"`);
            whereBuilder.field(`OPTIONAL { requirement:${reqId} lr:hasEducation ?oldEducation${reqId} }`);
          }

          if (req.degree !== undefined) {
            deleteBuilder.field(`requirement:${reqId} lr:hasDegree ?oldDegree${reqId}`);
            insertBuilder.field(`requirement:${reqId} lr:hasDegree "${req.degree}"`);
            whereBuilder.field(`OPTIONAL { requirement:${reqId} lr:hasDegree ?oldDegree${reqId} }`);
          }

          if (req.description !== undefined) {
            deleteBuilder.field(`requirement:${reqId} lr:hasDescription ?oldDescription${reqId}`);
            insertBuilder.field(`requirement:${reqId} lr:hasDescription "${req.description}"`);
            whereBuilder.field(`OPTIONAL { requirement:${reqId} lr:hasDescription ?oldDescription${reqId} }`);
          }
        });
      }

      // Only include DELETE and INSERT if there are changes
      const deleteClause = deleteBuilder.hasFields() ? `DELETE { ${deleteBuilder.build()} }` : '';
      const insertClause = insertBuilder.hasFields() ? `INSERT { ${insertBuilder.build()} }` : '';
      const whereClause = `WHERE { ${whereBuilder.build()} }`;

      // Construct the final query
      return `
  ${deleteClause}
  ${insertClause}
  ${whereClause}
      `.trim();
    };

  export const remove = () : string => {
   return ""
  }
}
