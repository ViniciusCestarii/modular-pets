import { resetDb } from "@/modules/shared/utilities/test";

await resetDb();

console.log("Database cleaned successfully");
