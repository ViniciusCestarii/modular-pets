import db from "@/db";
import { ImagesRepository } from "../repository";
import { Image, Owner } from "../types";
import { imagesTable } from "../image";
import { eq } from "drizzle-orm";
import s3 from "@/s3";
import { v7 } from "uuid";
import { s3Env } from "@/env/s3-env";

export class S3ImagesRepository implements ImagesRepository {
  async uploadImage(owner: Owner, file: File): Promise<Image> {
    const id = v7();
    const fileExtension = file.name.split(".").pop();
    const path = `${owner.ownerType}/${id}.${fileExtension}`;

    await s3.write(path, file);

    const src = s3Env.S3_PUBLIC_ENDPOINT + "/" + path;

    const rows = await db
      .insert(imagesTable)
      .values({
        ...owner,
        id,
        src,
      })
      .returning();

    const image = rows[0];

    return image;
  }

  async deleteImage(ownerType: Owner["ownerType"], id: string): Promise<void> {
    const path = `${ownerType}/${id}`;
    await s3.delete(path);
    await db.delete(imagesTable).where(eq(imagesTable.id, id));
  }
}
