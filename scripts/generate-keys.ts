import { generateKeyPairSync } from "crypto";

const { privateKey, publicKey } = generateKeyPairSync("ec", {
  namedCurve: "P-256",
});

console.log(privateKey.export({ type: "pkcs8", format: "pem" }));
console.log(publicKey.export({ type: "spki", format: "pem" }));
