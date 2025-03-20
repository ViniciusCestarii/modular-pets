import { BaseError } from "@/utils/base-error";

export class InvalidBreedSpecieError extends BaseError {
  constructor() {
    super("Breed does not belong to the specified specie");
    this.name = "InvalidBreedSpecieError";
  }
}
