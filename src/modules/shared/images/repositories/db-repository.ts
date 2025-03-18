import db from "@/db";
import { ImagesRepository } from "../repository";
import { Image, Owner } from "../types";
import { imagesTable } from "../image";
import fileToBase64 from "../utils/file-to-base64";
import { eq } from "drizzle-orm";

export class DbRepository implements ImagesRepository {
  async uploadImage(owner: Owner, file: File): Promise<Image> {
    const base64 = await fileToBase64(file);
    const url = `data:${file.type};base64,${base64}`;
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

  async deleteImage(id: string): Promise<void> {
    await db.delete(imagesTable).where(eq(imagesTable.id, id));
  }
}
