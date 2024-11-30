import { expect, test } from "bun:test";
import app from "@/index";
import { CreatePet } from "../../types/pets-types";

test("Create a pet", async () => {
  const data: CreatePet = {
    name: "Nina",
    birthdate: "2021-01-01",
  };

  const request = new Request("http://localhost/pet", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await app.handle(request);
  const body = await response.json();

  expect(response.status).toBe(201);
  expect(body).toMatchObject({
    id: expect.any(String),
    name: "Nina",
    birthdate: "2021-01-01",
  });
});

test("Create a pet with invalid data", async () => {
  const data = {};

  const request = new Request("http://localhost/pet", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const response = await app.handle(request);
  const body = await response.json();

  expect(response.status).toBe(422);
  expect(body).toBeTruthy();
});
