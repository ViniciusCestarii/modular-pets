import { BaseError } from "@/modules/shared/utilities/base-error";

export class UserAlreadyExistsError extends BaseError {
  constructor() {
    super("User already exists");
    this.name = "UserAlreadyExistsError";
  }
}
