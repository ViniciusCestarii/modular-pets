import Elysia from "elysia";
import { verifyToken } from "./jwt";

// with macro it's possible to pick the token from elysia
// new Elysia()
// .use(auth())
// .post(
//   "/pets",
//   async ({ body, set, token }) => {
//   ...
//   },
//   {
//     body: createPetSchema,
//     auth: true, // this will trigger the auth macro
//   },

export const auth = () =>
  new Elysia({
    name: "auth",
  }).macro({
    // I will add auth based on roles in the future
    // auth: ({ roles }: {roles: string[]}) => ({
    auth: () => ({
      resolve: async ({ request, error }) => {
        let token = await getTokenFromCookie(request);
        if (token) return { token };
        token = await getTokenFromAuthorizationHeader(request);
        if (token) return { token };

        return error("Unauthorized", {
          name: "Unauthorized",
          message: "Unauthorized",
        });
      },
    }),
  });

const getTokenFromCookie = async (request: Request) => {
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

const getTokenFromAuthorizationHeader = async (request: Request) => {
  const authorization = request.headers.get("Authorization");
  if (!authorization) {
    return null;
  }

  // separating the Bearer from the token
  const token = authorization.split(" ")[1];
  const payload = await verifyToken(token);

  return payload;
};
