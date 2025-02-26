import Elysia from "elysia";
import { createPet } from "../pets/controllers/create";
import { createBreed } from "../breeds/controllers/create";
import { createSpecie } from "../species/controllers/create";
import { listPets } from "../pets/controllers/list";

const petRoutes = new Elysia();

petRoutes.group("pet", (app) =>
  app.use(createPet).use(listPets).use(createBreed).use(createSpecie),
);

export default petRoutes;
