import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreateBreed } from "../types";
import db from "@/db";
import { breedsTable, speciesTable } from "@/db/schema";
import { bearerToken } from "@/test";

describe("Create breed e2e", () => {
  it("should create a new breed successfully", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const data: CreateBreed = {
      name: "German Shepherd",
      speciesId: specie.id,
    };

    const request = new Request("http://localhost/pet/breeds", {
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
      name: "German Shepherd",
      speciesId: data.speciesId,
    });

    expect(response.status).toBe(201);
  });

  it("should return 400 when trying to create a breed with unregistered specie", async () => {
    const data: CreateBreed = {
      name: "German Shepherd",
      speciesId: "b38d7184-b9cf-4e79-acb6-6b7b8f797284", // Unregistered specie
    };

    const request = new Request("http://localhost/pet/breeds", {
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

  it("should return 409 when trying to create a breed that already exists in the same specie", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    await db.insert(breedsTable).values({
      name: "German Shepherd",
      speciesId: specie.id,
    });

    const data: CreateBreed = {
      name: "German Shepherd",
      speciesId: specie.id,
    };

    const request = new Request("http://localhost/pet/breeds", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("BreedAlreadyExistsError");

    expect(response.status).toBe(409);
  });

  it("should not throw BreedAlreadyExistsError when creating a breed that already exists but in a different specie", async () => {
    const dog = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const cat = (
      await db.insert(speciesTable).values({ name: "Cat" }).returning()
    )[0];

    await db.insert(breedsTable).values({
      name: "Siamese",
      speciesId: dog.id,
    });

    const data: CreateBreed = {
      name: "Siamese",
      speciesId: cat.id,
    };

    const request = new Request("http://localhost/pet/breeds", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(201);
  });

  it("should return 422 when creating a breed with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/pet/breeds", {
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
    const data: CreateBreed = {
      name: "German Shepherd",
      speciesId: "00000000-0000-0000-0000-000000000000",
    };

    const request = new Request("http://localhost/pet/breeds", {
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
