import { CreateSpecie, Specie, UpdateSpecie } from "./types";

export interface SpeciesRepository {
  createSpecie(specie: CreateSpecie): Promise<Specie>;
  updateSpecie(specie: UpdateSpecie): Promise<Specie>;
  findAll(): Promise<Specie[]>;
  findSpecieById(id: string): Promise<Specie | null>;
  findSpecieByName(name: string): Promise<Specie | null>;
}
