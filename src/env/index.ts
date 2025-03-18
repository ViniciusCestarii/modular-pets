import "dotenv/config";
import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
  PORT: t.String({ default: "3333" }),
  DATABASE_URL: t.String({ format: "uri" }),
  PUBLIC_TOKEN_KEY_PATH: t.String(),
  PRIVATE_TOKEN_KEY_PATH: t.String(),
  AXIOM_DATASET: t.Optional(t.String()),
  AXIOM_TOKEN: t.Optional(t.String()),
});

const parsedEnv = Value.Decode(
  envSchema,
  Value.Default(envSchema, process.env),
);

if (!parsedEnv) {
  console.error(
    "Invalid environment variables",
    Value.Errors(envSchema, process.env),
  );
  throw new Error("Invalid environment variables");
}

export const env = parsedEnv;
