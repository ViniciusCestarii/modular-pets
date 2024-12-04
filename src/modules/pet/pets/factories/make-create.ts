import { DrizzleBreedsRepository } from "../../breeds/repositories/drizzle-repository";
import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzlePetsRepository } from "../repositories/drizzle-repository";
import { CreatePetUseCase } from "../use-cases/create";

export const makeCreatePetUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const drizzleBreedsRepository = new DrizzleBreedsRepository();

  const useCase = new CreatePetUseCase(
    drizzlePetsRepository,
    drizzleSpeciesRepository,
    drizzleBreedsRepository,
  );

  return useCase;
};
