import { Pagination } from "@/modules/shared/types/pagination";
import { UsersRepository } from "../repository";
import { CreateUser, User, UserList } from "../types";
import { v7 } from "uuid";

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async createUser(user: CreateUser): Promise<User> {
    const newUser: User = {
      id: v7(),
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async listUsers({ page, pageSize }: Pagination): Promise<UserList> {
    page--;
    const start = page * pageSize;
    const end = start + pageSize;
    const paginatedUsers = this.users.slice(start, end);

    return { users: paginatedUsers, total: this.users.length };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null;
  }
}
