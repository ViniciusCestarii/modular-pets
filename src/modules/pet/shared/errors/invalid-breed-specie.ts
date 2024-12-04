export class InvalidBreedSpecieError extends Error {
  constructor() {
    super("Breed does not belong to the specified specie");
    this.name = "InvalidBreedSpecieError";
  }
}
