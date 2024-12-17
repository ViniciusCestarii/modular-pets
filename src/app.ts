import { Elysia } from "elysia";
import { env } from "./env";
import petsRoutes from "./modules/pet/pets/routes";
import speciesRoutes from "./modules/pet/species/routes";
import swagger from "@elysiajs/swagger";
import breedsRoutes from "./modules/pet/breeds/routes";
import { axiomTelemetry } from "./modules/shared/utilities/telemetry";
import patientsRoutes from "./modules/health/patients/routes";

export const app = new Elysia()
  .use(axiomTelemetry())
  .use(swagger())
  .use(petsRoutes)
  .use(speciesRoutes)
  .use(breedsRoutes)
  .use(patientsRoutes)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
