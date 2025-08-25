import Elysia from "elysia";
import { createPet } from "./pets/controllers/create";
import { listPets } from "./pets/controllers/list";
import { findPetById } from "./pets/controllers/find-by-id";
import { uploadPetImage } from "./pets/controllers/upload-image";
import { createBreed } from "./breeds/controllers/create";
import { createSpecie } from "./species/controllers/create";
import { updateSpecie } from "./species/controllers/update";
import { updateBreed } from "./breeds/controllers/update";
import { findAllSpecies } from "./species/controllers/find-all";
import { findAllBreedsBySpecie } from "./breeds/controllers/find-all-by-specie";
import { updatePet } from "./pets/controllers/update";

const petRoutes = new Elysia();

petRoutes.group("pet", (app) =>
  app
    .use(createPet)
    .use(updatePet)
    .use(listPets)
    .use(findPetById)
    .use(uploadPetImage)
    .use(createBreed)
    .use(updateBreed)
    .use(findAllBreedsBySpecie)
    .use(createSpecie)
    .use(updateSpecie)
    .use(findAllSpecies),
);

export default petRoutes;
