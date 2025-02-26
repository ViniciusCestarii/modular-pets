import { CreatePatientUseCase } from "./create";
import { InMemoryPatientsRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreatePatient } from "../types";

describe("Create patient use case", () => {
  let createPatientUseCase: CreatePatientUseCase;
  let inMemoryPatientsRepository: InMemoryPatientsRepository;

  beforeEach(() => {
    inMemoryPatientsRepository = new InMemoryPatientsRepository();
    createPatientUseCase = new CreatePatientUseCase(inMemoryPatientsRepository);
  });

  it("should create a new patient", async () => {
    const patient: CreatePatient = {
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      medicalObservations:
        "No prior medical conditions reported. Regular vaccinations up to date. Recent flea and tick prevention administered. Healthy and active upon initial examination.",
      breed: "German Shepherd",
      specie: "Dog",
    };

    const createdPatient = await createPatientUseCase.execute(patient);

    expect(createdPatient).toMatchObject({
      id: expect.any(String),
      name: "Nina",
      birthdate: "2021-01-01",
      sex: "FEMALE",
      medicalObservations:
        "No prior medical conditions reported. Regular vaccinations up to date. Recent flea and tick prevention administered. Healthy and active upon initial examination.",
      breed: "German Shepherd",
      specie: "Dog",
    });
  });
});
