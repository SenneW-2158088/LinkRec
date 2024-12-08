import { Context } from "..";
import { Database } from "../../db/database";
import { GQLTypes } from "../../schema/types";
import { JobInput, jobSchema } from "../../validation/job";
import { SparqlAPI } from "../sparql/sparql_api";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { JobQuery } from "../sparql/queries/job";


type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class JobService{
  constructor(private context: Context) { }


  async create(input: JobInput) {
    jobSchema.parse(input);

    const query = JobQuery.create(
      "",
      input.title,
      input.location,
      input.active,
      input.requirements.map(req => ({
        id: "",
        ...req
      })),
    )

    console.log(query);
    // const result = await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(query));
  }

  async update(input: JobInput) {
    // insert a new rdf job
  }

  async delete(id: string) {


  }

  async all() {

  }
}
