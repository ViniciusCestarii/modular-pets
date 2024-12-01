import { Elysia } from "elysia";
import { env } from "./env";
import petsRoutes from "./modules/pet/pets/routes";

const app = new Elysia().use(petsRoutes).listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app;
