import { InMemoryUsersRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreateUser, Login } from "../types";
import { LoginUserUseCase } from "./login";
import { InvalidCredentialsError } from "../error/invalid-credentials";
import { hashPassword } from "../utils/password";
import { verifyToken } from "@/modules/shared/auth/jwt";

describe("Login user", () => {
  let loginUserUseCase: LoginUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    loginUserUseCase = new LoginUserUseCase(inMemoryUsersRepository);
  });

  it("should login a user and generate a valid token", async () => {
    const password = "12345678";
    const user: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: hashPassword(password),
      birthdate: "1990-01-01",
    };

    const createdUser = await inMemoryUsersRepository.createUser(user);

    const login: Login = {
      email: user.email,
      password: password,
    };

    const token = await loginUserUseCase.execute(login);

    expect(token).toBeTruthy();

    const decodedToken = await verifyToken(token);

    // check some of the token payload
    expect(decodedToken.payload).toMatchObject({
      id: createdUser.id,
      sub: createdUser.id,
      email: user.email,
    });
  });

  it("should throw InvalidCredentials when logging with an uneregistered email", async () => {
    const login: Login = {
      email: "john.doe@gmail.com",
      password: "12345678",
    };

    expect(loginUserUseCase.execute(login)).rejects.toThrowError(
      InvalidCredentialsError,
    );
  });

  it("should throw InvalidCredentials when logging with the wrong password", async () => {
    const user: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "12345678",
      birthdate: "1990-01-01",
    };

    await inMemoryUsersRepository.createUser(user);

    const login: Login = {
      email: user.email,
      password: "wrong-password",
    };

    expect(loginUserUseCase.execute(login)).rejects.toThrowError(
      InvalidCredentialsError,
    );
  });
});
