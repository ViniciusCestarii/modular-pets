import { SpeciesRepository } from "../repository";
import { Specie } from "../types";

export class FindAllSpecieUseCase {
  constructor(private speciesRepository: SpeciesRepository) {}

  async execute(): Promise<Specie[]> {
    const species = await this.speciesRepository.findAll();

    return species;
  }
}
