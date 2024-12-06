import { GraphQLError } from "graphql";
import { Database } from "../db/database";
import { UserService } from "./services";
import { AuthenticationService } from "./services/authentication_service";
import { SparqlAPI } from "./sparql/sparql_api";
import { LinkRecError } from "./errors/error";
import { z } from "zod";
import { ValidationError } from "./errors/validationError";
import { EmployerService } from "./services/employer_service";

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

  constructor(config: ApiConfig) {
    this.context = {
      db: config.db,
      sparql: config.sparql
    }

    this.userService = new UserService(this.context)
    this.employerService = new EmployerService(this.context)
    this.authenticationService = new AuthenticationService(this.context)
  }

  public handleError(error: unknown): GraphQLError {
    if (error instanceof LinkRecError){
      return error.toGraphQL()
    }

    if(error instanceof z.ZodError) {
      return ValidationError.fromZodError(error).toGraphQL();
    }

    return new GraphQLError("Unexpected error occured");
  }
}
