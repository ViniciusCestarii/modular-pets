import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import db from "@/db";
import { breedsTable, speciesTable } from "@/db/schema";

describe("Create breed e2e", () => {
  it("should create a new breed successfully", async () => {
    const speciesPromises = [
      db
        .insert(speciesTable)
        .values({ name: "Dog" })
        .returning()
        .then((rows) => rows[0]),
      db
        .insert(speciesTable)
        .values({ name: "Cat" })
        .returning()
        .then((rows) => rows[0]),
    ];

    const [dog, cat] = await Promise.all(speciesPromises);

    const breedPromises = [
      db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: dog.id })
        .returning()
        .then((rows) => rows[0]),
      db
        .insert(breedsTable)
        .values({ name: "Labrador Retriever", specieId: dog.id })
        .returning()
        .then((rows) => rows[0]),
      db
        .insert(breedsTable)
        .values({ name: "Maine Coon", specieId: cat.id })
        .returning()
        .then((rows) => rows[0]),
    ];

    const [dogBreed1, dogBreed2, _catBreed] = await Promise.all(breedPromises);

    const request = new Request(
      `http://localhost/pet/species/${dog.id}/breeds`,
      {
        method: "GET",
      },
    );

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toBeArray();
    expect(body.length).toBe(2);
    expect(body[0]).toMatchObject(dogBreed1);
    expect(body[1]).toMatchObject(dogBreed2);

    expect(response.status).toBe(200);
  });

  it("should return 400 when trying to find a breed by an unregistered specie", async () => {
    const request = new Request(
      "http://localhost/pet/species/00000000-0000-0000-0000-000000000000/breeds",
      {
        method: "GET",
      },
    );

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("SpecieNotFoundError");

    expect(response.status).toBe(400);
  });

  it("should return 422 when finding a breed with invalid id", async () => {
    const request = new Request(
      "http://localhost/pet/species/invalid-id/breeds",
      {
        method: "GET",
      },
    );

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(422);
  });
});
