import { DrizzleBreedsRepository } from "../repositories/drizzle-repository";
import { CreateBreedUseCase } from "../use-cases/create";

export const makeCreateBreedUseCase = () => {
  const drizzleBreedsRepository = new DrizzleBreedsRepository();
  const useCase = new CreateBreedUseCase(drizzleBreedsRepository);

  return useCase;
};
