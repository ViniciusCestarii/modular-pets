import Elysia from "elysia";
import { loginSchema, swaggerInvalidCredentialsErrorSchema } from "../schema";
import { makeLoginUserUseCase } from "../factories/make-login";
import { InvalidCredentialsError } from "../error/invalid-credentials";
import { tokenExpirationTime } from "@/modules/shared/auth/jwt";
import { setJwtCookie } from "../utils/cookie";

export const loginUser = new Elysia()
  .error({
    InvalidCredentialsError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "InvalidCredentialsError":
        set.status = "Unauthorized";
        return error;
    }
  })
  .post(
    "/users/login",
    async ({ body, set, cookie }) => {
      const loginUserUseCase = makeLoginUserUseCase();

      const token = await loginUserUseCase.execute(body);
      setJwtCookie(cookie, token);

      set.status = "OK";
      return { token, expiresIn: tokenExpirationTime };
    },
    {
      body: loginSchema,
      detail: {
        summary: "Login",
        tags: ["Auth"],
        description: "Login user and retrieve an authentication token.",
        requestBody: {
          content: {
            "application/json": {
              schema: loginSchema,
            },
          },
        },
        responses: {
          200: {
            description: "Successful login and token generation.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "The JWT authentication token.",
                    },
                    expiresIn: {
                      type: "integer",
                      description:
                        "The expiration time of the token in seconds.",
                    },
                  },
                  required: ["token", "expiresIn"],
                },
              },
            },
          },
          401: {
            description: "Invalid credentials provided.",
            content: {
              "application/json": {
                schema: swaggerInvalidCredentialsErrorSchema,
              },
            },
          },
          422: {
            description: "Validation Error",
          },
        },
      },
    },
  );
