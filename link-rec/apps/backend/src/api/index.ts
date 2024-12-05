import { Database } from "../db/database";
import { UserService } from "./services";
import { AuthenticationService } from "./services/authentication_service";
import { SparqlAPI } from "./sparql/sparql_api";

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
  public authenticationService: AuthenticationService;

  constructor(config: ApiConfig) {
    this.context = {
      db: config.db,
      sparql: config.sparql
    }

    this.userService = new UserService(this.context)
    this.authenticationService = new AuthenticationService(this.context)
  }
}
