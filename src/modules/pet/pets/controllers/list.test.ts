import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePet } from "../types";
import db from "@/db";
import { breedsTable, petsTable, speciesTable } from "@/db/schema";
import { Pagination } from "@/modules/shared/types/pagination";

describe("List pet e2e", () => {
  it("should list pets", async () => {
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

    await db.insert(petsTable).values(createPet).returning();

    const url = new URL("http://localhost/pet/pets");

    const data: Pagination = {
      page: 1,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);

    expect(body[0]).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      speciesId: specie.id,
      breedId: breed.id,
    });

    expect(response.status).toBe(200);
  });

  it("should return empty pet list", async () => {
    const url = new URL("http://localhost/pet/pets");

    const data: Pagination = {
      page: 1,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);

    expect(response.status).toBe(200);
  });

  it("should paginate pets", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", speciesId: specie.id })
        .returning()
    )[0];

    for (let i = 0; i < 15; i++) {
      const createPet: CreatePet = {
        name: `Nina-${i}`,
        birthdate: "2021-01-01",
        sex: "FEMALE",
        speciesId: specie.id,
        breedId: breed.id,
      };

      await db.insert(petsTable).values(createPet).returning();
    }

    const url = new URL("http://localhost/pet/pets");

    const data: Pagination = {
      page: 2,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(Array.isArray(body)).toBe(true);

    expect(body[0]).toMatchObject({
      id: expect.any(String),
      name: "Nina-5",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      speciesId: specie.id,
      breedId: breed.id,
    });

    expect(body[1]).toMatchObject({
      id: expect.any(String),
      name: "Nina-6",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      speciesId: specie.id,
      breedId: breed.id,
    });

    expect(response.status).toBe(200);
  });

  it("should return 422 passing invalid params", async () => {
    const url = new URL("http://localhost/pet/pets");

    const data: Pagination = {
      page: 0,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const response = await app.handle(request);
    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(422);
  });
});
