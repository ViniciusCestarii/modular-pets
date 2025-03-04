import { DrizzleBreedsRepository } from "../../breeds/repositories/drizzle-repository";
import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzlePetsRepository } from "../repositories/drizzle-repository";
import { ListPetsUseCase } from "../use-cases/list";

export const makeListPetsUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const drizzleBreedsRepository = new DrizzleBreedsRepository();

  const useCase = new ListPetsUseCase(
    drizzlePetsRepository,
    drizzleSpeciesRepository,
    drizzleBreedsRepository,
  );

  return useCase;
};
