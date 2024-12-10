import { CreatePatient, Patient } from "./types";

export interface PatientsRepository {
  createPatient(patient: CreatePatient): Promise<Patient>;
  findPatientById(id: string): Promise<Patient | null>;
}
