import { app } from "@/app";
import db from "@/db";
import { breedsTable, imagesTable, petsTable, speciesTable } from "@/db/schema";
import { bearerToken, dogImageFile } from "@/test";
import { describe, expect, it } from "bun:test";
import { CreatePet } from "../types";

describe("Delete pet image e2e", () => {
  it("should delete pet image", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const createPet: CreatePet = {
      name: "Nina",
      status: "ACTIVE",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: breed.id,
    };

    const pet = (await db.insert(petsTable).values(createPet).returning())[0];

    const image = (
      await db
        .insert(imagesTable)
        .values({
          ownerId: pet.id,
          ownerType: "pet",
          src: "data:image/png;base64,iVBORw0KGgoAAAA",
        })
        .returning()
    )[0];

    const url = `http://localhost/pet/pets/images/${image.id}`;

    const request = new Request(url, {
      method: "DELETE",
      headers: {
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(204);
  });

  it("should return 404 trying to delete an image that doesn't exist", async () => {
    const url = `http://localhost/pet/pets/images/00000000-0000-0000-0000-000000000000`;

    const request = new Request(url, {
      method: "DELETE",
      headers: {
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);
    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(404);
  });

  it("should return 422 passing invalid id", async () => {
    const url = `http://localhost/pet/pets/images/invalid-id`;

    const request = new Request(url, {
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
    const url = `http://localhost/pet/pets/00000000-0000-0000-0000-000000000000/images`;

    const formData = new FormData();
    formData.append("image", dogImageFile);

    const request = new Request(url, {
      method: "POST",
      body: formData,
    });

    const response = await app.handle(request);

    const body = await response.json();

    expect(body.name).toBe("Unauthorized");

    expect(response.status).toBe(401);
  });
});
