import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePet, ListPets, PetList } from "../types";
import db from "@/db";
import { breedsTable, petsTable, speciesTable } from "@/db/schema";
import { v4 } from "uuid";

const dogId = v4();
const catId = v4();

const siameseId = v4();
const cockatielId = v4();

const insertDogCat = async () => {
  const [dog, cat] = await db
    .insert(speciesTable)
    .values([
      { id: dogId, name: "Dog" },
      { id: catId, name: "Cat" },
    ])
    .returning();

  const [germanShepherd, siamese] = await db
    .insert(breedsTable)
    .values([
      { id: cockatielId, name: "German Sheperd", specieId: dog.id },
      { id: siameseId, name: "Siamese", specieId: cat.id },
    ])
    .returning();

  const petsToCreate = [];

  for (let i = 0; i < 15; i++) {
    const createMarley: CreatePet = {
      name: `Marley-${i}`,
      status: "ACTIVE",
      birthdate: `20${i}-01-01`,
      sex: "MALE",
      specieId: dog.id,
      breedId: germanShepherd.id,
    };

    petsToCreate.push(createMarley);

    const createPandora: CreatePet = {
      name: `Pandora-${i}`,
      status: "ACTIVE",
      birthdate: `20${i}-01-01`,
      sex: "FEMALE",
      specieId: cat.id,
      breedId: siamese.id,
    };

    petsToCreate.push(createPandora);
  }

  await db.insert(petsTable).values(petsToCreate);
};

describe("List pet e2e", () => {
  it("should list pets", async () => {
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

    await db.insert(petsTable).values(createPet).returning();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const body: PetList = await response.json();

    const { pets, total } = body;

    expect(pets).toBeArray();

    expect(pets).toHaveLength(1);

    expect(total).toBe(1);

    expect(pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: breed.id,
    });

    expect(response.status).toBe(200);
  });

  it("should return empty pet list", async () => {
    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const body: PetList = await response.json();

    const { pets, total } = body;

    expect(pets).toBeArray();

    expect(pets).toHaveLength(0);

    expect(total).toBe(0);

    expect(response.status).toBe(200);
  });

  it("should paginate pets", async () => {
    const specie = (
      await db.insert(speciesTable).values({ name: "Dog" }).returning()
    )[0];

    const breed = (
      await db
        .insert(breedsTable)
        .values({ name: "German Shepherd", specieId: specie.id })
        .returning()
    )[0];

    const petsToCreate = [];

    for (let i = 0; i < 15; i++) {
      const createPet: CreatePet = {
        name: `Nina-${i}`,
        status: "ACTIVE",
        birthdate: "2021-01-01",
        sex: "FEMALE",
        specieId: specie.id,
        breedId: breed.id,
      };

      petsToCreate.push(createPet);
    }

    await db.insert(petsTable).values(petsToCreate);

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 2,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const body: PetList = await response.json();

    const { pets, total } = body;

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Nina-5",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: breed.id,
    });

    expect(pets[1]).toMatchObject({
      id: expect.any(String),
      name: "Nina-6",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specieId: specie.id,
      breedId: breed.id,
    });

    expect(total).toBe(15);

    expect(response.status).toBe(200);
  });

  it("should filter pets by name", async () => {
    await insertDogCat();
    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
      name: "pandora",
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const { pets, total }: PetList = await response.json();

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Pandora-0",
      sex: "FEMALE",
    });

    expect(total).toBe(15);

    expect(response.status).toBe(200);
  });

  it("should filter pets by breed", async () => {
    await insertDogCat();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
      breedId: siameseId,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const { pets, total }: PetList = await response.json();

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Pandora-0",
      sex: "FEMALE",
      breedId: siameseId,
    });

    expect(total).toBe(15);

    expect(response.status).toBe(200);
  });

  it("should filter pets by specie", async () => {
    await insertDogCat();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
      specieId: catId,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const { pets, total }: PetList = await response.json();

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Pandora-0",
      sex: "FEMALE",
      specieId: catId,
    });

    expect(total).toBe(15);

    expect(response.status).toBe(200);
  });

  it("should filter pets by sex", async () => {
    await insertDogCat();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
      sex: "MALE",
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const { pets, total }: PetList = await response.json();

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      id: expect.any(String),
      name: "Marley-0",
      sex: "MALE",
    });

    expect(total).toBe(15);

    expect(response.status).toBe(200);
  });

  it("should filter pets by min birthdate", async () => {
    await insertDogCat();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
      minBirthdate: "2013-01-01",
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const { pets, total }: PetList = await response.json();

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      name: "Marley-13",
      birthdate: "2013-01-01",
      sex: "MALE",
    });

    expect(pets[pets.length - 1]).toMatchObject({
      name: "Pandora-14",
      birthdate: "2014-01-01",
      sex: "FEMALE",
    });

    expect(total).toBe(4);

    expect(response.status).toBe(200);
  });

  it("should filter pets by max birthdate", async () => {
    await insertDogCat();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 100,
      maxBirthdate: "2010-01-01",
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const { pets, total }: PetList = await response.json();

    expect(pets).toBeArray();

    expect(pets[0]).toMatchObject({
      name: "Marley-0",
      birthdate: "0200-01-01",
      sex: "MALE",
    });

    //obs: remember: Pandora-10 comes first than Pandora-9

    expect(pets[pets.length - 1]).toMatchObject({
      name: "Pandora-9",
      birthdate: "0209-01-01",
      sex: "FEMALE",
    });

    expect(total).toBe(22);

    expect(response.status).toBe(200);
  });

  it("should return empty pet list when filtering returns no results", async () => {
    await insertDogCat();

    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 1,
      pageSize: 10,
      minBirthdate: "9999-01-01",
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);

    const body: PetList = await response.json();

    const { pets, total } = body;

    expect(pets).toBeArray();

    expect(pets).toHaveLength(0);

    expect(total).toBe(0);

    expect(response.status).toBe(200);
  });

  it("should return 422 passing invalid params", async () => {
    const url = new URL("http://localhost/pet/pets");

    const data: ListPets = {
      page: 0,
      pageSize: 10,
    };

    Object.entries(data).forEach(([key, value]) => {
      url.searchParams.append(key, value.toString());
    });

    const request = new Request(url.toString(), {
      method: "GET",
    });

    const response = await app.handle(request);
    const body = await response.json();

    expect(body).toBeTruthy();

    expect(response.status).toBe(422);
  });
});
