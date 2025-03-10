import Elysia from "elysia";
import { loginSchema } from "../schema";
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
    },
  );
