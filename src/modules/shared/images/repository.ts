import { Image, Owner } from "./types";

export interface ImagesRepository {
  uploadImage(owner: Owner, image: File): Promise<Image>;
  deleteImage(id: string): Promise<void>;
}
