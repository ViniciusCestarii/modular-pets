import { CreateSpecie, Specie } from "./types";

export interface SpeciesRepository {
  createSpecie(specie: CreateSpecie): Promise<Specie>;
  findSpecieById(id: string): Promise<Specie | null>;
  findSpecieByName(name: string): Promise<Specie | null>;
}
