import { env } from "@/env";
import { s3Env } from "@/env/s3-env";
import { S3Client } from "bun";

const s3 = new S3Client({
  accessKeyId: s3Env.S3_ACCESS_KEY_ID,
  secretAccessKey: s3Env.S3_SECRET_ACCESS_KEY,
  bucket: s3Env.S3_BUCKET_NAME,
  endpoint: s3Env.S3_ENDPOINT,
});

if (env.IMAGE_STORAGE === "s3" && s3Env) {
  console.log("Using S3");
}

export default s3;
