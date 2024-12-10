import { PatientsRepository } from "../repository";
import { CreatePatient, Patient } from "../types";

export class CreatePatientUseCase {
  constructor(private patientsRepository: PatientsRepository) {}

  async execute(patient: CreatePatient): Promise<Patient> {
    const createdPatient = await this.patientsRepository.createPatient(patient);

    return createdPatient;
  }
}
