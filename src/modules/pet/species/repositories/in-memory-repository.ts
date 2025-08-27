import { SpeciesRepository } from "../repository";
import { CreateSpecie, Specie, UpdateSpecie } from "../types";

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

  async updateSpecie(specie: UpdateSpecie): Promise<Specie> {
    const index = this.species.findIndex((s) => s.id === specie.id);

    this.species[index] = {
      ...this.species[index],
      ...specie,
    };

    const updatedSpecie = this.species[index];

    return updatedSpecie;
  }

  async findAll(): Promise<Specie[]> {
    return this.species.toSorted((a, b) => a.name.localeCompare(b.name));
  }

  async findSpecieById(id: string): Promise<Specie | null> {
    return this.species.find((specie) => specie.id === id) || null;
  }

  async findSpecieByName(name: string): Promise<Specie | null> {
    return this.species.find((specie) => specie.name === name) || null;
  }

  async deleteSpecie(id: Specie["id"]): Promise<void> {
    this.species = this.species.filter((specie) => specie.id !== id);
  }
}
