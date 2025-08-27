import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import db from "@/db";
import { speciesTable } from "../specie";
import { bearerToken } from "@/test";

describe("Delete specie e2e", () => {
  it("should delete a specie successfully", async () => {
    const specie = (
      await db
        .insert(speciesTable)
        .values({
          name: "Dog",
        })
        .returning()
    )[0];

    const request = new Request(`http://localhost/pet/species/${specie.id}`, {
      method: "DELETE",
      headers: {
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(204);
  });

  it("should return 404 when trying to delete a specie that doesn't exist", async () => {
    const request = new Request(
      "http://localhost/pet/species/08cb2572-77d4-4de3-b6f7-97e4b5cd6512",
      {
        method: "DELETE",
        headers: {
          Authorization: bearerToken,
        },
      },
    );

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("SpecieNotFoundError");

    expect(response.status).toBe(404);
  });

  it("should return 422 when delete a specie with invalid data", async () => {
    const request = new Request("http://localhost/pet/species/invalid", {
      method: "DELETE",
      headers: {
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(422);
  });

  it("should return 401 trying being Unauthorized", async () => {
    const request = new Request(
      "http://localhost/pet/species/b56647a9-9f40-4a31-9a58-42634bfff669",
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
