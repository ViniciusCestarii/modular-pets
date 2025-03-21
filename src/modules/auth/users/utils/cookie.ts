import { tokenExpirationTime } from "@/utils/auth/jwt";
import { Cookie } from "elysia";

export const setJwtCookie = (
  cookie: Record<string, Cookie<string | undefined>>,
  token: string,
) => {
  const { auth } = cookie;

  auth.set({
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: tokenExpirationTime,
    path: "/",
  });
};
