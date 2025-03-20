import { BaseError } from "@/utils/base-error";

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super("User already exists");
    this.name = "UserAlreadyExistsError";
  }
}
