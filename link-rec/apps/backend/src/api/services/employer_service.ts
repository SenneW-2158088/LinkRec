import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";

import { Employer, User } from "../../schema/types";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { hash } from "bcrypt";
import { employerTable } from "../../db/schema/employerSchema";
import { Validation } from "../../validation";

export class EmployerService{
  private TABLE = employerTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async create_employer(input: Validation.Employer.Register): Promise<Employer> {

    Validation.Employer.registerSchema.parse(input);

    const [inserted] = await this.db.insert(this.TABLE).values({
      email: input.email,
      password: await hash(input.password, 4)
    }).returning();

    // TODO: insert into rdf and refetch + add data to struct

    const employer: Employer = {
      id: inserted.id,
      email: inserted.email,
      name: "",
      phoneNumber: "",
      jobs: []
    };

    // await this.updateRdfUser(user)
    return employer;
  }

  async updateRdfUser(user: User) {
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        INSERT DATA {
            lr_users:${user.id} a lro:User ;
                       foaf:name "${user.firstName} ${user.lastName}" .
        }
      `))
  }

  async createConnection(user1: User, user2: User) {
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        INSERT DATA {
          lr_users:${user1.id} lro:Connection lr_users:${user2.id} .
        }
      `))
  }
}
