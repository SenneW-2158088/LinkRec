import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { SparqlBuilder, SparqlFieldBuilder, SparqlParser } from "../sparql/sparql_builder";
import { hash } from "bcrypt";
import { RegisterInput, userInputSchema } from "../../validation/user";
import { UserNotFoundError } from "../errors/user";
import { GQLTypes } from "../../schema/types";
import { jobSeekingStatusToUriString } from "../../schema/types/jobseeking/types";
import { User } from "../../schema/types/user";
import { SparqlConnectionsType, SparqlConnectionType, SparqlEducationsType, SparqlExperienceType, SparqlUserConfig, SparqlUserType } from "./types/user";
import { statusFromString, UserInput } from "../../schema/types/user/types";

type User = GQLTypes.User.Type
const Status = GQLTypes.JobSeekingStatus.StatusType

export class UserService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async getUsers() : Promise<User[]> {

    const user = await this.db
      .select()
      .from(this.TABLE)

    return user.flatMap((u): User.Type  => {
      return {
        id: u.id,
        email: u.email,
        firstName: "",
        lastName: "",
        status: Status.NOT_LOOKING,
        phoneNumber: "asdfadfas",
        languages: [],
        experiences: [],
        educations: [],
        connections: [],
      };
    })
  }

  async getUser(id: string): Promise<User> {
    const result = await this.context.sparql.resolve(SparqlUserType(id))
    return result as any
  }

  async getUserConnections(id: string): Promise<GQLTypes.Connection.Type[]> {
    const users = await this.context.sparql.resolve(SparqlConnectionsType(id))
    return users.map((user) => ({
      status: statusFromString(user.connectionStatus),
      user: user as any
    }))
  }

  async getUserConnection(userId: string, peerId: string): Promise<GQLTypes.Connection.Type> {
    const user = await this.context.sparql.resolve(SparqlConnectionType(userId, peerId))
    const result: GQLTypes.Connection.Type = {
      user: user as any,
      status: statusFromString(user.connectionStatus)
    }
    console.log("RESULT:", result)
    return result
  }

  async getUserEducations(id: string): Promise<GQLTypes.Education.Type[]> {
    const educations = await this.context.sparql.resolve(SparqlEducationsType(id))
    console.log("educations:", educations)
    return educations as any
  }

  async getUserExperiences(id: string): Promise<GQLTypes.Education.Type[]> {
    const experiences = await this.context.sparql.resolve(SparqlExperienceType(id))
    console.log("experiences:", experiences)
    return experiences as any
  }

  async createUser(input: RegisterInput): Promise<User> {
    // userInputSchema.parse(input);

    const [inserted] = await this.db.insert(this.TABLE).values({
      email: input.email,
      password: await hash(input.password, 4)
    }).returning();

    const user: User = {
      id: inserted.id,
      email: inserted.email,
      firstName: input.firstName,
      lastName: input.lastName,
      status: input.status,
      phoneNumber: input.phoneNumber,
      languages: [],
      experiences: [],
      educations: [],
      connections: [],
    };

    await this.createRdfUser(user)

    return user;
  }

  private async createRdfUser(user: User) {
    const queryBuilder = new SparqlFieldBuilder([])
    const deleteBuilder = new SparqlFieldBuilder([])
    const fields = SparqlFieldBuilder.fromFields(
      `user:${ user.id } a lr:User`,
      `lr:hasId "${user.id}"`,
      `lr:hasEmail "${user.email}"`,
      `lr:hasFirstName "${user.firstName}"`,
      `lr:hasLastName "${user.lastName}"`,
      `lr:hasJobSeekingStatus lr:${jobSeekingStatusToUriString(user.status)}`,
      `lr:hasPhoneNumber "${user.phoneNumber}"`
    )
    if (user.location)
      fields.field(`lr:hasLocation "${user.location}"`)
    if (user.webPage)
      fields.field(`lr:hasWebPage "${user.webPage}"`)
    if (user.educations.length > 0) {
    }

    // TODO: Delete these fields before adding them again
    const query = SparqlBuilder.defaultPrefixes()
          .build(
            `INSERT DATA {
              ${fields.build()}
            }`
          )

    await this.context.sparql.update(query)
  }

  public updateUser(input: UserInput) {

  }

  private async updateRdfUser() {

  }

  async createConnection(userId: string, peerId: string): Promise<GQLTypes.Connection.Type> {
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        DELETE {
            user:${userId} lr:knows user:${peerId} .
            user:${userId} lr:hasConnection user:${peerId} .
            user:${userId} lr:hasReceiving user:${peerId} .
            user:${userId} lr:hasPending user:${peerId} .
        }
        INSERT {
            user:${userId} lr:knows user:${peerId} .
        }
        WHERE {
            # This WHERE clause can be used to match the existing triples you want to delete.
            OPTIONAL {
                user:${userId} lr:knows user:${peerId} .
            }
        }
      `))
    return await this.getUserConnection(userId, peerId)
  }
}
