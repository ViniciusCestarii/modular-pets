import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { UpdateSpecie } from "../types";
import db from "@/db";
import { speciesTable } from "../specie";
import { bearerToken } from "@/test";

describe("Update specie e2e", () => {
  it("should update a specie successfully", async () => {
    const createdSpecie = (
      await db
        .insert(speciesTable)
        .values({
          name: "Dog",
        })
        .returning()
    )[0];

    const data: UpdateSpecie = {
      id: createdSpecie.id,
      name: "Cat",
    };

    const request = new Request("http://localhost/pet/species", {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toMatchObject(data);

    expect(response.status).toBe(200);
  });

  it("should return 404 when trying to update a specie that doesn't exist", async () => {
    const specie: UpdateSpecie = {
      id: "00000000-0000-0000-0000-000000000000",
      name: "Dog",
    };

    const request = new Request("http://localhost/pet/species", {
      method: "PUT",
      body: JSON.stringify(specie),
      headers: {
        "Content-Type": "application/json",
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("SpecieNotFoundError");

    expect(response.status).toBe(404);
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/pet/species", {
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
    const data: UpdateSpecie = {
      id: "00000000-0000-0000-0000-000000000000",
      name: "Dog",
    };

    const request = new Request("http://localhost/pet/species", {
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
