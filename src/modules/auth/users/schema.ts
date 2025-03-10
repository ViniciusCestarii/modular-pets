import { t } from "elysia";

export const createUserSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  name: t.String({ minLength: 1, maxLength: 255 }),
  birthdate: t.String({ format: "date" }),
});

export const listUsersSchema = t.Object({
  page: t.Integer({ minimum: 1 }),
  pageSize: t.Integer({ minimum: 1, maximum: 100, default: 10 }),
});
