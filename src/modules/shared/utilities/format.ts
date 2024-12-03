export function normalizeName(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/\s+/g, " ") // Normalize multiple spaces to a single space
    .replace(/[^a-zA-Z0-9\s]/g, ""); // Remove non-alphanumeric characters
}
