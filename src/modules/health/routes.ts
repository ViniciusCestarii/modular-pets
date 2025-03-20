import Elysia from "elysia";
import { createPatient } from "./patients/controllers/create";

const healthRoutes = new Elysia();

healthRoutes.group("health", (app) => app.use(createPatient));

export default healthRoutes;
