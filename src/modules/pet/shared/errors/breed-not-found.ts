import { BaseError } from "@/utils/base-error";

export class BreedNotFoundError extends BaseError {
  constructor() {
    super("Breed not found");
    this.name = "BreedNotFoundError";
  }
}
