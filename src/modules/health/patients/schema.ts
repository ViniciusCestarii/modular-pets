import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { patientsTable } from "./patient";

export const patientSchema = createSelectSchema(patientsTable);

export const createPatientSchema = createInsertSchema(patientsTable);
