import db from "@/db";
import { CreateBreed, Breed, UpdateBreed } from "../types";
import { BreedsRepository } from "../repository";
import { breedsTable } from "../breed";
import { eq } from "drizzle-orm";

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

  async findBreedByName(name: string): Promise<Breed | null> {
    const rows = await db
      .select()
      .from(breedsTable)
      .where(eq(breedsTable.name, name));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
}
