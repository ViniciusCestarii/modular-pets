import { BaseError } from "@/utils/base-error";

export class SpecieAlreadyExistsError extends BaseError {
  constructor() {
    super("Specie already exists");
    this.name = "SpecieAlreadyExistsError";
  }
}
