import { BaseError } from "@/modules/shared/utilities/base-error";

export class SpecieNotFoundError extends BaseError {
  constructor() {
    super("Specie not found");
    this.name = "SpecieNotFoundError";
  }
}
