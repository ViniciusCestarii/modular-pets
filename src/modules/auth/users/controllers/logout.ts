import { auth } from "@/modules/shared/auth/plugin";
import Elysia from "elysia";

// In the future I could add a blacklist to invalidate tokens
export const logoutUser = new Elysia().use(auth()).post(
  "/users/logout",
  async ({ set, cookie }) => {
    const { auth } = cookie;

    auth.set({
      value: "",
      maxAge: 0,
      path: "/",
    });

    set.status = "No Content";
    return;
  },
  {
    auth: true,
    detail: {
      tags: ["Auth"],
    },
  },
);
