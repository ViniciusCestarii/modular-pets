import Elysia from "elysia";
import { createBreed } from "./controllers/create";

const breedsRoutes = new Elysia();

breedsRoutes.use(createBreed);

export default breedsRoutes;
