import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzleBreedsRepository } from "../repositories/drizzle-repository";
import { DeleteBreedUseCase } from "../use-cases/delete";

export const makeDeleteBreedUseCase = () => {
  const drizzleBreedsRepository = new DrizzleBreedsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new DeleteBreedUseCase(
    drizzleBreedsRepository,
    drizzleSpeciesRepository,
  );

  return useCase;
};
