import { DrizzleSpeciesRepository } from "../repositories/drizzle-repository";
import { UpdateSpecieUseCase } from "../use-cases/update";

export const makeUpdateSpecieUseCase = () => {
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new UpdateSpecieUseCase(drizzleSpeciesRepository);

  return useCase;
};
