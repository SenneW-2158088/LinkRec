import { Context } from "..";
import { Database } from "../../db/database";
import { GQLTypes } from "../../schema/types";
import { JobInput, jobSchema, JobUpdate } from "../../validation/job";
import { SparqlAPI } from "../sparql/sparql_api";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { JobQuery } from "../sparql/queries/job";
import { v4 as uuid } from "uuid";
import { SparqlJobType } from "../sparql/parsers/job";


type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class JobService{
  constructor(private context: Context) { }


  async create(input: JobInput) {

    // jobSchema.parse(input);
    console.log(input)

    // Create query
    const jobId = uuid();
    const insert = JobQuery.create(
      jobId,
      input.title,
      input.location,
      input.isActive,
      input.requirements.map(req => ({
        id: uuid(),
        ...req
      })),
    )

    console.log(insert)
    const insertResult = await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(insert));
    console.log(insertResult);

    // const query = JobQuery.get(jobId)
    // console.log(query)

    const queryResult = await this.context.sparql.resolve(SparqlJobType(jobId))
    console.log("JOB: ", queryResult);
    // Fetch query
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
