import { BaseError } from "@/utils/base-error";

export class InvalidCredentialsError extends BaseError {
  constructor() {
    super("Invalid credentials");
    this.name = "InvalidCredentialsError";
  }
}
