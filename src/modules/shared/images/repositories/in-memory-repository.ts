import { ImagesRepository } from "../repository";
import { Image, Owner } from "../types";

export class InMemoryImagesRepository implements ImagesRepository {
  private images: Image[] = [];

  async uploadImage(owner: Owner, file: File): Promise<Image> {
    const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
    const url = `data:${file.type};base64,${base64}`;
    const newImage = {
      ...owner,
      src: url,
      id: this.images.length.toString(),
    };
    this.images.push(newImage);
    return newImage;
  }
  async deleteImage(_: Owner["ownerType"], id: string): Promise<void> {
    this.images = this.images.filter((image) => image.id !== id);
  }
}
