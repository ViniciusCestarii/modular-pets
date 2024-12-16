import { sexEnum } from "@/db/schema";
import { date, pgSchema, uuid, varchar } from "drizzle-orm/pg-core";
import { v7 } from "uuid";

export const healthSchema = pgSchema("health");

export const patientsTable = healthSchema.table("patients", {
  id: uuid().primaryKey().$defaultFn(v7),
  name: varchar({ length: 255 }).notNull(),
  birthdate: date().notNull(),
  medicalObservations: varchar({ length: 1024 }),
  sex: sexEnum().default("UNKNOWN").notNull(),
  breed: varchar({ length: 255 }).notNull(),
  specie: varchar({ length: 255 }).notNull(),
});
