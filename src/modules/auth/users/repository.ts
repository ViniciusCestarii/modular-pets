import { Pagination } from "@/modules/shared/types/pagination";
import { CreateUser, FullUser, User, UserList } from "./types";

export interface UsersRepository {
  createUser(user: CreateUser): Promise<User>;
  findUserById(id: string): Promise<User | null>;
  findUserByEmail(email: string): Promise<User | null>;
  findFullUserByEmail(email: string): Promise<FullUser | null>;
  listUsers(filter: Pagination): Promise<UserList>;
}
