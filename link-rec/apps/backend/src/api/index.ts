import { Database } from "../db/database";
import { UserService } from "./services";

export * from "./services"

export interface ApiConfig {
  db: Database
}

export interface Context {
  db: Database
}

export class LinkRecAPI {
  private context: Context;

  public userService: UserService;

  constructor(config: ApiConfig) {
    this.context = {
      db: config.db
    }

    this.userService = new UserService(this.context)
  }

}
