import { BaseError } from "@/modules/shared/utilities/base-error";

export class BreedNotFoundError extends BaseError {
  constructor() {
    super("Breed not found");
    this.name = "BreedNotFoundError";
  }
}
