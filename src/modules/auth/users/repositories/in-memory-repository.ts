import { Pagination } from "@/modules/shared/types/pagination";
import { UsersRepository } from "../repository";
import { CreateUser, FullUser, User, UserList } from "../types";
import { v7 } from "uuid";

export class InMemoryUsersRepository implements UsersRepository {
  private users: FullUser[] = [];

  async createUser(user: CreateUser): Promise<User> {
    const newUser: FullUser = {
      id: v7(),
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  async findUserById(id: string): Promise<User | null> {
    const fullUser = this.users.find((user) => user.id === id);
    if (!fullUser) {
      return null;
    }

    const user = { ...fullUser, password: undefined };

    return user;
  }

  async listUsers({ page, pageSize }: Pagination): Promise<UserList> {
    page--;
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedUsers = this.users.slice(start, end);

    return { users: paginatedUsers, total: this.users.length };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const fullUser = this.users.find((user) => user.email === email);
    if (!fullUser) {
      return null;
    }

    const user = { ...fullUser, password: undefined };

    return user;
  }

  async findFullUserByEmail(email: string): Promise<FullUser | null> {
    const fullUser = this.users.find((user) => user.email === email);
    if (!fullUser) {
      return null;
    }

    return fullUser;
  }
}
