import { BaseError } from "@/modules/shared/utilities/base-error";

export class SpecieAlreadyExistsError extends BaseError {
  constructor() {
    super("Specie already exists");
    this.name = "SpecieAlreadyExistsError";
  }
}
