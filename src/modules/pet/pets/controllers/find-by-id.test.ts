import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePet } from "../types";
import db from "@/db";
import { breedsTable, petsTable, speciesTable } from "@/db/schema";

describe("Find pet by id e2e", () => {
  it("should find pet by id", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", speciesId: specie.id })
        .returning()
    )[0];

    const createPet: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      speciesId: specie.id,
      breedId: breed.id,
    };

    const newPet = (
      await db.insert(petsTable).values(createPet).returning()
    )[0];

    const url = `http://localhost/pet/pets/${newPet.id}`;

    const request = new Request(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toMatchObject({
      id: newPet.id,
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      speciesId: specie.id,
      breedId: breed.id,
    });

    expect(response.status).toBe(200);
  });

  it("should return 404 when trying to find an inexistent pet", async () => {
    const id = "00000000-0000-0000-0000-000000000000";

    const url = `http://localhost/pet/pets/${id}`;

    const request = new Request(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("PetNotFoundError");

    expect(response.status).toBe(404);
  });
});
