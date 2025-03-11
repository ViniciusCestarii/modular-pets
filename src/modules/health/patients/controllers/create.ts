import Elysia from "elysia";
import { createPatientSchema } from "../schema";
import { makeCreatePatientUseCase } from "../factories/make-create";
import { auth } from "@/modules/shared/auth/plugin";

export const createPatient = new Elysia().use(auth()).post(
  "/patients",
  async ({ body, set }) => {
    const createPatientUseCase = makeCreatePatientUseCase();

    const createdPatient = await createPatientUseCase.execute(body);

    set.status = "Created";
    return createdPatient;
  },
  {
    body: createPatientSchema,
    auth: true,
    detail: {
      tags: ["Health"],
    },
  },
);
