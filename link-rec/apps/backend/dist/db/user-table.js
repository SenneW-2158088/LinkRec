"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTable = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userTable = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)('email', { length: 255 }).notNull().unique(),
    phoneNumber: (0, pg_core_1.varchar)('phone_number', { length: 20 }),
    webPage: (0, pg_core_1.varchar)('web_page', { length: 255 }),
    location: (0, pg_core_1.varchar)('location', { length: 255 }),
});
