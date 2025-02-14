import { Static } from "elysia";
import { createPatientSchema } from "./schema";
import { InferSelectModel } from "drizzle-orm";
import { patientsTable } from "./patient";

export type Patient = InferSelectModel<typeof patientsTable>;

export type CreatePatient = Static<typeof createPatientSchema>;
