import { describe, expect, it } from "bun:test";
import app from "@/index";
import { CreateBreed } from "../types";
import db from "@/db";
import { breedsTable, speciesTable } from "@/db/schema";

describe("Create breed e2e", () => {
  it("should create a new breed successfully", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const data: CreateBreed = {
      name: "German Shepherd",
      speciesId: specie.id,
    };

    const request = new Request("http://localhost/breeds", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
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

    const request = new Request("http://localhost/breeds", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(400);

    const body = await response.json();

    expect(body).toBeTruthy();
  });

  it("should return 409 when trying to create a breed that already exists", async () => {
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

    const request = new Request("http://localhost/breeds", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(409);

    const body = await response.json();

    expect(body).toBeTruthy();
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/breeds", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(422);

    const body = await response.json();

    expect(body).toBeTruthy();
  });
});
