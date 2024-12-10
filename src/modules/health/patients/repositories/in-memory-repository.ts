import { PatientsRepository } from "../repository";
import { CreatePatient, Patient } from "../types";

export class InMemoryPatientsRepository implements PatientsRepository {
  private patients: Patient[] = [];
  private idCounter = 1;

  async createPatient(patient: CreatePatient): Promise<Patient> {
    const newPatient: Patient = {
      id: this.idCounter.toString(),
      ...patient,
      medicalObservations: patient.medicalObservations ?? null,
      sex: patient.sex ?? "UNKNOWN",
    };
    this.patients.push(newPatient);
    this.idCounter++;
    return newPatient;
  }

  async findPatientById(id: string): Promise<Patient | null> {
    return this.patients.find((patient) => patient.id === id) || null;
  }
}
