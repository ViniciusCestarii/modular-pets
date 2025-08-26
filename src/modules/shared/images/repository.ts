import { Image, Owner } from "./types";

export interface ImagesRepository {
  getImageById(
    ownerType: Owner["ownerType"],
    id: string,
  ): Promise<Image | null>;
  uploadImage(owner: Owner, image: File): Promise<Image>;
  deleteImage(ownerType: Owner["ownerType"], id: string): Promise<void>;
}
