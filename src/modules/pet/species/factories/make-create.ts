import { DrizzleSpeciesRepository } from "../repositories/drizzle-repository";
import { CreateSpecieUseCase } from "../use-cases/create";

export const makeCreateSpecieUseCase = () => {
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new CreateSpecieUseCase(drizzleSpeciesRepository);

  return useCase;
};
