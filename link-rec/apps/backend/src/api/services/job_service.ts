import { Context } from "..";
import { Database } from "../../db/database";
import { GQLTypes } from "../../schema/types";
import { JobInput, jobSchema, JobUpdate } from "../../validation/job";
import { SparqlAPI } from "../sparql/sparql_api";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { JobQuery } from "../sparql/queries/job";
import { v4 as uuid } from "uuid";


type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class JobService{
  constructor(private context: Context) { }


  async create(input: JobInput) {

    // jobSchema.parse(input);
    console.log(input)

    const query = JobQuery.create(
      uuid(),
      input.title,
      input.location,
      input.isActive,
      input.requirements.map(req => ({
        id: uuid(),
        ...req
      })),
    )

    console.log(query);
    // const result = await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(query));
  }

  async update(id: string, input: JobUpdate) {
    const query = JobQuery.update(
      id,
      input.title,
      input.location,
      input.isActive,
      input.requirements?.map(req => ({
        ...req
      })),
    )

    console.log(query);
  }

  async delete(id: string) {


  }

  async all() {

  }
}
