import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePet } from "../types";
import db from "@/db";
import { breedsTable, speciesTable } from "@/db/schema";
import { bearerToken } from "@/test";

describe("Create pet e2e", () => {
  it("should create a new pet successfully", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const data: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      specieId: specie.id,
      breedId: breed.id,
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: breed.id,
      breed,
      specie,
    });

    expect(response.status).toBe(201);
  });

  it("should return 400 when trying to create a pet with unregistered specie", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const data: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284", // Unregistered specie
      breedId: breed.id,
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("SpecieNotFoundError");

    expect(response.status).toBe(400);
  });

  it("should return 400 when trying to create a pet with unregistered breed", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const data: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284", // Unregistered breed
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("BreedNotFoundError");

    expect(response.status).toBe(400);
  });

  it("should return 400 when trying to create a pet with non-matching specie id and breed.specieId", async () => {
    const specieDog = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const specieCat = (
      await db.insert(speciesTable).values({ name: "Cat" }).returning()
    )[0];

    const catBreed = (
      await db
        .insert(breedsTable)
        .values({ name: "Siamese", specieId: specieCat.id })
        .returning()
    )[0];

    const data: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specieDog.id,
      breedId: catBreed.id,
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("InvalidBreedSpecieError");

    expect(response.status).toBe(400);
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/pet/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(422);
  });

  it("should return 401 trying being Unauthorized", async () => {
    const data: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      observations: "She's a very playful dog",
      specieId: "00000000-0000-0000-0000-000000000000",
      breedId: "00000000-0000-0000-0000-000000000000",
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("Unauthorized");

    expect(response.status).toBe(401);
  });
});
