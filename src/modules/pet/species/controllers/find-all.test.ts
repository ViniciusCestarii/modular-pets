import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import db from "@/db";
import { speciesTable } from "../specie";

describe("Find all species e2e", () => {
  it("should find all species successfully", async () => {
    const createdSpecies = await db
      .insert(speciesTable)
      .values([
        {
          name: "Cat",
        },
        {
          name: "Dog",
        },
      ])
      .returning();

    const ordenedCreatedSpecies = createdSpecies.toSorted((a, b) =>
      a.name.localeCompare(b.name),
    );

    const request = new Request("http://localhost/pet/species", {
      method: "GET",
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toBeArray();
    expect(body.length).toBe(2);
    ordenedCreatedSpecies.forEach((specie, index) => {
      expect(body[index]).toMatchObject({
        id: specie.id,
        name: specie.name,
      });
    });

    expect(response.status).toBe(200);
  });
});
