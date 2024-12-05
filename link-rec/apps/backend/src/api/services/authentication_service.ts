import { uuid } from "drizzle-orm/pg-core";
import { Context } from "..";
import { Database } from "../../db/database";
import { eq } from "drizzle-orm";

import { userTable } from "../../db/schema/userSchema";
import { User, UserInput } from "../../schema/types";
import { compare, hash } from "bcrypt";
import { log } from "console";

export class AuthenticationService{
  private TABLE = userTable
  private db: Database["db"]

  constructor(private context: Context) { this.db = context.db.db; }

  async login(email: string, password: string): Promise<User> {

    const [user] = await this.db
      .select()
      .from(this.TABLE)
      .where(eq(this.TABLE.email, email))
      .limit(1);

    if (!user) {
      console.log("no user found")
      throw new Error("No user found");
    }

    if(!await compare(password, user.password)){
      console.log("invalid password")
      throw new Error("invalid password");
    }

    return {
      ...user,
      firstName: "empy",
      lastName: "empty",
      education: [], // Fetch education if needed
      connections: [] // Fetch connections if needed
    };
  }
}
