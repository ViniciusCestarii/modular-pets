import Elysia from "elysia";
import { createPatientSchema, swaggerPatientSchema } from "../schema";
import { makeCreatePatientUseCase } from "../factories/make-create";
import { auth } from "@/utils/auth/plugin";
import { swaggerUnauthorizedSchema } from "@/modules/auth/users/schema";

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
      summary: "Create patient",
      description: "Create a new patient",
      tags: ["Health"],
      responses: {
        201: {
          description: "Success",
          content: {
            "application/json": {
              schema: swaggerPatientSchema,
            },
          },
        },
        401: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: swaggerUnauthorizedSchema,
            },
          },
        },
        422: {
          description: "Validation Error",
        },
      },
    },
  },
);
