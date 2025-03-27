import db from "@/db";
import { CreateBreed, Breed, UpdateBreed } from "../types";
import { BreedsRepository } from "../repository";
import { breedsTable } from "../breed";
import { and, eq } from "drizzle-orm";

export class DrizzleBreedsRepository implements BreedsRepository {
  async createBreed(breed: CreateBreed): Promise<Breed> {
    const rows = await db.insert(breedsTable).values(breed).returning();

    const createdBreed = rows[0];

    return createdBreed;
  }

  async updateBreed(breed: UpdateBreed): Promise<Breed> {
    const rows = await db
      .update(breedsTable)
      .set(breed)
      .where(eq(breedsTable.id, breed.id))
      .returning();

    const updatedBreed = rows[0];

    return updatedBreed;
  }

  async findAllBreedsBySpeciesId(speciesId: string): Promise<Breed[]> {
    return await db
      .select()
      .from(breedsTable)
      .where(eq(breedsTable.speciesId, speciesId))
      .orderBy(breedsTable.name);
  }

  async findBreedById(id: string): Promise<Breed | null> {
    const rows = await db
      .select()
      .from(breedsTable)
      .where(eq(breedsTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findBreedByNameAndSpecieId(
    name: string,
    specieId: string,
  ): Promise<Breed | null> {
    const rows = await db
      .select()
      .from(breedsTable)
      .where(
        and(eq(breedsTable.name, name), eq(breedsTable.speciesId, specieId)),
      );

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
