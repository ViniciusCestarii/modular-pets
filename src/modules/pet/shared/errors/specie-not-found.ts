export class SpecieNotFoundError extends Error {
  constructor() {
    super("Specie not found");
    this.name = "SpecieNotFoundError";
  }
}
