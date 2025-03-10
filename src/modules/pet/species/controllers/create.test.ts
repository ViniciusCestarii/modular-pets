import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreateSpecie } from "../types";
import db from "@/db";
import { speciesTable } from "../specie";
import { bearerToken } from "@/modules/shared/utilities/test";

describe("Create specie e2e", () => {
  it("should create a specie successfully", async () => {
    const data: CreateSpecie = {
      name: "Dog",
    };

    const request = new Request("http://localhost/pet/species", {
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
      name: "Dog",
    });

    expect(response.status).toBe(201);
  });

  it("should return 409 when trying to create a specie that already exists", async () => {
    const specie: CreateSpecie = {
      name: "Dog",
    };

    await db.insert(speciesTable).values(specie);

    const request = new Request("http://localhost/pet/species", {
      method: "POST",
      body: JSON.stringify(specie),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("SpecieAlreadyExistsError");

    expect(response.status).toBe(409);
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/pet/species", {
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
    const data: CreateSpecie = {
      name: "Dog",
    };

    const request = new Request("http://localhost/pet/species", {
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
