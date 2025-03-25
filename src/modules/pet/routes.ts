import Elysia from "elysia";
import { createPet } from "./pets/controllers/create";
import { listPets } from "./pets/controllers/list";
import { findPetById } from "./pets/controllers/find-by-id";
import { uploadPetImage } from "./pets/controllers/upload-image";
import { createBreed } from "./breeds/controllers/create";
import { createSpecie } from "./species/controllers/create";
import { updateSpecie } from "./species/controllers/update";
import { updateBreed } from "./breeds/controllers/update";

const petRoutes = new Elysia();

petRoutes.group("pet", (app) =>
  app
    .use(createPet)
    .use(listPets)
    .use(findPetById)
    .use(uploadPetImage)
    .use(createBreed)
    .use(updateBreed)
    .use(createSpecie)
    .use(updateSpecie),
);

export default petRoutes;
