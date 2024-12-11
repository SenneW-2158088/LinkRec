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
      `job:${id} a lr:Job`,
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

    ): string => {
      const deleteBuilder = SparqlFieldBuilder.create().setSeparator('. \n');
      const insertBuilder = SparqlFieldBuilder.create().setSeparator('. \n');
      const whereBuilder = SparqlFieldBuilder.create().setSeparator(". \n");

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
        console.log("setting active to ", active, jobId)
        deleteBuilder.field(`job:${jobId} lr:isActive ?oldActive`);
        insertBuilder.field(`job:${jobId} lr:isActive ${active}`);
        whereBuilder.field(`OPTIONAL { job:${jobId} lr:isActive ?oldActive }`);
      }

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

    export const remove = (jobId: string): string => {
      return `
        DELETE {
          ?job a lr:Job ;
              lr:hasId ?id ;
              lr:hasTitle ?title ;
              lr:hasLocation ?location ;
              lr:isActive ?active ;
              lr:hasRequirement ?requirement .
          ?requirement ?p ?o .
        }
        WHERE {
          ?job a lr:Job ;
              lr:hasId "${jobId}" .

          OPTIONAL {
            ?job lr:hasTitle ?title ;
                lr:hasLocation ?location ;
                lr:isActive ?active .
          }

          OPTIONAL {
            ?job lr:hasRequirement ?requirement .
            ?requirement ?p ?o .
          }
        }`
    }
}
