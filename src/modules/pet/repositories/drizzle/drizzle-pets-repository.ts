import db from "@/db";
import { CreatePet, Pet } from "../../types/pets-types";
import { PetsRepository } from "../pets-repository";
import { petsTable } from "@/db/schema";

export class DrizzlePetsRepository implements PetsRepository {
  async createPet(pet: CreatePet): Promise<Pet> {
    const rows = await db.insert(petsTable).values(pet).returning();

    const createdPet = rows[0];

    return createdPet;
  }
}
