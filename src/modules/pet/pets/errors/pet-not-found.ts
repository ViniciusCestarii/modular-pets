import { BaseError } from "@/modules/shared/utilities/base-error";

export class PetNotFoundError extends BaseError {
  constructor() {
    super("Pet not found");
    this.name = "PetNotFoundError";
  }
}
