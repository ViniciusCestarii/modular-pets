import { Elysia } from "elysia";
import { env } from "./env";
import petsRoutes from "./modules/pet/pets/routes";
import speciesRoutes from "./modules/pet/species/routes";
import swagger from "@elysiajs/swagger";
import breedsRoutes from "./modules/pet/breeds/routes";
import { axiomTelemetry } from "./modules/shared/utilities/telemetry";
import patientsRoutes from "./modules/health/patients/routes";
import { errorMiddleware } from "./modules/shared/utilities/error-middleware";
import cors from "@elysiajs/cors";

export const app = new Elysia()
  .use(cors())
  .use(axiomTelemetry())
  .use(swagger())
  .use(errorMiddleware())
  .use(petsRoutes)
  .use(speciesRoutes)
  .use(breedsRoutes)
  .use(patientsRoutes)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
