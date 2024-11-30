import db from "@/db";
import { CreatePet, Pet } from "../../types/pets-types";
import { PetsRepository } from "../pets-repository";
import { petsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

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
}
