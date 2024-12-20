import { GraphQLError } from "graphql";
import { Database } from "../db/database";
import { UserService } from "./services";
import { AuthenticationService } from "./services/authentication_service";
import { SparqlAPI } from "./sparql/sparql_api";
import { z } from "zod";
import { EmployerService } from "./services/employer_service";
import { LinkRecError } from "./errors";
import { ValidationError } from "./errors/validation";
import { JobService } from "./services/job_service";

export * from "./services"

export interface ApiConfig {
  db: Database
  sparql: SparqlAPI
}

export interface Context {
  db: Database
  sparql: SparqlAPI
}

export class LinkRecAPI {
  private context: Context;

  public userService: UserService;
  public employerService: EmployerService;
  public authenticationService: AuthenticationService;
  public jobService: JobService;

  constructor(config: ApiConfig) {
    this.context = {
      db: config.db,
      sparql: config.sparql
    }

    this.userService = new UserService(this.context)
    this.authenticationService = new AuthenticationService(this.context)
    this.jobService = new JobService(this.context);
    this.employerService = new EmployerService(this.context, this.jobService);
  }

  public handleError(error: unknown): GraphQLError {
    if (error instanceof LinkRecError){
      return error.toGraphQL()
    }

    if(error instanceof z.ZodError) {
      return ValidationError.fromZodError(error).toGraphQL();
    }

    console.log(error)
    return new GraphQLError("Unexpected error occured");
  }
}
