export class BreedNotFoundError extends Error {
  constructor() {
    super("Breed not found");
    this.name = "BreedNotFoundError";
  }
}
