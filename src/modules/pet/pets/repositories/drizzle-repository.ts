import db from "@/db";
import { CreatePet, ListPets, Pet, PetView, UpdatePet } from "../types";
import { PetsRepository } from "../repository";
import { petsTable } from "../pet";
import { and, eq, gte, ilike, lte, sql } from "drizzle-orm";
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
        .where(eq(speciesTable.id, createdPet.specieId))
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
      .leftJoin(speciesTable, eq(speciesTable.id, petsTable.specieId))
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

  updatePet(pet: UpdatePet): Promise<PetView> {
    return db.transaction(async (tx) => {
      const rows = await tx
        .update(petsTable)
        .set(pet)
        .where(eq(petsTable.id, pet.id))
        .returning();

      const updatedPet = rows[0];

      const breed = (
        await tx
          .select()
          .from(breedsTable)
          .where(eq(breedsTable.id, updatedPet.breedId))
      )[0];
      const specie = (
        await tx
          .select()
          .from(speciesTable)
          .where(eq(speciesTable.id, updatedPet.specieId))
      )[0];

      const images = await tx
        .select()
        .from(imagesTable)
        .where(eq(imagesTable.ownerId, updatedPet.id));

      return {
        ...updatedPet,
        breed,
        specie,
        images: images.map((image) => ({
          id: image.id,
          src: image.src,
        })),
      };
    });
  }

  async listPets({
    page,
    pageSize,
    maxBirthdate,
    minBirthdate,
    name,
    breedId,
    specieId,
    sex,
    status,
  }: ListPets): Promise<{ pets: PetView[]; total: number }> {
    page--;

    const filterQueries = [];

    if (name) {
      filterQueries.push(ilike(petsTable.name, `%${name}%`));
    }

    if (minBirthdate) {
      filterQueries.push(gte(petsTable.birthdate, minBirthdate));
    }

    if (maxBirthdate) {
      filterQueries.push(lte(petsTable.birthdate, maxBirthdate));
    }

    if (breedId) {
      filterQueries.push(eq(petsTable.breedId, breedId));
    }

    if (specieId) {
      filterQueries.push(eq(petsTable.specieId, specieId));
    }

    if (sex) {
      filterQueries.push(eq(petsTable.sex, sex));
    }

    if (status) {
      filterQueries.push(eq(petsTable.status, status));
    }

    const petsQuery = db
      .select()
      .from(petsTable)
      .leftJoin(imagesTable, eq(imagesTable.ownerId, petsTable.id))
      .leftJoin(breedsTable, eq(breedsTable.id, petsTable.breedId))
      .leftJoin(speciesTable, eq(speciesTable.id, petsTable.specieId))
      .where(and(...filterQueries))
      .orderBy(petsTable.name)
      .limit(pageSize)
      .offset(page * pageSize);
    const totalQuery = db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(petsTable)
      .where(and(...filterQueries));

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

  deletePet(petId: Pet["id"]): Promise<void> {
    return db.transaction(async (tx) => {
      await tx
        .delete(imagesTable)
        .where(
          and(eq(imagesTable.ownerId, petId), eq(imagesTable.ownerType, "pet")),
        );
      await tx.delete(petsTable).where(eq(petsTable.id, petId));
    });
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
