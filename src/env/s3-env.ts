import "dotenv/config";
import { t } from "elysia";
import { Value } from "@sinclair/typebox/value";
import { env } from ".";

const s3EnvSchema = t.Object({
  S3_SECRET_ACCESS_KEY: t.String(),
  S3_ACCESS_KEY_ID: t.String(),
  S3_BUCKET_NAME: t.String(),
  S3_ENDPOINT: t.String(),
  S3_PUBLIC_ENDPOINT: t.String(),
});

const optionalS3EnvSchema = t.Object({
  S3_SECRET_ACCESS_KEY: t.Optional(t.String()),
  S3_ACCESS_KEY_ID: t.Optional(t.String()),
  S3_BUCKET_NAME: t.Optional(t.String()),
  S3_ENDPOINT: t.Optional(t.String()),
  S3_PUBLIC_ENDPOINT: t.Optional(t.String()),
});

const schema = env.IMAGE_STORAGE === "s3" ? s3EnvSchema : optionalS3EnvSchema;

const parsedEnv = Value.Decode(schema, Value.Default(schema, process.env));

if (
  Object.values(parsedEnv).some((v) => v === undefined) &&
  env.IMAGE_STORAGE === "s3"
) {
  console.error(
    "Invalid s3 environment variables",
    Value.Errors(s3EnvSchema, process.env),
  );
  throw new Error("Invalid s3 environment variables");
}

export const s3Env = parsedEnv;
