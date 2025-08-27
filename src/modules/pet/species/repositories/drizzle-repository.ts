import db from "@/db";
import { CreateSpecie, Specie, UpdateSpecie } from "../types";
import { SpeciesRepository } from "../repository";
import { speciesTable } from "../specie";
import { eq } from "drizzle-orm";

export class DrizzleSpeciesRepository implements SpeciesRepository {
  async createSpecie(specie: CreateSpecie): Promise<Specie> {
    const rows = await db.insert(speciesTable).values(specie).returning();

    const createdSpecie = rows[0];

    return createdSpecie;
  }

  async updateSpecie(specie: UpdateSpecie): Promise<Specie> {
    const rows = await db
      .update(speciesTable)
      .set(specie)
      .where(eq(speciesTable.id, specie.id))
      .returning();

    const updatedSpecie = rows[0];

    return updatedSpecie;
  }

  async findAll(): Promise<Specie[]> {
    return await db.select().from(speciesTable).orderBy(speciesTable.name);
  }

  async findSpecieById(id: string): Promise<Specie | null> {
    const rows = await db
      .select()
      .from(speciesTable)
      .where(eq(speciesTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findSpecieByName(name: string): Promise<Specie | null> {
    const rows = await db
      .select()
      .from(speciesTable)
      .where(eq(speciesTable.name, name));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async deleteSpecie(id: Specie["id"]): Promise<void> {
    await db.delete(speciesTable).where(eq(speciesTable.id, id));
  }
}
