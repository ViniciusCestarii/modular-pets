import Elysia from "elysia";
import { createPet } from "./controllers/create";

const petsRoutes = new Elysia();

petsRoutes.use(createPet);

export default petsRoutes;
