import db from "@/db";
import { CreatePatient, Patient } from "../types";
import { PatientsRepository } from "../repository";
import { patientsTable } from "../patient";
import { eq } from "drizzle-orm";

export class DrizzlePatientsRepository implements PatientsRepository {
  async createPatient(patient: CreatePatient): Promise<Patient> {
    const rows = await db.insert(patientsTable).values(patient).returning();

    const createdPatient = rows[0];

    return createdPatient;
  }
  async findPatientById(id: string): Promise<Patient | null> {
    const rows = await db
      .select()
      .from(patientsTable)
      .where(eq(patientsTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
