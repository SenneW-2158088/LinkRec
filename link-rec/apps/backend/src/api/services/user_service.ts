import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid"

import { userTable } from "../../db/schema/userSchema";
import { SparqlBuilder, SparqlFieldBuilder, SparqlParser } from "../sparql/sparql_builder";
import { hash } from "bcrypt";
import { RegisterInput, userInputSchema } from "../../validation/user";
import { UserNotFoundError } from "../errors/user";
import { GQLTypes } from "../../schema/types";
import { jobSeekingStatusToUriString } from "../../schema/types/jobseeking/types";
import { User } from "../../schema/types/user";
import { SparqlConnectionsType, SparqlConnectionType, SparqlEducationsType, SparqlExperienceType, SparqlUserType } from "./types/user";
import { statusFromString, UserInput, UserUpdate } from "../../schema/types/user/types";
import { EducationUpdate } from "../../schema/types/education/types";
import { ExperienceUpdate } from "../../schema/types/experience/types";

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

  public async updateUser(id: string, update: UserUpdate) {
    await this.updateRdfUser(id, update)
    return await this.getUser(id)
  }

  private async updateRdfUser(id: string, update: UserUpdate) {
    console.log("udpate:", update)
    const deleteBuilder = SparqlFieldBuilder.fromFields(`user:${id} a lr:User`);
    const queryBuilder = SparqlFieldBuilder.fromFields(`user:${id} a lr:User`);
    const whereBuilder = SparqlFieldBuilder.fromFields(`user:${id} a lr:User`);

    // Check and build delete and insert fields for each property
    if (update.firstName) {
        deleteBuilder.field(`lr:hasFirstName ?firstName`);
        queryBuilder.field(`lr:hasFirstName "${update.firstName}"`);
        whereBuilder.field(`lr:hasFirstName ?firstName`);
    }

    if (update.lastName) {
        deleteBuilder.field(`lr:hasLastName ?lastName`);
        queryBuilder.field(`lr:hasLastName "${update.lastName}"`);
        whereBuilder.field(`lr:hasLastName ?lastName`);
    }

    if (update.email) {
        deleteBuilder.field(`lr:hasEmail ?email`);
        queryBuilder.field(`lr:hasEmail "${update.email}"`);
        whereBuilder.field(`lr:hasEmail ?email`);
    }

    if (update.phoneNumber) {
        deleteBuilder.field(`lr:hasPhoneNumber ?phoneNumber`);
        queryBuilder.field(`lr:hasPhoneNumber "${update.phoneNumber}"`);
        whereBuilder.field(`lr:hasPhoneNumber ?phoneNumber`);
    }

    if (update.webPage) {
        deleteBuilder.field(`lr:hasWebPage ?webPage`);
        queryBuilder.field(`lr:hasWebPage "${update.webPage}"`);
        whereBuilder.field(`lr:hasWebPage ?webPage`);
    }

    if (update.location) {
        deleteBuilder.field(`lr:hasLocation ?location`);
        queryBuilder.field(`lr:hasLocation "${update.location}"`);
        whereBuilder.field(`lr:hasLocation ?location`);
    }

    if (update.bio) {
        deleteBuilder.field(`lr:hasBio ?bio`); // Assuming lr:hasBio is defined in your ontology
        queryBuilder.field(`lr:hasBio "${update.bio}"`);
        whereBuilder.field(`lr:hasBio ?bio`);
    }

    if (update.status) {
        deleteBuilder.field(`lr:hasJobSeekingStatus ?status`);
        queryBuilder.field(`lr:hasJobSeekingStatus "${update.status}"`); // Assuming status is a string
        whereBuilder.field(`lr:hasJobSeekingStatus ?status`);
    }

    // Build the final SPARQL update query
    const deleteQuery = deleteBuilder.hasFields() ? `DELETE { ${deleteBuilder.build()} }` : '';
    const insertQuery = queryBuilder.hasFields() ? `INSERT { ${queryBuilder.build()} } ` : '';
    const whereQuery = whereBuilder.hasFields() ? `WHERE { ${whereBuilder.build()} }` : '';

    const finalQuery = `${deleteQuery} ${insertQuery} ${whereQuery}`;

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(finalQuery))

    if (update.education) {
      await this.updateEducations(id, update.education)
    }
    if (update.experiences) {
      await this.updateExperiences(id, update.experiences)
    }
    if (update.languages) {
      await this.updateLanguages(id, update.languages)
    }
  }

  private async updateEducations(userId: string, educations: EducationUpdate[]) {
    console.log("querying delete")
    const query = `
      DELETE {
        user:${userId} lr:hasEducation ?education .
        ?education lr:hasInstitution ?institution ;
          lr:hasDegree ?degree ;
          lr:hasTitle ?title ;
          lr:hasInferredTitle ?inferredTitle .
      }
      WHERE  {
        user:${userId} lr:hasEducation ?education .
      }
    `

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(query))

    let fields = ``

    for (const education of educations) {
      const educationId = nanoid()
      fields += `
        user:${userId} lr:hasEducation education:${educationId} .
        education:${educationId} a lr:Education ;
          lr:hasInstitution "${education.institution}" ;
          lr:hasDegree "${education.degree}" ;
          lr:hasTitle "${education.title}" .
      `
    }

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(`INSERT DATA { ${fields} }`))
  }

  private async updateExperiences(userId: string, experiences: ExperienceUpdate[]) {
    const query = `
      DELETE {
        user:${userId} lr:hasExperience ?experience .
        ?experience lr:hasTitle ?title ;
          lr:hasProfession ?profession ;
          lr:hasInferredProfession ?profession ;
          lr:hasDescription ?description ;
          lr:hasCompany ?company .
      }
      WHERE {
        user:${userId} lr:hasExperience ?experience .
        OPTIONAL {
          ?experience lr:hasDescription ?description ;
        }
      }
    `

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(query))

    let fields = ``

    for (const experience of experiences) {
      const experienceId = nanoid()
      fields += `
        user:${userId} lr:hasExperience experience:${experienceId} .
        experience:${experienceId} a lr:Experience;
          lr:hasTitle "${experience.title}" ;
          lr:hasProfession "${experience.profession}" ;
          lr:hasDescription "${experience.description}" ;
          lr:hasCompany "${experience.company}" ;
          lr:hasYears "${experience.years}" .
      `
    }

    console.log("adding experiiences:", fields)

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(`INSERT DATA { ${fields} }`))
  }

  private async updateLanguages(userId: string, languages: string[]) {
    const query = `
      DELETE {
        user:${userId} lr:hasLanguage ?language ;
          lr:hasInferredLanguage ?language .
      }
      WHERE {
        user:${userId} lr:hasLanguage ?language .
      }
    `

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(query))

    let fields = ``

    for (const language of languages) {
      console.log("adding language", language)
      fields += `
        user:${userId} lr:hasLanguage "${language}" .
      `
    }

    await this.context.sparql.update(SparqlBuilder.defaultPrefixes().build(`INSERT DATA { ${fields} }`))
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

  async deleteConnection(userId: string, peerId: string): Promise<GQLTypes.Connection.Type> {
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        DELETE {
            user:${userId} lr:knows user:${peerId} .
            user:${userId} lr:hasConnection user:${peerId} .
            user:${userId} lr:hasPending user:${peerId} .
        }
        WHERE {
            OPTIONAL {
                user:${userId} lr:knows user:${peerId} .
            }
        }
      `))
    return await this.getUserConnection(userId, peerId)
  }
}
