import { env } from "@/env";
import { DbImagesRepository } from "@/modules/shared/images/repositories/db-repository";
import { S3ImagesRepository } from "../repositories/s3-repository";

export const makeImageRespository = () => {
  if (env.IMAGE_STORAGE === "s3") {
    return new S3ImagesRepository();
  }
  return new DbImagesRepository();
};
