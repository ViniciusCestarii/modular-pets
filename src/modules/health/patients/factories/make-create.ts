import { DrizzlePatientsRepository } from "../repositories/drizzle-repository";
import { CreatePatientUseCase } from "../use-cases/create";

export const makeCreatePatientUseCase = () => {
  const drizzlePatientsRepository = new DrizzlePatientsRepository();

  const useCase = new CreatePatientUseCase(drizzlePatientsRepository);

  return useCase;
};
