import { BaseError } from "@/modules/shared/utilities/base-error";

export class BreedAlreadyExistsError extends BaseError {
  constructor() {
    super("Breed already exists");
    this.name = "BreedAlreadyExistsError";
  }
}
