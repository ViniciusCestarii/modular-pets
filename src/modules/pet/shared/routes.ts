import Elysia from "elysia";
import { createPet } from "../pets/controllers/create";
import { createBreed } from "../breeds/controllers/create";
import { createSpecie } from "../species/controllers/create";
import { listPets } from "../pets/controllers/list";
import { findPetById } from "../pets/controllers/find-by-id";

const petRoutes = new Elysia();

petRoutes.group("pet", (app) =>
  app
    .use(createPet)
    .use(listPets)
    .use(findPetById)
    .use(createBreed)
    .use(createSpecie),
);

export default petRoutes;
