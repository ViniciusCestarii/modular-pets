import Elysia from "elysia";
import { verifyToken } from "./jwt";

export const auth = () =>
  new Elysia({
    name: "auth",
  })
    .onBeforeHandle(async ({ request, set }) => {
      if (await checkCookie(request)) return;
      if (await checkAuthorizationHeader(request)) return;

      set.status = "Unauthorized";
      return {
        name: "Unauthorized",
        message: "Unauthorized",
      };
    })
    .as("scoped");

const checkCookie = async (request: Request) => {
  const cookies = request.headers.get("Cookie");
  const cookieToken = cookies
    ?.split(";")
    .find((cookie) => cookie.includes("auth="));

  if (!cookieToken) {
    return false;
  }

  const token = cookieToken.trimStart().replace("auth=", "");

  const payload = await verifyToken(token);

  return payload;
};

const checkAuthorizationHeader = async (request: Request) => {
  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return null;
  }

  // separating the Bearer from the token
  const token = authorization.split(" ")[1];
  const payload = await verifyToken(token);

  return payload;
};
