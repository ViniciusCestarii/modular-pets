import { DrizzleSpeciesRepository } from "../repositories/drizzle-repository";
import { FindAllSpecieUseCase } from "../use-cases/find-all";

export const makeFindAllSpecieUseCase = () => {
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new FindAllSpecieUseCase(drizzleSpeciesRepository);

  return useCase;
};
