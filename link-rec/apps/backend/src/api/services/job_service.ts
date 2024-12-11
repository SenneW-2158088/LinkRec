import { Context } from "..";
import { Database } from "../../db/database";
import { GQLTypes } from "../../schema/types";
import { JobInput, jobSchema, JobUpdate } from "../../validation/job";
import { SparqlAPI } from "../sparql/sparql_api";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { JobQuery } from "../sparql/queries/job";
import { v4 as uuid } from "uuid";
import { SparqlAllJobType, SparqlJobType } from "../sparql/parsers/job";
import { Job } from "../../schema/types/job/types";
import { Experience } from "../../schema/types/experience/types";
import { Requirement } from "../../schema/types/requirement/types";
import { RequirementQuery } from "../sparql/queries/requirement";
import { SparqlJobRequirementsType } from "../sparql/parsers/requirement";
import { LinkRecError } from "../errors";


type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class JobService{
  constructor(private context: Context) { }


  async create(input: JobInput) : Promise<Job> {

    jobSchema.parse(input);

    // Create query
    const jobId = uuid();
    const insert = JobQuery.create(
      jobId,
      input.title,
      input.location,
      input.active,
      input.requirements.map(req => ({
        id: uuid(),
        ...req
      })),
    )

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(insert));
    const queryResult = await this.context.sparql.resolve(SparqlJobType(jobId))

    console.log(queryResult)

    return {
      id: queryResult.id,
      active: queryResult.active,
      location: queryResult.location,
      title: queryResult.title,
      requirements: [],
    } as Job
  }

  async update(id: string, input: JobUpdate) : Promise<Job> {
    const jobUpdateQuery = JobQuery.update(
      id,
      input.title,
      input.location,
      input.active,
    )


    const result = await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(jobUpdateQuery));

    if(input.requirements) {
      const requirementsDeleteQuery = RequirementQuery.deleteRequirementsForJob(id);
      await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(requirementsDeleteQuery));
      const requirementsUpdateQuery = RequirementQuery.addRequirementsForJob(id, input.requirements);
      await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(requirementsUpdateQuery));
    }

    return await this.get(id);
  }

  async get(id: string) : Promise<Job> {
    const queryResult = await this.context.sparql.resolve(SparqlJobType(id))
    return {
      ...queryResult,
      requirements: [],
    }
  }

  async delete(id: string) : Promise<Job> {
    const job = await this.get(id);
    if(!job) throw new LinkRecError("Job not found")

    // Delete job
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(
      JobQuery.remove(id)
    ));

    // Delete requirements
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(
      RequirementQuery.deleteRequirementsForJob(id)
    ));

    return job;
  }

  async all() : Promise<Job[]> {
    const jobs = await this.context.sparql.resolve(SparqlAllJobType());
    return jobs.map((job) => ({
      ...job,
      requirements: []
    }))
  }

  async getRequirementsFor(jobId: string) : Promise<Requirement[]> {
    const queryResult = await this.context.sparql.resolve(SparqlJobRequirementsType(jobId));

    return queryResult.map((res) => ({
      ...res
    }));
  }
}
