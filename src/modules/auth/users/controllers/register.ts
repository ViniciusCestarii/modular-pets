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
    },
  );
