import { BaseError } from "@/utils/base-error";

export class PetNotFoundError extends BaseError {
  constructor() {
    super("Pet not found");
    this.name = "PetNotFoundError";
  }
}
