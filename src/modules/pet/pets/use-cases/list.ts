import { Pagination } from "@/modules/shared/types/pagination";
import { BreedsRepository } from "../../breeds/repository";
import { SpeciesRepository } from "../../species/repository";
import { PetsRepository } from "../repository";
import { Pet } from "../types";

export class ListPetsUseCase {
  constructor(
    private petsRepository: PetsRepository,
    // on the future I will add filters to list pets by species and breed
    private speciesRepository: SpeciesRepository,
    private breedsRepository: BreedsRepository,
  ) {}

  async execute(filter: Pagination): Promise<Pet[]> {
    const pets = await this.petsRepository.listPets(filter);

    return pets;
  }
}
