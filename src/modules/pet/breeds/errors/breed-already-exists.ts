import { BaseError } from "@/utils/base-error";

export class BreedAlreadyExistsError extends BaseError {
  constructor() {
    super("Breed already exists");
    this.name = "BreedAlreadyExistsError";
  }
}
