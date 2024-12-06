import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { Employer, User } from "../../schema/types";
import { compare, hash } from "bcrypt";
import { log } from "console";
import { GraphQLError } from "graphql";
import { loginInput, loginInputSchema } from "../../validation/user";
import { UserNotFoundError } from "../errors/userNotFoundError";
import { InvalidCredentialsError } from "../errors/invalidCredentialsError";
import { EmployerInput, EmployerLoginInput, employerloginInputSchema } from "../../validation/employer";
import { employerTable } from "../../db/schema/employerSchema";

export class AuthenticationService{
  private USER_TABLE = userTable
  private EMPLOYER_TABLE = employerTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async employer_login(input: EmployerLoginInput): Promise<Employer> {

    employerloginInputSchema.parse(input);

    const [user] = await this.db
      .select()
      .from(this.EMPLOYER_TABLE)
      .where(eq(this.EMPLOYER_TABLE.email, input.email))
      .limit(1);

    if (!user) {
      throw new UserNotFoundError(input.email);
    }

    if(!await compare(input.password, user.password)){
      throw new InvalidCredentialsError();
    }
    //TODO fetch/store rest from rdf
    return {
      id: user.id,
      email: user.email,
      name: "",
      phoneNumber: "",
      location: "",
    }
  }

  async user_login(input: loginInput): Promise<User> {

    loginInputSchema.parse(input);

    const [user] = await this.db
      .select()
      .from(this.USER_TABLE)
      .where(eq(this.USER_TABLE.email, input.email))
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
