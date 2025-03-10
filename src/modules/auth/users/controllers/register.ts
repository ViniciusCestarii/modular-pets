import Elysia from "elysia";
import { makeRegisterUserUseCase } from "../factories/make-register";
import { UserAlreadyExistsError } from "../error/user-already-exists";
import { createUserSchema } from "../schema";
import { tokenExpirationTime } from "@/modules/shared/auth/jwt";
import { setJwtCookie } from "../utils/cookie";

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
    "/users",
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
        tags: ["Auth"],
        description:
          "Register a new user and return a JWT token for authentication.",
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
                    user: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        name: { type: "string" },
                        email: { type: "string" },
                        birthdate: { type: "string" },
                      },
                      required: ["id", "username", "email"],
                    },
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
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example:
                        "User already exists with this email or username.",
                    },
                    name: {
                      type: "string",
                      example: "UserAlreadyExistsError",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  );
