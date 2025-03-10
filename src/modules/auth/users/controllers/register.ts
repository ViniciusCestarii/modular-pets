import Elysia from "elysia";
import { makeRegisterUserUseCase } from "../factories/make-register";
import { UserAlreadyExistsError } from "../error/user-already-exists";
import { createUserSchema } from "../schema";
import { tokenExpirationTime } from "@/modules/shared/auth/jwt";

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
    async ({ body, set }) => {
      const registerUserUseCase = makeRegisterUserUseCase();

      const registerReturn = await registerUserUseCase.execute(body);

      set.status = "Created";
      return { ...registerReturn, expiresIn: tokenExpirationTime };
    },
    {
      body: createUserSchema,
    },
  );
