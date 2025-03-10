import db from "@/db";
import { CreateUser, User } from "../types";
import { UsersRepository } from "../repository";
import { usersTable } from "../user";
import { eq, sql } from "drizzle-orm";
import { Pagination } from "@/modules/shared/types/pagination";

const userViewModel = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  birthdate: usersTable.birthdate,
};

export class DrizzleUsersRepository implements UsersRepository {
  async createUser(user: CreateUser): Promise<User> {
    const rows = await db
      .insert(usersTable)
      .values(user)
      .returning(userViewModel);

    const createdUser = rows[0];

    return createdUser;
  }
  async findUserById(id: string): Promise<User | null> {
    const rows = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const rows = await db
      .select(userViewModel)
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (rows.length === 0) {
      return null;
    }

    return rows[0];
  }

  async listUsers({
    page,
    pageSize,
  }: Pagination): Promise<{ users: User[]; total: number }> {
    page--;

    const usersQuery = db
      .select(userViewModel)
      .from(usersTable)
      .orderBy(usersTable.name)
      .limit(pageSize)
      .offset(page * pageSize);

    const totalQuery = db
      .select({ count: sql`count(*)`.mapWith(Number) })
      .from(usersTable);

    const [users, [{ count: total }]] = await Promise.all([
      usersQuery,
      totalQuery,
    ]);

    return { users, total };
  }
}
