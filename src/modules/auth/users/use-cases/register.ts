import { signToken } from "@/utils/auth/jwt";
import { UserAlreadyExistsError } from "../error/user-already-exists";
import { UsersRepository } from "../repository";
import { CreateUser, UserRegisterReturn } from "../types";
import { hashPassword } from "../utils/password";

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

    const token = await signToken({
      id: createdUser.id,
      email: createdUser.email,
    });

    return { user: createdUser, token };
  }
}
