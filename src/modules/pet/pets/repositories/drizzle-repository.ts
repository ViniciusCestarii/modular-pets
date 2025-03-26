import db from "@/db";
import { CreatePet, Pet, PetView } from "../types";
import { PetsRepository } from "../repository";
import { petsTable } from "../pet";
import { eq, sql } from "drizzle-orm";
import { Pagination } from "@/modules/shared/types/pagination";
import { breedsTable, imagesTable, speciesTable } from "@/db/schema";
import { ImageView } from "@/modules/shared/images/types";

export class DrizzlePetsRepository implements PetsRepository {
  async createPet(pet: CreatePet): Promise<PetView> {
    const rows = await db.insert(petsTable).values(pet).returning();

    const createdPet = rows[0];

    const breed = (
      await db
        .select()
        .from(breedsTable)
        .where(eq(breedsTable.id, createdPet.breedId))
    )[0];
    const specie = (
      await db
        .select()
        .from(speciesTable)
        .where(eq(speciesTable.id, createdPet.speciesId))
    )[0];

    return {
      ...createdPet,
      breed,
      specie,
      images: [],
    };
  }
  async findPetById(id: string): Promise<PetView | null> {
    const rows = await db
      .select()
      .from(petsTable)
      .leftJoin(imagesTable, eq(imagesTable.ownerId, petsTable.id))
      .leftJoin(breedsTable, eq(breedsTable.id, petsTable.breedId))
      .leftJoin(speciesTable, eq(speciesTable.id, petsTable.speciesId))
      .where(eq(petsTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    const pet = {
      ...rows[0].pets,
      images: extractImages(rows),
      breed: rows[0].breeds,
      specie: rows[0].species,
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
      .leftJoin(breedsTable, eq(breedsTable.id, petsTable.breedId))
      .leftJoin(speciesTable, eq(speciesTable.id, petsTable.speciesId))
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
          acc[pet.id] = {
            ...pet,
            images: [],
            breed: row.breeds,
            specie: row.species,
          };
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
