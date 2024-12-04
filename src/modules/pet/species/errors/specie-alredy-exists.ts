export class SpecieAlredyExistsError extends Error {
  constructor() {
    super("Specie already exists");
    this.name = "SpecieAlredyExistsError";
  }
}
