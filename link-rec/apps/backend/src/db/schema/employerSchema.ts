import { uuid, varchar } from "drizzle-orm/pg-core";
import { schema } from ".";

export const employerTable = schema.table('employers', {
  id: uuid("id")
      .primaryKey()
      .defaultRandom(),
  email: varchar('email', { length: 320 })  // Max email length per RFC 5321
      .notNull()
      .unique(),
  password: varchar('password', { length: 72 })  // bcrypt's max input length
    .notNull()
});
