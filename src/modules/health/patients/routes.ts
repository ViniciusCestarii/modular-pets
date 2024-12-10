import Elysia from "elysia";
import { createPatient } from "./controllers/create";

const patientsRoutes = new Elysia();

patientsRoutes.use(createPatient);

export default patientsRoutes;
