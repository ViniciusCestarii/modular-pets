import Elysia from "elysia";
import { registerUser } from "../users/controllers/register";

const authRoutes = new Elysia();

authRoutes.group("auth", (app) => app.use(registerUser));

export default authRoutes;
