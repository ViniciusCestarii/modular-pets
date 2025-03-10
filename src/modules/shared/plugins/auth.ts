import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import fs from "fs";
import { env } from "@/env";

const privateKey = fs.readFileSync(env.PRIVATE_TOKEN_KEY_PATH, "utf8");

if (!privateKey) {
  throw new Error("Private key not found");
}

const auth = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: privateKey,
      exp: "1d",
      alg: "ES256",
    }),
  )
  .as("plugin");

export default auth;
