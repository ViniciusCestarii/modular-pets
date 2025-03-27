import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../../species/repository";
import { BreedsRepository } from "../repository";
import { Breed } from "../types";

export class FindAllBreedsBySpecieUseCase {
  constructor(
    private breedsRepository: BreedsRepository,
    private speciesRepository: SpeciesRepository,
  ) {}

  async execute(specieId: string): Promise<Breed[]> {
    const specie = await this.speciesRepository.findSpecieById(specieId);

    if (!specie) {
      throw new SpecieNotFoundError();
    }

    const breeds =
      await this.breedsRepository.findAllBreedsByspecieId(specieId);

    return breeds;
  }
}
