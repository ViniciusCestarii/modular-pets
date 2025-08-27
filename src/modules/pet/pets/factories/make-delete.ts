import { DrizzlePetsRepository } from "../repositories/drizzle-repository";
import { DeletePetUseCase } from "../use-cases/delete";

export const makeDeletePetUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();

  const useCase = new DeletePetUseCase(drizzlePetsRepository);

  return useCase;
};
