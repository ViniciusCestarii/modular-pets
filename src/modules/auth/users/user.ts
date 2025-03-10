import { date, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { authPgSchema } from "../drizzle";

export const usersTable = authPgSchema.table("users", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
});
