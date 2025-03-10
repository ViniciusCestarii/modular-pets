import { DrizzleUsersRepository } from "../repositories/drizzle-repository";
import { LoginUserUseCase } from "../use-cases/login";

export const makeLoginUserUseCase = () => {
  const drizzleUsersRepository = new DrizzleUsersRepository();
  const useCase = new LoginUserUseCase(drizzleUsersRepository);

  return useCase;
};
