import { SpecieNotFoundError } from "../../shared/errors/specie-not-found";
import { SpeciesRepository } from "../repository";
import { UpdateSpecie, Specie } from "../types";

export class UpdateSpecieUseCase {
  constructor(private speciesRepository: SpeciesRepository) {}

  async execute(specie: UpdateSpecie): Promise<Specie> {
    const existingSpecie = await this.speciesRepository.findSpecieById(
      specie.id,
    );

    if (!existingSpecie) {
      throw new SpecieNotFoundError();
    }

    const updatedSpecie = await this.speciesRepository.updateSpecie(specie);

    return updatedSpecie;
  }
}
