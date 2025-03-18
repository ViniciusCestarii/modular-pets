import db from "@/db";
import { CreatePet, Pet, PetView } from "../types";
import { PetsRepository } from "../repository";
import { petsTable } from "../pet";
import { eq, sql } from "drizzle-orm";
import { Pagination } from "@/modules/shared/types/pagination";
import { imagesTable } from "@/db/schema";
import { ImageView } from "@/modules/shared/images/types";

export class DrizzlePetsRepository implements PetsRepository {
  async createPet(pet: CreatePet): Promise<PetView> {
    const rows = await db.insert(petsTable).values(pet).returning();

    const createdPet = {
      ...rows[0],
      images: [],
    };

    return createdPet;
  }
  async findPetById(id: string): Promise<PetView | null> {
    const rows = await db
      .select()
      .from(petsTable)
      .leftJoin(imagesTable, eq(imagesTable.ownerId, petsTable.id))
      .where(eq(petsTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    const pet = {
      ...rows[0].pets,
      images: extractImages(rows),
    };

    return pet;
  }
  async listPets({
    page,
    pageSize,
  }: Pagination): Promise<{ pets: PetView[]; total: number }> {
    page--;

    const petsQuery = db
      .select()
      .from(petsTable)
      .leftJoin(imagesTable, eq(imagesTable.ownerId, petsTable.id))
      .orderBy(petsTable.name)
      .limit(pageSize)
      .offset(page * pageSize);

    const totalQuery = db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(petsTable);

    const [rows, [{ count: total }]] = await Promise.all([
      petsQuery,
      totalQuery,
    ]);

    const agreggatedRows = rows.reduce<Record<Pet["id"], PetView>>(
      (acc, row) => {
        const pet = row.pets;
        const image = row.images;
        if (!acc[pet.id]) {
          acc[pet.id] = { ...pet, images: [] };
        }
        if (image) {
          acc[pet.id].images.push({
            id: image.id,
            src: image.src,
          });
        }
        return acc;
      },
      {},
    );

    const pets = Object.values(agreggatedRows);

    return { pets, total };
  }
}

const extractImages = (rows: { images: ImageView | null }[]): ImageView[] =>
  rows.flatMap((row) => {
    if (row.images === null) {
      return [];
    }

    return {
      id: row.images.id,
      src: row.images.src,
    };
  });
