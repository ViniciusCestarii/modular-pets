import { DrizzleBreedsRepository } from "../../breeds/repositories/drizzle-repository";
import { DrizzleSpeciesRepository } from "../../species/repositories/drizzle-repository";
import { DrizzlePetsRepository } from "../repositories/drizzle-repository";
import { UpdatePetUseCase } from "../use-cases/update";

export const makeUpdatePetUseCase = () => {
  const drizzlePetsRepository = new DrizzlePetsRepository();
  const drizzleSpeciesRepository = new DrizzleSpeciesRepository();
  const drizzleBreedsRepository = new DrizzleBreedsRepository();

  const useCase = new UpdatePetUseCase(
    drizzlePetsRepository,
    drizzleSpeciesRepository,
    drizzleBreedsRepository,
  );

  return useCase;
};
