import { Image, Owner } from "./types";

export interface ImagesRepository {
  uploadImage(owner: Owner, image: File): Promise<Image>;
  deleteImage(ownerType: Owner["ownerType"], id: string): Promise<void>;
}
