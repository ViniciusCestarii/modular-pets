import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import db from "@/db";
import { breedsTable, speciesTable } from "@/db/schema";
import { bearerToken } from "@/test";

describe("Delete breed e2e", () => {
  it("should delete a breed successfully", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const request = new Request(`http://localhost/pet/breeds/${breed.id}`, {
      method: "DELETE",
      headers: {
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(204);
  });

  it("should return 404 when trying to delete a breed that doesn't exist", async () => {
    const request = new Request(
      `http://localhost/pet/breeds/622faec8-1aa5-4355-8bf7-00a829eea8aa`,
      {
        method: "DELETE",
        headers: {
          Authorization: bearerToken,
        },
      },
    );

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("BreedNotFoundError");

    expect(response.status).toBe(404);
  });

  it("should return 401 trying being Unauthorized", async () => {
    const request = new Request(
      `http://localhost/pet/breeds/136ebe57-1420-4725-9973-6882aaa6e577`,
      {
        method: "DELETE",
      },
    );

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("Unauthorized");

    expect(response.status).toBe(401);
  });
});
