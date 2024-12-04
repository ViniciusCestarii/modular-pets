import { SpecieAlreadyExistsError } from "../errors/specie-alredy-exists";
import { SpeciesRepository } from "../repository";
import { CreateSpecie, Specie } from "../types";

export class CreateSpecieUseCase {
  constructor(private speciesRepository: SpeciesRepository) {}

  async execute(specie: CreateSpecie): Promise<Specie> {
    const existingSpecie = await this.speciesRepository.findSpecieByName(
      specie.name,
    );

    if (existingSpecie) {
      throw new SpecieAlreadyExistsError();
    }

    const createdSpecie = await this.speciesRepository.createSpecie(specie);

    return createdSpecie;
  }
}
