import Elysia from "elysia";
import { createPatientSchema } from "../schema";
import { makeCreatePatientUseCase } from "../factories/make-create";

export const createPatient = new Elysia().post(
  "/patients",
  async ({ body, set }) => {
    const createPatientUseCase = makeCreatePatientUseCase();

    const createdPatient = await createPatientUseCase.execute(body);

    set.status = "Created";
    return createdPatient;
  },
  {
    body: createPatientSchema,
  },
);
