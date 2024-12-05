import { text, varchar, uuid } from "drizzle-orm/pg-core";
import { schema } from ".";

export const userTable = schema.table('users', {
  id: uuid("id")
      .primaryKey()
      .defaultRandom(),
  email: varchar('email', { length: 320 })  // Max email length per RFC 5321
      .notNull()
      .unique(),
  password: varchar('password', { length: 72 })  // bcrypt's max input length
    .notNull()
});

// firstName: varchar('first_name', { length: 255 }).notNull(),
// lastName: varchar('last_name', { length: 255 }).notNull(),
// phoneNumber: varchar('phone_number', { length: 20 }),
// webPage: varchar('web_page', { length: 255 }),
// location: varchar('location', { length: 255 }),
// bio: varchar('bio', { length: 255 }),
