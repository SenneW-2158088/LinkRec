import { pgTable, serial, varchar } from "drizzle-orm/pg-core";
import { schema } from ".";

export const userTable = schema.table('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  webPage: varchar('web_page', { length: 255 }),
  location: varchar('location', { length: 255 }),
  bio: varchar('bio', { length: 255 }),
});
