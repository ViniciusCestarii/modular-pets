import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzleBreedsRepository } from "../repositories/drizzle-repository";
import { CreateBreedUseCase } from "../use-cases/create";

export const makeCreateBreedUseCase = () => {
  const drizzleBreedsRepository = new DrizzleBreedsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new CreateBreedUseCase(
    drizzleBreedsRepository,
    drizzleSpeciesRepository,
  );

  return useCase;
};
