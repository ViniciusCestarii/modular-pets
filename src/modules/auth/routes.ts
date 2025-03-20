import Elysia from "elysia";
import { registerUser } from "./users/controllers/register";
import { loginUser } from "./users/controllers/login";
import { logoutUser } from "./users/controllers/logout";

const authRoutes = new Elysia();

authRoutes.group("auth", (app) =>
  app.use(registerUser).use(loginUser).use(logoutUser),
);

export default authRoutes;
