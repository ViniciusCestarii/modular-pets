import { Elysia } from "elysia";
import { env } from "./env";
import { axiomTelemetry } from "./plugins/telemetry";
import { errorMiddleware } from "./plugins/error-middleware";
import cors from "@elysiajs/cors";
import { auth } from "./utils/auth/plugin";
import { openApi } from "./plugins/open-api";
import petRoutes from "./modules/pet/routes";
import healthRoutes from "./modules/health/routes";
import authRoutes from "./modules/auth/routes";

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
