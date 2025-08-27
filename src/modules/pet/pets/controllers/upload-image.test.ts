import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePet } from "../types";
import db from "@/db";
import { breedsTable, petsTable, speciesTable } from "@/db/schema";
import { Image } from "@/modules/shared/images/types";
import { bearerToken, dogImageFile } from "@/test";

describe("Upload pet image e2e", () => {
  it("should upload pet image", async () => {
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

    const rows = await db.insert(petsTable).values(createPet).returning();
    const pet = rows[0];

    const url = `http://localhost/pet/pets/${pet.id}/images`;

    const formData = new FormData();
    formData.append("image", dogImageFile);

    const request = new Request(url, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: bearerToken,
      },
    });

    const response = await app.handle(request);

    const body: Image = await response.json();

    expect(body).toMatchObject({
      id: expect.any(String),
      src: expect.any(String),
      ownerId: pet.id,
      ownerType: "pet",
    });

    expect(response.status).toBe(201);
  });

  it("should return 422 passing invalid params", async () => {
    const url = `http://localhost/pet/pets/00000000-0000-0000-0000-000000000000/images`;

    const formData = new FormData();

    const request = new Request(url, {
      method: "POST",
      body: formData,
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
