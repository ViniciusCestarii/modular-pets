import fs from "fs";
import { env } from "@/env";
import * as jose from "jose";

const algorithm = "ES256";
export const tokenExpirationTime = 60 * 60; // 1 hour in seconds

const privateKey = fs.readFileSync(env.PRIVATE_TOKEN_KEY_PATH, "utf8");

if (!privateKey) {
  throw new Error("Private key not found");
}

const ecPrivateKey = await jose.importPKCS8(privateKey, algorithm);

const publicKey = fs.readFileSync(env.PUBLIC_TOKEN_KEY_PATH, "utf8");

if (!publicKey) {
  throw new Error("Public key not found");
}

const ecPublicKey = await jose.importSPKI(publicKey, algorithm);

export const verifyToken = async (token: string) => {
  try {
    return await jose.jwtVerify(token, ecPublicKey);
  } catch {
    return null;
  }
};

export type TokenPayload = {
  id: string;
  email: string;
};

export const signToken = async (payload: TokenPayload) => {
  const seconds = new Date().getTime() / 1000;
  const jwt = await new jose.SignJWT({
    ...payload,
    sub: payload.id,
  })
    .setProtectedHeader({ alg: algorithm, typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(seconds + tokenExpirationTime)
    .sign(ecPrivateKey);

  return jwt;
};
