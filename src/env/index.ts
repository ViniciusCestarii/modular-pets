import "dotenv/config";
import { Type as t } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const envSchema = t.Object({
  PORT: t.String({ default: "3333" }),
  DATABASE_URL: t.String({ format: "uri" }),
  PUBLIC_TOKEN_KEY_PATH: t.String({ default: "token-public.pem" }),
  PRIVATE_TOKEN_KEY_PATH: t.String({ default: "token-private.pem" }),
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
