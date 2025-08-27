import { DrizzleSpeciesRepository } from "../repositories/drizzle-repository";
import { DeleteSpecieUseCase } from "../use-cases/delete";

export const makeDeleteSpecieUseCase = () => {
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const useCase = new DeleteSpecieUseCase(drizzleSpeciesRepository);

  return useCase;
};
