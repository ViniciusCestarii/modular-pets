import Elysia from "elysia";
import { createSpecie } from "./controllers/create";

const speciesRoutes = new Elysia();

speciesRoutes.use(createSpecie);

export default speciesRoutes;
