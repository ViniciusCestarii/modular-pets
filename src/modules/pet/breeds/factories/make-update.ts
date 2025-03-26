import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzleBreedsRepository } from "../repositories/drizzle-repository";
import { UpdateBreedUseCase } from "../use-cases/update";

export const makeUpdateBreedUseCase = () => {
  const drizzleBreedsRepository = new DrizzleBreedsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new UpdateBreedUseCase(
    drizzleBreedsRepository,
    drizzleSpeciesRepository,
  );

  return useCase;
};
