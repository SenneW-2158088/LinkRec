import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { User } from "../../schema/types";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { hash } from "bcrypt";
import { UserInput, userInputSchema } from "../../validation/user";
import { UserNotFoundError } from "../errors/userNotFoundError";

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

    return {
      id: user.id,
      email: user.email,
      firstName: "",
      lastName: "",
      education: [],
      connections: []
    };
  }

  async createUser(input: UserInput): Promise<User> {
    console.log("input, ", input)

    userInputSchema.parse(input);

    const [inserted] = await this.db.insert(this.TABLE).values({
      email: input.email,
      password: await hash(input.password, 4)
    }).returning();

    // TODO: insert into rdf and refetch + add data to struct

    const user: User = {
      id: inserted.id,
      email: inserted.email,
      firstName: "",
      lastName: "",
      education: [],
      connections: [],
    };

    // await this.updateRdfUser(user)

    return user;
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
