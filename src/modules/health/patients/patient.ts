import { sexEnum } from "@/db/schema";
import { date, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";
import { healthPgSchema } from "../drizzle";

export const patientsTable = healthPgSchema.table("patients", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
  medicalObservations: varchar({ length: 1024 }),
  sex: sexEnum().default("UNKNOWN").notNull(),
  breed: varchar({ length: 255 }).notNull(),
  specie: varchar({ length: 255 }).notNull(),
});
