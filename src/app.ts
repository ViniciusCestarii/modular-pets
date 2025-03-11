import { Elysia } from "elysia";
import { env } from "./env";
import { axiomTelemetry } from "./modules/shared/utilities/telemetry";
import { errorMiddleware } from "./modules/shared/utilities/error-middleware";
import cors from "@elysiajs/cors";
import healthRoutes from "./modules/health/shared/routes";
import petRoutes from "./modules/pet/shared/routes";
import authRoutes from "./modules/auth/shared/routes";
import { auth } from "./modules/shared/auth/plugin";
import { openApi } from "./modules/shared/utilities/open-api";

export const app = new Elysia()
  .use(axiomTelemetry())
  .use(cors())
  .use(openApi())
  .use(errorMiddleware())
  .use(auth())
  .use(petRoutes)
  .use(healthRoutes)
  .use(authRoutes)
  .listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export type App = typeof app;
