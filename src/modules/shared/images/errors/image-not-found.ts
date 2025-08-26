import { BaseError } from "@/utils/base-error";

export class ImageNotFoundError extends BaseError {
  constructor() {
    super("Image not found");
    this.name = "ImageNotFoundError";
  }
}
