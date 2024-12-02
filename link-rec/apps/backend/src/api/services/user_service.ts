import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";

import { userTable } from "../../db/schema/userSchema";
import { User, UserInput } from "../../schema/types";

export class UserService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(context: Context) { this.db = context.db.db; }

  async createUser(input: typeof userTable.$inferInsert): Promise<User> {
    const [inserted] = await this.db.insert(this.TABLE).values(input).returning();

    const user: User = {
      ...inserted,
      education: [], // You'll need to handle this separately
      connections: [], // You'll need to handle this separately
    };

    return user;
  }
}
