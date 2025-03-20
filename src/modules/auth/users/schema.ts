import { t, TSchema } from "elysia";
import { UserAlreadyExistsError } from "./error/user-already-exists";
import { InvalidCredentialsError } from "./error/invalid-credentials";
import { createSelectSchema } from "drizzle-typebox";
import { usersTable } from "./user";

const passwordSchema = t.String({ minLength: 8 });

export const createUserSchema = t.Object({
  email: t.String({ format: "email" }),
  password: passwordSchema,
  name: t.String({ minLength: 1, maxLength: 255 }),
  birthdate: t.String({ format: "date" }),
});

export const listUsersSchema = t.Object({
  page: t.Integer({ minimum: 1 }),
  pageSize: t.Integer({ minimum: 1, maximum: 100, default: 10 }),
});

export const loginSchema = t.Object({
  email: t.String({ format: "email" }),
  password: passwordSchema,
});

const baseUserSchema = createSelectSchema(usersTable);

export const swaggerUserViewSchema = t.Object(
  Object.entries(baseUserSchema.properties).reduce<Record<string, TSchema>>(
    (acc, [key, value]) => {
      if (key === "password") return acc;
      acc[key] = value;
      return acc;
    },
    {},
  ),
);

export const swaggerUserAlreadyExistsErrorSchema = t.Object({
  name: t.Literal(UserAlreadyExistsError.name),
  message: t.Literal(new UserAlreadyExistsError().message),
});

export const swaggerInvalidCredentialsErrorSchema = t.Object({
  name: t.Literal(InvalidCredentialsError.name),
  message: t.Literal(new InvalidCredentialsError().message),
});

export const swaggerUnauthorizedSchema = t.Object({
  name: t.Literal("Unauthorized"),
  message: t.Literal("Unauthorized"),
});
