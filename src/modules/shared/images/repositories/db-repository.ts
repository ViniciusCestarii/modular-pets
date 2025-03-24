import db from "@/db";
import { ImagesRepository } from "../repository";
import { Image, Owner } from "../types";
import { imagesTable } from "../image";
import { eq } from "drizzle-orm";
import { fileToBase64Url } from "@/utils/transform";

export class DbImagesRepository implements ImagesRepository {
  async uploadImage(owner: Owner, file: File): Promise<Image> {
    const url = await fileToBase64Url(file);

    const rows = await db
      .insert(imagesTable)
      .values({
        ...owner,
        src: url,
      })
      .returning();

    const image = rows[0];

    return image;
  }

  async deleteImage(ownerType: Owner["ownerType"], id: string): Promise<void> {
    await db.delete(imagesTable).where(eq(imagesTable.id, id));
  }
}
