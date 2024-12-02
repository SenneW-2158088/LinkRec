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
    const [inserted] = await this.db.insert(this.TABLE).values(input).returning();

    const user: User = {
      ...inserted,
      education: [], // You'll need to handle this separately
      connections: [], // You'll need to handle this separately
    };

    this.context.sparql.update(SparqlBuilder.defaultPrefixes()
      .build(`
        INSERT DATA {
            users:${inserted.id} a lro:User ;
                       foaf:name "${input.firstName} ${input.lastName}" .
        }
      `))

    return user;
  }

  async createConnection() {
    SparqlBuilder.defaultPrefixes()
      .build(`

      `)
  }
}
