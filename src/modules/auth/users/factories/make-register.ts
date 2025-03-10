import { DrizzleUsersRepository } from "../repositories/drizzle-repository";
import { RegisterUserUseCase } from "../use-cases/register";

export const makeRegisterUserUseCase = () => {
  const drizzleUsersRepository = new DrizzleUsersRepository();
  const useCase = new RegisterUserUseCase(drizzleUsersRepository);

  return useCase;
};
