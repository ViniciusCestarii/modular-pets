import Elysia from "elysia";
import { makeRegisterUserUseCase } from "../factories/make-register";
import { UserAlreadyExistsError } from "../error/user-already-exists";
import { tokenExpirationTime } from "@/utils/auth/jwt";
import { setJwtCookie } from "../utils/cookie";
import {
  createUserSchema,
  swaggerUserAlreadyExistsErrorSchema,
  swaggerUserViewSchema,
} from "../schema";

export const registerUser = new Elysia()
  .error({
    UserAlreadyExistsError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "UserAlreadyExistsError":
        set.status = "Conflict";
        return error;
    }
  })
  .post(
    "/users/register",
    async ({ body, set, cookie }) => {
      const registerUserUseCase = makeRegisterUserUseCase();

      const registerReturn = await registerUserUseCase.execute(body);

      setJwtCookie(cookie, registerReturn.token);

      set.status = "Created";
      return { ...registerReturn, expiresIn: tokenExpirationTime };
    },
    {
      body: createUserSchema,
      detail: {
        summary: "Register",
        description:
          "Register a new user and return a JWT token for authentication.",
        tags: ["Auth"],
        requestBody: {
          content: {
            "application/json": {
              schema: createUserSchema,
            },
          },
        },
        responses: {
          "201": {
            description: "User successfully registered and token generated.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: swaggerUserViewSchema,
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
                  required: ["user", "token", "expiresIn"],
                },
              },
            },
          },
          "409": {
            description: "User already exists",
            content: {
              "application/json": {
                schema: swaggerUserAlreadyExistsErrorSchema,
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
