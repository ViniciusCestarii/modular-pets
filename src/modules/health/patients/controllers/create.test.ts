import { describe, expect, it } from "bun:test";
import { app } from "@/app";
import { CreatePatient } from "../types";
import { bearerToken } from "@/modules/shared/utilities/test";

describe("Create patient e2e", () => {
  it("should create a new patient successfully", async () => {
    const data: CreatePatient = {
      name: "Nina",
      birthdate: "2021-01-01",
      medicalObservations:
        "No prior medical conditions reported. Regular vaccinations up to date. Recent flea and tick prevention administered. Healthy and active upon initial examination.",
      sex: "FEMALE",
      specie: "Dog",
      breed: "German Shepherd",
    };

    const request = new Request("http://localhost/health/patients", {
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
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      specie: "Dog",
      breed: "German Shepherd",
    });

    expect(response.status).toBe(201);
  });

  it("should return 422 when creating a specie with invalid data", async () => {
    const data = {};

    const request = new Request("http://localhost/health/patients", {
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
    const data: CreatePatient = {
      name: "Nina",
      birthdate: "2021-01-01",
      medicalObservations:
        "No prior medical conditions reported. Regular vaccinations up to date. Recent flea and tick prevention administered. Healthy and active upon initial examination.",
      sex: "FEMALE",
      specie: "Dog",
      breed: "German Shepherd",
    };

    const request = new Request("http://localhost/health/patients", {
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
