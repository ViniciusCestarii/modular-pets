import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../repository";
import { Specie } from "../types";

export class DeleteSpecieUseCase {
  constructor(private speciesRepository: SpeciesRepository) {}

  async execute(specieId: Specie["id"]): Promise<void> {
    const specie = await this.speciesRepository.findSpecieById(specieId);

    if (!specie) {
      throw new SpecieNotFoundError();
    }

    await this.speciesRepository.deleteSpecie(specieId);
  }
}
