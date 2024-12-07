import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { SparqlBuilder, SparqlFieldBuilder } from "../sparql/sparql_builder";
import { hash } from "bcrypt";
import { RegisterInput, userInputSchema } from "../../validation/user";
import { UserNotFoundError } from "../errors/user";
import { GQLTypes } from "../../schema/types";
import { jobSeekingStatusToString } from "../../schema/types/jobseeking/types";

type User = GQLTypes.User.Type
const Status = GQLTypes.JobSeekingStatus.Type

export class UserService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async getUser(id: string): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(this.TABLE)
      .where(eq(this.TABLE.id, id))
      .limit(1);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    this.queryRdfUser(user);

    return {
      id: user.id,
      email: user.email,
      firstName: "",
      lastName: "",
      status: Status.ACTIVELY_LOOKING,
      education: [],
      connections: []
    };
  }

  async createUser(input: RegisterInput): Promise<User> {
    console.log("input, ", input)

    // userInputSchema.parse(input);

    const [inserted] = await this.db.insert(this.TABLE).values({
      email: input.email,
      password: await hash(input.password, 4)
    }).returning();

    // TODO: insert into rdf and refetch + add data to struct

    const user: GQLTypes.User.Type = {
      id: inserted.id,
      email: inserted.email,
      firstName: input.firstName,
      lastName: input.lastName,
      status: GQLTypes.JobSeekingStatus.Type.NOT_LOOKING,
      education: [],
      connections: [],
    };

    // await this.updateRdfUser(user)

    return user;
  }

  private async queryRdfUser(user: { id: string }) {
    console.log(await this.context.sparql.query(SparqlBuilder.defaultPrefixes()
      .build(`
        SELECT ?firstName ?lastName ?email ?phone ?gender ?location ?jobSeekingStatus ?language ?experience ?education
        WHERE {
          user:JohnDoe a lr:User ;
            lr:hasFirstName ?firstName ;
            lr:hasLastName ?lastName ;
            lr:hasEmail ?email .
          OPTIONAL { user:JohnDoe lr:hasPhoneNumber ?phone . }
          OPTIONAL { user:JohnDoe lr:hasGender ?gender . }
          OPTIONAL { user:JohnDoe lr:hasLocation ?location . }
          OPTIONAL { user:JohnDoe lr:hasJobSeekingStatus ?jobSeekingStatus . }
          OPTIONAL { user:JohnDoe lr:hasLanguage ?language . }
          OPTIONAL { user:JohnDoe lr:hasExperience ?experience . }
          OPTIONAL { user:JohnDoe lr:hasEducation ?education . }
        }
      `)))
  }

  private async updateRdfUser(user: User) {
    const fields = SparqlFieldBuilder.fromFields(
      `user: ${ user.id } a lr:User`,
      `lr:hasEmail ${user.email}`,
      `lr:hasFirstName ${user.firstName}`,
      `lr:hasLastName ${user.lastName}`,
      `lr:hasJobSeekingStatus lr:${jobSeekingStatusToString(user.status)}`
    )
    if (user.phoneNumber)
      fields.field(`lr:hasPhoneNumber ${user.phoneNumber}`)
    if (user.location)
      fields.field(`lr:hasLocation ${user.location}`)
    if (user.webPage)
      fields.field(`lr:hasWebPage ${user.webPage}`)

    // TODO: Delete these fields before adding them again

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(
        `INSERT DATA {
          ${fields.build()}
        }`
      ))
  }

  private async createConnection(user1: User, user2: User) {
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        INSERT DATA {
          lr_users:${user1.id} lro:Connection lr_users:${user2.id} .
        }
      `))
  }
}
