import { Elysia } from "elysia";
import { env } from "./env";
import petsRoutes from "./modules/pet/pets/routes";
import speciesRoutes from "./modules/pet/species/routes";
import swagger from "@elysiajs/swagger";

const app = new Elysia()
  .use(swagger())
  .use(petsRoutes)
  .use(speciesRoutes)
  .listen(env.PORT);

export default app;
