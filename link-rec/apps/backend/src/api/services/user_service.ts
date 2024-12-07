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
import { JobSeekingStatus, jobSeekingStatusFromString, jobSeekingStatusToString } from "../../schema/types/jobseeking/types";
import { User } from "../../schema/types/user";

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
    const [user] = await this.db
      .select()
      .from(this.TABLE)
      .where(eq(this.TABLE.id, id))
      .limit(1);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    const result = await this.queryRdfUser(user);
    console.log("result:", result)

    return result;
  }

  async createUser(input: RegisterInput): Promise<User> {
    // userInputSchema.parse(input);

    const [inserted] = await this.db.insert(this.TABLE).values({
      email: input.email,
      password: await hash(input.password, 4)
    }).returning();

    // TODO: insert into rdf and refetch + add data to struct

    const user: User = {
      id: inserted.id,
      email: inserted.email,
      firstName: input.firstName,
      lastName: input.lastName,
      status: Status.NOT_LOOKING,
      languages: [],
      experiences: [],
      educations: [],
      connections: [],
    };

    // await this.updateRdfUser(user)

    return user;
  }

  private async queryRdfUser(user: { id: string }) {
    const result = await this.context.sparql.query(SparqlBuilder.defaultPrefixes()
      .build(`
        SELECT ?firstName ?lastName ?email ?phone ?gender ?location ?jobSeekingStatus ?language ?experience ?education ?title ?degree
        WHERE {
          user:JohnDoe2 a lr:User ;
            lr:hasFirstName ?firstName ;
            lr:hasLastName ?lastName ;
            lr:hasEmail ?email .
          user:JohnDoe2 lr:hasJobSeekingStatus ?jobSeekingStatusResource .
          ?jobSeekingStatusResource rdfs:label ?jobSeekingStatus .

          OPTIONAL { user:JohnDoe2 lr:hasPhoneNumber ?phone . }
          OPTIONAL { user:JohnDoe2 lr:hasGender ?gender . }
          OPTIONAL { user:JohnDoe2 lr:hasLocation ?location . }
          OPTIONAL { user:JohnDoe2 lr:hasLanguage ?language . }
          OPTIONAL { user:JohnDoe2 lr:hasExperience ?experience . }
          OPTIONAL {
        		user:JohnDoe2 lr:hasEducation ?education .
        		?education lr:hasDegree ?degree ;
        		lr:hasTitle ?title .
      		}
        }
      `))

    console.log("ASJKLFJKLASDJFL")

    if (result.length === 0) throw Error("No user found")

    const foundUser: User = {
        id: user.id,
        email: "",
        firstName: "",
        lastName: "",
        status: Status.ACTIVELY_LOOKING,
        languages: [],
        educations: [],
        experiences: [],
        connections: [],
    }

    console.log(SparqlParser.create(result)
      .parse())
    for (const row of result) {
      const { firstName, lastName, email, phone, location, jobSeekingStatus, language, experience } = row
      if (!foundUser.firstName) {
        if (firstName.termType === "Literal") {
          foundUser.firstName = firstName.value;
        }
      }

      if (!foundUser.lastName) {
        if (lastName.termType === "Literal") {
          foundUser.lastName = lastName.value;
        }
      }

      if (!foundUser.email) {
        if (email.termType === "Literal") {
          foundUser.email = email.value;
        }
      }

      if (!foundUser.phoneNumber) {
        if (phone.termType === "Literal") {
          foundUser.phoneNumber = phone.value;
        }
      }

      if (!foundUser.location) {
        if (location.termType === "Literal") {
          foundUser.location = location.value;
        }
      }

      if (!foundUser.status) {
        if (jobSeekingStatus.termType === "Literal") {
          foundUser.status = jobSeekingStatusFromString(jobSeekingStatus.value);
        }
      }

      if (language.termType === "Literal") {
        foundUser.languages.push(language.value)
      }

      if (experience.termType === "Literal") {
      }
    }
    return foundUser
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
