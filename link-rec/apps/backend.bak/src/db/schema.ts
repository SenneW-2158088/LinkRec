import { integer, pgTable, serial, varchar } from "drizzle-orm/pg-core";

export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phoneNumber: varchar('phone_number', { length: 20 }),
  webPage: varchar('web_page', { length: 255 }),
  location: varchar('location', { length: 255 }),
});
