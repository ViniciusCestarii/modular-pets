import Elysia from "elysia";
import { registerUser } from "../users/controllers/register";
import { loginUser } from "../users/controllers/login";

const authRoutes = new Elysia();

authRoutes.group("auth", (app) => app.use(registerUser).use(loginUser));

export default authRoutes;
