import { DrizzlePetsRepository } from "@/modules/pet/repositories/drizzle/drizzle-pets-repository";
import { CreatePetUseCase } from "../create-pet";

export const makeCreatePetUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const useCase = new CreatePetUseCase(drizzlePetsRepository);

  return useCase;
};
