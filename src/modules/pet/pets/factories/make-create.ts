import { DrizzlePetsRepository } from "@/modules/pet/pets/repositories/drizzle-repository";
import { CreatePetUseCase } from "../use-cases/create";

export const makeCreatePetUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const useCase = new CreatePetUseCase(drizzlePetsRepository);

  return useCase;
};
