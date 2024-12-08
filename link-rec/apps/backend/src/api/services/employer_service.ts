import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { hash } from "bcrypt";
import { employerTable } from "../../db/schema/employerSchema";
import { Validation } from "../../validation";
import { GQLTypes } from "../../schema/types";
import { Job } from "../../schema/types/job/types";
import { EmployerQuery } from "../sparql/queries/employer";
import { SparqlAllEmployersType, SparqlEmployerType } from "../sparql/parsers/employer";
import { UserNotFoundError } from "../errors/user";
import { JobInput } from "../../validation/job";
import { JobService } from "./job_service";

type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class EmployerService{
  private TABLE = employerTable
  private db: Database["db"]

  constructor(private context: Context, private jobservice: JobService) { this.db = context.db.db; }

  async create(input: Validation.Employer.Register): Promise<Employer> {

    Validation.Employer.registerSchema.parse(input);

    const [inserted] = await this.db.insert(this.TABLE).values({
      email: input.email,
      password: await hash(input.password, 4)
    }).returning();


    const insert = EmployerQuery.create(inserted.id, input)
    console.log(insert)
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(insert));
    console.log("before")
    const queryResult = await this.context.sparql.resolve(SparqlEmployerType(inserted.id));
    console.log("after")

    const employer: Employer = {
      id: inserted.id,
      email: inserted.email,
      name: queryResult.name,
      phoneNumber: queryResult.phoneNumber,
      jobs: []
    };

    return employer;
  }

  async update(id: string) : Promise<Employer>{

  }

  // Get specific employer
  async get(id: string) : Promise<Employer> {

    const [employer] = await this.db
      .select()
      .from(this.TABLE)
      .where(eq(this.TABLE.id, id))

    if (!employer) {
      throw new UserNotFoundError(id);
    }

    const queryResult = await this.context.sparql.resolve(SparqlEmployerType(id));

    return {
      ...employer,
      ...queryResult,
      jobs: [],
    }
  }

  // Remove an employer account
  async remove(id: string) : Promise<Employer> {
    const employer = this.get(id);
    const remove = EmployerQuery.remove(id);
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(remove));
    return employer;
  }


  // Get all employers
  async all() : Promise<Employer[]> {
    const employers = await this.context.sparql.resolve(SparqlAllEmployersType());
    return employers.map((employer) => ({
      ...employer,
      jobs: []
    }))
  }

  //
  async addJob(
    employerId: string,
    input: JobInput
  ) : Promise<Job> {

    const result = await this.jobservice.create(input);

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(
      EmployerQuery.addJob(employerId, result.id)
    ));

    return result;
  }

  async removeJob(
    employerId: string,
    jobId: string
  ) : Promise<Job> {

    const result = await this.jobservice.delete(jobId);

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(
      EmployerQuery.removeJob(employerId, jobId)
    ));

    return result;
  }

  async matches() : Promise<User[]> {

  }

}
