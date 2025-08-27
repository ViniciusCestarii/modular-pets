import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePet } from "../types";
import db from "@/db";
import { breedsTable, petsTable, speciesTable } from "@/db/schema";

describe("Delete pet e2e", () => {
  it("should delete a pet by id", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: breed.id,
    };

    const newPet = (
      await db.insert(petsTable).values(createPet).returning()
    )[0];

    const url = `http://localhost/pet/pets/${newPet.id}`;

    const request = new Request(url, {
      method: "DELETE",
    });

    const response = await app.handle(request);

    expect(response.status).toBe(204);
  });

  it("should return 404 when trying to delete an inexistent pet", async () => {
    const id = "00000000-0000-0000-0000-000000000000";

    const url = `http://localhost/pet/pets/${id}`;

    const request = new Request(url, {
      method: "DELETE",
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("PetNotFoundError");

    expect(response.status).toBe(404);
  });
});
