export class SpecieAlreadyExistsError extends Error {
  constructor() {
    super("Specie already exists");
    this.name = "SpecieAlreadyExistsError";
  }
}
