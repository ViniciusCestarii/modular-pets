import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { UpdateBreed } from "../types";
import db from "@/db";
import { breedsTable, speciesTable } from "@/db/schema";
import { bearerToken } from "@/test";

describe("Update breed e2e", () => {
  it("should update a new breed successfully", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const data: UpdateBreed = {
      id: breed.id,
      name: "Pug",
      specieId: specie.id,
    };

    const request = new Request("http://localhost/pet/breeds", {
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
      id: expect.any(String),
      name: "Pug",
      specieId: data.specieId,
    });

    expect(response.status).toBe(200);
  });

  it("should return 400 when trying to update a breed with unregistered specie", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const data: UpdateBreed = {
      id: breed.id,
      name: "German Shepherd",
      specieId: "00000000-0000-0000-0000-000000000000",
    };

    const request = new Request("http://localhost/pet/breeds", {
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

  it("should return 404 when trying to update a breed that doesn't exist", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const data: UpdateBreed = {
      id: "00000000-0000-0000-0000-000000000000",
      name: "German Shepherd",
      specieId: specie.id,
    };

    const request = new Request("http://localhost/pet/breeds", {
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

    expect(response.status).toBe(404);
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/pet/breeds", {
      method: "PUT",
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
    const data: UpdateBreed = {
      id: "00000000-0000-0000-0000-000000000000",
      name: "German Shepherd",
      specieId: "00000000-0000-0000-0000-000000000000",
    };

    const request = new Request("http://localhost/pet/breeds", {
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
