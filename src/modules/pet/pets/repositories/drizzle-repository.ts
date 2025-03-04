import db from "@/db";
import { CreatePet, Pet } from "../types";
import { PetsRepository } from "../repository";
import { petsTable } from "../pet";
import { eq, sql } from "drizzle-orm";
import { Pagination } from "@/modules/shared/types/pagination";

export class DrizzlePetsRepository implements PetsRepository {
  async createPet(pet: CreatePet): Promise<Pet> {
    const rows = await db.insert(petsTable).values(pet).returning();

    const createdPet = rows[0];

    return createdPet;
  }
  async findPetById(id: string): Promise<Pet | null> {
    const rows = await db.select().from(petsTable).where(eq(petsTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }
  async listPets({
    page,
    pageSize,
  }: Pagination): Promise<{ pets: Pet[]; total: number }> {
    page--;

    const petsQuery = db
      .select()
      .from(petsTable)
      .orderBy(petsTable.name)
      .limit(pageSize)
      .offset(page * pageSize);

    const totalQuery = db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(petsTable);

    const [pets, [{ count: total }]] = await Promise.all([
      petsQuery,
      totalQuery,
    ]);

    return { pets, total };
  }
}
