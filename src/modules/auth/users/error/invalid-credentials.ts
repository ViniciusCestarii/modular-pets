import { BaseError } from "@/modules/shared/utilities/base-error";

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}
