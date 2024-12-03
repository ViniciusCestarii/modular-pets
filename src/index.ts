import { Elysia } from "elysia";
import { env } from "./env";
import petsRoutes from "./modules/pet/pets/routes";
import speciesRoutes from "./modules/pet/species/routes";
import swagger from "@elysiajs/swagger";
import breedsRoutes from "./modules/pet/breeds/routes";

const app = new Elysia()
  .use(swagger())
  .use(petsRoutes)
  .use(speciesRoutes)
  .use(breedsRoutes)
  .listen(env.PORT);

export default app;
