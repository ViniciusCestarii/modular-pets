export class BreedAlreadyExistsError extends Error {
  constructor() {
    super("Breed already exists");
  }
}
