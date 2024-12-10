import { Static } from "elysia";
import { createPatientSchema, patientSchema } from "./schema";

export type Patient = Static<typeof patientSchema>;

export type CreatePatient = Static<typeof createPatientSchema>;
