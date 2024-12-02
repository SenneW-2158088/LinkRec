import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";

import { userTable } from "../../db/schema/userSchema";
import { User, UserInput } from "../../schema/types";
import { SparqlBuilder } from "../sparql/sparql_builder";
import { eq } from "drizzle-orm";

export class UserService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async createUser(input: typeof userTable.$inferInsert): Promise<User> {
    const [inserted] = await this.db.insert(this.TABLE).values(input).returning();

    const user: User = {
      ...inserted,
      education: [], // You'll need to handle this separately
      connections: [], // You'll need to handle this separately
    };

    await this.updateRdfUser(user)

    return user;
  }

  async getUserById(id: number): Promise<User | null> {
    this.db.query.users.findFirst({ id: id });
    const user = await this.db.select().from(userTable).find(eq(userTable.id, id))
    return user
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
          linkrec:${user1.id} lro:Connection linkrec:${user2.id} .
        }
      `))
  }
}
