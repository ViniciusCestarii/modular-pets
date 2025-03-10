import { Static } from "elysia";
import { InferSelectModel } from "drizzle-orm";
import { usersTable } from "./user";
import { createUserSchema } from "./schema";

export type FullUser = InferSelectModel<typeof usersTable>;

export type User = Omit<FullUser, "password">;

export type UserList = {
  users: User[];
  total: number;
};

export type UserRegisterReturn = {
  user: User;
  token: string;
};

export type CreateUser = Static<typeof createUserSchema>;
