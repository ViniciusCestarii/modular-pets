import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzleBreedsRepository } from "../repositories/drizzle-repository";
import { FindAllBreedsBySpecieUseCase } from "../use-cases/find-all-by-specie";

export const makeFindAllBreedsBySpecieUseCase = () => {
  const drizzleBreedsRepository = new DrizzleBreedsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new FindAllBreedsBySpecieUseCase(
    drizzleBreedsRepository,
    drizzleSpeciesRepository,
  );

  return useCase;
};
