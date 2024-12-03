import { SpeciesRepository } from "../repository";
import { CreateSpecie, Specie } from "../types";

export class InMemorySpeciesRepository implements SpeciesRepository {
  private species: Specie[] = [];
  private idCounter = 1;

  async createSpecie(specie: CreateSpecie): Promise<Specie> {
    const newSpecie: Specie = {
      id: this.idCounter.toString(),
      ...specie,
    };
    this.species.push(newSpecie);
    this.idCounter++;
    return newSpecie;
  }

  async findSpecieById(id: string): Promise<Specie | null> {
    return this.species.find((specie) => specie.id === id) || null;
  }

  async findSpecieByName(name: string): Promise<Specie | null> {
    return this.species.find((specie) => specie.name === name) || null;
  }
}
