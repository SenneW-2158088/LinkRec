import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { User } from "../../schema/types";
import { compare, hash } from "bcrypt";
import { log } from "console";
import { GraphQLError } from "graphql";
import { loginInput, loginInputSchema } from "../../validation/user";
import { UserNotFoundError } from "../errors/userNotFoundError";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError";

export class AuthenticationService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async login(input: loginInput): Promise<User> {

    loginInputSchema.parse(input);

    const [user] = await this.db
      .select()
      .from(this.TABLE)
      .where(eq(this.TABLE.email, input.email))
      .limit(1);

    if (!user) {
      throw new UserNotFoundError(input.email);
    }

    if(!await compare(input.password, user.password)){
      throw new InvalidCredentialsError();
    }

    // TODO: add sparql data
    return {
      ...user,
      firstName: "empy",
      lastName: "empty",
      education: [], // Fetch education if needed
      connections: [] // Fetch connections if needed
    };
  }
}
