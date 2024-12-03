import { Elysia } from "elysia";
import { env } from "./env";
import petsRoutes from "./modules/pet/pets/routes";
import speciesRoutes from "./modules/pet/species/routes";

const app = new Elysia().use(petsRoutes).use(speciesRoutes).listen(env.PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

export default app;
