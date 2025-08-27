import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { UpdatePet } from "../types";
import db from "@/db";
import { breedsTable, speciesTable, petsTable } from "@/db/schema";
import { bearerToken } from "@/test";

describe("Update pet e2e", () => {
  it("should update an existing pet successfully", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const pet = (
      await db
        .insert(petsTable)
        .values({
          name: "Nina",
          birthdate: "2021-01-01",
          sex: "FEMALE",
          specieId: specie.id,
          breedId: breed.id,
        })
        .returning()
    )[0];

    const data: UpdatePet = {
      ...pet,
      mainImageId: pet.mainImageId ?? undefined,
      name: "Nina Updated",
      observations: "Now calmer",
    };

    const request = new Request(`http://localhost/pet/pets`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);
    const body = await response.json();

    expect(body).toMatchObject({
      id: pet.id,
      name: "Nina Updated",
      observations: "Now calmer",
    });

    expect(response.status).toBe(200);
  });

  it("should return 400 when updating with unregistered specie", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const pet = (
      await db
        .insert(petsTable)
        .values({
          name: "Nina",
          birthdate: "2021-01-01",
          sex: "FEMALE",
          specieId: specie.id,
          breedId: breed.id,
        })
        .returning()
    )[0];

    const data: UpdatePet = {
      ...pet,
      mainImageId: pet.mainImageId ?? undefined,
      observations: pet.observations ?? undefined,
      specieId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284", // unregistered specie
    };

    const request = new Request(`http://localhost/pet/pets`, {
      method: "PUT",
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

  it("should return 400 when updating with unregistered breed", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "Dog", specieId: specie.id })
        .returning()
    )[0];

    const pet = (
      await db
        .insert(petsTable)
        .values({
          name: "Nina",
          birthdate: "2021-01-01",
          sex: "FEMALE",
          breedId: breed.id,
          specieId: specie.id,
        })
        .returning()
    )[0];

    const data: UpdatePet = {
      ...pet,
      mainImageId: pet.mainImageId ?? undefined,
      observations: pet.observations ?? undefined,
      breedId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284", // unregistered breed
    };

    const request = new Request(`http://localhost/pet/pets`, {
      method: "PUT",
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

  it("should return 400 when updating with non-matching specie and breed", async () => {
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

    const pet = (
      await db
        .insert(petsTable)
        .values({
          name: "Nina",
          birthdate: "2021-01-01",
          sex: "FEMALE",
          breedId: catBreed.id,
          specieId: specieCat.id,
        })
        .returning()
    )[0];

    const data: UpdatePet = {
      ...pet,
      mainImageId: pet.mainImageId ?? undefined,
      observations: pet.observations ?? undefined,
      specieId: specieDog.id,
      breedId: catBreed.id,
    };

    const request = new Request(`http://localhost/pet/pets`, {
      method: "PUT",
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

  it("should return 422 when updating with invalid payload", async () => {
    const request = new Request("http://localhost/pet/pets", {
      method: "PUT",
      body: JSON.stringify({ invalid: true }),
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

  it("should return 404 when updating a non-existent pet", async () => {
    const data: UpdatePet = {
      id: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      birthdate: "2021-01-01",
      status: "ACTIVE",
      breedId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      specieId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      sex: "FEMALE",
      mainImageId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      name: "Ghost",
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);
    const body = await response.json();

    expect(body.name).toBe("PetNotFoundError");
    expect(response.status).toBe(404);
  });

  it("should return 401 when unauthorized", async () => {
    const data: UpdatePet = {
      id: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      birthdate: "2021-01-01",
      status: "ACTIVE",
      breedId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      specieId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      sex: "FEMALE",
      mainImageId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284",
      name: "Ghost",
    };

    const request = new Request("http://localhost/pet/pets", {
      method: "PUT",
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
