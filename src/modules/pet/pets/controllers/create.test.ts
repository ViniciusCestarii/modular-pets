import { describe, expect, it } from "bun:test";
import app from "@/index";
import { CreatePet } from "../types";

describe("Create pet e2e", () => {
  it("should create a new pet successfully", async () => {
    const data: CreatePet = {
      name: "Nina",
      birthdate: "2021-01-01",
    };

    const request = new Request("http://localhost/pets", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await app.handle(request);

    expect(response.status).toBe(201);

    const body = await response.json();

    expect(body).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
    });
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/pets", {
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
