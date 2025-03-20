import { signToken } from "@/utils/auth/jwt";
import { InvalidCredentialsError } from "../error/invalid-credentials";
import { UsersRepository } from "../repository";
import { Login } from "../types";
import { comparePassword } from "../utils/password";

export class LoginUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(login: Login): Promise<string> {
    const user = await this.usersRepository.findFullUserByEmail(login.email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const validPassword = comparePassword(login.password, user.password);

    if (!validPassword) {
      throw new InvalidCredentialsError();
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
    });

    return token;
  }
}
