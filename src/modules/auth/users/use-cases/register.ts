import { UserAlreadyExistsError } from "../error/user-already-exists.ts";
import { UsersRepository } from "../repository";
import { CreateUser, UserRegisterReturn } from "../types";
import { hashPassword } from "../utils/password.js";

export class RegisterUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(user: CreateUser): Promise<UserRegisterReturn> {
    const userExists = await this.usersRepository.findUserByEmail(user.email);

    if (userExists) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = hashPassword(user.password);

    user.password = hashedPassword;

    const createdUser = await this.usersRepository.createUser(user);

    const token = "implement token generation here";

    return { user: createdUser, token };
  }
}
