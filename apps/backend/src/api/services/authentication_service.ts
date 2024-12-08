import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { compare, hash } from "bcrypt";
import { LoginInput, loginInputSchema } from "../../validation/user";
import { employerTable } from "../../db/schema/employerSchema";
import { UserNotFoundError } from "../errors/user";
import { InvalidCredentialsError } from "../errors/authorization";
import { Validation } from "../../validation";
import { GQLTypes } from "../../schema/types";

type Employer = GQLTypes.Employer.Type;
type User = GQLTypes.User.Type;
const Status = GQLTypes.JobSeekingStatus.StatusType;

export class AuthenticationService{
  private USER_TABLE = userTable
  private EMPLOYER_TABLE = employerTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async employer_login(input: Validation.Employer.Login): Promise<Employer> {

    Validation.Employer.loginSchema.parse(input);

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
      jobs: [],
    }
  }

  async user_login(input: LoginInput): Promise<User> {

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
      id: user.id,
      email: user.email,
      firstName: "",
      lastName: "",
      phoneNumber: "",
      status: Status.ACTIVELY_LOOKING,
      languages: [],
      educations: [],
      connections: [],
      experiences: [],
    }
  }
}
