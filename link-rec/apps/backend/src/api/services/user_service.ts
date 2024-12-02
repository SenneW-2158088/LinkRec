import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { User, UserInput } from "../../schema/types";
import { SparqlBuilder } from "../sparql/sparql_builder";

export class UserService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async getUser(id: number): Promise<User | null> {
    const [user] = await this.db
      .select()
      .from(this.TABLE)
      .where(eq(this.TABLE.id, id))
      .limit(1);

    if (!user) {
      return null;
    }

    return {
      ...user,
      education: [], // Fetch education if needed
      connections: [] // Fetch connections if needed
    };
  }

  async createUser(input: UserInput): Promise<User> {
    console.log("input, ", input)
    const [inserted] = await this.db.insert(this.TABLE).values(input).returning();



    const user: User = {
      ...inserted,
      education: [], // You'll need to handle this separately
      connections: [], // You'll need to handle this separately
    };

    await this.updateRdfUser(user)

    return user;
  }

  async updateRdfUser(user: User) {
    await this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        INSERT DATA {
            ${user.id} a lro:User .
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
