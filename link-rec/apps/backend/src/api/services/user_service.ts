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
import { jobSeekingStatusFromString, jobSeekingStatusToUriString } from "../../schema/types/jobseeking/types";
import { User } from "../../schema/types/user";
import { MatchingJobsType, SparqlConnectionsType, SparqlConnectionType, SparqlEducationsType, SparqlExperienceType, SparqlUserType } from "./types/user";
import { statusFromString, UserInput, UserUpdate } from "../../schema/types/user/types";
import { EducationUpdate } from "../../schema/types/education/types";
import { ExperienceUpdate } from "../../schema/types/experience/types";
import { v4 as UUID } from "uuid";

type User = GQLTypes.User.Type
const Status = GQLTypes.JobSeekingStatus.StatusType

export class UserService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async getUsers() : Promise<User[]> {
    // TODO: SparqlUsersType
    const result = await this.context.sparql.resolve(SparqlUserType("user"))
    return result as any
  }

  async getMatchingJobs(userId: string) {
    const result = await this.context.sparql.resolve(MatchingJobsType(userId))
    return result
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
    return educations as any
  }

  async getUserExperiences(id: string): Promise<GQLTypes.Education.Type[]> {
    const experiences = await this.context.sparql.resolve(SparqlExperienceType(id))
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
      location: input.location,
      languages: [],
      experiences: [],
      educations: [],
      connections: [],
    };

    await this.createRdfUser(user)

    return user;
  }

  private async createRdfUser(user: User) {
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
    const deleteBuilder = SparqlFieldBuilder.fromFields().setSeparator(". \n");
    const queryBuilder = SparqlFieldBuilder.fromFields().setSeparator(". \n");
    const whereBuilder = SparqlFieldBuilder.fromFields().setSeparator(". \n");

    deleteBuilder.field(`user:${id} lr:matchesRequirement ?requirement`);
    whereBuilder.field(`OPTIONAL { user:${id} lr:matchesRequirement ?requirement }`);
    deleteBuilder.field(`user:${id} lr:matchesLanguage ?requirement`);
    whereBuilder.field(`OPTIONAL { user:${id} lr:matchesLanguage ?requirement }`);
    deleteBuilder.field(`user:${id} lr:matchesLocation ?requirement`);
    whereBuilder.field(`OPTIONAL { user:${id} lr:matchesLocation ?requirement }`);
    deleteBuilder.field(`user:${id} lr:matchesEducation ?requirement`);
    whereBuilder.field(`OPTIONAL { user:${id} lr:matchesEducation ?requirement }`);
    deleteBuilder.field(`user:${id} lr:matchesProfession ?requirement`);
    whereBuilder.field(`OPTIONAL { user:${id} lr:matchesProfession ?requirement }`);

    // Check and build delete and insert fields for each property
    if (update.firstName) {
        deleteBuilder.field(`user:${id} lr:hasFirstName ?firstName`);
        queryBuilder.field(`user:${id} lr:hasFirstName "${update.firstName}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasFirstName ?firstName }`);
    }

    if (update.lastName) {
        deleteBuilder.field(`user:${id} lr:hasLastName ?lastName`);
        queryBuilder.field(`user:${id} lr:hasLastName "${update.lastName}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasLastName ?lastName }`);
    }

    if (update.email) {
        deleteBuilder.field(`user:${id} lr:hasEmail ?email`);
        queryBuilder.field(`user:${id} lr:hasEmail "${update.email}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasEmail ?emai }l`)
    }

    if (update.phoneNumber) {
        deleteBuilder.field(`user:${id} lr:hasPhoneNumber ?phoneNumber`);
        queryBuilder.field(`user:${id} lr:hasPhoneNumber "${update.phoneNumber}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasPhoneNumber ?phoneNumber }`);
    }

    if (update.webPage) {
        deleteBuilder.field(`user:${id} lr:hasWebPage ?webPage`);
        queryBuilder.field(`user:${id} lr:hasWebPage "${update.webPage}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasWebPage ?webPage }`);
    }

    if (update.location) {
        deleteBuilder.field(`user:${id} lr:hasLocation ?location`);
        deleteBuilder.field(`user:${id} lr:hasInferredLocation ?inferredLocation`);
        queryBuilder.field(`user:${id} lr:hasLocation "${update.location}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasLocation ?location }`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasInferredLocation ?inferredLocation }`);
    }

    if (update.bio) {
        deleteBuilder.field(`user:${id} lr:hasBio ?bio`); // Assuming lr:hasBio is defined in your ontology
        queryBuilder.field(`user:${id} lr:hasBio "${update.bio}"`);
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasBio ?bio }`);
    }

    if (update.status) {
        deleteBuilder.field(`user:${id} lr:hasJobSeekingStatus ?status`);
        queryBuilder.field(`user:${id} lr:hasJobSeekingStatus lr:${jobSeekingStatusToUriString(jobSeekingStatusFromString(update.status))}`); // Assuming status is a string
        whereBuilder.field(`OPTIONAL { user:${id} lr:hasJobSeekingStatus ?status }`);
    }

    // Build the final SPARQL update query
    const deleteQuery = deleteBuilder.hasFields() ? `DELETE { ${deleteBuilder.build()} } ` : '';
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
      const educationId = UUID()
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
          lr:hasYears ?years ;
          lr:hasExperienceLevel ?experienceLevel ;
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
      const experienceId = UUID()
      fields += `
        user:${userId} lr:hasExperience experience:${experienceId} .
        experience:${experienceId} a lr:Experience;
          lr:hasTitle "${experience.title}" ;
          lr:hasProfession "${experience.profession}" ;
          lr:hasDescription "${experience.description}" ;
          lr:hasCompany "${experience.company}" ;
          lr:hasYears ${experience.years} .
      `
    }


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
