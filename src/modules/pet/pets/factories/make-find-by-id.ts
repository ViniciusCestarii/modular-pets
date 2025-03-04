import { DrizzlePetsRepository } from "../repositories/drizzle-repository";
import { FindPetByIdUseCase } from "../use-cases/find-by-id";

export const makeFindPetByIdUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();

  const useCase = new FindPetByIdUseCase(drizzlePetsRepository);

  return useCase;
};
