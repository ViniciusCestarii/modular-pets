import { Elysia } from "elysia";
import { env } from "./env";
import swagger from "@elysiajs/swagger";
import { axiomTelemetry } from "./modules/shared/utilities/telemetry";
import { errorMiddleware } from "./modules/shared/utilities/error-middleware";
import cors from "@elysiajs/cors";
import healthRoutes from "./modules/health/shared/routes";
import petRoutes from "./modules/pet/shared/routes";

export const app = new Elysia()
  .use(axiomTelemetry())
  .use(cors())
  .use(swagger())
  .use(errorMiddleware())
  .use(petRoutes)
  .use(healthRoutes)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
