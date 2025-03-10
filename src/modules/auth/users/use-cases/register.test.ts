import { RegisterUserUseCase } from "./register";
import { InMemoryUsersRepository } from "../repositories/in-memory-repository";
import { beforeEach, describe, expect, it } from "bun:test";
import { CreateUser } from "../types";
import { UserAlreadyExistsError } from "../error/user-already-exists";

describe("Create user use case", () => {
  let registerUserUseCase: RegisterUserUseCase;
  let inMemoryUsersRepository: InMemoryUsersRepository;

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    registerUserUseCase = new RegisterUserUseCase(inMemoryUsersRepository);
  });

  it("should create a new user", async () => {
    const user: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "12345678",
      birthdate: "1990-01-01",
    };

    const createdUser = await registerUserUseCase.execute(user);

    expect(createdUser.user).toMatchObject({
      id: expect.any(String),
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
    });

    expect(createdUser.token).toBe("implement token generation here");
  });

  it("should throw UserAlreadyExistsError when creating a user with an email that already exists", async () => {
    const user: CreateUser = {
      name: "John Doe",
      email: "john.doe@gmail.com",
      password: "12345678",
      birthdate: "1990-01-01",
    };

    await inMemoryUsersRepository.createUser(user);

    expect(registerUserUseCase.execute(user)).rejects.toThrowError(
      UserAlreadyExistsError,
    );
  });
});
